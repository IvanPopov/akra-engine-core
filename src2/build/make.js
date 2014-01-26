// var sys 	= require('sys')
// var fs 		= require('fs');
// var exec 	= require('child_process').exec;
// var zip 	= require("node-native-zip");
// var path 	= require('path');
// var spawn 	= require('child_process').spawn;
// var stream  = require('stream');
// var prompt 	= require('prompt');
// var wrench  = require('wrench');
// //zip for resource compression
// var Zip     = require('node-zip');

// //minifiers
// var jsp     = require("uglify-js").parser;
// var pro     = require("uglify-js").uglify;


// //command line output buffer size
// //default is 10MB
// var BUFFER_SIZE = 10 * 1024 * 1024;
// var WIN_PLATFORM = !!process.platform.match(/^win/);

// function isDef(pObject) {
// 	return pObject != null;
// }

// var scanDir = function(dir, done, withFolders) {
//     var results = [];

//     fs.readdir(dir, function(err, list) {
//         if (err) return done(err);

//         var i = 0;

//         (function next() {
//             var file = list[i++];
//             if (!file) return done(null, results);
//             file = dir + '/' + file;
//             fs.stat(file, function(err, stat) {
//                 if (stat && stat.isDirectory()) {
//                     if (withFolders) {
//                         results.push({path: file, folder: true});
//                     }

//                     scanDir(file, function(err, res) {
//                         results = results.concat(res);
//                         next();
//                     }, withFolders);

//                 } else {
//                     results.push({path: file, folder: false});
//                     next();
//                 }
//             });
//         })();
//     });
// };

// var options = {
//     //target of build, core or tests
//     target: {
//         core: true,
//         tests: false
//     },
//     outputFolder: "./bin",		//output file name
//     outputFile: null,		    //output file name
//     buildDir: "./",			    //dir from witch we build
//     tempFile: "~tmp.ts",		//temprorary file name
//     baseDir: __dirname,		    //home dir for this script
//     includeDir: null,
//     capability: null,           //{STRING} constant like "ES6" for EcmaScript support, needed for TS compiler
//     testDir: null,
//     pathToTests: null,          //path to folder with tests
//     compress: false,            //use compression for final JS file [google-closure will be used]
//     files: [],
//     debug: true,                //debug or release build (DEBUG const will be used)
//     pathToTemp: null,
//     declaration: false,
//     gui: false,
//     filedrop: false,
//     filesave: false,
//     preprocess: false,
//     clean: false, //clean tests data instead build
//     listOnly: false, //list available tests
//     webglDebug: false,
//     dataDir: "./data/",
//     noConst: false,
//     /**
//      * Поиск всех файлов с комеентариями вида // стоящими не на отдельной строке
//      */
//     magicMode: false,
//     testsFormat: {nw: false, html: false, js: false}
// };


// function usage() {
//     var mesg =
//         'usage: [options] file1, file2 ....' +
//         '\n\n Available options: ';

//     //like '\n\t--target    [-t] < "ALL" | "TESTS" | "CORE" > Specify target. Default target is CORE.' +
//     params.forEach(function(opt, i) {
//        mesg += "\n\t" + "--" + opt.key.join("/") + "\t\t" +
//            (opt.shortKey? "[-" + opt.shortKey + "]": "") + " " + opt.desc;
//     });

//     console.log(mesg);
//     process.exit(1);
// }


// var params = [
//     {
//         key: ["target"],
//         shortKey: "t",
//         desc: "{ \"ALL\" | \"TESTS\" | \"CORE\" } Specify target. Default target is CORE.",
//         logic: function (key, argv) {
//             //default target = {test: false, core: true}
//             var target = options.target;

//             //argv[1] --> next arguments, file name.
//             var type = argv.shift().toUpperCase();


//             switch(type) {
//                 case "ALL":
//                     target.core = true;
//                     target.tests = true;
//                     break;
//                 case "TESTS":
//                     target.tests = true;
//                     target.core = false;
//             }
//         }
//     },
//     {
//         key: ["out"],
//         shortKey: "o",
//         desc: "{ path/to/output/[ folder | file ] } Specify output folder or file. ",
//         logic: function (key, argv) {
//             options.outputFolder = argv.shift();
//         }
//     },
//     {
//         key: ["build"],
//         shortKey: "d",
//         desc: "{ path/to/build/directory } Specify build directory. ",
//         logic: function (key, argv) {
//             options.buildDir = argv.shift();
//         }
//     },
//     {
//         key: ["tests"],
//         shortKey: "s",
//         desc: "{ path/to/tests/folder } Specify tests directory. ",
//         logic: function (key, argv) {
//             options.pathToTests = argv.shift();
//         }
//     },
//     {
//         key: ["test"],
//         shortKey: "c",
//         desc: "{ path/to/single/test } Specify test directory. ",
//         logic: function (key, argv) {
//             options.testDir = argv.shift();
//         }
//     },
//     {
//         key: ["clean"],
//         shortKey: "",
//         desc: "Clean tests data.",
//         logic: function (key, argv) {
//             options.clean = true;
//         }
//     },
//     {
//         key: ["list"],
//         shortKey: "l",
//         desc: "List all available tests.",
//         logic: function (key, argv) {
//             options.listOnly = true;
//         }
//     },
//     /** @deprecated */
//     {
//         key: ["html"],
//         shortKey: null,
//         desc: "Build tests as HTML. ",
//         logic: function (key, argv) {
//             options.testsFormat.html = true;
//         }
//     },
//     /** @deprecated */
//     {
//         key: ["nw"],
//         shortKey: null,
//         desc: "Build tests as NW.",
//         logic: function (key, argv) {
//             options.testsFormat.nw = true;
//         }
//     },
//     /** @deprecated */
//     {
//         key: ["js"],
//         shortKey: null,
//         desc: "Build tests as JS. ",
//         logic: function (key, argv) {
//             options.testsFormat.js = true;
//         }
//     },
//     {
//         key: ["help"],
//         shortKey: "h",
//         desc: "Print this text.",
//         logic: usage
//     },
//     {
//         key: ["ES6"],
//         shortKey: null,
//         desc: "Activate ecmascript 6 capability.",
//         logic: function (key, argv) {
//             options.capability = "ES6";
//         }
//     },
//     {
//         key: ["compress"],
//         shortKey: "z",
//         desc: "Compress output javascript.",
//         logic: function (key, argv) {
//             options.compress = true;
//         }
//     },
//     {
//         key: ["debug"],
//         shortKey: null,
//         desc: "Debug build.",
//         logic: function (key, argv) {
//             options.debug = true;
//         }
//     },
//     {
//         key: ["no-debug", "release"],
//         shortKey: null,
//         desc: "Release build.",
//         logic: function (key, argv) {
//             options.debug = false;
//         }
//     },
//     {
//         key: ["webgl-debug"],
//         shortKey: "w",
//         desc: "Add webgl debug utils.",
//         logic: function (key, argv) {
//             options.webglDebug = true;
//         }
//     },
//     {
//         key: ["do-magic"],
//         shortKey: "m",
//         desc: "It\'s wonderfull magic!(Ask Igor'!).",
//         logic: function (key, argv) {
//             options.magicMode = true;
//         }
//     },
//     {
//         key: ["declaration"],
//         shortKey: null,
//         desc: "Generates corresponding .d.ts file.",
//         logic: function (key, argv) {
//             options.declaration = true;
//         }
//     },
//     {
//         key: ["no-const"],
//         shortKey: null,
//         desc: "Do not replace constant from enum values.",
//         logic: function (key, argv) {
//             options.noConst = true;
//         }
//     },
//     {
//         key: ["gui"],
//         shortKey: null,
//         desc: "Define GUI macro",
//         logic: function (key, argv) {
//             options.gui = true;
//         }
//     },
//     {
//         key: ["filedrop-api"],
//         shortKey: null,
//         desc: "Define FILEDROP_API macro.",
//         logic: function (key, argv) {
//             options.filedrop = true;
//         }
//     },
//     {
//         key: ["filesave-api"],
//         shortKey: null,
//         desc: "Define FILESAVE_API macro.",
//         logic: function (key, argv) {
//             options.filesave = true;
//         }
//     },
//     {
//         key: ["preprocess"],
//         shortKey: null,
//         desc: "Preprocessing only.",
//         logic: function (key, argv) {
//             options.preprocess = true;
//         }
//     }
// ];





// if (process.argv.length < 3) {
// 	usage();
// }


// //parse arguments of this script
// function parseArguments() {
//     var argv = process.argv.slice(0);

//     //first arguments is [node]
//     argv.shift();
//     //second argument is this script [make.js]
//     argv.shift();

//     while(argv.length) {
//         var arg = argv.shift();

//         //find capabtible options
//         var opts = params.filter(function(opt){
//             for (var i = 0; i < opt.key.length; ++ i) {
//                 if ("--" + opt.key[i] == arg) {
//                     return true;
//                 }
//             }

//             return "-" + opt.shortKey === arg;
//         });

//         //options not founded
//         if (opts === null || opts.length === 0) {
//             if (arg.charAt(0) == '-') {
//                 console.log("unknown arguments detected: " + arg, "\n");
//                 usage();
//             }

//             if (!arg.length || arg.match(/\s+/ig)) {
//                 break;
//             }

//             options.files.push(arg);
//         }
//         else {
//             var opt = opts[0];
//             opt.logic(arg, argv);
//         }
//     }
// }

