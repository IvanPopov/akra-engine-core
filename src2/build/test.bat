@rem test.bat
@echo off
cls && node make.js inc/akra.ts -o ./bin/akra.js --build ../ -t TESTS --ES6 --tests tests/common --js --no-const %*