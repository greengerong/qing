'use strict';

angular.module('qing.add', [])
    .directive('qingAdd', ['$compile',function ($compile) {
        return {
            templateUrl: 'scripts/directives/qingAdd/qingAdd.html',
            restrict: 'E',
            transclude: true,
            link: function(scope, element, attrs) {
            },
            controller: ["$scope", "$modal", function ($scope, $modal) {
                $scope.addOpen = false;
                $scope.toggleOpen = function () {
                    $scope.addOpen = !$scope.addOpen;
                };
                $scope.addCont = function (column) {
                    console.log( $scope.$parent.vm);
                    $scope.addOpen = false;
                };
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
