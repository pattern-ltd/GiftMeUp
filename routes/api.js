var graph = require('fbgraph');
var Q = require('q');

var service = require("../scripts/amazonService");
var client = service.initialize("AKIAI7ALH67LC44E4CRQ", "BlYn/vpyKDWhRduBU27UhH902kW0WpIU4FGdX5ba", "associateTag");

var suggestionsCore = require("../scripts/suggestions");
var core = suggestionsCore.initialize(client, graph);

/*
* Returns list with all facebook friends using the app.
*/
exports.getFacebookFriends = function (req, res) {
    var token = req.query.token;

    var query = "SELECT name, uid FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = me())";

    graph.fql(query, { access_token: token }, function (err, result) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result.data));
        return;
    });

    return;
};

/*
* Searches in the facebook graph.
*/
exports.facebookSearch = function (req, res) {
    var token = req.query.token;
    var query = req.query.query;
    var type = req.query.type;

    graph.search({ q: query,
        type: type,
        access_token: token,
        fields: "id,name,picture"
    }, function (err, result) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result.data));
        return;
    });
};


/*
* Searches for amazon items base on keywords from facebook likes or entered from the user.
*/
exports.suggest = function (req, res) {
    var userId = req.query.userId;
    var interests = encodeURIComponent(req.query.interests);
    var maxPrice = req.query.maxPrice;
    var token = req.query.token;

    Q.fcall(function () {
        var deferred = Q.defer();
        graph.get(userId + '/likes', {
            access_token: token
        },
          function (err, result) {
              deferred.resolve(result.data);
          });

        return deferred.promise;
    })
    .then(function (likes) {
        if (likes.length > 0) {
            var grouped = core.groupLikesByCategory(likes);
            return recent = core.recentFromMostLikedCategory(grouped);
        }
        else {
            return null;
        }
    })
    .then(function (recent) {
        if (recent) {
            client.searchItems({ SearchIndex: "Blended",
                Keywords: recent.name,
                MaximumPrice: maxPrice,
                ResponseGroup: "Small,Images,EditorialReview"
            }, function (err, result) {
                return result.Items;
            });
        }
        else {
            return [];
        }

    })
    .then(function (items) {
        if (items && items.length > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result));
        }

        client.searchItems({ SearchIndex: "Blended",
            Keywords: interests,
            MaximumPrice: maxPrice,
            ResponseGroup: "Small,Images,EditorialReview"
        }, function (err, result) {
            if (result.Items.Item) {
                var items = result.Items.Item.slice(0, 10);
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(items));
        });
    });
};


/*
* Returns similar amazon items
*/
exports.similarAmazonItems = function (req, res) {
    var itemId = req.query.itemId;

    client.getSimilarItems({
        ItemId: itemId,
        ResponseGroup: "Small,Images,EditorialReview"
    }, function (err, result) {
        if (result.Items.Item) {
            var items = result.Items.Item.slice(0, 10);
        }

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(items));
    });
};