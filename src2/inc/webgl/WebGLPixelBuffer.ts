#ifndef WEBGLPIXELBUFFER_TS
#define WEBGLPIXELBUFFER_TS

#include "IPixelBuffer.ts"
#include "core/pool/resources/HardwareBuffer.ts"
#include "geometry/Box.ts"

module akra.webgl {
	export class WebGLPixelBuffer extends core.pool.resources.HardwareBuffer implements IPixelBuffer {

		protected _iWidth: uint = 0;
		protected _iHeight: uint = 0;
		protected _iDepth: uint = 0;

		// Pitches (offsets between rows and slices)
		protected _iRowPitch: uint;
		protected _iSlicePitch: uint;

		protected _eFormat: EPixelFormats = EPixelFormats.UNKNOWN;

		//webgl specific
		
		protected _pCurrentLock: IPixelBox;
		protected _pLockedBox: IBox;
		protected _iCurrentLockFlags: int;
		
		protected _pBuffer: IPixelBox;
		protected _iWEBGLInternalFormat: int;

		inline get width(): uint { return this._iWidth; }
		inline get height(): uint { return this._iHeight; }
		inline get depth(): uint { return this._iDepth; }

		inline get format(): uint { return this._eFormat; }


		constructor () {
			super();
		}


		//upload(download) data to(from) videocard.
		protected upload(pData: IPixelBox, pDestBox: IBox): void {}
		protected download(pData: IPixelBox): void {}

		_bindToFramebuffer(pAttachment: any, iZOffset: uint): void {}
		_getWEBGLFormat(): int { return this._iWEBGLInternalFormat; }

		create(iWidth: uint, iHeight: uint, iDepth: uint, eFormat: EPixelFormats, iFlags: int): bool;
		create(iByteSize: uint, iFlags: int, pData: ArrayBuffer): bool;

		create(iWidth: any, iHeight?: any, iDepth?: any, eFormat?: EPixelFormats, iFlags?: int): bool {
			return false;
		}

		destroy(): void { 
			this._pBuffer = null;

			super.destroy();
		}

		readData(ppDest: ArrayBufferView): bool;
		readData(iOffset: uint, iSize: uint, ppDest: ArrayBufferView): bool;
		readData(): bool {
			CRITICAL("Reading a byte range is not implemented. Use blitToMemory.");
			return false;
		}

		writeData(pData: Uint8Array, iOffset?: uint, iSize?: uint, bDiscardWholeBuffer?: bool): bool;
		writeData(pData: ArrayBuffer, iOffset?: uint, iSize?: uint, bDiscardWholeBuffer?: bool): bool;
		writeData(): bool {
			CRITICAL("Writing a byte range is not implemented. Use blitFromMemory.");
			return false;
		}


		//=====

		blit(pSource: IPixelBuffer, pSrcBox: IBox, pDestBox: IBox): bool;
		blit(pSource: IPixelBuffer);
		blit(pSource: IPixelBuffer, pSrcBox?: IBox, pDestBox?: IBox): bool {
			if (arguments.length == 1) {
				return this.blit(pSource, 
		            new geometry.Box(0, 0, 0, pSource.width, pSource.height, pSource.depth), 
		            new geometry.Box(0, 0, 0, this._iWidth, this._iHeight, this._iDepth)
		        );
			}
			else {
				if(pSource === <IPixelBuffer>this) {
					ERROR("Source must not be the same object",
		                "HardwarePixelBuffer::blit" ) ;
				}

				const pSrclock: IPixelBox = pSource.getPixels(pSrcBox);

				//LockOptions method = HBL_NORMAL;
				// if (pDestBox.left == 0 && pDestBox.top == 0 && pDestBox.front == 0 &&
				//    pDestBox.right == this._iWidth && pDestBox.bottom == this._iHeight &&
				//    pDestBox.back == this._iDepth);
					// Entire buffer -- we can discard the previous contents
					//method = HBL_DISCARD;
					
				const pDstlock: IPixelBox = this.getPixels(pDestBox);

				if(pDstlock.width != pSrclock.width ||
		        	pDstlock.height != pSrclock.height ||
		        	pDstlock.depth != pSrclock.depth) {
					// Scaling desired
					pSrclock.scale(pDstlock);
					//ERROR("TODO: blit() with scale in PixelBuffer:blit()");
				}
				else {
					// No scaling needed
					pixelUtil.bulkPixelConversion(pSrclock, pDstlock);
				}

				return true;
			}
		}

