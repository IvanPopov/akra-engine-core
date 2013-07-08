#ifndef ENGINE_TS
#define ENGINE_TS

#include "common.ts"

#include "IEngine.ts"
#include "ISceneManager.ts"
#include "IParticleManager.ts"
#include "IResourcePoolManager.ts"
#include "IRenderer.ts"
#include "IUtilTimer.ts"
#include "IScene3d.ts"
#include "IAFXComposer.ts"

#include "pool/ResourcePoolManager.ts"
#include "scene/SceneManager.ts"
#include "util/UtilTimer.ts"
#include "fx/Composer.ts"
#include "pixelUtil/DDSCodec.ts"


//include sub creation classes.

#include "render/RenderDataCollection.ts"
#include "model/Mesh.ts"
#include "util/BufferMap.ts"
#include "animation/Controller.ts"
#include "model/Skeleton.ts"
#include "util/DepsManager.ts"
#include "controls/GamepadMap.ts"
#include "controls/KeyMap.ts"

#include "util/SimpleGeometryObjects.ts"



#ifdef WEBGL
#include "webgl/WebGLRenderer.ts"
#endif

#ifdef GUI
#include "ui/UI.ts"
#include "ui/IDE.ts"
#endif

#ifdef SKY
#include "model/Sky.ts"
#endif

module akra.core {
	export class Engine implements IEngine {

		private _pResourceManager: IResourcePoolManager;
		private _pSceneManager: ISceneManager;
		private _pParticleManager: IParticleManager;
		private _pRenderer: IRenderer;
		private _pComposer: IAFXComposer;
		private _pDepsManager: IDepsManager;

		/** stop render loop?*/
		private _pTimer: util.UtilTimer;
		private _iAppPausedCount: int = 0;


		/** is paused? */
		private _isActive: bool = false;
		/** frame rendering sync / render next frame? */
		private _isFrameMoving: bool = true;
		/** is all needed files loaded */
		private _isDepsLoaded: bool = false;

		private _pGamepads: IGamepadMap = null;

		private _fElapsedAppTime: float = 0.0;


		inline get time(): float {
			return this._pTimer.appTime;
		}

		inline get elapsedTime(): float {
			return this._fElapsedAppTime;
		}

		constructor (pOptions: IEngineOptions = null) {
			this._pResourceManager = new pool.ResourcePoolManager(this);
			if (!this._pResourceManager.initialize()) {
				debug_error('cannot initialize ResourcePoolManager');
			}

			this._pSceneManager = new scene.SceneManager(this);

			if (!this._pSceneManager.initialize()) {
				debug_error("cannot initialize SceneManager");
			}

			this._pParticleManager = null;
			this._pTimer = util.UtilTimer.start(); 

#ifdef WEBGL
			var pRendererOptions: IRendererOptions = pOptions? pOptions.renderer: null;
			this._pRenderer = new webgl.WebGLRenderer(this, pRendererOptions);
#else
			CRITICAL("render system not specified");
#endif
			this._pComposer = new fx.Composer(this);

			// Register image codecs
			DDSCodec.startup();
			
			
			this.pause(false);

			this.parseOptions(pOptions);
		}

		enableGamepads(): bool {
			if (!isNull(this._pGamepads)) {
				return true;
			}

			var pGamepads: IGamepadMap = controls.createGamepadMap();
			
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
			var pDepsManager: IDepsManager = this._pDepsManager = util.createDepsManager(this);

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

			//get loaded signal
			this.connect(pDepsManager, SIGNAL(loaded), SLOT(_depsLoaded));

			if (isDefAndNotNull(pOptions.loader)) {
				var fnBefore = pOptions.loader.before;
				var fnOnload = pOptions.loader.onload;
				var fnLoaded = pOptions.loader.loaded;

				if (isFunction(fnBefore)) {
					pDepsManager.bind(SIGNAL(beforeLoad), fnBefore);
				}

				if (isFunction(fnOnload)) {
					pDepsManager.bind(SIGNAL(loadedDep), fnOnload);	
				}

				if (isFunction(fnLoaded)) {
					pDepsManager.bind(SIGNAL(loaded), fnLoaded);	
				}
			}

			//load depends!
			if (!pDepsManager.load(pDeps, sDepsRoot)) {
				CRITICAL("load dependencies are not started.");
			}

			//===========================================================
		}

		inline getDepsManager(): IDepsManager {
			return this._pDepsManager;
		}

		inline getScene(): IScene3d {
			return this._pSceneManager.getScene3D(0);
		}

		inline getSceneManager(): ISceneManager {
			return this._pSceneManager;
		}

		inline getParticleManager(): IParticleManager {
			return null;
		}


		inline getResourceManager(): IResourcePoolManager {
			return this._pResourceManager;
		}

		inline getRenderer(): IRenderer {
			return this._pRenderer;
		}

		inline getComposer(): IAFXComposer {
			return this._pComposer;
		}
	
		inline isActive(): bool {
			return this._isActive;
		}

