'use strict';

var spawn = require('child_process').spawn;
var path = require('path');

//TODO: add all available TS options

module.exports = function (grunt) {
    function compile(sourcePaths, dest, options, cb) {

        var filteredPaths = sourcePaths.filter(function (path) {
            if (!grunt.file.exists(path)) {
                grunt.log.warn('Source file "' + path + '" not found.');
                return false;
            } else {
                return true;
            }
        });

        var tsBin = path.normalize(__dirname + '/typescript/tsc.js');
        var argv = [tsBin].concat(sourcePaths);

        if (options.target) {
            argv.push("--target", options.target);
        }

        if (options.module) {
            argv.push("--module", options.module);
        }

        if (options.sourceMap) {
            argv.push("--sourcemap");
        }

        if (options.declaration) {
            argv.push("--declaration");
        }

        if (options.propagateEnumConstants) {
            argv.push("--propagateEnumConstants");
        }

        if (dest) {
            argv.push("--out", dest);
        }

        var cmd = "node";

        grunt.log.writeln(cmd + " " + argv.join(" "));

        var tsc = spawn(cmd, argv);

        tsc.stdout.on("data", function (data) {
            grunt.log.write(data.toString());
        });

        tsc.stderr.on("data", function (data) {
            grunt.log.error(data.toString());
        });

        tsc.on("close", function (code) {
            if (code === 0) {
                cb();
            }
            //else {
            //    grunt.log.errorlns("Compilation failed. Exited with code " + code);
            //}
        });
    }

  

    grunt.registerMultiTask("typescript", function () {
        var pendingFiles = this.files.length;

        if (pendingFiles > 0) {
            var opts = this.data,
                done = this.async();

            this.files.forEach(function (file) {
                compile(file.src, file.dest, opts.options, function () {
                    pendingFiles = pendingFiles - 1;
                    if (pendingFiles === 0) {
                        done();
                    }
                });
            });
        }
    });

};
