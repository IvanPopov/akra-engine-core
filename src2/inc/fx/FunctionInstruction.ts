#ifndef AFXFUNCTIONINSTRUCTION
#define AFXFUNCTIONINSTRUCTION

#include "IAFXInstruction.ts"
#include "fx/Instruction.ts"
#include "fx/StmtInstruction.ts"

module akra.fx {
	/**
	 * Represent type func(...args)[:Semantic] [<Annotation> {stmts}]
	 * EMPTY_OPERTOR FunctionDefInstruction StmtBlockInstruction
	 */
	export class FunctionDeclInstruction extends DeclInstruction implements IAFXFunctionDeclInstruction {
		protected _pFunctionDefenition: FunctionDefInstruction = null;
		protected _pImplementation: StmtBlockInstruction = null;
		protected _eFunctionType: EFunctionType = EFunctionType.k_Function;
		
		protected _bUsedAsFunction: bool = false;
		protected _bUsedAsVertex: bool = false;
		protected _bUsedAsPixel: bool = false;
		protected _bCanUsedAsFunction: bool = true;

		protected _bUsedInVertex: bool = false;
		protected _bUsedInPixel: bool = false;		
		
		protected _pParseNode: IParseNode = null;
		protected _iImplementationScope: uint = UNDEFINE_SCOPE;

		protected _isInBlackList: bool = false;

		protected _pOutVariable: IAFXVariableDeclInstruction = null;

		//Info about used data
		protected _pUsedFunctionMap: IAFXFunctionDeclMap = null;
		protected _pUsedFunctionList: IAFXFunctionDeclInstruction[] = null;

		protected _pUsedVarTypeMap: IAFXTypeUseInfoMap = null;
		
		protected _pSharedVariableMap: IAFXVariableDeclMap = null;
		protected _pGlobalVariableMap: IAFXVariableDeclMap = null;
		protected _pUniformVariableMap: IAFXVariableDeclMap = null;
		protected _pForeignVariableMap: IAFXVariableDeclMap = null;

		// protected _pSharedVariableTypeList: IAFXVariableTypeInstruction[] = null;
		// protected _pGlobalVariableTypeList: IAFXVariableTypeInstruction[] = null;
		// protected _pUniformVariableTypeList: IAFXVariableTypeInstruction[] = null;
		// protected _pForeignVariableTypeList: IAFXVariableTypeInstructionnt[] = null;

		protected _pUsedTypeMap: IAFXTypeDeclMap = null;

		protected _pVertexShader: IAFXFunctionDeclInstruction = null;
		protected _pPixelShader: IAFXFunctionDeclInstruction = null;


		constructor() { 
			super();
			this._pInstructionList = [null, null];
			this._eInstructionType = EAFXInstructionTypes.k_FunctionDeclInstruction;
		}	

		toFinalCode(): string {
			var sCode = "";

			sCode += this._pFunctionDefenition.toFinalCode();
			sCode += this._pImplementation.toFinalCode();

			return sCode;
		}

		inline getType(): IAFXTypeInstruction {
			return <IAFXTypeInstruction>this.getReturnType();
		}

		inline getName(): string {
			return this._pFunctionDefenition.getName();
		}
		
		inline getNameId(): IAFXIdInstruction {
			return this._pFunctionDefenition.getNameId();
		}

		getArguments(): IAFXVariableDeclInstruction[] {
			return this._pFunctionDefenition.getArguments();
		}

		inline getNumNeededArguments(): uint {
			return this._pFunctionDefenition.getNumNeededArguments();
		}
		
		inline hasImplementation(): bool {
			return !isNull(this._pImplementation) || !isNull(this._pParseNode);
		}

		inline getReturnType(): IAFXVariableTypeInstruction {
			return this._pFunctionDefenition.getReturnType();
		}

		inline _setImplementationScope(iScope: uint): void {
			this._iImplementationScope = iScope;
		}

		inline _getImplementationScope(): uint {
			return this._iImplementationScope;
		}

		inline _setParseNode(pNode: IParseNode): void {
			this._pParseNode = pNode;
		}

		inline _getParseNode(): IParseNode {
			return this._pParseNode;
		}

		setFunctionDef(pFunctionDef: IAFXDeclInstruction): void {
			this._pFunctionDefenition = <FunctionDefInstruction>pFunctionDef;
			this._pInstructionList[0] = pFunctionDef;
			pFunctionDef.setParent(this);
			this._nInstructions = this._nInstructions === 0 ? 1 : this._nInstructions;
		}

		setImplementation(pImplementation: IAFXStmtInstruction): void {
			this._pImplementation = <StmtBlockInstruction>pImplementation;
			this._pInstructionList[1] = pImplementation;
			pImplementation.setParent(pImplementation);
			this._nInstructions = 2;

			this._pParseNode = null;
		}

