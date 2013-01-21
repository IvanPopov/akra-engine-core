#ifndef OBJECTLIST_TS
#define OBJECTLIST_TS

#include "IObjectList.ts"
#include "ObjectArray.ts"

module akra.util {
	export interface IObjectListItem {
		next: IObjectListItem;
		prev: IObjectListItem;
		data: any;
	};

	var pListItemPool: IObjectArray = new ObjectArray;

	export class ObjectList implements IObjectList {
		protected _pHead: IObjectListItem = null;
		protected _pTail: IObjectListItem = null;
		protected _pCurrent: IObjectListItem = null;
		protected _iLength: uint = 0;
		protected _bLock: bool = false;


		inline get length(): any{
			return this._iLength;
		};

		inline get first(): any{
			return this.value(0);
		};

		inline get last(): any{
			return this.value(this._iLength - 1);
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

		inline value(n: uint): any{
			return this.find(n).data;
		};

		indexOf(pData: any, iFrom: uint = 0.): int{
			var pItem: IObjectListItem = this.find(iFrom);

			for(var i: uint = iFrom; i<this._iLength; i++){
				if(pItem.data === pData){
					return i;
				}
				pItem = pItem.next;
			}
			return -1;
		};

		mid(iPos: uint = 0, iSize: uint = this._iLength): IObjectList{

			iSize = math.min(this._iLength - iPos, iSize);

			if(iPos > this._iLength-1){
				return null;
			}

			var pNewList: IObjectList = new ObjectList();
			var pItem: IObjectListItem = this.find(iPos);

			for (var i: int = 0; i < iSize; ++ i) {
				pNewList.push(pItem.data);
				pItem = pItem.next;
			};

			return pNewList;
		};

		inline move(iFrom: uint, iTo: uint): IObjectList{
			return this.insert(iTo - 1, this.takeAt(iFrom));
		};

		inline replace(iPos: uint, pData: any): IObjectList{
			this.find(iPos).data = pData;
			return this;
		};

		erase(pos: uint): IObjectList;
		erase(begin: uint, end: uint): IObjectList;
		erase(begin: uint, end?: uint): IObjectList{
			if(arguments.length < 2){
				this.takeAt(pos);
			}
			else{
				end = math.min(end, this._iLength);
				for(var i: uint = begin; i < end; i++){
					this.takeAt(i);
				}
			}
			return this;
		};

		inline contains(pData: any): bool{
			return (this.indexOf(pData) >= 0);
		};

		inline removeAt(n: uint): void{
			this.takeAt(n);
		};

		inline removeOne(pData: any): void{
			this.removeAt(this.indexOf(pData));	
		};

		inline removeAll(pData: any): void{
			var i: int;
			while((i = this.indexOf(pData)) >= 0){
				this.removeAt(i);
				i--;
			}
		};

		swap(i: uint, j: uint): IObjectList{
			i = math.min(i, this._iLength-1);
			j = math.min(j, this._iLength-1);

			if(i!=j){
				var pItem1: IObjectList = this.find(i);
				var pItem2: IObjectList = this.find(j);

				var pTmp: any = pItem1.data;
				pItem1.data = pItem2.data;
				pItem2.data = pTmp;
			}

			return this;
		};

		add(pList: IObjectList): IObjectList{
			pList.seek(0);
			if(pList.length > 1){
				this.push(pList.first());
			}
			for(var i: uint=1; i<pList.length; i++){
				this.push(pList.next());
			}
		};

		seek(n: int = 0): IObjectList {
			var pElement: IObjectListItem;

			n = math.min(n, this._iLength);

			if (n > this._iLength / 2) {
				pElement = this._pTail;

				for (m: uint = this._iLength - 1 - n; m > 0; -- m) {
					pElement = pElement.prev;
				}				
			}
			else {
				pElement = this._pHead;
				
				for (var i: int = 0; i < n; ++ i) {
					pElement = pElement.next;
				}
			}

			this._pCurrent = pElement;

			return this;
		};

		inline next(): any {
			return (isDefAndNotNull(this._pCurrent) && isDefAndNotNull(this._pCurrent.next))? (this._pCurrent = this._pCurrent.next).data: null;
		}

		inline prev(): any {
			return (isDefAndNotNull(this._pCurrent) && isDefAndNotNull(this._pCurrent.prev))? (this._pCurrent = this._pCurrent.prev).data: null;
		}

		inline push(pElement: any): IObjectList{
			return this.insert(this.nLength-1,pElement)
		};

		inline takeAt(n: int): any{

			if(n<0){
				return null;
			}

			var pItem: IObjectListItem = this.find(n);

			if(isNull(pItem.prev)){
				this._pHead = pItem.next;
			}
			else{
				pItem.prev.next = pItem.next;
			}

			if(isNull(pItem.next)){
				this._pTail = pItem.prev;
			}
			else{
				pItem.next.prev = pItem.prev;
			}

			this.releaseItem(pItem);

			this._iLength--;

			return pItem.data;
		};


		inline takeFirst(): any{
			return this.takeAt(0);
		};

		inline takeLast(): any{
			return this.takeAt(this._iLength - 1);
		};

		inline pop(): any{
			return this.takeAt(this._iLength - 1);
		};

		inline prepend(pElement: any): IObjectList{
			return this.insert(0,pElement)
		};

		inline private find(n: uint): IObjectListItem{
			this.seek(n);
			return this._pCurrent;
		};

		inline private releaseItem(pItem: IObjectListItem): void{
			pItem.next = pItem.prev = pItem.data = null;
			pListItemPool.push(pItem);
		};

		fromArray(elements: any[], iOffset: uint = 0, iSize: uint = this._iLength): IObjectList{
			iOffset = math.min(iOffset, this._iLength);

			for(var i: uint=0; i<iSize; i++){
				this.insert(iOffset+i, elements[i]);
			}

			return this;
		}

		insert(n:uint ,pData: any): IObjectList{
			n = math.min(n, this._iLength);

			var pNew: IObjectListItem = pListItemPool.pop();
			pNew.data = pData;

			var pItem: IObjectListItem = this.find(n-1);

			if(isNull(pItem.next)){
				this._pTail = pNew;
			}
			else{
				pNew.next = pItem.next;
			}

			if(isNull(pItem)){
				this._pHead = pNew;
			}
			else{
				pItem.next.prev = pNew;
				pItem.next = pNew;
				pNew.prev = pItem;
			}

			this._iLength++;

			return this;
		};
	}
}

#endif

