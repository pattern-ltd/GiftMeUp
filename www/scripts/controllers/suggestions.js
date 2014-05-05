define(["controllers/module"], function (controllers) {
    controllers.controller("SuggestionsCtrl", ["$scope", "$stateParams", "FacebookService",
        function ($scope, $stateParams, facebookService) {
            $scope.suggest = function () {
                var id = $stateParams.id;
                var interests = $scope.interests;

                facebookService.suggest(id, interests)
                .then(function (result) {
                    $scope.suggestions = result;
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