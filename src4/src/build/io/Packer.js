/// <reference path="../idl/IPacker.ts" />
/// <reference path="../idl/IMap.ts" />
/// <reference path="../idl/IPackerFormat.ts" />
/// <reference path="BinWriter.ts" />
/// <reference path="../logger.ts" />
/// <reference path="../limit.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (io) {
        var Packer = (function (_super) {
            __extends(Packer, _super);
            function Packer(pTemplate) {
                _super.call(this);
                this._pHashTable = {};
                this.x = 0;
                this._pTemplate = pTemplate;
            }
            Packer.prototype.getTemplate = function () {
                return this._pTemplate;
            };

            Packer.prototype.memof = function (pObject, iAddr, sType) {
                if (sType === "Number") {
                    return;
                }

                var pTable = this._pHashTable;
                var pCell = pTable[sType];

                if (!akra.isDef(pCell)) {
                    pCell = pTable[sType] = [];
                }

                pCell.push(pObject, iAddr);
            };

            Packer.prototype.addr = function (pObject, sType) {
                if (sType === "Number") {
                    return -1;
                }

                var pTable = this._pHashTable;
                var iAddr;
                var pCell = pTable[sType];

                if (akra.isDef(pCell)) {
                    for (var i = 0, n = pCell.length / 2; i < n; ++i) {
                        var j = 2 * i;

                        if (pCell[j] === pObject) {
                            return pCell[j + 1];
                        }
                    }
                }

                return -1;
            };

            Packer.prototype.nullPtr = function () {
                return this.uint32(akra.MAX_UINT32);
            };

            Packer.prototype.rollback = function (n) {
                if (typeof n === "undefined") { n = 1; }
                if (n === -1) {
                    n = this._pArrData.length;
                }

                var pRollback = new Array(n);
                var iRollbackLength = 0;

                for (var i = 0; i < n; ++i) {
                    pRollback[i] = this._pArrData.pop();
                    iRollbackLength += pRollback[i].byteLength;
                }

                this._iCountData -= iRollbackLength;

                return pRollback;
            };

            Packer.prototype.append = function (pData) {
                if (akra.isArray(pData)) {
                    for (var i = 0; i < pData.length; ++i) {
                        this._pArrData.push(pData[i]);
                        this._iCountData += pData[i].byteLength;
                    }
                } else {
                    if (akra.isArrayBuffer(pData)) {
                        pData = new Uint8Array(pData);
                    }
                    this._pArrData.push(pData);
                    this._iCountData += pData.byteLength;
                }
            };

            Packer.prototype.writeData = function (pObject, sType) {
                var pTemplate = this.getTemplate();
                var pProperties = pTemplate.properties(sType);
                var fnWriter = null;

                fnWriter = pProperties.write;

                this.x++;
                if (this.x % 1000 == 0)
                    console.log((this.getByteLength() / (1024 * 1024)).toFixed(2), "mb");

                if (!akra.isNull(fnWriter)) {
                    if (fnWriter.call(this, pObject) === false) {
                        akra.logger.error("cannot write type: " + sType);
                    }

                    return true;
                }

                akra.debug.assert(akra.isDefAndNotNull(pProperties), "unknown object <" + sType + "> type cannot be writed");
                return true;
            };

            Packer.prototype.write = function (pObject, sType) {
                if (typeof sType === "undefined") { sType = null; }
                var pProperties;
                var iAddr, iType;
                var pTemplate = this.getTemplate();

                if (akra.isNull(pObject)) {
                    this.nullPtr();
                    return false;
                }

                if (akra.isNull(sType)) {
                    sType = pTemplate.detectType(pObject);
                }

                pProperties = pTemplate.properties(sType);
                iType = pTemplate.getTypeId(sType);

                if (!akra.isDef(pObject) || !akra.isDef(iType)) {
                    this.nullPtr();
                    return false;
                }

                iAddr = this.addr(pObject, sType);

                if (iAddr < 0) {
                    iAddr = this.getByteLength() + 4 + 4;

                    this.uint32(iAddr);
                    this.uint32(iType);

                    if (this.writeData(pObject, sType)) {
                        this.memof(pObject, iAddr, sType);
                    } else {
                        this.rollback(2);
                        this.nullPtr();
                    }
                } else {
                    this.uint32(iAddr);
                    this.uint32(iType);
                }

                return true;
            };
            return Packer;
        })(akra.io.BinWriter);
        io.Packer = Packer;
    })(akra.io || (akra.io = {}));
    var io = akra.io;
})(akra || (akra = {}));
//# sourceMappingURL=Packer.js.map
