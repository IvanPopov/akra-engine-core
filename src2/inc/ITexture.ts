#ifndef ITEXTURE_TS
#define ITEXTURE_TS

#include "IRenderResource.ts"
#include "PixelFormat.ts"
#include "IHardwareBuffer.ts"
#include "IPixelBuffer.ts"





module akra {

    IFACE(IImg);

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
        DEFAULT = STATIC
    }

    export enum ETextureFilters {
        NEAREST = 0x2600,
        LINEAR = 0x2601,
        NEAREST_MIPMAP_NEAREST = 0x2700,
        LINEAR_MIPMAP_NEAREST = 0x2701,
        NEAREST_MIPMAP_LINEAR = 0x2702,
        LINEAR_MIPMAP_LINEAR = 0x2703
    };

    export enum ETextureWrapModes {
        REPEAT = 0x2901,
        CLAMP_TO_EDGE = 0x812F,
        MIRRORED_REPEAT = 0x8370
    };

    export enum ETextureParameters {
        MAG_FILTER = 0x2800,
        MIN_FILTER,
        WRAP_S,
        WRAP_T
    };

    export enum ETextureTypes {
        TEXTURE_2D = 0x0DE1,
        TEXTURE_CUBE_MAP = 0x8513,
    };
    
    export enum ECubeFace{
        POSITIVE_X = 0,
        NEGATIVE_X = 1,            
        POSITIVE_Y = 2,
        NEGATIVE_Y = 3,
        POSITIVE_Z = 4,
        NEGATIVE_Z = 5,
        };

    export enum ETextureCubeFlags{
        POSITIVE_X = 0x00000001,
        NEGATIVE_X = 0x00000002,            
        POSITIVE_Y = 0x00000004,
        NEGATIVE_Y = 0x00000008,
        POSITIVE_Z = 0x0000000c,
        NEGATIVE_Z = 0x000000010,
        };

    export enum ETextureUnits {
        TEXTURE0 = 0x84C0
    };

// export interface ITextureParameters {
//     minFilter: ETextureFilters;
//     magFilter: ETextureFilters;

//     wrapS: ETextureWrapModes;
//     wrapT: ETextureWrapModes;
// }

    export interface ITexture extends IRenderResource {
    	width: uint;
        height: uint;
        depth: uint;

        format: EPixelFormats;
        mipLevels: uint;

        textureType: ETextureTypes;

        //desiredIntegerBitDepth: uint;
        //desiredFloatBitDepth: uint;     

        //readonly desiredFormat: EPixelFormats;
        //readonly srcFormat: EPixelFormats;
        //readonly srcWidth: uint;
        //readonly srcHeight: uint;
        //readonly srcDepth: uint;

        setFlags(iTextureFlag: int): void;
        getFlags(): int;   

        calculateSize(): uint;
        getNumFaces(): uint;
        getSize(): uint; 

        isTexture2D(): bool;
        isTextureCube(): bool;
        isCompressed(): bool;
        isValid(): bool;

        create(iWidth: uint, iHeight: uint, iDepth: uint, cFillColor?: IColor, 
               eFlags?: ETextureFlags, nMipLevels?: uint, nFaces?: uint, eTextureType?: ETextureTypes, eFormat?: EPixelFormats): bool;

        create(iWidth: uint, iHeight: uint, iDepth: uint, pPixels?: Array, 
               eFlags?: ETextureFlags, nMipLevels?: uint, nFaces?: uint, eTextureType?: ETextureTypes, eFormat?: EPixelFormats): bool;

        create(iWidth: uint, iHeight: uint, iDepth: uint, pPixels?: ArrayBufferView, 
               eFlags?: ETextureFlags, nMipLevels?: uint, nFaces?: uint, eTextureType?: ETextureTypes, eFormat?: EPixelFormats): bool;

        getBuffer(iFace?: uint, iMipmap?: uint): IPixelBuffer;     

        setFilter(eParam: ETextureParameters, eValue: ETextureFilters): bool;
        setWrapMode(eParam: ETextureParameters, eValue: ETextureWrapModes): bool;
        getFilter(eParam: ETextureParameters): ETextureFilters;
        getWrapMode(eParam: ETextureParameters): ETextureWrapModes;
        
        loadRawData(pData: ArrayBufferView, iWidth: uint, iHeight: uint, eFormat: EPixelFormats): bool;
        loadImage(pImage: IImg): bool;
        loadImages(pImages: IImg[]): bool;

        convertToImage(pDestImage: IImg, bIncludeMipMaps: bool): void;

        copyToTexture(pTarget: ITexture): void;

        createInternalTexture(cFillColor?: IColor): bool;
        freeInternalTexture(): bool;

        reset(): void;
        reset(iSize: uint): void;
        reset(iWidth: uint, iHeight: uint): void;

    }
}

#endif
