#ifndef AFXINSTRUCTION_TS
#define AFXINSTRUCTION_TS

#include "IAFXInstruction.ts"
#include "fx/EffectErrors.ts"
#include "fx/EffectUtil.ts"
#include "IParser.ts"
#include "fx/Effect.ts"
#include "util/unique.ts"

module akra.fx {
    export function getEffectBaseType(sTypeName: string): SystemTypeInstruction {
    	return !isNull(Effect.pSystemTypes[sTypeName]) ? (Effect.pSystemTypes[sTypeName] || null) : null;
    }

    export function isSamplerType(pType: IAFXVariableTypeInstruction): bool {
    	return pType.isEqual(getEffectBaseType("sampler")) ||
    		   pType.isEqual(getEffectBaseType("sampler2D")) ||
    		   pType.isEqual(getEffectBaseType("samplerCUBE")) ||
    		   pType.isEqual(getEffectBaseType("video_buffer"));
    }

    #define UNDEFINE_LENGTH 0xffffff
    #define UNDEFINE_SIZE 0xffffff
    #define UNDEFINE_SCOPE 0xffffff
    #define UNDEFINE_PADDING 0xffffff
    #define UNDEFINE_NAME "undef"

	export class Instruction implements IAFXInstruction{
		protected _pParentInstruction: IAFXInstruction = null;
		protected _sOperatorName: string = null;
		protected _pInstructionList: IAFXInstruction[] = null;
		protected _nInstructions: uint = 0;
		protected readonly _eInstructionType: EAFXInstructionTypes = 0;
		protected _pLastError: IAFXInstructionError = null;
		protected _bErrorOccured: bool = false;
		protected _iInstructionID: uint = 0;
		protected _iScope: uint = UNDEFINE_SCOPE;
		private static _nInstructionCounter: uint = 0;

		private _isVisible: bool = true;

		inline getGuid(): uint {
			return this._getInstructionID();
		}
		
		inline getParent(): IAFXInstruction{
			return this._pParentInstruction;
		}

		inline setParent(pParentInstruction: IAFXInstruction): void {
			this._pParentInstruction = pParentInstruction;
		}

		inline getOperator(): string {
			return this._sOperatorName;
		}

		inline setOperator(sOperator: string): void {
			this._sOperatorName = sOperator;
		}

		inline getInstructions(): IAFXInstruction[] {
			return this._pInstructionList;
		}

		inline setInstructions(pInstructionList: IAFXInstruction[]): void{
			this._pInstructionList = pInstructionList;
		}

		inline _getInstructionType(): EAFXInstructionTypes {
			return this._eInstructionType;
		}

		inline _getInstructionID(): uint {
			return this._iInstructionID;
		}

		_getScope(): uint {
			return this._iScope !== UNDEFINE_SCOPE ? this._iScope : 
						!isNull(this.getParent()) ? this.getParent()._getScope() : UNDEFINE_SCOPE;
		}

        inline _setScope(iScope: uint): void {
        	this._iScope = iScope;
        }

        inline _isInGlobalScope(): bool{
        	return this._getScope() === 0;
        }

		inline getLastError(): IAFXInstructionError {
			return this._pLastError;
		}

		inline setError(eCode: uint, pInfo?: any = null): void {
			this._pLastError.code = eCode;
			this._pLastError.info = pInfo;
			this._bErrorOccured = true;
		}

		inline clearError(): void {
			this._bErrorOccured = false;
			this._pLastError.code = 0;
			this._pLastError.info = null;
		}

		inline isErrorOccured(): bool {
			return this._bErrorOccured;
		}

		inline setVisible(isVisible: bool): void {
            this._isVisible = isVisible;
        }

        inline isVisible(): bool {
            return this._isVisible;
        }

        inline initEmptyInstructions(): void {
        	this._pInstructionList = [];
        }

		constructor(){
			this._iInstructionID = Instruction._nInstructionCounter++;
			this._pParentInstruction = null;
			this._sOperatorName = null;
			this._pInstructionList = null;
			this._nInstructions = 0;
			this._eInstructionType = EAFXInstructionTypes.k_Instruction;
			this._pLastError = {code: 0, info: null};
		}

