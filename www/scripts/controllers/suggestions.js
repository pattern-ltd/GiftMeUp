define(["controllers/module"], function (controllers) {
    controllers.controller("SuggestionsCtrl", ["$scope", "$rootScope", "$stateParams", "FacebookService", "WebSocketService",
        function ($scope, $rootScope, $stateParams, facebookService, webSocketService) {
            webSocketService.on("newSuggestions", function (result) {
                $scope.$apply(function(){
                    $scope.suggestions = result;
                });
            });

            $scope.similar = function (item) {
                facebookService.similar(item.ASIN)
                .then(function (result) {
                    $scope.suggestions = result;
                });
            }
        } ]);
});