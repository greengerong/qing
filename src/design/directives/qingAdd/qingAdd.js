'use strict';

angular.module("qing")
    .filter('pluginType', function () {
        return function (pluginList, pluginType) {
            var plugins = {};
            angular.forEach(pluginList, function (plugin, pluginName) {
                if (plugin.type.toLocaleLowerCase() == pluginType) {
                    plugins[pluginName] = plugin;
                }
            });
            return plugins;
        }
    })
    .directive("qingAdd", ["$compile", "templateService", "pluginModalService", "pluginsService",
        function ($compile, templateService, pluginModalService, pluginsService) {
            return {
                templateUrl: "design/directives/qingAdd/qingAdd.html",
                restrict: "EA",
                scope: {
                    "qingMark": "="
                },
                link: function (scope, element, attrs) {
                    console.log(scope, scope.$parent, "qing-add");

                    scope.designCallBack = function (pluginName, html) {
                        $compile(html)(scope.$parent).insertBefore(element);
                        templateService.savePanelTemplate(scope.qingMark, html);
                    };
                },
                controller: ["$scope", function ($scope) {
                    var closeNav = function () {
                        $scope.addOpen = false;
                        $scope.subListOpen = '';
                    }

                    $scope.addOpen = false;

                    $scope.toggleOpen = function () {
                        $scope.addOpen = !$scope.addOpen;
                    };

                    $scope.pluginList = pluginsService.getAllPlugins();

                    $scope.showSubList = function (type) {
                        $scope.subListOpen = $scope.subListOpen == type ? '' : type;
                    };

                    $scope.addContModal = function (pluginName) {
                        pluginModalService.showDesignModal(pluginName)
                            .then(function (result) {
                                $scope.designCallBack(pluginName, result);
                                closeNav();
                            }, function () {
                                //Cancel
                            });
                    };
                }]

            };
        }]);
