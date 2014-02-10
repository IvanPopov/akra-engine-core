/// <reference path="../config/config.ts" />
/// <reference path="../path/path.ts" />
/// <reference path="../uri/uri.ts" />
/// <reference path="../logger.ts" />
/// <reference path="io.ts" />
/// <reference path="../info/info.ts" />
/// <reference path="../conv/conv.ts" />
/// <reference path="TFile.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /**
    * FIle implementation via <Local Storage>.
    * ONLY FOR LOCAL FILES!!
    */
    (function (io) {
        var StorageFile = (function (_super) {
            __extends(StorageFile, _super);
            function StorageFile(sFilename, sMode, fnCallback) {
                if (typeof fnCallback === "undefined") { fnCallback = akra.io.TFile.defaultCallback; }
                _super.call(this, sFilename, sMode, fnCallback);
            }
            StorageFile.prototype.clear = function (fnCallback) {
                if (typeof fnCallback === "undefined") { fnCallback = akra.io.TFile.defaultCallback; }
                if (this.checkIfNotOpen(this.clear, fnCallback)) {
                    return;
                }

                localStorage.setItem(this.getPath(), "");
                this._pFileMeta.size = 0;

                fnCallback(null, this);
            };

            StorageFile.prototype.read = function (fnCallback) {
                if (typeof fnCallback === "undefined") { fnCallback = akra.io.TFile.defaultCallback; }
                if (this.checkIfNotOpen(this.read, fnCallback)) {
                    return;
                }

                //logger.assert(io.canCreate(this._iMode), "The file is not readable.");
                var pData = this.readData();
                var nPos = this._nCursorPosition;

                if (nPos > 0) {
                    if (akra.io.isBinary(this._iMode)) {
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
                if (typeof fnCallback === "undefined") { fnCallback = akra.io.TFile.defaultCallback; }
                if (this.checkIfNotOpen(this.write, fnCallback)) {
                    return;
                }

                var iMode = this._iMode;
                var nSeek;
                var pCurrentData;

                akra.logger.assert(akra.io.canWrite(iMode), "The file is not writable.");

                sContentType = sContentType || (akra.io.isBinary(iMode) ? "application/octet-stream" : "text/plain");

                pCurrentData = this.readData();

                if (!akra.isString(pCurrentData)) {
                    pCurrentData = akra.conv.abtos(pCurrentData);
                }

                nSeek = (akra.isString(pData) ? pData.length : pData.byteLength);

                if (!akra.isString(pData)) {
                    pData = akra.conv.abtos(pData);
                }

                pData = pCurrentData.substr(0, this._nCursorPosition) + pData + pCurrentData.substr(this._nCursorPosition + pData.length);

                try  {
                    localStorage.setItem(this.getPath(), pData);
                } catch (e) {
                    fnCallback(e);
                }

                this._pFileMeta.size = pData.length;
                this._nCursorPosition += nSeek;

                fnCallback(null);
            };

            StorageFile.prototype.isExists = function (fnCallback) {
                if (typeof fnCallback === "undefined") { fnCallback = akra.io.TFile.defaultCallback; }
                fnCallback.call(this, null, localStorage.getItem(this.getPath()) != null);
            };

            StorageFile.prototype.remove = function (fnCallback) {
                if (typeof fnCallback === "undefined") { fnCallback = akra.io.TFile.defaultCallback; }
                localStorage.removeItem(this.getPath());
                fnCallback.call(this, null);
            };

            StorageFile.prototype.readData = function () {
                var pFileMeta = this._pFileMeta;
                var pData = localStorage.getItem(this.getPath());
                var pDataBin;

                if (pData == null) {
                    pData = "";
                    if (akra.io.canCreate(this._iMode)) {
                        localStorage.setItem(this.getPath(), pData);
                    }
                }

                if (akra.io.isBinary(this._iMode)) {
                    pDataBin = akra.conv.stoab(pData);
                    pFileMeta.size = pDataBin.byteLength;
                    return pDataBin;
                } else {
                    pFileMeta.size = pData.length;
                    return pData;
                }
                //return null;
            };

            StorageFile.prototype.update = function (fnCallback) {
                this._pFileMeta = { size: 0, lastModifiedDate: null };
                this.readData();
                fnCallback.call(this, null);
            };
            return StorageFile;
        })(akra.io.TFile);
        io.StorageFile = StorageFile;
    })(akra.io || (akra.io = {}));
    var io = akra.io;
})(akra || (akra = {}));
//# sourceMappingURL=StorageFile.js.map
