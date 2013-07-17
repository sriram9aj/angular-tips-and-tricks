(function () {
    function RandomWait($window, $timeout) {
      var nextDelay = 0, lastPromise;
      this.waitRandomly = function () {
        var delay = nextDelay;
        nextDelay = Math.floor(((Math.random() * 3) + 1) * 1000);
        
        function afterDelay() {
          return {"timeoutDelay": delay};
        }
        
        return lastPromise = $timeout(afterDelay, delay);
      }

      this.cancel = function () {
        $timeout.cancel(lastPromise);
        nextDelay = 0;
      }
    }

    function RouteController($scope, $routeParams, $location, randomWaitResult, randomWait) {
      $scope.timeoutDelay = randomWaitResult.timeoutDelay;
      $scope.routeId = $routeParams.id;
      $scope.nextRouteId = ('A' === $scope.routeId) ? 
        'B' : 'A';
        
      $scope.loading = function () {
        $scope.loading = true;
      }
      $scope.cancel = function () {
        randomWait.cancel();
        $scope.loading = false;
        $scope.cancelled = true;
      }
    }

    function AppConfig($routeProvider) {
      $routeProvider
        .when('/route/:id', {
          controller: 'routeController',
          templateUrl: '/route.html',
          resolve: {
            randomWaitResult: function(randomWait) {
              return randomWait.waitRandomly();
            }
          }
        })
        .otherwise({
          redirectTo: '/route/A'
        });
    }

    angular.module('app', [])
        .service('randomWait', RandomWait)
        .controller('routeController', RouteController)
        .config(AppConfig);
}());