#ifndef IVERTEXDATA_TS
#define IVERTEXDATA_TS

#include "IBuffer.ts"
#include "IBufferData.ts"

module akra {
	export interface IVertexData extends IBufferData, IBuffer {
		readonly stride: uint;
		readonly startIndex: uint;

		getVertexDeclaration(): IVertexDeclaration;
		setVertexDeclaration(pDecl: IVertexDeclaration): bool;
		//getVertexElementCount(): uint;
		//hasSemantics(sSemantics: string): bool;

		destroy(): void;

		//extend(pData: ArrayBufferView, pDecl: IVertexDeclaration): bool;
		//resize(nCount: uint, pDecl: IVertexDeclaration): bool;
		//applyModifier(sSemantics: string, fnModifier: Function): bool;

		///setData(pData, iOffset, iSize, nCountStart, nCount);
		//getData(iOffset, iSize, iFrom, iCount);
		//getTypedData(eUsage, iFrom, iCount);
		//toString(): string;
	}
}

#endif
