/// <reference path="ajax.ts" />
/// <reference path="exchange/Exporter.ts" />
/// <reference path="exchange/Importer.ts" />
/// <reference path="core/Engine.ts" />

module akra {
	// Register image codecs
	pixelUtil.DDSCodec.startup();

	export function createEngine(pOtions?: IEngineOptions): akra.IEngine {
		return new core.Engine(pOtions);
	}
}


/**
 * External dependence zip.js
 */
//declare var AE_ZIP_READER: { content: any; format: string};
//AE_ZIP_READER.content;

