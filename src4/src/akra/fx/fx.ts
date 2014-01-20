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
	export var parser: EffectParser = new EffectParser();

	export function initAFXParser(sGrammar: string): void {
		var iMode: int =
			EParseMode.k_Add |
			EParseMode.k_Negate |
			EParseMode.k_Optimize;

		if (config.DEBUG) {
			iMode |= EParseMode.k_DebugMode;
		}
			
		parser.init(sGrammar, iMode);
	}
}