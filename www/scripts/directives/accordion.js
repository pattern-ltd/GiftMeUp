define(["directives/module"], function (directives) {
    directives.directive("accordion", function () {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            templateUrl: 'templates/accordion.html',
            controller: function ($scope, $element, $transclude) {
                var collapsibles = [];
                var currentRegistrationIndex = 0;
                var currentStep = 0;

                this.getElement = function () {
                    return $element;
                };

                this.addCollapsible = function (collapsible) {
                    collapsible.index = currentRegistrationIndex;

                    if (currentRegistrationIndex == 0) {
                        collapsible.active = true;
                        collapsible.toggle();
                    }

                    collapsibles.push(collapsible);
                    currentRegistrationIndex += 1;
                };

                //collapse the current view and expand the next
                this.next = function () {
                    var collapsible = collapsibles[currentStep];
                    collapsible.toggle();

                    var nextIndex = collapsible.index + 1;
                    var next = collapsibles[nextIndex];

                    if (next) {
                        next.active = true;
                        next.toggle();

                        currentStep += 1;
                    }
                };

                //Change the view from scope
                var that = this;
                $scope.nextStep = function () {
                    that.next();
                };

                var controller = this;
                $transclude($scope, function (clone) {
                    //the controller is stored in the elements that wil be transcluded
                    clone.data('$accordionController', controller);
                    $element.append(clone);
                });
            }
        };
    });
});