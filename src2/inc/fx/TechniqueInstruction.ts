#ifndef AFXTECHNIQUEINSTRUCTION_TS
#define AFXTECHNIQUEINSTRUCTION_TS

#include "fx/Instruction.ts"
#include "render/renderUtil.ts"

#define POST_EFFECT_SEMANTIC "POST_EFFECT"

module akra.fx {
	export class PassInstruction extends DeclInstruction implements IAFXPassInstruction {
		private _pTempNodeList: IParseNode[] = null;
		private _pTempFoundedFuncList: IAFXFunctionDeclInstruction[] = null;
		private _pTempFoundedFuncTypeList: EFunctionType[] = null;
		private _pParseNode: IParseNode = null;
		
		private _sFunctionCode: string = "";

		private _isComlexPass: bool = false;
		private _pShadersMap: IAFXFunctionDeclMap = null;
		private _fnPassFunction: {(engine: any, foreigtn: any, uniforms: any): void;} = null;

		private _pVertexShader: IAFXFunctionDeclInstruction = null;
		private _pPixelShader: IAFXFunctionDeclInstruction = null;
		private _pPassStateMap: IPassStateMap = null;


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


		constructor(){
			super();
			this._pInstructionList = null;
			this._eInstructionType = EAFXInstructionTypes.k_PassInstruction;
		}

		_addFoundFunction(pNode: IParseNode, pShader: IAFXFunctionDeclInstruction, eType: EFunctionType): void{
			if(isNull(this._pTempNodeList)){
				this._pTempNodeList = [];
				this._pTempFoundedFuncList = [];
				this._pTempFoundedFuncTypeList = [];
			}

			this._pTempNodeList.push(pNode);
			this._pTempFoundedFuncList.push(pShader);
			this._pTempFoundedFuncTypeList.push(eType);
		}

		_getFoundedFunction(pNode: IParseNode): IAFXFunctionDeclInstruction {
			if(isNull(this._pTempNodeList)){
				return null;
			}

			for(var i: uint = 0; i < this._pTempNodeList.length; i++){
				if(this._pTempNodeList[i] === pNode){
					return this._pTempFoundedFuncList[i];
				}
			}

			return null;
		}

		_getFoundedFunctionType(pNode: IParseNode): EFunctionType {
			if(isNull(this._pTempNodeList)){
				return null;
			}

			for(var i: uint = 0; i < this._pTempNodeList.length; i++){
				if(this._pTempNodeList[i] === pNode){
					return this._pTempFoundedFuncTypeList[i];
				}
			}

			return null;
		}

		_setParseNode(pNode: IParseNode): void {
        	this._pParseNode = pNode;
        }
        
        _getParseNode(): IParseNode{
        	return this._pParseNode;
        }

        _addCodeFragment(sCode: string): void {
        	if(this.isComplexPass()){
        		this._sFunctionCode += sCode;
        	}
        }

        inline _markAsComplex(isComplex: bool): void{
        	this._isComlexPass = isComplex;
        }

        inline _getSharedVariableMapV(): IAFXVariableDeclMap{
        	return this._pSharedVariableMapV;
        }
        
        inline _getGlobalVariableMapV(): IAFXVariableDeclMap{
        	return this._pGlobalVariableMapV;
        }
        
        inline _getUniformVariableMapV(): IAFXVariableDeclMap{
        	return this._pUniformVariableMapV;
        }
        
        inline _getForeignVariableMapV(): IAFXVariableDeclMap{
        	return this._pForeignVariableMapV;
        }

        inline _getTextureVariableMapV(): IAFXVariableDeclMap{
        	return this._pTextureVariableMapV;
        }

        inline _getUsedComplexTypeMapV(): IAFXTypeMap{
        	return this._pUsedComplexTypeMapV;
        }

        inline _getSharedVariableMapP(): IAFXVariableDeclMap{
        	return this._pSharedVariableMapP;
        }
        
        inline _getGlobalVariableMapP(): IAFXVariableDeclMap{
        	return this._pGlobalVariableMapP;
        }
        
        inline _getUniformVariableMapP(): IAFXVariableDeclMap{
        	return this._pUniformVariableMapP;
        }
        
        inline _getForeignVariableMapP(): IAFXVariableDeclMap{
        	return this._pForeignVariableMapP;
        }

        inline _getTextureVariableMapP(): IAFXVariableDeclMap{
        	return this._pTextureVariableMapP;
        }

        inline _getUsedComplexTypeMapP(): IAFXTypeMap{
        	return this._pUsedComplexTypeMapP;
        }

