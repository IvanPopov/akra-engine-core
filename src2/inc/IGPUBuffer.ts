#ifndef IGPUBUFFER_TS
#define IGPUBUFFER_TS

#include "IBuffer.ts"

module akra {

	export interface IGPUBuffer extends IBuffer {
		clone(pSrc: IGPUBuffer): bool;

		isValid(): bool;
		isDynamic(): bool;
		isStatic(): bool;
		isStream(): bool;
		isReadable(): bool;
		isRAMBufferPresent(): bool;
		isSoftware(): bool;

		getData(): ArrayBuffer;
		getData(iOffset: uint, iSize: uint): ArrayBuffer;
		setData(pData: ArrayBuffer, iOffset: uint, iSize: uint): bool;

		getFlags(): int; 

		destroy(): void;
		create(iByteSize: uint, iFlags: int, pData: ArrayBuffer): bool;
		resize(iSize: uint): bool;
	}
}

#endif