// function verifyOptions() {
// 	if (options.outputFile) {
// 		options.outputFile = path.normalize(options.outputFile);
// 	}

// 	options.outputFolder = path.normalize(options.outputFolder);
// 	options.buildDir = path.normalize(options.buildDir);

// 	options.outputFile = path.basename(options.outputFolder);
// 	options.outputFolder = path.dirname(options.outputFolder);

// 	if (!options.includeDir) {
// 		options.includeDir = "inc/";
// 	}

//     //default is html
//     var formats = options.testsFormat;
// 	if (!formats.html && !formats.nw && !formats.js) {
//         formats.html = true;
// 	}

//     //use default output file
// 	if (options.outputFile == null || options.outputFile == "") {
// 		var ext = ".out.js";

// 		if (options.declaration) {
// 			ext = ".d.ts";
// 		}

// 		if (options.preprocess) {
// 			ext = ".ts";
// 		}

// 		options.outputFile = options.files[0] + ext;
// 	}
// }
// /** @deprecated */
// function pwd() {
// 	var pwd = spawn("pwd");
// 	pwd.stdout.on('data', function (data) {
// 	  console.log('stdout: \n' + data);
// 	});
// }

// function preprocess() {
// 	console.log("\n> preprocessing started (" + this.process.pid + ")\n");

// 	var capabilityOptions = [
// 		// "-D inline=/**@inline*/",
// 		"-D protected=/**@protected*/",
// 		"-D const=/**@const*/var",
// 		"-D struct=class",
// 		"-D readonly=",
// 		"-D writeonly="
// 		];

// 	if (options.gui) {
// 		capabilityOptions.push("-D GUI=1");
// 		console.log("Build with GUI.");
// 	}

// 	if (options.filedrop) {
// 		capabilityOptions.push("-D FILEDROP_API=1");
// 		console.log("Build with FILEDROP API.");
// 	}

//     if (options.filesave) {
//         capabilityOptions.push("-D FILESAVE_API=1");
//         console.log("Build with FILESAVE API.");
//     }

// 	if (options.debug) {
// 		capabilityOptions.push("-D DEBUG=DEBUG");
// 		console.log("Debug build.");
// 	}
// 	else {
// 		console.log("Release build.")
// 	}

// 	var capabilityMacro = capabilityOptions.join(" ");

// 	if (options.capability == null) {
// 		capabilityMacro = "";
// 	}
// 	else {
// 		console.log("EcmaScript 6 capability enabled.");
// 	}

//     //path to mcpp preprocessor
// 	var cmd = (WIN_PLATFORM? options.baseDir + "/": "") + "mcpp";
// 	var argv = ("-P -C -e utf8 -I " + options.includeDir + " -I ./" + " -I " +
// 		options.baseDir + "/definitions/ -j -+ -W 0 -k " +
// 		capabilityMacro + " " + options.files.join(" ")).split(" ");

// 	console.log(cmd + " " + argv.join(" "));

// 	var mcpp = spawn(cmd, argv, {maxBuffer: BUFFER_SIZE});
// 	var stdout = new Buffer(BUFFER_SIZE);
// 	var totalCharacters = 0;

// 	mcpp.stdout.on('data', function (data) {
// 	  data.copy(stdout, totalCharacters);

// 	  totalCharacters += data.length;
// 	});

// 	mcpp.stderr.on('data', function (data) {
// 	  console.log('stderr: \n' + data);
// 	});

// 	mcpp.on('close', function (code) {
// 	  // console.log(stdout.slice(0, iTotalChars).toString('utf8'));
// 	  console.log('preprocessing exited with code ' + code + " " + (code != 0? "(failed)": "(successful)"));

// 	  if (code == 0) {
// 	  	options.pathToTemp = options.outputFolder + "/" + options.tempFile;

// 		if (options.preprocess) {
// 			fs.writeFileSync(options.outputFolder + "/" + options.outputFile, stdout.slice(0, totalCharacters).toString('utf8'), "utf8");
// 			console.log("preprocessed to: ", options.outputFolder + "/" + options.outputFile);
// 		}
// 		else {
// 			console.log("preprocessed to: ", options.pathToTemp);
// 			fs.writeFileSync(options.pathToTemp, stdout.slice(0, totalCharacters), "utf8");
// 			compile();
// 		}
// 	  }
// 	});
// }

// function compress(file, callback) {
// 	//console.log(">>>>>>>>>>>>>>>>>>>>>>>");
//     callback = callback || function (err) {
//         if (err) {
//             throw err;
//             process.exit(1);
//         }
//     }
	
// 	var cmd = "java";
//     var outputPath = file + ".min";
// 	var argv = (
// 		"-jar " + 
// 		options.baseDir + "/compiler.jar " +
// 		file +
// 		//" --warning_level=VERBOSE " + 
// 		" --js_output_file " + outputPath +
// 		" --language_in=ECMASCRIPT5_STRICT" + 
// 		// " --compilation_level=ADVANCED_OPTIMIZATIONS" + 
// 		""
// 		).split(" ");


// 	var closure = spawn(cmd, argv, { maxBuffer: BUFFER_SIZE,  stdio: 'inherit' });

//     console.log(cmd + " " + argv.join(" "));

// 	closure.on('exit', function (code) {
// 		console.log('compression exited with code ' + code + " " + (code != 0? "(failed)": "(successful)"));

// 		if (code == 0) {
// 		  	console.log("compressed to: ", file);
//             callback(null, outputPath);
// 		}
// 		else {
// 			console.log("TODO: REMOVE TEMP COMPRESSED FILE >> ");
//             callback(new Error("code: " + code));
//         }
// 	});
// }

// function compile(callback) {
//     callback = callback || function (err) {
//         if (err) {
//             throw err;
//             process.exit(1);
//         }
//     }

// 	console.log("\n> compilation started (" + this.process.pid + ")  \n");

// 	var cmd = "node";
// 	var outputFolder = options.outputFolder + "/" + (options.debug? "DEBUG": "RELEASE");
// 	var outputFile = outputFolder + "/" + options.outputFile;

// 	wrench.mkdirSyncRecursive(outputFolder, 0777);

// 	var argv = (  
// 		options.baseDir + "/tsc.js -c --target ES5  " +
// 		options.baseDir + "/definitions/fixes.d.ts " +
// 		// options.buildDir + "/bin/RELEASE/akra.d.ts " +
// 		//options.baseDir + "/WebGL.d.ts " +
// 		options.pathToTemp + " --out " +
// 		outputFile +
// 		// (options.compress? " --comments --jsdoc ": "") +
// 		(options.declaration? " --declaration ": "") +
// 		" --cflowu " + (!options.noConst? " --const ": "")).replace(/\s+/ig, " ").split(" ");

// 	console.log((cmd + " " + argv.join(" ")));//.split(" ")
    
// 	var node = spawn(cmd, argv, { maxBuffer: BUFFER_SIZE, stdio: 'inherit' });

// 	node.on('exit', function (code) {
// 	  console.log('compilation exited with code ' + code + " " + (code != 0? "(failed)": "(successful)"));

// 	  if (code == 0) {
// 	  	console.log("compiled to: ", outputFile);

// 		fs.unlink(options.pathToTemp, function (err) {
// 			if (err && fs.existsSync(options.pathToTemp)) {
// 				return callback(err);
// 			}

// 			console.log("temp file: " + options.pathToTemp + " removed.\n\n");

// 			var fetchResult = {
//                 css: [],
//                 script: [],
//                 data: null
//             };
			
// 		    var gitignore = fetchDeps(
// 		    	outputFolder,
// 		    	fs.readFileSync(outputFile, "utf-8"),
// 		    	fetchResult);


// 		    fs.writeFileSync(outputFile, fetchResult.data, "utf-8");

// 			if (options.compress) {
// 				compress(outputFile, function(err, file) {
//                     if (err) {
//                         return callback(err);
//                     }
//                     else {
//                         callback(null, file, gitignore);
//                     }
//                 });
// 			}
//             else {
//                 callback(null, outputFile, gitignore);
//             }
// 		});
// 	  }
// 	  else {
//         callback(new Error("preproces failed with code: " + code));
// 	  }
// 	});

// }

// function doMagic() {

// 	scanDir(options.includeDir, function (err, files) {
// 		for (var i in files) {
// 			var file = files[i].path;
// 			if (path.extname(file).toLowerCase() !== ".ts") {
// 				continue;
// 			}
// 			var data = fs.readFileSync(file, "utf8");
// 			var lines = data.split("\n");

// 			var incorrectComments = [];

// 			for (var n in lines) {
// 				var line = lines[n];
// 				var pos = line.indexOf("//");
// 				if (pos != -1) {
// 					if (!line.substr(0, pos).match(/^[\s]*$/ig)) {
// 						incorrectComments.push({n: n, comment: line});
// 					}
// 				}
// 			}

// 			if (incorrectComments.length > 0) {
// 				console.log("\nfile: " + file);
// 				for (var n in incorrectComments) {
// 					console.log("\t line " + incorrectComments[n].n + ":: " + incorrectComments[n].comment);
// 				}
// 			}
// 		}

// 		process.exit(0);
// 	});
// }

// var pTestQueue = [];
// var iTestQuitMutex = 0;
// var pTestResults = [];

// function buildCore() {
// 	preprocess();
// }

// //== tests