		clone(pRelationMap?: IAFXInstructionMap = <IAFXInstructionMap>{}): IAFXFunctionDeclInstruction {
			var pClone: FunctionDeclInstruction = <FunctionDeclInstruction>super.clone(pRelationMap);
			
			if(!isNull(this._pOutVariable)){
				pClone._setOutVariable(<IAFXVariableDeclInstruction>pRelationMap[this._pOutVariable._getInstructionID()]);
			}

			var pUsedVarTypeMap: IAFXTypeUseInfoMap = this.cloneVarTypeUsedMap(this._pUsedVarTypeMap, pRelationMap);
			var pSharedVariableMap: IAFXVariableDeclMap = this.cloneVarDeclMap(this._pSharedVariableMap, pRelationMap);
			var pGlobalVariableMap: IAFXVariableDeclMap = this.cloneVarDeclMap(this._pGlobalVariableMap, pRelationMap);
			var pUniformVariableMap: IAFXVariableDeclMap = this.cloneVarDeclMap(this._pUniformVariableMap, pRelationMap);
			var pForeignVariableMap: IAFXVariableDeclMap = this.cloneVarDeclMap(this._pForeignVariableMap, pRelationMap);
			var pUsedTypeMap: IAFXTypeDeclMap = this.cloneTypeDeclMap(this._pUsedTypeMap, pRelationMap);

			pClone._setUsedFunctions(this._pUsedFunctionMap, this._pUsedFunctionList);
			pClone._setUsedVariableData(pUsedVarTypeMap, 
										pSharedVariableMap,
										pGlobalVariableMap,
										pUniformVariableMap,
										pForeignVariableMap,
										pUsedTypeMap);
			pClone._initAfterClone();

			return pClone;
		}

		_addOutVariable(pVariable: IAFXVariableDeclInstruction): bool {
			if(!isNull(this._pOutVariable)){
				return false;
			}

			if(!pVariable.getType().isEqual(this.getReturnType())){
				return false;
			}

			this._pOutVariable = pVariable;
			return true;
		}

		_getOutVariable(): IAFXVariableDeclInstruction{
			return this._pOutVariable;
		}

		_getVertexShader(): IAFXFunctionDeclInstruction {
			return this._pVertexShader;
		}

		_getPixelShader(): IAFXFunctionDeclInstruction {
			return this._pPixelShader;
		}

		_markUsedAs(eUsedType: EFunctionType): void {
			switch(eUsedType){
				case EFunctionType.k_Vertex:
					this._bUsedInVertex = true;
					this._bUsedAsVertex = true;
					break;
				case EFunctionType.k_Pixel:
					this._bUsedInPixel = true;
					this._bUsedAsPixel = true;
					break;
				case EFunctionType.k_Function:
					this._bUsedAsFunction = true;
					break;
			}
		}

		_isUsedAs(eUsedType: EFunctionType): bool {
			switch(eUsedType){
				case EFunctionType.k_Vertex:
					return this._bUsedAsVertex;
				case EFunctionType.k_Pixel:
					return this._bUsedAsPixel;
				case EFunctionType.k_Function:
					return this._bUsedAsFunction;
			}
		}

		_isUsedAsFunction(): bool {
			return this._bUsedAsFunction;
		}

		_isUsedAsVertex(): bool {
			return this._bUsedAsVertex;
		}

		_isUsedAsPixel(): bool {
			return this._bUsedAsPixel;
		}

		_markUsedInVertex(): void {
			this._bUsedInVertex = true;
		}

		_markUsedInPixel(): void {
			this._bUsedInPixel = true;
		}

		_isUsedInVertex(): bool {
			return this._bUsedInVertex;
		}

		_isUsedInPixel(): bool {
			return this._bUsedInPixel;
		}

		_isUsed(): bool{
			return this._bUsedAsFunction || this._bUsedAsVertex || this._bUsedAsPixel;
		}

		_checkVertexUsage(): bool {
			return this._isUsedInVertex() ? this._isForVertex() : true;
		}

		_checkPixelUsage(): bool {
			return this._isUsedInPixel() ? this._isForPixel() : true;
		}

		_checkDefenitionForVertexUsage(): bool {
			return this._pFunctionDefenition._checkForVertexUsage();
		}

		_checkDefenitionForPixelUsage(): bool {
			return this._pFunctionDefenition._checkForPixelUsage();
		}

		_canUsedAsFunction(): bool {
			return this._bCanUsedAsFunction && this._pFunctionDefenition._canUsedAsFunction();
		}

		_notCanUsedAsFunction(): void {
			this._bCanUsedAsFunction = false;
		}

		_addUsedFunction(pFunction: IAFXFunctionDeclInstruction): bool {
			if(isNull(this._pUsedFunctionMap)){
				this._pUsedFunctionMap = <IAFXFunctionDeclMap>{};
				this._pUsedFunctionList = [];
			}

			var iFuncId: uint = pFunction._getInstructionID();
			
			if(!isDef(this._pUsedFunctionMap[iFuncId])){
				this._pUsedFunctionMap[iFuncId] = pFunction;
				this._pUsedFunctionList.push(pFunction);
				return true;
			}

			return false;
		}

		_addUsedVariable(pVariable: IAFXVariableDeclInstruction): void {

		}

		_getUsedFunctionList(): IAFXFunctionDeclInstruction[] {
			return this._pUsedFunctionList;
		}

		_isBlackListFunction(): bool {
			return this._isInBlackList;
		}

		_addToBlackList(): void {
			this._isInBlackList = true;
		}

		_getStringDef(): string {
			return this._pFunctionDefenition._getStringDef();
		}
		
		_convertToVertexShader(): IAFXFunctionDeclInstruction {
			var pShader: FunctionDeclInstruction = null;

			if((!this._canUsedAsFunction() || !this._isUsedAsFunction()) &&
			   (!this._checkPixelUsage())){
			   	pShader = this;
			}
			else {
				pShader = <FunctionDeclInstruction>this.clone();
			}

			pShader._prepareForVertex();
			this._pVertexShader = pShader;

			return pShader;
		}

        _convertToPixelShader(): IAFXFunctionDeclInstruction {
        	var pShader: FunctionDeclInstruction = null;

        	if((!this._canUsedAsFunction() || !this._isUsedAsFunction()) &&
			   (!this._checkVertexUsage())){
			   	pShader = this;
			}
			else {
				pShader = <FunctionDeclInstruction>this.clone();
			}
        	
			pShader._prepareForPixel();
			this._pPixelShader = pShader;

			return pShader;
        }

