#ifndef IHARDWAREBUFFER_TS
#define IHARDWAREBUFFER_TS

#include "IBuffer.ts"

module akra {

	export enum EHardwareBufferFlags {
		STATIC 		= 0x01, 
		DYNAMIC 	= 0x02,
		STREAM 		= 0x80,

		READABLE	= 0x04,

		BACKUP_COPY = 0x08,
		/** indicate, that buffer does not use GPU memory or other specific memory. */
		SOFTWARE 	= 0x10,
		/** Indicate, tha buffer uses specific data aligment */
		ALIGNMENT	= 0x20,
		/** Indicates that the application will be refilling the contents
            of the buffer regularly (not just updating, but generating the
            contents from scratch), and therefore does not mind if the contents 
            of the buffer are lost somehow and need to be recreated. This
            allows and additional level of optimisation on the buffer.
            This option only really makes sense when combined with 
            DYNAMIC and without READING.
            */
		DISCARDABLE = 0x40,

		STATIC_READABLE = STATIC | READABLE,
		DYNAMIC_DISCARDABLE = DYNAMIC | DISCARDABLE
	}

	export enum ELockFlags {
		READ 			= 0x01,
		WRITE 			= 0x02,
		DISCARD 		= 0x04,
		NO_OVERWRITE	= 0x08,

		NORMAL			= READ | WRITE
	}

	export interface IHardwareBuffer extends IBuffer {
		clone(pSrc: IHardwareBuffer): bool;

		isValid(): bool;
		isDynamic(): bool;
		isStatic(): bool;
		isStream(): bool;
		isReadable(): bool;
		isBackupPresent(): bool;
		isSoftware(): bool;
		isAligned(): bool;
		isLocked(): bool;

		getFlags(): int; 

		readData(ppDest: ArrayBufferView): bool;
		readData(iOffset: uint, iSize: uint, ppDest: ArrayBufferView): bool;

		 writeData(pData: ArrayBufferView, iOffset?: uint, iSize?: uint, bDiscardWholeBuffer?: bool): bool;
		//writeData(pData: ArrayBuffer, iOffset?: uint, iSize?: uint, bDiscardWholeBuffer?: bool): bool;

		copyData(pSrcBuffer: IHardwareBuffer, iSrcOffset: uint, 
				 iDstOffset: uint, iSize: uint, bDiscardWholeBuffer?: bool): bool;

		create(iSize: int, iFlags?: int): bool;
		// create(iByteSize: uint, iFlags: int, pData: Uint8Array): bool;
		// create(iByteSize: uint, iFlags: int, pData: ArrayBuffer): bool;
		
		destroy(): void;
		
		resize(iSize: uint): bool;

		lock(iLockFlags: int): any;
		lock(iOffset: uint, iSize: uint, iLockFlags?: int): any;
		unlock(): void;

		restoreFromBackup(): bool;
	}
}

#endif