// function buildTests(sDir) {
// 	sDir = sDir || null;

// 	var pSubFolders, sTestFile = null;

// 	if (sDir) {
// 		pSubFolders = (sDir.split('/'));
// 		if (pSubFolders[pSubFolders.length - 1].split(".").length > 1) {
// 			//если мы хотим собрать конкретный тест а не все тесты в папке
// 			sTestFile = pSubFolders.pop();
// 			sDir = pSubFolders.join("/");
// 		}

// 		if (sDir[sDir.length - 1] === "/") {
// 			sDir = sDir.substr(0, sDir.length - 1);
// 		}
// 	}

// 	fs.readdir(options.pathToTests, function(err, list) {
//         if (err) throw (err);
        
//         list.forEach(function(sFile) {
//         	sFile = options.pathToTests + "/" + sFile;

//             fs.stat(sFile, function(err, stat) {
//                 if (stat && stat.isDirectory()) {

//                 	if (sDir == null || sDir == sFile) {
//                 		addTestDirectory(sFile, sTestFile);
//                 	}
//                 }
//             });
//         });

//     });
// }

// function printTestResultTable() {
// 	console.log("\n-----------------------");
// 	pTestResults.forEach(function(pResult, i) {
// 		console.log(i + ". " + pResult.name + ' ( ' + pResult.file + ' ) : ' + (pResult.result == false? 'failed': 'successful'));
// 	})
// }

// function createTestName(sEntryFileName) {
// 	var sFileName = path.basename(sEntryFileName);
// 	var i = sFileName.lastIndexOf('.');
// 	return sFileName.substr(0, i);
// }



// function findDepends(sData, pDepExp) {

// 	var pMatches = null;
// 	var pDeps = [];

// 	while (pMatches = pDepExp.exec(sData)) {
// 		pDeps.push([pMatches[1], pMatches[2]]);
// 	}

// 	return pDeps;
// }


// /**
//  * Copy file/directory from argv[0] to {value}
//  */
// function srcModifier(name, value, argv) {
// 	if (argv.length != 1) {
// 		throw Error("copy modifier must have a path param");
// 	}

// 	var gitignore = [];

// 	if (fs.existsSync(argv[0])) {
// 		stat = fs.statSync(argv[0]);
// 		if (stat.isDirectory()) {
// 			console.log("[copy directory]", argv[0], "-->", value);
// 			wrench.copyDirSyncRecursive(path.resolve(argv[0]), path.resolve(value));
// 			gitignore.push(value + "/");
// 		}
// 		else {
// 			var sFile = fs.readFileSync(argv[0], "utf-8");
// 			console.log("[copy file]", argv[0], "-->", value);
// 			fs.writeFileSync(value, sFile, "utf-8");
// 			gitignore.push(value);
// 		}
// 	}
// 	else {
// 		console.warn("[WARNING] could not find file for copy:", argv[0]);
// 	}

// 	return gitignore.join("\n");
// }

// /**
//  * replace path in {value} to relative to {akra.DATA} value
//  * name - name of variable
//  * value - value of virable
//  */
// function dataLocModifier(name, value, argv) {
// 	var result = (/*argv[1] || */"akra.DATA") + " + \"/" + path.relative(argv[0], value).replace(/\\/ig, "/") + "\"";
// 	return result;
// }

// /**
//  * JSON stringify 
//  */
// function stringifyModifier(name, value, argv) {
// 	return JSON.stringify(value);
// }


// /**
//  * minify JS code in {value} param
//  */
// function minifyJsModifier(name, value, argv) {
// 	var orig_code = value;
// 	var ast = jsp.parse(orig_code); // parse code and get the initial AST
// 	ast = pro.ast_mangle(ast/*, {toplevel: true, no_functions : true}*/); // get a new AST with mangled names
// 	ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
// 	var final_code = pro.gen_code(ast, {beautify: false}); // compressed code here

// 	// console.log(value);
// 	// console.log("==============================================>");
// 	// console.log(final_code);

// 	var ratio = final_code.length / value.length;

// 	console.log("[minify JS content]", name, (ratio * 100).toFixed(2), "% compression ratio");

// 	return ratio > 1.? value: final_code;
// }

// /**
//  * Get content of file by path in {atgv[0]}
//  */
// function contentModifier(name, value, argv) {
// 	var value = fs.readFileSync(argv[0], 'utf8');
// 	return value;
// }

// /**
//  * create zip archive with files described in {argv}
//  * pack_resources(map, ...additional_files: string[]) - generate archive with resources and encode it into base64 string
//  */
// function packResourcesModifier(name, value, argv) {
// 	var archive = new Zip();
// // 	zip.file('test.file', 'hello there');
// // var data = zip.generate({base64:false,compression:'DEFLATE'});
// // console.log(data); // ugly data
// 	console.log("[pack resource]", name);

// 	var map = argv.shift();
// 	var data_folder = path.dirname(map);
// 	var map_content = fs.readFileSync(map, 'utf8');

// 	archive.file(".map", map_content);

// 	console.log("\t [add file]", map, "-->", ".map");

// 	var map_json = JSON.parse(map_content);

// 	var p = map_json;

// 	while(p) {
// 		if (p.files) {
// 			for (var i = 0; i < p.files.length; i++) {
// 				var file = p.files[i].path;
// 				var res = path.normalize(data_folder + "/" + file).replace(/\\/ig, "/");

// 				console.log("\t [add file]", res, "-->", file);
				
// 				archive.file(file, fs.readFileSync(res, 'utf8'));
// 			};
// 		}

// 		p  = p.deps;
// 	}

// 	argv.forEach(function (value, i) {
// 		var name = path.relative(data_folder, value).replace(/\\/ig, "/");

// 		if (fs.existsSync(value)) {
// 			if (fs.statSync(value).isDirectory()) {
// 				var files = wrench.readdirSyncRecursive(value);
				
// 				//files in string[] array, include directories..
// 			}
// 			else {
// 				archive.file(name, fs.readFileSync(value, 'utf8'));
// 				console.log("\t [add file]", value, "-->", name);
// 			}
// 		}
// 		else {
// 			console.error("\t [could not find file]", value, "(cwd: " + process.cwd() + ")");
// 		}
// 	});


// 	// var archive_content = archive.generate({base64: false, compression:'DEFLATE'});

// 	// fs.writeFile("~temp.zip", archive_content, "binary", function(err) {
// 	// 	if (err) throw err;
// 	// });

// 	return "data:application/octet-stream;base64," + archive.generate({base64: true, compression:'DEFLATE'});
// }

// function fetchDeps(sDir, sTestData, pResult) {
// 	var pDeps = findDepends(sTestData, /\/\/\/\s*@([\w\d]*)\s*\:\s*([\w\d\.\-\/\:\-\{\}\|\(\)\ \"\,]+)\s*/ig);//"

// 	var variables = {};
// 	var gitignore = [];
	
// 	for (var i in pDeps) {
// 		var pDep = pDeps[i];
// 		var name = pDep[0];
// 		var cmd = pDep[1];
// 		var value = null;

// 		for (var vname in variables) {
// 			var vvalue = variables[vname];
// 			cmd = cmd.replace(new RegExp("\\{\\s*" + vname + "\\s*\\}", "ig"), vvalue);
// 		}

// 		var pmods = cmd.split("|");
// 		value = pmods.splice(0, 1)[0];
// 		// console.log("@" + name, cmd);

// 		for (var m = 0; m < pmods.length; ++ m) {
// 			var mod = pmods[m];
// 			var matches = null;

// 			if (matches = (/\s*([\w]+)\(([\/\.\-\w\d\ \t\,]*)\)\s*/ig).exec(mod)) {
// 				var modifier = matches[1];
// 				var args = matches[2];
// 				var argv = args.split(/[\s]*,[\s]*/);

// 				switch (modifier.toLowerCase()) {
// 					case "src":
// 						gitignore.push(srcModifier(name, value, argv));
// 						break;
// 					case "css":
// 						pResult['css'].push(value);
// 						console.log('[dependence, style] <link rel="stylesheet" type="text/css" href="' + value + '">');
// 						break;
// 					case "script":
// 						pResult['script'].push(value);
// 						console.log('[dependence, script] <script type="text/javascript" src="' + value + '"></script>');
// 						break;
// 					case "location":
// 						value = "\"" + path.relative(sDir, value).replace(/\\/ig, "/") + "\"";
// 						break;
// 					case "data_location":
// 						value = dataLocModifier(name, value, argv);
// 						break;
// 					case "content":
// 						value = contentModifier(name, value, argv);
// 						break;
// 					case "minify":
// 						value = minifyJsModifier(name, value, argv);
// 						break;
// 					case "stringify":
// 						value = stringifyModifier(name, value, argv);
// 						break;
// 					case "pack_resources":
// 						value = packResourcesModifier(name, value, argv);
// 						break;
// 					default:
// 						console.warn("[WARNING] unknown modifier founded in deps: ", modifier, "(" + cmd + ")");
// 				}
// 			}
// 		}

// 		if (name && name.length > 0) {
// 			variables[name] = value;
// 			sTestData = sTestData.replace(new RegExp("\"@" + name + "\"", "g"), value);
// 			//console.log("[REPLACE] ", "\"@" + name + "\"" , " --> ", value.substr(0, 32) + "...");
// 		}
// 	}

// 	pResult.data = sTestData;

// 	return gitignore.join("\n");
// }


