angular.module("qing")
    .directive("qingPlugin", ["$http", "$compile", "$templateCache", "$timeout", "pluginModalService",
        "templateService", "messageBox", "pluginsService",
        function ($http, $compile, $templateCache, $timeout, pluginModalService, templateService, messageBox, pluginsService) {
            var tplUrl = "design/directives/pluginName/qingPlugin.html",
                toolBarHightLightClass = "tool-bar-hight-light";

            return {
                restrict: "EA",
                scope: {
                    vm: "="
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

                    scope.designeCallBack = function (pluginName, oldPluginData, result) {
                        var $parent = scope.$parent;
                        templateService.updatePanelTemplate($parent.qingMark, scope.qingMark, result).
                            then(function () {
                                var plugin = pluginsService.getPlugin(pluginName);
                                if (plugin && plugin.events && plugin.events.update) {
                                    plugin.events.update(oldPluginData, result);
                                }

                                element.replaceWith(angular.element($compile(result)($parent)));
                            });
                    };

                    scope.removePlugin = function (pluginName, pluginData) {
                        var $parent = scope.$parent;
                        templateService.removePanelTemplate($parent.qingMark, scope.qingMark)
                            .then(function () {
                                var plugin = pluginsService.getPlugin(pluginName);
                                if (plugin && plugin.events && plugin.events.remove) {
                                    plugin.events.remove(pluginData);
                                }

                                element.remove();
                                scope.$destroy();
                            });
                    };

                },
                controller: ["$scope", function ($scope) {
                    $scope.edit = function () {
                        pluginModalService.showDesignModal($scope.pluginName, $scope.pluginData)
                            .then(function (result) {
                                //OK
                                $scope.designeCallBack($scope.pluginName, $scope.pluginData, result);
                            }, function () {
                                //Cancel
                            });
                    };

                    $scope.remove = function () {
                        messageBox.confirm({title: "Remove?", content: "Are your sure remove this?"}).then(function () {
                            $scope.removePlugin($scope.pluginName, $scope.pluginData);
                        });
                    };
                }]
            }
        }
    ]);
