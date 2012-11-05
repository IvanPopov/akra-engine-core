#include "inc/akra.ts"

module akra {
	// var engine: IEngine = createEngine();
	// var dmgr: IDisplayManager = engine.getDisplayManager();
	// var view: IDisplay3d = dmgr.createDisplay3D();
	// var scene: IScene = view.getScene();
}

var x: akra.util.IParser = new akra.util.Parser;

var sGrammar:string = "S : E\n"			+
					  "E : T '+' E\n"	+
					  "E : T '-' E\n"	+
					  "E : T\n"			+
					  "T : F '*' T\n"	+
					  "T : F '/' T\n"	+
					  "T : F\n"			+
					  "F : T_UINT\n"	+
					  "F : '(' E ')'\n";

x.init(sGrammar);
x.parse("2+3-4*6");
console.log(x);