/*! qing - v0.0.0 - 2013-11-09 */
angular.module("qing", ["qing.template", "ui.bootstrap", "ngmodel.format", "green.inputmask4angular" ,"ui"])
    .constant("gridConfig", {
        "totalColumn": 12
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

angular.module("qing")
    .directive("textEditor", ["templateService",
        function (templateService) {
            return {
                restrict: 'EA',
                replace: true,
                scope: true,
                link: function (scope, element, attrs) {
                    scope.qingMark = attrs.qingMark;
                    element.attr({contenteditable: true});

                    var instance = CKEDITOR.inline(element[0], {
                        on: {
                            blur: function (event) {
                                if (event.editor.checkDirty()) {
                                    templateService.saveOrUpdateTextTemplate(scope.qingMark, event.editor.getData());
                                }
                            }
                        }
                    });


                    templateService.getPanelTemplate(scope.qingMark).then(function (tplContent) {
                        if (tplContent && (tplContent.trim())) {
                            instance.setData(tplContent.trim());
                        }
                    });

                    scope.$on("$destroy", function () {
                        instance.destroy();
                    });

                }
            }
        }])
;

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

            self.saveOrUpdateTextTemplate = function (mark, html) {
                var defer = $q.defer();
                defer.resolve(localStorage.put(mark, html));
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
angular.module("qing")
    .directive("qingPlugin", ["$http", "$compile", "$templateCache", "$timeout", "pluginModalService",
        "templateService", "messageBox",
        function ($http, $compile, $templateCache, $timeout, pluginModalService, templateService, messageBox) {
            var tplUrl = "design/directives/pluginName/qingPlugin.html",
                toolBarHightLightClass = "tool-bar-hight-light";

            return {
                restrict: "EA",
                scope: {
                },
                link: function (scope, element, attrs) {
                    scope.qingMark = attrs.qingMark;
                    scope.pluginName = attrs.qingPlugin
                    scope.pluginData = scope.$eval(attrs.pluginData);

                    $http.get(tplUrl, {cache: $templateCache})
                        .success(function (tplContent) {
                            var $toolBar = $compile(tplContent.trim())(scope);
                            element.prepend($toolBar);
                        });

                    element.on("mouseover",function (e) {
                        $timeout(function () {
                            scope.showDesignToolBar = true;
                        });
                        element.addClass(toolBarHightLightClass);
                        e.stopPropagation();
                    }).on("mouseout", function (e) {
                            $timeout(function () {
                                scope.showDesignToolBar = false;
                            });
                            element.removeClass(toolBarHightLightClass);
                            e.stopPropagation();
                        });

                    scope.designeCallBack = function (pluginName, result) {
                        var $parent = scope.$parent;
                        element.replaceWith(angular.element($compile(result)($parent)));
                        templateService.updatePanelTemplate($parent.qingMark, scope.qingMark, result);
                    };

                    scope.removePlugin = function () {
                        var $parent = scope.$parent;
                        templateService.removePanelTemplate($parent.qingMark, scope.qingMark);
                        element.remove();
                    };

                },
                controller: ["$scope", function ($scope) {
                    $scope.edit = function () {
                        pluginModalService.showDesignModal($scope.pluginName, $scope.pluginData)
                            .then(function (result) {
                                //OK
                                $scope.designeCallBack($scope.pluginName, result);
                            }, function () {
                                //Cancel
                            });
                    };

                    $scope.remove = function () {
                        messageBox.confirm({title: "Remove?", content: "Are your sure remove this?"}).then(function () {
                            $scope.removePlugin();
                        });
                    };
                }]
            }
        }
    ]);

angular.module("qing")
    .directive("qingAdd", ["$compile", "templateService", "pluginModalService",
        function ($compile, templateService, pluginModalService) {
            return {
                templateUrl: "design/directives/qingAdd/qingAdd.html",
                restrict: "EA",
                scope: {
                    "qingMark": "="
                },
                link: function (scope, element, attrs) {
                    scope.designCallBack = function (pluginName, html) {
                        //compile on qing-panel scope;
                        $compile(html)(scope.$parent).insertBefore(element);
                        templateService.savePanelTemplate(scope.qingMark, html);
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
                            .then(function (result) {
                                //OK
                                $scope.designCallBack(pluginName, result);
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
    .directive('rowContainer', ["$compile", "gridConfig", "guid", "pluginsService", "pluginType",
        function ($compile, gridConfig, guid, pluginsService, pluginType) {
            pluginsService.register("row-container", {
                "title": "row container",
                "description": "",
                "type": pluginType.CONTAINER
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
                        var viewmodel = $scope.viewmodel;
                        // should change;
                        //var elm = angular.element("<div row-container data-columns=" + angular.toJson($scope.viewmodel.column) + "></div>");
                        //return elm;

                        // 我觉得这部分可以直接拼接字符串，否则需要在 row-container
                        // 这个元素上加上mark 才能存储内部的模板, 而且产品环境下面也可以不关心布局的生成
//                        var html = '<div class="row row-container">';
//                        for (var i = 0, j = viewmodel.column.length; i < j; i++) {
//                            var value = viewmodel.column[i].value;
//                            html += '<div class="col-md-' + value + '">';
//                            html += '<qing-panel qing-mark="' + guid.newId() + '></qing-panel>';
//                            html += '</div>';
//                        }
//                        html += '</div>';

                        return {
                            tpl: {
                                url: "design/directives/rowContainer/rowContainerResult.html",
                                html: "",
                                data: {
                                    column: viewmodel.column
                                }
                            },
                            data: {
                                "key": "viewmodel",
                                "data": viewmodel
                            }
                        };
                    };

                }]
            };
        }]);

angular.module("qing")
    .directive("textEditorDesign", ["pluginsService", "pluginType", "templateService", "guid",
        function (pluginsService, pluginType, templateService, guid) {
            var defaultText = "You can input any thing in there.";
            pluginsService.register("text-editor-design", {
                "title": "text editor",
                "description": "",
                "type": pluginType.CONTAINER
            });

            return {
                restrict: 'EA',
                replace: true,
                link: function (scope, element, attrs) {
                    element.attr({contenteditable: true});
                    scope.editor = scope.editor || {};
                    element.html(scope.editor.html ? scope.editor.html : defaultText);

                    var instance = CKEDITOR.inline(element[0]);

                    scope.$on("$destroy", function () {
                        instance.destroy();
                    });

                    scope.getResult = function () {
                        var html = instance.getData();
                        var qingMark = scope.editor.qingMark ? scope.editor.qingMark : guid.newId();
                        templateService.savePanelTemplate(qingMark, html);
                        return {
                            tpl: {
                                url: "design/directives/textEditor/textEditorDesign.html",
                                data: {
                                    html: html,
                                    qingMark: qingMark
                                }
                            },
                            data: {
                                "key": "editor",
                                "data": {
                                    "html": html,
                                    "qingMark": qingMark
                                }
                            }
                        };
                    };
                }
            }
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
    .service("pluginModalService", ["$modal", "$templateCache", "pluginsService", "$q", "underscoreService", "guid",
        function ($modal, $templateCache, pluginsService, $q, underscoreService, guid) {
            var self = this;

            var getDesignResult = function (pluginName, result) {
                var data = result.tpl.data ? angular.copy(result.tpl.data) : {};
                data.guid = guid;

                var html = result.tpl.url ?
                    underscoreService.template($templateCache.get(result.tpl.url), data)
                    : result.html;
                var $pluginElm = angular.element(html);
                $pluginElm.attr({
                    "plugin-data": angular.toJson(result.data),
                    "qing-plugin": pluginName,
                    "parent-qing-mark": "qing-mark"
                });

                if (!$pluginElm.attr("qing-mark")) {
                    console.log($pluginElm.attr("qing-mark"), "in qing-mark")
                    $pluginElm.attr({ "qing-mark": guid.newId()});
                }

                return $pluginElm[0].outerHTML;
            };

            var promiseWarp = function (pluginName, modalInstance) {
                var defer = $q.defer();
                modalInstance.result.then(function (result) {
                    defer.resolve(getDesignResult(pluginName, result));
                }, function () {
                    defer.reject(arguments);
                });
                return defer.promise;
            };

            self.showDesignModal = function (pluginName, pluginData) {
                var modalInstance = $modal.open({
                    templateUrl: "design/services/modal/addCont.html",
                    controller: [ "$scope", "$modalInstance" , "pluginDesigner", "$compile",
                        function ($scope, $modalInstance, pluginDesigner, $compile) {
                            var pluginScope = $scope.$new();
                            if (pluginDesigner.pluginData) {
                                pluginScope[pluginDesigner.pluginData.key] = pluginDesigner.pluginData.data;
                            }
                            $scope.contentHtml = $compile(pluginDesigner.plugin)(pluginScope);
                            $scope.options = pluginsService.getPlugin(pluginName);
                            $scope.ok = function () {
                                var result = pluginScope.getResult && angular.isFunction(pluginScope.getResult)
                                    ? pluginScope.getResult() : null;
                                pluginScope.$destroy();
                                $modalInstance.close(result);
                            };

                            $scope.cancel = function () {
                                pluginScope.$destroy();
                                $modalInstance.dismiss('cancel');
                            };

                        }],
                    resolve: {
                        "pluginDesigner": function () {
                            var attrs = {
                                "plugin-data": angular.toJson(pluginData)
                            };
                            attrs[pluginName] = "";
                            var plugin = angular.element("<div></div>")
                                .attr(attrs);
                            return {
                                "plugin": plugin,
                                "pluginData": pluginData
                            }
                        }
                    }
                });


                return promiseWarp(pluginName, modalInstance);
            };

        }]);

angular.module("qing").constant("pluginsConfig", {})
    .factory("pluginType", function () {
        return {
            "CONTROL": "control",
            "CONTAINER": "container",
            "values": ["control", "container"]
        };
    })
    .service("pluginsService", ["pluginsConfig", "$log", "pluginType",
        function (pluginsConfig, $log, pluginType) {
            var self = this;

            self.register = function (name, options) {
                var pluginTypes = pluginType.values;
                if (!options.title || pluginTypes.indexOf(options.type.toLowerCase()) == -1) {
                    $log.error(String.format("Should be give title and type, also type should be in [{0}]",
                        pluginTypes.join(",")));
                    return;
                }
                if (pluginsConfig.hasOwnProperty(name)) {
                    $log.error(String.format("Plugin {0} already register!", name));
                    return;
                }
                pluginsConfig[name] = options;
            };

            self.getPlugin = function (name) {
                if (!pluginsConfig.hasOwnProperty(name)) {
                    $log.error(String.format("Plugin {0} does not register!", name));
                    return;
                }

                return pluginsConfig[name];
            };

            self.getAllPlugins = function () {
                return  pluginsConfig || {};
            };

        }]);

angular.module('qing.template', ['common/directives/qingRootPanel/qingRootPanel.html', 'common/services/messageBox/messageBox.html', 'design/directives/pluginName/qingPlugin.html', 'design/directives/qingAdd/qingAdd.html', 'design/directives/qingPanel/qingPanel.html', 'design/directives/rowContainer/rowContainer.html', 'design/directives/rowContainer/rowContainerResult.html', 'design/directives/textEditor/textEditorDesign.html', 'design/services/modal/addCont.html']);

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

angular.module("design/directives/pluginName/qingPlugin.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("design/directives/pluginName/qingPlugin.html",
    "<div class=\"qing-container\">\n" +
    "    <div class=\"design-tool-bar\" ng-show=\"showDesignToolBar\">\n" +
    "        <div class=\"btn-group\">\n" +
    "            <a class=\"qing-panel-edit\" title=\"edit\" ng-click=\"edit();\"><i class=\"glyphicon glyphicon-edit\"></i></a>\n" +
    "            <a class=\"qing-panel-delete\" title=\"remove\" ng-click=\"remove();\"><i class=\"glyphicon glyphicon-remove\"></i></a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("design/directives/qingAdd/qingAdd.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("design/directives/qingAdd/qingAdd.html",
    "<div class=\"qing-add\" ng-class=\"{'open' : addOpen}\">\n" +
    "    <div class=\"add-list\">\n" +
    "        <ul>\n" +
    "            <li><a ng-click=\"addContModal('row-container');\"><i class=\"glyphicon glyphicon-th\"></i>Container</a></li>\n" +
    "            <li><a ng-click=\"addContModal('text-editor-design');\"><i class=\"glyphicon glyphicon-th\"></i>Text Editor</a>\n" +
    "            </li>\n" +
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
    "    <!--plugin-name=\"qing-panel\" 暂时注释 是否可用有待商榷-->\n" +
    "    <div class=\"content\"></div>\n" +
    "    <qing-add qing-mark=\"qingMark\"></qing-add>\n" +
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

angular.module("design/directives/rowContainer/rowContainerResult.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("design/directives/rowContainer/rowContainerResult.html",
    "<div class=\"row row-container\" >\n" +
    "    <% _.each(column,function(col){ %>\n" +
    "    <div class=\"col-md-<%= col.value %>\">\n" +
    "        <qing-panel qing-mark=\"<%= guid.newId() %>\"></qing-panel>\n" +
    "    </div>\n" +
    "    <% });%>\n" +
    "</div>");
}]);

angular.module("design/directives/textEditor/textEditorDesign.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("design/directives/textEditor/textEditorDesign.html",
    "<div class=\"text-editor\" text-editor=\"\" qing-mark=\"<%= qingMark %>\">\n" +
    "    <%= html %>\n" +
    "</div>");
}]);

angular.module("design/services/modal/addCont.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("design/services/modal/addCont.html",
    "<div class=\"modal-header\">\n" +
    "    <button type=\"button\" class=\"close\" ng-click=\"cancel()\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n" +
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
    "                ng-disabled=\"designForm.$invalid\">&nbsp;OK&nbsp;\n" +
    "        </button>\n" +
    "        <!--<button type=\"button\" class=\"btn btn-warning\" ng-click=\"cancel()\">Cancel</button>-->\n" +
    "    </div>\n" +
    "</div>");
}]);
