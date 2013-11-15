// AIObj interface
// [write description here...]

/// <reference path="AIModel.ts" />


/// <reference path="AIModel.ts" />

interface IObjLoadOptions extends AIModelLoadOptions {
	shadows?: boolean;
	name?: string;

	axis?: {
		x: {index: uint; inverse: boolean;};
		y: {index: uint; inverse: boolean;};
		z: {index: uint; inverse: boolean;};
	};
}

interface AIObj extends AIModel {
	getFilename(): string;
	getBasename(): string;
	
	parse(sXMLData: string, pOptions?: IObjLoadOptions): boolean;
	loadResource(sFilename?: string, pOptions?: IObjLoadOptions): boolean;
	uploadVertexes(pPositions: Float32Array, pIndexes?: Float32Array): void;
}