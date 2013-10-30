'use strict';

angular.module('qingApp')
    .directive('panel', function () {
        return {
            templateUrl: 'scripts/directives/panel/panel.html',
            restrict: 'A',
            transclude: true,
            scope: true,
            link: function(scope, element, attrs){
                scope.vm = {
                    'containerList': []
                };
            },
            controller: [ "$scope" , function ($scope) {

            }]
        };
    });
