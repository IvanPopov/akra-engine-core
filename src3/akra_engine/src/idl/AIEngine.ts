// AIEngine interface
// [write description here...]


/// <reference path="AISceneManager.ts" />
/// <reference path="AIParticleManager.ts" />
/// <reference path="AIResourcePoolManager.ts" />
/// <reference path="AIRenderer.ts" />
/// <reference path="AIUtilTimer.ts" />
/// <reference path="AIMesh.ts" />
/// <reference path="AIRenderDataCollection.ts" />
/// <reference path="AIBufferMap.ts" />
/// <reference path="AIAnimationController.ts" />
/// <reference path="AISkeleton.ts" />
/// <reference path="AIScene3d.ts" />
/// <reference path="AIDepsManager.ts" />
/// <reference path="AIAFXComposer.ts" />
/// <reference path="AIGamepadMap.ts" />
/// <reference path="AISpriteManager.ts" />
   
interface AIEngineOptions {
	depsRoot?: string;
	deps?: AIDependens;
	gamepads?: boolean;
	renderer?: IRendererOptions;
	loader?: {
		loaded?: (manager: AIDepsManager, pDeps: AIDependens) => void;
		changed?: (manager: AIDepsManager, pFile: AIDep, pInfo: any) => void;
	};
}

interface AIEngine extends AIEventProvider {
	time: float;
	elapsedTime: float;

	getScene(): AIScene3d;

	getSceneManager(): AISceneManager;
	getParticleManager(): AIParticleManager;
	getResourceManager(): AIResourcePoolManager;
	getSpriteManager(): AISpriteManager;

	getRenderer(): AIRenderer;

	getComposer(): AIAFXComposer;
	getDepsManager(): AIDepsManager;

	pause(): boolean;
	play(): boolean;
	
	/** Render one frame. */
	renderFrame(): boolean;
	
	/** Start exucution(rendering loop). */
	exec(): void;
	/** Определяет, находитсяли Engine в цикле рендеринга */
	isActive(): boolean;
	isDepsLoaded(): boolean;


	getTimer(): AIUtilTimer;

	enableGamepads(): boolean;
	getGamepads(): AIGamepadMap;

	createMesh(sName?: string, eOptions?: int, pDataBuffer?: AIRenderDataCollection): AIMesh;
	createRenderDataCollection(iOptions?: int): AIRenderDataCollection;
	createBufferMap(): AIBufferMap;
	createAnimationController(sName?: string, iOptions?: int): AIAnimationController;
};

var createEngine: (options?: AIEngineOptions) => AIEngine;
