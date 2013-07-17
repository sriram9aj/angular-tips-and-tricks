(function () {
  function ModalDirective() {
    return {
      templateUrl: 'templates/modal.html',
      scope: true,
      link: function (scope, element, attrs) {
        scope.open = function () {
          scope.shouldBeOpen = true;
        }

        scope.close = function () {
          scope.shouldBeOpen = false;
        }

        scope.bodyText = attrs.text;
        scope.title = attrs.title;
      }
    };
  }

  angular.module('app', ['templates', 'ui.bootstrap'])
    .directive('myModal', ModalDirective);
}());