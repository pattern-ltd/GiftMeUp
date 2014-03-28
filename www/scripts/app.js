define(["angular", "controllers/loader", "ngRoute", "uiRouter"],
 function (angular) {
     var module = angular.module('giftMeUp', ['giftMeUp.controllers', 'ngRoute', 'ui.router'])
      .config(function ($stateProvider, $urlRouterProvider) {
          $urlRouterProvider.otherwise("/");

          $stateProvider
              .state('friends', {
                  url: "/",
                  templateUrl: 'views/friends.html',
                  controller: "FriendsCtrl"
              });
      });

     return module;
 });


