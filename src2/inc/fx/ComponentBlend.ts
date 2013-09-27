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

		private _pAddedComponentInfoList: IAFXComponentInfo[] = null;

		private _iShiftMin: int = 0;
		private _iShiftMax: int = 0;
		private _nTotalPasses: uint = 0;
		private _iPostEffectsStart: uint = 0;

		private _pPassesDList: IAFXPassInstruction[][] = null;
		private _pComponentInputVarBlend: ComponentPassInputBlend[] = null;

		constructor(pComposer: IAFXComposer){
			this._pComposer = pComposer;

			this._pComponentHashMap = <BoolMap>{};

			this._pAddedComponentInfoList = [];
		}

		inline _getMinShift(): int {
			return this._iShiftMin;
		}

		inline _getMaxShift(): int {
			return this._iShiftMax;
		}

		inline isReadyToUse(): bool {
			return this._isReady;
		}

		inline isEmpty(): bool {
			return this._pAddedComponentInfoList.length === 0;
		}

		inline getComponentCount(): uint {
			return this._pAddedComponentInfoList.length;
		}

		inline getTotalPasses(): uint {
			return !isNull(this._pPassesDList) ? this._pPassesDList.length : (this._iShiftMax - this._iShiftMin + 1);
		}

		inline hasPostEffect(): bool {
			return this._iPostEffectsStart > 0;
		}

		inline getPostEffectStartPass(): uint {
			return this._iPostEffectsStart;
		}

		getHash(): string {
			if(this._bNeedToUpdateHash){
				this._sHash = this.calcHash();
				this._bNeedToUpdateHash = false;
			}

			return this._sHash;
		}

		containComponent(pComponent: IAFXComponent, iShift: int, iPass: uint): bool {
			var iCorrectShift: uint = iShift;
			var iCorrectPass: uint = iPass;

			if(iShift === DEFAULT_SHIFT){
				if(pComponent.isPostEffect()){
					iCorrectShift = ANY_PASS;  
				}
				else {
					iCorrectShift = 0;
				}
			}

			if(iCorrectShift !== ANY_SHIFT && iCorrectPass !== ANY_PASS){
				return this.containComponentHash(pComponent.getHash(iCorrectShift, iCorrectPass));
			}
			else {
				for(var i: uint = 0; i < this._pAddedComponentInfoList.length; i++) {
					var pInfo: IAFXComponentInfo = this._pAddedComponentInfoList[i];

					if(pInfo.component === pComponent){
						if (iCorrectShift === ANY_SHIFT && iCorrectPass === ANY_PASS) {
							return true;
						}
						else if(iCorrectShift === ANY_SHIFT && pInfo.pass === iCorrectPass){
							return true;
						}
						else if(iCorrectPass === ANY_PASS && pInfo.shift === iCorrectShift){
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

		findAddedComponentInfo(pComponent: IAFXComponent, iShift: int, iPass: uint): IAFXComponentInfo {
			var iCorrectShift: uint = iShift;
			var iCorrectPass: uint = iPass;

			if(iShift === DEFAULT_SHIFT){
				if(pComponent.isPostEffect()){
					iCorrectShift = ANY_PASS;  
				}
				else {
					iCorrectShift = 0;
				}
			}

			if (iCorrectShift !== ANY_SHIFT && iCorrectPass !== ANY_PASS &&
				!this.containComponentHash(pComponent.getHash(iCorrectShift, iCorrectPass))){
				
				return null;
			}
			else {
				for(var i: uint = 0; i < this._pAddedComponentInfoList.length; i++) {
					var pInfo: IAFXComponentInfo = this._pAddedComponentInfoList[i];

					if(pInfo.component === pComponent){
						if (iCorrectShift === ANY_SHIFT && iCorrectPass === ANY_PASS) {
							return pInfo;
						}
						else if(iCorrectShift === ANY_SHIFT && pInfo.pass === iCorrectPass){
							return pInfo;
						}
						else if(iCorrectPass === ANY_PASS && pInfo.shift === iCorrectShift){
							return pInfo;
						}
						else if(pInfo.pass === iCorrectPass && pInfo.shift === iCorrectShift) {
							return pInfo;
						}
					}
				}
				
				return null;
			}
		}

		addComponent(pComponent: IAFXComponent, iShift: int, iPass: int): void {
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
				debug_warning("You try to add already used component '" + pComponent.findResourceName() + "' in blend.");
				return;
			}

			if(iShift < this._iShiftMin){
				this._iShiftMin = iShift;
			}

			if(iShift > this._iShiftMax){
				this._iShiftMax = iShift;
			}

			var pInfo: IAFXComponentInfo = <IAFXComponentInfo>{
				component: pComponent,
				shift: iShift,
				pass: iPass,
				hash: sComponentHash
			};

			this._pComponentHashMap[sComponentHash] = true;
			this._pAddedComponentInfoList.push(pInfo);

			this._isReady = false;
			this._iPostEffectsStart = 0;
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

			for(var i: uint = 0; i < this._pAddedComponentInfoList.length; i++){
				var pInfo: IAFXComponentInfo = this._pAddedComponentInfoList[i];

				if (pInfo.component === pComponent &&
					pInfo.shift === iShift &&
					pInfo.pass === iPass) {

					this._pAddedComponentInfoList.splice(i, 1);
					break;
				}
			}

			if(this._iShiftMin === iShift || this._iShiftMax === iShift){
				this._iShiftMax = 0;
				this._iShiftMin = 0;
			
				for(var i: uint = 0; i < this._pAddedComponentInfoList.length; i++){
					var iTestShift: uint = this._pAddedComponentInfoList[i].shift;

					if(iTestShift < this._iShiftMin){
						this._iShiftMin = iTestShift;
					}

					if(iTestShift > this._iShiftMax){
						this._iShiftMax = iTestShift;
					}
				}
			}

			this._isReady = false;
			this._iPostEffectsStart = 0;
			this._bNeedToUpdateHash = true;
		}

		finalizeBlend(): bool {
			if(this._isReady){
				return true;
			}

			this._pPassesDList = [];
			this._pComponentInputVarBlend = [];

			for(var i: uint = 0; i < this._pAddedComponentInfoList.length; i++){
				var pInfo: IAFXComponentInfo = this._pAddedComponentInfoList[i];

				var pComponentTechnique: IAFXTechniqueInstruction = pInfo.component.getTechnique();
				var iShift: int = pInfo.shift - this._iShiftMin;
				var iPass: int = pInfo.pass;

				var pPass: IAFXPassInstruction = pComponentTechnique.getPass(iPass);

				if(!isDef(this._pPassesDList[iShift])) {
					this._pPassesDList[iShift] = [];
					this._pComponentInputVarBlend[iShift] = new ComponentPassInputBlend();
				}

				this._pPassesDList[iShift].push(pPass);
				this._pComponentInputVarBlend[iShift].addDataFromPass(pPass);

				if (pInfo.component.isPostEffect()){
					if(this._iPostEffectsStart === 0 || iShift < this._iPostEffectsStart){
						this._iPostEffectsStart = iShift;
					}
				}
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

			pClone._setDataForClone(this._pAddedComponentInfoList, 
									this._pComponentHashMap,
									this._iShiftMin, this._iShiftMax);
			return pClone;
		}

		inline _getComponentInfoList(): IAFXComponentInfo[] {
			return this._pAddedComponentInfoList;
		}

		_setDataForClone(pComponentInfoList: IAFXComponentInfo[],
						 pComponentHashMap: BoolMap,
						 iShiftMin: int, iShiftMax: int): void {

			for(var i: uint = 0; i < pComponentInfoList.length; i++){
				this._pAddedComponentInfoList.push({
					component: pComponentInfoList[i].component,
					shift: pComponentInfoList[i].shift,
					pass: pComponentInfoList[i].pass,
					hash: pComponentInfoList[i].hash
				});

				this._pComponentHashMap[pComponentInfoList[i].hash] = pComponentHashMap[pComponentInfoList[i].hash];
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

			for(var i: uint = 0; i < this._pAddedComponentInfoList.length; i++){
				sHash += this._pAddedComponentInfoList[i].hash + ":";	
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