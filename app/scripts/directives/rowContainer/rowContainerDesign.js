'use strict';

angular.module('qing.design')
    .directive('rowContainerDesign', ["$compile", "gridConfig",
        function ($compile, gridConfig) {
            return {
                templateUrl: 'scripts/directives/rowContainer/rowContainerDesign.html',
                restrict: 'EA',
                replace: true,
                //if you want to pass result, you should scope:false(by default),
                //and give a getResult function.
                //It already isolate scope by modal.
                scope: false,
                link: function (scope, element, attrs) {
                    
                },
                controller:[ "$scope", function($scope){
            		$scope.vm =  {
	                columnNumber : 2,
	                column : [],
	                totalColumn : gridConfig.totalColumn
            	};	        

				$scope.columnNumberChange = function(){
					var size = $scope.vm.columnNumber;
					var num = Math.floor(gridConfig.totalColumn / (size));
					var last = num + (gridConfig.totalColumn % size);
					var columns = [];
					for (var i = 0; i < size - 1; i++) {
						columns[i] = {value : num};
					}
					columns[size - 1] = {value : last};
					$scope.vm.column.length = 0;
					Array.prototype.push.apply($scope.vm.column, columns);
				};

	            $scope.columnChange = function () {	            	
	            	var len = $scope.vm.column.length;
	            	var sum = 0;
	                for(var i =0 ; i < len - 1; i++){
	                	sum += $scope.vm.column[i].value;
	                }
					$scope.vm.column[len - 1].value = gridConfig.totalColumn - sum;
	            };

                $scope.columnMaskoption = { "mask": "9", "repeat": 2, "greedy": false };

                $scope.getResult = function () {
                	//should change;
                	var elm = angular.element("<div row-container data-columns=" + angular.toJson($scope.vm.column) + "></div>");
                	return elm;
                };

                }]
            };
        }]);
