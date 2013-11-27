/** ObjectArray interface */
interface AIObjectArray<T> {
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
	isLocked(): boolean;

	/**
	 * Remove all elements from array;
	 * @param {Bool=false} bRemoveLinks Remove old pointers to data. 
	 */
	clear(bRemoveLinks?: boolean): AIObjectArray<T>;

	/** Get value of <n> element. */
	value(n: uint): T;
	/** Set value for <n> element. */
	set(n: uint, data: T): AIObjectArray<T>;
	/** Fill ObjectArray from T <Array> */
	fromArray(elements: T[], iOffset?: uint, iSize?: uint): AIObjectArray<T>;
	/** Push element to end of array */
	push(element: T): AIObjectArray<T>;
	/** Get & remove last element in array */
	pop(): T;
	/** Complitly remove all data from array */
	release(): AIObjectArray<T>;
	/** Swap elements in array */
	swap(i: int, j: int): AIObjectArray<T>;

	takeAt(iPos): T;
}

