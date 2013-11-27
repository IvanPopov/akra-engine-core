

module akra {
	export interface IListExplorerFunc<T> {
	    (data: T, index?: uint): boolean;
	}
	
	export interface IObjectListItem<T> {
	    next: IObjectListItem<T>;
	    prev: IObjectListItem<T>;
	    data: T;
	}
	
	/** ObjectList export interface. */
	export interface IObjectList<T> {
		/** Number of elements in list */
		length: uint;
		/** First element in list */
	    first: T;
		/** Last element in list */
	    last: T;
		/** Current element in list */
	    current: T;
	
		/** Lock list for midifications. */
		lock(): void;
		/** Unlock list */
		unlock(): void;
		/** Is list locked ? */
		isLocked(): boolean;
	
		/** Set current element to <n> position. */
	    seek(n?: int): IObjectList<T>;
		/** Get next element */
	    next(): T;
		/** Get prev element */
	    prev(): T;
		/** Push element to end of list. */
	    push(element: T): IObjectList<T>;
		/** Pop element from end of list. */
	    pop(): T;
		/** Add element to list head. */
	    prepend(element: T): IObjectList<T>;
	
		/** Add element from array. */
	    fromArray(elements: T[], iOffset?: uint, iSize?: uint): IObjectList<T>;
	
		/** Insert element before <n> element. */
	    insert(n: uint, data: T): IObjectList<T>;
		/** Get valuie of <n> element */
	    value(n: uint, defaultValue?: T): T;
		/** Get index of element with given data */
	    indexOf(element: T, from?: uint): int;
		/** Get sub list from this list */
	    mid(pos?: uint, size?: uint): IObjectList<T>;
		/** slice from array */
	    slice(start?: uint, end?: uint): IObjectList<T>;
		/** Move element from <from> postion to <to> position.*/
	    move(from: uint, to: uint): IObjectList<T>;
	
		/** Replace data of <n> element. */
	    replace(pos: uint, value: T): IObjectList<T>;
		/** Erase element with number <n>. */
	    erase(pos: uint): IObjectList<T>;
		/** Erase elements from begin to end. */
	    erase(begin: uint, end: uint): IObjectList<T>;
		/** Is list contains data with <value>?*/
	    contains(value: T): boolean;
	
		/** Get data of <n> item and remove it. */
	    takeAt(pos: uint): T;
		/** Get data of first item and remove it. */
	    takeFirst(): T;
		/** Get data of last item and remove it. */
	    takeLast(): T;
		/** Get data of current item and remove it. */
	    takeCurrent(): T;
	
		/** Remove <n> item. */
		removeAt(n: uint): void;
		/** Remove one lement with data <element>. */
	    removeOne(element: T): void;
		/** Remove all lement with data <element>. */
	    removeAll(element: T): uint;
	
		/** Swap items. */
	    swap(i: int, j: int): IObjectList<T>;
		/** Add another list to this */
	    add(list: IObjectList<T>): IObjectList<T>;
		/** Is this list equal to <list>. */
	    isEqual(list: IObjectList<T>): boolean;
	
		/** Clear list. */
	    clear(): IObjectList<T>;
		/** For each loop. */
	    forEach(fn: IListExplorerFunc<T>): void;
	}
	
}
