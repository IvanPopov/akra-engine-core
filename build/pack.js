var fs = require('fs');
var exec = require('child_process').exec;

function include(sPath) {
	eval(fs.readFileSync(sPath, 'utf-8'));
}

function now() {
	return (new Date).getTime();
}

var sFilename = null,
	sOutputFile = null,
	sOutputFileMacro = null,
	sOutputFileCode = null,
	sOutputPath = '',
	sCode = null,
	sMacro = null;


function outputFileCode(sFile) {
	sFile = sFile.substr(0, sFile.lastIndexOf('.')) || ('output-' + (new Data()));
	
	if (sFile.lastIndexOf('/') >= 0) {
		sOutputPath = sFile.substr(0, sFile.lastIndexOf('/')) + '/';
		sFile = sFile.substr(sFile.lastIndexOf('/') + 1, sFile.length);
	}
	
	
	sOutputFileMacro = sFile + '-macro.js';
	sOutputFileCode = sFile + '-compiled.js';
	return "Include('" + sOutputFileMacro + "');\nInsert('" + sOutputFileCode + "');\n";
}

function usage() {
	console.log( 'usage: ' + 
		'\n\t--analyzer		[-n] Use analyzer. ' + 
		'\n\t--ide			[-I] Use IDE build. ' + 
		'\n\t--home			[-h] < path/to/home > ' + 
		'\n\t--esprima		[-e] < path/to/esprima.js > ' + 
		'\n\t--preprocessor	[-p] < path/to/preprocessor.js > ' + 
		'\n\t--input		[-i] < path/to/target.js > ' + 
		'\n\t--output		[-o] < path/to/output.js >'
	);
	process.exit(1);
}

if (process.argv.length < 6) {
	usage();
}

var esprima = null;
var preprocessor = null;
var begin = now();
var home = null;
var sDefine = '';

(function () {
	for (var i = 2; i < process.argv.length; ++ i) {
		switch (process.argv[i]) {
			case '--analyzer':
			case '-n':
				sDefine += 'Define(__ANALYZER, true);';
				break;
			case '-I':
            case '--ide':
                sDefine += 'Define(__IDE, true);';
                break;
			case '-h':
			case '--home':
				home = process.argv[++ i];
				break;
			case '-e':
			case '--esprima':
				esprima = require(process.argv[++ i]);
				break;
			case '-p':
			case '--preprocessor':
				if (esprima) {
					preprocessor = require(process.argv[++ i]);
				}
				else {
					include(process.argv[++ i]);
					preprocessor = Preprocessor;
				}	
				break;
			case '-i':
			case '--input':
				sFilename = __dirname  + '/' + process.argv[++ i];
				sDefine += (home? 'Define(A_CORE_HOME, "' + home + '");\n': '');
				preprocessor.log = true;
				console.log('build starting ...');
				try {
					sCode = preprocessor.code(sDefine + 'Include("' + sFilename + '");');
					sMacro = preprocessor.extractFileMacro(sFilename, null, null, null, false);
				} catch (e) {
					console.log('details: ')
					console.log('\t',e);
					return;
				}
				
				//console.log(sMacro, sCode);
				break;
			case '-o':
			case '--output':
				sOutputFile = process.argv[++ i];
				fs.writeFileSync(sOutputFile.substr(0, sOutputFile.lastIndexOf('/')) + '/Include.js', outputFileCode(sOutputFile), 'utf-8');
				fs.writeFileSync(sOutputPath + sOutputFileCode, sCode, 'utf-8');
				fs.writeFileSync(sOutputPath + sOutputFileMacro, sDefine + sMacro, 'utf-8');
				console.log('Preprocessing is completed within ' + (now() - begin) + ' msek.')
				console.log('Home dir set into: "' + (home? home: '') + '".');
				break;
			default:
				usage();	
		}
	};
})();