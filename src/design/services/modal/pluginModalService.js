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
                var $pluginElm = angular.element(html.trim());
                $pluginElm.attr({
                    "plugin-data": angular.toJson(result.data),
                    "qing-plugin": pluginName,
                    "parent-qing-mark": "qing-mark",
                    "vm": "vm"
                });

                if (!$pluginElm.attr("qing-mark")) {
                    $pluginElm.attr({ "qing-mark": guid.newId()});
                }

                return $pluginElm[0].outerHTML;
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

            self.showDesignModal = function (pluginName, pluginData) {
                var modalInstance = $modal.open({
                    templateUrl: "design/services/modal/addCont.html",
                    controller: [ "$scope", "$modalInstance" , "pluginDesigner", "$compile", "$templateCache", "$http",
                        function ($scope, $modalInstance, pluginDesigner, $compile, $templateCache, $http) {
                            var pluginScope = $scope.$new();
                            if (pluginDesigner.pluginData) {
                                pluginScope[pluginDesigner.pluginData.key] = pluginDesigner.pluginData.data;
                            }

                            var pluginHtml = angular.element(pluginDesigner.plugin)[0].outerHTML;
                            var contentTplUrl = "design/services/modal/modalBody.html";
                            var modalBody = underscoreService.template($templateCache.get(contentTplUrl), {contentHtml: pluginHtml});

                            $scope.contentHtml = $compile(modalBody.trim())(pluginScope);
                            $scope.options = pluginsService.getPlugin(pluginName);
                            pluginScope.ok = function () {
                                var result = pluginScope.getResult && angular.isFunction(pluginScope.getResult)
                                    ? pluginScope.getResult() : null;
                                pluginScope.$destroy();
                                $modalInstance.close(result);
                            };

                            pluginScope.cancel = function () {
                                pluginScope.$destroy();
                                $modalInstance.dismiss('cancel');
                            };

                            $scope.ok = function () {
                                pluginScope.ok();
                            };

                            $scope.cancel = function () {
                                pluginScope.cancel();
                            };

                        }],
                    resolve: {
                        "pluginDesigner": function () {
                            var attrs = {
                                "plugin-data": angular.toJson(pluginData)
                            };
                            attrs[pluginName] = "";
                            var plugin = angular.element("<div></div>")
                                .attr(attrs);
                            return {
                                "plugin": plugin,
                                "pluginData": pluginData
                            }
                        }
                    }
                });


                return promiseWarp(pluginName, modalInstance);
            };

        }]);
