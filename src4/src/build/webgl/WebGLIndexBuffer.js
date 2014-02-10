/// <reference path="../idl/IIndexData.ts" />
/// <reference path="../pool/resources/IndexBuffer.ts" />
/// <reference path="webgl.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (webgl) {
        var WebGLIndexBuffer = (function (_super) {
            __extends(WebGLIndexBuffer, _super);
            function WebGLIndexBuffer() {
                _super.call(this);
                this._pLockData = null;
            }
            WebGLIndexBuffer.prototype.getByteLength = function () {
                return this._iByteSize;
            };

            WebGLIndexBuffer.prototype.create = function (iByteSize, iFlags, pData) {
                if (typeof iFlags === "undefined") { iFlags = 1 /* STATIC */; }
                if (typeof pData === "undefined") { pData = null; }
                iByteSize = akra.math.max(iByteSize, akra.config.webgl.indexbufferMinSize);

                if (akra.bf.testAny(iFlags, 4 /* READABLE */)) {
                    iFlags = akra.bf.setAll(iFlags, 8 /* BACKUP_COPY */);
                }

                _super.prototype.create.call(this, iByteSize, iFlags, pData);

                var pWebGLRenderer = this.getEngine().getRenderer();
                var pWebGLContext = pWebGLRenderer.getWebGLContext();
                var i;

                akra.debug.assert(this._pWebGLBuffer == null, "webgl buffer already allocated");

                this._iByteSize = iByteSize;
                this._iFlags = iFlags;
                pWebGLContext = pWebGLRenderer.getWebGLContext();

                akra.debug.assert(pWebGLContext !== null, "cannot grab webgl context");

                //Софтварного рендеринга буфера у нас нет
                akra.debug.assert(!this.isSoftware(), "no sftware rendering");

                //Если есть локальная копия то буфер можно читать
                if (this.isBackupPresent()) {
                    this._iFlags = akra.bf.setAll(this._iFlags, 4 /* READABLE */);
                }

                akra.debug.assert(!pData || pData.byteLength <= iByteSize, "Размер переданного массива больше переданного размера буфера");

                this._pWebGLBuffer = pWebGLRenderer.createWebGLBuffer();

                if (!this._pWebGLBuffer) {
                    akra.logger.critical("cannot create WebGL index buffer");

                    this.destroy();
                    return false;
                }

                pWebGLRenderer.bindWebGLBuffer(34963 /* ELEMENT_ARRAY_BUFFER */, this._pWebGLBuffer);
                pWebGLContext.bufferData(34963 /* ELEMENT_ARRAY_BUFFER */, this._iByteSize, akra.webgl.getWebGLUsage(this._iFlags));

                if (pData) {
                    pWebGLContext.bufferSubData(34963 /* ELEMENT_ARRAY_BUFFER */, 0, (akra.isArrayBuffer(pData) ? pData : (pData).buffer));
                }

                return true;
            };

            WebGLIndexBuffer.prototype.destroy = function () {
                _super.prototype.destroy.call(this);

                var pWebGLRenderer = this.getEngine().getRenderer();

                pWebGLRenderer.deleteWebGLBuffer(this._pWebGLBuffer);

                this._pWebGLBuffer = null;
                this._iByteSize = 0;
            };

            WebGLIndexBuffer.prototype.readData = function (iOffset, iSize, ppDest) {
                akra.debug.assert(!akra.isNull(this._pWebGLBuffer), "WebGL buffer not exists");

                if (!this.isBackupPresent()) {
                    return false;
                }

                if (arguments.length === 1) {
                    this._pBackupCopy.readData(arguments[0]);
                } else {
                    this._pBackupCopy.readData(iOffset, iSize, ppDest);
                }

                return true;
            };

            WebGLIndexBuffer.prototype.writeData = function (pData, iOffset, iSize, bDiscardWholeBuffer) {
                if (typeof bDiscardWholeBuffer === "undefined") { bDiscardWholeBuffer = false; }
                akra.debug.assert(!akra.isNull(this._pWebGLBuffer), "WebGL buffer not exists");

                var pWebGLRenderer = this.getEngine().getRenderer();
                var pWebGLContext = pWebGLRenderer.getWebGLContext();

                pWebGLRenderer.bindWebGLBuffer(34963 /* ELEMENT_ARRAY_BUFFER */, this._pWebGLBuffer);

                akra.debug.assert(pData.byteLength <= iSize, "Размер переданного массива больше переданного размера");
                akra.debug.assert(this.getByteLength() >= iOffset + iSize, "Данные выйдут за предел буфера");

                var pU8Data = null;

                if (akra.isArrayBuffer(pData)) {
                    pU8Data = new Uint8Array(pData);
                } else {
                    pU8Data = new Uint8Array(pData.buffer, pData.byteOffset, pData.byteLength);
                }

                pU8Data = pU8Data.subarray(0, iSize);

                pWebGLContext.bufferSubData(34963 /* ELEMENT_ARRAY_BUFFER */, iOffset, pU8Data);

                if (this.isBackupPresent()) {
                    this._pBackupCopy.writeData(pU8Data, iOffset);
                }

                this.notifyAltered();

                return true;
            };

            WebGLIndexBuffer.prototype.resize = function (iSize) {
                var eUsage;
                var pData;
                var iMax = 0;
                var pIndexData;

                var pWebGLRenderer = this.getEngine().getRenderer();
                var pWebGLContext = pWebGLRenderer.getWebGLContext();

                if (this.isBackupPresent()) {
                    return false;
                }

                if (iSize < this.getByteLength()) {
                    for (var k = 0; k < this._pIndexDataArray.length; ++k) {
                        pIndexData = this._pIndexDataArray[k];

                        if (pIndexData.getByteOffset() + pIndexData.getByteLength() > iMax) {
                            iMax = pIndexData.getByteOffset() + pIndexData.getByteLength();
                        }
                    }

                    akra.debug.assert(iMax <= iSize, "Уменьшение невозможно. Страая разметка не укладывается в новый размер");
                }

                if (pWebGLContext.isBuffer(this._pWebGLBuffer)) {
                    pWebGLRenderer.deleteWebGLBuffer(this._pWebGLBuffer);
                }

                eUsage = akra.webgl.getWebGLUsage(this._iFlags);

                this._pWebGLBuffer = pWebGLRenderer.createWebGLBuffer();

                if (!this._pWebGLBuffer) {
                    akra.logger.critical("cannot create WebGL index buffer");

                    this.destroy();
                    return false;
                }

                pWebGLRenderer.bindWebGLBuffer(34963 /* ELEMENT_ARRAY_BUFFER */, this._pWebGLBuffer);
                pWebGLContext.bufferData(34963 /* ELEMENT_ARRAY_BUFFER */, iSize, eUsage);

                pData = new Uint8Array(this._iByteSize);

                if (this.readData(pData)) {
                    akra.debug.warn("cannot read data from buffer");
                    return false;
                }

                this.writeData(pData, 0, this._iByteSize);
                this._pBackupCopy.resize(iSize);
                this._iByteSize = iSize;

                this.notifyAltered();

                return true;
            };

            WebGLIndexBuffer.prototype.getWebGLBuffer = function () {
                return this._pWebGLBuffer;
            };

            WebGLIndexBuffer.prototype.lockImpl = function (iOffset, iSize, iLockFlags) {
                var pRetData = new Uint8Array(iSize);

                this.readData(iOffset, iSize, pRetData);

                this._pLockData = pRetData;

                return pRetData;
            };

            WebGLIndexBuffer.prototype.unlockImpl = function () {
                this.writeData(this._pLockData, this._iLockStart, this._iLockSize);
            };

            WebGLIndexBuffer.prototype.copyBackupToRealImpl = function (pRealData, pBackupData, iLockFlags) {
                pRealData.set(pBackupData);
            };
            return WebGLIndexBuffer;
        })(akra.pool.resources.IndexBuffer);
        webgl.WebGLIndexBuffer = WebGLIndexBuffer;
    })(akra.webgl || (akra.webgl = {}));
    var webgl = akra.webgl;
})(akra || (akra = {}));
//# sourceMappingURL=WebGLIndexBuffer.js.map
