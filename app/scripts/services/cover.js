'use strict';

angular.module('qingApp')
  .service('Cover', function Cover() {
        var KEY = 'qing.cover';

        var TextCover = JSON.parse(localStorage.getItem(KEY)) || {};

        var storage = function(){
            localStorage.setItem(KEY, JSON.stringify(TextCover));
        }

        this.pushTextCover = function (id, text) {
            TextCover[id] = text;
            storage();
        };

        this.getTextCover = function(){
            return TextCover;
        }

  });
