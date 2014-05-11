var graph = require('fbgraph');
var Q = require('q');

var service = require("../scripts/amazonService");
var client = service.initialize("AKIAI7ALH67LC44E4CRQ", "BlYn/vpyKDWhRduBU27UhH902kW0WpIU4FGdX5ba", "associateTag");

var suggestionsCore = require("../scripts/suggestions");
var core = suggestionsCore.initialize(client, graph);

exports.suggest = function (data, socket) {
    var userId = data.userId;
    var interests = encodeURIComponent(data.interests);
    var maxPrice = data.maxPrice;
    var token = data.token;

    Q.fcall(function () {
        //Get likes
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
        //Get most recent like from most liked category
        if (likes.length > 0) {
            var grouped = core.groupLikesByCategory(likes);
            return recent = core.recentFromMostLikedCategory(grouped);
        }
        else {
            return null;
        }
    })
    .then(function (recent) {
        //Searches in amazon with the keyword from facebook
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
        //Return suggestions
        if (items && items.length > 0) {
            socket.emit("newSuggestions", items);
        }

        //search for new ones
        client.searchItems({ SearchIndex: "Blended",
            Keywords: interests,
            MaximumPrice: maxPrice,
            ResponseGroup: "Small,Images,EditorialReview"
        }, function (err, result) {
            if (result.Items.Item) {
                var items = result.Items.Item.slice(0, 10);
                socket.emit("newSuggestions", items);
            }
        });
    });
}