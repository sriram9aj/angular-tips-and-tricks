(function () {
    /********************************************************************************************************************************************************************/
    /*                                                                      Dependant Module                                                                            */
    /********************************************************************************************************************************************************************/
    var dependantModule = angular.module('myApp', ['logger']);

    dependantModule.controller('myController', ['logService', function (logService) {
        "use strict";
        this.status = '';

        this.updateStatus = function (status) {
            this.status = status;
            logService.log(status)
        }

        logService.log('Application started.....')
    }])
}());