        _prepareForVertex(): void {
        	this._setFunctionType(EFunctionType.k_Vertex);

        	var pShaderInputParamList: IAFXVariableDeclInstruction[] = this._pFunctionDefenition.getParameListForShaderInput();
        	for(var i: uint = 0; i < pShaderInputParamList.length; i++){
        		var pParamType: IAFXVariableTypeInstruction = pShaderInputParamList[i].getType();
        		
        		if (pParamType.isComplex() && 
        			isDef(this._pUsedVarTypeMap[pParamType._getInstructionID()]) &&
        			this._pUsedVarTypeMap[pParamType._getInstructionID()].isRead) {
        				
        				this.setError(TEMP_EFFECT_BAD_LOCAL_OF_SHADER_INPUT, { funcName: this.getName() });
        				return;
        		}
        	}

        	var pOutVariable: IAFXVariableDeclInstruction = this._getOutVariable();

        	if(!isNull(pOutVariable)){
        		if (isDef(this._pUsedVarTypeMap[pOutVariable.getType()._getInstructionID()]) &&
        			this._pUsedVarTypeMap[pOutVariable.getType()._getInstructionID()].isRead) {

        			this.setError(TEMP_EFFECT_BAD_LOCAL_OF_SHADER_OUTPUT, { funcName: this.getName() });
        			return;
        		}

        		pOutVariable._markAsShaderOutput(true);
        	}

        	if(this._pFunctionDefenition.isComplexShaderInput()){
        		pShaderInputParamList[0].setVisible(false);
        	}

        	this._pImplementation.prepareFor(EFunctionType.k_Vertex);
        	this._pFunctionDefenition.markAsShaderDef(true);
        	this.generatesVertexAttrubutes();
        	this.generateVertexVaryings();
        }

        _prepareForPixel(): void {
        	this._setFunctionType(EFunctionType.k_Pixel);

        	var pShaderInputParamList: IAFXVariableDeclInstruction[] = this._pFunctionDefenition.getParameListForShaderInput();
        	for(var i: uint = 0; i < pShaderInputParamList.length; i++){
        		var pParamType: IAFXVariableTypeInstruction = pShaderInputParamList[i].getType();
        		
        		if (pParamType.isComplex() && 
        			isDef(this._pUsedVarTypeMap[pParamType._getInstructionID()]) &&
        			this._pUsedVarTypeMap[pParamType._getInstructionID()].isRead) {
        				
        				this.setError(TEMP_EFFECT_BAD_LOCAL_OF_SHADER_INPUT, { funcName: this.getName() });
        				return;
        		}
        	}

        	if(this._pFunctionDefenition.isComplexShaderInput()){
        		pShaderInputParamList[0].setVisible(false);
        	}

        	this._pImplementation.prepareFor(EFunctionType.k_Pixel);
        	this._pFunctionDefenition.markAsShaderDef(true);

        	this.generatePixelVaryings();
        }

        _setOutVariable(pVar: IAFXVariableDeclInstruction): void {
        	this._pOutVariable = pVar;
        }

        _setUsedFunctions(pUsedFunctionMap: IAFXFunctionDeclMap,
        				  pUsedFunctionList: IAFXFunctionDeclInstruction[]): void {
        	this._pUsedFunctionMap = pUsedFunctionMap;
        	this._pUsedFunctionList = pUsedFunctionList;
        }

        _setUsedVariableData(pUsedVarTypeMap: IAFXTypeUseInfoMap, 
							pSharedVariableMap: IAFXVariableDeclMap,
							pGlobalVariableMap: IAFXVariableDeclMap,
							pUniformVariableMap: IAFXVariableDeclMap,
							pForeignVariableMap: IAFXVariableDeclMap,
							pUsedTypeMap: IAFXTypeDeclMap): void {
        	this._pUsedVarTypeMap = pUsedVarTypeMap;
        	this._pSharedVariableMap = pSharedVariableMap;
        	this._pGlobalVariableMap = pGlobalVariableMap;
        	this._pUniformVariableMap = pUniformVariableMap;
        	this._pForeignVariableMap = pForeignVariableMap;
        	this._pUsedTypeMap = pUsedTypeMap;
        }

        _setFunctionType(eFunctionType: EFunctionType){
        	this._eFunctionType = eFunctionType;
        }

        _initAfterClone(): void{
        	this._pFunctionDefenition = <FunctionDefInstruction>this._pInstructionList[0];
        	this._pImplementation = <StmtBlockInstruction>this._pInstructionList[1];
        }

        _generateInfoAboutUsedData(): void {
        	if(!isNull(this._pUsedVarTypeMap)){
        		return;
        	}

        	var pUsedData: IAFXTypeUseInfoMap = <IAFXTypeUseInfoMap>{};
        	this._pImplementation.addUsedData(pUsedData);

        	this._pUsedVarTypeMap = pUsedData;

        	if(isNull(this._pUsedTypeMap)){
        		this._pSharedVariableMap = <IAFXVariableDeclMap>{};
				this._pGlobalVariableMap = <IAFXVariableDeclMap>{};
				this._pUniformVariableMap = <IAFXVariableDeclMap>{};
				this._pForeignVariableMap = <IAFXVariableDeclMap>{};
				this._pUsedTypeMap = <IAFXTypeDeclMap>{};
        	}

        	this.addUsedTypeDecl(this.getReturnType().getBaseType());

        	for(var i in pUsedData) {
        		var pAnalyzedInfo: IAFXTypeUseInfoContainer = pUsedData[i];
        		var pAnalyzedType: IAFXVariableTypeInstruction = pAnalyzedInfo.type;
        		
        		if(pAnalyzedType._isInGlobalScope()){
        			this.addGlobalVariableType(pAnalyzedType, pAnalyzedInfo.isWrite, pAnalyzedInfo.isRead);
        		}
        		else if(pAnalyzedType.isUniform()){
        			this.addUniformParameter(pAnalyzedType);
        		}
        		else {
        			this.addUsedTypeDecl(pAnalyzedType.getBaseType());
        		}
        	}
        	if(!isNull(this._pUsedFunctionList)){
	        	for(var j: uint = 0; j < this._pUsedFunctionList.length; j++){
	        		this.addUsedInfoFromFunction(this._pUsedFunctionList[j]);
	        	}
        	}
        }

