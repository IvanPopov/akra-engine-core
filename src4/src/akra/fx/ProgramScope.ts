/// <reference path="../idl/AIScope.ts" />

class ProgramScope {

    private _pScopeMap: AIScopeMap;
    private _iCurrentScope: int;
    private _nScope: uint;

    constructor() {
        this._pScopeMap = <AIScopeMap>{};
        this._iCurrentScope = null;
        this._nScope = 0;
    }

    isStrictMode(iScope: uint = this._iCurrentScope): boolean {
        var pScope: AIScope = this._pScopeMap[iScope];

        while (!isNull(pScope)) {
            if (pScope.isStrictMode) {
                return true;
            }

            pScope = pScope.parent;
        }

        return false;
    }

    setStrictModeOn(iScope: uint = this._iCurrentScope): void {
        this._pScopeMap[iScope].isStrictMode = true;
    }

    newScope(eType: AEScopeType): void {
        var isFirstScope: boolean = false;
        var pParentScope: AIScope;

        if (isNull(this._iCurrentScope)) {
            pParentScope = null;
        }
        else {
            pParentScope = this._pScopeMap[this._iCurrentScope];
        }

        this._iCurrentScope = this._nScope++;

        var pNewScope: AIScope = <AIScope> {
            parent: pParentScope,
            index: this._iCurrentScope,
            type: eType,
            isStrictMode: false,
            variableMap: null,
            typeMap: null,
            functionMap: null
        };

        this._pScopeMap[this._iCurrentScope] = pNewScope;
    }

    resumeScope(): void {
        if (this._nScope === 0) {
            return;
        }

        this._iCurrentScope = this._nScope - 1;
    }

    setScope(iScope: uint): void {
        this._iCurrentScope = iScope;
    }

    getScope(): uint {
        return this._iCurrentScope;
    }

    endScope(): void {
        if (isNull(this._iCurrentScope)) {
            return;
        }

        var pOldScope: AIScope = this._pScopeMap[this._iCurrentScope];
        var pNewScope: AIScope = pOldScope.parent;

        if (isNull(pNewScope)) {
            this._iCurrentScope = null;
        }
        else {
            this._iCurrentScope = pNewScope.index;
        }
    }

    getScopeType(): AEScopeType {
        return this._pScopeMap[this._iCurrentScope].type;
    }

    getVariable(sVariableName: string, iScope: uint = this._iCurrentScope): AIAFXVariableDeclInstruction {
        if (isNull(iScope)) {
            return null;
        }

        var pScope: AIScope = this._pScopeMap[iScope];

        while (!isNull(pScope)) {
            var pVariableMap: AIAFXVariableDeclMap = pScope.variableMap;

            if (!isNull(pVariableMap)) {
                var pVariable: AIAFXVariableDeclInstruction = pVariableMap[sVariableName];

                if (isDef(pVariable)) {
                    return pVariable;
                }
            }

            pScope = pScope.parent;
        }

        return null;
    }

    getType(sTypeName: string, iScope: uint = this._iCurrentScope): AIAFXTypeInstruction {
        var pTypeDecl: AIAFXTypeDeclInstruction = this.getTypeDecl(sTypeName, iScope);

        if (!isNull(pTypeDecl)) {
            return pTypeDecl.getType();
        }
        else {
            return null;
        }
    }

    getTypeDecl(sTypeName: string, iScope: uint = this._iCurrentScope): AIAFXTypeDeclInstruction {
        if (isNull(iScope)) {
            return null;
        }

        var pScope: AIScope = this._pScopeMap[iScope];

        while (!isNull(pScope)) {
            var pTypeMap: AIAFXTypeDeclMap = pScope.typeMap;

            if (!isNull(pTypeMap)) {
                var pType: AIAFXTypeDeclInstruction = pTypeMap[sTypeName];

                if (isDef(pType)) {
                    return pType;
                }
            }

            pScope = pScope.parent;
        }

        return null;
    }

