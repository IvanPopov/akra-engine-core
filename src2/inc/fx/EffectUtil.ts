#ifndef AFXEFFECTUTIL_TS
#define AFXEFFECTUTIL_TS

#include "common.ts"
#include "fx/Instruction.ts"

module akra.fx {
	
	#define GLOBAL_SCOPE 0
	
	export enum EScopeType{
		k_Default,
		k_Struct,
		k_Annotation
	}

	export interface IAFXVariableDeclMap { 
		[variableName: string] : IAFXVariableDeclInstruction;
	}
	
	export interface IAFXTypeDeclMap {
		[typeName: string] : IAFXTypeDeclInstruction;
	}

	export interface IAFXFunctionDeclListMap {
		[functionName: string] : IAFXFunctionDeclInstruction[];
	}

	export interface IScope {
		parent : IScope;
		index: uint;
		type: EScopeType;

		variableMap : IAFXVariableDeclMap;
		typeMap : IAFXTypeDeclMap;
		functionMap : IAFXFunctionDeclListMap;
	}

	export interface IScopeMap {
		[scopeIndex: uint] : IScope;
	}

	export class ProgramScope {
		
		private _pScopeMap: IScopeMap; 
		private _iCurrentScope: int;
		private _nScope: uint;

		constructor() {
			this._pScopeMap = <IScopeMap>{};
			this._iCurrentScope = null;
			this._nScope = 0;
		}

		newScope(eType: EScopeType): void {
			var isFirstScope: bool = false;
			var pParentScope: IScope;

			if(isNull(this._iCurrentScope)){
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
										variableMap: null,
										typeMap: null,
										functionMap: null
									};	

			this._pScopeMap[this._iCurrentScope] = pNewScope;
		}

