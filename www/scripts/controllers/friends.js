define(["controllers/module"], function (controllers) {
    controllers.controller("FriendsCtrl", ["$scope", "$rootScope", "$state", "$stateParams", "FacebookService", "WebSocketService",
        function ($scope, $rootScope, $state, $stateParams, facebookService, webSocketService) {
            $scope.login = function () {
                facebookService.login()
                    .then(function () {
                        facebookService.getFriends();
                    })
                    .then(function (result) {
                        $scope.friends = result;
                    });
            },

            $scope.logout = function () {
                facebookService.logout();
            },

            $scope.getFriends = function () {
                facebookService.getFriends()
                .then(function (result) {
                    $scope.friends = result;
                });
            },

            $scope.searchFriends = function () {
                var searchWords = $scope.searchFriendsKeywords;

                var searchString = searchWords.replace(/\s/, '+');

                facebookService.search(searchString, "user")
                .then(function (result) {
                    $scope.friends = result;
                });
            }

            $scope.getFriendSuggestions = function (friend) {
                $scope.selectedFriendId = friend.id;
                $scope.nextStep();
            }

            $scope.suggest = function () {
                facebookService.getAccessToken()
                .then(function (token) {
                    var data = {
                        userId: $scope.selectedFriendId,
                        interests: $scope.interests,
                        maxPrice: $scope.maxPrice,
                        token: token
                    };

                    webSocketService.send("suggest", data);
                });
            }
        } ]);
});