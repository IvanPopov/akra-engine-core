'use strict';

var spawn = require('child_process').spawn;
var path = require('path');
var fs = require('fs');
var xml2js = require('xml2js');

var TYPESCRIPT = "typescript-0.9.5";

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

        /**
         * 0 - none minimizing, 1 - simple optimization, 2 - advanced optimiztion
        */
        var minimizationLevel = 0;
        if(grunt.option("min_level") && grunt.option("min_level") > 0) {
            minimizationLevel = grunt.option("min_level");
        }
        else if(grunt.option("minimize")){
            minimizationLevel = 2;
        }
        else if(options.min_level > 0){
            minimizationLevel = options.min_level;
        }

        var tsBin = ""; 
        if(options.tscc || grunt.option("tscc") || minimizationLevel > 0){
            tsBin = path.normalize(__dirname + '/tscc/tscc.js');
        }
        else {
            tsBin = path.normalize(__dirname + "/" + TYPESCRIPT + "/tsc.js");
        }
        
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
                packResources(sourcePaths, dest, options, function () {
                    if(minimizationLevel > 0){
                        minimize(dest, minimizationLevel, cb);
                    }
                    else {
                        cb();
                    }
                });
            }
            else {
               //grunt.log.errorlns("Compilation failed. Exited with code " + code);
               grunt.fail.fatal(new Error("Compilation failed."));
               // cb(false);
            }
        });
    }

    function packResources(sourcePaths, dest, options, cb) {
        var srcFiles = [];
        var shortestPath = null;
        var resourceFolder = null;

        //normalize all pathes
        for (var i = 0; i < sourcePaths.length; ++ i) {
            var srcFile = sourcePaths[i];

            srcFiles.push(path.resolve(path.dirname(srcFile)));
        }

        //sort > shortest path will be first
        srcFiles.sort(function (a, b) {return a.length < b.length? -1: 1 });
        
            resourceFolder = srcFiles[0];
        
        if (srcFiles.length > 1) {
            var dirs1 = srcFiles[0].split(path.sep);
            var dirs2 = srcFiles[1].split(path.sep);

            for (var i = 0; i < dirs1.length; ++ i) {
                if (dirs1[i] != dirs2[i]) {
                    resourceFolder = dirs1.slice(0, i - 1).join(path.sep);
                }
            }
        }

        grunt.log.debug("Automaticly detected resource folder:", resourceFolder);

        var resourceFile = path.join(resourceFolder, "resources.xml");

        if (!fs.existsSync(resourceFile)) {
            grunt.log.debug("Could not find resoure.xml");
            cb();
        }

        grunt.log.debug("Resources:", resourceFile);
        
        var parser = new xml2js.Parser();

        fs.readFile(resourceFile, function(err, data) {
            parser.parseString(data, function (err, xml) {
               //if (!xml.Project)
                for (var i = 0; i < xml.AkraResources.Project.length; ++ i) {
                    var Project = xml.AkraResources.Project[i];
                    //if (Project.$.Name)
                    console.log(Project.$.Name, xml.AkraResources.Project[i]);
                }

                cb();
            });
        });
    }

    function minimize(src, level, cb){
        if(!src || !grunt.file.exists(src)){
            grunt.log.warn('Source file for minimize "' + src + '" not found.');
            return;
        }

        var dest = src.replace(/\.js$/, ".min.js");
        if(src === dest) dest += ".min";

        var closureJar = path.normalize(__dirname + '/closure/compiler.jar');
        var levelStr = level === 2 ? "ADVANCED_OPTIMIZATIONS" : "SIMPLE_OPTIMIZATIONS";        
        var cmd = "java";
        var argv = ["-jar", closureJar, 
                    "--compilation_level", levelStr, 
                    "--js", src,
                    "--js_output_file", dest];

        grunt.log.writeln(cmd + " " + argv.join(" "));
        
        var closure = spawn(cmd, argv);

        closure.stdout.on("data", function (data) {
            grunt.log.write(data.toString());
        });

        closure.stderr.on("data", function (data) {
            grunt.log.error(data.toString());
        });

        closure.on("close", function (code) {
            if (code === 0) {
                cb();
            }
            else {
                grunt.fail.fatal(new Error("Closure minimization failed."));
            }
            //else {
            //    grunt.log.errorlns("Compilation failed. Exited with code " + code);
            //}
        });


    }
  

    grunt.registerMultiTask("build", function () {
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