        inline _getFullUniformMap(): IAFXVariableDeclMap {
        	return this._pFullUniformVariableMap;
        }

        inline _getFullForeignMap(): IAFXVariableDeclMap {
        	return this._pFullForeignVariableMap;
        }

        inline _getFullTextureMap(): IAFXVariableDeclMap {
        	return this._pFullTextureVariableMap;
        }


        inline isComplexPass(): bool {
        	return this._isComlexPass;
        }

        inline getVertexShader(): IAFXFunctionDeclInstruction {
			return this._pVertexShader;
		}

		inline getPixelShader(): IAFXFunctionDeclInstruction {
			return this._pPixelShader;
		}

        addShader(pShader: IAFXFunctionDeclInstruction): void {
        	var isVertex: bool = pShader.getFunctionType() === EFunctionType.k_Vertex;

        	if(this.isComplexPass()){
        		if(isNull(this._pShadersMap)){
        			this._pShadersMap = <IAFXFunctionDeclMap>{};
        		}
        		var iShader: uint = pShader._getInstructionID();
        		this._pShadersMap[iShader] = pShader;

        		var sCode: string = isVertex ? "this._pVertexShader=" : "this._pPixelShader=";
        		sCode += "this._pShadersMap["+ iShader.toString() +"];"
        		this._addCodeFragment(sCode);
        	}
        	else {
        		if(isVertex){
        			this._pVertexShader = pShader;
        		}
        		else {
        			this._pPixelShader = pShader;
        		}
        	}
        }

        setState(eType: EPassState, eValue: EPassStateValue): void {
        	if(isNull(this._pPassStateMap)){
        		this._pPassStateMap = render.createRenderStateMap();
        	}

        	if(this.isComplexPass()){
        		this._addCodeFragment("this._pPassStateMap[" + eType + "]=" + eValue+ ";");
        	}
        	else {
        		this._pPassStateMap[eType] = eValue;
        	}
        }

        finalizePass(): void {
        	if(this.isComplexPass()){
        		this._fnPassFunction = <any>(new Function("engine", "foreigns", "uniforms", this._sFunctionCode));
        	}

        	this.generateInfoAboutUsedVaraibles();

        	this._pTempNodeList = null;
			this._pTempFoundedFuncList = null;
			this._pTempFoundedFuncTypeList = null;
			this._pParseNode= null;
			this._sFunctionCode = "";
        }

        evaluate(pEngineStates: any, pForeigns: any, pUniforms: any): bool {
        	if(this.isComplexPass()){
        		this._pVertexShader = null;
        		this._pPixelShader = null;
        		this.clearPassStates();        		

        		this._fnPassFunction.call(this, pEngineStates, pForeigns, pUniforms);
        	}

        	return true;
        }

        inline getState(eType: EPassState): EPassStateValue {
        	return !isNull(this._pPassStateMap) ? this._pPassStateMap[eType] : EPassStateValue.UNDEF;
        }

        inline _getRenderStates(): IRenderStateMap {
            return this._pPassStateMap;
        }

        private clearPassStates(): void {
        	if(!isNull(this._pPassStateMap)){
        		this._pPassStateMap[EPassState.BLENDENABLE] = EPassStateValue.UNDEF;
				this._pPassStateMap[EPassState.CULLFACEENABLE] = EPassStateValue.UNDEF;
				this._pPassStateMap[EPassState.ZENABLE] = EPassStateValue.UNDEF;
				this._pPassStateMap[EPassState.ZWRITEENABLE] = EPassStateValue.UNDEF;
				this._pPassStateMap[EPassState.DITHERENABLE] = EPassStateValue.UNDEF;
				this._pPassStateMap[EPassState.SCISSORTESTENABLE] = EPassStateValue.UNDEF;
				this._pPassStateMap[EPassState.STENCILTESTENABLE] = EPassStateValue.UNDEF;
				this._pPassStateMap[EPassState.POLYGONOFFSETFILLENABLE] = EPassStateValue.UNDEF;
				this._pPassStateMap[EPassState.CULLFACE] = EPassStateValue.UNDEF;
				this._pPassStateMap[EPassState.FRONTFACE] = EPassStateValue.UNDEF;
				this._pPassStateMap[EPassState.SRCBLEND] = EPassStateValue.UNDEF;
				this._pPassStateMap[EPassState.DESTBLEND] = EPassStateValue.UNDEF;
				this._pPassStateMap[EPassState.ZFUNC] = EPassStateValue.UNDEF;
				this._pPassStateMap[EPassState.ALPHABLENDENABLE] = EPassStateValue.UNDEF;
				this._pPassStateMap[EPassState.ALPHATESTENABLE] = EPassStateValue.UNDEF;
        	}
		}