// function compileTest(sDir, sFile, sName, pData, sTestData, sFormat) {

// 	//FIXME: hack for events support
// 	//sTestData = sTestData.replace(/eval\(\"this\.\_iGuid \|\| akra\.sid\(\)\"\)/g, "this._iGuid || akra.sid()");


// 	sTestData = "\n\n\n" + 
// 		"/*---------------------------------------------\n" +
// 		" * assembled at: " + (new Date) + "\n" +
// 		" * directory: " + sDir + "\n" +
// 		" * file: " + sFile + "\n" +
// 		" * name: " + sName + "\n" +
// 		" *--------------------------------------------*/\n\n\n" + 
// 		sTestData;

// 	var pAdditionalScripts = [];
// 	var sAdditionalCode = "";


// 	var pAdditionalCSS = [];
// 	var sAdditionalCSS = "";



// 	var pArchive;
// 	var sIndexHTML;


//     if (options.webglDebug) {
//     	sTestData += "\n\n/// @WEBGL_DEBUG: {data}/js/webgl-debug.js|location()|script() \n"
//     }

//     var pFetchResult = {
// 		css: pAdditionalCSS, 
// 		script: pAdditionalScripts,
// 		data: null
// 	};

//     var gitignore = fetchDeps(
//     	sDir,
//     	sTestData, 
//     	pFetchResult);

//     sTestData = pFetchResult.data;

//     var delimeter = "\n# -- GENERATED AUTOMATICALLY --\n";
//     var gitignore_data = s = fs.readFileSync(".gitignore", "utf8");

//     if (s.indexOf(delimeter) !== -1) {
//     	gitignore_data = s.substr(0, s.indexOf(delimeter)) + s.substr(s.lastIndexOf(delimeter) + delimeter.length, s.length);
//     }

//     fs.writeFileSync(
//     	".gitignore", 
//     	gitignore_data + delimeter + gitignore + "\n" + delimeter, 
//     	"utf8");

// 	for (var i in pAdditionalScripts) {
// 		sAdditionalCode += "<script type=\"text/javascript\" src=\"" + pAdditionalScripts[i] + "\">" + 
// 							"</script>\n";
// 	}


// 	for (var i in pAdditionalCSS) {
// 		sAdditionalCSS += "<link rel=\"stylesheet\" type=\"text/css\" href=\"" + pAdditionalCSS[i] + "\">\n";
// 	}

//     sIndexHTML = "\n\
// 				  <html>                           					\n\
//                   	<head>                               			\n\
//                   		<title>" + sFile + "</title>   				\n\
//                   		" + sAdditionalCSS + "						\n\
//                   	</head>                              			\n\
//                   	<body>                               			\n\
//                   		" + sAdditionalCode + "				  		\n\
//                   		<script>" + sTestData + "</script>   		\n\
//                   </html>";
    
    


//     function writeOutput(sOutputFile, pData) {
//     	fs.writeFile(sOutputFile, pData, function (err) {
// 	    	if (err) {
// 	    		pTestResults.push({file: sFile, name: sName, results: false});
// 	    		throw err;
// 	    	}

// 	        console.log("test created: " + sFile + " (" + sName +") ");
// 	        pTestResults.push({file: sFile, name: sName, results: true});


// 	        if (iTestQuitMutex >= 0) {
// 		        var argv = pTestQueue.pop();

// 		        if (argv) {
// 			        packTest(argv.dir, argv.main, argv.name, argv.data);
// 			        iTestQuitMutex --;
// 			        return;
// 		        }
// 	        }

// 	        printTestResultTable();
// 	    });
//     }

//     if (sFormat == "nw") {
// 	   	pArchive = new zip();
// 	    pArchive.add("index.html", new Buffer(sIndexHTML, "utf8"));
// 	    pArchive.add("package.json", new Buffer(
// 	                  JSON.stringify({
// 	                            "name": sFile,
// 	                            "main": "index.html",
// 	                            "window": {
// 	                              "toolbar": false,
// 	                              "width": 800,
// 	                              "height": 600,
// 	                              "min_width": 400,
// 	                              "min_height": 200,
// 	                              "max_width": 800,
// 	                              "max_height": 600
// 	                            }
// 	                          }), "utf8"));

// 		var pArchiveFiles = [];
// 		pData.forEach(function(pFile) {
// 			if (pFile.folder) return;

// 			pArchiveFiles.push({name: path.relative(sDir, pFile.path), path: pFile.path});
// 		});


// 		pArchive.addFiles(pArchiveFiles, function (err) {
// 			if (err) return console.log("err while adding files", err);

// 			writeOutput(sDir + "/" + sName + ".nw", pArchive.toBuffer());
// 		});
// 	}
// 	else if (sFormat == "html") {
// 		writeOutput(sDir + "/" + sName /*+ "." + (options.debug? "DEBUG": "RELEASE")*/ + ".html", sIndexHTML);
// 	}
// 	else if (sFormat == "js") {
// 		writeOutput(sDir + "/" + sName /*+ "." + (options.debug? "DEBUG": "RELEASE")*/ + ".js", sTestData);
// 	}
// }

// //sDir -- path to dir with test
// //sFile -- full path to test entry file
// //sName -- test output *.nw name
// //pData -- path list to all tests data

// function packTest(sDir, sFile, sName, pData) {

// 	console.log("\n");
// 	console.log("#########################################################");
// 	console.log("### PACK TEST: " + sFile + "");
// 	console.log("#########################################################");
// 	console.log("\n");

// 	sDir += "/" + (options.debug? "DEBUG": "RELEASE") + "/";
// 	var sTempFile =sFile + ".temp.js";
// 	var sTempFileModded = path.dirname(sTempFile) + "/" + (options.debug? "DEBUG": "RELEASE") + "/" + path.basename(sTempFile);
// 	var cmd = "node";

// 	var argv = (options.baseDir + "/make.js -o " + sTempFile +" -t CORE " +
// 		(options.capability? " --ES6 ": "") +
// 		(options.compress? " --compress ": "") +
// 		(options.declaration? " --declaration ": "") +
// 		(options.debug? " --debug ": " --no-debug ") +
// 		(options.preprocess? " --preprocess ": " ") +
// 		(options.noConst? " --no-const ": " ") +
// 		(options.gui? " --gui ": " ") +
// 		sFile).split(" ");

// 	console.log(cmd + " " + argv.join(" "));

// 	var node = spawn(cmd, argv, { maxBuffer: BUFFER_SIZE, stdio: 'inherit' });

// 	node.on('exit', function (code) {
// 	    console.log("test " + sFile + " packed with code " + code);
// 		if (code == 0) {
        	
// 			if (options.preprocess) {
// 				return;
// 			}

// 			var compileTestMacro = function (sFormat) {
// 				compileTest(
// 					sDir, 
// 					sFile, 
// 					sName, 
// 					pData, 
// 					fs.readFileSync(sTempFileModded + (options.compress? ".min": ""), "utf8"),
// 					sFormat);
// 			}
// 			if (options.testsFormat.nw) {
// 				compileTestMacro("nw");
// 			}

// 			if (options.testsFormat.html) {
// 				// compileTestMacro("js");
// 				compileTestMacro("html");
// 			}

// 			if (options.testsFormat.js) {
// 				compileTestMacro("js");
// 			}


// 			fs.unlinkSync(sTempFileModded)

// 			if (options.compress) {
// 				fs.unlinkSync(sTempFileModded + ".min");
// 			}
// 		}
// 		else {
// 			pTestResults.push({file: sFile, name: sName, results: false});
// 			iTestQuitMutex --;
// 		}
// 	});
// }

// var pCleanFiles = [];
// var iTimeout = -1;
// function createTestData(sDir, sFile) {
// 	var sTest = createTestName(sFile);
// 	var sTestMain = sFile;

// 	var pTestFiles = [];
// 	var pDirsForScan = [];
// 	var iDepth = 0;

// 	fs.readdir(sDir, function(err, list) {
//         if (err) throw (err);

//         list.forEach(function(sFile) {
//         	sFile = sDir + "/" + sFile;

//         	if (path.basename(sFile) == options.tempFile) {
//         		return;
//         	}

//             var stat = fs.statSync(sFile);

//         	if (stat) {
//             	if (options.clean == false) {
// 	            	if (stat.isDirectory()) {
// 	            		iDepth ++;
// 	            		pDirsForScan.push(sFile);
// 	            		pTestFiles.push({path: sFile, folder: true});
// 	            	}
// 	            	else if (
// 	            		path.extname(sFile) !== ".ts" && 
// 	            		path.extname(sFile) !== ".nw" && 
// 	            		sFile.substr(-8) !== sTest + ".ts.html") {
// 	            		pTestFiles.push({path: sFile, folder: false});
// 	            	}
//             	}
//             	else{
//             		if (!stat.isDirectory()) {
// 	            		if (sFile.substr(-8) === ".ts.html" ||
// 	            			sFile.substr(-3) === ".nw" ||
// 	            			sFile.substr(-6) === ".ts.js") {
// 	            			pCleanFiles.push(sFile);
// 	            		}
//             		}
//             	}
//             }  
//         });

// 		if (options.clean) {

// 			if (pCleanFiles.length == 0) {
// 				console.log("Not found files for deletion.");
// 			} 
// 			else {
// 				clearTimeout(iTimeout);
// 				iTimeout = setTimeout(function () {
// 					console.log("\n\nFile to be cleaned (" + pCleanFiles.length + "): ");

