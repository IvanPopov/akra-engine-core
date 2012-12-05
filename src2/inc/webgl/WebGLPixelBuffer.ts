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

		getData(): Uint8Array;
		getData(iOffset: uint, iSize: uint): Uint8Array;
		getData(iOffset?: uint, iSize?: uint): Uint8Array {
			return null;
		}

		setData(pData: Uint8Array, iOffset: uint, iSize: uint): bool;
		setData(pData: ArrayBuffer, iOffset: uint, iSize: uint): bool;
		setData(pData: any, iOffset: uint, iSize: uint): bool { return false; }

		resize(iSize: uint): bool { return false; }

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

		blitFromMemory(pSource: IPixelBox, pDestBox?: IBox): bool {
			return false;
		}

		blitToMemory(pSrcBox: IBox, pDest?: IPixelBuffer): bool {
			return false;
		}

		getRenderTarget(): IRenderTarget {
			return null;
		}

		getPixels(pDstBox: IBox): IPixelBox {
			if (this.isBackupPresent()) {
				
			}

			return null;
		}
	}
}

#endif
