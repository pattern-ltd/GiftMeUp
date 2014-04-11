
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

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

app.get("/api/amazon/test", function(req, res){
    var service = require("./scripts/amazonService");
    var client =  service.initialize("key", "secretKey", "associateTag");
    client.searchItems({SearchIndex: "Books", Keywords: "Javascript"}, function(err, result){
        var body = err || result;

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(body));
    });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
