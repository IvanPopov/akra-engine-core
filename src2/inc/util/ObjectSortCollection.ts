#ifndef OBJECTSORTCOLLECTION_TS
#define OBJECTSORTCOLLECTION_TS

#include "IObjectSortCollection.ts"

module akra.util {
	export class ObjectSortCollection implements IObjectSortCollection {
		private _iSize: uint = 0;
		private _iCursor: uint = 0;
		private _pElements: any[] = null;
		private _fnCollectionIndex: ICollectionIndexFunction = null;

		private _iCursorElementIndex: int = 0xFFFFFFFF;
		private _iStartElementIndex: int = 0xFFFFFFFF;
		private _iLastElementIndex: int = 0xFFFFFFFF;

		constructor(iSize: uint){
			this._iSize = iSize;
			this._pElements = new Array(iSize);
			this._iCursor = -1;

			for(var i: uint = 0; i < iSize; i++) {
				this._pElements[i] = null;
			}
		}

		push(pElement: any): void {
			if(this._iCursor === this._iSize - 1){
				this._iCursor = -1;
			}

			this._iCursor++;

			this._pElements[this._iCursor] = pElement;

			this._iCursorElementIndex = this._fnCollectionIndex.call(null, this._pElements[this._iCursor]);

			if(this._iCursor === 0){
				this._iStartElementIndex = this._fnCollectionIndex.call(null, this._pElements[0]);
			}
			else if(this._iCursor === this._iSize - 1){
				this._iLastElementIndex = this._fnCollectionIndex.call(null, this._pElements[this._iSize - 1]);
			}
		}

		findElement(iCollectionIndex: int): any {			
			if (this._iStartElementIndex === 0xFFFFFFFF ||
				this._iCursorElementIndex === 0xFFFFFFFF ||
				iCollectionIndex > this._iCursorElementIndex){

				return null;
			}

			if(iCollectionIndex >= this._iStartElementIndex){
				return this._pElements[iCollectionIndex - this._iStartElementIndex];
			}
			else if(iCollectionIndex <= this._iLastElementIndex){
				return this._pElements[this._iSize - 1 - (this._iLastElementIndex - iCollectionIndex)];
			}

			return null;
		}

		takeElement(iCollectionIndex: int): any {
			if (this._iStartElementIndex === 0xFFFFFFFF ||
				this._iCursorElementIndex === 0xFFFFFFFF ||
				iCollectionIndex > this._iCursorElementIndex){

				LOG("i must not be here 1");
				return null;
			}

			var iResultIndex: int = -1;

			if(iCollectionIndex >= this._iStartElementIndex){
				iResultIndex = iCollectionIndex - this._iStartElementIndex;
			}
			else if(iCollectionIndex <= this._iLastElementIndex){
				iResultIndex = this._iSize - 1 - (this._iLastElementIndex - iCollectionIndex);
			}

			if(iResultIndex >= 0){
				var pResult: any = this._pElements[iResultIndex];
				this._pElements[iResultIndex] = null;
				return pResult;
			}
			else {
				//LOG("i must not be here 2");
				return null;
			}
		}

		inline getElementAt(iIndex: uint): any {
			return this._pElements[iIndex];
		} 

		inline setElementAt(iIndex: uint, pValue: any): void {
			this._pElements[iIndex] = pValue;
		}

		inline removeElementAt(iIndex: uint): void {
			this._pElements[iIndex] = null;
		}

		clear(): void {
			this._iCursor = -1;

			for(var i: uint = 0; i < this._iSize - 1; i++){
				this._pElements[i] = null;
			}
		}

		setCollectionFuncion(fnCollection: ICollectionIndexFunction): void {
			this._fnCollectionIndex = fnCollection;
		}
	}
}

#endif