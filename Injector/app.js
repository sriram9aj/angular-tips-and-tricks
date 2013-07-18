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
    function BillingServiceFactory($injector, paymentProcessor, factoryFn) {
      this.getInstance = function(paymentProcessorName) {
        return $injector.instantiate(factoryFn, {
          processor: paymentProcessor(paymentProcessorName)
        });
      }
    }

    function BillingServiceFactoryProvider() {
        var billingService_;

        this.setBillingService = function (billingService) {
            billingService_ = billingService;
        }

        this.$get = function ($injector) {
            return $injector.instantiate(
              BillingServiceFactory, 
              {
                factoryFn: billingService_
              }
            );
        };
    }

    function PaymentDirective(billingServiceFactory) {
      return {
        restrict: 'EA',
        templateUrl: '/paymentForm.html',
        scope: true,
        link: function (scope, element, attrs) {
          var procName = attrs.paymentProcessor,
              billingService = 
                billingServiceFactory.getInstance(procName);

          scope.handleCharge = function (order) {
            billingService.chargeOrder(order, 
              order.creditCard);
          };
        }
      };
    }

    angular.module('billing', ['paymentProcessing'])
        .directive('payment', PaymentDirective)
        .provider('billingServiceFactory', 
          BillingServiceFactoryProvider);
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

    

    function AppConfig(paymentProcessorProvider, billingServiceFactoryProvider) {
      paymentProcessorProvider.addProcessor('PayPal', 
        PayPalPaymentProcessor);
      paymentProcessorProvider.addProcessor('Square', 
        SquarePaymentProcessor);
      billingServiceFactoryProvider.setBillingService(
        RealBillingService);      
    }

    angular.module('app', ['billing', 'paymentProcessing', 
                           'log-widget'])
        .config(AppConfig)
        .service('transactionLog', TransactionLog);
}());