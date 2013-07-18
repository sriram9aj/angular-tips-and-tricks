# Dependency injection

***

## Problem

Dependency injection in Angular is straightforward for single-implementation services, but it becomes difficult to inject different implementations of a service when needed due to Angular's single injector design.  In this tip, we'll explore service providers and how they can help.

## Background

I patterned this example from the ["Motivation"](https://code.google.com/p/google-guice/wiki/Motivation?tm=6) page in the Google Guice documentation.

The problem they present is that of a BillingService that coordinates two activities, credit card processing and transaction logging, when an order is charged to a credit card. In the first iteration, the BillingService simply constructs the two dependencies within its own constructor:

```
function BillingService() {
	var creditCardProcessor = new PayPalCreditCardProcessor(),
		transactionLog = new DatabaseTransactionLog();

	this.chargeOrder = function (amount, creditCard) {
		var result;
		try {
			result = creditCardProcessor.charge(amount, creditCard);
			transactionLog.logResult(result);
		} catch (e) {
			transactionLog.logError(e);
		}
	}
 }
```

Because of the static relationship between the interface and implementation of the credit card processor and transaction logger in the billing service, it would be very difficult to mock those dependencies in a unit test.  To solve this problem, we can replace the 'new' operations with static factories.

```
function BillingService() {
	var creditCardProcessor = creditCardProcessorFactory.getInstance(),
			transactionLog = transactionLogFactory.getInstance();
	...
}
```

As long as we can override the factory with a mock, this will solve our testing problems.  This still is short of the ideal solution because we are mixing object creation with functionality inside BillingService. That can be solved by passing the dependencies into the constructor.

```
function BillingService(creditCardProcessor, transactionLog) {
	...
}
```

This brings up the question of who is responsible for creating the dependencies that get passed into the constructor.  Before dependency injection, the solution was to have a BillingServiceFactory with the sole responsibility of constructing the BillingService and its dependencies.  With dependency injection, the same can be done more declaratively.

With Guice, Modules are created that declare the bindings of interfaces to implementations.

```
public class BillingModule extends AbstractModule {
  @Override 
  protected void configure() {
    bind(TransactionLog.class).to(DatabaseTransactionLog.class);
    bind(CreditCardProcessor.class).to(PaypalCreditCardProcessor.class);
    bind(BillingService.class).to(RealBillingService.class);
  }
}
```

Then, the BillingModule can be used to create an injector in order to construct instances of the BillingService.

```
public static void main(String[] args) {
  Injector injector = Guice.createInjector(new BillingModule());
  BillingService billingService = injector.getInstance(BillingService.class);
  ...
}
```

Similarly, Angular can bind implementations to names in a module's configure function.

```
angular.module('app', [])
	.config(function ($provide) {
		$provide.service('creditCardProcessor', PayPalCreditCardProcessor);
		$provide.service('transactionLog', DatabaseTransactionLog);
	});
```

Then, using $injector we can create an instance of the BillingService.

```
$injector.instantiate(BillingService);
```

The index-rev1.html and app-rev1.js files have a working demo of this setup.

Now, consider how to add a second credit card processor implementation. In Guice, we would create a new implementation of the CreditCardProcessor interface and then simply make a new module to utilize it.

```
public class BillingModuleForSquare extends AbstractModule {
  @Override 
  protected void configure() {
    bind(TransactionLog.class).to(DatabaseTransactionLog.class);
    bind(CreditCardProcessor.class).to(SquareCreditCardProcessor.class);
    bind(BillingService.class).to(RealBillingService.class);
  }
}
```

With Angular, the solution is not as straightforward.  Although we can define multiple modules, there is only a sinlge shared injector between them.  We'd like to be able to do something like this.

```
angular.module('billingModuleForPayPal', [])
	.config(function ($provide) {
		$provide.service('creditCardProcessor', PayPalCredCardProcessor);
		...
	});

angular.module('billingModuleForSquare', [])
	.config(function ($provide) {
		// Can't do this!
		$provide.service('creditCardProcessor', SquareCreditCardProcessor);
		...
	});
```

Since both modules share the same injector, there can be only one credit card processor.  When there are two providers defined such as this, the second one overrides the first. This second-one-in-wins design is actually the principle we depend on for mocking providers for unit testing in Angular.

## Solution

In Angular, there are only a handful of places where dynamic objects (as opposed to singleton services) are injected, including:
* $scope injected into a controller
* $scope, $element and $attrs injected into a directive controller
* 'resolve' properties injected into a controller during routing

In each of these cases, a controller is being injected with dynamic objects, which it calls 'locals'. If you've ever created a controller in a unit test, you have passed in $scope into the locals argument of $controller.

```
it('...', inject($rootScope, $controller) {
	var scope = $rootScope.$new(),
		controller = $controller('MyController', {$scope: scope});
	...
});
```

The locals for a controller are determined dynamically based on an external state. For example, the $scope local of a controller is determined based on where the ng-controller directive is in the DOM. The DOM in this case acts as a secondary DI configuration, tying the $scope injectable to whatever the scope is at that point in the DOM.

It turns out that the concept of locals is not specific to controllers. Anywhere where you use $injector.invoke or $injector.instantiate, you can pass in locals.  My solution to the credit card processor problem was to leverage directives and locals like a controller in order to create a BillingService instance with the correct credit card processor injected.  The code for this solution is in index.html and app.js.

The first part of the solution was to add the ability to register multiple credit card processors.  This can be seen in the application's config function.

```
function AppConfig(creditCardProcessorProvider, billingServiceFactoryProvider) {
  creditCardProcessorProvider.addProcessor('PayPal', 
    PayPalCreditCardProcessor);
  creditCardProcessorProvider.addProcessor('Square', 
    SquareCreditCardProcessor);
  ...
}
```

The addProcessor function registers each credit card processor as its own factory, appending the processor name with the suffix 'CreditCardProcessor'.

```
function CreditCardProcessorProvider($provide) {
	var suffix = "CreditCardProcessor";
    this.addProcessor = function (name, processor) {
      $provide.factory(name + suffix, function () {
      	return processor;
     });
	};
	...
}
```

The creditCardProcessor injectable is a function that takes a processor name and returns the instance of that processor. As a bonus, it verifies that the processor instance adheres to the interface contract. In this case it requires the processor to implement a charge function.

```
function CreditCardProcessorProvider($provide) {
	...
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
```

The second part of the solution is to be able to create an instance of the BillingService, injecting the appropriate credit card processor as a local. This is accomplished through the BillingServiceFactory.

```
function BillingServiceFactory($injector, creditCardProcessor, factoryFn) {
  this.getInstance = function(ccProcessorName) {
    return $injector.instantiate(factoryFn, {
      processor: creditCardProcessor(ccProcessorName)
    });
  }
}
```
