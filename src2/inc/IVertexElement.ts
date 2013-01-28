#ifndef IVERTEXELEMENT_TS
#define IVERTEXELEMENT_TS

module akra {
	export interface IVertexElementInterface {
		count: uint; 	
		type: EDataTypes; 
		usage: string; 
		offset?: uint;
	}

	export interface IVertexElement extends IVertexElementInterface {
		size: uint;
		index: uint;
		semantics: string;

		clone(): IVertexElement;

		//DEBUG!!
		toString(): string;
	}
}

#endif