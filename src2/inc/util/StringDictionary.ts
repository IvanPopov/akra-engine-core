#ifndef STRINGDICTIONARY_TS
#define STRINGDICTIONARY_TS

#include "IStringDictionary.ts"

module akra.util {
	export class StringDictionary implements IStringDictionary {
		private _pDictionary: IntMap = null;
		private _pIndexToEntryMap: StringMap = null;

		private _nEntryCount: uint = 1;

		constructor(){
			this._pDictionary = <IntMap>{};
			this._pIndexToEntryMap = <StringMap>{};
		}

		add(sEntry: string): uint {
			if(!isDef(this._pDictionary[sEntry])){
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

#endif