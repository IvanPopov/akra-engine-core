// IRenderTexture export interface
// [write description here...]

/// <reference path="IRenderTarget.ts" />
/// <reference path="IPixelBox.ts" />

module akra {
	export interface IRenderTexture extends IRenderTarget {
		copyContentsToMemory(pDest: IPixelBox, pBuffer: EFramebuffer): void;
		suggestPixelFormat(): EPixelFormats;
		getPixelBuffer(): IPixelBuffer;
	}
}

