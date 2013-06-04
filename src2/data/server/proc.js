var autoloader  = require('autoloader');
var http 	    = require('http');

//autoload all modules
autoloader.autoload(__dirname + '/lib');

var RPC_TYPE_FAILURE = 0;
var RPC_TYPE_CALL = 1;
var RPC_TYPE_RESPONSE = 2;

/* common procedures */

function echo(fnCallback, msg) {
	fnCallback(null, msg);
}

function bufferTest(fnCallback) {
    fnCallback(null, new Uint8Array([1, 2, 4, 8, 16, 32, 64, 128]));
}

function procList(fnCallback) {
    var pList = Object.keys(global);
    var pRes = [];

    for (var i = 0; i < pList.length; i++) {
        if (typeof global[pList[i]] === 'function') {
            pRes.push(pList[i]);
        }
    };

    fnCallback(null, pRes);
}

global["bufferTest"] = bufferTest;
global["echo"] = echo;
global["proc_list"] = procList;

var pBuffer = null;
var pJsonResponse = {n: 0, res: null, type: 0};

function jsonResponse(n, res, type) {
    pJsonResponse.n = n;
    pJsonResponse.res = res;
    pJsonResponse.type = type;
    return pJsonResponse;
}

function jsonFailure(n, err) {
    return jsonResponse(n, err? err.message: null, RPC_TYPE_FAILURE);
}

process.on("message", function (req) {
    // var begin = Date.now();
    if (req.type === RPC_TYPE_CALL && req.proc && req.argv) {
        var call = function(err, result) {
            // console.log("procedure time is > ", Date.now() - begin);
            if (err) {
                process.send(JSON.stringify(jsonFailure(req.n, err)));
            }

            if (result && result instanceof Buffer) {
                //result must be Uint8Array

                var iResponseSize = result.length + 12;

                if (pBuffer === null || (pBuffer && pBuffer.length < iResponseSize)) {
                    pBuffer = new Buffer(iResponseSize);
                }

                pBuffer.writeUInt32LE(req.n, 0);
                pBuffer.writeUInt32LE(RPC_TYPE_RESPONSE, 4);
                pBuffer.writeUInt32LE(result.length, 8);
                result.copy(pBuffer, 12);

                //slice() returns a new buffer which references the same memory as the old.
                process.send(pBuffer.slice(0, iResponseSize)); 
            }
            else {
                process.send(JSON.stringify(jsonResponse(req.n, result, RPC_TYPE_RESPONSE)));
            }
        }

        req.argv.unshift(call);
        global[req.proc].apply(null, req.argv);
    }
    else {
        process.send(JSON.stringify(jsonFailure(req.n, null)));
    }
});