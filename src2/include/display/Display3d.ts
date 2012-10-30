///<reference path="../akra.ts" />

module akra.display {
	export class Display3d implements IDisplay3d {
		private fMillisecondsPerTick: float = 0.0333;

		private pDisplayManager: IDisplayManager;
		private pCanvas: HTMLCanvasElement;
		private pScene: IScene3d;
		private pBuilder: ISceneBuilder;
		private pRenderer: IRenderer;
		private pScreen: IScreen;

		private pTimer: IUtilTimer;
		private iAppPausedCount: int = 0;

		private pBuildScript: IBuildScenario = null;

		/**
		 * Frame sync.
		 */

		/** is paused? */
		private isActive: bool = false;
		/** frame rendering sync / render next frame? */
		private isFrameMoving: bool = true;
		/** render only one frame */
		private isSingleStep: bool = true;
		/** can we update scene? */
		private isFrameReady: bool = false;

		/**
		 * Time statistics
		 */

		/** current time */
		private fTime: float = 0.;
		/** time elapsed since the last frame */
		private fElapsedTime: float = 0.;
		/** time elapsed since the last rendered frame */
		private fUpdateTimeCount: float = 0.;
		/** frame per second */
		private fFPS: float = 0.;
		private fLastTime: float = 0.;
		private nTotalFrames: uint = 0;
		private iFrames: uint = 0;

		private useHarwareAntialiasing: bool = false;
		private pCreationInfo: ICanvasInfo = null;


		get type(): EDisplayTypes {
			return EDisplayTypes.TYPE_3D;
		}

		get totalFrames(): uint {
			return this.nTotalFrames;
		}

		constructor (pDisplayManager: IDisplayManager);
		constructor (pDisplayManager: IDisplayManager, pCanvas?: HTMLCanvasElement);
		constructor (pDisplayManager: IDisplayManager, sCanvas?: string);
		constructor (pDisplayManager: IDisplayManager, pCanvas?: any) {
			if (isDef(pCanvas)) {
				
				//get HTMLCanvasElement by id
				if (isString(pCanvas)) {
					this.pCanvas = <HTMLCanvasElement>document.getElementById(pCanvas);
				}
				else {
					this.pCanvas = <HTMLCanvasElement>pCanvas;
				}
			}
			else {
				this.pCanvas = <HTMLCanvasElement>document.createElement('canvas');
			}

			this.pDisplayManager = pDisplayManager;
			this.pRenderer = new render.Renderer(this);
			this.pScene = new scene.Scene3d(this);
			this.pBuilder = scene.SceneBuilder.getSingleton();

			this.pTimer = util.UtilTimer.start();

			this.pause(true);

			this.pCreationInfo = info.canvas(this.pCanvas);
			//this._pResourceManager.restoreResourceFamily(a.ResourcePoolManager.VideoResource);
		}

		render() {
			var pDisplay: IDisplay3d = this;
			var pRenderer: IRenderer = this.pRenderer;
			var fnRender = (iTime: int): void => {
				if (DEBUG) {
					if (pRenderer.isDeviceLost()) {
						debug_error("Device lost");
					}
				}

				if (pDisplay.inRendering()) {
					if (!pDisplay.renderFrame()) {
		                debug_error("Display3d::renderFrame() error.");
		            }
				}

				requestAnimationFrame(fnRender, pDisplay.getCanvas());
			}
			
			requestAnimationFrame(fnRender, this.pCanvas);
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
		    if (!this.pBuilder.build(this.pBuildScript)) {
		    	return false;
		    }

		    if (this.isFrameReady) {
		    	//notifyPreUpdateScene();
		        this.pScene.recursivePreUpdate();
		    }

		    this.updateStats();
			return true;
		}

		play(): bool {
			if (!this.isActive) { 
				this.iAppPausedCount = 0;
				this.isActive = true;

				if (this.isFrameMoving) {
		            this.pTimer.start();
		        }
	        }

	        return this.isActive;
		}

		pause(isPause: bool = false): bool {
			this.iAppPausedCount += ( isPause ? +1 : -1 );
		    this.isActive = ( this.iAppPausedCount ? false : true );

		    // Handle the first pause request (of many, nestable pause requests)
		    if (isPause && ( 1 == this.iAppPausedCount )) {
		        // Stop the scene from animating
		        if (this.isFrameMoving) {
		            this.pTimer.stop();
		        }
		    }

		    if (0 == this.iAppPausedCount) {
		        // Restart the timers
		        if (this.isFrameMoving) {
		            this.pTimer.start();
		        }
		    }

		    return !this.isActive;
		}

		fullscreen(): bool {
			return false;
		}

		getCanvas(): HTMLCanvasElement {
			return this.pCanvas;
		}

		getScene(): IScene3d {
			return this.pScene;
		}

		getBuilder(): ISceneBuilder {
			return this.pBuilder;
		}

		getRenderer(): IRenderer {
			return this.pRenderer;
		}

		getScreen(): IScreen {
			return this.pScreen;
		}

		getTime(): float {
			return this.fTime;
		}

		getElapsedTime(): float {
			return this.fElapsedTime;
		}

		getFPS(): float {
			return this.fFPS;
		}

		/** @inline */
		inRendering(): bool {
			return this.isActive;
		}

		/** @inline */
		isFullscreen(): bool {
			return false;
		}

		private frameMove(): bool {
		    // add the real time elapsed to our
		    // internal delay counter
		    this.fUpdateTimeCount += this.fElapsedTime;
		    // is there an update ready to happen?

		    while (this.fUpdateTimeCount > this.fMillisecondsPerTick) {
		        // update the scene
		        
		        this.pScene.updateCamera();

		        if (!this.pScene.updateScene()) {
		            return false;
		        }

		        //notifyUpdateScene()
		        this.pScene.recursiveUpdate();
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
	}
}