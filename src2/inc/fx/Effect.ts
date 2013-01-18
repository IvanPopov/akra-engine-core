#ifndef AFXEFFECT_TS
#define AFXEFFECT_TS

#include "IAFXEffect.ts"
#include "IParser.ts"
#include "common.ts"
#include "ILogger.ts"
#include "fx/Instruction.ts"
#include "fx/Variable.ts"
#include "fx/Type.ts"

module akra.fx {

	//Errors
	#define EFFECT_REDEFINE_SYSTEM_TYPE 2201
	#define EFFECT_REDEFINE_TYPE 2202
    #define EFFECT_UNSUPPORTED_TYPEDECL 2203
    #define EFFECT_UNSUPPORTED_EXPR 2204
    #define EFFECT_UNKNOWN_VARNAME 2205
    #define EFFECT_BAD_ARITHMETIC_OPERATION 2206
    #define EFFECT_BAD_ARITHMETIC_ASSIGNMENT_OPERATION 2207
    #define EFFECT_BAD_ASSIGNMENT_OPERATION 2208
    #define EFFECT_BAD_RELATIONAL_OPERATION 2209
    #define EFFECT_BAD_LOGICAL_OPERATION 2210
    #define EFFECT_BAD_CONDITION_TYPE 2211
    #define EFFECT_BAD_CONDITION_VALUE_TYPES 2212
    #define EFFECT_BAD_CAST_TYPE_USAGE 2213
    #define EFFECT_BAD_CAST_TYPE_NOT_BASE 2214
    #define EFFECT_BAD_CAST_UNKNOWN_TYPE 2215
    #define EFFECT_BAD_UNARY_OPERATION 2216
    #define EFFECT_BAD_POSTIX_NOT_ARRAY 2217
    #define EFFECT_BAD_POSTIX_NOT_INT_INDEX 2218
    #define EFFECT_BAD_POSTIX_NOT_FIELD 2219
    #define EFFECT_BAD_POSTIX_NOT_POINTER 2220
    #define EFFECT_BAD_POSTIX_ARITHMETIC 2221
    #define EFFECT_BAD_PRIMARY_NOT_POINT 2222
    #define EFFECT_BAD_COMPLEX_NOT_FUNCTION 2223
    #define EFFECT_BAD_COMPLEX_NOT_TYPE 2224
    #define EFFECT_BAD_COMPLEX_NOT_CONSTRUCTOR 2225
    #define EFFECT_BAD_COMPILE_NOT_FUNCTION 2226
    #define EFFECT_BAD_REDEFINE_FUNCTION 2227
    #define EFFECT_BAD_WHILE_CONDITION 2228
    #define EFFECT_BAD_DO_WHILE_CONDITION 2229	
    #define EFFECT_BAD_IF_CONDITION 2230


    akra.logger.registerCode(EFFECT_REDEFINE_SYSTEM_TYPE, 
    						 "You trying to redefine system type: {typeName}. In line: {line}. In column: {column}");
    akra.logger.registerCode(EFFECT_REDEFINE_TYPE, 
    	 					 "You trying to redefine type: {typeName}. In line: {line}. In column: {column}");
    akra.logger.registerCode(EFFECT_UNSUPPORTED_TYPEDECL, 
    						 "You try to use unssuported type declaration. We implement it soon. In line: {line}.");
    akra.logger.registerCode(EFFECT_UNSUPPORTED_EXPR, 
    						 "You try to use unssuported expr: {exprName}. We implement it soon. In line: {line}.");
    akra.logger.registerCode(EFFECT_UNKNOWN_VARNAME, 
    						 "Unknown variable name: {varName}. In line: {line}. In column: {column}");
    akra.logger.registerCode(EFFECT_BAD_ARITHMETIC_OPERATION, 
    						 "Invalid arithmetic operation!. There no operator '{operator}'\
    						  for left-type '{leftTypeName}' \
    						 and right-type '{rightTypeName}'. In line: {line}.");
    akra.logger.registerCode(EFFECT_BAD_ARITHMETIC_ASSIGNMENT_OPERATION, 
    						 "Invalid arithmetic-assignment operation!. \
    						 There no operator {operator} for left-type '{leftTypeName}' \
    						 and right-type '{rightTypeName}'. In line: {line}.");
    akra.logger.registerCode(EFFECT_BAD_ASSIGNMENT_OPERATION, 
    						 "Invalid assignment operation!. It`s no possible to do assignment \
    						 between left-type '{leftTypeName}' \
    						 and right-type '{rightTypeName}'. In line: {line}.");
    akra.logger.registerCode(EFFECT_BAD_RELATIONAL_OPERATION, 
    						 "Invalid relational operation!. There no operator {operator} \
    						 for left-type '{leftTypeName}' \
    						 and right-type '{rightTypeName}'. In line: {line}.");
    akra.logger.registerCode(EFFECT_BAD_LOGICAL_OPERATION, 
    						 "Invalid logical operation!. In operator: {operator}. \
    						 Cannot convert type '{typeName}' to 'bool'. In line: {line}.");
    akra.logger.registerCode(EFFECT_BAD_CONDITION_TYPE, 
    						 "Invalid conditional expression!. Cannot convert type '{typeName}' to 'bool'. \
    						 In line: {line}.");
    akra.logger.registerCode(EFFECT_BAD_CONDITION_VALUE_TYPES, 
    						 "Invalid conditional expression!. Type '{leftTypeName}' and type '{rightTypeName}'\
    						  are not equal. In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_CAST_TYPE_USAGE, 
    						 "Invalid type cast!. Bad type casting. Only base types without usages are supported. \
    						 WebGL don`t support so casting. In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_CAST_TYPE_NOT_BASE, 
    						 "Invalid type cast!. Bad type for casting '{typeName}'. \
    						 WebGL support only base-type casting. In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_UNARY_OPERATION, 
    						 "Invalid unary expression!. Bad type: '{typeName}' \
    						 for operator '{opeator}'. In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_POSTIX_NOT_ARRAY, 
    						 "Invalid postfix-array expression!. \
    						 Type of expression is not array: '{typeName}'. In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_POSTIX_NOT_INT_INDEX, 
    						 "Invalid postfix-array expression!. Bad type of index: '{typeName}'. \
    						 Must be 'int'. In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_POSTIX_NOT_FIELD, 
    						 "Invalid postfix-point expression!. Type '{typeName}' has no field '{fieldName}'. \
    						 In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_POSTIX_NOT_POINTER, 
    						 "Invalid postfix-point expression!. Type '{typeName}' is not pointer. \
    						 In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_POSTIX_ARITHMETIC, 
    						 "Invalid postfix-arithmetic expression!. Bad type '{typeName}' \
    						 for operator {operator}. In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_PRIMARY_NOT_POINT, 
    						 "Invalid primary expression!. Bad type '{typeName}'.\
    						 It`s not pointer. In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_COMPLEX_NOT_FUNCTION, 
    						 "Invalid function call expression!. Could not find function-signature \
    						 with name {funcName} and so types. In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_COMPLEX_NOT_TYPE, 
    						 "Invalid constructor call!. There are not so type. In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_COMPLEX_NOT_CONSTRUCTOR, 
    						 "Invalid constructor call!. Could not find constructor-signature \
    						 with name {typeName} and so types. In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_COMPILE_NOT_FUNCTION, 
    						 "Invalid compile expression!. Could not find function-signature \
    						 with name {funcName} and so types. In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_REDEFINE_FUNCTION, 
    						 "You try to redefine function. With name {funcName}. In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_WHILE_CONDITION, 
							 "Bad type of while-condition. Must be 'bool' but it is '{typeName}'. \
							 In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_DO_WHILE_CONDITION, 
							 "Bad type of do-while-condition. Must be 'bool' but it is '{typeName}'. \
							 In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_IF_CONDITION, 
							 "Bad type of if-condition. Must be 'bool' but it is '{typeName}'. \
							 In line: {line}.");


    function sourceLocationToString(pLocation: ISourceLocation): string {
        var sLocation:string = "[" + pLocation.file + ":" + pLocation.line.toString() + "]: ";
        return sLocation;
    }

    function syntaxErrorLogRoutine(pLogEntity: ILoggerEntity): void{
        var sPosition:string = sourceLocationToString(pLogEntity.location);
        var sError: string = "Code: " + pLogEntity.code.toString() + ". ";
        var pParseMessage: string[] = pLogEntity.message.split(/\{(\w+)\}/);
        var pInfo:any = pLogEntity.info;

        for(var i = 0; i < pParseMessage.length; i++){
            if(isDef(pInfo[pParseMessage[i]])){
                pParseMessage[i] = <string><any>pInfo[pParseMessage[i]];
            }
        }

        var sMessage = sPosition + sError + pParseMessage.join("");
        
        console["error"].call(console, sMessage);
    }

    akra.logger.setCodeFamilyRoutine("EffectSyntaxErrors", syntaxErrorLogRoutine, ELogLevel.ERROR);

