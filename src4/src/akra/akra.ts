/// <reference path="ajax.ts" />
/// <reference path="exchange/Exporter.ts" />
/// <reference path="exchange/Importer.ts" />
/// <reference path="core/Engine.ts" />

module akra {
	// Register image codecs
	pixelUtil.DDSCodec.startup();

	export import Vec2 = math.Vec2;
	export import Vec3 = math.Vec3;
	export import Vec4 = math.Vec4;
	export import Mat3 = math.Mat3;
	export import Mat4 = math.Mat4;
	export import Quat4 = math.Quat4;
	export import Color = color.Color;

	export function createEngine(pOtions?: IEngineOptions): akra.IEngine {
		return new core.Engine(pOtions);
	}
}
