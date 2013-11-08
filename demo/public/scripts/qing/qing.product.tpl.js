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
    .service('localStorage', ["$window", "$log", function ($window, $log) {

        var KEY = 'qing.localStorage',
            self = this;

        var getData = function () {
            return angular.fromJson($window.localStorage.getItem(KEY)) || {};
        };

        var saveData = function (data) {
            $window.localStorage.setItem(KEY, angular.toJson(data));
        };

        self.put = function (id, text) {
            var data = getData();
            data[id] = text;
            $log.info(String.format("localStorage save data for mark {0}. ", id), data);
            saveData(data);
        };

        self.get = function (id) {
            var data = getData();
            $log.info(String.format("localStorage get data for mark {0}.", id), data);
            return data[id] ? data[id] : null;
        };
    }]);

angular.module("qing")
    .service("messageBox", ["$modal", "$q", function ($modal, $q) {
        var self = this;

        self.confirm = function (options) {
            var modalInstance = $modal.open({
                templateUrl: "common/services/messageBox/messageBox.html",
                controller: [ "$scope", "$modalInstance",
                    function ($scope, $modalInstance) {
                        $scope.options = options;

                        $scope.ok = function () {
                            $modalInstance.close();
                        };

                        $scope.cancel = function () {
                            $modalInstance.dismiss('cancel');
                        };

                    }]
            });

            var defer = $q.defer();
            modalInstance.result.then(function (reason) {
                defer.resolve(reason);
            }, function () {
                defer.reject(arguments);
            });
            return defer.promise;
        };

    }]);

angular.module('qing')
    .service('templateService', ["$http", "$templateCache", "$q", "localStorage",
        function ($http, $templateCache, $q, localStorage) {
            var self = this;

            self.getPanelTemplate = function (mark) {
                // var tplUrl = String.format(panelConfig.url, mark);
                //return $http.get(tplUrl, {cache: $templateCache});
                // mock
                var defer = $q.defer();
                var data = localStorage.get(mark);
                var result = data ? decodeURI(data) : null;
                defer.resolve(result);
                return defer.promise;
            }

            self.savePanelTemplate = function (mark, html) {
                var defer = $q.defer();
                self.getPanelTemplate(mark).then(function (container) {
                    if (!container) {
                        container = "<div></div>";
                    }

                    var $elm = angular.element(container).append(angular.element(html));
                    defer.resolve(localStorage.put(mark, encodeURI($elm[0].outerHTML)));
                }, function () {
                    defer.reject(arguments);
                });

                return defer.promise;
            };

            self.updatePanelTemplate = function (parentMark, mark, html) {
                var defer = $q.defer();
                self.getPanelTemplate(parentMark).then(function (container) {
                    var oldElmSector = String.format("[qing-mark='{0}']", mark);
                    var $elm = angular.element(container);
                    $elm.find(oldElmSector).replaceWith(angular.element(html));
                    defer.resolve(localStorage.put(parentMark, encodeURI($elm[0].outerHTML)));
                }, function () {
                    defer.reject(arguments);
                });

                return defer.promise;
            };

            self.removePanelTemplate = function (parentMark, mark) {
                var defer = $q.defer();
                self.getPanelTemplate(parentMark).then(function (container) {
                    var oldElmSector = String.format("[qing-mark='{0}']", mark);
                    var $elm = angular.element(container);
                    $elm.find(oldElmSector).remove();
                    defer.resolve(localStorage.put(parentMark, encodeURI($elm[0].outerHTML)));
                }, function () {
                    defer.reject(arguments);
                });

                return defer.promise;
            };

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

angular.module('qing.template', ['common/directives/qingRootPanel/qingRootPanel.html', 'common/services/messageBox/messageBox.html', 'product/directives/qingPanel/qingPanel.html']);

angular.module("common/directives/qingRootPanel/qingRootPanel.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/directives/qingRootPanel/qingRootPanel.html",
    "<form>\n" +
    "    <qing-panel qing-mark=\"{{qingMark}}\"></qing-panel>\n" +
    "</form>");
}]);

angular.module("common/services/messageBox/messageBox.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/services/messageBox/messageBox.html",
    "<div class=\"modal-header\">\n" +
    "    <button type=\"button\" class=\"close\" ng-click=\"cancel()\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n" +
    "    <h4 class=\"modal-title\" ng-bind=\"options.title\"></h4>\n" +
    "</div>\n" +
    "<div class=\"modal-body\" ng-show=\"!!options.content\" ng-bind-html-unsafe=\"options.content\">\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button type=\"button\" class=\"btn btn-primary\" ng-hide=\"options.hideOk\" ng-click=\"ok()\"\n" +
    "            ng-disabled=\"designForm.$invalid\" ng-bind=\"options.okText || '&nbsp;OK&nbsp;'\">\n" +
    "    </button>\n" +
    "    <button type=\"button\" class=\"btn btn-warning\" ng-hide=\"options.hideCancel\" ng-bind=\"options.cancelText || 'Cancel'\"\n" +
    "            ng-click=\"cancel()\"></button>\n" +
    "</div>");
}]);

angular.module("product/directives/qingPanel/qingPanel.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("product/directives/qingPanel/qingPanel.html",
    "<div class=\"qing-panel\">\n" +
    "    <div class=\"content\"></div>\n" +
    "</div>");
}]);
