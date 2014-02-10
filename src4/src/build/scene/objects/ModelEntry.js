/// <reference path="../../idl/IModelEntry.ts" />
/// <reference path="../SceneNode.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (scene) {
        (function (objects) {
            var ModelEntry = (function (_super) {
                __extends(ModelEntry, _super);
                function ModelEntry(pScene, pModel) {
                    _super.call(this, pScene, 6 /* MODEL_ENTRY */);
                    this._pModelResource = null;

                    this._pModelResource = pModel;
                }
                ModelEntry.prototype.getResource = function () {
                    return this._pModelResource;
                };

                ModelEntry.isModelEntry = function (pEntity) {
                    return !akra.isNull(pEntity) && pEntity.getType() === 6 /* MODEL_ENTRY */;
                };
                return ModelEntry;
            })(akra.scene.SceneNode);
            objects.ModelEntry = ModelEntry;
        })(scene.objects || (scene.objects = {}));
        var objects = scene.objects;
    })(akra.scene || (akra.scene = {}));
    var scene = akra.scene;
})(akra || (akra = {}));
//# sourceMappingURL=ModelEntry.js.map
