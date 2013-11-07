'use strict';

angular.module('qing')
    .service('templateService', ["$http", "$templateCache", "$q", "localStorage",
        function ($http, $templateCache, $q, localStorage) {


            this.getPanelTemplate = function (mark) {
                // var tplUrl = String.format(panelConfig.url, mark);
                //return $http.get(tplUrl, {cache: $templateCache});
                // mock
                var defer = $q.defer();
                defer.resolve(decodeURI(localStorage.get(mark)));
                return defer.promise;
            }

            this.savePanelTemplate = function (mark, html) {

                //TODO: maybe object
                if (angular.isObject(html) && html.jquery) {
                    html = html[0].outerHTML;
                }
                // mock
                var defer = $q.defer();
                defer.resolve(localStorage.put(mark, encodeURI(html)));
                return defer.promise;
            }

        }]);
