var akra;
(function (akra) {
    (function (EPixelFormats) {
        EPixelFormats[EPixelFormats["UNKNOWN"] = 0] = "UNKNOWN";

        EPixelFormats[EPixelFormats["L8"] = 1] = "L8";
        EPixelFormats[EPixelFormats["BYTE_L"] = EPixelFormats.L8] = "BYTE_L";
        EPixelFormats[EPixelFormats["L16"] = 2] = "L16";
        EPixelFormats[EPixelFormats["SHORT_L"] = EPixelFormats.L16] = "SHORT_L";
        EPixelFormats[EPixelFormats["A8"] = 3] = "A8";
        EPixelFormats[EPixelFormats["BYTE_A"] = EPixelFormats.A8] = "BYTE_A";
        EPixelFormats[EPixelFormats["A4L4"] = 4] = "A4L4";
        EPixelFormats[EPixelFormats["BYTE_LA"] = 5] = "BYTE_LA";

        EPixelFormats[EPixelFormats["R5G6B5"] = 6] = "R5G6B5";
        EPixelFormats[EPixelFormats["B5G6R5"] = 7] = "B5G6R5";
        EPixelFormats[EPixelFormats["R3G3B2"] = 31] = "R3G3B2";
        EPixelFormats[EPixelFormats["A4R4G4B4"] = 8] = "A4R4G4B4";
        EPixelFormats[EPixelFormats["A1R5G5B5"] = 9] = "A1R5G5B5";
        EPixelFormats[EPixelFormats["R8G8B8"] = 10] = "R8G8B8";
        EPixelFormats[EPixelFormats["B8G8R8"] = 11] = "B8G8R8";
        EPixelFormats[EPixelFormats["A8R8G8B8"] = 12] = "A8R8G8B8";
        EPixelFormats[EPixelFormats["A8B8G8R8"] = 13] = "A8B8G8R8";
        EPixelFormats[EPixelFormats["B8G8R8A8"] = 14] = "B8G8R8A8";
        EPixelFormats[EPixelFormats["R8G8B8A8"] = 28] = "R8G8B8A8";

        EPixelFormats[EPixelFormats["X8R8G8B8"] = 26] = "X8R8G8B8";
        EPixelFormats[EPixelFormats["X8B8G8R8"] = 27] = "X8B8G8R8";

        EPixelFormats[EPixelFormats["BYTE_RGB"] = EPixelFormats.R8G8B8] = "BYTE_RGB";
        EPixelFormats[EPixelFormats["BYTE_BGR"] = EPixelFormats.B8G8R8] = "BYTE_BGR";
        EPixelFormats[EPixelFormats["BYTE_BGRA"] = EPixelFormats.B8G8R8A8] = "BYTE_BGRA";
        EPixelFormats[EPixelFormats["BYTE_RGBA"] = EPixelFormats.R8G8B8A8] = "BYTE_RGBA";

        EPixelFormats[EPixelFormats["BYTE_ABGR"] = EPixelFormats.A8B8G8R8] = "BYTE_ABGR";
        EPixelFormats[EPixelFormats["BYTE_ARGB"] = EPixelFormats.A8R8G8B8] = "BYTE_ARGB";

        EPixelFormats[EPixelFormats["A2R10G10B10"] = 15] = "A2R10G10B10";
        EPixelFormats[EPixelFormats["A2B10G10R10"] = 16] = "A2B10G10R10";

        EPixelFormats[EPixelFormats["DXT1"] = 17] = "DXT1";
        EPixelFormats[EPixelFormats["DXT2"] = 18] = "DXT2";
        EPixelFormats[EPixelFormats["DXT3"] = 19] = "DXT3";
        EPixelFormats[EPixelFormats["DXT4"] = 20] = "DXT4";
        EPixelFormats[EPixelFormats["DXT5"] = 21] = "DXT5";

        EPixelFormats[EPixelFormats["FLOAT16_R"] = 32] = "FLOAT16_R";
        EPixelFormats[EPixelFormats["FLOAT16_RGB"] = 22] = "FLOAT16_RGB";
        EPixelFormats[EPixelFormats["FLOAT16_RGBA"] = 23] = "FLOAT16_RGBA";
        EPixelFormats[EPixelFormats["FLOAT32_R"] = 33] = "FLOAT32_R";
        EPixelFormats[EPixelFormats["FLOAT32_RGB"] = 24] = "FLOAT32_RGB";
        EPixelFormats[EPixelFormats["FLOAT32_RGBA"] = 25] = "FLOAT32_RGBA";
        EPixelFormats[EPixelFormats["FLOAT16_GR"] = 35] = "FLOAT16_GR";
        EPixelFormats[EPixelFormats["FLOAT32_GR"] = 36] = "FLOAT32_GR";

        EPixelFormats[EPixelFormats["FLOAT32_DEPTH"] = 29] = "FLOAT32_DEPTH";
        EPixelFormats[EPixelFormats["DEPTH8"] = 44] = "DEPTH8";
        EPixelFormats[EPixelFormats["BYTE_DEPTH"] = EPixelFormats.DEPTH8] = "BYTE_DEPTH";

        EPixelFormats[EPixelFormats["DEPTH16"] = 45] = "DEPTH16";
        EPixelFormats[EPixelFormats["SHORT_DEPTH"] = EPixelFormats.DEPTH16] = "SHORT_DEPTH";
        EPixelFormats[EPixelFormats["DEPTH32"] = 46] = "DEPTH32";
        EPixelFormats[EPixelFormats["DEPTH24STENCIL8"] = 47] = "DEPTH24STENCIL8";

        EPixelFormats[EPixelFormats["SHORT_RGBA"] = 30] = "SHORT_RGBA";
        EPixelFormats[EPixelFormats["SHORT_GR"] = 34] = "SHORT_GR";
        EPixelFormats[EPixelFormats["SHORT_RGB"] = 37] = "SHORT_RGB";

        EPixelFormats[EPixelFormats["PVRTC_RGB2"] = 38] = "PVRTC_RGB2";
        EPixelFormats[EPixelFormats["PVRTC_RGBA2"] = 39] = "PVRTC_RGBA2";
        EPixelFormats[EPixelFormats["PVRTC_RGB4"] = 40] = "PVRTC_RGB4";
        EPixelFormats[EPixelFormats["PVRTC_RGBA4"] = 41] = "PVRTC_RGBA4";

        EPixelFormats[EPixelFormats["R8"] = 42] = "R8";
        EPixelFormats[EPixelFormats["RG8"] = 43] = "RG8";
        EPixelFormats[EPixelFormats["TOTAL"] = 48] = "TOTAL";
    })(akra.EPixelFormats || (akra.EPixelFormats = {}));
    var EPixelFormats = akra.EPixelFormats;
    ;

    /**
    * Flags defining some on/off properties of pixel formats
    */
    (function (EPixelFormatFlags) {
        // This format has an alpha channel
        EPixelFormatFlags[EPixelFormatFlags["HASALPHA"] = 0x00000001] = "HASALPHA";

        // This format is compressed. This invalidates the values in elemBytes,
        // elemBits and the bit counts as these might not be fixed in a compressed format.
        EPixelFormatFlags[EPixelFormatFlags["COMPRESSED"] = 0x00000002] = "COMPRESSED";

        // This is a floating point format
        EPixelFormatFlags[EPixelFormatFlags["FLOAT"] = 0x00000004] = "FLOAT";

        // This is a depth format (for depth textures)
        EPixelFormatFlags[EPixelFormatFlags["DEPTH"] = 0x00000008] = "DEPTH";

        // Format is in native endian. Generally true for the 16, 24 and 32 bits
        // formats which can be represented as machine integers.
        EPixelFormatFlags[EPixelFormatFlags["NATIVEENDIAN"] = 0x00000010] = "NATIVEENDIAN";

        // This is an intensity format instead of a RGB one. The luminance
        // replaces R,G and B. (but not A)
        EPixelFormatFlags[EPixelFormatFlags["LUMINANCE"] = 0x00000020] = "LUMINANCE";
        EPixelFormatFlags[EPixelFormatFlags["STENCIL"] = 0x00000040] = "STENCIL";
    })(akra.EPixelFormatFlags || (akra.EPixelFormatFlags = {}));
    var EPixelFormatFlags = akra.EPixelFormatFlags;

    /** Pixel component format */
    (function (EPixelComponentTypes) {
        EPixelComponentTypes[EPixelComponentTypes["BYTE"] = 0] = "BYTE";
        EPixelComponentTypes[EPixelComponentTypes["SHORT"] = 1] = "SHORT";
        EPixelComponentTypes[EPixelComponentTypes["INT"] = 2] = "INT";
        EPixelComponentTypes[EPixelComponentTypes["FLOAT16"] = 3] = "FLOAT16";
        EPixelComponentTypes[EPixelComponentTypes["FLOAT32"] = 4] = "FLOAT32";
        EPixelComponentTypes[EPixelComponentTypes["COUNT"] = 5] = "COUNT";
    })(akra.EPixelComponentTypes || (akra.EPixelComponentTypes = {}));
    var EPixelComponentTypes = akra.EPixelComponentTypes;
    ;

    //used in pixelBox::scale()...
    (function (EFilters) {
        EFilters[EFilters["NEAREST"] = 0] = "NEAREST";
        EFilters[EFilters["LINEAR"] = 1] = "LINEAR";
        EFilters[EFilters["BILINEAR"] = 2] = "BILINEAR";
        EFilters[EFilters["BOX"] = 3] = "BOX";
        EFilters[EFilters["TRIANGLE"] = 4] = "TRIANGLE";
        EFilters[EFilters["BICUBIC"] = 5] = "BICUBIC";
    })(akra.EFilters || (akra.EFilters = {}));
    var EFilters = akra.EFilters;
})(akra || (akra = {}));
//# sourceMappingURL=EPixelFormats.js.map
