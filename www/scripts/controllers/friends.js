define(["controllers/module"], function(controllers){
    controllers.controller("FriendsCtrl", ["$scope",
        function($scope){
            $scope.friends = [{Name: "Gosho"}, {Name:"Tosho"}, {Name: "Kalin"}];
        }]);
});