/// <reference path="idl/EDataTypes.ts" />
/// <reference path="idl/IEngine.ts" />
/// <reference path="core/Engine.ts" />

export function createEngine(): IEngine {
    return new core.Engine;
}


