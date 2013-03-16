#ifndef WEBGLPIXELBUFFER_TS
#define WEBGLPIXELBUFFER_TS

#include "IPixelBuffer.ts"
#include "core/pool/resources/HardwareBuffer.ts"
#include "geometry/Box.ts"
#include "webgl/webgl.ts"
#include "pixelUtil/PixelBox.ts"

module akra.webgl {
	export class WebGLPixelBuffer extends core.pool.resources.HardwareBuffer implements IPixelBuffer {

		protected _iWidth: uint = 0;
		protected _iHeight: uint = 0;
		protected _iDepth: uint = 0;

		// Pitches (offsets between rows and slices)
		protected _iRowPitch: uint = 0;
		protected _iSlicePitch: uint = 0;

		protected _eFormat: EPixelFormats = EPixelFormats.UNKNOWN;

		//webgl specific
		
		protected _pCurrentLock: IPixelBox = null;
		protected _pLockedBox: IBox = null;
		protected _iCurrentLockFlags: int = 0;
		
		protected _pBuffer: IPixelBox = null;
		protected _iWebGLInternalFormat: int = 0;

		inline get width(): uint { return this._iWidth; }
		inline get height(): uint { return this._iHeight; }
		inline get depth(): uint { return this._iDepth; }

		inline get format(): uint { return this._eFormat; }


		constructor () {
			super();
		}


		//upload(download) data to(from) videocard.
		protected upload(pData: IPixelBox, pDestBox: IBox): void {
			CRITICAL("Upload not possible for this pixelbuffer type");
		}

		protected download(pData: IPixelBox): void {
			CRITICAL("Download not possible for this pixelbuffer type");
		}

		_bindToFramebuffer(pAttachment: int, iZOffset: uint): void {
			CRITICAL("Framebuffer bind not possible for this pixelbuffer type");
		}

		_getWebGLFormat(): int { 
			return this._iWebGLInternalFormat; 
		}

		_clearRTT(iZOffset: uint): void {
		}

		create(iFlags: int): bool;
		create(iWidth: int, iHeight: int, iDepth: int, eFormat: EPixelFormats, iFlags: int): bool;
		create(): bool {
			if(arguments.length === 1) {
				CRITICAL("Invalid number of arguments. For PixelBuffer it must be six");
			}
			var iWidth: int = arguments[0];
			var iHeight: int = arguments[1];
			var iDepth: int = arguments[2];
			var eFormat: int = arguments[3];
			var iFlags: int = arguments[4];

 			super.create(iFlags);
			
			this._iWidth = iWidth;
			this._iHeight = iHeight;
			this._iDepth = iDepth;
			this._eFormat = eFormat;

			this._iRowPitch = iWidth;
			this._iSlicePitch = iHeight * iWidth;
			this.byteLength = iHeight * iWidth * akra.pixelUtil.getNumElemBytes(eFormat);

			this._pBuffer = new pixelUtil.PixelBox(iWidth, iHeight, iDepth, eFormat);
			this._iWebGLInternalFormat = GL_NONE;

			return true;
		}

		destroy(): void { 
			this._pBuffer = null;

			super.destroy();
		}

