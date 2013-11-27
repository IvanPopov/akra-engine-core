/// <reference path="../idl/AIMap.ts" />

class StringMinifier {
    private _pMinMap: AIMap<int> = <AIMap<int>>{};
    private _nCount: uint = 1;

    minify(sValue: string): uint {
        return this._pMinMap[sValue] || (this._pMinMap[sValue] = this._nCount++);
    }
}

export = StringMinifier;

