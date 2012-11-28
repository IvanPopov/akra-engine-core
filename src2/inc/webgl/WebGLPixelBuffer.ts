#ifndef WEBGLPIXELBUFFER_TS
#define WEBGLPIXELBUFFER_TS

#include "IPixelBuffer.ts"
#include "core/pool/resource/HardwareBuffer.ts"

module akra.webgl {
	export class WebGLPixelBuffer extends core.pool.resources.HardwareBuffer implements IPixelBuffer {

		protected _iWidth: uint = 0;
		protected _iHeight: uint = 0;
		protected _iDepth: uint = 0;

		// Pitches (offsets between rows and slices)
		protected _iRowPitch: uint;
		protected _iSlicePitch: uint;

		protected _eFormat: EPixelFormats = EPixelFormats.UNKNOWN;

		inline get width(): uint { return this._iWidth; }
		inline get height(): uint { return this._iHeight; }
		inline get depth(): uint { return this._iDepth; }

		inline get format(): uint { return this._eFormat; }


		constructor () {

		}

		create(iWidth: uint, iHeight: uint, iDepth: uint, eFormat: EPixelFormats, iFlags: int): bool;
		create(iByteSize: uint, iFlags: int, pData: ArrayBuffer): bool;

		create(iWidth: any, iHeight: any, iDepth: any, eFormat?: EPixelFormats, iFlags?: int): bool {

		}

		destroy(): void;

		getData(): ArrayBuffer;
		getData(iOffset: uint, iSize: uint): ArrayBuffer;
		setData(pData: ArrayBuffer, iOffset: uint, iSize: uint): bool;

		resize(iSize: uint): bool;

		//=====

		blit(pSource: IPixelBuffer, pSrcBox: IBox, pDestBox: IBox): bool;
		blit(pSource: IPixelBuffer);
		blit(pSource: IPixelBuffer, pSrcBox?: IBox, pDestBox?: IBox): bool {
			if (arguments.length == 1) {x
				return this.blit(pSource, 
		            new Box(0, 0, 0, pSource.width, pSource.height, pSource.depth), 
		            new Box(0, 0, 0, this._iWidth, this._iHeight, this._iDepth)
		        );
			}
			else {
				if(pSource === this) {
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
					//pSrclock.scale(pDstlock);
					ERROR("TODO: blit() with scale in PixelBuffer:blit()");
				}
				else {
					// No scaling needed
					pixelUtil.bulkPixelConversion(pSrclock, pDstlock);
				}

				return true;
			}
		}

		blitFromMemory(pSource: IPixelBox, pDestBox?: IBox): bool;
		blitToMemory(pSrcBox: IBox, pDest?: IPixelBuffer): bool;

		getRenderTarget(): IRenderTarget;

		getPixels(pDstBox: IBox): IPixelBox;
	}
}

#endif
