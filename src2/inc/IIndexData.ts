#ifndef IINDEXDATA_TS
#define IINDEXDATA_TS

#include "IRenderer.ts"

module akra {
	export interface IIndexData extends IBufferData {
		type: EDataTypes;
		count: uint;
		bytesPerIndex: uint;

		getData(iOffset: int, iSize: int): ArrayBuffer;
		setData(pData: ArrayBufferView, iOffset: int, iCount: uint): bool;

		destroy(): void;

		getPrimitiveType(): EPrimitiveTypes;
		getPrimitiveCount(): uint;
	}
}

#endif
