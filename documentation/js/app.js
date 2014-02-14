var app = angular.module("docsApp", ['ngRoute']);

var keywords = ["modules","classes","functions","interfaces","enums","variables","typeDefs"];
var subobjects = ["modules","classes","functions","interfaces","enums","variables","typeDefs","constants","getters","setters"];
var systemtypes = ['string','number','bool','void','int','float','uint','any','ArrayBuffer','Uint8Array'];
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
		moduleColumnView: '/templates/module-column-view.html',
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
			$http.get('http://'+location.hostname+':3000/search/'+$scope.searchText).success(function(data){
				$scope.searchResults.data = data;
				console.log($scope.searchResults.data);
			});
		},150);
	};

	$scope.displayFilter = '';

	$scope.clearSearch = function() {
		$scope.searchText='';
		$scope.search();
	}

	$scope.handleSearchInput = function($event) {
		if($event.keyCode==27)
			$scope.clearSearch();
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

	$scope.isDisplay = {
		modules: {
			modules: true,
			classes: true,
			functions: true,
			interfaces: true,
			enums: true,
			variables: true,
			typeDefs: true,
			constants: true,
		},
		classes: {
			variables: true,
			functions: true,
			getters: true,
			setters: true,
		},
		interfaces: {
			variables: true,
			functions: true,
		}
	}

	$scope.isTreeDisplay = {
		modules: {
			modules: true,
			classes: true,
			functions: true,
			interfaces: true,
			enums: true,
			variables: true,
			typeDefs: true,
			constants: true,
		},
		classes: {
			variables: true,
			functions: true,
			getters: true,
			setters: true,
		},
		interfaces: {
			variables: true,
			functions: true,
		}
	}

	$scope.isDisplaySearch = {};
	for(i in searchBlocks) {
		$scope.isDisplaySearch[searchBlocks[i]] = true;
	}

	function objectToArray(object) {
		var result = [];

		angular.forEach(object, function (val, key) {
			if ((val instanceof Object) && !(val instanceof Array)) {
				result.push({ name: key, value: val });
			}
		});

		result.sort(function(a, b) {
			return subobjects.indexOf(a.name) < subobjects.indexOf(b.name)? -1: 1;
		});

		return result;
	}

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
				$scope.currentObject.dataAsArray = objectToArray(data);

				enableSideScroll({self:$('.j-sidebar')});
				if(!$scope.isHidersSetup) {
					// setTimeout(setupHiders,100);
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
				$scope.currentObject.dataAsArray = objectToArray(data);

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
					// setTimeout(setupHiders,100);
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
	$scope.displayFilter = '';
	$scope.searchText = '';
	$scope.isShowSearchResults = false;
	tryFileExists();
});

$scope.currLocation = $location.path().replace(/\/[^\/]*\/?$/, "/");
if ($location.path().length==0) $location.path('/');
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

