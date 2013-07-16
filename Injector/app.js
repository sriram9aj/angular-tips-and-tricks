/*
 * Payment Processing
 */
(function () {
  function PaymentProcessorProvider($provide) {
    var suffix = "PaymentProcessor";
    this.addProcessor = function (name, processor) {
      $provide.factory(name + suffix, function () {
          return processor;
      });
    };

    this.$get = function ($injector) {
      return function (name) {
          var processorFn = $injector.get(name + suffix),
              instance = $injector.instantiate(processorFn);

          if (typeof instance.charge !== 'function') {
              throw new Error(
                'Payment processor ' + name + 
                ' has no "charge" function.');
          }

          return instance;
      };
    };
  }

  angular.module('paymentProcessing', [])
      .provider('paymentProcessor', 
                PaymentProcessorProvider);
}());

/*
 * Billing
 */
(function () {
    function BillingProvider() {
        var billingService_;

        this.setBillingService = function (billingService) {
            billingService_ = billingService;
        }

        this.$get = function ($injector, paymentProcessor) {
            return function (pName) {
                return $injector.instantiate(
                  billingService_, 
                  {
                    processor: paymentProcessor(pName)
                  }
                );
            }
        };
    }

    angular.module('billing', ['paymentProcessing'])
        .provider('billing', BillingProvider);
}());

/*
 * Application
 */
(function () {
    function PayPalPaymentProcessor($log) {
        this.charge = function (creditCard, amount) {
          $log.info('Charged PayPal: ' +
              'card=[' + creditCard + '], ' +
              'amount=[' + amount + ']');
        };
    }
    PayPalPaymentProcessor.$inject = ['$log'];

    function SquarePaymentProcessor($log) {
        this.charge = function (creditCard, amount) {
          $log.info('Charged Square: ' +
              'card=[' + creditCard + '], ' +
              'amount=[' + amount + ']');
        };
    }
    SquarePaymentProcessor.$inject = ['$log'];

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

    function PaymentDirective(billing) {
      return {
        restrict: 'EA',
        templateUrl: '/paymentForm.html',
        scope: true,
        link: function (scope, element, attrs) {
          var processorName = attrs.paymentProcessor,
              billingService = billing(processorName);

          scope.handleCharge = function (order) {
            billingService.chargeOrder(order, 
              order.creditCard);
          };
        }
      };
    }

    function AppConfig(paymentProcessorProvider, billingProvider) {
      paymentProcessorProvider.addProcessor('PayPal', 
        PayPalPaymentProcessor);
      paymentProcessorProvider.addProcessor('Square', 
        SquarePaymentProcessor);
      billingProvider.setBillingService(RealBillingService);      
    }

    angular.module('app', ['billing', 'paymentProcessing', 
                           'log-widget'])
        .config(AppConfig)
        .service('transactionLog', TransactionLog)
        .directive('payment', PaymentDirective);
}());