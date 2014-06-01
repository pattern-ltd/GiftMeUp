define(["angular", "controllers/loader", "services/loader", "directives/loader", "ngRoute", "ngSanitize", "uiRouter"],
    function (angular) {
        var module = angular.module('giftMeUp', ['giftMeUp.controllers', 'giftMeUp.services', 'giftMeUp.directives', 'ngRoute', 'ngSanitize', 'ui.router'])
      .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
          $urlRouterProvider.otherwise("/");

          $stateProvider
                 .state("friends", {
                     url: "/",
                     templateUrl: "views/gifts.html"
                 });

          // use the HTML5 History API
          $locationProvider.html5Mode(true).hashPrefix('!');
      });

        return module;
    });


