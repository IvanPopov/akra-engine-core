@echo off
set OUTPUT_FOLDER="compiled/"
set ESPRIMA="../../akra-engine-general/preprocessor/esprima.js"
set PREPROCESSOR="../../akra-engine-general/preprocessor/approc.js"
set SRC="../src/"
set CORE_LOCATION="/akra-engine-core/src/"
set OUTPUT_SCRIPT_NAME=%OUTPUT_FOLDER%/akra-engine.js

cd Z:\home\akra\www\akra-engine-core\build\ && node pack.js -h %CORE_LOCATION% -e %ESPRIMA% -p %PREPROCESSOR% -i %SRC% -o %OUTPUT_SCRIPT_NAME%
