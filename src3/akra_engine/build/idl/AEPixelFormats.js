var AEPixelFormats;
(function (AEPixelFormats) {
    AEPixelFormats[AEPixelFormats["UNKNOWN"] = 0] = "UNKNOWN";

    AEPixelFormats[AEPixelFormats["L8"] = 1] = "L8";
    AEPixelFormats[AEPixelFormats["BYTE_L"] = AEPixelFormats.L8] = "BYTE_L";
    AEPixelFormats[AEPixelFormats["L16"] = 2] = "L16";
    AEPixelFormats[AEPixelFormats["SHORT_L"] = AEPixelFormats.L16] = "SHORT_L";
    AEPixelFormats[AEPixelFormats["A8"] = 3] = "A8";
    AEPixelFormats[AEPixelFormats["BYTE_A"] = AEPixelFormats.A8] = "BYTE_A";
    AEPixelFormats[AEPixelFormats["A4L4"] = 4] = "A4L4";
    AEPixelFormats[AEPixelFormats["BYTE_LA"] = 5] = "BYTE_LA";

    AEPixelFormats[AEPixelFormats["R5G6B5"] = 6] = "R5G6B5";
    AEPixelFormats[AEPixelFormats["B5G6R5"] = 7] = "B5G6R5";
    AEPixelFormats[AEPixelFormats["R3G3B2"] = 31] = "R3G3B2";
    AEPixelFormats[AEPixelFormats["A4R4G4B4"] = 8] = "A4R4G4B4";
    AEPixelFormats[AEPixelFormats["A1R5G5B5"] = 9] = "A1R5G5B5";
    AEPixelFormats[AEPixelFormats["R8G8B8"] = 10] = "R8G8B8";
    AEPixelFormats[AEPixelFormats["B8G8R8"] = 11] = "B8G8R8";
    AEPixelFormats[AEPixelFormats["A8R8G8B8"] = 12] = "A8R8G8B8";
    AEPixelFormats[AEPixelFormats["A8B8G8R8"] = 13] = "A8B8G8R8";
    AEPixelFormats[AEPixelFormats["B8G8R8A8"] = 14] = "B8G8R8A8";
    AEPixelFormats[AEPixelFormats["R8G8B8A8"] = 28] = "R8G8B8A8";

    AEPixelFormats[AEPixelFormats["X8R8G8B8"] = 26] = "X8R8G8B8";
    AEPixelFormats[AEPixelFormats["X8B8G8R8"] = 27] = "X8B8G8R8";

    AEPixelFormats[AEPixelFormats["BYTE_RGB"] = AEPixelFormats.R8G8B8] = "BYTE_RGB";
    AEPixelFormats[AEPixelFormats["BYTE_BGR"] = AEPixelFormats.B8G8R8] = "BYTE_BGR";
    AEPixelFormats[AEPixelFormats["BYTE_BGRA"] = AEPixelFormats.B8G8R8A8] = "BYTE_BGRA";
    AEPixelFormats[AEPixelFormats["BYTE_RGBA"] = AEPixelFormats.R8G8B8A8] = "BYTE_RGBA";

    AEPixelFormats[AEPixelFormats["BYTE_ABGR"] = AEPixelFormats.A8B8G8R8] = "BYTE_ABGR";
    AEPixelFormats[AEPixelFormats["BYTE_ARGB"] = AEPixelFormats.A8R8G8B8] = "BYTE_ARGB";

    AEPixelFormats[AEPixelFormats["A2R10G10B10"] = 15] = "A2R10G10B10";
    AEPixelFormats[AEPixelFormats["A2B10G10R10"] = 16] = "A2B10G10R10";

    AEPixelFormats[AEPixelFormats["DXT1"] = 17] = "DXT1";
    AEPixelFormats[AEPixelFormats["DXT2"] = 18] = "DXT2";
    AEPixelFormats[AEPixelFormats["DXT3"] = 19] = "DXT3";
    AEPixelFormats[AEPixelFormats["DXT4"] = 20] = "DXT4";
    AEPixelFormats[AEPixelFormats["DXT5"] = 21] = "DXT5";

    AEPixelFormats[AEPixelFormats["FLOAT16_R"] = 32] = "FLOAT16_R";
    AEPixelFormats[AEPixelFormats["FLOAT16_RGB"] = 22] = "FLOAT16_RGB";
    AEPixelFormats[AEPixelFormats["FLOAT16_RGBA"] = 23] = "FLOAT16_RGBA";
    AEPixelFormats[AEPixelFormats["FLOAT32_R"] = 33] = "FLOAT32_R";
    AEPixelFormats[AEPixelFormats["FLOAT32_RGB"] = 24] = "FLOAT32_RGB";
    AEPixelFormats[AEPixelFormats["FLOAT32_RGBA"] = 25] = "FLOAT32_RGBA";
    AEPixelFormats[AEPixelFormats["FLOAT16_GR"] = 35] = "FLOAT16_GR";
    AEPixelFormats[AEPixelFormats["FLOAT32_GR"] = 36] = "FLOAT32_GR";

    AEPixelFormats[AEPixelFormats["FLOAT32_DEPTH"] = 29] = "FLOAT32_DEPTH";
    AEPixelFormats[AEPixelFormats["DEPTH8"] = 44] = "DEPTH8";
    AEPixelFormats[AEPixelFormats["BYTE_DEPTH"] = AEPixelFormats.DEPTH8] = "BYTE_DEPTH";

    AEPixelFormats[AEPixelFormats["DEPTH16"] = 45] = "DEPTH16";
    AEPixelFormats[AEPixelFormats["SHORT_DEPTH"] = AEPixelFormats.DEPTH16] = "SHORT_DEPTH";
    AEPixelFormats[AEPixelFormats["DEPTH32"] = 46] = "DEPTH32";
    AEPixelFormats[AEPixelFormats["DEPTH24STENCIL8"] = 47] = "DEPTH24STENCIL8";

    AEPixelFormats[AEPixelFormats["SHORT_RGBA"] = 30] = "SHORT_RGBA";
    AEPixelFormats[AEPixelFormats["SHORT_GR"] = 34] = "SHORT_GR";
    AEPixelFormats[AEPixelFormats["SHORT_RGB"] = 37] = "SHORT_RGB";

    AEPixelFormats[AEPixelFormats["PVRTC_RGB2"] = 38] = "PVRTC_RGB2";
    AEPixelFormats[AEPixelFormats["PVRTC_RGBA2"] = 39] = "PVRTC_RGBA2";
    AEPixelFormats[AEPixelFormats["PVRTC_RGB4"] = 40] = "PVRTC_RGB4";
    AEPixelFormats[AEPixelFormats["PVRTC_RGBA4"] = 41] = "PVRTC_RGBA4";

    AEPixelFormats[AEPixelFormats["R8"] = 42] = "R8";
    AEPixelFormats[AEPixelFormats["RG8"] = 43] = "RG8";
    AEPixelFormats[AEPixelFormats["TOTAL"] = 48] = "TOTAL";
})(AEPixelFormats || (AEPixelFormats = {}));
;

