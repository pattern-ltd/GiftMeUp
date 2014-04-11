define(["angular", "controllers/loader", "ngRoute", "uiRouter"],
    function (angular) {
     var module = angular.module('giftMeUp', ['giftMeUp.controllers', 'ngRoute', 'ui.router'])
      .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
             $urlRouterProvider.otherwise("/");

             $stateProvider
                 .state("friends", {
                     url: "/",
                     templateUrl: "views/friends.html",
                     controller: "FriendsCtrl"
                 })
                 .state("login", {
                     url: "/login",
                     template: "<h1>Login page</h1>"
                 });

             // use the HTML5 History API
             $locationProvider.html5Mode(true).hashPrefix('!');
      });

    return module;
 });


