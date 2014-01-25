/// <reference path="../../idl/ITexture.ts"	 />
/// <reference path="../../idl/IImg.ts"	 />
/// <reference path="../../idl/EPixelFormats.ts" />
/// <reference path="../../idl/IColor.ts" />
/// <reference path="../../idl/IMap.ts" />

/// <reference path="../../pixelUtil/pixelUtil.ts" />
/// <reference path="../ResourcePoolItem.ts" />

/// <reference path="Img.ts" />

/// <reference path="../../debug.ts" />
/// <reference path="../../logger.ts" />

module akra.pool.resources {


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

		protected _pParams: IMap<int> = <IMap<int>>{};

		protected _isInternalResourceCreated: boolean = false;
		protected _isMipmapsHardwareGenerated: boolean = false;

		constructor() {
			super();

			this._pParams[ETextureParameters.MIN_FILTER] = ETextureFilters.NEAREST;
			this._pParams[ETextureParameters.MAG_FILTER] = ETextureFilters.NEAREST;
			this._pParams[ETextureParameters.WRAP_S] = ETextureWrapModes.CLAMP_TO_EDGE;
			this._pParams[ETextureParameters.WRAP_T] = ETextureWrapModes.CLAMP_TO_EDGE;
		}

		getWidth(): uint {
			return this._iWidth;
		}

		getHeight(): uint {
			return this._iHeight;
		}

		getDepth(): uint {
			return this._iDepth;
		}

		getFormat(): EPixelFormats {
			return this._eFormat;
		}

		getTextureType(): ETextureTypes {
			return this._eTextureType;
		}

		getMipLevels(): uint {
			return this._nMipLevels;
		}

		getByteLength(): uint {
			return this.getSize();
		}

		getFlags(): int {
			return this._iFlags;
		}

		setFlags(iFlags: ETextureFlags): void {
			this._iFlags = iFlags;
		}

		isTexture2D(): boolean {
			return this._eTextureType === ETextureTypes.TEXTURE_2D;
		}

		isTextureCube(): boolean {
			return this._eTextureType === ETextureTypes.TEXTURE_CUBE_MAP;
		}

		isCompressed(): boolean {
			return (this._eFormat >= EPixelFormats.DXT1 && this._eFormat <= EPixelFormats.DXT5) ||
				(this._eFormat >= EPixelFormats.PVRTC_RGB2 && this._eFormat <= EPixelFormats.PVRTC_RGBA4);
		}

		isValid(): boolean {
			return this._isInternalResourceCreated;
		}

		//  calculateSize(): uint {
		//     return this.getNumFaces() * pixelUtil.getMemorySize(this._iWidth, this._iHeight, this._iDepth, this._eFormat);
		// }

		getNumFaces(): uint {
			return this._eTextureType === ETextureTypes.TEXTURE_CUBE_MAP ? 6 : 1;
		}

		getSize(): uint {
			//FIXME: necessary consider the number of texture MIP levels
			return this.getNumFaces() * pixelUtil.getMemorySize(this._iWidth, this._iHeight, this._iDepth, this._eFormat);
		}

		reset(): void;
		reset(iSize: uint): void;
		reset(iWidth: uint, iHeight: uint): void;
		reset(iWidth: uint = this._iWidth, iHeight: uint = iWidth): void {
			this._iWidth = iWidth;
			this._iHeight = iHeight;
		}

		getBuffer(iFace?: uint, iMipmap?: uint): IPixelBuffer {
			return null;
		}

		create(iWidth: uint, iHeight: uint, iDepth: uint, cFillColor?: IColor,
			eFlags?: ETextureFlags, nMipLevels?: uint, nFaces?: uint, eTextureType?: ETextureTypes, eFormat?: EPixelFormats): boolean;

		create(iWidth: uint, iHeight: uint, iDepth: uint, pPixels?: Array<any>,
			eFlags?: ETextureFlags, nMipLevels?: uint, nFaces?: uint, eTextureType?: ETextureTypes, eFormat?: EPixelFormats): boolean;

		create(iWidth: uint, iHeight: uint, iDepth: uint, pPixels?: ArrayBufferView,
			eFlags?: ETextureFlags, nMipLevels?: uint, nFaces?: uint, eTextureType?: ETextureTypes, eFormat?: EPixelFormats): boolean;

		create(iWidth: uint, iHeight: uint, iDepth: uint = 1, pPixels: any = null,
			eFlags: ETextureFlags = ETextureFlags.DEFAULT, nMipLevels: uint = 0, nFaces: uint = 0,
			eTextureType: ETextureTypes = ETextureTypes.TEXTURE_2D,
			eFormat: EPixelFormats = EPixelFormats.B8G8R8): boolean {


			if (eTextureType != ETextureTypes.TEXTURE_2D && eTextureType != ETextureTypes.TEXTURE_CUBE_MAP) {
				logger.critical("Given texture type unsupported");
				return false;
			}

			this._eTextureType = eTextureType;

			this._iWidth = iWidth;
			this._iHeight = iHeight;
			this._iDepth = iDepth;

			this._iFlags = eFlags;
			this._nMipLevels = nMipLevels;

			this._eFormat = eFormat;



			if (isArray(pPixels)) {
				pPixels = new Uint8Array(pPixels);
				return this.loadRawData(pPixels, iWidth, iHeight, iDepth, eFormat, nFaces, nMipLevels);
			}
			else if (isTypedArray(pPixels)) {
				return this.loadRawData(pPixels, iWidth, iHeight, iDepth, eFormat, nFaces, nMipLevels);
			}
			else {
				return this.createInternalTexture(pPixels);
			}
		}

