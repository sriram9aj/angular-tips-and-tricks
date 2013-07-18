(function () {
    function MyData($window, $timeout) {
      var nextDelay = 0, lastPromise;
      this.getData = function () {
        var delay = nextDelay;
        nextDelay = Math.floor(((Math.random() * 3) + 1) * 1000);
        
        function afterDelay() {
          return {"loadTime": delay};
        }
        
        return lastPromise = $timeout(afterDelay, delay);
      }

      this.cancelLoad = function () {
        $timeout.cancel(lastPromise);
        nextDelay = 0;
      }
    }

    function RouteController($scope, $routeParams, $location, myDataResult, myData) {
      $scope.loadTime = myDataResult.loadTime;
      $scope.routeId = $routeParams.id;
      $scope.nextRouteId = ('A' === $scope.routeId) ? 
        'B' : 'A';
        
      $scope.loading = function () {
        $scope.loading = true;
      }
      $scope.cancel = function () {
        myData.cancelLoad();
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
            myDataResult: function(myData) {
              return myData.getData();
            }
          }
        })
        .otherwise({
          redirectTo: '/route/A'
        });
    }

    angular.module('app', [])
        .service('myData', MyData)
        .controller('routeController', RouteController)
        .config(AppConfig);
}());