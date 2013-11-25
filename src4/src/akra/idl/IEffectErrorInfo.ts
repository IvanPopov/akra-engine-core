module akra {
	﻿interface IEffectErrorInfo {
	    typeName?: string;
	    techName?: string;
	    exprName?: string;
	    varName?: string;
	    operator?: string;
	    leftTypeName?: string;
	    rirgtTypeName?: string;
	    fieldName?: string;
	    funcName?: string;
	    funcDef?: string;
	    semanticName?: string;
	    techniqueName?: string;
	    componentName?: string;
	
	    line?: uint;
	    column?: uint;
	}
	
	
}
