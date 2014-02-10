/// <reference path="../idl/IJoint.ts" />
/// <reference path="../idl/IEngine.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="../math/math.ts" />
    /// <reference path="SceneNode.ts" />
    (function (scene) {
        var Mat4 = akra.math.Mat4;
        var Vec3 = akra.math.Vec3;
        var Quat4 = akra.math.Quat4;

        var Joint = (function (_super) {
            __extends(Joint, _super);
            // private _iUpdated: int = 0;
            // private _pEngine: IEngine = null;
            function Joint(pScene) {
                _super.call(this, pScene, 2 /* JOINT */);
                this._sBone = null;
            }
            Joint.prototype.getBoneName = function () {
                return this._sBone;
            };

            Joint.prototype.setBoneName = function (sBone) {
                this._sBone = sBone;
            };

            // getEngine(): IEngine {
            // 	return this._pEngine;
            // }
            Joint.prototype.create = function () {
                this._m4fLocalMatrix = new Mat4(1);
                this._m4fWorldMatrix = new Mat4(1);

                this._v3fWorldPosition = new Vec3();
                this._v3fTranslation = new Vec3(0, 0, 0);
                this._v3fScale = new Vec3(1);
                this._qRotation = new Quat4(0, 1);

                //maybe custom
                this.setInheritance(4 /* ALL */);
                return true;
            };

            Joint.prototype.toString = function (isRecursive, iDepth) {
                if (typeof isRecursive === "undefined") { isRecursive = false; }
                if (typeof iDepth === "undefined") { iDepth = 0; }
                isRecursive = isRecursive || false;

                if (!isRecursive) {
                    return "<joint" + (this._sName ? (' ' + this._sName) : "") + ">";
                }

                return akra.scene.Node.prototype.toString.call(this, isRecursive, iDepth);
            };

            Joint.isJoint = function (pEntity) {
                return pEntity.getType() === 2 /* JOINT */;
            };
            return Joint;
        })(akra.scene.SceneNode);
        scene.Joint = Joint;
    })(akra.scene || (akra.scene = {}));
    var scene = akra.scene;
})(akra || (akra = {}));
//# sourceMappingURL=Joint.js.map