    export interface IEffectErrorInfo{
    	
    	typeName?: string;
   		exprName?: string;
   		varName?: string;
   		operator?: string;
   		leftTypeName?: string;
   		rirgtTypeName?: string;
   		fieldName?: string;
   		funcName?: string;
    	
    	line?: uint;
    	column?: uint;
    }

	//End Errors





	#define GLOBAL_SCOPE 0



	export interface IAFXVariableMap { 
		[variableName: string] : IAFXVariable;
	}
	
	export interface IAFXTypeMap {
		[typeName: string] : IAFXType;
	}

	export interface IAFXFunctionMap {
		[functionHash: string] : IAFXFunction;
	}

	export interface IScope {
		parent : IScope;
		index: uint;

		variableMap : IAFXVariableMap;
		typeMap : IAFXTypeMap;
		functionMap : IAFXFunctionMap;
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

		newScope(): void {
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
										variableMap: null,
										typeMap: null,
										functionMap: null
									};	

			this._pScopeMap[this._iCurrentScope] = pNewScope;
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

		getVariable(sVariableName: string, iScope?: uint = this._iCurrentScope): IAFXVariable {
			if(isNull(iScope)){
				return null;
			}

			var pScope: IScope = this._pScopeMap[iScope];

			while(!isNull(pScope)){
				var pVariableMap: IAFXVariableMap = pScope.variableMap;

				if(!isNull(pVariableMap)){
					var pVariable: IAFXVariable = pVariableMap[sVariableName];

					if(isDef(pVariable)){
						return pVariable;
					}
				}

				pScope = pScope.parent;
			}

			return null;
		}

		getType(sTypeName: string, iScope?: uint = this._iCurrentScope): IAFXType {
			if(isNull(iScope)){
				return null;
			}

			var pScope: IScope = this._pScopeMap[iScope];

			while(!isNull(pScope)){
				var pTypeMap: IAFXTypeMap = pScope.typeMap;

				if(!isNull(pTypeMap)){
					var pType: IAFXType = pTypeMap[sTypeName];

					if(isDef(pType)){
						return pType;
					}
				}

				pScope = pScope.parent;
			}

			return null;
		}

		getFunction(sFuncHash: string, iScope?: uint = GLOBAL_SCOPE): IAFXFunction {
			if(isNull(iScope)){
				return null;
			}

			var pScope: IScope = this._pScopeMap[iScope];

			while(!isNull(pScope)){
				var pFunctionMap: IAFXFunctionMap = pScope.functionMap;

				if(!isNull(pFunctionMap)){
					var pFunction: IAFXFunction = pFunctionMap[sFuncHash];

					if(isDef(pFunction)){
						return pFunction;
					}
				}

				pScope = pScope.parent;
			}

			return null;
		}

		addVariable(pVariable: IAFXVariable, iScope?: uint = this._iCurrentScope): bool {
			if(isNull(iScope)){
				return false;
			}

			var pScope: IScope = this._pScopeMap[iScope];
			var pVariableMap: IAFXVariableMap = pScope.variableMap;

			if(!isDef(pVariableMap)){
				pVariableMap = pScope.variableMap = <IAFXVariableMap>{};
			}

			var sVariableName: string = pVariable.getName();

			if(this.hasVariableInScope(sVariableName, iScope)){
				return false;
			}

			pVariableMap[sVariableName] = pVariable;

			return true;
		}

		addType(pType: IAFXType, iScope?: uint = this._iCurrentScope): bool {
			if(isNull(iScope)){
				return false;
			}

			var pScope: IScope = this._pScopeMap[iScope];
			var pTypeMap: IAFXTypeMap = pScope.typeMap;

			if(!isDef(pTypeMap)){
				pTypeMap = pScope.typeMap = <IAFXTypeMap>{};
			}

			var sTypeName: string = pType.getName();

			if(this.hasTypeInScope(sTypeName, iScope)){
				return false;
			}

			pTypeMap[sTypeName] = pType;

			return true;
		}

		addFunction(pFunction: IAFXFunction, iScope?: uint = GLOBAL_SCOPE): bool {
			if(isNull(iScope)){
				return false;
			}

			var pScope: IScope = this._pScopeMap[iScope];
			var pFunctionMap: IAFXFunctionMap = pScope.functionMap;

			if(!isDef(pFunctionMap)){
				pFunctionMap = pScope.functionMap = <IAFXFunctionMap>{};
			}

			var sFuncHash: string = pFunction.getHash();

			if(this.hasFunctionInScope(sFuncHash, iScope)){
				return false;
			}

			pFunctionMap[sFuncHash] = pFunction;

			return true;
		}