		destroyResource(): bool {
			this.destroy();
			this.notifyDestroyed();
			return true;
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

		blit(pSource: IPixelBuffer): bool;
		blit(pSource: IPixelBuffer, pSrcBox: IBox, pDestBox: IBox): bool;
		blit(pSource: IPixelBuffer, pSrcBox?: IBox, pDestBox?: IBox): bool {
			if (arguments.length == 1) {
				return this.blit(pSource, 
		            new geometry.Box(0, 0, 0, pSource.width, pSource.height, pSource.depth), 
		            new geometry.Box(0, 0, 0, this._iWidth, this._iHeight, this._iDepth)
		        );
			}
			else {
				if(pSource === <IPixelBuffer>this) {
					CRITICAL("Source must not be the same object") ;
				}

				const pSrclock: IPixelBox = pSource.lock(pSrcBox, ELockFlags.READ);

				var eLockMethod: ELockFlags = ELockFlags.NORMAL;
				if (pDestBox.left === 0 && pDestBox.top === 0 && pDestBox.front === 0 &&
				    pDestBox.right === this._iWidth && pDestBox.bottom === this._iHeight &&
				    pDestBox.back === this._iDepth) {
					// Entire buffer -- we can discard the previous contents
					eLockMethod = ELockFlags.DISCARD;
				}
					
				const pDstlock: IPixelBox = this.lock(pDestBox, eLockMethod);

				if (pDstlock.width != pSrclock.width ||
		            pDstlock.height != pSrclock.height ||
		            pDstlock.depth != pSrclock.depth) {
					// Scaling desired
					pSrclock.scale(pDstlock);
				}
				else {
					// No scaling needed
					akra.pixelUtil.bulkPixelConversion(pSrclock, pDstlock);
				}

				this.unlock();
				pSource.unlock();

				return true;
			}
		}

		blitFromMemory(pSource: IPixelBox): bool;
		blitFromMemory(pSource: IPixelBox, pDestBox: IBox): bool;
		blitFromMemory(): bool {
			var pSource: IPixelBox;
			var pDestBox: IBox;

			pSource = arguments[0];

			if(arguments.length === 1) {
				pDestBox = new geometry.Box(0, 0, 0, this._iWidth, this._iHeight, this._iDepth);
				return this.blitFromMemory(pSource, pDestBox);
			}
			else{
				pDestBox = arguments[1];
			}	

			if (!this._pBuffer.contains(pDestBox)) {
				CRITICAL("Destination box out of range");
	        }

	        var pScaledBox: IPixelBox;

	        if (pSource.width != pDestBox.width ||
	            pSource.height != pDestBox.height ||
	            pSource.depth != pDestBox.depth) {
	            // Scale to destination size.
	            // This also does pixel format conversion if needed
	            this.allocateBuffer();
	            pScaledBox = this._pBuffer.getSubBox(pDestBox);
	            pSource.scale(pScaledBox, EFilters.BILINEAR);
	        }
	        else if ((pSource.format != this._eFormat) ||
	                 ((getWebGLFormat(pSource.format) == 0) && (pSource.format != EPixelFormats.R8G8B8))) {
	            // Extents match, but format is not accepted as valid source format for GL
	            // do conversion in temporary buffer
	            this.allocateBuffer();
	            pScaledBox = this._pBuffer.getSubBox(pDestBox);

	            pixelUtil.bulkPixelConversion(pSource, pScaledBox);
	            
	            if(this._eFormat === EPixelFormats.A4R4G4B4)
	            {
	                // ARGB->BGRA
	                convertToWebGLformat(pScaledBox, pScaledBox);
	            }
	        }
	        else {
	            this.allocateBuffer();
	            pScaledBox = pSource;

	            if (pSource.format == EPixelFormats.R8G8B8) 
	            {
	                pScaledBox.format = EPixelFormats.B8G8R8;
	                
	                pixelUtil.bulkPixelConversion(pSource, pScaledBox);
	            }
	        }

	        this.upload(pScaledBox, pDestBox);
	        this.freeBuffer();

			return true;
		}

		blitToMemory(pDest: IPixelBox): bool;
		blitToMemory(pSrcBox: IBox, pDest: IPixelBox): bool;
		blitToMemory(): bool {
			var pSrcBox: IBox;
			var pDest: IPixelBox;

			if(arguments.length === 1){
				pDest = arguments[0];
				pSrcBox = new geometry.Box(0, 0, 0, this._iWidth, this._iHeight, this._iDepth);
				return this.blitToMemory(pSrcBox, pDest);
			}
			else{
				pSrcBox = arguments[0];
				pDest = arguments[1];
			} 

			if (!this._pBuffer.contains(pSrcBox)) {
				CRITICAL("source box out of range");
	        }

	        if (pSrcBox.left == 0 && pSrcBox.right == this._iWidth &&
            	pSrcBox.top == 0 && pSrcBox.bottom == this._iHeight &&
            	pSrcBox.front == 0 && pSrcBox.back == this._iDepth &&
            	pDest.width == this._iWidth &&
            	pDest.height == this._iHeight &&
            	pDest.depth == this._iDepth &&
            	getWebGLFormat(pDest.format) != 0) {
	            // The direct case: the user wants the entire texture in a format supported by GL
	            // so we don't need an intermediate buffer
	            this.download(pDest);
	        }
	        else {
	            // Use buffer for intermediate copy
	            this.allocateBuffer();
	            // Download entire buffer
	            this.download(this._pBuffer);

	            if(pSrcBox.width != pDest.width ||
	               pSrcBox.height != pDest.height ||
	               pSrcBox.depth != pDest.depth) {
	                // We need scaling
	                this._pBuffer.getSubBox(pSrcBox).scale(pDest, EFilters.BILINEAR);
	            }
	            else {
	                // Just copy the bit that we need
	                pixelUtil.bulkPixelConversion(this._pBuffer.getSubBox(pSrcBox), pDest);
	            }
	            this.freeBuffer();
	        }

			return true;
		}

		getRenderTarget(): IRenderTarget {
			return null;
		}

		lock(iLockFlags: int): any;
		lock(iOffset: uint, iSize: uint, iLockFlags: int = EHardwareBufferFlags.READABLE): any;
		lock(pLockBox: IBox, iLockFlags: int = EHardwareBufferFlags.READABLE): IPixelBox;
		lock(): any {
			var pLockBox: IBox = null;
			var iLockFlags: int = 0;

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
	            this.upload(this._pCurrentLock, this._pLockedBox);
	        }

	        this.freeBuffer();
		}





	}
}

#endif
