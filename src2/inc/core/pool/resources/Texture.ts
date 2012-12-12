#ifndef TEXTURE_TS
#define TEXTURE_TS

#include "ITexture.ts"
#include "IImg.ts"
#include "IWebGLRenderer.ts"
#include "../ResourcePoolItem.ts"
#include "PixelFormat.ts"

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
        protected _iWidth: uint = 0;
        protected _iSrcWidth: uint = 0;
        protected _iHeight: uint = 0;
        protected _iSrcHeight: uint = 0;
        protected _iDepth: uint = 0;
        protected _iSrcDepth: uint = 0;
        protected _eFormat: EPixelFormats = EPixelFormats.UNKNOWN;
        protected _nMipLevels: uint = 0;
        protected _eTextureType: ETextureTypes = ETextureTypes.TEXTURE_2D;
        protected _iDesiredIntegerBitDepth: uint;
        protected _iDesiredFloatBitDepth: uint;     

        protected _eDesiredFormat: EPixelFormats;
        protected _eSrcFormat: EPixelFormats;

        protected _pParams: IntMap = <IntMap>{};

        protected _isInternalResourceCreated: bool = false;

        constructor () {
            super();

            this._pParams[ETextureParameters.MIN_FILTER] = ETextureFilters.NEAREST;
            this._pParams[ETextureParameters.MAG_FILTER] = ETextureFilters.NEAREST;

            this._pParams[ETextureParameters.WRAP_S] = ETextureWrapModes.CLAMP_TO_EDGE;            
            this._pParams[ETextureParameters.WRAP_T] = ETextureWrapModes.CLAMP_TO_EDGE;            
        }

		inline get width(): uint {
			return this._iWidth;
		}

        inline set width(iWidth: uint) {
            this._iWidth = this._iSrcWidth = iWidth;
        }

        inline get height(): uint {
        	return this._iHeight;
        }

        inline set height(iHeight: uint) {
            this._iHeight = this._iSrcHeight = iHeight;
        }

        inline get depth(): uint {
            return this._iDepth;
        }

        inline set depth(iDepth: uint) {
            this._iDepth = this._iSrcDepth = iDepth;
        }

        inline get format(): EPixelFormats {
        	return this._eFormat;
        }

        inline set format(eFormat: EPixelFormats) {
            this._eFormat = eFormat;
            this._eDesiredFormat = eFormat;
            this._eSrcFormat = eFormat;
        }

        inline get textureType(): ETextureTypes {
            return this._eTextureType;
        }

        inline set textureType(eTextureType: ETextureTypes) {
            this._eTextureType = eTextureType;
        }

        inline get mipLevels(): uint {
            return this._nMipLevels;
        }

        inline set mipLevels(nMipLevels: uint) {
            this._nMipLevels = nMipLevels;
        }

        inline get desiredIntegerBitDepth(): uint {
            return this._iDesiredIntegerBitDepth;
        }

        inline set desiredIntegerBitDepth(iDesiredIntegerBitDepth: uint) {
            this._iDesiredIntegerBitDepth = iDesiredIntegerBitDepth;
        }

        inline get desiredFloatBitDepth(): uint {
            return this._iDesiredFloatBitDepth;
        }

        inline set desiredFloatBitDepth(iDesiredFloatBitDepth: uint) {
            this._iDesiredFloatBitDepth = iDesiredFloatBitDepth;
        }

        inline get srcWidth(): uint { 
            return this._iSrcWidth;
        }

        inline get srcHeight(): uint {
            return this._iSrcHeight;
        }

        inline get srcDepth(): uint {
            return this._iSrcWidth;
        }

        inline get desiredFormat(): EPixelFormats {
            return this._eDesiredFormat;
        }

        inline get srcFormat(): EPixelFormats {
            return this._eSrcFormat;
        }

        inline getFlags(): int {
            return this._iFlags;
        }

        inline setFlags(iFlags: int): void {
            this._iFlags = iFlags;
        }

        inline isTexture2D(): bool {
        	return this._eTextureType === ETextureTypes.TEXTURE_2D;
        }

        inline isTextureCube(): bool {
        	return this._eTextureType === ETextureTypes.TEXTURE_CUBE_MAP;
        }
        
        inline isCompressed(): bool {
        	return (this._eFormat >= EPixelFormats.DXT1 && this._eFormat <= EPixelFormats.DXT5) || 
                (this._eFormat >= EPixelFormats.PVRTC_RGB2 && this._eFormat <= EPixelFormats.PVRTC_RGBA4);
        }

        inline isValid(): bool {
            return isDefAndNotNull(this._isInternalResourceCreated);
        }
        
        getBuffer(iFace?: uint, iMipmap?: uint): IPixelBuffer {
            return null;
        }
        
        setParameter(eParam: ETextureParameters, eValue: ETextureFilters): void;
        setParameter(eParam: ETextureParameters, eValue: ETextureWrapModes): void;

        setParameter(eParam: ETextureParameters, eValue: int): bool {
            if (!this.isValid()) {
                return false;
            }

            this._pParams[eParam] = eValue;

        	return true;
        }

        loadImage(pImage: IImg): bool{
            return false;
        }

        loadRawData(pData: ArrayBufferView, iWidth: uint, iHeight: uint, eFormat: EPixelFormats): bool{
            return false;
        }

        createTexture(
            iWidth?: uint, 
            iHeight?: uint, 
            iFlags?: int, 
            eFormat?: EPixelFormats, 
            pData?: ArrayBufferView): bool {
        	return false;
        }

        inline getHardwareObject(): WebGLObject {
        	return null;
        }
	}
}

#endif