// 					for (var i in pCleanFiles) {
// 						console.log("\t" + i + ". \"" + pCleanFiles[i] + "\"", "will be removed.");
// 					}

// 					prompt.get({
// 				        name: 'yesno',
// 				        message: 'Remove all? (y/n)',
// 				        validator: /y[es]*|n[o]?/,
// 				        warning: 'Must respond yes or no',
// 				        default: 'no'
// 				    }, function (err, result) {   

// 						if (result.yesno.toLowerCase().substr(0, 1) === 'y') {
// 							for (var i in pCleanFiles) {
// 								try {
// 									fs.unlinkSync(pCleanFiles[i]);
// 								} catch (e) {
// 									console.log("...")
// 								}
// 							}

// 							console.log(pCleanFiles.length + " file(s) removed.");
// 						}
// 					  });
// 				}, 30);
// 			}
// 		}
// 		else {

// 	        if (iDepth == 0) {
// 	        	packTest(sDir, sTestMain, sTest, pTestFiles);
// 	        }

// 	        pDirsForScan.forEach(function(sFile) {
// 	        	scanDir(sFile, function (err, pFileList) {
// 	    			if (err) throw err;
// 	    			pTestFiles = pTestFiles.concat(pFileList);

// 	    			iDepth --;

// 	    			if (iDepth === 0) {

// 	    				if (iTestQuitMutex == 0) {
// 	    					iTestQuitMutex ++;
// 	    					//console.log(sDir, sTestMain, sTest, pTestFiles);
// 	    					packTest(sDir, sTestMain, sTest, pTestFiles);
// 	    				}
// 	    				else {
// 	    					//console.log({dir: sDir, main: sTestMain, name: sTest, data: pTestFiles});
// 	    					pTestQueue.push({dir: sDir, main: sTestMain, name: sTest, data: pTestFiles});
// 	    				}
// 	    			}
// 	    		}, true);
// 	        })
//         }
//     });
// }

// function addTestDirectory(sTestDir, sTestFile) {
// 	sTestFile = sTestFile || null;

// 	console.log("> test directory: " + sTestDir + " ");

// 	if (sTestFile) {
// 		console.log("> test file: " + sTestFile + " ");
// 	}

// 	fs.readdir(sTestDir, function(err, list) {
//         if (err) throw (err);
        
//         list.forEach(function(sFile) {
//         	sFile = sTestDir + "/" + sFile;

//             fs.stat(sFile, function(err, stat) {
//                 if (stat) {
//                 	if (stat.isDirectory() && options.listOnly == false) {
//                 		console.log("\tdir: " + sFile);
//                 	}
//                 	else {
//                 		if (path.extname(sFile) === ".ts") {
                			
//                 			var sSpace = "";
//                 			for (var i = sFile.length; i < 40; ++ i) {
//                 				sSpace += " ";
//                 			}

//                 			if (path.basename(sFile) === options.tempFile) {
//                 				fs.unlinkSync(sFile);
//                 			}
//                 			else if (sTestFile == null || path.basename(sFile) == path.basename(sTestFile)) {
//                 				console.log("\tfile: " + sFile + sSpace + "=>   " + createTestName(sFile) + 
//                 					(options.testsFormat.html?
//                 						".html": 
//                 						(options.testsFormat.js? ".js": ".nw")
//                 						));
//                 				if (options.listOnly == false) {
//                 					createTestData(sTestDir, sFile);
//                 				}
//                 			}
//                 		}
//                 		else if (options.listOnly == false) {
//                 			console.log("\tfile: " + sFile);
//                 		}
//                 	}
//                 }
//             });
//         });

//     });
// }


// //=================================
// parseArguments();

// verifyOptions();

// process.chdir(options.buildDir);

// if (options.magicMode) {
// 	doMagic();
// }

// if (!fs.existsSync(options.outputFolder)) {
// 	console.log("\n\n> target: CORE\n\n");

//     fs.mkdirSync(options.outputFolder);
// }

// if (options.target.core) {
// 	buildCore();
// }

// if (options.target.tests) {

// 	if (options.testDir) {
// 		console.log("single test used: " + options.testDir);
// 		//process.exit(1);
// 	}

// 	// scanDir(options.pathToTests,  function(err, results) {
// 	// 	if (err) throw err;


// 	// });

// 	console.log("\n> founded test dirs\n");

// 	buildTests(options.testDir);
// }

var sys         = require('sys')
var fs                 = require('fs');
var exec         = require('child_process').exec;
var zip         = require("node-native-zip");
var path         = require('path');
var spawn         = require('child_process').spawn;
//var md5         = require('MD5');
var stream  = require('stream');
var prompt         = require('prompt');
var wrench  = require('wrench');

function include(file) {
        eval(fs.readFileSync(file, "utf-8"));
}

//include("optarg.js");

//command line output buffer size
//default is 5MB
var BUFFER_SIZE = 10 * 1024 * 1024; 
var pCleanFiles = [];
var iTimeout = -1;

var isWin = !!process.platform.match(/^win/);

function isDef(pObject) {
        return pObject != null;
}

function usage() {
        console.log( 
                'usage: [options] file1, file2 ....' + 
                '\n\n Available options: ' + 
                '\n\t--target        [-t] < "ALL" | "TESTS" | "CORE" > Specify target. Default target is CORE.' + 
                '\n\t--out                [-o] < path/to/output/[ folder | file ] > Specify output folder or file. ' + 
                '\n\t--build                [-d] < path/to/build/directory > Specify build directory. ' + 
                '\n\t--tests                [-s] < path/to/tests/folder > Specify tests directory. ' + 
                '\n\t--test                [-c] < path/to/single/test > Specify test directory. ' + 
                '\n\t--html                        Build tests as HTML. ' + 
                '\n\t--nw                        Build tests as NW. ' + 
                '\n\t--js                        Build tests as JS. ' + 
                '\n\t--help                [-h] Print this text. ' + 
                '\n\t--ES6                        Activate ecmascript 6 capability.' + 
                '\n\t--compress                Compress output javascript.' + 
                '\n\t--debug                        Debug build.' + 
                '\n\t--no-debug                Release build.' + 
                '\n\t--clean                        Clean tests data.' + 
                '\n\t--list                [-l] List all available tests.' + 
                '\n\t--webgl-debug        [-w] Add webgl debug utils.' + 
                '\n\t--do-magic        [-m] It\'s wonderfull magic!(Спросите у Игоря!).' + 
                '\n\t--declaration                Generates corresponding .d.ts file.' +
                '\n\t--no-const                        Do not replace constant from enum values.' +
                '\n\t--gui                                Define GUI macro.' +
                '\n\t--preprocess                Preprocessing only.'
        );

        process.exit(1);
}
//" + md5((new Date).getTime() + "." + Math.random()) + "
var pOptions = {
        target: {core: true, tests: false},                        
        outputFolder: "./bin",                //output file name
        outputFile: null,                //output file name
        buildDir: "./",                        //dir from witch we build
        tempFile: "~tmp.ts",                //temprorary file name
        baseDir: __dirname,                //home dir for this script
        includeDir: null,
        capability: null,
        testDir: null,
        pathToTests: null,
        compress: false,
        files: [],
        debug: true,
        pathToTemp: null,
        declaration: false,
        gui: false,
        preprocess: false,
        clean: false, //clean tests data instead build
        listOnly: false, //list available tests
        webglDebug: false,
        dataDir: "./data/",
        noConst: false,
        /**
         * Поиск всех файлов с комеентариями вида // стоящими не на отдельной строке
         */
        magicMode: false,
        testsFormat: {nw: false, html: false, js: false}
};

if (process.argv.length < 3) {
        usage();
}


var scanDir = function(dir, done, withFolders) {
    var results = [];

    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        
        var i = 0;
        
        (function next() {
            var file = list[i++];
            if (!file) return done(null, results);
            file = dir + '/' + file;
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                        if (withFolders) {
                                results.push({path: file, folder: true});
                        }

                    scanDir(file, function(err, res) {
                        results = results.concat(res);
                        next();
                    }, withFolders);

                } else {
                    results.push({path: file, folder: false});
                    next();
                }
            });
        })();
    });
};

function readKey(sOption, i) {
        pOptions[sOption] = process.argv[i];
        if (!isDef(pOptions[sOption])) usage();
}

