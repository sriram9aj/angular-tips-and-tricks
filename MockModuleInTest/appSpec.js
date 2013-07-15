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