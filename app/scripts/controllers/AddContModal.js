'use strict';

angular.module('qingApp')
    .filter('castLast', [function () {
        return function (arr) {
            if (angular.isArray(arr)) {
                return arr.slice(0, arr.length - 1)
            }
        }
    }])
    .controller('AddContModalCtrl', [ "$scope", "$modalInstance", "gridConfig" ,"column",
        function ($scope, $modalInstance, gridConfig,column) {

            $scope.vm = column || {
                columnNumber : 2,
                column : [],
                totalColumn : gridConfig.totalColumn
            };

            $scope.$watch('vm.columnNumber', function (v) {
                var length = $scope.vm.column.length;
                if(length>=v){
                    $scope.vm.column.splice(v);
                }else{
                    //$scope.vm.column[length-1].md = null;
                    console.log();
                    for(var i=0;i<v-length;i++){
                        $scope.vm.column.push({});
                    }
                }
            });
            $scope.getValue = function () {
                if ($scope.vm.column.length) {
                    var n = $scope.vm.totalColumn;
                    for (var i = 0; i < $scope.vm.column.length - 1; i++) {
                        var mdNumber = $scope.vm.column[i].md || 0;
                        n -= mdNumber;
                    }
                    $scope.vm.column[$scope.vm.column.length - 1].md = n;
                    return n;
                }
            };
            $scope.maskoption = {
                "mask": "99",
                "oncomplete": function () {
                    console.log();
                    console.log(arguments,"oncomplete!this log form controler");
                },
                "onKeyValidation": function () {
                    console.log("onKeyValidation event happend! this log form controler");
                }
            }

            $scope.ok = function () {
               $modalInstance.close($scope.vm.column);
            };
            $scope.close = function () {
                $modalInstance.close();
            };




       }]);
