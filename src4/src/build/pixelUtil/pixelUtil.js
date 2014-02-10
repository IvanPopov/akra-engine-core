/// <reference path="../idl/EPixelFormats.ts" />
/// <reference path="../idl/IPixelFormatDescription.ts" />
/// <reference path="../idl/IPair.ts" />
/// <reference path="../idl/IColor.ts" />
/// <reference path="../common.ts" />
/// <reference path="../logger.ts" />
/// <reference path="../math/math.ts" />
/// <reference path="../bf/bf.ts" />
/// <reference path="../mem.ts" />
var akra;
(function (akra) {
    /// <reference path="PixelBox.ts" />
    (function (pixelUtil) {
        var dynamic_cast_f32_ptr = function (uint8_data, n) {
            return (new Float32Array(uint8_data.buffer, uint8_data.byteOffset, n));
        };
        var dynamic_cast_u16_ptr = function (uint8_data, n) {
            return (new Uint16Array(uint8_data.buffer, uint8_data.byteOffset, n));
        };
        var dynamic_cast_u32_ptr = function (uint8_data, n) {
            return (new Uint32Array(uint8_data.buffer, uint8_data.byteOffset, n));
        };
        var dynamic_cast_i8_ptr = function (uint8_data, n) {
            return (new Int8Array(uint8_data.buffer, uint8_data.byteOffset, n));
        };
        var dynamic_cast_i16_ptr = function (uint8_data, n) {
            return (new Int16Array(uint8_data.buffer, uint8_data.byteOffset, n));
        };
        var dynamic_cast_i32_ptr = function (uint8_data, n) {
            return (new Int32Array(uint8_data.buffer, uint8_data.byteOffset, n));
        };

        function fillPixelFormats(pData) {
            var pPixelFormats = [];

            for (var i = 0; i < pData.length; ++i) {
                var pEl = pData[i];
                pPixelFormats.push({
                    name: pEl[0],
                    elemBytes: pEl[1],
                    flags: pEl[2],
                    componentType: pEl[3],
                    componentCount: pEl[4],
                    rbits: pEl[5],
                    gbits: pEl[6],
                    bbits: pEl[7],
                    abits: pEl[8],
                    rmask: pEl[9],
                    gmask: pEl[10],
                    bmask: pEl[11],
                    amask: pEl[12],
                    rshift: pEl[13],
                    gshift: pEl[14],
                    bshift: pEl[15],
                    ashift: pEl[16]
                });
            }

            return pPixelFormats;
        }

        var pPixelFormats = fillPixelFormats([
            [
                "PF_UNKNOWN",
                /* Bytes per element */
                0,
                /* Flags */
                0,
                0 /* BYTE */, 0,
                /* rbits, gbits, bbits, abits */
                0, 0, 0, 0,
                /* Masks and shifts */
                0, 0, 0, 0, 0, 0, 0, 0
            ],
            [
                "PF_L8",
                /* Bytes per element */
                1,
                32 /* LUMINANCE */ | 16 /* NATIVEENDIAN */,
                0 /* BYTE */, 1,
                /* rbits, gbits, bbits, abits */
                8, 0, 0, 0,
                /* Masks and shifts */
                0xFF, 0, 0, 0, 0, 0, 0, 0
            ],
            [
                "PF_L16",
                /* Bytes per element */
                2,
                32 /* LUMINANCE */ | 16 /* NATIVEENDIAN */,
                1 /* SHORT */, 1,
                /* rbits, gbits, bbits, abits */
                16, 0, 0, 0,
                /* Masks and shifts */
                0xFFFF, 0, 0, 0, 0, 0, 0, 0
            ],
            [
                "PF_A8",
                /* Bytes per element */
                1,
                1 /* HASALPHA */ | 16 /* NATIVEENDIAN */,
                0 /* BYTE */, 1,
                /* rbits, gbits, bbits, abits */
                0, 0, 0, 8,
                /* Masks and shifts */
                0, 0, 0, 0xFF, 0, 0, 0, 0
            ],
            [
                "PF_A4L4",
                /* Bytes per element */
                1,
                1 /* HASALPHA */ | 32 /* LUMINANCE */ | 16 /* NATIVEENDIAN */,
                0 /* BYTE */, 2,
                /* rbits, gbits, bbits, abits */
                4, 0, 0, 4,
                /* Masks and shifts */
                0x0F, 0, 0, 0xF0, 0, 0, 0, 4
            ],
            [
                "PF_BYTE_LA",
                /* Bytes per element */
                2,
                1 /* HASALPHA */ | 32 /* LUMINANCE */,
                0 /* BYTE */, 2,
                /* rbits, gbits, bbits, abits */
                8, 0, 0, 8,
                /* Masks and shifts */
                0, 0, 0, 0, 0, 0, 0, 0
            ],
            [
                "PF_R5G6B5",
                /* Bytes per element */
                2,
                16 /* NATIVEENDIAN */,
                0 /* BYTE */, 3,
                /* rbits, gbits, bbits, abits */
                5, 6, 5, 0,
                /* Masks and shifts */
                0xF800, 0x07E0, 0x001F, 0,
                11, 5, 0, 0
            ],
            [
                "PF_B5G6R5",
                /* Bytes per element */
                2,
                16 /* NATIVEENDIAN */,
                0 /* BYTE */, 3,
                /* rbits, gbits, bbits, abits */
                5, 6, 5, 0,
                /* Masks and shifts */
                0x001F, 0x07E0, 0xF800, 0,
                0, 5, 11, 0
            ],
            [
                "PF_A4R4G4B4",
                /* Bytes per element */
                2,
                1 /* HASALPHA */ | 16 /* NATIVEENDIAN */,
                0 /* BYTE */, 4,
                /* rbits, gbits, bbits, abits */
                4, 4, 4, 4,
                /* Masks and shifts */
                0x0F00, 0x00F0, 0x000F, 0xF000,
                8, 4, 0, 12
            ],
            [
                "PF_A1R5G5B5",
                /* Bytes per element */
                2,
                1 /* HASALPHA */ | 16 /* NATIVEENDIAN */,
                0 /* BYTE */, 4,
                /* rbits, gbits, bbits, abits */
                5, 5, 5, 1,
                /* Masks and shifts */
                0x7C00, 0x03E0, 0x001F, 0x8000,
                10, 5, 0, 15
            ],
            [
                "PF_R8G8B8",
                /* Bytes per element */
                3,
                16 /* NATIVEENDIAN */,
                0 /* BYTE */, 3,
                /* rbits, gbits, bbits, abits */
                8, 8, 8, 0,
                /* Masks and shifts */
                0xFF0000, 0x00FF00, 0x0000FF, 0,
                16, 8, 0, 0
            ],
            [
                "PF_B8G8R8",
                /* Bytes per element */
                3,
                16 /* NATIVEENDIAN */,
                0 /* BYTE */, 3,
                /* rbits, gbits, bbits, abits */
                8, 8, 8, 0,
                /* Masks and shifts */
                0x0000FF, 0x00FF00, 0xFF0000, 0,
                0, 8, 16, 0
            ],
            [
                "PF_A8R8G8B8",
                /* Bytes per element */
                4,
                1 /* HASALPHA */ | 16 /* NATIVEENDIAN */,
                0 /* BYTE */, 4,
                /* rbits, gbits, bbits, abits */
                8, 8, 8, 8,
                /* Masks and shifts */
                0x00FF0000, 0x0000FF00, 0x000000FF, 0xFF000000,
                16, 8, 0, 24
            ],
            [
                "PF_A8B8G8R8",
                /* Bytes per element */
                4,
                1 /* HASALPHA */ | 16 /* NATIVEENDIAN */,
                0 /* BYTE */, 4,
                /* rbits, gbits, bbits, abits */
                8, 8, 8, 8,
                /* Masks and shifts */
                0x000000FF, 0x0000FF00, 0x00FF0000, 0xFF000000,
                0, 8, 16, 24
            ],
            [
                "PF_B8G8R8A8",
                /* Bytes per element */
                4,
                1 /* HASALPHA */ | 16 /* NATIVEENDIAN */,
                0 /* BYTE */, 4,
                /* rbits, gbits, bbits, abits */
                8, 8, 8, 8,
                /* Masks and shifts */
                0x0000FF00, 0x00FF0000, 0xFF000000, 0x000000FF,
                8, 16, 24, 0
            ],
            [
                "PF_A2R10G10B10",
                /* Bytes per element */
                4,
                1 /* HASALPHA */ | 16 /* NATIVEENDIAN */,
                0 /* BYTE */, 4,
                /* rbits, gbits, bbits, abits */
                10, 10, 10, 2,
                /* Masks and shifts */
                0x3FF00000, 0x000FFC00, 0x000003FF, 0xC0000000,
                20, 10, 0, 30
            ],
            [
                "PF_A2B10G10R10",
                /* Bytes per element */
                4,
                1 /* HASALPHA */ | 16 /* NATIVEENDIAN */,
                0 /* BYTE */, 4,
                /* rbits, gbits, bbits, abits */
                10, 10, 10, 2,
                /* Masks and shifts */
                0x000003FF, 0x000FFC00, 0x3FF00000, 0xC0000000,
                0, 10, 20, 30
            ],
            [
                "PF_DXT1",
                /* Bytes per element */
                0,
                2 /* COMPRESSED */ | 1 /* HASALPHA */,
                0 /* BYTE */, 3,
                /* rbits, gbits, bbits, abits */
                0, 0, 0, 0,
                /* Masks and shifts */
                0, 0, 0, 0, 0, 0, 0, 0
            ],
            [
                "PF_DXT2",
                /* Bytes per element */
                0,
                2 /* COMPRESSED */ | 1 /* HASALPHA */,
                0 /* BYTE */, 4,
                /* rbits, gbits, bbits, abits */
                0, 0, 0, 0,
                /* Masks and shifts */
                0, 0, 0, 0, 0, 0, 0, 0
            ],
            [
                "PF_DXT3",
                /* Bytes per element */
                0,
                2 /* COMPRESSED */ | 1 /* HASALPHA */,
                0 /* BYTE */, 4,
                /* rbits, gbits, bbits, abits */
                0, 0, 0, 0,
                /* Masks and shifts */
                0, 0, 0, 0, 0, 0, 0, 0
            ],
            [
                "PF_DXT4",
                /* Bytes per element */
                0,
                2 /* COMPRESSED */ | 1 /* HASALPHA */,
                0 /* BYTE */, 4,
                /* rbits, gbits, bbits, abits */
                0, 0, 0, 0,
                /* Masks and shifts */
                0, 0, 0, 0, 0, 0, 0, 0
            ],
            [
                "PF_DXT5",
                /* Bytes per element */
                0,
                2 /* COMPRESSED */ | 1 /* HASALPHA */,
                0 /* BYTE */, 4,
                /* rbits, gbits, bbits, abits */
                0, 0, 0, 0,
                /* Masks and shifts */
                0, 0, 0, 0, 0, 0, 0, 0
            ],
            [
                "PF_FLOAT16_RGB",
                /* Bytes per element */
                6,
                4 /* FLOAT */,
                3 /* FLOAT16 */, 3,
                /* rbits, gbits, bbits, abits */
                16, 16, 16, 0,
                /* Masks and shifts */
                0, 0, 0, 0, 0, 0, 0, 0
            ],
            [
                "PF_FLOAT16_RGBA",
                /* Bytes per element */
                8,
                4 /* FLOAT */ | 1 /* HASALPHA */,
                3 /* FLOAT16 */, 4,
                /* rbits, gbits, bbits, abits */
                16, 16, 16, 16,
                /* Masks and shifts */
                0, 0, 0, 0, 0, 0, 0, 0
            ],
            [
                "PF_FLOAT32_RGB",
                /* Bytes per element */
                12,
                4 /* FLOAT */,
                4 /* FLOAT32 */, 3,
                /* rbits, gbits, bbits, abits */
                32, 32, 32, 0,
                /* Masks and shifts */
                0, 0, 0, 0, 0, 0, 0, 0
            ],
            [
                "PF_FLOAT32_RGBA",
                /* Bytes per element */
                16,
                4 /* FLOAT */ | 1 /* HASALPHA */,
                4 /* FLOAT32 */, 4,
                /* rbits, gbits, bbits, abits */
                32, 32, 32, 32,
                /* Masks and shifts */
                0, 0, 0, 0, 0, 0, 0, 0
            ],
            [
                "PF_X8R8G8B8",
                /* Bytes per element */
                4,
                16 /* NATIVEENDIAN */,
                0 /* BYTE */, 3,
                /* rbits, gbits, bbits, abits */
                8, 8, 8, 0,
                /* Masks and shifts */
                0x00FF0000, 0x0000FF00, 0x000000FF, 0xFF000000,
                16, 8, 0, 24
            ],
            [
                "PF_X8B8G8R8",
                /* Bytes per element */
                4,
                16 /* NATIVEENDIAN */,
                0 /* BYTE */, 3,
                /* rbits, gbits, bbits, abits */
                8, 8, 8, 0,
                /* Masks and shifts */
                0x000000FF, 0x0000FF00, 0x00FF0000, 0xFF000000,
                0, 8, 16, 24
            ],
            [
                "PF_R8G8B8A8",
                /* Bytes per element */
                4,
                1 /* HASALPHA */ | 16 /* NATIVEENDIAN */,
                0 /* BYTE */, 4,
                /* rbits, gbits, bbits, abits */
                8, 8, 8, 8,
                /* Masks and shifts */
                0xFF000000, 0x00FF0000, 0x0000FF00, 0x000000FF,
                24, 16, 8, 0
            ],
            [
                "PF_FLOAT32_DEPTH",
                /* Bytes per element */
                4,
                8 /* DEPTH */,
                4 /* FLOAT32 */, 1,
                /* rbits, gbits, bbits, abits */
                0, 0, 0, 0,
                /* Masks and shifts */
                0, 0, 0, 0, 0, 0, 0, 0
            ],
            [
                "PF_SHORT_RGBA",
                /* Bytes per element */
                8,
                1 /* HASALPHA */,
                1 /* SHORT */, 4,
                /* rbits, gbits, bbits, abits */
                16, 16, 16, 16,
                /* Masks and shifts */
                0, 0, 0, 0, 0, 0, 0, 0
            ],
            [
                "PF_R3G3B2",
                /* Bytes per element */
                1,
                16 /* NATIVEENDIAN */,
                0 /* BYTE */, 3,
                /* rbits, gbits, bbits, abits */
                3, 3, 2, 0,
                /* Masks and shifts */
                0xE0, 0x1C, 0x03, 0,
                5, 2, 0, 0
            ],
            [
                "PF_FLOAT16_R",
                /* Bytes per element */
                2,
                4 /* FLOAT */,
                3 /* FLOAT16 */, 1,
                /* rbits, gbits, bbits, abits */
                16, 0, 0, 0,
                /* Masks and shifts */
                0, 0, 0, 0, 0, 0, 0, 0
            ],
            [
                "PF_FLOAT32_R",
                /* Bytes per element */
                4,
                4 /* FLOAT */,
                4 /* FLOAT32 */, 1,
                /* rbits, gbits, bbits, abits */
                32, 0, 0, 0,
                /* Masks and shifts */
                0, 0, 0, 0, 0, 0, 0, 0
            ],
            [
                "PF_SHORT_GR",
                /* Bytes per element */
                4,
                16 /* NATIVEENDIAN */,
                1 /* SHORT */, 2,
                /* rbits, gbits, bbits, abits */
                16, 16, 0, 0,
                /* Masks and shifts */
                0x0000FFFF, 0xFFFF0000, 0, 0,
                0, 16, 0, 0
            ],
            [
                "PF_FLOAT16_GR",
                /* Bytes per element */
                4,
                4 /* FLOAT */,
                3 /* FLOAT16 */, 2,
                /* rbits, gbits, bbits, abits */
                16, 16, 0, 0,
                /* Masks and shifts */
                0, 0, 0, 0, 0, 0, 0, 0
            ],
            [
                "PF_FLOAT32_GR",
                /* Bytes per element */
                8,
                4 /* FLOAT */,
                4 /* FLOAT32 */, 2,
                /* rbits, gbits, bbits, abits */
                32, 32, 0, 0,
                /* Masks and shifts */
                0, 0, 0, 0, 0, 0, 0, 0
            ],
            [
                "PF_SHORT_RGB",
                /* Bytes per element */
                6,
                /* Flags */
                0,
                1 /* SHORT */, 3,
                /* rbits, gbits, bbits, abits */
                16, 16, 16, 0,
                /* Masks and shifts */
                0, 0, 0, 0, 0, 0, 0, 0
            ],
            [
                "PF_PVRTC_RGB2",
                /* Bytes per element */
                0,
                2 /* COMPRESSED */,
                0 /* BYTE */, 3,
                /* rbits, gbits, bbits, abits */
                0, 0, 0, 0,
                /* Masks and shifts */
                0, 0, 0, 0, 0, 0, 0, 0
            ],
            [
                "PF_PVRTC_RGBA2",
                /* Bytes per element */
                0,
                2 /* COMPRESSED */ | 1 /* HASALPHA */,
                0 /* BYTE */, 4,
                /* rbits, gbits, bbits, abits */
                0, 0, 0, 0,
                /* Masks and shifts */
                0, 0, 0, 0, 0, 0, 0, 0
            ],
            [
                "PF_PVRTC_RGB4",
                /* Bytes per element */
                0,
                2 /* COMPRESSED */,
                0 /* BYTE */, 3,
                /* rbits, gbits, bbits, abits */
                0, 0, 0, 0,
                /* Masks and shifts */
                0, 0, 0, 0, 0, 0, 0, 0
            ],
            [
                "PF_PVRTC_RGBA4",
                /* Bytes per element */
                0,
                2 /* COMPRESSED */ | 1 /* HASALPHA */,
                0 /* BYTE */, 4,
                /* rbits, gbits, bbits, abits */
                0, 0, 0, 0,
                /* Masks and shifts */
                0, 0, 0, 0, 0, 0, 0, 0
            ],
            [
                "PF_R8",
                /* Bytes per element */
                1,
                16 /* NATIVEENDIAN */,
                0 /* BYTE */, 1,
                /* rbits, gbits, bbits, abits */
                8, 0, 0, 0,
                /* Masks and shifts */
                0xFF0000, 0, 0, 0,
                0, 0, 0, 0
            ],
            [
                "PF_RG8",
                /* Bytes per element */
                2,
                16 /* NATIVEENDIAN */,
                0 /* BYTE */, 2,
                /* rbits, gbits, bbits, abits */
                8, 8, 0, 0,
                /* Masks and shifts */
                0xFF0000, 0x00FF00, 0, 0,
                8, 0, 0, 0
            ],
            [
                "PF_DEPTH_BYTE",
                /* Bytes per element */
                1,
                8 /* DEPTH */,
                0 /* BYTE */, 1,
                /* rbits, gbits, bbits, abits */
                8, 0, 0, 0,
                /* Masks and shifts */
                0xFF, 0, 0, 0, 0, 0, 0, 0
            ],
            [
                "PF_DEPTH_SHORT",
                /* Bytes per element */
                2,
                8 /* DEPTH */,
                1 /* SHORT */, 1,
                /* rbits, gbits, bbits, abits */
                16, 0, 0, 0,
                /* Masks and shifts */
                0xFFFF, 0, 0, 0, 0, 0, 0, 0
            ],
            [
                "PF_DEPTH_INT",
                /* Bytes per element */
                4,
                8 /* DEPTH */,
                2 /* INT */, 1,
                /* rbits, gbits, bbits, abits */
                32, 0, 0, 0,
                /* Masks and shifts */
                0xFFFFFFFF, 0, 0, 0, 0, 0, 0, 0
            ],
            [
                "PF_DEPTH24STENCIL8",
                /* Bytes per element */
                4,
                8 /* DEPTH */ | 64 /* STENCIL */,
                2 /* INT */, 1,
                /* rbits, gbits, bbits, abits */
                24, 8, 0, 0,
                /* Masks and shifts */
                0x00FFFFFF, 0xFF000000, 0, 0,
                0, 24, 0, 0
            ]
        ]);

        var _pColorValue = { r: 0., g: 0., b: 0., a: 1. };

        function getDescriptionFor(eFmt) {
            var ord = eFmt;
            akra.logger.assert(ord >= 0 && ord < 48 /* TOTAL */, "getDescriptionFor:" + ord);

            return pPixelFormats[ord];
        }
        pixelUtil.getDescriptionFor = getDescriptionFor;

        /** Returns the size in bytes of an element of the given pixel format.
        @return
        The size in bytes of an element. See Remarks.
        @remarks
        Passing PF_UNKNOWN will result in returning a size of 0 bytes.
        */
        function getNumElemBytes(eFormat) {
            return getDescriptionFor(eFormat).elemBytes;
        }
        pixelUtil.getNumElemBytes = getNumElemBytes;

        /** Returns the size in bits of an element of the given pixel format.
        @return
        The size in bits of an element. See Remarks.
        @remarks
        Passing PF_UNKNOWN will result in returning a size of 0 bits.
        */
        function getNumElemBits(eFormat) {
            return getDescriptionFor(eFormat).elemBytes * 8;
        }
        pixelUtil.getNumElemBits = getNumElemBits;

        /** Returns the size in memory of a region with the given extents and pixel
        format with consecutive memory layout.
        @param width
        The width of the area
        @param height
        The height of the area
        @param depth
        The depth of the area
        @param format
        The format of the area
        @return
        The size in bytes
        @remarks
        In case that the format is non-compressed, this simply returns
        width*height*depth*PixelUtil::getNumElemBytes(format). In the compressed
        case, this does serious magic.
        */
        function getMemorySize(iWidth, iHeight, iDepth, eFormat) {
            if (isCompressed(eFormat)) {
                switch (eFormat) {
                    case 17 /* DXT1 */:
                        return Math.floor((iWidth + 3) / 4) * Math.floor((iHeight + 3) / 4) * 8 * iDepth;
                    case 18 /* DXT2 */:
                    case 19 /* DXT3 */:
                    case 20 /* DXT4 */:
                    case 21 /* DXT5 */:
                        return Math.floor((iWidth + 3) / 4) * Math.floor((iHeight + 3) / 4) * 16 * iDepth;

                    case 38 /* PVRTC_RGB2 */:
                    case 39 /* PVRTC_RGBA2 */:
                        akra.logger.assert(iDepth == 1);
                        return (akra.math.max(iWidth, 16) * akra.math.max(iHeight, 8) * 2 + 7) / 8;
                    case 40 /* PVRTC_RGB4 */:
                    case 41 /* PVRTC_RGBA4 */:
                        akra.logger.assert(iDepth == 1);
                        return (akra.math.max(iWidth, 8) * akra.math.max(iHeight, 8) * 4 + 7) / 8;
                    default:
                        akra.logger.error("Invalid compressed pixel format", "PixelUtil::getMemorySize");
                }
            } else {
                return iWidth * iHeight * iDepth * getNumElemBytes(eFormat);
            }
        }
        pixelUtil.getMemorySize = getMemorySize;

        /** Returns the property flags for this pixel format
        @return
        A bitfield combination of PFF_HASALPHA, PFF_ISCOMPRESSED,
        PFF_FLOAT, PFF_DEPTH, PFF_NATIVEENDIAN, PFF_LUMINANCE
        @remarks
        This replaces the separate functions for formatHasAlpha, formatIsFloat, ...
        */
        function getFlags(eFormat) {
            return getDescriptionFor(eFormat).flags;
        }
        pixelUtil.getFlags = getFlags;

        /** Shortcut method to determine if the format has an alpha component */
        function hasAlpha(eFormat) {
            return (getFlags(eFormat) & 1 /* HASALPHA */) > 0;
        }
        pixelUtil.hasAlpha = hasAlpha;

        /** Shortcut method to determine if the format is floating point */
        function isFloatingPoint(eFormat) {
            return (getFlags(eFormat) & 4 /* FLOAT */) > 0;
        }
        pixelUtil.isFloatingPoint = isFloatingPoint;

        /** Shortcut method to determine if the format is compressed */
        function isCompressed(eFormat) {
            return (getFlags(eFormat) & 2 /* COMPRESSED */) > 0;
        }
        pixelUtil.isCompressed = isCompressed;

        /** Shortcut method to determine if the format is a depth format. */
        function isDepth(eFormat) {
            return (getFlags(eFormat) & 8 /* DEPTH */) > 0;
        }
        pixelUtil.isDepth = isDepth;

        /** Shortcut method to determine if the format is in native endian format. */
        function isNativeEndian(eFormat) {
            return (getFlags(eFormat) & 16 /* NATIVEENDIAN */) > 0;
        }
        pixelUtil.isNativeEndian = isNativeEndian;

        /** Shortcut method to determine if the format is a luminance format. */
        function isLuminance(eFormat) {
            return (getFlags(eFormat) & 32 /* LUMINANCE */) > 0;
        }
        pixelUtil.isLuminance = isLuminance;

        /** Return wether a certain image extent is valid for this image format.
        @param width
        The width of the area
        @param height
        The height of the area
        @param depth
        The depth of the area
        @param format
        The format of the area
        @remarks For non-compressed formats, this is always true. For DXT formats,
        only sizes with a width and height multiple of 4 and depth 1 are allowed.
        */
        function isValidExtent(iWidth, iHeight, iDepth, eFormat) {
            if (isCompressed(eFormat)) {
                switch (eFormat) {
                    case 17 /* DXT1 */:
                    case 18 /* DXT2 */:
                    case 19 /* DXT3 */:
                    case 20 /* DXT4 */:
                    case 21 /* DXT5 */:
                        return ((iWidth & 3) == 0 && (iHeight & 3) == 0 && iDepth == 1);
                    default:
                        return true;
                }
            } else {
                return true;
            }
        }
        pixelUtil.isValidExtent = isValidExtent;

        /** Gives the number of bits (RGBA) for a format. See remarks.
        @remarks      For non-colour formats (dxt, depth) this returns [0,0,0,0].
        */
        function getBitDepths(eFormat) {
            /** @const */ var des = getDescriptionFor(eFormat);
            var rgba = [];

            rgba[0] = des.rbits;
            rgba[1] = des.gbits;
            rgba[2] = des.bbits;
            rgba[3] = des.abits;

            return rgba;
        }
        pixelUtil.getBitDepths = getBitDepths;

        /** Gives the masks for the R, G, B and A component
        @note			Only valid for native endian formats
        */
        function getBitMasks(eFormat) {
            /** @const */ var des = getDescriptionFor(eFormat);
            var rgba = [];

            rgba[0] = des.rmask;
            rgba[1] = des.gmask;
            rgba[2] = des.bmask;
            rgba[3] = des.amask;

            return rgba;
        }
        pixelUtil.getBitMasks = getBitMasks;

        /** Gives the bit shifts for R, G, B and A component
        @note			Only valid for native endian formats
        */
        function getBitShifts(eFormat) {
            /** @const */ var des = getDescriptionFor(eFormat);
            var rgba = [];

            rgba[0] = des.rshift;
            rgba[1] = des.gshift;
            rgba[2] = des.bshift;
            rgba[3] = des.ashift;

            return rgba;
        }
        pixelUtil.getBitShifts = getBitShifts;

        /** Gets the name of an image format
        */
        function getFormatName(eSrcFormat) {
            return getDescriptionFor(eSrcFormat).name;
        }
        pixelUtil.getFormatName = getFormatName;

        /** Returns wether the format can be packed or unpacked with the packColour()
        and unpackColour() functions. This is generally not true for compressed and
        depth formats as they are special. It can only be true for formats with a
        fixed element size.
        @return
        true if yes, otherwise false
        */
        function isAccessible(eSrcFormat) {
            if (eSrcFormat == 0 /* UNKNOWN */)
                return false;
            var flags = getFlags(eSrcFormat);
            return !((flags & 2 /* COMPRESSED */) || (flags & 8 /* DEPTH */));
        }
        pixelUtil.isAccessible = isAccessible;

        /** Returns the component type for a certain pixel format. Returns PCT_BYTE
        in case there is no clear component type like with compressed formats.
        This is one of PCT_BYTE, PCT_SHORT, PCT_FLOAT16, PCT_FLOAT32.
        */
        function getComponentType(eFmt) {
            return getDescriptionFor(eFmt).componentType;
        }
        pixelUtil.getComponentType = getComponentType;

        /** Returns the component count for a certain pixel format. Returns 3(no alpha) or
        4 (has alpha) in case there is no clear component type like with compressed formats.
        */
        function getComponentCount(eFmt) {
            return getDescriptionFor(eFmt).componentCount;
        }
        pixelUtil.getComponentCount = getComponentCount;

        function getComponentTypeBits(eFormat) {
            var eType = getComponentType(eFormat);

            switch (eType) {
                case 0 /* BYTE */:
                    return 8;
                case 1 /* SHORT */:
                    return 16;
                case 3 /* FLOAT16 */:
                    return 16;
                case 4 /* FLOAT32 */:
                    return 32;
            }

            return 0;
        }
        pixelUtil.getComponentTypeBits = getComponentTypeBits;

        /** Gets the format from given name.
        @param  name            The string of format name
        @param  accessibleOnly  If true, non-accessible format will treat as invalid format,
        otherwise, all supported format are valid.
        @param  caseSensitive   Should be set true if string match should use case sensitivity.
        @return                The format match the format name, or PF_UNKNOWN if is invalid name.
        */
        function getFormatFromName(sName, isAccessibleOnly, isCaseSensitive) {
            if (typeof isAccessibleOnly === "undefined") { isAccessibleOnly = false; }
            if (typeof isCaseSensitive === "undefined") { isCaseSensitive = false; }
            var tmp = sName;

            if (!isCaseSensitive) {
                // We are stored upper-case format names.
                tmp = tmp.toUpperCase();
            }

            for (var i = 0; i < 48 /* TOTAL */; ++i) {
                var ePf = i;
                if (!isAccessibleOnly || isAccessible(ePf)) {
                    if (tmp == getFormatName(ePf))
                        return ePf;
                }
            }

            return 0 /* UNKNOWN */;
        }
        pixelUtil.getFormatFromName = getFormatFromName;

        /** Gets the BNF expression of the pixel-formats.
        @note                   The string returned by this function is intended to be used as a BNF expression
        to work with Compiler2Pass.
        @param  accessibleOnly  If true, only accessible pixel format will take into account, otherwise all
        pixel formats list in EPixelFormats enumeration will being returned.
        @return                A string contains the BNF expression.
        */
        function getBNFExpressionOfPixelFormats(isAccessibleOnly) {
            if (typeof isAccessibleOnly === "undefined") { isAccessibleOnly = false; }
            // Collect format names sorted by length, it's required by BNF compiler
            // that similar tokens need longer ones comes first.
            var formatNames = [];
            for (var i = 0; i < 48 /* TOTAL */; ++i) {
                var ePf = (i);
                if (!isAccessibleOnly || isAccessible(ePf)) {
                    var formatName = getFormatName(ePf);
                    formatNames.push({ first: formatName.length, second: formatName });
                }
            }

            // Populate the BNF expression in reverse order
            var result = "";

            for (var j in formatNames) {
                if (!akra.isEmpty(result))
                    result += " | ";
                result += "'" + formatNames[j] + "'";
            }

            return result;
        }
        pixelUtil.getBNFExpressionOfPixelFormats = getBNFExpressionOfPixelFormats;

        /** Returns the similar format but acoording with given bit depths.
        @param fmt      The original foamt.
        @param integerBits Preferred bit depth (pixel bits) for integer pixel format.
        Available values: 0, 16 and 32, where 0 (the default) means as it is.
        @param floatBits Preferred bit depth (channel bits) for float pixel format.
        Available values: 0, 16 and 32, where 0 (the default) means as it is.
        @return        The format that similar original format with bit depth according
        with preferred bit depth, or original format if no conversion occurring.
        */
        function getFormatForBitDepths(eFmt, iIntegerBits, iFloatBits) {
            switch (iIntegerBits) {
                case 16:
                    switch (eFmt) {
                        case 10 /* R8G8B8 */:
                        case 26 /* X8R8G8B8 */:
                            return 6 /* R5G6B5 */;

                        case 11 /* B8G8R8 */:
                        case 27 /* X8B8G8R8 */:
                            return 7 /* B5G6R5 */;

                        case 12 /* A8R8G8B8 */:
                        case 28 /* R8G8B8A8 */:
                        case 13 /* A8B8G8R8 */:
                        case 14 /* B8G8R8A8 */:
                            return 8 /* A4R4G4B4 */;

                        case 15 /* A2R10G10B10 */:
                        case 16 /* A2B10G10R10 */:
                            return 9 /* A1R5G5B5 */;

                        default:
                            break;
                    }
                    break;

                case 32:
                    switch (eFmt) {
                        case 6 /* R5G6B5 */:
                            return 26 /* X8R8G8B8 */;

                        case 7 /* B5G6R5 */:
                            return 27 /* X8B8G8R8 */;

                        case 8 /* A4R4G4B4 */:
                            return 12 /* A8R8G8B8 */;

                        case 9 /* A1R5G5B5 */:
                            return 15 /* A2R10G10B10 */;

                        default:
                            break;
                    }
                    break;

                default:
                    break;
            }

            switch (iFloatBits) {
                case 16:
                    switch (eFmt) {
                        case 33 /* FLOAT32_R */:
                            return 32 /* FLOAT16_R */;

                        case 24 /* FLOAT32_RGB */:
                            return 22 /* FLOAT16_RGB */;

                        case 25 /* FLOAT32_RGBA */:
                            return 23 /* FLOAT16_RGBA */;

                        default:
                            break;
                    }
                    break;

                case 32:
                    switch (eFmt) {
                        case 32 /* FLOAT16_R */:
                            return 33 /* FLOAT32_R */;

                        case 22 /* FLOAT16_RGB */:
                            return 24 /* FLOAT32_RGB */;

                        case 23 /* FLOAT16_RGBA */:
                            return 25 /* FLOAT32_RGBA */;

                        default:
                            break;
                    }
                    break;

                default:
                    break;
            }

            return eFmt;
        }
        pixelUtil.getFormatForBitDepths = getFormatForBitDepths;

        /** Pack a colour value to memory
        @param colour	The colour
        @param pf		Pixelformat in which to write the colour
        @param dest		Destination memory location
        */
        function packColour(cColour, ePf, pDest) {
            packColourFloat(cColour.r, cColour.g, cColour.b, cColour.a, ePf, pDest);
        }
        pixelUtil.packColour = packColour;

        /** Pack a colour value to memory
        @param r,g,b,a	The four colour components, range 0x00 to 0xFF
        @param pf		Pixelformat in which to write the colour
        @param dest		Destination memory location
        */
        function packColourUint(r, g, b, a, ePf, pDest) {
            // if (arguments.length < 4) {
            // 	var cColour: IColor = arguments[0];
            // 	packColour(cColour.r, cColour.g, cColour.b, cColour.a, ePf, pDest);
            // 	return;
            // }
            /** @const */ var des = getDescriptionFor(ePf);
            if (des.flags & 16 /* NATIVEENDIAN */) {
                // Shortcut for integer formats packing
                var value = ((akra.bf.fixedToFixed(r, 8, des.rbits) << des.rshift) & des.rmask) | ((akra.bf.fixedToFixed(g, 8, des.gbits) << des.gshift) & des.gmask) | ((akra.bf.fixedToFixed(b, 8, des.bbits) << des.bshift) & des.bmask) | ((akra.bf.fixedToFixed(a, 8, des.abits) << des.ashift) & des.amask);

                // And write to memory
                akra.bf.intWrite(pDest, des.elemBytes, value);
            } else {
                // Convert to float
                packColourFloat(r / 255.0, g / 255.0, b / 255.0, a / 255.0, ePf, pDest);
            }
        }
        pixelUtil.packColourUint = packColourUint;

        /** Pack a colour value to memory
        @param r,g,b,a	The four colour components, range 0.0f to 1.0f
        (an exception to this case exists for floating point pixel
        formats, which don't clamp to 0.0f..1.0f)
        @param pf		Pixelformat in which to write the colour
        @param dest		Destination memory location
        */
        function packColourFloat(r, g, b, a, ePf, pDest) {
            // Catch-it-all here
            /** @const */ var des = getDescriptionFor(ePf);
            if (des.flags & 16 /* NATIVEENDIAN */) {
                // Do the packing
                //std::cerr << dest << " " << r << " " << g <<  " " << b << " " << a << std::endl;
                /** @const */ var value = ((akra.bf.floatToFixed(r, des.rbits) << des.rshift) & des.rmask) | ((akra.bf.floatToFixed(g, des.gbits) << des.gshift) & des.gmask) | ((akra.bf.floatToFixed(b, des.bbits) << des.bshift) & des.bmask) | ((akra.bf.floatToFixed(a, des.abits) << des.ashift) & des.amask);

                // And write to memory
                akra.bf.intWrite(pDest, des.elemBytes, value);
            } else {
                switch (ePf) {
                    case 33 /* FLOAT32_R */:
                        dynamic_cast_f32_ptr(pDest, 1)[0] = r;
                        break;
                    case 36 /* FLOAT32_GR */:
                        dynamic_cast_f32_ptr(pDest, 1)[0] = g;
                        dynamic_cast_f32_ptr(pDest, 2)[1] = r;
                        break;
                    case 24 /* FLOAT32_RGB */:
                        dynamic_cast_f32_ptr(pDest, 1)[0] = r;
                        dynamic_cast_f32_ptr(pDest, 2)[1] = g;
                        dynamic_cast_f32_ptr(pDest, 3)[2] = b;
                        break;
                    case 25 /* FLOAT32_RGBA */:
                        dynamic_cast_f32_ptr(pDest, 1)[0] = r;
                        dynamic_cast_f32_ptr(pDest, 2)[1] = g;
                        dynamic_cast_f32_ptr(pDest, 3)[2] = b;
                        dynamic_cast_f32_ptr(pDest, 4)[3] = a;
                        break;
                    case 32 /* FLOAT16_R */:
                        dynamic_cast_u16_ptr(pDest, 1)[0] = akra.bf.floatToHalf(r);
                        break;
                    case 35 /* FLOAT16_GR */:
                        dynamic_cast_u16_ptr(pDest, 1)[0] = akra.bf.floatToHalf(g);
                        dynamic_cast_u16_ptr(pDest, 2)[1] = akra.bf.floatToHalf(r);
                        break;
                    case 22 /* FLOAT16_RGB */:
                        dynamic_cast_u16_ptr(pDest, 1)[0] = akra.bf.floatToHalf(r);
                        dynamic_cast_u16_ptr(pDest, 2)[1] = akra.bf.floatToHalf(g);
                        dynamic_cast_u16_ptr(pDest, 3)[2] = akra.bf.floatToHalf(b);
                        break;
                    case 23 /* FLOAT16_RGBA */:
                        dynamic_cast_u16_ptr(pDest, 1)[0] = akra.bf.floatToHalf(r);
                        dynamic_cast_u16_ptr(pDest, 2)[1] = akra.bf.floatToHalf(g);
                        dynamic_cast_u16_ptr(pDest, 3)[2] = akra.bf.floatToHalf(b);
                        dynamic_cast_u16_ptr(pDest, 4)[3] = akra.bf.floatToHalf(a);
                        break;
                    case 37 /* SHORT_RGB */:
                        dynamic_cast_u16_ptr(pDest, 1)[0] = akra.bf.floatToFixed(r, 16);
                        dynamic_cast_u16_ptr(pDest, 2)[1] = akra.bf.floatToFixed(g, 16);
                        dynamic_cast_u16_ptr(pDest, 3)[2] = akra.bf.floatToFixed(b, 16);
                        break;
                    case 30 /* SHORT_RGBA */:
                        dynamic_cast_u16_ptr(pDest, 1)[0] = akra.bf.floatToFixed(r, 16);
                        dynamic_cast_u16_ptr(pDest, 2)[1] = akra.bf.floatToFixed(g, 16);
                        dynamic_cast_u16_ptr(pDest, 3)[2] = akra.bf.floatToFixed(b, 16);
                        dynamic_cast_u16_ptr(pDest, 4)[3] = akra.bf.floatToFixed(a, 16);
                        break;
                    case 5 /* BYTE_LA */:
                        pDest[0] = akra.bf.floatToFixed(r, 8);
                        pDest[1] = akra.bf.floatToFixed(a, 8);
                        break;
                    default:
                        // Not yet supported
                        akra.logger.error("pack to " + getFormatName(ePf) + " not implemented", "PixelUtil::packColour");
                        break;
                }
            }
        }
        pixelUtil.packColourFloat = packColourFloat;

        /** Unpack a colour value from memory
        @param colour	The colour is returned here
        @param pf		Pixelformat in which to read the colour
        @param src		Source memory location
        */
        function unpackColour(cColour, ePf, pSrc) {
            unpackColourFloat(cColour, ePf, pSrc);
        }
        pixelUtil.unpackColour = unpackColour;

        /** Unpack a colour value from memory
        @param r,g,b,a	The colour is returned here (as byte)
        @param pf		Pixelformat in which to read the colour
        @param src		Source memory location
        @remarks 	This function returns the colour components in 8 bit precision,
        this will lose precision when coming from PF_A2R10G10B10 or floating
        point formats.
        */
        function unpackColourUint(rgba, ePf, pSrc) {
            /** @const */ var des = getDescriptionFor(ePf);
            var r = 0, g = 0, b = 0, a = 0;

            if (des.flags & 16 /* NATIVEENDIAN */) {
                // Shortcut for integer formats unpacking
                /** @const */ var value = akra.bf.intRead(pSrc, des.elemBytes);
                if (des.flags & 32 /* LUMINANCE */) {
                    // Luminance format -- only rbits used
                    r = g = b = akra.bf.fixedToFixed((value & des.rmask) >> des.rshift, des.rbits, 8);
                } else {
                    r = akra.bf.fixedToFixed((value & des.rmask) >> des.rshift, des.rbits, 8);
                    g = akra.bf.fixedToFixed((value & des.gmask) >> des.gshift, des.gbits, 8);
                    b = akra.bf.fixedToFixed((value & des.bmask) >> des.bshift, des.bbits, 8);
                }
                if (des.flags & 1 /* HASALPHA */) {
                    a = akra.bf.fixedToFixed((value & des.amask) >> des.ashift, des.abits, 8);
                } else {
                    a = 255; /* No alpha, default a component to full*/
                }
            } else {
                // Do the operation with the more generic floating point
                var pRGBA = _pColorValue;
                unpackColourFloat(pRGBA, ePf, pSrc);

                r = akra.bf.floatToFixed(pRGBA.r, 8);
                g = akra.bf.floatToFixed(pRGBA.g, 8);
                b = akra.bf.floatToFixed(pRGBA.b, 8);
                a = akra.bf.floatToFixed(pRGBA.a, 8);
            }

            rgba[0] = r;
            rgba[1] = g;
            rgba[2] = b;
            rgba[3] = a;
        }
        pixelUtil.unpackColourUint = unpackColourUint;

        /** Unpack a colour value from memory
        @param r,g,b,a	The colour is returned here (as float)
        @param pf		Pixelformat in which to read the colour
        @param src		Source memory location
        */
        function unpackColourFloat(rgba, ePf, pSrc) {
            /** @const */ var des = getDescriptionFor(ePf);
            var r = 0., g = 0., b = 0., a = 0.;

            if (des.flags & 16 /* NATIVEENDIAN */) {
                // Shortcut for integer formats unpacking
                /** @const */ var value = akra.bf.intRead(pSrc, des.elemBytes);

                if (des.flags & 32 /* LUMINANCE */) {
                    // Luminance format -- only rbits used
                    r = g = b = akra.bf.fixedToFloat((value & des.rmask) >>> des.rshift, des.rbits);
                } else {
                    r = akra.bf.fixedToFloat((value & des.rmask) >>> des.rshift, des.rbits);
                    g = akra.bf.fixedToFloat((value & des.gmask) >>> des.gshift, des.gbits);
                    b = akra.bf.fixedToFloat((value & des.bmask) >>> des.bshift, des.bbits);
                }

                if (des.flags & 1 /* HASALPHA */) {
                    a = akra.bf.fixedToFloat((value & des.amask) >>> des.ashift, des.abits);
                } else {
                    a = 1.0; /* No alpha, default a component to full*/
                }
            } else {
                switch (ePf) {
                    case 29 /* FLOAT32_DEPTH */:
                    case 33 /* FLOAT32_R */:
                        r = g = b = dynamic_cast_f32_ptr(pSrc, 1)[0];
                        a = 1.0;
                        break;
                    case 36 /* FLOAT32_GR */:
                        g = dynamic_cast_f32_ptr(pSrc, 1)[0];
                        r = b = dynamic_cast_f32_ptr(pSrc, 2)[1];
                        a = 1.0;
                        break;
                    case 24 /* FLOAT32_RGB */:
                        r = dynamic_cast_f32_ptr(pSrc, 1)[0];
                        g = dynamic_cast_f32_ptr(pSrc, 2)[1];
                        b = dynamic_cast_f32_ptr(pSrc, 3)[2];
                        a = 1.0;
                        break;
                    case 25 /* FLOAT32_RGBA */:
                        r = dynamic_cast_f32_ptr(pSrc, 1)[0];
                        g = dynamic_cast_f32_ptr(pSrc, 2)[1];
                        b = dynamic_cast_f32_ptr(pSrc, 3)[2];
                        a = dynamic_cast_f32_ptr(pSrc, 4)[3];
                        break;
                    case 32 /* FLOAT16_R */:
                        r = g = b = akra.bf.halfToFloat((dynamic_cast_u16_ptr(pSrc, 1))[0]);
                        a = 1.0;
                        break;
                    case 35 /* FLOAT16_GR */:
                        g = akra.bf.halfToFloat((dynamic_cast_u16_ptr(pSrc, 1))[0]);
                        r = b = akra.bf.halfToFloat((dynamic_cast_u16_ptr(pSrc, 2))[1]);
                        a = 1.0;
                        break;
                    case 22 /* FLOAT16_RGB */:
                        r = akra.bf.halfToFloat((dynamic_cast_u16_ptr(pSrc, 1))[0]);
                        g = akra.bf.halfToFloat((dynamic_cast_u16_ptr(pSrc, 1))[1]);
                        b = akra.bf.halfToFloat((dynamic_cast_u16_ptr(pSrc, 2))[2]);
                        a = 1.0;
                        break;
                    case 23 /* FLOAT16_RGBA */:
                        r = akra.bf.halfToFloat((dynamic_cast_u16_ptr(pSrc, 1))[0]);
                        g = akra.bf.halfToFloat((dynamic_cast_u16_ptr(pSrc, 2))[1]);
                        b = akra.bf.halfToFloat((dynamic_cast_u16_ptr(pSrc, 3))[2]);
                        a = akra.bf.halfToFloat((dynamic_cast_u16_ptr(pSrc, 4))[3]);
                        break;
                    case 37 /* SHORT_RGB */:
                        r = akra.bf.fixedToFloat((dynamic_cast_u16_ptr(pSrc, 1))[0], 16);
                        g = akra.bf.fixedToFloat((dynamic_cast_u16_ptr(pSrc, 2))[1], 16);
                        b = akra.bf.fixedToFloat((dynamic_cast_u16_ptr(pSrc, 3))[2], 16);
                        a = 1.0;
                        break;
                    case 30 /* SHORT_RGBA */:
                        r = akra.bf.fixedToFloat((dynamic_cast_u16_ptr(pSrc, 1))[0], 16);
                        g = akra.bf.fixedToFloat((dynamic_cast_u16_ptr(pSrc, 2))[1], 16);
                        b = akra.bf.fixedToFloat((dynamic_cast_u16_ptr(pSrc, 3))[2], 16);
                        a = akra.bf.fixedToFloat((dynamic_cast_u16_ptr(pSrc, 4))[3], 16);
                        break;
                    case 5 /* BYTE_LA */:
                        r = g = b = akra.bf.fixedToFloat((pSrc)[0], 8);
                        a = akra.bf.fixedToFloat((pSrc)[1], 8);
                        break;
                    default:
                        // Not yet supported
                        akra.logger.error("unpack from " + getFormatName(ePf) + " not implemented", "PixelUtil::unpackColour");
                        break;
                }
            }

            rgba.r = r;
            rgba.g = g;
            rgba.b = b;
            rgba.a = a;
        }
        pixelUtil.unpackColourFloat = unpackColourFloat;

        

        

        function bulkPixelConversion(pSrc, eSrcFormat, pDest, eDstFormat, iCount) {
            var src = null, dst = null;

            if (arguments.length > 2) {
                src = new akra.pixelUtil.PixelBox(iCount, 1, 1, eSrcFormat, pSrc);
                dst = new akra.pixelUtil.PixelBox(iCount, 1, 1, eDstFormat, pDest);
            } else {
                src = arguments[0];
                dst = arguments[1];
            }

            if (src.getWidth() !== dst.getWidth() || src.getHeight() !== dst.getHeight() || src.getDepth() !== dst.getDepth()) {
                akra.logger.critical("Size dest and src pictures is different");
                return;
            }

            // Check for compressed formats, we don't support decompression, compression or recoding
            if (isCompressed(src.format) || isCompressed(dst.format)) {
                if (src.format == dst.format) {
                    //_memcpy(dst.data.buffer, src.data.buffer, src.getConsecutiveSize());
                    dst.data.set(src.data.subarray(0, src.getConsecutiveSize()));
                    return;
                } else {
                    akra.logger.error("This method can not be used to compress or decompress images", "PixelUtil::bulkPixelConversion");
                }
            }

            // The easy case
            if (src.format == dst.format) {
                // Everything consecutive?
                if (src.isConsecutive() && dst.isConsecutive()) {
                    //_memcpy(dst.data.buffer, src.data.buffer, src.getConsecutiveSize());
                    dst.data.set(src.data.subarray(0, src.getConsecutiveSize()));
                    return;
                }

                var srcPixelSize = getNumElemBytes(src.format);
                var dstPixelSize = getNumElemBytes(dst.format);

                var srcptr = src.data.subarray((src.left + src.top * src.rowPitch + src.front * src.slicePitch) * srcPixelSize);
                var dstptr = dst.data.subarray((dst.left + dst.top * dst.rowPitch + dst.front * dst.slicePitch) * dstPixelSize);

                // Calculate pitches+skips in bytes
                var srcRowPitchBytes = src.rowPitch * srcPixelSize;

                //var size_t srcRowSkipBytes = src.getRowSkip()*srcPixelSize;
                var srcSliceSkipBytes = src.getSliceSkip() * srcPixelSize;

                var dstRowPitchBytes = dst.rowPitch * dstPixelSize;

                //var size_t dstRowSkipBytes = dst.getRowSkip()*dstPixelSize;
                var dstSliceSkipBytes = dst.getSliceSkip() * dstPixelSize;

                // Otherwise, copy per row
                /** @const */ var rowSize = src.getWidth() * srcPixelSize;

                for (var z = src.front; z < src.back; z++) {
                    for (var y = src.top; y < src.bottom; y++) {
                        //_memcpy(dstptr.buffer, srcptr.buffer, rowSize);
                        dstptr.set(srcptr.subarray(0, rowSize));

                        srcptr = srcptr.subarray(srcRowPitchBytes);
                        dstptr = dstptr.subarray(dstRowPitchBytes);
                    }

                    srcptr = srcptr.subarray(srcSliceSkipBytes);
                    dstptr = dstptr.subarray(dstSliceSkipBytes);
                }

                return;
            }

            // Converting to PF_X8R8G8B8 is exactly the same as converting to
            // PF_A8R8G8B8. (same with PF_X8B8G8R8 and PF_A8B8G8R8)
            if (dst.format == 26 /* X8R8G8B8 */ || dst.format == 27 /* X8B8G8R8 */) {
                // Do the same conversion, with EPixelFormats.A8R8G8B8, which has a lot of
                // optimized conversions
                var tempdst = dst;
                tempdst.format = (dst.format == 26 /* X8R8G8B8 */) ? 12 /* A8R8G8B8 */ : 13 /* A8B8G8R8 */;
                bulkPixelConversion(src, tempdst);
                return;
            }

            // Converting from EPixelFormats.X8R8G8B8 is exactly the same as converting from
            // EPixelFormats.A8R8G8B8, given that the destination format does not have alpha.
            if ((src.format == 26 /* X8R8G8B8 */ || src.format == 27 /* X8B8G8R8 */) && !hasAlpha(dst.format)) {
                // Do the same conversion, with EPixelFormats.A8R8G8B8, which has a lot of
                // optimized conversions
                var tempsrc = src;
                tempsrc.format = src.format == 26 /* X8R8G8B8 */ ? 12 /* A8R8G8B8 */ : 13 /* A8B8G8R8 */;
                bulkPixelConversion(tempsrc, dst);
                return;
            }

            var srcPixelSize = getNumElemBytes(src.format);
            var dstPixelSize = getNumElemBytes(dst.format);

            var srcptr = src.data.subarray((src.left + src.top * src.rowPitch + src.front * src.slicePitch) * srcPixelSize);
            var dstptr = dst.data.subarray((dst.left + dst.top * dst.rowPitch + dst.front * dst.slicePitch) * dstPixelSize);

            // Old way, not taking into account box dimensions
            //uint8 *srcptr = static_cast<uint8*>(src.data), *dstptr = static_cast<uint8*>(dst.data);
            // Calculate pitches+skips in bytes
            var srcRowSkipBytes = src.getRowSkip() * srcPixelSize;
            var srcSliceSkipBytes = src.getSliceSkip() * srcPixelSize;
            var dstRowSkipBytes = dst.getRowSkip() * dstPixelSize;
            var dstSliceSkipBytes = dst.getSliceSkip() * dstPixelSize;

            // The brute force fallback
            // var r: float = 0, g: float = 0, b: float = 0, a: float = 1;
            var rgba = _pColorValue;
            for (var z = src.front; z < src.back; z++) {
                for (var y = src.top; y < src.bottom; y++) {
                    for (var x = src.left; x < src.right; x++) {
                        unpackColourFloat(rgba, src.format, srcptr);
                        packColourFloat(rgba.r, rgba.g, rgba.b, rgba.a, dst.format, dstptr);
                        srcptr = srcptr.subarray(srcPixelSize);
                        dstptr = dstptr.subarray(dstPixelSize);
                    }
                    srcptr = srcptr.subarray(srcRowSkipBytes);
                    dstptr = dstptr.subarray(dstRowSkipBytes);
                }
                srcptr = srcptr.subarray(srcSliceSkipBytes);
                dstptr = dstptr.subarray(dstSliceSkipBytes);
            }
        }
        pixelUtil.bulkPixelConversion = bulkPixelConversion;

        function calculateSizeForImage(nMipLevels, nFaces, iWidth, iHeight, iDepth, eFormat) {
            var iSize = 0;
            var mip = 0;

            for (mip = 0; mip < nMipLevels; ++mip) {
                iSize += getMemorySize(iWidth, iHeight, iDepth, eFormat) * nFaces;
                if (iWidth !== 1)
                    iWidth /= 2;
                if (iHeight !== 1)
                    iHeight /= 2;
                if (iDepth !== 1)
                    iDepth /= 2;
            }

            return iSize;
        }
        pixelUtil.calculateSizeForImage = calculateSizeForImage;
    })(akra.pixelUtil || (akra.pixelUtil = {}));
    var pixelUtil = akra.pixelUtil;
})(akra || (akra = {}));
//# sourceMappingURL=pixelUtil.js.map
