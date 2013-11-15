// AIImg interface
// [write description here...]


/// <reference path="AIResourcePoolItem.ts" />
/// <reference path="AIColor.ts" />
/// <reference path="AIPixelBox.ts" />
/// <reference path="AEPixelFormats.ts" />

enum AEImageFlags {
	COMPRESSED = 0x00000001,
	CUBEMAP	= 0x00000002,
	TEXTURE_3D = 0x00000004,
}

enum AEImageCubeFlags {
	POSITIVE_X = 0x00000001,
	NEGATIVE_X = 0x00000002,			
	POSITIVE_Y = 0x00000004,
	NEGATIVE_Y = 0x00000008,
	POSITIVE_Z = 0x000000010,
	NEGATIVE_Z = 0x000000020,
}

interface AIImg extends AIResourcePoolItem {
	byteLength: uint;
	
	width: uint;
	height: uint;
	depth: uint;

	numFaces: uint;
	numMipMaps: uint;
	format: AEPixelFormats;

	flags: uint;
	cubeFlags:uint;

	
	set(pSrc: AIImg): AIImg;

	/** @param Destination image. If destination not specified, original image will be modified.*/
	flipY(pDest?: AIImg): AIImg;
	flipX(pDest?: AIImg): AIImg;


	load(sFileName: string,  fnCallBack?: Function): AIImg;
	load(pData: Uint8Array, sType?: string,  fnCallBack?: Function): AIImg;
	load(pCanvas: HTMLCanvasElement, fnCallBack?: Function): AIImg;


	loadRawData(pData: Uint8Array, iWidth: uint, iHeight: uint, iDepth?: uint, eFormat?: AEPixelFormats, nFaces?: uint, nMipMaps?: uint): AIImg;

	loadDynamicImage(pData: Uint8Array, iWidth: uint, iHeight: uint, iDepth?: uint,
					 eFormat?: AEPixelFormats, nFaces?: uint, nMipMaps?: uint): AIImg;


	create(iWidth: uint, iHeight: uint, iDepth: uint, eFormat: AEPixelFormats, nFaces: uint, nMipMaps: uint): AIImg ;

	convert(eFormat: AEPixelFormats): boolean;

	//Gets the physical width in bytes of each row of pixels.
	getRawSpan(): uint;
	getPixelSize(): uint;
	getBPP(): uint;
	getData(): Uint8Array;

	hasFlag(eFlag: AEImageFlags): boolean;

	hasAlpha(): boolean;
	isCompressed(): boolean;
	isLuminance(): boolean;

	freeMemory();

	getColorAt(pColor: AIColor, x: uint, y: uint, z?:uint): AIColor;
	setColorAt(pColor: AIColor, x: uint, y: uint, z?: uint): void;

	getPixels(nFace?: uint, iMipMap?: uint): AIPixelBox;

	scale(pDest: AIPixelBox, eFilter?: AEFilters): boolean;

	resize(iWidth: uint, iHeight: uint, eFilter?: AEFilters): boolean;

	generatePerlinNoise(fScale: float, iOctaves: int, fFalloff: float): void;
	randomChannelNoise(iChannel: int, iMinRange: int, iMaxRange: int): void;
}
