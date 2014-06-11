/// <reference path="../idl/IRenderer.ts" />
/// <reference path="../idl/IResourcePool.ts" />
/// <reference path="../idl/IColor.ts" />
/// <reference path="../idl/IPixelBuffer.ts" />

/// <reference path="../pool/resources/Texture.ts" />
/// <reference path="../math/math.ts" />

/// <reference path="webgl.ts" />
/// <reference path="WebGLTextureBuffer.ts" />

module akra.webgl {
	export class WebGLInternalTexture extends pool.resources.Texture {
		private _pSurfaceList: WebGLTextureBuffer[] = null;
		private _pWebGLTexture: WebGLTexture = null;

		getWebGLTexture(): WebGLTexture {
			return this._pWebGLTexture;
		}

		constructor() {
			super();
		}

		_getWebGLTextureTarget(): int {
			switch (this._eTextureType) {
				case ETextureTypes.TEXTURE_2D:
					return gl.TEXTURE_2D;
				case ETextureTypes.TEXTURE_CUBE_MAP:
					return gl.TEXTURE_CUBE_MAP;
				default:
					return 0;
			}
		}

		private _getWebGLTextureParameter(eParam: ETextureParameters): uint {
			switch (eParam) {
				case ETextureParameters.MAG_FILTER:
					return gl.TEXTURE_MAG_FILTER;
				case ETextureParameters.MIN_FILTER:
					return gl.TEXTURE_MIN_FILTER;
				case ETextureParameters.WRAP_S:
					return gl.TEXTURE_WRAP_S;
				case ETextureParameters.WRAP_T:
					return gl.TEXTURE_WRAP_T;
				default:
					return 0;
			}
		}


		private _getWebGLTextureParameterValue(eValue: ETextureFilters): uint;
		private _getWebGLTextureParameterValue(eValue: ETextureWrapModes): uint;
		private _getWebGLTextureParameterValue(eValue: any): uint {
			switch (eValue) {
				case ETextureFilters.NEAREST:
					return gl.NEAREST;
				case ETextureFilters.LINEAR:
					return gl.LINEAR;
				case ETextureFilters.NEAREST_MIPMAP_NEAREST:
					return gl.NEAREST_MIPMAP_NEAREST;
				case ETextureFilters.LINEAR_MIPMAP_NEAREST:
					return gl.LINEAR_MIPMAP_NEAREST;
				case ETextureFilters.NEAREST_MIPMAP_LINEAR:
					return gl.NEAREST_MIPMAP_LINEAR;
				case ETextureFilters.LINEAR_MIPMAP_LINEAR:
					return gl.LINEAR_MIPMAP_LINEAR;


				case ETextureWrapModes.REPEAT:
					return gl.REPEAT;
				case ETextureWrapModes.CLAMP_TO_EDGE:
					return gl.CLAMP_TO_EDGE;
				case ETextureWrapModes.MIRRORED_REPEAT:
					return gl.MIRRORED_REPEAT;
				default:
					return 0;
			}
		}

		private _getAkraTextureParameterValue(iWebGLValue: uint): uint {
			switch (iWebGLValue) {
				case gl.NEAREST:
					return ETextureFilters.NEAREST;
				case gl.LINEAR:
					return ETextureFilters.LINEAR;
				case gl.NEAREST_MIPMAP_NEAREST:
					return ETextureFilters.NEAREST_MIPMAP_NEAREST;
				case gl.LINEAR_MIPMAP_NEAREST:
					return ETextureFilters.LINEAR_MIPMAP_NEAREST;
				case gl.NEAREST_MIPMAP_LINEAR:
					return ETextureFilters.NEAREST_MIPMAP_LINEAR;
				case gl.LINEAR_MIPMAP_LINEAR:
					return ETextureFilters.LINEAR_MIPMAP_LINEAR;


				case gl.REPEAT:
					return ETextureWrapModes.REPEAT;
				case gl.CLAMP_TO_EDGE:
					return ETextureWrapModes.CLAMP_TO_EDGE;
				case gl.MIRRORED_REPEAT:
					return ETextureWrapModes.MIRRORED_REPEAT;
				default:
					return 0;
			}
		}

