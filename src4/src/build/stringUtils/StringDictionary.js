/// <reference path="../idl/IStringDictionary.ts" />
/// <reference path="../idl/IMap.ts" />
var akra;
(function (akra) {
    (function (stringUtils) {
        var StringDictionary = (function () {
            function StringDictionary() {
                this._pDictionary = null;
                this._pIndexToEntryMap = null;
                this._nEntryCount = 1;
                this._pDictionary = {};
                this._pIndexToEntryMap = {};
            }
            StringDictionary.prototype.add = function (sEntry) {
                if (!akra.isDef(this._pDictionary[sEntry])) {
                    this._pDictionary[sEntry] = this._nEntryCount++;
                    this._pIndexToEntryMap[this._nEntryCount - 1] = sEntry;
                }

                return this._pDictionary[sEntry];
            };

            StringDictionary.prototype.index = function (sEntry) {
                return this._pDictionary[sEntry] || 0;
            };

            StringDictionary.prototype.findEntry = function (iIndex) {
                return this._pIndexToEntryMap[iIndex];
            };
            return StringDictionary;
        })();
        stringUtils.StringDictionary = StringDictionary;
    })(akra.stringUtils || (akra.stringUtils = {}));
    var stringUtils = akra.stringUtils;
})(akra || (akra = {}));
//# sourceMappingURL=StringDictionary.js.map
