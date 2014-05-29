define(["controllers/module"], function (controllers) {
    controllers.controller("LoginCtrl", ["$scope", "$rootScope", "FacebookService", function ($scope, $rootScope, facebookService) {
        $scope.logged = false;

        $scope.login = function () {
            facebookService.login()
                .then(function () {
                    $rootScope.$emit("loggedIn");
                    $scope.logged = true;
                });
        },

        $scope.logout = function () {
            facebookService.logout();
            $scope.logged = false;
        },

        facebookService.getLoginStatus()
            .then(function (result) {
                if (result.status === 'connected') {
                    $rootScope.$emit("loggedIn");
                    $scope.logged = true;
                }
            });
    } ]);
});