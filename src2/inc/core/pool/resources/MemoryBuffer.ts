#ifndef MEMORYBUFFER_TS
#define MEMORYBUFFER_TS

#include "HardwareBuffer.ts"

module akra.core.pool.resources {
	export class MemoryBuffer extends HardwareBuffer {

		protected _pData: Uint8Array;

		inline get byteLength(): uint {
			return this._pData.byteLength;
		}

		create(iByteSize: uint, iFlags: int = EHardwareBufferFlags.DYNAMIC): bool {
			
			CLEAR_ALL(iFlags, 
				EHardwareBufferFlags.BACKUP_COPY | EHardwareBufferFlags.DISCARDABLE | 
				EHardwareBufferFlags.ALIGNMENT);

			var isCreated: bool = super.create(iFlags | EHardwareBufferFlags.SOFTWARE);

			this._pData = new Uint8Array(iByteSize);

			return isCreated;
		}

		destroy(): void {
			super.destroy();
			this._pData = null;
		}

		resize(iSize: uint): bool {
			var pData: Uint8Array = new Uint8Array(iSize);
			pData.set(this._pData);
			this._pData = pData;
			this.notifyAltered();

			return true;
		}

		lockImpl(iOffset: uint, iLength: uint, iLockFlags: int): Uint8Array {
			return this._pData.subarray(iOffset, iOffset + iLength);
		}

		readData(ppDest: ArrayBufferView): bool;
		readData(iOffset: uint, iSize: uint, ppDest: ArrayBufferView): bool;
		readData(iOffset: any, iSize?: any, ppDest?: any): bool { 
			if (arguments.length < 3) {
				ppDest = arguments[0];
			}

			ASSERT((iOffset + iSize) <= this.byteLength);
			memcpy((<ArrayBufferView>ppDest).buffer, 0, this._pData.buffer, iOffset, iSize);

			return true;
		}

		writeData(pData: Uint8Array, iOffset?: uint, iSize?: uint, bDiscardWholeBuffer: bool = false): bool;
		writeData(pData: ArrayBufferView, iOffset?: uint, iSize?: uint, bDiscardWholeBuffer: bool = false): bool;
		writeData(pData: any, iOffset?: uint, iSize?: uint, bDiscardWholeBuffer: bool = false): bool { 
			ASSERT((iOffset + iSize) <= this.byteLength);

			if (arguments.length < 3) {
				iOffset = 0;
				iSize = pData.byteLength;
			}


			memcpy(this._pData.buffer, 0, (<ArrayBufferView>pData).buffer, iOffset, iSize);
			this.notifyAltered();

			return true;
		}
	}
}

#endif
