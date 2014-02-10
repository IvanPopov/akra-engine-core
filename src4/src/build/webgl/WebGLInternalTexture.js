/// <reference path="../idl/IRenderer.ts" />
/// <reference path="../idl/IResourcePool.ts" />
/// <reference path="../idl/IColor.ts" />
/// <reference path="../idl/IPixelBuffer.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="../pool/resources/Texture.ts" />
    /// <reference path="../math/math.ts" />
    /// <reference path="webgl.ts" />
    /// <reference path="WebGLTextureBuffer.ts" />
    (function (webgl) {
        var WebGLInternalTexture = (function (_super) {
            __extends(WebGLInternalTexture, _super);
            function WebGLInternalTexture() {
                _super.call(this);
                this._pSurfaceList = null;
                this._pWebGLTexture = null;
            }
            WebGLInternalTexture.prototype.getWebGLTexture = function () {
                return this._pWebGLTexture;
            };

            WebGLInternalTexture.prototype._getWebGLTextureTarget = function () {
                switch (this._eTextureType) {
                    case 3553 /* TEXTURE_2D */:
                        return 3553 /* TEXTURE_2D */;
                    case 34067 /* TEXTURE_CUBE_MAP */:
                        return 34067 /* TEXTURE_CUBE_MAP */;
                    default:
                        return 0;
                }
            };

            WebGLInternalTexture.prototype._getWebGLTextureParameter = function (eParam) {
                switch (eParam) {
                    case 10240 /* MAG_FILTER */:
                        return 10240 /* TEXTURE_MAG_FILTER */;
                    case 10241 /* MIN_FILTER */:
                        return 10241 /* TEXTURE_MIN_FILTER */;
                    case 10242 /* WRAP_S */:
                        return 10242 /* TEXTURE_WRAP_S */;
                    case 10243 /* WRAP_T */:
                        return 10243 /* TEXTURE_WRAP_T */;
                    default:
                        return 0;
                }
            };

            WebGLInternalTexture.prototype._getWebGLTextureParameterValue = function (eValue) {
                switch (eValue) {
                    case 9728 /* NEAREST */:
                        return 9728 /* NEAREST */;
                    case 9729 /* LINEAR */:
                        return 9729 /* LINEAR */;
                    case 9984 /* NEAREST_MIPMAP_NEAREST */:
                        return 9984 /* NEAREST_MIPMAP_NEAREST */;
                    case 9985 /* LINEAR_MIPMAP_NEAREST */:
                        return 9985 /* LINEAR_MIPMAP_NEAREST */;
                    case 9986 /* NEAREST_MIPMAP_LINEAR */:
                        return 9986 /* NEAREST_MIPMAP_LINEAR */;
                    case 9987 /* LINEAR_MIPMAP_LINEAR */:
                        return 9987 /* LINEAR_MIPMAP_LINEAR */;

                    case 10497 /* REPEAT */:
                        return 10497 /* REPEAT */;
                    case 33071 /* CLAMP_TO_EDGE */:
                        return 33071 /* CLAMP_TO_EDGE */;
                    case 33648 /* MIRRORED_REPEAT */:
                        return 33648 /* MIRRORED_REPEAT */;
                    default:
                        return 0;
                }
            };

            WebGLInternalTexture.prototype._getAkraTextureParameterValue = function (iWebGLValue) {
                switch (iWebGLValue) {
                    case 9728 /* NEAREST */:
                        return 9728 /* NEAREST */;
                    case 9729 /* LINEAR */:
                        return 9729 /* LINEAR */;
                    case 9984 /* NEAREST_MIPMAP_NEAREST */:
                        return 9984 /* NEAREST_MIPMAP_NEAREST */;
                    case 9985 /* LINEAR_MIPMAP_NEAREST */:
                        return 9985 /* LINEAR_MIPMAP_NEAREST */;
                    case 9986 /* NEAREST_MIPMAP_LINEAR */:
                        return 9986 /* NEAREST_MIPMAP_LINEAR */;
                    case 9987 /* LINEAR_MIPMAP_LINEAR */:
                        return 9987 /* LINEAR_MIPMAP_LINEAR */;

                    case 10497 /* REPEAT */:
                        return 10497 /* REPEAT */;
                    case 33071 /* CLAMP_TO_EDGE */:
                        return 33071 /* CLAMP_TO_EDGE */;
                    case 33648 /* MIRRORED_REPEAT */:
                        return 33648 /* MIRRORED_REPEAT */;
                    default:
                        return 0;
                }
            };

            WebGLInternalTexture.prototype.reset = function (iWidth, iHeight) {
                if (typeof iWidth === "undefined") { iWidth = this._iWidth; }
                if (typeof iHeight === "undefined") { iHeight = iWidth; }
                _super.prototype.reset.call(this, iWidth, iHeight);

                for (var i = 0; i < this._pSurfaceList.length; i++) {
                    this._pSurfaceList[i].reset(iWidth, iHeight);
                }
            };

            WebGLInternalTexture.prototype._setFilterInternalTexture = function (eParam, eValue) {
                if (!this.isValid()) {
                    return false;
                }

                var iWebGLTarget = this._getWebGLTextureTarget();
                var pWebGLRenderer = this.getManager().getEngine().getRenderer();
                var pWebGLContext = pWebGLRenderer.getWebGLContext();
                pWebGLRenderer.bindWebGLTexture(iWebGLTarget, this._pWebGLTexture);
                pWebGLContext.texParameteri(iWebGLTarget, this._getWebGLTextureParameter(eParam), this._getWebGLTextureParameterValue(eValue));

                // var e = pWebGLContext.getError();if (e){LOG(this.findResourceName(), "filter: ", eParam, "value: ", eValue, "error: ", e)};
                return true;
            };
            WebGLInternalTexture.prototype._setWrapModeInternalTexture = function (eParam, eValue) {
                if (!this.isValid()) {
                    return false;
                }

                var iWebGLTarget = this._getWebGLTextureTarget();
                var pWebGLRenderer = this.getManager().getEngine().getRenderer();
                var pWebGLContext = pWebGLRenderer.getWebGLContext();
                pWebGLRenderer.bindWebGLTexture(iWebGLTarget, this._pWebGLTexture);
                pWebGLContext.texParameteri(iWebGLTarget, this._getWebGLTextureParameter(eParam), this._getWebGLTextureParameterValue(eValue));
                return true;
            };

            WebGLInternalTexture.prototype._getFilterInternalTexture = function (eParam) {
                if (!this.isValid()) {
                    return 0;
                }
                var iWebGLTarget = this._getWebGLTextureTarget();
                var pWebGLRenderer = this.getManager().getEngine().getRenderer();
                var pWebGLContext = pWebGLRenderer.getWebGLContext();
                pWebGLRenderer.bindWebGLTexture(iWebGLTarget, this._pWebGLTexture);
                return this._getAkraTextureParameterValue(pWebGLContext.getTexParameter(iWebGLTarget, this._getWebGLTextureParameter(eParam)));
            };

            WebGLInternalTexture.prototype._getWrapModeInternalTexture = function (eParam) {
                if (!this.isValid()) {
                    return 0;
                }
                var iWebGLTarget = this._getWebGLTextureTarget();
                var pWebGLRenderer = this.getManager().getEngine().getRenderer();
                var pWebGLContext = pWebGLRenderer.getWebGLContext();
                pWebGLRenderer.bindWebGLTexture(iWebGLTarget, this._pWebGLTexture);
                return this._getAkraTextureParameterValue(pWebGLContext.getTexParameter(iWebGLTarget, this._getWebGLTextureParameter(eParam)));
            };

            WebGLInternalTexture.prototype._createInternalTextureImpl = function (cFillColor) {
                if (typeof cFillColor === "undefined") { cFillColor = null; }
                if (!akra.isNull(cFillColor)) {
                    akra.logger.warn("Texture can create with filled only by default(black) color");
                    //TODO: must implement filling by color
                }

                var pWebGLRenderer = this.getManager().getEngine().getRenderer();

                var pWebGLContext = pWebGLRenderer.getWebGLContext();

                if (this._eTextureType == 3553 /* TEXTURE_2D */) {
                    if (this._iWidth > akra.webgl.maxTextureSize) {
                        akra.logger.warn("Заданная ширина не поддерживается(" + this._iWidth + ")");
                        this._iWidth = akra.webgl.maxTextureSize;
                    }
                    if (this._iHeight > akra.webgl.maxTextureSize) {
                        akra.logger.warn("Заданная высота не поддерживается(" + this._iHeight + ")");
                        this._iHeight = akra.webgl.maxTextureSize;
                    }
                } else if (this._eTextureType == 34067 /* TEXTURE_CUBE_MAP */) {
                    if (this._iWidth > akra.webgl.maxCubeMapTextureSize) {
                        akra.logger.warn("Заданная ширина не поддерживается(" + this._iWidth + ")");
                        this._iWidth = akra.webgl.maxCubeMapTextureSize;
                    }
                    if (this._iHeight > akra.webgl.maxCubeMapTextureSize) {
                        akra.logger.warn("Заданная высота не поддерживается(" + this._iHeight + ")");
                        this._iHeight = akra.webgl.maxCubeMapTextureSize;
                    }
                }

                if (this._iWidth == 0) {
                    akra.logger.warn("Заданная ширина не поддерживается(" + this._iWidth + ")");
                    this._iWidth = 1;
                }
                if (this._iHeight == 0) {
                    akra.logger.warn("Заданная высота не поддерживается(" + this._iHeight + ")");
                    this._iHeight = 1;
                }
                if (this._iDepth != 1) {
                    this._iDepth = 1;
                    akra.logger.warn("Трехмерные текстуры не поддерживаются, сброс глубины в 1");
                }
                if (this._nMipLevels != 0 && !akra.webgl.hasExtension(akra.webgl.EXT_TEXTURE_NPOT_2D_MIPMAP) && (!akra.math.isPowerOfTwo(this._iDepth) || !akra.math.isPowerOfTwo(this._iHeight) || !akra.math.isPowerOfTwo(this._iWidth))) {
                    akra.logger.warn("Мип мапы у текстуры не стпени двойки не поддерживаются, сброс мипмапов в 0");
                    this._nMipLevels = 0;
                    this._iFlags = akra.bf.clearAll(this._iFlags, 256 /* AUTOMIPMAP */);
                }

                if (!akra.webgl.isWebGLFormatSupport(this._eFormat)) {
                    akra.logger.warn("Данный тип текстуры не поддерживается: ", this._eFormat);
                    this._eFormat = 13 /* A8B8G8R8 */;
                }

                if (this._nMipLevels != 0 && this._nMipLevels !== akra.pool.resources.Img.getMaxMipmaps(this._iWidth, this._iHeight, this._iDepth, this._eFormat)) {
                    akra.logger.warn("Нехватает мипмапов, сброс в 0");
                    this._nMipLevels = 0;
                }

                // Convert to nearest power-of-two size if required
                //this._iWidth = math.ceilingPowerOfTwo(this._iWidth);
                //this._iHeight = math.ceilingPowerOfTwo(this._iHeight);
                //this._iDepth = math.ceilingPowerOfTwo(this._iDepth);
                var iWebGLTarget = this._getWebGLTextureTarget();

                this._pWebGLTexture = pWebGLRenderer.createWebGLTexture();

                pWebGLRenderer.bindWebGLTexture(iWebGLTarget, this._pWebGLTexture);

                this._isMipmapsHardwareGenerated = pWebGLRenderer.hasCapability(akra.ERenderCapabilities.AUTOMIPMAP);

                // Set some misc default parameters, these can of course be changed later
                var eMinFiler = this.getFilter(10241 /* MIN_FILTER */);
                var eMagFiler = this.getFilter(10240 /* MAG_FILTER */);

                if ((eMinFiler >= 9984 /* NEAREST_MIPMAP_NEAREST */ && eMinFiler <= 9987 /* LINEAR_MIPMAP_LINEAR */) && this._nMipLevels < 2) {
                    eMinFiler = 9729 /* LINEAR */;
                }

                if ((eMagFiler >= 9984 /* NEAREST_MIPMAP_NEAREST */ && eMagFiler <= 9987 /* LINEAR_MIPMAP_LINEAR */) && this._nMipLevels < 2) {
                    eMagFiler = 9729 /* LINEAR */;
                }

                // LOG("e: ", pWebGLContext.getError(), this.findResourceName(), "n mipmaps: ", this._nMipLevels, "size (x, y):", this._iWidth, this._iHeight, "min filer > ", "(0x", eMinFiler.toString(16), ")");
                this.setFilter(10241 /* MIN_FILTER */, eMinFiler);
                this.setFilter(10240 /* MAG_FILTER */, eMagFiler);
                this.setWrapMode(10242 /* WRAP_S */, this.getWrapMode(10242 /* WRAP_S */));
                this.setWrapMode(10243 /* WRAP_T */, this.getWrapMode(10243 /* WRAP_T */));

                pWebGLContext.texParameteri(iWebGLTarget, this._getWebGLTextureParameter(10241 /* MIN_FILTER */), eMinFiler);
                pWebGLContext.texParameteri(iWebGLTarget, this._getWebGLTextureParameter(10240 /* MAG_FILTER */), eMagFiler);
                pWebGLContext.texParameteri(iWebGLTarget, this._getWebGLTextureParameter(10242 /* WRAP_S */), this.getWrapMode(10242 /* WRAP_S */));
                pWebGLContext.texParameteri(iWebGLTarget, this._getWebGLTextureParameter(10243 /* WRAP_T */), this.getWrapMode(10243 /* WRAP_T */));

                var iWebGLFormat = akra.webgl.getWebGLFormat(this._eFormat);
                var iWebGLDataType = akra.webgl.getWebGLDataType(this._eFormat);
                var iWidth = this._iWidth;
                var iHeight = this._iHeight;
                var iDepth = this._iDepth;

                if (akra.pixelUtil.isCompressed(this._eFormat)) {
                    // Compressed formats
                    var iSize = akra.pixelUtil.getMemorySize(iWidth, iHeight, iDepth, this._eFormat);

                    // Provide temporary buffer filled with zeroes as glCompressedTexImageXD does not
                    // accept a 0 pointer like normal glTexImageXD
                    // Run through this process for every mipmap to pregenerate mipmap pyramid
                    var pTmpData = new Uint8Array(iSize);
                    var pEmptyData;
                    var mip = 0;

                    for (mip = 0; mip <= this._nMipLevels; mip++) {
                        iSize = akra.pixelUtil.getMemorySize(iWidth, iHeight, iDepth, this._eFormat);

                        //console.log(iSize,iWidth, iHeight, iDepth, this._eFormat);
                        pEmptyData = pTmpData.subarray(0, iSize);
                        switch (this._eTextureType) {
                            case 3553 /* TEXTURE_2D */:
                                pWebGLContext.compressedTexImage2D(3553 /* TEXTURE_2D */, mip, iWebGLFormat, iWidth, iHeight, 0, pEmptyData);
                                break;
                            case 34067 /* TEXTURE_CUBE_MAP */:
                                var iFace = 0;
                                for (iFace = 0; iFace < 6; iFace++) {
                                    pWebGLContext.compressedTexImage2D(34069 /* TEXTURE_CUBE_MAP_POSITIVE_X */ + iFace, mip, iWebGLFormat, iWidth, iHeight, 0, pEmptyData);
                                }
                                break;
                            default:
                                break;
                        }
                        ;
                        if (iWidth > 1)
                            iWidth = iWidth / 2;
                        if (iHeight > 1)
                            iHeight = iHeight / 2;
                        if (iDepth > 1)
                            iDepth = iDepth / 2;
                    }
                    pTmpData = null;
                    pEmptyData = null;
                } else {
                    var mip = 0;

                    for (mip = 0; mip <= this._nMipLevels; mip++) {
                        switch (this._eTextureType) {
                            case 3553 /* TEXTURE_2D */:
                                //console.log(mip,iWidth, iHeight);
                                pWebGLContext.texImage2D(3553 /* TEXTURE_2D */, mip, iWebGLFormat, iWidth, iHeight, 0, iWebGLFormat, iWebGLDataType, null);
                                break;
                            case 34067 /* TEXTURE_CUBE_MAP */:
                                var iFace = 0;
                                for (iFace = 0; iFace < 6; iFace++) {
                                    pWebGLContext.texImage2D(34069 /* TEXTURE_CUBE_MAP_POSITIVE_X */ + iFace, mip, iWebGLFormat, iWidth, iHeight, 0, iWebGLFormat, iWebGLDataType, null);
                                }
                                break;
                            default:
                                break;
                        }

                        if (iWidth > 1)
                            iWidth = iWidth >>> 1;
                        if (iHeight > 1)
                            iHeight = iHeight >>> 1;
                        if (iDepth > 1)
                            iDepth = iDepth >>> 1;
                    }
                }

                this._createSurfaceList();
                pWebGLRenderer.bindWebGLTexture(iWebGLTarget, null);

                return true;
            };

            WebGLInternalTexture.prototype.freeInternalTextureImpl = function () {
                var pWebGLRenderer = this.getManager().getEngine().getRenderer();
                var pWebGLContext = pWebGLRenderer.getWebGLContext();

                pWebGLRenderer.deleteWebGLTexture(this._pWebGLTexture);
                this._pWebGLTexture = null;

                for (var i = 0; i < this._pSurfaceList.length; i++) {
                    this._pSurfaceList[i].release();
                }

                this._pSurfaceList = null;

                return true;
            };

            WebGLInternalTexture.prototype._createSurfaceList = function () {
                this._pSurfaceList = new Array();

                // For all faces and mipmaps, store surfaces as IPixelBuffer
                var bWantGeneratedMips = akra.bf.testAny(this._iFlags, 256 /* AUTOMIPMAP */);

                // Do mipmapping in software? (uses GLU) For some cards, this is still needed. Of course,
                // only when mipmap generation is desired.
                var bDoSoftware = bWantGeneratedMips && !this._isMipmapsHardwareGenerated && this._nMipLevels !== 0;

                var iFace = 0;
                var mip = 0;
                var pTextureBufferPool = this.getManager().getTextureBufferPool();
                var sResourceName = this.findResourceName();

                for (iFace = 0; iFace < this.getNumFaces(); iFace++) {
                    var iWidth = this._iWidth;
                    var iHeight = this._iHeight;

                    for (mip = 0; mip <= this._nMipLevels; mip++) {
                        var pBuf = pTextureBufferPool.createResource(sResourceName + "_" + iFace + "_" + mip);

                        pBuf.create(this._getWebGLTextureTarget(), this._pWebGLTexture, iWidth, iHeight, akra.webgl.getClosestWebGLInternalFormat(this._eFormat), akra.webgl.getWebGLDataType(this._eFormat), iFace, mip, this._iFlags, bDoSoftware && mip === 0);

                        this._pSurfaceList.push(pBuf);

                        //check error
                        if (pBuf.getWidth() === 0 || pBuf.getHeight() === 0 || pBuf.getDepth() === 0) {
                            akra.logger.critical("Zero sized texture surface on texture " + sResourceName + " face " + iFace + " mipmap " + mip + ". The GL driver probably refused to create the texture.");
                        }
                    }
                }
            };

            WebGLInternalTexture.prototype.getBuffer = function (iFace, iMipmap) {
                if (typeof iFace === "undefined") { iFace = 0; }
                if (typeof iMipmap === "undefined") { iMipmap = 0; }
                if (iFace >= this.getNumFaces()) {
                    akra.logger.critical("Face index out of range", iFace, this.getNumFaces());
                }

                if (iMipmap > this._nMipLevels) {
                    akra.logger.critical("Mipmap index out of range", iMipmap, this._nMipLevels);
                }

                var idx = iFace * (this._nMipLevels + 1) + iMipmap;
                akra.logger.assert(idx < this._pSurfaceList.length, "smth " + this._pSurfaceList.length + " , " + iFace + " , " + this._nMipLevels + " , " + iMipmap);

                return this._pSurfaceList[idx];
            };

            WebGLInternalTexture.prototype.createRenderTexture = function () {
                // Create the GL texture
                // This already does everything necessary
                return this.createInternalTexture();
            };
            return WebGLInternalTexture;
        })(akra.pool.resources.Texture);
        webgl.WebGLInternalTexture = WebGLInternalTexture;
    })(akra.webgl || (akra.webgl = {}));
    var webgl = akra.webgl;
})(akra || (akra = {}));
//# sourceMappingURL=WebGLInternalTexture.js.map
