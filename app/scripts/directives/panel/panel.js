'use strict';

angular.module('qingApp')
    .directive('panel', function () {
        return {
            templateUrl: 'scripts/directives/panel/panel.html',
            restrict: 'A',
            transclude: true,
            link: function(scope, element, attrs){

            },
            controller: [ "$scope" , function ($scope) {
                $scope.vm = {
                    'containerList': []
                };
            }]
        };
    });
