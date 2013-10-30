'use strict';

angular.module('qingApp',['ui.bootstrap','ngmodel.format','green.inputmask4angular','qing.config','qing.add'])
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

