#ifndef INDEXBUFFER_TS
#define INDEXBUFFER_TS

#include "IIndexBuffer.ts"
#include "../ResourcePoolItem.ts"

module akra.core.pool.resources {
	export class IndexBuffer extends ResourcePoolItem implements IIndexBuffer {

		inline get byteLength(): uint {
			return 0;
		}

		inline get length(): uint {
			return 0;
		}

		clone(pSrc: IGPUBuffer): bool {
			return false;
		}

		isValid(): bool {
			return false;
		}

		isDynamic(): bool {
			return false;
		}

		isStatic(): bool {
			return false;
		}

		isStream(): bool {
			return false;
		}

		isReadable(): bool {
			return false;
		}

		isRAMBufferPresent(): bool {
			return false;
		}

		isSoftware(): bool {
			return false;
		}

		getData(iOffset: uint, iSize: uint): ArrayBuffer {
			return null;
		}

		setData(pData: ArrayBuffer, iOffset: uint, iSize: uint): bool {
			return false;
		}


		

		inline getFlags(): int {
			return 0;
		}

		getIndexData(iOffset: uint, iCount: uint, ePrimitiveType: EPrimitiveTypes, eElementsType: EDataTypes): IIndexData {
			return null;
		}

		getEmptyIndexData(iCount: uint, ePrimitiveType: EPrimitiveTypes, eElementsType: EDataTypes): IIndexData {
			return null;
		}

		freeIndexData(pIndexData: IIndexData): bool {
			return false;
		}


		allocateData(ePrimitiveType: EPrimitiveTypes, eElementsType: EDataTypes, pData: ArrayBufferView): IIndexData {
			return null;
		}

		getCountIndexForStripGrid(iXVerts: int, iYVerts: int): int {
			return 0;
		}

		inline getHardwareObject(): WebGLObject {
			return null;
		}

		destroy(): void {}
		create(iByteSize: uint, iFlags: int, pData: ArrayBuffer): bool { return false; }
		resize(iSize: uint): bool { return false; }
	}
}

#endif