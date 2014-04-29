/// <reference path="../../idl/IMap.ts" />
/// <reference path="../../idl/ERenderStates.ts" />
/// <reference path="../../idl/ERenderStateValues.ts" />

/// <reference path="../../render/render.ts" />
/// <reference path="DeclInstruction.ts" />


module akra.fx.instructions {
	interface IEvaluateOutput {
		"fragment": IAFXFunctionDeclInstruction;
		"vertex": IAFXFunctionDeclInstruction;
	};

	interface IPassFunction {
		(engine: any, foreigtn: any, uniforms: any, states: IMap<ERenderStateValues>, shaderMap: IAFXFunctionDeclMap, out: IEvaluateOutput): void; 
	}

	export class PassInstruction extends DeclInstruction implements IAFXPassInstruction {
		private _pTempNodeList: parser.IParseNode[] = null;
		private _pTempFoundedFuncList: IAFXFunctionDeclInstruction[] = null;
		private _pTempFoundedFuncTypeList: EFunctionType[] = null;
		private _pParseNode: parser.IParseNode = null;

		private _sFunctionCode: string = "";

		private _pShadersMap: IAFXFunctionDeclMap = null;
		private _pPassStateMap: IMap<ERenderStateValues> = null;

		private _bIsComlexPass: boolean = false;
		private _fnPassFunction: IPassFunction = null;

		private _pVertexShader: IAFXFunctionDeclInstruction = null;
		private _pPixelShader: IAFXFunctionDeclInstruction = null;

		private _pSharedVariableMapV: IAFXVariableDeclMap = null;
		private _pGlobalVariableMapV: IAFXVariableDeclMap = null;
		private _pUniformVariableMapV: IAFXVariableDeclMap = null;
		private _pForeignVariableMapV: IAFXVariableDeclMap = null;
		private _pTextureVariableMapV: IAFXVariableDeclMap = null;
		private _pUsedComplexTypeMapV: IAFXTypeMap = null;

		private _pSharedVariableMapP: IAFXVariableDeclMap = null;
		private _pGlobalVariableMapP: IAFXVariableDeclMap = null;
		private _pUniformVariableMapP: IAFXVariableDeclMap = null;
		private _pForeignVariableMapP: IAFXVariableDeclMap = null;
		private _pTextureVariableMapP: IAFXVariableDeclMap = null;
		private _pUsedComplexTypeMapP: IAFXTypeMap = null;

		private _pFullUniformVariableMap: IAFXVariableDeclMap = null;
		private _pFullForeignVariableMap: IAFXVariableDeclMap = null;
		private _pFullTextureVariableMap: IAFXVariableDeclMap = null;

		private _pOwnUsedForeignVariableMap: IAFXVariableDeclMap = null;

		private _pComplexPassEvaluateOutput: IEvaluateOutput = { "fragment": null, "vertex": null };

		constructor() {
			super();
			this._pInstructionList = null;
			this._eInstructionType = EAFXInstructionTypes.k_PassInstruction;
		}

		_addFoundFunction(pNode: parser.IParseNode, pShader: IAFXFunctionDeclInstruction, eType: EFunctionType): void {
			if (isNull(this._pTempNodeList)) {
				this._pTempNodeList = [];
				this._pTempFoundedFuncList = [];
				this._pTempFoundedFuncTypeList = [];
			}

			this._pTempNodeList.push(pNode);
			this._pTempFoundedFuncList.push(pShader);
			this._pTempFoundedFuncTypeList.push(eType);
		}

		_getFoundedFunction(pNode: parser.IParseNode): IAFXFunctionDeclInstruction {
			if (isNull(this._pTempNodeList)) {
				return null;
			}

			for (var i: uint = 0; i < this._pTempNodeList.length; i++) {
				if (this._pTempNodeList[i] === pNode) {
					return this._pTempFoundedFuncList[i];
				}
			}

			return null;
		}

		_getFoundedFunctionType(pNode: parser.IParseNode): EFunctionType {
			if (isNull(this._pTempNodeList)) {
				return null;
			}

			for (var i: uint = 0; i < this._pTempNodeList.length; i++) {
				if (this._pTempNodeList[i] === pNode) {
					return this._pTempFoundedFuncTypeList[i];
				}
			}

			return null;
		}

		_setParseNode(pNode: parser.IParseNode): void {
			this._pParseNode = pNode;
		}

		_getParseNode(): parser.IParseNode {
			return this._pParseNode;
		}

		_addCodeFragment(sCode: string): void {
			if (this._isComplexPass()) {
				this._sFunctionCode += sCode;
			}
		}

		_markAsComplex(isComplex: boolean): void {
			this._bIsComlexPass = isComplex;
		}

		_getSharedVariableMapV(): IAFXVariableDeclMap {
			return this._pSharedVariableMapV;
		}

		_getGlobalVariableMapV(): IAFXVariableDeclMap {
			return this._pGlobalVariableMapV;
		}

		_getUniformVariableMapV(): IAFXVariableDeclMap {
			return this._pUniformVariableMapV;
		}

