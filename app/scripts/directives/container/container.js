'use strict';

angular.module('qingApp')
    .directive('container', function () {
        return {
            restrict: 'A',
            //scope : true,
            link: function(scope, element, attrs) {


            },
            controller: [ "$scope" , function ($scope) {
                $scope.vm = {
                    'containerList': []
                };
            }]
        };
    });
