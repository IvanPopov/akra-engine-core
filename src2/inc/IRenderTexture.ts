#ifndef IRENDERTEXTURE_TS
#define IRENDERTEXTURE_TS

#include "IRenderTarget.ts"

module akra {
	
	IFACE(IPixelFormat);
	IFACE(IPixelBox);

	export interface IRenderTexture extends IRenderTarget {
		copyContentsToMemory(pDest: IPixelBox, pBuffer: IFrameBuffer): void;
		suggestPixelFormat(): EPixelFormats;
	}
}

#endif
