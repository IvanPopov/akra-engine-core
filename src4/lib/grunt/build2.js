/**
 * Typescript build task for Akra 3D engine.
 */

'use strict';

var spawn = require('child_process').spawn;
var path = require('path');
var fs = require('fs');
var libxmljs = require('libxmljs');
var wrench = require('wrench');
var UglifyJS = require("uglify-js");
var jade = require('jade');
//zip for resource compression
var Zip = require('node-zip');



var EXTERN_PATTERN = /(AE_[\w\d\-\.\_\:]*)/g;
var TYPESCRIPT = "typescript-0.9.5";

var DEMOS_SOURCE_DIR = "src/demos";
var DEMOS_BUILD_DIR = "build/demos";

//TODO: add all available TS options

module.exports = function (grunt) {
	/**
	 * @param configFile {String} Path to config file.
	 */
	function compile(configFile, cb) {

		var config = loadConfig(configFile);

		compileTypescript(config, function (ok) {
			if (!ok) {
				return cb(false);
			}

			if (!ok) {
				return cb(false);
			}

			searchResources(config, cb);

		});
	}

	function loadConfig(file) {
		var xsd = libxmljs.parseXmlString(grunt.file.read(path.join(__dirname, "schema.xsd")));
		var xml = libxmljs.parseXmlString(grunt.file.read(file));

		if (!xml.validate(xsd)) {
			grunt.log.warn(file + " validation failed.");
			return cb(false);
		}

		var config = xml.root();

		config.find("PropertyGroup").forEach(function (group) {
			if (!checkPropertyGroupCondition(group)) {
				group.remove();
			}
		});

		config.attr("Path", path.dirname(file));

		if (!config.attr("Name")) {
			config.attr("Name", path.basename(file, ".xml"));
		}

		grunt.config("ProjectName", config.attr("Name").value());
		grunt.config("ProjectDir", config.attr("Path").value());
		grunt.config("OutDir", prepareSystemVariables(path.dirname(config.get("//TypeScriptOutFile").text())));

		return config;
	}

	function checkPropertyGroupCondition(propertyGroup) {
		var conditionAttr = propertyGroup.attr("Condition");

		if (!conditionAttr) {
			return true;
		}

		var condition = prepareSystemVariables(conditionAttr.value());

		return computeExpression(condition);
	}

	function prepareSystemVariables(str) {
		return str.replace(/(\$\(([\w\d\_\-]+)\))/g, function (str, expr, variable) {
			return grunt.config.get(variable);
		});
	}

	/** 
	 * Compute expressions
	 */
	function computeExpression(expression) {
		var f = new Function("True", "False", "return (" + expression + ");");
		return f(true, false);
	}

	function compileTypescript(config, cb) {
		var compilerOptions = config.get("//ClosureCompiler");

		var cmd = "node";
		var tscjs = path.normalize(__dirname + "/" + TYPESCRIPT + "/tsc.js");
		var argv = [];
		var dest = null;		//path ro destination js file.
		var configDir = config.attr("Path").value();

		if (compilerOptions || grunt.option("tscc")) {
			tscjs = path.normalize(__dirname + '/tscc/tscc.js');
		}

		argv.push(tscjs);

		//load sources
		config.find("//TypeScriptCompile").forEach(function (typescriptCompile) {
			argv.push(path.join(configDir, typescriptCompile.attr("Include").value()));
		});


		if (config.get("//TypeScriptTarget")) {
			argv.push("--target", config.get("//TypeScriptTarget").text());
		}

		if (config.get("//TypeScriptModuleKind")) {
			argv.push("--module", config.get("//TypeScriptModuleKind").text());
		}

		if (config.get("//TypeScriptSourceMap")) {
			if (config.get("//TypeScriptSourceMap").text() === "True") {
				argv.push("--sourcemap");
			}
		}

		if (config.get("//TypeScriptGeneratesDeclarations")) {
			if (config.get("//TypeScriptGeneratesDeclarations").text() === "True") {
				argv.push("--declaration");
			}
		}

		if (config.get("//TypeScriptPropagateEnumConstants")) {
			if (config.get("//TypeScriptPropagateEnumConstants").text() === "True") {
				argv.push("--propagateEnumConstants");
			}
		}

		if (config.get("//TypeScriptRemoveComments")) {
			if (config.get("//TypeScriptRemoveComments").text() === "True") {
				argv.push("--removeComments");
			}
		}

		if (config.get("//TypeScriptOutDir")) {
			argv.push("--outDir", path.join(configDir, prepareSystemVariables(config.get("//TypeScriptOutDir").text())));
		}

		if (config.get("//TypeScriptOutFile")) {
			dest = path.join(configDir, prepareSystemVariables(config.get("//TypeScriptOutFile").text()));
			dest = dest.replace(/\.min\.js$/, ".js");
		}
		else {
			grunt.log.error("TypeScript out file must be specified.");
			return cb(false);
		}

		grunt.config();

		argv.push("--out", dest);

		if (config.get("//TypeScriptAdditionalFlags")) {
			argv = argv.concat(prepareSystemVariables(config.get("//TypeScriptAdditionalFlags").text()).split(/\s+/));
		}

		grunt.log.writeln(cmd + " " + argv.join(" "));
		return minimize(config, cb);
		var tsc = spawn(cmd, argv);

		tsc.stdout.on("data", function (data) {
			grunt.log.write(data.toString());
		});

		tsc.stderr.on("data", function (data) {
			grunt.log.error(data.toString());
		});


		tsc.on("close", function (code) {
			if (code === 0) {
				if (compilerOptions) {
					minimize(config, cb);
				}
			}
			else {
				grunt.log.error(new Error("Compilation failed."));
				cb(false);
			}
		});
	}

	function generateExterns(src) {

		var dest = src.replace(/\.min\.js|\.js$/, ".externs.js");
		if (src === dest) dest += ".externs";

		var externs = [];
		var data = fs.readFileSync(src, "utf8");

		data.replace(EXTERN_PATTERN, function replacer(str, name) {
			if (name.indexOf(".") > 0) {
				name = name.substr(0, name.indexOf("."));
			}

			if (externs.indexOf(name) == -1) {
				externs.push(name);
			}

			return name;
		});

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

		grunt.file.write(dest, externsString);

		return dest;
	}

	function minimize(config, cb) {
		var configDir = config.attr("Path").value();
		var compilerOptions = config.get("//ClosureCompiler");
		var externsPath = null; //generateExterns(dest);
		var dest = null;

		var src = path.join(config.attr("Path").value(), prepareSystemVariables(config.get("//TypeScriptOutFile").text()));

		if (compilerOptions.get("//OutFile")) {
			var outFile = prepareSystemVariables(compilerOptions.get("//OutFile").text());
			dest = path.join(configDir, outFile);
		}
		else {
			dest = src.replace(/\.js$/, ".min.js");
			if (src === dest) dest += ".min";
		}

		if (!src || !grunt.file.exists(src)) {
			grunt.log.warn('Source file for minimizing "' + src + '" not found.');
			return null;
		}

		var closureJar = path.join(__dirname, '/closure/compiler.jar');
		var compilationLevel = compilerOptions.get("//CompilationLevel").text();
		var cmd = "java";
		var argv = [
			"-jar", closureJar,
			"--compilation_level", compilationLevel,
			"--js", src,
			"--js_output_file", dest
		];

		if (compilerOptions.get("//CreateSourceMap")) {
			if (compilerOptions.get("//CreateSourceMap").text() === "True") {
				argv.push("--source_map_format=V3", "--create_source_map", dest + ".map");
			}
		}

		if (externsPath && grunt.file.exists(externsPath)) {
			argv.push("--externs", externsPath);
		}

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
				cb(true);
			}
			else {
				grunt.fail.warn("Closure minimization failed.");
				cb(false);
			}
		});

		return dest;
	}

	/** 
	 * Собиарем ресурсы по проекту
	 * @param folder {String} Путь к папке с проектом.
	 * @param Project {XML} Описание проекта в resources.xml.
	 * @param dest {String} Файл, в который будет собран проект.
	 */
	function buildProject(config, cb) {
		var variables = {};

		console.time("Build project " + config.attr("Name"));

		if (config.find("//PropertyGroup/Variable")) {
			config.find("//PropertyGroup/Variable").forEach(function (variable) {
				var name = variable.attr("Name").value();
				var value = computeExpression(variable.text());

				if (typeof value === 'string') {
					value = JSON.stringify(value);
				}

				variables[name] = value;

				grunt.log.debug("@VARIABLE " + name + "=" + (typeof value == 'string' ? value.substr(0, 16) : value));
			});
		}

		if (config.find("//PropertyGroup/Resource")) {
			config.find("//PropertyGroup/Resource").forEach(function (resource) {
				var result = packResource(config, resource);
				var resourceName = resource.attr("Name").value();

				variables[resourceName] = JSON.stringify(result);
				variables[resourceName + ".path"] = JSON.stringify(result.path);
				variables[resourceName + ".type"] = JSON.stringify(result.type);
			});
		}

		if (config.find("//PropertyGroup/Attachment")) {
			config.find("//PropertyGroup/Resource").forEach(function (attachment) {
				var result = loadAttachment(config, attachment);
				var attachmentName = attachment.attr("Name").value();

				variables[attachmentName] = JSON.stringify(result, null, '\t');
				variables[attachmentName + ".format"] = JSON.stringify(result.format);

				if (result.format !== null && result.format !== "String") {
					variables[attachmentName + ".content"] = result.content;
				}
				else {
					variables[attachmentName + ".content"] = JSON.stringify(result.content);
				}
			});
		}

		var data = grunt.file.read(dest);

		data = data.replace(EXTERN_PATTERN, function replacer(str, name) {
			var value = variables[name];

			if (typeof value !== "undefined") {
				grunt.log.debug("> " + name + "=" + (value.length > 32 ? value.substr(0, 32) + '...' : value));
				return value;
			}

			return name;
		});

		grunt.file.write(dest, data);

		console.timeEnd("Build project " + config.attr("Name"));

		cb(true);
	}

	function computeExpression(expression) {
		var f = new Function("return (" + prepareSystemVariables(expression) + ");");
		return f();
	}



	/**
	 * @param resourcePath {String} Path to folder with resources.xml.
	 * @param PropertyGroup {XML} Xml tag with resource sedcription.
	 * @param destFolder {String} Destination folder.
	 */
	function crateResourceObject(config, resource) {
		var resourceName = resource.attr("Name").value();

		if (resource.get("//Filename")) {
			resourceName = resource.get("//Filename").text();
		}

		var isArchive = false;
		var useInlining = false;
		var outDir = "";
		var mapFile = null;
		var map = null;

		if (resource.get("//UseInlining")) {
			useInlining = resource.get("//UseInlining").text() === "True";

			//При подстановке внутрь скрипта все должно быть запаковано в один файл.
			if (useInlining) {
				isArchive = true;
			}
		}

		if (!useInlining) {
			//при использовании подстановки, контент включается внутрь JS файла
			//поэтому нету смысла использовать параметр OutDir
			if (resource.get("//OutDir")) {
				outDir = prepareSystemVariables(resource.get("//OutDir").text());
			}

			if (resource.get("//Archive")) {
				isArchive = resource.get("//Archive").text() === "True";
			}
		}

		if (resource.get("//MapFile")) {
			mapFile = prepareSystemVariables(resource.get("//MapFile").text());
			//расчитаем полный путь к map файлу
			mapFile = path.join(resourcePath, mapFile);

			if (!grunt.file.exists(mapFile)) {
				grunt.fail.warn("<MapFile>" + mapFile + "</MapFile> not found.");
			}
		}

		if (mapFile) {
			map = JSON.parse(fs.readFileSync(mapFile), "utf8");

			var mapFolder = path.dirname(mapFile);

			var p = map;
			while (p) {
				if (p.files) {
					for (var i = 0; i < p.files.length; i++) {
						p.files[i].path = path.normalize(mapFolder + "/" + p.files[i].path).replace(/\\/ig, "/");
					}
				}

				p = p.deps;
			}
		}
		else {
			map = { files: [] };
		}

		if (resource.get("//Data")) {
			var data = resource.get("//Data");
			var additionalFiles = [];

			if (data.get("//Folder")) {
				additionalFiles = readFolder(data.get("//Folder").text(), resourcePath);
			}

			if (data.get("//File")) {
				var files = data.find("//File");
				for (var i = 0; i < files.length; ++i) {
					additionalFiles.push(path.normalize(files[i].attr("Path").value()));
				}
			}

			if (data.get("//ResourceFile")) {
				var resourceFiles = data.find("//ResourceFile");
				var lowLevel = getLowerLevel(map);

				for (var i = 0; i < resourceFiles.length; ++i) {
					loadResource(resourceFiles[i], lowLevel);
				}
			}
		}

		if (isArchive) {
			var archive = packResourcesArchive(resourcePath, map, additionalFiles);

			if (useInlining) {
				return {
					path: "data:application/octet-stream;base64," + archive.generate({ base64: true, compression: 'DEFLATE' }),
					type: "ara"
				};
			}
			else {
				var outputFile = path.join(destFolder, outDir, resourceName + ".ara");
				var archiveData = archive.generate({ base64: false, compression: 'DEFLATE' });

				wrench.mkdirSyncRecursive(path.dirname(outputFile));
				fs.writeFileSync(outputFile, archiveData, 'binary');

				return {
					path: path.relative(destFolder, outputFile).replace(/\\/ig, "/"),
					type: "ara"
				}
			}
		}

		// Записываем все файлы из map & additionalFiles в srcFiles
		// после чего записываем srcFiles в outputDir

		var srcFiles = additionalFiles.slice(0);
		var outputDir = path.join(destFolder, outDir);

		wrench.mkdirSyncRecursive(outputDir);

		var p = map;
		while (p) {
			if (p.files) {
				for (var i = 0; i < p.files.length; i++) {
					if (srcFiles.indexOf(p.files[i].path) == -1) {
						srcFiles.push(p.files[i].path);
					}
				}
			}

			p = p.deps;
		}

		for (var i = 0; i < srcFiles.length; ++i) {
			var dstFile = path.join(outputDir, srcFiles[i]);
			var srcFile = path.resolve(path.join(resourcePath, srcFiles[i]));

			wrench.mkdirSyncRecursive(path.dirname(dstFile));              //создаем путь к файлу, если такого не существует
			fs.writeFileSync(dstFile, fs.readFileSync(srcFile));           //записываем файл в destFolder
		}


		var mapFile = path.join(outputDir, resourceName + ".map");

		if (Data.Resource || map.files.length) {
			fs.writeFileSync(mapFile, JSON.stringify(map, null, "\t"), "utf8");
		}

		return {
			path: path.relative(destFolder, mapFile).replace(/\\/ig, "/"),
			type: "map"
		}
	}

	
	//==================================================================================================================
	//==================================================================================================================
	//==================================================================================================================
	//==================================================================================================================

	/**
	 * create zip archive with files described in {argv}
	 * @param folder {String} Path to folde with resource.xml
	 * @param mapFile {String} Path to .map file.
	 * @param additionalData {String[]} Дополнительные файлы и папки которые надо включить в архив с ресурсом.
	 */
	function packResourcesArchive(folder, map, additionalData) {
		var archive = new Zip();
		var files = [];             // файлы которые были добавлены в архив

		archive.file(".map", JSON.stringify(map, null, '\t'));

		grunt.log.debug("@RESOURCE", ".map");

		while (map) {
			if (map.files) {
				for (var i = 0; i < map.files.length; i++) {
					var file = map.files[i].path;
					var res = file.replace(/\\/ig, "/");
					archive.file(res, fs.readFileSync(path.join(folder, file)).toString('base64'), { base64: true });
					grunt.log.debug("@RESOURCE", res);
				}
			}

			map = map.deps;
		}

		if (additionalData) {
			additionalData.forEach(function (value, i) {
				value = path.join(folder, value);
				var name = path.relative(folder, value).replace(/\\/ig, "/");

				if (fs.existsSync(value)) {
					if (fs.statSync(value).isDirectory()) {
						//files in string[] array, include directories..
						var files = wrench.readdirSyncRecursive(value);
						grunt.fail.warn("TODO: folder support not implemented....");
					}
					else if (Object.keys(archive.files).indexOf(name) === -1) {
						archive.file(name, fs.readFileSync(value).toString('base64'), { base64: true });
						grunt.log.debug("@RESOURCE", name);
					}
				}
				else {
					grunt.fail.warn("Could not find file " + value + " (cwd: " + process.cwd() + ")");
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
	function loadResource(ResourceFile, cur) {
		cur.files = cur.files || [];

		var res = { path: ResourceFile.$.Path };

		if (ResourceFile.$.Name) {
			res.name = ResourceFile.$.Name;
		}

		if (ResourceFile.$.Comment) {
			res.comment = ResourceFile.$.Comment;
		}

		if (ResourceFile.$.Type) {
			res.type = ResourceFile.$.Type;
		}

		cur.files.push(res);

		if (ResourceFile.ResourceFile) {
			cur.deps = cur.deps || {};

			for (var i = 0; i < ResourceFile.ResourceFile.length; ++i) {
				loadResource(ResourceFile.ResourceFile[i], cur.deps);
			}
		}
	}

	/** Read Folder tag */
	function readFolder(Folder, srcFolder) {
		var result = [];

		for (var i = 0; i < Folder.length; ++i) {
			var currentFolder = path.join(srcFolder, Folder[i].$.Path);
			var files = wrench.readdirSyncRecursive(currentFolder);
			var excludes = Folder[i].Exclude;

			if (excludes) {
				for (var f = 0; f < files.length; ++f) {
					for (var n = 0; n < excludes.length; ++n) {
						if (path.resolve(path.join(currentFolder, excludes[n].$.Path)) == path.resolve(path.join(currentFolder, files[f]))) {
							//Removing Exclude from files.
							grunt.log.debug("@EXCLUDE", excludes[n].$.Path);
							files.splice(f, 1);
							f--;
						}
					}
				}
			}

			files.forEach(function (file, i) {
				result.push(path.relative(srcFolder, path.join(currentFolder, file)));
			});
		}

		return result;
	}

	

	function getFilesFromAttachment(Attachment, srcFolder) {
		var files = [];
		if (Attachment.File) {
			for (var i = 0; i < Attachment.File.length; ++i) {
				files.push(path.normalize(Attachment.File[i].$.Path));
			}
		}

		if (Attachment.Folder) {
			files = files.concat(readFolder(Attachment.Folder, srcFolder));
		}

		return files;
	}

	function loadAttachmentObject(name, srcFolder, Attachment, destFolder) {
		var outDir = "";
		var format = null;
		var files = getFilesFromAttachment(Attachment, srcFolder);
		var minify = null;

		if (Attachment.OutDir) {
			outDir = Attachment.OutDir[0].toLowerCase() === "true";
		}

		if (Attachment.Minify) {
			minify = Attachment.Minify[0].toUpperCase();
		}


		if (Attachment.Format) {
			format = Attachment.Format[0].toUpperCase();
		}

		files.forEach(function (file) {
			grunt.log.debug("@ATTACHMENT", name + "=" + file, (format ? "(" + format + ")" : ""));
		});

		files.forEach(function (file, i, files) {
			files[i] = path.join(srcFolder, file);
			// grunt.log.debug(path.join(srcFolder, file), path.relative(destFolder, path.join(srcFolder, file)));
		});


		if (!format) {
			files.forEach(function (file, i, files) {
				files[i] = path.relative(destFolder, file).replace(/\\/ig, "/");
			});
			return {
				content: files.join(";"),
				format: format
			};
		}

		if (format === "STRING") {
			var data = "";
			files.forEach(function (file) {
				data += "\n" + fs.readFileSync(file, "utf-8");
			});

			return { content: data, format: format };
		}

		if (format === "ENCLOSURE") {
			var outDir = Attachment.OutDir ? Attachment.OutDir[0] : "";

			files.forEach(function (file) {
				grunt.file.copy(file, path.join(destFolder, outDir, path.basename(file)));
				grunt.log.debug("@COPY", file, "->", path.join(destFolder, outDir, path.basename(file)));
			});

			return {
				content: "/** Enclosured */",
				format: format
			}
		}

		if (!minify) {

			var data = "";
			files.forEach(function (file) {
				data += "\n" + fs.readFileSync(file, "utf-8");
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



	/** 
	 * @param folder {String} Path to project folder.
	 * @param Attachment {XML} Attachment object.
	 * @param dest {String} Path to dest folder.
	 */
	function loadAttachment(folder, Attachment, dest) {
		var name = Attachment.$.Name;

		if (!Attachment.PropertyGroup) {
			return loadAttachmentObject(name, folder, Attachment, dest);
		}

		for (var i = 0; i < Attachment.PropertyGroup.length; ++i) {
			var PropertyGroup = Attachment.PropertyGroup[i];
			//TODO: проверить Condition данной групы и убедиться, что она подходит
			if (PropertyGroup.$ && PropertyGroup.$.Condition) {
				if (!computeXmlData(PropertyGroup.$.Condition)) {
					continue;
				}
			}

			return loadAttachmentObject(name, folder, Attachment.PropertyGroup[i], dest);
		}

		return null;
	}

	function findAttachments(Project) {
		var attachments = [];
		if (Project.Attachment) {
			for (var i = 0; i < Project.Attachment.length; ++i) {
				var Attachment = Project.Attachment[i]
				var name = Attachment.$ ? Attachment.$.Name || null : null;
				if (!Attachment.PropertyGroup) {
					attachments.push({ name: name, body: Attachment });
				}
				else {
					for (var j = 0; j < Attachment.PropertyGroup.length; ++j) {
						var PropertyGroup = Attachment.PropertyGroup[j];
						//TODO: проверить Condition данной групы и убедиться, что она подходит
						if (PropertyGroup.$ && PropertyGroup.$.Condition) {
							if (!computeXmlData(PropertyGroup.$.Condition)) {
								continue;
							}
						}

						attachments.push({ name: name, body: Attachment.PropertyGroup[j] });
					}
				}
			}
		}

		return attachments;
	}


	function findResourcesXML(sourcePaths) {
		var srcFiles = [];
		var shortestPath = null;
		var resourceFolder = null;

		//normalize all pathes
		for (var i = 0; i < sourcePaths.length; ++i) {
			var srcFile = sourcePaths[i];

			srcFiles.push(path.resolve(path.dirname(srcFile)));
		}

		//sort > shortest path will be first
		srcFiles.sort(function (a, b) { return a.length < b.length ? -1 : 1 });

		resourceFolder = srcFiles[0];

		if (srcFiles.length > 1) {
			var dirs1 = srcFiles[0].split(path.sep);
			var dirs2 = srcFiles[1].split(path.sep);

			for (var i = 0; i < dirs1.length; ++i) {
				if (dirs1[i] != dirs2[i]) {
					resourceFolder = dirs1.slice(0, i - 1).join(path.sep);
				}
			}
		}

		grunt.log.debug("Automaticly detected resource folder:", resourceFolder);

		var resourceFile = path.join(resourceFolder, "resources.xml");

		if (!fs.existsSync(resourceFile)) {
			return null;
		}

		return resourceFile;
	}

	

	






	/** @param Module {XML} <Module/> tags from demo.xml */
	function loadDependentScriptsFromModules(Module, destFolder) {
		var scripts = [];
		var buildConfig = grunt.config.get('build');

		for (var i in Module) {
			var module = Module[i];
			var name = module.$.Name;

			if (buildConfig[name]) {
				scripts.push(path.relative(destFolder, buildConfig[name].dest).replace(/\\/g, '/'));

				var resourceFile = findResourcesXML(buildConfig[name].src);
				if (resourceFile) {
					findModuleInResourcesXML(resourceFile, name, function (Project) {
						if (!Project) return;
						var attachments = findAttachments(Project);

						for (var j in attachments) {
							var attachment = attachments[j].body;

							if (!attachment.Format || attachment.Format[0].toUpperCase() !== "ENCLOSURE") {
								continue;
							}

							var files = getFilesFromAttachment(attachment, path.dirname(resourceFile));
							files.forEach(function (file) {
								var outDir = attachment.OutDir ? attachment.OutDir[0] : "";
								var scriptPath = path.join(path.dirname(buildConfig[name].dest),
									outDir, path.basename(file));
								scripts.push(path.relative(destFolder, scriptPath).replace(/\\/g, '/'));
							});
						}
					});
				}
			}

			if (module.Module) {
				scripts = scripts.concat(loadDependentScriptsFromModules(module.Module, destFolder));
			}
		}

		return scripts;
	}

	function loadDependentJScripts(Script, srcFolder, destFolder) {
		var scripts = [];

		for (var i in Script) {
			var script = Script[i];
			var pathname = script.$.Path;
			var destPath = path.join(destFolder, pathname);
			var srcPath = path.join(srcFolder, pathname);
			grunt.file.copy(srcPath, destPath);
			scripts.push(path.relative(destFolder, destPath).replace(/\\/g, '/'));
		}

		return scripts;
	}

	function loadDependentStyles(Style, srcFolder, destFolder) {
		var styles = [];

		for (var i in Style) {
			var script = Style[i];
			var pathname = script.$.Path;
			var destPath = path.join(destFolder, pathname);
			var srcPath = path.join(srcFolder, pathname);
			grunt.file.copy(srcPath, destPath);
			styles.push(path.relative(destFolder, destPath).replace(/\\/g, '/'));
		}

		return styles;
	}

	function loadDependentFolder(Folder, srcFolder, destFolder) {

		for (var i in Folder) {
			var folder = Folder[i];
			var pathname = folder.$.Path;
			var destPath = path.join(destFolder, pathname);
			var srcPath = path.join(srcFolder, pathname);
			wrench.copyDirSyncRecursive(srcPath, destPath, {
				forceDelete: true
			});
		}
	}


	function buildDemo(demo, srcFolder, cb) {
		if (!grunt.file.exists(srcFolder)) {
			grunt.log.warn("Could not find demo.xml");
			cb(false);
		}

		var xmlData = grunt.file.read(path.join(srcFolder, "demo.xml"));
		var parser = new xml2js.Parser();

		parser.parseString(xmlData, function (err, xml) {
			var name = xml.Demo.$.Name;
			var description = xml.Demo.Description ? xml.Demo.Description[0] : null;
			var main = path.join(srcFolder, xml.Demo.Main ? xml.Demo.Main[0] : "main.ts");
			var template = path.join(srcFolder, xml.Demo.Template ? xml.Demo.Template[0] : "index.jade");
			var code = null;
			var scripts = [];
			var styles = [];
			var destFolder = path.join(DEMOS_BUILD_DIR, demo.toLowerCase());
			var destHtml = path.join(destFolder, path.basename(template, path.extname(template)) + '.html');
			var destJs = path.join(destFolder, path.basename(main, path.extname(main)) + '.js');

			if (!grunt.file.exists(main)) {
				grunt.fail.fatal(new Error("Could not find main file: " + main));
				return cb(false);
			}

			if (xml.Demo.Dependencies) {
				var Dependencies = xml.Demo.Dependencies[0];

				if (Dependencies.Module) {
					scripts = scripts.concat(loadDependentScriptsFromModules(Dependencies.Module, destFolder));
				}

				if (Dependencies.Script) {
					scripts = scripts.concat(loadDependentJScripts(Dependencies.Script, srcFolder, destFolder));
				}

				if (Dependencies.Style) {
					styles = styles.concat(loadDependentStyles(Dependencies.Style, srcFolder, destFolder));
				}

				if (Dependencies.Folder) {
					loadDependentFolder(Dependencies.Folder, srcFolder, destFolder);
				}
			}

			grunt.log.debug("Dest. js: ", destJs);
			grunt.log.debug("Dest. folder: ", destFolder);
			grunt.log.debug("Name:", name);
			grunt.log.debug("Description:", description);
			grunt.log.debug("Main:", main);
			grunt.log.debug("Template:", template);


			if (!grunt.file.exists(template)) {
				code = grunt.file.read(path.join(__dirname, "demo.jade"));
			}
			else {
				code = grunt.file.read(template);
			}

			// Compile a function
			var fn = jade.compile(code, { pretty: true, debug: false, compileDebug: false });

			// Render the function
			var html = fn({
				demo: {
					name: name,
					description: description,
					scripts: scripts,
					styles: styles,
					src: path.relative(destFolder, destJs).replace(/\\/g, "/")
				}
			});

			grunt.log.debug(html);
			grunt.file.write(destHtml, html);
			//return cb(true);

			compileTypescript([main], {}, destJs, function (ok) {
				if (!ok) return cb(false);

				if (xml.Demo.Resource) {
					var variables = {};
					var data = grunt.file.read(destJs);

					for (var i = 0; i < xml.Demo.Resource.length; ++i) {
						var resource = packResource(srcFolder, xml.Demo.Resource[i], destFolder);

						if (!resource) {
							continue;
						}

						data = data.replace(new RegExp(xml.Demo.Resource[i].$.Name, "g"),
							function replacer(str, name) {
								return JSON.stringify(resource);
							});
					}

					grunt.file.write(destJs, data);
				}

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
		var demo = this.nameArgs.split(":")[1];

		if (!demo) {
			grunt.fail.fatal(new Error("Could not determ demo name."));
		}

		grunt.log.debug("Current demo: ", demo);

		var src = path.join(DEMOS_SOURCE_DIR, demo);
		buildDemo(demo, src, done);
	});
};
