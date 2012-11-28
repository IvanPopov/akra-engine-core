#ifndef IHARDWAREBUFFER_TS
#define IHARDWAREBUFFER_TS

#include "IBuffer.ts"

module akra {

	export enum EHardwareBufferFlags {
		MANY_UPDATES = 0, 
		MANY_DRAWS,

		READABLE,
		WRITABLE,
		
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
		isWritable(): bool;
		isRAMBufferPresent(): bool;
		isSoftware(): bool;
		isAligned(): bool;

		getData(): Uint8Array;
		getData(iOffset: uint, iSize: uint): Uint8Array;
		setData(pData: Uint8Array, iOffset: uint, iSize: uint): bool;
		setData(pData: ArrayBuffer, iOffset: uint, iSize: uint): bool;

		getFlags(): int; 

		destroy(): void;
		create(iByteSize: uint, iFlags: int, pData: Uint8Array): bool;
		create(iByteSize: uint, iFlags: int, pData: ArrayBuffer): bool;
		resize(iSize: uint): bool;
	}
}

#endif