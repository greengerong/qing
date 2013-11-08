'use strict';

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
