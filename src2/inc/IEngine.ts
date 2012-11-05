#ifndef IENGINE_TS
#define IENGINE_TS

module akra {
	
	IFACE(IDisplayManager);
	IFACE(IParticleManager);
	IFACE(IResourcePoolManager);
	IFACE(IRenderer);

    export interface IEngine {
        getDisplayManager(): IDisplayManager;
        getParticleManager(): IParticleManager;
        getResourceManager(): IResourcePoolManager;

        getDefaultRenderer(): IRenderer;

        //start execution
        exec(): bool;
    };

    export var createEngine: () => IEngine;
}


#endif