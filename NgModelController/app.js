var app = angular.module('ngModelControllerDemo', []);

app.controller('priceEditController', function ($scope) {
    "use strict";
    $scope.vehicle = {
        make: 'Ford',
        model: 'Mustang',
        style: 'GT',
        year: '2013',
        price: 29899.99
    }
});

app.directive('priceEdit', function () {
    "use strict";
    var priceEdit = {
        template: '<input type="text" />',
        replace: false,
        restrict: 'E',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelController) {

            //cache selectors
            var textbox = element.find('input');

            // Specify how UI should be updated
            ngModelController.$render = function () {
                textbox.val(ngModelController.$viewValue);
            };

            textbox.bind('blur', function () {
                scope.$apply(function () {
                    ngModelController.$setViewValue(textbox.val());
                    ngModelController.$viewValue = formatter(ngModelController.$modelValue);
                    ngModelController.$render();
                })
            })

            //remove $ parser
            function parser(price) {

                if (!price) return undefined;

                if (price.indexOf('$') !== -1) {
                    return (parseFloat(price.toString().replace('$', '')).toFixed(2));
                }

                return (parseFloat((price)).toFixed(2));
            }

            //format to 2 decimal places and append $ sign
            function formatter(price) {

                if (!price) return undefined;

                console.log('Price formatter called.')

                if (!isNaN(parseFloat(price)) && isFinite(price)) {

                    ngModelController.$setValidity('myError', true);

                    if (price.toString().indexOf('$') === -1) {
                        return ('$' + (parseFloat(price).toFixed(2)));
                    }

                    return (parseFloat(price).toFixed(2));
                }

                ngModelController.$setValidity('myError', false);
                return undefined;
            }

            //add our parsers and formatters to ngModelController
            ngModelController.$parsers.push(parser);
            ngModelController.$formatters.push(formatter);
        }
    }

    return priceEdit;
});

app.directive('myNumberValidator', function () {
    "use strict";
    var myNumberValidator = {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelController) {

            //check if price is a number
            function parser(price) {

                if (!price) return undefined;

                console.log('Validation parser called.')

                if (!isNaN(parseFloat(price)) && isFinite(price)) {
                    ngModelController.$setValidity('myError', true);
                    return price;
                }

                ngModelController.$setValidity('myError', false);
                return undefined;
            }

            //add our parsers to ngModelController
            ngModelController.$parsers.push(parser);
        }
    }

    return myNumberValidator;
});



