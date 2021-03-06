angular.module("qing")
    .run(["pluginsService", "pluginType", "templateService", function (pluginsService, pluginType, templateService) {
        pluginsService.register("text-editor-design", {
            "title": "text editor",
            "description": "",
            "type": pluginType.CONTAINER,
            "icon": "glyphicon-text-width",
            "events": {
                "remove": function (data) {
                    var qingMark = data.data.qingMark;
                    if (qingMark) {
                        templateService.removeTextTemplate(qingMark);
                    }
                }}
        });
    }])
    .directive("textEditorDesign", ["templateService", "guid",
        function (templateService, guid) {

            return {
                restrict: 'EA',
                replace: true,
                link: function (scope, element, attrs) {
                    element.attr({contenteditable: true});
                    element.addClass("text-editor-design");
                    scope.editor = scope.editor || {};

                    var instance = CKEDITOR.inline(element[0]);

                    if (scope.editor.qingMark) {
                        templateService.getPanelTemplate(scope.editor.qingMark).then(function (tplContent) {
                            if (tplContent && (tplContent.trim())) {
                                instance.setData(tplContent.trim());
                            }
                        });
                    }


                    scope.$on("$destroy", function () {
                        instance.destroy();
                    });

                    scope.getResult = function () {
                        var html = instance.getData();
                        var qingMark = scope.editor.qingMark ? scope.editor.qingMark : guid.newId();
                        templateService.saveOrUpdateTextTemplate(qingMark, html);
                        return {
                            tpl: {
                                url: "design/directives/textEditor/textEditorDesign.html",
                                data: {
                                    html: html,
                                    qingMark: qingMark
                                }
                            },
                            data: {
                                "key": "editor",
                                "data": {
                                    "qingMark": qingMark
                                }
                            }
                        };
                    };
                }
            }
        }]);
