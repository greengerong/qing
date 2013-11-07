'use strict';

angular.module("qing")
    .factory("underscoreService", ["$window", function ($window) {
        return $window._;
    }]);
