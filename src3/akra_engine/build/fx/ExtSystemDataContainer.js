/// <reference path="../idl/AIAFXInstruction.ts" />
/// <reference path="../idl/AIMap.ts" />
define(["require", "exports"], function(require, exports) {
    var ExtSystemDataContainer = (function () {
        function ExtSystemDataContainer() {
            this._pExtSystemMacrosList = null;
            this._pExtSystemTypeList = null;
            this._pExtSystemFunctionList = null;
            this._pExtSystemMacrosList = [];
            this._pExtSystemTypeList = [];
            this._pExtSystemFunctionList = [];
        }
        Object.defineProperty(ExtSystemDataContainer.prototype, "macroses", {
            get: function () {
                return this._pExtSystemMacrosList;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(ExtSystemDataContainer.prototype, "types", {
            get: function () {
                return this._pExtSystemTypeList;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(ExtSystemDataContainer.prototype, "functions", {
            get: function () {
                return this._pExtSystemFunctionList;
            },
            enumerable: true,
            configurable: true
        });

        ExtSystemDataContainer.prototype.addFromFunction = function (pFunction) {
            var pTypes = pFunction._getExtSystemTypeList();
            var pMacroses = pFunction._getExtSystemMacrosList();
            var pFunctions = pFunction._getExtSystemFunctionList();

            if (!isNull(pTypes)) {
                for (var j = 0; j < pTypes.length; j++) {
                    if (this._pExtSystemTypeList.indexOf(pTypes[j]) === -1) {
                        this._pExtSystemTypeList.push(pTypes[j]);
                    }
                }
            }

            if (!isNull(pMacroses)) {
                for (var j = 0; j < pMacroses.length; j++) {
                    if (this._pExtSystemMacrosList.indexOf(pMacroses[j]) === -1) {
                        this._pExtSystemMacrosList.push(pMacroses[j]);
                    }
                }
            }

            if (!isNull(pFunctions)) {
                for (var j = 0; j < pFunctions.length; j++) {
                    if (this._pExtSystemFunctionList.indexOf(pFunctions[j]) === -1) {
                        this._pExtSystemFunctionList.push(pFunctions[j]);
                    }
                }
            }
        };
        return ExtSystemDataContainer;
    })();

    
    return ExtSystemDataContainer;
});
//# sourceMappingURL=ExtSystemDataContainer.js.map
