'use strict';

angular.module('qing')
    .service('templateService', ["$http", "$templateCache", "$q", "localStorage",
        function ($http, $templateCache, $q, localStorage) {
            var self = this;

            self.getPanelTemplate = function (mark) {
                // var tplUrl = String.format(panelConfig.url, mark);
                //return $http.get(tplUrl, {cache: $templateCache});
                // mock
                var defer = $q.defer();
                var data = localStorage.get(mark);
                var result = data ? decodeURI(data) : null;
                defer.resolve(result);
                return defer.promise;
            }

            self.savePanelTemplate = function (mark, html) {
                var defer = $q.defer();
                self.getPanelTemplate(mark).then(function (container) {
                    if (!container) {
                        container = "<div></div>";
                    }

                    var $elm = angular.element(container).append(angular.element(html));
                    defer.resolve(localStorage.put(mark, encodeURI($elm[0].outerHTML)));
                }, function () {
                    defer.reject(arguments);
                });

                return defer.promise;
            };

            self.updatePanelTemplate = function (parentMark, mark, html) {
                var defer = $q.defer();
                self.getPanelTemplate(parentMark).then(function (container) {
                    var oldElmSector = String.format("[qing-mark='{0}']", mark);
                    var $elm = angular.element(container);
                    $elm.find(oldElmSector).replaceWith(angular.element(html));
                    defer.resolve(localStorage.put(parentMark, encodeURI($elm[0].outerHTML)));
                }, function () {
                    defer.reject(arguments);
                });

                return defer.promise;
            };

            self.removePanelTemplate = function (parentMark, mark) {
                var defer = $q.defer();
                self.getPanelTemplate(parentMark).then(function (container) {
                    var oldElmSector = String.format("[qing-mark='{0}']", mark);
                    var $elm = angular.element(container);
                    $elm.find(oldElmSector).remove();
                    defer.resolve(localStorage.put(parentMark, encodeURI($elm[0].outerHTML)));
                }, function () {
                    defer.reject(arguments);
                });

                return defer.promise;
            };

        }]);
