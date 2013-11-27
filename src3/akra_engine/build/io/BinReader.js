/// <reference path="../idl/AIBinReader.ts" />
/// <reference path="../idl/AIBinWriter.ts" />
define(["require", "exports", "logger", "limit"], function(require, exports, __logger__, __limit__) {
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
    var logger = __logger__;
    var limit = __limit__;

    var Reader = (function () {
        function Reader(pBuffer, iByteOffset, iByteLength) {
            if (!isDef(iByteOffset)) {
                iByteOffset = 0;
            }
            if (!isDef(iByteLength)) {
                iByteLength = pBuffer.byteLength;
            }

            this._pDataView = new DataView(isArrayBuffer(pBuffer) ? (pBuffer) : (pBuffer).data(), iByteOffset, iByteLength);
            this._iPosition = 0;
        }
        Reader.prototype.string = function (sDefault) {
            if (typeof sDefault === "undefined") { sDefault = null; }
            var iStringLength = this.uint32();
            var iBitesToAdd;

            if (iStringLength == limit.MAX_INT32) {
                return sDefault;
            }

            iBitesToAdd = ((4 - (iStringLength % 4) == 4)) ? 0 : (4 - (iStringLength % 4));
            iStringLength += iBitesToAdd;

            //Out of array limits
            logger.assert((this._iPosition + iStringLength - 1) < this._pDataView.byteLength);

            var pBuffer = new Uint8Array(iStringLength);

            for (var i = 0; i < iStringLength; i++) {
                pBuffer[i] = this._pDataView.getUint8(this._iPosition + i);
            }

            this._iPosition += iStringLength;
            var sString = "", charCode, code;

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
        };

        Reader.prototype.uint32 = function () {
            var i = this._pDataView.getUint32(this._iPosition, true);
            this._iPosition += 4;

            // LOG("uint32:", i);
            return i;
        };

        Reader.prototype.uint16 = function () {
            var i = this._pDataView.getUint16(this._iPosition, true);
            this._iPosition += 4;
            return i;
        };

        Reader.prototype.uint8 = function () {
            var i = this._pDataView.getUint8(this._iPosition);
            this._iPosition += 4;
            return i;
        };

        /** inline */ Reader.prototype.boolean = function () {
            return this.uint8() > 0;
        };

        Reader.prototype.int32 = function () {
            var i = this._pDataView.getInt32(this._iPosition, true);
            this._iPosition += 4;
            return i;
        };

        Reader.prototype.int16 = function () {
            var i = this._pDataView.getInt16(this._iPosition, true);
            this._iPosition += 4;
            return i;
        };

        Reader.prototype.int8 = function () {
            var i = this._pDataView.getInt8(this._iPosition);
            this._iPosition += 4;
            return i;
        };

        Reader.prototype.float64 = function () {
            var f = this._pDataView.getFloat64(this._iPosition, true);
            this._iPosition += 8;
            return f;
        };

        Reader.prototype.float32 = function () {
            var f = this._pDataView.getFloat32(this._iPosition, true);
            this._iPosition += 4;

            // LOG("float32:", f);
            return f;
        };

        Reader.prototype.stringArray = function () {
            var iLength = this.uint32();

            if (iLength == limit.MAX_INT32) {
                return null;
            }

            var pArray = new Array(iLength);

            for (var i = 0; i < iLength; i++) {
                pArray[i] = this.string();
            }

            return pArray;
        };

        /** inline */ Reader.prototype.uint32Array = function () {
            return this.uintXArray(32);
        };

        /** inline */ Reader.prototype.uint16Array = function () {
            return this.uintXArray(16);
        };

        /** inline */ Reader.prototype.uint8Array = function () {
            return this.uintXArray(8);
        };

        /** inline */ Reader.prototype.int32Array = function () {
            return this.intXArray(32);
        };

        /** inline */ Reader.prototype.int16Array = function () {
            return this.intXArray(16);
        };

        /** inline */ Reader.prototype.int8Array = function () {
            return this.intXArray(8);
        };

        /** inline */ Reader.prototype.float64Array = function () {
            return this.floatXArray(64);
        };

        /** inline */ Reader.prototype.float32Array = function () {
            return this.floatXArray(32);
        };

        Reader.prototype.uintXArray = function (iX) {
            var iLength = this.uint32();

            if (iLength == limit.MAX_INT32) {
                return null;
            }

            var iBytes = iX / 8;
            var pArray;

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

            var iByteLength = iBytes * iLength;
            iByteLength += -iByteLength & 3;

            this._iPosition += iByteLength;

            return pArray;
        };

        Reader.prototype.intXArray = function (iX) {
            var iLength = this.uint32();

            if (iLength == limit.MAX_INT32) {
                return null;
            }

            var iBytes = iX / 8;
            var pArray;

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

            var iByteLength = iBytes * iLength;
            iByteLength += -iByteLength & 3;

            this._iPosition += iByteLength;

            return pArray;
        };

        Reader.prototype.floatXArray = function (iX) {
            var iLength = this.uint32();

            if (iLength == limit.MAX_INT32) {
                return null;
            }

            var iBytes = iX / 8;
            var pArray;

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
        };
        return Reader;
    })();

    
    return Reader;
});
//# sourceMappingURL=BinReader.js.map
