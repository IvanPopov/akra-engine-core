/**
 * Typescript build task for Akra 3D engine.
 */

'use strict';

var spawn = require('child_process').spawn;
var path = require('path');
var url = require('url');
var fs = require('fs');
var xmldom = require('xmldom');
var domain = require('domain');
var Zip = require('node-native-zip');
var jade = require('jade');
var temp = require('temporary');
var shell = require('shelljs');
// var gm = require('gm');


require('shelljs/global');

var TYPESCRIPT = "typescript-1.0";


module.exports = function (grunt) {

	function rmdir(path) {
		var files = [];
		if (fs.existsSync(path)) {
			files = fs.readdirSync(path);
			files.forEach(function (file, index) {
				var curPath = path + "/" + file;
				if (fs.lstatSync(curPath).isDirectory()) { // recurse
					rmdir(curPath);
				} else { // delete file
					fs.unlinkSync(curPath);
				}
			});
			fs.rmdirSync(path);
		}
	};

	function wraptext(width, text) {
		if (text.length > width) {
			return text.substr(0, width - 3) + '...';
		}

		var delta = width - text.length;
		return text + (new Array(delta + 1)).join(" ");
	}

	function isDev() {
		return cfg('BuildType') == "Dev";
	}

	function mv(from, to) {
		copy(from, to);
		if (path.normalize(from) !== path.normalize(to)) {
			rm(from);
		}
	}

	function rm(file) {
		return fs.unlinkSync(file);
	}

	function copy(from, to) {
		return grunt.file.copy(from, to);
	}

	function copyDir(from, to) {
		var files =
			grunt.file.expand({ filter: 'isFile' }, [path.join(from, '**/*')]);

		
		//console.log(path.relative(to, from));

		files.forEach(function (file) {
			copy(file, path.join(to, path.relative(path.resolve(from), file)));
		});
	}

	function exists(file) {
		return grunt.file.exists(file);
	}

	function read(file, encoding) {
		encoding = encoding || "utf8";
		return grunt.file.read(file, { encoding: encoding });
	}

	function write(file, data, encoding) {
		encoding = encoding || "utf8";
		return grunt.file.write(file, data, { encoding: encoding });
	}

	var log = grunt.log.writeln.bind(grunt.log);
	var error = grunt.log.error.bind(grunt.log);
	var debug = grunt.log.debug.bind(grunt.log);
	var warn = grunt.log.warn.bind(grunt.log);

	var fail = grunt.fail.warn.bind(grunt.fail);
	var fatal = grunt.fail.fatal.bind(grunt.fail);
	var oklns = grunt.log.oklns.bind(grunt.log);

	var isDir = grunt.file.isDir.bind(grunt.file);


	function cfg(opt, val) {
		if (arguments.length == 2) {
			return grunt.config(opt, val);
		}

		return grunt.config.get(opt);
	}

	function startAnimation(delay) {
		delay = delay || 250;
		return setInterval(function () {
			grunt.log.write(".");
		}, delay);
	}

	function stopAnimation(anim) {
		grunt.log.ok();
		clearInterval(anim);
	}

	/** 
	 * @param configFile Path to config.
	 * @param cb Callback.
	 * @param forceRebuild=true Force rebuild.
	 * @param modulesInfo Дополнительная информация об уже собранных модулях, нужна для оптимизации сборки.
	 */
	function compile(configFile, cb, forceRebuild, modulesInfo) {
		forceRebuild = forceRebuild === undefined ? true : forceRebuild;
		modulesInfo = modulesInfo || null;

		var config;

		if (typeof configFile === "string") {
			config = loadConfig(configFile);
		}
		else {
			config = configFile;
		}


		compileTypescript(config, cb, forceRebuild, modulesInfo);
	}

	function loadConfig(file) {
		//var xsd = libxmljs.parseXmlString(read(path.join(__dirname, "schema.xsd")));
		//var xml = libxmljs.parseXmlString(read(file));
		var xml = new xmldom.DOMParser().parseFromString(read(file));

		//if (!xml.validate(xsd)) {
		//	warn(file + " validation failed.");
		//	return cb(false);
		//}

		var config = xml.documentElement;

		config.constructor.prototype.find = config.constructor.prototype.find || function (uri) {
			// console.log(uri);
			//console.trace();
			var node = this;
			var root = node.ownerDocument.documentElement;
			var seq;

			if (uri.substr(0, 2) === "//") {
				uri = uri.substr(2);
				seq = uri.split("/");

				var query = seq.shift();
				var list = root.getElementsByTagName(query);
				var result = [];

				for (var i = 0; i < list.length; ++i) {
					if (seq.length == 0) {
						result = result.concat([list[i]]);
					}
					else {
						result = result.concat(list[i].find(seq.join("/")));
					}
				}

				return result;
			}

			seq = uri.split("/");

			var children = [];

			while (seq.length) {
				if (node === null) break;

				var nodeName = seq.shift();
				var child = node.firstChild;

				node = null;

				while (child != null) {

					if (child.tagName && child.tagName == nodeName) {
						if (seq.length) {
							node = child;
							break;
						}
						else {
							children.push(child);
						}
					}

					child = child.nextSibling;
				}
			}

			return children;
		}

		config.constructor.prototype.get = config.constructor.prototype.get || function (uri) {
			return this.find(uri)[0];
		}

		config.find("PropertyGroup").forEach(function (group) {
			if (!checkPropertyGroupCondition(group)) {
				group.parentNode.removeChild(group);
			}
		});

		config.setAttribute("Path", path.dirname(file));

		if (!config.hasAttribute("Name")) {
			config.setAttribute("Name", path.basename(file, ".xml"));
		}

		if (config.get("//TypeScriptOutFile")) {
			config.setAttribute("OutDir", path.dirname(prepareSystemVariables(config.get("//TypeScriptOutFile").textContent)));
		}

		if (config.get("//DestFolder")) {
			config.setAttribute("OutDir", prepareSystemVariables(config.get("//DestFolder").textContent));
		}

		return config;
	}

	function checkPropertyGroupCondition(propertyGroup) {
		if (!propertyGroup.hasAttribute("Condition")) {
			return true;
		}

		var condition = prepareSystemVariables(propertyGroup.getAttribute("Condition"));

		return computeExpression(condition);
	}

	function prepareSystemVariables(str) {
		return str.replace(/(\$\(([\w\d\_\.\-]+)\))/g, function (str, expr, variable) {

			var v = variable.split(".");
			var e = cfg(v[0]);

			if (e === undefined) {
				e = null;
			}

			if (e) {
				for (var i = 1; i < v.length; ++i) {
					e = e[v[i]];
				}
			}

			return e;
		});
	}

	//function computeExpression(expression) {
	//	var f = new Function("True", "False", "return (" + expression + ");");
	//	return f(true, false);
	//}

	function findInfoSection(config, modulesInfo) {
		var name = config.getAttribute("Name");

		modulesInfo = modulesInfo || {};
		modulesInfo[name] = modulesInfo[name] || {};
		return modulesInfo[name];
	}

	function compileTypescript(config, cb, forceRebuild, modulesInfo) {
		forceRebuild = forceRebuild === undefined ? true : forceRebuild;

		checkDependenceModules(config, function (ok, modulesInfo) {
			var info = findInfoSection(config, modulesInfo);

			var compilerOptions = config.get("//ClosureCompiler");

			var cmd = "node";
			var tscjs = path.normalize(__dirname + "/" + TYPESCRIPT + "/tsc.js");
			var argv = [];
			var dest = null;		// path to destination js file.
			var configDir = config.getAttribute("Path");

			if (compilerOptions || grunt.option("tscc")) {
				tscjs = path.normalize(__dirname + '/tscc/tscc.js');
			}

			argv.push(tscjs);

			//load sources
			config.find("//TypeScriptCompile").forEach(function (typescriptCompile) {
				argv.push(path.join(configDir, typescriptCompile.getAttribute("Include")));
			});

			if (compilerOptions || grunt.option("tscc")) {
				argv.push("--strip-types", "akra.debug");
			}


			if (config.get("//TypeScriptTarget")) {
				argv.push("--target", config.get("//TypeScriptTarget").textContent);
			}

			if (config.get("//TypeScriptModuleKind")) {
				argv.push("--module", config.get("//TypeScriptModuleKind").textContent);
			}

			if (config.get("//TypeScriptSourceMap")) {
				if (config.get("//TypeScriptSourceMap").textContent === "True") {
					argv.push("--sourcemap");
				}
			}

			if (config.get("//TypeScriptGeneratesDeclarations")) {
				if (config.get("//TypeScriptGeneratesDeclarations").textContent === "True") {
					argv.push("--declaration");
				}
			}

			if (config.get("//TypeScriptPropagateEnumConstants")) {
				if (config.get("//TypeScriptPropagateEnumConstants").textContent === "True") {
					argv.push("--propagateEnumConstants");
				}
			}

			if (config.get("//TypeScriptRemoveComments")) {
				if (config.get("//TypeScriptRemoveComments").textContent === "True") {
					argv.push("--removeComments");
				}
			}

			if (config.get("//TypeScriptDeclarationDir")) {
				argv.push("--declarationDir", path.join(configDir, prepareSystemVariables(config.get("//TypeScriptDeclarationDir").textContent)));
			}

			if (config.get("//TypeScriptOutDir")) {
				argv.push("--outDir", path.join(configDir, prepareSystemVariables(config.get("//TypeScriptOutDir").textContent)));
			}

			if (config.get("//TypeScriptOutFile")) {
				dest = path.join(configDir, prepareSystemVariables(config.get("//TypeScriptOutFile").textContent));
				dest = dest.replace(/\.min\.js$/, ".js");
			}
			else {
				//warn("TypeScript out file must be specified.");
				info.forceRebuild = forceRebuild;
				info.destinationFile = path.resolve(path.join(configDir, config.getAttribute("OutDir"), "unknown"));
				return buildProject(config, cb, modulesInfo);
			}

			argv.push("--out", dest);

			if (config.get("//TypeScriptAdditionalFlags")) {
				argv = argv.concat(prepareSystemVariables(config.get("//TypeScriptAdditionalFlags").textContent).split(/\s+/));
			}


			forceRebuild = !(exists(dest) || exists(dest.replace(/\.js$/, ".min.js"))) || forceRebuild;

			if (forceRebuild) {
				log(cmd + " " + argv.join(" "));
			}

			function spawnCallback(code) {
				if (forceRebuild)
					stopAnimation(anim);

				if (code === 0) {
					config.setAttribute("OutFile", dest);
					info.destinationFile = path.resolve(dest);
					info.forceRebuild = forceRebuild;

					if (config.get("//TypeScriptDeclarationDir")) {
						var decl = dest.replace(/\.js$/, ".d.ts");
						var declFile = path.join(configDir, prepareSystemVariables(config.get("//TypeScriptDeclarationDir").textContent), path.basename(decl));
						config.setAttribute("DeclarationFile", declFile);

						if (exists(decl)) {
							mv(decl, declFile);
							info.declarationFile = path.resolve(declFile);
						}
					}

					if (compilerOptions) {
						buildProject(config, function (ok, modulesInfo) {
							if (!ok) {
								return cb(false, null);
							}

							minimize(config, function (ok) {
								info.destinationFile = path.resolve(config.getAttribute("OutFile"));
								cb(ok, modulesInfo);
							}, forceRebuild, modulesInfo);
						}, modulesInfo);
					} else {
						buildProject(config, cb, modulesInfo);
					}
				}
				else {
					error(new Error("Compilation failed."));
					cb(false, modulesInfo);
				}
			}

			if (!forceRebuild) {
				return spawnCallback(0);
			}

			var tsc = spawn(cmd, argv);
			var anim = startAnimation();

			tsc.stdout.on("data", function (data) {
				log(data.toString());
			});

			tsc.stderr.on("data", function (data) {
				error(data.toString());
			});


			tsc.on("close", spawnCallback);
		}, modulesInfo);
	}

	function generateExterns(src, forceRebuild) {

		var dest = src.replace(/\.min\.js|\.js$/, ".externs.js");
		if (src === dest) dest += ".externs";

		if (!forceRebuild) {
			return dest;
		}

		var externs = [];
		var data = read(src, "utf8");

		var list = data.match(/(AE_[\w\d\-\.\_\:]*)/g);

		if (!list) {
			return null;
		}

		for (var i = 0; i < list.length; ++i) {
			var name = list[i];

			if (name.indexOf(".") > 0) {
				name = name.substr(0, name.indexOf("."));
			}

			if (externs.indexOf(name) == -1) {
				externs.push(name);
			}
		}

		var externsString = "\
/**\n\
 * @fileoverview JavaScript Built-Ins for Akra Engne resources.\n\
 *\n\
 * @externs\n\
 */\n\n\n\
";

		for (var i = 0; i < externs.length; ++i) {
			externsString += "\
/**\n\
 * @const\n\
 */\n";
			externsString += "var " + externs[i] + ";\n\n";
		}

		write(dest, externsString);

		return dest;
	}

	function minimize(config, cb, forceRebuild, modulesInfo) {
		forceRebuild = forceRebuild === undefined ? true : forceRebuild;

		var name = config.getAttribute('Name');
		var configDir = config.getAttribute("Path");
		var compilerOptions = config.get("//ClosureCompiler");
		var externsPath = null;
		var dest = null;

		var src = path.join(config.getAttribute("Path"), prepareSystemVariables(config.get("//TypeScriptOutFile").textContent));


		externsPath = generateExterns(src, forceRebuild);
		debug("@EXTERNS", externsPath);


		if (compilerOptions.get("//OutFile")) {
			var outFile = prepareSystemVariables(compilerOptions.get("//OutFile").textContent);
			dest = path.join(configDir, outFile);
		}
		else {
			dest = src.replace(/\.js$/, ".min.js");
			if (src === dest) dest += ".min";
		}

		if ((!src || !exists(src)) && forceRebuild) {
			warn('Source file for minimizing "' + src + '" not found.');
			return null;
		}

		var tmpExternsFile = src + ".tmp.externs";

		var closureJar = path.join(__dirname, '/closure/compiler.jar');
		var compilationLevel = compilerOptions.get("//CompilationLevel").textContent;
		var cmd = "java";

		var argv = [
			"-jar", closureJar,
			"--compilation_level", compilationLevel,
			"--js", src,
			"--js_output_file", dest,
			"--strip_types", "akra.debug",
			 "--use_types_for_optimization",
			"--externs", tmpExternsFile,
			"--output_wrapper", "(function(){%output%})();",
			"--externs", "lib/grunt/zip.js.externs"
		];

		if (grunt.option("pretty_print")) {
			argv.push("--formatting", "PRETTY_PRINT");
		}

		for (var moduleName in modulesInfo) {
			var module = modulesInfo[moduleName];

			if (moduleName !== name) {
				argv.push("--externs", module.destinationFile.replace(/\.min\.js$/ig, ".js.externs"));
			}
		}

		//argv.push("--define=\"akra.config.DEBUG=" + (cfg('Configuration') === 'Debug' ? 'true' : 'false') + "\"");

		if (compilerOptions.get("//CreateSourceMap")) {
			if (compilerOptions.get("//CreateSourceMap").textContent === "True") {
				argv.push("--source_map_format=V3", "--create_source_map", dest + ".map");
			}
		}

		if (externsPath && exists(externsPath)) {
			argv.push("--externs", externsPath);
		}

		if (forceRebuild) {
			log(cmd + " " + argv.join(" "));
		}

		var anim = startAnimation();

		function spawnCallback(code) {
			stopAnimation(anim);

			if (forceRebuild) rm(src);

			if (argv.indexOf("--externs") != -1 && forceRebuild) {
				if (externsPath) rm(externsPath);

				rm(tmpExternsFile);
			}
			if (code === 0) {
				config.setAttribute("OutFile", dest);
				cb(true);
			}
			else {
				fail("Closure minimization failed.");
				cb(false);
			}
		}

		if (!forceRebuild) {
			return spawnCallback(0);
		}


		var closure = spawn(cmd, argv);

		closure.stdout.on("data", function (data) {
			write(data.toString());
		});

		closure.stderr.on("data", function (data) {
			error(data.toString());
		});

		closure.on("close", spawnCallback);
	}

	function checkModule(config, module, modulesInfo, cb) {
		var name = module.getAttribute("Name");
		//oklns("checking module " + name);

		var buildConfig = cfg('build');
		var pathToConfig = buildConfig[name].config;

		var moduleConfig = loadConfig(pathToConfig);

		compile(moduleConfig, cb, false, modulesInfo);
	}

	function checkDependenceModules(config, cb, modulesInfo) {
		var modules = config.find("//PropertyGroup/Dependencies/Module");
		var scripts = [];
		modulesInfo = modulesInfo || {};


		function next(i) {
			var module = modules[i];

			if (!module) {
				return cb(true, modulesInfo);
			}

			if (modulesInfo[module.getAttribute("Name")]) {
				return next(i + 1);
			}

			checkModule(config, module, modulesInfo, function (ok, subInfo) {
				if (!ok) {
					return fail("FAIL :(");
				}

				for (var name in subInfo) {
					modulesInfo[name] = subInfo[name];
				}

				next(i + 1);
			});
		}

		next(0);
	}

	function calculateDependenciesByteLength(config) {
		var totalBytes = 0;
		var workingDir = process.cwd();

		config.find("//PropertyGroup/Resource").forEach(function (resource) {
			var meta = createResourceMeta(config, resource);

			
			if (meta.outputFile) {
				if (exists(meta.outputFile)) {
					totalBytes += fs.lstatSync(meta.outputFile).size;
					debug("file " + meta.outputFile + ' ' + fs.lstatSync(el.dst).size + ' bytes');
				}
				else {
					fail("Could not find output file: " + meta.outputFile);
					//todo: use unknonw size
				}
			}
			else if (meta.archive) {
				fail("demo archive(" + meta.resourceName + ") not founded");
			}
			else {
				meta.data.forEach(function(el) {
					totalBytes += fs.lstatSync(el.dst).size;
					debug("file " + el.dst + ' ' + fs.lstatSync(el.dst).size + ' bytes');
				});
				
			}
			
		});

		
		debug("total: ", totalBytes + ' bytes');

		return totalBytes;
	}

	function buildProject(config, cb, modulesInfo) {
		var info = findInfoSection(config, modulesInfo);
		info.variables = info.variables || {};
		info.resources = info.resources || {};
		info.attachments = info.attachments || {};

		var variables = {};
		var outFile = config.getAttribute("OutFile");

		debug("Build poject: " + outFile);
		console.time("Build project " + config.getAttribute("Name"));


		//fetch variables from dep. modules
		for (var moduleName in modulesInfo) {
			var module = modulesInfo[moduleName];
			for (var i in module.variables) {
				debug("@VARIABLE(PARENT)", i);
				variables[i] = module.variables[i];
			}
		}

		config.find("//PropertyGroup/Variable").forEach(function (variable) {
			var name = variable.getAttribute("Name");
			var value = computeExpression(variable.textContent);

			if (typeof value === 'string') {
				value = JSON.stringify(value);
			}

			variables[name] = info.variables[name] = value;

			debug("@VARIABLE " + name + "=" + (typeof value == 'string' ? value.substr(0, 48) : value));
		});

		config.find("//PropertyGroup/Resource").forEach(function (resource) {
			var resourceName = resource.getAttribute("Name");
			var result = createResource(config, resource, info);

			variables[resourceName] = info.resources[resourceName] = JSON.stringify(result);
		});


		config.find("//PropertyGroup/Dependencies/Attachment").forEach(function (attachment, i) {
			var attachmentName = attachment.getAttribute("Name") || ("$" + i);
			var result = loadAttachment(config, attachment, info);

			info.attachments[attachmentName] = result;

			if (attachment.hasAttribute("Name")) {

				variables[attachmentName] = JSON.stringify(result, null, '\t');
				variables[attachmentName + ".format"] = JSON.stringify(result.format);

				if (result.format !== null && result.format !== "String" && result.format !== "Enclosure") {
					variables[attachmentName + ".content"] = result.content;
				}
				else {
					variables[attachmentName + ".content"] = JSON.stringify(result.content);
				}
			}
		});

		if (Object.keys(variables).length === 0 || !info.forceRebuild) {
			return cb(true, modulesInfo);
		}
		
		if (outFile) {		
			var data = read(outFile);
			var list = data.match(/(AE_[\w\d\-\.\_\:]*)/g) || [];

			var i = 0;

			do {
				var name = list[i++];
				var value = variables[name];

				if (value !== undefined) {
					data = data.replace(name, value);
					debug("> " + name + "=" + (typeof value === "string" && value.length > 32 ? value.substr(0, 32) + '...' : value));
				}

			} while (i < list.length);

			write(outFile, data);
		}

		console.timeEnd("Build project " + config.getAttribute("Name"));
		
		cb(true, modulesInfo);

	}

	function computeExpression(expression) {
		var f = new Function("return (" + prepareSystemVariables(expression) + ");");

		try {
			return f();
		} catch (e) {
			debug(f.toString());
			fail(e);
		}

		return false;
	}

	function createResourceMeta(config, resource) {
		var resourceName = resource.getAttribute("Name");
		var configPath = config.getAttribute("Path");
		var buildDir = path.join(config.getAttribute("Path"), config.getAttribute("OutDir"));

		if (resource.get("Filename")) {
			resourceName = resource.get("Filename").textContent;
		}

		var isArchive = false;
		var useInlining = false;
		var outDir = "";
		var mapFile = null;
		var map = null;

		if (resource.get("UseInlining")) {
			useInlining = resource.get("UseInlining").textContent === "True";

			//При подстановке внутрь скрипта все должно быть запаковано в один файл.
			if (useInlining) {
				isArchive = true;
			}
		}

		if (!useInlining) {
			//при использовании подстановки, контент включается внутрь JS файла
			//поэтому нету смысла использовать параметр OutDir
			if (resource.get("OutDir")) {
				outDir = prepareSystemVariables(resource.get("OutDir").textContent);
			}

			if (resource.get("Archive")) {
				isArchive = resource.get("Archive").textContent === "True";
			}
		}

		if (resource.get("MapFile")) {
			mapFile = prepareSystemVariables(resource.get("MapFile").textContent);
			//расчитаем полный путь к map файлу
			mapFile = path.join(configPath, mapFile);

			if (!exists(mapFile)) {
				fail("<MapFile>" + mapFile + "</MapFile> not found.");
			}
		}

		if (isDev()) {
			isArchive = false;
			useInlining = false;
		}

		var i;
		if (mapFile) {
			map = JSON.parse(read(mapFile));

			var mapFolder = path.dirname(path.relative(configPath, mapFile));

			var p = map;
			while (p) {
				if (p.files) {
					for (i = 0; i < p.files.length; i++) {
						p.files[i].path = path.normalize(path.join(mapFolder, p.files[i].path)).replace(/\\/ig, "/");
						//console.log(p.files[i].path);
					}
				}

				p = p.deps;
			}
		}
		else {
			map = { files: [] };
		}

		var additionalFiles = [];

		if (resource.get("Data")) {
			var data = resource.get("Data");

			if (data.get("Folder")) {
				additionalFiles = readFolders(data.find("Folder"), config);
			}

			if (data.get("File")) {
				var files = data.find("File");
				for (i = 0; i < files.length; ++i) {
					additionalFiles.push(path.normalize(files[i].getAttribute("Path")));
				}
			}

			if (data.get("ResourceFile")) {
				var resourceFiles = data.find("ResourceFile");
				var lowLevel = getLowerLevel(map);

				for (i = 0; i < resourceFiles.length; ++i) {
					loadResource(resourceFiles[i], lowLevel);
				}
			}

			if (isDev()) {
				var p = map;
				while (p) {
					if (p.files) {
						for (i = 0; i < p.files.length; i++) {
							p.files[i].path = path.relative(path.join(buildDir, outDir), path.join(configPath, p.files[i].path)).replace(/\\/ig, "/");
						}
					}

					p = p.deps;
				}

				additionalFiles = additionalFiles.map(function(file) {
					return  path.relative(path.join(buildDir, outDir), path.join(configPath, file)).replace(/\\/ig, "/");
				});
			}
		}

		var meta = {
			resourceName: resource.getAttribute("Name"),
			name: resourceName,								// name of resource
			buildDirectory: buildDir,						// output directory like: "built/Release/demos/demo01"
			configDirectory: configPath,					// config directory like: "src/demos/demo01"
			data: null,										// if archive, data will look like:
															// 		[
															// 			{name: 'file-0', data: Buffer(), path: "*"}, 
															// 			... 
															// 			{name: 'file-N', data: Buffer(), path: "*"}
															// 		]
															// if isn't archive, data will look like:
															// 		[{src: "path/to/src-0", dst: } ,..., {src: "path/to/src-N", dst: }]
															// 		* all files will be relative to <configDirecory>
			archive: isArchive,								// if resource archive?
			inline: useInlining,							// is resource will be inlined
			outDirectory: outDir,								// output directory relative to <buildDirectory>
			map: map,										// resource JSON map
			files: additionalFiles,							// additional files, that must be placed with/within resource archive/data

			outputFile: null,								//if resources will be packed into single file
			outputDir: path.join(buildDir, outDir)
		};

		if (isArchive) {
			meta.data = packResourcesArchive(config, map, additionalFiles);
			meta.outputFile = path.join(buildDir, outDir, resourceName + ".ara");
		}
		else {
			// Записываем все файлы из map & additionalFiles в srcFiles
			var srcFiles = additionalFiles.slice(0);
			var totalFiles = srcFiles.map(function (src) {
				return { src: src, dst: null, type: 'file' };
			})

			var p = map;
			while (p) {
				if (p.files) {

					for (i = 0; i < p.files.length; i++) {
						if (srcFiles.indexOf(p.files[i].path) == -1) {
							totalFiles.push({ src: p.files[i].path, dst: null, type: 'resource'});
						}
					}
				}

				p = p.deps;
			}


			meta.data = totalFiles;
			for (i = 0; i < totalFiles.length; ++i) {
				var dstFile = path.join(meta.outputDir, totalFiles[i].src);
				var srcFile = !isDev()? path.resolve(path.join(meta.configDirectory, totalFiles[i].src)): path.resolve(path.join(meta.buildDirectory, totalFiles[i].src));
				meta.data[i].src = srcFile;
				meta.data[i].dst = dstFile;
			}
			
		}


		return meta;
	}

	function createResource(config, resource, info) {
		if (!info.forceRebuild) {
			return null;
		}

		var meta = createResourceMeta(config, resource);

		if (meta.archive) {
			if (meta.inline) {
				//work with  archive
				var archive = new Zip();

				meta.data.forEach(function (node) {
					archive.add(node.name, node.data);
				});

				var content = archive.toBuffer().toString('base64');

				return {
					path: "data:application/octet-stream;base64," + content,
					type: "ara"
				};

				//end of work
			}
			else {
				if (true) {
					var cmd7za = which('7za') ? "7za" : path.normalize("./lib/grunt/7za/7za.exe");

					var tempDir = new temp.Dir();

					meta.data.forEach(function (node) {
						copy(node.path, path.join(tempDir.path, node.name));
					});


					var compressionKey = "-mx5";

					if (resource.get("CompressionLevel")) {
						var compressionLevel = resource.get("CompressionLevel").textContent;

						switch (compressionLevel) {
							case "Store":
								compressionKey = "-mx0";
								break;
							case "Fastest":
								compressionKey = "-mx1";
								break;
							case "Fast":
								compressionKey = "-mx3";
								break;
							case "Normal":
								compressionKey = "-mx5";
								break;
							case "Maximum":
								compressionKey = "-mx7";
								break;
							case "Ultra":
								compressionKey = "-mx9";
						}
					}

					var cmd = cmd7za + ' a -tzip -aoa ' + compressionKey + ' -mmt "' + path.resolve(meta.outputFile) + '" "' + path.resolve(path.join(tempDir.path, "*")) + '"';

					log(cmd);

					if (shell.exec(cmd).code !== 0) {
						fail("7za commpression failed.");
					}

					rmdir(path.resolve(tempDir.path));
				}
				//NEVER USED ELSE....
				else {
					//work with archive
					var archive = new Zip();
					meta.data.forEach(function (node) { archive.add(node.name, node.data); });
					fs.writeFileSync(meta.outputFile, archive.toBuffer());
					//end of work
				}

				return {
					path: path.relative(meta.buildDirectory, meta.outputFile).replace(/\\/ig, "/"),
					type: "ara"
				};
			}
		}

		// Записываем все файлы из map & additionalFiles в srcFiles
		// после чего записываем srcFiles в outputDir

		var srcFiles = meta.data;

		for (i = 0; i < srcFiles.length; ++i) {
			if (!isDev()) {
				copy(srcFiles[i].src, srcFiles[i].dst);           //записываем файл в destFolder
			}
		}

		var mapFile = path.join(meta.outputDir, meta.name + ".map");

		if ((resource.get("Data") && resource.get("Data").get("ResourceFile")) || meta.map.files.length) {
			write(mapFile, JSON.stringify(meta.map, null, "\t"));
		}

		return {
			path: path.relative(meta.buildDirectory, mapFile).replace(/\\/ig, "/"),
			type: "map"
		};
	}

	function readFolders(folders, config) {
		var srcDir = config.getAttribute("Path");
		var result = [];

		for (var i = 0; i < folders.length; ++i) {
			var currentFolder = path.join(srcDir, folders[i].getAttribute("Path"));

			var files =
				grunt.file.expand({ filter: 'isFile' }, [path.join(currentFolder, '**/*')]);
			var excludes = folders[i].find("Exclude");

			if (excludes) {

				for (var f = 0; f < files.length; f++) {
					for (var n = 0; n < excludes.length; ++n) {
						// console.log("exclude:", path.resolve(path.join(currentFolder, excludes[n].getAttribute('Path'))));
						// console.log("file:", path.resolve(files[f]));

						var x = path.resolve(path.join(currentFolder, excludes[n].getAttribute('Path')));
						var y = path.resolve(files[f]);

						if (x == y) {
							//Removing Exclude from files.
							debug("@EXCLUDE", excludes[n].getAttribute('Path'));
							files.splice(f, 1);
							f--;
							break;
						}
					}
				}
			}

			files.forEach(function (file) {
				result.push(path.relative(srcDir, file));
			});
		}

		return result;
	}

	function packResourcesArchive(config, map, additionalData) {
		var archive = [];//new Zip();
		var configDir = config.getAttribute("Path");
		var files = [];

		var mapFile = new temp.File();
		var mapBuffer = new Buffer(JSON.stringify(map, null, '\t'), "utf8");
		mapFile.writeFileSync(mapBuffer);

		archive.push({ name: ".map", data: mapBuffer, path: mapFile.path });

		debug("@RESOURCE", ".map");

		while (map) {
			if (map.files) {
				for (var i = 0; i < map.files.length; i++) {
					var file = map.files[i].path;
					var res = file.replace(/\\/ig, "/");
					var pathToFile = path.join(configDir, file);
					archive.push({ name: res, data: fs.readFileSync(pathToFile), path: pathToFile });
					files.push(res);

					debug("@RESOURCE", res);
				}
			}

			map = map.deps;
		}

		if (additionalData) {
			additionalData.forEach(function (value) {
				value = path.join(configDir, value);
				var name = path.relative(configDir, value).replace(/\\/ig, "/");

				if (exists(value)) {
					if (isDir(value)) {
						// files in string[] array, include directories..
						// var files = grunt.file.expand({ filter: "isFile" }, [value]);
						fail("TODO: folder support not implemented....");
					}
					else if (files.indexOf(name) === -1) {

						archive.push({ name: name, data: fs.readFileSync(value), path: value });
						files.push(name);

						debug("@RESOURCE", name);
					}
				}
				else {
					fail("Could not find file " + value + " (cwd: " + process.cwd() + ")");
				}
			});
		}

		return archive;
	}

	function getLowerLevel(deps) {
		var c = deps;

		while (c) {
			if (!c.deps) {
				return c;
			}

			c = c.deps;
		}

		return c;
	}

	/**
		 * Загружаем ресурс из тега ResourceFile в map файл.
		 * @param ResourceFile {XML} ResourceFile tag.
		 * @param cur {IDependens} Текущий уровень зависимостей.
		 */
	function loadResource(resourceFile, cur) {
		cur.files = cur.files || [];

		var res = { path: resourceFile.getAttribute("Path") };

		if (resourceFile.hasAttribute("Name")) {
			res.name = resourceFile.getAttribute("Name");
		}

		if (resourceFile.hasAttribute("Comment")) {
			res.comment = resourceFile.getAttribute("Comment");
		}

		if (resourceFile.hasAttribute("Type")) {
			res.type = resourceFile.getAttribute("Type");
		}

		cur.files.push(res);

		if (resourceFile.get("ResourceFile")) {
			cur.deps = cur.deps || {};
			var resourceFiles = resourceFile.find("ResourceFile")
			for (var i = 0; i < resourceFiles.length; ++i) {
				loadResource(resourceFiles[i], cur.deps);
			}
		}
	}

	function getFilesFromAttachment(attachment, config) {
		var srcDir = config.getAttribute("Path");
		var files = [];
		if (attachment.get("File")) {
			var list = attachment.find("File");
			for (var i = 0; i < list.length; ++i) {
				files.push(path.normalize(list[i].getAttribute("Path")));
			}
		}

		if (attachment.get("Folder")) {
			files = files.concat(readFolders(attachment.find("Folder"), config));
		}


		return files;
	}

	//name, srcFolder, Attachment, destFolder
	function loadAttachment(config, attachment, info) {
		var name = null;
		var outDir = "";
		var format = null;
		var files = getFilesFromAttachment(attachment, config);
		var minify = null;
		var srcDir = config.getAttribute("Path");
		var buildDir = path.join(config.getAttribute("Path"), config.getAttribute("OutDir"));
		var type = null;
		var collapsePath = false;

		if (attachment.get("CollapsePath")) {
			collapsePath = attachment.get("CollapsePath").textContent === "True";
		}

		if (attachment.hasAttribute("Name")) {
			name = attachment.getAttribute("Name");
		}

		if (attachment.get("OutDir")) {
			outDir = attachment.get("OutDir").textContent;
		}

		if (attachment.get("Minify")) {
			minify = attachment.get("Minify").textContent;
		}

		if (attachment.get("Format")) {
			format = attachment.get("Format").textContent;
		}

		if (attachment.get("Type")) {
			type = attachment.get("Type").textContent;
		}

		files.forEach(function (file) {
			debug("@ATTACHMENT", name + "=" + file, (format ? "(" + format + ")" : ""));
		});

		files.forEach(function (file, i, files) {
			files[i] = path.join(srcDir, file);
			// debug(path.join(srcDir, file), path.relative(buildDir, path.join(srcDir, file)));
		});


		if (!format) {
			files.forEach(function (file, i, files) {
				files[i] = path.relative(buildDir, file).replace(/\\/ig, "/");
			});

			return {
				content: files.join(";"),
				format: format
			};
		}

		if (format === "String") {
			var data = "";
			files.forEach(function (file) {
				data += "\n" + read(file)
			});

			return { content: data, format: format };
		}

		if (format === "Enclosure") {
			var data = [];
			files.forEach(function (file) {

				if (collapsePath) {
					var dest = path.join(buildDir, outDir, path.basename(file));
				}
				else {
					var dest = path.join(buildDir, outDir, path.relative(config.getAttribute("Path"), file));
				}

				if (isDev()) {
					dest = file;
				}
				else {
					if (info.forceRebuild) {
						copy(file, dest);
						debug("@COPY", file, "->", path.join(buildDir, outDir, path.basename(file)));
					}
				}

				data.push(path.relative(buildDir, dest).replace(/\\/g, '/'));
			});

			return {
				content: data.join(";"),
				format: format,
				type: type
			}
		}

		if (!minify) {

			var data = "";
			files.forEach(function (file) {
				data += "\n" + read(file, "utf-8");
			});

			return {
				content: data,
				format: format
			};
		}

		return {
			content: UglifyJS.minify(files).code,
			format: format
		};
	}

	function buildDemo(demo, srcFolder, cb) {
		if (!exists(srcFolder)) {
			warn("Could not find demo.xml");
			return cb(false);
		}

		var config = loadConfig(path.join(srcFolder, "demo.xml"));

		var name = config.getAttribute('Name');
		var description = config.get('Description') ? config.get('Description').textContent : null;
		var template = path.join(srcFolder, config.get('Template') ? config.get('Template').textContent : "index.jade");

		var code = null;
		var scripts = [];
		var styles = [];


		compile(config, function (ok, modulesInfo) {
			if (!ok) return cb(false);

			var configDir = config.getAttribute("Path");

			var destJs = config.getAttribute("OutFile");
			var destFolder = path.join(configDir, config.getAttribute("OutDir"));//path.dirname(destJs);
			var destHtml = path.join(destFolder, path.basename(template, path.extname(template)) + '.html');

			debug("Dest. html: ", destHtml);
			debug("Dest. folder: ", destFolder);
			debug("Dest. js: ", destJs);
			debug("Name:", name);
			debug("Description:", description);
			debug("Template:", template);

			for (var moduleName in modulesInfo) {
				var module = modulesInfo[moduleName];

				if (moduleName !== name) {
					scripts.push(path.relative(path.resolve(destFolder), module.destinationFile));
				}

				for (var i in module.attachments) {
					var attachment = module.attachments[i];

					if (attachment.type === "javascript") {
						scripts = scripts.concat(attachment.content.split(";").map(function (src) {
							return path.join(path.relative(path.resolve(destFolder), path.dirname(module.destinationFile)), src);
						}));
					}

					if (attachment.type === "css") {
						styles = styles.concat(attachment.content.split(";").map(function (src) {
							return path.join(path.relative(path.resolve(destFolder), path.dirname(module.destinationFile)), src);
						}));
					}
				}
			}

			//console.log(scripts);
			//scripts = scripts.concat(
			//	moduleScripts.map(function (script) {
			//		//console.log(destFolder, script);
			//		return path.relative(destFolder, script).replace(/\\/g, '/');
			//	}));

			//copy to parent dir, because all demos builds in demos/*
			copyDir(path.join(__dirname, "css"), path.join(destFolder, "../css"));
			copyDir(path.join(__dirname, "img"), path.join(destFolder, "../img"));
			copyDir(path.join(__dirname, "fonts"), path.join(destFolder, "../fonts"));

			var basicTemplate = path.join(__dirname, "demo.jade");

			if (!exists(template)) {
				template = basicTemplate;
			}
			
			code = read(template);
			

			// Compile a function
			var fn = jade.compile(code, {
				pretty: true,
				debug: false,
				compileDebug: false,
				filename: basicTemplate
			});

			// Render the function
			var html = fn({
				demo: {
					name: name,
					description: description,
					scripts: scripts.map(function (script) { return script.replace(/\\/g, '/'); }),
					styles: styles.map(function (script) { return script.replace(/\\/g, '/'); }),
					src: path.relative(destFolder, destJs).replace(/\\/g, "/")
				}
			});

			debug(html);
			write(destHtml, html);

			cb(true);

		});

	}

	grunt.registerMultiTask("build", function () {
		var config = this.data.config,
			done = this.async();

		compile(config, done);
	});


	grunt.registerTask("demo", function () {
		var done = this.async();
		var demo = this.args[0];

		if (!demo) {
			var i = 0;

			var all = [];
			var demos = [];

			var caption = "AVAILABLE DEMOS";
			var table = [4, 24, 37, 64];
			var columns = [' #', "NAME", "COMMAND", "DESCRIPTION"];
			var tableWidth = table.reduce(function(a, b) { return a + b; });
			var outDir = prepareSystemVariables("$(BuiltDir)/demos");

			//print table caption
			log((new Array(Math.round(tableWidth / 2 - 3))).join(" ") + caption);
			
			//ptint row delimiter
			log([
				(new Array(table[0] + 2)).join("-"),
				(new Array(table[1] + 3)).join("-"),
				(new Array(table[2] + 3)).join("-"),
				(new Array(table[3] - 7)).join("-")
			].join("+"));

			log([
				wraptext(table[0], columns[0]),
				wraptext(table[1], columns[1]),
				wraptext(table[2], columns[2]),
				wraptext(table[3], columns[3])
			].join(" | "));

			//ptint row delimiter
			log([
				(new Array(table[0] + 2)).join("-"),
				(new Array(table[1] + 3)).join("-"),
				(new Array(table[2] + 3)).join("-"),
				(new Array(table[3] - 7)).join("-")
			].join("+"));

			grunt.file.expand({ filter: 'isDirectory' }, path.join(cfg('DemosSourceDir'), "*")).forEach(function (dir) {
				var configFile = path.join(dir, "demo.xml");

				if (exists(configFile)) {
					var config = loadConfig(configFile);
					var name = config.getAttribute("Name");
					var description = config.get("Description").textContent;
					var link = path.basename(dir);
					var preview = config.get('Preview') ? config.get('Preview').getAttribute("Src") : null;
					var youtube = null;

					if (!preview) {
						//find preview.png
						[".png", ".jpg", ".jpeg", ".gif"].forEach(function(ext) {
							var previewFile = path.join(config.getAttribute("Path"), "preview" + ext);
							
							if (exists(previewFile)) {
								preview = path.relative(config.getAttribute("Path"), previewFile);
							}
						});
					}

					if (config.get("PropertyGroup/DestFolder")) {
						var destFolder = path.join(config.getAttribute("Path"), config.get("PropertyGroup/DestFolder").textContent);
						link = path.basename(destFolder);
					}

					if (preview) {
						var youtubeLink = config.get("Preview/YouTube")? config.get("Preview/YouTube").getAttribute("Src"): null;
						
						if (youtubeLink) {
							var uri = url.parse(youtubeLink);

							if (uri || uri.host.match(/youtube\.com/i)) {
								youtube = youtubeLink;
							}
						}
						
						switch (path.extname(preview).toLowerCase()) {
							case '.jpg':
							case '.jpeg':
							case '.png':
							case '.bmp':
							case '.gif':
								var previewFile = path.join(outDir, "img/preview/", name + path.extname(preview));
								var previewOriginal = path.join(config.getAttribute("Path"), preview);
								copy(previewOriginal, previewFile);

								// gm(previewOriginal)
								// .size(function (err, size) {
								//   	if (err) {
								//   		console.log(err);
								// 	    fail('could not obtain preview image size: ' + previewOriginal);
								// 	}
								// 	this.resize(249, 127)
								// 	.noProfile()
								// 	.write(previewFile, function (err) {
								// 	  if (err) {
								// 	  	fail('could not save preview image to: ' + previewFile + " (original: " + previewOriginal + ")");
								// 	  }
								// 	});
								// });

								preview = path.relative(outDir, previewFile);

								break;
							default:
								error("invalid preview format used: " + preview);
						}
						
					}

					

					all.push("demo:" + path.basename(dir));
					demos.push({ 
						config: config,
						name: name, 
						description: description, 
						link: link, 
						preview: preview || "img/default-thumb-300x200.png", 
						youtube: youtube,
						byteLength: 0
					});
					
					log([
						wraptext(table[0], " " + (i++) + "."),
						wraptext(table[1], name),
						wraptext(table[2], "`grunt demo:" + path.basename(dir) + "` "),
						wraptext(table[3], description)
					].join(" | "));
				}
			});

			//ptint row delimiter
			log([
				(new Array(table[0] + 2)).join("-"),
				(new Array(table[1] + 3)).join("-"),
				(new Array(table[2] + 3)).join("-"),
				(new Array(table[3] - 7)).join("-")
			].join("+"));

			if (!grunt.option("list")) {
				
				grunt.task.run(all);
// console.log(all[0])
				// grunt.task('list', [all[0]], function() {
				    
				  
				    // console.log("finalize()");
				  	
				// });

				// grunt.task.run('list');
			}

			// demos.forEach(function(demo){
			// 	demo.byteLength = calculateDependenciesByteLength(demo.config);
			// });
	

			//copy to parent dir, because all demos builds in demos/*
			copyDir(path.join(__dirname, "css"), path.join(outDir, "css"));
			copyDir(path.join(__dirname, "img"), path.join(outDir, "img"));
			copyDir(path.join(__dirname, "fonts"), path.join(outDir, "fonts"));
			

			// Compile a function
			var fn = jade.compile(read(path.join(__dirname, "showcase.jade")), {
				pretty: true,
				debug: false,
				compileDebug: false
			});

			// Render the function
			var html = fn({
				index: demos,
				version: cfg('Version'),
				timestamp: Date.now()
			});

			debug(html);
			var indexPath = path.join(outDir, "index.html");

			write(indexPath, html);

			return done(true);
		}

		debug("Current demo: ", demo);
		buildDemo(demo, path.join(cfg('DemosSourceDir'), demo), done);
	});
}
