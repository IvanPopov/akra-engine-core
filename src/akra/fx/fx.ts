/// <reference path="Composer.ts" />
/// <reference path="Effect.ts" />
/// <reference path="EffectParser.ts" />
module akra.fx {

	/** For addComponent/delComponent/hasComponent */
	export const ALL_PASSES = 0xffffff;
	/** Only for hasComponent */
	export const ANY_PASS = 0xfffffa;
	/** For addComponent/delComponent/hasComponent */
	export const ANY_SHIFT = 0xfffffb;
	/** For addComponent/delComponent/hasComponent  */
	export const DEFAULT_SHIFT = 0xfffffc;

	/** @const */
	export var effectParser: EffectParser = new EffectParser();

	export function initAFXParser(sGrammar: string): void {
		var iMode: int =
			parser.EParseMode.k_Add |
			parser.EParseMode.k_Negate |
			parser.EParseMode.k_Optimize;

		if (config.AFX_DEBUG_PARSER) {
			iMode |= parser.EParseMode.k_DebugMode;
		}
		
		effectParser.init(sGrammar, iMode);
	}
}