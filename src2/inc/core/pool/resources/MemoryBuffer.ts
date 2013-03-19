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

			var isCreated: bool = super.create(0, iFlags | EHardwareBufferFlags.SOFTWARE);

			this._pData = new Uint8Array(iByteSize);

			return isCreated;
		}

		destroy(): void {
			super.destroy();
			this._pData = null;
		}

		resize(iSize: uint): bool {
			var pData: Uint8Array = new Uint8Array(iSize);

			if(iSize >= this.byteLength){
				pData.set(this._pData);
			}
			else{
				pData.set(this._pData.subarray(0, iSize));
			}
			
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
				iOffset = 0;
				iSize = ppDest.byteLength;
			}

			ASSERT((iOffset + iSize) <= this.byteLength);
			memcpy((<ArrayBufferView>ppDest).buffer, (<ArrayBufferView>ppDest).byteOffset, this._pData.buffer, iOffset, iSize);

			return true;
		}

		// writeData(pData: Uint8Array, iOffset?: uint, iSize?: uint, bDiscardWholeBuffer: bool = false): bool;
		writeData(pData: ArrayBufferView, iOffset?: uint, iSize?: uint, bDiscardWholeBuffer: bool = false): bool{
		// writeData(pData: any, iOffset?: uint, iSize?: uint, bDiscardWholeBuffer: bool = false): bool { 
			
			if(arguments.length < 3){
				iSize = pData.byteLength;
			}

			if (arguments.length < 2) {
				iOffset = 0;
			}

			ASSERT((iOffset + iSize) <= this.byteLength);

			if(isDefAndNotNull(pData)){
				memcpy(this._pData.buffer, iOffset, (<ArrayBufferView>pData).buffer, (<ArrayBufferView>pData).byteOffset, iSize);
			}
			this.notifyAltered();

			return true;
		}
	}
}

#endif
