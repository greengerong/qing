'use strict';

angular.module("qing")
    .directive("qingAdd", ["$compile", "templateService", "pluginModalService", "guid",
        function ($compile, templateService, pluginModalService, guid) {
            return {
                templateUrl: "design/directives/qingAdd/qingAdd.html",
                restrict: "EA",
                link: function (scope, element, attrs) {
                    scope.designeCallBack = function (pluginName, result) {
                        angular.element($compile(result)(scope)).insertBefore(element);
                        templateService.savePanelTemplate(scope.qingMark, result);
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
                                $scope.designeCallBack(pluginName, result);
                            }, function () {
                                //Cancel
                            });
                    };
                }]

            };
        }]);
