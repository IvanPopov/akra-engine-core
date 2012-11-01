///<reference path="akra.ts" />

module akra {
	export interface IVertexElement {
		count: uint;
		type: EDataTypes;
		usage: string;
		offset: int;
		size: uint;
		index: uint;
		semantics: string;

		clone(): IVertexElement;

		//DEBUG!!
		toString(): string;
	}
}