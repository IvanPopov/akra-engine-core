#ifndef IOBJECTARRAY
#define IOBJECTARRAY

module akra {
	export interface IObjectArray {
		length: uint;

		lock(): void;
		unlock(): void;
		isLocked(): bool;

		clear(bRemoveLinks?: bool): IObjectArray;

		value(n: uint): any;
		set(n: uint, data: any): IObjectArray;
		fromArray(elements: any[], iOffset?: uint, iSize?: uint): IObjectArray;
		push(element: any): IObjectArray;
		pop(): any;
		release(): IObjectArray;
		swap(i: int, j: int): IObjectArray;
	}
}

#endif
