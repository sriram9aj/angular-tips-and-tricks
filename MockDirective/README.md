# Mocking a directive controller

***

* help-content directive takes a help topic key and communicates with a help service to get the text to be displayed. It makes the text available via the getHelp() controller function.
* inline-help and modal-help are in charge of rendering the help text that they get from the help-content directive.
* We want to test each directive in isolation, so how do we mock the help-content directive's controller?