		push(pInstruction: IAFXInstruction, isSetParent?: bool = false): void {
			if(!isNull(this._pInstructionList)){
				this._pInstructionList[this._nInstructions] = pInstruction;
				this._nInstructions += 1;
			}
			if(isSetParent && !isNull(pInstruction)){
				pInstruction.setParent(this);
			}
		}

    	addRoutine(fnRoutine: IAFXInstructionRoutine, iPriority?: uint): void {
    		//TODO
    	}

    	prepareFor(eUsedType: EFunctionType): void {
    		if(!isNull(this._pInstructionList) && this._nInstructions > 0) {
    			for(var i: uint = 0; i < this._nInstructions; i++){
    				this._pInstructionList[i].prepareFor(eUsedType);
    			}
    		}
    	}
    	/**
    	 * Проверка валидности инструкции
    	 */
    	check(eStage: ECheckStage, pInfo: any = null): bool {
    		if(this._bErrorOccured){
    			return false;
    		}
    		else {
    			return true;
    		}
    	}

    	/**
    	 * Подготовка интсрукции к дальнейшему анализу
    	 */
    	prepare(): bool {
    		return true;
    	}

    	toString(): string {
    		return null;
    	}

    	toFinalCode(): string {
    		return "";
    	}

    	clone(pRelationMap?: IAFXInstructionMap = <IAFXInstructionMap>{}): IAFXInstruction {
    		if(isDef(pRelationMap[this._getInstructionID()])){
    			return pRelationMap[this._getInstructionID()];
    		}

    		var pNewInstruction: IAFXInstruction = new this["constructor"]();
    		var pParent: IAFXInstruction = this.getParent() || null;

    		if(!isNull(pParent) && isDef(pRelationMap[pParent._getInstructionID()])){
    			pParent = pRelationMap[pParent._getInstructionID()];
    		}

    		pNewInstruction.setParent(pParent);
    		pRelationMap[this._getInstructionID()] = pNewInstruction;

    		if(!isNull(this._pInstructionList) && isNull(pNewInstruction.getInstructions())){
    			pNewInstruction.initEmptyInstructions();
    		}

    		for(var i: uint = 0; i < this._nInstructions; i++){
    			pNewInstruction.push(this._pInstructionList[i].clone(pRelationMap));
    		}

    		pNewInstruction.setOperator(this.getOperator());

    		return pNewInstruction;
    	}
	}

	export class InstructionCollector extends Instruction {
		constructor(){
			super();
			this._pInstructionList = [];
			this._eInstructionType = EAFXInstructionTypes.k_InstructionCollector;
		}

		toFinalCode(): string {
    		var sCode: string = "";
    		for(var i: uint = 0; i < this._nInstructions; i++){
    			sCode += this.getInstructions()[i].toFinalCode();
    		}

    		return sCode;
    	}
	}

	export class SimpleInstruction extends Instruction implements IAFXSimpleInstruction{
		private _sValue: string = "";
		
		constructor(sValue: string){
			super();
			this._pInstructionList = null;
			this._eInstructionType = EAFXInstructionTypes.k_SimpleInstruction;

			this._sValue = sValue;
		}

		inline setValue(sValue: string): void {
			this._sValue = sValue;
		}

		inline isValue(sValue: string): bool {
			return (this._sValue === sValue);
		}

		toString(): string{
			return this._sValue;
		}

		toFinalCode(): string{
			return this._sValue;
		}

		clone(pRelationMap?: IAFXInstructionMap): SimpleInstruction {
			var pClone: SimpleInstruction = <SimpleInstruction>super.clone(pRelationMap);
			pClone.setValue(this._sValue);
			return pClone;
		}
	}

	

	export class TypedInstruction extends Instruction implements IAFXTypedInstruction {
		protected _pType: IAFXTypeInstruction;

		constructor(){
			super();
			this._pType = null;
			this._eInstructionType = EAFXInstructionTypes.k_TypedInstruction;
		}

