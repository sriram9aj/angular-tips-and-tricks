(function () {
  function InlineHelpDirective() {
    return {
      template: '<div class="well">{{helpText}}</div>',
      scope: true,
      require: 'helpContent',
      link: function (scope, element, attrs, helpContent) {
        scope.helpText = helpContent.getHelp();
      }
    };
  }

  function ModalHelpDirective() {
    return {
      templateUrl: '/modalHelp.html',
      scope: true,
      require: 'helpContent',
      link: function (scope, element, attrs, helpContent) {
        scope.open = function () {
          scope.shouldBeOpen = true;
        }

        scope.close = function () {
          scope.shouldBeOpen = false;
        }

        scope.helpText = helpContent.getHelp();
      }
    };
  }

  function HelpContentDirective(helpService) {
    return {
      controller: function ($attrs) {
        this.getHelp = function () {
          return helpService.getHelp($attrs.helpContent);
        };
      }
    };
  }

  function HelpService() {
    var _help = {
      sample1: "This is sample 1",
      sample2: "This is sample 2"
    };

    this.getHelp = function (index) {
      return _help[index];
    }
  }

  angular.module('app', ['ui.bootstrap'])
    .service('helpService', HelpService)
    .directive('helpContent', HelpContentDirective)
    .directive('inlineHelp', InlineHelpDirective)
    .directive('modalHelp', ModalHelpDirective);
}());