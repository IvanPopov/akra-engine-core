/// <reference path="IRenderResource.ts" />
/// <reference path="IHardwareBuffer.ts" />
/// <reference path="IPixelBuffer.ts" />
/// <reference path="IImg.ts" />
/// <reference path="EPixelFormats.ts" />
var akra;
(function (akra) {
    (function (ETextureFlags) {
        ETextureFlags[ETextureFlags["STATIC"] = 1 /* STATIC */] = "STATIC";
        ETextureFlags[ETextureFlags["DYNAMIC"] = 2 /* DYNAMIC */] = "DYNAMIC";
        ETextureFlags[ETextureFlags["READEBLE"] = 4 /* READABLE */] = "READEBLE";
        ETextureFlags[ETextureFlags["DYNAMIC_DISCARDABLE"] = 66 /* DYNAMIC_DISCARDABLE */] = "DYNAMIC_DISCARDABLE";

        /// mipmaps will be automatically generated for this texture
        ETextureFlags[ETextureFlags["AUTOMIPMAP"] = 0x100] = "AUTOMIPMAP";

        /// this texture will be a render target, i.e. used as a target for render to texture
        /// setting this flag will ignore all other texture usages except AUTOMIPMAP
        ETextureFlags[ETextureFlags["RENDERTARGET"] = 0x200] = "RENDERTARGET";

        /// default to automatic mipmap generation static textures
        ETextureFlags[ETextureFlags["DEFAULT"] = ETextureFlags.STATIC] = "DEFAULT";
    })(akra.ETextureFlags || (akra.ETextureFlags = {}));
    var ETextureFlags = akra.ETextureFlags;

    (function (ETextureFilters) {
        ETextureFilters[ETextureFilters["UNDEF"] = 0x0000] = "UNDEF";
        ETextureFilters[ETextureFilters["NEAREST"] = 0x2600] = "NEAREST";
        ETextureFilters[ETextureFilters["LINEAR"] = 0x2601] = "LINEAR";
        ETextureFilters[ETextureFilters["NEAREST_MIPMAP_NEAREST"] = 0x2700] = "NEAREST_MIPMAP_NEAREST";
        ETextureFilters[ETextureFilters["LINEAR_MIPMAP_NEAREST"] = 0x2701] = "LINEAR_MIPMAP_NEAREST";
        ETextureFilters[ETextureFilters["NEAREST_MIPMAP_LINEAR"] = 0x2702] = "NEAREST_MIPMAP_LINEAR";
        ETextureFilters[ETextureFilters["LINEAR_MIPMAP_LINEAR"] = 0x2703] = "LINEAR_MIPMAP_LINEAR";
    })(akra.ETextureFilters || (akra.ETextureFilters = {}));
    var ETextureFilters = akra.ETextureFilters;

    (function (ETextureWrapModes) {
        ETextureWrapModes[ETextureWrapModes["UNDEF"] = 0x0000] = "UNDEF";
        ETextureWrapModes[ETextureWrapModes["REPEAT"] = 0x2901] = "REPEAT";
        ETextureWrapModes[ETextureWrapModes["CLAMP_TO_EDGE"] = 0x812F] = "CLAMP_TO_EDGE";
        ETextureWrapModes[ETextureWrapModes["MIRRORED_REPEAT"] = 0x8370] = "MIRRORED_REPEAT";
    })(akra.ETextureWrapModes || (akra.ETextureWrapModes = {}));
    var ETextureWrapModes = akra.ETextureWrapModes;

    (function (ETextureParameters) {
        ETextureParameters[ETextureParameters["MAG_FILTER"] = 0x2800] = "MAG_FILTER";
        ETextureParameters[ETextureParameters["MIN_FILTER"] = 10241] = "MIN_FILTER";
        ETextureParameters[ETextureParameters["WRAP_S"] = 10242] = "WRAP_S";
        ETextureParameters[ETextureParameters["WRAP_T"] = 10243] = "WRAP_T";
    })(akra.ETextureParameters || (akra.ETextureParameters = {}));
    var ETextureParameters = akra.ETextureParameters;

    (function (ETextureTypes) {
        ETextureTypes[ETextureTypes["TEXTURE_2D"] = 0x0DE1] = "TEXTURE_2D";
        ETextureTypes[ETextureTypes["TEXTURE_CUBE_MAP"] = 0x8513] = "TEXTURE_CUBE_MAP";
    })(akra.ETextureTypes || (akra.ETextureTypes = {}));
    var ETextureTypes = akra.ETextureTypes;

    (function (ECubeFace) {
        ECubeFace[ECubeFace["POSITIVE_X"] = 0] = "POSITIVE_X";
        ECubeFace[ECubeFace["NEGATIVE_X"] = 1] = "NEGATIVE_X";
        ECubeFace[ECubeFace["POSITIVE_Y"] = 2] = "POSITIVE_Y";
        ECubeFace[ECubeFace["NEGATIVE_Y"] = 3] = "NEGATIVE_Y";
        ECubeFace[ECubeFace["POSITIVE_Z"] = 4] = "POSITIVE_Z";
        ECubeFace[ECubeFace["NEGATIVE_Z"] = 5] = "NEGATIVE_Z";
    })(akra.ECubeFace || (akra.ECubeFace = {}));
    var ECubeFace = akra.ECubeFace;

    (function (ETextureCubeFlags) {
        ETextureCubeFlags[ETextureCubeFlags["POSITIVE_X"] = 0x00000001] = "POSITIVE_X";
        ETextureCubeFlags[ETextureCubeFlags["NEGATIVE_X"] = 0x00000002] = "NEGATIVE_X";
        ETextureCubeFlags[ETextureCubeFlags["POSITIVE_Y"] = 0x00000004] = "POSITIVE_Y";
        ETextureCubeFlags[ETextureCubeFlags["NEGATIVE_Y"] = 0x00000008] = "NEGATIVE_Y";
        ETextureCubeFlags[ETextureCubeFlags["POSITIVE_Z"] = 0x0000000c] = "POSITIVE_Z";
        ETextureCubeFlags[ETextureCubeFlags["NEGATIVE_Z"] = 0x000000010] = "NEGATIVE_Z";
    })(akra.ETextureCubeFlags || (akra.ETextureCubeFlags = {}));
    var ETextureCubeFlags = akra.ETextureCubeFlags;

    (function (ETextureUnits) {
        ETextureUnits[ETextureUnits["TEXTURE0"] = 0x84C0] = "TEXTURE0";
    })(akra.ETextureUnits || (akra.ETextureUnits = {}));
    var ETextureUnits = akra.ETextureUnits;

    
})(akra || (akra = {}));
//# sourceMappingURL=ITexture.js.map
