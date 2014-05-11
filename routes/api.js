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