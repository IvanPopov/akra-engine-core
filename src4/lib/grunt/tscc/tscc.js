#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var tsc = path.normalize(__dirname + '/../typescript-0.9.5/tsc.js');

var DEFINES = [];
var MANGLE_NAMES = false;
var DETECT_CONSTANTS = false;

for (var i = 2; i < process.argv.length; i++) {
  var arg = process.argv[i];
  if (arg === '--define' && i + 1 < process.argv.length) {
    DEFINES.push(process.argv.splice(i--, 2)[1]);
  } else if (arg === '--mangle') {
    MANGLE_NAMES = true;
    process.argv.splice(i--, 1);
  } else if (arg === '--const') {
    DETECT_CONSTANTS = true;
    process.argv.splice(i--, 1);
  }
}

eval(fs
  .readFileSync(tsc, 'utf8')
  .replace(/batch\.batchCompile\(\);\s*$/, '')
  .replace(/\btsc\b/g, 'tscc'));

eval(fs.readFileSync(path.resolve(__dirname, 'emitter2.js'), 'utf8'));
eval(fs.readFileSync(path.resolve(__dirname, 'patches2.js'), 'utf8'));

TypeScript.OptionsParser.prototype.printUsage = function(printUsage) {
  var optionsText = 'TypeScript.getLocalizedText(TypeScript.DiagnosticCode.Options, null)';
  var closureCompilerOptions = [
    'Google Closure Compiler options:',
    '  --define VAR                  Generate a @define annotation for VAR',
    '  --const                       Attempt to detect and annotate constants with @const',
    '  --mangle                      Attempt to mangle internal names for better compression',
    '',
    ''
  ].join('\n');
  return eval('(' + printUsage.toString().replace(optionsText, JSON.stringify(closureCompilerOptions) + ' + ' + optionsText) + ')');
}(TypeScript.OptionsParser.prototype.printUsage);

TypeScript.Emitter.DEFINES = DEFINES;
TypeScript.Emitter.MANGLE_NAMES = MANGLE_NAMES;
TypeScript.Emitter.DETECT_CONSTANTS = DETECT_CONSTANTS;
process.mainModule.filename = tsc;
batch.batchCompile();
