/// <reference path="IHardwareBuffer.ts" />
/// <reference path="IRenderTarget.ts" />
/// <reference path="IBox.ts" />
/// <reference path="EPixelFormats.ts" />

module akra {
	export interface IPixelBuffer extends IHardwareBuffer, IRenderResource {
		getWidth(): uint;
		getHeight(): uint;
		getDepth(): uint;
	
		getFormat(): EPixelFormats;
	
		create(iFlags: int): boolean;
		create(iWidth: int, iHeight: int, iDepth: int, eFormat: EPixelFormats, iFlags: int): boolean;
	
		blit(pSource: IPixelBuffer, pSrcBox: IBox, pDestBox: IBox): boolean;
		blit(pSource: IPixelBuffer);

		unwrapFromCubeTexture(pCubeTex: ITexture): boolean;
	
		blitFromHTMLlImage(pImage: HTMLImageElement): boolean;

		blitFromMemory(pSource: IPixelBox): boolean;
		blitFromMemory(pSource: IPixelBox, pDestBox?: IBox): boolean;
	
		blitToMemory(pDest: IPixelBox): boolean;
		blitToMemory(pSrcBox: IBox, pDest: IPixelBox): boolean;
	
		getRenderTarget(): IRenderTarget;
	
		lock(iLockFlags: int): IPixelBox;
		lock(iOffset: uint, iSize: uint, iLockFlags?: int): IPixelBox;
		lock(pLockBox: IBox, iLockFlags?: int): IPixelBox;
	
		readPixels(pDestBox: IPixelBox): boolean;
	
		_clearRTT(iZOffset: uint): void;
		
		reset(): void;
		reset(iSize: uint): void;
		reset(iWidth: uint, iHeight: uint): void;
	}
	
}
