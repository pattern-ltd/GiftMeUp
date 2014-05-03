define(["angular", "controllers/loader", "services/loader", "ngRoute", "uiRouter"],
    function (angular) {
     var module = angular.module('giftMeUp', ['giftMeUp.controllers', 'giftMeUp.services', 'ngRoute', 'ui.router'])
      .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
             $urlRouterProvider.otherwise("/");

             $stateProvider
                 .state("friends", {
                     url: "/",
                     templateUrl: "views/friends.html",
                     controller: "FriendsCtrl"
                 })
                 .state("suggestions", {
                     url: "/suggest/:id",
                     templateUrl: "views/suggestions.html",
                     controller: "SuggestionsCtrl"
                 });

             // use the HTML5 History API
             $locationProvider.html5Mode(true).hashPrefix('!');
      });

    return module;
 });


