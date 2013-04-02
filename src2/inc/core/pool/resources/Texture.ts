#ifndef TEXTURE_TS
#define TEXTURE_TS

#include "ITexture.ts"
#include "IImg.ts"
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
        protected _iHeight: uint = 512;
        protected _iDepth: uint = 1;

        protected _eFormat: EPixelFormats = EPixelFormats.UNKNOWN;
        
        protected _nMipLevels: uint = 0;
        protected _nRequestedMipLevels: uint = 0;

        protected _eTextureType: ETextureTypes = ETextureTypes.TEXTURE_2D;

        protected _pParams: IntMap = <IntMap>{};

        protected _isInternalResourceCreated: bool = false;
        protected _isMipmapsHardwareGenerated: bool = false;

        constructor () {
            super();
        }

		inline get width(): uint {
			return this._iWidth;
		}

        //inline set width(iWidth: uint) {
        //    this._iWidth = this._iSrcWidth = iWidth;
        //}

        inline get height(): uint {
        	return this._iHeight;
        }

        //inline set height(iHeight: uint) {
        //    this._iHeight = this._iSrcHeight = iHeight;
        //}

        inline get depth(): uint {
            return this._iDepth;
        }

        //inline set depth(iDepth: uint) {
        //    this._iDepth = this._iSrcDepth = iDepth;
        //}

        inline get format(): EPixelFormats {
        	return this._eFormat;
        }

        //inline set format(eFormat: EPixelFormats) {
        //    this._eFormat = eFormat;
        //    this._eDesiredFormat = eFormat;
        //    this._eSrcFormat = eFormat;
        //}

        inline get textureType(): ETextureTypes {
            return this._eTextureType;
        }

        //inline set textureType(eTextureType: ETextureTypes) {
        //    this._eTextureType = eTextureType;
        //}

        inline get mipLevels(): uint {
            return this._nMipLevels;
        }

        //inline set mipLevels(nMipLevels: uint) {
        //    this._nMipLevels = nMipLevels;
        //}

        /*inline get desiredIntegerBitDepth(): uint {
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
        }*/

        inline getFlags(): int {
            return this._iFlags;
        }

        inline setFlags(iFlags: ETextureFlags): void {
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
            return this.getNumFaces() * pixelUtil.getMemorySize(this._iWidth, this._iHeight, this._iDepth, this._eFormat);
        }

        getBuffer(iFace?: uint, iMipmap?: uint): IPixelBuffer {
            return null;
        }

        create(iWidth: uint, iHeight: uint, iDepth: uint, cFillColor?: IColor, 
               eFlags?: ETextureFlags, nMipLevels?: uint, nFaces?: uint, eTextureType?: ETextureTypes, eFormat?: EPixelFormats): bool;

        create(iWidth: uint, iHeight: uint, iDepth: uint, pPixels?: Array, 
               eFlags?: ETextureFlags, nMipLevels?: uint, nFaces?: uint, eTextureType?: ETextureTypes, eFormat?: EPixelFormats): bool;

        create(iWidth: uint, iHeight: uint, iDepth: uint, pPixels?: ArrayBufferView, 
               eFlags?: ETextureFlags, nMipLevels?: uint, nFaces?: uint, eTextureType?: ETextureTypes, eFormat?: EPixelFormats): bool;

        create(iWidth: uint, iHeight: uint, iDepth?: uint = 1, pPixels?: any = null, 
               eFlags?: ETextureFlags = ETextureFlags.DEFAULT, nMipLevels?: uint = 0, nFaces?: uint = 0,
               eTextureType?: ETextureTypes = ETextureTypes.TEXTURE_2D, 
               eFormat?: EPixelFormats = EPixelFormats.B8G8R8): bool {

            
            if(eTextureType!=ETextureTypes.TEXTURE_2D && eTextureType!=ETextureTypes.TEXTURE_CUBE_MAP)
            {
                CRITICAL("Заданный тип текстуры не поддреживается");
                return false;
            }    

            this.textureType=eTextureType;

            this._iWidth = iWidth;
            this._iHeight = iHeight;
            this._iDepth = iDepth;

            this._iFlags = eFlags;
            this._nMipLevels = nMipLevels;            

            this._eFormat = eFormat;

            if(isArray(pPixels)) 
            {
                pPixels = new Uint8Array(pPixels);
                return this.loadRawData(pPixels, iWidth, iHeight,iDepth,eFormat,nFaces,nMipLevels);
            }
            else if(isTypedArray(pPixels))
            {
                return this.loadRawData(pPixels, iWidth, iHeight,iDepth,eFormat,nFaces,nMipLevels);
            }
            else 
            {
                return this.createInternalTexture(pPixels);
            }
        }

        loadResource(sFilename?: string): bool {
            if (arguments.length == 0) {
                return;
            }

            var pImage: IImg = this.getManager().loadImage(sFilename);
            
            
            
            if (pImage.isResourceLoaded()) {
                return this.loadImage(pImage);
            }
            LOG("Texture::loadResource(" + sFilename + ")", pImage);
            this.connect(pImage, SIGNAL(loaded), SLOT(_onImageLoad));
            return true;
        }

        _onImageLoad(pImage: IImg): void {
            LOG("resource loaded > ", pImage.findResourceName(), this.findResourceName());
            this.disconnect(pImage, SIGNAL(loaded), SLOT(_onImageLoad));
            this.loadImage(pImage);
        }

        destroyResource(): bool {
            this.freeInternalTexture();
            this.notifyDestroyed();
            return true;
        }
        
        setFilter(eParam: ETextureParameters, eValue: ETextureFilters): bool
        {
            if (!this.isValid()) {
                return false;
            }

            this._pParams[eParam] = eValue;
            return this._setFilterInternalTexture(eParam,eValue);
        }
        
        setWrapMode(eParam: ETextureParameters, eValue: ETextureWrapModes): bool
        {
            if (!this.isValid()) {
                return false;
            }

            this._pParams[eParam] = eValue;
            return this._setWrapModeInternalTexture(eParam,eValue);
        }

        getFilter(eParam: ETextureParameters): ETextureFilters
        {
            if (!this.isValid()) {
                return 0;
            }
            var iValue:any=this._pParams[eParam];
            if(!isDefAndNotNull(iValue))
            {
                iValue=this._getFilterInternalTexture(eParam);
                this._pParams[eParam]=iValue;
            }
            return iValue;
        }

        getWrapMode(eParam: ETextureParameters): ETextureWrapModes
        {
            if (!this.isValid()) {
                return 0;
            }
            var iValue:any=this._pParams[eParam];
            if(!isDefAndNotNull(iValue))
            {
                iValue=this._getWrapModeInternalTexture(eParam);
                this._pParams[eParam]=iValue;
            }
            return iValue;
        }

        protected _setFilterInternalTexture(eParam: ETextureParameters, eValue: ETextureFilters): bool{
            CRITICAL("virual");
            return false;           
        }
        protected _setWrapModeInternalTexture(eParam: ETextureParameters, eValue: ETextureWrapModes): bool{
            CRITICAL("virual");
            return false;           
        }

        protected _getFilterInternalTexture(eParam: ETextureParameters): ETextureFilters{
            CRITICAL("virual");
            return 0;           
        }
        protected _getWrapModeInternalTexture(eParam: ETextureParameters): ETextureWrapModes{
            CRITICAL("virual");
            return 0;           
        }


        loadRawData(pData: Uint8Array, iWidth: uint, iHeight: uint, iDepth: uint = 1, eFormat: EPixelFormats = EPixelFormats.BYTE_BGR,
                         nFaces?: uint = 1, nMipMaps?: uint = 0)
        {
            var pTempImg: IImg = <IImg>this.getManager().imagePool.findResource(".texture.temp_image");

            if(isNull(pTempImg)){
                pTempImg = <IImg>this.getManager().imagePool.createResource(".texture.temp_image");
            }

            pTempImg.loadRawData(pData, iWidth, iHeight,iDepth,eFormat,nFaces,nMipMaps);
            var isLoaded: bool = this.loadImage(pTempImg);
            this.getManager().imagePool.destroyResource(pTempImg);

            return isLoaded;
        }

        loadImage(pImage: IImg): bool 
        {
            var isLoaded:bool = this._loadImages(pImage);
            
            if(isLoaded) 
            {
                this.notifyLoaded();
                return true;
            }
            else {
                return false;
            }
        } 

        loadImages(pImages: IImg[]): bool 
        {
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
        _loadImages(pImage: IImg): bool;
        
        _loadImages(pImage:any): bool 
        {




            if(this.isResourceLoaded()){
                WARNING("Yoy try to load texture when it already have been loaded. All texture data was destoyed.");
                this.freeInternalTexture();
            }

            var pMainImage: IImg = null;
            var pImageList: IImg[] = null;

            if(!isArray(pImage)) 
            {
                pMainImage = pImage;
                pImageList = new Array(0);
                pImageList[0]=pMainImage;
            }
            else 
            {
                pImageList = arguments[0];
                if(pImageList.length === 0) {
                    CRITICAL("Cannot load empty list of images");
                    return false;
                }
                pMainImage = pImageList[0];
            }



            this._iWidth = pMainImage.width;
            this._iHeight = pMainImage.height;
            this._iDepth = pMainImage.depth;

            // Get source image format and adjust if required

            if(webgl.isWebGLFormatSupport(pMainImage.format))
            {
                this._eFormat = pMainImage.format;
            }
            else
            {
                WARNING("Format not support("+pixelUtil.getFormatName(pMainImage.format)+")");
                if(pMainImage.convert(EPixelFormats.B8G8R8A8))
                {
                    this._eFormat = pMainImage.format;
                }
                else
                {
                    CRITICAL("Format not convert");
                }
            }

            for(i=1;i<pImageList.length;i++)
            {
                if(!pImageList[i].convert(pMainImage.format))
                {
                    CRITICAL("Format not support and not convert");
                }
            }


            // The custom mipmaps in the image have priority over everything
            var iImageMips: uint = pMainImage.numMipMaps;

            if(iImageMips==Img.getMaxMipmaps(this._iWidth,this._iHeight,this._iDepth,this._eFormat)) {
                this._nMipLevels=iImageMips;

                // Disable flag for auto mip generation
                CLEAR_ALL(this._iFlags, ETextureFlags.AUTOMIPMAP);
            }
            else
            {
                this._nMipLevels=0;
            }

            // Create the texture
            this.createInternalTexture(null);

            
            // Check if we're loading one image with multiple faces
            // or a vector of images representing the faces
            var iFaces: uint = 0;
            var isMultiImage:bool =false;

            if(pImageList.length == 6)
            {
                iFaces = 6;
                isMultiImage = true;
            }
            else if(pMainImage.numFaces==6)
            {
                iFaces = 6;
                isMultiImage = false;
            }
            else
            {
                iFaces = 1;
                isMultiImage = false;
            }

            // Check wether number of faces in images exceeds number of faces
            // in this texture. If so, clamp it.
            if(iFaces > this.getNumFaces())
            {
                iFaces = this.getNumFaces();
            }

            // Main loading loop
            // imageMips == 0 if the image has no custom mipmaps, otherwise contains the number of custom mips
            
            var mip: uint = 0;
            var i: uint = 0;
            for(mip = 0; mip <= this._nMipLevels; ++mip) {
                for(i = 0; i < iFaces; ++i) {
                    var pSrc: IPixelBox;

                    if(isMultiImage){
                        // Load from multiple images
                        pSrc = pImageList[i].getPixels(0, mip);
                        //console.log(mip,i);
                    }
                    else {
                        // Load from faces of images[0] or main Image
                        //console.log(mip,i);
                        pSrc = pMainImage.getPixels(i, mip);
                    }
        
                    // Destination: entire texture. blitFromMemory does the scaling to
                    // a power of two for us when needed
                    //console.log(pSrc);
                    //console.log(this.getBuffer(i, mip));

                    
                    this.getBuffer(i, mip).blitFromMemory(pSrc);                    
                }
            }

            return true;
        }

        convertToImage(pDestImage: IImg, bIncludeMipMaps: bool): void 
        {
            CRITICAL("!!!нехуй")
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
            CRITICAL("!!!нехуй")
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

        createInternalTexture(cFillColor?: IColor = null): bool 
        {
            
            if(!this._isInternalResourceCreated) 
            {
                
                this._createInternalTextureImpl(cFillColor);
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

        protected _createInternalTextureImpl(cFillColor?: IColor = null): bool {
            return false;
        }

        protected freeInternalTextureImpl(): bool {
            return false;
        }

        setPixelRGBA(i1: uint, i2: uint, iTextureWidth: uint, iTextureHeight: uint, pBuffer: Uint8Array): void {
            return;
        }
	}

}

#endif
