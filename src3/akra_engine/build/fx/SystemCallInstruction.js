var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "fx/ExprInstruction", "fx/SystemFunctionInstruction"], function(require, exports, __ExprInstruction__, __SystemFunctionInstruction__) {
    var ExprInstruction = __ExprInstruction__;
    var SystemFunctionInstruction = __SystemFunctionInstruction__;

    /**
    * Respresnt system_func(arg1,..., argn)
    * EMPTY_OPERATOR SimpleInstruction ... SimpleInstruction
    */
    var SystemCallInstruction = (function (_super) {
        __extends(SystemCallInstruction, _super);
        function SystemCallInstruction() {
            _super.call(this);
            this._pSystemFunction = null;
            this._pSamplerDecl = null;
            this._pInstructionList = null;
            this._eInstructionType = 36 /* k_SystemCallInstruction */;
        }
        SystemCallInstruction.prototype.toFinalCode = function () {
            if (!isNull(this._pSamplerDecl) && this._pSamplerDecl.isDefinedByZero()) {
                return "vec4(0.)";
            }

            var sCode = "";

            for (var i = 0; i < this.getInstructions().length; i++) {
                sCode += this.getInstructions()[i].toFinalCode();
            }

            return sCode;
        };

        SystemCallInstruction.prototype.setSystemCallFunction = function (pFunction) {
            this._pSystemFunction = pFunction;
            this.setType(pFunction.getType());
        };

        SystemCallInstruction.prototype.setInstructions = function (pInstructionList) {
            this._pInstructionList = pInstructionList;
            this._nInstructions = pInstructionList.length;
            for (var i = 0; i < pInstructionList.length; i++) {
                pInstructionList[i].setParent(this);
            }
        };

        SystemCallInstruction.prototype.fillByArguments = function (pArguments) {
            this.setInstructions(this._pSystemFunction.closeArguments(pArguments));
        };

        SystemCallInstruction.prototype.addUsedData = function (pUsedDataCollector, eUsedMode) {
            if (typeof eUsedMode === "undefined") { eUsedMode = 3 /* k_Undefined */; }
            var pInstructionList = this.getInstructions();
            for (var i = 0; i < this._nInstructions; i++) {
                if (pInstructionList[i]._getInstructionType() !== 2 /* k_SimpleInstruction */) {
                    pInstructionList[i].addUsedData(pUsedDataCollector, 0 /* k_Read */);
                    if ((pInstructionList[i]).getType().isSampler()) {
                        this._pSamplerDecl = (pInstructionList[i]).getType()._getParentVarDecl();
                    }
                }
            }
        };

        SystemCallInstruction.prototype.clone = function (pRelationMap) {
            var pClone = _super.prototype.clone.call(this, pRelationMap);

            pClone.setSystemCallFunction(this._pSystemFunction);

            return pClone;
        };
        return SystemCallInstruction;
    })(ExprInstruction);

    
    return SystemCallInstruction;
});
//# sourceMappingURL=SystemCallInstruction.js.map
