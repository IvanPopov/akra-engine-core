/// <reference path="../idl/AIMap.ts" />
define(["require", "exports"], function(require, exports) {
    var StringMinifier = (function () {
        function StringMinifier() {
            this._pMinMap = {};
            this._nCount = 1;
        }
        StringMinifier.prototype.minify = function (sValue) {
            return this._pMinMap[sValue] || (this._pMinMap[sValue] = this._nCount++);
        };
        return StringMinifier;
    })();

    
    return StringMinifier;
});
//# sourceMappingURL=StringMinifier.js.map
