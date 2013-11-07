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
                            var $toolBar = $compile(tplContent.trim())(scope);
                            element.append($toolBar);
                        });

                    element.on("mouseover",function (e) {
                        $timeout(function () {
                            scope.showDesignToolBar = true;
                        });
                        element.addClass("tool-bar-hight-light");
                        e.stopPropagation();
                    }).on("mouseout", function (e) {
                            $timeout(function () {
                                scope.showDesignToolBar = false;
                            });
                            element.removeClass("tool-bar-hight-light");
                            e.stopPropagation();
                        });
                }
            }
        }
    ]);
