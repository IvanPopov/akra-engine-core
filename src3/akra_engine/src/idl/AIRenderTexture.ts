// AIRenderTexture interface
// [write description here...]

/// <reference path="AIRenderTarget.ts" />
/// <reference path="AIPixelBox.ts" />


module akra {

interface AIRenderTexture extends AIRenderTarget {
	copyContentsToMemory(pDest: AIPixelBox, pBuffer: AEFramebuffer): void;
	suggestPixelFormat(): EPixelFormats;
	getPixelBuffer(): AIPixelBuffer;
}
}

#endif