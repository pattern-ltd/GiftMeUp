
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var graph = require('fbgraph');
var q = require('q');

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
    //var userId = req.query.userId;
    var userId = 1303989751;
    var interest = req.query.interest;
    var token = req.query.token;

    var query = "SELECT name FROM page WHERE page_id IN (SELECT page_id FROM page_fan WHERE uid = " + userId + ")";

    graph.fql(query, { access_token: token }, function (err, result) {
        var likes = result.data;
        var grouped = {
            categories: [],
            maxCount: 0
        };

        for (var i = 0; i < likes.length; i++) {
            var like = likes[i];

            if (!grouped.categories[like.category]) {
                grouped.categories[like.category] = [];
            }

            var group = grouped.categories[like.category];
            group.push(like);

            if (group.length > grouped.maxCount) {
                grouped.mostLiked = like.category;
                grouped.maxCount = group.length;
            }
        }

        var service = require("./scripts/amazonService");
        var client = service.initialize("AKIAI7ALH67LC44E4CRQ", "BlYn/vpyKDWhRduBU27UhH902kW0WpIU4FGdX5ba", "associateTag");

        var mostLikedCategory = grouped.categories[grouped.mostLiked];
        var recent = mostLikedCategory[0];
        for (var i = 1; i < mostLikedCategory.length; i++) {
            var current = mostLikedCategory[i];
            if (new Date(current.created_time) > new Date(recent.created_time)) {
                recent = current;
            }
        }

        client.searchItems({ SearchIndex: "Blended", Keywords: recent.name }, function (err, result) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result));
            return;
        });
    });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
