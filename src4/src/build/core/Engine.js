/// <reference path="../common.ts" />
/// <reference path="../idl/IEngine.ts" />
/// <reference path="../idl/ISceneManager.ts" />
/// <reference path="../idl/IParticleManager.ts" />
/// <reference path="../idl/IResourcePoolManager.ts" />
/// <reference path="../idl/IRenderer.ts" />
/// <reference path="../idl/IUtilTimer.ts" />
/// <reference path="../idl/IScene3d.ts" />
/// <reference path="../idl/IAFXComposer.ts" />
/// <reference path="../idl/ISpriteManager.ts" />
/// <reference path="../pool/ResourcePoolManager.ts" />
/// <reference path="../scene/SceneManager.ts" />
/// <reference path="../util/UtilTimer.ts" />
/// <reference path="../fx/Composer.ts" />
/// <reference path="../pixelUtil/DDSCodec.ts" />
/// <reference path="../data/RenderDataCollection.ts" />
/// <reference path="../data/BufferMap.ts" />
/// <reference path="../model/Mesh.ts" />
/// <reference path="../animation/Controller.ts" />
/// <reference path="../model/Skeleton.ts" />
/// <reference path="../deps/deps.ts" />
/// <reference path="../control/control.ts" />
/// <reference path="../webgl/WebGLRenderer.ts" />
/// <reference path="../model/Sky.ts" />

