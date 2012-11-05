#ifndef ISHADERPROGRAM_TS
#define ISHADERPROGRAM_TS

module akra {
    export enum ShaderTypes {
        PIXEL = 0x8B30,
        VERTEX
    };

    export interface IShaderProgram extends IRenderResource {

    }
}

#endif