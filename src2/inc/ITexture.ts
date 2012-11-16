#ifndef ITEXTURE_TS
#define ITEXTURE_TS

#include "IRenderResource.ts"

module akra {

    IFACE(IImg);


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
