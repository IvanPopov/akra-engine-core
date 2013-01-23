#ifndef IOBJECTLIST_TS
#define IOBJECTLIST_TS

module akra {
	export interface IListExplorerFunc {
		(data: any): bool;
		//(data: any): void;
	}

	/** ObjectList interface. */
	export interface IObjectList {
		/** Number of elements in list */
		length: uint;
		/** First element in list */
		first: any;
		/** Last element in list */
		last: any;
		/** Current element in list */
		current: any;

		/** Lock list for midifications. */
		lock(): void;
		/** Unlock list */
		unlock(): void;
		/** Is list locked ? */
		isLocked(): bool;

		/** Set current element to <n> position. */
		seek(n?: int): IObjectList;
		/** Get next element */
		next(): any;
		/** Get prev element */
		prev(): any;
		/** Push element to end of list. */
		push(element: any): IObjectList;
		/** Pop element from end of list. */
		pop(): any;
		/** Add element to list head. */
		prepend(element: any): IObjectList;

		/** Add element from array. */
		fromArray(elements: any[], iOffset?: uint, iSize?: uint): IObjectList;

		/** Insert element before <n> element. */
		insert(n: uint, data: any): IObjectList;
		/** Get valuie of <n> element */
		value(n: uint, defaultValue?: any): any;
		/** Get index of element with given data */
		indexOf(element: any, from?: uint): int;
		/** Get sub list from this list */
		mid(pos: uint, size: uint): IObjectList;
		/** Move element from <from> postion to <to> position.*/
		move(from: uint, to: uint): IObjectList;

		/** Replace data of <n> element. */
		replace(pos: uint, value: any): IObjectList;
		/** Erase element with number <n>. */
		erase(pos: uint): IObjectList;
		/** Erase elements from begin to end. */
		erase(begin: uint, end: uint): IObjectList;
		/** Is list contains data with <value>?*/
		contains(value: any): bool;

		/** Get data of <n> item and remove it. */
		takeAt(pos: uint): any;
		/** Get data of first item and remove it. */
		takeFirst(): any;
		/** Get data of last item and remove it. */
		takeLast(): any;

		/** Remove <n> item. */
		removeAt(n: uint): void;
		/** Remove one lement with data <element>. */
		removeOne(element: any): void;
		/** Remove all lement with data <element>. */
		removeAll(element: any): uint;

		/** Swap items. */
		swap(i: int, j: int): IObjectList;
		/** Add another list to this */
		add(list: IObjectList): IObjectList;
		/** Is this list equal to <list>. */
		isEqual(list: IObjectList): bool;

		/** Clear list. */
		clear(): IObjectList;
		/** For each loop. */
		forEach(fn: IListExplorerFunc): void;
	}
}



#endif
