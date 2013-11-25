/// <reference path="../idl/AIAFXInstruction.ts" />
/// <reference path="../idl/AIMap.ts" />
define(["require", "exports", "logger", "webgl"], function(require, exports, __logger__, __webgl__) {
    var logger = __logger__;
    var webgl = __webgl__;

    var VariableBlendContainer = (function () {
        function VariableBlendContainer() {
            this._pVarBlendInfoList = null;
            this._pNameToIndexMap = null;
            this._pNameIndexToIndexMap = null;
            this._pVarBlendInfoList = [];
            this._pNameToIndexMap = {};
            this._pNameIndexToIndexMap = {};
        }
        Object.defineProperty(VariableBlendContainer.prototype, "varsInfo", {
            get: function () {
                return this._pVarBlendInfoList;
            },
            enumerable: true,
            configurable: true
        });

        VariableBlendContainer.prototype.getVarBlenInfo = function (iIndex) {
            return this._pVarBlendInfoList[iIndex];
        };

        VariableBlendContainer.prototype.getVarList = function (iIndex) {
            return this._pVarBlendInfoList[iIndex].varList;
        };

        VariableBlendContainer.prototype.getBlendType = function (iIndex) {
            return this._pVarBlendInfoList[iIndex].blendType;
        };

        VariableBlendContainer.prototype.getKeyIndexByName = function (sName) {
            return isDef(this._pNameToIndexMap[sName]) ? this._pNameToIndexMap[sName] : (this._pNameToIndexMap[sName] = -1);
        };

        VariableBlendContainer.prototype.getKeyIndexByNameIndex = function (iNameIndex) {
            return isDef(this._pNameIndexToIndexMap[iNameIndex]) ? this._pNameIndexToIndexMap[iNameIndex] : (this._pNameIndexToIndexMap[iNameIndex] = -1);
        };

        VariableBlendContainer.prototype.hasVariableWithName = function (sName) {
            return this.getKeyIndexByName(sName) === -1 ? false : true;
        };

        VariableBlendContainer.prototype.hasVariableWithNameIndex = function (iNameIndex) {
            return this.getKeyIndexByNameIndex(iNameIndex) === -1 ? false : true;
        };

        VariableBlendContainer.prototype.hasVariable = function (pVar) {
            return this.hasVariableWithNameIndex(pVar._getNameIndex());
        };

        VariableBlendContainer.prototype.getVariable = function (iIndex) {
            return this._pVarBlendInfoList[iIndex].varList[0];
        };

        VariableBlendContainer.prototype.getVariableByName = function (sName) {
            var iIndex = this.getKeyIndexByName(sName);
            return iIndex === -1 ? null : this.getVariable(iIndex);
        };

        VariableBlendContainer.prototype.getVariableByNameIndex = function (iNameIndex) {
            var iIndex = this.getKeyIndexByNameIndex(iNameIndex);
            return iIndex === -1 ? null : this.getVariable(iIndex);
        };

        VariableBlendContainer.prototype.addVariable = function (pVariable, eBlendMode) {
            var sName = pVariable.getRealName();
            var iNameIndex = pVariable._getNameIndex();
            var iIndex = this.getKeyIndexByNameIndex(iNameIndex);

            if (iIndex === -1) {
                this._pVarBlendInfoList.push({
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

            var pBlendType = this._pVarBlendInfoList[iIndex].blendType.blend(pVariable.getType(), eBlendMode);

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
        };

        VariableBlendContainer.prototype.getDeclCodeForVar = function (iIndex, bWithInitializer) {
            var pInfo = this._pVarBlendInfoList[iIndex];
            var pType = pInfo.blendType;
            var pVar = this.getVariable(iIndex);

            var sCode = pType.toFinalCode() + " ";
            sCode += pVar.getRealName();

            if (pVar.getType().isNotBaseArray()) {
                var iLength = pVar.getType().getLength();
                if (webgl.isANGLE && iLength === 1 && pVar.getType().isComplex()) {
                    sCode += "[" + 2 + "]";
                } else {
                    sCode += "[" + iLength + "]";
                }
            }

            if (bWithInitializer && pVar.hasInitializer()) {
                sCode += "=" + pVar.getInitializeExpr().toFinalCode();
            }

            return sCode;
        };

        VariableBlendContainer.prototype.forEach = function (iIndex, fnModifier) {
            if (iIndex === -1) {
                return;
            }

            var pVarList = this.getVarList(iIndex);

            for (var i = 0; i < pVarList.length; i++) {
                fnModifier.call(null, pVarList[i]);
            }
        };

        VariableBlendContainer.prototype.setNameForEach = function (iIndex, sNewRealName) {
            if (iIndex === -1) {
                return;
            }

            var pVarList = this.getVarList(iIndex);

            for (var i = 0; i < pVarList.length; i++) {
                pVarList[i].setRealName(sNewRealName);
            }
        };
        return VariableBlendContainer;
    })();

    
    return VariableBlendContainer;
});
//# sourceMappingURL=VariableBlendContainer.js.map
