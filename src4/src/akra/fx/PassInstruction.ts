/// <reference path="../idl/IMap.ts" />
/// <reference path="../idl/ERenderStates.ts" />
/// <reference path="../idl/ERenderStateValues.ts" />

/// <reference path="../render/render.ts" />
/// <reference path="DeclInstruction.ts" />


module akra.fx {
	export class PassInstruction extends DeclInstruction implements IAFXPassInstruction {
		private _pTempNodeList: parser.IParseNode[] = null;
		private _pTempFoundedFuncList: IAFXFunctionDeclInstruction[] = null;
		private _pTempFoundedFuncTypeList: EFunctionType[] = null;
		private _pParseNode: parser.IParseNode = null;

		private _sFunctionCode: string = "";

		private _isComlexPass: boolean = false;
		private _pShadersMap: IAFXFunctionDeclMap = null;
		private _fnPassFunction: { (engine: any, foreigtn: any, uniforms: any): void; } = null;

		private _pVertexShader: IAFXFunctionDeclInstruction = null;
		private _pPixelShader: IAFXFunctionDeclInstruction = null;
		private _pPassStateMap: IMap<ERenderStateValues> = null;


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
			if (this.isComplexPass()) {
				this._sFunctionCode += sCode;
			}
		}

		_markAsComplex(isComplex: boolean): void {
			this._isComlexPass = isComplex;
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


		isComplexPass(): boolean {
			return this._isComlexPass;
		}

		getVertexShader(): IAFXFunctionDeclInstruction {
			return this._pVertexShader;
		}

		getPixelShader(): IAFXFunctionDeclInstruction {
			return this._pPixelShader;
		}

		addShader(pShader: IAFXFunctionDeclInstruction): void {
			var isVertex: boolean = pShader.getFunctionType() === EFunctionType.k_Vertex;

			if (this.isComplexPass()) {
				if (isNull(this._pShadersMap)) {
					this._pShadersMap = <IAFXFunctionDeclMap>{};
				}
				var iShader: uint = pShader._getInstructionID();
				this._pShadersMap[iShader] = pShader;

				var sCode: string = isVertex ? "this._pVertexShader=" : "this._pPixelShader=";
				sCode += "this._pShadersMap[" + iShader.toString() + "];"
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

		setState(eType: ERenderStates, eValue: ERenderStateValues): void {
			if (isNull(this._pPassStateMap)) {
				this._pPassStateMap = render.createRenderStateMap();
			}

			if (this.isComplexPass()) {
				this._addCodeFragment("this._pPassStateMap[" + eType + "]=" + eValue + ";");
			}
			else {
				this._pPassStateMap[eType] = eValue;
			}
		}

		finalizePass(): void {
			if (this.isComplexPass()) {
				this._fnPassFunction = <any>(new Function("engine", "foreigns", "uniforms", this._sFunctionCode));
			}

			this.generateInfoAboutUsedVaraibles();

			this._pTempNodeList = null;
			this._pTempFoundedFuncList = null;
			this._pTempFoundedFuncTypeList = null;
			this._pParseNode = null;
			this._sFunctionCode = "";
		}

		evaluate(pEngineStates: any, pForeigns: any, pUniforms: any): boolean {
			if (this.isComplexPass()) {
				this._pVertexShader = null;
				this._pPixelShader = null;
				this.clearPassStates();

				this._fnPassFunction.call(this, pEngineStates, pForeigns, pUniforms);
			}

			return true;
		}

		getState(eType: ERenderStates): ERenderStateValues {
			return !isNull(this._pPassStateMap) ? this._pPassStateMap[eType] : ERenderStateValues.UNDEF;
		}

		_getRenderStates(): IMap<ERenderStateValues> {
			return this._pPassStateMap;
		}

		private clearPassStates(): void {
			if (!isNull(this._pPassStateMap)) {
				this._pPassStateMap[ERenderStates.BLENDENABLE] = ERenderStateValues.UNDEF;
				this._pPassStateMap[ERenderStates.CULLFACEENABLE] = ERenderStateValues.UNDEF;
				this._pPassStateMap[ERenderStates.ZENABLE] = ERenderStateValues.UNDEF;
				this._pPassStateMap[ERenderStates.ZWRITEENABLE] = ERenderStateValues.UNDEF;
				this._pPassStateMap[ERenderStates.DITHERENABLE] = ERenderStateValues.UNDEF;
				this._pPassStateMap[ERenderStates.SCISSORTESTENABLE] = ERenderStateValues.UNDEF;
				this._pPassStateMap[ERenderStates.STENCILTESTENABLE] = ERenderStateValues.UNDEF;
				this._pPassStateMap[ERenderStates.POLYGONOFFSETFILLENABLE] = ERenderStateValues.UNDEF;
				this._pPassStateMap[ERenderStates.CULLFACE] = ERenderStateValues.UNDEF;
				this._pPassStateMap[ERenderStates.FRONTFACE] = ERenderStateValues.UNDEF;
				this._pPassStateMap[ERenderStates.SRCBLEND] = ERenderStateValues.UNDEF;
				this._pPassStateMap[ERenderStates.DESTBLEND] = ERenderStateValues.UNDEF;
				this._pPassStateMap[ERenderStates.ZFUNC] = ERenderStateValues.UNDEF;
				this._pPassStateMap[ERenderStates.ALPHABLENDENABLE] = ERenderStateValues.UNDEF;
				this._pPassStateMap[ERenderStates.ALPHATESTENABLE] = ERenderStateValues.UNDEF;
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

			if (this.isComplexPass()) {
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

			if (pFunction.getFunctionType() === EFunctionType.k_Vertex) {
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
				if (!isNull(pSharedVars[i]) && !pSharedVars[i].isField()) {
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

