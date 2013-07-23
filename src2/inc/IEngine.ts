#ifndef IENGINE_TS
#define IENGINE_TS

module akra {
	
	IFACE(ISceneManager);
	IFACE(IParticleManager);
	IFACE(IResourcePoolManager);
    IFACE(IRenderer);
    IFACE(IRendererOptions);
	IFACE(IUtilTimer);
    IFACE(IMesh);
    IFACE(IRenderDataCollection);
    IFACE(IBufferMap);
    IFACE(IAnimationController);
    IFACE(ISkeleton);
    IFACE(IScene3d);
    IFACE(IDependens);
    IFACE(IAFXComposer);
    IFACE(IGamepadMap);
    IFACE(IDepsManager);
    IFACE(IDep);
    IFACE(IDependens);
   
    export interface IEngineOptions {
        depsRoot?: string;
        deps?: IDependens;
        gamepads?: bool;
        renderer?: IRendererOptions;
        loader?: {
            info?: (manager: IDepsManager, info: any) => void;
            onload?: (manager: IDepsManager, depth: uint, loaded: uint, total: uint, pDep: IDependens, pFile: IDep, pData: any) => void;
            loaded?: (manager: IDepsManager) => void;
            preload?: (manager: IDepsManager, pDep: IDependens, pFile: IDep) => void;
        };
    }

    export interface IEngine extends IEventProvider {
        time: float;
        elapsedTime: float;

        getScene(): IScene3d;

        getSceneManager(): ISceneManager;
        getParticleManager(): IParticleManager;
        getResourceManager(): IResourcePoolManager;

        getRenderer(): IRenderer;

        getComposer(): IAFXComposer;
        getDepsManager(): IDepsManager;

        pause(): bool;
        play(): bool;
        
        /** Render one frame. */
        renderFrame(): bool;
        
        /** Start exucution(rendering loop). */
        exec(): void;
        /** Определяет, находитсяли Engine в цикле рендеринга */
        isActive(): bool;
        isDepsLoaded(): bool;


        getTimer(): IUtilTimer;

        enableGamepads(): bool;
        getGamepads(): IGamepadMap;

        createMesh(sName?: string, eOptions?: int, pDataBuffer?: IRenderDataCollection): IMesh;
        createRenderDataCollection(iOptions?: int): IRenderDataCollection;
        createBufferMap(): IBufferMap;
        createAnimationController(sName?: string, iOptions?: int): IAnimationController;
    };

    export var createEngine: (options?: IEngineOptions) => IEngine;
}


#endif