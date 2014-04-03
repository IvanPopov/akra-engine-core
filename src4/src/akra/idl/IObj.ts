/// <reference path="IMat4.ts" />
/// <reference path="IModel.ts" />

module akra {
	export interface IObjLoadOptions extends IModelLoadOptions {
		shadows?: boolean;
		name?: string;
		transform?: IMat4;
	}
	
	export interface IObj extends IModel {
		getFilename(): string;
		getBasename(): string;

		parse(sXMLData: string, pOptions?: IObjLoadOptions): boolean;
		loadResource(sFilename?: string, pOptions?: IObjLoadOptions): boolean;
		uploadVertexes(pPositions: Float32Array, pIndexes?: Float32Array): void;
		setOptions(pOptions: IObjLoadOptions): void;
	}
}