		reset(): void;
		reset(iSize: uint): void;
		reset(iWidth: uint, iHeight: uint): void;
		reset(iWidth: uint = this._iWidth, iHeight: uint = iWidth): void {
			super.reset(iWidth, iHeight);

			for (var i: uint = 0; i < this._pSurfaceList.length; i++) {
				this._pSurfaceList[i].reset(iWidth, iHeight);
			}
		}

		protected _setFilterInternalTexture(eParam: ETextureParameters, eValue: ETextureFilters): boolean {
			if (!this.isValid()) {
				return false;
			}

			var iWebGLTarget: int = this._getWebGLTextureTarget();
			var pWebGLRenderer: webgl.WebGLRenderer = <webgl.WebGLRenderer>this.getManager().getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();
			pWebGLRenderer.bindWebGLTexture(iWebGLTarget, this._pWebGLTexture);
			pWebGLContext.texParameteri(iWebGLTarget, this._getWebGLTextureParameter(eParam), this._getWebGLTextureParameterValue(eValue));
			// var e = pWebGLContext.getError();if (e){LOG(this.findResourceName(), "filter: ", eParam, "value: ", eValue, "error: ", e)};
			return true;
		}
		protected _setWrapModeInternalTexture(eParam: ETextureParameters, eValue: ETextureWrapModes): boolean {
			if (!this.isValid()) {
				return false;
			}

			var iWebGLTarget: int = this._getWebGLTextureTarget();
			var pWebGLRenderer: webgl.WebGLRenderer = <webgl.WebGLRenderer>this.getManager().getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();
			pWebGLRenderer.bindWebGLTexture(iWebGLTarget, this._pWebGLTexture);
			pWebGLContext.texParameteri(iWebGLTarget, this._getWebGLTextureParameter(eParam), this._getWebGLTextureParameterValue(eValue));
			return true;
		}

		protected _getFilterInternalTexture(eParam: ETextureParameters): ETextureFilters {
			if (!this.isValid()) {
				return 0;
			}
			var iWebGLTarget: int = this._getWebGLTextureTarget();
			var pWebGLRenderer: webgl.WebGLRenderer = <webgl.WebGLRenderer>this.getManager().getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();
			pWebGLRenderer.bindWebGLTexture(iWebGLTarget, this._pWebGLTexture);
			return this._getAkraTextureParameterValue(pWebGLContext.getTexParameter(iWebGLTarget, this._getWebGLTextureParameter(eParam)));
		}

