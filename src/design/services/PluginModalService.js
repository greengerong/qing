'use strict';

angular.module('qing')
    .service('Pluginmodalservice', [function () {
        var result;

        this.getResult = function () {
            return result;
        };

        this.setResult = function (r) {
            result = r;
        };

    }]);
