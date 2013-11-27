//usage: node corrector.js <path/to/interface>

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


var dict = JSON.parse(fs.readFileSync("dict.json", "utf8"));

function correctFile(file) {

	var basename = path.basename(file);
	var filename = path.basename(file, ".ts");
	var ext = path.extname(basename);
	
	if (ext !== ".ts")
		return;
	
	var content = fs.readFileSync(file, "utf8");
	// console.log(dict);
	dict.forEach(function(note) {
		content = content.replace(new RegExp("\\b" + note.from + "\\b", "gm"), note.to); 
	});

	console.log("File " + filename + " updated.");

	fs.writeFileSync(file, content);
}


if (file) {
	correctFile(file);
}
else {
	fs.readdirSync(dir).forEach(function (file) {
		correctFile(path.resolve(dir, file));
	});
}