		protected _createInternalTextureImpl(cFillColor: IColor = null): boolean {
			if (!isNull(cFillColor)) {
				logger.warn("Texture can create with filled only by default(black) color");
				//TODO: must implement filling by color
			}


			var pWebGLRenderer: webgl.WebGLRenderer = <webgl.WebGLRenderer>this.getManager().getEngine().getRenderer();

			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();


			if (this._eTextureType == ETextureTypes.TEXTURE_2D) {
				if (this._iWidth > webgl.maxTextureSize) {
					logger.warn("Заданная ширина не поддерживается(" + this._iWidth + ")");
					this._iWidth = webgl.maxTextureSize;
				}
				if (this._iHeight > webgl.maxTextureSize) {
					logger.warn("Заданная высота не поддерживается(" + this._iHeight + ")");
					this._iHeight = webgl.maxTextureSize;

				}
			}
			else if (this._eTextureType == ETextureTypes.TEXTURE_CUBE_MAP) {
				if (this._iWidth > webgl.maxCubeMapTextureSize) {
					logger.warn("Заданная ширина не поддерживается(" + this._iWidth + ")");
					this._iWidth = webgl.maxCubeMapTextureSize;
				}
				if (this._iHeight > webgl.maxCubeMapTextureSize) {
					logger.warn("Заданная высота не поддерживается(" + this._iHeight + ")");
					this._iHeight = webgl.maxCubeMapTextureSize;

				}
			}

			if (this._iWidth == 0) {
				logger.warn("Заданная ширина не поддерживается(" + this._iWidth + ")");
				this._iWidth = 1;

			}
			if (this._iHeight == 0) {
				logger.warn("Заданная высота не поддерживается(" + this._iHeight + ")");
				this._iHeight = 1;
			}
			if (this._iDepth != 1) {
				this._iDepth = 1;
				logger.warn("Трехмерные текстуры не поддерживаются, сброс глубины в 1");
			}
			if (this._nMipLevels != 0 && !webgl.hasExtension(EXT_TEXTURE_NPOT_2D_MIPMAP) && (!math.isPowerOfTwo(this._iDepth) || !math.isPowerOfTwo(this._iHeight) || !math.isPowerOfTwo(this._iWidth))) {
				logger.warn("Мип мапы у текстуры не стпени двойки не поддерживаются, сброс мипмапов в 0");
				this._nMipLevels = 0;
				this._iFlags = bf.clearAll(this._iFlags, ETextureFlags.AUTOMIPMAP);
			}

			if (!webgl.isWebGLFormatSupport(this._eFormat)) {
				logger.warn("Данный тип текстуры не поддерживается: ", this._eFormat);
				this._eFormat = EPixelFormats.A8B8G8R8;
			}


			if (this._nMipLevels != 0 && this._nMipLevels !== pool.resources.Img.getMaxMipmaps(this._iWidth, this._iHeight, this._iDepth, this._eFormat)) {
				logger.warn("Нехватает мипмапов, сброс в 0");
				this._nMipLevels = 0;
			}


			// Convert to nearest power-of-two size if required
			//this._iWidth = math.ceilingPowerOfTwo(this._iWidth);
			//this._iHeight = math.ceilingPowerOfTwo(this._iHeight);
			//this._iDepth = math.ceilingPowerOfTwo(this._iDepth);


			var iWebGLTarget: int = this._getWebGLTextureTarget();

			this._pWebGLTexture = pWebGLRenderer.createWebGLTexture();

			pWebGLRenderer.bindWebGLTexture(iWebGLTarget, this._pWebGLTexture);

			this._isMipmapsHardwareGenerated = pWebGLRenderer.hasCapability(ERenderCapabilities.AUTOMIPMAP);

			// Set some misc default parameters, these can of course be changed later

			var eMinFiler: int = this.getFilter(ETextureParameters.MIN_FILTER);
			var eMagFiler: int = this.getFilter(ETextureParameters.MAG_FILTER);

			if ((eMinFiler >= ETextureFilters.NEAREST_MIPMAP_NEAREST && eMinFiler <= ETextureFilters.LINEAR_MIPMAP_LINEAR) &&
				this._nMipLevels < 2) {
				eMinFiler = ETextureFilters.LINEAR;
			}

			if ((eMagFiler >= ETextureFilters.NEAREST_MIPMAP_NEAREST && eMagFiler <= ETextureFilters.LINEAR_MIPMAP_LINEAR) &&
				this._nMipLevels < 2) {
				eMagFiler = ETextureFilters.LINEAR;
			}
			// LOG("e: ", pWebGLContext.getError(), this.findResourceName(), "n mipmaps: ", this._nMipLevels, "size (x, y):", this._iWidth, this._iHeight, "min filer > ", "(0x", eMinFiler.toString(16), ")");


			this.setFilter(ETextureParameters.MIN_FILTER, eMinFiler);
			this.setFilter(ETextureParameters.MAG_FILTER, eMagFiler);
			this.setWrapMode(ETextureParameters.WRAP_S, this.getWrapMode(ETextureParameters.WRAP_S));
			this.setWrapMode(ETextureParameters.WRAP_T, this.getWrapMode(ETextureParameters.WRAP_T));

			pWebGLContext.texParameteri(iWebGLTarget, this._getWebGLTextureParameter(ETextureParameters.MIN_FILTER), eMinFiler);
			pWebGLContext.texParameteri(iWebGLTarget, this._getWebGLTextureParameter(ETextureParameters.MAG_FILTER), eMagFiler);
			pWebGLContext.texParameteri(iWebGLTarget, this._getWebGLTextureParameter(ETextureParameters.WRAP_S), this.getWrapMode(ETextureParameters.WRAP_S));
			pWebGLContext.texParameteri(iWebGLTarget, this._getWebGLTextureParameter(ETextureParameters.WRAP_T), this.getWrapMode(ETextureParameters.WRAP_T));

			var iWebGLFormat: int = webgl.getWebGLFormat(this._eFormat);
			var iWebGLDataType: int = webgl.getWebGLDataType(this._eFormat);
			var iWidth: uint = this._iWidth;
			var iHeight: uint = this._iHeight;
			var iDepth: uint = this._iDepth;

			if (pixelUtil.isCompressed(this._eFormat)) {
				// Compressed formats
				var iSize: uint = pixelUtil.getMemorySize(iWidth, iHeight, iDepth, this._eFormat);

				// Provide temporary buffer filled with zeroes as glCompressedTexImageXD does not
				// accept a 0 pointer like normal glTexImageXD
				// Run through this process for every mipmap to pregenerate mipmap pyramid


				var pTmpData: Uint8Array = new Uint8Array(iSize);
				var pEmptyData: Uint8Array;
				var mip: uint = 0;

				for (mip = 0; mip <= this._nMipLevels; mip++) {

					iSize = pixelUtil.getMemorySize(iWidth, iHeight, iDepth, this._eFormat);
					//console.log(iSize,iWidth, iHeight, iDepth, this._eFormat);
					pEmptyData = pTmpData.subarray(0, iSize);
					switch (this._eTextureType) {

						case ETextureTypes.TEXTURE_2D:
							//debug.log(gl.TEXTURE_2D, mip, EPixelFormats[this._eFormat] + " (" + iWebGLFormat + ")",
							//	iWidth, iHeight, 0, null);
							pWebGLContext.compressedTexImage2D(gl.TEXTURE_2D, mip, iWebGLFormat,
								iWidth, iHeight, 0, pEmptyData);
							break;
						case ETextureTypes.TEXTURE_CUBE_MAP:
							var iFace: uint = 0;
							for (iFace = 0; iFace < 6; iFace++) {
								pWebGLContext.compressedTexImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + iFace, mip, iWebGLFormat,
									iWidth, iHeight, 0, pEmptyData);
							}
							break;
						default:
							break;

					};
					if (iWidth > 1) iWidth = iWidth / 2;
					if (iHeight > 1) iHeight = iHeight / 2;
					if (iDepth > 1) iDepth = iDepth / 2;

				}
				pTmpData = null;
				pEmptyData = null;
			}
			else {
				var mip: uint = 0;
				// Run through this process to pregenerate mipmap pyramid
				for (mip = 0; mip <= this._nMipLevels; mip++) {
					// Normal formats
					switch (this._eTextureType) {
						case ETextureTypes.TEXTURE_2D:
							//debug.log(gl.TEXTURE_2D, mip, EPixelFormats[this._eFormat] + " (" + iWebGLFormat + ")",
							//	iWidth, iHeight, 0, EPixelFormats[this._eFormat] + " (" + iWebGLFormat + ")", EPixelComponentTypes[pixelUtil.getComponentType(this._eFormat)] + " (" + iWebGLDataType+ ")", null);
							pWebGLContext.texImage2D(gl.TEXTURE_2D, mip, iWebGLFormat,
								iWidth, iHeight, 0, iWebGLFormat, iWebGLDataType, null);
							break;
						case ETextureTypes.TEXTURE_CUBE_MAP:
							var iFace: uint = 0;
							for (iFace = 0; iFace < 6; iFace++) {
								pWebGLContext.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + iFace, mip, iWebGLFormat,
									iWidth, iHeight, 0, iWebGLFormat, iWebGLDataType, null);
							}
							break;
						default:
							break;
					}

					if (iWidth > 1) iWidth = iWidth >>> 1;
					if (iHeight > 1) iHeight = iHeight >>> 1;
					if (iDepth > 1) iDepth = iDepth >>> 1;
				}
			}

