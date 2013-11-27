/// <reference path="../idl/AIBinReader.ts" />
/// <reference path="../idl/AIBinWriter.ts" />

/**
 * Usage:
 * var br = new Binreader(data); type of data is ArrayBuffer
 * var string = bw.string();
 * var array = bw.stringArray()
 * var value = bw.uint8()
 * var value = bw.uint16()
 * var value = bw.uint32()
 * var array = bw.uint8Array()
 * var array = bw.uint16Array()
 * var array = bw.uint32Array()
 * var value = bw.int8()
 * var value = bw.int16()
 * var value = bw.int32()
 * var array = bw.int8Array()
 * var array = bw.int16Array()
 * var array = bw.int32Array()
 * var value = bw.float64()
 * var value = bw.float32()
 * var array = bw.float32Array()
 * var array = bw.float64Array()
 */

/**
 * Работает заебись, докуменитировать лень.
 */

import logger = require("logger");
import limit = require("limit");

class Reader implements AIBinReader {
    protected _pDataView: DataView;
    protected _iPosition: uint;

    constructor(pBuffer: ArrayBuffer, iByteOffset?: uint, iByteLength?: uint);
    constructor(pBuffer: AIBinWriter, iByteOffset?: uint, iByteLength?: uint);
    constructor(pBuffer: any, iByteOffset?: uint, iByteLength?: uint) {
        if (!isDef(iByteOffset)) { iByteOffset = 0; }
        if (!isDef(iByteLength)) { iByteLength = pBuffer.byteLength; }

        this._pDataView = new DataView(isArrayBuffer(pBuffer) ? (<ArrayBuffer>pBuffer) : (<AIBinWriter>pBuffer).data(),
            iByteOffset, iByteLength);
        this._iPosition = 0;
    }

    string(sDefault: string = null): string {
        var iStringLength: uint = this.uint32();
        var iBitesToAdd: uint;

        if (iStringLength == limit.MAX_INT32) {
            return sDefault;
        }

        iBitesToAdd = ((4 - (iStringLength % 4) == 4)) ? 0 : (4 - (iStringLength % 4));
        iStringLength += iBitesToAdd;

        //Out of array limits
        logger.assert((this._iPosition + iStringLength - 1) < this._pDataView.byteLength);

        var pBuffer: Uint8Array = new Uint8Array(iStringLength);

        for (var i: int = 0; i < iStringLength; i++) {
            pBuffer[i] = this._pDataView.getUint8(this._iPosition + i);
        }

        this._iPosition += iStringLength;
        var sString: string = "",
            charCode: string,
            code: uint;

        for (var n = 0; n < pBuffer.length; ++n) {
            code = pBuffer[n];

            if (code == 0) {
                break;
            }

            charCode = String.fromCharCode(code);
            sString = sString + charCode;
        }

        sString = sString.fromUTF8();
        /*sString.substr(0, iStringLength);//sString;//*/
        return sString;
    }

    uint32(): uint {
        var i: uint = this._pDataView.getUint32(this._iPosition, true);
        this._iPosition += 4;
        // LOG("uint32:", i);
        return i;
    }

    uint16(): uint {
        var i: uint = this._pDataView.getUint16(this._iPosition, true);
        this._iPosition += 4;
        return i;
    }

    uint8(): uint {
        var i: uint = this._pDataView.getUint8(this._iPosition);
        this._iPosition += 4;
        return i;
    }

    /** inline */ boolean(): boolean {
        return this.uint8() > 0;
    }

    int32(): int {
        var i: int = this._pDataView.getInt32(this._iPosition, true);
        this._iPosition += 4;
        return i;
    }

    int16(): int {
        var i: int = this._pDataView.getInt16(this._iPosition, true);
        this._iPosition += 4;
        return i;
    }

    int8(): int {
        var i: int = this._pDataView.getInt8(this._iPosition);
        this._iPosition += 4;
        return i;
    }

    float64(): float {
        var f: float = this._pDataView.getFloat64(this._iPosition, true);
        this._iPosition += 8;
        return f;
    }

    float32(): float {
        var f: float = this._pDataView.getFloat32(this._iPosition, true);
        this._iPosition += 4;
        // LOG("float32:", f);
        return f;
    }

    stringArray(): string[] {
        var iLength: int = this.uint32();

        if (iLength == limit.MAX_INT32) {
            return null;
        }

        var pArray: string[] = new Array<string>(iLength);

        for (var i: int = 0; i < iLength; i++) {
            pArray[i] = this.string();
        }

        return pArray;
    }

