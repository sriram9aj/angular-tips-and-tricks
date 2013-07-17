angular.module('templates', ['templates/modal.html']);

angular.module("templates/modal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/modal.html",
    "<a href=\"#\" class=\"btn\" ng-click=\"open()\">{{title}}</a>\n" +
    "<div modal=\"shouldBeOpen\" options=\"opts\">\n" +
    "  <div class=\"modal-header\">\n" +
    "    <h3>{{title}}</h3>\n" +
    "  </div>\n" +
    "  <div class=\"modal-body\">\n" +
    "    {{bodyText}}\n" +
    "  </div>\n" +
    "  <div class=\"modal-footer\">\n" +
    "    <a href=\"#\" class=\"btn cancel\" \n" +
    "       ng-click=\"close()\">Close</a>\n" +
    "  </div>\n" +
    "</div>");
}]);
