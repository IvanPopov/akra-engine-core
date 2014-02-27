/** @interface */
var ITestBase = function(){};
/** @type {number} */
ITestBase.prototype.myProp_0;

/** @type {number} */
ITestBase.prototype.config;


/** 
* @interface 
* @extends {ITestBase}
*/
var ITest = function(){};

/** @type {function()} */
ITest.prototype.getMyProp;