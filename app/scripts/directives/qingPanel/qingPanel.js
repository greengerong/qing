'use strict';

angular.module('qing.design')
    .directive('qingPanel', ["$compile", "panelConfig","TemplateService",
        function ($compile, panelConfig,TemplateService) {
            return {
                templateUrl: 'scripts/directives/qingPanel/qingPanel.html',
                restrict: 'EA',
                replace: true,
                scope: {
                    currentForm: "=",
                    qingMark:"@"
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
