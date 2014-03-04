//TODO: separate build into DEBUG and RELEASE
//TODO: after compilation into TS, use closure-linter
//TODO: add minification with closure ADVANCED_MODE
//TODO: add automatic insertion of copyright and license to start source 
//TODO: obtain version from package.json

'use strict';

var files = require("./akraFiles").files;
var path = require("path");
var util = require('./lib/grunt/utils.js');

module.exports = function (grunt) {
	require(path.resolve('lib/grunt/build2.js'))(grunt);

	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-regarde");
	grunt.loadNpmTasks('grunt-tslint');
	grunt.loadNpmTasks('grunt-gjslint');

	require('time-grunt')(grunt);

	grunt.initConfig({
		//global configuration
		Configuration: 'Debug',
		Version: util.getVersion(),
		ProjectName: null,
		ProjectDir: null,
		OutFile: null,



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
				config: "src/akra/akra.xml"
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
					propagateEnumConstants: true,
					sourceMap: true
				}
			},
			"addon-filedrop": {
				src: files.akraAddons.filedrop,
				dest: "build/addons/filedrop.addon.js",
				options: {
					target: "es3",
					removeComments: true,
					propagateEnumConstants: true,
					sourceMap: true
				}
			},
			"addon-base3dObjects": {
				src: files.akraAddons.base3dObjects,
				dest: "build/addons/base3dObjects.addon.js",
				options: {
					target: "es3",
					removeComments: true,
					propagateEnumConstants: true,
					sourceMap: true
				}
			},
			"addon-progress": {
				src: files.akraAddons.progress,
				dest: "build/addons/progress.addon.js",
				options: {
					target: "es3",
					removeComments: true,
					propagateEnumConstants: true,
					sourceMap: true
				}
			}
			//}
		},
		clean: {
			build: {
				src: ["build/*"]
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


	grunt.config("Configuration", grunt.option('configuration') || 'Debug');
	grunt.log.writeln("Configuration: " + grunt.config.get("Configuration"));

	grunt.registerTask('decl', 'Build with declaration.', function (target) {
		grunt.config("build." + target + ".options.declaration", true);
		grunt.task.run("build:" + target);
	});

	grunt.registerTask("lint", ["tslint"]);
	grunt.registerTask("default", ["all"]);
	grunt.registerTask("all", [
		"decl:core",
		"decl:parser",
		"decl:addon-navigation",
		"decl:addon-filedrop",
		"decl:addon-base3dObjects",
		"decl:addon-progress",
		"decl:ui"
	]);


	//grunt.registerTask("build", ["compile", "concat", "uglify"]);
	//grunt.registerTask("generate", ["compile", "build", "copy:public"]);
	//return grunt.registerTask("preview", ["generate", "connect:preview", "regarde"]);
};