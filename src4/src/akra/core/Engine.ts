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

// #ifdef GUI
/// <reference path="../ui/UI.ts" />
/// <reference path="../ui/IDE.ts" />
// #endif


module akra.core {
	export class Engine implements IEngine {

		frameStarted: ISignal<{ (pEngine: IEngine): void; }> = new Signal(<any>this);
		frameEnded: ISignal<{ (pEngine: IEngine): void; }> = new Signal(<any>this);
		depsLoaded: ISignal<{ (pEngine: IEngine, pDeps: IDependens): void; }> = new Signal(<any>this);
		inactive: ISignal<{ (pEngine: IEngine): void; }> = new Signal(<any>this, this._inactivate);
		active: ISignal<{ (pEngine: IEngine): void; }> = new Signal(<any>this, this._activate);

		public guid: uint = guid();

		private _pResourceManager: IResourcePoolManager;
		private _pSceneManager: ISceneManager;
		private _pParticleManager: IParticleManager;
		private _pSpriteManager: ISpriteManager;
		private _pRenderer: IRenderer;
		private _pComposer: IAFXComposer;

		/** stop render loop?*/
		private _pTimer: IUtilTimer;
		private _iAppPausedCount: int = 0;


		/** is paused? */
		private _isActive: boolean = false;
		/** frame rendering sync / render next frame? */
		private _isFrameMoving: boolean = true;
		/** is all needed files loaded */
		private _isDepsLoaded: boolean = false;

		private _pGamepads: IGamepadMap = null;

		private _fElapsedAppTime: float = 0.0;

		getTime(): float {
			return this._pTimer.getAppTime();
		}

		getElapsedTime(): float {
			return this._fElapsedAppTime;
		}

		constructor (pOptions: IEngineOptions = null) {
			this._pResourceManager = new pool.ResourcePoolManager(this);
			if (!this._pResourceManager.initialize()) {
				debug.error('cannot initialize ResourcePoolManager');
			}

			this._pSceneManager = new scene.SceneManager(this);

			if (!this._pSceneManager.initialize()) {
				debug.error("cannot initialize SceneManager");
			}

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

			// Register image codecs
			pixelUtil.DDSCodec.startup();
			
			
			this.pause(false);

			this.parseOptions(pOptions);
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
			
			var pDeps: IDependens = Engine.DEPS;
			var sDepsRoot: string = Engine.DEPS_ROOT;

			deps.load(this, pDeps, sDepsRoot,
				(e: Error, pDep: IDependens): void => {
					if (!isNull(e)) {
						logger.critical("[DEPS NOT LOADED]");
					}
					debug.log("[ALL DEPTS LOADED]");
					this._isDepsLoaded = true;

					this.depsLoaded.emit(pDep);
				},
				(pDep: IDep, pProgress: any): void => {
				});

			//read options 
			if (!isNull(pOptions)) {
				sDepsRoot = pOptions.depsRoot || Engine.DEPS_ROOT;
				//default deps has higher priority!
				if (isDefAndNotNull(pOptions.deps)) {
					Engine.depends(pOptions.deps);
				}

				if (pOptions.gamepads === true) {
					this.enableGamepads();
				}
			}
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
			return this._isActive;
		}

		isDepsLoaded(): boolean {
			return this._isDepsLoaded;
		}

		exec(bValue: boolean = true): void {
			var pRenderer: IRenderer = this._pRenderer;
			var pEngine: Engine = this;

			logger.assert(!isNull(pRenderer));

	        pRenderer._initRenderTargets();

	        // Infinite loop, until broken out of by frame listeners
	        // or break out by calling queueEndRendering()
	        bValue? this.active.emit(): this.inactive.emit();	        

	        function render(iTime: uint): void {
				if (config.DEBUG && !pRenderer.isValid()) {
					logger.error(pRenderer.getError());
				}

	        	if (pEngine.isActive() && pEngine.isDepsLoaded()) {
					if (!pEngine.renderFrame()) {
		                debug.error("Engine::exec() error.");
		                return;
		            }
	            }

	            requestAnimationFrame(render); 
	        } 

	        render(0);
		}

		getTimer(): IUtilTimer { return <IUtilTimer>this._pTimer; }

		renderFrame(): boolean {
		    this._fElapsedAppTime = this._pTimer.getElapsedTime();

		    if (0. == this._fElapsedAppTime && this._isFrameMoving) {
		        return true;
		    }

		    // FrameMove (animate) the scene
		    if (this._isFrameMoving) {
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

		    // LOG("frame rendered();");
			return true;
		}

		play(): boolean {
			if (!this.isActive()) { 
				this._iAppPausedCount = 0;
				this.active.emit();

				if (this._isFrameMoving) {
		            this._pTimer.start();
		        }
	        }

	        return this.isActive();
		}

		pause(isPause: boolean = false): boolean {
			this._iAppPausedCount += ( isPause ? +1 : -1 );
		   (this._iAppPausedCount ? this.inactive.emit() : this.active.emit());

		    // Handle the first pause request (of many, nestable pause requests)
		    if (isPause && ( 1 == this._iAppPausedCount )) {
		        // Stop the scene from animating
		        if (this._isFrameMoving) {
		            this._pTimer.stop();
		        }
		    }

		    if (0 == this._iAppPausedCount) {
		        // Restart the timers
		        if (this._isFrameMoving) {
		            this._pTimer.start();
		        }
		    }

		    return !this.isActive();
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

		final protected _inactivate(): void {
			this._isActive = true;
		}

		final protected _activate(): void {
			this._isActive = true;
		}

		static depends(sData: string): void;
		static depends(pData: IDependens): void;
		static depends(pData): void {
			var pDeps: IDependens = Engine.DEPS;

			while (isDefAndNotNull(pDeps.files)) {
				if (!isDefAndNotNull(pDeps.deps)) {
					pDeps.deps = {
						files: null,
						deps: null
					};
				}

				pDeps = pDeps.deps;
			}

			if (isString(pData)) {
				pDeps.files = [{path: pData}];
			}
			else {
				pDeps.deps = pData;
			}
		}

		static DEPS_ROOT: string = config.data;
		static DEPS: IDependens = 
			//RELEASE
			//engine core dependences
			{
				files: [
					{
						path: "@CORE_ARA", 
						type: "ARA",
						name: "core resources" 
					}
				]
			};			
			

	}

}