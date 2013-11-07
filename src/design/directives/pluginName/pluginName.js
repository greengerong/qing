angular.module("qing")
    .directive("pluginName", ["$http", "$compile", "$templateCache", "$timeout", "pluginModalService", "templateService",
        function ($http, $compile, $templateCache, $timeout, pluginModalService, templateService) {
            var tplUrl = "design/directives/pluginName/pluginName.html";
            return {
                restrict: "EA",
                scope: {
                },
                link: function (scope, element, attrs) {
                    scope.pluginName = attrs.pluginName
                    scope.pluginData = scope.$eval(attrs.pluginData);

                    $http.get(tplUrl, {cache: $templateCache})
                        .success(function (tplContent) {
                            var $toolBar = $compile(tplContent.trim())(scope);
                            element.append($toolBar);
                        });

                    element.on("mouseover",function (e) {
                        $timeout(function () {
                            scope.showDesignToolBar = true;
                        });
                        element.addClass("tool-bar-hight-light");
                        e.stopPropagation();
                    }).on("mouseout", function (e) {
                            $timeout(function () {
                                scope.showDesignToolBar = false;
                            });
                            element.removeClass("tool-bar-hight-light");
                            e.stopPropagation();
                        });

                    scope.designeCallBack = function (pluginName, result) {
                        element.replaceWith(angular.element($compile(result)(scope)));
                        templateService.savePanelTemplate(attrs.qingMark, result);
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
