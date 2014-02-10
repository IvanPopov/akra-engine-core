/// <reference path="../idl/IPackerFormat.ts" />
/// <reference path="../logger.ts" />
var akra;
(function (akra) {
    (function (io) {
        var PackerTemplate = (function () {
            function PackerTemplate(pData) {
                this._pData = {};
                this._nTypes = 0;
                this._pNum2Tpl = {};
                this._pTpl2Num = {};
                if (akra.isDef(pData)) {
                    this.set(pData);
                }
            }
            PackerTemplate.prototype.getType = function (iType) {
                akra.debug.assert(akra.isDef(this._pNum2Tpl[iType]), "unknown type detected: " + iType);
                return this._pNum2Tpl[iType];
            };

            PackerTemplate.prototype.getTypeId = function (sType) {
                akra.debug.assert(akra.isDef(this._pTpl2Num[sType]), "unknown type detected: " + sType);
                return this._pTpl2Num[sType];
            };

            PackerTemplate.prototype.set = function (pFormat) {
                var iType;

                for (var i in pFormat) {
                    this._pData[i] = pFormat[i];

                    iType = this._nTypes++;

                    this._pNum2Tpl[iType] = i;
                    this._pTpl2Num[i] = iType;
                }
            };

            PackerTemplate.prototype.detectType = function (pObject) {
                return PackerTemplate.getClass(pObject);
            };

            PackerTemplate.prototype.resolveType = function (sType) {
                var pTemplates = this._pData;
                var pProperties;
                var sProperties;

                while (akra.isString(sProperties = pTemplates[sType])) {
                    sType = sProperties;
                }

                akra.debug.assert(!akra.isString(sProperties), "cannot resolve type: " + sType);

                return sType;
            };

            PackerTemplate.prototype.properties = function (sType) {
                var pProperties = this._pData[sType];

                if (akra.isString(pProperties)) {
                    return this.properties(this.resolveType(sType));
                }

                return pProperties;
            };

            PackerTemplate.prototype.data = function () {
                return this._pData;
            };

            PackerTemplate.getClass = function (pObj) {
                if (pObj && akra.isObject(pObj) && Object.prototype.toString.call(pObj) !== "[object Array]" && akra.isDefAndNotNull(pObj.constructor) && pObj != window) {
                    var arr = pObj.constructor.toString().match(/function\s*(\w+)/);

                    if (!akra.isNull(arr) && arr.length == 2) {
                        return arr[1];
                    }
                }

                var sType = akra.typeOf(pObj);

                if (sType === "array" && akra.isDef(pObj.$type)) {
                    sType = pObj.$type;
                }

                return sType[0].toUpperCase() + sType.substr(1);
            };
            return PackerTemplate;
        })();
        io.PackerTemplate = PackerTemplate;
    })(akra.io || (akra.io = {}));
    var io = akra.io;
})(akra || (akra = {}));
//# sourceMappingURL=PackerTemplate.js.map
