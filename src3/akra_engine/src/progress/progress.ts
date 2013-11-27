import angular = require("angular");
import $ = require("jquery");

var myApp = angular.module('app', []);

//myApp.controller('MyCtrl', function ($scope) {
//    $scope.caption = "Caption";
//    $scope.process = "Acquiring";
//    $scope.tip = "100kb / 200kb";
//});

export var app = myApp;

myApp.directive('progressBar', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: "tpl/progress-bar.html"
    };
});

