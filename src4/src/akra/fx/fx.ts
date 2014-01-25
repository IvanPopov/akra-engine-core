/// <reference path="Composer.ts" />
/// <reference path="Effect.ts" />
/// <reference path="EffectParser.ts" />
module akra.fx {

	/** @const */
	export var ALL_PASSES = 0xffffff;
	/** @const */
	export var ANY_PASS = 0xfffffa;
	/** @const */
	export var ANY_SHIFT = 0xfffffb;
	/** @const */
	export var DEFAULT_SHIFT = 0xfffffc;

	/** @const */
	export var effectParser: EffectParser = new EffectParser();

	export function initAFXParser(sGrammar: string): void {
		var iMode: int =
			parser.EParseMode.k_Add |
			parser.EParseMode.k_Negate |
			parser.EParseMode.k_Optimize;

		if (config.DEBUG_PARSER) {
			iMode |= parser.EParseMode.k_DebugMode;
		}
		
		effectParser.init(sGrammar, iMode);
	}
}