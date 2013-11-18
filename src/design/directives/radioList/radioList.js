angular.module("qing")
    .run(["pluginsService", "pluginType", "templateService", function (pluginsService, pluginType) {
        pluginsService.register("radio-list", {
            "title": "Radio List",
            "description": "",
            "type": pluginType.COMPONENT,
            "events": { }
        });
    }])
    .directive("radioList", [
        function () {

            return {
                restrict: 'EA',
                templateUrl: "design/directives/radioList/radioList.html",
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

                    $scope.setDefault = function (index) {
                        console.log(index);
                        var group = $scope.config.group;
                        if (group[index].isDefault) {
                            for (var i = 0; i < group.length; i++) {
                                group[i].isDefault = i === index;
                            }
                        }
                    };

                    $scope.getDefaultText = function (item) {
                        return item.isDefault ? "Yes" : "No";
                    };

                    $scope.getResult = function () {

                        return {
                            tpl: {
                                url: "design/directives/radioList/radioListResult.html",
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
