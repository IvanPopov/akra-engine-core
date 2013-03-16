#ifndef IINDEXDATA_TS
#define IINDEXDATA_TS

#include "IRenderer.ts"
#include "IBuffer.ts"
#include "IBufferData.ts"

module akra {
	export interface IIndexData extends IBufferData, IBuffer {
		readonly type: EDataTypes;
		readonly length: uint;
		readonly bytesPerIndex: uint;
		readonly id: uint;

		getData(iOffset: int, iSize: int): ArrayBuffer;
		getTypedData(iStart: uint, iCount: uint): ArrayBufferView;
		
		setData(pData: ArrayBufferView): bool;
		setData(pData: ArrayBufferView, iOffset: int): bool;
		setData(pData: ArrayBufferView, iOffset: int, iCount: uint): bool;

		destroy(): void;

		getPrimitiveType(): EPrimitiveTypes;
		getPrimitiveCount(): uint;
		getBufferHandle(): int;
	}
}

#endif
