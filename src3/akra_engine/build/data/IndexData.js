/// <reference path="../idl/AIBufferData.ts" />
/// <reference path="../idl/AIIndexBuffer.ts" />
/// <reference path="../idl/AEPrimitiveTypes.ts" />
define(["require", "exports", "logger", "dataType"], function(require, exports, __logger__, __type__) {
    var logger = __logger__;
    var type = __type__;

    var IndexData = (function () {
        function IndexData(pIndexBuffer, id, iOffset, iCount, ePrimitiveType, eElementsType) {
            if (typeof ePrimitiveType === "undefined") { ePrimitiveType = 4 /* TRIANGLELIST */; }
            if (typeof eElementsType === "undefined") { eElementsType = 5123 /* UNSIGNED_SHORT */; }
            logger.presume(eElementsType == 5123 /* UNSIGNED_SHORT */ || eElementsType == 5121 /* UNSIGNED_BYTE */ || eElementsType == 5125 /* UNSIGNED_INT */, "supported only short, byte, uint data types.");

            this._pIndexBuffer = pIndexBuffer;
            this._iOffset = iOffset;
            this._iLength = iCount;
            this._iId = id;

            this._ePrimitiveType = ePrimitiveType;
            this._eElementsType = eElementsType;

            logger.presume(pIndexBuffer.byteLength >= this.byteLength + this.byteOffset, "out of buffer limits.");
        }
        Object.defineProperty(IndexData.prototype, "id", {
            get: function () {
                return this._iId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(IndexData.prototype, "type", {
            get: function () {
                return this._eElementsType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(IndexData.prototype, "length", {
            get: function () {
                return this._iLength;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(IndexData.prototype, "bytesPerIndex", {
            get: function () {
                return type.size(this._eElementsType);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(IndexData.prototype, "byteOffset", {
            get: function () {
                return this._iOffset;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(IndexData.prototype, "byteLength", {
            get: function () {
                return this._iLength * this.bytesPerIndex;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(IndexData.prototype, "buffer", {
            get: function () {
                return this._pIndexBuffer;
            },
            enumerable: true,
            configurable: true
        });

        IndexData.prototype.getData = function (iOffset, iSize) {
            logger.presume(iOffset + iSize <= this.byteLength, "out of buffer limits");
            var pBuffer = new Uint8Array(iSize);

            if (this._pIndexBuffer.readData(this.byteOffset + iOffset, iSize, pBuffer)) {
                return pBuffer.buffer;
            }

            logger.presume(false, "cannot read data from index buffer");

            return null;
        };

        IndexData.prototype.getTypedData = function (iStart, iCount) {
            logger.presume((iStart + iCount) <= this._iLength, "out of buffer limits");

            var iTypeSize = type.size(this._eElementsType);

            var iOffset = iStart * iTypeSize;
            var iSize = iCount * iTypeSize;

            var pBuffer = new Uint8Array(iSize);

            if (this._pIndexBuffer.readData(this.byteOffset + iOffset, iSize, pBuffer)) {
                switch (this._eElementsType) {
                    case 5121 /* UNSIGNED_BYTE */:
                        return pBuffer;
                    case 5123 /* UNSIGNED_SHORT */:
                        return new Uint16Array(pBuffer.buffer);
                    case 5125 /* UNSIGNED_INT */:
                        return new Uint32Array(pBuffer.buffer);
                    default:
                        return null;
                }
            }

            return null;
        };

        IndexData.prototype.setData = function (pData, iOffset, iCount) {
            if (typeof iOffset === "undefined") { iOffset = 0; }
            if (typeof iCount === "undefined") { iCount = pData.byteLength / this.bytesPerIndex; }
            logger.presume((iOffset + iCount) * this.bytesPerIndex <= this.byteLength, "out of buffer limits.");

            return this._pIndexBuffer.writeData(pData, this.byteOffset + iOffset * this.bytesPerIndex, iCount * this.bytesPerIndex);
        };

        IndexData.prototype.destroy = function () {
            this._pIndexBuffer = null;
            this._iOffset = undefined;
            this._iLength = undefined;
            this._eElementsType = undefined;
            this._eElementsType = undefined;
        };

        IndexData.prototype.getPrimitiveType = function () {
            return this._ePrimitiveType;
        };

        IndexData.prototype.getPrimitiveCount = function (iIndexCount) {
            if (typeof iIndexCount === "undefined") { iIndexCount = this.length; }
            return IndexData.getPrimitiveCount(this._ePrimitiveType, iIndexCount);
        };

        IndexData.prototype.getBufferHandle = function () {
            return this._pIndexBuffer.resourceHandle;
        };

        IndexData.getPrimitiveCount = function (eType, nVertices) {
            switch (eType) {
                case 0 /* POINTLIST */:
                    return nVertices;
                case 1 /* LINELIST */:
                    return nVertices / 2;
                case 3 /* LINESTRIP */:
                    return nVertices - 1;
                case 2 /* LINELOOP */:
                    return nVertices;
                case 4 /* TRIANGLELIST */:
                    return nVertices / 3;
                case 6 /* TRIANGLEFAN */:
                case 5 /* TRIANGLESTRIP */:
                    return nVertices - 2;
            }

            logger.presume(false, "unhandled case detected..");

            return 0;
        };
        return IndexData;
    })();

    
    return IndexData;
});
//# sourceMappingURL=IndexData.js.map
