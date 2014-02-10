/// <reference path="../idl/IAFXInstruction.ts" />
/// <reference path="../logger.ts" />
var akra;
(function (akra) {
    /// <reference path="VariableBlendContainer.ts" />
    /// <reference path="ComplexTypeInstruction.ts" />
    (function (fx) {
        var ComplexTypeBlendContainer = (function () {
            function ComplexTypeBlendContainer() {
                this._pTypeListMap = null;
                this._pTypeKeys = null;
                this._pTypeListMap = {};
                this._pTypeKeys = [];
            }
            ComplexTypeBlendContainer.prototype.getKeys = function () {
                return this._pTypeKeys;
            };

            ComplexTypeBlendContainer.prototype.getTypes = function () {
                return this._pTypeListMap;
            };

            ComplexTypeBlendContainer.prototype.addComplexType = function (pComplexType) {
                var pFieldList = pComplexType._getFieldDeclList();
                for (var i = 0; i < pFieldList.length; i++) {
                    if (pFieldList[i].getType().isComplex()) {
                        if (!this.addComplexType(pFieldList[i].getType().getBaseType())) {
                            return false;
                        }
                    }
                }

                var sName = pComplexType.getRealName();

                if (!akra.isDef(this._pTypeListMap[sName])) {
                    this._pTypeListMap[sName] = pComplexType;
                    this._pTypeKeys.push(sName);

                    return true;
                }

                var pBlendType = this._pTypeListMap[sName].blend(pComplexType, 6 /* k_TypeDecl */);
                if (akra.isNull(pBlendType)) {
                    akra.logger.error("Could not blend type declaration '" + sName + "'");
                    return false;
                }

                this._pTypeListMap[sName] = pBlendType;

                return true;
            };

            ComplexTypeBlendContainer.prototype.addFromVarConatiner = function (pContainer) {
                if (akra.isNull(pContainer)) {
                    return true;
                }

                var pVarInfoList = pContainer.getVarsInfo();

                for (var i = 0; i < pVarInfoList.length; i++) {
                    var pType = pContainer.getBlendType(i).getBaseType();

                    if (pType.isComplex()) {
                        if (!this.addComplexType(pType)) {
                            return false;
                        }
                    }
                }

                return true;
            };
            return ComplexTypeBlendContainer;
        })();
        fx.ComplexTypeBlendContainer = ComplexTypeBlendContainer;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
//# sourceMappingURL=ComplexTypeBlendContainer.js.map
