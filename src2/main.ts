#include "inc/akra.ts"

module akra {
	// var engine: IEngine = createEngine();
	// var dmgr: IDisplayManager = engine.getDisplayManager();
	// var view: IDisplay3d = dmgr.createDisplay3D();
	// var scene: IScene = view.getScene();
}

var parser: akra.util.IParser = akra.util.parser;

// var sGrammar:string = "S : E\n"			+
// 					  "E : T '+' --F testFunc1 E\n"	+
// 					  "E : T '-' E\n"	+
// 					  "E : T\n"			+
// 					  "T : F '*' T \n"	+
// 					  "T : F '/' T\n"	+
// 					  "T : F\n"			+
// 					  "F : T_UINT\n"	+
// 					  "F : '(' E ')'\n";
// // "S : E\n"			+
// // 					  "E : T --F testFunc2 '+' --F testFunc1 E\n"	+
// // 					  "E : T '-' E\n"	+
// // 					  "E : T --F testFunc2\n"			+
// // 					  "T : F --F testFunc3 '*' T\n"	+
// // 					  "T : F '/' T\n"	+
// // 					  "T : F\n"			+
// // 					  "F : T_UINT\n"	+
// // 					  "F : '(' E ')' --F testFunc4\n";
// 


// x.init(sGrammar, akra.util.EParseMode.k_Add | 
// 				 akra.util.EParseMode.k_Negate |
// 				 akra.util.EParseMode.k_Optimize |
// 				 akra.util.EParseMode.k_DebugMode);
// x.setParseFileName("/parse.test");
parser.parse("struct type1{int x;}; type1 y;");
log(parser);

//error(20, akra.logger);