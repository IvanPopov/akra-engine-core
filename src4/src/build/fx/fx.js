var akra;
(function (akra) {
    /// <reference path="Composer.ts" />
    /// <reference path="Effect.ts" />
    /// <reference path="EffectParser.ts" />
    (function (fx) {
        /** @const */
        fx.ALL_PASSES = 0xffffff;

        /** @const */
        fx.ANY_PASS = 0xfffffa;

        /** @const */
        fx.ANY_SHIFT = 0xfffffb;

        /** @const */
        fx.DEFAULT_SHIFT = 0xfffffc;

        /** @const */
        fx.effectParser = new akra.fx.EffectParser();

        function initAFXParser(sGrammar) {
            var iMode = 4 /* k_Add */ | 2 /* k_Negate */ | 8 /* k_Optimize */;

            if (akra.config.DEBUG_PARSER) {
                iMode |= 16 /* k_DebugMode */;
            }

            fx.effectParser.init(sGrammar, iMode);
        }
        fx.initAFXParser = initAFXParser;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
//# sourceMappingURL=fx.js.map
