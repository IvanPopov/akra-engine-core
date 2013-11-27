
require.config({
 	// alias libraries paths
    paths: {
        'jquery': 'https://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min',
        'angular': 'http://ajax.googleapis.com/ajax/libs/angularjs/1.2.1/angular.min'
     },
 
     // angular does not support AMD out of the box, put it in a shim
     shim: {
         'angular': {
             exports: 'angular'
         },
         'jquery': {
             exports: 'jQuery'
         }
     },
});

require(["progress"], function (progress) {
    console.log(progress.app);
    progress.app.controller('MyCtrl', function ($scope) {
        $scope.caption = "Caption";
        $scope.process = "Acquiring";
        $scope.tip = "100kb / 200kb";
    });
    angular.bootstrap(document.body, ['app']);
});