		resumeScope(): void {
			if(this._nScope === 0) {
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
			if(isNull(this._iCurrentScope)){
				return;
			}

			var pOldScope: IScope = this._pScopeMap[this._iCurrentScope];
			var pNewScope: IScope = pOldScope.parent;

			if(isNull(pNewScope)){
				this._iCurrentScope = null;
			}
			else {
				this._iCurrentScope = pNewScope.index;
			}
		}

		inline getScopeType(): EScopeType {
			return this._pScopeMap[this._iCurrentScope].type;
		}

		getVariable(sVariableName: string, iScope?: uint = this._iCurrentScope): IAFXVariableDeclInstruction {
			if(isNull(iScope)){
				return null;
			}

			var pScope: IScope = this._pScopeMap[iScope];

			while(!isNull(pScope)){
				var pVariableMap: IAFXVariableDeclMap = pScope.variableMap;

				if(!isNull(pVariableMap)){
					var pVariable: IAFXVariableDeclInstruction = pVariableMap[sVariableName];

					if(isDef(pVariable)){
						return pVariable;
					}
				}

				pScope = pScope.parent;
			}

			return null;
		}

		getType(sTypeName: string, iScope?: uint = this._iCurrentScope): IAFXTypeInstruction {
			var pTypeDecl: IAFXTypeDeclInstruction = this.getTypeDecl(sTypeName, iScope);
			
			if(!isNull(pTypeDecl)){
				return pTypeDecl.getType();
			}
			else {
				return null;
			}
		}

		getTypeDecl(sTypeName: string, iScope?: uint = this._iCurrentScope): IAFXTypeDeclInstruction {
			if(isNull(iScope)){
				return null;
			}

			var pScope: IScope = this._pScopeMap[iScope];

			while(!isNull(pScope)){
				var pTypeMap: IAFXTypeDeclMap = pScope.typeMap;

				if(!isNull(pTypeMap)){
					var pType: IAFXTypeDeclInstruction = pTypeMap[sTypeName];

					if(isDef(pType)){
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
		getFunction(sFuncName: string, pArgumentTypes: IAFXTypedInstruction[], iScope?: uint = GLOBAL_SCOPE): IAFXFunctionDeclInstruction {
			if(isNull(iScope)){
				return null;
			}

			var pScope: IScope = this._pScopeMap[iScope];
			var pFunction: IAFXFunctionDeclInstruction = null;

			while(!isNull(pScope)){
				var pFunctionListMap: IAFXFunctionDeclListMap = pScope.functionMap;

				if(!isNull(pFunctionListMap)){
					var pFunctionList: IAFXFunctionDeclInstruction[] = pFunctionListMap[sFuncName];
					
					if(isDef(pFunctionList)){
						
						for(var i: uint = 0; i < pFunctionList.length; i++){
							var pTestedFunction: IAFXFunctionDeclInstruction  = pFunctionList[i];
							var pTestedArguments: IAFXTypedInstruction[] = pTestedFunction.getArguments();

							if(pArgumentTypes.length > pTestedArguments.length ||
							   pArgumentTypes.length < pTestedFunction.getNumNeededArguments()){
								continue;
							}

							var isParamsEqual: bool = true;

							for(var j: uint = 0; j < pArgumentTypes.length; j++){
								isParamsEqual = false;

								if(!pArgumentTypes[j].getType().isEqual(pTestedArguments[j].getType())){
									break;
								}

								isParamsEqual = true;
							}

							if(isParamsEqual){
								if(!isNull(pFunction)){
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

		addVariable(pVariable: IAFXVariableDeclInstruction, iScope?: uint = this._iCurrentScope): bool {
			if(isNull(iScope)){
				return false;
			}

			var pScope: IScope = this._pScopeMap[iScope];
			var pVariableMap: IAFXVariableDeclMap = pScope.variableMap;

			if(!isDef(pVariableMap)){
				pVariableMap = pScope.variableMap = <IAFXVariableDeclMap>{};
			}

			var sVariableName: string = pVariable.getName();

			if(this.hasVariableInScope(sVariableName, iScope)){
				return false;
			}

			pVariableMap[sVariableName] = pVariable;

			return true;
		}

		addType(pType: IAFXTypeDeclInstruction, iScope?: uint = this._iCurrentScope): bool {
			if(isNull(iScope)){
				return false;
			}

			var pScope: IScope = this._pScopeMap[iScope];
			var pTypeMap: IAFXTypeDeclMap = pScope.typeMap;

			if(!isDef(pTypeMap)){
				pTypeMap = pScope.typeMap = <IAFXTypeDeclMap>{};
			}

			var sTypeName: string = pType.getName();

			if(this.hasTypeInScope(sTypeName, iScope)){
				return false;
			}

			pTypeMap[sTypeName] = pType;

			return true;
		}

		addFunction(pFunction: IAFXFunctionDeclInstruction, iScope?: uint = GLOBAL_SCOPE): bool {
			if(isNull(iScope)){
				return false;
			}

			var pScope: IScope = this._pScopeMap[iScope];
			var pFunctionMap: IAFXFunctionDeclListMap = pScope.functionMap;

			if(!isDef(pFunctionMap)){
				pFunctionMap = pScope.functionMap = <IAFXFunctionDeclListMap>{};
			}

			var sFuncName: string = pFunction.getName();

			if(this.hasFunctionInScope(pFunction, iScope)){
				return false;
			}
			
			if(!isDef(pFunctionMap[sFuncName])){
				pFunctionMap[sFuncName] = [];
			}

			pFunctionMap[sFuncName].push(pFunction);

			return true;
		}

		hasVariable(sVariableName: string, iScope?: uint = this._iCurrentScope): bool {
			if(isNull(iScope)){
				return false;
			}

			var pScope: IScope = this._pScopeMap[iScope];

			while(!isNull(pScope)){
				var pVariableMap: IAFXVariableDeclMap = pScope.variableMap;

				if(!isNull(pVariableMap)){
					var pVariable: IAFXVariableDeclInstruction = pVariableMap[sVariableName];

					if(isDef(pVariable)){
						return true;
					}
				}

				pScope = pScope.parent;
			}

			return false;
		}

		hasType(sTypeName: string, iScope?: uint = this._iCurrentScope): bool {
			if(isNull(iScope)){
				return false;
			}

			var pScope: IScope = this._pScopeMap[iScope];

			while(!isNull(pScope)){
				var pTypeMap: IAFXTypeDeclMap = pScope.typeMap;

				if(!isNull(pTypeMap)){
					var pType: IAFXTypeDeclInstruction = pTypeMap[sTypeName];

					if(isDef(pType)){
						return true;
					}
				}

				pScope = pScope.parent;
			}

			return false;
		}

		hasFunction(sFuncName: string, pArgumentTypes: IAFXTypedInstruction[], iScope?: uint = GLOBAL_SCOPE): bool {
			if(isNull(iScope)){
				return false;
			}

			var pScope: IScope = this._pScopeMap[iScope];

			while(!isNull(pScope)){
				var pFunctionListMap: IAFXFunctionDeclListMap = pScope.functionMap;

				if(!isNull(pFunctionListMap)){
					var pFunctionList: IAFXFunctionDeclInstruction[] = pFunctionListMap[sFuncName];
					
					if(isDef(pFunctionList)){
						var pFunction: IAFXFunctionDeclInstruction = null;
						
						for(var i: uint = 0; i < pFunctionList.length; i++){
							var pTestedFunction: IAFXFunctionDeclInstruction  = pFunctionList[i];
							var pTestedArguments: IAFXTypedInstruction[] = pTestedFunction.getArguments();

							if(pArgumentTypes.length > pTestedArguments.length ||
							   pArgumentTypes.length < pTestedFunction.getNumNeededArguments()){
								continue;
							}

							var isParamsEqual: bool = true;

							for(var j: uint = 0; j < pArgumentTypes.length; j++){
								isParamsEqual = false;

								if(!pArgumentTypes[j].getType().isEqual(pTestedArguments[j].getType())){
									break;
								}

								isParamsEqual = true;
							}

							if(isParamsEqual){
								return true;
							}
						}	
					}

				}

				pScope = pScope.parent;
			}
			
			return false;
		}

		private inline hasVariableInScope(sVariableName: string, iScope: uint): bool {
			return isDef(this._pScopeMap[iScope].variableMap[sVariableName]);
		}

		private inline hasTypeInScope(sTypeName: string, iScope: uint): bool {
			return isDef(this._pScopeMap[iScope].typeMap[sTypeName]);
		}

		private hasFunctionInScope(pFunction: IAFXFunctionDeclInstruction, iScope: uint): bool {
			if(isNull(iScope)){
				return false;
			}

			var pScope: IScope = this._pScopeMap[iScope];
			var pFunctionListMap:IAFXFunctionDeclListMap = pScope.functionMap;
			var pFunctionList: IAFXFunctionDeclInstruction[] = pFunctionListMap[pFunction.getName()];
			
			if(!isDef(pFunctionList)){
				return false;
			}

			var pFunctionArguments: IAFXTypedInstruction[] = <IAFXTypedInstruction[]>pFunction.getArguments();
			var hasFunction: bool = false;

			for(var i: uint = 0; i < pFunctionList.length; i++){
				var pTestedArguments: IAFXTypedInstruction[] = <IAFXTypedInstruction[]>pFunctionList[i].getArguments();
			
				if(pTestedArguments.length !== pFunctionArguments.length){
					continue;
				}

				var isParamsEqual: bool = true;

				for(var j: uint = 0; j < pFunctionArguments.length; j++){
					isParamsEqual = false;

					if(!pTestedArguments[j].getType().isEqual(pFunctionArguments[j].getType())){
						break;
					}

					isParamsEqual = true;
				}

				if(isParamsEqual){
					hasFunction = true;
					break;
				}
			}

			return hasFunction;
		}

	}



	export class ExprTemplateTranslator {
		private _pInToOutArgsMap: IntMap = null;
	    private _pExprPart: IAFXSimpleInstruction[] = null;

	    constructor(sExprTemplate: string){
	    	this._pInToOutArgsMap = <IntMap>{};
	    	this._pExprPart = <IAFXSimpleInstruction[]>[];

	    	var pSplitTemplate: string[] = sExprTemplate.split(/(\$\d+)/);

	    	for(var i: uint = 0; i < pSplitTemplate.length; i++){
	    		if (pSplitTemplate[i]) {
		            if (pSplitTemplate[i][0] !== '$') {
		                this._pExprPart.push(new SimpleInstruction(pSplitTemplate[i]));
		            }
		            else {
		                this._pExprPart.push(null);
		                this._pInToOutArgsMap[this._pExprPart.length - 1] = ((<number><any>(pSplitTemplate[i].substr(1))) * 1 - 1);
		            }
	        	}
	    	}
	    }

	    toInstructionList(pArguments: IAFXInstruction[]): IAFXInstruction[] {
			var pOutputInstructionList: IAFXInstruction[] = <IAFXInstruction[]>[];

	    	for(var i: uint = 0; i < this._pExprPart.length; i++){
	    		if(isNull(this._pExprPart[i])){
	    			pOutputInstructionList.push(pArguments[this._pInToOutArgsMap[i]]);
	    		}
	    		else {
	    			pOutputInstructionList.push(this._pExprPart[i]);
	    		}
	    	}

	    	return pOutputInstructionList;
		}
	}

}

#endif