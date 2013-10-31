'use strict';

angular.module('qing.design')
    .directive('qingAdd', ['$compile',"TemplateService",function ($compile,TemplateService) {
        return {
            templateUrl: 'scripts/directives/qingAdd/qingAdd.html',
            restrict: 'EA',
            link: function(scope, element, attrs) {
                scope.callBack = function(result){
                    console.log(scope.qingMark);
                    //TODO:保存原来的值
                    TemplateService.savePanelTemplate(scope.qingMark,result);
                    angular.element($compile(result)(scope)).insertBefore(element);
                };
            },
            controller: ["$scope", "$modal", function ($scope, $modal) {
                $scope.addOpen = false;
                $scope.toggleOpen = function () {
                    $scope.addOpen = !$scope.addOpen;
                };
                $scope.addCont = function () {
                    $scope.addOpen = false;
                };

                $scope.addContModal = function (pluginName) {
                    $scope.addOpen = false;
                    var modalInstance = $modal.open({
                        templateUrl: 'views/modal/addCont.html',
                        controller: 'AddContModalCtrl',
                        resolve : {
                            "plugin" : function(){
                                var attrs = {};
                                attrs[pluginName] = "";
                                var plugin =angular.element("<div></div>")
                                .attr(attrs);
                                return plugin;
                            }
                        }
                    });
                    modalInstance.result.then(function (result) {
                        //TODO: just for quickly test;
                        $scope.callBack(result);
                        // $scope.addCont(column);
                        console.log("plugin result",result);
                    }, function () {
                    });
                };
            }]

        };
    }]);
