(function () {

    var module = angular.module('myApp', []);

    module.service('logService', function () {
        "use strict";
        this.log = function (msg) {
            console.log(msg);
        }
    });

    module.service('logService', function () {
        "use strict";
        this.log = function (msg) {
            console.log(msg);
        }
    });

    module.controller('myController', ['logService', function (logService) {
        "use strict";
        this.status = '';

        this.updateStatus = function (status) {
            this.status = status;
            logService.log(status)
        }
    }]);

}());