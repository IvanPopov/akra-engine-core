'use strict';

/* Services */

var docsServices = angular.module('docsServices', ['ngResource']);

docsServices.factory('Docs', ['$resource',
  function($resource){
    return $resource('data/:requested.json', {}, {
      query: {method:'GET', params:{requested:'index'}, isArray:true}
    });
  }]);