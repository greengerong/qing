'use strict';

angular.module('qingApp')
    .controller('AddContModalCtrl', [ "$scope", "$modalInstance" ,"plugin","$compile","Pluginmodalservice",
        function ($scope, $modalInstance,plugin,$compile,Pluginmodalservice) {
            //isolate scope for plugin designer
            var pluginScope = $scope.$new();
            $scope.contentHtml = $compile(plugin)(pluginScope);

            $scope.ok = function () {
                var result = pluginScope.getResult && angular.isFunction(pluginScope.getResult) 
                ? pluginScope.getResult() : null;
                pluginScope.$destroy();
               $modalInstance.close(result);
            };
            
            $scope.close = function () {
                pluginScope.$destroy();
                $modalInstance.close();
            };

       }]);
