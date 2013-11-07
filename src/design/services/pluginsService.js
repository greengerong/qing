'use strict';

angular.module("qing").constant("pluginsConfig", {})
    .service("pluginsService", ["pluginsConfig", "$log",
        function (pluginsConfig, $log) {
            var self = this;

            self.register = function (name, options) {
                if (pluginsConfig.hasOwnProperty(name)) {
                    $log.error(String.format("Plugin {0} already register!", name));
                    return;
                }
                pluginsConfig[name] = options;
            };

            self.getPlugin = function (name) {
                if (!pluginsConfig.hasOwnProperty(name)) {
                    $log.error(String.format("Plugin {0} does not register!", name));
                    return;
                }

                return pluginsConfig[name];
            };

            self.getAllPlugins = function () {
                return  pluginsConfig || {};
            };

        }]);
