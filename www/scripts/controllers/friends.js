define(["controllers/module"], function (controllers) {
    controllers.controller("FriendsCtrl", ["$scope", "$rootScope", "$state", "$stateParams", "FacebookService", "WebSocketService",
        function ($scope, $rootScope, $state, $stateParams, facebookService, webSocketService) {
            $scope.getFriends = function () {
                $scope.loadingFriends = true;

                facebookService.getFriends()
                .then(function (result) {
                    $scope.friends = result;
                    $scope.loadingFriends = false;
                });
            },

            $scope.searchFriends = function () {
                $scope.loadingFriends = true;

                var searchWords = $scope.searchFriendsKeywords;

                var searchString = searchWords.replace(/\s/, '+');

                facebookService.search(searchString, "user")
                .then(function (result) {
                    $scope.friends = result;
                    $scope.loadingFriends = false;
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

            $rootScope.$on("loggedIn", function () {
                $scope.getFriends();
            });
        } ]);
});