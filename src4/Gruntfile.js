//TODO: separate build into DEBUG and RELEASE
//TODO: after compilation into TS, use closure-linter
//TODO: add minification with closure ADVANCED_MODE
//TODO: add automatic insertion of copyright and license to start source 
//TODO: obtain version from package.json

'use strict';

var files = require("./akraFiles").files;
var path = require("path");


module.exports = function (grunt) {
    var extend = require('util')._extend,
        resolve = require('path').resolve;

    require(path.resolve('tasks/build.js'))(grunt);
    //require(path.resolve('tasks/tscc.js'))(grunt);
    //require(path.resolve('tasks/closure.js'))(grunt);

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-regarde");
    grunt.loadNpmTasks('grunt-tslint');
    grunt.loadNpmTasks('grunt-gjslint');

    require('time-grunt')(grunt);

    //TODO: util.getVersion() from package.json
    var VERSION = {
        full: "0.1.0"
    };

    var dist = "akraengine-" + VERSION.full;

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        build: {
            parser: {
                src: files.akraParser,
                dest: "build/parser.js",
                options: {
                    tscc: false,
                    target: "es3"
                }
            },
            core: {
                src: files.akraCore,
                dest: "build/akra.js",
                options: {
                    target: "es3",
                    removeComments: false,
                    //sourceMap: true,
                    propagateEnumConstants: true
                }
            },
            ui: {
                src: files.akraUI,
                dest: "build/akra-ui.js",
                options: {
                    target: "es3",
                    removeComments: false,
                    //sourceMap: true,
                    propagateEnumConstants: true
                }
            },
            //addons: {
                "addon-navigation": {
                    src: files.akraAddons.navigation,
                    dest: "build/addons/navigation.addon.js",
                    options: {
                        target: "es3",
                        removeComments: true,
                        propagateEnumConstants: true
                    }
                },
                "addon-filedrop": {
                    src: files.akraAddons.filedrop,
                    dest: "build/addons/filedrop.addon.js",
                    options: {
                        target: "es3",
                        removeComments: true,
                        propagateEnumConstants: true
                    }
                }
            //}
        },
        clean: {
            build: {
                src: ["build/**/*.js"]
            }
        },
        regarde: {
            src: {
                files: ["src/**/*.*"],
                tasks: ["tslint"]
            }
        },
        tslint: {
            options: {
                configuration: grunt.file.readJSON("tslint.json")
            },
            files: {
                src: files.all
            }
        },
        gjslint: {
            options: {
                flags: [
                    '--flagfile .gjslintrc' //use flag file
                ],
                reporter: {
                    name: 'console' //report to console
                },
                force: false //don't fail if python is not installed on the computer
            },
            parser: {
                src: ['build/parser.js']
            }
        }
    });

    var target = grunt.option('module') || 'core';
    grunt.registerTask("compile", ["build:" + target]);

    grunt.registerTask('decl', 'Build declaration.', function(n) {
      grunt.config("build." + target + ".options.declaration", true);
      grunt.task.run("compile");
    });

    grunt.registerTask("lint", ["tslint"]);
    grunt.registerTask("default", ["compile"]);
    //grunt.registerTask("build", ["compile", "concat", "uglify"]);
    //grunt.registerTask("generate", ["compile", "build", "copy:public"]);
    //return grunt.registerTask("preview", ["generate", "connect:preview", "regarde"]);
};