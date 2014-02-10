/// <reference path="../idl/IAFXVariableContainer.ts" />
/// <reference path="../idl/IAFXInstruction.ts" />
/// <reference path="../idl/IMap.ts" />
var akra;
(function (akra) {
    /// <reference path="../sort/sort.ts" />
    /// <reference path="VariableInstruction.ts" />
    (function (fx) {
        var VariableContainer = (function () {
            function VariableContainer() {
                this._pNameToIndexMap = null;
                this._pRealNameToIndexMap = null;
                this._pIndexList = null;
                this._pVariableInfoMap = null;
                this._bLock = false;
                this._pNameToIndexMap = {};
                this._pRealNameToIndexMap = {};
                this._pVariableInfoMap = {};
            }
            VariableContainer.prototype.getIndices = function () {
                return this._pIndexList;
            };

            VariableContainer.prototype.add = function (pVar) {
                if (this._bLock) {
                    return;
                }

                var iIndex = pVar._getNameIndex();
                var sName = pVar.getName();
                var sRealName = pVar.getRealName();

                this._pNameToIndexMap[sName] = iIndex;
                this._pRealNameToIndexMap[sRealName] = iIndex;
                this._pVariableInfoMap[iIndex] = {
                    variable: pVar,
                    type: VariableContainer.getVariableType(pVar),
                    name: sName,
                    realName: sRealName,
                    isArray: pVar.getType().isNotBaseArray()
                };
            };

            VariableContainer.prototype.addSystemEntry = function (sName, eType) {
                var iIndex = akra.fx.VariableDeclInstruction.pShaderVarNamesGlobalDictionary.add(sName);

                this._pNameToIndexMap[sName] = iIndex;
                this._pRealNameToIndexMap[sName] = iIndex;
                this._pVariableInfoMap[iIndex] = {
                    variable: null,
                    type: eType,
                    name: sName,
                    realName: sName,
                    isArray: false
                };
            };

            VariableContainer.prototype.finalize = function () {
                var pTmpKeys = Object.keys(this._pVariableInfoMap);
                this._pIndexList = new Array(pTmpKeys.length);

                for (var i = 0; i < pTmpKeys.length; i++) {
                    this._pIndexList[i] = +pTmpKeys[i];
                }
                this._pIndexList.sort(akra.sort.minMax);
                this._bLock = true;
            };

            VariableContainer.prototype.getVarInfoByIndex = function (iIndex) {
                return this._pVariableInfoMap[iIndex];
            };

            VariableContainer.prototype.getVarByIndex = function (iIndex) {
                return this.getVarInfoByIndex(iIndex).variable;
            };

            VariableContainer.prototype.getTypeByIndex = function (iIndex) {
                return this.getVarInfoByIndex(iIndex).type;
            };

            VariableContainer.prototype.isArrayVariable = function (iIndex) {
                return this.getVarInfoByIndex(iIndex).isArray;
            };

            VariableContainer.prototype.getIndexByName = function (sName) {
                return this._pNameToIndexMap[sName] || (this._pNameToIndexMap[sName] = 0);
            };

            VariableContainer.prototype.getIndexByRealName = function (sName) {
                return this._pRealNameToIndexMap[sName] || (this._pRealNameToIndexMap[sName] = 0);
            };

            VariableContainer.prototype.hasVariableWithName = function (sName) {
                return !!(this.getIndexByName(sName));
            };

            VariableContainer.prototype.hasVariableWithRealName = function (sName) {
                return !!(this.getIndexByRealName(sName));
            };

            VariableContainer.prototype.getVarByName = function (sName) {
                var iIndex = this.getIndexByName(sName);

                if (iIndex === 0) {
                    return null;
                } else {
                    return this.getVarByIndex(iIndex);
                }
            };

            VariableContainer.prototype.getVarByRealName = function (sName) {
                var iIndex = this.getIndexByRealName(sName);

                if (iIndex === 0) {
                    return null;
                } else {
                    return this.getVarByIndex(iIndex);
                }
            };

            VariableContainer.getVariableType = function (pVar) {
                var sBaseType = pVar.getType().getBaseType().getName();

                switch (sBaseType) {
                    case "texture":
                        return 2 /* k_Texture */;

                    case "float":
                        return 3 /* k_Float */;
                    case "int":
                        return 4 /* k_Int */;
                    case "bool":
                        return 5 /* k_Bool */;

                    case "float2":
                        return 6 /* k_Float2 */;
                    case "int2":
                        return 7 /* k_Int2 */;
                    case "bool2":
                        return 8 /* k_Bool2 */;

                    case "float3":
                        return 9 /* k_Float3 */;
                    case "int3":
                        return 10 /* k_Int3 */;
                    case "bool3":
                        return 11 /* k_Bool3 */;

                    case "float4":
                        return 12 /* k_Float4 */;
                    case "int4":
                        return 13 /* k_Int4 */;
                    case "bool4":
                        return 14 /* k_Bool4 */;

                    case "float2x2":
                        return 15 /* k_Float2x2 */;
                    case "float3x3":
                        return 16 /* k_Float3x3 */;
                    case "float4x4":
                        return 17 /* k_Float4x4 */;

                    case "sampler":
                    case "sampler2D":
                        return 18 /* k_Sampler2D */;
                    case "samplerCUBE":
                        return 19 /* k_SamplerCUBE */;

                    default:
                        if (pVar.getType().isComplex()) {
                            return 22 /* k_Complex */;
                        } else {
                            return 0 /* k_NotVar */;
                        }
                }
            };
            return VariableContainer;
        })();
        fx.VariableContainer = VariableContainer;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
//# sourceMappingURL=VariableContainer.js.map
