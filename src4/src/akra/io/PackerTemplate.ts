/// <reference path="../idl/IPackerFormat.ts" />
/// <reference path="../logger.ts" />


module akra.io {

    export class PackerTemplate {
        protected _pData: IPackerFormat = <IPackerFormat>{};
        protected _nTypes: uint = 0;
        protected _pNum2Tpl: IMap<string> = <IMap<string>>{};
        protected _pTpl2Num: IMap<int> = <IMap<int>>{};

        constructor(pData?: IPackerFormat) {
            if (isDef(pData)) {
                this.set(pData);
            }
        }

        getType(iType: int): string {
            debug.assert(isDef(this._pNum2Tpl[iType]), "unknown type detected: " + iType);
            return this._pNum2Tpl[iType];
        }

        getTypeId(sType: string): int {
            debug.assert(isDef(this._pTpl2Num[sType]), "unknown type detected: " + sType);
            return this._pTpl2Num[sType];
        }

        set(pFormat: IPackerFormat): void {
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
            var pTemplates: IPackerFormat = this._pData;
            var pProperties: IPackerCodec;
            var sProperties: string;


            while (isString(sProperties = pTemplates[sType])) {
                sType = sProperties;
            }

            debug.assert(!isString(sProperties), "cannot resolve type: " + sType);

            return sType;
        }

        properties(sType): IPackerCodec {
            var pProperties: any = this._pData[sType];

            if (isString(pProperties)) {
                return this.properties(this.resolveType(sType));
            }

            return <IPackerCodec>pProperties;
        }

        data(): IPackerFormat {
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
}

