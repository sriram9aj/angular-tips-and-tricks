(function () {
  function LogDecorator($delegate, $injector, logList) {
    function logFn(level) {
      return function (message) {
        logList.push({
          level: level,
          message: message
        });
        $delegate[level](message);
      }
    }

    return {
      error: logFn('error'),
      info: logFn('info'),
      log: logFn('log'),
      warn: logFn('warn')
    };
  }

  function LogList() {
    this.logs = [];

    this.push = function (message) {
      this.logs.push(message);
    };

    this.clear = function () {
      this.logs.splice(0);
    }
  }

  function LogWidget($compile, logList) {
    function handleLogMessage(scope, element, event, message) {
      var template = '',
          li = $compile(template)(message);
      element.append(li);
    }

    return {
      template: '<ul class="log-widget"><li><a href="" class="btn btn-inverse" ng-click="clear()" ng-show="logs.length > 0">Clear logs</a><hr/></li><li ng-repeat="log in logs" class="alert alert-{{log.level}}">{{log.message}}</li></ul>',
      link: function (scope, element, attrs) {
        scope.logs = logList.logs;
        scope.clear = function () {
          logList.clear();
        }
      }
    }
  }


  function configure($provide) {
    $provide.decorator('$log', LogDecorator);
  }

  angular.module('log-widget', [])
    .directive('logWidget', LogWidget)
    .service('logList', LogList)
    .config(configure);
}());