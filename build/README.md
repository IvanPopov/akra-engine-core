Use pack.js for compile akra engine sources into developer's package consist of include file (Include.js), file with macro and file with pure js sources.

Example:
node pack.js -h "/akra-engine-core/src/" -e %ESPRIMA% -p %PREPROCESSOR% -i "../src/" -o compiled/akra.js
where %ESPRIMA% - path to esprima(f.e. "set ESPRIMA=../../akra-engine-general/preprocessor/esprima.js")
and %PREPROCESSOR% - path to approc(f.e. "set PREPROCESSOR=../../akra-engine-general/preprocessor/compiled/approc-1.1.3.min.js")