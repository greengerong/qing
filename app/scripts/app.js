'use strict';

angular.module('qingApp', ['ui.bootstrap', 'qing.product', 'ngmodel.format', 'green.inputmask4angular', 'qing.design'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });

