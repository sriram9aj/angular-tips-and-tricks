angular.module("app", [])

.service("UserInput", function ($rootScope, $q) {
  return {
    prompt: function (successData, failureReason, title) {
      var deferred = $q.defer();
      $rootScope.$broadcast('promptUser', deferred, 
        successData, failureReason, 
        title || 'Choose one...');
      return deferred.promise;
    },

    promptAndIncreaseExcitement: function (successData, failureReason) {
      function increaseSuccess(data) {
        return data + "!";
      }

      function increaseFailure(reason) {
        return $q.reject(reason + "!");
      }

      return this.prompt(successData, failureReason)
                 .then(increaseSuccess, increaseFailure);
    },

    promptAndHideRejection: function (successData, failureReason) {
      function hideRejection(reason) {
        return successData + ' (' + reason + ')';
      }

      return this.prompt(successData, failureReason)
                 .then(null, hideRejection);
    },

    promptAndConfirm: function (successData, failureReason) {
      var self = this;

      function confirm(originalChoice) {
        return self.prompt(originalChoice + ' confirmed', 
          originalChoice + ' rejected', 
          'Confirm your choice...');
      }

      return this.prompt(successData, failureReason)
                 .then(confirm, confirm);
    },

    bypassPromptAndReturnImmediately: function (successData) {
        return successData;
    }
  }
})

.controller("PromiseResolver", function ($scope) {
  $scope.resolveIt = function () {
    $scope.deferred.resolve($scope.successData);
    delete $scope.deferred;
  };

  $scope.rejectIt = function () {
    $scope.deferred.reject($scope.failureReason);
    delete $scope.deferred;
  };

  $scope.$on('promptUser', function (event, deferred, successData, failureReason, title) {
    $scope.deferred = deferred;
    $scope.successData = successData;
    $scope.failureReason = failureReason;
    $scope.title = title;
  });
})

.controller('PromiseExamples', function ($scope, UserInput) {
  $scope.UserInput = UserInput;
})

.directive('prompt', function ($q) {
  return {
    restrict: 'EA',
    templateUrl: '/prompt.html',
    scope: {
      action: '@',
      flexible: '='
    },
    controller: function ($scope) {
      function callAction() {
        return $scope.$parent.$eval($scope.action);
      }

      function success(data) {
        delete $scope.prompted;
        return {success: true, message: 'Promise resolved: ' + data};
      }

      function failure(reason) {
        delete $scope.prompted;
        return {success: false, message: 'Promise rejected: ' + reason};
      }

      $scope.promptUser = function () {
        $scope.result = callAction().then(success, failure);
        $scope.prompted = true;
      }

      $scope.promptUserFlexible = function () {
        $scope.result = $q.when(callAction())
                          .then(success, failure);
        $scope.prompted = true;
      }

      $scope.promptFunction = "promptUser()";
      if ($scope.flexible) {
        $scope.promptFunction = "promptUserFlexible()";
      }
    }
  }
});