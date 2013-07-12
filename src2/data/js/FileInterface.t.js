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
            
            //var pData: ArrayBuffer; function read(): ArrayBuffer;
            var pData = read(pFile);
            var nPos = pFile.pos;

            if (nPos > 0) {
                pData = pData.slice(nPos);
            }
            
            if (pCommand.transfer === TRANSFER.FAST) {
                postMessage(pData, [pData]);
            }
            else {
                postMessage(pData)
            }

            pData = null;
            
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