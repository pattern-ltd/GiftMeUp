require.config({
    paths: {
        angular: "../bower_components/angular/angular.min",
        uiRouter: "../vendor/angular-ui-router/angular-ui-router.min",
        ngRoute: "../bower_components/angular-route/angular-route.min",
        ngSanitize: "../bower_components/angular-sanitize/angular-sanitize.min",
        ngCookies: "../bower_components/angular-cookies/angular-cookies.min",
        jquery: "../bower_components/jquery/dist/jquery.min",
        bootstrap: "../bower_components/bootstrap/dist/js/bootstrap.min",
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