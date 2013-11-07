angular.module("qing")
    .directive("pluginName", [ function () {
        return {
            restrict: "EA",
            link: function (scope, element, attrs) {
                element.wrapAll("<div class='design-XXX'></div>").parent()
                    .prepend("<div class='text-right'><a>update</a><a>delete</a></A></div>")
            }
        }
    }]);
