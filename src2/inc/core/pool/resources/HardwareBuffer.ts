#ifndef HARDWAREBUFFER
#define HARDWAREBUFFER

/*
-----------------------------------------------------------------------------
This source file is part of OGRE
    (Object-oriented Graphics Rendering Engine)
For the latest info, see http://www.ogre3d.org/

Copyright (c) 2000-2012 Torus Knot Software Ltd
-----------------------------------------------------------------------------
*/

module akra.core.pool.resources {
	export class HardwareBuffer extends ResourcePoolItem implements IHardwareBuffer {
		protected _iFlags: int = 0;

		protected _isLocked: bool = false;
		/** Lock byte offset. */
		protected _iLockStart: uint;
		/** Lock byte size. */
		protected _iLockSize: uint;

		protected _pBackupCopy: HardwareBuffer = null;
		protected _pBackupUpdated: bool = false;
		protected _bIgnoreHardwareUpdate: bool = false;

		// inline get byteLength(): uint { return 0; }
		// inline get length(): uint { return 0; }
		 
		byteLength: uint = 0;
		length: uint = 0;

		constructor() {
			super();
		}

		inline isValid(): bool {
			return false;
		}

		inline isDynamic(): bool {
			return TEST_ANY(this._iFlags, EHardwareBufferFlags.DYNAMIC);
		}

		inline isStatic(): bool {
			return TEST_ANY(this._iFlags, EHardwareBufferFlags.STATIC);
		}

		inline isStream(): bool {
			return TEST_ANY(this._iFlags, EHardwareBufferFlags.STREAM);
		}

		inline isReadable(): bool {
			return TEST_ANY(this._iFlags, EHardwareBufferFlags.READABLE);
		}

		inline isBackupPresent(): bool {
			return this._pBackupCopy != null;
		}

		inline isSoftware(): bool {
    		return TEST_ANY(this._iFlags, EHardwareBufferFlags.SOFTWARE);
		}

		inline isAligned(): bool {
			return TEST_ANY(this._iFlags, EHardwareBufferFlags.ALIGNMENT);
		}

		inline isLocked(): bool {
			return this._isLocked;
		}
		
		clone(pSrc: IHardwareBuffer): bool {
			return false;
		}

		inline getFlags(): int { return this._iFlags; }

		readData(ppDest: ArrayBufferView): bool;
		readData(iOffset: uint, iSize: uint, ppDest: ArrayBufferView): bool;
		readData(iOffset: any, iSize?: any, ppDest?: any): bool { 
			return false; 
		}

		writeData(pData: Uint8Array, iOffset?: uint, iSize?: uint, bDiscardWholeBuffer: bool = false): bool;
		writeData(pData: ArrayBufferView, iOffset?: uint, iSize?: uint, bDiscardWholeBuffer: bool = false): bool;
		
		writeData(pData: any, iOffset?: uint, iSize?: uint, bDiscardWholeBuffer: bool = false): bool { 
			return false;
		}

		copyData(pSrcBuffer: IHardwareBuffer, iSrcOffset: uint, iDstOffset: uint, iSize: uint, bDiscardWholeBuffer: bool = false): bool {
			var pData: any = pSrcBuffer.lock(iSrcOffset, iSize);
			this.writeData(pData, iDstOffset, iSize, bDiscardWholeBuffer);
			pSrcBuffer.unlock();
			return true;
		}

		create(iSize: int, iFlags: int = 0): bool {
			iFlags |= EHardwareBufferFlags.STATIC;

			if (TEST_ANY(iFlags, EHardwareBufferFlags.DYNAMIC)) {
				CLEAR_ALL(iFlags, EHardwareBufferFlags.STATIC);

				if (TEST_ANY(iFlags, EHardwareBufferFlags.BACKUP_COPY)) {
					CLEAR_ALL(iFlags, EHardwareBufferFlags.READABLE);
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

		resize(iSize: uint): bool {
			return false;
		}

		lock(iLockFlags: int): any;
		lock(iOffset: uint, iSize: uint, iLockFlags: int = EHardwareBufferFlags.READABLE): any;
		lock(iOffset: uint, iSize?: any, iLockFlags: int = EHardwareBufferFlags.READABLE): any {
			ASSERT(!this.isLocked(), "Cannot lock this buffer, it is already locked!");

			if (arguments.length == 1) {
				iLockFlags = <int>arguments[0];
				iOffset = 0;
				iSize = this.byteLength;
			}

			var pResult: any = null;

			if ((iOffset + iSize) > this.byteLength) {
				ERROR("Lock request out of bounds.", "HardwareBuffer::lock");
			}
			else if (this.isBackupPresent()) {
				if (!TEST_ANY(iLockFlags, ELockFlags.WRITE)) {
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
			ASSERT(this.isLocked(), "Cannot unlock this buffer, it is not locked!");

			// If we used the shadow buffer this time...
            if (this._pBackupCopy && this._pBackupCopy.isLocked()) {
                this._pBackupCopy.unlock();
                // Potentially update the 'real' buffer from the shadow buffer
                this.restoreFromBackup();
            }
            else
            {
				// Otherwise, unlock the real one
                this.unlockImpl();
                this._isLocked = false;
            }
		}

		restoreFromBackup(): bool {
			if (this._pBackupCopy && this._pBackupUpdated && !this._bIgnoreHardwareUpdate) {
	            // Do this manually to avoid locking problems
	            var pBackupData: any = this._pBackupCopy.lockImpl(this._iLockStart, 
	            	this._iLockSize, ELockFlags.READ);
				// Lock with discard if the whole buffer was locked, otherwise normal
				var iLockFlags: int;

				if (this._iLockStart == 0 && this._iLockSize == this.byteLength) {
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

		createResource(): bool {
			// innitialize the resource (called once)
		    debug_assert(!this.isResourceCreated(),
		                 "The resource has already been created.");

		    // signal that the resource is now created,
		    // but has not been enabled
		    //this.notifyCreated();
		    this.notifyDisabled();

		    return true;
		}

		destroyResource(): bool {
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

		restoreResource(): bool {
		    debug_assert(this.isResourceCreated(), "The resource has not been created.");

		    this.notifyRestored();
		    return true;
		}

		disableResource (): bool {
		    debug_assert(this.isResourceCreated(), "The resource has not been created.");

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

#endif
