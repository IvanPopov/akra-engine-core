/// <reference path="../idl/AIMap.ts" />
/// <reference path="../idl/AERenderStates.ts" />
/// <reference path="../idl/AERenderStateValues.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "render", "fx/DeclInstruction"], function(require, exports, __render__, __DeclInstruction__) {
    var render = __render__;
    var DeclInstruction = __DeclInstruction__;

    var PassInstruction = (function (_super) {
        __extends(PassInstruction, _super);
        function PassInstruction() {
            _super.call(this);
            this._pTempNodeList = null;
            this._pTempFoundedFuncList = null;
            this._pTempFoundedFuncTypeList = null;
            this._pParseNode = null;
            this._sFunctionCode = "";
            this._isComlexPass = false;
            this._pShadersMap = null;
            this._fnPassFunction = null;
            this._pVertexShader = null;
            this._pPixelShader = null;
            this._pPassStateMap = null;
            this._pSharedVariableMapV = null;
            this._pGlobalVariableMapV = null;
            this._pUniformVariableMapV = null;
            this._pForeignVariableMapV = null;
            this._pTextureVariableMapV = null;
            this._pUsedComplexTypeMapV = null;
            this._pSharedVariableMapP = null;
            this._pGlobalVariableMapP = null;
            this._pUniformVariableMapP = null;
            this._pForeignVariableMapP = null;
            this._pTextureVariableMapP = null;
            this._pUsedComplexTypeMapP = null;
            this._pFullUniformVariableMap = null;
            this._pFullForeignVariableMap = null;
            this._pFullTextureVariableMap = null;
            this._pInstructionList = null;
            this._eInstructionType = 59 /* k_PassInstruction */;
        }
        PassInstruction.prototype._addFoundFunction = function (pNode, pShader, eType) {
            if (isNull(this._pTempNodeList)) {
                this._pTempNodeList = [];
                this._pTempFoundedFuncList = [];
                this._pTempFoundedFuncTypeList = [];
            }

            this._pTempNodeList.push(pNode);
            this._pTempFoundedFuncList.push(pShader);
            this._pTempFoundedFuncTypeList.push(eType);
        };

        PassInstruction.prototype._getFoundedFunction = function (pNode) {
            if (isNull(this._pTempNodeList)) {
                return null;
            }

            for (var i = 0; i < this._pTempNodeList.length; i++) {
                if (this._pTempNodeList[i] === pNode) {
                    return this._pTempFoundedFuncList[i];
                }
            }

            return null;
        };

        PassInstruction.prototype._getFoundedFunctionType = function (pNode) {
            if (isNull(this._pTempNodeList)) {
                return null;
            }

            for (var i = 0; i < this._pTempNodeList.length; i++) {
                if (this._pTempNodeList[i] === pNode) {
                    return this._pTempFoundedFuncTypeList[i];
                }
            }

            return null;
        };

        PassInstruction.prototype._setParseNode = function (pNode) {
            this._pParseNode = pNode;
        };

        PassInstruction.prototype._getParseNode = function () {
            return this._pParseNode;
        };

        PassInstruction.prototype._addCodeFragment = function (sCode) {
            if (this.isComplexPass()) {
                this._sFunctionCode += sCode;
            }
        };

        PassInstruction.prototype._markAsComplex = function (isComplex) {
            this._isComlexPass = isComplex;
        };

        PassInstruction.prototype._getSharedVariableMapV = function () {
            return this._pSharedVariableMapV;
        };

        PassInstruction.prototype._getGlobalVariableMapV = function () {
            return this._pGlobalVariableMapV;
        };

        PassInstruction.prototype._getUniformVariableMapV = function () {
            return this._pUniformVariableMapV;
        };

        PassInstruction.prototype._getForeignVariableMapV = function () {
            return this._pForeignVariableMapV;
        };

        PassInstruction.prototype._getTextureVariableMapV = function () {
            return this._pTextureVariableMapV;
        };

        PassInstruction.prototype._getUsedComplexTypeMapV = function () {
            return this._pUsedComplexTypeMapV;
        };

        PassInstruction.prototype._getSharedVariableMapP = function () {
            return this._pSharedVariableMapP;
        };

        PassInstruction.prototype._getGlobalVariableMapP = function () {
            return this._pGlobalVariableMapP;
        };

        PassInstruction.prototype._getUniformVariableMapP = function () {
            return this._pUniformVariableMapP;
        };

        PassInstruction.prototype._getForeignVariableMapP = function () {
            return this._pForeignVariableMapP;
        };

        PassInstruction.prototype._getTextureVariableMapP = function () {
            return this._pTextureVariableMapP;
        };

        PassInstruction.prototype._getUsedComplexTypeMapP = function () {
            return this._pUsedComplexTypeMapP;
        };

        PassInstruction.prototype._getFullUniformMap = function () {
            return this._pFullUniformVariableMap;
        };

        PassInstruction.prototype._getFullForeignMap = function () {
            return this._pFullForeignVariableMap;
        };

        PassInstruction.prototype._getFullTextureMap = function () {
            return this._pFullTextureVariableMap;
        };

        PassInstruction.prototype.isComplexPass = function () {
            return this._isComlexPass;
        };

        PassInstruction.prototype.getVertexShader = function () {
            return this._pVertexShader;
        };

        PassInstruction.prototype.getPixelShader = function () {
            return this._pPixelShader;
        };

        PassInstruction.prototype.addShader = function (pShader) {
            var isVertex = pShader.getFunctionType() === 0 /* k_Vertex */;

            if (this.isComplexPass()) {
                if (isNull(this._pShadersMap)) {
                    this._pShadersMap = {};
                }
                var iShader = pShader._getInstructionID();
                this._pShadersMap[iShader] = pShader;

                var sCode = isVertex ? "this._pVertexShader=" : "this._pPixelShader=";
                sCode += "this._pShadersMap[" + iShader.toString() + "];";
                this._addCodeFragment(sCode);
            } else {
                if (isVertex) {
                    this._pVertexShader = pShader;
                } else {
                    this._pPixelShader = pShader;
                }
            }
        };

        PassInstruction.prototype.setState = function (eType, eValue) {
            if (isNull(this._pPassStateMap)) {
                this._pPassStateMap = render.createRenderStateMap();
            }

            if (this.isComplexPass()) {
                this._addCodeFragment("this._pPassStateMap[" + eType + "]=" + eValue + ";");
            } else {
                this._pPassStateMap[eType] = eValue;
            }
        };

        PassInstruction.prototype.finalizePass = function () {
            if (this.isComplexPass()) {
                this._fnPassFunction = (new Function("engine", "foreigns", "uniforms", this._sFunctionCode));
            }

            this.generateInfoAboutUsedVaraibles();

            this._pTempNodeList = null;
            this._pTempFoundedFuncList = null;
            this._pTempFoundedFuncTypeList = null;
            this._pParseNode = null;
            this._sFunctionCode = "";
        };

        PassInstruction.prototype.evaluate = function (pEngineStates, pForeigns, pUniforms) {
            if (this.isComplexPass()) {
                this._pVertexShader = null;
                this._pPixelShader = null;
                this.clearPassStates();

                this._fnPassFunction.call(this, pEngineStates, pForeigns, pUniforms);
            }

            return true;
        };

        PassInstruction.prototype.getState = function (eType) {
            return !isNull(this._pPassStateMap) ? this._pPassStateMap[eType] : 0 /* UNDEF */;
        };

        PassInstruction.prototype._getRenderStates = function () {
            return this._pPassStateMap;
        };

        PassInstruction.prototype.clearPassStates = function () {
            if (!isNull(this._pPassStateMap)) {
                this._pPassStateMap[0 /* BLENDENABLE */] = 0 /* UNDEF */;
                this._pPassStateMap[1 /* CULLFACEENABLE */] = 0 /* UNDEF */;
                this._pPassStateMap[2 /* ZENABLE */] = 0 /* UNDEF */;
                this._pPassStateMap[3 /* ZWRITEENABLE */] = 0 /* UNDEF */;
                this._pPassStateMap[4 /* DITHERENABLE */] = 0 /* UNDEF */;
                this._pPassStateMap[5 /* SCISSORTESTENABLE */] = 0 /* UNDEF */;
                this._pPassStateMap[6 /* STENCILTESTENABLE */] = 0 /* UNDEF */;
                this._pPassStateMap[7 /* POLYGONOFFSETFILLENABLE */] = 0 /* UNDEF */;
                this._pPassStateMap[8 /* CULLFACE */] = 0 /* UNDEF */;
                this._pPassStateMap[9 /* FRONTFACE */] = 0 /* UNDEF */;
                this._pPassStateMap[10 /* SRCBLEND */] = 0 /* UNDEF */;
                this._pPassStateMap[11 /* DESTBLEND */] = 0 /* UNDEF */;
                this._pPassStateMap[12 /* ZFUNC */] = 0 /* UNDEF */;
                this._pPassStateMap[13 /* ALPHABLENDENABLE */] = 0 /* UNDEF */;
                this._pPassStateMap[14 /* ALPHATESTENABLE */] = 0 /* UNDEF */;
            }
        };

        PassInstruction.prototype.generateInfoAboutUsedVaraibles = function () {
            if (isNull(this._pSharedVariableMapV)) {
                this._pSharedVariableMapV = {};
                this._pGlobalVariableMapV = {};
                this._pUniformVariableMapV = {};
                this._pForeignVariableMapV = {};
                this._pTextureVariableMapV = {};
                this._pUsedComplexTypeMapV = {};

                this._pSharedVariableMapP = {};
                this._pGlobalVariableMapP = {};
                this._pUniformVariableMapP = {};
                this._pForeignVariableMapP = {};
                this._pTextureVariableMapP = {};
                this._pUsedComplexTypeMapP = {};

                this._pFullUniformVariableMap = {};
                this._pFullForeignVariableMap = {};
                this._pFullTextureVariableMap = {};
            }

            if (this.isComplexPass()) {
                for (var i in this._pShadersMap) {
                    this.addInfoAbouUsedVariablesFromFunction(this._pShadersMap[i]);
                }
            } else {
                if (!isNull(this._pVertexShader)) {
                    this.addInfoAbouUsedVariablesFromFunction(this._pVertexShader);
                }
                if (!isNull(this._pPixelShader)) {
                    this.addInfoAbouUsedVariablesFromFunction(this._pPixelShader);
                }
            }
        };

        PassInstruction.prototype.addInfoAbouUsedVariablesFromFunction = function (pFunction) {
            var pSharedVars = pFunction._getSharedVariableMap();
            var pGlobalVars = pFunction._getGlobalVariableMap();
            var pUniformVars = pFunction._getUniformVariableMap();
            var pForeignVars = pFunction._getForeignVariableMap();
            var pTextureVars = pFunction._getTextureVariableMap();
            var pTypes = pFunction._getUsedComplexTypeMap();

            var pSharedVarsTo = null;
            var pGlobalVarsTo = null;
            var pUniformVarsTo = null;
            var pForeignVarsTo = null;
            var pTextureVarsTo = null;
            var pTypesTo = null;

            if (pFunction.getFunctionType() === 0 /* k_Vertex */) {
                pSharedVarsTo = this._pSharedVariableMapV;
                pGlobalVarsTo = this._pGlobalVariableMapV;
                pUniformVarsTo = this._pUniformVariableMapV;
                pForeignVarsTo = this._pForeignVariableMapV;
                pTextureVarsTo = this._pTextureVariableMapV;
                pTypesTo = this._pUsedComplexTypeMapV;
            } else {
                pSharedVarsTo = this._pSharedVariableMapP;
                pGlobalVarsTo = this._pGlobalVariableMapP;
                pUniformVarsTo = this._pUniformVariableMapP;
                pForeignVarsTo = this._pForeignVariableMapP;
                pTextureVarsTo = this._pTextureVariableMapP;
                pTypesTo = this._pUsedComplexTypeMapP;
            }

            for (var i in pSharedVars) {
                if (!isNull(pSharedVars[i]) && !pSharedVars[i].isField()) {
                    pSharedVarsTo[i] = pSharedVars[i];
                }
            }
            for (var i in pGlobalVars) {
                if (!isNull(pGlobalVars[i])) {
                    pGlobalVarsTo[i] = pGlobalVars[i];
                }
            }
            for (var i in pUniformVars) {
                if (!isNull(pUniformVars[i])) {
                    pUniformVarsTo[i] = pUniformVars[i];
                    this._pFullUniformVariableMap[i] = pUniformVars[i];
                }
            }
            for (var i in pForeignVars) {
                if (!isNull(pForeignVars[i])) {
                    pForeignVarsTo[i] = pForeignVars[i];
                    this._pFullForeignVariableMap[i] = pForeignVars[i];
                }
            }
            for (var i in pTextureVars) {
                if (!isNull(pTextureVars[i])) {
                    pTextureVarsTo[i] = pTextureVars[i];
                    this._pFullTextureVariableMap[i] = pTextureVars[i];
                }
            }
            for (var i in pTypes) {
                if (!isNull(pTypes[i])) {
                    pTypesTo[i] = pTypes[i];
                }
            }
        };

        PassInstruction.POST_EFFECT_SEMANTIC = "POST_EFFECT";
        return PassInstruction;
    })(DeclInstruction);

    
    return PassInstruction;
});
//# sourceMappingURL=PassInstruction.js.map
