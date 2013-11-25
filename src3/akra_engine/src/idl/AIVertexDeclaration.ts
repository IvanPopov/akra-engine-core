/// <reference path="AIVertexElement.ts" />

interface AIVertexDeclaration {
	stride: uint;
	/** readonly */ length: uint;
	append(...pElement: AIVertexElementInterface[]): boolean;
	append(pElements: AIVertexElementInterface[]): boolean;

	extend(pDecl: AIVertexDeclaration): boolean;

	hasSemantics(sSemantics: string): boolean;
	findElement(sSemantics: string, iCount?: uint): AIVertexElement;
	clone(): AIVertexDeclaration;

	element(i: uint): AIVertexElement;

	_update(): boolean;

	toString(): string;
}
