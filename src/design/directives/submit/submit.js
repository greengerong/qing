angular.module("qing")
    .run(["pluginsService", "pluginType", "templateService", function (pluginsService, pluginType) {
        pluginsService.register("submit", {
            "title": "submit",
            "description": "",
            "type": pluginType.COMPONENT,
            "events": {}
        });
    }])
    .directive("submit", [
        function () {
            return {
                restrict: 'EA',
                templateUrl: "design/directives/submit/submit.html",
                replace: true,
                controller: ["$scope", function ($scope) {
                    $scope.config = $scope.config || {
                        btnDisable: true
                    };
                    $scope.getResult = function () {
                        return {
                            tpl: {
                                url: "design/directives/submit/submitResult.html",
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