		hasVariable(sVariableName: string, iScope?: uint = this._iCurrentScope): bool {
			if(isNull(iScope)){
				return false;
			}

			var pScope: IScope = this._pScopeMap[iScope];

			while(!isNull(pScope)){
				var pVariableMap: IAFXVariableMap = pScope.variableMap;

				if(!isNull(pVariableMap)){
					var pVariable: IAFXVariable = pVariableMap[sVariableName];

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
				var pTypeMap: IAFXTypeMap = pScope.typeMap;

				if(!isNull(pTypeMap)){
					var pType: IAFXType = pTypeMap[sTypeName];

					if(isDef(pType)){
						return true;
					}
				}

				pScope = pScope.parent;
			}

			return false;
		}

		hasFunction(sFuncHash: string, iScope?: uint = GLOBAL_SCOPE): bool {
			if(isNull(iScope)){
				return false;
			}

			var pScope: IScope = this._pScopeMap[iScope];

			while(!isNull(pScope)){
				var pFunctionMap: IAFXFunctionMap = pScope.functionMap;

				if(!isNull(pFunctionMap)){
					var pFunction: IAFXFunction = pFunctionMap[sFuncHash];

					if(isDef(pFunction)){
						return true;
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

		private inline hasFunctionInScope(sFuncHash: string, iScope: uint): bool {
			return isDef(this._pScopeMap[iScope].functionMap[sFuncHash]);
		}

	}

	export class Effect implements IAFXEffect {

		private _pParseTree: IParseTree;
		private _pAnalyzedNode: IParseNode;

		private _pEffectScope: ProgramScope;
		private _pCurrentInstruction: IAFXInstruction;

		private _pStatistics: IAFXEffectStats;

		private _sAnalyzedFileName: string;

		static private _pGrammarSymbols = akra.util.parser.getGrammarSymbols();

		constructor() {
			this._pParseTree = null;
			this._pAnalyzedNode = null;

			this._pEffectScope = new ProgramScope();
			this._pCurrentInstruction = null;

			this._pStatistics = null;
			this._sAnalyzedFileName = "";
		}

		analyze(pTree: IParseTree): bool {
			var pRootNode: IParseNode = pTree.root;
			var iParseTime: uint = akra.now();

			this._pParseTree = pTree;
			this._pStatistics = <IAFXEffectStats>{time: 0};

			this.newScope();

			// this.analyzeTypes();
			
			// this.preAnalyzeFunctions();
			// this.preAnalyzeVariables();
			// this.preAnalyzeTechniques();
			this.analyzeDecls();

			// this.analyzeEffect();
			// this.postAnalyzeEffect();
			// this.checkEffect();

			this.endScope();


			
			
			//Stats
			iParseTime = akra.now() - iParseTime;
			this._pStatistics.time = iParseTime;
			
			return true;
		}

		getStats(): IAFXEffectStats {
			return this._pStatistics;
		}

		setAnalyzedFileName(sFileName: string): void {
			this._sAnalyzedFileName = sFileName;
		}

		clear(): void {
		}

		private inline getVariable(sName: string): IAFXVariable {
			return this._pEffectScope.getVariable(sName);
		}

		private addSystemFunction(): void {

		}

		private addSystemVariable(): void {

		}

		private addSystemType(): void {

		}

		private isSystemFunction(pFunction: IAFXFunction): bool {
			return false;
		}

		private isSystemVariable(pVariable: IAFXVariable): bool {
			return false;
		}

		private isSystemType(pType: IAFXType): bool {
			return false;
		}

		private _error(eCode: uint, pInfo: IEffectErrorInfo = {}): void {
			var sFileName: string = this._sAnalyzedFileName;

			var pLocation: ISourceLocation = <ISourceLocation>{file: this._sAnalyzedFileName, line: 0};
			var pLineColumn: {line: uint; column: uint;} = this.getNodeSourceLocation(this.getAnalyzedNode());

			switch(eCode){
				case EFFECT_REDEFINE_TYPE:
				case EFFECT_REDEFINE_SYSTEM_TYPE:
				case EFFECT_UNSUPPORTED_TYPEDECL:

					pInfo.line = pLineColumn.line;
					pInfo.column = pLineColumn.column;

					pLocation.line = pLocation.line;

					break;
			}

			var pLogEntity: ILoggerEntity = <ILoggerEntity>{code: eCode, info: pInfo, location: pLocation};

			akra.logger["error"](pLogEntity);
			throw new Error(eCode.toString());
		}

		private inline setAnalyzedNode(pNode: IParseNode): void {
			this._pAnalyzedNode = pNode;
		}

		private inline getAnalyzedNode(): IParseNode {
			return this._pAnalyzedNode;
		} 

		private inline newScope(): void {
			this._pEffectScope.newScope();
		}

		private inline endScope(): void {
			this._pEffectScope.endScope();
		}

		// private inline newInstruction(pInstruction: IAFXInstruction): void {
		// 	pInstruction.setParent(this._pCurrentInstruction);
		// 	this._pCurrentInstruction = pInstruction;
		// }

		// private inline endInstruction(): void {
		// 	this._pCurrentInstruction = this._pCurrentInstruction.getParent();
		// }

		// private inline pushCommand(pInstruction: IAFXInstruction, isSetParent?: bool = false): void {
		// 	if(!isNull(this._pCurrentInstruction)){
		// 		this._pCurrentInstruction.push(pInstruction, isSetParent);
		// 	}
		// }

		// private inline pushAndSet(pInstruction: IAFXInstruction): void {
		// 	if(!isNull(this._pCurrentInstruction)){
		// 		this._pCurrentInstruction.push(pInstruction, true);
		// 	}
		// 	this.newInstruction(pInstruction);
		// }

		private inline setOperator(sOperator: string): void {
			if(!isNull(this._pCurrentInstruction)){
				this._pCurrentInstruction.setOperator(sOperator);
			}	
		}

		private findFunction(sFunctionName: string, 
							 pArguments: IAFXExprInstruction[]): IAFXIdExprInstruction {
			return null;
		}

		private findConstructor(pTypeName: IAFXIdInstruction, 
							    pArguments: IAFXExprInstruction[]): IAFXVariableTypeInstruction {
			return null;
		}

		private findShaderFunction(sFunctionName: string, 
							 	   pArguments: IAFXExprInstruction[]): IAFXIdExprInstruction {
			return null;
		}

		private findFunctionByDef(pDef: FunctionDefInstruction): IAFXFunctionDeclInstruction {
			return null;
		}

		private addVariable(pVariable: IAFXVariable): void {
		}

		private addVariableDecl(pVariable: IAFXVariable): void {

        }


		private addType(pType: IAFXType): void {
			if(this.isSystemType(pType)){
				this._error(EFFECT_REDEFINE_SYSTEM_TYPE, {typeName: pType.getName()});
			}

			var isTypeAdded: bool = this._pEffectScope.addType(pType);

			if(!isTypeAdded){
				this._error(EFFECT_REDEFINE_TYPE, {typeName: pType.getName()});
			}
		}

		private addTypeDecl(pType: IAFXType): void {
			//check
			this.addType(pType);
		}

		private identifyType(pNode: IParseNode): IAFXType {
			return null;
		}

		private identifyUsage(pNode: IParseNode): IAFXKeywordInstruction;
		private identifyUsage(sUsage: string): IAFXKeywordInstruction;
		private identifyUsage(): IAFXKeywordInstruction {
			return null;
		}

		private analyzeDecls(): void {
			var pChildren: IParseNode[] = this._pParseTree.root.children;
			var i: uint;	

			for(i = pChildren.length - 1; i >=0; i--){
				this.analyzeDecl(pChildren[i]);
			}
		}

		private analyzeDecl(pNode: IParseNode): void {
			switch (pNode.name) {
		        case "VariableDecl":
		            this.analyzeVariableDecl(pNode, null);
		            break;
		        case "TypeDecl":
		            this.analyzeTypeDecl(pNode);
		            break;
		        case "FunctionDecl":
		            this.analyzeFunctionDecl(pNode);
		            break;
		    //     case "VarStructDecl":
		    //         this.analyzeVarStructDecl(pNode);
		    //         break;
		    //     case "TechniqueDecl":
		    //         this.analyzeTechniqueDecl(pNode);
		    //         break;
		    //     case "UseDecl":
		    //         this.analyzeUseDecl(pNode);
		    //         break;
		    //     case "ProvideDecl":
		    //         this.analyzeProvideDecl(pNode);
		    //         break;
		    //     case "ImportDecl":
		    //         this.analyzeImportDecl(pNode);
		    //         break;
		    }	
		}

		private analyzeVariableDecl(pNode: IParseNode, pInstruction?: IAFXInstruction = null): void {
			this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var pUsageType: IAFXUsageTypeInstruction;
        	var pVariable: IAFXVariableDeclInstruction;
        	var i: uint = 0;
        	
        	pUsageType = this.analyzeUsageType(pChildren[pChildren.length - 1]);

        	for(i = pChildren.length - 2; i >= 1; i--){
        		if(pChildren[i].name === "Variable") {
        			pVariable = this.analyzeVariable(pChildren[i], pUsageType);

        			if(!isNull(pInstruction)){
        				pInstruction.push(pVariable, true);
        			}
        		}
        	}
        }

      	private analyzeUsageType(pNode: IParseNode): IAFXUsageTypeInstruction {
        	var pChildren: IParseNode[] = pNode.children;
		    var i: uint = 0;
		    var pType: IAFXUsageTypeInstruction = new UsageTypeInstruction();

		    for (i = pChildren.length - 1; i >= 0; i--) {
		        if (pChildren[i].name === "Type") {
		        	var pTypeName: IAFXIdInstruction = this.analyzeType(pChildren[i]);
		        	pType.push(pTypeName, true);
		        }
		        else if (pChildren[i].name === "Usage") {
		        	var pUsage: IAFXKeywordInstruction = this.analyzeUsage(pChildren[i]);
		        	pType.push(pUsage, true);
		        }
		    }

		    return pType;
        }

        private analyzeType(pNode: IParseNode): IAFXIdInstruction {
        	return null;
        }

        private analyzeUsage(pNode: IParseNode): IAFXKeywordInstruction {
        	pNode = pNode.children[0];
        	return null;
        }

        private analyzeVariable(pNode: IParseNode, pUsageType: IAFXUsageTypeInstruction): IAFXVariableDeclInstruction {
        	var pChildren: IParseNode[] = pNode.children;

        	var pVarDecl: IAFXVariableDeclInstruction = new VariableDeclInstruction();
        	var pVariableType: IAFXVariableTypeInstruction = new VariableTypeInstruction();
        	var pAnnotation: IAFXAnnotationInstruction;
        	var sSemantic: string;
        	var pInitExpr: IAFXExprInstruction;
			
        	pVarDecl.push(pVariableType);       	
        	pVariableType.push(pUsageType);

        	this.analyzeVariableDim(pChildren[pChildren.length - 1], pVarDecl);
        	
        	var i: uint = 0;
        	for(i = pChildren.length - 2; i >= 0; i--){
        		if(pChildren[i].name === "Annotation"){
        			pAnnotation = this.analyzeAnnotation(pChildren[i]);
        			pVarDecl.setAnnotation(pAnnotation);
        		}
        		else if(pChildren[i].name === "Semantic"){
        			sSemantic = this.analyzeSemantic(pChildren[i]);
        			pVarDecl.setSemantic(sSemantic);
        		}
        		else if(pChildren[i].name === "Initializer"){
        			pInitExpr = this.analyzeInitializer(pChildren[i]);
        			pVarDecl.push(pInitExpr, true);
        		}
        	}

        	//TODO: Here must be additing to scope

        	// this.addVariableDecl(pVarDecl);
        	// var pVariable: IAFXVariable = new Variable();
        	// pVariable.initializeFromInstruction(pVarDecl);
        	// this.addVariableDecl(pVariable);

        	return pVarDecl;
        }

        private analyzeVariableDim(pNode: IParseNode, pVariableDecl: IAFXVariableDeclInstruction): void {
			var pChildren: IParseNode[] = pNode.children;
			var pVariableType: IAFXVariableTypeInstruction = pVariableDecl.getType();

			if(pChildren.length === 1) {
				var pName: IAFXIdInstruction = new IdInstruction();
				pName.setName(pChildren[0].value);
				pVariableDecl.push(pName, true);
				return;
			}
			  
			if(pChildren.length === 3) {
				pVariableType.addPointIndex();
			}
			else if(pChildren.length === 4 && pChildren[0].name === "FromExpr"){
				var pBuffer: IAFXIdInstruction = this.analyzeFromExpr(pChildren[0]);
				pVariableType.setVideoBuffer(pBuffer);
			}
			else {
				var pIndexExpr: IAFXExprInstruction = this.analyzeExpr(pChildren[pChildren.length - 3]);
				pVariableType.addArrayIndex(pIndexExpr);	
			}

			this.analyzeVariableDim(pChildren[pChildren.length - 1], pVariableDecl);
        }

        private analyzeAnnotation(pNode:IParseNode): IAFXAnnotationInstruction {
        	return null;
        }

        private analyzeSemantic(pNode:IParseNode): string {
        	var sSemantic: string = pNode.children[0].value;
			// var pDecl: IAFXDeclInstruction = <IAFXDeclInstruction>this._pCurrentInstruction;
			// pDecl.setSemantic(sSemantic);	
			return sSemantic;
        }

        private analyzeInitializer(pNode:IParseNode): IAFXExprInstruction {     
        	return null;   	
        }

        private analyzeFromExpr(pNode: IParseNode): IAFXIdInstruction {
       		return null;	
        }

        private analyzeExpr(pNode: IParseNode): IAFXExprInstruction {
        	this.setAnalyzedNode(pNode);
        	var sName: string = pNode.name;
        	
        	switch(sName){
        		case "ObjectExpr":
        			return this.analyzeObjectExpr(pNode);
        		case "ComplexExpr":
        			return this.analyzeComplexExpr(pNode);
        		case "PrimaryExpr":
        			return this.analyzePrimaryExpr(pNode);
        		case "PostfixExpr":
        			return this.analyzePostfixExpr(pNode);
        		case "UnaryExpr":
        			return this.analyzeUnaryExpr(pNode);
        		case "CastExpr":
        			return this.analyzeCastExpr(pNode);
        		case "ConditionalExpr":
        			return this.analyzeConditionalExpr(pNode);
        		case "MulExpr":
		        case "AddExpr":
		        	return this.analyzeArithmeticExpr(pNode);
		        case "RelationalExpr":
		        case "EqualityExpr":
		        	return this.analyzeRelationExpr(pNode);
		        case "AndExpr":
		        case "OrExpr":
		        	return this.analyzeLogicalExpr(pNode);
		        case "AssignmentExpr":
		        	return this.analyzeAssignmentExpr(pNode);
		        case "T_NON_TYPE_ID":
		        	return this.analyzeIdExpr(pNode);
		        case "T_STRING":
		        case "T_UINT":
		        case "T_FLOAT":
		        case "T_KW_TRUE":
		        case "T_KW_FALSE":
		        	return this.analyzeSimpleExpr(pNode);
		       	case "MemExpr":
		       		return this.analyzeMemExpr(pNode);
		       	default:
		       		this._error(EFFECT_UNSUPPORTED_EXPR, { exprName: sName });
		       		break;
        	}

       		return null;	
        }

        private analyzeObjectExpr(pNode: IParseNode): IAFXExprInstruction {
        	this.setAnalyzedNode(pNode);

        	var sName: string = pNode.children[pNode.children.length - 1].value;
        	
        	switch(sName){
        		case "T_KW_COMPILE":
        			return this.analyzeCompileExpr(pNode);
        		case "T_KW_SAMPLER_STATE":
        			return this.analyzeSamplerStateBlock(pNode);
        	}
        }

        private analyzeCompileExpr(pNode: IParseNode): IAFXExprInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var pExpr: CompileExprInstruction = new CompileExprInstruction();
        	var pExprType: IAFXVariableTypeInstruction;
        	var pArguments: IAFXExprInstruction[] = null;
        	var sShaderFuncName: string = pChildren[pChildren.length - 2].value;
        	var pShaderFunc: IAFXIdExprInstruction;
        	var i: uint = 0;

        	if(pChildren.length > 3){
        		var pArgumentExpr: IAFXExprInstruction;

        		pArguments = [];

        		for(i = pChildren.length - 3; i > 0; i--) {
        			if(pChildren[i].value !== ","){
        				pArgumentExpr = this.analyzeExpr(pChildren[i]);
        				pArguments.push(pArgumentExpr);
        			}
        		}	
        	}

        	pShaderFunc = this.findShaderFunction(sShaderFuncName, pArguments);

        	if(isNull(pShaderFunc)){
        		this._error(EFFECT_BAD_COMPILE_NOT_FUNCTION, { funcName: sShaderFuncName });
        		return null;
        	}

        	pExprType = pShaderFunc.getType();

        	pExpr.setType(pExprType);
        	pExpr.setOperator("complile");
        	pExpr.push(pShaderFunc, true);
        	
        	if(!isNull(pArguments)){
        		for(i = 0; i < pArguments.length; i++) {
        			pExpr.push(pArguments[i], true);
        		}
        	}

        	return pExpr;
        }

        private analyzeSamplerStateBlock(pNode: IParseNode): IAFXExprInstruction {
        	pNode = pNode.children[0];
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var pExpr: SamplerStateBlockInstruction = new SamplerStateBlockInstruction();
        	var pSamplerState: SamplerStateInstruction;
        	var i: uint = 0;

        	pExpr.setOperator("sample_state");

        	for(i = pChildren.length - 2; i >= 1; i--){
        		pSamplerState = this.analyzeSamplerState(pChildren[i]);
        		pExpr.push(pSamplerState);
        	}

        	return pExpr;	
        }

        private analyzeSamplerState(pNode: IParseNode): SamplerStateInstruction {
        	return null;
        }

        private analyzeComplexExpr(pNode: IParseNode): IAFXExprInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var sFirstNodeName: string = pChildren[pChildren.length - 1].name;

        	switch(sFirstNodeName){
        		case "T_NON_TYPE_ID":
        			return this.analyzeFunctionCallExpr(pNode);
        		case "BaseType":
        		case "T_TYPE_ID":
        			return this.analyzeConstructorCallExpr(pNode);
        		default:
        			return this.analyzeSimpleComplexExpr(pNode);
        	}
        }

        private analyzeFunctionCallExpr(pNode: IParseNode): IAFXExprInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var pExpr: FunctionCallInstruction = new FunctionCallInstruction();
        	var pExprType: IAFXVariableTypeInstruction;
        	var pArguments: IAFXExprInstruction[] = null;
        	var sFuncName: string = pChildren[pChildren.length - 1].value;
        	var pFunction: IAFXIdExprInstruction;
        	var i: uint = 0;

        	if(pChildren.length > 3){        		
        		var pArgumentExpr: IAFXExprInstruction;

        		pArguments = [];

        		for(i = pChildren.length - 3; i > 0; i--) {
        			if(pChildren[i].value !== ","){
        				pArgumentExpr = this.analyzeExpr(pChildren[i]);
        				pArguments.push(pArgumentExpr);
        			}
        		}
        	}

        	pFunction = this.findFunction(sFuncName, pArguments);

        	if(isNull(pFunction)){
        		this._error(EFFECT_BAD_COMPLEX_NOT_FUNCTION, { funcName: sFuncName });
        		return null;
        	}

        	pExprType = pFunction.getType();

        	pExpr.setType(pExprType);
        	pExpr.push(pFunction, true);
        	
        	if(!isNull(pArguments)){
        		for(i = 0; i < pArguments.length; i++) {
        			pExpr.push(pArguments[i], true);
        		}
        	}

        	return pExpr;
        }
        
        private analyzeConstructorCallExpr(pNode: IParseNode): IAFXExprInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var pExpr: ConstructorCallInstruction = new ConstructorCallInstruction();
        	var pExprType: IAFXVariableTypeInstruction;
        	var pArguments: IAFXExprInstruction[] = null;
        	var pTypeName: IAFXIdInstruction;
        	var i: uint = 0;

        	pTypeName = this.analyzeType(pChildren[pChildren.length - 1]);

        	if(isNull(pTypeName)){
        		this._error(EFFECT_BAD_COMPLEX_NOT_TYPE);
        		return null;
        	}

        	if(pChildren.length > 3){        		
        		var pArgumentExpr: IAFXExprInstruction;

        		pArguments = [];

        		for(i = pChildren.length - 3; i > 0; i--) {
        			if(pChildren[i].value !== ","){
        				pArgumentExpr = this.analyzeExpr(pChildren[i]);
        				pArguments.push(pArgumentExpr);
        			}
        		}
        	}

        	pExprType = this.findConstructor(pTypeName, pArguments);

        	if(isNull(pExprType)){
        		this._error(EFFECT_BAD_COMPLEX_NOT_CONSTRUCTOR, { typeName: pTypeName.toString() });
        		return null;
        	}

        	pExpr.setType(pExprType);
        	pExpr.push(pTypeName);
        	
        	if(!isNull(pArguments)){
        		for(i = 0; i < pArguments.length; i++) {
        			pExpr.push(pArguments[i], true);
        		}
        	}

        	return pExpr;
        }

        private analyzeSimpleComplexExpr(pNode: IParseNode): IAFXExprInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var pExpr: ComplexExprInstruction = new ComplexExprInstruction();
        	var pComplexExpr: IAFXExprInstruction;
        	var pExprType: IAFXVariableTypeInstruction;

        	pComplexExpr = this.analyzeExpr(pChildren[1]);
        	pExprType = pComplexExpr.getType();

        	pExpr.setType(pExprType);
        	pExpr.push(pComplexExpr, true);

        	return pExpr;
        }

