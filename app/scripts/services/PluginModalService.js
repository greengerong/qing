'use strict';

angular.module('qing.design')
  .service('Pluginmodalservice', [function () {
  	var result;
    
    this.getResult = function(){
    	return result;
    };

	this.setResult = function(r){
    	 result = r;
    };

}]);
