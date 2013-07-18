self.requestFileSystemSync = self.webkitRequestFileSystemSync || self.requestFileSystemSync;

var pFileSystem = null;
var pFiles = {};

try {
    pFileSystem = self.requestFileSystemSync(TEMPORARY, 1024 * 1024 * 32 /*32MB*/);
}
catch (e) {
    throw e.code;
}

function read (pFile) {
    // var pData = null;

    // if (isBinary(pFile.mode)) {
        pData = pFile.reader.readAsArrayBuffer(pFile.entry.file());
        return pData;
    // }

    // pData = pFile.reader.readAsText(pFile.entry.file());
    
    // return pData;
    // return pFile.entry.file();
}

function remove (pFile) {
    if (canWrite(pFile.mode)) {
        pFile.entry.remove();
        return true;
    }
    return false;
}


function write (pFile, pData, sContentType) {
    var pBlob, pWriter;
    try {
        pWriter = pFile.entry.createWriter();

        pWriter.seek(pFile.pos);

        pBlob = new Blob([pData], {type: sContentType});

        pWriter.write(pBlob);
    }
    catch (e) {
        throw e;
    }
}

function clear (pFile) {
    var pWriter = pFile.entry.createWriter();
    pWriter.truncate(0);
}

function meta (pFile) {
    var pLFile = pFile.entry.file();
    return {
        lastModifiedDate: pLFile.lastModifiedDate,
        size:             pLFile.size
    }
}


function createDir (pRootDirEntry, pFolders) {
    if (pFolders[0] == '.' || pFolders[0] == '') {
        pFolders = pFolders.slice(1);
    }

    if (pFolders.length) {
        var dirEntry = pRootDirEntry.getDirectory(pFolders[0], {create: true});
        return createDir(dirEntry, pFolders.slice(1));
    }
    return true;
}
;

function open (pFile) {
    return;
}

function file (pCmd) {
    var sName = pCmd.name;

    if (!pFiles[sName]) {
        try {
            pFiles[sName] = {
                entry:  pFileSystem.root.getFile(pCmd.name,
                                                 {
                                                     create:    canCreate(pCmd.mode),
                                                     exclusive: false
                                                 }),
                reader: new FileReaderSync
            };
        }
        catch (e) {
            var NotFoundError = 8;
            if ((e.code == FileError.NOT_FOUND_ERR || e.code == NotFoundError) && canWrite(pCmd.mode)
                && pCmd.act != File.EXISTS) {

                try {
                    if (createDir(pFileSystem.root, directories(sName))) {
                        return file(pCmd);
                    }
                }
                catch (e) {}
            }

            return null;
        }
    }

    return pFiles[sName];
}


importScripts('FileInterface.t.js');