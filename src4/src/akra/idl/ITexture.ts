
/// <reference path="IRenderResource.ts" />
/// <reference path="IHardwareBuffer.ts" />
/// <reference path="IPixelBuffer.ts" />
/// <reference path="IImg.ts" />
/// <reference path="EPixelFormats.ts" />

module akra {
	export enum ETextureFlags {
		STATIC = <int>EHardwareBufferFlags.STATIC,
		DYNAMIC = <int>EHardwareBufferFlags.DYNAMIC,
		READEBLE = <int>EHardwareBufferFlags.READABLE,
		DYNAMIC_DISCARDABLE = <int>EHardwareBufferFlags.DYNAMIC_DISCARDABLE,
		/// mipmaps will be automatically generated for this texture
		AUTOMIPMAP = 0x100,
		/// this texture will be a render target, i.e. used as a target for render to texture
		/// setting this flag will ignore all other texture usages except AUTOMIPMAP
		RENDERTARGET = 0x200,
		/// default to automatic mipmap generation static textures
		DEFAULT = <int>EHardwareBufferFlags.STATIC
	}
	
	export enum ETextureFilters {
		UNDEF = 0x0000,
		NEAREST = 0x2600,
		LINEAR = 0x2601,
		NEAREST_MIPMAP_NEAREST = 0x2700,
		LINEAR_MIPMAP_NEAREST = 0x2701,
		NEAREST_MIPMAP_LINEAR = 0x2702,
		LINEAR_MIPMAP_LINEAR = 0x2703
	}
	
	export enum ETextureWrapModes {
		UNDEF = 0x0000,
		REPEAT = 0x2901,
		CLAMP_TO_EDGE = 0x812F,
		MIRRORED_REPEAT = 0x8370
	}
	
	export enum ETextureParameters {
		MAG_FILTER = 0x2800,
		MIN_FILTER,
		WRAP_S,
		WRAP_T
	}
	
	export enum ETextureTypes {
		TEXTURE_2D = 0x0DE1,
		TEXTURE_CUBE_MAP = 0x8513,
	}
	
	export enum ECubeFace {
		POSITIVE_X = 0,
		NEGATIVE_X = 1,			
		POSITIVE_Y = 2,
		NEGATIVE_Y = 3,
		POSITIVE_Z = 4,
		NEGATIVE_Z = 5,
	}
	
	export enum ETextureCubeFlags {
		POSITIVE_X = 0x00000001,
		NEGATIVE_X = 0x00000002,			
		POSITIVE_Y = 0x00000004,
		NEGATIVE_Y = 0x00000008,
		POSITIVE_Z = 0x0000000c,
		NEGATIVE_Z = 0x000000010,
	}
	
	export enum ETextureUnits {
		TEXTURE0 = 0x84C0
	}
	
	// export interface ITextureParameters {
	//	 minFilter: ETextureFilters;
	//	 magFilter: ETextureFilters;
	
	//	 wrapS: ETextureWrapModes;
	//	 wrapT: ETextureWrapModes;
	// }
	
	export interface ITexture extends IRenderResource {
		getWidth(): uint;
		getHeight(): uint;
		getDepth(): uint;
	
		getFormat(): EPixelFormats;
		getMipLevels(): uint;
		getTextureType(): ETextureTypes;
		getByteLength(): uint;
	
		setFlags(iTextureFlag: int): void;
		getFlags(): int;   
	
		// calculateSize(): uint;
		getNumFaces(): uint;
		getSize(): uint; 
	
		isTexture2D(): boolean;
		isTextureCube(): boolean;
		isCompressed(): boolean;
		isValid(): boolean;

		unwrapCubeTexture(pCubeTex: ITexture): boolean;
	
		create(iWidth: uint, iHeight: uint, iDepth: uint, cFillColor?: IColor, 
			   eFlags?: ETextureFlags, nMipLevels?: uint, nFaces?: uint, eTextureType?: ETextureTypes, eFormat?: EPixelFormats): boolean;
	
		create(iWidth: uint, iHeight: uint, iDepth: uint, pPixels?: Array<any>, 
			   eFlags?: ETextureFlags, nMipLevels?: uint, nFaces?: uint, eTextureType?: ETextureTypes, eFormat?: EPixelFormats): boolean;
	
		create(iWidth: uint, iHeight: uint, iDepth: uint, pPixels?: ArrayBufferView, 
			   eFlags?: ETextureFlags, nMipLevels?: uint, nFaces?: uint, eTextureType?: ETextureTypes, eFormat?: EPixelFormats): boolean;
	
		getBuffer(iFace?: uint, iMipmap?: uint): IPixelBuffer;	 
	
		setFilter(eParam: ETextureParameters, eValue: ETextureFilters): boolean;
		setWrapMode(eParam: ETextureParameters, eValue: ETextureWrapModes): boolean;
		getFilter(eParam: ETextureParameters): ETextureFilters;
		getWrapMode(eParam: ETextureParameters): ETextureWrapModes;
		
		loadRawData(pData: ArrayBufferView, iWidth: uint, iHeight: uint, iDepth?: uint, eFormat?: EPixelFormats, nFaces?: uint, nMipMaps?: uint): boolean;

		loadImage(pImage: IImg): boolean;

		loadImages(pImages: IImg[]): boolean;
		loadImages(pImages: string[]): boolean;
	
		convertToImage(pDestImage: IImg, bIncludeMipMaps: boolean): void;
	
		copyToTexture(pTarget: ITexture): void;
	
		createInternalTexture(cFillColor?: IColor): boolean;
		freeInternalTexture(): boolean;
	
		reset(): void;
		reset(iSize: uint): void;
		reset(iWidth: uint, iHeight: uint): void;
	}
	
}
