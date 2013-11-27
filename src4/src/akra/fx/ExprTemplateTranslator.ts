/// <reference path="../idl/AIAFXInstruction.ts" />

import SimpleInstruction = require("fx/SimpleInstruction");


class ExprTemplateTranslator {
    private _pInToOutArgsMap: AIMap<int> = null;
    private _pExprPart: AIAFXSimpleInstruction[] = null;

    constructor(sExprTemplate: string) {
        this._pInToOutArgsMap = <AIMap<int>>{};
        this._pExprPart = <AIAFXSimpleInstruction[]>[];

        var pSplitTemplate: string[] = sExprTemplate.split(/(\$\d+)/);

        for (var i: uint = 0; i < pSplitTemplate.length; i++) {
            if (pSplitTemplate[i]) {
                if (pSplitTemplate[i][0] !== '$') {
                    this._pExprPart.push(new SimpleInstruction(pSplitTemplate[i]));
                }
                else {
                    this._pExprPart.push(null);
                    this._pInToOutArgsMap[this._pExprPart.length - 1] = ((<number><any>(pSplitTemplate[i].substr(1))) * 1 - 1);
                }
            }
        }
    }

    toInstructionList(pArguments: AIAFXInstruction[]): AIAFXInstruction[] {
        var pOutputInstructionList: AIAFXInstruction[] = <AIAFXInstruction[]>[];

        for (var i: uint = 0; i < this._pExprPart.length; i++) {
            if (isNull(this._pExprPart[i])) {
                pOutputInstructionList.push(pArguments[this._pInToOutArgsMap[i]]);
            }
            else {
                pOutputInstructionList.push(this._pExprPart[i]);
            }
        }

        return pOutputInstructionList;
    }
}

export = ExprTemplateTranslator;

