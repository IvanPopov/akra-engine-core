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
        DEFAULT = AUTOMIPMAP | STATIC
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
        TEXTURE = 0x1702,
        TEXTURE_CUBE_MAP = 0x8513,
        TEXTURE_BINDING_CUBE_MAP = 0x8514,
        TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515,
        TEXTURE_CUBE_MAP_NEGATIVE_X = 0x8516,
        TEXTURE_CUBE_MAP_POSITIVE_Y = 0x8517,
        TEXTURE_CUBE_MAP_NEGATIVE_Y = 0x8518,
        TEXTURE_CUBE_MAP_POSITIVE_Z = 0x8519,
        TEXTURE_CUBE_MAP_NEGATIVE_Z = 0x851A,
        MAX_CUBE_MAP_TEXTURE_SIZE = 0x851C
    };

    export enum ETextureUnits {
        TEXTURE = 0x84C0
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

        desiredIntegerBitDepth: uint;
        desiredFloatBitDepth: uint;     

        readonly desiredFormat: EPixelFormats;
        readonly srcFormat: EPixelFormats;
        readonly srcWidth: uint;
        readonly srcHeight: uint;
        readonly srcDepth: uint;

        setFlags(iTextureFlag: int): void;
        getFlags(): int;   

        calculateSize(): uint;
        getNumFaces(): uint;
        getSize(): uint; 

        isTexture2D(): bool;
        isTextureCube(): bool;
        isCompressed(): bool;
        isValid(): bool;

        

        getBuffer(iFace?: uint, iMipmap?: uint): IPixelBuffer;     

        setParameter(eParam: ETextureParameters, eValue: ETextureFilters): bool;
        setParameter(eParam: ETextureParameters, eValue: ETextureWrapModes): bool;
        
        loadImage(pImage: IImg): bool;
        loadRawData(pData: ArrayBufferView, iWidth: uint, iHeight: uint, eFormat: EPixelFormats): bool;

        convertToImage(pDestImage: IImg, bIncludeMipMaps: bool): void;

        copyToTexture(pTarget: ITexture): void;

        createInternalTexture(): bool;
        freeInternalTexture(): bool;

        getNativeFormat(eTextureType?: ETextureTypes, eFormat?: EPixelFormats, iFlags?: int): EPixelFormats;
    }
}

#endif
