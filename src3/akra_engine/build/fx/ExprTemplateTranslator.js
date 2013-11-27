/// <reference path="../idl/AIAFXInstruction.ts" />
define(["require", "exports", "fx/SimpleInstruction"], function(require, exports, __SimpleInstruction__) {
    var SimpleInstruction = __SimpleInstruction__;

    var ExprTemplateTranslator = (function () {
        function ExprTemplateTranslator(sExprTemplate) {
            this._pInToOutArgsMap = null;
            this._pExprPart = null;
            this._pInToOutArgsMap = {};
            this._pExprPart = [];

            var pSplitTemplate = sExprTemplate.split(/(\$\d+)/);

            for (var i = 0; i < pSplitTemplate.length; i++) {
                if (pSplitTemplate[i]) {
                    if (pSplitTemplate[i][0] !== '$') {
                        this._pExprPart.push(new SimpleInstruction(pSplitTemplate[i]));
                    } else {
                        this._pExprPart.push(null);
                        this._pInToOutArgsMap[this._pExprPart.length - 1] = (((pSplitTemplate[i].substr(1))) * 1 - 1);
                    }
                }
            }
        }
        ExprTemplateTranslator.prototype.toInstructionList = function (pArguments) {
            var pOutputInstructionList = [];

            for (var i = 0; i < this._pExprPart.length; i++) {
                if (isNull(this._pExprPart[i])) {
                    pOutputInstructionList.push(pArguments[this._pInToOutArgsMap[i]]);
                } else {
                    pOutputInstructionList.push(this._pExprPart[i]);
                }
            }

            return pOutputInstructionList;
        };
        return ExprTemplateTranslator;
    })();

    
    return ExprTemplateTranslator;
});
//# sourceMappingURL=ExprTemplateTranslator.js.map