    /** inline */ uint32Array(): Uint32Array {
        return <Uint32Array>this.uintXArray(32);
    }

    /** inline */ uint16Array(): Uint16Array {
        return <Uint16Array>this.uintXArray(16);
    }

    /** inline */ uint8Array(): Uint8Array {
        return <Uint8Array>this.uintXArray(8);
    }

    /** inline */ int32Array(): Int32Array {
        return <Int32Array>this.intXArray(32);
    }

    /** inline */ int16Array(): Int16Array {
        return <Int16Array>this.intXArray(16);
    }

    /** inline */ int8Array(): Int8Array {
        return <Int8Array>this.intXArray(8);
    }

    /** inline */ float64Array(): Float64Array {
        return <Float64Array>this.floatXArray(64);
    }

    /** inline */ float32Array(): Float32Array {
        return <Float32Array>this.floatXArray(32);
    }

    private uintXArray(iX: uint): ArrayBufferView {
        var iLength: uint = this.uint32();

        if (iLength == limit.MAX_INT32) {
            return null;
        }

        var iBytes: uint = iX / 8;
        var pArray: ArrayBufferView;

        switch (iBytes) {
            case 1:
                pArray = new Uint8Array(iLength);

                for (var i = 0; i < iLength; i++) {
                    pArray[i] = this._pDataView.getUint8(this._iPosition + i * iBytes);
                }

                break;
            case 2:
                pArray = new Uint16Array(iLength);

                for (var i = 0; i < iLength; i++) {
                    pArray[i] = this._pDataView.getUint16(this._iPosition + i * iBytes, true);
                }

                break;
            case 4:
                pArray = new Uint32Array(iLength);

                for (var i = 0; i < iLength; i++) {
                    pArray[i] = this._pDataView.getUint32(this._iPosition + i * iBytes, true);
                }

                break;
            default:
                logger.error("unsupported array length detected: " + iBytes);
        }

        var iByteLength: uint = iBytes * iLength;
        iByteLength += -iByteLength & 3;

        this._iPosition += iByteLength;

        return pArray;
    }

    private intXArray(iX: uint): ArrayBufferView {
        var iLength: uint = this.uint32();

        if (iLength == limit.MAX_INT32) {
            return null;
        }

        var iBytes: uint = iX / 8;
        var pArray: ArrayBufferView;

        switch (iBytes) {
            case 1:
                pArray = new Int8Array(iLength);

                for (var i = 0; i < iLength; i++) {
                    pArray[i] = this._pDataView.getInt8(this._iPosition + i * iBytes);
                }

                break;
            case 2:
                pArray = new Int16Array(iLength);

                for (var i = 0; i < iLength; i++) {
                    pArray[i] = this._pDataView.getInt16(this._iPosition + i * iBytes, true);
                }

                break;
            case 4:
                pArray = new Int32Array(iLength);

                for (var i = 0; i < iLength; i++) {
                    pArray[i] = this._pDataView.getInt32(this._iPosition + i * iBytes, true);
                }

                break;
            default:
                logger.error("unsupported array length detected: " + iBytes);
        }

        var iByteLength: uint = iBytes * iLength;
        iByteLength += -iByteLength & 3;

        this._iPosition += iByteLength;

        return pArray;
    }

    private floatXArray(iX: uint): ArrayBufferView {
        var iLength: uint = this.uint32();

        if (iLength == limit.MAX_INT32) {
            return null;
        }

        var iBytes: uint = iX / 8;
        var pArray: ArrayBufferView;

        switch (iBytes) {
            case 4:
                pArray = new Float32Array(iLength);

                for (var i = 0; i < iLength; i++) {
                    pArray[i] = this._pDataView.getFloat32(this._iPosition + i * iBytes, true);
                }

                break;
            case 8:
                pArray = new Float64Array(iLength);

                for (var i = 0; i < iLength; i++) {
                    pArray[i] = this._pDataView.getFloat64(this._iPosition + i * iBytes, true);
                }

                break;
            default:
                logger.error("unsupported array length detected: " + iBytes);
        }

        var iByteLength = iBytes * iLength;
        iByteLength += -iByteLength & 3;

        this._iPosition += iByteLength;

        return pArray;
    }
}

export = Reader;