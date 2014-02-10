/// <reference path="../idl/EIO.ts" />
/// <reference path="../idl/IFile.ts" />
var akra;
(function (akra) {
    /// <reference path="TFile.ts" />
    /// <reference path="StorageFile.ts" />
    /// <reference path="Packer.ts" />
    /// <reference path="UnPacker.ts" />
    /// <reference path="BinReader.ts" />
    /// <reference path="BinWriter.ts" />
    /// <reference path="../bf/bf.ts" />
    /// <reference path="../info/info.ts" />
    /// <reference path="../uri/uri.ts" />
    /// <reference path="templates/common.ts" />
    (function (io) {
        function canCreate(mode) {
            return akra.bf.testBit(mode, 1);
        }
        io.canCreate = canCreate;
        function canRead(mode) {
            return akra.bf.testBit(mode, 0);
        }
        io.canRead = canRead;
        function canWrite(mode) {
            return akra.bf.testBit(mode, 1);
        }
        io.canWrite = canWrite;

        function isAppend(mode) {
            return akra.bf.testBit(mode, 3);
        }
        io.isAppend = isAppend;
        function isTrunc(mode) {
            return akra.bf.testBit(mode, 4);
        }
        io.isTrunc = isTrunc;
        function isBinary(mode) {
            return akra.bf.testBit(mode, 5);
        }
        io.isBinary = isBinary;
        function isText(mode) {
            return akra.bf.testBit(mode, 6);
        }
        io.isText = isText;
        function isJson(mode) {
            return akra.bf.testBit(mode, 7);
        }
        io.isJson = isJson;
        function isUrl(mode) {
            return akra.bf.testBit(mode, 8);
        }
        io.isUrl = isUrl;

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
        io.filemode = filemode;

        function fopen(sUri, pMode) {
            if (typeof pMode === "undefined") { pMode = 1 /* IN */; }
            sUri = akra.uri.resolve(sUri);

            akra.logger.assert(akra.info.api.getWebWorker(), "WebWorker API must have. :(");

            if (!akra.info.api.getFileSystem() && akra.uri.parse(sUri).getScheme() === "filesystem:") {
                return new akra.io.StorageFile(sUri, pMode);
            }

            return new akra.io.TFile(sUri, pMode);
        }
        io.fopen = fopen;

        function dump(pObject, pTemplate) {
            if (typeof pTemplate === "undefined") { pTemplate = null; }
            var pPacker = new akra.io.Packer(pTemplate || akra.io.templates.common);
            pPacker.write(pObject);
            return pPacker.data();
        }
        io.dump = dump;

        function undump(pBuffer, pTemplate) {
            if (typeof pTemplate === "undefined") { pTemplate = null; }
            if (!akra.isDefAndNotNull(pBuffer)) {
                return null;
            }
            var pUnPacker = new akra.io.UnPacker(pBuffer, pTemplate);
            return pUnPacker.read();
        }
        io.undump = undump;
    })(akra.io || (akra.io = {}));
    var io = akra.io;
})(akra || (akra = {}));
//# sourceMappingURL=io.js.map
