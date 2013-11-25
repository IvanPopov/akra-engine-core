module akra {
	﻿enum EScopeType {
	    k_Default,
	    k_Struct,
	    k_Annotation
	}
	
	interface IScope {
	    parent: IScope;
	    index: uint;
	    type: EScopeType;
	    isStrictMode: boolean;
	
	    variableMap: IAFXVariableDeclMap;
	    typeMap: IAFXTypeDeclMap;
	    functionMap: IAFXFunctionDeclListMap;
	}
	
	interface IScopeMap {
	    [scopeIndex: uint]: IScope;
	}
}
