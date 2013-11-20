// AITexture interface
// [write description here...]
/// <reference path="AIRenderResource.ts" />
/// <reference path="AIHardwareBuffer.ts" />
/// <reference path="AIPixelBuffer.ts" />
/// <reference path="AIImg.ts" />
/// <reference path="AEPixelFormats.ts" />
var AETextureFlags;
(function (AETextureFlags) {
    AETextureFlags[AETextureFlags["STATIC"] = 1 /* STATIC */] = "STATIC";
    AETextureFlags[AETextureFlags["DYNAMIC"] = 2 /* DYNAMIC */] = "DYNAMIC";
    AETextureFlags[AETextureFlags["READEBLE"] = 4 /* READABLE */] = "READEBLE";
    AETextureFlags[AETextureFlags["DYNAMIC_DISCARDABLE"] = AEHardwareBufferFlags.DYNAMIC_DISCARDABLE] = "DYNAMIC_DISCARDABLE";

    /// mipmaps will be automatically generated for this texture
    AETextureFlags[AETextureFlags["AUTOMIPMAP"] = 0x100] = "AUTOMIPMAP";

    /// this texture will be a render target, i.e. used as a target for render to texture
    /// setting this flag will ignore all other texture usages except AUTOMIPMAP
    AETextureFlags[AETextureFlags["RENDERTARGET"] = 0x200] = "RENDERTARGET";

    /// default to automatic mipmap generation static textures
    AETextureFlags[AETextureFlags["DEFAULT"] = AETextureFlags.STATIC] = "DEFAULT";
})(AETextureFlags || (AETextureFlags = {}));

var AETextureFilters;
(function (AETextureFilters) {
    AETextureFilters[AETextureFilters["UNDEF"] = 0x0000] = "UNDEF";
    AETextureFilters[AETextureFilters["NEAREST"] = 0x2600] = "NEAREST";
    AETextureFilters[AETextureFilters["LINEAR"] = 0x2601] = "LINEAR";
    AETextureFilters[AETextureFilters["NEAREST_MIPMAP_NEAREST"] = 0x2700] = "NEAREST_MIPMAP_NEAREST";
    AETextureFilters[AETextureFilters["LINEAR_MIPMAP_NEAREST"] = 0x2701] = "LINEAR_MIPMAP_NEAREST";
    AETextureFilters[AETextureFilters["NEAREST_MIPMAP_LINEAR"] = 0x2702] = "NEAREST_MIPMAP_LINEAR";
    AETextureFilters[AETextureFilters["LINEAR_MIPMAP_LINEAR"] = 0x2703] = "LINEAR_MIPMAP_LINEAR";
})(AETextureFilters || (AETextureFilters = {}));

var AETextureWrapModes;
(function (AETextureWrapModes) {
    AETextureWrapModes[AETextureWrapModes["UNDEF"] = 0x0000] = "UNDEF";
    AETextureWrapModes[AETextureWrapModes["REPEAT"] = 0x2901] = "REPEAT";
    AETextureWrapModes[AETextureWrapModes["CLAMP_TO_EDGE"] = 0x812F] = "CLAMP_TO_EDGE";
    AETextureWrapModes[AETextureWrapModes["MIRRORED_REPEAT"] = 0x8370] = "MIRRORED_REPEAT";
})(AETextureWrapModes || (AETextureWrapModes = {}));

var AETextureParameters;
(function (AETextureParameters) {
    AETextureParameters[AETextureParameters["MAG_FILTER"] = 0x2800] = "MAG_FILTER";
    AETextureParameters[AETextureParameters["MIN_FILTER"] = 10241] = "MIN_FILTER";
    AETextureParameters[AETextureParameters["WRAP_S"] = 10242] = "WRAP_S";
    AETextureParameters[AETextureParameters["WRAP_T"] = 10243] = "WRAP_T";
})(AETextureParameters || (AETextureParameters = {}));

var AETextureTypes;
(function (AETextureTypes) {
    AETextureTypes[AETextureTypes["TEXTURE_2D"] = 0x0DE1] = "TEXTURE_2D";
    AETextureTypes[AETextureTypes["TEXTURE_CUBE_MAP"] = 0x8513] = "TEXTURE_CUBE_MAP";
})(AETextureTypes || (AETextureTypes = {}));

var AECubeFace;
(function (AECubeFace) {
    AECubeFace[AECubeFace["POSITIVE_X"] = 0] = "POSITIVE_X";
    AECubeFace[AECubeFace["NEGATIVE_X"] = 1] = "NEGATIVE_X";
    AECubeFace[AECubeFace["POSITIVE_Y"] = 2] = "POSITIVE_Y";
    AECubeFace[AECubeFace["NEGATIVE_Y"] = 3] = "NEGATIVE_Y";
    AECubeFace[AECubeFace["POSITIVE_Z"] = 4] = "POSITIVE_Z";
    AECubeFace[AECubeFace["NEGATIVE_Z"] = 5] = "NEGATIVE_Z";
})(AECubeFace || (AECubeFace = {}));

var AETextureCubeFlags;
(function (AETextureCubeFlags) {
    AETextureCubeFlags[AETextureCubeFlags["POSITIVE_X"] = 0x00000001] = "POSITIVE_X";
    AETextureCubeFlags[AETextureCubeFlags["NEGATIVE_X"] = 0x00000002] = "NEGATIVE_X";
    AETextureCubeFlags[AETextureCubeFlags["POSITIVE_Y"] = 0x00000004] = "POSITIVE_Y";
    AETextureCubeFlags[AETextureCubeFlags["NEGATIVE_Y"] = 0x00000008] = "NEGATIVE_Y";
    AETextureCubeFlags[AETextureCubeFlags["POSITIVE_Z"] = 0x0000000c] = "POSITIVE_Z";
    AETextureCubeFlags[AETextureCubeFlags["NEGATIVE_Z"] = 0x000000010] = "NEGATIVE_Z";
})(AETextureCubeFlags || (AETextureCubeFlags = {}));

var AETextureUnits;
(function (AETextureUnits) {
    AETextureUnits[AETextureUnits["TEXTURE0"] = 0x84C0] = "TEXTURE0";
})(AETextureUnits || (AETextureUnits = {}));
//# sourceMappingURL=AITexture.js.map
