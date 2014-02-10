/// <reference path="../idl/IScene3d.ts" />
/// <reference path="../idl/ISceneObject.ts" />
/// <reference path="../idl/IDisplayList.ts" />
/// <reference path="../idl/ICamera.ts" />
var akra;
(function (akra) {
    /// <reference path="../util/ObjectArray.ts" />
    /// <reference path="../debug.ts" />
    /// <reference path="../events.ts" />
    /// <reference path="../guid.ts" />
    /// <reference path="SceneObject.ts" />
    (function (scene) {
        var DisplayList = (function () {
            //setName(sName: string): void { this._sName = sName; }
            function DisplayList(sName) {
                this.guid = akra.guid();
                this._pScene = null;
                this._sName = "";
                this.setupSignals();

                this._sName = sName;
            }
            DisplayList.prototype.getName = function () {
                return this._sName;
            };

            DisplayList.prototype.setupSignals = function () {
            };

            DisplayList.prototype._onNodeAttachment = function (pScene, pNode) {
                this.attachObject(pNode);
            };

            DisplayList.prototype._onNodeDetachment = function (pScene, pNode) {
                this.detachObject(pNode);
            };

            DisplayList.prototype.attachObject = function (pNode) {
                akra.debug.error("pure virtual method DisplayList::attachObject()");
            };

            DisplayList.prototype.detachObject = function (pNode) {
                akra.debug.error("pure virtual method DisplayList::detachObject()");
            };

            DisplayList.prototype._setup = function (pScene) {
                var _this = this;
                if (akra.isDefAndNotNull(this._pScene)) {
                    akra.logger.critical("list movement from scene to another scene temprary unsupported!");
                }

                this._pScene = pScene;

                pScene.nodeAttachment.connect(this, this._onNodeAttachment);
                pScene.nodeDetachment.connect(this, this._onNodeDetachment);

                //register all exists nodes
                pScene.getRootNode().explore(function (pEntity) {
                    _this._onNodeAttachment(pScene, pEntity);
                    return true;
                });
            };

            DisplayList.prototype._findObjects = function (pCamera, pResultArray, bQuickSearch) {
                if (typeof bQuickSearch === "undefined") { bQuickSearch = false; }
                akra.debug.error("pure virtual method");
                return null;
            };
            return DisplayList;
        })();
        scene.DisplayList = DisplayList;
    })(akra.scene || (akra.scene = {}));
    var scene = akra.scene;
})(akra || (akra = {}));
//# sourceMappingURL=DisplayList.js.map
