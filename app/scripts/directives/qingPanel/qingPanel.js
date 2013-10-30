'use strict';

angular.module('qing.design')
    .directive('qingPanel', ["$compile", "panelConfig","TemplateService",
        function ($compile, panelConfig,TemplateService) {
            return {
                templateUrl: 'scripts/directives/qingPanel/qingPanel.html',
                restrict: 'EA',
                transclude: true,
                scope: {
                    currentForm: "="
                },
                link: function (scope, element, attrs) {

                    var qingMark = attrs.qingMark;

                    TemplateService.getPanelTemplate(qingMark).then(function (tplContent) {
                        if (tplContent && (tplContent.trim())) {
                            element.find(".content").replaceWith($compile(tplContent.trim())(scope));
                        }
                    });

                }
            };
        }]);