        private generateInfoAboutUsedVaraibles(): void {
        	if(isNull(this._pSharedVariableMapV)){
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

        	if(this.isComplexPass()){
        		for(var i in this._pShadersMap){
        			this.addInfoAbouUsedVariablesFromFunction(this._pShadersMap[i]);
        		}
        	}
        	else {
        		if(!isNull(this._pVertexShader)){
        			this.addInfoAbouUsedVariablesFromFunction(this._pVertexShader);
        		}
        		if(!isNull(this._pPixelShader)){
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

        	if(pFunction.getFunctionType() === EFunctionType.k_Vertex){
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

        	for(var i in pSharedVars){
        		if(!isNull(pSharedVars[i]) && !pSharedVars[i].isField()){
        			pSharedVarsTo[i] = pSharedVars[i];
        		}
        	}
        	for(var i in pGlobalVars){
        		if(!isNull(pGlobalVars[i])){
        			pGlobalVarsTo[i] = pGlobalVars[i];
        		}
        	}
        	for(var i in pUniformVars){
        		if(!isNull(pUniformVars[i])){
        			pUniformVarsTo[i] = pUniformVars[i];
        			this._pFullUniformVariableMap[i] = pUniformVars[i];
        		}
        	}
        	for(var i in pForeignVars){
        		if(!isNull(pForeignVars[i])){
        			pForeignVarsTo[i] = pForeignVars[i];
        			this._pFullForeignVariableMap[i] = pForeignVars[i];
        		}
        	}
        	for(var i in pTextureVars){
        		if(!isNull(pTextureVars[i])){
        			pTextureVarsTo[i] = pTextureVars[i];
        			this._pFullTextureVariableMap[i] = pTextureVars[i];
        		}
        	}
        	for(var i in pTypes){
        		if(!isNull(pTypes[i])){
        			pTypesTo[i] = pTypes[i];
        		}
        	}
        }
	}


	export class TechniqueInstruction extends DeclInstruction implements IAFXTechniqueInstruction {
		private _sName: string = "";
		private _hasComplexName: bool = false;
		private _pParseNode: IParseNode = null;
		private _pSharedVariableListV: IAFXVariableDeclInstruction[] = null;
		private _pSharedVariableListP: IAFXVariableDeclInstruction[] = null;
		private _pPassList: IAFXPassInstruction[] = null;
        
        private _bHasImportedTechniqueFromSameEffect: bool = false;
        private _pImportedTechniqueList: IAFXImportedTechniqueInfo[] = null;

		private _pFullComponentList: IAFXComponent[] = null;
		private _pFullComponentShiftList: int[] = null;
		
        private _nTotalPasses: uint = 0;
		private _isPostEffect: bool = false;
        private _isFinalize: bool = false;

		constructor() {
			super();
			this._pInstructionList = null;
			this._eInstructionType = EAFXInstructionTypes.k_TechniqueInstruction;
		}

		setName(sName: string, isComplexName: bool): void {
			this._sName = sName;
			this._hasComplexName = isComplexName;
		}

		getName(): string {
			return this._sName;
		}

		setSemantic(sSemantic: string): void {
			super.setSemantic(sSemantic);

			if(sSemantic === POST_EFFECT_SEMANTIC){
				this._isPostEffect = true;
			}
			else {
				this._isPostEffect = false;
			}
		}

        hasComplexName(): bool{
        	return this._hasComplexName;
        }

        isPostEffect(): bool {
        	return this._isPostEffect;
        }

        getSharedVariablesForVertex(): IAFXVariableDeclInstruction[] {
        	return this._pSharedVariableListV;
        }

        getSharedVariablesForPixel(): IAFXVariableDeclInstruction[] {
        	return this._pSharedVariableListP;
        }

		addPass(pPass: IAFXPassInstruction): void {
			if(isNull(this._pPassList)){
				this._pPassList = [];
			}

			this._pPassList.push(pPass);
		}

		getPassList(): IAFXPassInstruction[]{
			return this._pPassList;
		}

		getPass(iPass: uint): IAFXPassInstruction{
			return iPass < this._pPassList.length ? this._pPassList[iPass] : null;
		}

		totalOwnPasses(): uint{
			return this._pPassList.length;
		}

        totalPasses(): uint{
        	return this._nTotalPasses;
        } 
        
        addTechniqueFromSameEffect(pTechnique: IAFXTechniqueInstruction, iShift: uint): void {
            if(isNull(this._pImportedTechniqueList)){
                this._pImportedTechniqueList = [];
            }

            this._pImportedTechniqueList.push({
                technique: pTechnique,
                component: null,
                shift: iShift
            });

            this._bHasImportedTechniqueFromSameEffect = true;
        }

		addComponent(pComponent: IAFXComponent, iShift: int): void{
			if(isNull(this._pImportedTechniqueList)){
				this._pImportedTechniqueList = [];
			}

            this._pImportedTechniqueList.push({
                technique: pComponent.getTechnique(),
                component: pComponent,
                shift: iShift
            });
		}

        getFullComponentList(): IAFXComponent[]{
        	return this._pFullComponentList;
        }

        getFullComponentShiftList(): int[]{
        	return this._pFullComponentShiftList;
        }

		checkForCorrectImports(): bool {
			return true;
		}

		setGlobalParams(sProvideNameSpace: string, 
                        pGlobalImportList: IAFXImportedTechniqueInfo[]): void {
			this.generateListOfSharedVariables();

			if(!this.hasComplexName() && sProvideNameSpace !== ""){
				this._sName = sProvideNameSpace + "." + this._sName;
			}

			if(!isNull(pGlobalImportList)){
				if(!isNull(this._pImportedTechniqueList)){
					this._pImportedTechniqueList = pGlobalImportList.concat(this._pImportedTechniqueList);
				}
				else {
					this._pImportedTechniqueList = pGlobalImportList.concat();
				}
			}

            if(!this._bHasImportedTechniqueFromSameEffect){
                this.generateFullListOfComponent();
                this._isFinalize = true;
            }
		}

        finalize(pComposer: IAFXComposer): void {
            if(this._isFinalize){
                return;
            }

            for(var i: uint = 0; i < this._pImportedTechniqueList.length; i++){
                var pInfo: IAFXImportedTechniqueInfo = this._pImportedTechniqueList[i];

                if(isNull(pInfo.component)){
                    pInfo.component = pComposer.getComponentByName(pInfo.technique.getName());
                }
            }
            
            this.generateFullListOfComponent();
            this._isFinalize = true;
        }

		private generateListOfSharedVariables(): void {
			this._pSharedVariableListV = [];
			this._pSharedVariableListP = [];

			for(var i: uint = 0; i < this._pPassList.length; i++){
				var pSharedV: IAFXVariableDeclMap = this._pPassList[i]._getSharedVariableMapV();
				var pSharedP: IAFXVariableDeclMap = this._pPassList[i]._getSharedVariableMapP();

				for(var j in pSharedV){
					this.addSharedVariable(pSharedV[j], EFunctionType.k_Vertex);
				}

				for(var j in pSharedP){
					this.addSharedVariable(pSharedP[j], EFunctionType.k_Pixel);
				}
			}
		}

		private addSharedVariable(pVar: IAFXVariableDeclInstruction, eType: EFunctionType): void {
			var pAddTo: IAFXVariableDeclInstruction[] = null;

			if(eType === EFunctionType.k_Vertex){
				pAddTo = this._pSharedVariableListV;
			}
			else {
				pAddTo = this._pSharedVariableListP;
			}

			for(var i: uint = 0; i < pAddTo.length; i++) {
				if(pAddTo[i] === pVar){
					return;
				}
			}

			pAddTo.push(pVar);
		}

		private generateFullListOfComponent(): void {
			this._nTotalPasses = this.totalOwnPasses();

			if(isNull(this._pImportedTechniqueList)){
				return;
			}

			this._pFullComponentList = [];
			this._pFullComponentShiftList = [];

			for(var i: uint = 0; i < this._pImportedTechniqueList.length; i++){
                var pInfo: IAFXImportedTechniqueInfo = this._pImportedTechniqueList[i];

				var pTechnique: IAFXTechniqueInstruction = pInfo.technique;
				var iMainShift: int = pInfo.shift;
				var pAddComponentList: IAFXComponent[] = pTechnique.getFullComponentList();
				var pAddComponentShiftList: int[] = pTechnique.getFullComponentShiftList();

				if(!isNull(pAddComponentList)){
					for(var j: uint = 0; j < pAddComponentList.length; i++){
						this._pFullComponentList.push(pAddComponentList[j]);
						this._pFullComponentShiftList.push(pAddComponentShiftList[j] + iMainShift);
					}
				}

				this._pFullComponentList.push(pInfo.component);
				this._pFullComponentShiftList.push(iMainShift);

				if(this._nTotalPasses < iMainShift + pTechnique.totalPasses()) {
					this._nTotalPasses = iMainShift + pTechnique.totalPasses();
				}
			}
		}
	}
}

#endif