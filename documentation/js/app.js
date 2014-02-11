var app = angular.module("docsApp", ['ngRoute']);

var keywords = ["modules","classes","functions","interfaces","enums","variables","typeDefs"];
var subobjects = ["modules","classes","functions","interfaces","enums","variables","typeDefs","constants","getters","setters"];
var systemtypes = ['string','number','bool','void','int','float','uint','any'];
var searchBlocks = ['modules','interfaces','interfaceMembers','classes','classMembers','functions','enums','enumKeys','variables'];

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
		searchView: '/templates/search-view.html',
		columnView: '/templates/column-view.html',
		moduleColumnView: '/templates/column-view.html',
		moduleView: '/templates/module-view.html',
		functionView: '/templates/function-view.html',
		enumView: '/templates/enum-view.html',
		interfaceView: '/templates/interface-view.html',
		nullView: '/templates/null-view.html',
	};
});

app.controller('MainCtrl', function($scope, $http, $location, docobjects) {
	$scope.searchText='';
	$scope.lastSearchID=null;
	$scope.isShowSearchResults=false;
	$scope.toggleShowSearchResults = function() {
		if($scope.searchText.length<3) return;


		// console.log('Toggling search results');
		$scope.isShowSearchResults=!$scope.isShowSearchResults;
		if($scope.isShowSearchResults) {
			setTimeout(setupSearchbarHiders,100);
		}
		// setTimeout(alphabeticColumnSort,100);
	}
	$scope.isHidersSetup=false;

	$scope.search = function() {
		if($scope.lastSearchID) {
			clearTimeout($scope.lastSearchID);
			$scope.lastSearchID = null;
		}

		if ($scope.searchText.length < 3) {
			$scope.isShowSearchResults = false;
			return;
		}

		$scope.searchResults.name = $scope.searchText;
		$scope.lastSearchID = setTimeout(function(){
			$http.get('/search/'+$scope.searchText).success(function(data){
				$scope.searchResults.data = data;
				console.log($scope.searchResults.data);
			});
		},150);
	};

	$scope.clearSearch = function() {
		$scope.searchText='';
		$scope.search();
	}

	$scope.isSearchEmpty = function() {
		var response_check=true;
		for(i in $scope.searchResults.data) {
			if($scope.searchResults.data[i].data.length>0) {
				response_check=false;
				break;
			}
		}
		return response_check;
	};

	$scope.isPrimary = function(type) {
		return ['classMembers','interfaceMembers','enumKeys'].indexOf(type) < 0;
	}

	$scope.searchResults = {
		name:'',
		location:'search query:',
		data:[]
	}

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
				if(!$scope.isHidersSetup) {
					setTimeout(setupHiders,100);
					$scope.isHidersSetup=true;
				}
				// setTimeout(alphabeticColumnSort,100);
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
				if(!$scope.isHidersSetup) {
					setTimeout(setupHiders,100);
					$scope.isHidersSetup=true;
				}

				// if($scope.currentObject.type=="modules") {
				// 	setTimeout(alphabeticColumnSort,100);
				// }

				// setTimeout(setupHiders,100);
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
		$scope.searchText = '';
		$scope.isShowSearchResults = false;
		tryFileExists();
	});

	$scope.currLocation = $location.path().replace(/\/[^\/]*\/?$/, "/");
	$location.path('/');
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

app.directive('searchobject', function() {
	return {
		restrict:'E',
		scope: {
			docobject:'='
		}
	}
});

app.directive('columndisplay', function() {
	return {
		restrict:'E',
		scope: {
			sectiondata:'=',
			sectiontype:'='
		}
	}
});

app.directive('modulecolumndisplay', function() {
	return {
		restrict:'E',
		scope: {
			sectiondata:'=',
			sectiontype:'=',
			elementlocation:'='
		}
	}
});

app.directive('columnView', function(templates) {
	return {
		replace: true,
		templateUrl: templates.columnView,
	};
});

app.directive('moduleColumnView', function(templates) {
	return {
		replace: true,
		templateUrl: templates.moduleColumnView,
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

app.directive('searchView', function(templates) {
	return {
		replace: true,
		templateUrl: templates.searchView
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
		if(!input) return '';
		
		return input.replace(/^\//,'').replace(/\//g,'.');
	}
});

app.filter('locationToUrlStyle', function() {
	return function(input) {
		if(!input || input.length==0) return '';
		return '/'+input.replace(/\./g,'/');
	}
});

app.filter('getNameFromLoc', function() {
	return function(input) {
		return input.split('.')[input.split('.').length-1];
	}
});

app.filter('isContainsKeyVal', function() {
	return function(input,key,val) {
		// console.log('isContainsKeyVal: searching '+key+' equals '+val);
		var contains=false;
		for(i in input) {
			if(input[i][key]==val&&input[i].data.length>0) {
				contains=true;
				break;
			}
		}
		return contains;
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

app.filter('isSearchObjectEmpty', function() {
	return function(object) {
		// console.log('checking search object')
		var response_check=true;
		for(i in object.data) {
			if(object.data[i].data.length>0) {
				response_check=false;
				break;
			}
		}

		return response_check;
	};
})

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

app.filter('objectToArray', function() {
	return function(object) {
		if(object instanceof Array) return object;

		var array = [];
		for(i in object) {
			array.push({name:i,data:object[i]});
		}
		return array;
	}
});

app.filter('splitPagesRowsColumns', function() {
	return function (array,pageSize,rowSize,columnSize) {
		var entriesNum = array.length;
		var colsNum = Math.ceil(entriesNum/columnSize);
		var rowsNum = Math.ceil(entriesNum/rowSize/columnSize);
		var pagesNum = Math.ceil(entriesNum/rowSize/columnSize/pageSize);
		// console.log(entriesNum,colsNum,rowsNum,pagesNum);
		var len=[];
		for(var k=0;k<pagesNum;k++) {
			len.push([]);
			// console.log("<",len,">");
			for(var i=k*pageSize;i<Math.min((k+1)*pageSize,rowsNum);i++) {
				len[k].push([]);
				// console.log("<",len,">");
				for(var j=i*rowSize;j<Math.min((i+1)*rowSize,colsNum);j++) {
					// console.log("Indexes: ",k,i,j);
					// console.log(array.slice(j*columnSize,Math.min((j+1)*columnSize,entriesNum)));
					len[k][i%pageSize].push(array.slice(j*columnSize,Math.min((j+1)*columnSize,entriesNum)));
				}
			}
		}
		return len;
	}
});