        inline _getSharedVariableMap(): IAFXVariableDeclMap{
        	return this._pSharedVariableMap;
        }
        
        inline _getGlobalVariableMap(): IAFXVariableDeclMap{
        	return this._pGlobalVariableMap;
        }
        
        inline _getUniformVariableMap(): IAFXVariableDeclMap{
        	return this._pUniformVariableMap;
        }
        
        inline _getForeignVariableMap(): IAFXVariableDeclMap{
        	return this._pForeignVariableMap;
        }

        inline _getUsedTypeMap(): IAFXTypeDeclMap{
        	return this._pUsedTypeMap;
        }

        private generatesVertexAttrubutes(): void {

        }
        
        private generateVertexVaryings(): void {

        }

        private generatePixelVaryings(): void {

        }

        private cloneVarTypeUsedMap(pMap: IAFXTypeUseInfoMap, pRelationMap: IAFXInstructionMap): IAFXTypeUseInfoMap{
        	var pCloneMap: IAFXTypeUseInfoMap = <IAFXTypeUseInfoMap>{};
        	
        	for(var j in pMap){
        		var pType: IAFXVariableTypeInstruction = isDef(pRelationMap[j]) ? pRelationMap[j] : pMap[j].type;
    			var id: uint = pType._getInstructionID();
    			pCloneMap[id] = {
    				type: pType,
    				isRead: pMap[j].isRead,
					isWrite: pMap[j].isWrite,
					numRead: pMap[j].numRead,
					numWrite: pMap[j].numWrite,
					numUsed: pMap[j].numUsed
    			}
        	}
        	
        	return pCloneMap;
        }

        private cloneVarDeclMap(pMap: IAFXVariableDeclMap, pRelationMap: IAFXInstructionMap): IAFXVariableDeclMap {
        	var pCloneMap: IAFXVariableDeclMap = <IAFXVariableDeclMap>{};

        	for(var i in pMap){
        		var pVar: IAFXVariableDeclInstruction = isDef(pRelationMap[i]) ? pRelationMap[i] : pMap[i];
        		var id: uint = pVar._getInstructionID();
        		pCloneMap[id] = pVar;
        	}

        	return pCloneMap;
        }

        private cloneTypeDeclMap(pMap: IAFXTypeDeclMap, pRelationMap: IAFXInstructionMap): IAFXTypeDeclMap {
        	var pCloneMap: IAFXTypeDeclMap = <IAFXVariableDeclMap>{};

        	for(var i in pMap){
        		var pVar: IAFXTypeDeclInstruction = (isDef(pRelationMap[i]) ? pRelationMap[i] : pMap[i]);
        		var id: uint = pVar._getInstructionID();
        		pCloneMap[id] = pVar;
        	}

        	return pCloneMap;
        }

        private addGlobalVariableType(pVariableType: IAFXVariableTypeInstruction, 
        							  isWrite: bool, isRead: bool): void {
        	if(!pVariableType.isFromVariableDecl()){
        		return;
        	}

        	var pVariable: IAFXVariableDeclInstruction = <IAFXVariableDeclInstruction>pVariableType._getParentVarDecl();
        	var pMainVariable: IAFXVariableDeclInstruction = pVariableType._getMainVariable();
        	var iMainVar: uint = pMainVariable._getInstructionID();
        	var iVar: uint = pVariable._getInstructionID();

        	if(pMainVariable.getType().isShared()){
        		this._pSharedVariableMap[iVar] = pVariable;
        		this._pSharedVariableMap[iMainVar] = pMainVariable;
        	}
        	else if(pMainVariable.getType().isForeign()){
        		this._pForeignVariableMap[iMainVar] = pMainVariable;
        	}
        	else if(isWrite){
        		this._pGlobalVariableMap[iMainVar] = pMainVariable;
        		if(isDefAndNotNull(this._pUniformVariableMap[iMainVar])){
        			this._pUniformVariableMap[iMainVar] = null;
        		}
        	}
        	else {
        		if(!isDef(this._pGlobalVariableMap[iMainVar])){
        			this._pUniformVariableMap[iMainVar] = pMainVariable;
        		}
        	}

        	this.addUsedTypeDecl(pMainVariable.getType().getBaseType());
        }

        private addUniformParameter(pType: IAFXVariableTypeInstruction): void {
        	var pMainVariable: IAFXVariableDeclInstruction = pType._getMainVariable();
        	var iMainVar: uint = pMainVariable._getInstructionID();
        	
        	if(isDef(this._pGlobalVariableMap[iMainVar])){
        		debug_error("UNEXPECTED ERROR WITH UNIFORM_PARAMETER");
        	}

        	this._pUniformVariableMap[iMainVar] = pMainVariable;
        	this.addUsedTypeDecl(pMainVariable.getType().getBaseType());
        }

