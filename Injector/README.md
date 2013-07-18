# Dependency injection

***

## Problem

Dependency injection in Angular is straightforward for single-implementation services, but it becomes difficult to inject different implementations of a service when needed due to Angular's single injector design.  In this tip, we'll explore service providers and how they can help.

## Background

I patterned this example from the ["Motivation"](https://code.google.com/p/google-guice/wiki/Motivation?tm=6) page in the Google Guice documentation.

The problem they present is that of a BillingService that coordinates two activities, payment processing and transaction logging, when an order is charged to a credit card. In the first iteration, the BillingService simply constructs the two dependencies within its own constructor:

```
function BillingService() {
	var paymentProcessor = new PayPalPaymentProcessor(),
		transactionLog = new DatabaseTransactionLog();

	this.chargeOrder = function (amount, creditCard) {
		var result;
		try {
			result = paymentProcessor.charge(amount, creditCard);
			transactionLog.logResult(result);
		} catch (e) {
			transactionLog.logError(e);
		}
	}
 }
```

Because of the static relationship between the interface and implementation of the payment processor and transaction logger in the billing service, it would be very difficult to mock those dependencies in a unit test.  To solve this problem, we can replace the 'new' operations with static factories.

```
function BillingService() {
	var paymentProcessor = paymentProcessorFactory.getInstance(),
			transactionLog = transactionLogFactory.getInstance();
	...
}
```

As long as we can override the factory with a mock, this will solve our testing problems.  This still is short of the ideal solution because we are mixing object creation with functionality inside BillingService. That can be solved by passing the dependencies into the constructor.

```
function BillingService(paymentProcessor, transactionLog) {
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
		$provide.service('paymentProcessor', PayPalPaymentProcessor);
		$provide.service('transactionLog', DatabaseTransactionLog);
	});
```

Then, using $injector we can create an instance of the BillingService.

```
$injector.instantiate(BillingService);
```

Now, consider how to add a second payment processor implementation. In Guice, we would create a new implementation of the CreditCardProcessor interface and then simply make a new module to utilize it.

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
		$provide.service('payementProcessor', PayPalCredCardProcessor);
		...
	});

angular.module('billingModuleForSquare', [])
	.config(function ($provide) {
		$provide.service('paymentProcessor', SquareCreditCardProcessor);
		...
	});
```

Since both modules share the same injector, there can be only one credit card processor.  When there are two defined such as this, the second one overrides the first. This is actually the principle we depend on for unit testing in Angular.
