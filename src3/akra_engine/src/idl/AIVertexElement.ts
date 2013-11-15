/// <reference path="AEDataTypes.ts" />

interface AIVertexElementInterface {
	/**
	 * Number of uint.
	 */
	count: uint; 	
	/**
	 * Type of units. 
	 */
	type: AEDataTypes; 
	/**
	 * Usage of element.
	 * For ex., basicly for vertices is 'POSITION'.
	 */
	usage: string; 
	/**
	 * Offset in bytes.
	 */
	offset?: uint;
}

interface AIVertexElement extends AIVertexElementInterface {
	/**
	 * Size in bytes.
	 */
	size: uint;
	/**
	 * numerical index of declaration. 
	 * For ex. for usage INDEX10, index is 10, semantics is 'INDEX'.
	 */
	index: uint;
	/**
	 * Semantics of declaration.
	 * @see DelcarationUsages.
	 */
	semantics: string;

	clone(): AIVertexElement;

	isEnd(): boolean;

	//DEBUG!!
	toString(): string;
}


