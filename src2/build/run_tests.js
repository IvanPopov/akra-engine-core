// http://nodejs.org/api.html#_child_processes
var sys = require('sys')
var fs = require('fs');
var exec = require('child_process').exec;
var zip = require("node-native-zip");
var child;



var walk = function(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var i = 0;
        (function next() {
            var file = list[i++];
            if (!file) return done(null, results);
            file = dir + '/' + file;
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function(err, res) {
                        results = results.concat(res);
                        next();
                    });
                } else {
                    results.push(file);
                    next();
                }
            });
        })();
    });
};

String.prototype.ext = function () {
    var filename = this;
    var i = filename.lastIndexOf('.');
    return (i < 0) ? '' : filename.substr(i);
}

//console.log("search in: ", process.argv[2]);
// /process.argv[2]
var pathToTests = "../tests";

walk(pathToTests, function(err, results) {
    if (err) {
        console.log('error ...', err);
        return;
    }

    var sTestFile = "";

    results.forEach(function(e) {

        if (e.ext() === ".ts") {
            sTestFile += "#include \"" + e + "\"\n";
        }
    });
    
    if (fs.writeFile("../bin/tests.ts", sTestFile, "utf-8", function (err) {
        
        if (err) throw err;

        console.log(sTestFile); 
        console.log("file with all tests created.");

        child = exec("make.bat -D ../ -o ../bin/test.js ../bin/tests.ts", function (error, stdout, stderr) {
            sys.print('stdout: ' + stdout);
            sys.print('stderr: ' + stderr);

            if (error !== null) {
                console.log('exec error: ' + error);
            }
            else {

                var archive = new zip();
                var sProgramData = "<html>                              \n\
                  <head>                               \n\
                  <title>Hello World!</title>          \n\
                  </head>                              \n\
                  <body>                               \n\
                  <h1>Tests</h1>                \n\
                  <script>" + fs.readFileSync("../bin/test.js") + "</script>    \n\
                  <script> akra.utils.test.run(); </script>    \n\
                  </body>                              \n\
                  </html>";

                  fs.writeFileSync("../bin/index.html", sProgramData, "utf-8");

                archive.add("index.html", new Buffer(sProgramData, "utf8"));


                archive.add("package.json", new Buffer(
                  JSON.stringify({
                            "name": "tests",
                            "main": "index.html",
                            "window": {
                              "toolbar": false,
                              "width": 800,
                              "height": 600,
                              "min_width": 400,
                              "min_height": 200,
                              "max_width": 800,
                              "max_height": 600
                            }
                          }), "utf8"));


                var buffer = archive.toBuffer();

                fs.writeFile("../bin/test.nw", buffer, function () {
                    console.log("\n\n===============================\nFinished.");

                    exec("\"./nw_release_win32/nw.exe\" ../bin/test.nw", function (error, stdout, stderr) {
                      sys.print('stdout: ' + stdout);
                      sys.print('stderr: ' + stderr);

                      if (error !== null) {
                          console.log('exec error: ' + error);
                      }
                    });
                });
            }
        });

        



    }));





});

