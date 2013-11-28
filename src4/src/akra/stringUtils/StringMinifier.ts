/// <reference path="../idl/IMap.ts" />

module akra.stringUtils {
    export class StringMinifier {
        private _pMinMap: IMap<int> = <IMap<int>>{};
        private _nCount: uint = 1;

        minify(sValue: string): uint {
            return this._pMinMap[sValue] || (this._pMinMap[sValue] = this._nCount++);
        }
    }
}