app.controller('ColumnDisplayCtrl', function($scope) {
	$scope.filter = function(input, prop, filter) {
		filtered=[];
		// i=0;
		for (i in input) {
		// while (i<input.length) {
			check=[];
			check[0]=!(filter[0]&&input[i][prop][0].toUpperCase()!=filter[0]);
			check[1]=!(filter[1]&&input[i][prop][1].toUpperCase()!=filter[1]);
			if (check[0]&&check[1]) {
			// if (!(check[0]&&check[1])) {
				// input.splice(i,1);
				filtered.push(input[i]);
			}
			// else i++;
		}
		return filtered;
	}
	$scope.splitPagesRowsColumns = function (array,pageSize,rowSize,columnSize) {
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
	$scope.sectiontype;
	$scope.docobject;
	$scope.pagenum=0;
	if(!$scope.rowsinpage) $scope.rowsinpage = 2;
	if(!$scope.columnsinrow) $scope.columnsinrow = 4;
	if(!$scope.entriesincolumn) $scope.entriesincolumn = 6;
	$scope.entriesinpage = $scope.rowsinpage*$scope.columnsinrow*$scope.entriesincolumn;
	$scope.columnsinpage = $scope.rowsinpage*$scope.columnsinrow;
	$scope.entriesinrow = $scope.columnsinrow*$scope.entriesincolumn;
	$scope.sectiondata;
	$scope.pagesnum = (Math.ceil($scope.sectiondata.length/$scope.entriesincolumn/$scope.columnsinrow/$scope.rowsinpage));
	$scope.rowsnum = (Math.ceil($scope.sectiondata.length/$scope.entriesincolumn/$scope.columnsinrow));
	$scope.columnsnum = (Math.ceil($scope.sectiondata.length/$scope.entriesincolumn));
	$scope.entriesnum = $scope.sectiondata.length;
	$scope.displayfilter;
	// $scope.sectiondatafiltered=$scope.filter($scope.sectiondata,'name',$scope.displayfilter);
	$scope.sectiondatasorted=$scope.splitPagesRowsColumns($scope.filter($scope.sectiondata,'name',$scope.displayfilter),$scope.rowsinpage,$scope.columnsinrow,$scope.entriesincolumn);
	$scope.$watch('displayfilter', function(newValue,oldValue) {
		$scope.sectiondatasorted=$scope.splitPagesRowsColumns($scope.filter($scope.sectiondata,'name',newValue),$scope.rowsinpage,$scope.columnsinrow,$scope.entriesincolumn);
		$scope.pagesnum = $scope.sectiondatasorted.length;
		$scope.rowsnum = ($scope.pagesnum>0 && $scope.sectiondatasorted[0])?$scope.sectiondatasorted[0].length:0;
		$scope.columnsnum = ($scope.rowsnum>0 && $scope.sectiondatasorted[0][0])?$scope.sectiondatasorted[0][0].length:0;
		// $scope.sectiondatafiltered=$scope.filter($scope.sectiondata,'name',$scope.displayfilter);
		// $scope.pagesnum = (Math.ceil($scope.sectiondatasorted.length/$scope.entriesincolumn/$scope.columnsinrow/$scope.rowsinpage));
		// $scope.rowsnum = (Math.ceil($scope.sectiondatasorted.length/$scope.entriesincolumn/$scope.columnsinrow));
		// $scope.columnsnum = (Math.ceil($scope.sectiondatasorted.length/$scope.entriesincolumn));
		$scope.pagenum=Math.min(Math.max($scope.pagenum,0),$scope.pagesnum-1);
	});
});

app.directive('modulesectionctrl', function() {
	return {
		scope: {
			displayfilter:'=',
			sectiondata:'=',
			sectiontype:'=',
			rowsinpage:'=',
			columnsinrow:'=',
			entriesincolumn:'=',
			docobject:'='
		}
	}
});

app.directive('documobject', function() {
	return {
		restrict:'E',
		scope: {
			docobject: '=',
			arrow: '=',
			filtersubobjects: '=',
			docobjectdata: '=',
			isparent: '=',
			displayfilter: '=',
			isdisplay:'=',
			istreedisplay:'=',
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
			// docobject:'=',
			displayfilter:'=',
			sectiondata:'=',
			sectiontype:'='
		}
	}
});

app.directive('modulecolumndisplay', function() {
	return {
		restrict:'E',
		scope: {
			// docobject:'=',
			displayfilter:'=',
			sectiondata:'=',
			sectiontype:'=',
			pagenum:'=',
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
		if(!input) return null;
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

app.filter('makeRangeFromNumber', function() {
	return function(input) {
		var lowBound = 0;
		var highBound = parseInt(input);
		var result = [];
		for (var i = lowBound; i < highBound; i++)
			result.push(i);
		return result;
	};
});

app.filter('notGreater', function() {
	return function(input,maxval) {
		return Math.min(parseFloat(input),maxval).toString();
	}
});

app.filter('notLess', function() {
	return function(input,minval) {
		return Math.max(parseFloat(input),minval).toString();
	}
});

app.filter('mathCeil', function() {
	return function(input) {
		return Math.ceil(parseFloat(input)).toString();
	}
});

app.filter('mathFloor', function() {
	return function(input) {
		return Math.floor(parseFloat(input)).toString();
	}
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

app.filter('variablesObjectToArray', function() {
	return function(object) {
		if(object instanceof Array) return object;
		var keys=['private','public','protected','static']
		var array = [];
		for(j in keys) {
			for(i in object[keys[j]]) {
				array.push({name:i,data:object[keys[j]][i]});
			}
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

app.filter('displayFilter', function() {
	return function(input, prop, filter) {
		filtered=[];
		for (i in input) {
			check=[];
			t=(input[i][prop][0]=='_') ? 1 : 0;
			check[0]=!(filter[0]&&input[i][prop][t].toUpperCase()!=filter[0]);
			check[1]=!(filter[1]&&input[i][prop][t+1].toUpperCase()!=filter[1]);
			if (check[0]&&check[1]) {
				filtered.push(input[i]);
			}
		}
		return filtered;
	}
});

app.filter('isDisplayFilteredEmpty', function() {
	return function(input, prop, filter) {
		visible=true;
		for (i in input) {
			check=[];
			t=(input[i][prop][0]=='_') ? 1 : 0;
			check[0]=!(filter[0]&&input[i][prop][t].toUpperCase()!=filter[0]);
			check[1]=!(filter[1]&&input[i][prop][t+1].toUpperCase()!=filter[1]);
			if (check[0]&&check[1]) {
				visible = false;
				break;
			}
		}
		return visible;
	}
});

app.filter('displayFilterString', function() {
	return function(input, filter) {
		check=[];
		t=(input[0]=='_') ? 1 : 0;
		check[0]=!(filter[0]&&input[t].toUpperCase()!=filter[0]);
		check[1]=!(filter[1]&&input[t+1].toUpperCase()!=filter[1]);
		return check[0]&&check[1];
	}
});

app.filter('filtersubobjects', function () {
	return function(input) {
		var result = {};
		for(key in input) {
			if((input[i] instanceof Object) && !(input[i] instanceof Array))
				result[key] = input[i];
		}
		return result;
	}
});

app.filter('getPrimaryLetter', function() {
	return function(input,sectiontype) {
		return (sectiontype=='enums'||sectiontype=='interfaces')
		? (input.name[0].toUpperCase()!=sectiontype[0].toUpperCase()
			?input.name[0].toUpperCase()
			:input.name[1].toUpperCase())
		:(input.name[0].toUpperCase());
	}
});