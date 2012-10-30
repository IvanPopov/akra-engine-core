///<reference path="akra.ts" />

module akra {
	export interface IVertexDeclaration {
		stride: uint;
		length: uint;

		
		//[index: number]: IVertexElement;

		append(...pElement: IVertexElement[]): bool;
		append(pElements: IVertexElement[]): bool;

		extend(pDecl: IVertexDeclaration): bool;

		hasSemantics(sSemantics: string): bool;
		findElement(sSemantics: string, iCount?: uint): IVertexElement;
		clone(): IVertexDeclaration;



		///DEBUG!!!
		toString(): string;
	}

	export function _VDFromElements(pElements: IVertexElement[]);
	export function _VDFromElements(pDecl: IVertexDeclaration);
	export function _VDFromElements(pDataDecl) {
		if (!(pDataDecl instanceof VertexDeclaration)) {
	        if (!(pDataDecl instanceof Array)) {
	            pDataDecl = [pDataDecl];
	        }

	        pDataDecl = new VertexDeclaration(pDataDecl);
	    }

	    return pDataDecl;
	}

}