describe('myApp', function () {

    beforeEach(module('myApp'));

    describe('controller', function () {
        var appController;

        beforeEach(module(function ($provide) {
            $provide.service('logService', function(){this.log = jasmine.createSpy()});
        }));

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

    describe('log service', function () {

        var logService;

        beforeEach(inject(function ($injector) {
            logService = $injector.get('logService')
            spyOn(logService, 'log');
        }));

        it('should accept a message parameter and log it', function () {
            expect(logService.log).toBeDefined();

            logService.log('Log me.');

            expect(logService.log).toHaveBeenCalledWith('Log me.');
        });
    });
});