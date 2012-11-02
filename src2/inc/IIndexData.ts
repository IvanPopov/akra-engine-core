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

		getData(iOffset: int, iSize: int): ArrayBuffer;
		setData(pData: ArrayBufferView, iOffset: int, iCount: uint): bool;

		destroy(): void;

		getPrimitiveType(): EPrimitiveTypes;
		getPrimitiveCount(): uint;
	}
}

#endif
