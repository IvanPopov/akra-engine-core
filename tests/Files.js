var a = {};
Include('../files/Include.js');


/********************************************
 * constructors tests
 ********************************************/
/*
 var f = new LocalFile('/test/file', 'r', function() {
 console.log('constructor with 4 arguments(str, str, func ,func) - success func: ', '[ SUCCESS ]');
 },
 function () {
 console.log('constructor with 4 arguments(str, str, func ,func) - error func: ', '[ SUCCESS ]');
 });

 var f = new LocalFile('/test/file.ext', a.io.IN|a.io.OUT, function() {
 console.log('constructor with 4 arguments(str, num, func ,func) - success func: ', '[ SUCCESS ]');
 console.log('automatic creation of a non-existent file path:', 'OK');
 },
 function () {
 console.log('constructor with 4 arguments(str, num, func ,func) - error func: ', '[ SUCCESS ]');
 });

 var f = new LocalFile('/test/file.ext', 'r+', function() {
 console.log('constructor with 4 arguments(str, str, func ,func) - success func: ', '[ SUCCESS ]');
 console.log('automatic creation of a non-existent file path:', 'OK');
 },
 function () {
 console.log('constructor with 4 arguments(str, str, func ,func) - error func: ', '[ SUCCESS ]');
 });

 */

/********************************************
 * write files
 ********************************************/
/*
 var f = new LocalFile('/test/file.ext', 'a');
 f.write('0',
 function () {
 console.log('write file:', '[ SUCCESS ]');
 },
 function () {
 console.log('write file:', '[ FAILED ]');
 });
 */
/********************************************
 * copy files
 ********************************************/
/*
 var f = new LocalFile('/test/file.ext', 'r');
 f.copy('/test/file(copy).ext',
 function () {
 console.log('copy file:', '[ SUCCESS ]');
 },
 function () {
 console.log('copy file:', '[ FAILED ]');
 });
 */
/********************************************
 * move files
 ********************************************/
/*
 var f = new LocalFile('/test/file.ext', 'r');
 f.move('/test/file(moved).ext',
 function () {
 console.log('move file:', '[ SUCCESS ]');
 },
 function () {
 console.log('move file:', '[ FAILED ]');
 });
 */
/********************************************
 * rename files
 ********************************************/
/*
 var f = new LocalFile('/test/file(moved).ext', 'r');
 f.rename('file(renamed).ext',
 function () {
 console.log('rename file:', '[ SUCCESS ]');
 },
 function () {
 console.log('rename file:', '[ FAILED ]');
 });*/


/**************************************************
 * THREAD TESTS
 ***************************************************/
/*
 var f = new a.LocalFile('/test/file.th.ext', 'r+', function() {
 console.log('constructor with 4 arguments(str, str, func ,func) - success func: ', '[ SUCCESS ]');
 },
 function () {
 console.log('constructor with 4 arguments(str, str, func ,func) - error func: ', '[ SUCCESS ]');
 });

 var f = new a.LocalFile('/test/file.th.ext', a.io.IN|a.io.OUT, function() {
 console.log('constructor with 4 arguments(str, num, func ,func) - success func: ', '[ SUCCESS ]');
 console.log('automatic creation of a non-existent file path:', 'OK');
 },
 function () {
 console.log('constructor with 4 arguments(str, num, func ,func) - error func: ', '[ SUCCESS ]');
 });
 */

/*****************************************************
 * OPEN & WRITE TESTS
 ******************************************************/

/*
 var f = new a.LocalFile('/test/file.th.ext', 'a+');
 f.open(function () {
 console.log('open with 2 arguments(func ,func) - success func: ', '[ SUCCESS ]');

 f.write('text data...', function () {
 console.log('write - success func', '[ SUCCESS ]');
 },
 function () {
 console.log('write - error func', '[ SUCCESS ]');
 });

 }, function () {
 console.log('open with 2 arguments(func ,func) - error func: ', '[ SUCCESS ]');
 });*/



/*****************************************************
 * CLEAR TEST
 ******************************************************/
/*
 var f = new a.LocalFile('/test/file.th.ext', 'a+');
 f.clear(
 function () {
 console.log('clear - success func', '[ SUCCESS ]');
 },
 function () {
 console.log('clear - error func', '[ SUCCESS ]');
 });
 */

/*****************************************************
 * SEEK & WRITE TESTS | NAME, PATH, POSTITION
 ******************************************************/
/*
 var f = new a.LocalFile('/test/file.th.ext', 'a+');
 f.write('++++', function () {
 f.seek(-1);
 console.log(f.name, f.path, f.position);
 f.write('-', function() {
 f.write('-', function() {
 console.log('seek: ', '[ SUCCESS ]');
 });
 });
 });*/
//console.log(a.LocalFile);

/*
 var f;
 f = new a.LocalFile('/test/file.th3.ext', 'r');
 f.isExists(function() {
 console.log('exists(' + this.name + '): ' + arguments[0], arguments);
 });
 f = new a.LocalFile('/test/file.th4.ext', 'r');
 f.isExists(function() {
 console.log('exists(' + this.name + '): ' + arguments[0], arguments);
 });

 f = new a.LocalFile('/test/file.th5.ext', 'r');
 f.isExists(function() {
 console.log('exists(' + this.name + '): ' + arguments[0], arguments);
 });


 f = new a.LocalFile('/test/file.th.ext', 'r+');
 f.move('/test/igor/file.th(igor udivis\').ext', function () {
 console.log('moved.');
 });

 f = new a.LocalFile('/test/file.th2.ext', 'r');
 f.isExists(function() {
 console.log('exists(' + this.name + '): ' + arguments[0], arguments);
 });
 */