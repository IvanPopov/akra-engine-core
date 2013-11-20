/// <reference path="../idl/AIPacker.ts" />
/// <reference path="../idl/AIMap.ts" />
/// <reference path="../idl/AIPackerFormat.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "io/BinWriter", "limit", "logger"], function(require, exports, __BinWriter__, __limit__, __logger__) {
    var BinWriter = __BinWriter__;

    var limit = __limit__;
    var logger = __logger__;

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

            if (!isDef(pCell)) {
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

            if (isDef(pCell)) {
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
            return this.uint32(limit.MAX_UINT32);
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
            if (isArray(pData)) {
                for (var i = 0; i < (pData).length; ++i) {
                    this._pArrData.push((pData)[i]);
                    this._iCountData += (pData)[i].byteLength;
                }
            } else {
                if (isArrayBuffer(pData)) {
                    pData = new Uint8Array(pData);
                }
                this._pArrData.push(pData);
                this._iCountData += (pData).byteLength;
            }
        };

        Packer.prototype.writeData = function (pObject, sType) {
            var pTemplate = this.getTemplate();
            var pProperties = pTemplate.properties(sType);
            var fnWriter = null;

            fnWriter = pProperties.write;

            this.x++;
            if (this.x % 1000 == 0)
                console.log((this.byteLength / (1024 * 1024)).toFixed(2), "mb");

            if (!isNull(fnWriter)) {
                if (fnWriter.call(this, pObject) === false) {
                    logger.error("cannot write type: " + sType);
                }

                return true;
            }

            logger.presume(isDefAndNotNull(pProperties), "unknown object <" + sType + "> type cannot be writed");
            return true;
        };

        Packer.prototype.write = function (pObject, sType) {
            if (typeof sType === "undefined") { sType = null; }
            var pProperties;
            var iAddr, iType;
            var pTemplate = this.getTemplate();

            if (isNull(pObject)) {
                this.nullPtr();
                return false;
            }

            if (isNull(sType)) {
                sType = pTemplate.detectType(pObject);
            }

            pProperties = pTemplate.properties(sType);
            iType = pTemplate.getTypeId(sType);

            if (!isDef(pObject) || !isDef(iType)) {
                this.nullPtr();
                return false;
            }

            iAddr = this.addr(pObject, sType);

            if (iAddr < 0) {
                iAddr = this.byteLength + 4 + 4;

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
    })(BinWriter);

    
    return Packer;
});
//# sourceMappingURL=Packer.js.map
