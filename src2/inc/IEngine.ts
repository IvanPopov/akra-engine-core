#ifndef IENGINE_TS
#define IENGINE_TS

IFACE(IDisplayManager);
IFACE(IParticleManager);
IFACE(IResourcePoolManager);
IFACE(IRenderer);

module akra {
    export interface IEngine {
        getDisplayManager(): IDisplayManager;
        getParticleManager(): IParticleManager;
        getResourceManager(): IResourcePoolManager;

        getDefaultRenderer(): IRenderer;

        //start execution
        exec(): bool;
    };

}

#endif