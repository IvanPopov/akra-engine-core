#ifndef AFXCOMPOSER_TS
#define AFXCOMPOSER_TS

#include "IAFXComposer.ts"
#include "io/files.ts"
#include "IAFXEffect.ts"
#include "fx/Effect.ts"
#include "IEngine.ts"

#ifdef DEBUG

#include "util/EffectParser.ts"
#include "IResourcePool.ts"

#endif

#include "IAFXComponent.ts"
#include "fx/ComponentBlend.ts"

module akra.fx {
	export class Composer implements IAFXComposer {
		private _pEngine: IEngine = null;

		private _pEffectResourceToComponentBlendMap: IAFXComponentBlendMap = null;
		private _pComponentBlendByHashMap: IAFXComponentBlendMap = null;

		constructor(pEngine: IEngine){
			this._pEngine = pEngine;

			this._pEffectResourceToComponentBlendMap = <IAFXComponentBlendMap>{};
			this._pComponentBlendByHashMap = <IAFXComponentBlendMap>{};
		}

		getComponentByName(sComponentName: string): IAFXComponent {
			return <IAFXComponent>this._pEngine.getResourceManager().componentPool.findResource(sComponentName);
		}

		inline getEngine(): IEngine {
			return this._pEngine;
		}

		//-----------------------------------------------------------------------------//
		//-----------------------------API for Effect-resource-------------------------//
		//-----------------------------------------------------------------------------//
		
		getComponentCountForEffect(pEffectResource: IEffect): uint {
			var id: uint = pEffectResource.resourceHandle;

			if(isDef(this._pEffectResourceToComponentBlendMap[id])) {
				return this._pEffectResourceToComponentBlendMap[id].getComponentCount();
			}
			else {
				return 0;
			}
		}

		getTotalPassesForEffect(pEffectResource: IEffect): uint {
			var id: uint = pEffectResource.resourceHandle;
			
			if(isDef(this._pEffectResourceToComponentBlendMap[id])) {
				return this._pEffectResourceToComponentBlendMap[id].getTotalValidPasses();
			}
			else {
				return 0;
			}
		}

		addComponentToEffect(pEffectResource: IEffect, pComponent: IAFXComponent, iShift: int): bool {
			var id: uint = pEffectResource.resourceHandle;
			var pCurrentBlend: IAFXComponentBlend = null;

			if(isDef(this._pEffectResourceToComponentBlendMap[id])){
				pCurrentBlend = this._pEffectResourceToComponentBlendMap[id];
			}
			
			var pNewBlend: IAFXComponentBlend = this.addComponentToBlend(pCurrentBlend, pComponent, iShift);
			if(isNull(pNewBlend)){
				return false;
			}

			this._pEffectResourceToComponentBlendMap[id] = pNewBlend;
			return true;
		}

		removeComponentFromEffect(pEffectResource: IEffect, pComponent: IAFXComponent, iShift: int): bool {
			var id: uint = pEffectResource.resourceHandle;
			var pCurrentBlend: IAFXComponentBlend = null;

			if(isDef(this._pEffectResourceToComponentBlendMap[id])){
				pCurrentBlend = this._pEffectResourceToComponentBlendMap[id];
			}
			
			var pNewBlend: IAFXComponentBlend = this.removeComponentFromBlend(pCurrentBlend, pComponent, iShift);
			if(isNull(pNewBlend)){
				return false;
			}

			this._pEffectResourceToComponentBlendMap[id] = pNewBlend;
			return true;
		}


		//-----------------------------------------------------------------------------//
		//-----------------------API for load components/AFXEffects--------------------//
		//-----------------------------------------------------------------------------//

#ifdef DEBUG
		_loadEffectFromSyntaxTree(pTree: IParseTree, sFileName: string): bool {
			var pEffect: IAFXEffect = new fx.Effect(this);
			// LOG(sFileName, pTree);
			pEffect.setAnalyzedFileName(sFileName);
			// LOG("\n\n\n-------------------------Try to analyze '" + sFileName + "'-------------");
			var isOk: bool = pEffect.analyze(pTree);

			if(isOk){
				// LOG("------ANALYZE IS GOOD '" + sFileName + "'.")
				var pTechniqueList: IAFXTechniqueInstruction[] = pEffect.getTechniqueList();

				for(var i: uint = 0; i < pTechniqueList.length; i++){
					isOk = this.initComponent(pTechniqueList[i]);
					if(!isOk){
						WARNING("Cannot initialize fx-component from technique '" + pTechniqueList[i].getName() + "'.");
						return false;
					}
				}
			}
			else {
				WARNING("Error are occured during analyze of effect file '" + sFileName + "'.");
				return false;
			}

			return true;
		}
#endif

