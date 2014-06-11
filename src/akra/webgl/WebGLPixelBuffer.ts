/// <reference path="../idl/IPixelBuffer.ts" />

/// <reference path="../pool/resources/HardwareBuffer.ts" />
/// <reference path="../geometry/Box.ts" />
/// <reference path="../pixelUtil/PixelBox.ts" />

/// <reference path="webgl.ts" />

module akra.webgl {
	export class WebGLPixelBuffer extends pool.resources.HardwareBuffer implements IPixelBuffer {

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

		protected _iByteSize: uint;

		getByteLength(): uint {
			return this._iByteSize;
		}

		getWidth(): uint {
			return this._iWidth;
		}

		getHeight(): uint {
			return this._iHeight;
		}

		getDepth(): uint {
			return this._iDepth;
		}

		getFormat(): EPixelFormats { return this._eFormat; }

		constructor () {
			super();
		}


		//upload(download) data to(from) videocard.
		protected upload(pData: IPixelBox, pDestBox: IBox): void {
			logger.critical("Upload not possible for this pixelbuffer type");
		}

		protected download(pData: IPixelBox): void {
			logger.critical("Download not possible for this pixelbuffer type");
		}

		_bindToFramebuffer(pAttachment: int, iZOffset: uint): void {
			logger.critical("Framebuffer bind not possible for this pixelbuffer type");
		}

		_getWebGLFormat(): int { 
			return this._iWebGLInternalFormat; 
		}

		_clearRTT(iZOffset: uint): void {
		}

		reset(): void;
		reset(iSize: uint): void;
		reset(iWidth: uint, iHeight: uint): void;
		reset(iWidth: uint = this._iWidth, iHeight: uint = iWidth): void {
			this._iWidth = iWidth;
			this._iHeight = iHeight;
		}

