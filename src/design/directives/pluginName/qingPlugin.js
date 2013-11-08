angular.module("qing")
    .directive("qingPlugin", ["$http", "$compile", "$templateCache", "$timeout", "pluginModalService", "templateService",
        function ($http, $compile, $templateCache, $timeout, pluginModalService, templateService) {
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
                }]
            }
        }
    ]);
