/// <reference path="../idl/IObjectList.ts" />
/// <reference path="../logger.ts" />
/// <reference path="ObjectArray.ts" />

module akra.util {
	export class ObjectList<T> implements IObjectList<T> {
		protected _pHead: IObjectListItem<T> = null;
		protected _pTail: IObjectListItem<T> = null;
		protected _pCurrent: IObjectListItem<T> = null;
		protected _iLength: uint = 0;
		protected _bLock: boolean = false;


		getLength(): uint {
			return this._iLength;
		}

		getFirst(): T {
			this._pCurrent = this._pHead;
			return (isDefAndNotNull(this._pCurrent)) ? this._pCurrent.data : null;
		}

		getLast(): T {
			this._pCurrent = this._pTail;
			return (isDefAndNotNull(this._pCurrent)) ? this._pCurrent.data : null;
		}

		getCurrent(): T {
			return (isDefAndNotNull(this._pCurrent)) ? this._pCurrent.data : null;
		}

		lock(): void {
			this._bLock = true;
		}

		unlock(): void {
			this._bLock = false;
		}

		isLocked(): boolean {
			return this._bLock;
		}

		value(n: uint): T {
			return this.find(n).data;
		}

		constructor(pData?: T[]) {
			if (arguments.length) {
				this.fromArray(pData);
			}
		}

		indexOf(pData: T, iFrom: uint = 0): int {
			var pItem: IObjectListItem<T> = this.find(iFrom);

			for (var i: uint = iFrom; i < this._iLength; i++) {
				if (pItem.data === pData) {
					return i;
				}
				pItem = pItem.next;
			}
			return -1;
		}

		mid(iPos: uint = 0, iSize: uint = this._iLength): IObjectList<T> {
			iSize = Math.min(this._iLength - iPos, iSize);

			if (iPos > this._iLength - 1) {
				return null;
			}

			var pNewList: IObjectList<T> = new ObjectList<T>();
			var pItem: IObjectListItem<T> = this.find(iPos);

			for (var i: int = 0; i < iSize; ++i) {
				pNewList.push(pItem.data);
				pItem = pItem.next;
			}

			return pNewList;
		}

		slice(iStart: uint = 0, iEnd: uint = Math.max(this._iLength - iStart, 0)): IObjectList<T> {
			return this.mid(iStart, iEnd - iStart);
		}

		move(iFrom: uint, iTo: uint): IObjectList<T> {
			return this.insert(iTo - 1, this.takeAt(iFrom));
		}

		replace(iPos: uint, pData: T): IObjectList<T> {
			logger.presume(!this.isLocked());
			this.find(iPos).data = pData;
			return this;
		}

		erase(pos: uint): IObjectList<T>;
		erase(begin: uint, end: uint): IObjectList<T>;
		erase(begin: uint, end?: uint): IObjectList<T> {
			if (arguments.length < 2) {
				this.takeAt(<uint>arguments[0]);
			}
			else {
				end = Math.min(end, this._iLength);
				for (var i: uint = begin; i < end; i++) {
					this.takeAt(i);
				}
			}
			return this;
		}

		contains(pData: T): boolean {
			return (this.indexOf(pData) >= 0);
		}

		removeAt(n: uint): void {
			this.takeAt(n);
		}

		removeOne(pData: T): void {
			this.removeAt(this.indexOf(pData));
		}

		removeAll(pData: T): uint {
			var i: int;
			var n: uint = this.getLength();

			while ((i = this.indexOf(pData)) >= 0) {
				this.removeAt(i);
				i--;
			}

			return n;
		}

		swap(i: uint, j: uint): IObjectList<T> {
			logger.presume(!this.isLocked());

			i = Math.min(i, this._iLength - 1);
			j = Math.min(j, this._iLength - 1);

			if (i != j) {
				var pItem1: IObjectListItem<T> = this.find(i);
				var pItem2: IObjectListItem<T> = this.find(j);

				var pTmp: T = pItem1.data;

				pItem1.data = pItem2.data;
				pItem2.data = pTmp;
			}

			return this;
		}

		add(pList: IObjectList<T>): IObjectList<T> {
			pList.seek(0);
			//FIXME: what's this mean?
			if (pList.getLength() > 1) {
				this.push(pList.getFirst());
			}

			for (var i: uint = 1; i < pList.getLength(); i++) {
				this.push(pList.next());
			}

			return this;
		}

		seek(n: int = 0): IObjectList<T> {
			var pElement: IObjectListItem<T>;

			n = Math.min(n, this._iLength - 1);

			if (n > this._iLength / 2) {
				pElement = this._pTail;

				for (var m: uint = this._iLength - 1 - n; m > 0; --m) {
					pElement = pElement.prev;
				}
			}
			else {
				pElement = this._pHead;

				for (var i: int = 0; i < n; ++i) {
					pElement = pElement.next;
				}
			}

			this._pCurrent = pElement;

			return this;
		}

