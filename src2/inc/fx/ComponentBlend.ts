#ifndef AFXCOMPONENTBLEND_TS
#define AFXCOMPONENTBLEND_TS

#include "IAFXComponentBlend.ts"
#include "IAFXComposer.ts"
#include "IAFXInstruction.ts"
#include "util/unique.ts"
#include "fx/PassInputBlend.ts"
#include "util/StringDictionary.ts"
#include "fx/VariableContainer.ts"

module akra.fx {
	export class ComponentBlend implements IAFXComponentBlend {
		UNIQUE();
		private _pComposer: IAFXComposer = null;

		private _isReady: bool = false;
		private _sHash: string = "";
		private _bNeedToUpdateHash: bool = false;

		private _pComponentHashMap: BoolMap = null;

		private _pComponentList: IAFXComponent[] = null;
		private _pComponentShiftList: int[] = null;
		private _pComponentPassIdList: uint[] = null;

		private _iShiftMin: int = 0;
		private _iShiftMax: int = 0;

		private _pPassesDList: IAFXPassInstruction[][] = null;
		private _pComponentInputVarBlend: ComponentPassInputBlend[] = null;

		constructor(pComposer: IAFXComposer){
			this._pComposer = pComposer;

			this._pComponentHashMap = <BoolMap>{};

			this._pComponentList = [];
			this._pComponentShiftList = [];
			this._pComponentPassIdList = [];
		}

		inline isReadyToUse(): bool {
			return this._isReady;
		}

		inline isEmpty(): bool {
			return this._pComponentList.length === 0;
		}

		inline getComponentCount(): uint {
			return this._pComponentList.length;
		}

		inline getTotalPasses(): uint {
			return !isNull(this._pPassesDList) ? this._pPassesDList.length : 0;
		}

		getHash(): string {
			if(this._bNeedToUpdateHash){
				this._sHash = this.calcHash();
				this._bNeedToUpdateHash = false;
			}

			return this._sHash;
		}

		containComponent(pComponent: IAFXComponent, iShift: int, iPass: uint): bool {
			if(iShift !== ANY_SHIFT && iPass !== ANY_PASS){
				return this.containComponentHash(pComponent.getHash(iShift, iPass));
			}
			else {
				for(var i: uint = 0; i < this._pComponentList.length; i++) {
					if(this._pComponentList[i] === pComponent){
						if (iShift === ANY_SHIFT && iPass === ANY_PASS) {
							return true;
						}
						else if(iShift === ANY_SHIFT && this._pComponentPassIdList[i] === iPass){
							return true;
						}
						else if(iPass === ANY_PASS && this._pComponentShiftList[i] === iShift){
							return true;
						}
					}
				}

				return false;
			}
		}

		inline containComponentHash(sComponentHash: string): bool {
			return (this._pComponentHashMap[sComponentHash]);
		}

		addComponent(pComponent: IAFXComponent, iShift: int, iPass: int): void {
			var sComponentHash: string = pComponent.getHash(iShift, iPass);
			var iPassCount: uint = pComponent.getTotalPasses();

			if(iPass === ALL_PASSES) {

				for(var i: uint = 0; i < iPassCount; i++){
					this.addComponent(pComponent, iShift + i, i);
				}

				return;
			}
			else if(iPass < 0 || iPass >= iPassCount){
				return;
			}

			var sComponentHash: string = pComponent.getHash(iShift, iPass);
			
			if(this.containComponentHash(sComponentHash)){
				debug_warning("You try to add already used component '" + sComponentHash + "' in blend.");
				return;
			}

			if(iShift < this._iShiftMin){
				this._iShiftMin = iShift;
			}

			if(iShift > this._iShiftMax){
				this._iShiftMax = iShift;
			}

			this._pComponentHashMap[sComponentHash] = true;
			this._pComponentList.push(pComponent);
			this._pComponentShiftList.push(iShift);
			this._pComponentPassIdList.push(iPass);

			this._isReady = false;
			this._bNeedToUpdateHash = true;

		}

