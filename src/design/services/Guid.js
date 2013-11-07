'use strict';

angular.module("qing")
    .service("guid", [
        function () {
            var uid = 0;
            this.newId = function () {
                var now = new Date();
                var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
                return utc.getTime() + uid++;
            }
        }]);
