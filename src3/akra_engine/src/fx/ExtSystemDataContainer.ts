/// <reference path="../idl/AIAFXInstruction.ts" />
/// <reference path="../idl/AIMap.ts" />

class ExtSystemDataContainer {
    protected _pExtSystemMacrosList: AIAFXSimpleInstruction[] = null;
    protected _pExtSystemTypeList: AIAFXTypeDeclInstruction[] = null;
    protected _pExtSystemFunctionList: AIAFXFunctionDeclInstruction[] = null;

    get macroses(): AIAFXSimpleInstruction[] {
        return this._pExtSystemMacrosList;
    }

    get types(): AIAFXTypeDeclInstruction[] {
        return this._pExtSystemTypeList;
    }

    get functions(): AIAFXFunctionDeclInstruction[] {
        return this._pExtSystemFunctionList;
    }

    constructor() {
        this._pExtSystemMacrosList = [];
        this._pExtSystemTypeList = [];
        this._pExtSystemFunctionList = [];
    }

    addFromFunction(pFunction: AIAFXFunctionDeclInstruction): void {
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


export = ExtSystemDataContainer;