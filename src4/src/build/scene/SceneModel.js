/// <reference path="../idl/ISceneModel.ts" />
/// <reference path="../idl/IMesh.ts" />
/// <reference path="../idl/IMeshSubset.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="../model/Mesh.ts" />
    /// <reference path="SceneObject.ts" />
    (function (scene) {
        var SceneModel = (function (_super) {
            __extends(SceneModel, _super);
            function SceneModel(pScene) {
                _super.call(this, pScene, 65 /* MODEL */);
                this._pMesh = null;
                this._bShow = true;
            }
            SceneModel.prototype.getVisible = function () {
                return this._bShow;
            };

            SceneModel.prototype.setVisible = function (bValue) {
                this._bShow = bValue;
            };

            SceneModel.prototype.getMesh = function () {
                return this._pMesh;
            };

            SceneModel.prototype.setMesh = function (pMesh) {
                if (!akra.isNull(this._pMesh)) {
                    this.accessLocalBounds().set(0.01, 0.01, 0.01);
                    this.getScene().postUpdate.disconnect(this._pMesh, this._pMesh.update);

                    //this._pMesh.disconnect(this.scene, SIGNAL(postUpdate), SLOT(update));
                    this._pMesh = null;
                }

                if (!akra.isNull(pMesh)) {
                    this.accessLocalBounds().set(pMesh.getBoundingBox());
                    this._pMesh = pMesh;

                    //FIXME: event handing used out of object, bad practice..
                    this.getScene().postUpdate.connect(this._pMesh, this._pMesh.update);
                    //pMesh.connect(this.scene, SIGNAL(postUpdate), SLOT(update));
                }
            };

            SceneModel.prototype.getTotalRenderable = function () {
                return akra.isNull(this._pMesh) || !this._bShow ? 0 : this._pMesh.getLength();
            };

            SceneModel.prototype.getRenderable = function (i) {
                if (typeof i === "undefined") { i = 0; }
                if (akra.isNull(this._pMesh)) {
                    akra.logger.warn(this);
                }
                return this._pMesh.getSubset(i);
            };

            SceneModel.prototype.getShadow = function () {
                return this._pMesh.getShadow();
            };

            SceneModel.prototype.setShadow = function (bValue) {
                this._pMesh.setShadow(bValue);
            };

            SceneModel.prototype.isVisible = function () {
                return this._bShow;
            };

            SceneModel.prototype.toString = function (isRecursive, iDepth) {
                if (typeof isRecursive === "undefined") { isRecursive = false; }
                if (typeof iDepth === "undefined") { iDepth = 0; }
                if (akra.config.DEBUG) {
                    if (!isRecursive) {
                        var sData = "<model" + (this.getName() ? " " + this.getName() : "") + "(" + (akra.isNull(this._pMesh) ? 0 : this._pMesh.getLength()) + ")" + '>';

                        if (!akra.isNull(this._pMesh)) {
                            sData += "( " + this._pMesh.getName() + " )";
                        }

                        return sData;
                    }

                    return _super.prototype.toString.call(this, isRecursive, iDepth);
                }

                return null;
            };

            SceneModel.isModel = function (pEntity) {
                return !akra.isNull(pEntity) && pEntity.getType() === 65 /* MODEL */;
            };
            return SceneModel;
        })(akra.scene.SceneObject);
        scene.SceneModel = SceneModel;
    })(akra.scene || (akra.scene = {}));
    var scene = akra.scene;
})(akra || (akra = {}));
//# sourceMappingURL=SceneModel.js.map
