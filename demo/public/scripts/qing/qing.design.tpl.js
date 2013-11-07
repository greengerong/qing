/*! qing - v0.0.0 - 2013-11-07 */
angular.module("qing", ["qing.template", "ui.bootstrap", "ngmodel.format", "green.inputmask4angular"])
    .constant("gridConfig", {
        "totalColumn": 12
    });


var qing = qing || {};

qing.qingPanelDirective = function (phase) {
    angular.module("qing")
        .directive('qingPanel', ["$compile", "TemplateService",
            function ($compile, TemplateService) {
                return {
                    templateUrl: String.format("{0}/directives/qingPanel/qingPanel.html", phase),
                    restrict: "EA",
                    replace: true,
                    scope: {
                        currentForm: "="
                    },
                    link: function (scope, element, attrs) {
                        scope.qingMark = attrs.qingMark;

                        TemplateService.getPanelTemplate(scope.qingMark).then(function (tplContent) {
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
    .service('LocalStorage', function Cover() {

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
    .service('TemplateService', ["$http", "$templateCache", "$q", "LocalStorage",
        function ($http, $templateCache, $q, LocalStorage) {


            this.getPanelTemplate = function (mark) {
                // var tplUrl = String.format(panelConfig.url, mark);
                //return $http.get(tplUrl, {cache: $templateCache});
                // mock
                var defer = $q.defer();
                defer.resolve(decodeURI(LocalStorage.get(mark)));
                return defer.promise;
            }

            this.savePanelTemplate = function (mark, html) {

                //TODO: maybe object
                if (angular.isObject(html) && html.jquery) {
                    html = html[0].outerHTML;
                }
                // mock
                var defer = $q.defer();
                defer.resolve(LocalStorage.put(mark, encodeURI(html)));
                return defer.promise;
            }

        }]);

String.format = function () {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }

    return s;
};
angular.module("qing")
    .directive("pluginName", [ function () {
        return {
            restrict: "EA",
            link: function (scope, element, attrs) {
                element.wrapAll("<div class='design-XXX'></div>").parent()
                    .prepend("<div class='text-right'><a>update</a><a>delete</a></A></div>")
            }
        }
    }]);

angular.module("qing")
    .directive("qingAdd", ["$compile", "TemplateService", "pluginModalService", "guid",
        function ($compile, TemplateService, pluginModalService, guid) {
            return {
                templateUrl: "design/directives/qingAdd/qingAdd.html",
                restrict: "EA",
                link: function (scope, element, attrs) {
                    scope.designeCallBack = function (pluginName, result) {
                        var html = result.plugin;
                        var $pluginElm = angular.element(html);
                        $pluginElm.attr({
                            "qing-mask": guid.newId(),
                            "plugin-data": angular.toJson(result.data),
                            "plugin-name": pluginName
                        });
                        angular.element($compile($pluginElm)(scope)).insertBefore(element);

                        TemplateService.savePanelTemplate(scope.qingMark, html);
                    };
                },
                controller: ["$scope", function ($scope) {
                    $scope.addOpen = false;

                    $scope.toggleOpen = function () {
                        $scope.addOpen = !$scope.addOpen;
                    };

                    $scope.addCont = function () {
                        $scope.addOpen = false;
                    };

                    $scope.addContModal = function (pluginName) {
                        $scope.addOpen = false;
                        pluginModalService.showDesignModal(pluginName)
                            .result.then(function (result) {
                                //OK
                                $scope.designeCallBack(pluginName, result);
                            }, function () {
                                //Cancel
                            });
                    };
                }]

            };
        }]);

var qing = qing || {};
qing.qingPanelDirective("design");
angular.module('qing')
    .directive('rowContainer', ["$compile", "gridConfig", "guid", "pluginsService",
        function ($compile, gridConfig, guid, pluginsService) {
            pluginsService.register("row-container", {
                "title": "row container",
                "description": ""
            });

            return {
                templateUrl: 'design/directives/rowContainer/rowContainer.html',
                restrict: 'EA',
                replace: true,
                //if you want to pass result, you should scope:false(by default),
                //and give a getResult function.
                //It already isolate scope by modal.
                scope: false,
                link: function (scope, element, attrs) {

                },
                controller: [ "$scope", function ($scope) {
                    $scope.viewmodel = $scope.viewmodel || {
                        columnNumber: 2,
                        column: [],
                        totalColumn: gridConfig.totalColumn
                    };

                    $scope.columnNumberChange = function () {
                        var size = $scope.viewmodel.columnNumber;
                        var num = Math.floor(gridConfig.totalColumn / (size));
                        var last = num + (gridConfig.totalColumn % size);
                        var columns = [];
                        for (var i = 0; i < size - 1; i++) {
                            columns[i] = {value: num};
                        }
                        columns[size - 1] = {value: last};
                        $scope.viewmodel.column.length = 0;
                        Array.prototype.push.apply($scope.viewmodel.column, columns);
                    };

                    $scope.columnChange = function () {
                        var len = $scope.viewmodel.column.length;
                        var sum = 0;
                        for (var i = 0; i < len - 1; i++) {
                            sum += $scope.viewmodel.column[i].value;
                        }
                        $scope.viewmodel.column[len - 1].value = gridConfig.totalColumn - sum;
                    };

                    $scope.columnMaskoption = { "mask": "9", "repeat": 2, "greedy": false };

                    $scope.getResult = function () {
                        // should change;
                        //var elm = angular.element("<div row-container data-columns=" + angular.toJson($scope.viewmodel.column) + "></div>");
                        //return elm;

                        // 我觉得这部分可以直接拼接字符串，否则需要在 row-container
                        // 这个元素上加上mark 才能存储内部的模板, 而且产品环境下面也可以不关心布局的生成
                        var html = '<div class="row row-container">';
                        for (var i = 0, j = $scope.viewmodel.column.length; i < j; i++) {
                            var value = $scope.viewmodel.column[i].value;
                            html += '<div class="col-md-' + value + '">';
                            html += '<qing-panel qing-mark="' + guid.newId() + '></qing-panel>';
                            html += '</div>';
                        }
                        html += '</div>';

                        return {
                            plugin: html,
                            data: $scope.viewmodel
                        };
                    };

                }]
            };
        }]);

angular.module("qing")
    .service("guid", [
        function () {
            var uid = 0;
            this.newId = function () {
                var now = new Date();
                var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
                return utc.getTime() + uid++;
            }
        }]);

angular.module("qing")
    .service("pluginModalService", ["$modal", "pluginsService",
        function ($modal, pluginsService) {

            this.showDesignModal = function (pluginName) {
                var modalInstance = $modal.open({
                    templateUrl: "design/services/modal/addCont.html",
                    controller: [ "$scope", "$modalInstance" , "pluginDesigner", "$compile",
                        function ($scope, $modalInstance, pluginDesigner, $compile) {
                            var pluginScope = $scope.$new();

                            $scope.contentHtml = $compile(pluginDesigner)(pluginScope);
                            $scope.options = pluginsService.getPlugin(pluginName);
                            $scope.ok = function () {
                                var result = pluginScope.getResult && angular.isFunction(pluginScope.getResult)
                                    ? pluginScope.getResult() : null;
                                pluginScope.$destroy();
                                $modalInstance.close(result);
                            };

                            $scope.close = function () {
                                pluginScope.$destroy();
                                $modalInstance.close();
                            };

                        }],
                    resolve: {
                        "pluginDesigner": function () {
                            var attrs = {};
                            attrs[pluginName] = "";
                            var plugin = angular.element("<div></div>")
                                .attr(attrs);
                            return plugin;
                        }
                    }
                });

                return modalInstance;
            };

        }]);

angular.module("qing").constant("pluginsConfig", {})
    .service("pluginsService", ["pluginsConfig", "$log",
        function (pluginsConfig, $log) {

            this.register = function (name, options) {
                if (pluginsConfig.hasOwnProperty(name)) {
                    $log.error(String.format("Plugin {0} already register!", name));
                    return;
                }
                pluginsConfig[name] = options;
            };

            this.getPlugin = function (name) {
                if (!pluginsConfig.hasOwnProperty(name)) {
                    $log.error(String.format("Plugin {0} does not register!", name));
                    return;
                }

                return pluginsConfig[name];
            };

        }]);

angular.module('qing.template', ['common/directives/qingRootPanel/qingRootPanel.html', 'design/directives/qingAdd/qingAdd.html', 'design/directives/qingPanel/qingPanel.html', 'design/directives/rowContainer/rowContainer.html', 'design/services/modal/addCont.html']);

angular.module("common/directives/qingRootPanel/qingRootPanel.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/directives/qingRootPanel/qingRootPanel.html",
    "<form>\n" +
    "    <qing-panel qing-mark=\"{{qingMark}}\"></qing-panel>\n" +
    "</form>");
}]);

angular.module("design/directives/qingAdd/qingAdd.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("design/directives/qingAdd/qingAdd.html",
    "<div class=\"qing-add\" ng-class=\"{'open' : addOpen}\">\n" +
    "    <div class=\"add-list\">\n" +
    "        <ul>\n" +
    "            <li><a ng-click=\"addContModal('row-container');\"><i class=\"glyphicon glyphicon-th\"></i>Container</a></li>\n" +
    "            <li><a><i class=\"glyphicon glyphicon-list-alt\"></i>Conponment</a></li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "    <a class=\"btn btn-default\" ng-click=\"toggleOpen()\">\n" +
    "        <i class=\"glyphicon glyphicon-plus\" ng-hide=\"addOpen\"></i>\n" +
    "        <i class=\"glyphicon glyphicon-chevron-down\" ng-show=\"addOpen\"></i>\n" +
    "    </a>\n" +
    "</div>");
}]);

angular.module("design/directives/qingPanel/qingPanel.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("design/directives/qingPanel/qingPanel.html",
    "<div class=\"qing-panel\" qing-drag>\n" +
    "    <div class=\"qing-panel-bar\" ng-show=\"true\">\n" +
    "        <h3>panel title</h3>\n" +
    "        <div class=\"btn-group\">\n" +
    "            <a class=\"qing-panel-edit\" title=\"edit\"><i class=\"glyphicon glyphicon-edit\"></i></a>\n" +
    "            <a class=\"qing-panel-delete\" title=\"remove\"><i class=\"glyphicon glyphicon-remove\"></i></a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"content\"></div>\n" +
    "    <qing-add></qing-add>\n" +
    "</div>");
}]);

