// AIImg interface
// [write description here...]
/// <reference path="AIResourcePoolItem.ts" />
/// <reference path="AIColor.ts" />
/// <reference path="AIPixelBox.ts" />
/// <reference path="AEPixelFormats.ts" />
var AEImageFlags;
(function (AEImageFlags) {
    AEImageFlags[AEImageFlags["COMPRESSED"] = 0x00000001] = "COMPRESSED";
    AEImageFlags[AEImageFlags["CUBEMAP"] = 0x00000002] = "CUBEMAP";
    AEImageFlags[AEImageFlags["TEXTURE_3D"] = 0x00000004] = "TEXTURE_3D";
})(AEImageFlags || (AEImageFlags = {}));

var AEImageCubeFlags;
(function (AEImageCubeFlags) {
    AEImageCubeFlags[AEImageCubeFlags["POSITIVE_X"] = 0x00000001] = "POSITIVE_X";
    AEImageCubeFlags[AEImageCubeFlags["NEGATIVE_X"] = 0x00000002] = "NEGATIVE_X";
    AEImageCubeFlags[AEImageCubeFlags["POSITIVE_Y"] = 0x00000004] = "POSITIVE_Y";
    AEImageCubeFlags[AEImageCubeFlags["NEGATIVE_Y"] = 0x00000008] = "NEGATIVE_Y";
    AEImageCubeFlags[AEImageCubeFlags["POSITIVE_Z"] = 0x000000010] = "POSITIVE_Z";
    AEImageCubeFlags[AEImageCubeFlags["NEGATIVE_Z"] = 0x000000020] = "NEGATIVE_Z";
})(AEImageCubeFlags || (AEImageCubeFlags = {}));
//# sourceMappingURL=AIImg.js.map
