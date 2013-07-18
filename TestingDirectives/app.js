(function () {
    var module = angular.module('myApp', []);

    module.controller('myController', ['$scope', function ($scope) {
        "use strict";
        $scope.greeterConfig = {
            greeting: 'Hello, ',
            name: 'Richie'
        };
    }]);

    module.directive('greeting', function () {
        "use strict";
        return {
            restrict: 'E',
            replace: false,
            template: '<p></p>',
            controller: ['$scope', '$element', '$attrs', '$transclude',
                function ($scope, $element, $attrs, $transclude) {
                    this.greetMessage = function(){
                        return $scope.config.greeting + $scope.config.name;
                    }
                }],
            scope: {
                config: '='
            },
            link: function (scope, element) {

                scope.$watch('config', function (value) {
                    element.find('p').text(value.greeting + value.name);
                })
            }
        };
    });
}());
