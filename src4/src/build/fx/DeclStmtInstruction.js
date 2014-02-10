/// <reference path="StmtInstruction.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (fx) {
        /**
        * Represent TypeDecl or VariableDecl or VarStructDecl
        * EMPTY DeclInstruction
        */
        var DeclStmtInstruction = (function (_super) {
            __extends(DeclStmtInstruction, _super);
            function DeclStmtInstruction() {
                _super.call(this);
                this._pInstructionList = [null];
                this._eInstructionType = 55 /* k_DeclStmtInstruction */;
            }
            DeclStmtInstruction.prototype.toFinalCode = function () {
                var sCode = "";
                var pVariableList = this.getInstructions();

                for (var i = 0; i < this._nInstructions; i++) {
                    sCode += pVariableList[i].toFinalCode() + ";\n";
                }

                return sCode;
            };

            DeclStmtInstruction.prototype.addUsedData = function (pUsedDataCollector, eUsedMode) {
                if (typeof eUsedMode === "undefined") { eUsedMode = 3 /* k_Undefined */; }
                if (akra.isNull(this.getInstructions()) || this._nInstructions === 0) {
                    return;
                }

                if (this.getInstructions()[0]._getInstructionType() === 14 /* k_TypeDeclInstruction */) {
                    return;
                }

                var pVariableList = this.getInstructions();
                for (var i = 0; i < this._nInstructions; i++) {
                    var pVarType = pVariableList[i].getType();

                    pUsedDataCollector[pVarType._getInstructionID()] = {
                        type: pVarType,
                        isRead: false,
                        isWrite: true,
                        numRead: 0,
                        numWrite: 1,
                        numUsed: 1
                    };

                    if (pVariableList[i].hasInitializer()) {
                        pVariableList[i].getInitializeExpr().addUsedData(pUsedDataCollector, 0 /* k_Read */);
                    }
                }
            };
            return DeclStmtInstruction;
        })(akra.fx.StmtInstruction);
        fx.DeclStmtInstruction = DeclStmtInstruction;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
//# sourceMappingURL=DeclStmtInstruction.js.map
