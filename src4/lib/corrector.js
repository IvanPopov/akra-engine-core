//usage: node corrector.js <path/to/interface(or folder)>

//this script rename all interfaces and enums AE***, AI*** files to 
//I**, E** and replace all types in into correct.
//Also, adding "module akra" into all interfaces.
//removing all 'inline' keywords
//replacing all IFACE(), #define/#ifdef macro.


var fs = require("fs");
var util = require("util");
var path = require("path");

var argv = process.argv.slice(2);
var dir = argv[0];
var file = null;

if (fs.statSync(dir).isFile()) {
	file = dir;
	dir = null;
}

var dict = [
	{from: "bool", to: "boolean"},
	{from: "interface", to: "export interface"},
	{from: "enum", to: "export enum"},
	// {from: "export ", to: ""},
	// {from: "readonly", to: "/** readonly */"},
	// {from: "writeonly", to: "/** writeonly */"},
	// {from: "inline", to: "/** inline */"},
	{from: "inline", to: ""},
];

if (dir) {
	fs.readdirSync(dir).forEach(function (file) {
		newFile = path.resolve(dir, file.substr(1));
		file = path.resolve(dir, file);

		var basename = path.basename(file);
		var filename = path.basename(file, ".ts");
		var ext = path.extname(basename);

		if (ext !== ".ts" || fs.statSync(file).isDirectory())
			return;

		switch (filename.substr(0, 2)) {
			case "AE":
			case "AI":
				fs.renameSync(file, newFile);
		}
	});
}

function scanFile(file) {
	var basename = path.basename(file);
	var filename = path.basename(file, ".ts");
	var ext = path.extname(basename);

	if (ext !== ".ts")
		return;

	var content = fs.readFileSync(file, "utf8");

	//replace interface <some> structure
	content = content.replace(new RegExp("interface\\s+([\\w\\d\\_\\/]+)\\s*", "gm"), 
		function(str, p1, offset, s) {
			if (p1[0] === "A") {
				dict.push({from: p1, to: p1.substr(1)});
			}

			return str;
		});

	//replace enum <some> structure
	content = content.replace(new RegExp("enum\\s+([\\w\\d\\_\\/]+)\\s*\\{", "gm"), 
		function(str, p1, offset, s) {
			if (p1[0] === "A") {
				dict.push({from: p1, to: p1.substr(1)});
			}

			return str;
		});
}


function correctFile(file) {

	var basename = path.basename(file);
	var filename = path.basename(file, ".ts");
	var ext = path.extname(basename);
	
	if (ext !== ".ts")
		return;
	
	var content = fs.readFileSync(file, "utf8");
	
	//replace source guard #ifndef, #define
	content = content.replace(new RegExp("\\#ifndef\\s" + filename.substr(1).toUpperCase() + "\\_TS", "gm"), 
		"// " + filename + " interface"); 
	content = content.replace(new RegExp("\\#define\\s" + filename.substr(1).toUpperCase() + "\\_TS", "gm"), 
		"// [write description here...]"); 



	//replace IFACE(interface) macro
	content = content.replace(new RegExp("[\\s]+IFACE\\(([\\w\\d\\_]+)\\);?", "gm"), 
		function(str, p1, offset, s) {
			return "\n/// <reference path=\"" + p1 + ".ts\" />"
		});

	//replace #include <source.ts> macro
	content = content.replace(new RegExp("\\#include\\s+\\\"([\\w\\d\\_\\/]+\\.ts)\\\"", "gm"), 
		function(str, p1, offset, s) {
			return "/// <reference path=\"" + p1 + "\" />"
		});


	dict.forEach(function(note) {
		content = content.replace(new RegExp("\\b" + note.from + "\\b", "gm"), note.to); 
	});

	if (content.indexOf("module akra") == -1) {
		
		var lines = content.split("\n");
		if (lines[0].substr(0, 2) == "//" && lines[0].indexOf("interface")) {
			lines.shift(); // AISkin interface
			lines.shift(); // [write description here...]
		}

		content = lines.join("\n");

		var to = content.length - 1;
		var ifPos = content.indexOf("interface");
		var enPos = content.indexOf("enum");
		var from = Math.min(ifPos < 0? 0xffffffff: ifPos, enPos < 0? 0xffffffff: enPos);

		from = Math.max(0, from);
		
		while(true) {
			var s = content[from - 1];
			if (s == '\n' || from <= 0) {
				break;
			}
			from --;
		}
		var body = content.substr(from);
		body = body.split("\n").join("\n\t");
		content = content.substr(0, from) + "module akra {\n\t" + body + "\n}\n";
	}
	else {
		console.log("<module akra> already exists in " + filename);
	}

	console.log("File " + filename + " updated.");

	fs.writeFileSync(file, content);
}

if (file) {
	scanFile(file);
}
else {
	fs.readdirSync(dir).forEach(function (file) {
		scanFile(path.resolve(dir, file));
	});
}


if (file) {
	correctFile(file);
}
else {
	fs.readdirSync(dir).forEach(function (file) {
		correctFile(path.resolve(dir, file));
	});
}
