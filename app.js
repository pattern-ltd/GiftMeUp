
/**
 * Module dependencies.
 */

var express = require('express');
var favicon = require('static-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var errorHandler = require('errorhandler');

var api = require('./routes/api');
var path = require('path');
var graph = require('fbgraph');
var Q = require('q');

var webSocketApi = require('./scripts/webSocketApi');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon());
app.use(logger('dev'));
app.use(methodOverride());
app.use(cookieParser('your secret here'));
app.use(session());

// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

app.get("/api/facebook/friends", api.getFacebookFriends);

app.get('/api/facebook/search', api.facebookSearch);

app.get('/api/amazon/similar', api.similarAmazonItems);

app.use(express.static(path.join(__dirname, 'www')));

//Ensure that all url are redirected to index.html/#![path].
//This will allow Angular to handle all url paths in Html5 mode and fallback to hashbang mode if needed.
app.use(function(req, res){
    return res.redirect(req.protocol + '://' + req.get('Host') + '/#!' + req.url);
});

var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

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
