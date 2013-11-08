'use strict';

angular.module('qing')
    .service('localStorage', ["$window", "$log", function ($window, $log) {

        var KEY = 'qing.localStorage',
            self = this;

        var getData = function () {
            return angular.fromJson($window.localStorage.getItem(KEY)) || {};
        };

        var saveData = function (data) {
            $window.localStorage.setItem(KEY, angular.toJson(data));
        };

        self.put = function (id, text) {
            var data = getData();
            data[id] = text;
            $log.info(String.format("localStorage save data for mark {0}. ", id), data);
            saveData(data);
        };

        self.get = function (id) {
            var data = getData();
            $log.info(String.format("localStorage get data for mark {0}.", id), data);
            return data[id] ? data[id] : null;
        };
    }]);
