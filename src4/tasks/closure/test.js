// var container = this;
// /** @const */
// var DEBUG = false;
// container['DEBUG'] = DEBUG;
// /** @const */
// var akra = akra || {};
// akra.config = akra.config || {};

// /**
//  *  @define {boolean}
//  *
//  * @type {boolean}
//  */
// akra.DEBUG = false;

// akra.testFunc = function(){
// 	console.log(10);
// }



// /** @constructor */
// akra.CTest = function(){
// 	if(akra.DEBUG){
// 		this.myProp = 2;
// 	}
// 	else {
// 		this.myProp = 3;
// 	}
// }

// akra.CTest.prototype.getMyProp = function(){
// 	return this.myProp;
// }

// akra.CTest.prototype['getMyProp'] = akra.CTest.prototype.getMyProp;



// akra.config.DEBUG = akra.DEBUG;

// //** @expose */
// akra.testObj = new akra.CTest();
// container['akra']['testObj'] = akra.testObj;

// function fTest_(){
// 	var c = new akra.CTest;
// 	console.log(c.getMyProp());

// 	if(akra.config.DEBUG){
// 		console.log(10);
// 	}
// }

// //fTest_();

// var $$__akra__$$ = (container['akra'] = container['akra'] || {});
// $$__akra__$$['DEBUG'] = akra.DEBUG;
// $$__akra__$$['CTest'] = akra.CTest;

// var $$__akra_config__$$ = ($$__akra__$$['config'] = $$__akra__$$['config'] || {});

// $$__akra__$$['fTest'] = fTest_;

var container = this;

//container['akra'] = {};
/** @const */
var akra = (container['akra'] = (container['akra'] || {})) || {};

akra.config = (container['akra']['config'] = (container['akra']['config'] || {}))|| {};

/**
 *  @define {boolean}
 *
 * @type {boolean}
 */
akra.DEBUG = false;

akra.getMyProp = function(){
	console.log(10);
}

/** 
* @constructor
* @implements {ITest}
*/
akra.CTest = function(){
	this.myProp_0 = 2;
	this.config = 2;
	if(akra.DEBUG){
		this.myProp = 2;
	}
	else {
		this.myProp = 3;
	}
}

akra.CTest.prototype.getMyProp = function(){
	akra.getMyProp();
	return this.myProp;
}

/** @constructor */
akra.CTest2 = function(){
	this.myProp_0 = 2;
	this.config = 2;
	if(akra.DEBUG){
		this.myProp = 2;
	}
	else {
		this.myProp = 3;
	}
}

akra.CTest2.prototype.getMyProp = function(){
	akra.getMyProp();
	return this.myProp;
}
akra.CTest2.prototype['getMyProp'] = akra.CTest2.prototype.getMyProp;



akra.config.DEBUG = akra.DEBUG;

/** @expose */
container['akra'].testObj = new akra.CTest();

akra.config.fTest = function(){
	var c = /*akra.config.DEBUG ? akra.testObj : */new akra.CTest;
	console.log(c.getMyProp());

	if(akra.config.DEBUG){
		console.log(10);
	}
}

container['akra']['config']['fTest'] = akra.config.fTest;

//fTest_();
container['akra']['CTest'] = akra.CTest;


container['akra']['CTest2'] = akra.CTest2;

akra.config.fTest();

akra.getMyProp();

var c = new akra.CTest2();
c.getMyProp();


/** @type {ITestBase} */
akra.obj = {
myProp_0: 2,
config: 3
};

container['akra']['obj'] = akra.obj;

akra.obj2 = {
myProp_01: 2,
config: 3
};

container['akra']['obj2'] = akra.obj2;

// akra.obj.getMyProp();