#ifndef TEXTURE_TS
#define TEXTURE_TS

#include "ITexture.ts"
#include "IImg.ts"
#include "IWebGLRenderer.ts"
#include "../ResourcePoolItem.ts"
#include "PixelFormat.ts"
#include "IColor.ts"

module akra.core.pool.resources {

    export enum ETextureForcedFormatFlags {
        FORCEMIPLEVELS = 0,
        FORCEFORMAT,
        FORCESIZE
    }

	export class Texture extends ResourcePoolItem implements ITexture {
        protected _iFlags: int = ETextureFlags.DEFAULT;
        protected _iWidth: uint = 512;
        protected _iSrcWidth: uint = 0;
        protected _iHeight: uint = 512;
        protected _iSrcHeight: uint = 0;
        protected _iDepth: uint = 1;
        protected _iSrcDepth: uint = 0;
        protected _eFormat: EPixelFormats = EPixelFormats.UNKNOWN;
        protected _nMipLevels: uint = 0;
        protected _nRequestedMipLevels: uint = 0;
        protected _eTextureType: ETextureTypes = ETextureTypes.TEXTURE_2D;
        protected _iDesiredIntegerBitDepth: uint = 0;
        protected _iDesiredFloatBitDepth: uint = 0;     

        protected _eDesiredFormat: EPixelFormats = EPixelFormats.UNKNOWN;
        protected _eSrcFormat: EPixelFormats = EPixelFormats.UNKNOWN;

        protected _pParams: IntMap = <IntMap>{};

        protected _isInternalResourceCreated: bool = false;
        protected _isMipmapsHardwareGenerated: bool = false;

        protected _iResourceSize: uint = 0;

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
        
        inline calculateSize(): uint {
            return this.getNumFaces() * pixelUtil.getMemorySize(this._iWidth, this._iHeight, this._iDepth, this._eFormat);
        }

        inline getNumFaces(): uint {
            return this._eTextureType === ETextureTypes.TEXTURE_CUBE_MAP ? 6 : 1;
        }

        inline getSize(): uint {
            return this._iResourceSize;
        }

        getBuffer(iFace?: uint, iMipmap?: uint): IPixelBuffer {
            return null;
        }

        create(iWidth: uint, iHeight: uint, iDepth: uint, cFillColor?: IColor, 
               iFlags?: int, nMipLevels?: uint, eTextureType?: ETextureTypes, eFormat?: EPixelFormats): bool;
        create(iWidth: uint, iHeight: uint, iDepth: uint, pPixels?: Array, 
               iFlags?: int, nMipLevels?: uint, eTextureType?: ETextureTypes, eFormat?: EPixelFormats): bool;
        create(iWidth: uint, iHeight: uint, iDepth: uint, pPixels?: ArrayBufferView, 
               iFlags?: int, nMipLevels?: uint, eTextureType?: ETextureTypes, eFormat?: EPixelFormats): bool;
        create(iWidth: uint, iHeight: uint, iDepth: uint, pPixels?: any = null, 
               iFlags?: int = 0, nMipLevels?: uint = 0, 
               eTextureType?: ETextureTypes = ETextureTypes.TEXTURE_2D, 
               eFormat?: EPixelFormats = EPixelFormats.R8G8B8): bool {

            this._iWidth = iWidth;
            this._iHeight = iHeight;
            this._iDepth = iDepth;
            this._iFlags = iFlags;
            this._nMipLevels = nMipLevels;
            this._eTextureType = eTextureType;
            this._eFormat = eFormat;

            if(isDef(pPixels.length)){
                if(pPixels instanceof Array) {
                    pPixels = new Uint8Array(pPixels);
                }
                return this.loadRawData(pPixels, iWidth, iHeight, eFormat);
            }
            else {
                return this.createInternalTexture(pPixels);
            }
        }

