///<reference path="akra.ts" />

module akra {
    export interface IRenderResource extends IResourcePoolItem {
        getHardwareObject(): WebGLObject;
    };
}