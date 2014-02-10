/// <reference path="../../idl/ITexture.ts"	 />
/// <reference path="../../idl/IImg.ts"	 />
/// <reference path="../../idl/EPixelFormats.ts" />
/// <reference path="../../idl/IColor.ts" />
/// <reference path="../../idl/IMap.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (pool) {
        /// <reference path="../../pixelUtil/pixelUtil.ts" />
        /// <reference path="../ResourcePoolItem.ts" />
        /// <reference path="Img.ts" />
        /// <reference path="../../debug.ts" />
        /// <reference path="../../logger.ts" />
        (function (resources) {
            (function (ETextureForcedFormatFlags) {
                ETextureForcedFormatFlags[ETextureForcedFormatFlags["FORCEMIPLEVELS"] = 0] = "FORCEMIPLEVELS";
                ETextureForcedFormatFlags[ETextureForcedFormatFlags["FORCEFORMAT"] = 1] = "FORCEFORMAT";
                ETextureForcedFormatFlags[ETextureForcedFormatFlags["FORCESIZE"] = 2] = "FORCESIZE";
            })(resources.ETextureForcedFormatFlags || (resources.ETextureForcedFormatFlags = {}));
            var ETextureForcedFormatFlags = resources.ETextureForcedFormatFlags;

            var Texture = (function (_super) {
                __extends(Texture, _super);
                function Texture() {
                    _super.call(this);
                    this._iFlags = akra.ETextureFlags.DEFAULT;
                    this._iWidth = 512;
                    this._iHeight = 512;
                    this._iDepth = 1;
                    this._eFormat = 0 /* UNKNOWN */;
                    this._nMipLevels = 0;
                    this._nRequestedMipLevels = 0;
                    this._eTextureType = 3553 /* TEXTURE_2D */;
                    this._pParams = {};
                    this._isInternalResourceCreated = false;
                    this._isMipmapsHardwareGenerated = false;

                    this._pParams[10241 /* MIN_FILTER */] = 9728 /* NEAREST */;
                    this._pParams[10240 /* MAG_FILTER */] = 9728 /* NEAREST */;
                    this._pParams[10242 /* WRAP_S */] = 33071 /* CLAMP_TO_EDGE */;
                    this._pParams[10243 /* WRAP_T */] = 33071 /* CLAMP_TO_EDGE */;
                }
                Texture.prototype.getWidth = function () {
                    return this._iWidth;
                };

                Texture.prototype.getHeight = function () {
                    return this._iHeight;
                };

                Texture.prototype.getDepth = function () {
                    return this._iDepth;
                };

                Texture.prototype.getFormat = function () {
                    return this._eFormat;
                };

                Texture.prototype.getTextureType = function () {
                    return this._eTextureType;
                };

                Texture.prototype.getMipLevels = function () {
                    return this._nMipLevels;
                };

                Texture.prototype.getByteLength = function () {
                    return this.getSize();
                };

                Texture.prototype.getFlags = function () {
                    return this._iFlags;
                };

                Texture.prototype.setFlags = function (iFlags) {
                    this._iFlags = iFlags;
                };

                Texture.prototype.isTexture2D = function () {
                    return this._eTextureType === 3553 /* TEXTURE_2D */;
                };

                Texture.prototype.isTextureCube = function () {
                    return this._eTextureType === 34067 /* TEXTURE_CUBE_MAP */;
                };

                Texture.prototype.isCompressed = function () {
                    return (this._eFormat >= 17 /* DXT1 */ && this._eFormat <= 21 /* DXT5 */) || (this._eFormat >= 38 /* PVRTC_RGB2 */ && this._eFormat <= 41 /* PVRTC_RGBA4 */);
                };

                Texture.prototype.isValid = function () {
                    return this._isInternalResourceCreated;
                };

                //  calculateSize(): uint {
                //     return this.getNumFaces() * pixelUtil.getMemorySize(this._iWidth, this._iHeight, this._iDepth, this._eFormat);
                // }
                Texture.prototype.getNumFaces = function () {
                    return this._eTextureType === 34067 /* TEXTURE_CUBE_MAP */ ? 6 : 1;
                };

                Texture.prototype.getSize = function () {
                    //FIXME: necessary consider the number of texture MIP levels
                    return this.getNumFaces() * akra.pixelUtil.getMemorySize(this._iWidth, this._iHeight, this._iDepth, this._eFormat);
                };

                Texture.prototype.reset = function (iWidth, iHeight) {
                    if (typeof iWidth === "undefined") { iWidth = this._iWidth; }
                    if (typeof iHeight === "undefined") { iHeight = iWidth; }
                    this._iWidth = iWidth;
                    this._iHeight = iHeight;
                };

                Texture.prototype.getBuffer = function (iFace, iMipmap) {
                    return null;
                };

                Texture.prototype.create = function (iWidth, iHeight, iDepth, pPixels, eFlags, nMipLevels, nFaces, eTextureType, eFormat) {
                    if (typeof iDepth === "undefined") { iDepth = 1; }
                    if (typeof pPixels === "undefined") { pPixels = null; }
                    if (typeof eFlags === "undefined") { eFlags = akra.ETextureFlags.DEFAULT; }
                    if (typeof nMipLevels === "undefined") { nMipLevels = 0; }
                    if (typeof nFaces === "undefined") { nFaces = 0; }
                    if (typeof eTextureType === "undefined") { eTextureType = 3553 /* TEXTURE_2D */; }
                    if (typeof eFormat === "undefined") { eFormat = 11 /* B8G8R8 */; }
                    if (eTextureType != 3553 /* TEXTURE_2D */ && eTextureType != 34067 /* TEXTURE_CUBE_MAP */) {
                        akra.logger.critical("Given texture type unsupported");
                        return false;
                    }

                    this._eTextureType = eTextureType;

                    this._iWidth = iWidth;
                    this._iHeight = iHeight;
                    this._iDepth = iDepth;

                    this._iFlags = eFlags;
                    this._nMipLevels = nMipLevels;

                    this._eFormat = eFormat;

                    if (akra.isArray(pPixels)) {
                        pPixels = new Uint8Array(pPixels);
                        return this.loadRawData(pPixels, iWidth, iHeight, iDepth, eFormat, nFaces, nMipLevels);
                    } else if (akra.isTypedArray(pPixels)) {
                        return this.loadRawData(pPixels, iWidth, iHeight, iDepth, eFormat, nFaces, nMipLevels);
                    } else {
                        return this.createInternalTexture(pPixels);
                    }
                };

                Texture.prototype.loadResource = function (sFilename) {
                    if (arguments.length == 0) {
                        return;
                    }

                    var pImage = this.getManager().loadImage(sFilename);

                    // console.log("Texture::loadResource(" + sFilename + ")", pImage.isResourceLoaded());
                    if (pImage.isResourceLoaded()) {
                        return this.loadImage(pImage);
                    }

                    // LOG("Texture::loadResource(" + sFilename + ")", pImage);
                    //this.connect(pImage, SIGNAL(loaded), SLOT(_onImageLoad));
                    pImage.loaded.connect(this, this._onImageLoad);

                    return true;
                };

                Texture.prototype._onImageLoad = function (pImage) {
                    pImage.loaded.disconnect(this, this._onImageLoad);

                    //this.disconnect(pImage, SIGNAL(loaded), SLOT(_onImageLoad));
                    // console.log("image loaded > ", pImage.findResourceName());
                    this.loadImage(pImage);
                    // debug.log("texture/image loaded: ", pImage.findResourceName());
                };

                Texture.prototype.destroyResource = function () {
                    this.freeInternalTexture();
                    this.notifyDestroyed();
                    return true;
                };

                Texture.prototype.setFilter = function (eParam, eValue) {
                    if (this._pParams[eParam] === eValue) {
                        return true;
                    }

                    this._pParams[eParam] = eValue;
                    return this._setFilterInternalTexture(eParam, eValue);
                };

                Texture.prototype.setWrapMode = function (eParam, eValue) {
                    if (this._pParams[eParam] === eValue) {
                        return true;
                    }

                    this._pParams[eParam] = eValue;
                    return this._setWrapModeInternalTexture(eParam, eValue);
                };

                Texture.prototype.getFilter = function (eParam) {
                    // if(!isDefAndNotNull(this._pParams[eParam])) {
                    //     this._pParams[eParam] = this._getFilterInternalTexture(eParam);
                    // }
                    return this._pParams[eParam];
                };

                Texture.prototype.getWrapMode = function (eParam) {
                    // if(!isDefAndNotNull(this._pParams[eParam])) {
                    //     this._pParams[eParam] = this._getWrapModeInternalTexture(eParam);
                    // }
                    return this._pParams[eParam];
                };

                Texture.prototype._setFilterInternalTexture = function (eParam, eValue) {
                    akra.logger.critical("virual");
                    return false;
                };
                Texture.prototype._setWrapModeInternalTexture = function (eParam, eValue) {
                    akra.logger.critical("virual");
                    return false;
                };

                Texture.prototype._getFilterInternalTexture = function (eParam) {
                    akra.logger.critical("virual");
                    return 0;
                };
                Texture.prototype._getWrapModeInternalTexture = function (eParam) {
                    akra.logger.critical("virual");
                    return 0;
                };

                Texture.prototype.loadRawData = function (pData, iWidth, iHeight, iDepth, eFormat, nFaces, nMipMaps) {
                    if (typeof iDepth === "undefined") { iDepth = 1; }
                    if (typeof eFormat === "undefined") { eFormat = 10 /* BYTE_RGB */; }
                    if (typeof nFaces === "undefined") { nFaces = 1; }
                    if (typeof nMipMaps === "undefined") { nMipMaps = 0; }
                    var pTempImg = this.getManager().getImagePool().findResource(".texture.temp_image");

                    if (akra.isNull(pTempImg)) {
                        pTempImg = this.getManager().getImagePool().createResource(".texture.temp_image");
                    }

                    pTempImg.loadRawData(pData, iWidth, iHeight, iDepth, eFormat, nFaces, nMipMaps);
                    var isLoaded = this.loadImage(pTempImg);
                    this.getManager().getImagePool().destroyResource(pTempImg);

                    return isLoaded;
                };

                Texture.prototype.loadImage = function (pImage) {
                    var isLoaded = this._loadImages(pImage);

                    if (isLoaded) {
                        this.notifyLoaded();
                        return true;
                    } else {
                        return false;
                    }
                };

                Texture.prototype.loadImages = function (pImages) {
                    var isLoaded = this._loadImages(pImages);

                    if (isLoaded) {
                        this.notifyLoaded();
                        return true;
                    } else {
                        return false;
                    }
                };

                Texture.prototype._loadImages = function (pImage) {
                    if (this.isResourceLoaded()) {
                        akra.logger.warn("Yoy try to load texture when it already have been loaded. All texture data was destoyed.");
                        this.freeInternalTexture();
                    }

                    var pMainImage = null;
                    var pImageList = null;

                    if (!akra.isArray(pImage)) {
                        pMainImage = pImage;
                        pImageList = new Array(0);
                        pImageList[0] = pMainImage;
                    } else {
                        pImageList = arguments[0];
                        if (pImageList.length === 0) {
                            akra.logger.critical("Cannot load empty list of images");
                            return false;
                        }
                        pMainImage = pImageList[0];
                    }

                    this._iWidth = pMainImage.getWidth();
                    this._iHeight = pMainImage.getHeight();
                    this._iDepth = pMainImage.getDepth();

                    // Get source image format and adjust if required
                    if (akra.webgl.isWebGLFormatSupport(pMainImage.getFormat())) {
                        this._eFormat = pMainImage.getFormat();
                    } else {
                        akra.logger.warn("Format not support(" + akra.pixelUtil.getFormatName(pMainImage.getFormat()) + ")");
                        if (pMainImage.convert(14 /* B8G8R8A8 */)) {
                            this._eFormat = pMainImage.getFormat();
                        } else {
                            akra.logger.critical("Format not convert");
                        }
                    }

                    for (i = 1; i < pImageList.length; i++) {
                        if (!pImageList[i].convert(pMainImage.getFormat())) {
                            akra.logger.critical("Format not support and not convert");
                        }
                    }

                    // The custom mipmaps in the image have priority over everything
                    var iImageMips = pMainImage.getNumMipMaps();

                    if (iImageMips === akra.pool.resources.Img.getMaxMipmaps(this._iWidth, this._iHeight, this._iDepth, this._eFormat)) {
                        this._nMipLevels = iImageMips;

                        // Disable flag for auto mip generation
                        this._iFlags = akra.bf.clearAll(this._iFlags, 256 /* AUTOMIPMAP */);
                    } else {
                        this._nMipLevels = 0;
                    }

                    // Check if we're loading one image with multiple faces
                    // or a vector of images representing the faces
                    var iFaces = 0;
                    var isMultiImage = false;

                    if (pImageList.length == 6) {
                        iFaces = 6;
                        isMultiImage = true;
                        this._eTextureType = 34067 /* TEXTURE_CUBE_MAP */;
                    } else if (pMainImage.getNumFaces() == 6) {
                        iFaces = 6;
                        isMultiImage = false;
                        this._eTextureType = 34067 /* TEXTURE_CUBE_MAP */;
                    } else {
                        iFaces = 1;
                        isMultiImage = false;
                        this._eTextureType = 3553 /* TEXTURE_2D */;
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
                    var mip = 0;
                    var i = 0;
                    for (mip = 0; mip <= this._nMipLevels; ++mip) {
                        for (i = 0; i < iFaces; ++i) {
                            var pSrc;

                            if (isMultiImage) {
                                // Load from multiple images
                                pSrc = pImageList[i].getPixels(0, mip);
                                //console.log(mip,i);
                            } else {
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
                };

                Texture.prototype.convertToImage = function (pDestImage, bIncludeMipMaps) {
                    // logger.critical("!!!нехуй")
                    var iNumMips = bIncludeMipMaps ? this._nMipLevels + 1 : 1;
                    var iDataSize = akra.pixelUtil.calculateSizeForImage(iNumMips, this.getNumFaces(), this._iWidth, this._iHeight, this._iDepth, this._eFormat);

                    var pPixData = new Uint8Array(iDataSize);

                    // if there are multiple faces and mipmaps we must pack them into the data
                    // faces, then mips
                    var pCurrentPixData = pPixData;

                    var iFace = 0;
                    var mip = 0;

                    for (iFace = 0; iFace < this.getNumFaces(); ++iFace) {
                        for (mip = 0; mip < iNumMips; ++mip) {
                            var iMipDataSize = akra.pixelUtil.getMemorySize(this._iWidth, this._iHeight, this._iDepth, this._eFormat);

                            var pPixBox = new akra.pixelUtil.PixelBox(this._iWidth, this._iHeight, this._iDepth, this._eFormat, pCurrentPixData);
                            this.getBuffer(iFace, mip).blitToMemory(pPixBox);

                            pCurrentPixData = pCurrentPixData.subarray(iMipDataSize);
                        }
                    }

                    // load, and tell Image to delete the memory when it's done.
                    pDestImage.loadDynamicImage(pPixData, this._iWidth, this._iHeight, this._iDepth, this._eFormat, this.getNumFaces(), iNumMips - 1);
                };

                Texture.prototype.copyToTexture = function (pTarget) {
                    if (pTarget.getNumFaces() !== this.getNumFaces()) {
                        akra.logger.critical("Texture types must match");
                    }

                    var nMipLevels = Math.min(this._nMipLevels, pTarget.getMipLevels());
                    if (akra.bf.testAny(this._iFlags, 256 /* AUTOMIPMAP */) || akra.bf.testAny(this.getFlags(), 256 /* AUTOMIPMAP */)) {
                        nMipLevels = 0;
                    }

                    var iFace = 0, mip = 0;

                    for (iFace = 0; iFace < this.getNumFaces(); iFace++) {
                        for (mip = 0; mip <= nMipLevels; mip++) {
                            pTarget.getBuffer(iFace, mip).blit(this.getBuffer(iFace, mip));
                        }
                    }
                };

                Texture.prototype.createInternalTexture = function (cFillColor) {
                    if (typeof cFillColor === "undefined") { cFillColor = null; }
                    if (!this._isInternalResourceCreated) {
                        this._createInternalTextureImpl(cFillColor);
                        this._isInternalResourceCreated = true;
                        this.notifyCreated();
                        return true;
                    }

                    return false;
                };

                Texture.prototype.freeInternalTexture = function () {
                    if (this._isInternalResourceCreated) {
                        this.freeInternalTextureImpl();
                        this._isInternalResourceCreated = false;
                        this.notifyDestroyed();
                        return true;
                    }

                    return false;
                };

                Texture.prototype._createInternalTextureImpl = function (cFillColor) {
                    if (typeof cFillColor === "undefined") { cFillColor = null; }
                    return false;
                };

                Texture.prototype.freeInternalTextureImpl = function () {
                    return false;
                };

                Texture.prototype.setPixelRGBA = function (i1, i2, iTextureWidth, iTextureHeight, pBuffer) {
                    return;
                };
                return Texture;
            })(akra.pool.ResourcePoolItem);
            resources.Texture = Texture;
        })(pool.resources || (pool.resources = {}));
        var resources = pool.resources;
    })(akra.pool || (akra.pool = {}));
    var pool = akra.pool;
})(akra || (akra = {}));
//# sourceMappingURL=Texture.js.map
