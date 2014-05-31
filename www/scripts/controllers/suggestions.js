define(["controllers/module"], function (controllers) {
    controllers.controller("SuggestionsCtrl", ["$scope", "$rootScope", "$stateParams", "FacebookService", "WebSocketService",
        function ($scope, $rootScope, $stateParams, facebookService, webSocketService) {
            webSocketService.on("newSuggestions", function (result) {
                $scope.$apply(function () {
                    $scope.suggestions = result;
                    $scope.suggestingItems = false;
                });
            });

            $rootScope.$on("suggestingStart", function () {
                $scope.suggestingItems = true;
            });

            $scope.similar = function (item) {
                $scope.suggestingItems = true;

                facebookService.similar(item.ASIN)
                .then(function (result) {
                    $scope.suggestions = result;
                    $scope.suggestingItems = false;
                });
            }
        } ]);
});