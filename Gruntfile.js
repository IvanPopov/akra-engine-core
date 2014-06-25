//TODO: after compilation into TS, use closure-linter
//TODO: add automatic insertion of copyright and license to start source 
'use strict';

var path = require("path");
var util = require('./lib/grunt/utils.js');

module.exports = function (grunt) {
	require('./lib/grunt/build.js')(grunt);

	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-connect");
	// grunt.loadNpmTasks("grunt-regarde");
	grunt.loadNpmTasks('grunt-tslint');
	grunt.loadNpmTasks('grunt-gjslint');
	grunt.loadNpmTasks('grunt-parallel');

	require('time-grunt')(grunt);

	grunt.initConfig({
		//configuration
		Configuration: 'Debug',//Release
		Version: null,//util.getVersion(),
		DemosSourceDir: "src/demos",
		BuiltDir: "built",
		Pkg: grunt.file.readJSON("package.json"),
		WebGLDebug: false,
		BuildType: "Production",



		build: {
			"parser": { config: "src/akra/parser.xml" },
			"core": { config: "src/akra/core.xml" },
			"ui": { config: "src/akra-ui/ui.xml" },
			"addon-navigation": { config: "src/akra-addons/addons/navigation.xml" },
			"addon-filedrop": { config: "src/akra-addons/addons/filedrop.xml" },
			"addon-base3dObjects": { config: "src/akra-addons/addons/base3dObjects.xml" },
			"addon-progress": { config: "src/akra-addons/addons/progress.xml" },
			"addon-compatibility": { config: "src/akra-addons/addons/compatibility.xml" }
		},
		clean: {
			build: {
				src: ['built/*']
			}
		},

		parallel: {
		    addons: {
		    	options: {
					grunt: true
				},
		      	tasks: [
			        'build:addon-base3dObjects',
			       	'build:addon-navigation',
			        'build:addon-filedrop',
			        'build:addon-progress',
			        'build:addon-compatibility',
				]
			},
			// demos: {
			// 	//DO NOT EDIT THIS SECTION
			// 	//will be filled automatically
			// }
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


	if (grunt.option('Release') || grunt.option('release')) {
		grunt.config("Configuration", 'Release');
	}

	if (grunt.option('Debug') || grunt.option('debug')) {
		grunt.config("Configuration", 'Debug');
	}

	if (grunt.option('configuration')) {
		grunt.config("Configuration", grunt.option('configuration'));

		switch (grunt.config("Configuration")) {
			case "Release":
			case "Debug":
				break;
			default:
				grunt.fail.fatal("Unknown configuration used: " + grunt.config("Configuration"));
		}
	}

	if (grunt.option('Dev') || grunt.option('dev')) {
		grunt.config("BuildType", 'Dev');
		grunt.config("Configuration", 'Debug');
		grunt.config("BuiltDir", path.join(grunt.config("BuiltDir"), "Dev"));
	}
	else {
		grunt.config("BuiltDir", path.join(grunt.config("BuiltDir"), grunt.config("Configuration")));
	}

	//clean up build path
	grunt.config("clean.build.src", grunt.config("clean.build.src").map(function(path) { return path.replace(/built\/\*/g, grunt.config("BuiltDir")); }));

	if (grunt.config.get("Configuration").toUpperCase() === "DEBUG") {
		process.env['DEBUG'] = 'DEBUG';
	}

	grunt.config("Version", util.getVersion());

	grunt.log.writeln("Version: " + grunt.config.get("Version").full);
	

	grunt.log.writeln("Configuration: " + grunt.config.get("Configuration"));
	grunt.log.writeln("Build type: " + grunt.config.get("BuildType"));
	grunt.log.writeln("Built directory: " + grunt.config.get("BuiltDir"));

	grunt.config("WebGLDebug", grunt.option('webgl-debug') || false);
	grunt.log.writeln("WebGL debug: " + (grunt.option('webgl-debug') || false));



	grunt.registerTask("lint", ["tslint"]);
	grunt.registerTask("default", ["all"]);
	grunt.registerTask("all", [
		"build:core",
		"build:parser",
		"build:addon-compatibility",
		"build:addon-navigation",
		"build:addon-filedrop",
		"build:addon-base3dObjects",
		"build:addon-progress"
	]);

	grunt.registerTask("addons", ['build:core', 'parallel:addons']);


	//grunt.registerTask("build", ["compile", "concat", "uglify"]);
	//grunt.registerTask("generate", ["compile", "build", "copy:public"]);
	//return grunt.registerTask("preview", ["generate", "connect:preview", "regarde"]);
};