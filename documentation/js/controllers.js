'use strict';

/* Controllers */

var docsControllers = angular.module('docsControllers', []);

docsControllers.controller('ModuleCtrl', ['$scope', 'Docs',
  function($scope, Docs) {
    $scope.module = Docs.query();
  }]);

docsControllers.controller('ObjectCtrl', ['$scope', '$routeParams', 'Docs',
  function($scope, $routeParams, Docs) {
    $scope.docs = Docs.get({requested: $routeParams.requested}, function(docs) {
      //$scope.mainImageUrl = phone.images[0];
    });

    /*$scope.setImage = function(imageUrl) {
      $scope.mainImageUrl = imageUrl;
    }*/
  }]);
