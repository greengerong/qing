angular.module("qing")
    .directive("pluginName", ["$http", "$compile", "$templateCache",
        function ($http, $compile, $templateCache) {
            var tplUrl = "design/directives/pluginName/pluginName.html";
            return {
                restrict: "EA",
                link: function (scope, element, attrs) {
                    $http.get(tplUrl, {cache: $templateCache})
                        .success(function (tplContent) {
                            element.append($compile(tplContent.trim())(scope));
                        });
                }
            }
        }
    ])
;
