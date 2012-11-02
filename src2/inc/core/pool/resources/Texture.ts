#ifndef TEXTURE_TS
#define TEXTURE_TS

#include "ITexture.ts"
#include "../ResourcePoolItem.ts"

module akra.core.pool.resources {
	export class Texture extends ResourcePoolItem implements ITexture {
		inline get width(): uint {
			return 0;
		}

        inline get height(): uint {
        	return 0;
        }

        inline get type(): EImageTypes {
        	return null;
        }

        inline get format(): EImageFormats {
        	return null;
        }


        //number of color components per pixel. usually: 1, 3, 4
        inline get componentsPerPixel(): uint {
        	return 0;
        }

        inline get bytesPerPixel(): uint {
        	return 0;
        }

        get magFilter(): ETextureFilters {
        	return 0;
        }

        get minFilter(): ETextureFilters {
        	return 0;
        }

        get wrapS(): ETextureWrapModes {
        	return 0;
        }

        get wrapT(): ETextureWrapModes {
        	return 0;
        }

        get target(): ETextureTypes {
        	return 0;
        }

        get mipLevels(): uint {
        	return 0;
        }

        isTexture2D(): bool {
        	return false;
        }

        isTextureCube(): bool {
        	return false;
        }
        
        isCompressed(): bool {
        	return false;
        }
        

        getParameter(): int {
        	return 0;
        }
        
        setParameter(eParam: ETextureParameters, eValue: ETextureFilters): void;
        setParameter(eParam: ETextureParameters, eValue: ETextureWrapModes): void;

        setParameter(eParam: ETextureParameters, eValue): void {
        	return;
        }
        
        
        getPixels(
            iX?: uint, 
            iY?: uint, 
            iWidth?: uint, 
            iHeight?: uint, 
            ppPixelBuffer?: ArrayBufferView,
            iMipMap?: uint,
            eCubeFlag?: ETextureTypes): ArrayBufferView {
        	return null;
        }

        setPixels(
            iX?: uint, 
            iY?: uint, 
            iWidth?: uint, 
            iHeight?: uint, 
            pPixelBuffer?: ArrayBufferView,
            iMipMap?: uint,
            eCubeFlag?: ETextureTypes): bool {
        	return null;
        }

        generateNormalMap(pHeightMap: IImg, iChannel?: uint, fAmplitude?: float): bool {
        	return false;
        }

        generateNormalizationCubeMap(): bool {
        	return false;
        }
        
        convertToNormalMap(iChannel: uint, iFlags: uint, fAmplitude: float): bool {
        	return false;
        }
        
        maskWithImage(pImage: IImg): bool {
        	return false;
        }

        uploadCubeFace(pImage: IImg, eFace: ETextureTypes, isCopyAll?: bool): bool {
        	return false;
        }

        uploadHTMLElement(pElement: HTMLElement): bool {
        	return false;
        }

        uploadImage(pImage: IImg): bool {
        	return false;
        }

        resize(iWidth: uint, iHeight: uint): bool {
        	return false;
        }

        repack(iWidth: uint, iHeight: uint, eFormat?: EImageFormats, eType?: EImageTypes): bool {
        	return false;
        }

        extend(iWidth: uint, iHeight: uint, cColor: IColor) {
        	return false;
        }

        createTexture(
            iWidth?: uint, 
            iHeight?: uint, 
            iFlags?: int, 
            eFormat?: EImageFormats, 
            eType?: EImageTypes,
            pData?: ArrayBufferView): bool {
        	return false;
        }

        inline getHardwareObject(): WebGLObject {
        	return null;
        }
	}
}

#endif
