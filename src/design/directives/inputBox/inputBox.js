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
                type: "text",
            },
            {
                text: "email box",
                value: "email",
                pattern: "/[a-zA-Z0-9._%-]+@[a-zA-Z0-9-]+\\.[a-zA-Z]{2,4}/"
            },
            {
                text: "currency box",
                value: "currency"
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
                        var type = underscoreService.findWhere(inputBoxConfig.types, {value: scope.config.boxType});

                        return {
                            tpl: {
                                url: "design/directives/inputBox/inputBoxResult.html",
                                data: {
//                                    mask:type.getOption()
                                    config: scope.config,
                                    type: type
                                }
                            },
                            data: {
                                "key": "config",
                                "data": scope.config
                            }
                        };
                    };
                }
            }
        }]);
