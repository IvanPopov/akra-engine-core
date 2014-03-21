/**
 * Typescript build task for Akra 3D engine.
 */

'use strict';

var spawn = require('child_process').spawn;
var path = require('path');
var fs = require('fs');
var xmldom = require('xmldom');
var domain = require('domain');
var Zip = require('node-native-zip');
var jade = require('jade');

var TYPESCRIPT = "typescript-0.9.5";

module.exports = function (grunt) {

	function mv(from, to) {
		copy(from, to);
		if (path.normalize(from) !== path.normalize(to)) {
			rm(from);
		}
	}

	function rm(file) {
		return grunt.file.delete(file);
	}

	function copy(from, to) {
		return grunt.file.copy(from, to);
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
	 * @param configFile {String} Path to config file.
	 */
	function compile(configFile, cb) {
		var config;

		if (typeof configFile === "string") {
			config = loadConfig(configFile);
		}
		else {
			config = configFile;
		}


		compileTypescript(config, function (ok) {
			if (!ok) {
				return cb(false);
			}

			buildProject(config, cb);
		});
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
			var e = cfg(v[0]) || null;

			if (e) {
				for (var i = 1; i < v.length; ++i) {
					e = e[v[i]];
				}
			}

			return e;
		});
	}

	/** 
	 * Compute expressions
	 */
	function computeExpression(expression) {
		var f = new Function("True", "False", "return (" + expression + ");");
		return f(true, false);
	}

	function compileTypescript(config, cb, onlyExportSettings) {
		onlyExportSettings = onlyExportSettings || false;
		cb = cb || function () { }

		function _COMPILE() {
			var compilerOptions = config.get("//ClosureCompiler");

			var cmd = "node";
			var tscjs = path.normalize(__dirname + "/" + TYPESCRIPT + "/tsc.js");
			var argv = [];
			var dest = null;		//path ro destination js file.
			var configDir = config.getAttribute("Path");

			if (compilerOptions || grunt.option("tscc")) {
				tscjs = path.normalize(__dirname + '/tscc/tscc.js');
			}

			argv.push(tscjs);

			//load sources
			config.find("//TypeScriptCompile").forEach(function (typescriptCompile) {
				argv.push(path.join(configDir, typescriptCompile.getAttribute("Include")));
			});


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
				error("TypeScript out file must be specified.");
				return cb(false);
			}

			argv.push("--out", dest);

			if (config.get("//TypeScriptAdditionalFlags")) {
				argv = argv.concat(prepareSystemVariables(config.get("//TypeScriptAdditionalFlags").textContent).split(/\s+/));
			}

			if (!onlyExportSettings) {
				log(cmd + " " + argv.join(" "));
			}

			//return !compilerOptions ? cb(true) : minimize(config, cb);

			function spawnCallback(code) {
				if (!onlyExportSettings)
					stopAnimation(anim);

				if (code === 0) {
					config.setAttribute("OutFile", dest);

					if (config.get("//TypeScriptDeclarationDir")) {
						var decl = dest.replace(/\.js$/, ".d.ts");
						var declFile = path.join(configDir, prepareSystemVariables(config.get("//TypeScriptDeclarationDir").textContent), path.basename(decl));
						config.setAttribute("DeclarationFile", declFile);

						if (exists(decl)) {
							mv(decl, declFile);

							//var declData = read(declFile);
							//console.log(decl, declFile, "==", path.relative(decl, declFile), path.join(decl, path.relative(decl, declFile)));
							//declData.replace(
							//	/\/\/\/\s*\<reference\s+path\=[\"\']{1}([\w\d\_\.\-\/]+)[\"\']{1}\s*\/\>/g, function (match, p1, offset, string) {
							//		console.log(path.normalize(p1), decl);
							//		return p1;
							//	});
						}
					}

					if (compilerOptions) {
						minimize(config, cb, onlyExportSettings);
					} else {
						cb(true);
					}
				}
				else {
					error(new Error("Compilation failed."));
					cb(false);
				}
			}

			if (onlyExportSettings) {
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
		}

		if (onlyExportSettings) {
			_COMPILE();
		}
		else {
			checkDependenceModules(config, _COMPILE);
		}
	}

	function generateExterns(src) {

		var dest = src.replace(/\.min\.js|\.js$/, ".externs.js");
		if (src === dest) dest += ".externs";

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

	function minimize(config, cb, onlyExportSettings) {
		onlyExportSettings = onlyExportSettings || false;

		var configDir = config.getAttribute("Path");
		var compilerOptions = config.get("//ClosureCompiler");
		var externsPath = null;
		var dest = null;

		var src = path.join(config.getAttribute("Path"), prepareSystemVariables(config.get("//TypeScriptOutFile").textContent));

		externsPath = generateExterns(src);
		debug("@EXTERNS", externsPath);

		if (compilerOptions.get("//OutFile")) {
			var outFile = prepareSystemVariables(compilerOptions.get("//OutFile").textContent);
			dest = path.join(configDir, outFile);
		}
		else {
			dest = src.replace(/\.js$/, ".min.js");
			if (src === dest) dest += ".min";
		}

		if (!src || !exists(src)) {
			warn('Source file for minimizing "' + src + '" not found.');
			return null;
		}

		var closureJar = path.join(__dirname, '/closure/compiler.jar');
		var compilationLevel = compilerOptions.get("//CompilationLevel").textContent;
		var cmd = "java";
		var argv = [
			"-jar", closureJar,
			"--compilation_level", compilationLevel,
			"--js", src,
			"--js_output_file", dest
		];

		if (compilerOptions.get("//CreateSourceMap")) {
			if (compilerOptions.get("//CreateSourceMap").textContent === "True") {
				argv.push("--source_map_format=V3", "--create_source_map", dest + ".map");
			}
		}

		if (externsPath && exists(externsPath)) {
			argv.push("--externs", externsPath);
		}

		if (!onlyExportSettings) {
			log(cmd + " " + argv.join(" "));
		}

		var anim = startAnimation();

		function spawnCallback(code) {
			stopAnimation(anim);
			if (argv.indexOf("--externs") != -1) {
				rm(externsPath);
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

		if (onlyExportSettings) {
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

	function checkModule(config, module, cb) {
		var name = module.getAttribute("Name");
		//oklns("checking module " + name);
		var buildConfig = cfg('build');
		var pathToConfig = buildConfig[name].config;

		var moduleConfig = loadConfig(pathToConfig);
		compileTypescript(moduleConfig, null, true);

		var outFile = moduleConfig.getAttribute("OutFile");
		var declFile = moduleConfig.getAttribute("DeclarationFile");

		var doBuild = false;
		if (!exists(outFile)) {
			//error("Could not find dependence script '" + outFile + "'");
			//error("Use 'grunt build:" + name + "' for dependency module " + name);
			return compile(moduleConfig, function (ok, attachments) {
				cb(ok, outFile, attachments);
			});
		}

		if (declFile && !exists(declFile)) {
			//error("Could not find dependence declaration '" + declFile + "'.");
			//error("Use 'grunt build:" + name + "' to create a dependence module " + name + ".");
			return compile(moduleConfig, function (ok, attachments) {
				cb(ok, outFile, attachments);
			});
		}

		var attachments = {};
		moduleConfig.find("//PropertyGroup/Dependencies/Attachment").forEach(function (attachment, i) {
			var result = loadAttachment(moduleConfig, attachment);
			var name = attachment.getAttribute("Name") || ("$" + i);
			attachments[name] = result;
		});

		setTimeout(cb, 1, true, outFile, attachments);
	}

	function checkDependenceModules(config, cb) {
		var modules = config.find("//PropertyGroup/Dependencies/Module");
		var scripts = [];
		var attachmentsList = [];

		function next(i) {
			var module = modules[i];

			if (!module) {
				return cb(true, scripts, attachmentsList);
			}

			checkModule(config, module, function (ok, script, attachments) {
				if (!ok) {
					return fail("FAIL :(");
				}

				if (scripts.indexOf(script) == -1)
					scripts.push(script);

				attachmentsList.push(attachments);

				next(i + 1);
			});
		}

		next(0);
	}

	/** 
	 * Собиарем ресурсы по проекту
	 * @param folder {String} Путь к папке с проектом.
	 * @param Project {XML} Описание проекта в resources.xml.
	 * @param dest {String} Файл, в который будет собран проект.
	 */
	function buildProject(config, cb) {
		var variables = {};
		var outFile = config.getAttribute("OutFile");
		var attachments = {};
		debug("Build poject: " + outFile);

		console.time("Build project " + config.getAttribute("Name"));


		config.find("//PropertyGroup/Variable").forEach(function (variable) {
			var name = variable.getAttribute("Name");
			var value = computeExpression(variable.textContent);

			if (typeof value === 'string') {
				value = JSON.stringify(value);
			}

			variables[name] = value;

			debug("@VARIABLE " + name + "=" + (typeof value == 'string' ? value.substr(0, 48) : value));
		});



		config.find("//PropertyGroup/Resource").forEach(function (resource) {
			var result = createResource(config, resource);
			var resourceName = resource.getAttribute("Name");

			variables[resourceName] = JSON.stringify(result);
		});


		config.find("//PropertyGroup/Dependencies/Attachment").forEach(function (attachment, i) {
			var result = loadAttachment(config, attachment);
			var name = attachment.getAttribute("Name") || ("$" + i);
			var attachmentName = name;

			attachments[name] = result;

			if (attachment.hasAttribute("Name")) {

				variables[attachmentName] = JSON.stringify(result, null, '\t');
				variables[attachmentName + ".format"] = JSON.stringify(result.format);

				if (result.format !== null && result.format !== "String") {
					variables[attachmentName + ".content"] = result.content;
				}
				else {
					variables[attachmentName + ".content"] = JSON.stringify(result.content);
				}
			}
		});

		if (Object.keys(variables).length === 0) {
			return cb(true, null);
		}

		var data = read(outFile);
		var list = data.match(/(AE_[\w\d\-\.\_\:]*)/g) || [];

		var i = 0;
		do {
			var name = list[i++];
			var value = variables[name];

			if (value !== undefined) {
				data = data.replace(name, value);
				debug("> " + name + "=" + (value.length > 32 ? value.substr(0, 32) + '...' : value));
			}

		} while (i < list.length);

		write(outFile, data);
		console.timeEnd("Build project " + config.getAttribute("Name"));

		cb(true, attachments);

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



	/**
	 * @param PropertyGroup {XML} Xml tag with resource sedcription.
	 * @param destFolder {String} Destination folder.
	 */
	function createResource(config, resource) {
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

		var i;
		if (mapFile) {
			map = JSON.parse(read(mapFile));

			var mapFolder = path.dirname(mapFile);

			var p = map;
			while (p) {
				if (p.files) {
					for (i = 0; i < p.files.length; i++) {
						p.files[i].path = path.normalize(mapFolder + "/" + p.files[i].path).replace(/\\/ig, "/");
					}
				}

				p = p.deps;
			}
		}
		else {
			map = { files: [] };
		}

		if (resource.get("Data")) {
			var data = resource.get("Data");
			var additionalFiles = [];

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
		}
		if (isArchive) {
			var archive = packResourcesArchive(config, map, additionalFiles);

			if (useInlining) {

				var content = archive.toBuffer().toString('base64');

				return {
					path: "data:application/octet-stream;base64," + content,
					type: "ara"
				};
			}
			else {
				var outputFile = path.join(buildDir, outDir, resourceName + ".ara");
				var content = archive.toBuffer();

				fs.writeFileSync(outputFile, content);

				return {
					path: path.relative(buildDir, outputFile).replace(/\\/ig, "/"),
					type: "ara"
				};
			}
		}

		// Записываем все файлы из map & additionalFiles в srcFiles
		// после чего записываем srcFiles в outputDir

		var srcFiles = additionalFiles.slice(0);
		var outputDir = path.join(buildDir, outDir);

		var p = map;
		while (p) {
			if (p.files) {
				for (i = 0; i < p.files.length; i++) {
					if (srcFiles.indexOf(p.files[i].path) == -1) {
						srcFiles.push(p.files[i].path);
					}
				}
			}

			p = p.deps;
		}

		for (i = 0; i < srcFiles.length; ++i) {
			var dstFile = path.join(outputDir, srcFiles[i]);
			var srcFile = path.resolve(path.join(configPath, srcFiles[i]));

			copy(srcFile, dstFile);           //записываем файл в destFolder
		}

		mapFile = path.join(outputDir, resourceName + ".map");

		if (data.get("ResourceFile") || map.files.length) {
			write(mapFile, JSON.stringify(map, null, "\t"));
		}

		return {
			path: path.relative(buildDir, mapFile).replace(/\\/ig, "/"),
			type: "map"
		};
	}


	function readFolders(folders, config) {
		var srcDir = config.getAttribute("Path");
		var result = [];

		for (var i = 0; i < folders.length; ++i) {
			var currentFolder = path.join(srcDir, folders[i].getAttribute("Path"));

			var files = grunt.file.expand({ filter: 'isFile' }, [path.join(currentFolder, '*')]);
			var excludes = folders[i].find("Exclude");

			if (excludes) {
				for (var f = 0; f < files.length; ++f) {
					for (var n = 0; n < excludes.length; ++n) {
						if (path.resolve(path.join(currentFolder, excludes[n].getAttribute('Path'))) ==
							path.resolve(path.join(currentFolder, files[f]))) {
							//Removing Exclude from files.
							debug("@EXCLUDE", excludes[n].getAttribute('Path'));
							files.splice(f, 1);
							f--;
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

	/**
	 * create zip archive with files described in {argv}
	 * @param config {XML}
	 * @param mapFile {String} Path to .map file.
	 * @param additionalData {String[]} Дополнительные файлы и папки которые надо включить в архив с ресурсом.
	 */
	function packResourcesArchive(config, map, additionalData) {
		var archive = new Zip();
		var configDir = config.getAttribute("Path");
		var files = [];


		archive.add(".map", new Buffer(JSON.stringify(map, null, '\t'), "utf8"));

		debug("@RESOURCE", ".map");

		while (map) {
			if (map.files) {
				for (var i = 0; i < map.files.length; i++) {
					var file = map.files[i].path;
					var res = file.replace(/\\/ig, "/");

					archive.add(res, fs.readFileSync(path.join(configDir, file)));
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

						archive.add(name, fs.readFileSync(value));
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
	function loadAttachment(config, attachment) {
		var name = null;
		var outDir = "";
		var format = null;
		var files = getFilesFromAttachment(attachment, config);
		var minify = null;
		var srcDir = config.getAttribute("Path");
		var buildDir = path.join(config.getAttribute("Path"), config.getAttribute("OutDir"));
		var type = null;

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
				var dest = path.join(buildDir, outDir, path.basename(file));
				copy(file, dest);
				data.push(path.relative(buildDir, dest).replace(/\\/g, '/'));
				debug("@COPY", file, "->", path.join(buildDir, outDir, path.basename(file)));
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

		checkDependenceModules(config, function (ok, moduleScripts, attachmentsList) {
			compile(config, function (ok, attachments) {
				if (!ok) return cb(false);

				for (var i = 0; i < attachmentsList.length; ++i) {
					var attachments = attachmentsList[i];
					for (var j in attachments) {
						if (attachments[j].format === "Enclosure") {
							if (attachments[j].type === "javascript") {
								scripts = scripts.concat(attachments[j].content.split(";"));
							}

							if (attachments[j].type === "css") {
								scripts.push(attachments[j].content);
							}
						}
					}
				}

				for (var i in attachments) {
					if (attachments[i].type === "javascript") {
						scripts.push(attachments[i].content);
					}

					if (attachments[i].type === "css") {
						styles.push(attachments[i].content);
					}
				}

				var destJs = config.getAttribute("OutFile");
				var destFolder = path.dirname(destJs);
				var destHtml = path.join(destFolder, path.basename(template, path.extname(template)) + '.html');

				debug("Dest. folder: ", destFolder);
				debug("Dest. js: ", destJs);
				debug("Name:", name);
				debug("Description:", description);
				debug("Template:", template);

				scripts = scripts.concat(
					moduleScripts.map(function (script) {
						//console.log(destFolder, script);
						return path.relative(destFolder, script).replace(/\\/g, '/');
					}));

				if (!exists(template)) {
					code = read(path.join(__dirname, "demo.jade"));
				}
				else {
					code = read(template);
				}

				// Compile a function
				var fn = jade.compile(code, { pretty: true, debug: false, compileDebug: false });

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
			grunt.fail.fatal(new Error("Could not determ demo name."));
		}

		debug("Current demo: ", demo);
		buildDemo(demo, path.join(cfg('DemosSourceDir'), demo), done);
	});
}
