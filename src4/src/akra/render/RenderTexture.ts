/// <reference path="../idl/IRenderTarget.ts" />
/// <reference path="../idl/IPixelBuffer.ts" />
/// <reference path="../idl/IRenderer.ts" />
/// <reference path="../idl/IPixelBox.ts" />
/// <reference path="../idl/IRenderTexture.ts" />

/// <reference path="../pixelUtil/pixelUtil.ts" />


/// <reference path="RenderTarget.ts" />

module akra.render {
	export class RenderTexture extends RenderTarget implements IRenderTexture {
		protected _pBuffer: IPixelBuffer = null;
		protected _iZOffset: uint = 0;

		constructor(pRenderer: IRenderer, pBuffer: IPixelBuffer, iZOffset: uint) {
			super(pRenderer);
			this._pBuffer = pBuffer;
			this._iZOffset = iZOffset;
			this._iWidth = pBuffer.getWidth();
			this._iHeight = pBuffer.getHeight();
			this._iColorDepth = pixelUtil.getNumElemBits(pBuffer.getFormat());
		}

		enableSupportFor3DEvent(iType: int): int {
			return 0;
		}

		getPixelBuffer(): IPixelBuffer {
			return this._pBuffer;
		}

		destroy(): void {
			this._pBuffer._clearRTT(this._iZOffset);
			this._pBuffer = null;
		}

		suggestPixelFormat(): EPixelFormats {
			return this._pBuffer.getFormat();
		}

		copyContentsToMemory(pDest: IPixelBox, eBuffer: EFramebuffer): void {
			if (eBuffer === EFramebuffer.AUTO) {
				eBuffer = EFramebuffer.FRONT;
			}

			if (eBuffer !== EFramebuffer.FRONT) {
				logger.critical("Invalid buffer.");
			}

			this._pBuffer.blitToMemory(pDest);
		}

		readPixels(ppDest?: IPixelBox, eFramebuffer?: EFramebuffer): IPixelBox {
			if (isNull(ppDest)) {
				var ePixelFormat: EPixelFormats = EPixelFormats.BYTE_RGB;

				ppDest = new pixelUtil.PixelBox(this._iWidth, this._iHeight, 1, ePixelFormat,
					new Uint8Array(pixelUtil.getMemorySize(this._iWidth, this._iHeight, 1, ePixelFormat)));
			}

			if ((ppDest.right > this._iWidth) || (ppDest.bottom > this._iHeight) || (ppDest.front != 0) || (ppDest.back != 1)) {
				logger.critical("Invalid box.", "RenderTexture::readPixels");
			}

			this._pBuffer.readPixels(ppDest);

			return ppDest;
		}
	}
}