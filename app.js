
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var graph = require('fbgraph');
var Q = require('q');

var service = require("./scripts/amazonService");
var client = service.initialize("AKIAI7ALH67LC44E4CRQ", "BlYn/vpyKDWhRduBU27UhH902kW0WpIU4FGdX5ba", "associateTag");

var suggestionsCore = require("./scripts/suggestions");
var core = suggestionsCore.initialize(client, graph);

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'www')));

//Ensure that all url are redirected to index.html/#![path].
//This will allow Angular to handle all url paths in Html5 mode and fallback to hashbang mode if needed.
app.use(function(req, res){
    return res.redirect(req.protocol + '://' + req.get('Host') + '/#!' + req.url);
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get("/api/amazon/test", function (req, res) {
    var service = require("./scripts/amazonService");
    var client = service.initialize("key", "secretKey", "associateTag");
    client.searchItems({ SearchIndex: "Books", Keywords: "Javascript" }, function (err, result) {
        var body = err || result;

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(body));
        return;
    });

    return;
});

app.get("/api/facebook/friends", function (req, res) {
    var token = req.query.token;

    var query = "SELECT name, uid FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = me())";

    graph.fql(query, { access_token: token }, function (err, result) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result.data));
        return;
    });

    return;
});

app.get('/api/facebook/search', function (req, res) {
    var token = req.query.token;
    var query = req.query.query;
    var type = req.query.type;

    graph.search({q: query, type: type, access_token: token, fields: "id,name,picture"}, function(err, result){
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result.data));
        return;
    });
});

app.get('/api/suggest', function (req, res) {
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
});

app.get('/api/similar', function (req, res) {
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
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
