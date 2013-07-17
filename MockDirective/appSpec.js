describe('myApp', function () {
  beforeEach(module('app'));

  describe('inline help, first try', function () {
    var helpText = "This is some test help text",
        element;

    beforeEach(module(function ($compileProvider) {
      function HelpContent() {
        return {
          controller: {
            getHelp: jasmine.createSpy().andReturn(helpText)
          }
        };
      }
      $compileProvider.directive('helpContent', HelpContent);
    }));

    beforeEach(inject(function ($rootScope, $compile) {
      var scope = $rootScope.$new();
      scope.$apply(function () {
        element = $compile(
          '<div inline-help help-content="sample1"></div>')(scope);
      });
    }));

    it('should display help content inline', function () {
      expect(element.text()).toBe(helpText);
    });
  });

  describe('inline help', function () {
    var helpText = "This is some test help text", 
        element;

    function mockHelpContentDirective(element) {      
      element.data('$helpContentController', {
        getHelp: jasmine.createSpy().andReturn(helpText)
      });
    } 

    beforeEach(inject(function ($rootScope, $compile) {
      var scope = $rootScope.$new();

      element = angular.element('<div inline-help></div>');
      mockHelpContentDirective(element);
      scope.$apply(function () {
        element = $compile(element)(scope);
      });
    }));

    it('should display help content inline', function () {
      expect(element.text()).toBe(helpText);
    });
  });

});