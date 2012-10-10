///<reference path="../akra.ts" />

module akra {
    export class ResourcePool implements IResourcePool {
        initialize(): bool {
            return false;
        }

        isInitialized(): bool {
            return false;
        }

        clean(): bool {
            return false;
        }

        destroy(): bool {
            return false;
        }

        destroyAll(): bool {
            return false;
        }

        disableAll(): bool {
            return false;
        }

        restoreAll(): bool {
            return false;
        }

        registerResourcePool(): void {

        }

        unregisterResourcePool(): void {
    
        }

        findResourceHandle(): int {
            return 0;
        }

    }
}