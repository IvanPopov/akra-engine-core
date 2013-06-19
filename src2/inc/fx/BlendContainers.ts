#ifndef AFXVARIABLEBLENDCONTAINER
#define AFXVARIABLEBLENDCONTAINER

#include "IAFXInstruction.ts"

#ifdef WEBGL
#include "webgl/webgl.ts"
#endif

module akra.fx {
	export class VariableBlendContainer {
		protected _pVarListMap: IAFXVariableDeclListMap = null;
		protected _pVarKeys: string[] = null;
		protected _pKeyToIndexMap: IntMap = null;

		protected _pVarBlendTypeMap: IAFXVariableTypeMap = null;

		inline get keys(): string[] {
			return this._pVarKeys;
		}

		inline getVarList(sKey: string): IAFXVariableDeclInstruction[] {
			return this._pVarListMap[sKey];
		}

		inline getBlendType(sKey: string): IAFXVariableTypeInstruction {
			return this._pVarBlendTypeMap[sKey];
		}

		inline getKeyIndex(sKey: string): uint {
			return this._pKeyToIndexMap[sKey];
		}

		constructor() {
			this._pVarListMap = <IAFXVariableDeclListMap>{};
			this._pVarKeys = [];
			this._pKeyToIndexMap = <IntMap>{};

			this._pVarBlendTypeMap = <IAFXVariableTypeMap>{};
		}

		addVariable(pVariable: IAFXVariableDeclInstruction, eBlendMode: EAFXBlendMode): bool {
			var sName: string = pVariable.getRealName();

			if(!isDef(this._pVarListMap[sName])){
				this._pVarListMap[sName] = [pVariable];
				this._pVarKeys.push(sName);
				this._pKeyToIndexMap[sName] = this._pVarKeys.length - 1;

				this._pVarBlendTypeMap[sName] = pVariable.getType();
				
				return true;
			}

			var pBlendType: IAFXVariableTypeInstruction = this._pVarBlendTypeMap[sName].blend(pVariable.getType(), eBlendMode);

			if(pBlendType === this._pVarBlendTypeMap[sName]){
				return true;
			}

			if(isNull(pBlendType)){
				ERROR("Could not blend type for variable '" + sName + "'");
				return false;
			}

			this._pVarListMap[sName].push(pVariable);
			this._pVarBlendTypeMap[sName] = pBlendType;

			return true;
		}

		hasVariableWithName(sName: string): bool {
			if(!isDefAndNotNull(this._pVarBlendTypeMap[sName])){
				this._pVarBlendTypeMap[sName] = null;
				return false;
			}

			return true;
		}

		inline hasVariable(pVar: IAFXVariableDeclInstruction): bool {
			return this.hasVariableWithName(pVar.getRealName());
		}

		inline getVariableByName(sName: string): IAFXVariableDeclInstruction {
			return this.hasVariableWithName(sName) ? this._pVarListMap[sName][0] : null;
		}

		inline getDeclCodeForVar(sName: string): string {
			var pType: IAFXVariableTypeInstruction = this.getBlendType(sName);
			var sCode: string = pType.toFinalCode() + " ";
			var pVar: IAFXVariableDeclInstruction = this.getVariableByName(sName);
			
			sCode += pVar.getRealName();
			
			if(pVar.getType().isNotBaseArray()){
				var iLength: uint = pVar.getType().getLength();
				if(webgl.isANGLE && iLength === 1 && pVar.getType().isComplex()){
					sCode += "[" + 2 + "]";
				}
				else {
					sCode += "[" + iLength + "]";
				}
			}

			return sCode;
		}

		forEach(sKey: string, fnModifier: {(pVar: IAFXVariableDeclInstruction): void;}): void {
			if(this.hasVariableWithName(sKey)) {
				var pVarList: IAFXVariableDeclInstruction[] = this.getVarList(sKey);

				for(var i: uint = 0; i < pVarList.length; i++) {
					fnModifier.call(null, pVarList[i]);
				}
			}
		}

		setNameForEach(sKey: string, sNewRealName: string): void {
			if(this.hasVariableWithName(sKey)) {
				var pVarList: IAFXVariableDeclInstruction[] = this.getVarList(sKey);

				for(var i: uint = 0; i < pVarList.length; i++) {
					pVarList[i].setRealName(sNewRealName);
				}
			}
		}
	}


	export class ComplexTypeBlendContainer {
		private _pTypeListMap: IAFXTypeMap = null;
		private _pTypeKeys: string[] = null;

		inline get keys(): string[]{
			return this._pTypeKeys;
		}

		inline get types(): IAFXTypeMap {
			return this._pTypeListMap;
		}

		constructor() {
			this._pTypeListMap = <IAFXTypeMap>{};
			this._pTypeKeys = [];
		}

