var akra;
(function (akra) {
    /// <reference path="Composer.ts" />
    /// <reference path="Effect.ts" />
    (function (fx) {
        /** @const */
        fx.ALL_PASSES = 0xffffff;

        /** @const */
        fx.ANY_PASS = 0xfffffa;

        /** @const */
        fx.ANY_SHIFT = 0xfffffb;

        /** @const */
        fx.DEFAULT_SHIFT = 0xfffffc;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
