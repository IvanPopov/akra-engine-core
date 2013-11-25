/// <reference path="../idl/AIStringDictionary.ts" />
/// <reference path="../idl/AIMap.ts" />

class StringDictionary implements AIStringDictionary {
    private _pDictionary: AIMap<int> = null;
    private _pIndexToEntryMap: AIMap<string> = null;

    private _nEntryCount: uint = 1;

    constructor() {
        this._pDictionary = <AIMap<int>>{};
        this._pIndexToEntryMap = <AIMap<string>>{};
    }

    add(sEntry: string): uint {
        if (!isDef(this._pDictionary[sEntry])) {
            this._pDictionary[sEntry] = this._nEntryCount++;
            this._pIndexToEntryMap[this._nEntryCount - 1] = sEntry;
        }

        return this._pDictionary[sEntry];
    }

    index(sEntry: string): uint {
        return this._pDictionary[sEntry] || 0;
    }

    findEntry(iIndex: string): string {
        return this._pIndexToEntryMap[iIndex];
    }
}


export = StringDictionary;