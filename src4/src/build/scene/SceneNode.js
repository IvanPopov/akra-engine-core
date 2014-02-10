/// <reference path="../idl/IEngine.ts" />
/// <reference path="../idl/IScene3d.ts" />
/// <reference path="../idl/ISceneNode.ts" />
/// <reference path="../idl/IAnimationController.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="../bf/bf.ts" />
    /// <reference path="../math/math.ts" />
    /// <reference path="Node.ts" />
    (function (scene) {
        var Mat4 = akra.math.Mat4;
        var Mat3 = akra.math.Mat3;
        var Vec3 = akra.math.Vec3;
        var Vec4 = akra.math.Vec4;
        var Quat4 = akra.math.Quat4;

        var SceneNode = (function (_super) {
            __extends(SceneNode, _super);
            function SceneNode(pScene, eType) {
                if (typeof eType === "undefined") { eType = 3 /* SCENE_NODE */; }
                _super.call(this, eType);
                this._pScene = null;
                this._pAnimationControllers = null;
                this._iSceneNodeFlags = 0;

                this._pScene = pScene;
            }
            SceneNode.prototype.setupSignals = function () {
                this.frozen = this.frozen || new akra.Signal(this);
                this.hidden = this.hidden || new akra.Signal(this);

                _super.prototype.setupSignals.call(this);
            };

            SceneNode.prototype.getScene = function () {
                return this._pScene;
            };

            SceneNode.prototype.getTotalControllers = function () {
                return this._pAnimationControllers ? this._pAnimationControllers.length : 0;
            };

            SceneNode.prototype.getController = function (i) {
                if (typeof i === "undefined") { i = 0; }
                return akra.isNull(this._pAnimationControllers) || this._pAnimationControllers.length <= i ? null : this._pAnimationControllers[i];
            };

            SceneNode.prototype.addController = function (pController) {
                if (akra.isNull(this._pAnimationControllers)) {
                    this._pAnimationControllers = [];
                }

                if (this._pAnimationControllers.indexOf(pController) != -1) {
                    return;
                }

                pController.attach(this);
                this._pAnimationControllers.push(pController);
            };

            SceneNode.prototype.isFrozen = function () {
                return akra.bf.testAny(this._iSceneNodeFlags, (akra.bf.flag(1 /* FROZEN_SELF */) | akra.bf.flag(0 /* FROZEN_PARENT */)));
            };

            SceneNode.prototype.isSelfFrozen = function () {
                return akra.bf.testBit(this._iSceneNodeFlags, 1 /* FROZEN_SELF */);
            };

            SceneNode.prototype.isParentFrozen = function () {
                return akra.bf.testBit(this._iSceneNodeFlags, 0 /* FROZEN_PARENT */);
            };

            SceneNode.prototype.freeze = function (bValue) {
                if (typeof bValue === "undefined") { bValue = true; }
                this._iSceneNodeFlags = akra.bf.setBit(this._iSceneNodeFlags, 1 /* FROZEN_SELF */, bValue);
                this.frozen.emit(bValue);
            };

            SceneNode.prototype.isHidden = function () {
                return akra.bf.testAny(this._iSceneNodeFlags, (akra.bf.flag(3 /* HIDDEN_SELF */) | akra.bf.flag(2 /* HIDDEN_PARENT */)));
            };

            SceneNode.prototype.hide = function (bValue) {
                if (typeof bValue === "undefined") { bValue = true; }
                this._iSceneNodeFlags = akra.bf.setBit(this._iSceneNodeFlags, 3 /* HIDDEN_SELF */, bValue);
                this.hidden.emit(bValue);
            };

            SceneNode.prototype._parentFrozen = function (pParent, bValue) {
                this._iSceneNodeFlags = akra.bf.setBit(this._iSceneNodeFlags, 0 /* FROZEN_PARENT */, bValue);
            };

            SceneNode.prototype._parentHidden = function (pParent, bValue) {
                this._iSceneNodeFlags = akra.bf.setBit(this._iSceneNodeFlags, 2 /* HIDDEN_PARENT */, bValue);
            };

            SceneNode.prototype.create = function () {
                _super.prototype.create.call(this);

                this._m4fLocalMatrix = new Mat4(1);
                this._m4fWorldMatrix = new Mat4(1);
                this._m4fInverseWorldMatrix = new Mat4(1);
                this._m3fNormalMatrix = new Mat3(1);

                this._v3fWorldPosition = new Vec3();

                this._v3fTranslation = new Vec3(0);
                this._v3fScale = new Vec3(1);
                this._qRotation = new Quat4(0, 1);

                return true;
            };

            SceneNode.prototype.update = function () {
                var isOk = _super.prototype.update.call(this);

                if (!akra.isNull(this._pAnimationControllers)) {
                    for (var i = 0; i < this._pAnimationControllers.length; ++i) {
                        this._pAnimationControllers[i].update();
                    }
                }

                return isOk;
            };

            SceneNode.prototype.destroy = function () {
                _super.prototype.destroy.call(this);
            };

            SceneNode.prototype.attachToParent = function (pParent) {
                if (pParent.getScene() !== this._pScene) {
                    akra.logger.warn("transfer of the scene node between trees scene - forbidden");
                    return false;
                }

                if (_super.prototype.attachToParent.call(this, pParent)) {
                    if (!akra.isNull(this.getParent())) {
                        this.getParent().frozen.connect(this, this._parentFrozen);

                        //this.connect(this.parent, SIGNAL(frozen), SLOT(_parentFrozen));
                        this.getParent().hidden.connect(this, this._parentHidden);
                        //this.connect(this.parent, SIGNAL(hidden), SLOT(_parentHidden));
                    }

                    return true;
                }

                return false;
            };

            SceneNode.prototype.detachFromParent = function () {
                if (_super.prototype.detachFromParent.call(this)) {
                    if (!akra.isNull(this.getParent())) {
                        this.getParent().frozen.disconnect(this, this._parentFrozen);

                        //this.disconnect(this.parent, SIGNAL(frozen), SLOT(_parentFrozen));
                        this.getParent().hidden.disconnect(this, this._parentHidden);
                        //this.disconnect(this.parent, SIGNAL(hidden), SLOT(_parentHidden));
                    }
                    return true;
                }

                return false;
            };

            SceneNode.prototype.toString = function (isRecursive, iDepth) {
                if (typeof isRecursive === "undefined") { isRecursive = false; }
                if (typeof iDepth === "undefined") { iDepth = 0; }
                if (!isRecursive) {
                    return "<scene_node" + (this.getName() ? " " + this.getName() : "") + ">";
                }

                return _super.prototype.toString.call(this, isRecursive, iDepth);
            };
            return SceneNode;
        })(akra.scene.Node);
        scene.SceneNode = SceneNode;
    })(akra.scene || (akra.scene = {}));
    var scene = akra.scene;
})(akra || (akra = {}));
//# sourceMappingURL=SceneNode.js.map
