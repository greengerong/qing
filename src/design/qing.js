'use strict';

angular.module("qing", ["qing.template",
        "ui.bootstrap",
        "ngmodel.format",
        "green.inputmask4angular" ,
        "ui",
        "ui.select2"])
    .constant("gridConfig", {
        "totalColumn": 12
    })

