module akra {
	﻿export enum EScopeType {
	    k_Default,
	    k_Struct,
	    k_Annotation
	}
	
	export interface IScope {
	    parent: IScope;
	    index: uint;
	    type: EScopeType;
	    isStrictMode: boolean;
	
	    variableMap: IAFXVariableDeclMap;
	    typeMap: IAFXTypeDeclMap;
	    functionMap: IAFXFunctionDeclListMap;
	}
	
	export interface IScopeMap {
	    [scopeIndex: uint]: IScope;
	}
}
