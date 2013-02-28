#ifndef IMULTIRENDERTARGET_TS
#define IMULTIRENDERTARGET_TS

#include "IRenderTarget.ts"

module akra {
	
	IFACE(IPixelFormat);
	IFACE(IPixelBox);

	export interface IMultiRenderTarget extends IRenderTarget {
		bindSurface(iAttachment: uint, pTarget: IRenderTexture): void;
		unbindSurface(iAttachment: uint): void;
		copyContentsToMemory(ppDest: IPixelBox, pBuffer: IFrameBuffer);
		suggestPixelFormat(): EPixelFormats;
		getBoundSurfaceList(): IRenderTarget[];
		getBoundSurface(iIndex: uint): IRenderTarget;
	}
}

#endif
