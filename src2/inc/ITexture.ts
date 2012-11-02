#ifndef ITEXTURE_TS
#define ITEXTURE_TS

#include "IRenderResource.ts"

module akra {

    IFACE(IImg);

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

    export interface ITexture extends IRenderResource {
    	width: uint;
        height: uint;

        type: EImageTypes;
        format: EImageFormats;


        //number of color components per pixel. usually: 1, 3, 4
        componentsPerPixel: uint;
        bytesPerPixel: uint;

        magFilter: ETextureFilters;
        minFilter: ETextureFilters;

        wrapS: ETextureWrapModes;
        wrapT: ETextureWrapModes;

        target: ETextureTypes;
        mipLevels: uint;

        isTexture2D(): bool;
        isTextureCube(): bool;
        isCompressed(): bool;

        getParameter(): int;
        setParameter(eParam: ETextureParameters, eValue: ETextureFilters): void;
        setParameter(eParam: ETextureParameters, eValue: ETextureWrapModes): void;
        
        getPixels(
            iX?: uint, 
            iY?: uint, 
            iWidth?: uint, 
            iHeight?: uint, 
            ppPixelBuffer?: ArrayBufferView,
            iMipMap?: uint,
            eCubeFlag?: ETextureTypes): ArrayBufferView;
        setPixels(
            iX?: uint, 
            iY?: uint, 
            iWidth?: uint, 
            iHeight?: uint, 
            pPixelBuffer?: ArrayBufferView,
            iMipMap?: uint,
            eCubeFlag?: ETextureTypes): bool;

        generateNormalMap(pHeightMap: IImg, iChannel?: uint, fAmplitude?: float): bool;
        generateNormalizationCubeMap(): bool;
        
        convertToNormalMap(iChannel: uint, iFlags: uint, fAmplitude: float): bool;
        
        maskWithImage(pImage: IImg): bool;

        uploadCubeFace(pImage: IImg, eFace: ETextureTypes, isCopyAll?: bool): bool;
        uploadHTMLElement(pElement: HTMLElement): bool;
        uploadImage(pImage: IImg): bool;

        resize(iWidth: uint, iHeight: uint): bool;
        repack(iWidth: uint, iHeight: uint, eFormat?: EImageFormats, eType?: EImageTypes): bool;
        extend(iWidth: uint, iHeight: uint, cColor: IColor);

        createTexture(
            iWidth?: uint, 
            iHeight?: uint, 
            iFlags?: int, 
            eFormat?: EImageFormats, 
            eType?: EImageTypes,
            pData?: ArrayBufferView): bool;

        //------------
        // Эти вызовы надо убрать, так как пользователю не положено делать их самому,
        // а соответственно их не должно быть в API, пусть рендерер, делает эти вещи.
        
        //bind()
        //unbind()
        //activate()
        //getSlot()
        //setSlot()
    }
}

#endif