function parseArguments() {
        for (var i = 2, sArg, sTarget; i < process.argv.length; ++ i) {
                sArg = process.argv[i];

                switch (sArg) {
                        case '--compress':
                        case '-z':
                                pOptions.compress = true;
                                break;
                        case '--ES6':
                                pOptions.capability = "ES6";
                                break;
                        case '--target':
                        case '-t':
                                sTarget = process.argv[++i].toUpperCase();

                                if (sTarget === "TESTS") {
                                        pOptions.target.tests = true;
                                        pOptions.target.core = false;
                                }
                                else if (sTarget === "ALL") {
                                        pOptions.target.tests = true;
                                        pOptions.target.core = true;
                                }

                                break;
                        case '--html':
                                pOptions.testsFormat.html = true;
                                break;
                        case '--gui':
                                pOptions.gui = true;
                                break;
                        case '--nw':
                                pOptions.testsFormat.nw = true;
                                break;
                        case '--js':
                                pOptions.testsFormat.js = true;
                                break;
                        case '--debug':
                                pOptions.debug = true;
                                break;
                        case '--no-debug':
                                pOptions.debug = false;
                                break;
                        case '--clean':
                                pOptions.clean = true;
                                break;
                        case '--declaration':
                                pOptions.declaration = true;
                                break;
                        case '--no-const':
                                pOptions.noConst = true;
                                break;
                        case '--preprocess':
                                pOptions.preprocess = true;
                                break;
                        case '--tests':
                        case '-s':
                                readKey("pathToTests", ++ i);
                                break;
                        case '--test':
                        case '-c':
                                readKey("testDir", ++ i);
                                break;
                        case '-o':
            case '--out':
                readKey("outputFolder", ++i);
                break;
                        case '-d':
                        case '--build':
                                readKey("buildDir", ++ i);
                                break;
                        case '-l':
                        case '--list':
                                pOptions.listOnly = true;
                                break;
                        case '-m':
                        case '--do-magic':
                                pOptions.magicMode = true;
                                break;
                        case '--webgl-debug':
                        case '-w':
                                 pOptions.webglDebug = true;
                                 break;
                        default:
                                if (sArg.charAt(0) == '-') {
                                        console.log("unknown arguments detected: " + sArg, "\n");
                                        usage();
                                }

                                if (!sArg.length || sArg.match(/\s+/ig)) {
                                        break;
                                }

                                pOptions.files.push(sArg);
                }
        };
}

function verifyOptions() {
        if (pOptions.outputFile) {
                pOptions.outputFile = path.normalize(pOptions.outputFile);
        }

        pOptions.outputFolder = path.normalize(pOptions.outputFolder);
        pOptions.buildDir = path.normalize(pOptions.buildDir);

        pOptions.outputFile = path.basename(pOptions.outputFolder);
        pOptions.outputFolder = path.dirname(pOptions.outputFolder);

        if (!pOptions.includeDir) {
                pOptions.includeDir = "inc/";//pOptions.buildDir + 

        }

        if (pOptions.testsFormat.html         == false && 
                pOptions.testsFormat.nw         == false &&
                pOptions.testsFormat.js         == false) {
                pOptions.testsFormat.html = true;
        }

        // for (var i in pOptions.files) {
        //         pOptions.files[i] = (path.normalize(pOptions.buildDir + "/" + pOptions.files[i]));
        //         console.log(">>>>>", pOptions.files[i])
        // }

        if (pOptions.outputFile == null || pOptions.outputFile == "") {
                var pOutExt = ".out.js";

                if (pOptions.declaration) {
                        pOutExt = ".d.ts";
                }

                if (pOptions.preprocess) {
                        pOutExt = ".ts";
                }

                pOptions.outputFile = pOptions.files[0] + pOutExt;
        }
}

function pwd() {
        var pwd = spawn("pwd");
        pwd.stdout.on('data', function (data) {
          console.log('stdout: \n' + data);
        });
}

function preprocess() {
        console.log("\n> preprocessing started (" + this.process.pid + ")\n");

        var capabilityOptions = [
                // "-D inline=/**@inline*/",
                "-D protected=/**@protected*/",
                "-D const=/**@const*/var",
                "-D struct=class",
                "-D readonly=",
                "-D writeonly="
                ];

        if (pOptions.gui) {
                capabilityOptions.push("-D GUI=1");
                console.log("Build with GUI.");
        }

        if (pOptions.debug) {
                capabilityOptions.push("-D DEBUG=DEBUG");
                console.log("Debug build.");
        }
        else {
                console.log("Release build.")
        }

        var capabilityMacro = capabilityOptions.join(" ");

        if (pOptions.capability == null) {
                capabilityMacro = "";
                console.log("EcmaScript 6 capability mode: OFF");
        }
        else {
                console.log("EcmaScript 6 capability mode: ON");
        }

        // pwd();

        var cmd = (isWin? pOptions.baseDir + "/": "") + "mcpp";
        var argv = ("-P -C -e utf8 -I " + pOptions.includeDir + " -I ./"/* + pOptions.buildDir*/ + " -I " + 
                pOptions.baseDir + "/definitions/ -j -+ -W 0 -k " + 
                capabilityMacro + " " + pOptions.files.join(" ")).split(" ");

        //console.log(pOptions.files);
        console.log(cmd + " " + argv.join(" "));

        var mcpp = spawn(cmd, argv, {maxBuffer: BUFFER_SIZE});
        var stdout = new Buffer(BUFFER_SIZE);
        var iTotalChars = 0;

        mcpp.stdout.on('data', function (data) {
           // console.log("##############################################################################################");
          // console.log('stdout: \n' + data.toString());
          data.copy(stdout, iTotalChars);

          iTotalChars  += data.length;
          // console.log(stdout.slice(0, iTotalChars).toString());
        });

        mcpp.stderr.on('data', function (data) {
          console.log('stderr: \n' + data);
        });

        mcpp.on('close', function (code) {
          // console.log(stdout.slice(0, iTotalChars).toString('utf8'));
          console.log('preprocessing exited with code ' + code + " " + (code != 0? "(failed)": "(successful)"));

          if (code == 0) {
                  pOptions.pathToTemp = pOptions.outputFolder + "/" + pOptions.tempFile;

                if (pOptions.preprocess) {
                        fs.writeFileSync(pOptions.outputFolder + "/" + pOptions.outputFile, stdout.slice(0, iTotalChars).toString('utf8'), "utf8");
                        console.log("preprocessed to: ", pOptions.outputFolder + "/" + pOptions.outputFile);
                }
                else {
                        console.log("preprocessed to: ", pOptions.pathToTemp);
                        fs.writeFileSync(pOptions.pathToTemp, stdout.slice(0, iTotalChars), "utf8");
                        compile();
                }
          }
        });
}

function compress(sFile) {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>");
        var cmd = "java";
        var argv = (
                "-jar " + 
                pOptions.baseDir + "/compiler.jar " +
                sFile + 
                //" --warning_level=VERBOSE " + 
                " --js_output_file " + sFile + ".min" + 
                " --language_in=ECMASCRIPT5_STRICT" + 
                // " --compilation_level=ADVANCED_OPTIMIZATIONS" + 
                ""
                ).split(" ");


        var closure = spawn(cmd, argv, { maxBuffer: BUFFER_SIZE,  stdio: 'inherit' });

        closure.on('exit', function (code) {
                console.log('compression exited with code ' + code + " " + (code != 0? "(failed)": "(successful)"));

                if (code == 0) {

                          console.log("compressed to: ", sFile);
                }
                else {
                        console.log("TODO: REMOVE TEMP COMPRESSED FILE >> ");
                          process.exit(1);
                }
        });
}

function compile() {
   
        console.log("\n> compilation started (" + this.process.pid + ")  \n");

        var cmd = "node";
        var sOutputFolder = pOptions.outputFolder + "/" + (pOptions.debug? "DEBUG": "RELEASE");        
        var sOutputFile = sOutputFolder + "/" + pOptions.outputFile;

        wrench.mkdirSyncRecursive(sOutputFolder, 0777);

        var argv = (  
                pOptions.baseDir + "/tsc.js -c --target ES5  " + 
                pOptions.baseDir + "/definitions/fixes.d.ts " +
                // pOptions.buildDir + "/bin/RELEASE/akra.d.ts " +
                //pOptions.baseDir + "/WebGL.d.ts " + 
                pOptions.pathToTemp + " --out " +
                sOutputFile +
                // (pOptions.compress? " --comments --jsdoc ": "") + 
                (pOptions.declaration? " --declaration ": "") +
                " --cflowu " + (!pOptions.noConst? " --const ": "")).replace(/\s+/ig, " ").split(" ");

        console.log((cmd + " " + argv.join(" ")));//.split(" ")
    
        var node = spawn(cmd, argv, { maxBuffer: BUFFER_SIZE, stdio: 'inherit' });

        node.on('exit', function (code) {
          console.log('compilation exited with code ' + code + " " + (code != 0? "(failed)": "(successful)"));

          if (code == 0) {
                  console.log("compiled to: ", sOutputFile);

                fs.unlink(pOptions.pathToTemp, function (err) {
                        if (err && fs.existsSync(pOptions.pathToTemp)) {
                                throw err;
                        }

                        console.log("temp file: " + pOptions.pathToTemp + " removed.\n\n");

                        var pFetchResult = {css: [], script: [], data: null};
                        
                    var gitignore = fetchDeps(
                            sOutputFolder,
                            fs.readFileSync(sOutputFile, "utf-8"), 
                            pFetchResult);


                    fs.writeFileSync(sOutputFile, pFetchResult.data, "utf-8");

                        if (pOptions.compress) {
                                compress(sOutputFile);
                        }

                });
          }
          else {
                  process.exit(1);
          }
        });

}

function doMagic() {

        scanDir(pOptions.includeDir, function (err, files) {
                for (var i in files) {
                        var sFile = files[i].path;
                        if (path.extname(sFile).toLowerCase() !== ".ts") {
                                continue;
                        }
                        var sData = fs.readFileSync(sFile, "utf8");
                        var sLines = sData.split("\n");

                        var pIncorrectComments = [];

                        for (var n in sLines) {
                                var sLine = sLines[n];
                                var iPos = sLine.indexOf("//");
                                if (iPos != -1) {
                                        if (!sLine.substr(0, iPos).match(/^[\s]*$/ig)) {
                                                pIncorrectComments.push({n: n, comment: sLine});
                                        }
                                }
                        }

                        if (pIncorrectComments.length > 0) {
                                console.log("\nfile: " + sFile);
                                for (var n in pIncorrectComments) {
                                        console.log("\t line " + pIncorrectComments[n].n + ":: " + pIncorrectComments[n].comment);
                                }
                        }
                }

                process.exit(0);
        });
}

