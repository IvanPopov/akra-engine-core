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

		private inline newInstruction(pInstruction: IAFXInstruction): void {
			pInstruction.setParent(this._pCurrentInstruction);
			this._pCurrentInstruction = pInstruction;
		}

		private inline endInstruction(): void {
			this._pCurrentInstruction = this._pCurrentInstruction.getParent();
		}

		private inline pushCommand(pInstruction: IAFXInstruction, isSetParent?: bool = false): void {
			if(!isNull(this._pCurrentInstruction)){
				this._pCurrentInstruction.push(pInstruction, isSetParent);
			}
		}

		private inline pushAndSet(pInstruction: IAFXInstruction): void {
			if(!isNull(this._pCurrentInstruction)){
				this._pCurrentInstruction.push(pInstruction, true);
			}
			this.newInstruction(pInstruction);
		}

		private inline setOperator(sOperator: string): void {
			if(!isNull(this._pCurrentInstruction)){
				this._pCurrentInstruction.setOperator(sOperator);
			}	
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
		            this.analyzeVariableDecl(pNode);
		            break;
		        case "TypeDecl":
		            this.analyzeTypeDecl(pNode);
		            break;
		    //     case "FunctionDecl":
		    //         this.analyzeFunctionDecl(pNode);
		    //         break;
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

		private analyzeVariableDecl(pNode: IParseNode): void {
			this.setAnalyzedNode(pNode);

        	var pChildren: IParseNode[] = pNode.children;
        	var pUsageType: IAFXUsageTypeInstruction;
        	var i: uint = 0;
        	
        	pUsageType = this.analyzeUsageType(pChildren[pChildren.length - 1]);

        	for(i = pChildren.length - 2; i >= 1; i--){
        		if(pChildren[i].name === "Variable") {
        			this.analyzeVariable(pChildren[i], pUsageType);
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

        private analyzeVariable(pNode: IParseNode, pUsageType: IAFXUsageTypeInstruction): void {
        	var pChildren: IParseNode[] = pNode.children;

        	var pVarDecl: IAFXVariableDeclInstruction = new VariableDeclInstruction();
        	var pVariableType: IAFXVariableTypeInstruction = new VariableTypeInstruction();
			
        	pVarDecl.push(pVariableType);       	
        	pVariableType.push(pUsageType);

        	this.newInstruction(pVarDecl);

        	this.analyzeVariableDim(pChildren[pChildren.length - 1]);
        	
        	var i: uint = 0;
        	for(i = pChildren.length - 2; i >= 0; i--){
        		if(pChildren[i].name === "Annotation"){
        			this.analyzeAnnotation(pChildren[i]);
        		}
        		else if(pChildren[i].name === "Semantic"){
        			this.analyzeSemantic(pChildren[i]);
        		}
        		else if(pChildren[i].name === "Initializer"){
        			this.analyzeInitializer(pChildren[i]);
        		}
        	}

        	this.endInstruction();

        	var pVariable: IAFXVariable = new Variable();
        	pVariable.initializeFromInstruction(pVarDecl);
        	this.addVariableDecl(pVariable);
        }

        private analyzeVariableDim(pNode: IParseNode): void {
			var pChildren: IParseNode[] = pNode.children;
			var pVariableDecl: IAFXVariableDeclInstruction = <IAFXVariableDeclInstruction>this._pCurrentInstruction;
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

			this.analyzeVariableDim(pChildren[pChildren.length - 1]);
        }

        private analyzeAnnotation(pNode:IParseNode): void {
        }

        private analyzeSemantic(pNode:IParseNode): void {
        	var sSemantic: string = pNode.children[0].value;
			var pDecl: IAFXDeclInstruction = <IAFXDeclInstruction>this._pCurrentInstruction;
			pDecl.setSemantic(sSemantic);	
        }

        private analyzeInitializer(pNode:IParseNode): void {        	
        }

        private analyzeFromExpr(pNode: IParseNode): IAFXIdInstruction {
       		return null;	
        }

        private analyzeExpr(pNode: IParseNode): IAFXExprInstruction {
        	this.setAnalyzedNode(pNode);
        	var sName = pNode.name;
        	
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
		       		this._error(EFFECT_UNSUPPORTED_EXPR, {exprName: sName});
		       		break;
        	}

       		return null;	
        }

        private analyzeObjectExpr(pNode: IParseNode): IAFXExprInstruction {
        	return null;
        }

        private analyzeComplexExpr(pNode: IParseNode): IAFXExprInstruction{
        	return null;
        }
        
        private analyzePrimaryExpr(pNode: IParseNode): IAFXExprInstruction{
        	return null;
        }
        
        private analyzePostfixExpr(pNode: IParseNode): IAFXExprInstruction{
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

        	pExprType = this.checkUnaryExprType(sOperator, pUnaryExprType);

        	if(isNull(pExprType)){
        		this._error(EFFECT_BAD_UNARY_OPERATION, { operator: sOperator,
        												  tyepName: pUnaryExprType.toString()});
        		return null;
        	}

        	pExpr.setOperator(sOperator);
        	pExpr.setType(pExprType);
        	pExpr.push(pUnaryExpr);

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
        	pExpr.push(pExprType);
        	pExpr.push(pCastedExpr);

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

        	pExprType = this.checkArithmeticExprTypes(sOperator, pLeftType, pRightType);

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

        	pExprType = this.checkRelationalExprTypes(sOperator, pLeftType, pRightType);

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
        		pExprType = this.checkArithmeticExprTypes(sOperator, pLeftType, pRightType);	
        	  	if(isNull(pExprType)){
        			this._error(EFFECT_BAD_ARITHMETIC_ASSIGNMENT_OPERATION, { operator: sOperator,
        													  			  	  leftTypeName: pLeftType.toString(),	
        													  			  	  rightTypeName: pRightType.toString()});
        		}
        	}
        	else {
        		pExprType = pRightType;
        	}

        	pExprType = this.checkAssignmentExprTypes(pLeftType, pExprType);

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
        	pVarId.push(pVariable.getId());

        	// this.pushCommand(pVarId, true);
        	
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

        /**
         * Проверят возможность использования арифметического оператора между двумя типами.
         * Возращает тип получаемый в результате приминения опрератора, или, если применить его невозможно - null.
         * 
         * @sOperator {string} Один из операторов: + - * / %
         * @pLeftType {IAFXVariableTypeInstruction} Тип левой части выражения
         * @pRightType {IAFXVariableTypeInstruction} Тип правой части выражения
         */
        private checkArithmeticExprTypes(sOperator: string, 
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
        	}

        	return null;
        }

        private checkAssignmentExprTypes(pLeftType: IAFXVariableTypeInstruction, 
        								 pRightType: IAFXVariableTypeInstruction): IAFXVariableTypeInstruction {

        	return null;
        }

        private checkRelationalExprTypes(sOperator: string, 
        								 pLeftType: IAFXVariableTypeInstruction, 
        								 pRightType: IAFXVariableTypeInstruction): IAFXVariableTypeInstruction {
        
        	switch(sOperator){
        		case "<":
        		case "<=":
        			break;
        		case ">":
        		case ">=":
        			break;
        		case "==":
        		case "!=":
        			break;
        	}

        	return null;
        }

        private checkUnaryExprType(sOperator: string, pType: IAFXVariableTypeInstruction): IAFXVariableTypeInstruction {
        	
        	switch(sOperator){
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


		// private analyzeTypes(): void {
		// 	var pChildren: IParseNode[] = this._pParseTree.root.children;
		// 	var i: uint;

		// 	for(i = pChildren.length - 1; i >= 0; i--) {
		// 		if(pChildren[i].name === Effect._pGrammarSymbols["TypeDecl"]){
		// 			this.analyzeTypeDecl(pChildren[i]);
		// 		}
		// 	}
		// }

		// private preAnalyzeFunctions(): void {
 
		// }

		// private preAnalyzeVariables(): void {

		// }

		// private preAnalyzeTechniques(): void {

		// }

		private analyzeTypeDecl(pNode: IParseNode): void {
			var pChildren: IParseNode[] = pNode.children;
			this.setAnalyzedNode(pNode);

			var pTypeDeclInstruction: IAFXTypeDeclInstruction = new TypeDeclInstruction();
			var pType: IAFXType = new Type();

			this.newInstruction(pTypeDeclInstruction);

 			if(pChildren.length === 2) {
				this.analyzeStructDecl(pChildren[1]);
			}
			else {
				this._error(EFFECT_UNSUPPORTED_TYPEDECL);
			}

			this.endInstruction();

			this.pushCommand(pTypeDeclInstruction, true);
			pType.initializeFromInstruction(pTypeDeclInstruction);

			this.addTypeDecl(pType);

			pNode.isAnalyzed = true;
		}

        private analyzeStructDecl(pNode: IParseNode): void {
        	var pVariableTypeInstruction: IAFXVariableTypeInstruction = new VariableTypeInstruction();
 			var pTypeInstruction: IAFXUsageTypeInstruction = new UsageTypeInstruction();
        	var pStructInstruction: IAFXStructDeclInstruction = new StructDeclInstruction();
        	var pStructName: IdInstruction = new IdInstruction();
        	var pStructFields: StructFieldsInstruction = new StructFieldsInstruction();

        	var pChildren: IParseNode[] = pNode.children;
        	var sName: string = pChildren[pChildren.length - 2].value;

        	pStructName.setName(sName);

        	this.pushAndSet(pVariableTypeInstruction);
        	this.pushAndSet(pTypeInstruction);
        	
        	this.newInstruction(pStructInstruction);

        	pStructInstruction.push(pStructName, true);
        	pStructInstruction.push(pStructFields, true);
        	
        	this.newInstruction(pStructFields);
        	
        	var i: uint = 0;
        	for (i = pChildren.length - 4; i >= 1; i--) {
		        if (pChildren[i].name === "VariableDecl"){
		            this.analyzeVariableDecl(pChildren[i]);
		        }
		    }

        	this.endInstruction();
        	this.endInstruction();

        	pTypeInstruction.push(pStructName, false);

        	this.endInstruction();
        	this.endInstruction();
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