define(["directives/module", "bootstrap"], function (directives) {
    directives.directive("collapsible", function () {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            require: '^?accordion',
            scope: {
                title: '@'
            },
            templateUrl: 'templates/collapsible.html',
            link: function (scope, element, attrs, accordionController, transcludeFn) {
                transcludeFn(scope.$parent, function (clone) {
                    element.find("#collapsible-transclude").append(clone);
                });

                //create Bootstrap collapsible element
                var collapsible = element.find(".panel-collapse");
                $(collapsible).collapse({
                    toggle: false,
                    parent: $(accordionController.getElement())
                });

                //when the element is not active, it can be expanded only after the previous collapsible has been expanded
                scope.active = false;

                scope.toggle = function (action) {
                    if (!action) {
                        action = 'toggle';
                    }

                    if (scope.active || action == 'hide') {
                        $(collapsible).collapse(action);
                    }
                };

                accordionController.addCollapsible(scope);
            }
        };
    });
})