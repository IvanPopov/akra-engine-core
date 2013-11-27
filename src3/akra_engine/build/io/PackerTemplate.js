/// <reference path="../idl/AIPackerFormat.ts" />
define(["require", "exports", "logger"], function(require, exports, __logger__) {
    var logger = __logger__;

    var PackerTemplate = (function () {
        function PackerTemplate(pData) {
            this._pData = {};
            this._nTypes = 0;
            this._pNum2Tpl = {};
            this._pTpl2Num = {};
            if (isDef(pData)) {
                this.set(pData);
            }
        }
        PackerTemplate.prototype.getType = function (iType) {
            logger.presume(isDef(this._pNum2Tpl[iType]), "unknown type detected: " + iType);
            return this._pNum2Tpl[iType];
        };

        PackerTemplate.prototype.getTypeId = function (sType) {
            logger.presume(isDef(this._pTpl2Num[sType]), "unknown type detected: " + sType);
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

            while (isString(sProperties = pTemplates[sType])) {
                sType = sProperties;
            }

            logger.presume(!isString(sProperties), "cannot resolve type: " + sType);

            return sType;
        };

        PackerTemplate.prototype.properties = function (sType) {
            var pProperties = this._pData[sType];

            if (isString(pProperties)) {
                return this.properties(this.resolveType(sType));
            }

            return pProperties;
        };

        PackerTemplate.prototype.data = function () {
            return this._pData;
        };

        PackerTemplate.getClass = function (pObj) {
            if (pObj && isObject(pObj) && Object.prototype.toString.call(pObj) !== "[object Array]" && isDefAndNotNull(pObj.constructor) && pObj != window) {
                var arr = pObj.constructor.toString().match(/function\s*(\w+)/);

                if (!isNull(arr) && arr.length == 2) {
                    return arr[1];
                }
            }

            var sType = typeOf(pObj);

            if (sType === "array" && isDef(pObj.$type)) {
                sType = pObj.$type;
            }

            return sType[0].toUpperCase() + sType.substr(1);
        };
        return PackerTemplate;
    })();

    
    return PackerTemplate;
});
//# sourceMappingURL=PackerTemplate.js.map
