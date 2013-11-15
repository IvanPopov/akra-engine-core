// AIMesh interface
// [write description here...]
/// <reference path="AIRenderData.ts" />
/// <reference path="AIEventProvider.ts" />
/// <reference path="AIHardwareBuffer.ts" />
/// <reference path="AIRenderDataCollection.ts" />
/// <reference path="AISkeleton.ts" />
/// <reference path="AIRect3d.ts" />
/// <reference path="AISphere.ts" />
/// <reference path="AIMeshSubset.ts" />
/// <reference path="AISceneNode.ts" />
/// <reference path="AISceneModel.ts" />
/// <reference path="AISkin.ts" />
var AEMeshOptions;
(function (AEMeshOptions) {
    AEMeshOptions[AEMeshOptions["HB_READABLE"] = AEHardwareBufferFlags.READABLE] = "HB_READABLE";
    AEMeshOptions[AEMeshOptions["RD_ADVANCED_INDEX"] = AERenderDataOptions.ADVANCED_INDEX] = "RD_ADVANCED_INDEX";
})(AEMeshOptions || (AEMeshOptions = {}));
;

var AEMeshCloneOptions;
(function (AEMeshCloneOptions) {
    AEMeshCloneOptions[AEMeshCloneOptions["GEOMETRY_ONLY"] = 0x00] = "GEOMETRY_ONLY";
    AEMeshCloneOptions[AEMeshCloneOptions["SHARED_GEOMETRY"] = 0x01] = "SHARED_GEOMETRY";
})(AEMeshCloneOptions || (AEMeshCloneOptions = {}));
;
//# sourceMappingURL=AIMesh.js.map
