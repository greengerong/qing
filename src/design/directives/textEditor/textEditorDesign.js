angular.module("qing")
    .directive("textEditorDesign", ["pluginsService", "pluginType", "templateService", "guid",
        function (pluginsService, pluginType, templateService, guid) {
            var defaultText = "You can input any thing in there.";
            pluginsService.register("text-editor-design", {
                "title": "text editor",
                "description": "",
                "type": pluginType.CONTAINER
            });

            return {
                restrict: 'EA',
                replace: true,
                link: function (scope, element, attrs) {
                    element.attr({contenteditable: true});
                    scope.editor = scope.editor || {};
                    element.html(scope.editor.html ? scope.editor.html : defaultText);

                    var instance = CKEDITOR.inline(element[0]);

                    scope.$on("$destroy", function () {
                        instance.destroy();
                    });

                    scope.getResult = function () {
                        var html = instance.getData();
                        var qingMark = scope.editor.qingMark ? scope.editor.qingMark : guid.newId();
                        templateService.savePanelTemplate(qingMark, html);
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
                                    "html": html,
                                    "qingMark": qingMark
                                }
                            }
                        };
                    };
                }
            }
        }]);
