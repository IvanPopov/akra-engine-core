
/// <reference path="IModel.ts" />


/// <reference path="IModel.ts" />

module akra {
	interface IObjLoadOptions extends IModelLoadOptions {
		shadows?: boolean;
		name?: string;
	
		axis?: {
			x: {index: uint; inverse: boolean;};
			y: {index: uint; inverse: boolean;};
			z: {index: uint; inverse: boolean;};
		};
	}
	
	interface IObj extends IModel {
		getFilename(): string;
		getBasename(): string;
		
		parse(sXMLData: string, pOptions?: IObjLoadOptions): boolean;
		loadResource(sFilename?: string, pOptions?: IObjLoadOptions): boolean;
		uploadVertexes(pPositions: Float32Array, pIndexes?: Float32Array): void;
	}
}
