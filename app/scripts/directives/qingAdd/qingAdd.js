'use strict';

angular.module('qing.add', [])
    .directive('qingAdd', ['$compile',function ($compile) {
        return {
            templateUrl: 'scripts/directives/qingAdd/qingAdd.html',
            restrict: 'E',
            transclude: true,
            scope :{},
            link: function(scope, element, attrs) {

                scope.addOpen = false;

                scope.toggleOpen = function () {
                    scope.addOpen = !scope.addOpen;
                };

                scope.addCont = function (column) {

                    scope.$parent.vm.containerList.push(column);
                    console.log( scope.$parent.vm.containerList);
                    scope.addOpen = false;
                }

            },
            controller: ["$scope", "$modal", function ($scope, $modal) {

                $scope.addContModal = function () {
                    var modalInstance = $modal.open({
                        templateUrl: 'views/modal/addCont.html',
                        controller: 'AddContModalCtrl',
                        resolve : {
                            "column" : function(){
                                return null;
                            }
                        }
                    });
                    modalInstance.result.then(function (column) {
                        $scope.addCont(column);
                    }, function () {
                    });
                };
            }]

        };
    }]);
