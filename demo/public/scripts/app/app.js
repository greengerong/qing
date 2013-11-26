'use strict';

angular.module('qing.demo', ['ngRoute','qing'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .controller('MainCtrl', function ($scope) {

    }).config(['$sceProvider', function ($sceProvider) {
        $sceProvider.enabled(false);
    }]);
