// AIPixelBuffer interface
// [write description here...]

/// <reference path="AIHardwareBuffer.ts" />
/// <reference path="AIRenderTarget.ts" />
/// <reference path="AIBox.ts" />
/// <reference path="AEPixelFormats.ts" />

interface AIPixelBuffer extends AIHardwareBuffer {
	/** readonly */ width: uint;
	/** readonly */ height: uint;
	/** readonly */ depth: uint;

	/** readonly */ format: AEPixelFormats;

	create(iFlags: int): boolean;
	create(iWidth: int, iHeight: int, iDepth: int, eFormat: AEPixelFormats, iFlags: int): boolean;

	blit(pSource: AIPixelBuffer, pSrcBox: AIBox, pDestBox: AIBox): boolean;
	blit(pSource: AIPixelBuffer);

	blitFromMemory(pSource: AIPixelBox): boolean;
	blitFromMemory(pSource: AIPixelBox, pDestBox?: AIBox): boolean;

	blitToMemory(pDest: AIPixelBox): boolean;
	blitToMemory(pSrcBox: AIBox, pDest: AIPixelBox): boolean;

	getRenderTarget(): AIRenderTarget;

	lock(iLockFlags: int): any;
	lock(iOffset: uint, iSize: uint, iLockFlags?: int): any;
	lock(pLockBox: AIBox, iLockFlags?: int): AIPixelBox;

	readPixels(pDestBox: AIPixelBox): boolean;

	_clearRTT(iZOffset: uint): void;
	
	reset(): void;
	reset(iSize: uint): void;
	reset(iWidth: uint, iHeight: uint): void;
}