        destroyResource(): bool {
            this.freeInternalTexture();
            this.notifyDestroyed();
            return true;
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

        loadRawData(pStream: ArrayBufferView, iWidth: uint, iHeight: uint, eFormat: EPixelFormats): bool {
            var pTempImg: IImg = <IImg>this.getManager().imagePool.findResource(".temp_image");

            if(isNull(pTempImg)){
                pTempImg = <IImg>this.getManager().imagePool.createResource(".temp_image");
                //pTempImg.create();
            }

            pTempImg.loadRawData(<Uint8Array>pStream, iWidth, iHeight, eFormat);
            var isLoaded: bool = this.loadImage(pTempImg);
            this.getManager().imagePool.destroyResource(pTempImg);

            return isLoaded;
        }

        loadImage(pImage: IImg): bool {
            var isLoaded:bool = this._loadImages(pImage, true);
            
            if(isLoaded) {
                this.notifyLoaded();
                return true;
            }
            else {
                return false;
            }
        } 

        loadImages(pImages: IImg[]): bool {
            var isLoaded:bool = this._loadImages(pImages);

            if(isLoaded) {
                this.notifyLoaded();
                return true;  
            }
            else{
                return false;
            }
        }       

        _loadImages(pImageList: IImg[]): bool;
        _loadImages(pImage: IImg, bOneImage: bool): bool;
        _loadImages(): bool {
            if(this.isResourceLoaded()){
                WARNING("Yoy try to load texture when it already have been loaded. All texture data was destoyed.");
                this.freeInternalTexture();
            }

            var pMainImage: IImg = null;
            var pImageList: IImg[] = null;

            if(arguments.length === 2) {
                pMainImage = arguments[0];
            }
            else {
                pImageList = arguments[0];
                if(pImageList.length === 0) {
                    CRITICAL("Cannot load empty list of images");
                    return false;
                }
                pMainImage = pImageList[0];
            }

            this._iSrcWidth = this._iWidth = pMainImage.width;
            this._iSrcHeight = this._iHeight = pMainImage.height;
            this._iSrcDepth = this._iDepth = pMainImage.depth;

            // Get source image format and adjust if required
            this._eSrcFormat = pMainImage.format;

            if (this._eDesiredFormat !== EPixelFormats.UNKNOWN) {
                // If have desired format, use it
                this._eFormat = this._eDesiredFormat;
            }
            else {
                // Get the format according with desired bit depth
                this._eFormat = pixelUtil.getFormatForBitDepths(this._eSrcFormat, this._iDesiredIntegerBitDepth, this._iDesiredFloatBitDepth);
            }

            // The custom mipmaps in the image have priority over everything
            var iImageMips: uint = pMainImage.numMipMaps;

            if(iImageMips > 0) {
                this._nMipLevels = this._nRequestedMipLevels = iImageMips;
                // Disable flag for auto mip generation
                CLEAR_ALL(this._iFlags, ETextureFlags.AUTOMIPMAP);
            }
            // Create the texture
            this.createInternalTexture(null);
            // Check if we're loading one image with multiple faces
            // or a vector of images representing the faces
            var iFaces: uint = 0;
            var isMultiImage: bool = false;

            if(!isNull(pImageList) && pImageList.length > 1){
                iFaces = pImageList.length;
                isMultiImage = true;
            }
            else {
                iFaces = pMainImage.numFaces;
                isMultiImage = false;
            }

            // Check wether number of faces in images exceeds number of faces
            // in this texture. If so, clamp it.
            if(iFaces > this.getNumFaces()){
                iFaces = this.getNumFaces();
            }

            // Main loading loop
            // imageMips == 0 if the image has no custom mipmaps, otherwise contains the number of custom mips
            var mip: uint = 0;
            var i: uint = 0;
            for(mip = 0; mip <= iImageMips; ++mip) {
                for(i = 0; i < iFaces; ++i) {
                    var pSrc: IPixelBox;

                    if(isMultiImage){
                        // Load from multiple images
                        pSrc = pImageList[i].getPixels(0, mip);
                    }
                    else {
                        // Load from faces of images[0] or main Image
                        pSrc = pMainImage.getPixels(i, mip);
                    }
        
                    // Sets to treated format in case is difference
                    pSrc.format = this._eSrcFormat;
                    // Destination: entire texture. blitFromMemory does the scaling to
                    // a power of two for us when needed
                    this.getBuffer(i, mip).blitFromMemory(pSrc);                    
                }
            }
            // Update size (the final size, not including temp space)
            this._iResourceSize = this.getNumFaces() * pixelUtil.getMemorySize(this._iWidth, this._iHeight, this._iDepth, this._eFormat);
            return true;
        }

        convertToImage(pDestImage: IImg, bIncludeMipMaps: bool): void {
            var iNumMips: uint = bIncludeMipMaps ? this._nMipLevels + 1 : 1;
            var iDataSize: uint = pixelUtil.calculateSizeForImage(iNumMips, this._nMipLevels,
                                                                  this._iWidth, this._iHeight, this._iDepth,
                                                                  this._eFormat);

            var pPixData: Uint8Array = new Uint8Array(iDataSize);
            // if there are multiple faces and mipmaps we must pack them into the data
            // faces, then mips
            var pCurrentPixData: Uint8Array = pPixData;

            var iFace: uint = 0;
            var mip: uint = 0;

            for (iFace = 0; iFace < this.getNumFaces(); ++iFace) {
                for (mip = 0; mip < iNumMips; ++mip) {

                    var iMipDataSize = pixelUtil.getMemorySize(this._iWidth, this._iHeight, this._iDepth, this._eFormat);

                    var pPixBox: IPixelBox = new pixelUtil.PixelBox(this._iWidth, this._iHeight, this._iDepth, this._eFormat, pCurrentPixData);
                    this.getBuffer(iFace, mip).blitToMemory(pPixBox);

                    pCurrentPixData = pCurrentPixData.subarray(iMipDataSize);

                }
            }

            // load, and tell Image to delete the memory when it's done.
            pDestImage.loadDynamicImage(pPixData, this._iWidth, this._iHeight, this._iDepth, this._eFormat, 
                this.getNumFaces(), iNumMips - 1);          
        }

        copyToTexture(pTarget: ITexture): void {
            if(pTarget.getNumFaces() !== this.getNumFaces()){
                CRITICAL("Texture types must match");
            }   

            var nMipLevels: uint = Math.min(this._nMipLevels, pTarget.mipLevels);
            if(TEST_ANY(this._iFlags, ETextureFlags.AUTOMIPMAP) || TEST_ANY(this.getFlags(), ETextureFlags.AUTOMIPMAP)){
                nMipLevels = 0;
            }

            var iFace: uint = 0, mip: uint = 0;

            for(iFace = 0; iFace < this.getNumFaces(); iFace++){
                for(mip = 0; mip <= nMipLevels; mip++){
                    pTarget.getBuffer(iFace, mip).blit(this.getBuffer(iFace, mip));
                }
            }
        }

        createInternalTexture(cFillColor?: IColor = null): bool {
            if(!this._isInternalResourceCreated) {
                this.createInternalTextureImpl(cFillColor);
                this._isInternalResourceCreated = true;
                this.notifyCreated();
                return true;
            }

        	return false;
        }

        freeInternalTexture(): bool {
            if(this._isInternalResourceCreated){
                this.freeInternalTextureImpl();
                this._isInternalResourceCreated = false;
                this.notifyDestroyed();
                return true;
            }

            return false;
        }

        getNativeFormat(eTextureType?: ETextureTypes = this._eTextureType,
                        eFormat?: EPixelFormats = this._eFormat, 
                        iFlags?: int = this._iFlags): EPixelFormats {

            return null;
        }

        protected createInternalTextureImpl(cFillColor?: IColor = null): bool {
            return false;
        }

        protected freeInternalTextureImpl(): bool {
            return false;
        }
	}
}

#endif
