/// <reference path="ajax.ts" />
/// <reference path="exchange/Exporter.ts" />
/// <reference path="exchange/Importer.ts" />
/// <reference path="core/Engine.ts" />

module akra {
	// Register image codecs
	pixelUtil.DDSCodec.startup();

	import _Vec2 = math.Vec2;
	import _Vec3 = math.Vec3;
	import _Vec4 = math.Vec4;
	import _Mat3 = math.Mat3;
	import _Mat4 = math.Mat4;
	import _Quat4 = math.Quat4;
	import _Color = color.Color;

	export var Vec2 = _Vec2;
	export var Vec3 = _Vec3;
	export var Vec4 = _Vec4;

	export var Mat3 = _Mat3;
	export var Mat4 = _Mat4;

	export var Quat4 = _Quat4;

	export var Color = _Color;

	export function createEngine(pOtions?: IEngineOptions): akra.IEngine {
		return new core.Engine(pOtions);
	}
}
