/** ObjectArray interface */
interface AIObjectArray<ELEMENT_TYPE> {
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
	clear(bRemoveLinks?: boolean): AIObjectArray<ELEMENT_TYPE>;

	/** Get value of <n> element. */
	value(n: uint): ELEMENT_TYPE;
	/** Set value for <n> element. */
	set(n: uint, data: ELEMENT_TYPE): AIObjectArray<ELEMENT_TYPE>;
	/** Fill ObjectArray from ELEMENT_TYPE <Array> */
	fromArray(elements: ELEMENT_TYPE[], iOffset?: uint, iSize?: uint): AIObjectArray<ELEMENT_TYPE>;
	/** Push element to end of array */
	push(element: ELEMENT_TYPE): AIObjectArray<ELEMENT_TYPE>;
	/** Get & remove last element in array */
	pop(): ELEMENT_TYPE;
	/** Complitly remove all data from array */
	release(): AIObjectArray<ELEMENT_TYPE>;
	/** Swap elements in array */
	swap(i: int, j: int): AIObjectArray<ELEMENT_TYPE>;

	takeAt(iPos): ELEMENT_TYPE;
}

