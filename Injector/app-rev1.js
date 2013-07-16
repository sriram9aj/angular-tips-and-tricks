(function () {
  function PayPalPaymentProcessor($log) {
    this.charge = function (creditCard, amount) {
        $log.info('Charged PayPal: ' +
            'card=[' + creditCard + '], ' +
            'amount=[' + amount + ']');
    };
  }
  PayPalPaymentProcessor.$inject = ['$log'];

  function TransactionLog($log) {
    this.logTransaction = function (order) {
        $log.info('Logged transaction: ' + 
            angular.toJson(order));
    };
  }
  TransactionLog.$inject = ['$log'];

  function RealBillingService(processor, transactionLog) {
    this.chargeOrder = function (order, creditCard) {
        processor.charge(creditCard, order.amount);
        transactionLog.logTransaction(order);
    };        
  }
  RealBillingService.$inject = ['processor', 
                                'transactionLog'];

  function PaymentForm($scope, billingService) {
    $scope.handleCharge = function (order) {
        billingService.chargeOrder(order, 
          order.creditCard);
    }
  }
  PaymentForm.$inject = ['$scope', 'billingService'];

  angular.module('app', ['log-widget'])
    .service('billingService', RealBillingService)
    .service('processor', PayPalPaymentProcessor)
    .service('transactionLog', TransactionLog)
    .controller('PaymentForm', PaymentForm);
}());