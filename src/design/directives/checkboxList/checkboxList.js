angular.module("qing")
    .run(["pluginsService", "pluginType", "templateService", function (pluginsService, pluginType) {
        pluginsService.register("checkbox-list", {
            "title": "Checkbox List",
            "description": "",
            "type": pluginType.COMPONENT,
            "events": { }
        });
    }])
    .directive("checkboxList", [
        function () {

            return {
                restrict: 'EA',
                templateUrl: "design/directives/checkboxList/checkboxList.html",
                replace: true,
                link: function (scope, element, attrs) {

                },
                controller: ["$scope", function ($scope) {
                    $scope.config = $scope.config || {
                        group: [
                            {}
                        ]
                    };

                    $scope.remove = function (index) {
                        $scope.config.group.splice(index, 1);
                    };

                    $scope.add = function () {
                        $scope.config.group.push({});
                    };

                    $scope.getDefaultText = function (item) {
                        return item.isDefault ? "Yes" : "No";
                    };

                    $scope.getResult = function () {

                        return {
                            tpl: {
                                url: "design/directives/checkboxList/checkboxListResult.html",
                                data: {
                                    config: $scope.config
                                }
                            },
                            data: {
                                "key": "config",
                                "data": $scope.config
                            }
                        };
                    };

                }]
            }
        }])
;
