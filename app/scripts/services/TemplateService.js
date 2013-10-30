'use strict';

angular.module('qing.product')
    .service('TemplateService', ["$http", "$templateCache", "panelConfig", "$q", "LocalStorage",
        function ($http, $templateCache, panelConfig, $q, LocalStorage) {

            this.getPanelTemplate = function (mark) {

                // var tplUrl = String.format(panelConfig.url, mark);
                //return $http.get(tplUrl, {cache: $templateCache});
                // mock
                // console.log(mark);
                // LocalStorage.put(mark,"<div><h1>hello from template ! mark = {{qingMark}}</h1><pre>{{ {a:1,b:'xxx'} | json}}</pre></div>");
                var defer = $q.defer();
                defer.resolve(LocalStorage.get(mark));
                return defer.promise;
            }


        }]);