		_getForeignVariableMapV(): IAFXVariableDeclMap {
			return this._pForeignVariableMapV;
		}

		_getTextureVariableMapV(): IAFXVariableDeclMap {
			return this._pTextureVariableMapV;
		}

		_getUsedComplexTypeMapV(): IAFXTypeMap {
			return this._pUsedComplexTypeMapV;
		}

		_getSharedVariableMapP(): IAFXVariableDeclMap {
			return this._pSharedVariableMapP;
		}

		_getGlobalVariableMapP(): IAFXVariableDeclMap {
			return this._pGlobalVariableMapP;
		}

		_getUniformVariableMapP(): IAFXVariableDeclMap {
			return this._pUniformVariableMapP;
		}

		_getForeignVariableMapP(): IAFXVariableDeclMap {
			return this._pForeignVariableMapP;
		}

		_getTextureVariableMapP(): IAFXVariableDeclMap {
			return this._pTextureVariableMapP;
		}

		_getUsedComplexTypeMapP(): IAFXTypeMap {
			return this._pUsedComplexTypeMapP;
		}

		_getFullUniformMap(): IAFXVariableDeclMap {
			return this._pFullUniformVariableMap;
		}

		_getFullForeignMap(): IAFXVariableDeclMap {
			return this._pFullForeignVariableMap;
		}

		_getFullTextureMap(): IAFXVariableDeclMap {
			return this._pFullTextureVariableMap;
		}

		_isComplexPass(): boolean {
			return this._bIsComlexPass;
		}

		_getVertexShader(): IAFXFunctionDeclInstruction {
			return this._pVertexShader;
		}

		_getPixelShader(): IAFXFunctionDeclInstruction {
			return this._pPixelShader;
		}

		_addOwnUsedForignVariable(pVarDecl: IAFXVariableDeclInstruction): void {
			if (isNull(this._pOwnUsedForeignVariableMap)) {
				this._pOwnUsedForeignVariableMap = {};
			}

			this._pOwnUsedForeignVariableMap[pVarDecl._getInstructionID()] = pVarDecl;
		}
		 
		_addShader(pShader: IAFXFunctionDeclInstruction): void {
			var isVertex: boolean = pShader._getFunctionType() === EFunctionType.k_Vertex;

			if (this._isComplexPass()) {
				if (isNull(this._pShadersMap)) {
					this._pShadersMap = <IAFXFunctionDeclMap>{};
				}
				var iShader: uint = pShader._getInstructionID();
				this._pShadersMap[iShader] = pShader;

				var sCode: string = isVertex ? "out.vertex=" : "out.fragment=";
				sCode += "shaderMap[" + iShader.toString() + "];"
				this._addCodeFragment(sCode);
			}
			else {
				if (isVertex) {
					this._pVertexShader = pShader;
				}
				else {
					this._pPixelShader = pShader;
				}
			}
		}

		_setState(eType: ERenderStates, eValue: ERenderStateValues): void {
			if (isNull(this._pPassStateMap)) {
				this._pPassStateMap = render.createRenderStateMap();
			}

			if (this._isComplexPass()) {
				this._addCodeFragment("states[" + eType + "]=" + eValue + ";");
			}
			else {
				this._pPassStateMap[eType] = eValue;
			}
		}

		_finalizePass(): void {
			if (this._isComplexPass()) {
				this._fnPassFunction = <any>(new Function("engine", "foreigns", "uniforms", "states", "shaderMap", "out", this._sFunctionCode));
			}

			this.generateInfoAboutUsedVaraibles();

			this._pTempNodeList = null;
			this._pTempFoundedFuncList = null;
			this._pTempFoundedFuncTypeList = null;
			this._pParseNode = null;
			this._sFunctionCode = "";
		}

		_evaluate(pEngineStates: any, pForeigns: any, pUniforms: any): boolean {
			if (this._isComplexPass()) {
				this._pComplexPassEvaluateOutput.fragment = null;
				this._pComplexPassEvaluateOutput.vertex = null;
				this.clearPassStates();

				this._fnPassFunction(pEngineStates, pForeigns, pUniforms, this._pPassStateMap, this._pShadersMap, this._pComplexPassEvaluateOutput);

				this._pVertexShader = this._pComplexPassEvaluateOutput.vertex;
				this._pPixelShader = this._pComplexPassEvaluateOutput.fragment;
			}

			return true;
		}

		_getState(eType: ERenderStates): ERenderStateValues {
			return !isNull(this._pPassStateMap) ? this._pPassStateMap[eType] : ERenderStateValues.UNDEF;
		}

		_getRenderStates(): IMap<ERenderStateValues> {
			return this._pPassStateMap;
		}

		private clearPassStates(): void {
			if (!isNull(this._pPassStateMap)) {
				render.clearRenderStateMap(this._pPassStateMap);
			}
		}

