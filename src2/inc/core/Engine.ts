#ifndef ENGINE_TS
#define ENGINE_TS

#include "IEngine.ts"
#include "IDisplayManager.ts"
#include "IParticleManager.ts"
#include "IResourcePoolManager.ts"
#include "IRenderer.ts"


#ifdef WEBGL
#include "webgl/WebGLRenderer.ts"
#endif

module akra.core {
	export class Engine implements IEngine {

		private _pResourceManager: IResourcePoolManager;
		private _pDisplayManager: IDisplayManager;
		private _pParticleManager: IParticleManager;
		private _pRenderer: IRenderer;

		private fMillisecondsPerTick: float = 0.0333;

		/** stop render loop?*/
		private _pTimer: IUtilTimer;
		private _iAppPausedCount: int = 0;

		/**
		 * Frame sync.
		 */

		/** is paused? */
		private _isActive: bool = false;
		/** frame rendering sync / render next frame? */
		private _isFrameMoving: bool = true;
		/** render only one frame */
		private _isSingleStep: bool = true;
		/** can we update scene? */
		private _isFrameReady: bool = false;

		/**
		 * Time statistics
		 */

		/** current time */
		private _fTime: float = 0.;
		/** time elapsed since the last frame */
		private _fElapsedTime: float = 0.;
		/** time elapsed since the last rendered frame */
		private _fUpdateTimeCount: float = 0.;
		/** frame per second */
		private _fFPS: float = 0.;
		private _fLastTime: float = 0.;
		private _nTotalFrames: uint = 0;
		private _iFrames: uint = 0;

		constructor () {
			this._pResourceManager = new pool.ResourcePoolManager(this);
			this._pDisplayManager = new DisplayManager(this);
			this._pParticleManager = null;

#ifdef WEBGL
			this._pRenderer = new webgl.WebGLRenderer();
#else
			CRITICAL("render system not specified");
#endif


			if (!this._pResourceManager.initialize()) {
				debug_error('cannot initialize ResourcePoolManager');
			}

			if (!this._pDisplayManager.initialize()) {
				debug_error("cannot initialize DisplayManager");
			}

			this._pTimer = util.UtilTimer.start();
			this.paused(false);
		}

		getDisplayManager(): IDisplayManager {
			return this._pDisplayManager;
		}

		getParticleManager(): IParticleManager {
			return null;
		}

		getResourceManager(): IResourcePoolManager {
			return null;
		}

		getRenderer(): IRenderer {
			return this._pRenderer;
		}
	
		inline isExecuting(): bool {
			return this._isActive;
		}

		exec(bValue: bool = true): void {
			var pRenderer: IRenderer = this._pRenderer;
			var pEngine: IEngine = this;
			var pCanvas: HTMLCanvasElement = null;

#if WEBGL
			pCanvas = (<IWebGLRenderer>pRenderer).getCanvas();
#endif			

			ASSERT(!isNull(pRenderer));

	        pRenderer._initRenderTargets();

	        // Clear event times
			this.clearEventTimes();

	        // Infinite loop, until broken out of by frame listeners
	        // or break out by calling queueEndRendering()
	        this._bExecuting = bValue;

	        function render(iTime: uint): void { 
#ifdef DEBUG
				if (pRenderer.isValid()) {
					ERROR(pRenderer.getError());
				}
#endif
	        	if (!pEngine.isExecuting()) {
	                return;
	            }

	            if (!pEngine.renderFrame()) {
	                debug_error("Engine::exec() error.");
	                return;
	            }

	            requestAnimationFrame(render, pCanvas); 
	        } 

	        render();
		}

		renderFrame(): bool {
			var fAppTime = this.pTimer.execCommand(EUtilTimerCommands.TIMER_GET_APP_TIME);
		    var fElapsedAppTime = this.pTimer.execCommand(EUtilTimerCommands.TIMER_GET_ELAPSED_TIME);

		    if ((0 == fElapsedAppTime ) && this.isFrameMoving) {
		        return true;
		    }

		    // FrameMove (animate) the scene
		    if (this.isFrameMoving || this.isSingleStep) {
		        // Store the time for the app
		        this.fTime = fAppTime;
		        this.fElapsedTime = fElapsedAppTime;

		        // Frame move the scene
		        if (!this.frameMove()) {
		            return false;
		        }

		        this.isSingleStep = false;
		    }

		    // Render the scene as normal
		    if (!pRenderer.updateAllRenderTargets_()) {
		    	return false;
		    }

		    if (this.isFrameReady) {
		    	//notifyPreUpdateScene();
		        //this.pScene.recursivePreUpdate();
		    }

		    this.updateStats();
			return true;
		}

		play(): bool {
			if (!this._isActive) { 
				this._iAppPausedCount = 0;
				this._isActive = true;

				if (this._isFrameMoving) {
		            this._pTimer.start();
		        }
	        }

	        return this._isActive;
		}

		pause(isPause: bool = false): bool {
			this._iAppPausedCount += ( isPause ? +1 : -1 );
		    this._isActive = ( this._iAppPausedCount ? false : true );

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

		    return !this._isActive;
		}

		private frameMove(): bool {
		    // add the real time elapsed to our
		    // internal delay counter
		    this.fUpdateTimeCount += this.fElapsedTime;
		    // is there an update ready to happen?

		    while (this.fUpdateTimeCount > this.fMillisecondsPerTick) {
		        // update the scene
		        
		        //this.pScene.updateCamera();

		        // if (!this.pScene.updateScene()) {
		        //     return false;
		        // }

		        //notifyUpdateScene()
		        //this.pScene.recursiveUpdate();
		        this.isFrameReady = true;


		        // subtract the time interval
		        // emulated with each tick
		        this.fUpdateTimeCount -= this.fMillisecondsPerTick;
		    }
		    return true;
		}

		private updateStats(): void {
			var fTime = this.pTimer.execCommand(EUtilTimerCommands.TIMER_GET_ABSOLUTE_TIME);
		    
		    this.iFrames ++;
		    this.nTotalFrames ++;

		    // Update the scene stats once per second
		    if (fTime - this.fLastTime > 1.0) {
		        this.fFPS = <float>this.iFrames / (fTime - this.fLastTime);
		        this.fLastTime = fTime;
		        this.iFrames = 0;
		    }
		}

		BEGIN_EVENT_TABLE(Engine);
			BROADCAST(frameStarted, VOID);
			BROADCAST(frameEnded, VOID);
		END_EVENT_TABLE();

	}

}

module akra {
	createEngine = function (): IEngine {
		return new core.Engine();
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