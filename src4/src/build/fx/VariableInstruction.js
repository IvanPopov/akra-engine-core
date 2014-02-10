/// <reference path="../idl/IAFXInstruction.ts" />
/// <reference path="../webgl/webgl.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="../stringUtils/StringDictionary.ts" />
    /// <reference path="DeclInstruction.ts" />
    /// <reference path="Effect.ts" />
    /// <reference path="DeclInstruction.ts" />
    /// <reference path="IdInstruction.ts" />
    /// <reference path="PostfixPointInstruction.ts" />
    /// <reference path="ExtractExprInstruction.ts" />
    /// <reference path="VariableTypeInstruction.ts" />
    (function (fx) {
        var StringDictionary = akra.stringUtils.StringDictionary;

        var VariableDeclInstruction = (function (_super) {
            __extends(VariableDeclInstruction, _super);
            /**
            * Represent type var_name [= init_expr]
            * EMPTY_OPERATOR VariableTypeInstruction IdInstruction InitExprInstruction
            */
            function VariableDeclInstruction() {
                _super.call(this);
                this._isVideoBuffer = null;
                this._pVideoBufferSampler = null;
                this._pVideoBufferHeader = null;
                this._pFullNameExpr = null;
                this._bDefineByZero = false;
                this._pSubDeclList = null;
                this._bShaderOutput = false;
                this._pAttrOffset = null;
                this._pAttrExtractionBlock = null;
                this._pValue = null;
                this._pDefaultValue = null;
                this._bLockInitializer = false;
                this._iNameIndex = 0;
                this._pInstructionList = [null, null, null];
                this._eInstructionType = 15 /* k_VariableDeclInstruction */;
            }
            VariableDeclInstruction._getIndex = function (sName) {
                return VariableDeclInstruction.pShaderVarNamesGlobalDictionary.add(sName);
            };

            VariableDeclInstruction.prototype.hasInitializer = function () {
                return this._nInstructions === 3 && !akra.isNull(this.getInitializeExpr());
            };

            VariableDeclInstruction.prototype.getInitializeExpr = function () {
                return this.getInstructions()[2];
            };

            VariableDeclInstruction.prototype.hasConstantInitializer = function () {
                return this.hasInitializer() && this.getInitializeExpr().isConst();
            };

            VariableDeclInstruction.prototype.lockInitializer = function () {
                this._bLockInitializer = true;
            };

            VariableDeclInstruction.prototype.unlockInitializer = function () {
                this._bLockInitializer = false;
            };

            VariableDeclInstruction.prototype.getDefaultValue = function () {
                return this._pDefaultValue;
            };

            VariableDeclInstruction.prototype.prepareDefaultValue = function () {
                this.getInitializeExpr().evaluate();
                this._pDefaultValue = this.getInitializeExpr().getEvalValue();
            };

            VariableDeclInstruction.prototype.getValue = function () {
                return this._pValue;
            };

            VariableDeclInstruction.prototype.setValue = function (pValue) {
                this._pValue = pValue;

                if (this.getType().isForeign()) {
                    this.setRealName(pValue);
                }
            };

            VariableDeclInstruction.prototype.getType = function () {
                return this._pInstructionList[0];
            };

            VariableDeclInstruction.prototype.setType = function (pType) {
                this._pInstructionList[0] = pType;
                pType.setParent(this);

                if (this._nInstructions === 0) {
                    this._nInstructions = 1;
                }
            };

            VariableDeclInstruction.prototype.setName = function (sName) {
                var pName = new akra.fx.IdInstruction();
                pName.setName(sName);
                pName.setParent(this);

                this._pInstructionList[1] = pName;

                if (this._nInstructions < 2) {
                    this._nInstructions = 2;
                }
            };

            VariableDeclInstruction.prototype.setRealName = function (sRealName) {
                this.getNameId().setRealName(sRealName);
            };

            VariableDeclInstruction.prototype.setVideoBufferRealName = function (sSampler, sHeader) {
                if (!this.isVideoBuffer()) {
                    return;
                }

                this._getVideoBufferSampler().setRealName(sSampler);
                this._getVideoBufferHeader().setRealName(sHeader);
            };

            VariableDeclInstruction.prototype.getName = function () {
                return this._pInstructionList[1].getName();
            };

            VariableDeclInstruction.prototype.getRealName = function () {
                return this._pInstructionList[1].getRealName();
            };

            VariableDeclInstruction.prototype.getNameId = function () {
                return this._pInstructionList[1];
            };

            VariableDeclInstruction.prototype.isUniform = function () {
                return this.getType().hasUsage("uniform");
            };

            VariableDeclInstruction.prototype.isField = function () {
                if (akra.isNull(this.getParent())) {
                    return false;
                }

                var eParentType = this.getParent()._getInstructionType();
                if (eParentType === 3 /* k_VariableTypeInstruction */ || eParentType === 5 /* k_ComplexTypeInstruction */ || eParentType === 4 /* k_SystemTypeInstruction */) {
                    return true;
                }

                return false;
            };

            VariableDeclInstruction.prototype.isPointer = function () {
                return this.getType().isPointer();
            };

            VariableDeclInstruction.prototype.isVideoBuffer = function () {
                if (akra.isNull(this._isVideoBuffer)) {
                    this._isVideoBuffer = this.getType().isStrongEqual(akra.fx.Effect.getSystemType("video_buffer"));
                }

                return this._isVideoBuffer;
            };

            VariableDeclInstruction.prototype.isSampler = function () {
                return this.getType().isSampler();
            };

            VariableDeclInstruction.prototype.getSubVarDecls = function () {
                return this.getType().getSubVarDecls();
            };

            VariableDeclInstruction.prototype.isDefinedByZero = function () {
                return this._bDefineByZero;
            };

            VariableDeclInstruction.prototype.defineByZero = function (isDefine) {
                this._bDefineByZero = isDefine;
            };

            VariableDeclInstruction.prototype.toFinalCode = function () {
                if (this._isShaderOutput()) {
                    return "";
                }
                var sCode = "";

                if (this.isVideoBuffer()) {
                    this._getVideoBufferHeader().lockInitializer();

                    sCode = this._getVideoBufferHeader().toFinalCode();
                    sCode += ";\n";
                    sCode += this._getVideoBufferSampler().toFinalCode();

                    this._getVideoBufferHeader().unlockInitializer();
                } else {
                    sCode = this.getType().toFinalCode();
                    sCode += " " + this.getNameId().toFinalCode();

                    if (this.getType().isNotBaseArray()) {
                        var iLength = this.getType().getLength();
                        if (akra.webgl.ANGLE && iLength === 1 && this.getType().isComplex()) {
                            sCode += "[" + 2 + "]";
                        } else {
                            sCode += "[" + iLength + "]";
                        }
                    }

                    if (this.hasInitializer() && !this.isSampler() && !this.isUniform() && !this._bLockInitializer) {
                        sCode += "=" + this.getInitializeExpr().toFinalCode();
                    }
                }

                return sCode;
            };

            VariableDeclInstruction.prototype._markAsVarying = function (bValue) {
                this.getNameId()._markAsVarying(bValue);
            };

            VariableDeclInstruction.prototype._markAsShaderOutput = function (isShaderOutput) {
                this._bShaderOutput = isShaderOutput;
            };

            VariableDeclInstruction.prototype._isShaderOutput = function () {
                return this._bShaderOutput;
            };

            VariableDeclInstruction.prototype._setAttrExtractionBlock = function (pCodeBlock) {
                this._pAttrExtractionBlock = pCodeBlock;
            };

            VariableDeclInstruction.prototype._getAttrExtractionBlock = function () {
                return this._pAttrExtractionBlock;
            };

            VariableDeclInstruction.prototype._getNameIndex = function () {
                return this._iNameIndex || (this._iNameIndex = VariableDeclInstruction.pShaderVarNamesGlobalDictionary.add(this.getRealName()));
            };

            VariableDeclInstruction.prototype._getFullNameExpr = function () {
                if (!akra.isNull(this._pFullNameExpr)) {
                    return this._pFullNameExpr;
                }

                if (!this.isField() || !this.getParent()._getParentVarDecl().isVisible()) {
                    this._pFullNameExpr = new akra.fx.IdExprInstruction();
                    this._pFullNameExpr.push(this.getNameId(), false);
                } else {
                    var pMainVar = this.getType()._getParentContainer();

                    if (akra.isNull(pMainVar)) {
                        return null;
                    }

                    var pMainExpr = pMainVar._getFullNameExpr();
                    if (akra.isNull(pMainExpr)) {
                        return null;
                    }
                    var pFieldExpr = new akra.fx.IdExprInstruction();
                    pFieldExpr.push(this.getNameId(), false);

                    this._pFullNameExpr = new akra.fx.PostfixPointInstruction();
                    this._pFullNameExpr.push(pMainExpr, false);
                    this._pFullNameExpr.push(pFieldExpr, false);
                    this._pFullNameExpr.setType(this.getType());
                }

                return this._pFullNameExpr;
            };

            VariableDeclInstruction.prototype._getFullName = function () {
                if (this.isField() && this.getParent()._getParentVarDecl().isVisible()) {
                    var sName = "";
                    var eParentType = this.getParent()._getInstructionType();

                    if (eParentType === 3 /* k_VariableTypeInstruction */) {
                        sName = this.getParent()._getFullName();
                    }

                    sName += "." + this.getName();

                    return sName;
                } else {
                    return this.getName();
                }
            };

            VariableDeclInstruction.prototype._getVideoBufferSampler = function () {
                if (!this.isVideoBuffer()) {
                    return null;
                }

                if (akra.isNull(this._pVideoBufferSampler)) {
                    this._pVideoBufferSampler = new VariableDeclInstruction();
                    var pType = new akra.fx.VariableTypeInstruction();
                    var pId = new akra.fx.IdInstruction();

                    pType.pushType(akra.fx.Effect.getSystemType("sampler2D"));
                    pType.addUsage("uniform");
                    pId.setName(this.getName() + "_sampler");

                    this._pVideoBufferSampler.push(pType, true);
                    this._pVideoBufferSampler.push(pId, true);
                }

                return this._pVideoBufferSampler;
            };

            VariableDeclInstruction.prototype._getVideoBufferHeader = function () {
                if (!this.isVideoBuffer()) {
                    return null;
                }

                if (akra.isNull(this._pVideoBufferHeader)) {
                    this._pVideoBufferHeader = new VariableDeclInstruction();
                    var pType = new akra.fx.VariableTypeInstruction();
                    var pId = new akra.fx.IdInstruction();
                    var pExtarctExpr = new akra.fx.ExtractExprInstruction();

                    pType.pushType(akra.fx.Effect.getSystemType("video_buffer_header"));
                    pId.setName(this.getName() + "_header");

                    this._pVideoBufferHeader.push(pType, true);
                    this._pVideoBufferHeader.push(pId, true);
                    this._pVideoBufferHeader.push(pExtarctExpr, true);

                    pExtarctExpr.initExtractExpr(pType, null, this, "", null);
                }

                return this._pVideoBufferHeader;
            };

            VariableDeclInstruction.prototype._getVideoBufferInitExpr = function () {
                if (!this.isVideoBuffer()) {
                    return null;
                }

                return this._getVideoBufferHeader().getInitializeExpr();
            };

            VariableDeclInstruction.prototype._setCollapsed = function (bValue) {
                this.getType()._setCollapsed(bValue);
            };

            VariableDeclInstruction.prototype._isCollapsed = function () {
                return this.getType()._isCollapsed();
            };

            VariableDeclInstruction.prototype.clone = function (pRelationMap) {
                return _super.prototype.clone.call(this, pRelationMap);
            };

            VariableDeclInstruction.prototype.blend = function (pVariableDecl, eMode) {
                var pBlendType = this.getType().blend(pVariableDecl.getType(), eMode);

                if (akra.isNull(pBlendType)) {
                    return null;
                }

                var pBlendVar = new VariableDeclInstruction();
                var pId = new akra.fx.IdInstruction();

                pId.setName(this.getNameId().getName());
                pId.setRealName(this.getNameId().getRealName());

                pBlendVar.setSemantic(this.getSemantic());
                pBlendVar.push(pBlendType, true);
                pBlendVar.push(pId, true);

                return pBlendVar;
            };
            VariableDeclInstruction.pShaderVarNamesGlobalDictionary = new StringDictionary();
            return VariableDeclInstruction;
        })(akra.fx.DeclInstruction);
        fx.VariableDeclInstruction = VariableDeclInstruction;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
//# sourceMappingURL=VariableInstruction.js.map
