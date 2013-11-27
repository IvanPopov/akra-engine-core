module akra {
	export interface IVertexDeclaration {
		stride: uint;
		/** readonly */ length: uint;
		append(...pElement: IVertexElementInterface[]): boolean;
		append(pElements: IVertexElementInterface[]): boolean;
	
		extend(pDecl: IVertexDeclaration): boolean;
	
		hasSemantics(sSemantics: string): boolean;
		findElement(sSemantics: string, iCount?: uint): IVertexElement;
		clone(): IVertexDeclaration;
	
		element(i: uint): IVertexElement;
	
		_update(): boolean;
	
		toString(): string;
	}
	
}
