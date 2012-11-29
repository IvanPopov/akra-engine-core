#ifndef IIMG_TS
#define IIMG_TS

#include "IResourcePoolItem.ts"
#include "PixelFormat.ts"

module akra {
	 
	export enum EImageFlags {
		COMPRESSED = 0x00000001,
        CUBEMAP    = 0x00000002,
        TEXTURE_3D = 0x00000004
	};

    export interface IImg extends IResourcePoolItem {
    	byteLength: uint;
    	
    	width: uint;
    	height: uint;
    	depth: uint;

    	numFaces: uint;
    	numMipMaps: uint;
    	format: EPixelFormats;


    	set(pSrc: IImg): IImg;

    	/** @param Destination image. If destination not specified, original image will be modified.*/
    	flipY(pDest?: IImg): IImg;
    	flipX(pDest?: IImg): IImg;

    	loadFromMemory(pData: Uint8Array, iWidth: uint, iHeight: uint, eFormat: EPixelFormats): bool;
    	loadFromMemory(pData: Uint8Array, iWidth: uint, iHeight: uint, iDepth: uint, eFormat: EPixelFormats): bool;

    	loadRawData(pData: Uint8Array, iWidth: uint, iHeight: uint, eFormat: EPixelFormats, nFaces?: uint, nMipMaps?: uint): bool;
    	loadRawData(pData: Uint8Array, iWidth: uint, iHeight: uint, iDepth: uint, eFormat: EPixelFormats, nFaces?: uint, nMipMaps?: uint): bool;

    	load(sFilename: string);
    	create(iWidth: uint, iHeight: uint, eFormat: EPixelFormats, iFlags: int): bool;
    	create(iWidth: uint, iHeight: uint, iDepth: uint, eFormat: EPixelFormats, iFlags: int): bool;

    	convert(eFormat: EPixelFormats): bool;

    	//Gets the physical width in bytes of each row of pixels.
    	getRawSpan(): uint;
    	getBPP(): uint;
    	getFlags(): int;
    	getData(): Uint8Array;

    	hasFlag(eFlag: EImageFlags): bool;

    	hasAlpha(): bool;
    	isCompressed(): bool;
    	isLumiance(): bool;

    	freeMemory();

    	getColorAt(x: uint, y: uint, z?:uint): IColor;
    	setColorAt(pColor: IColorValue, x: uint, y: uint, z: uint): void;

    	getPixels(nFace?: uint, iMipMap?: uint): IPixelBox;

    	scale(pDest: IPixelBox, eFilter?: EFilters): bool;

    	resize(iWidth: uint, iHeight: uint, eFilter?: EFilters): bool;

    	generatePerlinNoise(fScale: float, iOctaves: int, fFalloff: float): void;
    	randomChannelNoise(iChannel: int, iMinRange: int, iMaxRange: int): void;

    }

}

#endif