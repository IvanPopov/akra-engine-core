#ifndef IOBJECTARRAY
#define IOBJECTARRAY

module akra {
	/** ObjectArray interface */
	export interface IObjectArray {
		/** number of element in array */
		length: uint;

		/** lock array for writing */
		lock(): void;
		/**
		 * unlock array.
		 */
		unlock(): void;
		/**
		 * Is arrat can be modified?
		 */
		isLocked(): bool;

		/**
		 * Remove all elements from array;
		 * @param {Bool=false} bRemoveLinks Remove old pointers to data. 
		 */
		clear(bQuick?: bool): IObjectArray;

		/** Get value of <n> element. */
		value(n: uint): any;
		/** Set value for <n> element. */
		set(n: uint, data: any): IObjectArray;
		/** Fill ObjectArray from any <Array> */
		fromArray(elements: any[], iOffset?: uint, iSize?: uint): IObjectArray;
		/** Push element to end of array */
		push(element: any): IObjectArray;
		/** Get & remove last element in array */
		pop(): any;
		/** Complitly remove all data from array */
		release(): IObjectArray;
		/** Swap elements in array */
		swap(i: int, j: int): IObjectArray;
	}
}

#endif
