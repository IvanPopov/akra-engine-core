

/// <reference path="IResourcePoolItem.ts" />
/// <reference path="IColor.ts" />
/// <reference path="IPixelBox.ts" />
/// <reference path="EPixelFormats.ts" />

module akra {
	export enum EImageFlags {
		COMPRESSED = 0x00000001,
		CUBEMAP	= 0x00000002,
		TEXTURE_3D = 0x00000004,
	}
	
	export enum EImageCubeFlags {
		POSITIVE_X = 0x00000001,
		NEGATIVE_X = 0x00000002,			
		POSITIVE_Y = 0x00000004,
		NEGATIVE_Y = 0x00000008,
		POSITIVE_Z = 0x000000010,
		NEGATIVE_Z = 0x000000020,
	}
	
	export interface IImg extends IResourcePoolItem {
		getByteLength(): uint;
		
		getWidth(): uint;
		getHeight(): uint;
		getDepth(): uint;
	
		getNumFaces(): uint;
		getNumMipMaps(): uint;
		getFormat(): EPixelFormats;
	
		getFlags(): uint;
		getCubeFlags():uint;	
		
		set(pSrc: IImg): IImg;
	
		/** @param Destination image. If destination not specified, original image will be modified.*/
		flipY(pDest?: IImg): IImg;
		flipX(pDest?: IImg): IImg;
	
	
		load(sFileName: string,  fnCallBack?: Function): IImg;
		load(pData: Uint8Array, sType?: string,  fnCallBack?: Function): IImg;
		load(pCanvas: HTMLCanvasElement, fnCallBack?: Function): IImg;
	
	
		loadRawData(pData: Uint8Array, iWidth: uint, iHeight: uint, iDepth?: uint, eFormat?: EPixelFormats, nFaces?: uint, nMipMaps?: uint): IImg;
	
		loadDynamicImage(pData: Uint8Array, iWidth: uint, iHeight: uint, iDepth?: uint,
						 eFormat?: EPixelFormats, nFaces?: uint, nMipMaps?: uint): IImg;
	
	
		create(iWidth: uint, iHeight: uint, iDepth: uint, eFormat: EPixelFormats, nFaces: uint, nMipMaps: uint): IImg ;
	
		convert(eFormat: EPixelFormats): boolean;
	
		//Gets the physical width in bytes of each row of pixels.
		getRawSpan(): uint;
		getPixelSize(): uint;
		getBPP(): uint;
		getData(): Uint8Array;
	
		hasFlag(eFlag: EImageFlags): boolean;
	
		hasAlpha(): boolean;
		isCompressed(): boolean;
		isLuminance(): boolean;
	
		freeMemory();
	
		getColorAt(pColor: IColor, x: uint, y: uint, z?:uint): IColor;
		setColorAt(pColor: IColor, x: uint, y: uint, z?: uint): void;
	
		getPixels(nFace?: uint, iMipMap?: uint): IPixelBox;
	
		scale(pDest: IPixelBox, eFilter?: EFilters): boolean;
	
		resize(iWidth: uint, iHeight: uint, eFilter?: EFilters): boolean;
	
		generatePerlinNoise(fScale: float, iOctaves: int, fFalloff: float): void;
		randomChannelNoise(iChannel: int, iMinRange: int, iMaxRange: int): void;
	}
	
}