		_loadEffectFromBinary(pData: Uint8Array, sFileName: string): bool {
			return false;
		}

		private initComponent(pTechnique: IAFXTechniqueInstruction): bool {
			var sTechniqueName: string = pTechnique.getName();
			var pComponentPool: IResourcePool = this._pEngine.getResourceManager().componentPool;

			if(!isNull(pComponentPool.findResource(sTechniqueName))){
				return false;
			}

			var pComponent: IAFXComponent = <IAFXComponent>pComponentPool.createResource(sTechniqueName);
			pComponent.create();
			pComponent.setTechnique(pTechnique);

			return true;
		}

		private addComponentToBlend(pComponentBlend: IAFXComponentBlend, 
									pComponent: IAFXComponent, iShift: int): IAFXComponentBlend {
			
			var pNewBlend: IAFXComponentBlend = null;

			if(isNull(pNewBlend)){
				pNewBlend = new ComponentBlend(this);
			}
			else {
				pNewBlend = pComponentBlend.clone();
			}

			var pTechnique: IAFXTechniqueInstruction = pComponent.getTechnique();
			var pTechComponentList: IAFXComponent[] = pTechnique.getFullComponentList();
			var pTechComponentShiftList: int[] = pTechnique.getFullComponentShiftList();

			if(!isNull(pTechComponentList)){
				for(var i: uint = 0; i < pTechComponentList.length; i++){
					pNewBlend.addComponent(pTechComponentList[i], pTechComponentShiftList[i] + iShift);	
				}
			}

			pNewBlend.addComponent(pComponent, iShift);

			var sNewBlendHash: string = pNewBlend.getHash();

			if(isDef(this._pComponentBlendByHashMap[sNewBlendHash])){
				return this._pComponentBlendByHashMap[sNewBlendHash];
			}
			else {
				if(!this.registerComponentBlend(pNewBlend)){
					return null;
				}

				return pNewBlend;
			}

			return null;
		}

		private removeComponentFromBlend(pComponentBlend: IAFXComponentBlend, 
										 pComponent: IAFXComponent, iShift: int): IAFXComponentBlend {
			if(isNull(pComponentBlend)){
				WARNING("You try to remove component '" + pComponent.getName() + 
						"' with shift " + iShift.toString() + "from empty blend.");
				return null;	
			}

			var sComponentHash: string = pComponent.getHash(iShift);

			if(!pComponentBlend.containComponentHash(sComponentHash)){
				WARNING("You try to remove component '" + pComponent.getName() + 
						"' with shift " + iShift.toString() + "from blend that not contain it.");
				return null;
			}

			var pNewBlend: IAFXComponentBlend = pComponentBlend.clone();

			var pTechnique: IAFXTechniqueInstruction = pComponent.getTechnique();
			var pTechComponentList: IAFXComponent[] = pTechnique.getFullComponentList();
			var pTechComponentShiftList: int[] = pTechnique.getFullComponentShiftList();

			if(!isNull(pTechComponentList)){
				for(var i: uint = 0; i < pTechComponentList.length; i++){
					pNewBlend.removeComponent(pTechComponentList[i], pTechComponentShiftList[i] + iShift);	
				}
			}

			pNewBlend.removeComponent(pComponent, iShift);

			var sNewBlendHash: string = pNewBlend.getHash();

			if(isDef(this._pComponentBlendByHashMap[sNewBlendHash])){
				return this._pComponentBlendByHashMap[sNewBlendHash];
			}
			else {
				if(!this.registerComponentBlend(pNewBlend)){
					return null;
				}

				return pNewBlend;
			}

			return null;			
		}

		private registerComponentBlend(pComponentBlend: IAFXComponentBlend): bool {
			var sHash: string = pComponentBlend.getHash();

			if(isDef(this._pComponentBlendByHashMap[sHash])){
				return false;
			}

			this._pComponentBlendByHashMap[sHash] = pComponentBlend;
			return true;
		}
	}
}

#endif