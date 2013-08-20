#ifndef IVERTEXDATA_TS
#define IVERTEXDATA_TS

#include "IBuffer.ts"
#include "IBufferData.ts"
#include "data/VertexDeclaration.ts"

module akra {
	IFACE(IBufferDataModifier);
	IFACE(IVertexDeclaration);
	IFACE(IVertexBuffer);
	IFACE(IEventProvider);

	export interface IVertexData extends IBufferData, IBuffer, IEventProvider {
		readonly stride: uint;
		readonly startIndex: uint;
		readonly id: int;

		getVertexDeclaration(): data.VertexDeclaration;
		setVertexDeclaration(pDecl: IVertexDeclaration): bool;
		
		getVertexElementCount(): uint;
		hasSemantics(sSemantics: string): bool;

		destroy(): void;

		extend(pDecl: IVertexDeclaration, pData?: ArrayBufferView): bool;
		resize(nCount: uint, pDecl?: IVertexDeclaration): bool;
		resize(nCount: uint, iStride?: uint): bool;
		applyModifier(sUsage: string, fnModifier: IBufferDataModifier): bool;

		setData(pData: ArrayBufferView, iOffset: int, iSize?: uint, nCountStart?: uint, nCount?: uint): bool;
		setData(pData: ArrayBufferView, sUsage?: string, iSize?: uint, nCountStart?: uint, nCount?: uint): bool;

		getData(): ArrayBuffer;
		getData(iOffset: int, iSize: uint, iFrom?: uint, iCount?: uint): ArrayBuffer;
		getData(sUsage: string): ArrayBuffer;
		getData(sUsage: string, iFrom: uint, iCount: uint): ArrayBuffer;

		getTypedData(sUsage: string, iFrom?: int, iCount?: uint): ArrayBufferView;
		getBufferHandle(): int;
		
		toString(): string;

		//when data moved in memory(in parent Hardware Buffer)
		signal relocated(from: uint, to: uint): void;
		//when data size changed
		signal resized(byteLength: uint): void;
		//when declaration changed
		declarationChanged(decl: IVertexDeclaration): void;
		//when data has been modified
		signal updated(): void;
	}
}

#endif
