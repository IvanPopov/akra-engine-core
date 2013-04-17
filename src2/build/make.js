var sys 	= require('sys')
var fs 		= require('fs');
var exec 	= require('child_process').exec;
var zip 	= require("node-native-zip");
var path 	= require('path');
var spawn 	= require('child_process').spawn;
//var md5 	= require('MD5');
var stream  = require('stream');
var prompt 	= require('prompt');
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
		'\n\t--target	[-t] < "ALL" | "TESTS" | "CORE" > Specify target. Default target is CORE.' + 
		'\n\t--out		[-o] < path/to/output/[ folder | file ] > Specify output folder or file. ' + 
		'\n\t--build		[-d] < path/to/build/directory > Specify build directory. ' + 
		'\n\t--tests		[-s] < path/to/tests/folder > Specify tests directory. ' + 
		'\n\t--test		[-c] < path/to/single/test > Specify test directory. ' + 
		'\n\t--html			Build tests as HTML. ' + 
		'\n\t--nw			Build tests as NW. ' + 
		'\n\t--js			Build tests as JS. ' + 
		'\n\t--help		[-h] Print this text. ' + 
		'\n\t--ES6			Activate ecmascript 6 capability.' + 
		'\n\t--compress		Compress output javascript.' + 
		'\n\t--debug			Debug build.' + 
		'\n\t--no-debug		Release build.' + 
		'\n\t--clean			Clean tests data.' + 
		'\n\t--list		[-l] List all available tests.' + 
		'\n\t--webgl-debug	[-w] Add webgl debug utils.' + 
		'\n\t--do-magic	[-m] It\'s wonderfull magic!(Спросите у Игоря!).' + 
		'\n\t--declaration		Generates corresponding .d.ts file.' +
		'\n\t--preprocess		Preprocessing only.'
	);
	
	process.exit(1);
}
//" + md5((new Date).getTime() + "." + Math.random()) + "
var pOptions = {
	target: {core: true, tests: false},			
	outputFolder: "./bin",		//output file name
	outputFile: null,		//output file name
	buildDir: "./",			//dir from witch we build
	tempFile: "~tmp.ts",		//temprorary file name
	baseDir: __dirname,		//home dir for this script
	includeDir: null,
	capability: null,
	testDir: null,
	pathToTests: null,
	compress: false,
	files: [],
	debug: true,
	pathToTemp: null,
	declaration: false,
	preprocess: false,
	clean: false, //clean tests data instead build
	listOnly: false, //list available tests
	webglDebug: false,
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

	if (pOptions.testsFormat.html 	== false && 
		pOptions.testsFormat.nw 	== false &&
		pOptions.testsFormat.js 	== false) {
		pOptions.testsFormat.html = true;
	}

	// for (var i in pOptions.files) {
	// 	pOptions.files[i] = (path.normalize(pOptions.buildDir + "/" + pOptions.files[i]));
	// 	console.log(">>>>>", pOptions.files[i])
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
		"-D readonly="
		];

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
	var argv = ("-P -C -e utf8 -I " + pOptions.includeDir + " -I " + 
		pOptions.baseDir + "/definitions/ -j -+ -W 0 -k " + 
		capabilityMacro + " " + pOptions.files.join(" ")).split(" ");

	//console.log(pOptions.files);
	console.log(cmd + " " + argv.join(" "));
	
	var mcpp = spawn(cmd, argv, {maxBuffer: BUFFER_SIZE});
	var stdout = new Buffer(BUFFER_SIZE);
	var iTotalChars = 0;

	mcpp.stdout.on('data', function (data) {
	  //console.log('stdout: \n' + data);
	  data.copy(stdout, iTotalChars);
	  
	  iTotalChars  += data.length;
	});

	mcpp.stderr.on('data', function (data) {
	  console.log('stderr: \n' + data);
	});

	mcpp.on('exit', function (code) {
	  console.log('preprocessing exited with code ' + code + " " + (code != 0? "(failed)": "(successful)"));
	
	  if (code == 0) {
	  	pOptions.pathToTemp = pOptions.outputFolder + "/" + pOptions.tempFile;
		
		if (pOptions.preprocess) {
			fs.writeFileSync(pOptions.outputFolder + "/" + pOptions.outputFile, stdout.slice(0, iTotalChars), "utf8");
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
	var argv = (  
		pOptions.baseDir + "/tsc.js -c --target ES5  " + 
		pOptions.baseDir + "/definitions/fixes.d.ts " +
		//pOptions.baseDir + "/WebGL.d.ts " + 
		pOptions.pathToTemp + " --out " +
		pOptions.outputFolder + "/" + pOptions.outputFile +
		// (pOptions.compress? " --comments --jsdoc ": "") + 
		(pOptions.declaration? " --declaration ": "") +
		" --cflowu --const").replace(/\s+/ig, " ").split(" ");

	console.log((cmd + " " + argv.join(" ")));//.split(" ")
    
	var node = spawn(cmd, argv, { maxBuffer: BUFFER_SIZE, stdio: 'inherit' });

	node.on('exit', function (code) {
	  console.log('compilation exited with code ' + code + " " + (code != 0? "(failed)": "(successful)"));

	  if (code == 0) {
	  	var sOutputFile = pOptions.outputFolder + "/" + pOptions.outputFile;

	  	console.log("compiled to: ", sOutputFile);

		fs.unlink(pOptions.pathToTemp, function (err) {
			if (err && fs.existsSync(pOptions.pathToTemp)) {
				throw err;
			}

			console.log("temp file: " + pOptions.pathToTemp + " removed.\n\n");
			
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
		pDeps.push(pMatches[1]);
	}

	return pDeps;
}

function fetchDeps(sDir, pDeps) {
	for (var i in pDeps) {

		var sDep = path.normalize( pOptions.includeDir + pDeps[i]);
		var sDepContent;
		var stat;

		if (fs.existsSync(sDep)) {
			stat = fs.statSync(sDep);
			if (stat.isDirectory()) {
				wrench.copyDirSyncRecursive(path.resolve(sDep), path.resolve(sDir + "/" + path.basename(sDep)));
			}
			else {
				fs.writeFileSync(sDir + "/" + path.basename(sDep), fs.readFileSync(sDep, "utf-8"), "utf-8");
			}
		}
	}
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

	var pAdditionalScripts = findDepends(sTestData, /\/\/\/\s*@script\s+([^\s]+)\s*/ig);
	var sAdditionalCode = "";


	var pAdditionalCSS = findDepends(sTestData, /\/\/\/\s*@css\s+([^\s]+)\s*/ig);
	var sAdditionalCSS = "";


	var pArchive;
	var sIndexHTML;


    if (pOptions.webglDebug) {
    	pAdditionalScripts.push("webgl-debug.js");
    	sTestData += "\n\n/// @dep ../build/webgl-debug.js \n"
    }


	for (var i in pAdditionalScripts) {
		sAdditionalCode += "<script type=\"text/javascript\" src=\"" + pAdditionalScripts[i] + "\">" + 
							"</script>";
	}


	for (var i in pAdditionalCSS) {
		sAdditionalCSS += "<link rel=\"stylesheet\" type=\"text/css\" href=\"" + pAdditionalCSS[i] + "\">";
	}

    sIndexHTML = "\n\
				  <html>                           					\n\
                  	<head>                               			\n\
                  		<title>" + sFile + "</title>   				\n\
                  		" + sAdditionalCSS + "						\n\
                  	</head>                              			\n\
                  	<body>                               			\n\
                  		" + sAdditionalCode + "				  		\n\
                  		<script>" + sTestData + "</script>   		\n\
                  </html>";
    
    


    fetchDeps(sDir, findDepends(sTestData, /\/\/\/\s*@dep\s+([\w\d\.\-\/]+)\s*/ig));


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
		writeOutput(sDir + "/" + sName + ".ts.html", sIndexHTML);
	}
	else if (sFormat == "js") {
		writeOutput(sDir + "/" + sName + ".ts.js", sTestData);	
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

	
	console.log("\nWebGL debug: " + (pOptions.webglDebug? "ON": "OFF"));
	

	var sTempFile = sFile + ".temp.js";

	var cmd = "node";

	var argv = (pOptions.baseDir + "/make.js -o " + sTempFile +" -t CORE " + 
		(pOptions.capability? " --ES6 ": "") + 
		(pOptions.compress? " --compress ": "") + 
		(pOptions.declaration? " --declaration ": "") + 
		(pOptions.debug? " --debug ": "") + 
		sFile).split(" ");

	console.log(cmd + " " + argv.join(" "));
	
	var node = spawn(cmd, argv, { maxBuffer: BUFFER_SIZE, stdio: 'inherit' });

	node.on('exit', function (code) {
	    console.log("test " + sFile + " packed with code " + code);
		if (code == 0) {
        
			var compileTestMacro = function (sFormat) {
				compileTest(
					sDir, 
					sFile, 
					sName, 
					pData, 
					fs.readFileSync(sTempFile + (pOptions.compress? ".min": ""), "utf8"), 
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


			fs.unlinkSync(sTempFile)

			if (pOptions.compress) {
				fs.unlinkSync(sTempFile + ".min");
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
	// 	if (err) throw err;


	// });
	
	console.log("\n> founded test dirs\n");

	buildTests(pOptions.testDir);
}
