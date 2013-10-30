'use strict';

angular.module('qing.design')
    .filter("toQingFormName", [function () {
        return function (name) {
            return "form_" + name.replace(/[^a-zA-Z0-9_]/g, "");
        };
    }])
    .directive('qingRootPanel', ["toQingFormNameFilter", "$http", "$compile", "$templateCache",
        function (toQingFormNameFilter, $http, $compile, $templateCache) {
            return {
                restrict: 'EA',
                scope: {
                },
                link: function (scope, element, attrs) {
                    scope.qingMark = attrs.qingMark;
                    var tplUrl = 'scripts/directives/qingRootPanel/qingRootPanel.html';
                    $http.get(tplUrl, {cache: $templateCache}).success(function (tplContent) {
                        var formName = toQingFormNameFilter(scope.qingMark);
                        var formElm = angular.element(tplContent.trim()).attr("name", formName);                        
                        element.replaceWith($compile(formElm)(scope));
                        scope.currentForm = scope[formName];
                    });
                }
            };
        }]);
