#ifndef IPIXELBUFFER_TS
#define IPIXELBUFFER_TS

#include "IHardwareBuffer.ts"

module akra {
	export interface IPixelBuffer extends IHardwareBuffer {
		readonly width: uint;
		readonly height: uint;
		readonly depth: uint;

		readonly format: EPixelFormats;

		blit(pSource: IPixelBuffer, pSrcBox: IBox, pDestBox: IBox): bool;
		blit(pSource: IPixelBuffer);

		blitFromMemory(pSource: IPixelBox, pDestBox?: IBox): bool;
		blitToMemory(pSrcBox: IBox, pDest?: IPixelBuffer): bool;

		getRenderTarget(): IRenderTarget;

		getPixels(pDstBox: IBox): IPixelBox;

		lock(iLockFlags: int): any;
		lock(iOffset: uint, iSize: uint, iLockFlags?: int): any;
		lock(pLockBox: IBox, iLockFlags?: int): IPixelBox;
	}
}

#endif