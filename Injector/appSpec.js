describe('RealBillingService', function () {
    beforeEach(function mockProcessor() {
        module('billing', function ($provide) {
            $provide.value('processor', {charge: jasmine.createSpy()});
        });
    });

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
    beforeEach(function mockBillingModule() {
        angular.module('billing', []).config(function ($provide) {
           $provide.value('billingService', {chargeOrder: jasmine.createSpy()});
        });

        module('app');
    });

    describe('chargeHandler', function () {
        var order, controller;

        beforeEach(inject(function ($controller) {
            order = {amount: "$6.99", creditCard: "1111222233334444"};
            controller = $controller('PaymentForm', {$scope: {}});
            controller.chargeHandler(order);
        }));

        it('should use the billing service to charge the order', inject(function (billingService) {
            expect(billingService.chargeOrder).toHaveBeenCalledWith(order, order.creditCard);
        }));
    })
});