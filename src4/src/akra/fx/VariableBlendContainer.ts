/// <reference path="../idl/IAFXInstruction.ts" />
/// <reference path="../idl/IMap.ts" />
/// <reference path="../logger.ts" />
/// <reference path="../webgl/webgl.ts" />

module akra.fx {

    export class VariableBlendContainer {
        protected _pVarBlendInfoList: IAFXVariableBlendInfo[] = null;
        protected _pNameToIndexMap: IMap<int> = null;
        protected _pNameIndexToIndexMap: IMap<int> = null;

        get varsInfo(): IAFXVariableBlendInfo[] {
            return this._pVarBlendInfoList;
        }

        getVarBlenInfo(iIndex: uint): IAFXVariableBlendInfo {
            return this._pVarBlendInfoList[iIndex];
        }

        getVarList(iIndex: uint): IAFXVariableDeclInstruction[] {
            return this._pVarBlendInfoList[iIndex].varList;
        }

        getBlendType(iIndex: uint): IAFXVariableTypeInstruction {
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

        hasVariable(pVar: IAFXVariableDeclInstruction): boolean {
            return this.hasVariableWithNameIndex(pVar._getNameIndex());
        }

        getVariable(iIndex: uint): IAFXVariableDeclInstruction {
            return this._pVarBlendInfoList[iIndex].varList[0];
        }

        getVariableByName(sName: string): IAFXVariableDeclInstruction {
            var iIndex: uint = this.getKeyIndexByName(sName);
            return iIndex === -1 ? null : this.getVariable(iIndex);
        }

        getVariableByNameIndex(iNameIndex: uint): IAFXVariableDeclInstruction {
            var iIndex: uint = this.getKeyIndexByNameIndex(iNameIndex);
            return iIndex === -1 ? null : this.getVariable(iIndex);
        }

        constructor() {
            this._pVarBlendInfoList = [];
            this._pNameToIndexMap = <IMap<int>>{};
            this._pNameIndexToIndexMap = <IMap<int>>{};
        }

        addVariable(pVariable: IAFXVariableDeclInstruction, eBlendMode: EAFXBlendMode): boolean {
            var sName: string = pVariable.getRealName();
            var iNameIndex: uint = pVariable._getNameIndex();
            var iIndex: uint = this.getKeyIndexByNameIndex(iNameIndex);

            if (iIndex === -1) {
                this._pVarBlendInfoList.push(<IAFXVariableBlendInfo>{
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

            var pBlendType: IAFXVariableTypeInstruction = this._pVarBlendInfoList[iIndex].blendType.blend(pVariable.getType(), eBlendMode);

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
            var pInfo: IAFXVariableBlendInfo = this._pVarBlendInfoList[iIndex];
            var pType: IAFXVariableTypeInstruction = pInfo.blendType;
            var pVar: IAFXVariableDeclInstruction = this.getVariable(iIndex);

            var sCode: string = pType.toFinalCode() + " ";
            sCode += pVar.getRealName();

            if (pVar.getType().isNotBaseArray()) {
                var iLength: uint = pVar.getType().getLength();
                if (webgl.ANGLE && iLength === 1 && pVar.getType().isComplex()) {
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

        forEach(iIndex: uint, fnModifier: { (pVar: IAFXVariableDeclInstruction): void; }): void {
            if (iIndex === -1) {
                return;
            }

            var pVarList: IAFXVariableDeclInstruction[] = this.getVarList(iIndex);

            for (var i: uint = 0; i < pVarList.length; i++) {
                fnModifier.call(null, pVarList[i]);
            }
        }

        setNameForEach(iIndex: uint, sNewRealName: string): void {
            if (iIndex === -1) {
                return;
            }

            var pVarList: IAFXVariableDeclInstruction[] = this.getVarList(iIndex);

            for (var i: uint = 0; i < pVarList.length; i++) {
                pVarList[i].setRealName(sNewRealName);
            }
        }
    }
}

