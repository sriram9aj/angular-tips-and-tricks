describe('myApp', function () {
    beforeEach(module('myApp'));

    describe('greeter directive', function () {

        var compile, scope;

        beforeEach(inject(function ($compile, $rootScope) {
            compile = $compile;
            scope = $rootScope.$new();
        }));

        it('should render a greeting from the configuration object.', function () {

            scope.myConfig = {
                greeting: 'Hello, ',
                name: 'Richie'
            };

            var element = compile('<greeting config="myConfig"></greeting>')(scope);
            scope.$digest();

            expect(element.find('p').text()).toBe('Hello, Richie');

        });
    });

    describe('greeter controller', function () {

        var compile, scope, greeterController;

        beforeEach(inject(function ($compile, $rootScope) {
            compile = $compile;
            scope = $rootScope.$new();
        }));

        it('should have a greetMessage method that returns the greeting and name.', function () {

            scope.myConfig = {
                greeting: 'Hello, ',
                name: 'Richie'
            };

            var element = compile('<greeting config="myConfig"></greeting>')(scope);
            scope.$digest();

            greeterController = element.controller('greeting');

            expect(greeterController.greetMessage).toBeDefined();
            expect(greeterController.greetMessage()).toBe(scope.myConfig.greeting + scope.myConfig.name);
        });
    });
});