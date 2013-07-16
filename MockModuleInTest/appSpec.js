describe('myApp', function () {
    var mockLogger = angular.module('logger', []);

    mockLogger.service('logService', function () {
        this.log = jasmine.createSpy('log');
    });

    beforeEach(module('myApp'));

    describe('controller', function () {
        var appController;

        beforeEach(inject(function ($controller) {
            appController = $controller('myController')
        }));

        it('should update status', function () {
            expect(appController.updateStatus).toBeDefined();
            expect(appController.status).toEqual('')

            appController.updateStatus('Status updated.')

            expect(appController.status).toEqual('Status updated.')

        });
    });
});