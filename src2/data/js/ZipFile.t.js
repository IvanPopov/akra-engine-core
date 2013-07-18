importScripts("../3d-party/zip.js/zip.js");
importScripts("../3d-party/zip.js/zip-fs.js");


var pFileSystem = null;
var pFiles = {};

try {
    pFileSystem = new zip.fs.FS();
}
catch (e) {
    throw e.code;
}

function read (pFile) {
    return pFile.entry.file();
}

function remove (pFile) {
    if (canWrite(pFile.mode)) {
        pFile.entry.remove();
        return true;
    }

    return false;
}

function write(pFile, pData, sContentType) {
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
                reader: null/*new FileReaderSync*/
            };

        }
        catch (e) {
            if (e.code == FileError.NOT_FOUND_ERR && canWrite(pCmd.mode)
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