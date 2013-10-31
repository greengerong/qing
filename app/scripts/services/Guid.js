'use strict';

angular.module('qing.design')
    .service('Guid', [
        function () {
            this.get = function (mark) {
                var now = new Date();
                var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
                return utc.getTime();
            }
        }]);
