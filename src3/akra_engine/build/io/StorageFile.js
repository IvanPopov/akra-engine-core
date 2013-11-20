/**
* FIle implementation via <Local Storage>.
* ONLY FOR LOCAL FILES!!
*/
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "logger", "io", "conv", "io/TFile"], function(require, exports, __logger__, __io__, __conv__, __TFile__) {
    
    
    
    var logger = __logger__;
    var io = __io__;
    
    var conv = __conv__;

    var TFile = __TFile__;

    var StorageFile = (function (_super) {
        __extends(StorageFile, _super);
        function StorageFile(sFilename, sMode, fnCallback) {
            if (typeof fnCallback === "undefined") { fnCallback = TFile.defaultCallback; }
            _super.call(this, sFilename, sMode, fnCallback);
        }
        StorageFile.prototype.clear = function (fnCallback) {
            if (typeof fnCallback === "undefined") { fnCallback = TFile.defaultCallback; }
            if (this.checkIfNotOpen(this.clear, fnCallback)) {
                return;
            }

            localStorage.setItem(this.path, "");
            this._pFileMeta.size = 0;

            fnCallback(null, this);
        };

        StorageFile.prototype.read = function (fnCallback) {
            if (typeof fnCallback === "undefined") { fnCallback = TFile.defaultCallback; }
            if (this.checkIfNotOpen(this.read, fnCallback)) {
                return;
            }

            logger.assert(io.canCreate(this._iMode), "The file is not readable.");

            var pData = this.readData();
            var nPos = this._nCursorPosition;

            if (nPos > 0) {
                if (io.isBinary(this._iMode)) {
                    pData = (new Uint8Array((new Uint8Array(pData)).subarray(nPos))).buffer;
                } else {
                    pData = pData.substr(nPos);
                }
            }

            this.atEnd();

            if (fnCallback) {
                fnCallback.call(this, null, pData);
            }
        };

        StorageFile.prototype.write = function (pData, fnCallback, sContentType) {
            if (typeof fnCallback === "undefined") { fnCallback = TFile.defaultCallback; }
            if (this.checkIfNotOpen(this.write, fnCallback)) {
                return;
            }

            var iMode = this._iMode;
            var nSeek;
            var pCurrentData;

            logger.assert(io.canWrite(iMode), "The file is not writable.");

            sContentType = sContentType || (io.isBinary(iMode) ? "application/octet-stream" : "text/plain");

            pCurrentData = this.readData();

            if (!isString(pCurrentData)) {
                pCurrentData = conv.abtos(pCurrentData);
            }

            nSeek = (isString(pData) ? pData.length : pData.byteLength);

            if (!isString(pData)) {
                pData = conv.abtos(pData);
            }

            pData = (pCurrentData).substr(0, this._nCursorPosition) + (pData) + (pCurrentData).substr(this._nCursorPosition + (pData).length);

            try  {
                localStorage.setItem(this.path, pData);
            } catch (e) {
                fnCallback(e);
            }

            this._pFileMeta.size = pData.length;
            this._nCursorPosition += nSeek;

            fnCallback(null);
        };

        StorageFile.prototype.isExists = function (fnCallback) {
            if (typeof fnCallback === "undefined") { fnCallback = TFile.defaultCallback; }
            fnCallback.call(this, null, localStorage.getItem(this.path) == null);
        };

        StorageFile.prototype.remove = function (fnCallback) {
            if (typeof fnCallback === "undefined") { fnCallback = TFile.defaultCallback; }
            localStorage.removeItem(this.path);
            fnCallback.call(this, null);
        };

        StorageFile.prototype.readData = function () {
            var pFileMeta = this._pFileMeta;
            var pData = localStorage.getItem(this.path);
            var pDataBin;

            if (pData == null) {
                pData = "";
                if (io.canCreate(this._iMode)) {
                    localStorage.setItem(this.path, pData);
                }
            }

            if (io.isBinary(this._iMode)) {
                pDataBin = conv.stoab(pData);
                pFileMeta.size = pDataBin.byteLength;
                return pDataBin;
            } else {
                pFileMeta.size = pData.length;
                return pData;
            }
            //return null;
        };

        StorageFile.prototype.update = function (fnCallback) {
            this._pFileMeta = null;
            this.readData();
            fnCallback.call(this, null);
        };
        return StorageFile;
    })(TFile);

    
    return StorageFile;
});
//# sourceMappingURL=StorageFile.js.map
