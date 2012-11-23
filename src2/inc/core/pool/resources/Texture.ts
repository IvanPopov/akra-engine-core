#ifndef TEXTURE_TS
#define TEXTURE_TS

#include "ITexture.ts"
#include "IImg.ts"
#include "../ResourcePoolItem.ts"

module akra.core.pool.resources {

    export enum ETextureFlags {
        DYNAMICTEXTURE = 0,
        CUBEMAP,
        MIPMAPS,
        RENDERTARGET,
        PALETIZED,
        DINAMIC
    }

    export enum ETextureForcedFormatFlags {
        FORCEMIPLEVELS = 0,
        FORCEFORMAT,
        FORCESIZE
    }

	export class Texture extends ResourcePoolItem implements ITexture {
        protected _iFlags: int = 0;
        // protected _iWidth: uint = 0;
        // protected _iHeight: uint = 0;
        // protected _eFormat: EImageFormats = EImageFormats.UNKNOWN;
        // protected _eType: EImageTypes = EImageTypes.UNSIGNED_BYTE;

        protected _pWebGLTexture: WebGLTexture = null;
        protected _pParams: int[];

        protected _pWebGLRenderer: IWebGLRenderer;
        protected _pWebGLContext: WebGLRenderingContext;

        constructor () {
            super();

            this._pWebGLRenderer = <IWebGLRenderer>pManager.getEngine().getRenderer();
            this._pWebGLContext = this._pWebGLRenderer.getContext();

            this._pParams[ETextureParameters.minFilter] = ETextureFilters.NEAREST;
            this._pParams[ETextureParameters.magFilter] = ETextureFilters.NEAREST;

            this._pParams[ETextureParameters.wrapS] = ETextureWrapModes.CLAMP_TO_EDGE;            
            this._pParams[ETextureParameters.wrapT] = ETextureWrapModes.CLAMP_TO_EDGE;            
        }

		inline get width(): uint {
			return this._iWidth;
		}

        inline set width(iWidth: uint) {
            return this.resize(iWidth, this._iHeight);
        }


        inline get height(): uint {
        	return this._iHeight;
        }

        inline set height(iHeight: uint) {
            return this.resize(this._iWidth, iHeight);
        }

        inline get type(): EImageTypes {
        	return this._eType;
        }

        inline set type(eType: EImageTypes) {
            this.repack(this._iWidth, this._iHeight, this.format, eType);
        }

        inline get format(): EImageFormats {
        	return this._eFormat;
        }

        inline set format(eFormat: EImageFormats) {
            this.repack(this._iWidth, this._iHeight, eFormat, this.type);
        }


        //number of color components per pixel. usually: 1, 3, 4
        inline get componentsPerPixel(): uint {
        	return componentsPerPixel(this._eFormat);
        }

        // inline get bytesPerPixel(): uint {
        // 	return bitsPerPixel(this._eFormat);
        // }

        inline get magFilter(): ETextureFilters {
        	return this._pParams[ETextureParameters.magFilter];
        }

        inline get minFilter(): ETextureFilters {
        	return this._pParams[ETextureParameters.minFilter];
        }

        inline get wrapS(): ETextureWrapModes {
        	return this._pParams[ETextureParameters.wrapS];
        }

        inline get wrapT(): ETextureWrapModes {
        	return this._pParams[ETextureParameters.wrapT];
        }

        inline get target(): ETextureTypes {
        	return TEST_BIT(this._iFlags, ETextureFlags.CUBEMAP) ? ETextureTypes.TEXTURE_CUBE_MAP : ETextureTypes.TEXTURE_2D;
        }

        inline get mipLevels(): uint {
        	if (TEST_BIT(this._iFlags, ETextureFlags.MIPMAPS)) {
                return Math.ceil(Math.max(Math.log(this._iWidth) / Math.LN2, Math.log(this._iHeight) / Math.LN2)) + 1;
            }

            return 1;
        }

        inline isTexture2D(): bool {
        	return !TEST_BIT(this._iFlags, ETextureFlags.CUBEMAP);
        }

        inline isTextureCube(): bool {
        	return TEST_BIT(this._iFlags, ETextureFlags.CUBEMAP);
        }
        
        inline isCompressed(): bool {
        	return (this._eFormat >= EImageFormats.RGB_DXT1 && this._eFormat <= EImageFormats.RGBA_DXT4);
        }

        inline isValid(): bool {
            return isDefAndNotNull(this._pWebGLTexture);
        }
        
        
        setParameter(eParam: ETextureParameters, eValue: ETextureFilters): void;
        setParameter(eParam: ETextureParameters, eValue: ETextureWrapModes): void;

        setParameter(eParam: ETextureParameters, eValue: int): bool {
            if (!this.isValid()) {
                return false;
            }

            var eTarget: ETextureTypes = this.target;

            this._pWebGLRenderer._bindTexture(this);
            this._pWebGLContext.texParameteri(eTarget, eParam, eValue);
            this._pParams[eParam] = eValue;


            debug_assert(this._pWebGLContext.getTexParameter(eTarget, eParam) === eValue, 
                "parameter not setuped correctly");

        	return true;
        }
        
        
        getPixels(
            iX: uint = 0, 
            iY: uint = 0, 
            iWidth: uint = 0, 
            iHeight: uint = 0, 
            ppPixelBuffer: ArrayBufferView = null,
            iMipMap: uint = 0,
            eFace: ETextureTypes = ETextureTypes.TEXTURE_2D,
            eFormat: EImageFormats = EImageFormats.RGBA,
            eType: EImageTypes = EImageTypes.UNSIGNED_BYTE
            ): ArrayBufferView {
        	
            var pRenderer: IWebGLRenderer = this._pWebGLRenderer;
            var pContext: WebGLRenderingContext = this._pWebGLContext;

            if (!this.isValid()) {
                return null;
            }

            if ((!TEST_BIT(this._iFlags, ETextureFlags.MIPMAPS)) && iMipMap != 0) {
                debug_error("Запрашивается уровень мип мапа, хотя текстура их не содрежит");
                return null;
            }


            if (TEST_BIT(this._iFlags, ETextureFlags.MIPMAPS)) {
                debug_assert(iMipMap < Math.ceil(Math.max(Math.log(this._iWidth) / Math.LN2, Math.log(this._iHeight) / Math.LN2)
                                                     + 1), "Запрашивается уровень мип мапа, которого нет");
            }

            if (this.isTextureCube()) {
                debug_assert(eFace >= EImageTypes.TEXTURE_CUBE_MAP_POSITIVE_X && 
                    eFace <= TEXTURE_CUBE_MAP_NEGATIVE_Z, "invalid texture type");
            }
            else {
                debug_assert(eFace == ETextureTypes.TEXTURE_2D, "тип текстуры 2D,а eFace выставлен");
            }

            var pTextureRT: IRenderTexture = this.getRenderTarget(eFace, iMipMap);

            if (!pTextureRT) {
                return null;
            }

            return pTextureRT->readPixels(iX, iY, 0 || this._iWidth, 0 || this._iHeight, eFormat, eType, pPixelBuffer);

        }

        setPixels(
            iX: uint = 0, 
            iY: uint = 0, 
            iWidth: uint = 0, 
            iHeight: uint = 0, 
            pPixelBuffer: ArrayBufferView = null,
            iMipMap: uint = 0,
            eFace: ETextureTypes = ETextureTypes.TEXTURE_2D): bool {
        	


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
