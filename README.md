# [AngularJS](http://www.angularjs.org/) Tips and Tricks

***

## Ideas

* (BP) Promise basics, "magic" replacement, template magic, etc. -- DONE

* (RP) NgModelController - -- DONE

* (BP) templateCache (and grunt html2js)

* (RP) Mocking a module in test -- DONE

* (BP) Mocking directive controllers
    $ngModelController

* (RP) Testing directives, how to set them up, what to test
    scope.config = {}; // not this
    scope.myConfig = {}; // do this
    return $compile('<div myDirective config="myConfig"')(scope);
    tip: don't call things the same name on your scope as your directive's scope
    get the directive's controller
    element = $compile('<myDirective ng-model="whatever" num-validator="3">')(scope);
    controller = element.controller('myDirectiveController');

    directive('myDirective', function () {
        require: ['myDirective','ngModel']
        controller: ControllerFunction,
        link: function (scope, element, attrs, ctrls) {
            myCtrl = ctrls[0];
            modelCtrl = ctrls[1];
            }
        })

* (BP) Using $injector effectively - (Let me play with that...)

* (RP) talk about $provide and $inject in testing

* (BP) Using route.resolve
    egghead.io video

* (RP) When you can't isolate scope or using '@', scope.$watch, attrs.$observe

* Others...
* How to use jqLite in Angular without using JQuery at all?
    using angular.element (or use the element provided in the directive)
* How to apply TDD when writing Controller?
    don't put everything on the scope just so that it's testable
* Parent/child scope inheritance with controllers
* Troubleshooting performance, things that get called often on $digest
