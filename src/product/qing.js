'use strict';

//TODO: should can be add by each design directive; Maybe use window Array
angular.module("qing", ["qing.template", "ui.bootstrap", "ngmodel.format", "green.inputmask4angular"])
    .constant('panelConfig', {
        "url": "scripts/directives/qingPanel/qingPanel.html?mark={0}"
    });

