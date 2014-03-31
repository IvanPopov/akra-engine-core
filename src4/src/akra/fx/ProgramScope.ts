/// <reference path="../idl/IScope.ts" />

module akra.fx {

	final export class ProgramScope {

		private _pScopeMap: IScopeMap;
		private _iCurrentScope: int;
		private _nScope: uint;

		constructor() {
			this._pScopeMap = <IScopeMap>{};
			this._iCurrentScope = null;
			this._nScope = 0;
		}

		_isStrictMode(iScope: uint = this._iCurrentScope): boolean {
			var pScope: IScope = this._pScopeMap[iScope];

			while (!isNull(pScope)) {
				if (pScope.isStrictMode) {
					return true;
				}

				pScope = pScope.parent;
			}

			return false;
		}

		_setStrictModeOn(iScope: uint = this._iCurrentScope): void {
			this._pScopeMap[iScope].isStrictMode = true;
		}

		_newScope(eType: EScopeType): void {
			var isFirstScope: boolean = false;
			var pParentScope: IScope;

			if (isNull(this._iCurrentScope)) {
				pParentScope = null;
			}
			else {
				pParentScope = this._pScopeMap[this._iCurrentScope];
			}

			this._iCurrentScope = this._nScope++;

			var pNewScope: IScope = <IScope> {
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

		_resumeScope(): void {
			if (this._nScope === 0) {
				return;
			}

			this._iCurrentScope = this._nScope - 1;
		}

		_setScope(iScope: uint): void {
			this._iCurrentScope = iScope;
		}

		_getScope(): uint {
			return this._iCurrentScope;
		}

		_endScope(): void {
			if (isNull(this._iCurrentScope)) {
				return;
			}

			var pOldScope: IScope = this._pScopeMap[this._iCurrentScope];
			var pNewScope: IScope = pOldScope.parent;

			if (isNull(pNewScope)) {
				this._iCurrentScope = null;
			}
			else {
				this._iCurrentScope = pNewScope.index;
			}
		}

		_getScopeType(): EScopeType {
			return this._pScopeMap[this._iCurrentScope].type;
		}

		_getVariable(sVariableName: string, iScope: uint = this._iCurrentScope): IAFXVariableDeclInstruction {
			if (isNull(iScope)) {
				return null;
			}

			var pScope: IScope = this._pScopeMap[iScope];

			while (!isNull(pScope)) {
				var pVariableMap: IAFXVariableDeclMap = pScope.variableMap;

				if (!isNull(pVariableMap)) {
					var pVariable: IAFXVariableDeclInstruction = pVariableMap[sVariableName];

					if (isDef(pVariable)) {
						return pVariable;
					}
				}

				pScope = pScope.parent;
			}

			return null;
		}

		_getType(sTypeName: string, iScope: uint = this._iCurrentScope): IAFXTypeInstruction {
			var pTypeDecl: IAFXTypeDeclInstruction = this._getTypeDecl(sTypeName, iScope);

			if (!isNull(pTypeDecl)) {
				return pTypeDecl._getType();
			}
			else {
				return null;
			}
		}

		_getTypeDecl(sTypeName: string, iScope: uint = this._iCurrentScope): IAFXTypeDeclInstruction {
			if (isNull(iScope)) {
				return null;
			}

			var pScope: IScope = this._pScopeMap[iScope];

			while (!isNull(pScope)) {
				var pTypeMap: IAFXTypeDeclMap = pScope.typeMap;

				if (!isNull(pTypeMap)) {
					var pType: IAFXTypeDeclInstruction = pTypeMap[sTypeName];

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
		_getFunction(sFuncName: string, pArgumentTypes: IAFXTypedInstruction[], iScope: uint = ProgramScope.GLOBAL_SCOPE): IAFXFunctionDeclInstruction {
			if (isNull(iScope)) {
				return null;
			}

			var pScope: IScope = this._pScopeMap[iScope];
			var pFunction: IAFXFunctionDeclInstruction = null;

			while (!isNull(pScope)) {
				var pFunctionListMap: IAFXFunctionDeclListMap = pScope.functionMap;

				if (!isNull(pFunctionListMap)) {
					var pFunctionList: IAFXFunctionDeclInstruction[] = pFunctionListMap[sFuncName];

					if (isDef(pFunctionList)) {

						for (var i: uint = 0; i < pFunctionList.length; i++) {
							var pTestedFunction: IAFXFunctionDeclInstruction = pFunctionList[i];
							var pTestedArguments: IAFXTypedInstruction[] = pTestedFunction._getArguments();

							if (pArgumentTypes.length > pTestedArguments.length ||
								pArgumentTypes.length < pTestedFunction._getNumNeededArguments()) {
								continue;
							}

							var isParamsEqual: boolean = true;

							for (var j: uint = 0; j < pArgumentTypes.length; j++) {
								isParamsEqual = false;

								if (!pArgumentTypes[j]._getType()._isEqual(pTestedArguments[j]._getType())) {
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
		_getShaderFunction(sFuncName: string, pArgumentTypes: IAFXTypedInstruction[], iScope: uint = ProgramScope.GLOBAL_SCOPE): IAFXFunctionDeclInstruction {
			if (isNull(iScope)) {
				return null;
			}

			var pScope: IScope = this._pScopeMap[iScope];
			var pFunction: IAFXFunctionDeclInstruction = null;

			while (!isNull(pScope)) {
				var pFunctionListMap: IAFXFunctionDeclListMap = pScope.functionMap;

				if (!isNull(pFunctionListMap)) {
					var pFunctionList: IAFXFunctionDeclInstruction[] = pFunctionListMap[sFuncName];

					if (isDef(pFunctionList)) {

						for (var i: uint = 0; i < pFunctionList.length; i++) {
							var pTestedFunction: IAFXFunctionDeclInstruction = pFunctionList[i];
							var pTestedArguments: IAFXVariableDeclInstruction[] = <IAFXVariableDeclInstruction[]>pTestedFunction._getArguments();

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
									if (pTestedArguments[j]._isUniform()) {
										break;
									}
									else {
										isParamsEqual = true;
									}
								}
								else if (pTestedArguments[j]._isUniform()) {
									if (!pArgumentTypes[iArg]._getType()._isEqual(pTestedArguments[j]._getType())) {
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

		_addVariable(pVariable: IAFXVariableDeclInstruction, iScope: uint = this._iCurrentScope): boolean {
			if (isNull(iScope)) {
				return false;
			}

			var pScope: IScope = this._pScopeMap[iScope];
			var pVariableMap: IAFXVariableDeclMap = pScope.variableMap;

			if (isNull(pVariableMap)) {
				pVariableMap = pScope.variableMap = <IAFXVariableDeclMap>{};
			}

			var sVariableName: string = pVariable._getName();

			if (!pVariable._getType()._isShared()) {
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
					var pBlendVariable: IAFXVariableDeclInstruction = pVariableMap[sVariableName]._blend(pVariable, EAFXBlendMode.k_Shared);
					if (isNull(pBlendVariable)) {
						return false;
					}
					pVariableMap[sVariableName] = pBlendVariable;
					pBlendVariable._setScope(iScope);
				}
			}

			return true;
		}

		_addType(pType: IAFXTypeDeclInstruction, iScope: uint = this._iCurrentScope): boolean {
			if (isNull(iScope)) {
				return false;
			}

			var pScope: IScope = this._pScopeMap[iScope];
			var pTypeMap: IAFXTypeDeclMap = pScope.typeMap;

			if (isNull(pTypeMap)) {
				pTypeMap = pScope.typeMap = <IAFXTypeDeclMap>{};
			}

			var sTypeName: string = pType._getName();

			if (this.hasTypeInScope(sTypeName, iScope)) {
				return false;
			}

			pTypeMap[sTypeName] = pType;
			pType._setScope(iScope);

			return true;
		}

		_addFunction(pFunction: IAFXFunctionDeclInstruction, iScope: uint = ProgramScope.GLOBAL_SCOPE): boolean {
			if (isNull(iScope)) {
				return false;
			}

			var pScope: IScope = this._pScopeMap[iScope];
			var pFunctionMap: IAFXFunctionDeclListMap = pScope.functionMap;

			if (isNull(pFunctionMap)) {
				pFunctionMap = pScope.functionMap = <IAFXFunctionDeclListMap>{};
			}

			var sFuncName: string = pFunction._getName();

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

		_hasVariable(sVariableName: string, iScope: uint = this._iCurrentScope): boolean {
			if (isNull(iScope)) {
				return false;
			}

			var pScope: IScope = this._pScopeMap[iScope];

			while (!isNull(pScope)) {
				var pVariableMap: IAFXVariableDeclMap = pScope.variableMap;

				if (!isNull(pVariableMap)) {
					var pVariable: IAFXVariableDeclInstruction = pVariableMap[sVariableName];

					if (isDef(pVariable)) {
						return true;
					}
				}

				pScope = pScope.parent;
			}

			return false;
		}

		_hasType(sTypeName: string, iScope: uint = this._iCurrentScope): boolean {
			if (isNull(iScope)) {
				return false;
			}

			var pScope: IScope = this._pScopeMap[iScope];

			while (!isNull(pScope)) {
				var pTypeMap: IAFXTypeDeclMap = pScope.typeMap;

				if (!isNull(pTypeMap)) {
					var pType: IAFXTypeDeclInstruction = pTypeMap[sTypeName];

					if (isDef(pType)) {
						return true;
					}
				}

				pScope = pScope.parent;
			}

			return false;
		}

		_hasFunction(sFuncName: string, pArgumentTypes: IAFXTypedInstruction[], iScope: uint = ProgramScope.GLOBAL_SCOPE): boolean {
			if (isNull(iScope)) {
				return false;
			}

			var pScope: IScope = this._pScopeMap[iScope];

			while (!isNull(pScope)) {
				var pFunctionListMap: IAFXFunctionDeclListMap = pScope.functionMap;

				if (!isNull(pFunctionListMap)) {
					var pFunctionList: IAFXFunctionDeclInstruction[] = pFunctionListMap[sFuncName];

					if (isDef(pFunctionList)) {
						var pFunction: IAFXFunctionDeclInstruction = null;

						for (var i: uint = 0; i < pFunctionList.length; i++) {
							var pTestedFunction: IAFXFunctionDeclInstruction = pFunctionList[i];
							var pTestedArguments: IAFXTypedInstruction[] = pTestedFunction._getArguments();

							if (pArgumentTypes.length > pTestedArguments.length ||
								pArgumentTypes.length < pTestedFunction._getNumNeededArguments()) {
								continue;
							}

							var isParamsEqual: boolean = true;

							for (var j: uint = 0; j < pArgumentTypes.length; j++) {
								isParamsEqual = false;

								if (!pArgumentTypes[j]._getType()._isEqual(pTestedArguments[j]._getType())) {
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

		private hasFunctionInScope(pFunction: IAFXFunctionDeclInstruction, iScope: uint): boolean {
			if (isNull(iScope)) {
				return false;
			}

			var pScope: IScope = this._pScopeMap[iScope];
			var pFunctionListMap: IAFXFunctionDeclListMap = pScope.functionMap;
			var pFunctionList: IAFXFunctionDeclInstruction[] = pFunctionListMap[pFunction._getName()];

			if (!isDef(pFunctionList)) {
				return false;
			}

			var pFunctionArguments: IAFXTypedInstruction[] = <IAFXTypedInstruction[]>pFunction._getArguments();
			var hasFunction: boolean = false;

			for (var i: uint = 0; i < pFunctionList.length; i++) {
				var pTestedArguments: IAFXTypedInstruction[] = <IAFXTypedInstruction[]>pFunctionList[i]._getArguments();

				if (pTestedArguments.length !== pFunctionArguments.length) {
					continue;
				}

				var isParamsEqual: boolean = true;

				for (var j: uint = 0; j < pFunctionArguments.length; j++) {
					isParamsEqual = false;

					if (!pTestedArguments[j]._getType()._isEqual(pFunctionArguments[j]._getType())) {
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
}

