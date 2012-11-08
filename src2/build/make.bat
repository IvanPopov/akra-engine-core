
@ECHO OFF

set source_dir="./"
set output_file=""
set file=""
set current_dir=%CD%

:loop
IF "%~1"=="" GOTO cont
IF /I "%~1"=="-h" (
	GOTO err
)
IF /I "%~1"=="-D" (
	SET source_dir="%2"
	SHIFT
	SHIFT
)
IF /I "%~1"=="-o" (
	SET output_file="%2"
	SHIFT
	SHIFT
)
IF NOT "%~1"=="" (
	SET file="%1" 
)
:next
SHIFT & GOTO loop

:cont

IF %file%=="" GOTO err
IF %output_file%=="" SET output_file="%file%.out"

echo "CURRENT: %current_dir%"
echo "SOURCE: %source_dir%"
echo "OUT: %output_file%"
echo "FILES: %file%"


mcpp -P -C -e utf8 -I %source_dir%/inc/ -j -+ -W 0 -k -D inline=/**@inline*/ %file% > %source_dir%/tmp.ts

cd %source_dir%
::if exist tmp.ts DEL tmp.ts

set filename=%output_file%
for %%A in ("%filename%") do (
    set output_folder=%%~dpA
    set output_filename=%%~nxA
)

if not exist %output_folder% mkdir %output_folder%
::%current_dir%\lib.d.ts
node %current_dir%/tsc.js -c --target ES5  %current_dir%\fixes.d.ts %current_dir%\WebGL.d.ts tmp.ts --out %current_dir%/%output_file%


::DEL tmp.ts
cd %current_dir%



IF NOT %file%=="" GOTO end


:err
	echo "usage: "
	echo "[-D build_dir] for specify build directory"
	echo "[-o output_file] for specify output file"
	echo "[input_file] for specify input file"
:end