/// <reference path="../idl/ISceneObject.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="../idl/IRenderableObject.ts" />
    /// <reference path="../geometry/Rect3d.ts" />
    /// <reference path="../events.ts" />
    /// <reference path="SceneNode.ts" />
    (function (scene) {
        var ESceneObjectFlags;
        (function (ESceneObjectFlags) {
            ESceneObjectFlags[ESceneObjectFlags["k_NewLocalBounds"] = 0] = "k_NewLocalBounds";
            ESceneObjectFlags[ESceneObjectFlags["k_NewWorldBounds"] = 1] = "k_NewWorldBounds";
        })(ESceneObjectFlags || (ESceneObjectFlags = {}));
        ;

        var EObjectViewModes;
        (function (EObjectViewModes) {
            EObjectViewModes[EObjectViewModes["k_Shadows"] = 0x01] = "k_Shadows";
            EObjectViewModes[EObjectViewModes["k_Billboard"] = 0x02] = "k_Billboard";
        })(EObjectViewModes || (EObjectViewModes = {}));

        var SceneObject = (function (_super) {
            __extends(SceneObject, _super);
            function SceneObject(pScene, eType) {
                if (typeof eType === "undefined") { eType = 64 /* SCENE_OBJECT */; }
                _super.call(this, pScene, eType);
                this._iObjectFlags = 0;
                this._pLocalBounds = new akra.geometry.Rect3d();
                this._pWorldBounds = new akra.geometry.Rect3d();
                this._iViewModes = 0;
            }
            SceneObject.prototype.setupSignals = function () {
                this.worldBoundsUpdated = this.worldBoundsUpdated || new akra.Signal(this, 0 /* UNICAST */);

                this.click = this.click || new akra.Signal(this);

                this.mousemove = this.mousemove || new akra.Signal(this);
                this.mousedown = this.mousedown || new akra.Signal(this);
                this.mouseup = this.mouseup || new akra.Signal(this);
                this.mouseover = this.mouseover || new akra.Signal(this);
                this.mouseout = this.mouseout || new akra.Signal(this);

                this.dragstart = this.dragstart || new akra.Signal(this);
                this.dragstop = this.dragstop || new akra.Signal(this);
                this.dragging = this.dragging || new akra.Signal(this);

                _super.prototype.setupSignals.call(this);
            };

            SceneObject.prototype.getTotalRenderable = function () {
                return 0;
            };

            SceneObject.prototype.getWorldBounds = function () {
                return this._pWorldBounds;
            };

            //setWorldBounds(pBox: IRect3d): void {
            //	this._pWorldBounds = pBox;
            //}
            SceneObject.prototype.getLocalBounds = function () {
                return this._pLocalBounds;
            };

            SceneObject.prototype.accessLocalBounds = function () {
                this._iObjectFlags = akra.bf.setBit(this._iObjectFlags, 0 /* k_NewLocalBounds */);
                return this._pLocalBounds;
            };

            SceneObject.prototype.getShadow = function () {
                return (this._iViewModes & 1 /* k_Shadows */) != 0;
            };

            SceneObject.prototype.setShadow = function (bValue) {
                this._iViewModes = bValue ? akra.bf.setAll(this._iViewModes, 1 /* k_Shadows */) : akra.bf.clearAll(this._iViewModes, 1 /* k_Shadows */);

                for (var i = 0; i < this.getTotalRenderable(); i++) {
                    this.getRenderable(i).setShadow(bValue);
                }
            };

            SceneObject.prototype.setBillboard = function (bValue) {
                this._iViewModes = bValue ? akra.bf.setAll(this._iViewModes, 2 /* k_Billboard */) : akra.bf.clearAll(this._iViewModes, 2 /* k_Billboard */);
            };

            SceneObject.prototype.getBillboard = function () {
                return (this._iViewModes & 2 /* k_Billboard */) != 0;
            };

            SceneObject.prototype.getRenderable = function (i) {
                return null;
            };

            SceneObject.prototype.isWorldBoundsNew = function () {
                return akra.bf.testBit(this._iObjectFlags, 0 /* k_NewLocalBounds */);
            };

            SceneObject.prototype.destroy = function () {
                _super.prototype.destroy.call(this);
            };

            SceneObject.prototype.prepareForUpdate = function () {
                _super.prototype.prepareForUpdate.call(this);

                this._iObjectFlags = akra.bf.clearAll(this._iObjectFlags, akra.bf.flag(0 /* k_NewLocalBounds */) | akra.bf.flag(1 /* k_NewWorldBounds */));
            };

            SceneObject.prototype.update = function () {
                //если, обновится мировая матрица узла, то и AABB обновится
                _super.prototype.update.call(this);

                // do we need to update our local matrix?
                // derived classes update the local matrix
                // then call this base function to complete
                // the update
                return this.recalcWorldBounds();
            };

            SceneObject.prototype.recalcWorldBounds = function () {
                // nodes only get their bounds updated
                // as nessesary
                if ((akra.bf.testBit(this._iObjectFlags, 0 /* k_NewLocalBounds */) || this.isWorldMatrixNew())) {
                    // transform our local rectangle
                    // by the current world matrix
                    this._pWorldBounds.set(this._pLocalBounds);

                    // make sure we have some degree of thickness
                    if (true) {
                        this._pWorldBounds.x1 = Math.max(this._pWorldBounds.x1, this._pWorldBounds.x0 + 0.01);
                        this._pWorldBounds.y1 = Math.max(this._pWorldBounds.y1, this._pWorldBounds.y0 + 0.01);
                        this._pWorldBounds.z1 = Math.max(this._pWorldBounds.z1, this._pWorldBounds.z0 + 0.01);
                    }
                    this._pWorldBounds.transform(this.getWorldMatrix());

                    // set the flag that our bounding box has changed
                    this._iObjectFlags = akra.bf.setBit(this._iObjectFlags, 1 /* k_NewWorldBounds */);

                    this.worldBoundsUpdated.emit();

                    return true;
                }

                return false;
            };

            SceneObject.prototype.isBillboard = function () {
                return this.getBillboard();
            };

            SceneObject.prototype.getObjectFlags = function () {
                return this._iObjectFlags;
            };

            SceneObject.prototype.prepareForRender = function (pViewport) {
            };

            SceneObject.prototype.toString = function (isRecursive, iDepth) {
                if (typeof isRecursive === "undefined") { isRecursive = false; }
                if (typeof iDepth === "undefined") { iDepth = 0; }
                if (akra.config.DEBUG) {
                    if (!isRecursive) {
                        return "<scene_object" + (this._sName ? " " + this._sName : "") + ">";
                    }

                    return _super.prototype.toString.call(this, isRecursive, iDepth);
                }

                return null;
            };

            SceneObject.isSceneObject = function (pEntity) {
                return !akra.isNull(pEntity) && pEntity.getType() >= 64 /* SCENE_OBJECT */ && pEntity.getType() < 128 /* OBJECTS_LIMIT */;
            };
            return SceneObject;
        })(akra.scene.SceneNode);
        scene.SceneObject = SceneObject;
    })(akra.scene || (akra.scene = {}));
    var scene = akra.scene;
})(akra || (akra = {}));
//# sourceMappingURL=SceneObject.js.map