		private generateInfoAboutUsedVaraibles(): void {
			if (isNull(this._pSharedVariableMapV)) {
				this._pSharedVariableMapV = <IAFXVariableDeclMap>{};
				this._pGlobalVariableMapV = <IAFXVariableDeclMap>{};
				this._pUniformVariableMapV = <IAFXVariableDeclMap>{};
				this._pForeignVariableMapV = <IAFXVariableDeclMap>{};
				this._pTextureVariableMapV = <IAFXVariableDeclMap>{};
				this._pUsedComplexTypeMapV = <IAFXTypeMap>{};

				this._pSharedVariableMapP = <IAFXVariableDeclMap>{};
				this._pGlobalVariableMapP = <IAFXVariableDeclMap>{};
				this._pUniformVariableMapP = <IAFXVariableDeclMap>{};
				this._pForeignVariableMapP = <IAFXVariableDeclMap>{};
				this._pTextureVariableMapP = <IAFXVariableDeclMap>{};
				this._pUsedComplexTypeMapP = <IAFXTypeMap>{};

				this._pFullUniformVariableMap = <IAFXVariableDeclMap>{};
				this._pFullForeignVariableMap = <IAFXVariableDeclMap>{};
				this._pFullTextureVariableMap = <IAFXVariableDeclMap>{};
			}

			if (this._isComplexPass()) {
				for (var i in this._pShadersMap) {
					this.addInfoAbouUsedVariablesFromFunction(this._pShadersMap[i]);
				}
			}
			else {
				if (!isNull(this._pVertexShader)) {
					this.addInfoAbouUsedVariablesFromFunction(this._pVertexShader);
				}
				if (!isNull(this._pPixelShader)) {
					this.addInfoAbouUsedVariablesFromFunction(this._pPixelShader);
				}
			}

			if (!isNull(this._pOwnUsedForeignVariableMap)) {
				for (var i in this._pOwnUsedForeignVariableMap) {
					this._pFullForeignVariableMap[i] = this._pOwnUsedForeignVariableMap[i];
				}
			}
		}

		private addInfoAbouUsedVariablesFromFunction(pFunction: IAFXFunctionDeclInstruction): void {
			var pSharedVars: IAFXVariableDeclMap = pFunction._getSharedVariableMap();
			var pGlobalVars: IAFXVariableDeclMap = pFunction._getGlobalVariableMap();
			var pUniformVars: IAFXVariableDeclMap = pFunction._getUniformVariableMap();
			var pForeignVars: IAFXVariableDeclMap = pFunction._getForeignVariableMap();
			var pTextureVars: IAFXVariableDeclMap = pFunction._getTextureVariableMap();
			var pTypes: IAFXTypeMap = pFunction._getUsedComplexTypeMap();


			var pSharedVarsTo: IAFXVariableDeclMap = null;
			var pGlobalVarsTo: IAFXVariableDeclMap = null;
			var pUniformVarsTo: IAFXVariableDeclMap = null;
			var pForeignVarsTo: IAFXVariableDeclMap = null;
			var pTextureVarsTo: IAFXVariableDeclMap = null;
			var pTypesTo: IAFXTypeMap = null;

			if (pFunction._getFunctionType() === EFunctionType.k_Vertex) {
				pSharedVarsTo = this._pSharedVariableMapV;
				pGlobalVarsTo = this._pGlobalVariableMapV;
				pUniformVarsTo = this._pUniformVariableMapV;
				pForeignVarsTo = this._pForeignVariableMapV;
				pTextureVarsTo = this._pTextureVariableMapV;
				pTypesTo = this._pUsedComplexTypeMapV;
			}
			else {
				pSharedVarsTo = this._pSharedVariableMapP;
				pGlobalVarsTo = this._pGlobalVariableMapP;
				pUniformVarsTo = this._pUniformVariableMapP;
				pForeignVarsTo = this._pForeignVariableMapP;
				pTextureVarsTo = this._pTextureVariableMapP;
				pTypesTo = this._pUsedComplexTypeMapP;
			}

			for (var i in pSharedVars) {
				if (!isNull(pSharedVars[i]) && !pSharedVars[i]._isField()) {
					pSharedVarsTo[i] = pSharedVars[i];
				}
			}
			for (var i in pGlobalVars) {
				if (!isNull(pGlobalVars[i])) {
					pGlobalVarsTo[i] = pGlobalVars[i];
				}
			}
			for (var i in pUniformVars) {
				if (!isNull(pUniformVars[i])) {
					pUniformVarsTo[i] = pUniformVars[i];
					this._pFullUniformVariableMap[i] = pUniformVars[i];
				}
			}
			for (var i in pForeignVars) {
				if (!isNull(pForeignVars[i])) {
					pForeignVarsTo[i] = pForeignVars[i];
					this._pFullForeignVariableMap[i] = pForeignVars[i];
				}
			}
			for (var i in pTextureVars) {
				if (!isNull(pTextureVars[i])) {
					pTextureVarsTo[i] = pTextureVars[i];
					this._pFullTextureVariableMap[i] = pTextureVars[i];
				}
			}
			for (var i in pTypes) {
				if (!isNull(pTypes[i])) {
					pTypesTo[i] = pTypes[i];
				}
			}
		}

		static POST_EFFECT_SEMANTIC = "POST_EFFECT";
	}
}

