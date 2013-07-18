# Promises

***

This demo walks through five examples of how to effectively use promises when dealing with async execution.

### Simple Promise

```
UserInput.prompt('Good', 'Bad')
```

The prompt function returns a promise that is resolved by clicking one of two buttons in the confirmation alert. The directive simply echoes the success ('Good') or failure ('Bad') message after the user clicks a button.

### Multiple .then()'s on the same promise

```
UserInput.promptAndIncreaseExcitement('Excellent', 'Horrible')
```

The promptAndIncreaseExcitement function first calls prompt, which we know already returns a promise. However, instead of returning the promise to the directive, this service adds a .then() itself.  Multiple .then()'s are handled in the order that they were added to the promise, passing their results from one level to the next. 

So, the callbacks in the UserInput service will get called first, appending an exclamation to the message and then passing it on appropriately.  Notice, to pass on the failed promise, it's necessary to return a rejected promise.  Just like a try/catch, once you catch an exception and handle it, no other catch blocks will be called.

It's very interesting that a promise can be returned by a callback. Essentially, the returned promise is magically replacing the original promise for the purposes of handling the remaining callbacks.  More on this later...

### Hide rejections

```
UserInput.promptAndHideRejection('Ok', 'Not really')
```

This example is just like the promptAndIncreaseExcitement, but instead of handling the failure callback in the service and passing on a new rejected promise to the directive, we simply return a string.  The next .then() call goes to the success handler now, since the error was already handled by the first .then().

### Chain promises

```
UserInput.promptAndConfirm('Yes', 'No')
```

Now we see the real power of returning promises from success and failure handlers. Take this pseudo-code for example:

```
promise.then(success1, failure1).then(success2, failure2)
```

When you look at this, you would think that the success2 and failure2 callbacks are associated with the success and failure of 'promise'.  This is true, unless success1 and/or failure1 returns a promise themselves.  Then, without it knowing, success2 and failure2 are now dependent on a completely new promise.

This example illustrates this by adding a second delay to the process by prompting the user to confirm his choice.  In practice, this can be used to coordinate multiple calls to a server, where the second call is dependent on the result of the first call.

### Flexible promise handling

```
UserInput.bypassPromptAndReturnImmediately('Bypassed')
```

This example shows how using $q.when() is useful when you don't know whether your promise is really a promise. If you are passed a promise object, or as in this case a function that may (or may not) return a promise, it would be a pain to have to check the type of the object all the time.

$q.when() solves this problem by wrapping normal JavaScript objects with a pre-resolved promise.  Basically, $q.when("yay").then(success) will have the effect of immediately calling the success callback, passing in "yay" as the argument.  On the other hand, $q.when(promise).then(success) works exactly the same as promise.then(success), so you can handle both cases with a single statement and no conditionals.

### Promise replacement in templates

In all of these examples, the directive has been setting $scope.result to a promise

```
$scope.result = callAction().then(success, failure);
```

but, the template code is using $scope.result directly, as if it were an object

```
<p ng-show="result">
	<b>Result:</b>
	<span ng-show="result" class="label" ng-class="{'label-success': result.success,'label-important': !result.success}">{{result.message}}</span>
</p>
```

You can do this, because the template engine in Angular is smart enough to deal with promises.  So, many times you will not even need a success handler. Just assign the final promise in the chain to the $scope and use it just like any other scope variable.