var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (pool) {
        /// <reference path="../../idl/IIndexBuffer.ts" />
        /// <reference path="../../idl/IIndexData.ts" />
        /// <reference path="HardwareBuffer.ts" />
        /// <reference path="../../data/IndexData.ts" />
        (function (resources) {
            var IndexBuffer = (function (_super) {
                __extends(IndexBuffer, _super);
                function IndexBuffer(/*pManager: IResourcePoolManager*/ ) {
                    _super.call(this);
                    this._pIndexDataArray = [];
                    this._iDataCounter = 0;
                }
                Object.defineProperty(IndexBuffer.prototype, "length", {
                    get: function () {
                        return this._pIndexDataArray.length;
                    },
                    enumerable: true,
                    configurable: true
                });

                //create(iByteSize: uint, iFlags?: uint, pData?: Uint8Array): boolean;
                IndexBuffer.prototype.create = function (iByteSize, iFlags, pData) {
                    //create(iByteSize: uint, iFlags?: uint, pData?: ArrayBufferView): boolean {
                    _super.prototype.create.call(this, 0, iFlags || 0);

                    if (bf.testAny(iFlags, EHardwareBufferFlags.BACKUP_COPY)) {
                        this._pBackupCopy = new MemoryBuffer();
                        this._pBackupCopy.create(iByteSize);
                        this._pBackupCopy.writeData(pData, 0, iByteSize);
                    }

                    return true;
                };

                IndexBuffer.prototype.destroy = function () {
                    _super.prototype.destroy.call(this);

                    this._pBackupCopy.destroy();
                    this.freeIndexData();

                    this._iDataCounter = 0;
                };

                IndexBuffer.prototype.getIndexData = function (iOffset, iCount, ePrimitiveType, eElementsType) {
                    var pIndexData = new data.IndexData(this, this._iDataCounter++, iOffset, iCount, ePrimitiveType, eElementsType);
                    this._pIndexDataArray.push(pIndexData);
                    return pIndexData;
                };

                IndexBuffer.prototype.getEmptyIndexData = function (iCount, ePrimitiveType, eElementsType) {
                    var pHole = new Array();
                    var i;
                    var pIndexData;

                    pHole[0] = { start: 0, end: this.byteLength };

                    for (var k = 0; k < this._pIndexDataArray.length; ++k) {
                        pIndexData = this._pIndexDataArray[k];

                        for (i = 0; i < pHole.length; i++) {
                            if (pIndexData.byteOffset > pHole[i].start && pIndexData.byteOffset + pIndexData.byteLength < pHole[i].end) {
                                var iTemp = pHole[i].end;

                                pHole[i].end = pIndexData.byteOffset;
                                pHole.splice(i + 1, 0, { start: pIndexData.byteOffset + pIndexData.byteLength, end: iTemp });

                                i--;
                            } else if (pIndexData.byteOffset == pHole[i].start && pIndexData.byteOffset + pIndexData.byteLength < pHole[i].end) {
                                pHole[i].start = pIndexData.byteOffset + pIndexData.byteLength;
                            } else if (pIndexData.byteOffset > pHole[i].start && pIndexData.byteOffset + pIndexData.byteLength == pHole[i].end) {
                            } else if (pIndexData.byteOffset == pHole[i].start && pIndexData.byteLength == (pHole[i].end - pHole[i].start)) {
                                pHole.splice(i, 1);
                                i--;
                            } else if (pIndexData.byteOffset < pHole[i].start && pIndexData.byteOffset + pIndexData.byteLength > pHole[i].start && pIndexData.byteOffset + pIndexData.byteLength < pHole[i].end) {
                                pHole[i].start = pIndexData.byteOffset + pIndexData.byteLength;
                            } else if (pIndexData.byteOffset < pHole[i].start && pIndexData.byteOffset + pIndexData.byteLength > pHole[i].start && pIndexData.byteOffset + pIndexData.byteLength == pHole[i].end) {
                                pHole.splice(i, 1);
                                i--;
                            } else if (pIndexData.byteOffset + pIndexData.byteLength > pHole[i].end && pIndexData.byteOffset > pHole[i].start && pIndexData.byteOffset < pHole[i].end) {
                                pHole[i].end = pIndexData.byteOffset;
                            } else if (pIndexData.byteOffset + pIndexData.byteLength > pHole[i].end && pIndexData.byteOffset == pHole[i].start && pIndexData.byteOffset < pHole[i].end) {
                                pHole.splice(i, 1);
                                i--;
                            } else if (pIndexData.byteOffset < pHole[i].start && pIndexData.byteOffset + pIndexData.byteLength > pHole[i].end) {
                                i--;
                            }
                        }
                    }

                    pHole.sort(function (a, b) {
                        return ((a.end - a.start) - (b.end - b.start));
                    });

                    for (i = 0; i < pHole.length; i++) {
                        if ((pHole[i].end - pHole[i].start) >= iCount * getTypeSize(eElementsType)) {
                            pIndexData = new data.IndexData(this, this._iDataCounter++, pHole[i].start, iCount, ePrimitiveType, eElementsType);

                            this._pIndexDataArray.push(pIndexData);

                            return pIndexData;
                        }
                    }

                    return null;
                };

                IndexBuffer.prototype.freeIndexData = function (pIndexData) {
                    if (arguments.length == 0) {
                        for (var i = 0; i < this._pIndexDataArray.length; i++) {
                            this._pIndexDataArray[Number(i)].destroy();
                        }

                        this._pIndexDataArray = null;
                    } else {
                        for (var i = 0; i < this._pIndexDataArray.length; i++) {
                            if (this._pIndexDataArray[i] == pIndexData) {
                                pIndexData.destroy();

                                this._pIndexDataArray.splice(i, 1);
                                this.notifyAltered();
                                return true;
                            }
                        }

                        return false;
                    }

                    this.notifyAltered();
                    return true;
                };

                IndexBuffer.prototype.allocateData = function (ePrimitiveType, eElementsType, pData) {
                    var pIndexData;
                    var iCount = pData.byteLength / getTypeSize(eElementsType);

                    debug.assert(iCount === math.floor(iCount), "data size should be a multiple of the vertex declaration");

                    pIndexData = this.getEmptyIndexData(iCount, ePrimitiveType, eElementsType);
                    pIndexData.setData(pData);

                    return pIndexData;
                };
                return IndexBuffer;
            })(resources.HardwareBuffer);
            resources.IndexBuffer = IndexBuffer;
        })(pool.resources || (pool.resources = {}));
        var resources = pool.resources;
    })(akra.pool || (akra.pool = {}));
    var pool = akra.pool;
})(akra || (akra = {}));
