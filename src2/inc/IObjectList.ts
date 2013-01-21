#ifndef IOBJECTLIST_TS
#define IOBJECTLIST_TS

module akra {
	export interface IObjectList {
		length: uint;
		first: any;
		last: any;

		lock(): void;
		unlock(): void;
		isLocked(): bool;

		seek(n?: int): IObjectList;
		next(): any;
		prev(): any;
		push(element: any): IObjectList;
		pop(): any;
		prepend(element: any): IObjectList;

		fromArray(elements: any[], iOffset?: uint, iSize?: uint): IObjectList;

		insert(n: uint, data: any): IObjectList;
		value(n: uint, defaultValue?: any): any;
		indexOf(element: any, from?: uint): int;
		mid(pos: uint, size: uint): IObjectList;
		move(from: uint, to: uint): IObjectList;
		replace(pos: uint, value: any): IObjectList;
		erase(pos: uint): IObjectList;
		erase(begin: uint, end: uint): IObjectList;
		contains(value: any): bool;

		takeAt(pos: uint); any;
		takeFirst(): any;
		takeLast(): any;

		removeAt(n: uint): void;
		removeOne(element: any): void;
		removeAll(element: any): uint;

		swap(i: int, j: int): IObjectList;
		add(list: IObjectList): IObjectList;
		isEqual(list: IObjectList): IObjectList;

		clear(): IObjectList;
	}
}



#endif
