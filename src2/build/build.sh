#!/bin/sh
clear && node make.js inc/akra.ts -o ./bin/akra.js --build ../ -t CORE --ES6 $@

