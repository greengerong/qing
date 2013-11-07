'use strict';

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
