'use strict';

angular.module('qingApp',['ui.bootstrap','ngmodel.format','qing.config','qing.add'])
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

