/// <reference path="../idl/AIAFXInstruction.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "fx/DeclInstruction", "fx/VariableTypeInstruction", "fx/IdInstruction", "fx/TypedInstruction"], function(require, exports, __DeclInstruction__, __VariableTypeInstruction__, __IdInstruction__, __TypedInstruction__) {
    var DeclInstruction = __DeclInstruction__;
    var VariableTypeInstruction = __VariableTypeInstruction__;
    
    var IdInstruction = __IdInstruction__;
    var TypedInstruction = __TypedInstruction__;

    var SystemFunctionInstruction = (function (_super) {
        __extends(SystemFunctionInstruction, _super);
        function SystemFunctionInstruction(sName, pReturnType, pExprTranslator, pArgumentTypes) {
            _super.call(this);
            this._pExprTranslator = null;
            this._pName = null;
            this._pReturnType = null;
            this._pArguments = null;
            this._sDefinition = "";
            this._sImplementation = "";
            this._pExtSystemTypeList = null;
            this._pExtSystemFunctionList = null;
            this._pExtSystemMacrosList = null;

            this._eInstructionType = 46 /* k_SystemFunctionInstruction */;

            this._pName = new IdInstruction();
            this._pName.setName(sName);
            this._pName.setParent(this);

            this._pReturnType = new VariableTypeInstruction();
            this._pReturnType.pushType(pReturnType);
            this._pReturnType.setParent(this);

            this._pArguments = [];

            if (!isNull(pArgumentTypes)) {
                for (var i = 0; i < pArgumentTypes.length; i++) {
                    var pArgument = new TypedInstruction();
                    pArgument.setType(pArgumentTypes[i]);
                    pArgument.setParent(this);

                    this._pArguments.push(pArgument);
                }
            }

            this._pExprTranslator = pExprTranslator;
        }
        SystemFunctionInstruction.prototype.setDeclCode = function (sDefenition, sImplementation) {
            this._sDefinition = sDefenition;
            this._sImplementation = sImplementation;
        };

        /**
        * Generate code
        */
        SystemFunctionInstruction.prototype.toFinalCode = function () {
            return this._sDefinition + this._sImplementation;
        };

        SystemFunctionInstruction.prototype.toFinalDefCode = function () {
            return this._sDefinition;
        };

        SystemFunctionInstruction.prototype.setUsedSystemData = function (pTypeList, pFunctionList, pMacrosList) {
            this._pExtSystemTypeList = pTypeList;
            this._pExtSystemFunctionList = pFunctionList;
            this._pExtSystemMacrosList = pMacrosList;
        };

        SystemFunctionInstruction.prototype.closeSystemDataInfo = function () {
            for (var i = 0; i < this._pExtSystemFunctionList.length; i++) {
                var pFunction = this._pExtSystemFunctionList[i];

                var pTypes = pFunction._getExtSystemTypeList();
                var pMacroses = pFunction._getExtSystemMacrosList();
                var pFunctions = pFunction._getExtSystemFunctionList();

                for (var j = 0; j < pTypes.length; j++) {
                    if (this._pExtSystemTypeList.indexOf(pTypes[j]) === -1) {
                        this._pExtSystemTypeList.push(pTypes[j]);
                    }
                }

                for (var j = 0; j < pMacroses.length; j++) {
                    if (this._pExtSystemMacrosList.indexOf(pMacroses[j]) === -1) {
                        this._pExtSystemMacrosList.push(pMacroses[j]);
                    }
                }

                for (var j = 0; j < pFunctions.length; j++) {
                    if (this._pExtSystemFunctionList.indexOf(pFunctions[j]) === -1) {
                        this._pExtSystemFunctionList.unshift(pFunctions[j]);
                    }
                }
            }
        };

        SystemFunctionInstruction.prototype.setExprTranslator = function (pExprTranslator) {
            this._pExprTranslator = pExprTranslator;
        };

        SystemFunctionInstruction.prototype.getNameId = function () {
            return this._pName;
        };

        SystemFunctionInstruction.prototype.getArguments = function () {
            return this._pArguments;
        };

        SystemFunctionInstruction.prototype.getNumNeededArguments = function () {
            return this._pArguments.length;
        };

        SystemFunctionInstruction.prototype.hasImplementation = function () {
            return true;
        };

        SystemFunctionInstruction.prototype.getType = function () {
            return this.getReturnType();
        };

        SystemFunctionInstruction.prototype.getReturnType = function () {
            return this._pReturnType;
        };

        SystemFunctionInstruction.prototype.getFunctionType = function () {
            return 2 /* k_Function */;
        };

        SystemFunctionInstruction.prototype.setFunctionType = function (eFunctionType) {
        };

        SystemFunctionInstruction.prototype.closeArguments = function (pArguments) {
            return this._pExprTranslator.toInstructionList(pArguments);
        };

        SystemFunctionInstruction.prototype.setFunctionDef = function (pFunctionDef) {
        };

        SystemFunctionInstruction.prototype.setImplementation = function (pImplementation) {
        };

        SystemFunctionInstruction.prototype.clone = function (pRelationMap) {
            return this;
        };

        SystemFunctionInstruction.prototype._addOutVariable = function (pVariable) {
            return false;
        };

        SystemFunctionInstruction.prototype._getOutVariable = function () {
            return null;
        };

        SystemFunctionInstruction.prototype._getVertexShader = function () {
            return null;
        };

        SystemFunctionInstruction.prototype._getPixelShader = function () {
            return null;
        };

        SystemFunctionInstruction.prototype._markUsedAs = function (eUsedType) {
        };

        SystemFunctionInstruction.prototype._isUsedAs = function (eUsedType) {
            return true;
        };

        SystemFunctionInstruction.prototype._isUsedAsFunction = function () {
            return true;
        };

        SystemFunctionInstruction.prototype._isUsedAsVertex = function () {
            return true;
        };

        SystemFunctionInstruction.prototype._isUsedAsPixel = function () {
            return true;
        };

        SystemFunctionInstruction.prototype._markUsedInVertex = function () {
        };

        SystemFunctionInstruction.prototype._markUsedInPixel = function () {
        };

        SystemFunctionInstruction.prototype._isUsedInVertex = function () {
            return null;
        };

        SystemFunctionInstruction.prototype._isUsedInPixel = function () {
            return null;
        };

        SystemFunctionInstruction.prototype._isUsed = function () {
            return null;
        };

        SystemFunctionInstruction.prototype._checkVertexUsage = function () {
            return this._isForVertex();
        };

        SystemFunctionInstruction.prototype._checkPixelUsage = function () {
            return this._isForPixel();
        };

        SystemFunctionInstruction.prototype._checkDefenitionForVertexUsage = function () {
            return false;
        };

        SystemFunctionInstruction.prototype._checkDefenitionForPixelUsage = function () {
            return false;
        };

        SystemFunctionInstruction.prototype._canUsedAsFunction = function () {
            return true;
        };

        SystemFunctionInstruction.prototype._notCanUsedAsFunction = function () {
        };

        SystemFunctionInstruction.prototype._addUsedFunction = function (pFunction) {
            return false;
        };

        SystemFunctionInstruction.prototype._addUsedVariable = function (pVariable) {
        };

        SystemFunctionInstruction.prototype._getUsedFunctionList = function () {
            return null;
        };

        SystemFunctionInstruction.prototype._isBlackListFunction = function () {
            return false;
        };

        SystemFunctionInstruction.prototype._addToBlackList = function () {
        };

        SystemFunctionInstruction.prototype._getStringDef = function () {
            return "system_func";
        };

        SystemFunctionInstruction.prototype._convertToVertexShader = function () {
            return null;
        };

        SystemFunctionInstruction.prototype._convertToPixelShader = function () {
            return null;
        };

        SystemFunctionInstruction.prototype._prepareForVertex = function () {
        };
        SystemFunctionInstruction.prototype._prepareForPixel = function () {
        };

        SystemFunctionInstruction.prototype.addUsedVariableType = function (pType, eUsedMode) {
            return false;
        };

        SystemFunctionInstruction.prototype._generateInfoAboutUsedData = function () {
        };

        SystemFunctionInstruction.prototype._getAttributeVariableMap = function () {
            return null;
        };

        SystemFunctionInstruction.prototype._getVaryingVariableMap = function () {
            return null;
        };

        SystemFunctionInstruction.prototype._getSharedVariableMap = function () {
            return null;
        };

        SystemFunctionInstruction.prototype._getGlobalVariableMap = function () {
            return null;
        };

        SystemFunctionInstruction.prototype._getUniformVariableMap = function () {
            return null;
        };

        SystemFunctionInstruction.prototype._getForeignVariableMap = function () {
            return null;
        };

        SystemFunctionInstruction.prototype._getTextureVariableMap = function () {
            return null;
        };

        SystemFunctionInstruction.prototype._getUsedComplexTypeMap = function () {
            return null;
        };

        SystemFunctionInstruction.prototype._getAttributeVariableKeys = function () {
            return null;
        };

        SystemFunctionInstruction.prototype._getVaryingVariableKeys = function () {
            return null;
        };

        SystemFunctionInstruction.prototype._getSharedVariableKeys = function () {
            return null;
        };

        SystemFunctionInstruction.prototype._getUniformVariableKeys = function () {
            return null;
        };

        SystemFunctionInstruction.prototype._getForeignVariableKeys = function () {
            return null;
        };

        SystemFunctionInstruction.prototype._getGlobalVariableKeys = function () {
            return null;
        };

        SystemFunctionInstruction.prototype._getTextureVariableKeys = function () {
            return null;
        };

        SystemFunctionInstruction.prototype._getUsedComplexTypeKeys = function () {
            return null;
        };

        SystemFunctionInstruction.prototype._getExtSystemFunctionList = function () {
            return this._pExtSystemFunctionList;
        };

        SystemFunctionInstruction.prototype._getExtSystemMacrosList = function () {
            return this._pExtSystemMacrosList;
        };

        SystemFunctionInstruction.prototype._getExtSystemTypeList = function () {
            return this._pExtSystemTypeList;
        };
        return SystemFunctionInstruction;
    })(DeclInstruction);

    
    return SystemFunctionInstruction;
});
//# sourceMappingURL=SystemFunctionInstruction.js.map
