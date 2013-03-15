#ifndef AFXBLENDER_TS
#define AFXBLENDER_TS

#include "IAFXBlender.ts"

module akra.fx {
	export class Blender implements IAFXBlender {
		private _pComposer: IAFXComposer = null;

		private _pComponentBlendByHashMap: IAFXComponentBlendMap = null;

		private _pBlendWithComponentMap: IAFXComponentBlendMap = null;
		private _pBlendWithBlendMap: IAFXComponentBlendMap = null;

		constructor(pComposer: IAFXComposer) {
			this._pComposer = pComposer;

			this._pComponentBlendByHashMap = <IAFXComponentBlendMap>{};

			this._pBlendWithComponentMap = <IAFXComponentBlendMap>{};
			this._pBlendWithBlendMap = <IAFXComponentBlendMap>{};
		}

		addComponentToBlend(pComponentBlend: IAFXComponentBlend, 
						    pComponent: IAFXComponent, iShift: int, iPass: uint): IAFXComponentBlend {

			var sBlendPartHash: string = isDefAndNotNull(pComponentBlend) ? pComponentBlend.getGuid().toString() : "";
			var sComponentPartHash: string = pComponent.getHash(iShift, iPass);
			var sShortHash: string = sBlendPartHash + "+" + sComponentPartHash;

			if(isDef(this._pBlendWithComponentMap[sShortHash])){
				return this._pBlendWithComponentMap[sShortHash];
			}

			var pNewBlend: IAFXComponentBlend = null;

			if(isNull(pComponentBlend)){
				pNewBlend = new ComponentBlend(this._pComposer);
			}
			else {
				pNewBlend = pComponentBlend.clone();
			}

			var pTechnique: IAFXTechniqueInstruction = pComponent.getTechnique();
			var pTechComponentList: IAFXComponent[] = pTechnique.getFullComponentList();
			var pTechComponentShiftList: int[] = pTechnique.getFullComponentShiftList();

			if(iPass === ALL_PASSES) {
				if(!isNull(pTechComponentList)){
					for(var i: uint = 0; i < pTechComponentList.length; i++){
						pNewBlend.addComponent(pTechComponentList[i], pTechComponentShiftList[i] + iShift, ALL_PASSES);	
					}
				}

				pNewBlend.addComponent(pComponent, iShift, ALL_PASSES);
			}
			else {
				if(!isNull(pTechComponentList)){
					for(var i: uint = 0; i < pTechComponentList.length; i++){
						pNewBlend.addComponent(pTechComponentList[i], pTechComponentShiftList[i] + iShift, iPass - pTechComponentShiftList[i]);	
					}
				}

				pNewBlend.addComponent(pComponent, iShift, iPass);
			}

			this._pBlendWithComponentMap[sShortHash] = pNewBlend;

			var sNewBlendHash: string = pNewBlend.getHash();
			
			if(isDef(this._pComponentBlendByHashMap[sNewBlendHash])){
				return this._pComponentBlendByHashMap[sNewBlendHash];
			}
			else {
				this._pComponentBlendByHashMap[sNewBlendHash] = pNewBlend;
			}

			return pNewBlend;
		}

		removeComponentFromBlend(pComponentBlend: IAFXComponentBlend, 
								 pComponent: IAFXComponent, iShift: int, iPass: uint): IAFXComponentBlend {
			if(isNull(pComponentBlend)){
				WARNING("You try to remove component '" + pComponent.getName() + 
						"' with shift " + iShift.toString() + "from empty blend.");
				return null;	
			}

			var sBlendPartHash: string = isDefAndNotNull(pComponentBlend) ? pComponentBlend.getGuid().toString() : "";
			var sComponentPartHash: string = pComponent.getHash(iShift, iPass);
			var sShortHash: string = sBlendPartHash + "-" + sComponentPartHash;

			if(isDef(this._pBlendWithComponentMap[sShortHash])){
				return this._pBlendWithComponentMap[sShortHash];
			}

			if(!pComponentBlend.containComponentHash(sComponentPartHash)){
				WARNING("You try to remove component '" + pComponent.getName() + 
						"' with shift " + iShift.toString() + "from blend that not contain it.");
				return null;
			}

			var pNewBlend: IAFXComponentBlend = pComponentBlend.clone();

			var pTechnique: IAFXTechniqueInstruction = pComponent.getTechnique();
			var pTechComponentList: IAFXComponent[] = pTechnique.getFullComponentList();
			var pTechComponentShiftList: int[] = pTechnique.getFullComponentShiftList();
			
			if(iPass === ALL_PASSES) {
				if(!isNull(pTechComponentList)){
					for(var i: uint = 0; i < pTechComponentList.length; i++){
						pNewBlend.removeComponent(pTechComponentList[i], pTechComponentShiftList[i] + iShift, ALL_PASSES);	
					}
				}

				pNewBlend.removeComponent(pComponent, iShift, ALL_PASSES);
			}
			else {
				if(!isNull(pTechComponentList)){
					for(var i: uint = 0; i < pTechComponentList.length; i++){
						pNewBlend.removeComponent(pTechComponentList[i], pTechComponentShiftList[i] + iShift, iPass - pTechComponentShiftList[i]);	
					}
				}

				pNewBlend.removeComponent(pComponent, iShift, iPass);
			}

			this._pBlendWithComponentMap[sShortHash] = pNewBlend;

			var sNewBlendHash: string = pNewBlend.getHash();
			
			if(isDef(this._pComponentBlendByHashMap[sNewBlendHash])){
				return this._pComponentBlendByHashMap[sNewBlendHash];
			}
			else {
				this._pComponentBlendByHashMap[sNewBlendHash] = pNewBlend;
			}

			return pNewBlend;
		}

		addBlendToBlend(pComponentBlend: IAFXComponentBlend, 
						pAddBlend: IAFXComponentBlend, iShift: int): IAFXComponentBlend {

			if(isNull(pComponentBlend)){
				return pAddBlend;
			}

			if(isNull(pAddBlend)){
				return pComponentBlend;
			}

			var sShortHash: string = pComponentBlend.getGuid().toString() + "+" + pAddBlend.getGuid().toString();
			if(isDef(this._pBlendWithBlendMap[sShortHash])){
				return this._pBlendWithBlendMap[sShortHash];
			}

			var pNewBlend: IAFXComponentBlend = pComponentBlend.clone();

			var pAddComponentList: IAFXComponent[] = pAddBlend._getComponentList();
			var pAddComponentShiftList: int[] = pAddBlend._getComponentShiftList();
			var pAddComponentPassIdList: uint[] = pAddBlend._getComponentPassIdList();

			for(var i: uint = 0; i < pAddComponentList.length; i++){
				pNewBlend.addComponent(pAddComponentList[i], 
									   pAddComponentShiftList[i] + iShift,
									   pAddComponentPassIdList[i]);
			}

			this._pBlendWithBlendMap[sShortHash] = pNewBlend;

			var sNewBlendHash: string = pNewBlend.getHash();

			if(isDef(this._pComponentBlendByHashMap[sNewBlendHash])){
				return this._pComponentBlendByHashMap[sNewBlendHash];
			}
			else {
				this._pComponentBlendByHashMap[sNewBlendHash] = pNewBlend;
			}

			return pNewBlend;
		}
	}
}

#endif