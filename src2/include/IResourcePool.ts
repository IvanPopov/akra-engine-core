///<reference path="akra.ts" />

module akra {
    export interface IResourcePool {
        initialize(): bool;
        isInitialized(): bool;
        
        clean(): bool;
        destroy(): bool;
        destroyAll(): bool;
        disableAll(): bool;
        restoreAll(): bool;

        registerResourcePool(): void;
        unregisterResourcePool(): void;
        findResourceHandle(): int;

    }
    
}