		addComplexType(pComplexType: IAFXTypeInstruction): bool {
			var pFieldList: IAFXVariableDeclInstruction[] = (<ComplexTypeInstruction>pComplexType)._getFieldDeclList();
			for(var i: uint = 0; i < pFieldList.length; i++){
				if(pFieldList[i].getType().isComplex()){
					if(!this.addComplexType(pFieldList[i].getType().getBaseType())){
						return false;
					}
				}
			}

			var sName: string = pComplexType.getRealName();

			if(!isDef(this._pTypeListMap[sName])){
				this._pTypeListMap[sName] = pComplexType;
				this._pTypeKeys.push(sName);

				return true;
			}

			var pBlendType: IAFXTypeInstruction = this._pTypeListMap[sName].blend(pComplexType, EAFXBlendMode.k_TypeDecl);
			if(isNull(pBlendType)){
				ERROR("Could not blend type declaration '" + sName + "'");
				return false;
			}

			this._pTypeListMap[sName]= pBlendType;

			return true;
		}

		addFromVarConatiner(pContainer: VariableBlendContainer): bool {
			if(isNull(pContainer)){
				return true;
			}

			var pKeys: string[] = pContainer.keys;

			for(var i: uint = 0; i < pKeys.length; i++){
				var pType: IAFXTypeInstruction = pContainer.getBlendType(pKeys[i]).getBaseType();

				if(pType.isComplex()){
					if(!this.addComplexType(pType)){
						return false;
					}
				}
			}

			return true;
		}
	}

	export class ExtSystemDataContainer {
		protected _pExtSystemMacrosList: IAFXSimpleInstruction[] = null;
		protected _pExtSystemTypeList: IAFXTypeDeclInstruction[] = null;
		protected _pExtSystemFunctionList: IAFXFunctionDeclInstruction[] = null;

		inline get macroses(): IAFXSimpleInstruction[] {
			return this._pExtSystemMacrosList;
		}

		inline get types(): IAFXTypeDeclInstruction[] {
			return this._pExtSystemTypeList;
		}

		inline get functions(): IAFXFunctionDeclInstruction[] {
			return this._pExtSystemFunctionList;
		}

		constructor(){
			this._pExtSystemMacrosList = [];
			this._pExtSystemTypeList = [];
			this._pExtSystemFunctionList = [];
		}

		addFromFunction(pFunction: IAFXFunctionDeclInstruction): void {
			var pTypes = pFunction._getExtSystemTypeList();
			var pMacroses = pFunction._getExtSystemMacrosList();
			var pFunctions = pFunction._getExtSystemFunctionList();

			if(!isNull(pTypes)){
				for(var j: uint = 0; j < pTypes.length; j++){
					if(this._pExtSystemTypeList.indexOf(pTypes[j]) === -1){
						this._pExtSystemTypeList.push(pTypes[j]);
					}
				}
			}

			if(!isNull(pMacroses)){
				for(var j: uint = 0; j < pMacroses.length; j++){
					if(this._pExtSystemMacrosList.indexOf(pMacroses[j]) === -1){
						this._pExtSystemMacrosList.push(pMacroses[j]);
					}
				}
			}

			if(!isNull(pFunctions)){
				for(var j: uint = 0; j < pFunctions.length; j++){
					if(this._pExtSystemFunctionList.indexOf(pFunctions[j]) === -1){
						this._pExtSystemFunctionList.push(pFunctions[j]);
					}
				}
			}
		}
	}


	export interface IDataFlowMap {
		[index: string]: IDataFlow;
	}

	export interface IAFXVaribaleListMap{
		[index: string]: IAFXVariableDeclInstruction[];
	}

	export interface ITypeInfo {
		isComplex: bool;
		isPointer: bool;
		isStrictPointer: bool;
	}

	export class AttributeBlendContainer extends VariableBlendContainer {
		
		private _pSlotBySemanticIndex: int[] = null;
		private _pTypeInfoBySemanticIndex: ITypeInfo[] = null;

		private _pFlowBySlots: int[] = null;
		private _pSlotByFlows: int[] = null;
		private _pIsPointerBySlot: bool[] = null;
		private _pVBByBufferSlots: int[] = null;
		private _pBufferSlotBySlots: int[] = null;

		private _pHashPartList: uint[] = null;

		private _pOffsetVarsBySemanticMap: IAFXVaribaleListMap = null; 
		private _pOffsetDefaultMap: IntMap = null;

		private _nSemantics: uint = 0;
		private _nSlots: uint = 0;
		private _nBufferSlots: uint = 0;

		protected _sHash: string = "";

		inline get semantics(): string[] {
			return this.keys;
		}

		inline get totalSlots(): uint {
			return this._nSlots;
		}

		inline get totalBufferSlots(): uint {
			return this._nBufferSlots;
		}

