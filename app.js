
/**
 * Module dependencies.
 */

var express = require('express');
var api = require('./routes/api');
var path = require('path');
var graph = require('fbgraph');
var Q = require('q');

var service = require("./scripts/amazonService");
var client = service.initialize("AKIAI7ALH67LC44E4CRQ", "BlYn/vpyKDWhRduBU27UhH902kW0WpIU4FGdX5ba", "associateTag");

var suggestionsCore = require("./scripts/suggestions");
var core = suggestionsCore.initialize(client, graph);

var webSocketApi = require('./scripts/webSocketApi');

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

app.get("/api/facebook/friends", api.getFacebookFriends);

app.get('/api/facebook/search', api.facebookSearch);

app.get('/api/amazon/similar', api.similarAmazonItems);

var http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server)

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
})

//A new client is connected to the web socket
io.sockets.on('connection', function (socket) {
    socket.on('suggest', function (data) {
        webSocketApi.suggest(data, socket);
        return;
    });
});
