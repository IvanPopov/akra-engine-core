// AIMultiRenderTarget interface
// [write description here...]

/// <reference path="AIRenderTarget.ts" />


/// <reference path="AIPixelBox.ts" />

interface AIMultiRenderTarget extends AIRenderTarget {
	bindSurface(iAttachment: uint, pTarget: AIRenderTexture): void;
	unbindSurface(iAttachment: uint): void;
	// copyContentsToMemory(ppDest: AIPixelBox, pBuffer: IFrameBuffer);
	suggestPixelFormat(): EPixelFormats;
	getBoundSurfaceList(): AIRenderTarget[];
	getBoundSurface(iIndex: uint): AIRenderTarget;
}