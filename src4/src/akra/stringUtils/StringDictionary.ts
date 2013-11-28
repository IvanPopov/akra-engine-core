/// <reference path="../idl/IStringDictionary.ts" />
/// <reference path="../idl/IMap.ts" />

module akra.stringUtils {
    export class StringDictionary implements IStringDictionary {
        private _pDictionary: IMap<int> = null;
        private _pIndexToEntryMap: IMap<string> = null;

        private _nEntryCount: uint = 1;

        constructor() {
            this._pDictionary = <IMap<int>>{};
            this._pIndexToEntryMap = <IMap<string>>{};
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
}