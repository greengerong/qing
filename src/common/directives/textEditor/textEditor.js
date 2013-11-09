angular.module("qing")
    .directive("textEditor", ["templateService",
        function (templateService) {
            return {
                restrict: 'EA',
                replace: true,
                scope: true,
                link: function (scope, element, attrs) {
                    scope.qingMark = attrs.qingMark;
                    element.attr({contenteditable: true});

                    var instance = CKEDITOR.inline(element[0], {
                        on: {
                            blur: function (event) {
                                if (event.editor.checkDirty()) {
                                    templateService.saveOrUpdateTextTemplate(scope.qingMark, event.editor.getData());
                                }
                            }
                        }
                    });


                    templateService.getPanelTemplate(scope.qingMark).then(function (tplContent) {
                        if (tplContent && (tplContent.trim())) {
                            instance.setData(tplContent.trim());
                        }
                    });

                    scope.$on("$destroy", function () {
                        instance.destroy();
                    });

                }
            }
        }])
;
