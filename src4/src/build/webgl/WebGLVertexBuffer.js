/// <reference path="../idl/IVertexData.ts" />
/// <reference path="../idl/IVertexDeclaration.ts" />
/// <reference path="../idl/IVertexBuffer.ts" />
/// <reference path="../pool/resources/VertexBuffer.ts" />
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
        var WebGLVertexBuffer = (function (_super) {
            __extends(WebGLVertexBuffer, _super);
            function WebGLVertexBuffer() {
                _super.call(this);
                this._pLockData = null;
                this._sCS = null;
            }
            WebGLVertexBuffer.prototype.getType = function () {
                return 1 /* VBO */;
            };

            WebGLVertexBuffer.prototype.getByteLength = function () {
                return this._iByteSize;
            };

            WebGLVertexBuffer.prototype.create = function (iByteSize, iFlags, pData) {
                if (typeof iFlags === "undefined") { iFlags = 1 /* STATIC */; }
                if (typeof pData === "undefined") { pData = null; }
                iByteSize = akra.math.max(iByteSize, akra.config.webgl.vertexbufferMinSize);

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
                    akra.logger.critical("Не удалось создать буфер");

                    this.destroy();
                    return false;
                }

                pWebGLRenderer.bindWebGLBuffer(34962 /* ARRAY_BUFFER */, this._pWebGLBuffer);
                pWebGLContext.bufferData(34962 /* ARRAY_BUFFER */, this._iByteSize, akra.webgl.getWebGLUsage(this._iFlags));

                if (akra.isDefAndNotNull(pData)) {
                    /*pWebGLContext.bufferSubData(
                    gl.ARRAY_BUFFER, 0, isArrayBuffer(pData)? <ArrayBuffer>pData: (<Uint8Array>pData).buffer);*/
                    pWebGLContext.bufferSubData(34962 /* ARRAY_BUFFER */, 0, pData.buffer);
                }

                return true;
            };

            WebGLVertexBuffer.prototype.destroy = function () {
                _super.prototype.destroy.call(this);

                var pWebGLRenderer = this.getEngine().getRenderer();

                pWebGLRenderer.deleteWebGLBuffer(this._pWebGLBuffer);

                this._pWebGLBuffer = null;
                this._iByteSize = 0;
            };

            WebGLVertexBuffer.prototype.readData = function (iOffset, iSize, ppDest) {
                akra.debug.assert(!akra.isNull(this._pWebGLBuffer), "Буффер еще не создан");

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

            WebGLVertexBuffer.prototype.writeData = function (pData, iOffset, iSize, bDiscardWholeBuffer) {
                if (typeof bDiscardWholeBuffer === "undefined") { bDiscardWholeBuffer = false; }
                akra.debug.assert(!akra.isNull(this._pWebGLBuffer), "WebGL buffer not exists");

                var pWebGLRenderer = this.getEngine().getRenderer();
                var pWebGLContext = pWebGLRenderer.getWebGLContext();

                pWebGLRenderer.bindWebGLBuffer(34962 /* ARRAY_BUFFER */, this._pWebGLBuffer);

                akra.debug.assert(pData.byteLength <= iSize, "Размер переданного массива больше переданного размера");
                akra.debug.assert(this.getByteLength() >= iOffset + iSize, "Данные выйдут за предел буфера");

                var pU8Data = null;

                if (akra.isArrayBuffer(pData)) {
                    pU8Data = new Uint8Array(pData);
                } else {
                    pU8Data = new Uint8Array(pData.buffer, pData.byteOffset, pData.byteLength);
                }

                pU8Data = pU8Data.subarray(0, iSize);

                pWebGLContext.bufferSubData(34962 /* ARRAY_BUFFER */, iOffset, pU8Data);

                if (this.isBackupPresent()) {
                    this._pBackupCopy.writeData(pU8Data, iOffset);
                }

                this.notifyAltered();

                return true;
            };

            WebGLVertexBuffer.prototype.resize = function (iSize) {
                var eUsage;
                var pData;
                var iMax = 0;
                var pVertexData;

                var pWebGLRenderer = this.getEngine().getRenderer();
                var pWebGLContext = pWebGLRenderer.getWebGLContext();

                if (!this.isBackupPresent()) {
                    akra.debug.log("Not resized, because backup not present!");
                    return false;
                }

                akra.debug.log("WebGLVertexBuffer resized from " + this.getByteLength() + " to " + iSize + "(" + this.guid + ")");

                // debug.log(__CALLSTACK__);
                if (iSize < this.getByteLength()) {
                    for (var k = 0; k < this._pVertexDataArray.length; ++k) {
                        pVertexData = this._pVertexDataArray[k];

                        if (pVertexData.getByteOffset() + pVertexData.getByteLength() > iMax) {
                            iMax = pVertexData.getByteOffset() + pVertexData.getByteLength();
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
                    akra.logger.critical("Не удалось создать буфер");

                    this.destroy();
                    return false;
                }

                pWebGLRenderer.bindWebGLBuffer(34962 /* ARRAY_BUFFER */, this._pWebGLBuffer);
                pWebGLContext.bufferData(34962 /* ARRAY_BUFFER */, iSize, eUsage);

                pData = new Uint8Array(this._iByteSize);

                if (!this.readData(pData)) {
                    akra.debug.warn("cannot read data from buffer");
                    return false;
                }

                this.writeData(pData, 0, this._iByteSize);
                this._pBackupCopy.resize(iSize);
                this._iByteSize = iSize;

                this.notifyAltered();

                return true;
            };

            WebGLVertexBuffer.prototype.getWebGLBuffer = function () {
                return this._pWebGLBuffer;
            };

            WebGLVertexBuffer.prototype.lockImpl = function (iOffset, iSize, iLockFlags) {
                var pRetData = new Uint8Array(iSize);

                this.readData(iOffset, iSize, pRetData);

                this._pLockData = pRetData;

                return pRetData;
            };

            WebGLVertexBuffer.prototype.unlockImpl = function () {
                this.writeData(this._pLockData, this._iLockStart, this._iLockSize);
            };

            WebGLVertexBuffer.prototype.copyBackupToRealImpl = function (pRealData, pBackupData, iLockFlags) {
                pRealData.set(pBackupData);
            };
            return WebGLVertexBuffer;
        })(akra.pool.resources.VertexBuffer);
        webgl.WebGLVertexBuffer = WebGLVertexBuffer;
    })(akra.webgl || (akra.webgl = {}));
    var webgl = akra.webgl;
})(akra || (akra = {}));
//# sourceMappingURL=WebGLVertexBuffer.js.map
