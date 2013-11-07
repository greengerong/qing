/*! qing - v0.0.0 - 2013-11-08 */
//TODO: should can be add by each design directive; Maybe use window Array
angular.module("qing", ["qing.template", "ui.bootstrap", "ngmodel.format", "green.inputmask4angular"])
    .constant('panelConfig', {
        "url": "scripts/directives/qingPanel/qingPanel.html?mark={0}"
    });


var qing = qing || {};

qing.qingPanelDirective = function (phase) {
    angular.module("qing")
        .directive('qingPanel', ["$compile", "templateService",
            function ($compile, templateService) {
                return {
                    templateUrl: String.format("{0}/directives/qingPanel/qingPanel.html", phase),
                    restrict: "EA",
                    replace: true,
                    scope: {
                        currentForm: "="
                    },
                    link: function (scope, element, attrs) {
                        scope.qingMark = attrs.qingMark;

                        templateService.getPanelTemplate(scope.qingMark).then(function (tplContent) {
                            if (tplContent && (tplContent.trim())) {
                                element.find(".content").replaceWith($compile(tplContent.trim())(scope));
                            }
                        });

                    }
                };
    }]);
}

angular.module("qing")
    .filter("toQingFormName", [function () {
        return function (name) {
            return "form_" + name.replace(/[^a-zA-Z0-9_]/g, "");
        };
    }])
    .directive("qingRootPanel", ["toQingFormNameFilter", "$http", "$compile", "$templateCache",
        function (toQingFormNameFilter, $http, $compile, $templateCache) {

            var tplUrl = 'common/directives/qingRootPanel/qingRootPanel.html';

            return {
                restrict: "EA",
                scope: {
                },
                link: function (scope, element, attrs) {
                    scope.qingMark = attrs.qingMark;
                    $http.get(tplUrl, {cache: $templateCache})
                        .success(function (tplContent) {
                            var formName = toQingFormNameFilter(scope.qingMark);
                            var formElm = angular.element(tplContent.trim())
                                .attr("name", formName)
                                .find("qing-panel")
                                .attr("qing-mark", scope.qingMark);

                            element.replaceWith($compile(formElm)(scope));
                        });
                },
                controller: ["$scope", function ($scope) {
                    var self = this;

                    self.getRootQingMark = function () {
                        return $scope.qingMark;
                    };
                }]
            };
        }]);

angular.module('qing')
    .service('localStorage', function Cover() {

        var KEY = 'qing.localStorage',
            data = JSON.parse(localStorage.getItem(KEY)) || {};

        var storage = function () {
            localStorage.setItem(KEY, JSON.stringify(data));
        }

        this.put = function (id, text) {
            data[id] = text;
            storage();
        };

        this.get = function (id) {
            if (data[id]) {
                return data[id];
            } else {
                return null;
            }
        }

    });

angular.module('qing')
    .service('templateService', ["$http", "$templateCache", "$q", "localStorage",
        function ($http, $templateCache, $q, localStorage) {


            this.getPanelTemplate = function (mark) {
                // var tplUrl = String.format(panelConfig.url, mark);
                //return $http.get(tplUrl, {cache: $templateCache});
                // mock
                var defer = $q.defer();
                defer.resolve(decodeURI(localStorage.get(mark)));
                return defer.promise;
            }

            this.savePanelTemplate = function (mark, html) {

                //TODO: maybe object
                if (angular.isObject(html) && html.jquery) {
                    html = html[0].outerHTML;
                }
                // mock
                var defer = $q.defer();
                defer.resolve(localStorage.put(mark, encodeURI(html)));
                return defer.promise;
            }

        }]);

angular.module("qing")
    .factory("underscoreService", ["$window", function ($window) {
        return $window._;
    }]);

String.format = function () {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }

    return s;
};
var qing = qing || {};
qing.qingPanelDirective("product");

angular.module('qing.template', ['common/directives/qingRootPanel/qingRootPanel.html', 'product/directives/qingPanel/qingPanel.html']);

angular.module("common/directives/qingRootPanel/qingRootPanel.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/directives/qingRootPanel/qingRootPanel.html",
    "<form>\n" +
    "    <qing-panel qing-mark=\"{{qingMark}}\"></qing-panel>\n" +
    "</form>");
}]);

angular.module("product/directives/qingPanel/qingPanel.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("product/directives/qingPanel/qingPanel.html",
    "<div class=\"qing-panel\">\n" +
    "    <div class=\"content\"></div>\n" +
    "</div>");
}]);
