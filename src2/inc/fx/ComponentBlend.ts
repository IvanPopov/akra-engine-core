#ifndef AFXCOMPONENTBLEND_TS
#define AFXCOMPONENTBLEND_TS

#include "IAFXComponentBlend.ts"
#include "IAFXComposer.ts"
#include "IAFXInstruction.ts"

module akra.fx {
	export class ComponentBlend implements IAFXComponentBlend {
		private _pComposer: IAFXComposer = null;

		private _isReady: bool = false;
		private _sHash: string = "";
		private _bNeedToUpdateHash: bool = false;

		private _pComponentCountMap: IntMap = null;

		private _pComponentList: IAFXComponent[] = null;
		private _pComponentShiftList: int[] = null;

		private _iShiftMin: int = 0;
		private _iShiftMax: int = 0;

		private _pPassesDList: IAFXPassInstruction[][] = null;
		private _pShaderInputVarBlend: ShaderInputBlend[] = null;

		constructor(pComposer: IAFXComposer){
			this._pComposer = pComposer;

			this._pComponentCountMap = <IntMap>{};

			this._pComponentList = [];
			this._pComponentShiftList = [];
		}

		inline isReadyToUse(): bool {
			return this._isReady;
		}

		inline getComponentCount(): uint {
			return this._pComponentList.length;
		}

		inline getTotalValidPasses(): uint {
			return 0;
		}

		getHash(): string {
			if(this._bNeedToUpdateHash){
				this._sHash = this.calcHash();
				this._bNeedToUpdateHash = false;
			}

			return this._sHash;
		}

		inline containComponentWithShift(pComponent: IAFXComponent, iShift: int): bool {
			return this.containComponentHash(pComponent.getHash(iShift));
		}

		inline containComponentHash(sComponentHash: string): bool {
			return isDef(this._pComponentCountMap[sComponentHash]) && this._pComponentCountMap[sComponentHash] > 0;
		}

		addComponent(pComponent: IAFXComponent, iShift: int): void {
			var sComponentHash: string = pComponent.getHash(iShift);
			
			if(this.containComponentHash(sComponentHash)){
				this._pComponentCountMap[sComponentHash]++;
				this._bNeedToUpdateHash = true;

				debug_warning("You try to add already used component '" + sComponentHash + "' in blend.");
				return;
			}

			if(iShift < this._iShiftMin){
				this._iShiftMin = iShift;
			}

			if(iShift > this._iShiftMax){
				this._iShiftMax = iShift;
			}

			this._pComponentCountMap[sComponentHash] = 1;
			this._pComponentList.push(pComponent);
			this._pComponentShiftList.push(iShift);

			this._isReady = false;
			this._bNeedToUpdateHash = true;

		}

