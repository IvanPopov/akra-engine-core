#ifndef IPIXELBUFFER_TS
#define IPIXELBUFFER_TS

#include "IHardwareBuffer.ts"

module akra {
	export interface IPixelBuffer extends IHardwareBuffer {
		readonly width: uint;
		readonly height: uint;
		readonly depth: uint;

		readonly format: EPixelFormats;

		create(iFlags: int): bool;
		create(iWidth: int, iHeight: int, iDepth: int, eFormat: EPixelFormats, iFlags: int): bool;

		blit(pSource: IPixelBuffer, pSrcBox: IBox, pDestBox: IBox): bool;
		blit(pSource: IPixelBuffer);

		blitFromMemory(pSource: IPixelBox): bool;
		blitFromMemory(pSource: IPixelBox, pDestBox?: IBox): bool;

		blitToMemory(pDest: IPixelBox): bool;
		blitToMemory(pSrcBox: IBox, pDest: IPixelBox): bool;

		getRenderTarget(): IRenderTarget;

		lock(iLockFlags: int): any;
		lock(iOffset: uint, iSize: uint, iLockFlags?: int): any;
		lock(pLockBox: IBox, iLockFlags?: int): IPixelBox;

		_clearRTT(iZOffset: uint): void;
	}
}

#endif