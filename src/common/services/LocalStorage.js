'use strict';

angular.module('qing')
    .service('localStorage', function Cover() {

        var KEY = 'qing.localStorage',
            data = JSON.parse(localStorage.getItem(KEY)) || {};

        var storage = function () {
            localStorage.setItem(KEY, JSON.stringify(data));
        }

        this.put = function (id, text) {
            data[id] = text;
            storage();
        };

        this.get = function (id) {
            if (data[id]) {
                return data[id];
            } else {
                return null;
            }
        }

    });
