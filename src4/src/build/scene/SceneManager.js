/// <reference path="../idl/IEngine.ts" />
/// <reference path="../idl/ISceneManager.ts" />
/// <reference path="../idl/IScene.ts" />
/// <reference path="../idl/IScene2d.ts" />
/// <reference path="../idl/IScene3d.ts" />
var akra;
(function (akra) {
    /// <reference path="Scene3d.ts" />
    (function (scene) {
        var SceneManager = (function () {
            function SceneManager(pEngine) {
                this._pEngine = null;
                this._pSceneList = [];
                this._fUpdateTimeCount = 0.;
                this._fMillisecondsPerTick = 0.01666;
                this._pEngine = pEngine;
            }
            SceneManager.prototype.getEngine = function () {
                return this._pEngine;
            };

            SceneManager.prototype.update = function () {
                var isSceneUpdated = false;

                // add the real time elapsed to our
                // internal delay counter
                this._fUpdateTimeCount += this._pEngine.getElapsedTime();

                // is there an update ready to happen?
                // LOG(this._fUpdateTimeCount, this._pEngine.elapsedTime);
                var fUpdateTime = this._fUpdateTimeCount;

                while (this._fUpdateTimeCount > this._fMillisecondsPerTick) {
                    // update the scene
                    this.notifyUpdateScene();

                    // subtract the time interval
                    // emulated with each tick
                    this._fUpdateTimeCount -= this._fMillisecondsPerTick;
                }

                if (fUpdateTime !== this._fUpdateTimeCount) {
                    this.notifyPreUpdateScene();
                }
            };

            //  preUpdate(): void {
            //     this.notifyPreUpdateScene();
            // }
            SceneManager.prototype.notifyUpdateScene = function () {
                for (var i = 0; i < this._pSceneList.length; ++i) {
                    var pScene = this._pSceneList[i];

                    if (pScene.getType() != 0 /* TYPE_3D */) {
                        continue;
                    }

                    pScene.recursiveUpdate();
                }
            };

            SceneManager.prototype.notifyPreUpdateScene = function () {
                for (var i = 0; i < this._pSceneList.length; ++i) {
                    var pScene = this._pSceneList[i];

                    if (pScene.getType() != 0 /* TYPE_3D */) {
                        continue;
                    }

                    pScene.recursivePreUpdate();
                }
            };

            SceneManager.prototype.createScene3D = function (sName) {
                if (typeof sName === "undefined") { sName = null; }
                var pScene = new akra.scene.Scene3d(this, sName);
                this._pSceneList.push(pScene);

                return pScene;
            };

            SceneManager.prototype.createScene2D = function (sName) {
                if (typeof sName === "undefined") { sName = null; }
                return null;
            };

            SceneManager.prototype.createUI = function () {
                if (akra.config.UI) {
                    return akra["ui"].createUI(this);
                } else {
                    return null;
                }
            };

            SceneManager.prototype.getScene3D = function (scene) {
                if (akra.isNumber(arguments[0]) || !akra.isDef(arguments[0])) {
                    var iScene = arguments[0] || 0;
                    var pScene;

                    if (iScene === 0 && this._pSceneList.length === 0) {
                        this.createScene3D();
                        akra.debug.log("Default scene automatically created.");
                    }

                    pScene = this._pSceneList[iScene];

                    if (pScene && pScene.getType() === 0 /* TYPE_3D */) {
                        return pScene;
                    }

                    return null;
                } else if (akra.isString(arguments[0])) {
                    for (var i = 0; i < this._pSceneList.length; ++i) {
                        if (this._pSceneList[i].getName() === arguments[0]) {
                            return this._pSceneList[i];
                        }
                    }
                }

                return null;
            };

            SceneManager.prototype.getScene2D = function (scene) {
                if (akra.isNumber(arguments[0]) || !akra.isDef(arguments[0])) {
                    var iScene = arguments[0] || 0;
                    var pScene = this._pSceneList[iScene];

                    if (pScene && pScene.getType() === 1 /* TYPE_2D */) {
                        return pScene;
                    }
                }

                return null;
            };

            SceneManager.prototype.getScene = function (IScene, eType) {
                return this._pSceneList[IScene] || null;
            };

            SceneManager.prototype.initialize = function () {
                //this.initText2Dlayer();
                return true;
            };

            SceneManager.prototype.destroy = function () {
            };
            return SceneManager;
        })();
        scene.SceneManager = SceneManager;
    })(akra.scene || (akra.scene = {}));
    var scene = akra.scene;
})(akra || (akra = {}));
//# sourceMappingURL=SceneManager.js.map
