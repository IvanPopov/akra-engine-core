@rem build.bat
@echo off
node make.js inc/akra.ts -o ./bin/akra.js --build ../ -t CORE --ES6 --declaration --gui --filesave-api --filedrop-api %*

