#ifndef RENDERTEXTURE_TS
#define RENDERTEXTURE_TS

#include "render/RenderTarget.ts"
#include "IRenderTarget.ts"
#include "IPixelBuffer.ts"
#include "IRenderer.ts"
#include "pixelUtil/pixelUtil.ts"
#include "IPixelBox.ts"
#include "IRenderTexture.ts"

module akra.render {
	export class RenderTexture extends RenderTarget implements IRenderTexture {
		protected _pBuffer: IPixelBuffer = null;
		protected _iZOffset: uint = 0;

		constructor(pRenderer: IRenderer, pBuffer: IPixelBuffer, iZOffset: uint){
			super(pRenderer);
			this._pBuffer = pBuffer;
			this._iZOffset = iZOffset;
			this._iWidth = pBuffer.width;
			this._iHeight = pBuffer.height;
			this._iColorDepth = pixelUtil.getNumElemBits(pBuffer.format);
		}

		inline getPixelBuffer(): IPixelBuffer {
			return this._pBuffer;
		}

		destroy(): void {
			this._pBuffer._clearRTT(this._iZOffset);
			this._pBuffer = null;
		}

		inline suggestPixelFormat(): EPixelFormats {
			return this._pBuffer.format;
		}

		copyContentsToMemory(pDest: IPixelBox, eBuffer: EFramebuffer): void {
			if(eBuffer === EFramebuffer.AUTO){
				eBuffer = EFramebuffer.FRONT;
			}

			if(eBuffer !== EFramebuffer.FRONT) {
				CRITICAL("Invalid buffer.");
			}

			this._pBuffer.blitToMemory(pDest);
		} 
	}
}

#endif