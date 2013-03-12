#!/bin/sh
clear && node make.js inc/akra.ts -o ./bin/akra.js --build ../ -t TESTS --ES6 --tests tests/common $@