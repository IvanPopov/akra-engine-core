/// <reference path="../idl/AIAFXInstruction.ts" />
define(["require", "exports", "fx/VariableBlendContainer", "fx/ComplexTypeInstruction", "logger"], function(require, exports, __VariableBlendContainer__, __ComplexTypeInstruction__, __logger__) {
    var VariableBlendContainer = __VariableBlendContainer__;
    var ComplexTypeInstruction = __ComplexTypeInstruction__;

    var logger = __logger__;

    var ComplexTypeBlendContainer = (function () {
        function ComplexTypeBlendContainer() {
            this._pTypeListMap = null;
            this._pTypeKeys = null;
            this._pTypeListMap = {};
            this._pTypeKeys = [];
        }
        Object.defineProperty(ComplexTypeBlendContainer.prototype, "keys", {
            get: function () {
                return this._pTypeKeys;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(ComplexTypeBlendContainer.prototype, "types", {
            get: function () {
                return this._pTypeListMap;
            },
            enumerable: true,
            configurable: true
        });

        ComplexTypeBlendContainer.prototype.addComplexType = function (pComplexType) {
            var pFieldList = (pComplexType)._getFieldDeclList();
            for (var i = 0; i < pFieldList.length; i++) {
                if (pFieldList[i].getType().isComplex()) {
                    if (!this.addComplexType(pFieldList[i].getType().getBaseType())) {
                        return false;
                    }
                }
            }

            var sName = pComplexType.getRealName();

            if (!isDef(this._pTypeListMap[sName])) {
                this._pTypeListMap[sName] = pComplexType;
                this._pTypeKeys.push(sName);

                return true;
            }

            var pBlendType = this._pTypeListMap[sName].blend(pComplexType, 6 /* k_TypeDecl */);
            if (isNull(pBlendType)) {
                logger.error("Could not blend type declaration '" + sName + "'");
                return false;
            }

            this._pTypeListMap[sName] = pBlendType;

            return true;
        };

        ComplexTypeBlendContainer.prototype.addFromVarConatiner = function (pContainer) {
            if (isNull(pContainer)) {
                return true;
            }

            var pVarInfoList = pContainer.varsInfo;

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

    
    return ComplexTypeBlendContainer;
});
//# sourceMappingURL=ComplexTypeBlendContainer.js.map
