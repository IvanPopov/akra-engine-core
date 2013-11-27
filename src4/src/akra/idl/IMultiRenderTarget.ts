
/// <reference path="IRenderTarget.ts" />


/// <reference path="IPixelBox.ts" />

module akra {
	export interface IMultiRenderTarget extends IRenderTarget {
		bindSurface(iAttachment: uint, pTarget: IRenderTexture): void;
		unbindSurface(iAttachment: uint): void;
		// copyContentsToMemory(ppDest: IPixelBox, pBuffer: IFrameBuffer);
		suggestPixelFormat(): EPixelFormats;
		getBoundSurfaceList(): IRenderTarget[];
		getBoundSurface(iIndex: uint): IRenderTarget;
	}
}
