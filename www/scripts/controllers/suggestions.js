define(["controllers/module"], function (controllers) {
    controllers.controller("SuggestionsCtrl", ["$scope", "$stateParams", "FacebookService", "WebSocketService",
        function ($scope, $stateParams, facebookService, webSocketService) {
            webSocketService.on("newSuggestions", function (result) {
                $scope.$apply(function(){
                    $scope.suggestions = result;
                });
            });

            $scope.suggest = function () {
                facebookService.getAccessToken()
                .then(function (token) {
                    var data = {
                        userId: $stateParams.id,
                        interests: $scope.interests,
                        maxPrice: $scope.maxPrice,
                        token: token
                    };

                    webSocketService.send("suggest", data);
                });
            }

            $scope.similar = function (item) {
                facebookService.similar(item.ASIN)
                .then(function (result) {
                    $scope.similarItems = result;
                });
            }
        } ]);
});