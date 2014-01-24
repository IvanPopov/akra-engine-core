/// <reference path="../../idl/IHardwareBuffer.ts" />

/// <reference path="../../bf/bf.ts" />
/// <reference path="../../logger.ts" />
/// <reference path="../../debug.ts" />

/// <reference path="../ResourcePoolItem.ts" />

module akra.pool.resources {
	export class HardwareBuffer extends ResourcePoolItem implements IHardwareBuffer {
		protected _iFlags: int = 0;

		protected _isLocked: boolean = false;
		/** Lock byte offset. */
		protected _iLockStart: uint;
		/** Lock byte size. */
		protected _iLockSize: uint;

		protected _pBackupCopy: HardwareBuffer = null;
		protected _pBackupUpdated: boolean = false;
		protected _bIgnoreHardwareUpdate: boolean = false;

		getByteLength(): uint {
			return 0;
		}

		getLength(): uint {
			return 0;
		}

		// byteLength: uint = 0;
		// length: uint = 0;

		constructor() {
			super();
		}

		isValid(): boolean {
			return false;
		}

		isDynamic(): boolean {
			return bf.testAny(this._iFlags, EHardwareBufferFlags.DYNAMIC);
		}

		isStatic(): boolean {
			return bf.testAny(this._iFlags, EHardwareBufferFlags.STATIC);
		}

		isStream(): boolean {
			return bf.testAny(this._iFlags, EHardwareBufferFlags.STREAM);
		}

		isReadable(): boolean {
			return bf.testAny(this._iFlags, EHardwareBufferFlags.READABLE);
		}

		isBackupPresent(): boolean {
			return this._pBackupCopy != null;
		}

		isSoftware(): boolean {
			return bf.testAny(this._iFlags, EHardwareBufferFlags.SOFTWARE);
		}

		isAligned(): boolean {
			return bf.testAny(this._iFlags, EHardwareBufferFlags.ALIGNMENT);
		}

		isLocked(): boolean {
			return this._isLocked;
		}

		clone(pSrc: IHardwareBuffer): boolean {
			return false;
		}

		getFlags(): int { return this._iFlags; }

		readData(ppDest: ArrayBufferView): boolean;
		readData(iOffset: uint, iSize: uint, ppDest: ArrayBufferView): boolean;
		readData(iOffset: any, iSize?: any, ppDest?: any): boolean {
			return false;
		}

		writeData(pData: Uint8Array, iOffset?: uint, iSize?: uint, bDiscardWholeBuffer?: boolean): boolean;
		writeData(pData: ArrayBufferView, iOffset?: uint, iSize?: uint, bDiscardWholeBuffer?: boolean): boolean;
		writeData(pData: any, iOffset?: uint, iSize?: uint, bDiscardWholeBuffer: boolean = false): boolean {
			return false;
		}

		copyData(pSrcBuffer: IHardwareBuffer, iSrcOffset: uint, iDstOffset: uint, iSize: uint, bDiscardWholeBuffer: boolean = false): boolean {
			var pData: any = pSrcBuffer.lock(iSrcOffset, iSize);
			this.writeData(pData, iDstOffset, iSize, bDiscardWholeBuffer);
			pSrcBuffer.unlock();
			return true;
		}

		create(iSize: int, iFlags: int = 0): boolean {
			iFlags |= EHardwareBufferFlags.STATIC;

			if (bf.testAny(iFlags, EHardwareBufferFlags.DYNAMIC)) {
				bf.clearAll(iFlags, EHardwareBufferFlags.STATIC);

				if (bf.testAny(iFlags, EHardwareBufferFlags.BACKUP_COPY)) {
					bf.clearAll(iFlags, EHardwareBufferFlags.READABLE);
				}
			}

			this._iFlags = iFlags;

			this.notifyCreated();
			this.notifyRestored();

			return true;
		}

		destroy(): void {
			this._iFlags = 0;
			this.notifyDestroyed();
			this.notifyUnloaded();
		}

		resize(iSize: uint): boolean {
			return false;
		}

