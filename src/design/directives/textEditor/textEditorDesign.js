angular.module("qing")
    .run(["pluginsService","pluginType","templateService",function(pluginsService,pluginType,templateService){
        console.log("pluginsService");
        pluginsService.register("text-editor-design", {
            "title": "text editor",
            "description": "",
            "type": pluginType.CONTAINER,
            "icon":"glyphicon-text-width",
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
            var defaultText = "You can input any thing in there.";
            return {
                restrict: 'EA',
                replace: true,
                link: function (scope, element, attrs) {
                    element.attr({contenteditable: true});
                    element.addClass("text-editor-design");
                    scope.editor = scope.editor || {};
                    element.html(scope.editor.html ? scope.editor.html : defaultText);

                    var instance = CKEDITOR.inline(element[0]);

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
                                    "html": html,
                                    "qingMark": qingMark
                                }
                            }
                        };
                    };
                }
            }
        }]);
