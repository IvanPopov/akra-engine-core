/// <reference path="../idl/AIAFXInstruction.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "fx/ExprInstruction", "fx/SimpleInstruction", "fx/ExtractExprInstruction", "fx/Instruction"], function(require, exports, __ExprInstruction__, __SimpleInstruction__, __ExtractExprInstruction__, __Instruction__) {
    var ExprInstruction = __ExprInstruction__;
    var SimpleInstruction = __SimpleInstruction__;
    var ExtractExprInstruction = __ExtractExprInstruction__;
    var Instruction = __Instruction__;

    var ExtractStmtInstruction = (function (_super) {
        __extends(ExtractStmtInstruction, _super);
        function ExtractStmtInstruction() {
            _super.call(this);
            this._pExtractInVar = null;
            this._pExtractInExpr = null;
            this._pExtactExpr = null;
            this._pInstructionList = [];
            this._eInstructionType = 57 /* k_ExtractStmtInstruction */;
        }
        ExtractStmtInstruction.prototype.generateStmtForBaseType = function (pVarDecl, pPointer, pBuffer, iPadding, pOffset) {
            if (typeof pOffset === "undefined") { pOffset = null; }
            var pVarType = pVarDecl.getType();
            var pVarNameExpr = pVarDecl._getFullNameExpr();
            if (pVarType.isComplex() || isNull(pVarNameExpr) || pVarType.getSize() === Instruction.UNDEFINE_SIZE) {
                this.setError(2274 /* BAD_EXTRACTING */);
                return;
            }

            // var pPointer: IAFXVariableDeclInstruction = isDef(pPointer) ? pPointer : pVarType.getPointer();
            // var pBuffer: IAFXVariableDeclInstruction = isDef(pBuffer) ?  pBuffer : pVarType.getVideoBuffer();
            var pBufferSampler = pBuffer._getVideoBufferSampler();
            var pBufferHeader = pBuffer._getVideoBufferHeader();

            var isArray = pVarType.isNotBaseArray();
            var iLength = pVarType.getLength();
            var sCodeFragment = "";
            var pExtractType = isArray ? pVarType.getArrayElementType() : pVarType;

            if (isArray) {
                if (iLength === Instruction.UNDEFINE_LENGTH) {
                    this.setError(2274 /* BAD_EXTRACTING */);
                    return;
                }

                sCodeFragment = "for(int i=0;i<" + iLength.toString() + ";i++){";
                this.push(new SimpleInstruction(sCodeFragment), true);
            }

            this.push(pVarNameExpr, false);

            if (isArray) {
                sCodeFragment = "[i]=";
            } else {
                sCodeFragment = "=";
            }

            this.push(new SimpleInstruction(sCodeFragment), true);

            var pExtractType = isArray ? pVarType.getArrayElementType() : pVarType;
            var pExtractExpr = new ExtractExprInstruction();
            var sPaddingExpr = "";

            if (iPadding > 0) {
                sPaddingExpr = "+" + iPadding.toString() + ".0";
            } else {
                sPaddingExpr = "";
            }

            if (isArray) {
                sPaddingExpr += "+float(i*" + pExtractType.getSize().toString() + ")";
            }

            pExtractExpr.initExtractExpr(pExtractType, pPointer, pBuffer, sPaddingExpr, pOffset);

            if (pExtractExpr.isErrorOccured()) {
                this.setError(pExtractExpr.getLastError().code, pExtractExpr.getLastError().info);
                return;
            }

            this.push(pExtractExpr, true);

            sCodeFragment = ";";

            if (isArray) {
                sCodeFragment += "}";
            }

            this.push(new SimpleInstruction(sCodeFragment), true);

            this._pExtactExpr = pExtractExpr;
            this._pExtractInVar = pVarDecl;
            this._pExtractInExpr = pVarNameExpr;
        };

        ExtractStmtInstruction.prototype.toFinalCode = function () {
            var sCode = "";

            for (var i = 0; i < this._nInstructions; i++) {
                sCode += this.getInstructions()[i].toFinalCode();
            }

            return sCode;
        };

        ExtractStmtInstruction.prototype.addUsedData = function (pUsedDataCollector, eUsedMode) {
            if (typeof eUsedMode === "undefined") { eUsedMode = 3 /* k_Undefined */; }
            this._pExtractInExpr.addUsedData(pUsedDataCollector, 1 /* k_Write */);
            this._pExtactExpr.addUsedData(pUsedDataCollector, 0 /* k_Read */);
        };

        ExtractStmtInstruction.prototype.getExtractFunction = function () {
            return this._pExtactExpr.getExtractFunction();
        };
        return ExtractStmtInstruction;
    })(ExprInstruction);

    
    return ExtractStmtInstruction;
});
//# sourceMappingURL=ExtractStmtInstruction.js.map
