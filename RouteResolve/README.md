# Route resolve

***

* This application has one route that takes an ID parameter.
* The controller sets the next route ID to the previous one, simulating a toggle between two routes.
* The route has a resolve attribute. The value is an object that can have multiple key/values that need to be resolved before the route can load.
* The results of the resolve values are injected as locals into the controller.
* If a promise is returned from a resolve function, the controller can't load until the promise resolves.
* The result is that the user stays on the previous view until all resolves are resolved.
* Use case: e-mail client example
* If a route is cancelled, what happens!?