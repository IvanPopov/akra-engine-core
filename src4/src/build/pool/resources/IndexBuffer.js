/// <reference path="../../idl/IIndexBuffer.ts" />
/// <reference path="../../idl/IIndexData.ts" />
/// <reference path="HardwareBuffer.ts" />
/// <reference path="../../data/IndexData.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (pool) {
        (function (resources) {
            var IndexBuffer = (function (_super) {
                __extends(IndexBuffer, _super);
                function IndexBuffer() {
                    _super.call(this);
                    this._pIndexDataArray = [];
                    this._iDataCounter = 0;
                }
                IndexBuffer.prototype.geLength = function () {
                    return this._pIndexDataArray.length;
                };

                //create(iByteSize: uint, iFlags?: uint, pData?: Uint8Array): boolean;
                IndexBuffer.prototype.create = function (iByteSize, iFlags, pData) {
                    //create(iByteSize: uint, iFlags?: uint, pData?: ArrayBufferView): boolean {
                    _super.prototype.create.call(this, 0, iFlags || 0);

                    if (akra.bf.testAny(iFlags, 8 /* BACKUP_COPY */)) {
                        this._pBackupCopy = new akra.pool.resources.MemoryBuffer();
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
                    var pIndexData = new akra.data.IndexData(this, this._iDataCounter++, iOffset, iCount, ePrimitiveType, eElementsType);
                    this._pIndexDataArray.push(pIndexData);
                    return pIndexData;
                };

                IndexBuffer.prototype.getEmptyIndexData = function (iCount, ePrimitiveType, eElementsType) {
                    var pHole = new Array();
                    var i;
                    var pIndexData;

                    pHole[0] = { start: 0, end: this.getByteLength() };

                    for (var k = 0; k < this._pIndexDataArray.length; ++k) {
                        pIndexData = this._pIndexDataArray[k];

                        for (i = 0; i < pHole.length; i++) {
                            //console.log("pHole:",pHole[i].start,pHole[i].end);
                            //Полностью попадает внутрь
                            if (pIndexData.getByteOffset() > pHole[i].start && pIndexData.getByteOffset() + pIndexData.getByteLength() < pHole[i].end) {
                                var iTemp = pHole[i].end;

                                pHole[i].end = pIndexData.getByteOffset();
                                pHole.splice(i + 1, 0, { start: pIndexData.getByteOffset() + pIndexData.getByteLength(), end: iTemp });

                                i--;
                            } else if (pIndexData.getByteOffset() == pHole[i].start && pIndexData.getByteOffset() + pIndexData.getByteLength() < pHole[i].end) {
                                pHole[i].start = pIndexData.getByteOffset() + pIndexData.getByteLength();
                            } else if (pIndexData.getByteOffset() > pHole[i].start && pIndexData.getByteOffset() + pIndexData.getByteLength() == pHole[i].end) {
                            } else if (pIndexData.getByteOffset() == pHole[i].start && pIndexData.getByteLength() == (pHole[i].end - pHole[i].start)) {
                                pHole.splice(i, 1);
                                i--;
                            } else if (pIndexData.getByteOffset() < pHole[i].start && pIndexData.getByteOffset() + pIndexData.getByteLength() > pHole[i].start && pIndexData.getByteOffset() + pIndexData.getByteLength() < pHole[i].end) {
                                pHole[i].start = pIndexData.getByteOffset() + pIndexData.getByteLength();
                            } else if (pIndexData.getByteOffset() < pHole[i].start && pIndexData.getByteOffset() + pIndexData.getByteLength() > pHole[i].start && pIndexData.getByteOffset() + pIndexData.getByteLength() == pHole[i].end) {
                                pHole.splice(i, 1);
                                i--;
                            } else if (pIndexData.getByteOffset() + pIndexData.getByteLength() > pHole[i].end && pIndexData.getByteOffset() > pHole[i].start && pIndexData.getByteOffset() < pHole[i].end) {
                                pHole[i].end = pIndexData.getByteOffset();
                            } else if (pIndexData.getByteOffset() + pIndexData.getByteLength() > pHole[i].end && pIndexData.getByteOffset() == pHole[i].start && pIndexData.getByteOffset() < pHole[i].end) {
                                pHole.splice(i, 1);
                                i--;
                            } else if (pIndexData.getByteOffset() < pHole[i].start && pIndexData.getByteOffset() + pIndexData.getByteLength() > pHole[i].end) {
                                i--;
                            }
                        }
                    }

                    pHole.sort(function (a, b) {
                        return ((a.end - a.start) - (b.end - b.start));
                    });

                    for (i = 0; i < pHole.length; i++) {
                        if ((pHole[i].end - pHole[i].start) >= iCount * akra.sizeof(eElementsType)) {
                            pIndexData = new akra.data.IndexData(this, this._iDataCounter++, pHole[i].start, iCount, ePrimitiveType, eElementsType);

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
                    var iCount = pData.byteLength / akra.sizeof(eElementsType);

                    akra.debug.assert(iCount === akra.math.floor(iCount), "data size should be a multiple of the vertex declaration");

                    pIndexData = this.getEmptyIndexData(iCount, ePrimitiveType, eElementsType);
                    pIndexData.setData(pData);

                    return pIndexData;
                };
                return IndexBuffer;
            })(akra.pool.resources.HardwareBuffer);
            resources.IndexBuffer = IndexBuffer;
        })(pool.resources || (pool.resources = {}));
        var resources = pool.resources;
    })(akra.pool || (akra.pool = {}));
    var pool = akra.pool;
})(akra || (akra = {}));
//# sourceMappingURL=IndexBuffer.js.map
