/// <reference path="ajax.ts" />
/// <reference path="export/Exporter.ts" />
/// <reference path="import/Importer.ts" />
/// <reference path="core/Engine.ts" />

module akra {
	export function createEngine(): akra.IEngine {
		return new core.Engine;
	}
}


