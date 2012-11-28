var akra;
(function (akra) {
    (function (fx) {
        var EffectFile = (function () {
            function EffectFile() {
                this._x = 0;
            }
            return EffectFile;
        })();
        fx.EffectFile = EffectFile;        
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