        private analyzePrimaryExpr(pNode: IParseNode): IAFXExprInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var pExpr: PrimaryExprInstruction = new PrimaryExprInstruction();
        	var pPrimaryExpr: IAFXExprInstruction;
        	var pExprType: IAFXVariableTypeInstruction;
        	var pPrimaryExprType: IAFXVariableTypeInstruction;

        	pPrimaryExpr = this.analyzeExpr(pChildren[0]);
        	pPrimaryExprType = pPrimaryExpr.getType();

        	pExprType = pPrimaryExprType.getPointerType();
        	
        	if(isNull(pExprType)){
        		this._error(EFFECT_BAD_PRIMARY_NOT_POINT, { typeName: pPrimaryExprType.toString() });
        		return null;
        	}

        	pExpr.setType(pExprType);
        	pExpr.setOperator("@");
        	pExpr.push(pPrimaryExpr, true);

        	return pExpr;
        }
        
        private analyzePostfixExpr(pNode: IParseNode): IAFXExprInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var sSymbol: string = pChildren[pChildren.length - 2].value;
        	
        	switch(sSymbol){
        		case "[":
        			return this.analyzePostfixIndex(pNode);
        		case ".":
        			return this.analyzePostfixPoint(pNode);
        		case "++":
        		case "--":
        			return this.analyzePostfixArithmetic(pNode);
        	}
        }

        private analyzePostfixIndex(pNode: IParseNode): IAFXExprInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var pExpr: PostfixIndexInstruction = new PostfixIndexInstruction();
        	var pPostfixExpr: IAFXExprInstruction;
        	var pIndexExpr:IAFXExprInstruction;
        	var pExprType: IAFXVariableTypeInstruction;
        	var pPostfixExprType: IAFXVariableTypeInstruction;
        	var pIndexExprType: IAFXVariableTypeInstruction;
        	var pIntType: IAFXVariableTypeInstruction;

        	pPostfixExpr = this.analyzeExpr(pChildren[pChildren.length - 1]);
        	pPostfixExprType = pPostfixExpr.getType();

        	if(!pPostfixExprType.isArray()){
        		this._error(EFFECT_BAD_POSTIX_NOT_ARRAY, { typeName: pPostfixExprType.toString() });
        		return null;
        	}

        	pIndexExpr = this.analyzeExpr(pChildren[pChildren.length - 3]);
        	pIndexExprType = pIndexExpr.getType();

        	pIntType = this.getSystemType("int");

        	if(!pIndexExprType.isEqual(pIntType)){
        		this._error(EFFECT_BAD_POSTIX_NOT_INT_INDEX, { typeName: pIndexExprType.toString() });
        		return null;
        	}

        	pExprType = pPostfixExprType.getTypeByIndex();

        	pExpr.setType(pExprType);
        	pExpr.push(pPostfixExpr, true);
        	pExpr.push(pIndexExpr, true);

        	return pExpr;
        }

        private analyzePostfixPoint(pNode: IParseNode): IAFXExprInstruction {
        	this.setAnalyzedNode(pNode);
        	
        	var pChildren: IParseNode[] = pNode.children;
        	var pExpr: PostfixPointInstruction = new PostfixPointInstruction();
        	var pPostfixExpr: IAFXExprInstruction;
        	var sFieldName: string;
        	var pFieldNameExpr: IAFXIdExprInstruction;
        	var pExprType: IAFXVariableTypeInstruction;
        	var pPostfixExprType: IAFXVariableTypeInstruction;

        	pPostfixExpr = this.analyzeExpr(pChildren[pChildren.length - 1]);
        	pPostfixExprType = pPostfixExpr.getType();

        	sFieldName = pChildren[pChildren.length - 3].value;

        	pFieldNameExpr = pPostfixExprType.getField(sFieldName, true);

        	if(isNull(pFieldNameExpr)){
        		this._error(EFFECT_BAD_POSTIX_NOT_FIELD, { typeName: pPostfixExprType.toString(),
        												   fieldName: sFieldName });
        		return null;
        	}

        	pExprType = pFieldNameExpr.getType();

        	if(pChildren.length === 4){
        		if(!pExprType.isPointer()){
        			this._error(EFFECT_BAD_POSTIX_NOT_POINTER, { typeName: pExprType.toString() });
        			return null;
        		}

        		var pBuffer: IAFXIdInstruction = this.analyzeFromExpr(pChildren[0]);
        		pExprType.setVideoBuffer(pBuffer);
        	}

        	pExpr.setType(pExprType);
        	pExpr.push(pPostfixExpr, true);
        	pExpr.push(pFieldNameExpr, true);

        	return pExpr;
        }

        private analyzePostfixArithmetic(pNode: IParseNode): IAFXExprInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var sOperator: string = pChildren[0].value;
        	var pExpr: PostfixArithmeticInstruction = new PostfixArithmeticInstruction();
        	var pPostfixExpr: IAFXExprInstruction;
        	var pExprType: IAFXVariableTypeInstruction;
        	var pPostfixExprType: IAFXVariableTypeInstruction;

        	pPostfixExpr = this.analyzeExpr(pChildren[1]);
        	pPostfixExprType = pPostfixExpr.getType();

        	pExprType = this.checkOneOperandExprType(sOperator, pPostfixExprType);

        	if(isNull(pExprType)){
        		this._error(EFFECT_BAD_POSTIX_ARITHMETIC, { operator: sOperator,
        													typeName: pPostfixExprType.toString()});
        		return null;
        	}

        	pExpr.setType(pExprType);
        	pExpr.setOperator(sOperator);
        	pExpr.push(pPostfixExpr, true);

        	return null;
        }
        
        private analyzeUnaryExpr(pNode: IParseNode): IAFXExprInstruction{
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var sOperator: string = pChildren[1].value;
        	var pExpr: UnaryExprInstruction = new UnaryExprInstruction();
        	var pUnaryExpr: IAFXExprInstruction;
        	var pExprType: IAFXVariableTypeInstruction;
        	var pUnaryExprType: IAFXVariableTypeInstruction;

        	pUnaryExpr = this.analyzeExpr(pChildren[0]);
        	pUnaryExprType = pUnaryExpr.getType();

        	pExprType = this.checkOneOperandExprType(sOperator, pUnaryExprType);

        	if(isNull(pExprType)){
        		this._error(EFFECT_BAD_UNARY_OPERATION, { operator: sOperator,
        												  tyepName: pUnaryExprType.toString()});
        		return null;
        	}

        	pExpr.setOperator(sOperator);
        	pExpr.setType(pExprType);
        	pExpr.push(pUnaryExpr, true);

        	return pExpr;
        }
        
        private analyzeCastExpr(pNode: IParseNode): IAFXExprInstruction{
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var pExpr: CastExprInstruction = new CastExprInstruction();
        	var pExprType: IAFXVariableTypeInstruction;
        	var pCastedExpr: IAFXExprInstruction;

        	pExprType = this.analyzeConstTypeDim(pChildren[2]);
        	pCastedExpr = this.analyzeExpr(pChildren[0]);

        	pExpr.setType(pExprType);
        	pExpr.push(pExprType, true);
        	pExpr.push(pCastedExpr, true);

        	return pExpr;
        }
        
        private analyzeConditionalExpr(pNode: IParseNode): IAFXExprInstruction{
        	this.setAnalyzedNode(pNode);
        	
        	var pChildren: IParseNode[] = pNode.children;
        	var pExpr: ConditionalExprInstruction = new ConditionalExprInstruction();
        	var pConditionExpr: IAFXExprInstruction;
        	var pTrueExpr: IAFXExprInstruction;
        	var pFalseExpr: IAFXExprInstruction;
        	var pConditionType: IAFXVariableTypeInstruction;
			var pTrueExprType: IAFXVariableTypeInstruction;
        	var pFalseExprType: IAFXVariableTypeInstruction;
        	var pExprType: IAFXVariableTypeInstruction;
        	var pBoolType: IAFXVariableTypeInstruction;

        	pConditionExpr = this.analyzeExpr(pChildren[pChildren.length - 1]);
        	pTrueExpr = this.analyzeExpr(pChildren[pChildren.length - 3]);
        	pFalseExpr = this.analyzeExpr(pChildren[0]);

        	pConditionType = pConditionExpr.getType();
        	pTrueExprType = pTrueExpr.getType();
        	pFalseExprType = pFalseExpr.getType();

        	pBoolType = this.getSystemType("bool");

        	if(!pConditionType.isEqual(pBoolType)){
        		this._error(EFFECT_BAD_CONDITION_TYPE, { typeName: pConditionType.toString()});
        		return null;
        	}

        	if(!pTrueExprType.isEqual(pFalseExprType)){
        		this._error(EFFECT_BAD_CONDITION_VALUE_TYPES, { leftTypeName: pTrueExprType.toString(),
        														rightTypeName: pFalseExprType.toString()});
        		return null;
        	}

        	pExpr.setType(pTrueExprType);
        	pExpr.push(pConditionExpr, true);
        	pExpr.push(pTrueExpr, true);
        	pExpr.push(pFalseExpr, true);

        	return pExpr;
        }
        
        private analyzeArithmeticExpr(pNode: IParseNode): IAFXExprInstruction{
        	this.setAnalyzedNode(pNode);
        	
        	var pChildren: IParseNode[] = pNode.children;
        	var sOperator: string = pNode.children[1].value;
        	var pExpr: ArithmeticExprInstruction = new ArithmeticExprInstruction();
        	var pLeftExpr: IAFXExprInstruction;
        	var pRightExpr: IAFXExprInstruction;
			var pLeftType: IAFXVariableTypeInstruction;
        	var pRightType: IAFXVariableTypeInstruction;
        	var pExprType: IAFXVariableTypeInstruction;
        	
        	pLeftExpr = this.analyzeExpr(pChildren[pChildren.length - 1]);
        	pRightExpr = this.analyzeExpr(pChildren[pChildren.length - 1]);

        	pLeftType = pLeftExpr.getType();
        	pRightType = pRightExpr.getType();

        	pExprType = this.checkTwoOperandExprTypes(sOperator, pLeftType, pRightType);

        	if(isNull(pExprType)){
        		this._error(EFFECT_BAD_ARITHMETIC_OPERATION, { operator: sOperator,
        													   leftTypeName: pLeftType.toString(),
        													   rightTypeName: pRightType.toString()});
        		return null;
        	}

        	pExpr.setOperator(sOperator);
        	pExpr.setType(pExprType);
        	pExpr.push(pLeftExpr, true);
        	pExpr.push(pRightExpr, true);

        	return pExpr;
        }

        private analyzeRelationExpr(pNode: IParseNode): IAFXExprInstruction{
        	this.setAnalyzedNode(pNode);
        	
        	var pChildren: IParseNode[] = pNode.children;
        	var sOperator: string = pNode.children[1].value;
        	var pExpr: RelationalExprInstruction = new RelationalExprInstruction();
        	var pLeftExpr: IAFXExprInstruction;
        	var pRightExpr: IAFXExprInstruction;
			var pLeftType: IAFXVariableTypeInstruction;
        	var pRightType: IAFXVariableTypeInstruction;
        	var pExprType: IAFXVariableTypeInstruction;
        	
        	pLeftExpr = this.analyzeExpr(pChildren[pChildren.length - 1]);
        	pRightExpr = this.analyzeExpr(pChildren[0]);

        	pLeftType = pLeftExpr.getType();
        	pRightType = pRightExpr.getType();

        	pExprType = this.checkTwoOperandExprTypes(sOperator, pLeftType, pRightType);

        	if(isNull(pExprType)){
        		this._error(EFFECT_BAD_RELATIONAL_OPERATION, { operator: sOperator,
        													   leftTypeName: pLeftType.toString(),
        													   rightTypeName: pRightType.toString()});
        		return null;
        	}

        	pExpr.setOperator(sOperator);
        	pExpr.setType(pExprType);
        	pExpr.push(pLeftExpr, true);
        	pExpr.push(pRightExpr, true);

        	return pExpr;
        }

        private analyzeLogicalExpr(pNode: IParseNode): IAFXExprInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var sOperator: string = pNode.children[1].value;
        	var pExpr: LogicalExprInstruction = new LogicalExprInstruction();
        	var pLeftExpr: IAFXExprInstruction;
        	var pRightExpr: IAFXExprInstruction;
			var pLeftType: IAFXVariableTypeInstruction;
        	var pRightType: IAFXVariableTypeInstruction;
			var pBoolType: IAFXVariableTypeInstruction;

        	pLeftExpr = this.analyzeExpr(pChildren[pChildren.length - 1]);
        	pRightExpr = this.analyzeExpr(pChildren[0]);

        	pLeftType = pLeftExpr.getType();
        	pRightType = pRightExpr.getType();

        	pBoolType = this.getSystemType("bool");

        	if(!pLeftType.isEqual(pBoolType)){
        		this._error(EFFECT_BAD_LOGICAL_OPERATION, { operator: sOperator,
    													    typeName: pLeftType.toString()});
        		return null;
        	}
        	if(!pRightType.isEqual(pBoolType)){
        		this._error(EFFECT_BAD_LOGICAL_OPERATION, { operator: sOperator,
    													    typeName: pRightType.toString()});
        		return null;
        	}

        	pExpr.setOperator(sOperator);
        	pExpr.setType(pBoolType);
        	pExpr.push(pLeftExpr, true);
        	pExpr.push(pRightExpr, true);

        	return pExpr;        	
        }

        private analyzeAssignmentExpr(pNode: IParseNode): IAFXExprInstruction{
        	this.setAnalyzedNode(pNode);
        	
        	var pChildren: IParseNode[] = pNode.children;
        	var sOperator: string = pChildren[1].value;
        	var pExpr: AssignmentExprInstruction = new AssignmentExprInstruction();
        	var pLeftExpr: IAFXExprInstruction;
        	var pRightExpr: IAFXExprInstruction;
			var pLeftType: IAFXVariableTypeInstruction;
        	var pRightType: IAFXVariableTypeInstruction;
        	var pExprType: IAFXVariableTypeInstruction;

        	pLeftExpr = this.analyzeExpr(pChildren[pChildren.length - 1]);
        	pRightExpr = this.analyzeExpr(pChildren[0]);

        	pLeftType = pLeftExpr.getType();
        	pRightType = pRightExpr.getType();

        	if(sOperator !== "="){
        		pExprType = this.checkTwoOperandExprTypes(sOperator, pLeftType, pRightType);	
        	  	if(isNull(pExprType)){
        			this._error(EFFECT_BAD_ARITHMETIC_ASSIGNMENT_OPERATION, { operator: sOperator,
        													  			  	  leftTypeName: pLeftType.toString(),	
        													  			  	  rightTypeName: pRightType.toString()});
        		}
        	}
        	else {
        		pExprType = pRightType;
        	}

        	pExprType = this.checkTwoOperandExprTypes("=", pLeftType, pExprType);

        	if(isNull(pExprType)){
        		this._error(EFFECT_BAD_ASSIGNMENT_OPERATION, { leftTypeName: pLeftType.toString(),	
        													   rightTypeName: pRightType.toString()});
        	}

        	pExpr.setOperator(sOperator);
        	pExpr.setType(pExprType);
        	pExpr.push(pLeftExpr, true);
        	pExpr.push(pRightExpr, true);

        	return pExpr;
        }

        private analyzeIdExpr(pNode: IParseNode): IAFXExprInstruction {
        	this.setAnalyzedNode(pNode);
        	
        	var sName: string = pNode.value;
        	var pVariable: IAFXVariable = this.getVariable(sName);

        	if(isNull(pVariable)){
        		this._error(EFFECT_UNKNOWN_VARNAME, {varName: sName});
        		return null;
        	}

        	var pVarId: IdExprInstruction = new IdExprInstruction();
        	pVarId.push(pVariable.getId(), false);
        	
        	return pVarId;
        }

        private analyzeSimpleExpr(pNode: IParseNode): IAFXExprInstruction {
        	this.setAnalyzedNode(pNode);
        	
        	var pInstruction: IAFXLiteralInstruction;
        	var sName: string = pNode.name;
        	var sValue: string = pNode.value;

        	switch(sName) {
        	 	case "T_UINT": 
        	 		pInstruction = new IntInstruction();
        	 		pInstruction.setValue(<int><any>sValue);
        	 		break;
        	 	case "T_FLOAT":
        	 		pInstruction = new FloatInstruction();
        	 		pInstruction.setValue(<float><any>sValue);
        	 		break;
        	 	case "T_STRING":
        	 		pInstruction = new StringInstruction();
        	 		pInstruction.setValue(sValue);
        	 		break;
        	 	case "T_KW_TRUE":
        	 	case "T_KW_FALSE":
        	 		pInstruction = new BoolInstruction();
        	 		pInstruction.setValue(<bool><any>sValue);
        	 		break;
			}

			// this.pushCommand(pInstruction, true);

        	return pInstruction;
        }

        private analyzeMemExpr(pNode: IParseNode): IAFXExprInstruction{
        	return null;
        }

        private analyzeConstTypeDim(pNode: IParseNode): IAFXVariableTypeInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	//var pVariableType: IAFXVariableTypeInstruction = new VariableTypeInstruction();
        	//var pType: TypeInstruction = new TypeInstruction();


        	if(pChildren.length > 1) {
        		this._error(EFFECT_BAD_CAST_TYPE_USAGE);
        		return null;
        	}

        	var pTypeName: IAFXIdInstruction;
        	var pType: IAFXVariableTypeInstruction;

        	pTypeName = this.analyzeType(pChildren[0]);
        	pType = this.generateVariableTypeFromId(pTypeName);
        	
        	if(!pType.isBase()){
        		this._error(EFFECT_BAD_CAST_TYPE_NOT_BASE, { typeName: pType.toString()});
        	}

        	return pType;
        }

		private analyzeTypeDecl(pNode: IParseNode, pParentInstruction: IAFXInstruction = null): IAFXTypeDeclInstruction {
			var pChildren: IParseNode[] = pNode.children;
			this.setAnalyzedNode(pNode);

			var pTypeDeclInstruction: IAFXTypeDeclInstruction = new TypeDeclInstruction();
			var pType: IAFXType = new Type();

			// this.newInstruction(pTypeDeclInstruction);

 			if(pChildren.length === 2) {
 				var pVariableTypeInstruction: IAFXVariableTypeInstruction = new VariableTypeInstruction();
 				var pTypeInstruction: IAFXUsageTypeInstruction = new UsageTypeInstruction();
				var pStructInstruction: IAFXStructDeclInstruction = this.analyzeStructDecl(pChildren[1]);

				pTypeDeclInstruction.push(pVariableTypeInstruction, true);
				pVariableTypeInstruction.push(pTypeInstruction, true);
				pStructInstruction.setParent(pTypeInstruction);
				pTypeInstruction.push(pStructInstruction.getInstructions[0], false);				
			}
			else {
				this._error(EFFECT_UNSUPPORTED_TYPEDECL);
			}

			// this.endInstruction();

			// this.pushCommand(pTypeDeclInstruction, true);
			pType.initializeFromInstruction(pTypeDeclInstruction);

			this.addTypeDecl(pType);

			pNode.isAnalyzed = true;

			if(!isNull(pParentInstruction)){
				pParentInstruction.push(pTypeDeclInstruction, true);
			}

			return pTypeDeclInstruction;
		}

        private analyzeStructDecl(pNode: IParseNode): IAFXStructDeclInstruction {
        	var pStructInstruction: IAFXStructDeclInstruction = new StructDeclInstruction();
        	var pStructName: IdInstruction = new IdInstruction();
        	var pStructFields: StructFieldsInstruction = new StructFieldsInstruction();

        	var pChildren: IParseNode[] = pNode.children;
        	var sName: string = pChildren[pChildren.length - 2].value;

        	pStructName.setName(sName);

        	pStructInstruction.push(pStructName, true);
        	pStructInstruction.push(pStructFields, true);
        	
        	this.newScope();

        	var i: uint = 0;
        	for (i = pChildren.length - 4; i >= 1; i--) {
		        if (pChildren[i].name === "VariableDecl"){
		            this.analyzeVariableDecl(pChildren[i], pStructFields);
		        }
		    }

		    this.endScope();

        	return pStructInstruction;
        }

        private analyzeFunctionDecl(pNode: IParseNode): IAFXFunctionDeclInstruction {
        	this.setAnalyzedNode(pNode);
        	
        	var pChildren: IParseNode[] = pNode.children;
        	var pFunction: IAFXFunctionDeclInstruction = null;
        	var pFunctionDef: FunctionDefInstruction = null;
        	var pStmtBlock: StmtBlockInstruction = null;
        	var pAnnotation: IAFXAnnotationInstruction = null;
        	var sLastNodeValue: string = pChildren[0].value;

        	pFunctionDef = this.analyzeFunctionDef(pChildren[pChildren.length - 1]);

        	pFunction = this.findFunctionByDef(pFunctionDef);
        	if(!isNull(pFunction) && pFunction.hasImplementation()){
        		this._error(EFFECT_BAD_REDEFINE_FUNCTION, { funcName: pFunction.getNameId().toString() });
        		return null;
        	}

        	if(isNull(pFunction)){
        		pFunction = new FunctionDeclInstruction();
        	}

        	pFunction.push(pFunctionDef, true);

        	//this.newInstruction(pFunction);

        	if(pChildren.length === 3) {
        		pAnnotation = this.analyzeAnnotation(pChildren[1]);
        		pFunction.setAnnotation(pAnnotation);
        	}

        	if(sLastNodeValue !== ";") {
 				pStmtBlock = <StmtBlockInstruction>this.analyzeStmtBlock(pChildren[0]);
        	}

        	pFunction.push(pFunctionDef, true);
      		pFunction.push(pStmtBlock, true);

      		// this.endInstruction();

      		return pFunction;
        }

        private analyzeFunctionDef(pNode: IParseNode): FunctionDefInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var pFunctionDef: FunctionDefInstruction = new FunctionDefInstruction();
        	var pReturnType: IAFXVariableTypeInstruction = null;
        	var pUsageType: IAFXUsageTypeInstruction = null;
        	var pFuncName: IAFXIdInstruction = null;
        	var pArguments: IAFXVariableDeclInstruction[] = null;
        	var sFuncName: string = pChildren[pChildren.length - 2].value;

        	pUsageType = this.analyzeUsageType(pChildren[pChildren.length - 1]);
        	pReturnType = new VariableTypeInstruction();
        	pReturnType.push(pUsageType, true);

        	pFuncName = new IdInstruction();
        	pFuncName.setName(sFuncName);

        	pFunctionDef.push(pReturnType, true);
        	pFunctionDef.push(pFuncName, true);

        	if(pChildren.length === 4){
        		var sSemantic: string = this.analyzeSemantic(pChildren[0]);
        		pFunctionDef.setSemantic(sSemantic);
        	}

        	this.analyzeParamList(pChildren[pChildren.length - 3], pFunctionDef);

        	return pFunctionDef;
        }

        private analyzeStmtBlock(pNode: IParseNode): IAFXStmtInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var pStmtBlock: StmtBlockInstruction = new StmtBlockInstruction();
        	var pStmt: IAFXStmtInstruction;
        	var i: uint = 0;

        	this.newScope();

        	for(i = pChildren.length - 2; i > 0; i--){
        		pStmt = this.analyzeStmt(pChildren[i]);
        		if(isNull(pStmt)){
        			pStmtBlock.push(pStmt);
        		}
        	} 

        	this.endScope();

        	return pStmtBlock;
        }

        private analyzeStmt(pNode:IParseNode): IAFXStmtInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var sFirstNodeName: string = pChildren[pChildren.length - 1].name;

        	switch(sFirstNodeName){
        		case "SimpleStmt":
        			return this.analyzeSimpleStmt(pChildren[0]);
        		case "UseDecl":
        			return this.analyzeUseDecl(pChildren[0]);
        		case "T_KW_WHILE":
        			return this.analyzeWhileStmt(pNode);
        		case "T_KW_FOR":
        			return this.analyzeForStmt(pNode);
        		case "T_KW_IF":
        			return this.analyzeIfStmt(pNode);	
        	}
        }

        private analyzeSimpleStmt(pNode: IParseNode): IAFXStmtInstruction{
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var sFirstNodeName: string = pChildren[pChildren.length - 1].name;

        	switch(sFirstNodeName){
        		case "T_KW_RETURN":
        			return this.analyzeReturnStmt(pNode);
        		
        		case "T_KW_DO":
        			return this.analyzeWhileStmt(pNode);
        		
        		case "StmtBlock":
        			return this.analyzeStmtBlock(pChildren[0]);
        		
        		case "T_KW_DISCARD":
        		case "T_KW_BREAK":
        		case "T_KW_CONTINUE":
        			return this.analyzeBreakStmt(pNode);
        		
        		case "TypeDecl":
        		case "VariableDecl":
        		case "VarStructDecl":
        			return this.analyzeDeclStmt(pChildren[0]);	

        		default:
        			if(pChildren.length === 2) {
        				return this.analyzeExprStmt(pNode);
        			}
        			else {
        				return (new SemicolonStmtInstruction());
        			}
        	}
        }

        private analyzeReturnStmt(pNode: IParseNode): IAFXStmtInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var pReturnStmtInstruction: ReturnStmtInstruction = new ReturnStmtInstruction();

        	if(pChildren.length === 2) {
        		var pExprInstruction: IAFXExprInstruction = this.analyzeExpr(pChildren[1]);
        		pReturnStmtInstruction.push(pExprInstruction, true);
        	}

        	return pReturnStmtInstruction;
        }

        private analyzeBreakStmt(pNode: IParseNode): IAFXStmtInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var pBreakStmtInstruction: BreakStmtInstruction = new BreakStmtInstruction();
        	var sOperatorName: string = pChildren[1].value;

        	pBreakStmtInstruction.setOperator(sOperatorName);

        	return pBreakStmtInstruction;
        }

        private analyzeDeclStmt(pNode: IParseNode): IAFXStmtInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var sNodeName: string = pNode.name;
        	var pDeclStmtInstruction: DeclStmtInstruction = new DeclStmtInstruction();

        	switch(sNodeName){
        		case "TypeDecl":
        			this.analyzeTypeDecl(pNode, pDeclStmtInstruction);
        			break;
        		case "VariableDecl":
        			this.analyzeVariableDecl(pNode, pDeclStmtInstruction);
        			break;
    			case "VarStructDecl":
    				//TODO: add varstruct
    				break;
        	}
        	
        	return pDeclStmtInstruction;
        }

       	private analyzeExprStmt(pNode: IParseNode): IAFXStmtInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var pExprStmtInstruction: ExprStmtInstruction = new ExprStmtInstruction();
        	var pExprInstruction: IAFXExprInstruction = this.analyzeExpr(pChildren[1]);

        	pExprStmtInstruction.push(pExprInstruction, true);

        	return pExprStmtInstruction;
        }	

        private analyzeUseDecl(pNode: IParseNode): IAFXStmtInstruction{
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;

        	return null;
        }

        private analyzeWhileStmt(pNode: IParseNode): IAFXStmtInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var isDoWhile: bool = (pChildren[pChildren.length - 1].value === "do");
        	var isNonIfStmt: bool = (pNode.name === "NonIfStmt") ? true : false;

        	var pWhileStmt: WhileStmtInstruction = new WhileStmtInstruction();
        	var pCondition: IAFXExprInstruction = null;
        	var pConditionType: IAFXVariableTypeInstruction = null;
        	var pBoolType: IAFXVariableTypeInstruction = this.getSystemType("bool");
        	var pStmt: IAFXStmtInstruction = null;

        	if(isDoWhile) {
        		pWhileStmt.setOperator("do_while");
        		pCondition = this.analyzeExpr(pChildren[2]);
        		pConditionType = pCondition.getType();

        		if(!pConditionType.isEqual(pBoolType)){
	        		this._error(EFFECT_BAD_DO_WHILE_CONDITION, { typeName: pConditionType.toString() });
	        		return null;
	        	}

	        	pStmt = this.analyzeStmt(pChildren[0]);
        	}
        	else {
        		pWhileStmt.setOperator("while");
        		pCondition = this.analyzeExpr(pChildren[2]);
        		pConditionType = pCondition.getType();

        		if(!pConditionType.isEqual(pBoolType)){
	        		this._error(EFFECT_BAD_WHILE_CONDITION, { typeName: pConditionType.toString() });
	        		return null;
	        	}

	        	if(isNonIfStmt){
	        		pStmt = this.analyzeNonIfStmt(pChildren[0]);
	        	}
	        	else {
	        		pStmt = this.analyzeStmt(pChildren[0]);
	        	}

	        	pWhileStmt.push(pCondition, true);
	        	pWhileStmt.push(pStmt, true);
	        }

        	return pWhileStmt;
        }

        private analyzeForStmt(pNode: IParseNode): IAFXStmtInstruction {
        	this.setAnalyzedNode(pNode);
			
			var pChildren: IParseNode[] = pNode.children;
        	var isNonIfStmt: bool = (pNode.name === "NonIfStmt") ? true : false;

        	

        	return null;
        }

        private analyzeIfStmt(pNode: IParseNode): IAFXStmtInstruction{
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var isIfElse: bool = (pChildren.length === 7);

        	var pIfStmtInstruction: IfStmtInstruction = new IfStmtInstruction();
        	var pCondition: IAFXExprInstruction = this.analyzeExpr(pChildren[pChildren.length - 3]);
        	var pConditionType: IAFXVariableTypeInstruction = pCondition.getType();
        	var pBoolType: IAFXVariableTypeInstruction = this.getSystemType("bool");

        	var pIfStmt: IAFXStmtInstruction = null;
        	var pElseStmt: IAFXStmtInstruction = null;
 
        	if(!pConditionType.isEqual(pBoolType)){
        		this._error(EFFECT_BAD_IF_CONDITION, { typeName: pConditionType.toString() });
        		return null;
        	}

        	pIfStmtInstruction.push(pCondition, true);

        	if(isIfElse){
        		pIfStmtInstruction.setOperator("if_else");
        		pIfStmt = this.analyzeNonIfStmt(pChildren[2]);
        		pElseStmt = this.analyzeStmt(pChildren[0]);

        		pIfStmtInstruction.push(pIfStmt, true);
        		pIfStmtInstruction.push(pElseStmt, true);
        	}
        	else {
        		pIfStmtInstruction.setOperator("if");
        		pIfStmt = this.analyzeNonIfStmt(pChildren[0]);

        		pIfStmtInstruction.push(pIfStmt, true);
        	}

        	return pIfStmtInstruction;
        }

        private analyzeNonIfStmt(pNode: IParseNode): IAFXStmtInstruction{
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var sFirstNodeName: string = pChildren[pChildren.length - 1].name;

        	switch(sFirstNodeName){
        		case "SimpleStmt":
        			return this.analyzeSimpleStmt(pChildren[0]);
        		case "T_KW_WHILE":
        			return this.analyzeWhileStmt(pNode);
        		case "T_KW_FOR":
        			return this.analyzeForStmt(pNode);
        	}
        }

        private analyzeParamList(pNode:IParseNode, pFunctionDef: FunctionDefInstruction): void {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var pParameter: IAFXVariableDeclInstruction;

        	var i: uint = 0;

        	for (i = pChildren.length - 2; i >= 1; i--) {
        		if (pChildren[i].name === "ParameterDecl") {
		            pParameter = this.analyzeParameterDecl(pChildren[i]);
		            pFunctionDef.push(pParameter, true);
		        }	
        	}
        }

        private analyzeParameterDecl(pNode: IParseNode): IAFXVariableDeclInstruction {
        	this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var pType: IAFXUsageTypeInstruction;
        	var pParameter: IAFXVariableDeclInstruction;

        	pType = this.analyzeParamUsageType(pChildren[1]);
        	pParameter = this.analyzeVariable(pChildren[0], pType);

        	return pParameter;
        }

        private analyzeParamUsageType(pNode: IParseNode): IAFXUsageTypeInstruction {
        	var pChildren: IParseNode[] = pNode.children;
		    var i: uint = 0;
		    var pType: IAFXUsageTypeInstruction = new UsageTypeInstruction();

		    for (i = pChildren.length - 1; i >= 0; i--) {
		        if (pChildren[i].name === "Type") {
		        	var pTypeName: IAFXIdInstruction = this.analyzeType(pChildren[i]);
		        	pType.push(pTypeName, true);
		        }
		        else if (pChildren[i].name === "ParamUsage") {
		        	var pUsage: IAFXKeywordInstruction = this.analyzeUsage(pChildren[i]);
		        	pType.push(pUsage, true);
		        }
		    }

		    return pType;
        }

        

        /**
         * Проверят возможность использования оператора между двумя типами.
         * Возращает тип получаемый в результате приминения опрератора, или, если применить его невозможно - null.
         * 
         * @sOperator {string} Один из операторов: + - * / % += -= *= /= %= = < > <= >= == != =
         * @pLeftType {IAFXVariableTypeInstruction} Тип левой части выражения
         * @pRightType {IAFXVariableTypeInstruction} Тип правой части выражения
         */
        private checkTwoOperandExprTypes(sOperator: string, 
        								 pLeftType: IAFXVariableTypeInstruction, 
        								 pRightType: IAFXVariableTypeInstruction): IAFXVariableTypeInstruction {

        	switch(sOperator) {
        		case "+":
        		case "+=":
        			break;
        		case "-":
        		case "-=":
        			break;
        		case "*":
        		case "*=":
        			break;
        		case "/":
        		case "/=":
        			break;
        		case "%":
        		case "%=":
        			break;
        		case "<":
        		case "<=":
        			break;
        		case ">":
        		case ">=":
        			break;
        		case "==":
        		case "!=":
        			break;
        		case "=":
        			break;
        	}

        	return null;
        }
        
         /**
         * Проверят возможность использования оператора к типу данных.
         * Возращает тип получаемый в результате приминения опрератора, или, если применить его невозможно - null.
         * 
         * @sOperator {string} Один из операторов: + - ! ++ --
         * @pLeftType {IAFXVariableTypeInstruction} Тип операнда
         */
        private checkOneOperandExprType(sOperator: string, 
        								pType: IAFXVariableTypeInstruction): IAFXVariableTypeInstruction {

        	switch(sOperator) {
        		case "+":
        			break;
        		case "-":
        			break;
        		case "!":
        			break;
        		case "++":
        			break;
        		case "--":
        			break;
        	}

        	return null;
        }

        private getSystemType(sTypeName: string): IAFXVariableTypeInstruction {
        	//bool, string, float and others
        	return null;
        }

        private generateVariableTypeFromId(pTypeName: IAFXIdInstruction): IAFXVariableTypeInstruction {
        	return null;
        }

		private getNodeSourceLocation(pNode: IParseNode): {line: uint; column: uint;} {
			if(isDef(pNode.line)){
				return {line: pNode.line, column: pNode.start};
			}
			else{
				return this.getNodeSourceLocation(pNode.children[pNode.children.length - 1]);
			}
		}
	}
}

#endif