        private addUsedTypeDecl(pType: IAFXTypeInstruction): void {
        	if(pType.isBase() || isDef(this._pUsedTypeMap[pType._getInstructionID()])){
        		return;
        	}

        	this._pUsedTypeMap[pType._getInstructionID()] = <IAFXTypeDeclInstruction>pType.getParent();
        	
        	var pFieldNameList: string[] = pType.getFieldNameList();

        	for(var i: uint = 0; i < pFieldNameList.length; i++){
        		this.addUsedTypeDecl(pType.getFieldType(pFieldNameList[i]).getBaseType());
        	}
        }

        private addUsedInfoFromFunction(pFunction: IAFXFunctionDeclInstruction): void {
        	pFunction._generateInfoAboutUsedData();
    		var pSharedVarMap: IAFXVariableDeclMap = pFunction._getSharedVariableMap();
    		var pForeignVarMap: IAFXVariableDeclMap = pFunction._getForeignVariableMap();
    		var pGlobalVarMap: IAFXVariableDeclMap = pFunction._getGlobalVariableMap();
    		var pUniformVarMap: IAFXVariableDeclMap = pFunction._getUniformVariableMap();
    		var pUsedTypeMap: IAFXTypeDeclMap = pFunction._getUsedTypeMap();

    		for(var j in pSharedVarMap){
    			this._pSharedVariableMap[pSharedVarMap[j]._getInstructionID()] = pSharedVarMap[j];
    		}

    		for(var j in pForeignVarMap){
    			this._pForeignVariableMap[pForeignVarMap[j]._getInstructionID()] = pForeignVarMap[j];
    		}

    		for(var j in pGlobalVarMap){
    			this._pGlobalVariableMap[pGlobalVarMap[j]._getInstructionID()] = pGlobalVarMap[j];

    			if(isDefAndNotNull(this._pUniformVariableMap[pGlobalVarMap[j]._getInstructionID()])){
    				this._pUniformVariableMap[pGlobalVarMap[j]._getInstructionID()] = null;
    			}
    		}

    		for(var j in pUniformVarMap){
    			if(!isDef(this._pGlobalVariableMap[pUniformVarMap[j]._getInstructionID()])){
    				this._pUniformVariableMap[pUniformVarMap[j]._getInstructionID()] = pUniformVarMap[j];
    			}
    		}

    		for(var j in pUsedTypeMap){
    			this._pUsedTypeMap[pUsedTypeMap[j]._getInstructionID()] = pUsedTypeMap[j];
    		}
        }
	}

	export class SystemFunctionInstruction extends DeclInstruction implements IAFXFunctionDeclInstruction {
	    private _pExprTranslator: ExprTemplateTranslator = null;
	    private _pName: IAFXIdInstruction = null;
	    private _pReturnType: VariableTypeInstruction = null;
	    private	_pArguments: IAFXTypedInstruction[] = null;

		constructor(sName: string, pReturnType: IAFXTypeInstruction,
					pExprTranslator: ExprTemplateTranslator,
					pArgumentTypes: IAFXTypeInstruction[]) {
			super();

			this._eInstructionType = EAFXInstructionTypes.k_SystemFunctionInstruction;	
			
			this._pName = new IdInstruction();
			this._pName.setName(sName);
			this._pName.setParent(this);

			this._pReturnType = new VariableTypeInstruction();
			this._pReturnType.pushType(pReturnType);
			this._pReturnType.setParent(this);

			this._pArguments = [];

			for(var i: uint = 0; i < pArgumentTypes.length; i++){
				var pArgument: TypedInstruction = new TypedInstruction();
				pArgument.setType(pArgumentTypes[i]);
				pArgument.setParent(this);

				this._pArguments.push(pArgument);
			}

			this._pExprTranslator = pExprTranslator;
		}

		setExprTranslator(pExprTranslator: ExprTemplateTranslator): void {
			this._pExprTranslator = pExprTranslator;
		}

		getNameId(): IAFXIdInstruction {
			return this._pName;
		}

		getArguments(): IAFXTypedInstruction[] {
			return this._pArguments;
		}

		inline getNumNeededArguments(): uint {
			return this._pArguments.length;
		}
		
		inline hasImplementation(): bool {
			return true;
		}

		inline getType(): IAFXVariableTypeInstruction {
			return this.getReturnType();
		}

		inline getReturnType(): IAFXVariableTypeInstruction {
			return this._pReturnType;
		}

		closeArguments(pArguments: IAFXInstruction[]): IAFXInstruction[]{
			return this._pExprTranslator.toInstructionList(pArguments);
		}

		setFunctionDef(pFunctionDef: IAFXDeclInstruction): void {
		}

		setImplementation(pImplementation: IAFXStmtInstruction): void {
		}

		inline clone(pRelationMap?: IAFXInstructionMap): SystemFunctionInstruction {
			return this;
		}

		_addOutVariable(pVariable: IAFXVariableDeclInstruction): bool{
			return false;
		}

		_getOutVariable(): IAFXVariableDeclInstruction{
			return null;
		}
		
		_getVertexShader(): IAFXFunctionDeclInstruction{
			return null;
		}

		_getPixelShader(): IAFXFunctionDeclInstruction{
			return null;
		}

		_markUsedAs(eUsedType: EFunctionType): void {
		}

		_isUsedAs(eUsedType: EFunctionType): bool{
			return true;
		}

		_isUsedAsFunction(): bool {
			return true;
		}

		_isUsedAsVertex(): bool {
			return true;
		}

		_isUsedAsPixel(): bool {
			return true;
		}

		_markUsedInVertex(): void {
		}

		_markUsedInPixel(): void {
		}

		_isUsedInVertex(): bool {
			return null;
		}

		_isUsedInPixel(): bool {
			return null;
		}

