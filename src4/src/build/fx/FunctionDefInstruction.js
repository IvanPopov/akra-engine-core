/// <reference path="../idl/EEffectErrors.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="DeclInstruction.ts" />
    /// <reference path="Effect.ts" />
    (function (fx) {
        /**
        * Represent type func(...args)[:Semantic]
        * EMPTY_OPERTOR VariableTypeInstruction IdInstruction VarDeclInstruction ... VarDeclInstruction
        */
        var FunctionDefInstruction = (function (_super) {
            __extends(FunctionDefInstruction, _super);
            //private _sHash: string = "";
            function FunctionDefInstruction() {
                _super.call(this);
                this._pParameterList = null;
                this._pParamListForShaderCompile = null;
                this._pParamListForShaderInput = null;
                this._isComplexShaderInput = false;
                this._pReturnType = null;
                this._pFunctionName = null;
                this._nParamsNeeded = 0;
                this._sDefinition = "";
                this._isAnalyzedForVertexUsage = false;
                this._isAnalyzedForPixelUsage = false;
                this._bCanUsedAsFunction = true;
                this._bShaderDef = false;
                this._pInstructionList = null;
                this._pParameterList = [];
                this._eInstructionType = 47 /* k_FunctionDefInstruction */;
            }
            FunctionDefInstruction.prototype.toFinalCode = function () {
                var sCode = "";

                if (!this.isShaderDef()) {
                    sCode += this._pReturnType.toFinalCode();
                    sCode += " " + this._pFunctionName.toFinalCode();
                    sCode += "(";

                    for (var i = 0; i < this._pParameterList.length; i++) {
                        sCode += this._pParameterList[i].toFinalCode();

                        if (i !== this._pParameterList.length - 1) {
                            sCode += ",";
                        }
                    }

                    sCode += ")";
                } else {
                    sCode = "void " + this._pFunctionName.toFinalCode() + "()";
                }

                return sCode;
            };

            FunctionDefInstruction.prototype.setType = function (pType) {
                this.setReturnType(pType);
            };

            FunctionDefInstruction.prototype.getType = function () {
                return this.getReturnType();
            };

            FunctionDefInstruction.prototype.setReturnType = function (pReturnType) {
                this._pReturnType = pReturnType;
                pReturnType.setParent(this);
                return true;
            };
            FunctionDefInstruction.prototype.getReturnType = function () {
                return this._pReturnType;
            };

            FunctionDefInstruction.prototype.setFunctionName = function (pNameId) {
                this._pFunctionName = pNameId;
                pNameId.setParent(this);
                return true;
            };

            FunctionDefInstruction.prototype.getName = function () {
                return this._pFunctionName.getName();
            };

            FunctionDefInstruction.prototype.getRealName = function () {
                return this._pFunctionName.getRealName();
            };

            FunctionDefInstruction.prototype.getNameId = function () {
                return this._pFunctionName;
            };

            FunctionDefInstruction.prototype.getArguments = function () {
                return this._pParameterList;
            };

            FunctionDefInstruction.prototype.getNumNeededArguments = function () {
                return this._nParamsNeeded;
            };

            FunctionDefInstruction.prototype.markAsShaderDef = function (isShaderDef) {
                this._bShaderDef = isShaderDef;
            };

            FunctionDefInstruction.prototype.isShaderDef = function () {
                return this._bShaderDef;
            };

            FunctionDefInstruction.prototype.addParameter = function (pParameter, isStrictModeOn) {
                if (this._pParameterList.length > this._nParamsNeeded && !pParameter.hasInitializer()) {
                    this.setError(2245 /* BAD_FUNCTION_PARAMETER_DEFENITION_NEED_DEFAULT */, {
                        funcName: this._pFunctionName.getName(),
                        varName: pParameter.getName()
                    });
                    return false;
                }

                var pParameterType = pParameter.getType();

                if (pParameterType.isPointer() || pParameterType._containPointer()) {
                    if (pParameterType.hasUsage("uniform") || pParameterType.hasUsage("out") || pParameterType.hasUsage("inout")) {
                        this.setError(2265 /* BAD_FUNCTION_PARAMETER_USAGE */, {
                            funcName: this._pFunctionName.getName(),
                            varName: pParameter.getName()
                        });
                        return false;
                    }

                    this._isAnalyzedForVertexUsage = false;
                    this._isAnalyzedForPixelUsage = true;

                    this._setForPixel(false);
                    this._bCanUsedAsFunction = false;
                    pParameterType._setVideoBufferInDepth();
                } else if (!isStrictModeOn) {
                    if (pParameterType.isComplex() && !pParameterType.hasFieldWithoutSemantic() && pParameterType.hasAllUniqueSemantics()) {
                        if (pParameter.getSemantic() === "" && pParameterType.hasAllUniqueSemantics() && !pParameterType.hasFieldWithoutSemantic()) {
                            pParameterType._addPointIndexInDepth();
                        } else {
                            pParameterType.addPointIndex(false);
                            pParameterType._setVideoBufferInDepth();
                        }
                    } else if (pParameter.getSemantic() !== "") {
                        pParameterType.addPointIndex(false);
                        pParameterType._setVideoBufferInDepth();
                    }
                }

                this._pParameterList.push(pParameter);
                pParameter.setParent(this);

                if (!pParameter.hasInitializer()) {
                    this._nParamsNeeded++;
                }

                return true;
            };

            FunctionDefInstruction.prototype.getParameListForShaderInput = function () {
                return this._pParamListForShaderInput;
            };

            FunctionDefInstruction.prototype.isComplexShaderInput = function () {
                return this._isComplexShaderInput;
            };

            FunctionDefInstruction.prototype.clone = function (pRelationMap) {
                if (typeof pRelationMap === "undefined") { pRelationMap = {}; }
                var pClone = _super.prototype.clone.call(this, pRelationMap);

                pClone.setFunctionName(this._pFunctionName.clone(pRelationMap));
                pClone.setReturnType(this.getReturnType().clone(pRelationMap));

                for (var i = 0; i < this._pParameterList.length; i++) {
                    pClone.addParameter(this._pParameterList[i].clone(pRelationMap));
                }

                var pShaderParams = [];
                for (var i = 0; i < this._pParamListForShaderInput.length; i++) {
                    pShaderParams.push(this._pParamListForShaderInput[i].clone(pRelationMap));
                }

                pClone._setShaderParams(pShaderParams, this._isComplexShaderInput);
                pClone._setAnalyzedInfo(this._isAnalyzedForVertexUsage, this._isAnalyzedForPixelUsage, this._bCanUsedAsFunction);

                return pClone;
            };

            FunctionDefInstruction.prototype._setShaderParams = function (pParamList, isComplexInput) {
                this._pParamListForShaderInput = pParamList;
                this._isComplexShaderInput = isComplexInput;
            };

            FunctionDefInstruction.prototype._setAnalyzedInfo = function (isAnalyzedForVertexUsage, isAnalyzedForPixelUsage, bCanUsedAsFunction) {
                this._isAnalyzedForVertexUsage = isAnalyzedForVertexUsage;
                this._isAnalyzedForPixelUsage = isAnalyzedForPixelUsage;
                this._bCanUsedAsFunction = bCanUsedAsFunction;
            };

            FunctionDefInstruction.prototype._getStringDef = function () {
                if (this._sDefinition === "") {
                    this._sDefinition = this._pReturnType.getHash() + " " + this.getName() + "(";

                    for (var i = 0; i < this._pParameterList.length; i++) {
                        this._sDefinition += this._pParameterList[i].getType().getHash() + ",";
                    }

                    this._sDefinition += ")";
                }

                return this._sDefinition;
            };

            FunctionDefInstruction.prototype._canUsedAsFunction = function () {
                return this._bCanUsedAsFunction;
            };

            FunctionDefInstruction.prototype._checkForVertexUsage = function () {
                if (this._isAnalyzedForVertexUsage) {
                    return this._isForVertex();
                }

                this._isAnalyzedForVertexUsage = true;

                var isGood = true;

                isGood = this.checkReturnTypeForVertexUsage();
                if (!isGood) {
                    this._setForVertex(false);
                    return false;
                }

                isGood = this.checkArgumentsForVertexUsage();
                if (!isGood) {
                    this._setForVertex(false);
                    return false;
                }

                this._setForVertex(true);

                return true;
            };

            FunctionDefInstruction.prototype._checkForPixelUsage = function () {
                if (this._isAnalyzedForPixelUsage) {
                    return this._isForPixel();
                }

                this._isAnalyzedForPixelUsage = true;

                var isGood = true;

                isGood = this.checkReturnTypeForPixelUsage();
                if (!isGood) {
                    this._setForPixel(false);
                    return false;
                }

                isGood = this.checkArgumentsForPixelUsage();
                if (!isGood) {
                    this._setForPixel(false);
                    return false;
                }

                this._setForPixel(true);

                return true;
            };

            FunctionDefInstruction.prototype.checkReturnTypeForVertexUsage = function () {
                var pReturnType = this._pReturnType;
                var isGood = true;

                if (pReturnType.isEqual(akra.fx.Effect.getSystemType("void"))) {
                    return true;
                }

                if (pReturnType.isComplex()) {
                    isGood = !pReturnType.hasFieldWithoutSemantic();
                    if (!isGood) {
                        return false;
                    }

                    isGood = pReturnType.hasAllUniqueSemantics();
                    if (!isGood) {
                        return false;
                    }

                    // isGood = pReturnType.hasFieldWithSematic("POSITION");
                    // if(!isGood){
                    // 	return false;
                    // }
                    isGood = !pReturnType._containSampler();
                    if (!isGood) {
                        return false;
                    }

                    isGood = !pReturnType._containPointer() && !pReturnType.isPointer();
                    if (!isGood) {
                        return false;
                    }

                    isGood = !pReturnType._containComplexType();
                    if (!isGood) {
                        return false;
                    }

                    return true;
                } else {
                    isGood = pReturnType.isEqual(akra.fx.Effect.getSystemType("float4"));
                    if (!isGood) {
                        return false;
                    }

                    isGood = (this.getSemantic() === "POSITION");
                    if (!isGood) {
                        return false;
                    }

                    return true;
                }
            };

            FunctionDefInstruction.prototype.checkReturnTypeForPixelUsage = function () {
                var pReturnType = this._pReturnType;
                var isGood = true;

                if (pReturnType.isEqual(akra.fx.Effect.getSystemType("void"))) {
                    return true;
                }

                isGood = pReturnType.isBase();
                if (!isGood) {
                    return false;
                }

                isGood = pReturnType.isEqual(akra.fx.Effect.getSystemType("float4"));
                if (!isGood) {
                    return false;
                }

                isGood = this.getSemantic() === "COLOR";
                if (!isGood) {
                    return false;
                }

                return true;
            };

            FunctionDefInstruction.prototype.checkArgumentsForVertexUsage = function () {
                var pArguments = this._pParameterList;
                var isAttributeByStruct = false;
                var isAttributeByParams = false;
                var isStartAnalyze = false;

                this._pParamListForShaderInput = [];
                this._pParamListForShaderCompile = [];

                for (var i = 0; i < pArguments.length; i++) {
                    var pParam = pArguments[i];

                    if (pParam.isUniform()) {
                        this._pParamListForShaderCompile.push(pParam);
                        continue;
                    }

                    if (!isStartAnalyze) {
                        if (pParam.getSemantic() === "") {
                            if (pParam.getType().isBase() || pParam.getType().hasFieldWithoutSemantic() || !pParam.getType().hasAllUniqueSemantics()) {
                                return false;
                            }

                            isAttributeByStruct = true;
                        } else if (pParam.getSemantic() !== "") {
                            if (pParam.getType().isComplex() && (pParam.getType().hasFieldWithoutSemantic() || !pParam.getType().hasAllUniqueSemantics())) {
                                return false;
                            }

                            isAttributeByParams = true;
                        }

                        isStartAnalyze = true;
                    } else if (isAttributeByStruct) {
                        return false;
                    } else if (isAttributeByParams) {
                        if (pParam.getSemantic() === "") {
                            return false;
                        }

                        if (pParam.getType().isComplex() && (pParam.getType().hasFieldWithoutSemantic() || !pParam.getType().hasAllUniqueSemantics())) {
                            return false;
                        }
                    }

                    this._pParamListForShaderInput.push(pParam);
                }

                if (isAttributeByStruct) {
                    this._isComplexShaderInput = true;
                }

                return true;
            };

            FunctionDefInstruction.prototype.checkArgumentsForPixelUsage = function () {
                var pArguments = this._pParameterList;
                var isVaryingsByStruct = false;
                var isVaryingsByParams = false;
                var isStartAnalyze = false;

                this._pParamListForShaderInput = [];
                this._pParamListForShaderCompile = [];

                for (var i = 0; i < pArguments.length; i++) {
                    var pParam = pArguments[i];

                    if (pParam.isUniform()) {
                        this._pParamListForShaderCompile.push(pParam);
                        continue;
                    }

                    if (!isStartAnalyze) {
                        if (pParam.getSemantic() === "") {
                            if (pParam.getType().isBase() || pParam.getType().hasFieldWithoutSemantic() || !pParam.getType().hasAllUniqueSemantics() || pParam.getType()._containSampler() || pParam.getType()._containPointer() || pParam.getType().isPointer()) {
                                return false;
                            }

                            isVaryingsByStruct = true;
                        } else if (pParam.getSemantic() !== "") {
                            if (pParam.getType().isStrictPointer() || pParam.getType()._containPointer() || pParam.getType()._containSampler() || akra.fx.Effect.isSamplerType(pParam.getType())) {
                                //LOG(2, pParam.getType().isPointer(),
                                //    pParam.getType()._containPointer(),
                                //    pParam.getType()._containSampler(),
                                //    Effect.isSamplerType(pParam.getType()));
                                return false;
                            }

                            if (pParam.getType().isComplex() && (pParam.getType().hasFieldWithoutSemantic() || !pParam.getType().hasAllUniqueSemantics())) {
                                return false;
                            }

                            isVaryingsByParams = true;
                        }

                        isStartAnalyze = true;
                    } else if (isVaryingsByStruct) {
                        return false;
                    } else if (isVaryingsByParams) {
                        if (pParam.getSemantic() === "") {
                            return false;
                        }

                        if (pParam.getType().isStrictPointer() || pParam.getType()._containPointer() || pParam.getType()._containSampler() || akra.fx.Effect.isSamplerType(pParam.getType())) {
                            return false;
                        }

                        if (pParam.getType().isComplex() && (pParam.getType().hasFieldWithoutSemantic() || !pParam.getType().hasAllUniqueSemantics())) {
                            return false;
                        }
                    }

                    this._pParamListForShaderInput.push(pParam);
                }

                if (isVaryingsByStruct) {
                    this._isComplexShaderInput = true;
                }

                return true;
            };
            return FunctionDefInstruction;
        })(akra.fx.DeclInstruction);
        fx.FunctionDefInstruction = FunctionDefInstruction;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
//# sourceMappingURL=FunctionDefInstruction.js.map