		lock(iLockFlags: int): any;
		lock(iOffset: uint, iSize: uint, iLockFlags?: int/* = EHardwareBufferFlags.READABLE*/): any;
		lock(): any {
			logger.assert(!this.isLocked(), "Cannot lock this buffer, it is already locked!");

			var iOffset: uint = 0,
				iSize: uint = 0,
				iLockFlags: int = 0;

			if (arguments.length == 1) {
				iLockFlags = <int>arguments[0];
				iOffset = 0;
				iSize = this.getByteLength();
			}
			else {
				iOffset = arguments[0];
				iSize = arguments[1];
				iLockFlags = (arguments.length === 3) ? arguments[2] : EHardwareBufferFlags.READABLE;
			}

			var pResult: any = null;

			if ((iOffset + iSize) > this.getByteLength()) {
				logger.error("Lock request out of bounds.", "HardwareBuffer::lock");
			}
			else if (this.isBackupPresent()) {
				if (!bf.testAny(iLockFlags, ELockFlags.WRITE)) {
					// we have to assume a read / write lock so we use the shadow buffer
					// and tag for sync on unlock()
					this._pBackupUpdated = true;
				}

				pResult = this._pBackupCopy.lock(iOffset, iSize, iLockFlags);
			}
			else {
				// Lock the real buffer if there is no shadow buffer 
				pResult = this.lockImpl(iOffset, iSize, iLockFlags);
				this._isLocked = true;
			}

			this._iLockStart = iOffset;
			this._iLockSize = iSize;

			return pResult;
		}

		unlock(): void {
			logger.assert(this.isLocked(), "Cannot unlock this buffer, it is not locked!");

			// If we used the shadow buffer this time...
			if (this._pBackupCopy && this._pBackupCopy.isLocked()) {
				this._pBackupCopy.unlock();
				// Potentially update the 'real' buffer from the shadow buffer
				this.restoreFromBackup();
			}
			else {
				// Otherwise, unlock the real one
				this.unlockImpl();
				this._isLocked = false;
			}
		}

		restoreFromBackup(): boolean {
			if (this._pBackupCopy && this._pBackupUpdated && !this._bIgnoreHardwareUpdate) {
				// Do this manually to avoid locking problems
				var pBackupData: any = this._pBackupCopy.lockImpl(this._iLockStart,
					this._iLockSize, ELockFlags.READ);
				// Lock with discard if the whole buffer was locked, otherwise normal
				var iLockFlags: int;

				if (this._iLockStart == 0 && this._iLockSize == this.getByteLength()) {
					iLockFlags = ELockFlags.DISCARD;
				}
				else {
					iLockFlags = ELockFlags.NORMAL;
				}

				var pRealData: any = this.lockImpl(this._iLockStart, this._iLockSize, iLockFlags);
				// Copy backup to real
				this.copyBackupToRealImpl(pRealData, pBackupData, iLockFlags);

				this.unlockImpl();
				this._pBackupCopy.unlockImpl();
				this._pBackupUpdated = false;

				return true;
			}

			return false;
		}

		createResource(): boolean {
			// innitialize the resource (called once)
			debug.assert(!this.isResourceCreated(),
				"The resource has already been created.");

			// signal that the resource is now created,
			// but has not been enabled
			//this.notifyCreated();
			this.notifyDisabled();

			return true;
		}

		destroyResource(): boolean {
			// destroy the resource
			//
			// we permit redundant calls to destroy, so there are no asserts here
			//
			if (this.isResourceCreated()) {
				// disable the resource
				this.disableResource();
				this.destroy();
				return true;
			}

			return false;
		}

		restoreResource(): boolean {
			debug.assert(this.isResourceCreated(), "The resource has not been created.");

			this.notifyRestored();
			return true;
		}

		disableResource(): boolean {
			debug.assert(this.isResourceCreated(), "The resource has not been created.");

			this.notifyDisabled();
			return true;
		}

		protected lockImpl(iOffset: uint, iSize: uint, iLockFlags: int): any {
			return null;
		}

		protected unlockImpl(): void {

		}

		protected copyBackupToRealImpl(pRealData: any, pBackupData: any, iLockFlags: int): void {

		}
	}
}
