single test used: tests/common/ide/intro2.ts

> founded test dirs

> test directory: tests/common/ide 
> test file: intro2.ts 
	dir: tests/common/ide/DEBUG
	file: tests/common/ide/demo.css
	file: tests/common/ide/demo02.ara
	file: tests/common/ide/film.json
	file: tests/common/ide/intro2.ts              =>   intro2.js
	dir: tests/common/ide/RELEASE


#########################################################
### PACK TEST: tests/common/ide/intro2.ts
#########################################################


node C:\WebServers\home\akra\www\akra-engine-core\src2\build/make.js -o tests/common/ide/intro2.ts.temp.js -t CORE  --ES6  --debug   --no-const  tests/common/ide/intro2.ts

> preprocessing started (5664)

Debug build.
EcmaScript 6 capability enabled.
C:\WebServers\home\akra\www\akra-engine-core\src2\build/mcpp -P -C -e utf8 -I inc/ -I ./ -I C:\WebServers\home\akra\www\akra-engine-core\src2\build/definitions/ -j -+ -W 0 -k -D protected=/**@protected*/ -D const=/**@const*/var -D struct=class -D readonly= -D writeonly= -D DEBUG=DEBUG tests/common/ide/intro2.ts
preprocessing exited with code 0 (successful)
preprocessed to:  tests\common\ide/~tmp.ts

> compilation started (5664)  

node C:\WebServers\home\akra\www\akra-engine-core\src2\build/tsc.js -c --target ES5 C:\WebServers\home\akra\www\akra-engine-core\src2\build/definitions/fixes.d.ts tests\common\ide/~tmp.ts --out tests\common\ide/DEBUG/intro2.ts.temp.js --cflowu 
Завершить выполнение пакетного файла [Y(да)/N(нет)]? 
