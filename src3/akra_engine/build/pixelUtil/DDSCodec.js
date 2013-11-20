/// <reference path="../idl/AIColor.ts" />
/// <reference path="../idl/AIDDSCodec.ts" />
/// <reference path="../idl/AIImgCodec.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "pixelUtil/Codec", "logger", "pixelUtil/ImgCodec", "pixelUtil", "resources/Img"], function(require, exports, __Codec__, __logger__, __ImgCodec__, __pixelUtil__, __Img__) {
    var Codec = __Codec__;
    var logger = __logger__;
    var ImgCodec = __ImgCodec__;
    var pixelUtil = __pixelUtil__;
    var Img = "resources/Img";

    /** @const */
    var DDS_MAGIC = 0x20534444;

    //  DDS_header.dwFlags
    /** @const */
    var DDSD_CAPS = 0x00000001;

    /** @const */
    var DDSD_HEIGHT = 0x00000002;

    /** @const */
    var DDSD_WIDTH = 0x00000004;

    /** @const */
    var DDSD_PITCH = 0x00000008;

    /** @const */
    var DDSD_PIXELFORMAT = 0x00001000;

    /** @const */
    var DDSD_MIPMAPCOUNT = 0x00020000;

    /** @const */
    var DDSD_LINEARSIZE = 0x00080000;

    /** @const */
    var DDSD_DEPTH = 0x00800000;

    //  DDS_header.ddspf.dwFlags
    /** @const */
    var DDPF_ALPHAPIXELS = 0x00000001;

    /** @const */
    var DDPF_ALPHA = 0x00000002;

    /** @const */
    var DDPF_FOURCC = 0x00000004;

    /** @const */
    var DDPF_PALETTEINDEXED4 = 0x00000008;

    /** @const */
    var DDPF_PALETTEINDEXEDTO8 = 0x00000010;

    /** @const */
    var DDPF_PALETTEINDEXED8 = 0x00000020;

    /** @const */
    var DDPF_RGB = 0x00000040;

    /** @const */
    var DDPF_COMPRESSED = 0x00000080;

    /** @const */
    var DDPF_RGBTOYUV = 0x00000100;

    /** @const */
    var DDPF_YUV = 0x00000200;

    /** @const */
    var DDPF_ZBUFFER = 0x00000400;

    /** @const */
    var DDPF_PALETTEINDEXED1 = 0x00000800;

    /** @const */
    var DDPF_PALETTEINDEXED2 = 0x00001000;

    /** @const */
    var DDPF_ZPIXELS = 0x00002000;

    /** @const */
    var DDPF_STENCILBUFFER = 0x00004000;

    /** @const */
    var DDPF_ALPHAPREMULT = 0x00008000;

    /** @const */
    var DDPF_LUMINANCE = 0x00020000;

    /** @const */
    var DDPF_BUMPLUMINANCE = 0x00040000;

    /** @const */
    var DDPF_BUMPDUDV = 0x00080000;

    //  DDS_header.dwCaps2
    /** @const */
    var DDSCAPS2_CUBEMAP = 0x200;

    /** @const */
    var DDSCAPS2_CUBEMAP_POSITIVEX = 0x400;

    /** @const */
    var DDSCAPS2_CUBEMAP_NEGATIVEX = 0x800;

    /** @const */
    var DDSCAPS2_CUBEMAP_POSITIVEY = 0x1000;

    /** @const */
    var DDSCAPS2_CUBEMAP_NEGATIVEY = 0x2000;

    /** @const */
    var DDSCAPS2_CUBEMAP_POSITIVEZ = 0x4000;

    /** @const */
    var DDSCAPS2_CUBEMAP_NEGATIVEZ = 0x8000;

    /** @const */
    var DDSCAPS2_VOLUME = 0x200000;

    //DDS_header10.dwMiscFlag
    /** @const */
    var RESOURCE_MISC_GENERATE_MIPS = 0x1;

    /** @const */
    var RESOURCE_MISC_SHARED = 0x2;

    /** @const */
    var RESOURCE_MISC_TEXTURECUBE = 0x4;

    /** @const */
    var RESOURCE_MISC_DRAWINDIRECT_ARGS = 0x10;

    /** @const */
    var RESOURCE_MISC_BUFFER_ALLOW_RAW_VIEWS = 0x20;

    /** @const */
    var RESOURCE_MISC_BUFFER_STRUCTURED = 0x40;

    /** @const */
    var RESOURCE_MISC_RESOURCE_CLAMP = 0x80;

    /** @const */
    var RESOURCE_MISC_SHARED_KEYEDMUTEX = 0x100;

    /** @const */
    var RESOURCE_MISC_GDI_COMPATIBLE = 0x200;

    /** @const */
    var RESOURCE_MISC_SHARED_NTHANDLE = 0x800;

    /** @const */
    var RESOURCE_MISC_RESTRICTED_CONTENT = 0x1000;

    /** @const */
    var RESOURCE_MISC_RESTRICT_SHARED_RESOURCE = 0x2000;

    /** @const */
    var RESOURCE_MISC_RESTRICT_SHARED_RESOURCE_DRIVER = 0x4000;

    /** @const */
    var DDS_FOURCC = DDPF_FOURCC;

    /** @const */
    var DDS_RGB = DDPF_RGB;

    /** @const */
    var DDS_RGBA = DDPF_RGB | DDPF_ALPHAPIXELS;

    //  DD_Sheader.ddspf.dwFourCC
    /** @const */
    var D3DFMT_DX10 = 0x30315844;

    /** @const */
    var D3DFMT_DXT1 = 0x31545844;

    /** @const */
    var D3DFMT_DXT2 = 0x32545844;

    /** @const */
    var D3DFMT_DXT3 = 0x33545844;

    /** @const */
    var D3DFMT_DXT4 = 0x34545844;

    /** @const */
    var D3DFMT_DXT5 = 0x35545844;

    /** @const */
    var D3DFMT_R8G8_B8G8 = 0x47424752;

    /** @const */
    var D3DFMT_G8R8_G8B8 = 0x42475247;

    /** @const */
    var D3DFMT_A16B16G16R16 = 0x00000024;

    /** @const */
    var D3DFMT_Q16W16V16U16 = 0x0000006E;

    /** @const */
    var D3DFMT_R16F = 0x0000006F;

    /** @const */
    var D3DFMT_G16R16F = 0x00000070;

    /** @const */
    var D3DFMT_A16B16G16R16F = 0x00000071;

    /** @const */
    var D3DFMT_R32F = 0x00000072;

    /** @const */
    var D3DFMT_G32R32F = 0x00000073;

    /** @const */
    var D3DFMT_A32B32G32R32F = 0x00000074;

    /** @const */
    var D3DFMT_UYVY = 0x59565955;

    /** @const */
    var D3DFMT_YUY2 = 0x32595559;

    /** @const */
    var D3DFMT_CxV8U8 = 0x00000075;

    var DDSCodec = (function (_super) {
        __extends(DDSCodec, _super);
        function DDSCodec() {
            _super.apply(this, arguments);
            this._sType = "dds";
        }
        DDSCodec.prototype.magicNumberToFileExt = function (pMagicNumber) {
            var dwMagic4 = (new Uint32Array(pMagicNumber.buffer, 0, 1))[0];
            if (DDS_MAGIC == dwMagic4) {
                return "dds";
            }

            return null;
        };

        DDSCodec.startup = /// Static method to startup and register the DDS codec
        function () {
            if (!isDefAndNotNull(this._pInstance)) {
                logger.log("DDS codec registering ...");
                this._pInstance = new DDSCodec();
                Codec.registerCodec(this._pInstance);
            }
        };

        DDSCodec.shutdown = /// Static method to shutdown and unregister the DDS codec
        function () {
            if (isDef(this._pInstance)) {
                Codec.unRegisterCodec(this._pInstance);
                this._pInstance = undefined;
            }
        };

        DDSCodec.prototype.getType = function () {
            return this._sType;
        };

        DDSCodec.prototype.decode = function (pData, pImgData) {
            var iOffset = 0;
            var dwMagic4 = (new Uint32Array(pData.buffer, pData.byteOffset, 1))[0];

            if (dwMagic4 !== DDS_MAGIC) {
                logger.critical("This is not a DDS file! DDSCodec.decode");
            }

            //Считываем dds header
            /*typedef struct {
            DWORD		   dwSize;
            DWORD		   dwFlags;
            DWORD		   dwHeight;
            DWORD		   dwWidth;
            DWORD		   dwPitchOrLinearSize;
            DWORD		   dwDepth;
            DWORD		   dwMipMapCount;
            DWORD		   dwReserved1[11];
            DDS_PIXELFORMAT ddspf;
            DWORD		   dwCaps;
            DWORD		   dwCaps2;
            DWORD		   dwCaps3;
            DWORD		   dwCaps4;
            DWORD		   dwReserved2;
            } DDS_HEADER;*/
            var pDDSHeader = new Uint32Array(pData.buffer, pData.byteOffset + 4, 31);

            var pHeader = {};

            pHeader.dwSize = pDDSHeader[0];
            pHeader.dwFlags = pDDSHeader[1];
            pHeader.dwHeight = pDDSHeader[2];
            pHeader.dwWidth = pDDSHeader[3];
            pHeader.dwPitchOrLinearSize = pDDSHeader[4];
            pHeader.dwDepth = pDDSHeader[5];
            pHeader.dwMipMapCount = pDDSHeader[6];
            pHeader.dwReserved1 = [];
            pHeader.dwReserved1[0] = pDDSHeader[7];
            pHeader.dwReserved1[1] = pDDSHeader[8];
            pHeader.dwReserved1[2] = pDDSHeader[9];
            pHeader.dwReserved1[3] = pDDSHeader[10];
            pHeader.dwReserved1[4] = pDDSHeader[11];
            pHeader.dwReserved1[5] = pDDSHeader[12];
            pHeader.dwReserved1[6] = pDDSHeader[13];
            pHeader.dwReserved1[7] = pDDSHeader[14];
            pHeader.dwReserved1[8] = pDDSHeader[15];
            pHeader.dwReserved1[9] = pDDSHeader[16];
            pHeader.dwReserved1[10] = pDDSHeader[17];

            /*struct DDS_PIXELFORMAT {
            DWORD dwSize;
            DWORD dwFlags;
            DWORD dwFourCC;
            DWORD dwRGBBitCount;
            DWORD dwRBitMask;
            DWORD dwGBitMask;
            DWORD dwBBitMask;
            DWORD dwABitMask;
            };*/
            pHeader.ddspf = {};
            pHeader.ddspf.dwSize = pDDSHeader[18];
            pHeader.ddspf.dwFlags = pDDSHeader[19];
            pHeader.ddspf.dwFourCC = pDDSHeader[20];
            pHeader.ddspf.dwRGBBitCount = pDDSHeader[21];
            pHeader.ddspf.dwRBitMask = pDDSHeader[22];
            pHeader.ddspf.dwGBitMask = pDDSHeader[23];
            pHeader.ddspf.dwBBitMask = pDDSHeader[24];
            pHeader.ddspf.dwABitMask = pDDSHeader[25];
            pHeader.dwCaps = pDDSHeader[26];
            pHeader.dwCaps2 = pDDSHeader[27];
            pHeader.dwCaps3 = pDDSHeader[28];
            pHeader.dwCaps4 = pDDSHeader[29];
            pHeader.dwReserved2 = pDDSHeader[30];
            iOffset += 128;
            if (pHeader.dwSize != 124) {
                logger.error("Размер заголовка DDS всегда должэен равняться 124");
            }
            if (pHeader.ddspf.dwSize != 32) {
                logger.error("Размер DDS_PIXELFORMAT всегда должен равняться 32");
            }
            if (!(pHeader.dwFlags & DDSD_CAPS)) {
                logger.error("Флаг DDSD_CAPS в заголовке DDS всегда должен быть");
            }
            if (!(pHeader.dwFlags & DDSD_HEIGHT)) {
                logger.error("Флаг DDSD_HEIGHT в заголовке DDS всегда должен быть");
            }
            if (!(pHeader.dwFlags & DDSD_WIDTH)) {
                logger.error("Флаг DDSD_WIDTH в заголовке DDS всегда должен быть");
            }
            if (!(pHeader.dwFlags & DDSD_PIXELFORMAT)) {
                logger.error("Флаг DDSD_PIXELFORMAT в заголовке DDS всегда должен быть");
            }

            pImgData.width = pHeader.dwWidth;
            pImgData.height = pHeader.dwHeight;
            pImgData.depth = 1;
            var nFace = 1;

            pImgData.flags = 0;

            if (pHeader.dwCaps2 & DDSCAPS2_CUBEMAP) {
                pImgData.flags |= 2 /* CUBEMAP */;
                nFace = 0;
                if (pHeader.dwCaps2 & DDSCAPS2_CUBEMAP_POSITIVEX) {
                    nFace++;
                    pImgData.cubeFlags |= 1 /* POSITIVE_X */;
                }
                if (pHeader.dwCaps2 & DDSCAPS2_CUBEMAP_NEGATIVEX) {
                    nFace++;
                    pImgData.cubeFlags |= 2 /* NEGATIVE_X */;
                }
                if (pHeader.dwCaps2 & DDSCAPS2_CUBEMAP_POSITIVEY) {
                    nFace++;
                    pImgData.cubeFlags |= 4 /* POSITIVE_Y */;
                }
                if (pHeader.dwCaps2 & DDSCAPS2_CUBEMAP_NEGATIVEY) {
                    nFace++;
                    pImgData.cubeFlags |= 8 /* NEGATIVE_Y */;
                }
                if (pHeader.dwCaps2 & DDSCAPS2_CUBEMAP_POSITIVEZ) {
                    nFace++;
                    pImgData.cubeFlags |= 16 /* POSITIVE_Z */;
                }
                if (pHeader.dwCaps2 & DDSCAPS2_CUBEMAP_NEGATIVEZ) {
                    nFace++;
                    pImgData.cubeFlags |= 32 /* NEGATIVE_Z */;
                }

                if (nFace == 0) {
                    logger.warn("Выставлен фдлаг с кубической текстурой, а самих текстур нету");
                }
            }

            if (pHeader.dwCaps2 & DDSCAPS2_VOLUME) {
                pImgData.flags |= 4 /* TEXTURE_3D */;
                pImgData.depth = pHeader.dwDepth;
            }

            var eSourceFormat = 0 /* UNKNOWN */;

            if (pHeader.ddspf.dwFlags & DDPF_FOURCC) {
                if (pHeader.ddspf.dwFourCC == D3DFMT_DXT1) {
                    eSourceFormat = 17 /* DXT1 */;
                } else if (pHeader.ddspf.dwFourCC == D3DFMT_DXT2) {
                    eSourceFormat = 17 /* DXT1 */;
                } else if (pHeader.ddspf.dwFourCC == D3DFMT_DXT3) {
                    eSourceFormat = 19 /* DXT3 */;
                } else if (pHeader.ddspf.dwFourCC == D3DFMT_DXT4) {
                    eSourceFormat = 20 /* DXT4 */;
                } else if (pHeader.ddspf.dwFourCC == D3DFMT_DXT5) {
                    eSourceFormat = 21 /* DXT5 */;
                } else if (pHeader.ddspf.dwFourCC == D3DFMT_DX10) {
                    var pDDS10Header = new Uint32Array(pData.buffer, pData.byteOffset + 128, 5);
                    var header10 = {};
                    header10.dxgiFormat = pDDS10Header[0];
                    header10.resourceDimension = pDDS10Header[1];
                    header10.miscFlag = pDDS10Header[2];
                    header10.arraySize = pDDS10Header[3];
                    header10.reserved = pDDS10Header[4];

                    logger.critical("Формат D3DFMT_DX10 не поддерживается");

                    /*console.log("dxgiFormat",header10.dxgiFormat);
                    console.log("resourceDimension",header10.resourceDimension);
                    nCubeMap=1;
                    if(header10.miscFlag&RESOURCE_MISC_TEXTURECUBE)
                    {
                    nCubeMap=header10.arraySize;
                    }
                    
                    if(nCubeMap!=6)
                    {
                    warning("Количество частей кубической текстуру не равно 6",nCubeMap);
                    }*/
                    iOffset += 20;
                } else if (pHeader.ddspf.dwFourCC == D3DFMT_R16F) {
                    eSourceFormat = 32 /* FLOAT16_R */;
                } else if (pHeader.ddspf.dwFourCC == D3DFMT_G16R16F) {
                    eSourceFormat = 35 /* FLOAT16_GR */;
                } else if (pHeader.ddspf.dwFourCC == D3DFMT_A16B16G16R16F) {
                    eSourceFormat = 23 /* FLOAT16_RGBA */;
                } else if (pHeader.ddspf.dwFourCC == D3DFMT_R32F) {
                    eSourceFormat = 33 /* FLOAT32_R */;
                } else if (pHeader.ddspf.dwFourCC == D3DFMT_G32R32F) {
                    eSourceFormat = 36 /* FLOAT32_GR */;
                } else if (pHeader.ddspf.dwFourCC == D3DFMT_A32B32G32R32F) {
                    eSourceFormat = 25 /* FLOAT32_RGBA */;
                } else {
                    logger.critical("Флаг DDPF_FOURCC стоит, а подходящего dwFourCC нет");
                }
            } else {
                var iAMask = pHeader.ddspf.dwFlags & DDPF_ALPHAPIXELS ? pHeader.ddspf.dwABitMask : 0;
                var ePF;
                for (ePF = 0 /* UNKNOWN */ + 1; ePF < 48 /* TOTAL */; ePF++) {
                    if ((!!(pHeader.ddspf.dwFlags & DDPF_LUMINANCE)) != pixelUtil.isLuminance(ePF)) {
                        continue;
                    }
                    if ((!!(pHeader.ddspf.dwFlags & DDPF_ALPHAPIXELS)) != pixelUtil.hasAlpha(ePF)) {
                        continue;
                    }

                    if (pixelUtil.getNumElemBits(ePF) == pHeader.ddspf.dwRGBBitCount) {
                        var pTestMasks = pixelUtil.getBitMasks(ePF);
                        var pTestBits = pixelUtil.getBitDepths(ePF);

                        if (pTestMasks[0] == pHeader.ddspf.dwRBitMask && pTestMasks[1] == pHeader.ddspf.dwGBitMask && pTestMasks[2] == pHeader.ddspf.dwBBitMask && (pTestMasks[3] == iAMask || (iAMask == 0 && pTestBits[3] == 0))) {
                            break;
                        }
                    }
                }

                if (ePF == 48 /* TOTAL */) {
                    logger.critical("Cannot determine pixel format. DDSCodec.decode");
                } else {
                    eSourceFormat = ePF;
                }
            }

            /*if (pixelUtil.isCompressed(eSourceFormat))
            {
            pImgData.flags |= AEImageFlags.COMPRESSED;
            if (!(pHeader.dwFlags & DDSD_LINEARSIZE)) {
            logger.critical("У сжатой текстуры не выставлен флаг DDS_HEADER_FLAGS_LINEARSIZE в заголовке");
            }
            }
            else
            {
            if (pHeader.dwFlags & DDSD_LINEARSIZE) {
            logger.critical("У несжатой текстуры выставлен флаг DDS_HEADER_FLAGS_LINEARSIZE в заголовке");
            }
            }*/
            pImgData.format = eSourceFormat;

            if (pHeader.dwFlags & DDSD_MIPMAPCOUNT) {
                pImgData.numMipMaps = pHeader.dwMipMapCount - 1;
                if (pImgData.numMipMaps != Img.getMaxMipmaps(pImgData.width, pImgData.height, pImgData.depth, pImgData.format)) {
                    logger.warn("Number of mipmaps are not to degrease image size to 1x1 " + pHeader.dwMipMapCount + "," + pHeader.dwWidth + "x" + pHeader.dwHeight + ")");
                }
            } else {
                pImgData.numMipMaps = 0;
            }

            var pOutput = new Uint8Array(pImgData.size);
            var iOutputOffset = 0;

            for (var i = 0; i < nFace; i++) {
                var iWidth = pImgData.width;
                var iHeight = pImgData.height;
                var iDepth = pImgData.depth;

                for (var iMip = 0; iMip <= pImgData.numMipMaps; iMip++) {
                    if (pixelUtil.isCompressed(pImgData.format)) {
                        var iDXTSize = pixelUtil.getMemorySize(iWidth, iHeight, iDepth, pImgData.format);
                        for (var a = 0; a < iDXTSize; a++) {
                            pOutput[a + iOutputOffset] = pData[iOffset + a];
                        }
                        iOffset += iDXTSize;
                        iOutputOffset += iDXTSize;
                    } else {
                        var iDstPitch = iWidth * pixelUtil.getNumElemBytes(pImgData.format);
                        var iSrcPitch = 0;
                        if (pHeader.dwFlags & DDSD_PITCH) {
                            iSrcPitch = pHeader.dwPitchOrLinearSize / Math.max(1, iMip * 2);
                        } else {
                            // assume same as final pitch
                            iSrcPitch = iDstPitch;
                        }
                        if (iSrcPitch < iDstPitch) {
                            logger.warn("Странный размер питча у картинки");
                        }

                        for (var z = 0; z < pImgData.depth; z++) {
                            for (var y = 0; y < pImgData.height; y++) {
                                for (var a = 0; a < iDstPitch; a++) {
                                    pOutput[a + iOutputOffset] = pData[iOffset + a];
                                }
                                iOutputOffset = iOutputOffset + iDstPitch;
                                iOffset = iOffset + iSrcPitch;
                            }
                        }
                    }
                    if (iWidth != 1) {
                        iWidth = Math.floor(iWidth / 2);
                    }
                    if (iHeight != 1) {
                        iHeight = Math.floor(iHeight / 2);
                    }
                    if (iDepth != 1) {
                        iDepth = Math.floor(iDepth / 2);
                    }
                }
            }
            return pOutput;
        };
        DDSCodec._pInstance = null;
        return DDSCodec;
    })(ImgCodec);

    
    return DDSCodec;
});
//# sourceMappingURL=DDSCodec.js.map
