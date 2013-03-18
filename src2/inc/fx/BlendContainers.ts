#ifndef AFXVARIABLEBLENDCONTAINER
#define AFXVARIABLEBLENDCONTAINER

#include "IAFXInstruction.ts"

module akra.fx {
	export class VariableBlendContainer {
		protected _pVarListMap: IAFXVariableDeclListMap = null;
		protected _pVarKeys: string[] = null;

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

		constructor() {
			this._pVarListMap = <IAFXVariableDeclListMap>{};
			this._pVarKeys = [];

			this._pVarBlendTypeMap = <IAFXVariableTypeMap>{};
		}

		addVariable(pVariable: IAFXVariableDeclInstruction, eBlendMode: EAFXBlendMode): bool {
			var sName: string = pVariable.getRealName();

			if(!isDef(this._pVarListMap[sName])){
				this._pVarListMap[sName] = [pVariable];
				this._pVarKeys.push(sName);

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
	}


	export class ComplexTypeBlendContainer {
		
		private _pTypeListMap: IAFXTypeMap = null;
		private _pTypeKeys: string[] = null;

		constructor() {
			this._pTypeListMap = <IAFXTypeMap>{};
			this._pTypeKeys = [];
		}

		addComplexType(pComplexType: IAFXTypeInstruction): bool {
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
		private _pExtSystemMacrosList: IAFXSimpleInstruction[] = null;
		private _pExtSystemTypeList: IAFXTypeDeclInstruction[] = null;
		private _pExtSystemFunctionList: IAFXFunctionDeclInstruction[] = null;

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

	export class AttributeBlendContainer extends VariableBlendContainer {
		private _pSlotBySemanticMap: IntMap = null;
		private _pFlowsBySemanticMap: IDataFlowMap = null;

		private _nSlots: uint = 0;
		private _pFlowBySlots: util.ObjectArray = null;
		private _pHashBySlots: util.ObjectArray = null;

		protected _sHash: string = "";

		constructor() {
			super();
			
			this._pSlotBySemanticMap = <IntMap>{};
			this._pFlowsBySemanticMap = <IDataFlowMap>{};

			this._pFlowBySlots = new util.ObjectArray();
			this._pHashBySlots = new util.ObjectArray();
		}

		inline get semantics(): string[] {
			return this.keys;
		}

		inline getType(sSemantic: string): IAFXVariableTypeInstruction {
			return this.getBlendType(sSemantic);
		}

		inline addAttribute(pVariable: IAFXVariableDeclInstruction): bool {
			return this.addVariable(pVariable, EAFXBlendMode.k_Attribute);
		}

		clear(): void {
			for(var i: uint = 0; i < this.semantics.length; i++){
				var sSemantic: string = this.semantics[i];
				this._pSlotBySemanticMap[sSemantic] = -1;
				this._pFlowsBySemanticMap[sSemantic] = null;
			}

			this._pFlowBySlots.clear(false);
			this._pHashBySlots.clear(false);
			this._nSlots = 0;
			this._sHash = "";
		}



		initFromBufferMap(pMap: util.BufferMap): bool {
			this.clear();

			var pFlows: IDataFlow[] = pMap.flows;
			var pSemanticList: string[] = this.semantics;

			for(var i: uint = 0; i < pSemanticList.length; i++) {
				var sSemantic: string = pSemanticList[i];
				var pFindFlow: IDataFlow = pMap.getFlow(sSemantic, true);

				this._pFlowsBySemanticMap[sSemantic] = pFindFlow;

				if(!isNull(pFindFlow)){
					if (pFindFlow.type === EDataFlowTypes.MAPPABLE) {
						if(!this.getType(sSemantic).isPointer()) {
							WARNING("You try to put pointer data into non-pointer attribute with semantic '" + sSemantic + "'");
							return false;
						}

						var iSlot: int = this._pFlowBySlots.indexOf(pFindFlow);
						if (iSlot !== -1) {
							this._pHashBySlots.value(iSlot) += this.getType(sSemantic).getGuid().toString() + "*";
							this._pSlotBySemanticMap[sSemantic] = iSlot;
							continue;
						}
					}
					else if(this.getType(sSemantic).isStrictPointer()) {
						WARNING("You try to put non-pointer data into pointer attribute with semantic '" + sSemantic + "'");
						return false;
					}
					
					//new slot
					this._pSlotBySemanticMap[sSemantic] = this._pFlowBySlots.length;
					this._pFlowBySlots.push(pFindFlow);
					this._pHashBySlots.push(this.getType(sSemantic).getGuid().toString() + "*");
					
				}
			}

			this._sHash = "";
			for(var i: uint = 0; i < this._pHashBySlots.length; i++) {
				this._sHash += this._pHashBySlots[i] + "*";
			}			
		}

		inline getHash(): string {
			return this._sHash;
		}	
	}
}

#endif