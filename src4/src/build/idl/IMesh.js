/// <reference path="IRenderData.ts" />
/// <reference path="IEventProvider.ts" />
/// <reference path="IHardwareBuffer.ts" />
/// <reference path="IRenderDataCollection.ts" />
/// <reference path="ISkeleton.ts" />
/// <reference path="IRect3d.ts" />
/// <reference path="ISphere.ts" />
/// <reference path="IMeshSubset.ts" />
/// <reference path="ISceneNode.ts" />
/// <reference path="ISceneModel.ts" />
/// <reference path="ISkin.ts" />
var akra;
(function (akra) {
    (function (EMeshOptions) {
        EMeshOptions[EMeshOptions["HB_READABLE"] = 4 /* READABLE */] = "HB_READABLE";
        EMeshOptions[EMeshOptions["RD_ADVANCED_INDEX"] = 65536 /* ADVANCED_INDEX */] = "RD_ADVANCED_INDEX";
    })(akra.EMeshOptions || (akra.EMeshOptions = {}));
    var EMeshOptions = akra.EMeshOptions;
    ;

    (function (EMeshCloneOptions) {
        EMeshCloneOptions[EMeshCloneOptions["GEOMETRY_ONLY"] = 0x00] = "GEOMETRY_ONLY";
        EMeshCloneOptions[EMeshCloneOptions["SHARED_GEOMETRY"] = 0x01] = "SHARED_GEOMETRY";
    })(akra.EMeshCloneOptions || (akra.EMeshCloneOptions = {}));
    var EMeshCloneOptions = akra.EMeshCloneOptions;
    ;
})(akra || (akra = {}));
//# sourceMappingURL=IMesh.js.map
