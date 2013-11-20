define(["require", "exports"], function(require, exports) {
    function minMax(a, b) {
        return a - b;
    }
    exports.minMax = minMax;
    ;
    function maxMin(a, b) {
        return b - a;
    }
    exports.maxMin = maxMin;
    ;

    /**
    * Search In Sort Array
    */
    function binary(array, value) {
        if (value < array[0] || value > array[array.length - 1]) {
            return -1;
        }

        if (value === array[0]) {
            return 0;
        }

        if (value === array[array.length - 1]) {
            return array.length - 1;
        }

        var p = 0;
        var q = array.length - 1;

        while (p < q) {
            var s = (p + q) >> 1;

            if (value === array[s]) {
                return s;
            } else if (value > array[s]) {
                p = s + 1;
            } else {
                q = s;
            }
        }

        return -1;
    }
    exports.binary = binary;
});
//# sourceMappingURL=sort.js.map
