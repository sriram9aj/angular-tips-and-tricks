# Mocking a directive controller

***

* templates are used in multiple places: directives, routes
* Usually, you have the option to define the template inline or specify a templateURL
* By default, Angular will make a call to the server to fetch the templateURL, then add it to $templateCache.
* If you want to avoid making a server call for each template, there are multiple techniques for preloading the $templateCache.
* One way is a <script type="text/ng-template">
* Drawback: To test the templates (i.e. test the directives that use the templates), you'll need to somehow load those script tags.
* Another way is to keep templates in separate files, and combine them at build time into a JS file that can be loaded separately or concatenated with the rest of your application code.
* Angular-app was the first to write a grunt plugin to automate this
* Someone extracted the plugin from angular-app and released it as a standalone grunt plugin.
* Grunt configuration lets you specify the base path and the module name, in addition to the input/output params.
* Application needs to reference the templates module created as a dependency.  This makes it a little tricky for rapid development. One solution is to have a watcher auto-run the html2js.