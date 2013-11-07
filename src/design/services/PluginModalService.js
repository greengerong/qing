'use strict';

angular.module("qing")
    .service("pluginModalService", ["$modal", "pluginsService",
        function ($modal, pluginsService) {

            this.showDesignModal = function (pluginName) {
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

                return modalInstance;
            };

        }]);