var pTestQueue = [];
var iTestQuitMutex = 0;
var pTestResults = [];

function buildCore() {
        preprocess();
}

//== tests

function buildTests(sDir) {
        sDir = sDir || null;

        var pSubFolders, sTestFile = null;

        if (sDir) {
                pSubFolders = (sDir.split('/'));
                if (pSubFolders[pSubFolders.length - 1].split(".").length > 1) {
                        //если мы хотим собрать конкретный тест а не все тесты в папке
                        sTestFile = pSubFolders.pop();
                        sDir = pSubFolders.join("/");
                }

                if (sDir[sDir.length - 1] === "/") {
                        sDir = sDir.substr(0, sDir.length - 1);
                }
        }

        fs.readdir(pOptions.pathToTests, function(err, list) {
        if (err) throw (err);
        
        list.forEach(function(sFile) {
                sFile = pOptions.pathToTests + "/" + sFile;

            fs.stat(sFile, function(err, stat) {
                if (stat && stat.isDirectory()) {

                        if (sDir == null || sDir == sFile) {
                                addTestDirectory(sFile, sTestFile);
                        }
                }
            });
        });

    });
}

function printTestResultTable() {
        console.log("\n-----------------------");
        pTestResults.forEach(function(pResult, i) {
                console.log(i + ". " + pResult.name + ' ( ' + pResult.file + ' ) : ' + (pResult.result == false? 'failed': 'successful'));
        })
}

function createTestName(sEntryFileName) {
        var sFileName = path.basename(sEntryFileName);
        var i = sFileName.lastIndexOf('.');
        return sFileName.substr(0, i);
}



function findDepends(sData, pDepExp) {

        var pMatches = null;
        var pDeps = [];

        while (pMatches = pDepExp.exec(sData)) {
                pDeps.push([pMatches[1], pMatches[2]]);
        }

        return pDeps;
}


function srcModifier(name, value, argv) {
        if (argv.length != 1) {
                throw Error("copy modifier must have a path param");
        }

        var gitignore = [];

        if (fs.existsSync(argv[0])) {
                stat = fs.statSync(argv[0]);
                if (stat.isDirectory()) {
                        console.log("copy dir from ", argv[0], "to", value);
                        wrench.copyDirSyncRecursive(path.resolve(argv[0]), path.resolve(value));
                        gitignore.push(value + "/");
                }
                else {
                        var sFile = fs.readFileSync(argv[0], "utf-8");
                        console.log("copy file from ", argv[0], "to", value);
                        fs.writeFileSync(value, sFile, "utf-8");
                        gitignore.push(value);
                }
        }
        else {
                console.log("[WARNING] could not find file for copy:", argv[0]);
        }

        return gitignore.join("\n");
}

function dataLocModifier(name, value, argv) {
        var result = (/*argv[1] || */"akra.DATA") + " + \"/" + path.relative(argv[0], value).replace(/\\/ig, "/") + "\"";
        // console.log("-------------------->",result);
        return result;
}

