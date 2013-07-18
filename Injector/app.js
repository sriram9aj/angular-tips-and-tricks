/*
 * Credit Card Processing
 */
(function () {
  function CreditCardProcessorProvider($provide) {
    var suffix = "CreditCardProcessor";
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
                'Credit card processor ' + name + 
                ' has no "charge" function.');
          }

          return instance;
      };
    };
  }

  angular.module('creditCardProcessing', [])
      .provider('creditCardProcessor', 
                CreditCardProcessorProvider);
}());

/*
 * Billing
 */
(function () {
    function BillingServiceFactory($injector, creditCardProcessor, factoryFn) {
      this.getInstance = function(ccProcessorName) {
        return $injector.instantiate(factoryFn, {
          processor: creditCardProcessor(ccProcessorName)
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
          var procName = attrs.creditCardProcessor,
              billingService = 
                billingServiceFactory.getInstance(procName);

          scope.handleCharge = function (order) {
            billingService.chargeOrder(order, 
              order.creditCard);
          };
        }
      };
    }

    angular.module('billing', ['creditCardProcessing'])
        .directive('payment', PaymentDirective)
        .provider('billingServiceFactory', 
          BillingServiceFactoryProvider);
}());

/*
 * Application
 */
(function () {
    function PayPalCreditCardProcessor($log) {
        this.charge = function (creditCard, amount) {
          $log.info('Charged PayPal: ' +
              'card=[' + creditCard + '], ' +
              'amount=[' + amount + ']');
        };
    }
    PayPalCreditCardProcessor.$inject = ['$log'];

    function SquareCreditCardProcessor($log) {
        this.charge = function (creditCard, amount) {
          $log.info('Charged Square: ' +
              'card=[' + creditCard + '], ' +
              'amount=[' + amount + ']');
        };
    }
    SquareCreditCardProcessor.$inject = ['$log'];

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

    function AppConfig(creditCardProcessorProvider, billingServiceFactoryProvider) {
      creditCardProcessorProvider.addProcessor('PayPal', 
        PayPalCreditCardProcessor);
      creditCardProcessorProvider.addProcessor('Square', 
        SquareCreditCardProcessor);
      billingServiceFactoryProvider.setBillingService(
        RealBillingService);      
    }

    angular.module('app', ['billing', 'creditCardProcessing', 
                           'log-widget'])
        .config(AppConfig)
        .service('transactionLog', TransactionLog);
}());