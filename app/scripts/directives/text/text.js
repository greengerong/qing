'use strict';

angular.module('qingApp')
    .directive('text',['Cover',function (Cover) {
        return {
            restrict: 'A',
            scope: true,
            link: function(scope, element, attrs){
                var textMaskId = element.attr("textmask") ? element.attr("textmask") : new Date().getTime();
                element.attr("textmask",textMaskId);
                element.attr("contenteditable",true);
                element.bind('input',function(){
                    console.log($(this).html());
                    Cover.pushTextCover(textMaskId,$(this).html());
                });
            },
            controller: ["$scope" , function ($scope){

            }]
        };
    }]);
