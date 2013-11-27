var akra;
(function (akra) {
    /// <reference path="../idl/IVertexData.ts" />
    /// <reference path="../idl/IVertexBuffer.ts" />
    /// <reference path="../idl/IVertexElement.ts" />
    /// <reference path="../idl/IVertexDeclaration.ts" />
    /// <reference path="../idl/IBufferDataModifier.ts" />
    /// <reference path="../math/math.ts" />
    /// <reference path="../logger.ts" />
    /// <reference path="../events.ts" />
    /// <reference path="../conv/conv.ts" />
    /// <reference path="../config/config.ts" />
    /// <reference path="../guid.ts" />
    /// <reference path="VertexDeclaration.ts" />
    (function (data) {
        var AEVertexDataLimits;
        (function (AEVertexDataLimits) {
            AEVertexDataLimits[AEVertexDataLimits["k_MaxElementsSize"] = 256] = "k_MaxElementsSize";
        })(AEVertexDataLimits || (AEVertexDataLimits = {}));

        var VertexData = (function () {
            function VertexData(pVertexBuffer, id, iOffset, iCount, pDecl) {
                this.guid = akra.guid();
                this.resized = new akra.Signal(this);
                this.relocated = new akra.Signal(this);
                this.declarationChanged = new akra.Signal(this);
                this.updated = new akra.Signal(this);
                this._pVertexBuffer = pVertexBuffer;
                this._iOffset = iOffset;
                this._iLength = iCount;
                this._iId = id;
                this._pVertexDeclaration = null;
                this._iStride = 0;

                if (akra.isInt(pDecl)) {
                    this._iStride = pDecl;
                } else {
                    this._iStride = pDecl.stride;
                    this.setVertexDeclaration(pDecl);
                }

                akra.logger.assert(pVertexBuffer.byteLength >= this.byteLength + this.byteOffset, "vertex data out of array limits");
            }
            Object.defineProperty(VertexData.prototype, "id", {
                get: function () {
                    return this._iId;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(VertexData.prototype, "length", {
                get: function () {
                    return this._iLength;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(VertexData.prototype, "byteOffset", {
                get: function () {
                    return this._iOffset;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(VertexData.prototype, "byteLength", {
                get: function () {
                    return this._iLength * this._iStride;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(VertexData.prototype, "buffer", {
                get: function () {
                    return this._pVertexBuffer;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(VertexData.prototype, "stride", {
                get: function () {
                    return this._iStride;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(VertexData.prototype, "startIndex", {
                get: function () {
                    var iIndex = this.byteOffset / this.stride;
                    akra.logger.assert(iIndex % 1 == 0, "cannot calc first element index");
                    return iIndex;
                },
                enumerable: true,
                configurable: true
            });

            VertexData.prototype.getVertexDeclaration = function () {
                return this._pVertexDeclaration;
            };

            VertexData.prototype.setVertexDeclaration = function (pDecl) {
                if (this._pVertexDeclaration) {
                    //debug_error("vertex declaration already exists");
                    return false;
                }

                var iStride = pDecl.stride;

                this._pVertexDeclaration = pDecl.clone();

                akra.logger.assert(iStride < AEVertexDataLimits.k_MaxElementsSize, "stride max is 255 bytes");
                akra.logger.assert(iStride <= this.stride, "stride in VertexDeclaration grather than stride in construtor");

                this.declarationChanged.emit(this._pVertexDeclaration);

                return true;
            };

            VertexData.prototype.getVertexElementCount = function () {
                return this._pVertexDeclaration.length;
            };

            VertexData.prototype.hasSemantics = function (sUsage) {
                if (this._pVertexDeclaration != null) {
                    return this._pVertexDeclaration.hasSemantics(sUsage);
                }

                return false;
            };

            VertexData.prototype.destroy = function () {
                this._pVertexDeclaration = null;
                this._iLength = 0;
            };

            VertexData.prototype.extend = function (pDecl, pData) {
                if (typeof pData === "undefined") { pData = null; }
                pDecl = data.VertexDeclaration.normalize(pDecl);

                if (akra.isNull(pData)) {
                    pData = new Uint8Array(this.length * pDecl.stride);
                } else {
                    pData = new Uint8Array(pData.buffer);
                }

                akra.logger.assert(this.length === pData.byteLength / pDecl.stride, 'invalid data size for extending');

                var nCount = this._iLength;

                //strides modifications
                var nStrideNew = pDecl.stride;
                var nStridePrev = this.stride;
                var nStrideNext = nStridePrev + nStrideNew;

                //total bytes after extending
                var nTotalSize = nStrideNext * this.length;
                var pDeclNew = this.getVertexDeclaration().clone();

                //data migration
                var pDataPrev = new Uint8Array(this.getData());
                var pDataNext = new Uint8Array(nTotalSize);

                for (var i = 0, iOffset; i < nCount; ++i) {
                    iOffset = i * nStrideNext;
                    pDataNext.set(pDataPrev.subarray(i * nStridePrev, (i + 1) * nStridePrev), iOffset);
                    pDataNext.set((pData).subarray(i * nStrideNew, (i + 1) * nStrideNew), iOffset + nStridePrev);
                }

                if (!pDeclNew.extend(pDecl)) {
                    return false;
                }

                if (!this.resize(nCount, pDeclNew)) {
                    return false;
                }

                return this.setData(pDataNext, 0, nStrideNext);
            };

            VertexData.prototype.resize = function (nCount, pDecl) {
                var iStride = 0;
                var iOldOffset = this.byteOffset;
                var pOldVertexBuffer;
                var pOldVertexDeclaration;
                var iOldStride;

                if (arguments.length == 2) {
                    if (akra.isInt(pDecl)) {
                        iStride = pDecl;
                    } else {
                        iStride = (pDecl).stride;
                    }

                    if (nCount * iStride <= this.byteLength) {
                        this._iLength = nCount;
                        this._iStride = iStride;
                        this._pVertexDeclaration = null;

                        if (!akra.isInt(pDecl)) {
                            this.setVertexDeclaration(pDecl);
                        }

                        this.resized.emit(this.byteLength);
                        return true;
                    } else {
                        pOldVertexBuffer = this.buffer;

                        pOldVertexBuffer.freeVertexData(this);

                        if (pOldVertexBuffer.getEmptyVertexData(nCount, pDecl, this) !== this) {
                            return false;
                        }

                        if (this.byteOffset != iOldOffset) {
                            akra.logger.warn("vertex data moved from " + iOldOffset + " ---> " + this.byteOffset);
                            this.relocated.emit(iOldOffset, this.byteOffset);
                        }

                        this.resized.emit(this.byteLength);
                        return true;
                    }
                } else if (arguments.length == 1) {
                    if (nCount <= this.length) {
                        this._iLength = nCount;
                        this.resized.emit(this.byteLength);
                        return true;
                    } else {
                        pOldVertexBuffer = this.buffer;
                        pOldVertexDeclaration = this.getVertexDeclaration();
                        iOldStride = this.stride;

                        pOldVertexBuffer.freeVertexData(this);

                        if (pOldVertexBuffer.getEmptyVertexData(nCount, iOldStride, this) == null) {
                            return false;
                        }

                        this.setVertexDeclaration(pOldVertexDeclaration);

                        if (this.byteOffset != iOldOffset) {
                            akra.logger.warn("vertex data moved from " + iOldOffset + " ---> " + this.byteOffset);
                            this.relocated.emit(iOldOffset, this.byteOffset);
                        }

                        this.resized.emit(this.byteLength);
                        return true;
                    }
                }

                return false;
            };

            VertexData.prototype.applyModifier = function (sUsage, fnModifier) {
                var pData = this.getTypedData(sUsage);
                fnModifier(pData);
                return this.setData(pData, sUsage);
            };

            VertexData.prototype.setData = function (pData) {
                var iOffset;
                var iSize;
                var nCountStart;
                var nCount;

                var iStride;
                var pVertexBuffer = this._pVertexBuffer;
                var pBackupBuf;
                var pDataU8;
                var k;
                var iOffsetBuffer;
                var pDeclaration = this._pVertexDeclaration;
                var pElement;

                switch (arguments.length) {
                    case 5:
                        if (akra.isString(arguments[1])) {
                            iOffset = this._pVertexDeclaration.findElement(arguments[1]).offset;
                        } else {
                            iOffset = arguments[1];
                        }

                        iSize = arguments[2];
                        nCountStart = arguments[3];
                        nCount = arguments[4];

                        iStride = this.stride;
                        pDataU8 = new Uint8Array(pData.buffer);
                        if (iStride != iSize) {
                            if (pVertexBuffer.isBackupPresent() && nCount > 1) {
                                // console.log(pVertexBuffer.byteLength);
                                pBackupBuf = new Uint8Array(pVertexBuffer.byteLength);
                                pVertexBuffer.readData(pBackupBuf);

                                iOffsetBuffer = this.byteOffset;

                                for (var i = nCountStart; i < nCount + nCountStart; i++) {
                                    for (k = 0; k < iSize; k++) {
                                        pBackupBuf[iStride * i + iOffset + iOffsetBuffer + k] = pDataU8[iSize * (i - nCountStart) + k];
                                    }
                                }

                                pVertexBuffer.writeData(pBackupBuf, 0, pVertexBuffer.byteLength);
                            } else {
                                for (var i = 0; i < nCount; i++) {
                                    var iCurrent = i + nCountStart;

                                    pVertexBuffer.writeData(pDataU8.subarray(iSize * i, iSize * (i + 1)), iStride * iCurrent + iOffset + this.byteOffset, iSize);
                                }
                            }
                        } else {
                            pVertexBuffer.writeData(pDataU8.subarray(0, iStride * nCount), this.byteOffset + iStride * nCountStart, iStride * nCount);
                        }

                        this.updated.emit();
                        return true;
                    case 4:
                        pElement = null;

                        if (akra.isString(arguments[1])) {
                            pElement = pDeclaration.findElement(arguments[1]);

                            if (pElement) {
                                return this.setData(pData, pElement.offset, pElement.size, arguments[2], arguments[3]);
                            }

                            return false;
                        }

                        iOffset = arguments[1];
                        iSize = arguments[2];
                        nCountStart = arguments[3] || 0;
                        nCount = pData.byteLength / iSize;

                        return this.setData(pData, iOffset, iSize, nCountStart, nCount);

                    case 2:
                    case 3:
                        pDeclaration = this._pVertexDeclaration;
                        pElement = null;

                        if (akra.isString(arguments[1])) {
                            pElement = pDeclaration.findElement(arguments[1]);

                            if (pElement) {
                                //nCountStart = arguments[2] || 0
                                nCountStart = 0;
                                nCount = pData.buffer.byteLength / pElement.size;

                                return this.setData(pData, pElement.offset, pElement.size, nCountStart, nCount);
                            }

                            return false;
                        } else if (arguments.length === 3) {
                            iOffset = arguments[1];
                            iSize = arguments[2];
                            nCountStart = 0;
                            nCount = pData.byteLength / iSize;

                            return this.setData(pData, iOffset, iSize, nCountStart, nCount);
                        }

                        return false;

                    case 1:
                        return this.setData(pData, this._pVertexDeclaration.element(0).usage);
                    default:
                        return false;
                }
            };

            VertexData.prototype.getData = function () {
                switch (arguments.length) {
                    case 4:
                    case 2:
                        if (akra.isString(arguments[0])) {
                            return null;
                        }

                        var iOffset = arguments[0];
                        var iSize = arguments[1];
                        var iFrom = 0;
                        var iCount = this._iLength;

                        if (arguments.length === 4) {
                            iFrom = arguments[2] || 0;
                            iCount = arguments[3] || this._iLength;
                        }

                        iCount = akra.math.min(iCount, this._iLength);

                        var iStride = this.stride;
                        var pBufferData = new Uint8Array(iSize * iCount);

                        for (var i = 0; i < iCount; i++) {
                            var iCurrent = iFrom + i;
                            var isOk = this._pVertexBuffer.readData(iStride * iCurrent + iOffset + this.byteOffset, iSize, pBufferData.subarray(i * iSize, (i + 1) * iSize));
                            //debug_assert(isOk,"cannot read buffer");
                        }

                        return pBufferData.buffer;

                    case 3:
                    case 1:
                        var pDeclaration = this._pVertexDeclaration, pElement = null;

                        if (akra.isString("string")) {
                            pElement = pDeclaration.findElement(arguments[0]);

                            if (akra.isDefAndNotNull(pElement)) {
                                return this.getData(pElement.offset, pElement.size, arguments.length === 3 ? arguments[1] : 0, arguments.length === 3 ? arguments[2] : this._iLength);
                            }
                            return null;
                        }

                        return null;

                    case 0:
                        return this.getData(0, this._pVertexDeclaration.stride);
                    default:
                        return null;
                }
            };

            VertexData.prototype.getTypedData = function (sUsage, iFrom, iCount) {
                var pVertexElement = this._pVertexDeclaration.findElement(sUsage);

                if (pVertexElement) {
                    return akra.conv.abtota(this.getData(sUsage, iFrom, iCount), pVertexElement.type);
                }

                return null;
            };

            VertexData.prototype.getBufferHandle = function () {
                return this._pVertexBuffer.resourceHandle;
            };

            VertexData.prototype.toString = function () {
                if (akra.config.DEBUG) {
                    var s = "";

                    s += "		  VERTEX DATA  #" + this.id + "\n";
                    s += "---------------+-----------------------\n";
                    s += "		BUFFER : " + this.getBufferHandle() + "\n";
                    s += "		  SIZE : " + this.byteLength + " b.\n";
                    s += "		OFFSET : " + this.byteOffset + " b.\n";
                    s += "---------------+-----------------------\n";
                    s += " MEMBERS COUNT : " + this.length + " \n";
                    s += "		STRIDE : " + this.stride + " \n";
                    s += "---------------+-----------------------\n";
                    s += this.getVertexDeclaration().toString();

                    return s;
                }

                return null;
            };
            return VertexData;
        })();
        data.VertexData = VertexData;
    })(akra.data || (akra.data = {}));
    var data = akra.data;
})(akra || (akra = {}));
