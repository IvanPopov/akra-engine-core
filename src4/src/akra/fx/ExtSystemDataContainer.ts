/// <reference path="../idl/IAFXInstruction.ts" />
/// <reference path="../idl/IMap.ts" />

module akra.fx {
    export class ExtSystemDataContainer {
        protected _pExtSystemMacrosList: IAFXSimpleInstruction[] = null;
        protected _pExtSystemTypeList: IAFXTypeDeclInstruction[] = null;
        protected _pExtSystemFunctionList: IAFXFunctionDeclInstruction[] = null;

        getMacroses(): IAFXSimpleInstruction[] {
            return this._pExtSystemMacrosList;
        }

        getTypes(): IAFXTypeDeclInstruction[] {
            return this._pExtSystemTypeList;
        }

        getFunctions(): IAFXFunctionDeclInstruction[] {
            return this._pExtSystemFunctionList;
        }

        constructor() {
            this._pExtSystemMacrosList = [];
            this._pExtSystemTypeList = [];
            this._pExtSystemFunctionList = [];
        }

        addFromFunction(pFunction: IAFXFunctionDeclInstruction): void {
            var pTypes = pFunction._getExtSystemTypeList();
            var pMacroses = pFunction._getExtSystemMacrosList();
            var pFunctions = pFunction._getExtSystemFunctionList();

            if (!isNull(pTypes)) {
                for (var j: uint = 0; j < pTypes.length; j++) {
                    if (this._pExtSystemTypeList.indexOf(pTypes[j]) === -1) {
                        this._pExtSystemTypeList.push(pTypes[j]);
                    }
                }
            }

            if (!isNull(pMacroses)) {
                for (var j: uint = 0; j < pMacroses.length; j++) {
                    if (this._pExtSystemMacrosList.indexOf(pMacroses[j]) === -1) {
                        this._pExtSystemMacrosList.push(pMacroses[j]);
                    }
                }
            }

            if (!isNull(pFunctions)) {
                for (var j: uint = 0; j < pFunctions.length; j++) {
                    if (this._pExtSystemFunctionList.indexOf(pFunctions[j]) === -1) {
                        this._pExtSystemFunctionList.push(pFunctions[j]);
                    }
                }
            }
        }
    }
}