		constructor() {
			super();
			
			this._pSlotBySemanticIndex = null;
			//this._pFlowBySemanticIndex = null;

			var iMaxSlots: uint = 16;
			var iMaxVertexSamplers: uint = 4;
#ifdef WEBGL
			iMaxSlots = webgl.maxVertexAttributes;
			iMaxVertexSamplers = webgl.maxVertexTextureImageUnits;
#else
			iMaxSlots = 16;
			iMaxVertexSamplers = 4;
#endif
			this._pFlowBySlots = new Array(iMaxSlots);
			this._pSlotByFlows = new Array(iMaxSlots);
			this._pIsPointerBySlot = new Array(iMaxSlots);
			this._pVBByBufferSlots = new Array(iMaxVertexSamplers);
			this._pBufferSlotBySlots = new Array(iMaxSlots);	
			this._pHashPartList = null;			
		}

		inline getOffsetVarsBySemantic(sName: string): IAFXVariableDeclInstruction[] {
			return this._pOffsetVarsBySemanticMap[sName];
		} 

		inline getOffsetDefault(sName: string): uint {
			return this._pOffsetDefaultMap[sName];
		}

		inline getSlotBySemantic(sSemantic: string): uint {
			return this._pSlotBySemanticIndex[this.getKeyIndex(sSemantic)];
		}

		inline getBufferSlotBySemantic(sSemantic: string): uint {
			return this._pBufferSlotBySlots[this.getSlotBySemantic(sSemantic)];
		}

		inline getAttributeList(sSemantic: string): IAFXVariableDeclInstruction[] {
			return this.getVarList(sSemantic);
		}
	
		inline getTypeForShaderAttribute(sSemantic: string): IAFXTypeInstruction {
			return this._pIsPointerBySlot[this.getSlotBySemantic(sSemantic)] ? 
						Effect.getSystemType("ptr") :
						this.getType(sSemantic).getBaseType();
		} 
		

		inline getType(sSemantic: string): IAFXVariableTypeInstruction {
			return this.getBlendType(sSemantic);
		}

		inline addAttribute(pVariable: IAFXVariableDeclInstruction): bool {
			return this.addVariable(pVariable, EAFXBlendMode.k_Attribute);
		}

		inline hasAttrWithSemantic(sSemantic: string): bool {
			return this.hasVariableWithName(sSemantic);
		}

		inline getAttribute(sSemantic: string): IAFXVariableDeclInstruction {
			return this.getVariableByName(sSemantic);
		}

		inline hasTexcoord(iSlot: uint): bool {
			return this.hasAttrWithSemantic(DeclUsages.TEXCOORD + iSlot.toString());
		}

		inline getTexcoordVar(iSlot: uint): IAFXVariableDeclInstruction {
			return this.getVariableByName(DeclUsages.TEXCOORD + iSlot.toString());
		}

		finalize(): void {
			this._nSemantics = this.semantics.length;

			this._pSlotBySemanticIndex = new Array(this._nSemantics);
			this._pTypeInfoBySemanticIndex = new Array(this._nSemantics);

			for(var i: uint = 0; i < this._nSemantics; i++){
				this._pSlotBySemanticIndex[i] = -1;
				this._pTypeInfoBySemanticIndex[i] = this.createTypeInfo(this.semantics[i]);
			}

			for(var i: uint = 0; i < this._pFlowBySlots.length; i++){
				this._pFlowBySlots[i] = -1;
				this._pSlotByFlows[i] = -1;	
				this._pIsPointerBySlot[i] = false;		
				this._pBufferSlotBySlots[i] = -1;	
			}

			for(var i: uint = 0; i < this._pVBByBufferSlots.length; i++){
				this._pVBByBufferSlots[i] = 0;
			}
		}

		clear(): void {
			this._nSlots = 0;
			this._nBufferSlots = 0;

			this._sHash = "";
		}

		generateOffsetMap(): void {		
			this._pOffsetVarsBySemanticMap = <IAFXVaribaleListMap>{};
			this._pOffsetDefaultMap = <IntMap>{};
			
			var pSemantics: string[] = this.semantics;

			for(var i: uint = 0; i < pSemantics.length; i++){
				var sSemantic: string = pSemantics[i];
				var pAttr: IAFXVariableDeclInstruction = this.getAttribute(sSemantic);

				if(pAttr.isPointer()){
					this._pOffsetVarsBySemanticMap[sSemantic] = [];
					if(pAttr.getType().isComplex()){
						var pAttrSubDecls: IAFXVariableDeclInstruction[] = pAttr.getSubVarDecls();

						for(var j: uint = 0; j < pAttrSubDecls.length; j++){
							var pSubDecl: IAFXVariableDeclInstruction = pAttrSubDecls[j];

							if(pSubDecl.getName() === "offset") {
								var sOffsetName: string = pSubDecl.getRealName();

								this._pOffsetVarsBySemanticMap[sSemantic].push(pSubDecl)
								this._pOffsetDefaultMap[sOffsetName] = (<IAFXVariableDeclInstruction>pSubDecl.getParent()).getType().getPadding();
							}
						}
					}
					else {
						var pOffsetVar: IAFXVariableDeclInstruction = pAttr.getType()._getAttrOffset();
						var sOffsetName: string = pOffsetVar.getRealName();

						this._pOffsetVarsBySemanticMap[sSemantic].push(pOffsetVar);
						this._pOffsetDefaultMap[sOffsetName] = 0;
					}
				}
				else{
					this._pOffsetVarsBySemanticMap[sSemantic] = null;
				}

			}
		}

