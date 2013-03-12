#ifndef IENGINE_TS
#define IENGINE_TS

module akra {
	
	IFACE(ISceneManager);
	IFACE(IParticleManager);
	IFACE(IResourcePoolManager);
    IFACE(IRenderer);
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
   
    export interface IEngineOptions {
        depsRoot?: string;
        deps?: IDependens;
        gamepads?: bool;
    }

    export interface IEngine extends IEventProvider {
        getScene(): IScene3d;

        getSceneManager(): ISceneManager;
        getParticleManager(): IParticleManager;
        getResourceManager(): IResourcePoolManager;

        getRenderer(): IRenderer;

        getComposer(): IAFXComposer;

        pause(): bool;
        play(): bool;
        
        /** Render one frame. */
        renderFrame(): bool;
        
        /** Start exucution(rendering loop). */
        exec(): void;
        /** Определяет, находитсяли Engine в цикле рендеринга */
        isActive(): bool;


        getTimer(): IUtilTimer;

        enableGamepads(): bool;
        getGamepads(): IGamepadMap;

        createMesh(sName?: string, eOptions?: int, pDataBuffer?: IRenderDataCollection): IMesh;
        createRenderDataCollection(iOptions?: int): IRenderDataCollection;
        createBufferMap(): IBufferMap;
        createAnimationController(iOptions?: int): IAnimationController;
    };

    export var createEngine: () => IEngine;
}


#endif