		_isUsed(): bool{
			return null;
		}

		_checkVertexUsage(): bool {
			return this._isForVertex();
		}

		_checkPixelUsage(): bool {
			return this._isForPixel();
		}

		_checkDefenitionForVertexUsage(): bool {
			return false;
		}

		_checkDefenitionForPixelUsage(): bool {
			return false;
		}

		_canUsedAsFunction(): bool{
			return true;
		}

		_notCanUsedAsFunction(): void{}

		_addUsedFunction(pFunction: IAFXFunctionDeclInstruction): bool {
			return false;
		}

		_addUsedVariable(pVariable: IAFXVariableDeclInstruction): void {

		}

		_getUsedFunctionList(): IAFXFunctionDeclInstruction[] {
			return null;
		}

		_isBlackListFunction(): bool {
			return false;
		}

		_addToBlackList(): void {
		}

		_getStringDef(): string {
			return "system_func";
		}

		_convertToVertexShader(): IAFXFunctionDeclInstruction {
			return null;
		}

        _convertToPixelShader(): IAFXFunctionDeclInstruction {
        	return null;
        }

        _prepareForVertex(): void{}
        _prepareForPixel(): void{}

        addUsedVariableType(pType: IAFXVariableTypeInstruction, eUsedMode: EVarUsedMode): bool {
        	return false;
        }

        _generateInfoAboutUsedData(): void{

        }

        inline _getSharedVariableMap(): IAFXVariableDeclMap{
			return null;
        }
        
        inline _getGlobalVariableMap(): IAFXVariableDeclMap{
        	return null;
        }
        
        inline _getUniformVariableMap(): IAFXVariableDeclMap{
        	return null;
        }
        
        inline _getForeignVariableMap(): IAFXVariableDeclMap{
        	return null;
        }

        inline _getUsedTypeMap(): IAFXTypeDeclMap{
        	return null;
        }

	}

	/**
	 * Represent type func(...args)[:Semantic]
	 * EMPTY_OPERTOR VariableTypeInstruction IdInstruction VarDeclInstruction ... VarDeclInstruction
	 */
	export class FunctionDefInstruction extends DeclInstruction {
		private _pParameterList: IAFXVariableDeclInstruction[] = null;
		private _pParamListForShaderCompile: IAFXVariableDeclInstruction[] = null;
		private _pParamListForShaderInput: IAFXVariableDeclInstruction[] = null;
		private _isComplexShaderInput: bool = false;

		private _pReturnType: IAFXVariableTypeInstruction = null;
		private _pFunctionName: IAFXIdInstruction = null;
		private _nParamsNeeded: uint = 0;
		private _sDefinition: string = "";
		private _isAnalyzedForVertexUsage: bool = false;
		private _isAnalyzedForPixelUsage: bool = false;
		private _bCanUsedAsFunction: bool = true;

		private _bShaderDef: bool = false;

		//private _sHash: string = "";

		constructor() {
			super();
			this._pInstructionList = null;
			this._pParameterList = [];
			this._eInstructionType = EAFXInstructionTypes.k_FunctionDefInstruction;
		}

		toFinalCode(): string {
			var sCode: string = "";

			if(!this.isShaderDef()){

				sCode += this._pReturnType.toFinalCode();
				sCode += " " + this._pFunctionName.toFinalCode();
				sCode += "(";

				for(var i: uint = 0; i < this._pParameterList.length; i++){
					sCode += this._pParameterList[i].toFinalCode();
					
					if(i !== this._pParameterList.length - 1){
						sCode += ",";
					}
				}

				sCode += ")";
			}
			else {
				sCode = "void " + this._pFunctionName.toFinalCode() + "()";
			}

			return sCode;
		}

		inline setType(pType: IAFXTypeInstruction): void {
			this.setReturnType(<IAFXVariableTypeInstruction>pType);
		}

		inline getType(): IAFXTypeInstruction {
			return <IAFXTypeInstruction>this.getReturnType();
		}

		inline setReturnType(pReturnType: IAFXVariableTypeInstruction): bool {
			this._pReturnType = pReturnType;
			pReturnType.setParent(this);
			return true;
		}
		inline getReturnType(): IAFXVariableTypeInstruction {
			return this._pReturnType;
		}

		inline setFunctionName(pNameId: IAFXIdInstruction): bool {
			this._pFunctionName = pNameId;
			pNameId.setParent(this);
			return true;
		}

		inline getName(): string {
			return this._pFunctionName.getName();
		}

		inline getNameId(): IAFXIdInstruction {
			return this._pFunctionName;
		}

		inline getArguments(): IAFXVariableDeclInstruction[]{
			return this._pParameterList;
		}

		inline getNumNeededArguments(): uint{
			return this._nParamsNeeded;
		}

		inline markAsShaderDef(isShaderDef: bool): void {
			this._bShaderDef = isShaderDef;
		}

		inline isShaderDef(): bool {
			return this._bShaderDef;
		}

