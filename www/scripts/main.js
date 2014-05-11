require.config({
    paths: {
        angular: "../bower_components/angular/angular",
        uiRouter: "../vendor/angular-ui-router/angular-ui-router",
        ngRoute: "../bower_components/angular-route/angular-route",
        ngSanitize: "../bower_components/angular-sanitize/angular-sanitize",
        ngCookies: "../bower_components/angular-cookies/angular-cookies",
        jquery: "../bower_components/jquery/dist/jquery",
        bootstrap: "../bower_components/bootstrap/dist/js/bootstrap",
        domReady: "../bower_components/requirejs-domready/domReady",
        facebook: "//connect.facebook.net/en_US/all",
        io: "/socket.io/socket.io"
    },
    shim: {
        angular: {
            deps: ["jquery"],
            exports: "angular"
        },
        ngSanitize: {
            deps: ["angular"]
        },
        ngCookies: {
            deps: ["angular"]
        },
        ngRoute: {
            deps: ["angular"]
        },
        uiRouter: {
            deps: ["angular"]
        },

        facebook: {
            exports: "FB"
        },

        io: {
            exports: "io"
        }
    }
});

require(["domReady", "angular", "app"],
 function (domReady, angular, app) {
     domReady(function () {
         //the required 'app' file initializes the 'giftMeUp' module
         angular.bootstrap(document, ['giftMeUp']);
     });
 });