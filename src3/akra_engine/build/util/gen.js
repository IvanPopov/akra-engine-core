define(["require", "exports"], function(require, exports) {
    
    var isNull = type.isNull;

    /**
    * Generated typed array by {Type} and {size}.
    */
    function array(size, Type) {
        if (typeof Type === "undefined") { Type = null; }
        var tmp = new Array(size);

        for (var i = 0; i < size; ++i) {
            tmp[i] = (isNull(Type) ? (new Type()) : null);
        }

        return tmp;
    }
    exports.array = array;
});
//# sourceMappingURL=gen.js.map
