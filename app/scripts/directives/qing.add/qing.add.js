'use strict';

angular.module('qing.add', [])
    .directive('qing.add', function () {
        return {
            templateUrl: 'scripts/directives/qing.add/qing.add.html',
            restrict: 'E',
            transclude: true,
            link: function postLink(scope, element, attrs) {

                scope.addOpen = false;

                scope.toggleOpen = function(){
                    scope.addOpen = !scope.addOpen;
                };

                scope.addContainer = function(){

                };

            }
        };
    });
