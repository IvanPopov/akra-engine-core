///<reference path="akra.ts" />

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