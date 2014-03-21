//TODO: after compilation into TS, use closure-linter
//TODO: add automatic insertion of copyright and license to start source 
'use strict';

var path = require("path");
var util = require('./lib/grunt/utils.js');

module.exports = function (grunt) {
	require('./lib/grunt/build2.js')(grunt);

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
		//configuration
		Configuration: 'Debug',
		Version: util.getVersion(),
		DemosSourceDir: "src/demos",
		BuiltDir: "built",
		Pkg: grunt.file.readJSON("package.json"),




		build: {
			"parser": { config: "src/akra/parser.xml" },
			"core": { config: "src/akra/akra.xml" },
			"ui": { config: "src/akra-ui/ui.xml" },
			"addon-navigation": { config: "src/akra-addons/addons/navigation.xml" },
			"addon-filedrop": { config: "src/akra-addons/addons/filedrop.xml" },
			"addon-base3dObjects": { config: "src/akra-addons/addons/base3dObjects.xml" },
			"addon-progress": { config: "src/akra-addons/addons/progress.xml" }
		},
		clean: {
			build: {
				src: ['built/*']
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
				src: []
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
			}
		}
	});


	grunt.config("Configuration", grunt.option('configuration') || 'Debug');
	grunt.log.writeln("Configuration: " + grunt.config.get("Configuration"));

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