#pragma once

module akra {
    export interface IManager {
        initialize(): bool;
        destroy(): void;
    }
}