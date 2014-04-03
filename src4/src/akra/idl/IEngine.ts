/// <reference path="ISceneManager.ts" />
/// <reference path="IParticleManager.ts" />
/// <reference path="IResourcePoolManager.ts" />
/// <reference path="IRenderer.ts" />
/// <reference path="IUtilTimer.ts" />
/// <reference path="IMesh.ts" />
/// <reference path="IRenderDataCollection.ts" />
/// <reference path="IBufferMap.ts" />
/// <reference path="IAnimationController.ts" />
/// <reference path="ISkeleton.ts" />
/// <reference path="IScene3d.ts" />
/// <reference path="IDeps.ts" />
/// <reference path="IAFXComposer.ts" />
/// <reference path="IGamepadMap.ts" />
/// <reference path="ISpriteManager.ts" />
   
module akra {
	export interface IEngineOptions {
		/** 
		 * Path to load the root dependencies.
		 * The default path is #config.data .
		 * @see config.data
		 */
		path?: string;
		
		/**
		 * Additional engine dependencies, like: textures, models, effects etc...
		 * @sa deps
		 */
		deps?: IDependens;

		/**
		 * Enable gamepad support. Similar to IEngine::enableGamepads()
		 * @see IEngine::enableGamepads(), IEngine::getGamepads(), IGamepadMap
		 */
		gamepads?: boolean;

		/**
		 * Additional renderer options.
		 * # External resources
		 * [WebGL / Context creation parameters](http://www.khronos.org/registry/webgl/specs/latest/1.0/#5.2)
		 */
		renderer?: IRendererOptions;

		/**
		 * Loading progress callback.
		 */
		progress: (e: IDepEvent) => void;
	}
	
	export interface IEngine extends IEventProvider {
		getTime(): float;
		getElapsedTime(): float;
	
		getScene(): IScene3d;
	
		getSceneManager(): ISceneManager;
		getParticleManager(): IParticleManager;
		getResourceManager(): IResourcePoolManager;
		getSpriteManager(): ISpriteManager;
	
		getRenderer(): IRenderer;
	
		getComposer(): IAFXComposer;
		//getDepsManager(): AIDepsManager;
	
		pause(): boolean;
		play(): boolean;
		
		/** Render one frame. */
		renderFrame(): boolean;
		
		/** Start exucution(rendering loop). */
		exec(): void;
		/** Определяет, находитсяли Engine в цикле рендеринга */
		isActive(): boolean;
		isDepsLoaded(): boolean;
	
		ready(cb?: (pEngine: IEngine) => void): boolean;
	
		getTimer(): IUtilTimer;
	
		enableGamepads(): boolean;
		getGamepads(): IGamepadMap;
	
		createMesh(sName?: string, eOptions?: int, pDataBuffer?: IRenderDataCollection): IMesh;
		createRenderDataCollection(iOptions?: int): IRenderDataCollection;
		createBufferMap(): IBufferMap;
		createAnimationController(sName?: string, iOptions?: int): IAnimationController;

		frameStarted: ISignal<{ (pEngine: IEngine): void; }>;
		frameEnded: ISignal<{ (pEngine: IEngine): void ; }>;
		depsLoaded: ISignal<{ (pEngine: IEngine, pDeps: IDependens): void; }>;
		inactive: ISignal<{ (pEngine: IEngine): void; }>;
		active: ISignal<{ (pEngine: IEngine): void; }>;
	};
	
	var createEngine: (options?: IEngineOptions) => IEngine;
	
}