angular.module("design/directives/rowContainer/rowContainer.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("design/directives/rowContainer/rowContainer.html",
    "<div>\n" +
    "    <div class=\"qing-modal-title\">\n" +
    "        <strong>column</strong>\n" +
    "        <input type=\"text\" ng-model=\"viewmodel.columnNumber\" input-mask=\"columnMaskoption\"\n" +
    "               ng-change=\"columnNumberChange();\"/>\n" +
    "    </div>\n" +
    "    <div class=\"row-fl\">\n" +
    "        <span ng-repeat=\"item in viewmodel.column\" ng-switch on=\"$last\">\n" +
    "           <span ng-switch-when=\"false\">\n" +
    "           	 <input type=\"text\" ng-model=\"item.value\" class=\"input\" model-format=\"int\" ng-change=\"columnChange();\"/>\n" +
    "            <span class=\"glyphicon glyphicon-plus-sign\"></span>\n" +
    "           </span>\n" +
    "           <span ng-switch-when=\"true\">\n" +
    "           	 <input type=\"text\" ng-model=\"item.value\" class=\"input\" ng-disabled=\"true\"/>\n" +
    "           </span>\n" +
    "        </span>\n" +
    "        =<span ng-bind=\"viewmodel.totalColumn\"></span>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("design/services/modal/addCont.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("design/services/modal/addCont.html",
    "<div class=\"modal-header\">\n" +
    "    <button type=\"button\" class=\"close\" ng-click=\"close()\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n" +
    "    <h4 class=\"modal-title\" ng-bind=\"options.title\"></h4>\n" +
    "\n" +
    "    <p ng-bind=\"options.description\" ng-show=\"options.description\"></p>\n" +
    "</div>\n" +
    "<div ng-form=\"designForm\" name=\"designForm\">\n" +
    "    <div class=\"modal-body\" ng-bind-html-unsafe=\"contentHtml\">\n" +
    "\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <button type=\"button\" class=\"btn btn-primary\" ng-click=\"ok()\"\n" +
    "                ng-disabled=\"designForm.$invalid\">OK\n" +
    "        </button>\n" +
    "    </div>\n" +
    "</div>");
}]);
