#ifndef IGPUBUFFER_TS
#define IGPUBUFFER_TS

#include "IBuffer.ts"

module akra {
	export enum EGPUBufferFlags {
		MANY_UPDATES = 0,
		MANY_DRAWS,
		READABLE,
		RAM_BACKUP,
		SOFTWARE,
		ALIGNMENT
	}

	export interface IGPUBuffer extends IBuffer {
		clone(pSrc: IGPUBuffer): bool;

		isValid(): bool;
		isDynamic(): bool;
		isStatic(): bool;
		isStream(): bool;
		isReadable(): bool;
		isRAMBufferPresent(): bool;
		isSoftware(): bool;

		getData(iOffset: uint, iSize: uint): ArrayBuffer;
		setData(pData: ArrayBuffer, iOffset: uint, iSize: uint): bool;

		getFlags(): int; 

		destroy(): void;
		create(iByteSize: uint, iFlags: int, pData: ArrayBuffer): bool;
		resize(iSize: uint): bool;
	}
}

#endif