function fetchDeps(sDir, sTestData, pResult) {
        var pDeps = findDepends(sTestData, /\/\/\/\s*@([\w\d]*)\s*\:\s*([\w\d\.\-\/\:\-\{\}\|\(\)\ \"\,]+)\s*/ig);//"

        var variables = {};
        var gitignore = [];
        
        for (var i in pDeps) {
                var pDep = pDeps[i];
                var name = pDep[0];
                var cmd = pDep[1];
                var value = null;

                for (var vname in variables) {
                        var vvalue = variables[vname];
                        cmd = cmd.replace(new RegExp("\\{\\s*" + vname + "\\s*\\}", "ig"), vvalue);
                }

                var pmods = cmd.split("|");
                value = pmods.splice(0, 1)[0];
                // console.log("@" + name, cmd);

                for (var m = 0; m < pmods.length; ++ m) {
                        var mod = pmods[m];
                        var matches = null;

                        if (matches = (/\s*([\w]+)\(([\/\.\-\w\d\ \t\,]*)\)\s*/ig).exec(mod)) {
                                var modifier = matches[1];
                                var args = matches[2];
                                var argv = args.split(',');

                                switch (modifier.toLowerCase()) {
                                        case "src":
                                                gitignore.push(srcModifier(name, value, argv));
                                                break;
                                        case "css":
                                                pResult['css'].push(value);
                                                console.log('<link rel="stylesheet" type="text/css" href="' + value + '">');
                                                break;
                                        case "script":
                                                pResult['script'].push(value);
                                                console.log('<script type="text/javascript" src="' + value + '"></script>');
                                                break;
                                        case "location":
                                                value = "\"" + path.relative(sDir, value).replace(/\\/ig, "/") + "\"";
                                                break;
                                        case "data_location":
                                                value = dataLocModifier(name, value, argv);
                                                break;
                                        default:
                                                console.log("[WARNING] unknown modifier founded in deps: ", modifier, "(" + cmd + ")");
                                }
                        }
                }

                if (name && name.length > 0) {
                        variables[name] = value;
                        sTestData = sTestData.replace(new RegExp("\"@" + name + "\"", "ig"), value);
                        // console.log("[REPLACE] ", "\"@" + name + "\"" , " --> ", value)
                }
        }

        pResult.data = sTestData;

        return gitignore.join("\n");
}


function compileTest(sDir, sFile, sName, pData, sTestData, sFormat) {

        //FIXME: hack for events support
        //sTestData = sTestData.replace(/eval\(\"this\.\_iGuid \|\| akra\.sid\(\)\"\)/g, "this._iGuid || akra.sid()");


        sTestData = "\n\n\n" + 
                "/*---------------------------------------------\n" +
                " * assembled at: " + (new Date) + "\n" +
                " * directory: " + sDir + "\n" +
                " * file: " + sFile + "\n" +
                " * name: " + sName + "\n" +
                " *--------------------------------------------*/\n\n\n" + 
                sTestData;

        var pAdditionalScripts = [];//findDepends(sTestData, /\/\/\/\s*@script\s+([^\s]+)\s*/ig);
        var sAdditionalCode = "";


        var pAdditionalCSS = [];//findDepends(sTestData, /\/\/\/\s*@css\s+([^\s]+)\s*/ig);
        var sAdditionalCSS = "";



        var pArchive;
        var sIndexHTML;


    if (pOptions.webglDebug) {
            sTestData += "\n\n/// @WEBGL_DEBUG: {data}/js/webgl-debug.js|location()|script() \n"
    }

    var pFetchResult = {
                css: pAdditionalCSS, 
                script: pAdditionalScripts,
                data: null
        };

    var gitignore = fetchDeps(
            sDir,
            sTestData, 
            pFetchResult);

    sTestData = pFetchResult.data;

    var delimeter = "\n# -- GENERATED AUTOMATICALLY --\n";
    var gitignore_data = s = fs.readFileSync(".gitignore", "utf8");

    if (s.indexOf(delimeter) !== -1) {
            gitignore_data = s.substr(0, s.indexOf(delimeter)) + s.substr(s.lastIndexOf(delimeter) + delimeter.length, s.length);
    }

    fs.writeFileSync(
            ".gitignore", 
            gitignore_data + delimeter + gitignore + "\n" + delimeter, 
            "utf8");

        for (var i in pAdditionalScripts) {
                sAdditionalCode += "<script type=\"text/javascript\" src=\"" + pAdditionalScripts[i] + "\">" + 
                                                        "</script>\n";
        }


        for (var i in pAdditionalCSS) {
                sAdditionalCSS += "<link rel=\"stylesheet\" type=\"text/css\" href=\"" + pAdditionalCSS[i] + "\">\n";
        }

    sIndexHTML = "\n\
                                  <html>                                                                   \n\
                          <head>                                                       \n\
                                  <title>" + sFile + "</title>                                   \n\
                                  " + sAdditionalCSS + "                                                \n\
                          </head>                                                      \n\
                          <body>                                                       \n\
                                  " + sAdditionalCode + "                                                  \n\
                                  <script>" + sTestData + "</script>                   \n\
                  </html>";
    
    


    //fetchDeps(sDir, findDepends(sTestData, /\/\/\/\s*@dep\s+([\w\d\.\-\/\:\-\>]+)\s*/ig));


    function writeOutput(sOutputFile, pData) {
            fs.writeFile(sOutputFile, pData, function (err) {
                    if (err) {
                            pTestResults.push({file: sFile, name: sName, results: false});
                            throw err;
                    }

                console.log("test created: " + sFile + " (" + sName +") ");
                pTestResults.push({file: sFile, name: sName, results: true});


                if (iTestQuitMutex >= 0) {
                        var argv = pTestQueue.pop();

                        if (argv) {
                                packTest(argv.dir, argv.main, argv.name, argv.data);
                                iTestQuitMutex --;
                                return;
                        }
                }

                printTestResultTable();
            });
    }

    if (sFormat == "nw") {
                   pArchive = new zip();
            pArchive.add("index.html", new Buffer(sIndexHTML, "utf8"));
            pArchive.add("package.json", new Buffer(
                          JSON.stringify({
                                    "name": sFile,
                                    "main": "index.html",
                                    "window": {
                                      "toolbar": false,
                                      "width": 800,
                                      "height": 600,
                                      "min_width": 400,
                                      "min_height": 200,
                                      "max_width": 800,
                                      "max_height": 600
                                    }
                                  }), "utf8"));

                var pArchiveFiles = [];
                pData.forEach(function(pFile) {
                        if (pFile.folder) return;

                        pArchiveFiles.push({name: path.relative(sDir, pFile.path), path: pFile.path});
                });


                pArchive.addFiles(pArchiveFiles, function (err) {
                        if (err) return console.log("err while adding files", err);

                        writeOutput(sDir + "/" + sName + ".nw", pArchive.toBuffer());
                });
        }
        else if (sFormat == "html") {
                writeOutput(sDir + "/" + sName /*+ "." + (pOptions.debug? "DEBUG": "RELEASE")*/ + ".html", sIndexHTML);
        }
        else if (sFormat == "js") {
                writeOutput(sDir + "/" + sName /*+ "." + (pOptions.debug? "DEBUG": "RELEASE")*/ + ".js", sTestData);        
        }
}

//sDir -- path to dir with test
//sFile -- full path to test entry file
//sName -- test output *.nw name
//pData -- path list to all tests data

function packTest(sDir, sFile, sName, pData) {

        console.log("\n");
        console.log("#########################################################");
        console.log("### PACK TEST: " + sFile + "");
        console.log("#########################################################");
        console.log("\n");

        sDir += "/" + (pOptions.debug? "DEBUG": "RELEASE") + "/";
        var sTempFile =sFile + ".temp.js";
        var sTempFileModded = path.dirname(sTempFile) + "/" + (pOptions.debug? "DEBUG": "RELEASE") + "/" + path.basename(sTempFile);
        var cmd = "node";

        var argv = (pOptions.baseDir + "/make.js -o " + sTempFile +" -t CORE " + 
                (pOptions.capability? " --ES6 ": "") + 
                (pOptions.compress? " --compress ": "") + 
                (pOptions.declaration? " --declaration ": "") + 
                (pOptions.debug? " --debug ": " --no-debug ") + 
                (pOptions.preprocess? " --preprocess ": " ") + 
                (pOptions.noConst? " --no-const ": " ") + 
                (pOptions.gui? " --gui ": " ") + 
                sFile).split(" ");

        console.log(cmd + " " + argv.join(" "));

        var node = spawn(cmd, argv, { maxBuffer: BUFFER_SIZE, stdio: 'inherit' });

        node.on('exit', function (code) {
            console.log("test " + sFile + " packed with code " + code);
                if (code == 0) {
                
                        if (pOptions.preprocess) {
                                return;
                        }

                        var compileTestMacro = function (sFormat) {
                                compileTest(
                                        sDir, 
                                        sFile, 
                                        sName, 
                                        pData, 
                                        fs.readFileSync(sTempFileModded + (pOptions.compress? ".min": ""), "utf8"), 
                                        sFormat);
                        }
                        if (pOptions.testsFormat.nw) {
                                compileTestMacro("nw");
                        }

                        if (pOptions.testsFormat.html) {
                                // compileTestMacro("js");
                                compileTestMacro("html");
                        }

                        if (pOptions.testsFormat.js) {
                                compileTestMacro("js");
                        }


                        fs.unlinkSync(sTempFileModded)

                        if (pOptions.compress) {
                                fs.unlinkSync(sTempFileModded + ".min");
                        }
                }
                else {
                        pTestResults.push({file: sFile, name: sName, results: false});
                        iTestQuitMutex --;
                }
        });
}

function createTestData(sDir, sFile) {
        var sTest = createTestName(sFile);
        var sTestMain = sFile;

        var pTestFiles = [];
        var pDirsForScan = [];
        var iDepth = 0;

        fs.readdir(sDir, function(err, list) {
        if (err) throw (err);

        list.forEach(function(sFile) {
                sFile = sDir + "/" + sFile;

                if (path.basename(sFile) == pOptions.tempFile) {
                        return;
                }

            var stat = fs.statSync(sFile);

                if (stat) {
                    if (pOptions.clean == false) {
                            if (stat.isDirectory()) {
                                    iDepth ++;
                                    pDirsForScan.push(sFile);
                                    pTestFiles.push({path: sFile, folder: true});
                            }
                            else if (
                                    path.extname(sFile) !== ".ts" && 
                                    path.extname(sFile) !== ".nw" && 
                                    sFile.substr(-8) !== sTest + ".ts.html") {
                                    pTestFiles.push({path: sFile, folder: false});
                            }
                    }
                    else{
                            if (!stat.isDirectory()) {
                                    if (sFile.substr(-8) === ".ts.html" ||
                                            sFile.substr(-3) === ".nw" ||
                                            sFile.substr(-6) === ".ts.js") {
                                            pCleanFiles.push(sFile);
                                    }
                            }
                    }
            }  
        });

                if (pOptions.clean) {

                        if (pCleanFiles.length == 0) {
                                console.log("Not found files for deletion.");
                        } 
                        else {
                                clearTimeout(iTimeout);
                                iTimeout = setTimeout(function () {
                                        console.log("\n\nFile to be cleaned (" + pCleanFiles.length + "): ");

                                        for (var i in pCleanFiles) {
                                                console.log("\t" + i + ". \"" + pCleanFiles[i] + "\"", "will be removed.");
                                        }

                                        prompt.get({
                                        name: 'yesno',
                                        message: 'Remove all? (y/n)',
                                        validator: /y[es]*|n[o]?/,
                                        warning: 'Must respond yes or no',
                                        default: 'no'
                                    }, function (err, result) {   

                                                if (result.yesno.toLowerCase().substr(0, 1) === 'y') {
                                                        for (var i in pCleanFiles) {
                                                                try {
                                                                        fs.unlinkSync(pCleanFiles[i]);
                                                                } catch (e) {
                                                                        console.log("...")
                                                                }
                                                        }

                                                        console.log(pCleanFiles.length + " file(s) removed.");
                                                }
                                          });
                                }, 30);
                        }
                }
                else {

                if (iDepth == 0) {
                        packTest(sDir, sTestMain, sTest, pTestFiles);
                }

                pDirsForScan.forEach(function(sFile) {
                        scanDir(sFile, function (err, pFileList) {
                                    if (err) throw err;
                                    pTestFiles = pTestFiles.concat(pFileList);

                                    iDepth --;

                                    if (iDepth === 0) {

                                            if (iTestQuitMutex == 0) {
                                                    iTestQuitMutex ++;
                                                    //console.log(sDir, sTestMain, sTest, pTestFiles);
                                                    packTest(sDir, sTestMain, sTest, pTestFiles);
                                            }
                                            else {
                                                    //console.log({dir: sDir, main: sTestMain, name: sTest, data: pTestFiles});
                                                    pTestQueue.push({dir: sDir, main: sTestMain, name: sTest, data: pTestFiles});
                                            }
                                    }
                            }, true);
                })
        }
    });
}

function addTestDirectory(sTestDir, sTestFile) {
        sTestFile = sTestFile || null;

        console.log("> test directory: " + sTestDir + " ");

        if (sTestFile) {
                console.log("> test file: " + sTestFile + " ");
        }

        fs.readdir(sTestDir, function(err, list) {
        if (err) throw (err);
        
        list.forEach(function(sFile) {
                sFile = sTestDir + "/" + sFile;

            fs.stat(sFile, function(err, stat) {
                if (stat) {
                        if (stat.isDirectory() && pOptions.listOnly == false) {
                                console.log("\tdir: " + sFile);
                        }
                        else {
                                if (path.extname(sFile) === ".ts") {
                                        
                                        var sSpace = "";
                                        for (var i = sFile.length; i < 40; ++ i) {
                                                sSpace += " ";
                                        }

                                        if (path.basename(sFile) === pOptions.tempFile) {
                                                fs.unlinkSync(sFile);
                                        }
                                        else if (sTestFile == null || path.basename(sFile) == path.basename(sTestFile)) {
                                                console.log("\tfile: " + sFile + sSpace + "=>   " + createTestName(sFile) + 
                                                        (pOptions.testsFormat.html? 
                                                                ".html": 
                                                                (pOptions.testsFormat.js? ".js": ".nw")
                                                                ));
                                                if (pOptions.listOnly == false) {
                                                        createTestData(sTestDir, sFile);
                                                }
                                        }
                                }
                                else if (pOptions.listOnly == false) {
                                        console.log("\tfile: " + sFile);
                                }
                        }
                }
            });
        });

    });
}


//=================================

parseArguments();
verifyOptions();

process.chdir(pOptions.buildDir);

if (pOptions.magicMode) {
        doMagic();
}

if (!fs.existsSync(pOptions.outputFolder)) { 
        console.log("\n\n> target: CORE\n\n");

    fs.mkdirSync(pOptions.outputFolder);
}

if (pOptions.target.core) {
        buildCore();
}

if (pOptions.target.tests) {

        if (pOptions.testDir) {
                console.log("single test used: " + pOptions.testDir);
                //process.exit(1);
        }

        // scanDir(pOptions.pathToTests,  function(err, results) {
        //         if (err) throw err;


        // });

        console.log("\n> founded test dirs\n");

        buildTests(pOptions.testDir);
}
