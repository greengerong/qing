'use strict';

angular.module("qing")
    .service("pluginModalService", ["$modal", "$templateCache", "pluginsService", "$q", "underscoreService", "guid",
        function ($modal, $templateCache, pluginsService, $q, underscoreService, guid) {
            var self = this;

            var getDesignResult = function (pluginName, result) {
                var data = result.tpl.data ? angular.copy(result.tpl.data) : {};
                data.guid = guid;

                var html = result.tpl.url ?
                    underscoreService.template($templateCache.get(result.tpl.url), data)
                    : result.html;
                var $pluginElm = angular.element(html);
                $pluginElm.attr({
                    "qing-mask": guid.newId(),
                    "plugin-data": angular.toJson(result.data),
                    "plugin-name": pluginName
                });

                return $pluginElm;
            };

            var promiseWarp = function (pluginName, modalInstance) {
                var defer = $q.defer();
                modalInstance.result.then(function (result) {
                    defer.resolve(getDesignResult(pluginName, result));
                }, function () {
                    defer.reject(arguments);
                });
                return defer.promise;
            };

            self.showDesignModal = function (pluginName) {
                var modalInstance = $modal.open({
                    templateUrl: "design/services/modal/addCont.html",
                    controller: [ "$scope", "$modalInstance" , "pluginDesigner", "$compile",
                        function ($scope, $modalInstance, pluginDesigner, $compile) {
                            var pluginScope = $scope.$new();

                            $scope.contentHtml = $compile(pluginDesigner)(pluginScope);
                            $scope.options = pluginsService.getPlugin(pluginName);
                            $scope.ok = function () {
                                var result = pluginScope.getResult && angular.isFunction(pluginScope.getResult)
                                    ? pluginScope.getResult() : null;
                                pluginScope.$destroy();
                                $modalInstance.close(result);
                            };

                            $scope.close = function () {
                                pluginScope.$destroy();
                                $modalInstance.close();
                            };

                        }],
                    resolve: {
                        "pluginDesigner": function () {
                            var attrs = {};
                            attrs[pluginName] = "";
                            var plugin = angular.element("<div></div>")
                                .attr(attrs);
                            return plugin;
                        }
                    }
                });


                return promiseWarp(pluginName, modalInstance);
            };

        }]);
