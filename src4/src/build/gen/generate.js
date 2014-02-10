/// <reference path="../common.ts" />
var akra;
(function (akra) {
    (function (gen) {
        /**
        * Generated typed array by {Type} and {size}.
        */
        function array(size, Type) {
            if (typeof Type === "undefined") { Type = null; }
            var tmp = new Array(size);

            for (var i = 0; i < size; ++i) {
                tmp[i] = (!akra.isNull(Type) ? (new Type) : null);
            }

            return tmp;
        }
        gen.array = array;
    })(akra.gen || (akra.gen = {}));
    var gen = akra.gen;
})(akra || (akra = {}));
//# sourceMappingURL=generate.js.map
