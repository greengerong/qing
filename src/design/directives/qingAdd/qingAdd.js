'use strict';

angular.module("qing")
    .filter('pluginType',function(){
        return function(pluginList,pluginType){
            var plugins = [];
            angular.forEach(pluginList,function(plugin){
                if(plugin.type.toLocaleLowerCase() == pluginType){
                    plugins.push(plugin);
                }
            });
            return plugins;
        }
    })
    .directive("qingAdd", ["$compile", "templateService", "pluginModalService", "$timeout",
        function ($compile, templateService, pluginModalService, $timeout) {
            return {
                templateUrl: "design/directives/qingAdd/qingAdd.html",
                restrict: "EA",
                scope: {
                    "qingMark": "="
                },
                link: function (scope, element, attrs) {
                    scope.designCallBack = function (pluginName, html) {
                        $compile(html)(scope.$parent).insertBefore(element);
                        templateService.savePanelTemplate(scope.qingMark, html);
                    };
                },
                controller: ["$scope", function ($scope) {
                    $scope.addOpen = false;

                    $scope.toggleOpen = function () {
                        $scope.addOpen = !$scope.addOpen;
                    };

                    // from service .... 暂时还没有注册组件 先测试
                    $scope.pluginList = [
                        {
                            name:'row-container',
                            title:'Row',
                            icon:'glyphicon-th',
                            type:'container'
                        }
                    ]

                    $scope.showSubList = function (type){
                        $scope.subListOpen = $scope.subListOpen == type ? '' : type;
                    }

                    $scope.addContModal = function (pluginName) {
                        pluginModalService.showDesignModal(pluginName)
                            .then(function (result) {
                                $scope.designCallBack(pluginName, result);
                            }, function () {
                                //Cancel
                            });
                    };
                }]

            };
        }]);