var akra;
(function (akra) {
    (function (core) {
        akra.debug.log("config['data'] = " + akra.config.data);

        var Engine = (function () {
            function Engine(pOptions) {
                if (typeof pOptions === "undefined") { pOptions = null; }
                this.guid = akra.guid();
                /** is paused? */
                this._isActive = false;
                /** frame rendering sync / render next frame? */
                this._isFrameMoving = true;
                /** is all needed files loaded */
                this._isDepsLoaded = false;
                this._pGamepads = null;
                this._fElapsedAppTime = 0.0;
                this.setupSignals();

                this._pResourceManager = new akra.pool.ResourcePoolManager(this);

                if (!this._pResourceManager.initialize()) {
                    akra.debug.error('cannot initialize ResourcePoolManager');
                }

                this._pSceneManager = new akra.scene.SceneManager(this);

                if (!this._pSceneManager.initialize()) {
                    akra.debug.error("cannot initialize SceneManager");
                }

                this._pParticleManager = null;
                this._pSpriteManager = new akra.scene.SpriteManager(this);
                this._pTimer = akra.util.UtilTimer.start();

                if (akra.config.WEBGL) {
                    var pRendererOptions = pOptions ? pOptions.renderer : null;
                    this._pRenderer = new akra.webgl.WebGLRenderer(this, pRendererOptions);
                } else {
                    akra.logger.critical("render system not specified");
                }

                this._pComposer = new akra.fx.Composer(this);

                // Register image codecs
                akra.pixelUtil.DDSCodec.startup();

                this.pause(false);

                this.parseOptions(pOptions);
            }
            Engine.prototype.setupSignals = function () {
                this.frameStarted = this.frameStarted || new akra.Signal(this);
                this.frameEnded = this.frameEnded || new akra.Signal(this);
                this.depsLoaded = this.depsLoaded || new akra.Signal(this);
                this.inactive = this.inactive || new akra.Signal(this);
                this.active = this.active || new akra.Signal(this);

                this.inactive.setForerunner(this._inactivate);
                this.active.setForerunner(this._activate);
            };

            Engine.prototype.getTime = function () {
                return this._pTimer.getAppTime();
            };

            Engine.prototype.getElapsedTime = function () {
                return this._fElapsedAppTime;
            };

            Engine.prototype.enableGamepads = function () {
                if (!akra.isNull(this._pGamepads)) {
                    return true;
                }

                var pGamepads = akra.control.createGamepadMap();

                if (pGamepads.init()) {
                    this._pGamepads = pGamepads;
                    return true;
                }

                return false;
            };

            Engine.prototype.getGamepads = function () {
                if (this.enableGamepads()) {
                    return this._pGamepads;
                }

                return null;
            };

            Engine.prototype.parseOptions = function (pOptions) {
                var _this = this;
                //== Depends Managment ====================================
                var pDeps = Engine.DEPS;
                var sDepsRoot = Engine.DEPS_ROOT;

                //read options
                if (!akra.isNull(pOptions)) {
                    sDepsRoot = pOptions.depsRoot || Engine.DEPS_ROOT;

                    //default deps has higher priority!
                    if (akra.isDefAndNotNull(pOptions.deps)) {
                        Engine.depends(pOptions.deps);
                    }

                    if (pOptions.gamepads === true) {
                        this.enableGamepads();
                    }
                }

                akra.deps.load(this, pDeps, sDepsRoot, function (e, pDep) {
                    if (!akra.isNull(e)) {
                        akra.logger.critical(e);
                    }
                    akra.debug.log("\t\tloaded / ", arguments);

                    akra.logger.info("%cEngine dependecies loaded.", "color: green;");

                    _this._isDepsLoaded = true;

                    _this.depsLoaded.emit(pDep);
                }, function (pDep, pProgress) {
                    akra.debug.log("\t\tchanged / ", pDep.status, akra.path.parse(pDep.path).getBaseName(), pProgress ? pProgress.loaded + " / " + pProgress.total : "- / -");
                });
            };

            Engine.prototype.getSpriteManager = function () {
                return this._pSpriteManager;
            };

            Engine.prototype.getScene = function () {
                return this._pSceneManager.getScene3D(0);
            };

            Engine.prototype.getSceneManager = function () {
                return this._pSceneManager;
            };

            Engine.prototype.getParticleManager = function () {
                return null;
            };

            Engine.prototype.getResourceManager = function () {
                return this._pResourceManager;
            };

            Engine.prototype.getRenderer = function () {
                return this._pRenderer;
            };

            Engine.prototype.getComposer = function () {
                return this._pComposer;
            };

            Engine.prototype.isActive = function () {
                return this._isActive;
            };

            Engine.prototype.isDepsLoaded = function () {
                return this._isDepsLoaded;
            };

            Engine.prototype.exec = function (bValue) {
                if (typeof bValue === "undefined") { bValue = true; }
                var pRenderer = this._pRenderer;
                var pEngine = this;

                akra.logger.assert(!akra.isNull(pRenderer));

                pRenderer._initRenderTargets();

                // Infinite loop, until broken out of by frame listeners
                // or break out by calling queueEndRendering()
                bValue ? this.active.emit() : this.inactive.emit();

                function render(iTime) {
                    if (akra.config.DEBUG && !pRenderer.isValid()) {
                        akra.logger.error(pRenderer.getError());
                    }

                    if (pEngine.isActive() && pEngine.isDepsLoaded()) {
                        if (!pEngine.renderFrame()) {
                            akra.debug.error("Engine::exec() error.");
                            return;
                        }
                    }

                    requestAnimationFrame(render);
                }

                render(0);
            };

            Engine.prototype.getTimer = function () {
                return this._pTimer;
            };

            Engine.prototype.renderFrame = function () {
                this._fElapsedAppTime = this._pTimer.getElapsedTime();

                if (0. == this._fElapsedAppTime && this._isFrameMoving) {
                    return true;
                }

                // FrameMove (animate) the scene
                if (this._isFrameMoving) {
                    if (!akra.isNull(this._pGamepads)) {
                        this._pGamepads.update();
                    }
                    this._pSceneManager.update();
                }

                // Render the scene as normal
                this.frameStarted.emit();
                this._pRenderer._updateAllRenderTargets();
                this.frameEnded.emit();

                // this._pSceneManager.preUpdate();
                // LOG("frame rendered();");
                return true;
            };

            Engine.prototype.play = function () {
                if (!this.isActive()) {
                    this.active.emit();

                    if (this._isFrameMoving) {
                        this._pTimer.start();
                    }
                }

                return this.isActive();
            };

            Engine.prototype.pause = function (isPause) {
                if (typeof isPause === "undefined") { isPause = true; }
                if (this.isActive() !== isPause) {
                    return !this.isActive();
                }

                if (isPause) {
                    this.inactive.emit();

                    if (this._isFrameMoving) {
                        this._pTimer.stop();
                    }
                } else {
                    this.active.emit();

                    if (this._isFrameMoving) {
                        this._pTimer.start();
                    }
                }

                return !this.isActive();
            };

            Engine.prototype.createMesh = function (sName, eOptions, pDataBuffer) {
                if (typeof sName === "undefined") { sName = null; }
                if (typeof eOptions === "undefined") { eOptions = 0; }
                if (typeof pDataBuffer === "undefined") { pDataBuffer = null; }
                return akra.model.createMesh(this, sName, eOptions, pDataBuffer);
            };

            Engine.prototype.createRenderDataCollection = function (iOptions) {
                if (typeof iOptions === "undefined") { iOptions = 0; }
                return akra.data.createRenderDataCollection(this, iOptions);
            };

            Engine.prototype.createBufferMap = function () {
                return akra.data.createBufferMap(this);
            };

            Engine.prototype.createAnimationController = function (sName, iOptions) {
                return akra.animation.createController(this, sName, iOptions);
            };

            Engine.prototype._inactivate = function () {
                this._isActive = false;
            };

            Engine.prototype._activate = function () {
                this._isActive = true;
            };

            Engine.depends = function (pData) {
                var pDeps = Engine.DEPS;

                while (akra.isDefAndNotNull(pDeps.files)) {
                    if (!akra.isDefAndNotNull(pDeps.deps)) {
                        pDeps.deps = {
                            files: null,
                            deps: null
                        };
                    }

                    pDeps = pDeps.deps;
                }

                if (akra.isString(pData)) {
                    pDeps.files = [{ path: pData }];
                } else {
                    pDeps.deps = pData;
                }
            };

            Engine.DEPS_ROOT = akra.config.data;
            Engine.DEPS = akra.deps.createDependenceByPath(AE_CORE_DEPENDENCIES.path, AE_CORE_DEPENDENCIES.type);
            return Engine;
        })();
        core.Engine = Engine;
    })(akra.core || (akra.core = {}));
    var core = akra.core;
})(akra || (akra = {}));
//# sourceMappingURL=Engine.js.map
