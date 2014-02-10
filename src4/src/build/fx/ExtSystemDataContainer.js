/// <reference path="../idl/IAFXInstruction.ts" />
/// <reference path="../idl/IMap.ts" />
var akra;
(function (akra) {
    (function (fx) {
        var ExtSystemDataContainer = (function () {
            function ExtSystemDataContainer() {
                this._pExtSystemMacrosList = null;
                this._pExtSystemTypeList = null;
                this._pExtSystemFunctionList = null;
                this._pExtSystemMacrosList = [];
                this._pExtSystemTypeList = [];
                this._pExtSystemFunctionList = [];
            }
            ExtSystemDataContainer.prototype.getMacroses = function () {
                return this._pExtSystemMacrosList;
            };

            ExtSystemDataContainer.prototype.getTypes = function () {
                return this._pExtSystemTypeList;
            };

            ExtSystemDataContainer.prototype.getFunctions = function () {
                return this._pExtSystemFunctionList;
            };

            ExtSystemDataContainer.prototype.addFromFunction = function (pFunction) {
                var pTypes = pFunction._getExtSystemTypeList();
                var pMacroses = pFunction._getExtSystemMacrosList();
                var pFunctions = pFunction._getExtSystemFunctionList();

                if (!akra.isNull(pTypes)) {
                    for (var j = 0; j < pTypes.length; j++) {
                        if (this._pExtSystemTypeList.indexOf(pTypes[j]) === -1) {
                            this._pExtSystemTypeList.push(pTypes[j]);
                        }
                    }
                }

                if (!akra.isNull(pMacroses)) {
                    for (var j = 0; j < pMacroses.length; j++) {
                        if (this._pExtSystemMacrosList.indexOf(pMacroses[j]) === -1) {
                            this._pExtSystemMacrosList.push(pMacroses[j]);
                        }
                    }
                }

                if (!akra.isNull(pFunctions)) {
                    for (var j = 0; j < pFunctions.length; j++) {
                        if (this._pExtSystemFunctionList.indexOf(pFunctions[j]) === -1) {
                            this._pExtSystemFunctionList.push(pFunctions[j]);
                        }
                    }
                }
            };
            return ExtSystemDataContainer;
        })();
        fx.ExtSystemDataContainer = ExtSystemDataContainer;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
//# sourceMappingURL=ExtSystemDataContainer.js.map
