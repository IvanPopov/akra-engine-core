/**
 * Typescript build task for Akra 3D engine.
 */

'use strict';

var spawn = require('child_process').spawn;
var path = require('path');
var fs = require('fs');
var xml2js = require('xml2js');
var wrench = require('wrench');
var UglifyJS = require("uglify-js");
var jade = require('jade');


//zip for resource compression
var Zip = require('node-zip');

var VARIABLE_PATTERN = /(AE_[\w\d\-\.\_\:]*)/g;
var TYPESCRIPT = "typescript-0.9.5";


var DEMOS_SOURCE_DIR = "src/demos";
var DEMOS_BUILD_DIR = "build/demos";

//TODO: add all available TS options

module.exports = function (grunt) {
	/** Determ compression level by options */
	function determMinLevel(options) {
		/**
		 * 0 - none minimizing, 1 - simple optimization, 2 - advanced optimiztion
		 */
		var minimizationLevel = 0;
		if (grunt.option("min_level") && grunt.option("min_level") > 0) {
			minimizationLevel = grunt.option("min_level");
		}
		else if (grunt.option("minimize")) {
			minimizationLevel = 2;
		}
		else if (options.min_level > 0) {
			minimizationLevel = options.min_level;
		}

		return minimizationLevel;
	}

	/**
	 * @param moduleName {String} Имя собираемого в данный момент модуля
	 * @param sourcePaths {String[]} Файлы из которых будет собран модуль.
	 * @param dest {String} Файл в который будет скомпилирован модуль
	 * @param options {Object} Опции сборки.
	 */
	function compile(moduleName, sourcePaths, dest, options, cb) {

		var filteredPaths = sourcePaths.filter(function (path) {
			if (!grunt.file.exists(path)) {
				grunt.log.warn('Source file "' + path + '" not found.');
				return false;
			} else {
				return true;
			}
		});

		var minimizationLevel = determMinLevel(options);

		compileTypescript(sourcePaths, options, dest, function (ok) {
			if (!ok) {
				return cb(false);
			}

			var externs = generateExterns(dest);	//path to externs
			var callback = function (ok) {
				if (!ok) {
					return cb(false);
				}

				searchResources(moduleName, sourcePaths, dest, options, cb);
			}

			if (minimizationLevel > 0) {
				dest = minimize(dest, minimizationLevel, externs, callback);
			}
			else {
				callback(true);
			}
		});

	}

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
	 * Загружаем ресурс из тега Resource в map файл.
	 * @param Resource {XML} Resource tag.
	 * @param cur {IDependens} Текущий уровень зависимостей.
	 */
	function loadResource(Resource, cur) {
		cur.files = cur.files || [];

		var res = { path: Resource.$.Path };

		if (Resource.$.Name) {
			res.name = Resource.$.Name;
		}

		if (Resource.$.Comment) {
			res.comment = Resource.$.Comment;
		}

		if (Resource.$.Type) {
			res.type = Resource.$.Type;
		}

		cur.files.push(res);

		if (Resource.Resource) {
			cur.deps = cur.deps || {};

			for (var i = 0; i < Resource.Resource.length; ++i) {
				loadResource(Resource.Resource[i], cur.deps);
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

	/**
	 * @param resourceName {String} Resource name.
	 * @param resourcePath {String} Path to folder with resources.xml.
	 * @param PropertyGroup {XML} Xml tag with resource sedcription.
	 * @param destFolder {String} Destination folder.
	 */
	function crateResourceObject(resourceName, resourcePath, PropertyGroup, destFolder) {
		var isArchive = false;
		var useInlining = false;
		var outDir = "";
		var mapFile = null;
		var map = null;

		if (PropertyGroup.UseInlining) {
			useInlining = PropertyGroup.UseInlining[0].toLowerCase() === "true";

			//При подстановке внутрь скрипта все должно быть запаковано в один файл.
			if (useInlining) {
				isArchive = true;
			}
		}

		if (!useInlining) {
			//при использовании подстановки, контент включается внутрь JS файла
			//поэтому нету смысла использовать параметр OutDir
			if (PropertyGroup.OutDir) {
				outDir = PropertyGroup.OutDir[0];
			}

			if (PropertyGroup.Archive) {
				isArchive = PropertyGroup.Archive[0].toLowerCase() === "true";
			}
		}

		if (PropertyGroup.MapFile) {
			mapFile = PropertyGroup.MapFile[0];
			//расчитаем полный путь к map файлу
			mapFile = path.join(resourcePath, mapFile);

			if (!fs.existsSync(mapFile)) {
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

		if (PropertyGroup.Data) {
			var Data = PropertyGroup.Data[0];
			var additionalFiles = [];

			if (Data.Folder) {
				additionalFiles = readFolder(Data.Folder, resourcePath);
			}

			if (Data.File) {
				for (var i = 0; i < Data.File.length; ++i) {
					additionalFiles.push(path.normalize(Data.File[i].$.Path));
				}
			}

			if (Data.Resource) {
				/**
				 * @param Resource {XML} Current resource.
				 * @param cur {IDependence} Current dep level.
				 */

				var lowLevel = getLowerLevel(map);

				for (var i = 0; i < Data.Resource.length; ++i) {
					loadResource(Data.Resource[i], lowLevel);
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

	/**
	 * @return {String} Путь к ресурсу.
	 */
	function packResource(folder, Resource, dest) {
		var name = Resource.$.Name;

		if (Resource.Filename) {
			name = Resource.Filename[0];
		}

		for (var i = 0; i < Resource.PropertyGroup.length; ++i) {
			var PropertyGroup = Resource.PropertyGroup[i];
			//TODO: проверить Condition данной групы и убедиться, что она подходит
			if (PropertyGroup.$ && PropertyGroup.$.Condition) {
				if (!computeXmlData(PropertyGroup.$.Condition)) {
					continue;
				}
			}

			return crateResourceObject(name, folder, Resource.PropertyGroup[i], dest);
		}

		return null;
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
			var outDir = Attachment.OutDir? Attachment.OutDir[0] : "";

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

	/** 
	 * Compute expressions from XML
	 */
	function computeXmlData(expression) {
		var $ = function (val) {
			return grunt.config.get("AE_" + val.toUpperCase());
		};

		var f = new Function("$", "True", "False", "return (" + expression + ");");
		return f($, true, false);
	}

	/** 
	 * Собиарем ресурсы по проекту
	 * @param folder {String} Путь к папке с проектом.
	 * @param Project {XML} Описание проекта в resources.xml.
	 * @param dest {String} Файл, в который будет собран проект.
	 */
	function buildProject(folder, Project, dest, cb) {
		var variables = {};

		console.time("Build project " + Project.$.Name);

		if (Project.Variable) {
			for (var i = 0; i < Project.Variable.length; ++i) {
				var Variable = Project.Variable[i];
				var name = Variable.$.Name;

				if (Variable.$.Condition) {
					if (!computeXmlData(Variable.$.Condition)) continue;
				}

				var value = computeXmlData(Project.Variable[i]._);


				if (typeof value === 'string') {
					value = JSON.stringify(value);
				}

				variables[name] = value;

				grunt.log.debug("@VARIABLE " + name + "=" + (typeof value == 'string' ? value.substr(0, 16) : value));
			}
		}

		if (Project.Resource) {
			for (var i = 0; i < Project.Resource.length; ++i) {
				var resource = packResource(folder, Project.Resource[i], path.dirname(dest));

				if (!resource) {
					continue;
				}



				var resourceName = Project.Resource[i].$.Name;

				variables[resourceName] = JSON.stringify(resource);
				variables[resourceName + ".path"] = JSON.stringify(resource.path);
				variables[resourceName + ".type"] = JSON.stringify(resource.type);

			}
		}

		if (Project.Attachment) {
			for (var i = 0; i < Project.Attachment.length; ++i) {
				var attachment = loadAttachment(folder, Project.Attachment[i], path.dirname(dest));

				if (!attachment) {
					continue;
				}

				var attachmentName = Project.Attachment[i].$.Name;

				variables[attachmentName] = JSON.stringify(attachment, null, '\t');

				variables[attachmentName + ".format"] = JSON.stringify(attachment.format);

				if (attachment.format !== null && attachment.format !== "STRING") {
					variables[attachmentName + ".content"] = attachment.content;
				}
				else {
					variables[attachmentName + ".content"] = JSON.stringify(attachment.content);
				}
			}
		}

		var data = fs.readFileSync(dest, "utf8");


		data = data.replace(VARIABLE_PATTERN, function replacer(str, name) {
			var value = variables[name];

			if (typeof value !== "undefined") {
				grunt.log.debug("> " + name + "=" + (value.length > 32 ? value.substr(0, 32) + '...' : value));
				return value;
			}

			return name;
		});

		fs.writeFileSync(dest, data, "utf8");

		console.timeEnd("Build project " + Project.$.Name);

		cb(true);
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

	function findModuleInResourcesXML(resourceFile, moduleName, cb) {
		var parser = new xml2js.Parser();
		var resourceFolder = path.dirname(resourceFile);

		var data = fs.readFileSync(resourceFile, "utf8");
			
		parser.parseString(data, function (err, xml) {
			for (var i = 0; i < xml.Resources.Project.length; ++i) {
				var Project = xml.Resources.Project[i];

				//founded
				if (Project.$.Name === moduleName) {
					return cb(Project);
				}
			}

			cb(null);
		});
	}

	/**
	 * Ищем ресурсы для данного проектта.
	 */
	function searchResources(moduleName, sourcePaths, dest, options, cb) {
		var resourceFile = findResourcesXML(sourcePaths);
		

		if (!resourceFile) {
			grunt.log.warn("Could not find resources.xml");
			return cb(true);
		}


		grunt.log.debug("Resources:", resourceFile);

		var parser = new xml2js.Parser();
		var resourceFolder = path.dirname(resourceFile);

		findModuleInResourcesXML(resourceFile, moduleName, function (Project) {
			if (Project) {
				return buildProject(resourceFolder, Project, dest, cb);
			}
			else {
				grunt.log.warn("Description of " + moduleName + " is not found in the resources.xml.");
				cb(true);
			}
		});
	}

	function generateExterns(src) {
		var dest = src.replace(/\.js$/, ".externs.js");
		if (src === dest) dest += ".externs";

		var externs = [];
		var data = fs.readFileSync(src, "utf8");

		data.replace(VARIABLE_PATTERN, function replacer(str, name) {
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

		fs.writeFileSync(dest, externsString, "utf8");
		return dest;
	}

	function minimize(src, level, externs, cb) {
		if (!src || !grunt.file.exists(src)) {
			grunt.log.warn('Source file for minimize "' + src + '" not found.');
			return null;
		}

		var dest = src.replace(/\.js$/, ".min.js");
		if (src === dest) dest += ".min";

		var closureJar = path.normalize(__dirname + '/closure/compiler.jar');
		var levelStr = level === 2 ? "ADVANCED_OPTIMIZATIONS" : "SIMPLE_OPTIMIZATIONS";
		var cmd = "java";
		var argv = ["-jar", closureJar,
					"--compilation_level", levelStr,
					"--js", src,
					"--js_output_file", dest,
					"--create_source_map", dest + ".map",
					"--source_map_format=V3"];

		if (grunt.file.exists(externs)) {
			argv.push("--externs", externs);
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

	function compileTypescript(sourcePaths, options, dest, cb) {
		var minimizationLevel = determMinLevel(options);
		var tsBin;
		if (options.tscc || grunt.option("tscc") || minimizationLevel > 0) {
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
				cb(true);
			}
			else {
				grunt.log.error(new Error("Compilation failed."));
				cb(false);
			}
		});
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
		var pendingFiles = this.files.length;

		if (pendingFiles > 0) {
			var opts = this.data,
				done = this.async();

			var moduleName = this.nameArgs.split(":")[1];

			if (!moduleName) {
				grunt.fail.fatal(new Error("Could not determ module name."));
			}

			grunt.log.debug("Current module: ", moduleName);

			this.files.forEach(function (file) {
				compile(moduleName, file.src, file.dest, opts.options, function (result) {
					pendingFiles = pendingFiles - 1;
					if (pendingFiles === 0) {
						done(result);
					}
				});
			});
		}
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
