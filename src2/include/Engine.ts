///<reference path="akra.ts" />

module akra {
	export class Engine implements IEngine {
		/** use hardware antialiasing */
		private useHWAA: bool = false;
		/** hide cursor in fullscreen? */
		private isShowCursorWhenFullscreen: bool = false;

		/** creation width */
		private iCreationWidth: int = 0;
		/** creation heigth */
		private iCreationHeight: int = 0;

		/**
		 * Frame sync.
		 */

		/** is paused? */
		private isActive: bool = false;
		/** check, device lost? */
		private isDeviceLost: bool = false;
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

		/**
		 * Stats
		 */

		/** string describing device stats */
		private sDeviceStats: string = "";
		/** string describing frame stats */
		private sFrameStats: string = "";
		/** default font for statistics */
		private pFonts: IFont2d = null;
		/** show stats? */
		private isShowStats: bool = false;


		private pCanvas: HTMLCanvasElement = null;
		private pDevice: WebGLRenderingContext = null;

		private pRenderer: IRenderer = null;

		private pResourceManager: IResourcePoolManager = null;
		private pDisplayManager: IDisplayManager = null;
		private pParticleManager: IParticleManager = null;
		private pSpriteManager: ISpriteManager = null;
		private pLightManager: ILightManager = null;

		/** root node */
		private pRootNode: ISceneNode = null;
		/** default camera */
		private pDefaultCamera: ICamera = null;
		/** active camera */
		private pActiveCamera: ICamera = null;

		/** Scene tree */
		private pSceneTree: ISceneTree = null;
		/** world size */
		private pWorldExtents: IWorldExtents = null;

		/** List of scene nodes, that will be rendered in current frame */
		private pRenderList: ISceneObject = null;
		/** Current render state, that will be accessed in shaders */
		private pRenderState: IRenderState = null;

		/**
		 * Controllers
		 */

		/** Keymap bindings */
		static private pKeymap: IKeyMap = new util.KeyMap;
		/** Gamepad access */
		static private pGamepad: IGamepadMap = new util.GamepadMap;

		get displayManager(): IDisplayManager {
			return null;
		}

		get particleManager(): IParticleManager {
			return null;
		}

		get spriteManager(): ISpriteManager {
			return null;
		}

		get lightManager(): ILightManager {
			return null;
		}

		get resourceManager(): IResourcePoolManager {
			return null;
		}

		get rootNode(): INode {
			return null;
		}

		get sceneTree(): ISceneTree {
			return null;
		}

		get defaultCamera(): ICamera {
			return null;
		}

		get activeViewport(): IViewport {
			return { width: 0, height: 0, x: 0, y: 0 };
		}

		get worldExtents(): IWorldExtents {
			return {};
		}

		get device(): WebGLRenderingContext {
			return null;
		}

		get activeCamera(): ICamera {
			return null;
		}

		set activeCamera(pCamera: ICamera) {
			return;
		}


		get time(): float {
			return this.fTime;
		}

		get elapsedTime(): float {
			return this.fElapsedTime;
		}

		get fps(): float {
			return this.fFPS;
		}

		constructor (sCanvasId: string = null) {
			//set pause, before we will be ready for rendering
			this.pause(true);

			if (sCanvasId) {
				this.create(sCanvasId);
			}
		}

		create(pCanvas: HTMLCanvasElement): bool;
		create(sCanvasId: string): bool;
		create(pCanvas?): bool {
			//initializing

			if (isString(pCanvas)) {
				this.pCanvas = <HTMLCanvasElement>document.getElementById(pCanvas);
			}
			else {
				this.pCanvas = pCanvas;
			}

			//creating root node
			this.pRootNode = new scene.SceneNode(this);
			this.pRootNode.name = ".root";

			//creating default camera
			this.pDefaultCamera = new scene.objects.Camera(this);
			this.pDefaultCamera.name = ".default";

			this.pSceneTree = new scene.OcTree;

			//setup active camera
			this.pActiveCamera = this.pDefaultCamera;

			//creation size
			this.iCreationWidth = this.pCanvas.width;
			this.iCreationHeight = this.pCanvas.height;
			
			//getting device
			this.pDevice = createDevice(this.pCanvas, {antialias: this.useHWAA});

			if (!this.pDevice) {
				debug_warning('cannot create device object');
				return false;
			}

			if (!this.initDefaultStates()) {
				debug_warning('cannot init default states');
				return false;
			}

			//this.pResourceManager = new a.Res

			return false;
		}

		run(): bool {
			return false;
		}

		setupWorldOcTree(pWorldExtents: IRect3d): void {

		}

		pause(isPause: bool): void {

		}

		showStats(isShow: bool): void {

		}

		fullscreen(): bool {
			return false;
		}

		inFullscreenMode(): bool {
			return false;
		}

		notifyOneTimeSceneInit(): bool {
			return false;
		}

		notifyRestoreDeviceObjects(): bool {
			return false;
		}

		notifyDeleteDeviceObjects(): bool {
			return false;
		}

		notifyUpdateScene(): bool {
			return false;
		}

		notifyPreUpdateScene(): bool {
			return false;
		}

		notifyInitDeviceObjects(): bool {
			return false;
		}

		updateCamera(): void {

		}

		updateStats(): void {

		}

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

		private initialize3DEnvironment(): bool {
			return false;
		}

		private render3DEnvironment(): bool {
			return false;
		}

		private cleanup3DEnvironment(): bool {
			return false;
		}

		private invalidateDeviceObjects(): bool {
			return false;
		}

		private frameMove(): bool {
			return false;
		}

		private render(): bool {
			return false;
		}


		private finalCleanup(): bool {
			return null
		}

	}

}