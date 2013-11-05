'use strict';

angular.module('qing')
    .directive('qingPanel', ["$compile", "TemplateService",
        function ($compile, TemplateService) {
            return {
                templateUrl: 'common/directives/qingPanel/qingPanel.html',
                restrict: 'EA',
                replace: true,
                scope: {
                    currentForm: "="
                },
                link: function (scope, element, attrs) {
                    scope.qingMark = attrs.qingMark;
                    TemplateService.getPanelTemplate(scope.qingMark).then(function (tplContent) {
                        if (tplContent && (tplContent.trim())) {
                            element.find(".content").replaceWith($compile(tplContent.trim())(scope));
                        }
                    });

                }
            };
        }]);
