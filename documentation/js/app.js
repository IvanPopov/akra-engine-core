var app = angular.module("docsApp", ['ngRoute']);

var keywords = ["modules","classes","functions","interfaces","enums","variables","typeDefs"];
var subobjects = ["modules","classes","functions","interfaces","enums","variables","typeDefs","constants","getters","setters"];
var systemtypes = ['string','number','bool','void','int','float','uint','any'];

app.factory('docobjects', function($location) {
	var pathtree = $location.path().split("/");
	for (var i = 0; i < pathtree.length; i++) {
		if(pathtree[i]=='')
			pathtree.splice(i,i+1);
	};

	var navs = [];
	for (var i = 0; i < pathtree.length; i++) {
		var loc = '';
		for (var j = 0; j < i; j++) {
			loc += '/'+pathtree[j];
		};
		navs.push({name:pathtree[i], type:(i!=pathtree.length-1) ? 'namespaces' : 'classes', location:loc});
	};
	return navs;
});

app.factory('templates', function() {
	return {
		navigation: '/templates/navigation-entry.html',
		treeview: '/templates/sidebar-entry.html',
		treeviewExpanded: '/templates/sidebar-entry-expanded.html',
		classView: '/templates/class-view.html',
		moduleView: '/templates/module-view.html',
		functionView: '/templates/function-view.html',
		enumView: '/templates/enum-view.html',
		interfaceView: '/templates/interface-view.html',
		nullView: '/templates/null-view.html',
	};
});

