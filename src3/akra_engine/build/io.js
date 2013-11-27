/// <reference path="idl/AEIO.ts" />
/// <reference path="idl/AIFile.ts" />
define(["require", "exports", "io/TFile", "io/LocalFile", "io/StorageFile", "io/Packer", "io/UnPacker", "bitflags", "info", "uri", "io/templates/common"], function(require, exports, __TFile__, __LocalFile__, __StorageFile__, __Packer__, __UnPacker__, __bf__, __info__, __uri__, __pCommonTemplate__) {
    var TFile = __TFile__;
    var LocalFile = __LocalFile__;
    var StorageFile = __StorageFile__;

    var Packer = __Packer__;
    var UnPacker = __UnPacker__;

    
    

    var bf = __bf__;
    var info = __info__;
    var uri = __uri__;

    var pCommonTemplate = __pCommonTemplate__;

    function canCreate(mode) {
        return bf.testBit(mode, 1);
    }
    exports.canCreate = canCreate;
    function canRead(mode) {
        return bf.testBit(mode, 0);
    }
    exports.canRead = canRead;
    function canWrite(mode) {
        return bf.testBit(mode, 1);
    }
    exports.canWrite = canWrite;

    function isAppend(mode) {
        return bf.testBit(mode, 3);
    }
    exports.isAppend = isAppend;
    function isTrunc(mode) {
        return bf.testBit(mode, 4);
    }
    exports.isTrunc = isTrunc;
    function isBinary(mode) {
        return bf.testBit(mode, 5);
    }
    exports.isBinary = isBinary;
    function isText(mode) {
        return bf.testBit(mode, 6);
    }
    exports.isText = isText;
    function isJson(mode) {
        return bf.testBit(mode, 7);
    }
    exports.isJson = isJson;
    function isUrl(mode) {
        return bf.testBit(mode, 8);
    }
    exports.isUrl = isUrl;

    /*local and remote via thread*/
    /*local file via local files system(async)*/
    /*local file via local files system(async)*/
    function filemode(sMode) {
        switch (sMode.toLowerCase()) {
            case "a+u":
                return 1 /* IN */ | 2 /* OUT */ | 8 /* APP */ | 256 /* URL */;
            case "w+u":
                return 1 /* IN */ | 2 /* OUT */ | 16 /* TRUNC */ | 256 /* URL */;
            case "r+u":
                return 1 /* IN */ | 2 /* OUT */ | 256 /* URL */;

            case "au":
                return 8 /* APP */ | 256 /* URL */;
            case "wu":
                return 2 /* OUT */ | 256 /* URL */;
            case "ru":
                return 1 /* IN */ | 256 /* URL */;

            case "a+j":
                return 1 /* IN */ | 2 /* OUT */ | 8 /* APP */ | 128 /* JSON */;
            case "w+j":
                return 1 /* IN */ | 2 /* OUT */ | 16 /* TRUNC */ | 128 /* JSON */;
            case "r+j":
                return 1 /* IN */ | 2 /* OUT */ | 128 /* JSON */;

            case "aj":
                return 8 /* APP */ | 128 /* JSON */;
            case "wj":
                return 2 /* OUT */ | 128 /* JSON */;
            case "rj":
                return 1 /* IN */ | 128 /* JSON */;

            case "a+t":
                return 1 /* IN */ | 2 /* OUT */ | 8 /* APP */ | 64 /* TEXT */;
            case "w+t":
                return 1 /* IN */ | 2 /* OUT */ | 16 /* TRUNC */ | 64 /* TEXT */;
            case "r+t":
                return 1 /* IN */ | 2 /* OUT */ | 64 /* TEXT */;

            case "at":
                return 8 /* APP */ | 64 /* TEXT */;
            case "wt":
                return 2 /* OUT */ | 64 /* TEXT */;
            case "rt":
                return 1 /* IN */ | 64 /* TEXT */;

            case "a+b":
                return 1 /* IN */ | 2 /* OUT */ | 8 /* APP */ | 32 /* BIN */;
            case "w+b":
                return 1 /* IN */ | 2 /* OUT */ | 16 /* TRUNC */ | 32 /* BIN */;
            case "r+b":
                return 1 /* IN */ | 2 /* OUT */ | 32 /* BIN */;

            case "ab":
                return 8 /* APP */ | 32 /* BIN */;
            case "wb":
                return 2 /* OUT */ | 32 /* BIN */;
            case "rb":
                return 1 /* IN */ | 32 /* BIN */;

            case "a+":
                return 1 /* IN */ | 2 /* OUT */ | 8 /* APP */;
            case "w+":
                return 1 /* IN */ | 2 /* OUT */ | 16 /* TRUNC */;
            case "r+":
                return 1 /* IN */ | 2 /* OUT */;

            case "a":
                return 8 /* APP */ | 2 /* OUT */;
            case "w":
                return 2 /* OUT */;
            case "r":
            default:
                return 1 /* IN */;
        }
    }
    exports.filemode = filemode;

    function fopen(sUri, pMode) {
        if (typeof pMode === "undefined") { pMode = 1 /* IN */; }
        sUri = uri.resolve(sUri);

        if (info.api.webWorker) {
            return new TFile(sUri, pMode);
        } else if (info.api.fileSystem) {
            return new LocalFile(sUri, pMode);
        } else {
            return new StorageFile(sUri, pMode);
        }
    }
    exports.fopen = fopen;

    function dump(pObject, pTemplate) {
        if (typeof pTemplate === "undefined") { pTemplate = null; }
        var pPacker = new Packer(pTemplate || pCommonTemplate);
        pPacker.write(pObject);
        return pPacker.data();
    }
    exports.dump = dump;

    function undump(pBuffer, pTemplate) {
        if (typeof pTemplate === "undefined") { pTemplate = null; }
        if (!isDefAndNotNull(pBuffer)) {
            return null;
        }
        var pUnPacker = new UnPacker(pBuffer, pTemplate);
        return pUnPacker.read();
    }
    exports.undump = undump;
});
//# sourceMappingURL=io.js.map
