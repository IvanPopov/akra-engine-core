/// <reference path="../idl/AIAFXVariableContainer.ts" />
/// <reference path="../idl/AIAFXInstruction.ts" />
/// <reference path="../idl/AIMap.ts" />

import VariableDeclInstruction = require("fx/VariableInstruction");
import sort = require("sort");

class VariableContainer implements AIAFXVariableContainer {
    private _pNameToIndexMap: AIMap<int> = null;
    private _pRealNameToIndexMap: AIMap<int> = null;
    private _pIndexList: uint[] = null;
    private _pVariableInfoMap: AIMap<AIAFXVariableInfo> = null;

    private _bLock: boolean = false;

    constructor() {
        this._pNameToIndexMap = <AIMap<int>>{};
        this._pRealNameToIndexMap = <AIMap<int>>{};
        this._pVariableInfoMap = <AIMap<AIAFXVariableInfo>>{};
    }

    get indices(): uint[] {
        return this._pIndexList;
    }

    add(pVar: AIAFXVariableDeclInstruction): void {
        if (this._bLock) {
            return;
        }

        var iIndex: uint = pVar._getNameIndex();
        var sName: string = pVar.getName();
        var sRealName: string = pVar.getRealName();

        this._pNameToIndexMap[sName] = iIndex;
        this._pRealNameToIndexMap[sRealName] = iIndex;
        this._pVariableInfoMap[iIndex] = <AIAFXVariableInfo>{
            variable: pVar,
            type: VariableContainer.getVariableType(pVar),
            name: sName,
            realName: sRealName,
            isArray: pVar.getType().isNotBaseArray(),
        };
    }

    addSystemEntry(sName: string, eType: AEAFXShaderVariableType): void {
        var iIndex: uint = VariableDeclInstruction.pShaderVarNamesGlobalDictionary.add(sName);

        this._pNameToIndexMap[sName] = iIndex;
        this._pRealNameToIndexMap[sName] = iIndex;
        this._pVariableInfoMap[iIndex] = <AIAFXVariableInfo>{
            variable: null,
            type: eType,
            name: sName,
            realName: sName,
            isArray: false
        };
    }

    finalize(): void {
        var pTmpKeys: string[] = Object.keys(this._pVariableInfoMap);
        this._pIndexList = new Array(pTmpKeys.length);

        for (var i: uint = 0; i < pTmpKeys.length; i++) {
            this._pIndexList[i] = +pTmpKeys[i];
        }
        this._pIndexList.sort(sort.minMax);
        this._bLock = true;
    }

    getVarInfoByIndex(iIndex: uint): AIAFXVariableInfo {
        return this._pVariableInfoMap[iIndex];
    }

    getVarByIndex(iIndex: uint): AIAFXVariableDeclInstruction {
        return this.getVarInfoByIndex(iIndex).variable;
    }

    getTypeByIndex(iIndex: uint): AEAFXShaderVariableType {
        return this.getVarInfoByIndex(iIndex).type;
    }

    isArrayVariable(iIndex: uint): boolean {
        return this.getVarInfoByIndex(iIndex).isArray;
    }

    getIndexByName(sName: string): uint {
        return this._pNameToIndexMap[sName] || (this._pNameToIndexMap[sName] = 0);
    }

    getIndexByRealName(sName: string): uint {
        return this._pRealNameToIndexMap[sName] || (this._pRealNameToIndexMap[sName] = 0);
    }

    hasVariableWithName(sName: string): boolean {
        return !!(this.getIndexByName(sName));
    }

    hasVariableWithRealName(sName: string): boolean {
        return !!(this.getIndexByRealName(sName));
    }

    getVarByName(sName: string): AIAFXVariableDeclInstruction {
        var iIndex: uint = this.getIndexByName(sName);

        if (iIndex === 0) {
            return null;
        }
        else {
            return this.getVarByIndex(iIndex);
        }
    }

    getVarByRealName(sName: string): AIAFXVariableDeclInstruction {
        var iIndex: uint = this.getIndexByRealName(sName);

        if (iIndex === 0) {
            return null;
        }
        else {
            return this.getVarByIndex(iIndex);
        }
    }

    static getVariableType(pVar: AIAFXVariableDeclInstruction): AEAFXShaderVariableType {
        var sBaseType: string = pVar.getType().getBaseType().getName();

        switch (sBaseType) {
            case "texture":
                return AEAFXShaderVariableType.k_Texture;

            case "float":
                return AEAFXShaderVariableType.k_Float;
            case "int":
                return AEAFXShaderVariableType.k_Int;
            case "boolean":
                return AEAFXShaderVariableType.k_Bool;

            case "float2":
                return AEAFXShaderVariableType.k_Float2;
            case "int2":
                return AEAFXShaderVariableType.k_Int2;
            case "bool2":
                return AEAFXShaderVariableType.k_Bool2;

            case "float3":
                return AEAFXShaderVariableType.k_Float3;
            case "int3":
                return AEAFXShaderVariableType.k_Int3;
            case "bool3":
                return AEAFXShaderVariableType.k_Bool3;

            case "float4":
                return AEAFXShaderVariableType.k_Float4;
            case "int4":
                return AEAFXShaderVariableType.k_Int4;
            case "bool4":
                return AEAFXShaderVariableType.k_Bool4;

            case "float2x2":
                return AEAFXShaderVariableType.k_Float2x2;
            case "float3x3":
                return AEAFXShaderVariableType.k_Float3x3;
            case "float4x4":
                return AEAFXShaderVariableType.k_Float4x4;

            case "sampler":
            case "sampler2D":
                return AEAFXShaderVariableType.k_Sampler2D;
            case "samplerCUBE":
                return AEAFXShaderVariableType.k_SamplerCUBE;

            default:
                if (pVar.getType().isComplex()) {
                    return AEAFXShaderVariableType.k_Complex;
                }
                else {
                    return AEAFXShaderVariableType.k_NotVar;
                }
        }
    }

}


export = VariableContainer;