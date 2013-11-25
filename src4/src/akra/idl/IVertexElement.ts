module akra {
	interface IVertexElementInterface {
		/**
		 * Number of uint.
		 */
		count: uint; 	
		/**
		 * Type of units. 
		 */
		type: EDataTypes; 
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
	
	interface IVertexElement extends IVertexElementInterface {
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
	
		clone(): IVertexElement;
	
		isEnd(): boolean;
	
		//DEBUG!!
		toString(): string;
	}
	
	
	
}
