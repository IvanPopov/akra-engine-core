/// <reference path="ajax.ts" />
/// <reference path="exchange/Exporter.ts" />
/// <reference path="exchange/Importer.ts" />
/// <reference path="core/Engine.ts" />


/**
 * External dependence zip.js
 */
declare var AE_ZIP_READER;
AE_ZIP_READER;


module akra {
	// Register image codecs
	pixelUtil.DDSCodec.startup();

	export function createEngine(pOtions?: IEngineOptions): akra.IEngine {
		return new core.Engine(pOtions);
	}
}


