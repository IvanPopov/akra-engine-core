/// <reference path="../idl/IAFXInstruction.ts" />
/// <reference path="../idl/parser/IParser.ts" />
/// <reference path="../idl/EEffectErrors.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="../debug.ts" />
    /// <reference path="DeclInstruction.ts" />
    /// <reference path="ExtractStmtInstruction.ts" />
    /// <reference path="FunctionDefInstruction.ts" />
    /// <reference path="IdInstruction.ts" />
    /// <reference path="Instruction.ts" />
    /// <reference path="InstructionCollector.ts" />
    /// <reference path="SamplerStateBlockInstruction.ts" />
    /// <reference path="StmtBlockInstruction.ts" />
    /// <reference path="VariableTypeInstruction.ts" />
    /// <reference path="VariableInstruction.ts" />
    /// <reference path="Effect.ts" />
    (function (fx) {
        /**
        * Represent type func(...args)[:Semantic] [<Annotation> {stmts}]
        * EMPTY_OPERTOR FunctionDefInstruction StmtBlockInstruction
        */
        var FunctionDeclInstruction = (function (_super) {
            __extends(FunctionDeclInstruction, _super);
            function FunctionDeclInstruction() {
                _super.call(this);
                this._pFunctionDefenition = null;
                this._pImplementation = null;
                this._eFunctionType = 2 /* k_Function */;
                this._bUsedAsFunction = false;
                this._bUsedAsVertex = false;
                this._bUsedAsPixel = false;
                this._bCanUsedAsFunction = true;
                this._bUsedInVertex = false;
                this._bUsedInPixel = false;
                this._pParseNode = null;
                this._iImplementationScope = akra.fx.Instruction.UNDEFINE_SCOPE;
                this._isInBlackList = false;
                this._pOutVariable = null;
                //Info about used data
                this._pUsedFunctionMap = null;
                this._pUsedFunctionList = null;
                this._pAttributeVariableMap = null;
                this._pVaryingVariableMap = null;
                this._pUsedVarTypeMap = null;
                this._pSharedVariableMap = null;
                this._pGlobalVariableMap = null;
                this._pUniformVariableMap = null;
                this._pForeignVariableMap = null;
                this._pTextureVariableMap = null;
                // protected _pSharedVariableTypeList: IAFXVariableTypeInstruction[] = null;
                // protected _pGlobalVariableTypeList: IAFXVariableTypeInstruction[] = null;
                // protected _pUniformVariableTypeList: IAFXVariableTypeInstruction[] = null;
                // protected _pForeignVariableTypeList: IAFXVariableTypeInstructionnt[] = null;
                this._pUsedComplexTypeMap = null;
                this._pAttributeVariableKeys = null;
                this._pVaryingVariableKeys = null;
                this._pSharedVariableKeys = null;
                this._pUniformVariableKeys = null;
                this._pForeignVariableKeys = null;
                this._pGlobalVariableKeys = null;
                this._pTextureVariableKeys = null;
                this._pUsedComplexTypeKeys = null;
                this._pVertexShader = null;
                this._pPixelShader = null;
                this._pExtSystemTypeList = null;
                this._pExtSystemFunctionList = null;
                this._pExtSystemMacrosList = null;
                this._pInstructionList = [null, null];
                this._eInstructionType = 44 /* k_FunctionDeclInstruction */;
            }
            FunctionDeclInstruction.prototype.toFinalCode = function () {
                var sCode = "";

                sCode += this._pFunctionDefenition.toFinalCode();
                sCode += this._pImplementation.toFinalCode();

                return sCode;
            };

            FunctionDeclInstruction.prototype.toFinalDefCode = function () {
                return this._pFunctionDefenition.toFinalCode();
            };

            FunctionDeclInstruction.prototype.getType = function () {
                return this.getReturnType();
            };

            FunctionDeclInstruction.prototype.getName = function () {
                return this._pFunctionDefenition.getName();
            };

            FunctionDeclInstruction.prototype.getRealName = function () {
                return this._pFunctionDefenition.getRealName();
            };

            FunctionDeclInstruction.prototype.getNameId = function () {
                return this._pFunctionDefenition.getNameId();
            };

            FunctionDeclInstruction.prototype.getArguments = function () {
                return this._pFunctionDefenition.getArguments();
            };

            FunctionDeclInstruction.prototype.getNumNeededArguments = function () {
                return this._pFunctionDefenition.getNumNeededArguments();
            };

            FunctionDeclInstruction.prototype.hasImplementation = function () {
                return !akra.isNull(this._pImplementation) || !akra.isNull(this._pParseNode);
            };

            FunctionDeclInstruction.prototype.getReturnType = function () {
                return this._pFunctionDefenition.getReturnType();
            };

            FunctionDeclInstruction.prototype.getFunctionType = function () {
                return this._eFunctionType;
            };

            FunctionDeclInstruction.prototype.setFunctionType = function (eFunctionType) {
                this._eFunctionType = eFunctionType;
            };

            FunctionDeclInstruction.prototype._setImplementationScope = function (iScope) {
                this._iImplementationScope = iScope;
            };

            FunctionDeclInstruction.prototype._getImplementationScope = function () {
                return this._iImplementationScope;
            };

            FunctionDeclInstruction.prototype._setParseNode = function (pNode) {
                this._pParseNode = pNode;
            };

            FunctionDeclInstruction.prototype._getParseNode = function () {
                return this._pParseNode;
            };

            FunctionDeclInstruction.prototype.setFunctionDef = function (pFunctionDef) {
                this._pFunctionDefenition = pFunctionDef;
                this._pInstructionList[0] = pFunctionDef;
                pFunctionDef.setParent(this);
                this._nInstructions = this._nInstructions === 0 ? 1 : this._nInstructions;
            };

            FunctionDeclInstruction.prototype.setImplementation = function (pImplementation) {
                this._pImplementation = pImplementation;
                this._pInstructionList[1] = pImplementation;
                pImplementation.setParent(pImplementation);
                this._nInstructions = 2;

                this._pParseNode = null;
            };

            FunctionDeclInstruction.prototype.clone = function (pRelationMap) {
                if (typeof pRelationMap === "undefined") { pRelationMap = {}; }
                var pClone = _super.prototype.clone.call(this, pRelationMap);

                if (!akra.isNull(this._pOutVariable)) {
                    pClone._setOutVariable(pRelationMap[this._pOutVariable._getInstructionID()]);
                }

                var pUsedVarTypeMap = this.cloneVarTypeUsedMap(this._pUsedVarTypeMap, pRelationMap);
                var pSharedVariableMap = this.cloneVarDeclMap(this._pSharedVariableMap, pRelationMap);
                var pGlobalVariableMap = this.cloneVarDeclMap(this._pGlobalVariableMap, pRelationMap);
                var pUniformVariableMap = this.cloneVarDeclMap(this._pUniformVariableMap, pRelationMap);
                var pForeignVariableMap = this.cloneVarDeclMap(this._pForeignVariableMap, pRelationMap);
                var pTextureVariableMap = this.cloneVarDeclMap(this._pTextureVariableMap, pRelationMap);
                var pUsedComplexTypeMap = this.cloneTypeMap(this._pUsedComplexTypeMap, pRelationMap);

                pClone._setUsedFunctions(this._pUsedFunctionMap, this._pUsedFunctionList);
                pClone._setUsedVariableData(pUsedVarTypeMap, pSharedVariableMap, pGlobalVariableMap, pUniformVariableMap, pForeignVariableMap, pTextureVariableMap, pUsedComplexTypeMap);
                pClone._initAfterClone();

                return pClone;
            };

            FunctionDeclInstruction.prototype._addOutVariable = function (pVariable) {
                if (!akra.isNull(this._pOutVariable)) {
                    return false;
                }

                if (!pVariable.getType().isEqual(this.getReturnType())) {
                    return false;
                }

                this._pOutVariable = pVariable;
                return true;
            };

            FunctionDeclInstruction.prototype._getOutVariable = function () {
                return this._pOutVariable;
            };

            FunctionDeclInstruction.prototype._getVertexShader = function () {
                return this._pVertexShader;
            };

            FunctionDeclInstruction.prototype._getPixelShader = function () {
                return this._pPixelShader;
            };

            FunctionDeclInstruction.prototype._markUsedAs = function (eUsedType) {
                switch (eUsedType) {
                    case 0 /* k_Vertex */:
                        this._bUsedInVertex = true;
                        this._bUsedAsVertex = true;
                        break;
                    case 1 /* k_Pixel */:
                        this._bUsedInPixel = true;
                        this._bUsedAsPixel = true;
                        break;
                    case 2 /* k_Function */:
                        this._bUsedAsFunction = true;
                        break;
                }
            };

            FunctionDeclInstruction.prototype._isUsedAs = function (eUsedType) {
                switch (eUsedType) {
                    case 0 /* k_Vertex */:
                        return this._bUsedAsVertex;
                    case 1 /* k_Pixel */:
                        return this._bUsedAsPixel;
                    case 2 /* k_Function */:
                        return this._bUsedAsFunction;
                }
            };

            FunctionDeclInstruction.prototype._isUsedAsFunction = function () {
                return this._bUsedAsFunction;
            };

            FunctionDeclInstruction.prototype._isUsedAsVertex = function () {
                return this._bUsedAsVertex;
            };

            FunctionDeclInstruction.prototype._isUsedAsPixel = function () {
                return this._bUsedAsPixel;
            };

            FunctionDeclInstruction.prototype._markUsedInVertex = function () {
                this._bUsedInVertex = true;
            };

            FunctionDeclInstruction.prototype._markUsedInPixel = function () {
                this._bUsedInPixel = true;
            };

            FunctionDeclInstruction.prototype._isUsedInVertex = function () {
                return this._bUsedInVertex;
            };

            FunctionDeclInstruction.prototype._isUsedInPixel = function () {
                return this._bUsedInPixel;
            };

            FunctionDeclInstruction.prototype._isUsed = function () {
                return this._bUsedAsFunction || this._bUsedAsVertex || this._bUsedAsPixel;
            };

            FunctionDeclInstruction.prototype._checkVertexUsage = function () {
                return this._isUsedInVertex() ? this._isForVertex() : true;
            };

            FunctionDeclInstruction.prototype._checkPixelUsage = function () {
                return this._isUsedInPixel() ? this._isForPixel() : true;
            };

            FunctionDeclInstruction.prototype._checkDefenitionForVertexUsage = function () {
                return this._pFunctionDefenition._checkForVertexUsage();
            };

            FunctionDeclInstruction.prototype._checkDefenitionForPixelUsage = function () {
                return this._pFunctionDefenition._checkForPixelUsage();
            };

            FunctionDeclInstruction.prototype._canUsedAsFunction = function () {
                return this._bCanUsedAsFunction && this._pFunctionDefenition._canUsedAsFunction();
            };

            FunctionDeclInstruction.prototype._notCanUsedAsFunction = function () {
                this._bCanUsedAsFunction = false;
            };

            FunctionDeclInstruction.prototype._addUsedFunction = function (pFunction) {
                if (pFunction._getInstructionType() === 46 /* k_SystemFunctionInstruction */ && !pFunction.isBuiltIn()) {
                    this.addExtSystemFunction(pFunction);
                    return true;
                }

                if (akra.isNull(this._pUsedFunctionMap)) {
                    this._pUsedFunctionMap = {};
                    this._pUsedFunctionList = [];
                }

                var iFuncId = pFunction._getInstructionID();

                if (!akra.isDef(this._pUsedFunctionMap[iFuncId])) {
                    this._pUsedFunctionMap[iFuncId] = pFunction;
                    this._pUsedFunctionList.push(pFunction);
                    return true;
                }

                return false;
            };

            FunctionDeclInstruction.prototype._addUsedVariable = function (pVariable) {
            };

            FunctionDeclInstruction.prototype._getUsedFunctionList = function () {
                return this._pUsedFunctionList;
            };

            FunctionDeclInstruction.prototype._isBlackListFunction = function () {
                return this._isInBlackList;
            };

            FunctionDeclInstruction.prototype._addToBlackList = function () {
                this._isInBlackList = true;
            };

            FunctionDeclInstruction.prototype._getStringDef = function () {
                return this._pFunctionDefenition._getStringDef();
            };

            FunctionDeclInstruction.prototype._convertToVertexShader = function () {
                var pShader = null;

                if ((!this._canUsedAsFunction() || !this._isUsedAsFunction()) && (!this._isUsedInPixel())) {
                    pShader = this;
                } else {
                    pShader = this.clone();
                }

                pShader._prepareForVertex();
                this._pVertexShader = pShader;

                return pShader;
            };

            FunctionDeclInstruction.prototype._convertToPixelShader = function () {
                var pShader = null;

                if ((!this._canUsedAsFunction() || !this._isUsedAsFunction()) && (!this._isUsedInVertex())) {
                    pShader = this;
                } else {
                    pShader = this.clone();
                }

                pShader._prepareForPixel();
                this._pPixelShader = pShader;

                return pShader;
            };

            FunctionDeclInstruction.prototype._prepareForVertex = function () {
                this.setFunctionType(0 /* k_Vertex */);

                var pShaderInputParamList = this._pFunctionDefenition.getParameListForShaderInput();
                for (var i = 0; i < pShaderInputParamList.length; i++) {
                    var pParamType = pShaderInputParamList[i].getType();

                    if (pParamType.isComplex() && akra.isDef(this._pUsedVarTypeMap[pParamType._getInstructionID()]) && this._pUsedVarTypeMap[pParamType._getInstructionID()].isRead) {
                        this.setError(2301 /* BAD_LOCAL_OF_SHADER_INPUT */, { funcName: this.getName() });
                        return;
                    }
                }

                var pOutVariable = this._getOutVariable();

                if (!akra.isNull(pOutVariable)) {
                    if (akra.isDef(this._pUsedVarTypeMap[pOutVariable.getType()._getInstructionID()]) && this._pUsedVarTypeMap[pOutVariable.getType()._getInstructionID()].isRead) {
                        this.setError(2302 /* BAD_LOCAL_OF_SHADER_OUTPUT */, { funcName: this.getName() });
                        return;
                    }

                    pOutVariable._markAsShaderOutput(true);
                }

                if (this._pFunctionDefenition.isComplexShaderInput()) {
                    pShaderInputParamList[0].setVisible(false);
                }

                this._pImplementation.prepareFor(0 /* k_Vertex */);
                this._pFunctionDefenition.markAsShaderDef(true);
                this.generatesVertexAttrubutes();
                this.generateVertexVaryings();
            };

            FunctionDeclInstruction.prototype._prepareForPixel = function () {
                this.setFunctionType(1 /* k_Pixel */);

                var pShaderInputParamList = this._pFunctionDefenition.getParameListForShaderInput();
                for (var i = 0; i < pShaderInputParamList.length; i++) {
                    var pParamType = pShaderInputParamList[i].getType();

                    if (pParamType.isComplex() && akra.isDef(this._pUsedVarTypeMap[pParamType._getInstructionID()]) && this._pUsedVarTypeMap[pParamType._getInstructionID()].isRead) {
                        this.setError(2301 /* BAD_LOCAL_OF_SHADER_INPUT */, { funcName: this.getName() });
                        return;
                    }
                }

                if (this._pFunctionDefenition.isComplexShaderInput()) {
                    pShaderInputParamList[0].setVisible(false);
                }

                this._pImplementation.prepareFor(1 /* k_Pixel */);
                this._pFunctionDefenition.markAsShaderDef(true);

                this.generatePixelVaryings();
            };

            FunctionDeclInstruction.prototype._setOutVariable = function (pVar) {
                this._pOutVariable = pVar;
            };

            FunctionDeclInstruction.prototype._setUsedFunctions = function (pUsedFunctionMap, pUsedFunctionList) {
                this._pUsedFunctionMap = pUsedFunctionMap;
                this._pUsedFunctionList = pUsedFunctionList;
            };

            FunctionDeclInstruction.prototype._setUsedVariableData = function (pUsedVarTypeMap, pSharedVariableMap, pGlobalVariableMap, pUniformVariableMap, pForeignVariableMap, pTextureVariableMap, pUsedComplexTypeMap) {
                this._pUsedVarTypeMap = pUsedVarTypeMap;
                this._pSharedVariableMap = pSharedVariableMap;
                this._pGlobalVariableMap = pGlobalVariableMap;
                this._pUniformVariableMap = pUniformVariableMap;
                this._pForeignVariableMap = pForeignVariableMap;
                this._pTextureVariableMap = pTextureVariableMap;
                this._pUsedComplexTypeMap = pUsedComplexTypeMap;
            };

            FunctionDeclInstruction.prototype._initAfterClone = function () {
                this._pFunctionDefenition = this._pInstructionList[0];
                this._pImplementation = this._pInstructionList[1];
            };

            FunctionDeclInstruction.prototype._generateInfoAboutUsedData = function () {
                if (!akra.isNull(this._pUsedVarTypeMap)) {
                    return;
                }

                var pUsedData = {};
                this._pImplementation.addUsedData(pUsedData);

                this._pUsedVarTypeMap = pUsedData;

                if (akra.isNull(this._pUsedComplexTypeMap)) {
                    this._pSharedVariableMap = {};
                    this._pGlobalVariableMap = {};
                    this._pUniformVariableMap = {};
                    this._pForeignVariableMap = {};
                    this._pTextureVariableMap = {};
                    this._pUsedComplexTypeMap = {};
                }

                for (var i in pUsedData) {
                    var pAnalyzedInfo = pUsedData[i];
                    var pAnalyzedType = pAnalyzedInfo.type;

                    if (pAnalyzedType._isInGlobalScope()) {
                        this.addGlobalVariableType(pAnalyzedType, pAnalyzedInfo.isWrite, pAnalyzedInfo.isRead);
                    } else if (pAnalyzedType.isUniform()) {
                        this.addUniformParameter(pAnalyzedType);
                    } else if (pAnalyzedType._getScope() < this._getImplementationScope()) {
                        if (!this._isUsedAsFunction()) {
                            if (!akra.isNull(this._getOutVariable()) && this._getOutVariable().getType() !== pAnalyzedType) {
                                this.addUsedComplexType(pAnalyzedType.getBaseType());
                            }
                        }
                    }
                }
                if (!akra.isNull(this._pUsedFunctionList)) {
                    for (var j = 0; j < this._pUsedFunctionList.length; j++) {
                        this.addUsedInfoFromFunction(this._pUsedFunctionList[j]);
                    }
                }
            };

            FunctionDeclInstruction.prototype._getAttributeVariableMap = function () {
                return this._pAttributeVariableMap;
            };

            FunctionDeclInstruction.prototype._getVaryingVariableMap = function () {
                return this._pVaryingVariableMap;
            };

            FunctionDeclInstruction.prototype._getSharedVariableMap = function () {
                return this._pSharedVariableMap;
            };

            FunctionDeclInstruction.prototype._getGlobalVariableMap = function () {
                return this._pGlobalVariableMap;
            };

            FunctionDeclInstruction.prototype._getUniformVariableMap = function () {
                return this._pUniformVariableMap;
            };

            FunctionDeclInstruction.prototype._getForeignVariableMap = function () {
                return this._pForeignVariableMap;
            };

            FunctionDeclInstruction.prototype._getTextureVariableMap = function () {
                return this._pTextureVariableMap;
            };

            FunctionDeclInstruction.prototype._getUsedComplexTypeMap = function () {
                return this._pUsedComplexTypeMap;
            };

            FunctionDeclInstruction.prototype._getAttributeVariableKeys = function () {
                if (akra.isNull(this._pAttributeVariableKeys) && !akra.isNull(this._pAttributeVariableMap)) {
                    this._pAttributeVariableKeys = Object.keys(this._pAttributeVariableMap);
                }

                return this._pAttributeVariableKeys;
            };

            FunctionDeclInstruction.prototype._getVaryingVariableKeys = function () {
                if (akra.isNull(this._pVaryingVariableKeys) && !akra.isNull(this._pVaryingVariableMap)) {
                    this._pVaryingVariableKeys = Object.keys(this._pVaryingVariableMap);
                }

                return this._pVaryingVariableKeys;
            };

            FunctionDeclInstruction.prototype._getSharedVariableKeys = function () {
                if (akra.isNull(this._pSharedVariableKeys) && !akra.isNull(this._pSharedVariableMap)) {
                    this._pSharedVariableKeys = Object.keys(this._pSharedVariableMap);
                }

                return this._pSharedVariableKeys;
            };

            FunctionDeclInstruction.prototype._getUniformVariableKeys = function () {
                if (akra.isNull(this._pUniformVariableKeys) && !akra.isNull(this._pUniformVariableMap)) {
                    this._pUniformVariableKeys = Object.keys(this._pUniformVariableMap);
                }

                return this._pUniformVariableKeys;
            };

            FunctionDeclInstruction.prototype._getForeignVariableKeys = function () {
                if (akra.isNull(this._pForeignVariableKeys) && !akra.isNull(this._pForeignVariableMap)) {
                    this._pForeignVariableKeys = Object.keys(this._pForeignVariableMap);
                }

                return this._pForeignVariableKeys;
            };

            FunctionDeclInstruction.prototype._getGlobalVariableKeys = function () {
                if (akra.isNull(this._pGlobalVariableKeys) && !akra.isNull(this._pGlobalVariableMap)) {
                    this._pGlobalVariableKeys = Object.keys(this._pGlobalVariableMap);
                }

                return this._pGlobalVariableKeys;
            };

            FunctionDeclInstruction.prototype._getTextureVariableKeys = function () {
                if (akra.isNull(this._pTextureVariableKeys) && !akra.isNull(this._pTextureVariableMap)) {
                    this._pTextureVariableKeys = Object.keys(this._pTextureVariableMap);
                }

                return this._pTextureVariableKeys;
            };

            FunctionDeclInstruction.prototype._getUsedComplexTypeKeys = function () {
                if (akra.isNull(this._pUsedComplexTypeKeys)) {
                    this._pUsedComplexTypeKeys = Object.keys(this._pUsedComplexTypeMap);
                }

                return this._pUsedComplexTypeKeys;
            };

            FunctionDeclInstruction.prototype._getExtSystemFunctionList = function () {
                return this._pExtSystemFunctionList;
            };

            FunctionDeclInstruction.prototype._getExtSystemMacrosList = function () {
                return this._pExtSystemMacrosList;
            };

            FunctionDeclInstruction.prototype._getExtSystemTypeList = function () {
                return this._pExtSystemTypeList;
            };

            FunctionDeclInstruction.prototype.generatesVertexAttrubutes = function () {
                var pShaderInputParamList = this._pFunctionDefenition.getParameListForShaderInput();
                var isComplexInput = this._pFunctionDefenition.isComplexShaderInput();

                this._pAttributeVariableMap = {};

                if (isComplexInput) {
                    var pContainerVariable = pShaderInputParamList[0];
                    var pContainerType = pContainerVariable.getType();

                    var pAttributeNames = pContainerType.getFieldNameList();

                    for (var i = 0; i < pAttributeNames.length; i++) {
                        var pAttr = pContainerType.getField(pAttributeNames[i]);

                        if (!this.isVariableTypeUse(pAttr.getType())) {
                            continue;
                        }

                        this._pAttributeVariableMap[pAttr._getInstructionID()] = pAttr;
                        this.generateExtractBlockForAttribute(pAttr);
                    }
                } else {
                    for (var i = 0; i < pShaderInputParamList.length; i++) {
                        var pAttr = pShaderInputParamList[i];

                        if (!this.isVariableTypeUse(pAttr.getType())) {
                            continue;
                        }

                        this._pAttributeVariableMap[pAttr._getInstructionID()] = pAttr;
                        this.generateExtractBlockForAttribute(pAttr);
                    }
                }

                this._pAttributeVariableKeys = this._getAttributeVariableKeys();
            };

            FunctionDeclInstruction.prototype.generateVertexVaryings = function () {
                if (akra.isNull(this._getOutVariable())) {
                    return;
                }

                this._pVaryingVariableMap = {};

                var pContainerVariable = this._getOutVariable();
                var pContainerType = pContainerVariable.getType();

                var pVaryingNames = pContainerType.getFieldNameList();

                for (var i = 0; i < pVaryingNames.length; i++) {
                    var pVarying = pContainerType.getField(pVaryingNames[i]);

                    if (!this.isVariableTypeUse(pVarying.getType())) {
                        continue;
                    }

                    this._pVaryingVariableMap[pVarying._getInstructionID()] = pVarying;
                }

                this._pVaryingVariableKeys = this._getVaryingVariableKeys();
            };

            FunctionDeclInstruction.prototype.generatePixelVaryings = function () {
                var pShaderInputParamList = this._pFunctionDefenition.getParameListForShaderInput();
                var isComplexInput = this._pFunctionDefenition.isComplexShaderInput();

                this._pVaryingVariableMap = {};

                if (isComplexInput) {
                    var pContainerVariable = pShaderInputParamList[0];
                    var pContainerType = pContainerVariable.getType();

                    var pVaryingNames = pContainerType.getFieldNameList();

                    for (var i = 0; i < pVaryingNames.length; i++) {
                        var pVarying = pContainerType.getField(pVaryingNames[i]);

                        if (!this.isVariableTypeUse(pVarying.getType())) {
                            continue;
                        }

                        this._pVaryingVariableMap[pVarying._getInstructionID()] = pVarying;
                    }
                } else {
                    for (var i = 0; i < pShaderInputParamList.length; i++) {
                        var pVarying = pShaderInputParamList[i];

                        if (!this.isVariableTypeUse(pVarying.getType())) {
                            continue;
                        }

                        this._pVaryingVariableMap[pVarying._getInstructionID()] = pVarying;
                    }
                }

                this._pVaryingVariableKeys = this._getVaryingVariableKeys();
            };

            FunctionDeclInstruction.prototype.cloneVarTypeUsedMap = function (pMap, pRelationMap) {
                var pCloneMap = {};

                for (var j in pMap) {
                    var pType = (akra.isDef(pRelationMap[j]) ? pRelationMap[j] : pMap[j].type);
                    var id = pType._getInstructionID();
                    pCloneMap[id] = {
                        type: pType,
                        isRead: pMap[j].isRead,
                        isWrite: pMap[j].isWrite,
                        numRead: pMap[j].numRead,
                        numWrite: pMap[j].numWrite,
                        numUsed: pMap[j].numUsed
                    };
                }

                return pCloneMap;
            };

            FunctionDeclInstruction.prototype.cloneVarDeclMap = function (pMap, pRelationMap) {
                var pCloneMap = {};

                for (var i in pMap) {
                    var pVar = (akra.isDef(pRelationMap[i]) ? pRelationMap[i] : pMap[i]);

                    if (!akra.isNull(pVar)) {
                        var id = pVar._getInstructionID();
                        pCloneMap[id] = pVar;
                    }
                }

                return pCloneMap;
            };

            FunctionDeclInstruction.prototype.cloneTypeMap = function (pMap, pRelationMap) {
                var pCloneMap = {};

                for (var i in pMap) {
                    var pVar = (akra.isDef(pRelationMap[i]) ? pRelationMap[i] : pMap[i]);
                    var id = pVar._getInstructionID();
                    pCloneMap[id] = pVar;
                }

                return pCloneMap;
            };

            FunctionDeclInstruction.prototype.addGlobalVariableType = function (pVariableType, isWrite, isRead) {
                if (!pVariableType.isFromVariableDecl()) {
                    return;
                }

                var pVariable = pVariableType._getParentVarDecl();
                var pMainVariable = pVariableType._getMainVariable();
                var iMainVar = pMainVariable._getInstructionID();
                var iVar = pVariable._getInstructionID();

                if (pMainVariable.getType().isShared()) {
                    // this._pSharedVariableMap[iVar] = pVariable;
                    this._pSharedVariableMap[iMainVar] = pMainVariable;
                } else if (pMainVariable.getType().isForeign()) {
                    this._pForeignVariableMap[iMainVar] = pMainVariable;
                } else if (isWrite || pMainVariable.getType().isConst()) {
                    this._pGlobalVariableMap[iMainVar] = pMainVariable;
                    if (akra.isDefAndNotNull(this._pUniformVariableMap[iMainVar])) {
                        this._pUniformVariableMap[iMainVar] = null;
                    }
                } else {
                    if (!akra.isDef(this._pGlobalVariableMap[iMainVar])) {
                        this._pUniformVariableMap[iMainVar] = pMainVariable;

                        if (!pMainVariable.getType().isComplex() && pMainVariable.hasConstantInitializer()) {
                            pMainVariable.prepareDefaultValue();
                        }
                    }
                }

                if (pVariable.isSampler() && pVariable.hasInitializer()) {
                    var pInitExpr = pVariable.getInitializeExpr();
                    var pTexture = null;
                    var pSamplerStates = null;

                    if (pVariableType.isArray()) {
                        var pList = pInitExpr.getInstructions();
                        for (var i = 0; i < pList.length; i++) {
                            pSamplerStates = pList[i].getInstructions()[0];
                            pTexture = pSamplerStates.getTexture();

                            if (!akra.isNull(pTexture)) {
                                this._pTextureVariableMap[pTexture._getInstructionID()] = pTexture;
                            }
                        }
                    } else {
                        pSamplerStates = pInitExpr.getInstructions()[0];
                        pTexture = pSamplerStates.getTexture();

                        if (!akra.isNull(pTexture)) {
                            this._pTextureVariableMap[pTexture._getInstructionID()] = pTexture;
                        }
                    }
                }
                // this.addUsedComplexType(pMainVariable.getType().getBaseType());
            };

            FunctionDeclInstruction.prototype.addUniformParameter = function (pType) {
                var pMainVariable = pType._getMainVariable();
                var iMainVar = pMainVariable._getInstructionID();

                if (akra.isDef(this._pGlobalVariableMap[iMainVar])) {
                    akra.debug.error("UNEXPECTED ERROR WITH UNIFORM_PARAMETER");
                }

                this._pUniformVariableMap[iMainVar] = pMainVariable;
                this.addUsedComplexType(pMainVariable.getType().getBaseType());

                if (!pMainVariable.getType().isComplex() && pMainVariable.hasConstantInitializer()) {
                    pMainVariable.prepareDefaultValue();
                }
            };

            FunctionDeclInstruction.prototype.addUsedComplexType = function (pType) {
                if (pType.isBase() || akra.isDef(this._pUsedComplexTypeMap[pType._getInstructionID()])) {
                    return;
                }

                this._pUsedComplexTypeMap[pType._getInstructionID()] = pType;

                var pFieldNameList = pType.getFieldNameList();

                for (var i = 0; i < pFieldNameList.length; i++) {
                    this.addUsedComplexType(pType.getFieldType(pFieldNameList[i]).getBaseType());
                }
            };

            FunctionDeclInstruction.prototype.addUsedInfoFromFunction = function (pFunction) {
                pFunction._generateInfoAboutUsedData();

                var pSharedVarMap = pFunction._getSharedVariableMap();
                var pGlobalVarMap = pFunction._getGlobalVariableMap();
                var pUniformVarMap = pFunction._getUniformVariableMap();
                var pForeignVarMap = pFunction._getForeignVariableMap();
                var pTextureVarMap = pFunction._getTextureVariableMap();
                var pUsedComplexTypeMap = pFunction._getUsedComplexTypeMap();

                for (var j in pSharedVarMap) {
                    this._pSharedVariableMap[pSharedVarMap[j]._getInstructionID()] = pSharedVarMap[j];
                }

                for (var j in pForeignVarMap) {
                    this._pForeignVariableMap[pForeignVarMap[j]._getInstructionID()] = pForeignVarMap[j];
                }

                for (var j in pTextureVarMap) {
                    this._pTextureVariableMap[pTextureVarMap[j]._getInstructionID()] = pTextureVarMap[j];
                }

                for (var j in pGlobalVarMap) {
                    this._pGlobalVariableMap[pGlobalVarMap[j]._getInstructionID()] = pGlobalVarMap[j];

                    if (akra.isDefAndNotNull(this._pUniformVariableMap[pGlobalVarMap[j]._getInstructionID()])) {
                        this._pUniformVariableMap[pGlobalVarMap[j]._getInstructionID()] = null;
                    }
                }

                for (var j in pUniformVarMap) {
                    if (!akra.isDef(this._pGlobalVariableMap[pUniformVarMap[j]._getInstructionID()])) {
                        this._pUniformVariableMap[pUniformVarMap[j]._getInstructionID()] = pUniformVarMap[j];
                    }
                }

                for (var j in pUsedComplexTypeMap) {
                    this._pUsedComplexTypeMap[pUsedComplexTypeMap[j]._getInstructionID()] = pUsedComplexTypeMap[j];
                }

                this.addExtSystemFunction(pFunction);
            };

            FunctionDeclInstruction.prototype.addExtSystemFunction = function (pFunction) {
                if (akra.isNull(this._pExtSystemFunctionList)) {
                    this._pExtSystemFunctionList = [];
                    this._pExtSystemTypeList = [];
                    this._pExtSystemMacrosList = [];
                }

                if (pFunction._getInstructionType() === 46 /* k_SystemFunctionInstruction */) {
                    if (this._pExtSystemFunctionList.indexOf(pFunction) !== -1) {
                        return;
                    }

                    this._pExtSystemFunctionList.push(pFunction);
                }

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
                            this._pExtSystemFunctionList.unshift(pFunctions[j]);
                        }
                    }
                }
            };

            FunctionDeclInstruction.prototype.isVariableTypeUse = function (pVariableType) {
                var id = pVariableType._getInstructionID();

                if (!akra.isDef(this._pUsedVarTypeMap[id])) {
                    return false;
                }

                if (this._pUsedVarTypeMap[id].numUsed === 0) {
                    return false;
                }

                return true;
            };

            FunctionDeclInstruction.prototype.generateExtractBlockForAttribute = function (pAttr) {
                if (!pAttr.getType().isPointer()) {
                    return null;
                }

                var pExtractCollector = new akra.fx.InstructionCollector();
                var pMainPointer = pAttr.getType()._getMainPointer();

                pAttr._setAttrExtractionBlock(pExtractCollector);

                this.generateExtractStmtFromPointer(pMainPointer, null, 0, pExtractCollector);

                pAttr.getType().getSubVarDecls();

                return pExtractCollector;
            };

            FunctionDeclInstruction.prototype.generateExtractStmtFromPointer = function (pPointer, pOffset, iDepth, pCollector) {
                var pPointerType = pPointer.getType();
                var pWhatExtracted = pPointerType._getDownPointer();
                var pWhatExtractedType = null;

                while (!akra.isNull(pWhatExtracted)) {
                    pWhatExtractedType = pWhatExtracted.getType();

                    if (!pWhatExtractedType.isPointIndex() && iDepth === 0) {
                        pOffset = this.createOffsetForAttr(pWhatExtracted);
                    }

                    if (!pWhatExtractedType.isComplex()) {
                        var pSingleExtract = new akra.fx.ExtractStmtInstruction();
                        pSingleExtract.generateStmtForBaseType(pWhatExtracted, pWhatExtractedType.getPointer(), pWhatExtractedType.getVideoBuffer(), 0, pWhatExtractedType.isPointIndex() ? null : pOffset);

                        this._addUsedFunction(pSingleExtract.getExtractFunction());
                        pCollector.push(pSingleExtract, true);
                    } else {
                        iDepth++;
                        this.generateExtractStmtForComplexVar(pWhatExtracted, iDepth <= 1 ? pOffset : null, iDepth, pCollector, pWhatExtractedType.getPointer(), pWhatExtractedType.getVideoBuffer(), 0);
                    }

                    pWhatExtracted = pWhatExtractedType._getDownPointer();
                }
            };

            FunctionDeclInstruction.prototype.generateExtractStmtForComplexVar = function (pVarDecl, pOffset, iDepth, pCollector, pPointer, pBuffer, iPadding) {
                var pVarType = pVarDecl.getType();
                var pFieldNameList = pVarType.getFieldNameList();
                var pField = null;
                var pFieldType = null;
                var pSingleExtract = null;
                var isNeedPadding = false;

                for (var i = 0; i < pFieldNameList.length; i++) {
                    pField = pVarType.getField(pFieldNameList[i]);

                    if (akra.isNull(pField)) {
                        continue;
                    }

                    pFieldType = pField.getType();

                    if (iDepth <= 1) {
                        pOffset = this.createOffsetForAttr(pField);
                        isNeedPadding = false;
                    } else {
                        isNeedPadding = true;
                    }

                    if (pFieldType.isPointer()) {
                        var pFieldPointer = pFieldType._getMainPointer();
                        pSingleExtract = new akra.fx.ExtractStmtInstruction();
                        pSingleExtract.generateStmtForBaseType(pFieldPointer, pPointer, pFieldType.getVideoBuffer(), isNeedPadding ? (iPadding + pFieldType.getPadding()) : 0, pOffset);

                        this._addUsedFunction(pSingleExtract.getExtractFunction());

                        pCollector.push(pSingleExtract, true);
                        this.generateExtractStmtFromPointer(pFieldPointer, pOffset, iDepth, pCollector);
                    } else if (pFieldType.isComplex()) {
                        iDepth++;
                        this.generateExtractStmtForComplexVar(pField, pOffset, iDepth, pCollector, pPointer, pBuffer, isNeedPadding ? (iPadding + pFieldType.getPadding()) : 0);
                    } else {
                        pSingleExtract = new akra.fx.ExtractStmtInstruction();
                        pSingleExtract.generateStmtForBaseType(pField, pPointer, pBuffer, isNeedPadding ? (iPadding + pFieldType.getPadding()) : 0, pOffset);

                        this._addUsedFunction(pSingleExtract.getExtractFunction());

                        pCollector.push(pSingleExtract, true);
                    }
                }
            };

            FunctionDeclInstruction.prototype.createOffsetForAttr = function (pAttr) {
                var pOffset = new akra.fx.VariableDeclInstruction();
                var pOffsetType = new akra.fx.VariableTypeInstruction();
                var pOffsetId = new akra.fx.IdInstruction();

                pOffsetType.pushType(akra.fx.Effect.getSystemType("float"));
                pOffsetType.addUsage("uniform");

                pOffsetId.setName("offset");
                pOffsetId.setRealName(pAttr.getRealName() + "_o");

                pOffset.push(pOffsetType, true);
                pOffset.push(pOffsetId, true);

                pOffset.setParent(pAttr);
                pOffset.setSemantic(pAttr.getSemantic());

                pAttr.getType()._addAttrOffset(pOffset);

                return pOffset;
            };
            return FunctionDeclInstruction;
        })(akra.fx.DeclInstruction);
        fx.FunctionDeclInstruction = FunctionDeclInstruction;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
//# sourceMappingURL=FunctionInstruction.js.map
