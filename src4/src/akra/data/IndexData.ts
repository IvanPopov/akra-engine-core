/// <reference path="../idl/AIBufferData.ts" />
/// <reference path="../idl/AIIndexBuffer.ts" />
/// <reference path="../idl/AEPrimitiveTypes.ts" />

import logger = require("logger");
import type = require("dataType");

class IndexData implements AIIndexData {
    private _pIndexBuffer: AIIndexBuffer;
    private _iOffset: uint;
    private _iLength: uint;
    private _ePrimitiveType: AEPrimitiveTypes;
    private _eElementsType: AEDataTypes;
    private _iId: int;

    get id(): uint { return this._iId; }
    get type(): uint { return this._eElementsType; }
    get length(): uint { return this._iLength; }
    get bytesPerIndex(): uint { return type.size(this._eElementsType); }
    get byteOffset(): uint { return this._iOffset; }
    get byteLength(): uint { return this._iLength * this.bytesPerIndex; }
    get buffer(): AIIndexBuffer { return this._pIndexBuffer; }

    constructor(
        pIndexBuffer: AIIndexBuffer,
        id: uint,
        iOffset: int,
        iCount: int,
        ePrimitiveType: AEPrimitiveTypes = AEPrimitiveTypes.TRIANGLELIST,
        eElementsType: AEDataTypes = AEDataTypes.UNSIGNED_SHORT) {

        logger.presume(
            eElementsType == AEDataTypes.UNSIGNED_SHORT ||
            eElementsType == AEDataTypes.UNSIGNED_BYTE ||
            eElementsType == AEDataTypes.UNSIGNED_INT, "supported only short, byte, uint data types.");

        this._pIndexBuffer = pIndexBuffer;
        this._iOffset = iOffset;
        this._iLength = iCount;
        this._iId = id;

        this._ePrimitiveType = ePrimitiveType;
        this._eElementsType = eElementsType;

        logger.presume(pIndexBuffer.byteLength >= this.byteLength + this.byteOffset, "out of buffer limits.");
    }


    getData(iOffset: int, iSize: int): ArrayBuffer {
        logger.presume(iOffset + iSize <= this.byteLength, "out of buffer limits");
        var pBuffer: Uint8Array = new Uint8Array(iSize);

        if (this._pIndexBuffer.readData(this.byteOffset + iOffset, iSize, pBuffer)) {
            return pBuffer.buffer;
        }

        logger.presume(false, "cannot read data from index buffer");

        return null;
    }

    getTypedData(iStart: int, iCount: int): ArrayBufferView {
        logger.presume((iStart + iCount) <= this._iLength, "out of buffer limits");

        var iTypeSize: uint = type.size(this._eElementsType);

        var iOffset: uint = iStart * iTypeSize;
        var iSize: uint = iCount * iTypeSize;

        var pBuffer: Uint8Array = new Uint8Array(iSize);

        if (this._pIndexBuffer.readData(this.byteOffset + iOffset, iSize, pBuffer)) {
            switch (this._eElementsType) {
                case AEDataTypes.UNSIGNED_BYTE:
                    return pBuffer;
                case AEDataTypes.UNSIGNED_SHORT:
                    return new Uint16Array(pBuffer.buffer);
                case AEDataTypes.UNSIGNED_INT:
                    return new Uint32Array(pBuffer.buffer);
                default:
                    return null;
            }
        }

        return null;
    }

    setData(pData: ArrayBufferView, iOffset: int = 0, iCount: uint = pData.byteLength / this.bytesPerIndex): boolean {
        logger.presume((iOffset + iCount) * this.bytesPerIndex <= this.byteLength, "out of buffer limits.");

        return this._pIndexBuffer.writeData(
            pData,
            this.byteOffset + iOffset * this.bytesPerIndex,
            iCount * this.bytesPerIndex);
    }

    destroy(): void {
        this._pIndexBuffer = null;
        this._iOffset = undefined;
        this._iLength = undefined;
        this._eElementsType = undefined;
        this._eElementsType = undefined;
    }

    getPrimitiveType(): AEPrimitiveTypes {
        return this._ePrimitiveType;
    }

    getPrimitiveCount(iIndexCount: uint = this.length): uint {
        return IndexData.getPrimitiveCount(this._ePrimitiveType, iIndexCount);
    }

    getBufferHandle(): int {
        return this._pIndexBuffer.resourceHandle;
    }

    static getPrimitiveCount(eType: AEPrimitiveTypes, nVertices: uint): uint {
        switch (eType) {
            case AEPrimitiveTypes.POINTLIST:
                return nVertices;
            case AEPrimitiveTypes.LINELIST:
                return nVertices / 2;
            case AEPrimitiveTypes.LINESTRIP:
                return nVertices - 1;
            case AEPrimitiveTypes.LINELOOP:
                return nVertices;
            case AEPrimitiveTypes.TRIANGLELIST:
                return nVertices / 3;
            case AEPrimitiveTypes.TRIANGLEFAN:
            case AEPrimitiveTypes.TRIANGLESTRIP:
                return nVertices - 2;
        }

        logger.presume(false, "unhandled case detected..");

        return 0;
    }
}

export = IndexData;