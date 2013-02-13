#ifndef IRENDERTEXTURE_TS
#define IRENDERTEXTURE_TS

#include "IRenderTarget.ts"
#include "IPixelBox.ts"
#include "pixelUtil/pixelUtil.ts"

module akra {
	
	export interface IRenderTexture extends IRenderTarget {
		copyContentsToMemory(pDest: IPixelBox, pBuffer: EFramebuffer): void;
		suggestPixelFormat(): EPixelFormats;
	}
}

#endif
