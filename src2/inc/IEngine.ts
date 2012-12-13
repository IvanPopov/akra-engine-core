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

        //start execution
        exec(): bool;
    };

    export var createEngine: () => IEngine;
}


#endif