#ifndef HARDWAREBUFFER
#define HARDWAREBUFFER

module akra.core.pool.resources {
	export class HardwareBuffer extends ResourcePoolItem implements IHardwareBuffer {
		protected _pBackupCopy: Uint8Array = null;
		protected _iFlags: int = 0;

		byteLength: uint = 0;
		length: uint = 0;

		isValid(): bool {
			return false;
		}

		isDynamic(): bool {
			return (TEST_BIT(this._iFlags, EHardwareBufferFlags.MANY_UPDATES) && 
    	   		TEST_BIT(this._iFlags, EHardwareBufferFlags.MANY_DRAWS));
		}

		isStatic(): bool {
			return ((!TEST_BIT(this._iFlags, EHardwareBufferFlags.MANY_UPDATES)) && 
				TEST_BIT(this._iFlags, EHardwareBufferFlags.MANY_DRAWS));
		}

		isStream(): bool {
			return (!TEST_BIT(this._iFlags, EHardwareBufferFlags.MANY_UPDATES)) && 
					(!TEST_BIT(this._iFlags, EHardwareBufferFlags.MANY_DRAWS));
		}

		isReadable(): bool {
			return TEST_BIT(this._iFlags, EHardwareBufferFlags.READABLE);
		}

		isWritable(): bool {
			return TEST_BIT(this._iFlags, EHardwareBufferFlags.WRITABLE);
		}

		isRAMBufferPresent(): bool {
			return this._pBackupCopy != null;
		}

		isSoftware(): bool {
    		return TEST_BIT(this._iFlags, EHardwareBufferFlags.SOFTWARE);
		}

		isAligned(): bool {
			return TEST_BIT(this._iFlags, EHardwareBufferFlags.ALIGNMENT);
		}

		
		clone(pSrc: IHardwareBuffer): bool {
			var pBuffer: IHardwareBuffer = pSrc;
			
			// destroy any local data
			this.destroy();

			return this.create(pBuffer.byteLength, pBuffer.getFlags(), pBuffer.getData());
		}

		inline getFlags(): int { return this._iFlags; }

		getData(): Uint8Array;
		getData(iOffset: uint, iSize: uint): Uint8Array;
		getData(iOffset?: any, iSize?: any): Uint8Array { return null; }

		setData(pData: Uint8Array, iOffset: uint, iSize: uint): bool;
		setData(pData: ArrayBuffer, iOffset: uint, iSize: uint): bool;
		setData(pData: any, iOffset: uint, iSize: uint): bool { return false;}

		create(iByteSize: uint, iFlags: int, pData: Uint8Array): bool;
		create(iByteSize: uint, iFlags: int, pData: ArrayBuffer): bool;
		create(iByteSize: uint, iFlags: int, pData: any): bool {return false;}

		destroy: () => void 												= null;
		resize: (iSize: uint) => bool 										= null;
	}
}

#endif