		loadResource(sFilename?: string): boolean {
			if (arguments.length == 0) {
				return;
			}

			var pImage: IImg = this.getManager().loadImage(sFilename);
			// console.log("Texture::loadResource(" + sFilename + ")", pImage.isResourceLoaded());

			if (pImage.isResourceLoaded()) {
				return this.loadImage(pImage);
			}
			// LOG("Texture::loadResource(" + sFilename + ")", pImage);
			//this.connect(pImage, SIGNAL(loaded), SLOT(_onImageLoad));

			pImage.loaded.connect(this, this._onImageLoad);

			return true;
		}

		_onImageLoad(pImage: IImg): void {
			pImage.loaded.disconnect(this, this._onImageLoad);
			//this.disconnect(pImage, SIGNAL(loaded), SLOT(_onImageLoad));
			// console.log("image loaded > ", pImage.findResourceName());
			this.loadImage(pImage);
			// debug.log("texture/image loaded: ", pImage.findResourceName());
		}

		destroyResource(): boolean {
			this.freeInternalTexture();
			this.notifyDestroyed();
			return true;
		}

		setFilter(eParam: ETextureParameters, eValue: ETextureFilters): boolean {
			if (this._pParams[eParam] === eValue) {
				return true;
			}

			this._pParams[eParam] = eValue;
			return this._setFilterInternalTexture(eParam, eValue);
		}

		setWrapMode(eParam: ETextureParameters, eValue: ETextureWrapModes): boolean {
			if (this._pParams[eParam] === eValue) {
				return true;
			}

			this._pParams[eParam] = eValue;
			return this._setWrapModeInternalTexture(eParam, eValue);
		}

		getFilter(eParam: ETextureParameters): ETextureFilters {
			// if(!isDefAndNotNull(this._pParams[eParam])) {
			//     this._pParams[eParam] = this._getFilterInternalTexture(eParam);
			// }

			return this._pParams[eParam];
		}

		getWrapMode(eParam: ETextureParameters): ETextureWrapModes {
			// if(!isDefAndNotNull(this._pParams[eParam])) {
			//     this._pParams[eParam] = this._getWrapModeInternalTexture(eParam);
			// }

			return this._pParams[eParam];
		}

		protected _setFilterInternalTexture(eParam: ETextureParameters, eValue: ETextureFilters): boolean {
			logger.critical("virual");
			return false;
		}
		protected _setWrapModeInternalTexture(eParam: ETextureParameters, eValue: ETextureWrapModes): boolean {
			logger.critical("virual");
			return false;
		}

		protected _getFilterInternalTexture(eParam: ETextureParameters): ETextureFilters {
			logger.critical("virual");
			return 0;
		}
		protected _getWrapModeInternalTexture(eParam: ETextureParameters): ETextureWrapModes {
			logger.critical("virual");
			return 0;
		}


		loadRawData(pData: Uint8Array, iWidth: uint, iHeight: uint, iDepth: uint = 1, eFormat: EPixelFormats = EPixelFormats.BYTE_RGB,
			nFaces: uint = 1, nMipMaps: uint = 0) {
			var pTempImg: IImg = <IImg>this.getManager().getImagePool().findResource(".texture.temp_image");

			if (isNull(pTempImg)) {
				pTempImg = <IImg>this.getManager().getImagePool().createResource(".texture.temp_image");
			}

			pTempImg.loadRawData(pData, iWidth, iHeight, iDepth, eFormat, nFaces, nMipMaps);
			var isLoaded: boolean = this.loadImage(pTempImg);
			this.getManager().getImagePool().destroyResource(pTempImg);

			return isLoaded;
		}

		loadImage(pImage: IImg): boolean {
			var isLoaded: boolean = this._loadImages(pImage);

			if (isLoaded) {
				this.notifyLoaded();
				return true;
			}
			else {
				return false;
			}
		}

		loadImages(pImages: IImg[]): boolean {
			var isLoaded: boolean = this._loadImages(pImages);

			if (isLoaded) {
				this.notifyLoaded();
				return true;
			}
			else {
				return false;
			}
		}

		_loadImages(pImageList: IImg[]): boolean;
		_loadImages(pImage: IImg): boolean;

