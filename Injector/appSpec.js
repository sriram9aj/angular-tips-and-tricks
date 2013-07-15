describe('RealBillingService', function () {
    function mockProcessor($provide) {
        $provide.value('processor', {charge: jasmine.createSpy()});
    }

    beforeEach(module('billing', mockProcessor));

    describe('when the order is charged', function () {
        var ccNum, order;

        beforeEach(inject(function (billingService) {
            ccNum = "9999888877776666";
            order = {amount: "$9.99"};
            billingService.chargeOrder(order, ccNum);
        }));

        it('should use the processor to charge the order', inject(function (processor) {
            expect(processor.charge).toHaveBeenCalledWith(ccNum, order.amount);
        }));
    });
});

describe('Application', function () {
    function mockBillingModule($provide) {
        $provide.value('billingService', {chargeOrder: jasmine.createSpy()});
    }

    function createPaymentFormController(scope) {
        var controller;
        inject(function ($controller) {
            controller = $controller('PaymentForm', {$scope: scope});
        });
        return controller;
    }

    beforeEach(function () {
        angular.module('billing', []).config(mockBillingModule);
    });

    beforeEach(module('app'));

    describe('chargeHandler', function () {
        var order, controller;

        beforeEach(function () {
            order = {amount: "$6.99", creditCard: "1111222233334444"};
            controller = createPaymentFormController({});
            controller.chargeHandler(order);
        });

        it('should use the billing service to charge the order', inject(function (billingService) {
            expect(billingService.chargeOrder).toHaveBeenCalledWith(order, order.creditCard);
        }));
    })
});