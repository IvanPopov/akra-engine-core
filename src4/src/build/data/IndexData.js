/// <reference path="../idl/IBufferData.ts" />
/// <reference path="../idl/IIndexBuffer.ts" />
/// <reference path="../idl/EPrimitiveTypes.ts" />
var akra;
(function (akra) {
    /// <reference path="../debug.ts" />
    /// <reference path="../types.ts" />
    (function (data) {
        var IndexData = (function () {
            function IndexData(pIndexBuffer, id, iOffset, iCount, ePrimitiveType, eElementsType) {
                if (typeof ePrimitiveType === "undefined") { ePrimitiveType = 4 /* TRIANGLELIST */; }
                if (typeof eElementsType === "undefined") { eElementsType = 5123 /* UNSIGNED_SHORT */; }
                akra.debug.assert(eElementsType == 5123 /* UNSIGNED_SHORT */ || eElementsType == 5121 /* UNSIGNED_BYTE */ || eElementsType == 5125 /* UNSIGNED_INT */, "supported only short, byte, uint data types.");

                this._pIndexBuffer = pIndexBuffer;
                this._iOffset = iOffset;
                this._iLength = iCount;
                this._iId = id;

                this._ePrimitiveType = ePrimitiveType;
                this._eElementsType = eElementsType;

                akra.debug.assert(pIndexBuffer.getByteLength() >= this.getByteLength() + this.getByteOffset(), "out of buffer limits.");
            }
            IndexData.prototype.getID = function () {
                return this._iId;
            };

            IndexData.prototype.getType = function () {
                return this._eElementsType;
            };

            IndexData.prototype.getLength = function () {
                return this._iLength;
            };

            IndexData.prototype.getBytesPerIndex = function () {
                return akra.sizeof(this._eElementsType);
            };

            IndexData.prototype.getByteOffset = function () {
                return this._iOffset;
            };

            IndexData.prototype.getByteLength = function () {
                return this._iLength * this.getBytesPerIndex();
            };

            IndexData.prototype.getBuffer = function () {
                return this._pIndexBuffer;
            };

            IndexData.prototype.getData = function (iOffset, iSize) {
                akra.debug.assert(iOffset + iSize <= this.getByteLength(), "out of buffer limits");
                var pBuffer = new Uint8Array(iSize);

                if (this._pIndexBuffer.readData(this.getByteOffset() + iOffset, iSize, pBuffer)) {
                    return pBuffer.buffer;
                }

                akra.debug.assert(false, "cannot read data from index buffer");

                return null;
            };

            IndexData.prototype.getTypedData = function (iStart, iCount) {
                akra.debug.assert((iStart + iCount) <= this._iLength, "out of buffer limits");

                var iTypeSize = akra.sizeof(this._eElementsType);

                var iOffset = iStart * iTypeSize;
                var iSize = iCount * iTypeSize;

                var pBuffer = new Uint8Array(iSize);

                if (this._pIndexBuffer.readData(this.getByteOffset() + iOffset, iSize, pBuffer)) {
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
                if (typeof iCount === "undefined") { iCount = pData.byteLength / this.getBytesPerIndex(); }
                akra.debug.assert((iOffset + iCount) * this.getBytesPerIndex() <= this.getByteLength(), "out of buffer limits.");

                return this._pIndexBuffer.writeData(pData, this.getByteOffset() + iOffset * this.getBytesPerIndex(), iCount * this.getBytesPerIndex());
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
                if (typeof iIndexCount === "undefined") { iIndexCount = this.getLength(); }
                return IndexData.getPrimitiveCount(this._ePrimitiveType, iIndexCount);
            };

            IndexData.prototype.getBufferHandle = function () {
                return this._pIndexBuffer.getResourceHandle();
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

                akra.debug.log("unhandled case detected..");

                return 0;
            };
            return IndexData;
        })();
        data.IndexData = IndexData;
    })(akra.data || (akra.data = {}));
    var data = akra.data;
})(akra || (akra = {}));
//# sourceMappingURL=IndexData.js.map
