#ifndef STRINGMINIFIER_TS
#define STRINGMINIFIER_TS

#include "common.ts"

module akra.util {
	export class StringMinifier {
		private _pMinMap: IntMap = <IntMap>{};
		private _nCount: uint = 1;

		inline minify(sValue: string): uint {
			return this._pMinMap[sValue] || (this._pMinMap[sValue] = this._nCount++);
		}
	}
}

#endif