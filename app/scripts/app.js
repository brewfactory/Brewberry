'use strict';

angular.module('brewpiApp', ['ngResource', 'ngRoute', 'BSTimePicker', 'Navigation', 'Notification', 'angles'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/brew', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/log', {
        templateUrl: 'views/log.html',
        controller: 'LogCtrl'
      })
      .otherwise({
        redirectTo: '/brew'
      });
  });