		removeComponent(pComponent: IAFXComponent, iShift: int): void {
			var sComponentHash: string = pComponent.getHash(iShift);

			if(!this.containComponentHash(sComponentHash)){
				debug_warning("You try to remove not used component '" + sComponentHash + "' from blend.");
				return;
			}

			if(this._pComponentCountMap[sComponentHash] > 1){
				this._pComponentCountMap[sComponentHash]--;
				this._bNeedToUpdateHash = true;

				debug_warning("You try to remove component '" + sComponentHash + "' from blend. But it used more then 1 time.");
				return;
			}

			this._pComponentCountMap[sComponentHash] = 0;

			for(var i: uint = 0; i < this._pComponentList.length; i++){
				if(this._pComponentList[i] === pComponent && this._pComponentShiftList[i] === iShift){
					this._pComponentList.splice(i, 1);
					this._pComponentShiftList.splice(i, 1);
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
			this._pShaderInputVarBlend = [];

			for(var i: uint = 0; i < this._pComponentList.length; i++){
				var pComponentTechnique: IAFXTechniqueInstruction = this._pComponentList[i].getTechnique();
				var iShift: int = this._pComponentShiftList[i] - this._iShiftMin;
				var pComponentPassList: IAFXPassInstruction[] = pComponentTechnique.getPassList();
				
				for(var j: uint = 0; j < pComponentPassList.length; j++){
					if(!isDef(this._pPassesDList[j + iShift])) {
						this._pPassesDList[j + iShift] = [];
						this._pShaderInputVarBlend[j + iShift] = new ShaderInputBlend();
					}

					var pPass: IAFXPassInstruction = pComponentPassList[j];

					this._pPassesDList[j + iShift].push(pPass);
					this._pShaderInputVarBlend[j + iShift].addDataFromPass(pPass);
				}
			}

			for(var i: uint = 0; i < this._pShaderInputVarBlend.length; i++){
				this._pShaderInputVarBlend[i].generateKeys();
			}

			this._isReady = true;

			return true;
		}

		clone(): IAFXComponentBlend {
			var pClone: IAFXComponentBlend = new ComponentBlend(this._pComposer);

			pClone._setDataForClone(this._pComponentList, 
									this._pComponentShiftList, 
									this._pComponentCountMap,
									this._iShiftMin, this._iShiftMax);
			return pClone;
		}

		_setDataForClone(pComponentList: IAFXComponent[],
						 pComponentShiftList: int[],
						 pComponentCountMap: IntMap,
						 iShiftMin: int, iShiftMax: int): void {

			for(var i: uint = 0; i < pComponentList.length; i++){
				this._pComponentList.push(pComponentList[i]);
				this._pComponentShiftList.push(pComponentShiftList[i]);

				var sComponentHash: string = pComponentList[i].getHash(pComponentShiftList[i]);

				this._pComponentCountMap[sComponentHash] = pComponentCountMap[sComponentHash];
			}

			this._iShiftMin = iShiftMin;
			this._iShiftMax = iShiftMax;
			this._bNeedToUpdateHash = true;
		}

		private calcHash(): string {
			var sHash: string = "";

			for(var i: uint = 0; i < this._pComponentList.length; i++){
				var sComponentHash: string = this._pComponentList[i].getHash(this._pComponentShiftList[i]);
				sHash += sComponentHash + ":" + this._pComponentCountMap[sComponentHash].toString() + ":";	
			}

			return sHash;
		}
	}

	export class ShaderInputBlend implements IAFXShaderInputBlend {
		private _pUniformNameToRealMap: StringMap = null;
		private _pUniformByRealNameMap: IAFXVariableDeclMap = null;
		private _pUniformDefaultValueMap: any = null;

		private _pTextureNameToRealMap: StringMap = null;
		private _pTextureByRealNameMap: IAFXVariableDeclMap = null;

		private _pForeignByNameMap: IAFXVariableDeclMap = null;

		inline get uniformNameToReal(): StringMap{
			return this._pUniformNameToRealMap;
		}

		inline get uniformByRealName(): IAFXVariableDeclMap{
			return this._pUniformByRealNameMap;
		}

		inline get uniformDefaultValue(): any {
			return this._pUniformDefaultValueMap;
		}

		inline get textureNameToReal(): StringMap {
			return this._pTextureNameToRealMap;
		}

		inline get textureByRealName(): IAFXVariableDeclMap {
			return this._pTextureByRealNameMap;
		}

		inline get foreignByName(): IAFXVariableDeclMap {
			return this._pForeignByNameMap;
		}

		constructor() {
			this._pUniformNameToRealMap = <StringMap>{};
			this._pUniformByRealNameMap = <IAFXVariableDeclMap>{};
			this._pUniformDefaultValueMap = <any>{};

			this._pTextureNameToRealMap = <StringMap>{}; 
			this._pTextureByRealNameMap = <IAFXVariableDeclMap><any>{
				TEXTURE0  : null,
                TEXTURE1  : null,
                TEXTURE2  : null,
                TEXTURE3  : null,
                TEXTURE4  : null,
                TEXTURE5  : null,
                TEXTURE6  : null,
                TEXTURE7  : null,
                TEXTURE8  : null,
                TEXTURE9  : null,
                TEXTURE10 : null,
                TEXTURE11 : null,
                TEXTURE12 : null,
                TEXTURE13 : null,
                TEXTURE14 : null,
                TEXTURE15 : null
			};
			
			this._pForeignByNameMap = <IAFXVariableDeclMap>{};
		}

		addDataFromPass(pPass: IAFXPassInstruction): void {
			var pUniformMap: IAFXVariableDeclMap = pPass._getFullUniformMap();
			var pForeignMap: IAFXVariableDeclMap = pPass._getFullForeignMap();
			var pTextureMap: IAFXVariableDeclMap = pPass._getFullTextureMap();

			var pVar: IAFXVariableDeclInstruction = null;
			
			for(var i in pForeignMap){
				pVar = pForeignMap[i];

				this._pForeignByNameMap[pVar.getName()] = pVar;
			}

			for(var i in pTextureMap){
				pVar = pTextureMap[i];

				this._pTextureNameToRealMap[pVar.getName()] = pVar.getRealName();
				this._pTextureByRealNameMap[pVar.getRealName()] = pVar;
			}

			for(var i in pUniformMap){
				pVar = pUniformMap[i];

				this.addUniformVariable(pVar, "", "");
			}

		}

		generateKeys(): void {

		}

		private addUniformVariable(pVariable: IAFXVariableDeclInstruction, 
								   sPrevName: string, sPrevRealName: string): void {
			var sName: string = "";
			var sRealName: string = "";

			if(sPrevName !== ""){
				sName = sPrevName + "." + pVariable.getName();
			}
			else {
				sName = pVariable.getName();
			}

			if(sPrevRealName !== ""){
				sRealName = sPrevRealName + "." + pVariable.getRealName();
			}
			else {
				sRealName = pVariable.getRealName();
			}

			var pHasVar: IAFXVariableDeclInstruction = this._pUniformByRealNameMap[sRealName];
			
			if(isDef(pHasVar) && !pHasVar.getType().isEqual(pVariable.getType())){
				debug_warning("You used uniforms with the same real-names. Now we don`t work very well with that.");
				return;
			}

			var pVariableType: IAFXVariableTypeInstruction = pVariable.getType();

			if(!pVariableType.isComplex()){
				this._pUniformNameToRealMap[sName] = sRealName;
				this._pUniformByRealNameMap[sRealName] = pVariable;
				this._pUniformDefaultValueMap[sRealName] = pVariable.getDefaultValue();
			}
			else {
				var pFieldNameList: string[] = pVariableType.getFieldNameList();
				
				for(var i: uint = 0; i < pFieldNameList.length; i++){
					this.addUniformVariable(pVariableType.getField(pFieldNameList[i]), sName, sRealName);
				}
			}
		}

	}
}

#endif