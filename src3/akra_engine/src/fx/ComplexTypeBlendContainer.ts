/// <reference path="../idl/AIAFXInstruction.ts" />

import VariableBlendContainer = require("fx/VariableBlendContainer");
import ComplexTypeInstruction = require("fx/ComplexTypeInstruction");

import logger = require("logger");

class ComplexTypeBlendContainer {
    private _pTypeListMap: AIAFXTypeMap = null;
    private _pTypeKeys: string[] = null;

    get keys(): string[] {
        return this._pTypeKeys;
    }

    get types(): AIAFXTypeMap {
        return this._pTypeListMap;
    }

    constructor() {
        this._pTypeListMap = <AIAFXTypeMap>{};
        this._pTypeKeys = [];
    }

    addComplexType(pComplexType: AIAFXTypeInstruction): boolean {
        var pFieldList: AIAFXVariableDeclInstruction[] = (<ComplexTypeInstruction>pComplexType)._getFieldDeclList();
        for (var i: uint = 0; i < pFieldList.length; i++) {
            if (pFieldList[i].getType().isComplex()) {
                if (!this.addComplexType(pFieldList[i].getType().getBaseType())) {
                    return false;
                }
            }
        }

        var sName: string = pComplexType.getRealName();

        if (!isDef(this._pTypeListMap[sName])) {
            this._pTypeListMap[sName] = pComplexType;
            this._pTypeKeys.push(sName);

            return true;
        }

        var pBlendType: AIAFXTypeInstruction = this._pTypeListMap[sName].blend(pComplexType, AEAFXBlendMode.k_TypeDecl);
        if (isNull(pBlendType)) {
            logger.error("Could not blend type declaration '" + sName + "'");
            return false;
        }

        this._pTypeListMap[sName] = pBlendType;

        return true;
    }

    addFromVarConatiner(pContainer: VariableBlendContainer): boolean {
        if (isNull(pContainer)) {
            return true;
        }

        var pVarInfoList: AIAFXVariableBlendInfo[] = pContainer.varsInfo;

        for (var i: uint = 0; i < pVarInfoList.length; i++) {
            var pType: AIAFXTypeInstruction = pContainer.getBlendType(i).getBaseType();

            if (pType.isComplex()) {
                if (!this.addComplexType(pType)) {
                    return false;
                }
            }
        }

        return true;
    }
}

export = ComplexTypeBlendContainer;