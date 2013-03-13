#ifndef IMANAGER_TS
#define IMANAGER_TS

module akra {
    export interface IManager {
        initialize(): bool;
        destroy(): void;
    }
}

#endif