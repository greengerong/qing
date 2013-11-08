'use strict';

angular.module("qing").constant("pluginsConfig", {})
    .factory("pluginType", function () {
        return {
            "CONTROL": "control",
            "CONTAINER": "container",
            "values": ["control", "container"]
        };
    })
    .service("pluginsService", ["pluginsConfig", "$log", "pluginType",
        function (pluginsConfig, $log, pluginType) {
            var self = this;

            self.register = function (name, options) {
                var pluginTypes = pluginType.values;
                if (!options.title || pluginTypes.indexOf(options.type.toLowerCase()) == -1) {
                    $log.error(String.format("Should be give title and type, also type should be in [{0}]",
                        pluginTypes.join(",")));
                    return;
                }
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
