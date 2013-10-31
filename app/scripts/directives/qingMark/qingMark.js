'use strict';

angular.module( 'qing.design' )
    .directive( 'qingMark', ["$compile","TemplateService" ,
        function ( $compile,TemplateService ) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {

                    TemplateService.getPanelTemplate(attrs.qingMark).then(function (tplContent) {
                        if (tplContent && (tplContent.trim())) {
                            element.find(".content").replaceWith($compile(tplContent.trim())(scope));
                        }
                    });

                }
            };
        }]);