			this._createSurfaceList();
			pWebGLRenderer.bindWebGLTexture(iWebGLTarget, null);

			return true;
		}

		protected freeInternalTextureImpl(): boolean {
			var pWebGLRenderer: WebGLRenderer = <WebGLRenderer>this.getManager().getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();

			pWebGLRenderer.deleteWebGLTexture(this._pWebGLTexture);
			this._pWebGLTexture = null;

			for (var i: uint = 0; i < this._pSurfaceList.length; i++) {
				this._pSurfaceList[i].release();
			}

			this._pSurfaceList = null;

			return true;
		}

		private _createSurfaceList(): void {
			this._pSurfaceList = new Array();

			// For all faces and mipmaps, store surfaces as IPixelBuffer
			var bWantGeneratedMips: boolean = bf.testAny(this._iFlags, ETextureFlags.AUTOMIPMAP);

			// Do mipmapping in software? (uses GLU) For some cards, this is still needed. Of course,
			// only when mipmap generation is desired.
			var bDoSoftware: boolean = bWantGeneratedMips && !this._isMipmapsHardwareGenerated && this._nMipLevels !== 0;

			var iFace: uint = 0;
			var mip: uint = 0;
			var pTextureBufferPool: IResourcePool<IPixelBuffer> = this.getManager().getTextureBufferPool();
			var sResourceName: string = this.findResourceName();

			for (iFace = 0; iFace < this.getNumFaces(); iFace++) {
				var iWidth: uint = this._iWidth;
				var iHeight: uint = this._iHeight;



				for (mip = 0; mip <= this._nMipLevels; mip++) {
					var pBuf: WebGLTextureBuffer = <WebGLTextureBuffer>pTextureBufferPool.createResource(sResourceName + "_" + iFace + "_" + mip);


					pBuf.create(this._getWebGLTextureTarget(),
						this._pWebGLTexture,
						iWidth, iHeight,
						webgl.getClosestWebGLInternalFormat(this._eFormat),
						webgl.getWebGLDataType(this._eFormat),
						iFace,
						mip,
						this._iFlags,
						bDoSoftware && mip === 0);

					this._pSurfaceList.push(pBuf);

					//check error
					if (pBuf.getWidth() === 0 ||
						pBuf.getHeight() === 0 ||
						pBuf.getDepth() === 0) {
						logger.critical("Zero sized texture surface on texture " + sResourceName +
							" face " + iFace +
							" mipmap " + mip +
							". The GL driver probably refused to create the texture.");
					}

				}
			}
		}

		getBuffer(iFace: uint = 0, iMipmap: uint = 0): IPixelBuffer {
			if (iFace >= this.getNumFaces()) {
				logger.critical("Face index out of range", iFace, this.getNumFaces());
			}

			if (iMipmap > this._nMipLevels) {
				logger.critical("Mipmap index out of range", iMipmap, this._nMipLevels);
			}

			var idx: uint = iFace * (this._nMipLevels + 1) + iMipmap;
			logger.assert(idx < this._pSurfaceList.length, "smth " + this._pSurfaceList.length + " , " + iFace + " , " + this._nMipLevels + " , " + iMipmap);

			return this._pSurfaceList[idx];
		}


		createRenderTexture(): boolean {
			// Create the GL texture
			// This already does everything necessary
			return this.createInternalTexture();
		}

	}
}