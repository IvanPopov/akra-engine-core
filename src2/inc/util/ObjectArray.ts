#ifndef OBJECTARRAY_TS
#define OBJECTARRAY_TS

#include "IObjectArray.ts"

module akra.util {
	export class ObjectArray implements IObjectArray {
		protected _pData: any[] = [];
		protected _bLock: bool = false;
		protected _iLength: uint = 0;

		inline get length(): uint {
			return this._iLength;
		}

		set length(n: uint) {
			
			if (this._bLock) {
				return;
			}

			this.extend(n);
			this._iLength = n;
		}

		constructor (pElements?: any[]) {
			if (arguments.length) {
				this.fromArray(pElements);
			}
		}

		inline lock(): void {
			this._bLock = true;
		}

		inline unlock(): void {
			this._bLock = false;
		}

		inline isLocked(): bool {
			return this._bLock;
		}

		clear(bRemoveLinks: bool = false): IObjectArray {
			
			debug_assert(!this._bLock, "cannot clear. array is locked.");

			this._iLength = 0;

			if (bRemoveLinks) {
				for (var i: int = 0; i < this._pData.length; ++ i) {
					this._pData[i] = null;
				}
			}

			return this;
		}

		release(): IObjectArray {
			this.clear(true);
			this._pData.clear();
		}

		inline value(n: uint): any {
			return this._pData[n];
		}

		private extend(n: uint): void {
			if (this._pData.length < n) {
				for (var i: int = this._pData.length; i < n; ++ i) {
					this._pData[i] = null;
				}
			}
		}

		insert(n: uint, pData: any): IObjectArray {
			debug_assert(!this._bLock, "cannot clear. array is locked.");

			var N: uint = n + 1;

			this.extend(N);

			if (this._iLength < N) {
				this._iLength = N;
			}
			
			this._pData[n] = pData;

			return this;
		}

		fromArray(pElements: any[], iOffset: uint = 0, iSize: uint = 0): IObjectArray {
			debug_assert(!this._bLock, "cannot clear. array is locked.");

			iSize = iSize > 0? math.min(iSize, pElements.length): pElements.length;

			this.extend(iSize);

			for (var i: int = iOffset, j: int = 0; i < iSize; ++ i, ++ j) {
				this._pData[i] = pElements[j];
			}

			return this;
		}

		inline push(pElement: any): IObjectArray {
			
			debug_assert(!this._bLock, "cannot clear. array is locked.");

			return this.set(this._iLength, pElement);
		}

		inline pop(): any {
			debug_assert(!this._bLock, "cannot clear. array is locked.");
			return this._iLength > 0? this._pData[this._iLength --]: null;
		}

		inline swap(i: uint, j: uint): IObjectArray {
			debug_assert(!this._bLock, "cannot clear. array is locked.");
			debug_assert(i < this._iLength && j < this._iLength, "invalid swap index.");

			this._pData.swap(i, j);

			return this;
		}

	}
}

module akra {
	export var ObjectArray = util.ObjectArray;
}

#endif