		getType(): IAFXTypeInstruction {
			return this._pType;
		}

		setType(pType: IAFXTypeInstruction): void {
			this._pType = pType;
		}

		clone(pRelationMap?: IAFXInstructionMap = <IAFXInstructionMap>{}): IAFXTypedInstruction {
			var pClonedInstruction: IAFXTypedInstruction = <IAFXTypedInstruction>(super.clone(pRelationMap));
			if(!isNull(this.getType())) {
				pClonedInstruction.setType(this.getType().clone(pRelationMap));
			}
			return pClonedInstruction;
		}
	}

	

	export class DeclInstruction extends TypedInstruction implements IAFXDeclInstruction {
		protected _sSemantic: string = "";
		protected _pAnnotation: IAFXAnnotationInstruction = null;
		protected _bForPixel: bool = true;
		protected _bForVertex: bool = true;
		protected _isBuiltIn: bool = false;

		constructor(){
			super();
			this._eInstructionType = EAFXInstructionTypes.k_DeclInstruction;
		}

		setSemantic(sSemantic: string): void {
			this._sSemantic = sSemantic;
		}

		setAnnotation(pAnnotation: IAFXAnnotationInstruction): void {
			this._pAnnotation = pAnnotation;
		}

		getName(): string {
			return "";
		}

		getRealName(): string {
			return "";
		}

		getNameId(): IAFXIdInstruction {
			return null;
		}

		inline getSemantic(): string {
			return this._sSemantic;
		}

		isBuiltIn(): bool {
			return this._isBuiltIn;
		}

		setBuiltIn(isBuiltIn: bool): void {
			this._isBuiltIn = isBuiltIn;
		}

		inline _isForAll(): bool{
			return this._bForVertex && this._bForPixel;
		}
        inline _isForPixel(): bool{
        	return this._bForPixel;
        }
        inline _isForVertex(): bool{
        	return this._bForVertex;
        }

        inline _setForAll(canUse: bool): void{
        	this._bForVertex = canUse;
        	this._bForPixel = canUse;
        }
        inline _setForPixel(canUse: bool): void{
    	    this._bForPixel = canUse;
    	}
        inline _setForVertex(canUse: bool): void{
        	this._bForVertex = canUse;
        }

		clone(pRelationMap?: IAFXInstructionMap = <IAFXInstructionMap>{}): IAFXDeclInstruction {
			var pClonedInstruction: IAFXDeclInstruction = <IAFXDeclInstruction>(super.clone(pRelationMap));
			pClonedInstruction.setSemantic(this._sSemantic);
			pClonedInstruction.setAnnotation(this._pAnnotation);
			return pClonedInstruction;
		}
	}

	

	export class IdInstruction extends Instruction implements IAFXIdInstruction {
		private _sName: string;
		private _sRealName: string;

		inline isVisible(): bool {
			return this.getParent().isVisible();
		}
		/**
		 * EMPTY_OPERATOR EMPTY_ARGUMENTS
		 */
		constructor() {
			super();
			this._sName = "";
			this._sRealName = "";
			this._eInstructionType = EAFXInstructionTypes.k_IdInstruction;
		}

		inline getName(): string{
			return this._sName;
		}

		inline getRealName(): string{
			return this._sRealName;
		}

		inline setName(sName: string): void{
			this._sName = sName;
			this._sRealName = sName + "R";
		}

		inline setRealName(sRealName: string): void{
			this._sRealName = sRealName;
		}

		toString(): string {
			return this._sRealName;
		}

		toFinalCode(): string {
			return this._sRealName;
		}

		clone(pRelationMap?: IAFXInstructionMap): IdInstruction {
			var pClonedInstruction: IdInstruction = <IdInstruction>(super.clone(pRelationMap));
			pClonedInstruction.setName(this._sName);
			pClonedInstruction.setRealName(this._sRealName);
			return pClonedInstruction;
		}

	}

	export class KeywordInstruction extends Instruction implements IAFXKeywordInstruction {
		private _sValue: string;

