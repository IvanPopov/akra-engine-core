/// <reference path="ajax.ts" />
/// <reference path="exchange/Exporter.ts" />
/// <reference path="exchange/Importer.ts" />
/// <reference path="core/Engine.ts" />

module akra {
	console.log("\
                                                                                                                              \n\
                7732522331177                                                                                                 \n\
             34577    77117771262                                                                                             \n\
          727             77377                                                                                               \n\
         7               77                                                                                                   \n\
                     737              7                                                                                       \n\
                  737      7747       0           77777          777        777     777777777777             77777            \n\
              717      77    27       31         31171717       7771     7541       2777       7172         3737373           \n\
      217      77            5        13        371   1777      7777   717          177         7777       371   371          \n\
      1777377     77     5   2       773       177     7777     7777 76177          171   77    111       177     7717        \n\
      777777 717      7  3   5       173      1771     77777    7777    137         171     3437         3777     71717       \n\
       37777     737     1   2      1717    7371  77777  7713   7771      1557      273       737      7371   7777  1737      \n\
        1777        737  3   5    77777    7777           7777  7777        7717    777         737   7777           7777     \n\
         3771           74   177177717                                                                                        \n\
          7373               3777711                                                                                          \n\
            7143             37737                                                                                            \n\
               7347          57                                                                                               \n\
                                                                                                                              \n\
                                                                                                                              \n\
");

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
