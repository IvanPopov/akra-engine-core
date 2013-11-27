define(["require", "exports", "angular", "jquery"], function(require, exports, __angular__, __$__) {
    var angular = __angular__;
    var $ = __$__;

    var myApp = angular.module('app', []);

    //myApp.controller('MyCtrl', function ($scope) {
    //    $scope.caption = "Caption";
    //    $scope.process = "Acquiring";
    //    $scope.tip = "100kb / 200kb";
    //});
    exports.app = myApp;

    myApp.directive('progressBar', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: "tpl/progress-bar.html"
        };
    });
});
//# sourceMappingURL=progress.js.map