		initFromBufferMap(pMap: util.BufferMap): void {
			this.clear();

			if(isNull(pMap)){
				CRITICAL("Yoy don`t set any buffermap for render");
				return;
			}

			var pSemanticList: string[] = this.semantics;
			var iHash: uint = 0;

			for(var i: uint = 0; i < pSemanticList.length; i++) {
				var sSemantic: string = pSemanticList[i];
				var pTypeInfo: ITypeInfo = this._pTypeInfoBySemanticIndex[i];

				var pFindFlow: IDataFlow = null;

				if(pTypeInfo.isComplex){
					// pFindFlow = pMap.findFlow(sSemantic) || pMap.getFlow(sSemantic, true);
					pFindFlow = pMap.findFlow(sSemantic) || pMap.getFlowBySemantic(sSemantic);
				}
				else {
					// pFindFlow = pMap.getFlow(sSemantic, true);
					pFindFlow = pMap.getFlowBySemantic(sSemantic);
				}

				if(!isNull(pFindFlow)) {
					var iBufferSlot: int = -1;
					var iFlow: uint = pFindFlow.flow;
					var iSlot: uint = this._pSlotByFlows[iFlow];

					if(iSlot >= 0 && iSlot < this._nSlots && this._pFlowBySlots[iSlot] === iFlow){
						this._pSlotBySemanticIndex[i] = iSlot;
						iHash += ((iSlot + 1) << 5 + (this._pBufferSlotBySlots[iSlot] + 1)) << iSlot;
						// continue;
					}
					else {
						iSlot = this._nSlots;

						if (pFindFlow.type === EDataFlowTypes.MAPPABLE) {
							if(!pTypeInfo.isPointer) {
								CRITICAL("You try to put pointer data into non-pointer attribute with semantic '" + sSemantic + "'");
							}
							// iSlot = this._pSlotByFlows[iFlow];

							// if(iSlot >= 0 && this._pFlowBySlots[iSlot] === iFlow){
							// 	this._pSlotBySemanticIndex[i] = iSlot;
							// 	iHash += ((iSlot + 1) << 5 + (this._pBufferSlotBySlots[iSlot] + 1)) << iSlot;
							// 	continue;
							// }

							// iSlot = this._nSlots;

							var iBuffer: uint = (<any>pFindFlow.data.buffer).getGuid();

							for(var j: uint = 0; j < this._nBufferSlots; j++){
								if(this._pVBByBufferSlots[j] === iBuffer){
									iBufferSlot = j;
									break;
								}
							}

							if(iBufferSlot === -1){
								iBufferSlot = this._nBufferSlots;
								this._pVBByBufferSlots[iBufferSlot] = iBuffer;
								this._nBufferSlots++;
							}

							this._pIsPointerBySlot[iSlot] = true;
						}
						else {
							if(pTypeInfo.isStrictPointer) {
								CRITICAL("You try to put non-pointer data into pointer attribute with semantic '" + sSemantic + "'");
							}

							this._pIsPointerBySlot[iSlot] = false;
						}
						//new slot
						this._pSlotBySemanticIndex[i] = iSlot;
						this._pFlowBySlots[iSlot] = iFlow;
						this._pSlotByFlows[iFlow] = iSlot;
						this._pBufferSlotBySlots[iSlot] = iBufferSlot;

						iHash += ((iSlot + 1) << 5 + (iBufferSlot + 1)) << iSlot;
						this._nSlots++;
					}
				}
				else {
					this._pSlotBySemanticIndex[i] = -1;
				}
			}

			this._sHash = iHash.toString();
		}

		inline getHash(): string {
			return this._sHash;
		}	


		private createTypeInfo(sSemantic: string): ITypeInfo {
			return <ITypeInfo>{
				isComplex: this.getType(sSemantic).isComplex(),
				isPointer: this.getType(sSemantic).isPointer(),
				isStrictPointer: this.getType(sSemantic).isStrictPointer()
			};
		}
	}
}

#endif