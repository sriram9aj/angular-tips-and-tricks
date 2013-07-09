# [AngularJS](http://www.angularjs.org/) Tips and Tricks

***

## Ideas

* (BP) Promise basics, "magic" replacement, template magic, etc.
promise.then(function () {
    return newpromise;
}).then(function () {
    // do something
});

$scope.myValue = $http.get();

{{myValue}}

* (RP) NgModelController - Talk about the API, benefits of using to create your own custom user input controls 
   <div ds-mydirective ng-model="myObj.myVal"></div>

* (BP) templateCache (and grunt html2js)

* (RP) Mocking a module in test

* (BP) Mocking directive controllers
    $ngModelController

* (BP) Using $injector effectively - (Let me play with that...)
   Alternatively (RP), talk about $provide and $inject in testing

* (RP) Testing directives, how to set them up, what to test
    scope.config = {}; // don't do this
    scope.myConfig = {}; // do this
    return $compile('<div myDirective config="myConfig"')(scope);
    tip: don't call things the same name on your scope as your directive's scope

* How to use jqLite in Angular without using JQuery at all?
    using angular.element (or use the element provided in the directive)

* How to apply TDD when writing Controller?
    don't put everything on the scope just so that it's testable

* (BP/RP) Using route.resolve
    egghead.io video

* Parent/child scope inheritance with controllers
* Troubleshooting performance, things that get called often on $digest

* (RP) When you can't isolate scope or using '@', scope.$watch, attrs.$observe