function canCreate (iMode) {
    return ((iMode & (1 << 1)) != 0);
}
function canRead (iMode) {
    return ((iMode & (1 << 0)) != 0);
}
function canWrite (iMode) {
    return ((iMode & (1 << 1)) != 0);
}
function isBinary (iMode) {
    return ((iMode & (1 << 5)) != 0);
}
function isAppend (iMode) {
    return ((iMode & (1 << 3)) != 0);
}
function isTrunc (iMode) {
    return ((iMode & (1 << 4)) != 0);
}

function directories (sFilename) {
    var pParts = sFilename.replace('\\', '/').split('/');
    pParts.pop();

    return pParts;
}

var File = {
    OPEN:   1,
    READ:   2,
    WRITE:  3,
    CLEAR:  4,
    EXISTS: 5,
    REMOVE: 6
}

var TRANSFER = {
    NORMAL: 0,
    FAST:   1,
    SLOW:   2
};


onmessage = function (pEvent) {

    var pCommand = pEvent.data;
    var pFile;


    pFile = file(pCommand);

    if (pFile == null) {
        if (pCommand.act == File.EXISTS) {
            postMessage(false);
            return;
        }
        else {
            throw new Error('cannot get file: ' + pCommand.name +
                                ' (' + pCommand.act + ')');
        }
    }

    pFile.mode = pCommand.mode;
    pFile.pos = pCommand.pos || 0;
    pFile.name = pCommand.name;

    switch (pCommand.act) {
        case File.OPEN:
            if (isTrunc(pFile.mode) && pFile.entry.file().size) {
                clear(pFile);
            }
            open(pFile);
            postMessage(meta(pFile));
            break;
        case File.READ:
            var pData = read(pFile);

            var nPos = pFile.pos;

            if (nPos) {
                if (isBinary(pFile.mode)) {
                    pData = (new Uint8Array((new Uint8Array(pData)).subarray(nPos))).buffer;
                }
                else {
                    pData = pData.substr(nPos);
                }
            }
          
            if (isBinary(pFile.mode) && pCommand.transfer != TRANSFER.NORMAL) {
                if (pCommand.transfer == TRANSFER.FAST) {
                    postMessage(pData, [pData]);
                }
                else {
                    var pBuf = new Uint8Array(pData);
                    var pArr = new Array(pBuf.length);
                    
                    for (var i = 0; i < pBuf.length; ++i) {
                        pArr[i] = pBuf[i];
                    }

                    postMessage(pArr);
                }
            }
            else {
                if (pCommand.transfer == TRANSFER.FAST && pData.length > 50 * 1024 * 1024) { //10mb
                    // var n = pData.length;
                    pData = str2buf(pData);
                    // throw new Error(pCommand.name + " byte length: " + (pData.byteLength / (1024 * 1024)) + " mb (" + n/(1024*1024) + ")");
                    postMessage(pData, [pData]);
                }
                else {
                    postMessage(pData);
                }
            }
            break;
        case File.WRITE:
            write(pFile, pCommand.data, pCommand.contentType);
            postMessage(meta(pFile));
            break;
        case File.CLEAR:
            clear(pFile);
            postMessage();
            break;
        case File.EXISTS:
            postMessage(true);
            break;
        case File.REMOVE:
            postMessage(remove(pFile));
            break;
    }
};  