		addParameter(pParameter: IAFXVariableDeclInstruction, isStrictModeOn?: bool): bool {
			if (this._pParameterList.length > this._nParamsNeeded && 
				!pParameter.hasInitializer()) {

				this.setError(EFFCCT_BAD_FUNCTION_PARAMETER_DEFENITION_NEED_DEFAULT, 
							  { funcName: this._pFunctionName.getName(),
							  	varName: pParameter.getName() });
				return false;
			}

			var pParameterType: IAFXVariableTypeInstruction = pParameter.getType();

			if(isDef(isStrictModeOn)){
				if(pParameterType.isPointer() || pParameterType._containPointer()){
					if (pParameterType.hasUsage("uniform") ||
						pParameterType.hasUsage("out") ||
						pParameterType.hasUsage("inout")){

						this.setError(EFFECT_BAD_FUNCTION_PARAMETER_USAGE, 
								  	  { funcName: this._pFunctionName.getName(),
								  	varName: pParameter.getName() });
						return false;
					}

					this._isAnalyzedForVertexUsage = false;
					this._isAnalyzedForPixelUsage = true;

					this._setForPixel(false);
					this._bCanUsedAsFunction = false;
					pParameterType._setVideoBufferInDepth();
				}
				else if(!isStrictModeOn){

					if (pParameterType.isComplex() &&
					    !pParameterType.hasFieldWithoutSemantic() &&
						pParameterType.hasAllUniqueSemantics()){
						
						if (pParameter.getSemantic() === "" &&
							pParameterType.hasFieldWithSematic("POSITION")){

							pParameterType._addPointIndexInDepth();
						}
						else {
							pParameterType.addPointIndex(false);
							pParameterType._setVideoBufferInDepth();
						}
					}
					else if(pParameter.getSemantic() !== ""){
						pParameterType.addPointIndex(false);
						pParameterType._setVideoBufferInDepth();	
					}				
				}
			}

			this._pParameterList.push(pParameter);
			pParameter.setParent(this);

			if(!pParameter.hasInitializer()){
				this._nParamsNeeded++;
			}

			return true;
		}

		inline getParameListForShaderInput(): IAFXVariableDeclInstruction[] {
			return this._pParamListForShaderInput;
		}

		inline isComplexShaderInput(): bool {
			return this._isComplexShaderInput;
		}

		clone(pRelationMap: IAFXInstructionMap = <IAFXInstructionMap>{}): FunctionDefInstruction {
			var pClone: FunctionDefInstruction = <FunctionDefInstruction>super.clone(pRelationMap);

			pClone.setFunctionName(<IAFXIdInstruction>this._pFunctionName.clone(pRelationMap));
			pClone.setReturnType(<IAFXVariableTypeInstruction>this.getReturnType().clone(pRelationMap));

			for(var i: uint = 0; i < this._pParameterList.length; i++){
				pClone.addParameter(this._pParameterList[i].clone(pRelationMap));
			}

			var pShaderParams: IAFXVariableDeclInstruction[] = [];
			for(var i: uint = 0; i < this._pParamListForShaderInput.length; i++){
				pShaderParams.push(this._pParamListForShaderInput[i].clone(pRelationMap));
			}

			pClone._setShaderParams(pShaderParams, this._isComplexShaderInput);
			pClone._setAnalyzedInfo(this._isAnalyzedForVertexUsage, 
									this._isAnalyzedForPixelUsage,
									this._bCanUsedAsFunction);

			return pClone;
		}

		_setShaderParams(pParamList: IAFXVariableDeclInstruction[], isComplexInput: bool): void {
			this._pParamListForShaderInput = pParamList;
			this._isComplexShaderInput = isComplexInput;
		}

		_setAnalyzedInfo(isAnalyzedForVertexUsage: bool, 
						 isAnalyzedForPixelUsage: bool,
						 bCanUsedAsFunction: bool): void {
			this._isAnalyzedForVertexUsage = isAnalyzedForVertexUsage;
			this._isAnalyzedForPixelUsage = isAnalyzedForPixelUsage;
			this._bCanUsedAsFunction = bCanUsedAsFunction;
		}

		_getStringDef(): string {
			if(this._sDefinition === ""){
				this._sDefinition = this._pReturnType.getHash() + " " + this.getName() + "(";
				
				for(var i: uint = 0; i < this._pParameterList.length; i++){
					this._sDefinition += this._pParameterList[i].getType().getHash() + ",";
				}
				
				this._sDefinition += ")";
			}

			return this._sDefinition;
		}

		_canUsedAsFunction(): bool {
			return this._bCanUsedAsFunction;
		}

		_checkForVertexUsage(): bool {
			if(this._isAnalyzedForVertexUsage){
				return this._isForVertex();
			}

			this._isAnalyzedForVertexUsage = true;

			var isGood: bool = true;
			
			isGood = this.checkReturnTypeForVertexUsage();
			if(!isGood){
				this._setForVertex(false);
				return false;
			}

			isGood = this.checkArgumentsForVertexUsage();
			if(!isGood){
				this._setForVertex(false);
				return false;
			}

			this._setForVertex(true);

			return true;
		}

		_checkForPixelUsage(): bool {
			if(this._isAnalyzedForPixelUsage){
				return this._isForPixel();
			}

			this._isAnalyzedForPixelUsage = true;

			var isGood: bool = true;
			
			isGood = this.checkReturnTypeForPixelUsage();
			if(!isGood){
				this._setForPixel(false);
				return false;
			}

			isGood = this.checkArgumentsForPixelUsage();
			if(!isGood){
				this._setForPixel(false);
				return false;
			}

			this._setForPixel(true);

			return true;
		}

		private checkReturnTypeForVertexUsage(): bool {
			var pReturnType: IAFXVariableTypeInstruction = this._pReturnType;
			var isGood: bool = true;

			if(pReturnType.isEqual(getEffectBaseType("void"))){
				return true;
			}

			if(pReturnType.isComplex()){
				isGood = !pReturnType.hasFieldWithoutSemantic();
				if(!isGood){
					return false;
				}

				isGood = pReturnType.hasAllUniqueSemantics();
				if(!isGood) {
					return false;
				}

				isGood = pReturnType.hasFieldWithSematic("POSITION");
				if(!isGood){
					return false;
				}

				isGood = !pReturnType._containSampler();
				if(!isGood){
					return false;
				}

				isGood = !pReturnType._containPointer() && !pReturnType.isPointer();
				if(!isGood){
					return false;
				}

				isGood = !pReturnType._containComplexType();
				if(!isGood){
					return false;
				}

				return true;
			}
			else {
				isGood = pReturnType.isEqual(getEffectBaseType("float4"));
				if(!isGood){
					return false;
				}

				isGood = (this.getSemantic() === "POSITION");
				if(!isGood){
					return false;
				}

				return true;
			}
		}

