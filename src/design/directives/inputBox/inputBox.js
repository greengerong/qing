angular.module("qing")
    .run(["pluginsService", "pluginType", "templateService", function (pluginsService, pluginType) {
        pluginsService.register("input-box", {
            "title": "Input box",
            "description": "",
            "type": pluginType.COMPONENT,
            "events": { }
        });
    }])
    .constant("inputBoxConfig", {
        types: [
            {
                text: "default text box",
                value: "default",
                type: "text"
            },
            {
                text: "email box",
                value: "email",
                pattern: "/[a-zA-Z0-9._%-]+@[a-zA-Z0-9-]+\\.[a-zA-Z]{2,4}/"
            },
            {
                text: "currency box",
                value: "currency",
                pattern: "/^[+-]?[0-9]{1,3}(?:[0-9]*(?:[.,][0-9]{2})?|(?:,[0-9]{3})*(?:\\.[0-9]{2})?|(?:\\.[0-9]{3})*(?:,[0-9]{2})?)$/"
            },
            {
                text: "number box",
                value: "number",
                pattern: "/^[+-]?[0-9]{1,3}(?:[0-9]*(?:[.,][0-9]{2})?|(?:,[0-9]{3})*(?:\\.[0-9]+))$/"
            },
            {
                text: "url box",
                value: "url",
                pattern: "/^http://([\\w-]+\\.)+[\\w-]+(/[\\w-./?%&=]*)?$ ；^[a-zA-z]+://(w+(-w+)*)(.(w+(-w+)*))*(?S*)?$/"
            },
            {
                text: " phone box",
                value: "phone",
                pattern: "/^(\\(\\d{3,4}\\)|\\d{3,4}-)?\\d{7,8}$/"
            }
        ]
    })
    .directive("inputBox", ["templateService", "inputBoxConfig", "underscoreService",
        function (templateService, inputBoxConfig, underscoreService) {

            return {
                restrict: 'EA',
                templateUrl: "design/directives/inputBox/inputBox.html",
                replace: true,
                link: function (scope, element, attrs) {
                    scope.inputBoxConfig = inputBoxConfig;
                    scope.config = scope.config || {
                        boxType: "default"
                    };

                    scope.getResult = function () {

                        return {
                            tpl: {
                                url: "design/directives/inputBox/inputBoxResult.html",
                                data: {
                                    config: scope.config
                                }
                            },
                            data: {
                                "key": "config",
                                "data": scope.config
                            }
                        };
                    };
                },
                controller: ["$scope", function ($scope) {
                    $scope.boxTypeChange = function () {
                        var type = underscoreService.findWhere(inputBoxConfig.types, {value: $scope.config.boxType});
                        $scope.config.pattern = type.pattern;
                    };

                }]
            }
        }])
;
