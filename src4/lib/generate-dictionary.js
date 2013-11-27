//usage: node generate-dictionary.js <path/to/folder/with/interfaces> <dictionary-file>



var fs = require("fs");
var util = require("util");
var path = require("path");

var argv = process.argv.slice(2);
var dir = argv[0];
var dictFile = argv[1];

var dict = [
	{from: "bool", to: "boolean"},
	// {from: "readonly", to: "/** readonly */"},
	// {from: "writeonly", to: "/** writeonly */"},
	// {from: "inline", to: "/** inline */"},
	{from: "inline", to: ""},
];


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
			if (p1[0] === "A" && p1[1].toUpperCase() === p1[1]) {
				dict.push({from: p1, to: p1.substr(1)});
			}

			return str;
		});

	//replace enum <some> structure
	content = content.replace(new RegExp("enum\\s+([\\w\\d\\_\\/]+)\\s*\\{", "gm"), 
		function(str, p1, offset, s) {
			if (p1[0] === "A" && p1[1].toUpperCase() === p1[1]) {
				dict.push({from: p1, to: p1.substr(1)});
			}


			return str;
		});

}



fs.readdirSync(dir).forEach(function (file) {
	scanFile(path.resolve(dir, file));
});


fs.writeFileSync(dictFile, JSON.stringify(dict, null, '\t'));