		_loadImages(pImage: any): boolean {




			if (this.isResourceLoaded()) {
				logger.warn("Yoy try to load texture when it already have been loaded. All texture data was destoyed.");
				this.freeInternalTexture();
			}

			var pMainImage: IImg = null;
			var pImageList: IImg[] = null;

			if (!isArray(pImage)) {
				pMainImage = pImage;
				pImageList = new Array(0);
				pImageList[0] = pMainImage;
			}
			else {
				pImageList = arguments[0];
				if (pImageList.length === 0) {
					logger.critical("Cannot load empty list of images");
					return false;
				}
				pMainImage = pImageList[0];
			}



			this._iWidth = pMainImage.getWidth();
			this._iHeight = pMainImage.getHeight();
			this._iDepth = pMainImage.getDepth();

			// Get source image format and adjust if required

			if (webgl.isWebGLFormatSupport(pMainImage.getFormat())) {
				this._eFormat = pMainImage.getFormat();
			}
			else {
				logger.warn("Format not support(" + pixelUtil.getFormatName(pMainImage.getFormat()) + ")");
				if (pMainImage.convert(EPixelFormats.B8G8R8A8)) {
					this._eFormat = pMainImage.getFormat();
				}
				else {
					logger.critical("Format not convert");
				}
			}

			for (i = 1; i < pImageList.length; i++) {
				if (!pImageList[i].convert(pMainImage.getFormat())) {
					logger.critical("Format not support and not convert");
				}
			}


			// The custom mipmaps in the image have priority over everything
			var iImageMips: uint = pMainImage.getNumMipMaps();

			if (iImageMips === Img.getMaxMipmaps(this._iWidth, this._iHeight, this._iDepth, this._eFormat)) {
				this._nMipLevels = iImageMips;

				// Disable flag for auto mip generation
				this._iFlags = bf.clearAll(this._iFlags, ETextureFlags.AUTOMIPMAP);
			}
			else {
				this._nMipLevels = 0;
			}


			// Check if we're loading one image with multiple faces
			// or a vector of images representing the faces
			var iFaces: uint = 0;
			var isMultiImage: boolean = false;

			if (pImageList.length == 6) {
				iFaces = 6;
				isMultiImage = true;
				this._eTextureType = ETextureTypes.TEXTURE_CUBE_MAP;
			}
			else if (pMainImage.getNumFaces() == 6) {
				iFaces = 6;
				isMultiImage = false;
				this._eTextureType = ETextureTypes.TEXTURE_CUBE_MAP;
			}
			else {
				iFaces = 1;
				isMultiImage = false;
				this._eTextureType = ETextureTypes.TEXTURE_2D;
			}

			// Check wether number of faces in images exceeds number of faces
			// in this texture. If so, clamp it.
			if (iFaces > this.getNumFaces()) {
				iFaces = this.getNumFaces();
			}

			// Create the texture
			this.createInternalTexture(null);

			// Main loading loop
			// imageMips == 0 if the image has no custom mipmaps, otherwise contains the number of custom mips

			var mip: uint = 0;
			var i: uint = 0;
			for (mip = 0; mip <= this._nMipLevels; ++mip) {
				for (i = 0; i < iFaces; ++i) {
					var pSrc: IPixelBox;

					if (isMultiImage) {
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

		convertToImage(pDestImage: IImg, bIncludeMipMaps: boolean): void {
			// logger.critical("!!!нехуй")
			var iNumMips: uint = bIncludeMipMaps ? this._nMipLevels + 1 : 1;
			var iDataSize: uint = pixelUtil.calculateSizeForImage(iNumMips, this.getNumFaces(),
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
			if (pTarget.getNumFaces() !== this.getNumFaces()) {
				logger.critical("Texture types must match");
			}

			var nMipLevels: uint = Math.min(this._nMipLevels, pTarget.getMipLevels());
			if (bf.testAny(this._iFlags, ETextureFlags.AUTOMIPMAP) || bf.testAny(this.getFlags(), ETextureFlags.AUTOMIPMAP)) {
				nMipLevels = 0;
			}

			var iFace: uint = 0, mip: uint = 0;

			for (iFace = 0; iFace < this.getNumFaces(); iFace++) {
				for (mip = 0; mip <= nMipLevels; mip++) {
					pTarget.getBuffer(iFace, mip).blit(this.getBuffer(iFace, mip));
				}
			}
		}

		createInternalTexture(cFillColor: IColor = null): boolean {

			if (!this._isInternalResourceCreated) {
				this._createInternalTextureImpl(cFillColor);
				this._isInternalResourceCreated = true;
				this.notifyCreated();
				return true;
			}

			return false;
		}

		freeInternalTexture(): boolean {
			if (this._isInternalResourceCreated) {
				this.freeInternalTextureImpl();
				this._isInternalResourceCreated = false;
				this.notifyDestroyed();
				return true;
			}

			return false;
		}

		protected _createInternalTextureImpl(cFillColor: IColor = null): boolean {
			return false;
		}

		protected freeInternalTextureImpl(): boolean {
			return false;
		}

		setPixelRGBA(i1: uint, i2: uint, iTextureWidth: uint, iTextureHeight: uint, pBuffer: Uint8Array): void {
			return;
		}
	}

}