		removeComponent(pComponent: IAFXComponent, iShift: int, iPass: int): void {
			var sComponentHash: string = pComponent.getHash(iShift, iPass);
			var iPassCount: uint = pComponent.getTotalPasses();

			if(!this.containComponentHash(sComponentHash)){
				debug_warning("You try to remove not used component '" + sComponentHash + "' from blend.");
				return;
			}

			if(iPass === ALL_PASSES) {		
				for(var i: uint = 0; i < iPassCount; i++){
					this.removeComponent(pComponent, iShift + i, i);
				}

				return;
			}
			else if(iPass < 0 || iPass >= iPassCount){
				return;
			}

			this._pComponentHashMap[sComponentHash] = false;

			for(var i: uint = 0; i < this._pComponentList.length; i++){
				if (this._pComponentList[i] === pComponent &&
					this._pComponentShiftList[i] === iShift &&
					this._pComponentPassIdList[i] === iPass) {

					this._pComponentList.splice(i, 1);
					this._pComponentShiftList.splice(i, 1);
					this._pComponentPassIdList.splice(i, 1);
					break;
				}
			}

			if(this._iShiftMin === iShift && this._iShiftMax === iShift){
				this._iShiftMax = 0;
				this._iShiftMin = 0;
			
				for(var i: uint = 0; i < this._pComponentShiftList.length; i++){
					if(this._pComponentShiftList[i] < this._iShiftMin){
						this._iShiftMin = this._pComponentShiftList[i];
					}

					if(this._pComponentShiftList[i] > this._iShiftMax){
						this._iShiftMax = this._pComponentShiftList[i];
					}
				}
			}

			this._isReady = false;
			this._bNeedToUpdateHash = true;
		}

		finalizeBlend(): bool {
			if(this._isReady){
				return true;
			}

			this._pPassesDList = [];
			this._pComponentInputVarBlend = [];

			for(var i: uint = 0; i < this._pComponentList.length; i++){
				var pComponentTechnique: IAFXTechniqueInstruction = this._pComponentList[i].getTechnique();
				var iShift: int = this._pComponentShiftList[i] - this._iShiftMin;
				var iPass: int = this._pComponentPassIdList[i];

				var pPass: IAFXPassInstruction = pComponentTechnique.getPass(iPass);

				if(!isDef(this._pPassesDList[iShift])) {
					this._pPassesDList[iShift] = [];
					this._pComponentInputVarBlend[iShift] = new ComponentPassInputBlend();
				}
				this._pPassesDList[iShift].push(pPass);
				this._pComponentInputVarBlend[iShift].addDataFromPass(pPass);
			}

			for(var i: uint = 0; i < this._pComponentInputVarBlend.length; i++){
				if(isDef(this._pComponentInputVarBlend[i])){
					this._pComponentInputVarBlend[i].finalizeInput();
				}
				else {
					this._pComponentInputVarBlend[i] = null;
					this._pPassesDList[i] = null;
				}
			}

			this._isReady = true;

			return true;
		}

		getPassInputForPass(iPass: uint): IAFXPassInputBlend {
			if(!this._isReady){
				return null;
			}

			if (iPass < 0 || iPass > this.getTotalPasses() ||
				isNull(this._pComponentInputVarBlend[iPass])){
				return null;
			}

			return this._pComponentInputVarBlend[iPass].getPassInput();
		}

		getPassListAtPass(iPass: uint): IAFXPassInstruction[] {
			if(!this._isReady){
				return null;
			}

			if(iPass < 0 || iPass > this.getTotalPasses()){
				return null;
			}

			return this._pPassesDList[iPass];
		}

		clone(): IAFXComponentBlend {
			var pClone: IAFXComponentBlend = new ComponentBlend(this._pComposer);

			pClone._setDataForClone(this._pComponentList, 
									this._pComponentShiftList, 
									this._pComponentPassIdList,
									this._pComponentHashMap,
									this._iShiftMin, this._iShiftMax);
			return pClone;
		}

		inline _getComponentList(): IAFXComponent[] {
			return this._pComponentList;
		}

		inline _getComponentShiftList(): int[] {
			return this._pComponentShiftList;
		}

		inline _getComponentPassIdList(): uint[] {
			return this._pComponentPassIdList;
		}

