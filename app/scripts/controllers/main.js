'use strict';

angular.module('qingApp')
  .controller('MainCtrl', function ($scope) {
        $scope.get = function(){
            console.log("hello");
            return 'hhh';
        };
        
    });
