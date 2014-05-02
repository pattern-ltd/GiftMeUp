define(["controllers/module"], function (controllers) {
    controllers.controller("FriendsCtrl", ["$scope", "FacebookService",
        function ($scope, facebookService) {
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
                .then(function(result){
                    $scope.friends = result;
                });
            }
        } ]);
});