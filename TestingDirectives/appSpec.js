describe('myApp', function () {
    beforeEach(module('myApp'));

    describe('greeter directive', function () {

        var compile, scope, element;

        beforeEach(inject(function ($compile, $rootScope) {
            compile = $compile;
            scope = $rootScope.$new();
        }));

        it('should render a greeting from the configuration object.', function () {

            scope.config = {
                greeting: 'Hello, ',
                name: 'Richie'
            };

            element = angular.element('<greeting config="config"></greeting>');

            compile(element)(scope);
            scope.$digest();

            expect(element.find('p').text()).toBe('Hello, Richie');

        });
    });

    describe('greeter controller', function () {

        var compile, scope, element, compiled, greeterController;

        beforeEach(inject(function ($compile, $rootScope) {
            compile = $compile;
            scope = $rootScope.$new();

            scope.config = {
                greeting: 'Hello, ',
                name: 'Richie'
            };

            element = angular.element('<greeting config="config"></greeting>');

            compiled = compile(element)(scope);
            scope.$digest();

            greeterController = compiled.controller('greeting');
        }));

        it('should have a greetMessage method that returns the greeting and name.', function () {
            expect(greeterController.greetMessage).toBeDefined();
            expect(greeterController.greetMessage()).toBe(scope.config.greeting + scope.config.name);
        });
    });
});