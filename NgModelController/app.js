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
        require: '?ngModel',
        link: function (scope, element, attrs, ngModel) {

            if (!ngModel) return; // do nothing if no ng-model

            //cache selectors
            var textbox = element.find('input');

            // Specify how UI should be updated
            ngModel.$render = function () {
                console.log(ngModel);
                textbox.val(ngModel.$viewValue);
            };

            textbox.bind('blur', function () {
                scope.$apply(function () {
                    ngModel.$setViewValue(textbox.val());
                    ngModel.$viewValue = formatter(ngModel.$modelValue);
                    ngModel.$render();
                })
            })

            //remove $ parser
            function parser(price) {

                if (price && price.indexOf('$') !== -1) {
                    return (parseFloat(price.toString().replace('$', '')).toFixed(2));
                }

                return (parseFloat((price)).toFixed(2));
            }

            //format to 2 decimal places and append $ sign
            function formatter(price) {

                if (!price) return undefined;

                if (price.toString().indexOf('$') === -1) {
                    return ('$' + (parseFloat(price).toFixed(2)));
                }

                return (parseFloat(price).toFixed(2));
            }

            //add our parsers and formatters to ngModelController
            ngModel.$parsers.push(parser);
            ngModel.$formatters.push(formatter);
        }
    }

    return priceEdit;
});

app.directive('myNumberValidator', function () {
    "use strict";
    var myNumberValidator = {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs, ngModel) {

            if (!ngModel) return; // do nothing if no ng-model

            //check if price is a number
            function parser(price) {

                if (!price) return undefined;

                if(!isNaN(parseFloat(price)) && isFinite(price)){
                    ngModel.$setValidity('myError',true);
                    return price;
                }

                ngModel.$setValidity('myError',false);
                console.log(scope);
                return undefined;
            }

            //add our parsers to ngModelController
            ngModel.$parsers.push(parser);
        }
    }

    return myNumberValidator;
});



