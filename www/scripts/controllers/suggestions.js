define(["controllers/module"], function (controllers) {
    controllers.controller("SuggestionsCtrl", ["$scope", "$stateParams", "FacebookService",
        function ($scope, $stateParams, facebookService) {
            $scope.suggest = function () {
                var id = $stateParams.id;

                facebookService.suggest(id)
                .then(function(result){
                    
                });
            }
        } ]);
});