    /**
     * get function by name and list of types
     * return null - if threre are not function; undefined - if there more then one function; function - if all ok
     */
    getFunction(sFuncName: string, pArgumentTypes: AIAFXTypedInstruction[], iScope: uint = ProgramScope.GLOBAL_SCOPE): AIAFXFunctionDeclInstruction {
        if (isNull(iScope)) {
            return null;
        }

        var pScope: AIScope = this._pScopeMap[iScope];
        var pFunction: AIAFXFunctionDeclInstruction = null;

        while (!isNull(pScope)) {
            var pFunctionListMap: AIAFXFunctionDeclListMap = pScope.functionMap;

            if (!isNull(pFunctionListMap)) {
                var pFunctionList: AIAFXFunctionDeclInstruction[] = pFunctionListMap[sFuncName];

                if (isDef(pFunctionList)) {

                    for (var i: uint = 0; i < pFunctionList.length; i++) {
                        var pTestedFunction: AIAFXFunctionDeclInstruction = pFunctionList[i];
                        var pTestedArguments: AIAFXTypedInstruction[] = pTestedFunction.getArguments();

                        if (pArgumentTypes.length > pTestedArguments.length ||
                            pArgumentTypes.length < pTestedFunction.getNumNeededArguments()) {
                            continue;
                        }

                        var isParamsEqual: boolean = true;

                        for (var j: uint = 0; j < pArgumentTypes.length; j++) {
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
    }

    /**
     * get shader function by name and list of types
     * return null - if threre are not function; undefined - if there more then one function; function - if all ok
     */
    getShaderFunction(sFuncName: string, pArgumentTypes: AIAFXTypedInstruction[], iScope: uint = ProgramScope.GLOBAL_SCOPE): AIAFXFunctionDeclInstruction {
        if (isNull(iScope)) {
            return null;
        }

        var pScope: AIScope = this._pScopeMap[iScope];
        var pFunction: AIAFXFunctionDeclInstruction = null;

        while (!isNull(pScope)) {
            var pFunctionListMap: AIAFXFunctionDeclListMap = pScope.functionMap;

            if (!isNull(pFunctionListMap)) {
                var pFunctionList: AIAFXFunctionDeclInstruction[] = pFunctionListMap[sFuncName];

                if (isDef(pFunctionList)) {

                    for (var i: uint = 0; i < pFunctionList.length; i++) {
                        var pTestedFunction: AIAFXFunctionDeclInstruction = pFunctionList[i];
                        var pTestedArguments: AIAFXVariableDeclInstruction[] = <AIAFXVariableDeclInstruction[]>pTestedFunction.getArguments();

                        if (pArgumentTypes.length > pTestedArguments.length) {
                            continue;
                        }

                        var isParamsEqual: boolean = true;
                        var iArg: uint = 0;

                        if (pArgumentTypes.length === 0) {
                            if (!isNull(pFunction)) {
                                return undefined;
                            }

                            pFunction = pTestedFunction;
                            continue;
                        }

                        for (var j: uint = 0; j < pTestedArguments.length; j++) {
                            isParamsEqual = false;

                            if (iArg >= pArgumentTypes.length) {
                                if (pTestedArguments[j].isUniform()) {
                                    break;
                                }
                                else {
                                    isParamsEqual = true;
                                }
                            }
                            else if (pTestedArguments[j].isUniform()) {
                                if (!pArgumentTypes[iArg].getType().isEqual(pTestedArguments[j].getType())) {
                                    break;
                                }
                                else {
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
    }

    addVariable(pVariable: AIAFXVariableDeclInstruction, iScope: uint = this._iCurrentScope): boolean {
        if (isNull(iScope)) {
            return false;
        }

        var pScope: AIScope = this._pScopeMap[iScope];
        var pVariableMap: AIAFXVariableDeclMap = pScope.variableMap;

        if (isNull(pVariableMap)) {
            pVariableMap = pScope.variableMap = <AIAFXVariableDeclMap>{};
        }

        var sVariableName: string = pVariable.getName();

        if (!pVariable.getType().isShared()) {
            if (this.hasVariableInScope(sVariableName, iScope)) {
                return false;
            }

            pVariableMap[sVariableName] = pVariable;
            pVariable._setScope(iScope);
        }
        else {
            if (!this.hasVariableInScope(sVariableName, iScope)) {
                pVariableMap[sVariableName] = pVariable;
                pVariable._setScope(iScope);
            }
            else {
                var pBlendVariable: AIAFXVariableDeclInstruction = pVariableMap[sVariableName].blend(pVariable, AEAFXBlendMode.k_Shared);
                if (isNull(pBlendVariable)) {
                    return false;
                }
                pVariableMap[sVariableName] = pBlendVariable;
                pBlendVariable._setScope(iScope);
            }
        }

        return true;
    }

    addType(pType: AIAFXTypeDeclInstruction, iScope: uint = this._iCurrentScope): boolean {
        if (isNull(iScope)) {
            return false;
        }

        var pScope: AIScope = this._pScopeMap[iScope];
        var pTypeMap: AIAFXTypeDeclMap = pScope.typeMap;

        if (isNull(pTypeMap)) {
            pTypeMap = pScope.typeMap = <AIAFXTypeDeclMap>{};
        }

        var sTypeName: string = pType.getName();

        if (this.hasTypeInScope(sTypeName, iScope)) {
            return false;
        }

        pTypeMap[sTypeName] = pType;
        pType._setScope(iScope);

        return true;
    }

    addFunction(pFunction: AIAFXFunctionDeclInstruction, iScope: uint = ProgramScope.GLOBAL_SCOPE): boolean {
        if (isNull(iScope)) {
            return false;
        }

        var pScope: AIScope = this._pScopeMap[iScope];
        var pFunctionMap: AIAFXFunctionDeclListMap = pScope.functionMap;

        if (isNull(pFunctionMap)) {
            pFunctionMap = pScope.functionMap = <AIAFXFunctionDeclListMap>{};
        }

        var sFuncName: string = pFunction.getName();

        if (this.hasFunctionInScope(pFunction, iScope)) {
            return false;
        }

        if (!isDef(pFunctionMap[sFuncName])) {
            pFunctionMap[sFuncName] = [];
        }

        pFunctionMap[sFuncName].push(pFunction);
        pFunction._setScope(iScope);

        return true;
    }

    hasVariable(sVariableName: string, iScope: uint = this._iCurrentScope): boolean {
        if (isNull(iScope)) {
            return false;
        }

        var pScope: AIScope = this._pScopeMap[iScope];

        while (!isNull(pScope)) {
            var pVariableMap: AIAFXVariableDeclMap = pScope.variableMap;

            if (!isNull(pVariableMap)) {
                var pVariable: AIAFXVariableDeclInstruction = pVariableMap[sVariableName];

                if (isDef(pVariable)) {
                    return true;
                }
            }

            pScope = pScope.parent;
        }

        return false;
    }

    hasType(sTypeName: string, iScope: uint = this._iCurrentScope): boolean {
        if (isNull(iScope)) {
            return false;
        }

        var pScope: AIScope = this._pScopeMap[iScope];

        while (!isNull(pScope)) {
            var pTypeMap: AIAFXTypeDeclMap = pScope.typeMap;

            if (!isNull(pTypeMap)) {
                var pType: AIAFXTypeDeclInstruction = pTypeMap[sTypeName];

                if (isDef(pType)) {
                    return true;
                }
            }

            pScope = pScope.parent;
        }

        return false;
    }

    hasFunction(sFuncName: string, pArgumentTypes: AIAFXTypedInstruction[], iScope: uint = ProgramScope.GLOBAL_SCOPE): boolean {
        if (isNull(iScope)) {
            return false;
        }

        var pScope: AIScope = this._pScopeMap[iScope];

        while (!isNull(pScope)) {
            var pFunctionListMap: AIAFXFunctionDeclListMap = pScope.functionMap;

            if (!isNull(pFunctionListMap)) {
                var pFunctionList: AIAFXFunctionDeclInstruction[] = pFunctionListMap[sFuncName];

                if (isDef(pFunctionList)) {
                    var pFunction: AIAFXFunctionDeclInstruction = null;

                    for (var i: uint = 0; i < pFunctionList.length; i++) {
                        var pTestedFunction: AIAFXFunctionDeclInstruction = pFunctionList[i];
                        var pTestedArguments: AIAFXTypedInstruction[] = pTestedFunction.getArguments();

                        if (pArgumentTypes.length > pTestedArguments.length ||
                            pArgumentTypes.length < pTestedFunction.getNumNeededArguments()) {
                            continue;
                        }

                        var isParamsEqual: boolean = true;

                        for (var j: uint = 0; j < pArgumentTypes.length; j++) {
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
    }

    private hasVariableInScope(sVariableName: string, iScope: uint): boolean {
        return isDef(this._pScopeMap[iScope].variableMap[sVariableName]);
    }

    private hasTypeInScope(sTypeName: string, iScope: uint): boolean {
        return isDef(this._pScopeMap[iScope].typeMap[sTypeName]);
    }

    private hasFunctionInScope(pFunction: AIAFXFunctionDeclInstruction, iScope: uint): boolean {
        if (isNull(iScope)) {
            return false;
        }

        var pScope: AIScope = this._pScopeMap[iScope];
        var pFunctionListMap: AIAFXFunctionDeclListMap = pScope.functionMap;
        var pFunctionList: AIAFXFunctionDeclInstruction[] = pFunctionListMap[pFunction.getName()];

        if (!isDef(pFunctionList)) {
            return false;
        }

        var pFunctionArguments: AIAFXTypedInstruction[] = <AIAFXTypedInstruction[]>pFunction.getArguments();
        var hasFunction: boolean = false;

        for (var i: uint = 0; i < pFunctionList.length; i++) {
            var pTestedArguments: AIAFXTypedInstruction[] = <AIAFXTypedInstruction[]>pFunctionList[i].getArguments();

            if (pTestedArguments.length !== pFunctionArguments.length) {
                continue;
            }

            var isParamsEqual: boolean = true;

            for (var j: uint = 0; j < pFunctionArguments.length; j++) {
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
    }

    static GLOBAL_SCOPE = 0;

}


export = ProgramScope;