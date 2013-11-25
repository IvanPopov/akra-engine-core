/// <reference path="../idl/AIAFXInstruction.ts" />
/// <reference path="../idl/AIMap.ts" />


import logger = require("logger");
import webgl = require("webgl");


class VariableBlendContainer {
    protected _pVarBlendInfoList: AIAFXVariableBlendInfo[] = null;
    protected _pNameToIndexMap: AIMap<int> = null;
    protected _pNameIndexToIndexMap: AIMap<int> = null;

    get varsInfo(): AIAFXVariableBlendInfo[] {
        return this._pVarBlendInfoList;
    }

    getVarBlenInfo(iIndex: uint): AIAFXVariableBlendInfo {
        return this._pVarBlendInfoList[iIndex];
    }

    getVarList(iIndex: uint): AIAFXVariableDeclInstruction[] {
        return this._pVarBlendInfoList[iIndex].varList;
    }

    getBlendType(iIndex: uint): AIAFXVariableTypeInstruction {
        return this._pVarBlendInfoList[iIndex].blendType;
    }

    getKeyIndexByName(sName: string): int {
        return isDef(this._pNameToIndexMap[sName]) ? this._pNameToIndexMap[sName] : (this._pNameToIndexMap[sName] = -1);
    }

    getKeyIndexByNameIndex(iNameIndex: uint): int {
        return isDef(this._pNameIndexToIndexMap[iNameIndex]) ? this._pNameIndexToIndexMap[iNameIndex] : (this._pNameIndexToIndexMap[iNameIndex] = -1);
    }

    hasVariableWithName(sName: string): boolean {
        return this.getKeyIndexByName(sName) === -1 ? false : true;
    }

    hasVariableWithNameIndex(iNameIndex: uint): boolean {
        return this.getKeyIndexByNameIndex(iNameIndex) === -1 ? false : true;
    }

    hasVariable(pVar: AIAFXVariableDeclInstruction): boolean {
        return this.hasVariableWithNameIndex(pVar._getNameIndex());
    }

    getVariable(iIndex: uint): AIAFXVariableDeclInstruction {
        return this._pVarBlendInfoList[iIndex].varList[0];
    }

    getVariableByName(sName: string): AIAFXVariableDeclInstruction {
        var iIndex: uint = this.getKeyIndexByName(sName);
        return iIndex === -1 ? null : this.getVariable(iIndex);
    }

    getVariableByNameIndex(iNameIndex: uint): AIAFXVariableDeclInstruction {
        var iIndex: uint = this.getKeyIndexByNameIndex(iNameIndex);
        return iIndex === -1 ? null : this.getVariable(iIndex);
    }

    constructor() {
        this._pVarBlendInfoList = [];
        this._pNameToIndexMap = <AIMap<int>>{};
        this._pNameIndexToIndexMap = <AIMap<int>>{};
    }

    addVariable(pVariable: AIAFXVariableDeclInstruction, eBlendMode: AEAFXBlendMode): boolean {
        var sName: string = pVariable.getRealName();
        var iNameIndex: uint = pVariable._getNameIndex();
        var iIndex: uint = this.getKeyIndexByNameIndex(iNameIndex);

        if (iIndex === -1) {
            this._pVarBlendInfoList.push(<AIAFXVariableBlendInfo>{
                varList: [pVariable],
                blendType: pVariable.getType(),
                name: sName,
                nameIndex: iNameIndex
            });

            iIndex = this._pVarBlendInfoList.length - 1;

            this._pNameToIndexMap[sName] = iIndex;
            this._pNameIndexToIndexMap[iNameIndex] = iIndex;

            return true;
        }

        var pBlendType: AIAFXVariableTypeInstruction = this._pVarBlendInfoList[iIndex].blendType.blend(pVariable.getType(), eBlendMode);

        if (pBlendType === this._pVarBlendInfoList[iIndex].blendType) {
            return true;
        }

        if (isNull(pBlendType)) {
            logger.error("Could not blend type for variable '" + sName + "'");
            return false;
        }

        this._pVarBlendInfoList[iIndex].varList.push(pVariable);
        this._pVarBlendInfoList[iIndex].blendType = pBlendType;

        return true;
    }

    getDeclCodeForVar(iIndex: uint, bWithInitializer: boolean): string {
        var pInfo: AIAFXVariableBlendInfo = this._pVarBlendInfoList[iIndex];
        var pType: AIAFXVariableTypeInstruction = pInfo.blendType;
        var pVar: AIAFXVariableDeclInstruction = this.getVariable(iIndex);

        var sCode: string = pType.toFinalCode() + " ";
        sCode += pVar.getRealName();

        if (pVar.getType().isNotBaseArray()) {
            var iLength: uint = pVar.getType().getLength();
            if (webgl.isANGLE && iLength === 1 && pVar.getType().isComplex()) {
                sCode += "[" + 2 + "]";
            }
            else {
                sCode += "[" + iLength + "]";
            }
        }

        if (bWithInitializer && pVar.hasInitializer()) {
            sCode += "=" + pVar.getInitializeExpr().toFinalCode();
        }

        return sCode;
    }

    forEach(iIndex: uint, fnModifier: { (pVar: AIAFXVariableDeclInstruction): void; }): void {
        if (iIndex === -1) {
            return;
        }

        var pVarList: AIAFXVariableDeclInstruction[] = this.getVarList(iIndex);

        for (var i: uint = 0; i < pVarList.length; i++) {
            fnModifier.call(null, pVarList[i]);
        }
    }

    setNameForEach(iIndex: uint, sNewRealName: string): void {
        if (iIndex === -1) {
            return;
        }

        var pVarList: AIAFXVariableDeclInstruction[] = this.getVarList(iIndex);

        for (var i: uint = 0; i < pVarList.length; i++) {
            pVarList[i].setRealName(sNewRealName);
        }
    }
}

export = VariableBlendContainer;