app.controller('MainCtrl', function($scope, $http, $location, docobjects) {
	$scope.currentObject = {
		name:'',
		location:'',
		path:'',
		parents:[],
		siblings:[],
		type:'',
		data: {}
	};

	function getData(path,objname,type) {
		$scope.currentObject.type = '';
		$scope.currentObject.data = {};
		if(objname == '') {
			objname = 'index';
			type = 'modules';
			$http.get(path+'/'+objname+".json")
			.success(function(data,status) {
				// console.log(objname, path, $scope.currentObject.parents, type, data);
				$scope.currentObject.type = type;
				$scope.currentObject.data = data;
			
				enableSideScroll({self:$('.j-sidebar')});
				setTimeout(setupHiders,100);
				setTimeout(alphabeticColumnSort,100);
			})
		}
		else {
			$http.get( (type == "modules") ? path+"/"+type+"/"+objname+"/"+objname+".json" : path+"/"+type+"/"+objname+".json")
			.success(function(data,status) {
				// console.log(objname, path, $scope.currentObject.parents, type, data);
				$scope.currentObject.type = type;
				$scope.currentObject.data = data;

				var hierarchy = path.replace(/data/,'').replace(/\/modules/g,'').split("/");
				for (var i = 0; i < hierarchy.length; i++) {
					if(hierarchy[i]=='')
						hierarchy.splice(i,i+1);
				};
				
				for (var i = 0; i < hierarchy.length; i++) {
					$scope.currentObject.parents.push({ name:hierarchy[i], type:'modules', location:'' });
					for (var j = 0; j < i; j++) {
						$scope.currentObject.parents[i].location += '/'+hierarchy[j];
					};
				};
			
				enableSideScroll({self:$('.j-sidebar')});

				if($scope.currentObject.type=="modules") {
					setTimeout(alphabeticColumnSort,100);
				}

				setTimeout(setupHiders,100);
				var dir=path.match(/\/[^\/]*\/?$/);

				$http.get(path+"/"+(dir ? dir[0] : 'index').replace(/\//g,"")+".json")
					.success(function(data,status) {
						for(key in data) {
							if(!(data[key] instanceof Object))
								continue;

							for(subkey in data[key]){
								$scope.currentObject.siblings.push({name:subkey, type:key, location:path.replace(/data/,'').replace(/\/modules/g,'')});
							}
						}
			
						enableSideScroll({self:$('.j-sidebar')});
						// setTimeout(setupHiders,100);
					});
			})
			.error(function(data,status) {
				if(keywords.indexOf(type) != keywords.length-1) {
					getData(path,objname,keywords[keywords.indexOf(type)+1]);
				}
				// else {
				// 	console.log(objname, path, $scope.currentObject.parents);
				// }
			});
		}
	}

	function tryFileExists() {
		var _locat = $location.path().replace(/\/+/g,'/').replace(/\/[^\/]*\/?$/, "");
		var _name = $location.path().replace(/\/+/g,'/').match(/\/[^\/]*\/?$/)[0].replace(/\//g,"");

		var objname = _name
		var location = _locat;
		var path = "data"+_locat.replace(/\//g,"/modules/");

		$scope.filtersubobjects = function(object) {
			var result = {};
			angular.forEach(object, function(val,key) {
				if((val instanceof Object) && !(val instanceof Array))
					result[key] = val;
			});
			return result;
		}

		$scope.currentObject.name = (objname!='') ? objname : 'index';
		$scope.currentObject.location = location;
		$scope.currentObject.path = path;
		$scope.currentObject.parents = [];
		$scope.currentObject.siblings = [];
		getData(path, objname, keywords[0]);
	};

	$scope.$on('$locationChangeSuccess', function() {
		tryFileExists();
		$('#search').val('');
		try_search();
	});

	$scope.currLocation = $location.path().replace(/\/[^\/]*\/?$/, "/");
	/*$scope.location = $location;
	$scope.http = $http;
	$http.get('/data/index.json').success(function(data){
		for (var key in data) {
			var membersarr = [];
			for (var subkey in data[key]) {
				membersarr.push({name:subkey, type:key});
			};
			$scope.docobjects.push(membersarr)
			$scope.docsections.push({name:key, members:membersarr});
		};
	});*/
});

app.directive('documobject', function() {
	return {
		restrict:'E',
		scope: {
			docobject: '=',
			arrow: '=',
			filtersubobjects: '=',
			isparent: '='
		}
	};
});

app.directive('navigation', function(templates) {
	return {
		replace: true,
		templateUrl: templates.navigation
	};
});

app.directive('treeview', function(templates) {
	return {
		replace: true,
		templateUrl: templates.treeview
	};
});

app.directive('treeviewExpanded', function(templates) {
	return {
		replace: true,
		templateUrl: templates.treeviewExpanded
	};
});

app.directive('classView', function(templates) {
	return {
		replace: true,
		templateUrl: templates.classView
	};
});

app.directive('moduleView', function(templates) {
	return {
		replace: true,
		templateUrl: templates.moduleView
	};
});

app.directive('functionView', function(templates) {
	return {
		replace: true,
		templateUrl: templates.functionView
	};
});

app.directive('enumView', function(templates) {
	return {
		replace: true,
		templateUrl: templates.enumView
	};
});

app.directive('interfaceView', function(templates) {
	return {
		replace: true,
		templateUrl: templates.interfaceView
	};
});

app.directive('nullView', function(templates) {
	return {
		replace: true,
		templateUrl: templates.nullView
	};
});

app.filter('toStyleType', function() {
	return function(input) {
		switch(input) {
			case 'modules':
				input = 'namespaces'
				break
			case 'variables':
				input = 'members'
				break
			default:
				break
 		}
 		return input;
	}
});

app.filter('toClassStyleType', function() {
	return function(input) {
		switch(input) {
			case 'functions':
				input = 'methods'
				break
			default:
				break
 		}
 		return input;
	}
});

app.filter('checkSystemType', function() {
	return function(input) {
		return systemtypes.indexOf(input)>=0;
	}
});

app.filter('systemTypeToLoc', function() {
	return function(input) {
		var name = input.split(".")[input.split(".").length-1];
		if (systemtypes.indexOf(name)<0) {
			return '/'+input.replace(/\./g,'/');
		}
		else {
			return null;
		}
	}
});

app.filter('locationToDocStyle', function() {
	return function(input) {
		return input.replace(/^\//,'').replace(/\//g,'.');
	}
});

app.filter('locationToUrlStyle', function() {
	return function(input) {
		return '/'+input.replace(/\./g,'/');
	}
});

app.filter('getNameFromLoc', function() {
	return function(input) {
		return input.split('.')[input.split('.').length-1];
	}
});

app.filter('makeRange', function() {
        return function(input) {
            var lowBound, highBound;
            switch (input.length) {
            case 1:
                lowBound = 0;
                highBound = parseInt(input[0]) - 1;
                break;
            case 2:
                lowBound = parseInt(input[0]);
                highBound = parseInt(input[1]);
                break;
            default:
                return input;
            }
            var result = [];
            for (var i = lowBound; i <= highBound; i++)
                result.push(i);
            return result;
        };
    });


	function navigatePath(object,path,symbol) {
		path = path.replace(/\s/g,'').replace(/\/?$/,'');
		if(path.length == 0) {
			return object;
		}

		var steps = path.split(symbol);
		var cursor = object;
		try {
			for(var i=0;i<steps.length;i++) {
				cursor = object[steps[i]];
			}
			return cursor;
		}
		catch(e) {
			return null;
		}
	}
