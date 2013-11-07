angular.module("qing")
    .directive("pluginName", ["$http", "$compile", "$templateCache", "$timeout",
        function ($http, $compile, $templateCache, $timeout) {
            var tplUrl = "design/directives/pluginName/pluginName.html";
            return {
                restrict: "EA",
                scope: {

                },
                link: function (scope, element, attrs) {
                    $http.get(tplUrl, {cache: $templateCache})
                        .success(function (tplContent) {
                            element.append($compile(tplContent.trim())(scope));
                        });
                    element.on("mouseover",function (e) {
                        $timeout(function () {
                            scope.showDesignToolBar = true;
                        });
                        e.stopPropagation();
                    }).on("mouseout", function (e) {
                            $timeout(function () {
                                scope.showDesignToolBar = false;
                            });
                            e.stopPropagation();
                        });
                }
            }
        }
    ]);
