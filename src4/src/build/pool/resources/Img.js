/// <reference path="../../idl/IImg.ts" />
/// <reference path="../../idl/EPixelFormats.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (pool) {
        /// <reference path="../../io/io.ts" />
        /// <reference path="../../pixelUtil/ImgCodec.ts" />
        /// <reference path="../../pixelUtil/ImgData.ts" />
        /// <reference path="../../path/path.ts" />
        /// <reference path="../ResourcePoolItem.ts" />
        (function (resources) {
            var Codec = akra.pixelUtil.Codec;
            var ImgCodec = akra.pixelUtil.ImgCodec;
            var ImgData = akra.pixelUtil.ImgData;

            var Img = (function (_super) {
                __extends(Img, _super);
                function Img() {
                    _super.call(this);
                    this._iWidth = 0;
                    this._iHeight = 0;
                    this._iDepth = 0;
                    this._nMipMaps = 0;
                    this._iFlags = 0;
                    this._iCubeFlags = 0;
                    this._eFormat = 0 /* UNKNOWN */;
                    this._pBuffer = null;
                }
                Img.prototype.getByteLength = function () {
                    // console.log(__CALLSTACK__);
                    // console.log(this, this._pBuffer, this.isResourceLoaded(), "[", this.findResourceName(), "]");
                    return this._pBuffer.buffer.byteLength;
                };

                Img.prototype.getWidth = function () {
                    return this._iWidth;
                };

                Img.prototype.getHeight = function () {
                    return this._iHeight;
                };

                Img.prototype.getDepth = function () {
                    return this._iDepth;
                };

                Img.prototype.getNumFaces = function () {
                    if (this._iFlags & 2 /* CUBEMAP */) {
                        var nFace = 0;
                        for (var i = 0; i < 6; i++) {
                            if (this._iCubeFlags & (1 << i)) {
                                nFace++;
                            }
                        }
                        return nFace;
                    } else {
                        return 1;
                    }
                };

                Img.prototype.getNumMipMaps = function () {
                    return this._nMipMaps;
                };

                Img.prototype.getFormat = function () {
                    return this._eFormat;
                };

                Img.prototype.getFlags = function () {
                    return this._iFlags;
                };

                Img.prototype.getCubeFlags = function () {
                    return this._iCubeFlags;
                };

                Img.prototype.createResource = function () {
                    // innitialize the resource (called once)
                    akra.debug.assert(!this.isResourceCreated(), "The resource has already been created.");

                    // signal that the resource is now created,
                    // but has not been enabled
                    this.notifyCreated();
                    this.notifyDisabled();

                    return true;
                };

                Img.prototype.destroyResource = function () {
                    // destroy the resource
                    //
                    // we permit redundant calls to destroy, so there are no asserts here
                    //
                    if (this.isResourceCreated()) {
                        // disable the resource
                        this.disableResource();

                        this.freeMemory();

                        this.notifyUnloaded();
                        this.notifyDestroyed();

                        return (true);
                    }

                    return (false);
                };

                Img.prototype.restoreResource = function () {
                    akra.debug.assert(this.isResourceCreated(), "The resource has not been created.");

                    this.notifyRestored();
                    return true;
                };

                Img.prototype.disableResource = function () {
                    akra.debug.assert(this.isResourceCreated(), "The resource has not been created.");

                    this.notifyDisabled();
                    return true;
                };

                Img.prototype.loadResource = function (sFilename) {
                    return !akra.isNull(this.load(sFilename));
                };

                Img.prototype.saveResource = function (sFilename) {
                    return false;
                };

                Img.prototype.create = function (iWidth, iHeight, iDepth, eFormat, nFaces, nMipMaps) {
                    if (typeof iDepth === "undefined") { iDepth = 1; }
                    if (typeof eFormat === "undefined") { eFormat = 28 /* BYTE_RGBA */; }
                    if (typeof nFaces === "undefined") { nFaces = 1; }
                    if (typeof nMipMaps === "undefined") { nMipMaps = 0; }
                    var iSize = Img.calculateSize(nMipMaps, nFaces, iWidth, iHeight, iDepth, eFormat);
                    var pBuffer = new Uint8Array(iSize);
                    return this.loadDynamicImage(pBuffer, iWidth, iHeight, iDepth, eFormat, nFaces, nMipMaps);
                };

                Img.prototype.freeMemory = function () {
                    this._iWidth = 0;
                    this._iHeight = 0;
                    this._iDepth = 0;
                    this._pBuffer = null;
                };

                Img.prototype.set = function (pSrc) {
                    this.freeMemory();

                    this._iWidth = pSrc.getWidth();
                    this._iHeight = pSrc.getHeight();
                    this._iDepth = pSrc.getDepth();
                    this._eFormat = pSrc.getFormat();

                    this._iFlags = pSrc.getFlags();

                    this._nMipMaps = pSrc.getNumMipMaps();

                    this._pBuffer = new Uint8Array(pSrc.getData());

                    return this;
                };

                Img.prototype.flipY = function (pDest) {
                    return this;
                };

                Img.prototype.flipX = function (pDest) {
                    return this;
                };

                Img.prototype.load = function ( /*pData: any, sType?: any, fnCallBack?: Function*/ ) {
                    var pMe = this;

                    if (arguments[0] instanceof HTMLCanvasElement) {
                        var pCanvas = arguments[0];
                        var fnCallBack = arguments[1];

                        var pTempContext = pCanvas.getContext('2d');
                        if (!pTempContext) {
                            if (akra.isDefAndNotNull(fnCallBack)) {
                                fnCallBack(false);
                            }
                            return this;
                        }

                        var pImageData = pTempContext.getImageData(0, 0, pCanvas.width, pCanvas.height);

                        this.loadDynamicImage(new Uint8Array(pImageData.data.buffer.slice(0, pImageData.data.buffer.byteLength)), pCanvas.width, pCanvas.height);

                        if (akra.isDefAndNotNull(fnCallBack)) {
                            fnCallBack(true);
                        }
                        return this;
                    } else if (akra.isString(arguments[0])) {
                        var sFilename = arguments[0];
                        var fnCallBack = arguments[1];
                        var sExt = akra.path.parse(sFilename).getExt().toLowerCase();

                        if (sExt === "png" || sExt === "jpg" || sExt === "jpeg" || sExt === "gif" || sExt === "bmp") {
                            var pImg = new Image();

                            pImg.onload = function () {
                                var pTempCanvas = document.createElement("canvas");
                                pTempCanvas.width = pImg.width;
                                pTempCanvas.height = pImg.height;

                                var pTempContext = (pTempCanvas.getContext("2d"));
                                pTempContext.drawImage(pImg, 0, 0);

                                var pImageData = pTempContext.getImageData(0, 0, pImg.width, pImg.height);

                                pMe.loadDynamicImage(new Uint8Array(pImageData.data.buffer.slice(0, pImageData.data.buffer.byteLength)), pImg.width, pImg.height, 1, 28 /* BYTE_RGBA */);

                                if (akra.isDefAndNotNull(fnCallBack)) {
                                    fnCallBack(true);
                                }
                            };
                            pImg.onerror = function () {
                                if (akra.isDefAndNotNull(fnCallBack)) {
                                    fnCallBack(false);
                                }
                            };
                            pImg.onabort = function () {
                                if (akra.isDefAndNotNull(fnCallBack)) {
                                    fnCallBack(false);
                                }
                            };

                            pImg.src = sFilename;
                        } else {
                            akra.io.fopen(sFilename, "rb").read(function (pError, pDataInFile) {
                                pMe.load(new Uint8Array(pDataInFile), sExt, fnCallBack);
                            });
                        }

                        return this;
                    } else {
                        var pData = arguments[0];
                        var sType = arguments[1];
                        var fnCallBack = arguments[2];
                        var pCodec = null;

                        if (sType === "png" || sType === "jpg" || sType === "jpeg" || sType === "gif" || sType === "bmp") {
                            var pBlob = new Blob([pData], { 'type': 'image\/' + sType });
                            var pObjectURL = window.URL.createObjectURL(pBlob);

                            var pImg = new Image();

                            pImg.onload = function () {
                                var pTempCanvas = document.createElement("canvas");
                                pTempCanvas.width = pImg.width;
                                pTempCanvas.height = pImg.height;
                                var pTempContext = (pTempCanvas.getContext("2d"));
                                pTempContext.drawImage(pImg, 0, 0);
                                var pImageData = pTempContext.getImageData(0, 0, pImg.width, pImg.height);

                                pMe.loadDynamicImage(new Uint8Array(pImageData.data.buffer.slice(0, pImageData.data.buffer.byteLength)), pImg.width, pImg.height, 1, 28 /* BYTE_RGBA */);

                                if (akra.isDefAndNotNull(fnCallBack)) {
                                    fnCallBack(true);
                                }
                            };
                            pImg.onerror = function () {
                                if (akra.isDefAndNotNull(fnCallBack)) {
                                    fnCallBack(false);
                                }
                            };
                            pImg.onabort = function () {
                                if (akra.isDefAndNotNull(fnCallBack)) {
                                    fnCallBack(false);
                                }
                            };

                            pImg.src = pObjectURL;
                            return this;
                        }

                        if (sType) {
                            pCodec = Codec.getCodec(sType);
                        }

                        if (!pCodec) {
                            var iMagicLen = Math.min(32, pData.byteLength);
                            pCodec = Codec.getCodec(pData.subarray(pData.byteOffset, iMagicLen));
                        }

                        if (!pCodec) {
                            akra.logger.critical("Unable to load image: Image format is unknown. Unable to identify codec. Check it or specify format explicitly.\n" + "Img.load");
                            if (fnCallBack) {
                                fnCallBack(false);
                            }
                            return this;
                        }

                        var pImgData = new ImgData();

                        this._pBuffer = pCodec.decode(pData, pImgData);

                        this._iWidth = pImgData.getWidth();
                        this._iHeight = pImgData.getHeight();
                        this._iDepth = pImgData.getDepth();
                        this._nMipMaps = pImgData.getNumMipMaps();
                        this._iFlags = pImgData.getFlags();
                        this._iCubeFlags = pImgData.getCubeFlags();

                        //console.log(this._iCubeFlags.toString(16),this._iFlags.toString(16));
                        this._eFormat = pImgData.getFormat();

                        this.notifyLoaded();

                        if (fnCallBack) {
                            fnCallBack(true);
                        }

                        return this;
                    }
                };

                Img.prototype.loadRawData = function (pData, iWidth, iHeight, iDepth, eFormat, nFaces, nMipMaps) {
                    if (typeof iDepth === "undefined") { iDepth = 1; }
                    if (typeof eFormat === "undefined") { eFormat = 10 /* BYTE_RGB */; }
                    if (typeof nFaces === "undefined") { nFaces = 1; }
                    if (typeof nMipMaps === "undefined") { nMipMaps = 0; }
                    var iSize = Img.calculateSize(nMipMaps, nFaces, iWidth, iHeight, iDepth, eFormat);

                    if (iSize != pData.buffer.byteLength) {
                        akra.logger.critical("Stream size does not match calculated image size\n" + "Img.loadRawData");
                    }

                    var pBuffer = new Uint8Array(iSize);

                    pBuffer.set(pData);

                    return this.loadDynamicImage(pBuffer, iWidth, iHeight, iDepth, eFormat, nFaces, nMipMaps);
                };

                Img.prototype.loadDynamicImage = function (pData, iWidth, iHeight, iDepth, eFormat, nFaces, nMipMaps) {
                    if (typeof iDepth === "undefined") { iDepth = 1; }
                    if (typeof eFormat === "undefined") { eFormat = 10 /* BYTE_RGB */; }
                    if (typeof nFaces === "undefined") { nFaces = 1; }
                    if (typeof nMipMaps === "undefined") { nMipMaps = 0; }
                    //size
                    this._iWidth = iWidth;
                    this._iHeight = iHeight;
                    this._iDepth = iDepth;

                    this._eFormat = eFormat;
                    this._nMipMaps = nMipMaps;
                    this._iFlags = 0;

                    if (akra.pixelUtil.isCompressed(this._eFormat)) {
                        this._iFlags |= 1 /* COMPRESSED */;
                    }
                    if (this._iDepth != 1) {
                        this._iFlags |= 4 /* TEXTURE_3D */;
                    }

                    if (nFaces == 6) {
                        this._iFlags |= 2 /* CUBEMAP */;
                    }

                    if (nFaces != 6 && nFaces != 1) {
                        akra.logger.critical("Number of faces currently must be 6 or 1.\n" + "Img.loadDynamicImage");
                    }

                    this._pBuffer = pData;
                    this.notifyLoaded();
                    return this;
                };

                Img.prototype.convert = function (eFormat) {
                    return false;
                };

                //Gets the physical width in bytes of each row of pixels.
                Img.prototype.getRawSpan = function () {
                    return this._iWidth * this.getPixelSize();
                };

                Img.prototype.getBPP = function () {
                    return this.getPixelSize() * 8;
                };

                Img.prototype.getPixelSize = function () {
                    return akra.pixelUtil.getNumElemBytes(this._eFormat);
                };

                Img.prototype.getData = function () {
                    return this._pBuffer;
                };

                Img.prototype.hasFlag = function (eFlag) {
                    if (this._iFlags & eFlag) {
                        return true;
                    } else {
                        return false;
                    }
                };

                Img.prototype.hasAlpha = function () {
                    return akra.pixelUtil.hasAlpha(this._eFormat);
                };

                Img.prototype.isCompressed = function () {
                    return akra.pixelUtil.isCompressed(this._eFormat);
                };

                Img.prototype.isLuminance = function () {
                    return akra.pixelUtil.isLuminance(this._eFormat);
                };

                Img.prototype.getColorAt = function (pColor, x, y, z) {
                    if (typeof z === "undefined") { z = 0; }
                    var iStart = this.getPixelSize() * (z * this._iWidth * this._iHeight + this._iWidth * y + x);
                    akra.pixelUtil.unpackColour(pColor, this._eFormat, this._pBuffer.subarray(iStart, iStart + this.getPixelSize()));
                    return pColor;
                };

                Img.prototype.setColorAt = function (pColor, x, y, z) {
                    if (typeof z === "undefined") { z = 0; }
                    var iStart = this.getPixelSize() * (z * this._iWidth * this._iHeight + this._iWidth * y + x);
                    akra.pixelUtil.packColour(pColor, this._eFormat, this._pBuffer.subarray(iStart, iStart + this.getPixelSize()));
                };

                Img.prototype.getPixels = function (iFace, iMipMap) {
                    // Image data is arranged as:
                    // face 0, top level (mip 0)
                    // face 0, mip 1
                    // face 0, mip 2
                    // face 1, top level (mip 0)
                    // face 1, mip 1
                    // face 1, mip 2
                    // etc
                    if (iMipMap > this.getNumMipMaps()) {
                        akra.logger.warn("Mipmap index out of range", iMipMap, this.getNumMipMaps());
                        return null;
                    }

                    if (iFace >= this.getNumFaces()) {
                        akra.logger.warn("Face index out of range", iFace, this.getNumFaces());
                        return null;
                    }

                    // Calculate mipmap offset and size
                    var pData = this.getData();

                    // Base offset is number of full faces
                    var iWidth = this._iWidth;
                    var iHeight = this._iHeight;
                    var iDepth = this._iDepth;

                    // Figure out the offsets
                    var iFullFaceSize = 0;
                    var iFinalFaceSize = 0;
                    var iFinalWidth = 0;
                    var iFinalHeight = 0;
                    var iFinalDepth = 0;
                    var iMipSize = 0;
                    var iOffset = 0;

                    for (var iMip = 0; iMip <= this.getNumMipMaps(); ++iMip) {
                        if (iMip == iMipMap) {
                            iFinalFaceSize = iFullFaceSize;
                            iFinalWidth = iWidth;
                            iFinalHeight = iHeight;
                            iFinalDepth = iDepth;
                            iMipSize = akra.pixelUtil.getMemorySize(iWidth, iHeight, iDepth, this.getFormat());
                        }
                        iFullFaceSize += akra.pixelUtil.getMemorySize(iWidth, iHeight, iDepth, this.getFormat());

                        /// Half size in each dimension
                        if (iWidth != 1)
                            iWidth /= 2;
                        if (iHeight != 1)
                            iHeight /= 2;
                        if (iDepth != 1)
                            iDepth /= 2;
                    }

                    // Advance pointer by number of full faces, plus mip offset into
                    iOffset += iFace * iFullFaceSize;
                    iOffset += iFinalFaceSize;

                    // Return subface as pixelbox
                    var pSrc = new akra.pixelUtil.PixelBox(iFinalWidth, iFinalHeight, iFinalDepth, this.getFormat(), pData.subarray(iOffset, iOffset + iMipSize));
                    return pSrc;
                };

                Img.prototype.scale = function (pDest, eFilter) {
                    return null;
                };

                Img.prototype.resize = function (iWidth, iHeight, eFilter) {
                    return null;
                };

                Img.prototype.generatePerlinNoise = function (fScale, iOctaves, fFalloff) {
                };

                Img.prototype.randomChannelNoise = function (iChannel, iMinRange, iMaxRange) {
                };

                Img.calculateSize = function (nMipMaps, nFaces, iWidth, iHeight, iDepth, eFormat) {
                    var iSize = 0;
                    var iMip = 0;

                    for (iMip = 0; iMip <= nMipMaps; iMip++) {
                        iSize += akra.pixelUtil.getMemorySize(iWidth, iHeight, iDepth, eFormat) * nFaces;
                        if (iWidth != 1)
                            iWidth = Math.floor(iWidth / 2);
                        if (iHeight != 1)
                            iHeight = Math.floor(iHeight / 2);
                        if (iDepth != 1)
                            iDepth = Math.floor(iDepth / 2);
                    }
                    return iSize;
                };

                Img.getMaxMipmaps = function (iWidth, iHeight, iDepth, eFormat) {
                    var iCount = 0;
                    if ((iWidth > 0) && (iHeight > 0)) {
                        do {
                            if (iWidth > 1) {
                                iWidth = iWidth >>> 1;
                            }
                            if (iHeight > 1) {
                                iHeight = iHeight >>> 1;
                            }
                            if (iDepth > 1) {
                                iDepth = iDepth >>> 1;
                            }

                            /*
                            NOT needed, compressed formats will have mipmaps up to 1x1
                            if(PixelUtil::isValidExtent(width, height, depth, format))
                            count ++;
                            else
                            break;
                            */
                            iCount++;
                        } while(!(iWidth === 1 && iHeight === 1 && iDepth === 1));
                    }
                    return iCount;
                };
                return Img;
            })(akra.pool.ResourcePoolItem);
            resources.Img = Img;
        })(pool.resources || (pool.resources = {}));
        var resources = pool.resources;
    })(akra.pool || (akra.pool = {}));
    var pool = akra.pool;
})(akra || (akra = {}));
//# sourceMappingURL=Img.js.map
