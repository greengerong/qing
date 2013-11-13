angular.module("qing")
    .directive("textEditor", ["templateService",
        function (templateService) {
            return {
                restrict: 'EA',
                replace: true,
                scope: true,
                link: function (scope, element, attrs) {
                    scope.qingMark = attrs.qingMark;

                    templateService.getPanelTemplate(scope.qingMark).then(function (tplContent) {
                        if (tplContent && (tplContent.trim())) {
                            element.html(tplContent.trim());
                        }
                    });
                }
            }
        }]);
