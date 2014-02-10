/// <reference path="../idl/IBinReader.ts" />
/// <reference path="../idl/IBinWriter.ts" />
/// <reference path="../logger.ts" />
/// <reference path="../conv/conv.ts" />
var akra;
(function (akra) {
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
    (function (io) {
        var BinReader = (function () {
            function BinReader(pBuffer, iByteOffset, iByteLength) {
                if (!akra.isDef(iByteOffset)) {
                    iByteOffset = 0;
                }
                if (!akra.isDef(iByteLength)) {
                    iByteLength = pBuffer.byteLength;
                }

                this._pDataView = new DataView(akra.isArrayBuffer(pBuffer) ? pBuffer : pBuffer.data(), iByteOffset, iByteLength);
                this._iPosition = 0;
            }
            BinReader.prototype.string = function (sDefault) {
                if (typeof sDefault === "undefined") { sDefault = null; }
                var iStringLength = this.uint32();
                var iBitesToAdd;

                if (iStringLength == akra.MAX_INT32) {
                    return sDefault;
                }

                iBitesToAdd = ((4 - (iStringLength % 4) == 4)) ? 0 : (4 - (iStringLength % 4));
                iStringLength += iBitesToAdd;

                //Out of array limits
                akra.logger.assert((this._iPosition + iStringLength - 1) < this._pDataView.byteLength);

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

                sString = akra.conv.fromUTF8(sString);

                /*sString.substr(0, iStringLength);//sString;//*/
                return sString;
            };

            BinReader.prototype.uint32 = function () {
                var i = this._pDataView.getUint32(this._iPosition, true);
                this._iPosition += 4;

                // LOG("uint32:", i);
                return i;
            };

            BinReader.prototype.uint16 = function () {
                var i = this._pDataView.getUint16(this._iPosition, true);
                this._iPosition += 4;
                return i;
            };

            BinReader.prototype.uint8 = function () {
                var i = this._pDataView.getUint8(this._iPosition);
                this._iPosition += 4;
                return i;
            };

            BinReader.prototype.boolean = function () {
                return this.uint8() > 0;
            };

            BinReader.prototype.int32 = function () {
                var i = this._pDataView.getInt32(this._iPosition, true);
                this._iPosition += 4;
                return i;
            };

            BinReader.prototype.int16 = function () {
                var i = this._pDataView.getInt16(this._iPosition, true);
                this._iPosition += 4;
                return i;
            };

            BinReader.prototype.int8 = function () {
                var i = this._pDataView.getInt8(this._iPosition);
                this._iPosition += 4;
                return i;
            };

            BinReader.prototype.float64 = function () {
                var f = this._pDataView.getFloat64(this._iPosition, true);
                this._iPosition += 8;
                return f;
            };

            BinReader.prototype.float32 = function () {
                var f = this._pDataView.getFloat32(this._iPosition, true);
                this._iPosition += 4;

                // LOG("float32:", f);
                return f;
            };

            BinReader.prototype.stringArray = function () {
                var iLength = this.uint32();

                if (iLength == akra.MAX_INT32) {
                    return null;
                }

                var pArray = new Array(iLength);

                for (var i = 0; i < iLength; i++) {
                    pArray[i] = this.string();
                }

                return pArray;
            };

            BinReader.prototype.uint32Array = function () {
                return this.uintXArray(32);
            };

            BinReader.prototype.uint16Array = function () {
                return this.uintXArray(16);
            };

            BinReader.prototype.uint8Array = function () {
                return this.uintXArray(8);
            };

            BinReader.prototype.int32Array = function () {
                return this.intXArray(32);
            };

            BinReader.prototype.int16Array = function () {
                return this.intXArray(16);
            };

            BinReader.prototype.int8Array = function () {
                return this.intXArray(8);
            };

            BinReader.prototype.float64Array = function () {
                return this.floatXArray(64);
            };

            BinReader.prototype.float32Array = function () {
                return this.floatXArray(32);
            };

            BinReader.prototype.uintXArray = function (iX) {
                var iLength = this.uint32();

                if (iLength == akra.MAX_INT32) {
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
                        akra.logger.error("unsupported array length detected: " + iBytes);
                }

                var iByteLength = iBytes * iLength;
                iByteLength += -iByteLength & 3;

                this._iPosition += iByteLength;

                return pArray;
            };

            BinReader.prototype.intXArray = function (iX) {
                var iLength = this.uint32();

                if (iLength == akra.MAX_INT32) {
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
                        akra.logger.error("unsupported array length detected: " + iBytes);
                }

                var iByteLength = iBytes * iLength;
                iByteLength += -iByteLength & 3;

                this._iPosition += iByteLength;

                return pArray;
            };

            BinReader.prototype.floatXArray = function (iX) {
                var iLength = this.uint32();

                if (iLength == akra.MAX_INT32) {
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
                        akra.logger.error("unsupported array length detected: " + iBytes);
                }

                var iByteLength = iBytes * iLength;
                iByteLength += -iByteLength & 3;

                this._iPosition += iByteLength;

                return pArray;
            };
            return BinReader;
        })();
        io.BinReader = BinReader;
    })(akra.io || (akra.io = {}));
    var io = akra.io;
})(akra || (akra = {}));
//# sourceMappingURL=BinReader.js.map
