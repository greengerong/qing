'use strict';

angular.module('qing.product')
    .directive('rowContainer', [
        function () {
            return {
                templateUrl: 'scripts/directives/rowContainer/rowContainer.html',
                restrict: 'EA',
                replace: true,
                scope:true,
                link: function (scope, element, attrs) {
                    scope.panels = scope.$eval(attrs.columns);
                }
            };
        }]);
