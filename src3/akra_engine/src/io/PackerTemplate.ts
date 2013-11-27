/// <reference path="../idl/AIPackerFormat.ts" />

import logger = require("logger");

class PackerTemplate {
    protected _pData: AIPackerFormat = <AIPackerFormat>{};
    protected _nTypes: uint = 0;
    protected _pNum2Tpl: AIMap<string> = <AIMap<string>>{};
    protected _pTpl2Num: AIMap<int> = <AIMap<int>>{};

    constructor(pData?: AIPackerFormat) {
        if (isDef(pData)) {
            this.set(pData);
        }
    }

    getType(iType: int): string {
        logger.presume(isDef(this._pNum2Tpl[iType]), "unknown type detected: " + iType);
        return this._pNum2Tpl[iType];
    }

    getTypeId(sType: string): int {
        logger.presume(isDef(this._pTpl2Num[sType]), "unknown type detected: " + sType);
        return this._pTpl2Num[sType];
    }

    set(pFormat: AIPackerFormat): void {
        var iType: int;

        for (var i in pFormat) {
            this._pData[i] = pFormat[i];

            iType = this._nTypes++;

            this._pNum2Tpl[iType] = i;
            this._pTpl2Num[i] = iType;
        }
    }

    detectType(pObject: any): string {
        return PackerTemplate.getClass(pObject);
    }

    resolveType(sType: string): string {
        var pTemplates: AIPackerFormat = this._pData;
        var pProperties: AIPackerCodec;
        var sProperties: string;


        while (isString(sProperties = pTemplates[sType])) {
            sType = sProperties;
        }

        logger.presume(!isString(sProperties), "cannot resolve type: " + sType);

        return sType;
    }

    properties(sType): AIPackerCodec {
        var pProperties: any = this._pData[sType];

        if (isString(pProperties)) {
            return this.properties(this.resolveType(sType));
        }

        return <AIPackerCodec>pProperties;
    }

    data(): AIPackerFormat {
        return this._pData;
    }

    static getClass(pObj: any): string {
        if (pObj &&
            isObject(pObj) &&
            Object.prototype.toString.call(pObj) !== "[object Array]" &&
            isDefAndNotNull(pObj.constructor) && pObj != window) {

            var arr: string[] = pObj.constructor.toString().match(/function\s*(\w+)/);

            if (!isNull(arr) && arr.length == 2) {
                return arr[1];
            }
        }

        var sType: string = typeOf(pObj);

        if (sType === "array" && isDef(pObj.$type)) {
            sType = pObj.$type;
        }

        return sType[0].toUpperCase() + sType.substr(1);
    }
}


export = PackerTemplate;