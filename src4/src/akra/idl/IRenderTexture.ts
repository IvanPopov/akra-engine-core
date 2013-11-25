/// <reference path="IRenderTarget.ts" />
/// <reference path="IPixelBox.ts" />


module akra {

	interface IRenderTexture extends IRenderTarget {
		copyContentsToMemory(pDest: IPixelBox, pBuffer: EFramebuffer): void;
		suggestPixelFormat(): EPixelFormats;
		getPixelBuffer(): IPixelBuffer;
	}
}

