#ifndef IOBJ_TS
#define IOBJ_TS

#include "IModel.ts"

module akra {
	IFACE(IModel);

	export interface IObjLoadOptions extends IModelLoadOptions {
		shadows?: bool;
		name?: string;

        axis?: {
            x: {index: uint; inverse: bool;};
            y: {index: uint; inverse: bool;};
            z: {index: uint; inverse: bool;};
        };
	}

    export interface IObj extends IModel {
        getFilename(): string;
        getBasename(): string;
        
        parse(sXMLData: string, pOptions?: IObjLoadOptions): bool;
        loadResource(sFilename?: string, pOptions?: IObjLoadOptions): bool;
        uploadVertexes(pPositions: Float32Array, pIndexes?: Float32Array): void;
    }
}

#endif
