/// <reference path="../idl/AIUnPacker.ts" />
/// <reference path="../idl/AIMap.ts" />
/// <reference path="../idl/AIPackerFormat.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "io/BinReader", "limit", "logger"], function(require, exports, __BinReader__, __limit__, __logger__) {
    var BinReader = __BinReader__;

    var limit = __limit__;
    var logger = __logger__;

    var UnPacker = (function (_super) {
        __extends(UnPacker, _super);
        function UnPacker(pBuffer, pTemlate) {
            _super.call(this, pBuffer);
            this._pHashTable = {};
            this._pPositions = [];
        }
        UnPacker.prototype.getTemplate = function () {
            return this._pTemplate;
        };

        UnPacker.prototype.pushPosition = function (iPosition) {
            this._pPositions.push(this._iPosition);
            this._iPosition = iPosition;
        };

        UnPacker.prototype.popPosition = function () {
            this._iPosition = this._pPositions.pop();
        };

        UnPacker.prototype.memof = function (pObject, iAddr) {
            this._pHashTable[iAddr] = pObject;
        };

        UnPacker.prototype.memread = function (iAddr) {
            return this._pHashTable[iAddr] || null;
        };

        UnPacker.prototype.readPtr = function (iAddr, sType, pObject) {
            if (typeof pObject === "undefined") { pObject = null; }
            if (iAddr === limit.MAX_UINT32) {
                return null;
            }

            var pTmp = this.memread(iAddr);
            var isReadNext = false;
            var fnReader = null;
            var pTemplate = this.getTemplate();
            var pProperties;

            if (isDefAndNotNull(pTmp)) {
                return pTmp;
            }

            if (iAddr === this._iPosition) {
                isReadNext = true;
            } else {
                //set new position
                this.pushPosition(iAddr);
            }

            pProperties = pTemplate.properties(sType);

            logger.presume(isDefAndNotNull(pProperties), "unknown object <" + sType + "> type cannot be readed");

            fnReader = pProperties.read;

            if (isDefAndNotNull(fnReader)) {
                pTmp = fnReader.call(this, pObject);
                this.memof(pTmp, iAddr);

                if (!isReadNext) {
                    this.popPosition();
                }

                return pTmp;
            }

            logger.critical("unhandled case!");
            return null;
        };

        UnPacker.prototype.read = function () {
            var iAddr = this.uint32();

            if (iAddr === limit.MAX_UINT32) {
                return null;
            }

            var iType = this.uint32();
            var sType = this.getTemplate().getType(iType);

            return this.readPtr(iAddr, sType);
        };
        return UnPacker;
    })(BinReader);

    
    return UnPacker;
});
//# sourceMappingURL=UnPacker.js.map
