'use strict';

angular.module('qing')
    .directive('rowContainer', ["$compile", "gridConfig", "guid", "pluginsService", "pluginType",
        function ($compile, gridConfig, guid, pluginsService, pluginType) {
            pluginsService.register("row-container", {
                "title": "row container",
                "description": "",
                "type": pluginType.CONTAINER
            });

            return {
                templateUrl: 'design/directives/rowContainer/rowContainer.html',
                restrict: 'EA',
                replace: true,
                //if you want to pass result, you should scope:false(by default),
                //and give a getResult function.
                //It already isolate scope by modal.
                scope: false,
                link: function (scope, element, attrs) {

                },
                controller: [ "$scope", function ($scope) {
                    $scope.viewmodel = $scope.viewmodel || {
                        columnNumber: 2,
                        column: [],
                        totalColumn: gridConfig.totalColumn
                    };

                    $scope.columnNumberChange = function () {
                        var size = $scope.viewmodel.columnNumber;
                        var num = Math.floor(gridConfig.totalColumn / (size));
                        var last = num + (gridConfig.totalColumn % size);
                        var columns = [];
                        for (var i = 0; i < size - 1; i++) {
                            columns[i] = {value: num};
                        }
                        columns[size - 1] = {value: last};
                        $scope.viewmodel.column.length = 0;
                        Array.prototype.push.apply($scope.viewmodel.column, columns);
                    };

                    $scope.columnChange = function () {
                        var len = $scope.viewmodel.column.length;
                        var sum = 0;
                        for (var i = 0; i < len - 1; i++) {
                            sum += $scope.viewmodel.column[i].value;
                        }
                        $scope.viewmodel.column[len - 1].value = gridConfig.totalColumn - sum;
                    };

                    $scope.columnMaskoption = { "mask": "9", "repeat": 2, "greedy": false };

                    $scope.getResult = function () {
                        var viewmodel = $scope.viewmodel;
                        // should change;
                        //var elm = angular.element("<div row-container data-columns=" + angular.toJson($scope.viewmodel.column) + "></div>");
                        //return elm;

                        // 我觉得这部分可以直接拼接字符串，否则需要在 row-container
                        // 这个元素上加上mark 才能存储内部的模板, 而且产品环境下面也可以不关心布局的生成
//                        var html = '<div class="row row-container">';
//                        for (var i = 0, j = viewmodel.column.length; i < j; i++) {
//                            var value = viewmodel.column[i].value;
//                            html += '<div class="col-md-' + value + '">';
//                            html += '<qing-panel qing-mark="' + guid.newId() + '></qing-panel>';
//                            html += '</div>';
//                        }
//                        html += '</div>';

                        return {
                            tpl: {
                                url: "design/directives/rowContainer/rowContainerResult.html",
                                html: "",
                                data: {
                                    column: viewmodel.column
                                }
                            },
                            data: {
                                "key": "viewmodel",
                                "data": viewmodel
                            }
                        };
                    };

                }]
            };
        }]);