		_setDataForClone(pComponentList: IAFXComponent[],
						 pComponentShiftList: int[],
						 pComponentPassNumnerList: int[],
						 pComponentHashMap: BoolMap,
						 iShiftMin: int, iShiftMax: int): void {

			for(var i: uint = 0; i < pComponentList.length; i++){
				this._pComponentList.push(pComponentList[i]);
				this._pComponentShiftList.push(pComponentShiftList[i]);
				this._pComponentPassIdList.push(pComponentPassNumnerList[i]);

				var sComponentHash: string = pComponentList[i].getHash(pComponentShiftList[i], pComponentPassNumnerList[i]);

				this._pComponentHashMap[sComponentHash] = pComponentHashMap[sComponentHash];
			}

			this._iShiftMin = iShiftMin;
			this._iShiftMax = iShiftMax;
			this._bNeedToUpdateHash = true;
		}

		private calcHash(): string {
			var sHash: string = "";

			if(this.isEmpty()) {
				return EMPTY_BLEND;
			}

			for(var i: uint = 0; i < this._pComponentList.length; i++){
				var sComponentHash: string = this._pComponentList[i].getHash(this._pComponentShiftList[i], 
																			 this._pComponentPassIdList[i]);
				sHash += sComponentHash + ":";	
			}

			return sHash;
		}
	}


	export class ComponentPassInputBlend implements IAFXComponentPassInputBlend {
		private _pUniformsContainer: VariableContainer = null;
		private _pForeignsContainer: VariableContainer = null;
		private _pTexturesContainer: VariableContainer = null;

		private _pFreePassInputBlendList: IAFXPassInputBlend[] = null;

		inline get uniforms(): IAFXVariableContainer {
			return this._pUniformsContainer;
		}

		inline get textures(): IAFXVariableContainer {
			return this._pTexturesContainer;
		}

		inline get foreigns(): IAFXVariableContainer {
			return this._pForeignsContainer;
		}

		constructor() {
			this._pUniformsContainer = new VariableContainer();
			this._pForeignsContainer = new VariableContainer();
			this._pTexturesContainer = new VariableContainer();

			for(var i: uint = 0; i < 16; i++){
				this._pTexturesContainer.addSystemEntry("TEXTURE" + i.toString(), EAFXShaderVariableType.k_Texture);
			}
		}

		addDataFromPass(pPass: IAFXPassInstruction): void {
			var pUniformMap: IAFXVariableDeclMap = pPass._getFullUniformMap();
			var pForeignMap: IAFXVariableDeclMap = pPass._getFullForeignMap();
			var pTextureMap: IAFXVariableDeclMap = pPass._getFullTextureMap();
			
			for(var i in pForeignMap){
				this._pForeignsContainer.add(pForeignMap[i]);
			}

			for(var i in pTextureMap){
				this._pTexturesContainer.add(pTextureMap[i]);
			}

			for(var i in pUniformMap){
				this.addUniformVariable(pUniformMap[i], "", "");
			}

		}

		finalizeInput(): void {
			this._pUniformsContainer.finalize();
			this._pForeignsContainer.finalize();
			this._pTexturesContainer.finalize();

			this._pFreePassInputBlendList = [];

			this.generateNewPassInputs();
		}

		getPassInput(): IAFXPassInputBlend {
			if(this._pFreePassInputBlendList.length === 0){
				this.generateNewPassInputs();
			}

			return this._pFreePassInputBlendList.pop();
		}

		releasePassInput(pInput: IAFXPassInputBlend) : void {
			this._pFreePassInputBlendList.push(pInput);
		}

		private addUniformVariable(pVariable: IAFXVariableDeclInstruction, 
								   sPrevName: string, sPrevRealName: string): void {
			var sName: string = pVariable.getName();
			var sRealName: string = pVariable.getRealName();

			var pHasVar: IAFXVariableDeclInstruction = this._pUniformsContainer.getVarByRealName(sRealName);

			if(isDefAndNotNull(pHasVar) && !pHasVar.getType().isEqual(pVariable.getType())){
				debug_warning("You used uniforms with the same real-names. Now we don`t work very well with that.");
				return;
			}

			this._pUniformsContainer.add(pVariable);
		}

		private generateNewPassInputs(nCount?: uint = 5): void {
			for(var i: uint = 0; i < nCount; i++) {
				var pPassInput: IAFXPassInputBlend = new PassInputBlend(this);
				this._pFreePassInputBlendList.push(pPassInput);
			}
		}
	}

}

#endif