/// <reference path="../../bf/bf.ts" />
/// <reference path="../../common.ts" />
/// <reference path="../../mem.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (pool) {
        /// <reference path="HardwareBuffer.ts" />
        (function (resources) {
            var MemoryBuffer = (function (_super) {
                __extends(MemoryBuffer, _super);
                function MemoryBuffer() {
                    _super.apply(this, arguments);
                }
                MemoryBuffer.prototype.getByteLength = function () {
                    return this._pData.byteLength;
                };

                MemoryBuffer.prototype.getLength = function () {
                    return this.getByteLength();
                };

                MemoryBuffer.prototype.create = function (iByteSize, iFlags) {
                    if (typeof iFlags === "undefined") { iFlags = 2 /* DYNAMIC */; }
                    iFlags = akra.bf.clearAll(iFlags, 8 /* BACKUP_COPY */ | 64 /* DISCARDABLE */ | 32 /* ALIGNMENT */);

                    var isCreated = _super.prototype.create.call(this, 0, iFlags | 16 /* SOFTWARE */);

                    this._pData = new Uint8Array(iByteSize);

                    return isCreated;
                };

                MemoryBuffer.prototype.destroy = function () {
                    _super.prototype.destroy.call(this);
                    this._pData = null;
                };

                MemoryBuffer.prototype.resize = function (iSize) {
                    var pData = new Uint8Array(iSize);

                    if (iSize >= this.getByteLength()) {
                        pData.set(this._pData);
                    } else {
                        pData.set(this._pData.subarray(0, iSize));
                    }

                    this._pData = pData;
                    this.notifyAltered();

                    return true;
                };

                MemoryBuffer.prototype.lockImpl = function (iOffset, iLength, iLockFlags) {
                    return this._pData.subarray(iOffset, iOffset + iLength);
                };

                MemoryBuffer.prototype.readData = function () {
                    var ppDest;
                    var iOffset;
                    var iSize;

                    if (arguments.length < 3) {
                        ppDest = arguments[0];
                        iOffset = 0;
                        iSize = ppDest.byteLength;
                    } else {
                        iOffset = arguments[0];
                        iSize = arguments[1];
                        ppDest = arguments[2];
                    }

                    akra.logger.assert((iOffset + iSize) <= this.getByteLength());
                    akra.copy(ppDest.buffer, ppDest.byteOffset, this._pData.buffer, iOffset, iSize);

                    return true;
                };

                // writeData(pData: Uint8Array, iOffset?: uint, iSize?: uint, bDiscardWholeBuffer: boolean = false): boolean;
                MemoryBuffer.prototype.writeData = function (pData, iOffset, iSize, bDiscardWholeBuffer) {
                    if (typeof iOffset === "undefined") { iOffset = 0; }
                    if (typeof iSize === "undefined") { iSize = pData.byteLength; }
                    if (typeof bDiscardWholeBuffer === "undefined") { bDiscardWholeBuffer = false; }
                    // writeData(pData: any, iOffset?: uint, iSize?: uint, bDiscardWholeBuffer: boolean = false): boolean {
                    akra.logger.assert((iOffset + iSize) <= this.getByteLength());

                    if (akra.isDefAndNotNull(pData)) {
                        akra.copy(this._pData.buffer, iOffset, pData.buffer, pData.byteOffset, iSize);
                    }

                    this.notifyAltered();

                    return true;
                };
                return MemoryBuffer;
            })(akra.pool.resources.HardwareBuffer);
            resources.MemoryBuffer = MemoryBuffer;
        })(pool.resources || (pool.resources = {}));
        var resources = pool.resources;
    })(akra.pool || (akra.pool = {}));
    var pool = akra.pool;
})(akra || (akra = {}));
//# sourceMappingURL=MemoryBuffer.js.map
