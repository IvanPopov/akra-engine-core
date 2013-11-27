/// <reference path="../idl/AIScope.ts" />
define(["require", "exports"], function(require, exports) {
    var ProgramScope = (function () {
        function ProgramScope() {
            this._pScopeMap = {};
            this._iCurrentScope = null;
            this._nScope = 0;
        }
        ProgramScope.prototype.isStrictMode = function (iScope) {
            if (typeof iScope === "undefined") { iScope = this._iCurrentScope; }
            var pScope = this._pScopeMap[iScope];

            while (!isNull(pScope)) {
                if (pScope.isStrictMode) {
                    return true;
                }

                pScope = pScope.parent;
            }

            return false;
        };

        ProgramScope.prototype.setStrictModeOn = function (iScope) {
            if (typeof iScope === "undefined") { iScope = this._iCurrentScope; }
            this._pScopeMap[iScope].isStrictMode = true;
        };

        ProgramScope.prototype.newScope = function (eType) {
            var isFirstScope = false;
            var pParentScope;

            if (isNull(this._iCurrentScope)) {
                pParentScope = null;
            } else {
                pParentScope = this._pScopeMap[this._iCurrentScope];
            }

            this._iCurrentScope = this._nScope++;

            var pNewScope = {
                parent: pParentScope,
                index: this._iCurrentScope,
                type: eType,
                isStrictMode: false,
                variableMap: null,
                typeMap: null,
                functionMap: null
            };

            this._pScopeMap[this._iCurrentScope] = pNewScope;
        };

        ProgramScope.prototype.resumeScope = function () {
            if (this._nScope === 0) {
                return;
            }

            this._iCurrentScope = this._nScope - 1;
        };

        ProgramScope.prototype.setScope = function (iScope) {
            this._iCurrentScope = iScope;
        };

        ProgramScope.prototype.getScope = function () {
            return this._iCurrentScope;
        };

        ProgramScope.prototype.endScope = function () {
            if (isNull(this._iCurrentScope)) {
                return;
            }

            var pOldScope = this._pScopeMap[this._iCurrentScope];
            var pNewScope = pOldScope.parent;

            if (isNull(pNewScope)) {
                this._iCurrentScope = null;
            } else {
                this._iCurrentScope = pNewScope.index;
            }
        };

        ProgramScope.prototype.getScopeType = function () {
            return this._pScopeMap[this._iCurrentScope].type;
        };

        ProgramScope.prototype.getVariable = function (sVariableName, iScope) {
            if (typeof iScope === "undefined") { iScope = this._iCurrentScope; }
            if (isNull(iScope)) {
                return null;
            }

            var pScope = this._pScopeMap[iScope];

            while (!isNull(pScope)) {
                var pVariableMap = pScope.variableMap;

                if (!isNull(pVariableMap)) {
                    var pVariable = pVariableMap[sVariableName];

                    if (isDef(pVariable)) {
                        return pVariable;
                    }
                }

                pScope = pScope.parent;
            }

            return null;
        };

        ProgramScope.prototype.getType = function (sTypeName, iScope) {
            if (typeof iScope === "undefined") { iScope = this._iCurrentScope; }
            var pTypeDecl = this.getTypeDecl(sTypeName, iScope);

            if (!isNull(pTypeDecl)) {
                return pTypeDecl.getType();
            } else {
                return null;
            }
        };

        ProgramScope.prototype.getTypeDecl = function (sTypeName, iScope) {
            if (typeof iScope === "undefined") { iScope = this._iCurrentScope; }
            if (isNull(iScope)) {
                return null;
            }

            var pScope = this._pScopeMap[iScope];

            while (!isNull(pScope)) {
                var pTypeMap = pScope.typeMap;

                if (!isNull(pTypeMap)) {
                    var pType = pTypeMap[sTypeName];

                    if (isDef(pType)) {
                        return pType;
                    }
                }

                pScope = pScope.parent;
            }

            return null;
        };

        /**
        * get function by name and list of types
        * return null - if threre are not function; undefined - if there more then one function; function - if all ok
        */
        ProgramScope.prototype.getFunction = function (sFuncName, pArgumentTypes, iScope) {
            if (typeof iScope === "undefined") { iScope = ProgramScope.GLOBAL_SCOPE; }
            if (isNull(iScope)) {
                return null;
            }

            var pScope = this._pScopeMap[iScope];
            var pFunction = null;

            while (!isNull(pScope)) {
                var pFunctionListMap = pScope.functionMap;

                if (!isNull(pFunctionListMap)) {
                    var pFunctionList = pFunctionListMap[sFuncName];

                    if (isDef(pFunctionList)) {
                        for (var i = 0; i < pFunctionList.length; i++) {
                            var pTestedFunction = pFunctionList[i];
                            var pTestedArguments = pTestedFunction.getArguments();

                            if (pArgumentTypes.length > pTestedArguments.length || pArgumentTypes.length < pTestedFunction.getNumNeededArguments()) {
                                continue;
                            }

                            var isParamsEqual = true;

                            for (var j = 0; j < pArgumentTypes.length; j++) {
                                isParamsEqual = false;

                                if (!pArgumentTypes[j].getType().isEqual(pTestedArguments[j].getType())) {
                                    break;
                                }

                                isParamsEqual = true;
                            }

                            if (isParamsEqual) {
                                if (!isNull(pFunction)) {
                                    return undefined;
                                }
                                pFunction = pTestedFunction;
                            }
                        }
                    }
                }

                pScope = pScope.parent;
            }

            return pFunction;
        };

        /**
        * get shader function by name and list of types
        * return null - if threre are not function; undefined - if there more then one function; function - if all ok
        */
        ProgramScope.prototype.getShaderFunction = function (sFuncName, pArgumentTypes, iScope) {
            if (typeof iScope === "undefined") { iScope = ProgramScope.GLOBAL_SCOPE; }
            if (isNull(iScope)) {
                return null;
            }

            var pScope = this._pScopeMap[iScope];
            var pFunction = null;

            while (!isNull(pScope)) {
                var pFunctionListMap = pScope.functionMap;

                if (!isNull(pFunctionListMap)) {
                    var pFunctionList = pFunctionListMap[sFuncName];

                    if (isDef(pFunctionList)) {
                        for (var i = 0; i < pFunctionList.length; i++) {
                            var pTestedFunction = pFunctionList[i];
                            var pTestedArguments = pTestedFunction.getArguments();

                            if (pArgumentTypes.length > pTestedArguments.length) {
                                continue;
                            }

                            var isParamsEqual = true;
                            var iArg = 0;

                            if (pArgumentTypes.length === 0) {
                                if (!isNull(pFunction)) {
                                    return undefined;
                                }

                                pFunction = pTestedFunction;
                                continue;
                            }

                            for (var j = 0; j < pTestedArguments.length; j++) {
                                isParamsEqual = false;

                                if (iArg >= pArgumentTypes.length) {
                                    if (pTestedArguments[j].isUniform()) {
                                        break;
                                    } else {
                                        isParamsEqual = true;
                                    }
                                } else if (pTestedArguments[j].isUniform()) {
                                    if (!pArgumentTypes[iArg].getType().isEqual(pTestedArguments[j].getType())) {
                                        break;
                                    } else {
                                        iArg++;
                                        isParamsEqual = true;
                                    }
                                }
                            }

                            if (isParamsEqual) {
                                if (!isNull(pFunction)) {
                                    return undefined;
                                }
                                pFunction = pTestedFunction;
                            }
                        }
                    }
                }

                pScope = pScope.parent;
            }

            return pFunction;
        };

        ProgramScope.prototype.addVariable = function (pVariable, iScope) {
            if (typeof iScope === "undefined") { iScope = this._iCurrentScope; }
            if (isNull(iScope)) {
                return false;
            }

            var pScope = this._pScopeMap[iScope];
            var pVariableMap = pScope.variableMap;

            if (isNull(pVariableMap)) {
                pVariableMap = pScope.variableMap = {};
            }

            var sVariableName = pVariable.getName();

            if (!pVariable.getType().isShared()) {
                if (this.hasVariableInScope(sVariableName, iScope)) {
                    return false;
                }

                pVariableMap[sVariableName] = pVariable;
                pVariable._setScope(iScope);
            } else {
                if (!this.hasVariableInScope(sVariableName, iScope)) {
                    pVariableMap[sVariableName] = pVariable;
                    pVariable._setScope(iScope);
                } else {
                    var pBlendVariable = pVariableMap[sVariableName].blend(pVariable, 0 /* k_Shared */);
                    if (isNull(pBlendVariable)) {
                        return false;
                    }
                    pVariableMap[sVariableName] = pBlendVariable;
                    pBlendVariable._setScope(iScope);
                }
            }

            return true;
        };

        ProgramScope.prototype.addType = function (pType, iScope) {
            if (typeof iScope === "undefined") { iScope = this._iCurrentScope; }
            if (isNull(iScope)) {
                return false;
            }

            var pScope = this._pScopeMap[iScope];
            var pTypeMap = pScope.typeMap;

            if (isNull(pTypeMap)) {
                pTypeMap = pScope.typeMap = {};
            }

            var sTypeName = pType.getName();

            if (this.hasTypeInScope(sTypeName, iScope)) {
                return false;
            }

            pTypeMap[sTypeName] = pType;
            pType._setScope(iScope);

            return true;
        };

        ProgramScope.prototype.addFunction = function (pFunction, iScope) {
            if (typeof iScope === "undefined") { iScope = ProgramScope.GLOBAL_SCOPE; }
            if (isNull(iScope)) {
                return false;
            }

            var pScope = this._pScopeMap[iScope];
            var pFunctionMap = pScope.functionMap;

            if (isNull(pFunctionMap)) {
                pFunctionMap = pScope.functionMap = {};
            }

            var sFuncName = pFunction.getName();

            if (this.hasFunctionInScope(pFunction, iScope)) {
                return false;
            }

            if (!isDef(pFunctionMap[sFuncName])) {
                pFunctionMap[sFuncName] = [];
            }

            pFunctionMap[sFuncName].push(pFunction);
            pFunction._setScope(iScope);

            return true;
        };

        ProgramScope.prototype.hasVariable = function (sVariableName, iScope) {
            if (typeof iScope === "undefined") { iScope = this._iCurrentScope; }
            if (isNull(iScope)) {
                return false;
            }

            var pScope = this._pScopeMap[iScope];

            while (!isNull(pScope)) {
                var pVariableMap = pScope.variableMap;

                if (!isNull(pVariableMap)) {
                    var pVariable = pVariableMap[sVariableName];

                    if (isDef(pVariable)) {
                        return true;
                    }
                }

                pScope = pScope.parent;
            }

            return false;
        };

        ProgramScope.prototype.hasType = function (sTypeName, iScope) {
            if (typeof iScope === "undefined") { iScope = this._iCurrentScope; }
            if (isNull(iScope)) {
                return false;
            }

            var pScope = this._pScopeMap[iScope];

            while (!isNull(pScope)) {
                var pTypeMap = pScope.typeMap;

                if (!isNull(pTypeMap)) {
                    var pType = pTypeMap[sTypeName];

                    if (isDef(pType)) {
                        return true;
                    }
                }

                pScope = pScope.parent;
            }

            return false;
        };

        ProgramScope.prototype.hasFunction = function (sFuncName, pArgumentTypes, iScope) {
            if (typeof iScope === "undefined") { iScope = ProgramScope.GLOBAL_SCOPE; }
            if (isNull(iScope)) {
                return false;
            }

            var pScope = this._pScopeMap[iScope];

            while (!isNull(pScope)) {
                var pFunctionListMap = pScope.functionMap;

                if (!isNull(pFunctionListMap)) {
                    var pFunctionList = pFunctionListMap[sFuncName];

                    if (isDef(pFunctionList)) {
                        var pFunction = null;

                        for (var i = 0; i < pFunctionList.length; i++) {
                            var pTestedFunction = pFunctionList[i];
                            var pTestedArguments = pTestedFunction.getArguments();

                            if (pArgumentTypes.length > pTestedArguments.length || pArgumentTypes.length < pTestedFunction.getNumNeededArguments()) {
                                continue;
                            }

                            var isParamsEqual = true;

                            for (var j = 0; j < pArgumentTypes.length; j++) {
                                isParamsEqual = false;

                                if (!pArgumentTypes[j].getType().isEqual(pTestedArguments[j].getType())) {
                                    break;
                                }

                                isParamsEqual = true;
                            }

                            if (isParamsEqual) {
                                return true;
                            }
                        }
                    }
                }

                pScope = pScope.parent;
            }

            return false;
        };

        ProgramScope.prototype.hasVariableInScope = function (sVariableName, iScope) {
            return isDef(this._pScopeMap[iScope].variableMap[sVariableName]);
        };

        ProgramScope.prototype.hasTypeInScope = function (sTypeName, iScope) {
            return isDef(this._pScopeMap[iScope].typeMap[sTypeName]);
        };

        ProgramScope.prototype.hasFunctionInScope = function (pFunction, iScope) {
            if (isNull(iScope)) {
                return false;
            }

            var pScope = this._pScopeMap[iScope];
            var pFunctionListMap = pScope.functionMap;
            var pFunctionList = pFunctionListMap[pFunction.getName()];

            if (!isDef(pFunctionList)) {
                return false;
            }

            var pFunctionArguments = pFunction.getArguments();
            var hasFunction = false;

            for (var i = 0; i < pFunctionList.length; i++) {
                var pTestedArguments = pFunctionList[i].getArguments();

                if (pTestedArguments.length !== pFunctionArguments.length) {
                    continue;
                }

                var isParamsEqual = true;

                for (var j = 0; j < pFunctionArguments.length; j++) {
                    isParamsEqual = false;

                    if (!pTestedArguments[j].getType().isEqual(pFunctionArguments[j].getType())) {
                        break;
                    }

                    isParamsEqual = true;
                }

                if (isParamsEqual) {
                    hasFunction = true;
                    break;
                }
            }

            return hasFunction;
        };

        ProgramScope.GLOBAL_SCOPE = 0;
        return ProgramScope;
    })();

    
    return ProgramScope;
});
//# sourceMappingURL=ProgramScope.js.map
