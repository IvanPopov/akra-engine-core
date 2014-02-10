/// <reference path="IResourcePoolItem.ts" />
/// <reference path="IColor.ts" />
/// <reference path="IPixelBox.ts" />
/// <reference path="EPixelFormats.ts" />
var akra;
(function (akra) {
    (function (EImageFlags) {
        EImageFlags[EImageFlags["COMPRESSED"] = 0x00000001] = "COMPRESSED";
        EImageFlags[EImageFlags["CUBEMAP"] = 0x00000002] = "CUBEMAP";
        EImageFlags[EImageFlags["TEXTURE_3D"] = 0x00000004] = "TEXTURE_3D";
    })(akra.EImageFlags || (akra.EImageFlags = {}));
    var EImageFlags = akra.EImageFlags;

    (function (EImageCubeFlags) {
        EImageCubeFlags[EImageCubeFlags["POSITIVE_X"] = 0x00000001] = "POSITIVE_X";
        EImageCubeFlags[EImageCubeFlags["NEGATIVE_X"] = 0x00000002] = "NEGATIVE_X";
        EImageCubeFlags[EImageCubeFlags["POSITIVE_Y"] = 0x00000004] = "POSITIVE_Y";
        EImageCubeFlags[EImageCubeFlags["NEGATIVE_Y"] = 0x00000008] = "NEGATIVE_Y";
        EImageCubeFlags[EImageCubeFlags["POSITIVE_Z"] = 0x000000010] = "POSITIVE_Z";
        EImageCubeFlags[EImageCubeFlags["NEGATIVE_Z"] = 0x000000020] = "NEGATIVE_Z";
    })(akra.EImageCubeFlags || (akra.EImageCubeFlags = {}));
    var EImageCubeFlags = akra.EImageCubeFlags;
})(akra || (akra = {}));
//# sourceMappingURL=IImg.js.map