		next(): T {
			return (isDefAndNotNull(this._pCurrent) && isDefAndNotNull(this._pCurrent.next)) ? (this._pCurrent = this._pCurrent.next).data : null;
		}

		prev(): T {
			return (isDefAndNotNull(this._pCurrent) && isDefAndNotNull(this._pCurrent.prev)) ? (this._pCurrent = this._pCurrent.prev).data : null;
		}

		push(pElement: T): IObjectList<T> {
			return this.insert(this._iLength, pElement)
		}

		takeAt(n: int): T {
			logger.presume(!this.isLocked(), "list locked.");

			if (n < 0) {
				return null;
			}

			return this.pullElement(this.find(n));
		}

		private pullElement(pItem: IObjectListItem<T>): T {
			if (isNull(pItem)) {
				//this case theoretically cannot happen, but ....
				return null;
			}

			if (isNull(pItem.prev)) {
				this._pHead = pItem.next;
			}
			else {
				pItem.prev.next = pItem.next;
			}

			if (isNull(pItem.next)) {
				this._pTail = pItem.prev;
			}
			else {
				pItem.next.prev = pItem.prev;
			}

			this._iLength--;

			if (isNull(pItem.next)) {
				this._pCurrent = this._pTail;
			}
			else {
				this._pCurrent = pItem.next;
			}

			return this.releaseItem(pItem);
		}


		takeFirst(): T {
			return this.takeAt(0);
		}

		takeLast(): T {
			return this.takeAt(this._iLength - 1);
		}

		takeCurrent(isPrev: boolean = false): T {
			return this.pullElement(this._pCurrent);
		}

		pop(): T {
			return this.takeAt(this._iLength - 1);
		}

		prepend(pElement: T): IObjectList<T> {
			return this.insert(0, pElement)
		}

		private find(n: uint): IObjectListItem<T> {
			if (n < this._iLength) {
				this.seek(n);
				return this._pCurrent;
			}

			return null;
		}

		private releaseItem(pItem: IObjectListItem<T>): T {
			var pData: T = pItem.data;

			pItem.next = null;
			pItem.prev = null;
			pItem.data = null;

			ObjectList._pool.push(pItem);

			return pData;
		}

		private createItem(): IObjectListItem<T> {
			if (ObjectList._pool.getLength() === 0) {
			return { next: null, prev: null, data: null }
		}
			return <IObjectListItem<T>>ObjectList._pool.pop();
		}

		fromArray(elements: T[], iOffset: uint = 0, iSize: uint = elements.length): IObjectList<T> {
			iOffset = Math.min(iOffset, this._iLength);

			for (var i: uint = 0; i < iSize; i++) {
				this.insert(iOffset + i, elements[i]);
			}

			return this;
		}

		insert(n: uint, pData: T): IObjectList<T> {
			logger.presume(!this.isLocked());

			var pNew: IObjectListItem<T> = this.createItem();
			var pItem: IObjectListItem<T>;

			n = Math.min(n, this._iLength);
			pNew.data = pData;

			pItem = this.find(n - 1);

			if (pItem == null) {
				this._pHead = pNew;
			}
			else {

				if (pItem.next == null) {
					this._pTail = pNew;
				}
				else {
					pNew.next = pItem.next;
					pItem.next.prev = pNew;
				}

				pItem.next = pNew;
				pNew.prev = pItem;
			}


			this._iLength++;
			this._pCurrent = pNew;

			return this;
		}

		isEqual(pList: IObjectList<T>): boolean {
			if (this._iLength == pList.getLength()) {
				if (this === pList) {
					return true;
				}

				var l1: T = this.getFirst();
				var l2: T = pList.getFirst();

				for (var i: uint = 0; i < this._iLength; ++i) {
					if (l1 !== l2) {
						return false;
					}

					l1 = this.next();
					l2 = pList.next();
				}

				return true;
			}

			return false;
		}

		clear(): IObjectList<T> {
			logger.presume(!this.isLocked());

			var pPrev: IObjectListItem<T>;
			var pNext: IObjectListItem<T>;

			this._pCurrent = this._pHead;

			for (var i: uint = 0; i < this._iLength; ++i) {
				pPrev = this._pCurrent;
				pNext = this._pCurrent = this._pCurrent.next;

				this.releaseItem(pPrev);
			}

			this._pHead = this._pCurrent = this._pTail = null;
			this._iLength = 0;

			return this;
		}

		forEach(fn: IListExplorerFunc<T>): void {
			var pItem: IObjectListItem<T> = this._pHead;
			var n: uint = 0;
			do {
				if (fn(pItem.data, n++) === false) {
					return;
				}
			} while ((pItem = pItem.next));
		}

		private static _pool: IObjectArray<any> = new ObjectArray<any>();
	}

}