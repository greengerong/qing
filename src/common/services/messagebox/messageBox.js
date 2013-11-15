'use strict';

angular.module("qing")
    .service("messageBox", ["$modal", "$q", function ($modal, $q) {
        var self = this;

        self.confirm = function (options) {
            var modalInstance = $modal.open({
                templateUrl: "common/services/messageBox/messageBox.html",
                controller: [ "$scope", "$modalInstance",
                    function ($scope, $modalInstance) {
                        $scope.options = options;

                        $scope.ok = function () {
                            $modalInstance.close();
                        };

                        $scope.cancel = function () {
                            $modalInstance.dismiss('cancel');
                        };

                    }]
            });

            var defer = $q.defer();
            modalInstance.result.then(function (reason) {
                defer.resolve(reason);
            }, function () {
                defer.reject(arguments);
            });
            return defer.promise;
        };

    }]);