		blitFromMemory(pSource: IPixelBox): bool;
		blitFromMemory(pSource: IPixelBox, pDestBox: IBox): bool {
			if(arguments.length === 1) {
				pDestBox = new geometry.Box(0, 0, 0, this._iWidth, this._iHeight, this._iDepth);
			}	

			return false;
		}

		blitToMemory(pDest: IPixelBox):
		blitToMemory(pSrcBox: IBox, pDest: IPixelBox): bool {
			if(arguments.length === 1){
				pDest = arguments[0];
				pSrcBox = new geometry.Box(0, 0, 0, this._iWidth, this._iHeight, this._iDepth);
			}

			return false;
		}

		getRenderTarget(): IRenderTarget {
			return null;
		}

		lock(iLockFlags: int): any;
		lock(iOffset: uint, iSize: uint, iLockFlags: int = EHardwareBufferFlags.READABLE): any;
		lock(pLockBox: IBox, iLockFlags: int = EHardwareBufferFlags.READABLE): IPixelBox;
		lock(): any {
			var pLockBox: IBox;
			var iLockFlags: int;

			if(isInt(arguments[0])){
				var iOffset: uint;
				var iSize: uint;
				
				if(arguments.length === 1){
					iLockFlags === arguments[0];
					iOffset = 0;
					iSize = this.byteLength;
				}
				else {
					iOffset = arguments[0];
					iSize = arguments[1];
					iLockFlags = (arguments.length === 3) ? arguments[2] : EHardwareBufferFlags.READABLE;
				}
				
				ASSERT(!this.isLocked(), 
					   "Cannot lock this buffer, it is already locked!");
				ASSERT(iOffset === 0 && iSize === this.byteLength, 
					  "Cannot lock memory region, most lock box or entire buffer");

				pLockBox = new geometry.Box(0, 0, 0, this._iWidth, this._iHeight, this._iDepth);
			}

			if(this.isBackupPresent()){
				if (!TEST_ANY(iLockFlags, ELockFlags.WRITE)) {
					// we have to assume a read / write lock so we use the shadow buffer
					// and tag for sync on unlock()
                    this._pBackupUpdated = true;
                }	

                this._pCurrentLock = (<WebGLPixelBuffer>(this._pBackupCopy)).lock(pLockBox, iLockFlags);
			}
			else {
				this._pCurrentLock = this.lockImpl(pLockBox, iLockFlags);
				this._isLocked = true;
			}

			return this._pCurrentLock;
		}

		protected allocateBuffer(): void {
			if(!isNull(this._pBuffer.data)){
				return;
			}

			this._pBuffer.data = new Uint8Array(this.byteLength);
		}

		protected freeBuffer(): void {
			if(TEST_ANY(this._iFlags, EHardwareBufferFlags.STATIC)){
				this._pBuffer.data = null;
			}
		}

		protected lockImpl(iOffset: uint, iSize: uint, iLockFlags: int): any;
		protected lockImpl(pLockBox: IBox, iLockFlags: int): IPixelBox;
		protected lockImpl(): any {
			if(arguments.length === 3){
				CRITICAL("lockImpl(offset,length) is not valid for PixelBuffers and should never be called");
			}

			var pLockBox:IBox = arguments[0];
			var iLockFlags: int = arguments[1];

			this.allocateBuffer();

			if(!TEST_ANY(iLockFlags, ELockFlags.DISCARD) &&
			   TEST_ANY(this._iFlags, EHardwareBufferFlags.READABLE)){

			   	this.download(this._pBuffer);
			}

			this._iCurrentLockFlags = iLockFlags;
			this._pLockedBox = pLockBox;

			return this._pBuffer.getSubBox(pLockBox);
		}

		protected unlockImpl(): void {
			if (TEST_ANY(this._iCurrentLockFlags, ELockFlags.WRITE)) {
	            // From buffer to card, only upload if was locked for writing
	            upload(this._pCurrentLock, this._pLockedBox);
	        }

	        freeBuffer();
		}


	}
}

#endif
