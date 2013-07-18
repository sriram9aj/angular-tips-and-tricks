describe('myApp', function () {

    beforeEach(module('myApp'));

    describe('controller', function () {
        var appController, logService;

        beforeEach(module(function ($provide) {
            $provide.service('logService', function () {
                this.log = jasmine.createSpy();
            });
        }));

        beforeEach(inject(function ($controller, $injector, $rootScope) {
            appController = $controller('myController',{$scope: $rootScope.$new()});
            logService = $injector.get('logService');
        }));

        it('should update status and log the status', function () {
            expect(appController.updateStatus).toBeDefined();
            expect(appController.status).toEqual('');

            appController.updateStatus('Status updated.');

            expect(appController.status).toEqual('Status updated.');

            //Log Status
            expect(logService.log).toBeDefined();
            expect(logService.log).toHaveBeenCalledWith('Status updated.');

        });
    });
});