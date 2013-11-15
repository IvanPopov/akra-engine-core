// AITexture interface
// [write description here...]

/// <reference path="AIRenderResource.ts" />
/// <reference path="AIHardwareBuffer.ts" />
/// <reference path="AIPixelBuffer.ts" />
/// <reference path="AIImg.ts" />
/// <reference path="AEPixelFormats.ts" />

enum AETextureFlags {
	STATIC = <int>AEHardwareBufferFlags.STATIC,
	DYNAMIC = <int>AEHardwareBufferFlags.DYNAMIC,
	READEBLE = <int>AEHardwareBufferFlags.READABLE,
	DYNAMIC_DISCARDABLE = <int>AEHardwareBufferFlags.DYNAMIC_DISCARDABLE,
	/// mipmaps will be automatically generated for this texture
	AUTOMIPMAP = 0x100,
	/// this texture will be a render target, i.e. used as a target for render to texture
	/// setting this flag will ignore all other texture usages except AUTOMIPMAP
	RENDERTARGET = 0x200,
	/// default to automatic mipmap generation static textures
	DEFAULT = STATIC
}

enum AETextureFilters {
	UNDEF = 0x0000,
	NEAREST = 0x2600,
	LINEAR = 0x2601,
	NEAREST_MIPMAP_NEAREST = 0x2700,
	LINEAR_MIPMAP_NEAREST = 0x2701,
	NEAREST_MIPMAP_LINEAR = 0x2702,
	LINEAR_MIPMAP_LINEAR = 0x2703
}

enum AETextureWrapModes {
	UNDEF = 0x0000,
	REPEAT = 0x2901,
	CLAMP_TO_EDGE = 0x812F,
	MIRRORED_REPEAT = 0x8370
}

enum AETextureParameters {
	MAG_FILTER = 0x2800,
	MIN_FILTER,
	WRAP_S,
	WRAP_T
}

enum AETextureTypes {
	TEXTURE_2D = 0x0DE1,
	TEXTURE_CUBE_MAP = 0x8513,
}

enum AECubeFace {
	POSITIVE_X = 0,
	NEGATIVE_X = 1,			
	POSITIVE_Y = 2,
	NEGATIVE_Y = 3,
	POSITIVE_Z = 4,
	NEGATIVE_Z = 5,
}

enum AETextureCubeFlags {
	POSITIVE_X = 0x00000001,
	NEGATIVE_X = 0x00000002,			
	POSITIVE_Y = 0x00000004,
	NEGATIVE_Y = 0x00000008,
	POSITIVE_Z = 0x0000000c,
	NEGATIVE_Z = 0x000000010,
}

enum AETextureUnits {
	TEXTURE0 = 0x84C0
}

// interface AITextureParameters {
//	 minFilter: AETextureFilters;
//	 magFilter: AETextureFilters;

//	 wrapS: AETextureWrapModes;
//	 wrapT: AETextureWrapModes;
// }

interface AITexture extends AIRenderResource {
	width: uint;
	height: uint;
	depth: uint;

	format: AEPixelFormats;
	mipLevels: uint;

	textureType: AETextureTypes;

	/** readonly */ byteLength: uint;

	//desiredIntegerBitDepth: uint;
	//desiredFloatBitDepth: uint;	 

	///** readonly */ desiredFormat: AEPixelFormats;
	///** readonly */ srcFormat: AEPixelFormats;
	///** readonly */ srcWidth: uint;
	///** readonly */ srcHeight: uint;
	///** readonly */ srcDepth: uint;

	setFlags(iTextureFlag: int): void;
	getFlags(): int;   

	// calculateSize(): uint;
	getNumFaces(): uint;
	getSize(): uint; 

	isTexture2D(): boolean;
	isTextureCube(): boolean;
	isCompressed(): boolean;
	isValid(): boolean;

	create(iWidth: uint, iHeight: uint, iDepth: uint, cFillColor?: AIColor, 
		   eFlags?: AETextureFlags, nMipLevels?: uint, nFaces?: uint, eTextureType?: AETextureTypes, eFormat?: AEPixelFormats): boolean;

	create(iWidth: uint, iHeight: uint, iDepth: uint, pPixels?: Array, 
		   eFlags?: AETextureFlags, nMipLevels?: uint, nFaces?: uint, eTextureType?: AETextureTypes, eFormat?: AEPixelFormats): boolean;

	create(iWidth: uint, iHeight: uint, iDepth: uint, pPixels?: ArrayBufferView, 
		   eFlags?: AETextureFlags, nMipLevels?: uint, nFaces?: uint, eTextureType?: AETextureTypes, eFormat?: AEPixelFormats): boolean;

	getBuffer(iFace?: uint, iMipmap?: uint): AIPixelBuffer;	 

	setFilter(eParam: AETextureParameters, eValue: AETextureFilters): boolean;
	setWrapMode(eParam: AETextureParameters, eValue: AETextureWrapModes): boolean;
	getFilter(eParam: AETextureParameters): AETextureFilters;
	getWrapMode(eParam: AETextureParameters): AETextureWrapModes;
	
	loadRawData(pData: ArrayBufferView, iWidth: uint, iHeight: uint, iDepth?: uint, eFormat?: AEPixelFormats, nFaces?: uint, nMipMaps?: uint): boolean;
	loadImage(pImage: AIImg): boolean;
	loadImages(pImages: AIImg[]): boolean;

	convertToImage(pDestImage: AIImg, bIncludeMipMaps: boolean): void;

	copyToTexture(pTarget: AITexture): void;

	createInternalTexture(cFillColor?: AIColor): boolean;
	freeInternalTexture(): boolean;

	reset(): void;
	reset(iSize: uint): void;
	reset(iWidth: uint, iHeight: uint): void;
}
