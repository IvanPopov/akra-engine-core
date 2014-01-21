

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
		depsRoot?: string;
		deps?: IDependens;
		gamepads?: boolean;
		renderer?: IRendererOptions;
		//loader?: {
		//	loaded?: (manager: AIDepsManager, pDeps: IDependens) => void;
		//	changed?: (manager: AIDepsManager, pFile: IDep, pInfo: any) => void;
		//};
	}
	
	export interface IEngine extends IEventProvider {
		time: float;
		elapsedTime: float;
	
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
