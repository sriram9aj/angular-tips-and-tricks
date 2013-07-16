(function () {
    function PayPalCreditCardProcessor() {
        this.charge = function (creditCard, amount) {
            console.log('Charging PayPal: ' +
                'card=[' + creditCard + '], ' +
                'amount=[' + amount + ']');
        };
    }

    function RealBillingService(processor) {
        this.chargeOrder = function (order, creditCard) {
            processor.charge(creditCard, order.amount);
        };
    }
    RealBillingService.$inject = ['processor'];

    angular.module('billing', []).config(function ($provide) {
        $provide.provider('billingService', {
            $get: function($injector) {
                return $injector.instantiate(RealBillingService);
            }
        });
        $provide.provider('processor', {
            $get: function($injector) {
                return $injector.instantiate(PayPalCreditCardProcessor);
            }
        });
    });
}());