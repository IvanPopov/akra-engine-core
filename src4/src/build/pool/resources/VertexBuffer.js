/// <reference path="../../idl/IVertexBuffer.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (pool) {
        /// <reference path="../../data/VertexData.ts" />
        /// <reference path="../../data/VertexDeclaration.ts" />
        /// <reference path="../../bf/bf.ts" />
        /// <reference path="HardwareBuffer.ts" />
        /// <reference path="MemoryBuffer.ts" />
        (function (resources) {
            var VertexDeclaration = akra.data.VertexDeclaration;

            var VertexBuffer = (function (_super) {
                __extends(VertexBuffer, _super);
                function VertexBuffer() {
                    _super.call(this);
                    this._pVertexDataArray = [];
                    this._iDataCounter = 0;
                }
                VertexBuffer.prototype.getType = function () {
                    return 0 /* UNKNOWN */;
                };

                VertexBuffer.prototype.getLength = function () {
                    return this._pVertexDataArray.length;
                };

                // create(iByteSize: uint, iFlags?: uint, pData?: Uint8Array): boolean;
                VertexBuffer.prototype.create = function (iByteSize, iFlags, pData) {
                    // create(iByteSize: uint, iFlags?: uint, pData?: any): boolean {
                    _super.prototype.create.call(this, 0, iFlags || 0);

                    if (akra.bf.testAny(iFlags, 8 /* BACKUP_COPY */)) {
                        this._pBackupCopy = new akra.pool.resources.MemoryBuffer();
                        this._pBackupCopy.create(iByteSize);
                        this._pBackupCopy.writeData(pData, 0, iByteSize);
                    }

                    return true;
                };

                VertexBuffer.prototype.destroy = function () {
                    _super.prototype.destroy.call(this);

                    this._pBackupCopy.destroy();
                    this.freeVertexData();

                    this._iDataCounter = 0;
                };

                VertexBuffer.prototype.getVertexData = function (iOffset, iCount, pData) {
                    if (arguments.length < 2) {
                        return this._pVertexDataArray[arguments[0]];
                    }

                    var pDecl = VertexDeclaration.normalize(pData);
                    var pVertexData = new akra.data.VertexData(this, this._iDataCounter++, iOffset, iCount, pDecl);

                    this._pVertexDataArray.push(pVertexData);
                    this.notifyAltered();

                    return pVertexData;
                };

                VertexBuffer.prototype.getEmptyVertexData = function (iCount, pDeclData, ppVertexDataIn) {
                    var pDecl = null;
                    var pHole = [];
                    var i;
                    var pVertexData;
                    var iTemp;
                    var iStride = 0;
                    var iAligStart;
                    var iNewSize = 0;

                    while (true) {
                        pHole[0] = { start: 0, end: this.getByteLength() };

                        for (var k = 0; k < this._pVertexDataArray.length; ++k) {
                            pVertexData = this._pVertexDataArray[k];

                            for (i = 0; i < pHole.length; i++) {
                                //Полностью попадает внутрь
                                if (pVertexData.getByteOffset() > pHole[i].start && pVertexData.getByteOffset() + pVertexData.getByteLength() < pHole[i].end) {
                                    iTemp = pHole[i].end;
                                    pHole[i].end = pVertexData.getByteOffset();
                                    pHole.splice(i + 1, 0, { start: pVertexData.getByteOffset() + pVertexData.getByteLength(), end: iTemp });
                                    i--;
                                } else if (pVertexData.getByteOffset() == pHole[i].start && pVertexData.getByteOffset() + pVertexData.getByteLength() < pHole[i].end) {
                                    pHole[i].start = pVertexData.getByteOffset() + pVertexData.getByteLength();
                                } else if (pVertexData.getByteOffset() > pHole[i].start && pVertexData.getByteOffset() + pVertexData.getByteLength() == pHole[i].end) {
                                } else if (pVertexData.getByteOffset() == pHole[i].start && pVertexData.getByteLength() == (pHole[i].end - pHole[i].start)) {
                                    pHole.splice(i, 1);
                                    i--;
                                } else if (pVertexData.getByteOffset() < pHole[i].start && pVertexData.getByteOffset() + pVertexData.getByteLength() > pHole[i].start && pVertexData.getByteOffset() + pVertexData.getByteLength() < pHole[i].end) {
                                    pHole[i].start = pVertexData.getByteOffset() + pVertexData.getByteLength();
                                } else if (pVertexData.getByteOffset() < pHole[i].start && pVertexData.getByteOffset() + pVertexData.getByteLength() > pHole[i].start && pVertexData.getByteOffset() + pVertexData.getByteLength() == pHole[i].end) {
                                    pHole.splice(i, 1);
                                    i--;
                                } else if (pVertexData.getByteOffset() + pVertexData.getByteLength() > pHole[i].end && pVertexData.getByteOffset() > pHole[i].start && pVertexData.getByteOffset() < pHole[i].end) {
                                    pHole[i].end = pVertexData.getByteOffset();
                                } else if (pVertexData.getByteOffset() + pVertexData.getByteLength() > pHole[i].end && pVertexData.getByteOffset() == pHole[i].start && pVertexData.getByteOffset() < pHole[i].end) {
                                    pHole.splice(i, 1);
                                    i--;
                                } else if (pVertexData.getByteOffset() < pHole[i].start && pVertexData.getByteOffset() + pVertexData.getByteLength() > pHole[i].end) {
                                    i--;
                                }
                            }
                        }

                        pHole.sort(function (a, b) {
                            return ((a.end - a.start) - (b.end - b.start));
                        });

                        if (!akra.isInt(pDeclData)) {
                            pDecl = VertexDeclaration.normalize(pDeclData);
                            iStride = pDecl.stride;
                        } else {
                            iStride = pDeclData;
                        }

                        for (i = 0; i < pHole.length; i++) {
                            iAligStart = this.isAligned() ? akra.math.alignUp(pHole[i].start, akra.math.nok(iStride, 4)) : akra.math.alignUp(pHole[i].start, iStride);

                            if ((pHole[i].end - iAligStart) >= iCount * iStride) {
                                if (arguments.length == 2) {
                                    pVertexData = new akra.data.VertexData(this, this._iDataCounter++, iAligStart, iCount, pDeclData);
                                    this._pVertexDataArray.push(pVertexData);

                                    this.notifyAltered();
                                    return pVertexData;
                                } else if (arguments.length == 3) {
                                    (ppVertexDataIn.constructor).call(ppVertexDataIn, this, ppVertexDataIn.getID(), iAligStart, iCount, pDeclData);
                                    this._pVertexDataArray.push(ppVertexDataIn);

                                    this.notifyAltered();
                                    return ppVertexDataIn;
                                }

                                return null;
                            }
                        }

                        iNewSize = akra.math.max(this.getByteLength() * 2, this.getByteLength() + iCount * iStride);

                        if (this.resize(iNewSize) == false) {
                            akra.debug.warn("cannot resize buffer from " + this.getByteLength() + " bytes to " + iNewSize + " bytes ");
                            break;
                        }
                    }

                    return null;
                };

                VertexBuffer.prototype.freeVertexData = function (pVertexData) {
                    if (arguments.length == 0) {
                        for (var i = 0; i < this._pVertexDataArray.length; i++) {
                            this._pVertexDataArray[Number(i)].destroy();
                        }

                        this._pVertexDataArray = null;
                    } else {
                        for (var i = 0; i < this._pVertexDataArray.length; i++) {
                            if (this._pVertexDataArray[i] == pVertexData) {
                                pVertexData.destroy();

                                this._pVertexDataArray.splice(i, 1);
                                this.notifyAltered();
                                return true;
                            }
                        }

                        return false;
                    }

                    this.notifyAltered();
                    return true;
                };

                VertexBuffer.prototype.allocateData = function (pDeclData, pData) {
                    var pDecl = VertexDeclaration.normalize(pDeclData);

                    var pVertexData;
                    var iCount = pData.byteLength / pDecl.stride;

                    akra.debug.assert(iCount === akra.math.floor(iCount), 'Data size should be a multiple of the vertex declaration.');

                    pVertexData = this.getEmptyVertexData(iCount, pDecl);

                    akra.debug.assert(!akra.isNull(pVertexData), "Could not allocate vertex data!");

                    pVertexData.setData(pData, 0, pDecl.stride);

                    return pVertexData;
                };

                VertexBuffer.isVBO = function (pBuffer) {
                    return pBuffer.getType() === 1 /* VBO */;
                };

                VertexBuffer.isTBO = function (pBuffer) {
                    return pBuffer.getType() === 2 /* TBO */;
                };
                return VertexBuffer;
            })(akra.pool.resources.HardwareBuffer);
            resources.VertexBuffer = VertexBuffer;
        })(pool.resources || (pool.resources = {}));
        var resources = pool.resources;
    })(akra.pool || (akra.pool = {}));
    var pool = akra.pool;
})(akra || (akra = {}));
//# sourceMappingURL=VertexBuffer.js.map
