#ifndef IHARDWAREBUFFER_TS
#define IHARDWAREBUFFER_TS

#include "IBuffer.ts"

module akra {

	export enum EHardwareBufferFlags {
		MANY_UPDATES = 0,
		MANY_DRAWS,
		READABLE,
		RAM_BACKUP,
		SOFTWARE,
		ALIGNMENT
	}

	export interface IHardwareBuffer extends IBuffer {
		clone(pSrc: IHardwareBuffer): bool;

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