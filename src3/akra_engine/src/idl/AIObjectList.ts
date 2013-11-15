// AIObjectList interface
// [write description here...]

module akra {
interface AIListExplorerFunc {
	(data: any, index?: uint): boolean;
	//(data: any): void;
}

/** ObjectList interface. */
interface AIObjectList {
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
	isLocked(): boolean;

	/** Set current element to <n> position. */
	seek(n?: int): AIObjectList;
	/** Get next element */
	next(): any;
	/** Get prev element */
	prev(): any;
	/** Push element to end of list. */
	push(element: any): AIObjectList;
	/** Pop element from end of list. */
	pop(): any;
	/** Add element to list head. */
	prepend(element: any): AIObjectList;

	/** Add element from array. */
	fromArray(elements: any[], iOffset?: uint, iSize?: uint): AIObjectList;

	/** Insert element before <n> element. */
	insert(n: uint, data: any): AIObjectList;
	/** Get valuie of <n> element */
	value(n: uint, defaultValue?: any): any;
	/** Get index of element with given data */
	indexOf(element: any, from?: uint): int;
	/** Get sub list from this list */
	mid(pos?: uint, size?: uint): AIObjectList;
	/** slice from array */
	slice(start?: uint, end?: uint): AIObjectList;
	/** Move element from <from> postion to <to> position.*/
	move(from: uint, to: uint): AIObjectList;

	/** Replace data of <n> element. */
	replace(pos: uint, value: any): AIObjectList;
	/** Erase element with number <n>. */
	erase(pos: uint): AIObjectList;
	/** Erase elements from begin to end. */
	erase(begin: uint, end: uint): AIObjectList;
	/** Is list contains data with <value>?*/
	contains(value: any): boolean;

	/** Get data of <n> item and remove it. */
	takeAt(pos: uint): any;
	/** Get data of first item and remove it. */
	takeFirst(): any;
	/** Get data of last item and remove it. */
	takeLast(): any;
	/** Get data of current item and remove it. */
	takeCurrent(): any;

	/** Remove <n> item. */
	removeAt(n: uint): void;
	/** Remove one lement with data <element>. */
	removeOne(element: any): void;
	/** Remove all lement with data <element>. */
	removeAll(element: any): uint;

	/** Swap items. */
	swap(i: int, j: int): AIObjectList;
	/** Add another list to this */
	add(list: AIObjectList): AIObjectList;
	/** Is this list equal to <list>. */
	isEqual(list: AIObjectList): boolean;

	/** Clear list. */
	clear(): AIObjectList;
	/** For each loop. */
	forEach(fn: AIListExplorerFunc): void;
}
}



#endif