		/**
		 * EMPTY_OPERATOR EMPTY_ARGUMENTS
		 */
		constructor() {
			super();
			this._sValue = "";
			this._eInstructionType = EAFXInstructionTypes.k_KeywordInstruction;
		}

		inline setValue(sValue: string): void {
			this._sValue = sValue;
		}

		inline isValue(sTestValue: string): bool {
			return this._sValue === sTestValue;
		}

		toString(): string {
			return this._sValue;
		}

		toFinalCode(): string{
			return this._sValue;
		}
	}


	export class AnnotationInstruction extends Instruction implements IAFXAnnotationInstruction {
		constructor() {
			super();
			this._eInstructionType = EAFXInstructionTypes.k_AnnotationInstruction;
		}
	}

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
		private _pPassStateMap: StringMap = null;


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

        setState(sType: string, sValue: string): void {
        	if(isNull(this._pPassStateMap)){
        		this._pPassStateMap = <StringMap>{};
        	}

        	if(this.isComplexPass()){
        		this._addCodeFragment("this._pPassStateMap[" + sType + "]=" + sValue+ ";");
        	}
        	else {
        		this._pPassStateMap[sType] = sValue;
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

        		this._fnPassFunction.call(this, pEngineStates, pForeigns, pUniforms);
        	}

        	return true;
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
		private _pComponentList: IAFXComponent[] = null;
		private _pComponentShiftList: int[] = null;
		private _pFullComponentList: IAFXComponent[] = null;
		private _pFullComponentShiftList: int[] = null;
		private _nTotalPasses: uint = 0;

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

        hasComplexName(): bool{
        	return this._hasComplexName;
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

		addComponent(pComponent: IAFXComponent, iShift: int): void{
			if(isNull(this._pComponentList)){
				this._pComponentList = [];
				this._pComponentShiftList = [];
			}

			this._pComponentList.push(pComponent);
			this._pComponentShiftList.push(iShift);
		}

		inline getComponentList(): IAFXComponent[]{
			return this._pComponentList;
		}

        inline getComponentListShift(): int[]{
        	return this._pComponentShiftList;
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

		finalizeTechnique(sProvideNameSpace: string, 
                          pGloabalComponentList: IAFXComponent[],
                          pGloabalComponentShiftList: uint[]): void {
			this.generateListOfSharedVariables();

			if(!this.hasComplexName() && sProvideNameSpace !== ""){
				this._sName = sProvideNameSpace + "." + this._sName;
			}

			if(!isNull(pGloabalComponentList)){
				if(!isNull(this._pComponentList)){
					this._pComponentList = pGloabalComponentList.concat(this._pComponentList);
					this._pComponentShiftList = pGloabalComponentShiftList.concat(this._pComponentShiftList);
				}
				else {
					this._pComponentList = pGloabalComponentList.concat();
					this._pComponentShiftList = pGloabalComponentShiftList.concat();
				}
			}

			this.generateFullListOfComponent();
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

			if(isNull(this._pComponentList)){
				return;
			}

			this._pFullComponentList = [];
			this._pFullComponentShiftList = [];

			for(var i: uint = 0; i < this._pComponentList.length; i++){
				var pTechnique: IAFXTechniqueInstruction = this._pComponentList[i].getTechnique();
				var iMainShift: int = this._pComponentShiftList[i];
				var pAddComponentList: IAFXComponent[] = pTechnique.getFullComponentList();
				var pAddComponentShiftList: int[] = pTechnique.getFullComponentShiftList();

				if(!isNull(pAddComponentList)){
					for(var j: uint = 0; j < pAddComponentList.length; i++){
						this._pFullComponentList.push(pAddComponentList[j]);
						this._pFullComponentShiftList.push(pAddComponentShiftList[j] + iMainShift);
					}
				}

				this._pFullComponentList.push(this._pComponentList[i]);
				this._pFullComponentShiftList.push(iMainShift);

				if(this._nTotalPasses < iMainShift + pTechnique.totalPasses()) {
					this._nTotalPasses = iMainShift + pTechnique.totalPasses();
				}
			}
		}
	}

}

#endif