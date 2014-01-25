module akra {
	/** ObjectArray export interface */
	export interface IObjectArray<T> {
		/** number of element in array */
		getLength(): uint;
	
		/** lock array for writing */
		lock(): void;
		/**
		 * unlock array.
		 */
		unlock(): void;
		/**
		 * Is arrat can be modified?
		 */
		isLocked(): boolean;
	
		/**
		 * Remove all elements from array;
		 * @param {Bool=false} bRemoveLinks Remove old pointers to data. 
		 */
		clear(bRemoveLinks?: boolean): IObjectArray<T>;
	
		/** Get value of <n> element. */
		value(n: uint): T;
		/** Set value for <n> element. */
		set(n: uint, data: T): IObjectArray<T>;
		/** Fill ObjectArray from T <Array> */
		fromArray(elements: T[], iOffset?: uint, iSize?: uint): IObjectArray<T>;
		/** Push element to end of array */
		push(element: T): IObjectArray<T>;
		/** Get & remove last element in array */
		pop(): T;
		/** Complitly remove all data from array */
		release(): IObjectArray<T>;
		/** Swap elements in array */
		swap(i: int, j: int): IObjectArray<T>;
	
		takeAt(iPos): T;
	}
	
	
}
