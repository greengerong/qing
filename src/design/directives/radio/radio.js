angular.module("qing")
    .run(["pluginsService", "pluginType", "templateService", function (pluginsService, pluginType) {
        pluginsService.register("radio", {
            "title": "Radio List",
            "description": "",
            "type": pluginType.COMPONENT,
            "events": { }
        });
    }])
    .directive("radio", [ "underscoreService",
        function (underscoreService) {

            return {
                restrict: 'EA',
                templateUrl: "design/directives/radio/radio.html",
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

                    $scope.getResult = function () {

                        return {
                            tpl: {
                                url: "design/directives/radio/radioResult.html",
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
