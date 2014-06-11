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


//include sub creation classes.

/// <reference path="../data/RenderDataCollection.ts" />
/// <reference path="../data/BufferMap.ts" />
/// <reference path="../model/Mesh.ts" />

/// <reference path="../animation/Controller.ts" />
/// <reference path="../model/Skeleton.ts" />
/// <reference path="../deps/deps.ts" />

/// <reference path="../control/control.ts" />

// #ifdef WEBGL
/// <reference path="../webgl/WebGLRenderer.ts" />
// #endif

/// <reference path="../model/Sky.ts" />

declare var AE_CORE_DEPENDENCIES: { path: string; type: string; };

module akra.core {

	debug.log("config['data'] = " + config.data);

	enum EEngineStatus {
		PAUSED = 0x1,  ///!< IF SETTED Engine not paused.
		FROZEN = 0x2,  ///!< IF SETTED Scene will be update during the time.
		LOADED = 0x4,  ///!< IF SETTED Engine dependencies loaded.
		HIDDEN = 0x8,  ///!< IF SETTED Engine will not render frame / update scene.
		LAUNCHED = 0x10 ///!< IF SETTED Engine in exec loop.
	}

	export class Engine implements IEngine {

		frameStarted: ISignal<{ (pEngine: IEngine): void; }>;
		frameEnded: ISignal<{ (pEngine: IEngine): void; }>;
		depsLoaded: ISignal<{ (pEngine: IEngine, pDeps: IDependens): void; }>;
		inactive: ISignal<{ (pEngine: IEngine): void; }>;
		active: ISignal<{ (pEngine: IEngine): void; }>;

		public guid: uint = guid();

		private _pResourceManager: IResourcePoolManager;
		private _pSceneManager: ISceneManager;
		private _pParticleManager: IParticleManager;
		private _pSpriteManager: ISpriteManager;
		private _pRenderer: IRenderer;
		private _pComposer: IAFXComposer;

		/** stop render loop?*/
		private _pTimer: IUtilTimer;

		private _iStatus: uint = 0;

		private _pGamepads: IGamepadMap = null;

		private _fElapsedAppTime: float = 0.0;



		constructor(pOptions: IEngineOptions = null) {
			this.setupSignals();

			this._pResourceManager = new pool.ResourcePoolManager(this);

			debug.assert(this._pResourceManager.initialize(), 'cannot initialize ResourcePoolManager');

			this._pSceneManager = new scene.SceneManager(this);

			debug.assert(this._pSceneManager.initialize(), "cannot initialize SceneManager");

			this._pParticleManager = null;
			this._pSpriteManager = new scene.SpriteManager(this);
			this._pTimer = util.UtilTimer.start();

			if (config.WEBGL) {
				var pRendererOptions: IRendererOptions = pOptions ? pOptions.renderer : null;
				this._pRenderer = new webgl.WebGLRenderer(this, pRendererOptions);
			}
			else {
				logger.critical("render system not specified");
			}

			this._pComposer = new fx.Composer(this);

			info.visibility.visibilityChanged.connect((pInfo, bVisible: boolean) => {
				this._setHidden(!bVisible);
			});

			this.play();
			this.parseOptions(pOptions);
		}

		protected setupSignals(): void {
			this.frameStarted = this.frameStarted || new Signal(this);
			this.frameEnded = this.frameEnded || new Signal(this);
			this.depsLoaded = this.depsLoaded || new Signal(this);
			this.inactive = this.inactive || new Signal(this);
			this.active = this.active || new Signal(this);
		}

		/** Get app time */
		getTime(): float {
			return this._pTimer.getAppTime();
		}

		getElapsedTime(): float {
			return this._fElapsedAppTime;
		}

		enableGamepads(): boolean {
			if (!isNull(this._pGamepads)) {
				return true;
			}

			var pGamepads: IGamepadMap = control.createGamepadMap();

			if (pGamepads.init()) {
				this._pGamepads = pGamepads;
				return true;
			}

			return false;
		}

		getGamepads(): IGamepadMap {
			if (this.enableGamepads()) {
				return this._pGamepads;
			}

			return null;
		}

		private parseOptions(pOptions: IEngineOptions): void {
			//== Depends Managment ====================================
			var pDeps: IDependens = config.coreDeps;

			//read options 
			if (!isNull(pOptions)) {
				var sDepsRoot: string = pOptions.path || config.data;

				//default deps has higher priority!
				if (isDefAndNotNull(pOptions.deps)) {
					pDeps = deps.link(pDeps, pOptions.deps);
				}

				if (pOptions.gamepads) {
					this.enableGamepads();
				}
			}
	
			deps.load(this, pDeps, sDepsRoot,
				(e: Error, pDep: IDependens): void => {
					if (!isNull(e)) {
						logger.critical(e);
					}

					debug.log("\t\tloaded / ", arguments);

					this._iStatus = bf.setAll(this._iStatus, EEngineStatus.LOADED);

					debug.info("%cEngine dependecies loaded.", "color: green;");
					this.depsLoaded.emit(pDep);
				}, pOptions.progress || null);
		}

