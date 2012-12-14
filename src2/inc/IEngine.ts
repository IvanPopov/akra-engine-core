#ifndef IENGINE_TS
#define IENGINE_TS

module akra {
	
	IFACE(IDisplayManager);
	IFACE(IParticleManager);
	IFACE(IResourcePoolManager);
	IFACE(IRenderer);

    export interface IEngine extends IEventProvider {
        getDisplayManager(): IDisplayManager;
        getParticleManager(): IParticleManager;
        getResourceManager(): IResourcePoolManager;

        getRenderer(): IRenderer;

        pause(): bool;
        play(): bool;
        
        /** Render one frame. */
        renderFrame(): bool;
        
        /** Start exucution(rendering loop). */
        exec(): bool;
        /** Определяет, находитсяли Engine в цикле рендеринга */
        isExecuting(): bool;
    };

    export var createEngine: () => IEngine;
}


#endif