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
	
	/** @deprecated Use IMap<IScope> instead. */
	export interface IScopeMap {
	    [scopeIndex: string]: IScope;
	}
}