		getSpriteManager(): ISpriteManager {
			return this._pSpriteManager;
		}

		getScene(): IScene3d {
			return this._pSceneManager.getScene3D(0);
		}

		getSceneManager(): ISceneManager {
			return this._pSceneManager;
		}

		getParticleManager(): IParticleManager {
			return null;
		}

		getResourceManager(): IResourcePoolManager {
			return this._pResourceManager;
		}

		getRenderer(): IRenderer {
			return this._pRenderer;
		}

		getComposer(): IAFXComposer {
			return this._pComposer;
		}

		isActive(): boolean {
			return this.isLaunched() && !this.isPaused() && !this.isHidden() && this.isLoaded();
		}

		isPaused(): boolean {
			return (this._iStatus & EEngineStatus.PAUSED) > 0;
		}

		isLoaded(): boolean {
			return (this._iStatus & EEngineStatus.LOADED) > 0;
		}

		isHidden(): boolean {
			return (this._iStatus & EEngineStatus.HIDDEN) > 0;
		}

		isFrozen(): boolean {
			return (this._iStatus & EEngineStatus.FROZEN) > 0;
		}

		isLaunched(): boolean {
			return (this._iStatus & EEngineStatus.LAUNCHED) > 0;
		}

		exec(bValue: boolean = true): void {
			if (bValue == this.isLaunched()) {
				return;
			}

			var pRenderer: IRenderer = this._pRenderer;
			var pEngine: Engine = this;

			logger.assert(!isNull(pRenderer));

			pRenderer._initRenderTargets();

			this._setLaunched(bValue);

			// Infinite loop, until broken out of by frame listeners
			// or break out by calling queueEndRendering()
			function render(iTime: uint): void {
				debug.assert(!config.DEBUG || pRenderer.isValid(), pRenderer.getError());

				if (pEngine.isActive() && pEngine.isLoaded()) {
					if (!pEngine.renderFrame()) {
						debug.error("Engine::exec() error.");
						return;
					}
				}

				requestAnimationFrame(render);
			}

			render(0);
		}


		renderFrame(): boolean {
			this._fElapsedAppTime = this._pTimer.getElapsedTime();

			// FrameMove (animate) the scene 
			if (!this.isFrozen()) {
				if (!isNull(this._pGamepads)) {
					this._pGamepads.update();
				}
				this._pSceneManager.update();
			}

			// Render the scene as normal
			this.frameStarted.emit();
			this._pRenderer._updateAllRenderTargets();
			this.frameEnded.emit();

			// this._pSceneManager.preUpdate();
			return true;
		}

		play(): void {
			if (this.isPaused()) {
				this._setPaused(false);
			}
		}

		pause(): void {
			if (!this.isPaused()) {
				this._setPaused(true);
			}
		}

		_stop(): void {
			if (!this.isActive() && !this._pTimer.isStopped()) {
				this._pTimer.stop();
				this.inactive.emit();
			}
		}

		_start(): void {
			if (this.isActive() && this._pTimer.isStopped()) {
				this._pTimer.start();
				this.active.emit();
			}
		}

		_setPaused(bValue: boolean): void {
			this._iStatus = bf.setAll(this._iStatus, EEngineStatus.PAUSED, bValue);

			if (bValue) {
				this._stop();
			}
			else {
				this._start();
			}
		}

		//callback for visibility api
		_setHidden(bValue: boolean): void {
			this._iStatus = bf.setAll(this._iStatus, EEngineStatus.HIDDEN, bValue);

			if (bValue) {
				this._stop();
			}
			else {
				this._start();
			}
		}

		_setLaunched(bValue: boolean): void {
			this._iStatus = bf.setAll(this._iStatus, EEngineStatus.LAUNCHED, bValue);

			if (bValue) {
				this._start();
			}
			else {
				this._stop();
			}
		}

		createMesh(sName: string = null, eOptions: int = 0, pDataBuffer: IRenderDataCollection = null): IMesh {
			return model.createMesh(this, sName, eOptions, pDataBuffer);
		}

		createRenderDataCollection(iOptions: int = 0): IRenderDataCollection {
			return data.createRenderDataCollection(this, iOptions);
		}

		createBufferMap(): IBufferMap {
			return data.createBufferMap(this);
		}

		createAnimationController(sName?: string, iOptions?: int): IAnimationController {
			return animation.createController(this, sName, iOptions);
		}

		ready(cb?: (pEngine: IEngine) => void): boolean {
			if (this.isLoaded()) {
				if (cb) {
					cb(this);
				}

				return true;
			}

			this.depsLoaded.connect(cb);

			return false;
		}
	}
}