		private checkReturnTypeForPixelUsage(): bool {
			var pReturnType: IAFXVariableTypeInstruction = this._pReturnType;
			var isGood: bool = true;

			if(pReturnType.isEqual(getEffectBaseType("void"))){
				return true;
			}				

			isGood = pReturnType.isBase();
			if(!isGood){
				return false;
			}

			isGood = pReturnType.isEqual(getEffectBaseType("float4"));
			if(!isGood){
				return false;
			}

			isGood = this.getSemantic() === "COLOR";
			if(!isGood){
				return false;
			}

			return true;	
		}

		private checkArgumentsForVertexUsage(): bool {
			var pArguments: IAFXVariableDeclInstruction[] = this._pParameterList;
			var isAttributeByStruct: bool = false;
			var isAttributeByParams: bool = false;
			var isStartAnalyze: bool = false;

			this._pParamListForShaderInput = [];
			this._pParamListForShaderCompile = [];

			for(var i: uint = 0; i < pArguments.length; i++){
				var pParam: IAFXVariableDeclInstruction = pArguments[i];

				if(pParam.isUniform()){
					this._pParamListForShaderCompile.push(pParam);
					continue;
				}
				
				if(!isStartAnalyze){
					if(pParam.getSemantic() === ""){
						if (pParam.getType().isBase() ||
							pParam.getType().hasFieldWithoutSemantic() || 
							!pParam.getType().hasAllUniqueSemantics()){
							return false;
						}

						isAttributeByStruct = true;
					}
					else if(pParam.getSemantic() !== ""){
						if (pParam.getType().isComplex() && 
							(pParam.getType().hasFieldWithoutSemantic() || 
							!pParam.getType().hasAllUniqueSemantics())){
							return false;
						}

						isAttributeByParams = true;
					}

					isStartAnalyze = true;
				}
				else if (isAttributeByStruct){
					return false;
				}
				else if (isAttributeByParams){
					if(pParam.getSemantic() === "") {
						return false;
					}

					if (pParam.getType().isComplex() && 
						(pParam.getType().hasFieldWithoutSemantic() || 
						!pParam.getType().hasAllUniqueSemantics())){
						return false;
					}
				}

				this._pParamListForShaderInput.push(pParam);
			}

			if(isAttributeByStruct){
				this._isComplexShaderInput = true;
			}
			
			return true;
		}

		private checkArgumentsForPixelUsage(): bool {
			var pArguments: IAFXVariableDeclInstruction[] = this._pParameterList;
			var isVaryingsByStruct: bool = false;
			var isVaryingsByParams: bool = false;
			var isStartAnalyze: bool = false;

			this._pParamListForShaderInput = [];
			this._pParamListForShaderCompile = [];

			for(var i: uint = 0; i < pArguments.length; i++){
				var pParam: IAFXVariableDeclInstruction = pArguments[i];

				if(pParam.isUniform()){
					this._pParamListForShaderCompile.push(pParam);
					continue;
				}
				
				if(!isStartAnalyze){
					if(pParam.getSemantic() === ""){
						if (pParam.getType().isBase() ||
							pParam.getType().hasFieldWithoutSemantic() || 
							!pParam.getType().hasAllUniqueSemantics() ||
							pParam.getType()._containSampler() ||
							pParam.getType()._containPointer() ||
							pParam.getType().isPointer()){
							return false;
						}

						isVaryingsByStruct = true;
					}
					else if(pParam.getSemantic() !== ""){
						if (pParam.getType().isPointer() ||
						    pParam.getType()._containPointer() ||
						    pParam.getType()._containSampler() ||
						    isSamplerType(pParam.getType())){
							return false;
						}

						if (pParam.getType().isComplex() && 
							(pParam.getType().hasFieldWithoutSemantic() || 
							!pParam.getType().hasAllUniqueSemantics())){
							return false;
						}

						isVaryingsByParams = true;
					}

					isStartAnalyze = true;
				}
				else if (isVaryingsByStruct){
					return false;
				}
				else if (isVaryingsByParams){
					if(pParam.getSemantic() === "") {
						return false;
					}

					if (pParam.getType().isPointer() ||
					    pParam.getType()._containPointer() ||
					    pParam.getType()._containSampler() ||
					    isSamplerType(pParam.getType())){
						return false;
					}

					if (pParam.getType().isComplex() && 
						(pParam.getType().hasFieldWithoutSemantic() || 
						!pParam.getType().hasAllUniqueSemantics())){
						return false;
					}
				}

				this._pParamListForShaderInput.push(pParam);
			}

			if(isVaryingsByStruct){
				this._isComplexShaderInput = true;
			}
			
			return true;
		}
		// getHash(): string {
		// 	if(this._sHash === "") {
		// 		this.calcHash();
		// 	}

		// 	return this._sHash;
		// }

		// private calcHash(): void {
		// 	var sHash: string = "";
		// 	sHash = this._pFunctionName.getName();
		// 	sHash += "(";
			
		// 	for(var i: uint = 0; i < this._pParameterList.length; i++){
		// 		sHash += this._pParameterList[i]
		// 	}

		// }
	}
	
}

#endif