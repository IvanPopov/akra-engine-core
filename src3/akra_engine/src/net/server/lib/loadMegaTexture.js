var fs = require('fs');
var path = require('path');

module.exports = function (callback, name, ext, width, height) {
    var src = path.normalize(__dirname + "/../../data/" + name + "/" + width + "x" + height + "/diffuse." + ext);

    // fs.open(src, 'r', function(err, fd){
    // 	if(err){
    // 		console.log(err.message);
    // 		callback(err, null);
    // 		return;
    // 	}

    // 	fs.fstat(fd, function(err, stats){
    // 		// if(err){
	   //  	// 	console.log(err.message);
	   //  	// 	callback(err, null);
	   //  	// 	return;
	   //  	// }
	    	
	   //  	// console.log(stats);

	   //  	var pBuf = new Buffer(stats.size);
	   //  	fs.read(fd, pBuf, 0, stats.size, 0, function(err, bytesRead, buffer){
	   //  		console.log(bytesRead);
	   //  		console.log(pBuf[0], pBuf[1],pBuf[2], pBuf[3]);
	   //  		console.log(pBuf[bytesRead-4], pBuf[bytesRead-3],pBuf[bytesRead-2], pBuf[bytesRead-1]);
	   //  		callback(null, buffer);
	   //  	});

    // 	});

    // });

    fs.readFile(src, callback);
}