		inline isDepsLoaded(): bool {
			return this._isDepsLoaded;
		}

		// _nCountFrame: uint = 0;
		exec(bValue: bool = true): void {
			var pRenderer: IRenderer = this._pRenderer;
			var pEngine: Engine = this;
			// var pCanvas: HTMLCanvasElement = null;

#if WEBGL
			// pCanvas = (<IWebGLRenderer>pRenderer).getHTMLCanvas();
#endif			

			ASSERT(!isNull(pRenderer));

	        pRenderer._initRenderTargets();

	        // Infinite loop, until broken out of by frame listeners
	        // or break out by calling queueEndRendering()
	        bValue? this.active(): this.inactive();
	        

	        function render(iTime: uint): void { 
#ifdef DEBUG
				if (!pRenderer.isValid()) {
					ERROR(pRenderer.getError());
				}
#endif
	        	if (pEngine.isActive() && pEngine.isDepsLoaded()) {
					if (!pEngine.renderFrame()) {
		                debug_error("Engine::exec() error.");
		                return;
		            }

		            // pEngine._nCountFrame++;

		            // if(pEngine._nCountFrame === 1000){
		            // 	pEngine.pause();
		            // }
	            }

	            requestAnimationFrame(render/*, pCanvas*/); 
	        } 

	        render(0);
		}

		inline getTimer(): IUtilTimer { return <IUtilTimer>this._pTimer; }

		renderFrame(): bool {
		    this._fElapsedAppTime = this._pTimer.elapsedTime;

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
	    	this.frameStarted();
		    this._pRenderer._updateAllRenderTargets();
		    this.frameEnded();

		    // this._pSceneManager.preUpdate();

		    // LOG("frame rendered();");
			return true;
		}

		play(): bool {
			if (!this.isActive()) { 
				this._iAppPausedCount = 0;
				this.active();

				if (this._isFrameMoving) {
		            this._pTimer.start();
		        }
	        }

	        return this.isActive();
		}

		pause(isPause: bool = false): bool {
			this._iAppPausedCount += ( isPause ? +1 : -1 );
		   (this._iAppPausedCount ? this.inactive() : this.active());

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

		inline createMesh(sName: string = null, eOptions: int = 0, pDataBuffer: IRenderDataCollection = null): IMesh {
			return model.createMesh(this, sName, eOptions, pDataBuffer);
		}

		inline createRenderDataCollection(iOptions: int = 0): IRenderDataCollection {
			return render.createRenderDataCollection(this, iOptions);
		}

		inline createBufferMap(): IBufferMap {
			return util.createBufferMap(this);
		}

		inline createAnimationController(sName?: string, iOptions?: int): IAnimationController {
			return animation.createController(this, sName, iOptions);
		}

		_depsLoaded(pLoader: IDepsManager, pDeps: IDependens): void {
			debug_print("[ALL DEPTS LOADED]");
			this._isDepsLoaded = true;

			this.depsLoaded(pDeps);
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

		static DEPS_ROOT: string = DATA;
		static DEPS: IDependens = 
			{
				files: [ 
					{path: "grammars/HLSL.gr"}
				],
				deps: {
						files: [
							{path: "effects/SystemEffects.afx"},
						    {path: "effects/Plane.afx"},
						    {path: "effects/fxaa.afx"},
						    {path: "effects/skybox.afx"}, 
						    {path: "effects/TextureToScreen.afx"},
						    {path: "effects/mesh_geometry.afx"},
						    {path: "effects/prepare_shadows.afx"},						    
						    {path: "effects/terrain.afx"},
						    {path: "effects/prepareDeferredShading.afx"},
						    {path: "effects/generate_normal_map.afx"}
						],
						deps: {
							files: [
								{path: "effects/mesh_texture.afx"},
								{path: "effects/deferredShading.afx"},
								{path: "effects/apply_lights_and_shadows.afx"},
							],
							deps: {
								files: [
									{path: "effects/color_maps.afx"}
								]
							}
						}
					}
			};			


		CREATE_EVENT_TABLE(Engine);
		BROADCAST(frameStarted, VOID);
		BROADCAST(frameEnded, VOID);
		BROADCAST(depsLoaded, CALL(deps));
		
		signal inactive(): void {
			this._isActive = false;
			EMIT_BROADCAST(inactive, _VOID);
		}

		signal active(): void {
			this._isActive = true;
			EMIT_BROADCAST(active, _VOID);
		}
			
		// BROADCAST(inactive, VOID);
		// BROADCAST(active, VOID);

	}

}

module akra {
	createEngine = function (pOptions?: IEngineOptions): IEngine {
		return new core.Engine(pOptions);
	}
}

/*
		private initDefaultStates(): bool {
			this.pRenderState = {
		        mesh            : {
		            isSkinning : false
		        },
		        isAdvancedIndex : false,
		        lights          : {
		            omni : 0,
		            project : 0,
		            omniShadows : 0,
		            projectShadows : 0
		        }
		    };

			return true;
		}
 */

#endif