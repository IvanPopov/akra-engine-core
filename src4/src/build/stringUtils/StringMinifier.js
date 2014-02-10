/// <reference path="../idl/IMap.ts" />
var akra;
(function (akra) {
    (function (stringUtils) {
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
        stringUtils.StringMinifier = StringMinifier;
    })(akra.stringUtils || (akra.stringUtils = {}));
    var stringUtils = akra.stringUtils;
})(akra || (akra = {}));
//# sourceMappingURL=StringMinifier.js.map