		create(iFlags: int): boolean;
		create(iWidth: int, iHeight: int, iDepth: int, eFormat: EPixelFormats, iFlags: int): boolean;
		create(): boolean {
			if(arguments.length === 1) {
				logger.critical("Invalid number of arguments. For PixelBuffer it must be six");
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
			this._iByteSize = iHeight * iWidth * akra.pixelUtil.getNumElemBytes(eFormat);

			this._pBuffer = new pixelUtil.PixelBox(iWidth, iHeight, iDepth, eFormat);
			this._iWebGLInternalFormat = gl.NONE;

			return true;
		}

		destroy(): void { 
			this._pBuffer = null;

			super.destroy();
		}

		destroyResource(): boolean {
			this.destroy();
			this.notifyDestroyed();
			return true;
		}

		readData(ppDest: ArrayBufferView): boolean;
		readData(iOffset: uint, iSize: uint, ppDest: ArrayBufferView): boolean;
		readData(): boolean {
			logger.critical("Reading a byte range is not implemented. Use blitToMemory.");
			return false;
		}

		writeData(pData: Uint8Array, iOffset?: uint, iSize?: uint, bDiscardWholeBuffer?: boolean): boolean;
		writeData(pData: ArrayBuffer, iOffset?: uint, iSize?: uint, bDiscardWholeBuffer?: boolean): boolean;
		writeData(): boolean {
			logger.critical("Writing a byte range is not implemented. Use blitFromMemory.");
			return false;
		}

		readPixels(pDestBox: IPixelBox): boolean {
			this.download(pDestBox);
			return true;
		}

		//=====

		blit(pSource: IPixelBuffer): boolean;
		blit(pSource: IPixelBuffer, pSrcBox: IBox, pDestBox: IBox): boolean;
		blit(pSource: IPixelBuffer, pSrcBox?: IBox, pDestBox?: IBox): boolean {
			if (arguments.length == 1) {
				return this.blit(pSource, 
					new geometry.Box(0, 0, 0, pSource.getWidth(), pSource.getHeight(), pSource.getDepth()), 
					new geometry.Box(0, 0, 0, this._iWidth, this._iHeight, this._iDepth)
				);
			}
			else {
				if(pSource === <IPixelBuffer>this) {
					logger.critical("Source must not be the same object") ;
				}

				var pSrclock: IPixelBox = pSource.lock(pSrcBox, ELockFlags.READ);

				var eLockMethod: ELockFlags = ELockFlags.NORMAL;
				if (pDestBox.left === 0 && pDestBox.top === 0 && pDestBox.front === 0 &&
					pDestBox.right === this._iWidth && pDestBox.bottom === this._iHeight &&
					pDestBox.back === this._iDepth) {
					// Entire buffer -- we can discard the previous contents
					eLockMethod = ELockFlags.DISCARD;
				}
					
				var pDstlock: IPixelBox = this.lock(pDestBox, eLockMethod);

				if (pDstlock.getWidth() != pSrclock.getWidth() ||
					pDstlock.getHeight() != pSrclock.getHeight() ||
					pDstlock.getDepth() != pSrclock.getDepth()) {
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

		unwrapFromCubeTexture(pCubeTex: ITexture): boolean {
			return false;
		}

		blitFromMemory(pSource: IPixelBox): boolean;
		blitFromMemory(pSource: IPixelBox, pDestBox: IBox): boolean;
		blitFromMemory(): boolean {
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
				logger.critical("Destination box out of range");
			}

			var pScaledBox: IPixelBox;

			if (pSource.getWidth() != pDestBox.getWidth() ||
				pSource.getHeight() != pDestBox.getHeight() ||
				pSource.getDepth() != pDestBox.getDepth()) {
				// Scale to destination size.
				// This also does pixel format conversion if needed
				this.allocateBuffer();
				pScaledBox = this._pBuffer.getSubBox(pDestBox);
				pScaledBox.setConsecutive();

				pSource.scale(pScaledBox, EFilters.BILINEAR);
			}
			else if ((pSource.format !== this._eFormat) ||
					 (getWebGLFormat(pSource.format) === 0)) {
				// Extents match, but format is not accepted as valid source format for GL
				// do conversion in temporary buffer
				this.allocateBuffer();
				pScaledBox = this._pBuffer.getSubBox(pDestBox);
				pScaledBox.setConsecutive();
				debugger;
				pixelUtil.bulkPixelConversion(pSource, pScaledBox);
				
				// if(this._eFormat === EPixelFormats.A4R4G4B4)
				// {
				//     // ARGB->BGRA
				//     convertToWebGLformat(pScaledBox, pScaledBox);
				// }
			}
			else {
				this.allocateBuffer();
				pScaledBox = pSource;
			}

			this.upload(pScaledBox, pDestBox);
			this.freeBuffer();

			return true;
		}

		blitToMemory(pDest: IPixelBox): boolean;
		blitToMemory(pSrcBox: IBox, pDest: IPixelBox): boolean;
		blitToMemory(): boolean {
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
				logger.critical("source box out of range");
			}

			if (pSrcBox.left == 0 && pSrcBox.right == this._iWidth &&
				pSrcBox.top == 0 && pSrcBox.bottom == this._iHeight &&
				pSrcBox.front == 0 && pSrcBox.back == this._iDepth &&
				pDest.getWidth() == this._iWidth &&
				pDest.getHeight() == this._iHeight &&
				pDest.getDepth() == this._iDepth &&
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

				if(pSrcBox.getWidth() != pDest.getWidth() ||
					pSrcBox.getHeight() != pDest.getHeight() ||
				   pSrcBox.getDepth() != pDest.getDepth()) {
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

		lock(iLockFlags: int): IPixelBox;
		lock(pLockBox: IBox, iLockFlags?: int): IPixelBox;
		lock(iOffset: uint, iSize: uint, iLockFlags?: int): IPixelBox;		
		lock(): IPixelBox {
			var pLockBox: IBox = null;
			var iLockFlags: int = 0;

			if(isInt(arguments[0])){
				var iOffset: uint;
				var iSize: uint;
				
				if(arguments.length === 1){
					iLockFlags = arguments[0];
					iOffset = 0;
					iSize = this.getByteLength();
				}
				else {
					iOffset = arguments[0];
					iSize = arguments[1];
					iLockFlags = (arguments.length === 3) ? arguments[2] : EHardwareBufferFlags.READABLE;
				}
				
				logger.assert(!this.isLocked(), 
					   "Cannot lock this buffer, it is already locked!");
				logger.assert(iOffset === 0 && iSize === this.getByteLength(), 
					  "Cannot lock memory region, most lock box or entire buffer");

				pLockBox = new geometry.Box(0, 0, 0, this._iWidth, this._iHeight, this._iDepth);
			}
			else {
				pLockBox = <IBox>arguments[0];
			}

			if(this.isBackupPresent()){
				if (!bf.testAny(iLockFlags, ELockFlags.WRITE)) {
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

			this._pBuffer.data = new Uint8Array(this.getByteLength());
		}

		protected freeBuffer(): void {
			if(bf.testAny(this._iFlags, EHardwareBufferFlags.STATIC)){
				this._pBuffer.data = null;
			}
		}

		protected lockImpl(iOffset: uint, iSize: uint, iLockFlags: int): any;
		protected lockImpl(pLockBox: IBox, iLockFlags: int): IPixelBox;
		protected lockImpl(): any {
			if(arguments.length === 3){
				logger.critical("lockImpl(offset,length) is not valid for PixelBuffers and should never be called");
			}

			var pLockBox:IBox = arguments[0];
			var iLockFlags: int = arguments[1];

			this.allocateBuffer();

			if(!bf.testAny(iLockFlags, ELockFlags.DISCARD) &&
			   bf.testAny(this._iFlags, EHardwareBufferFlags.READABLE)){

				this.download(this._pBuffer);
			}

			this._iCurrentLockFlags = iLockFlags;
			this._pLockedBox = pLockBox;

			return this._pBuffer.getSubBox(pLockBox);
		}

		protected unlockImpl(): void {
			if (bf.testAny(this._iCurrentLockFlags, ELockFlags.WRITE)) {
				// From buffer to card, only upload if was locked for writing
				this.upload(this._pCurrentLock, this._pLockedBox);
			}

			this.freeBuffer();
		}

	}
}