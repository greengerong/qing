'use strict';

angular.module('qing', ["qing.template", 'ui.bootstrap', 'ngmodel.format', 'green.inputmask4angular'])
    .constant('panelConfig', {
        "url": "scripts/directives/qingPanel/qingPanel.html?mark={0}"
    });

