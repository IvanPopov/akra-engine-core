/// <reference path="../../bf/bf.ts" />
/// <reference path="../../common.ts" />
/// <reference path="../../mem.ts" />

/// <reference path="HardwareBuffer.ts" />

module akra.pool.resources {
	export class MemoryBuffer extends HardwareBuffer {

		protected _pData: Uint8Array;

		getByteLength(): uint {
			return this._pData.byteLength;
		}

		getLength(): uint {
			return this.getByteLength();
		}

		create(iByteSize: uint, iFlags: int = EHardwareBufferFlags.DYNAMIC): boolean {

			iFlags = bf.clearAll(iFlags,
				EHardwareBufferFlags.BACKUP_COPY | EHardwareBufferFlags.DISCARDABLE |
				EHardwareBufferFlags.ALIGNMENT);

			var isCreated: boolean = super.create(0, iFlags | EHardwareBufferFlags.SOFTWARE);

			this._pData = new Uint8Array(iByteSize);

			return isCreated;
		}

		destroy(): void {
			super.destroy();
			this._pData = null;
		}

		resize(iSize: uint): boolean {
			var pData: Uint8Array = new Uint8Array(iSize);

			if (iSize >= this.getByteLength()) {
				pData.set(this._pData);
			}
			else {
				pData.set(this._pData.subarray(0, iSize));
			}

			this._pData = pData;
			this.notifyAltered();

			return true;
		}

		lockImpl(iOffset: uint, iLength: uint, iLockFlags: int): Uint8Array {
			return this._pData.subarray(iOffset, iOffset + iLength);
		}

		readData(ppDest: ArrayBufferView): boolean;
		readData(iOffset: uint, iSize: uint, ppDest: ArrayBufferView): boolean;
		readData(): boolean {
			var ppDest: ArrayBufferView;
			var iOffset: uint;
			var iSize: uint;

			if (arguments.length < 3) {
				ppDest = arguments[0];
				iOffset = 0;
				iSize = ppDest.byteLength;
			}
			else {
				iOffset = arguments[0];
				iSize = arguments[1];
				ppDest = arguments[2];
			}

			logger.assert((iOffset + iSize) <= this.getByteLength());
			copy((<ArrayBufferView>ppDest).buffer, (<ArrayBufferView>ppDest).byteOffset, this._pData.buffer, iOffset, iSize);

			return true;
		}

		// writeData(pData: Uint8Array, iOffset?: uint, iSize?: uint, bDiscardWholeBuffer: boolean = false): boolean;
		writeData(pData: ArrayBufferView, iOffset: uint = 0, iSize: uint = pData.byteLength, bDiscardWholeBuffer: boolean = false): boolean {
			// writeData(pData: any, iOffset?: uint, iSize?: uint, bDiscardWholeBuffer: boolean = false): boolean { 

			logger.assert((iOffset + iSize) <= this.getByteLength());

			if (isDefAndNotNull(pData)) {
				copy(this._pData.buffer, iOffset, (<ArrayBufferView>pData).buffer, (<ArrayBufferView>pData).byteOffset, iSize);
			}

			this.notifyAltered();

			return true;
		}
	}
}
