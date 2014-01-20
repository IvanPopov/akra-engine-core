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
        fx.parser = new fx.EffectParser();

        function initAFXParser(sGrammar) {
            var iMode = akra.EParseMode.k_Add | akra.EParseMode.k_Negate | akra.EParseMode.k_Optimize;

            if (akra.config.DEBUG) {
                iMode |= akra.EParseMode.k_DebugMode;
            }

            fx.parser.init(sGrammar, iMode);
        }
        fx.initAFXParser = initAFXParser;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
