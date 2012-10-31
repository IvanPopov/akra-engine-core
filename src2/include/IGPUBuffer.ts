///<reference path="akra.ts" />

module akra {
	export enum EGPUBufferFlags {
		MANY_UPDATES = 0,
		MANY_DRAWS,
		READABLE,
		RAM_BACKUP,
		SOFTWARE
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

		getHardwareBuffer(): WebGLObject;
		getFlags(): int; 
	}
}