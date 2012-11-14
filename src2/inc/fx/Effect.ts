#ifndef AFXEFFECT_TS
#define AFXEFFECT_TS

#include "IAFXEffect.ts"
#include "IParser.ts"
#include "logger.ts"
#include "common.ts"
#include "ILogger.ts"
#include "fx/Instruction.ts"

module akra.fx {

	//Errors
	#define EFFECT_REDEFINE_SYSTEM_TYPE 2201
	#define EFFECT_REDEFINE_TYPE 2202
    #define EFFECT_DONT_SUPPORTED_TYPEDECL 2203

    akra.logger.registerCode(EFFECT_REDEFINE_SYSTEM_TYPE, "You trying to redefine system type: {typeName}. In line: {line}. In column: {column}");
    akra.logger.registerCode(EFFECT_REDEFINE_TYPE, "You trying to redefine type: {typeName}. In line: {line}. In column: {column}");
    akra.logger.registerCode(EFFECT_DONT_SUPPORTED_TYPEDECL, "You try to use unssuported type declaration. We implement it soon. In line: {line}.");


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

			var sVariableName: string = pVariable.name;

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

			var sTypeName: string = pType.name;

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

			var sFuncHash: string = pFunction.hash;

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
				case EFFECT_DONT_SUPPORTED_TYPEDECL:

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
			pInstruction.parent = this._pCurrentInstruction;
			this._pCurrentInstruction = pInstruction;
		}

		private inline endInstruction(): void {
			this._pCurrentInstruction = this._pCurrentInstruction.parent;
		}

		private inline pushCommand(pInstruction: IAFXInstruction): void {
			if(!isNull(this._pCurrentInstruction)){
				this._pCurrentInstruction.push(pInstruction);
			}
		}

		private inline setOperator(sOperator: string): void {
			if(!isNull(this._pCurrentInstruction)){
				this._pCurrentInstruction.operator = sOperator;
			}	
		}

		private addType(pType: IAFXType): void {
			if(this.isSystemType(pType)){
				error(EFFECT_REDEFINE_SYSTEM_TYPE, {typeName: pType.name});
			}

			var isTypeAdded: bool = this._pEffectScope.addType(pType);

			if(!isTypeAdded){
				error(EFFECT_REDEFINE_TYPE, {typeName: pType.name});
			}
		}

		private 

		private analyzeTypes(): void {
			var pChildren: IParseNode[] = this._pParseTree.root.children;
			var i: uint;

			for(i = pChildren.length - 1; i >= 0; i--) {
				if(pChildren[i].name === Effect._pGrammarSymbols["TypeDecl"]){
					this.analyzeTypeDecl(pChildren[i]);
				}
			}
		}

		private preAnalyzeFunctions(): void {

		}

		private preAnalyzeVariables(): void {

		}

		private preAnalyzeTechniques(): void {

		}

		private analyzeTypeDecl(pNode: IParseNode): void {
			this.setAnalyzedNode(pNode);

			var pChildren: IParseNode[] = pNode.children;
			var pType:IAFXType = null;
			// = new Type();

			// if(pChildren.length === 2) {
			// 	pType.fromStruct(this.analyzeStructDecl(pChildren[1]));
			// }
			// else {
			// 	error(EFFECT_DONT_SUPPORTED_TYPEDECL);
			// }

			this.addType(pType);

			pNode.isAnalyzed = true;
		}


        private analyzeStructDecl(pNode: IParseNode): IAFXStruct {
        	var pInstruction: StructDeclInstruction = new StructDeclInstruction();
        	pInstruction.
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