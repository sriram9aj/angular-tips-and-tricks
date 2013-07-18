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