/**
* Flags defining some on/off properties of pixel formats
*/
var AEPixelFormatFlags;
(function (AEPixelFormatFlags) {
    // This format has an alpha channel
    AEPixelFormatFlags[AEPixelFormatFlags["HASALPHA"] = 0x00000001] = "HASALPHA";

    // This format is compressed. This invalidates the values in elemBytes,
    // elemBits and the bit counts as these might not be fixed in a compressed format.
    AEPixelFormatFlags[AEPixelFormatFlags["COMPRESSED"] = 0x00000002] = "COMPRESSED";

    // This is a floating point format
    AEPixelFormatFlags[AEPixelFormatFlags["FLOAT"] = 0x00000004] = "FLOAT";

    // This is a depth format (for depth textures)
    AEPixelFormatFlags[AEPixelFormatFlags["DEPTH"] = 0x00000008] = "DEPTH";

    // Format is in native endian. Generally true for the 16, 24 and 32 bits
    // formats which can be represented as machine integers.
    AEPixelFormatFlags[AEPixelFormatFlags["NATIVEENDIAN"] = 0x00000010] = "NATIVEENDIAN";

    // This is an intensity format instead of a RGB one. The luminance
    // replaces R,G and B. (but not A)
    AEPixelFormatFlags[AEPixelFormatFlags["LUMINANCE"] = 0x00000020] = "LUMINANCE";
    AEPixelFormatFlags[AEPixelFormatFlags["STENCIL"] = 0x00000040] = "STENCIL";
})(AEPixelFormatFlags || (AEPixelFormatFlags = {}));

/** Pixel component format */
var AEPixelComponentTypes;
(function (AEPixelComponentTypes) {
    AEPixelComponentTypes[AEPixelComponentTypes["BYTE"] = 0] = "BYTE";
    AEPixelComponentTypes[AEPixelComponentTypes["SHORT"] = 1] = "SHORT";
    AEPixelComponentTypes[AEPixelComponentTypes["INT"] = 2] = "INT";
    AEPixelComponentTypes[AEPixelComponentTypes["FLOAT16"] = 3] = "FLOAT16";
    AEPixelComponentTypes[AEPixelComponentTypes["FLOAT32"] = 4] = "FLOAT32";
    AEPixelComponentTypes[AEPixelComponentTypes["COUNT"] = 5] = "COUNT";
})(AEPixelComponentTypes || (AEPixelComponentTypes = {}));
;

//used in pixelBox::scale()...
var AEFilters;
(function (AEFilters) {
    AEFilters[AEFilters["NEAREST"] = 0] = "NEAREST";
    AEFilters[AEFilters["LINEAR"] = 1] = "LINEAR";
    AEFilters[AEFilters["BILINEAR"] = 2] = "BILINEAR";
    AEFilters[AEFilters["BOX"] = 3] = "BOX";
    AEFilters[AEFilters["TRIANGLE"] = 4] = "TRIANGLE";
    AEFilters[AEFilters["BICUBIC"] = 5] = "BICUBIC";
})(AEFilters || (AEFilters = {}));
//# sourceMappingURL=AEPixelFormats.js.map
