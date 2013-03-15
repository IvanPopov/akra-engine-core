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
#include "fx/Blender.ts"

module akra.fx {
	export class Composer implements IAFXComposer {
		private _pEngine: IEngine = null;

		private _pTechniqueToBlendMap: IAFXComponentBlendMap = null;
		private _pTechniqueToOwnBlendMap: IAFXComponentBlendMap = null;
		private _pTechniqueLastGlobalBlendMap: IAFXComponentBlendMap = null;
		private _pTechniqueNeedUpdateMap: BoolMap = null;

		private _pEffectResourceToComponentBlendMap: IAFXComponentBlendMap = null;
		private _pBlender: IAFXBlender = null;

		private _pGlobalEffectResorceIdStack: uint[] = null;
		// private _pGlobalEffectResorceShiftStack: int[] = null;
		private _pGlobalComponentBlendStack: IAFXComponentBlend[] = null;
		private _pGlobalComponentBlend: IAFXComponentBlend = null;

		constructor(pEngine: IEngine){
			this._pEngine = pEngine;

			this._pBlender = new Blender(this);

			this._pTechniqueToBlendMap = <IAFXComponentBlendMap>{};
			this._pTechniqueToOwnBlendMap = <IAFXComponentBlendMap>{};
			this._pTechniqueLastGlobalBlendMap = <IAFXComponentBlendMap>{};
			this._pTechniqueNeedUpdateMap = <BoolMap>{};

			this._pEffectResourceToComponentBlendMap = <IAFXComponentBlendMap>{};

			this._pGlobalEffectResorceIdStack = [];
			// this._pGlobalEffectResorceShiftStack = [];
			this._pGlobalComponentBlendStack = [];
			this._pGlobalComponentBlend = null;
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
				return this._pEffectResourceToComponentBlendMap[id].getTotalPasses();
			}
			else {
				return 0;
			}
		}

		addComponentToEffect(pEffectResource: IEffect, pComponent: IAFXComponent, iShift: int, iPass: uint): bool {
			var id: uint = pEffectResource.resourceHandle;
			var pCurrentBlend: IAFXComponentBlend = null;

			if(isDef(this._pEffectResourceToComponentBlendMap[id])){
				pCurrentBlend = this._pEffectResourceToComponentBlendMap[id];
			}
			
			var pNewBlend: IAFXComponentBlend = this._pBlender.addComponentToBlend(pCurrentBlend, pComponent, iShift, iPass);
			if(isNull(pNewBlend)){
				return false;
			}

			this._pEffectResourceToComponentBlendMap[id] = pNewBlend;
			return true;
		}

		removeComponentFromEffect(pEffectResource: IEffect, pComponent: IAFXComponent, iShift: int, iPass: uint): bool {
			var id: uint = pEffectResource.resourceHandle;
			var pCurrentBlend: IAFXComponentBlend = null;

			if(isDef(this._pEffectResourceToComponentBlendMap[id])){
				pCurrentBlend = this._pEffectResourceToComponentBlendMap[id];
			}
			
			var pNewBlend: IAFXComponentBlend = this._pBlender.removeComponentFromBlend(pCurrentBlend, pComponent, iShift, iPass);
			if(isNull(pNewBlend)){
				return false;
			}

			this._pEffectResourceToComponentBlendMap[id] = pNewBlend;
			return true;
		}

		activateEffectResource(pEffectResource: IEffect, iShift: int): bool {
			var id: uint = pEffectResource.resourceHandle;
			var pComponentBlend: IAFXComponentBlend = this._pEffectResourceToComponentBlendMap[id];

			if(!isDef(pComponentBlend)){
				return false
			}

			var pNewGlobalBlend: IAFXComponentBlend = null;

			if(isNull(this._pGlobalComponentBlend)){
				pNewGlobalBlend = pComponentBlend;
			}
			else {
				pNewGlobalBlend = this._pBlender.addBlendToBlend(this._pGlobalComponentBlend, pComponentBlend, iShift);
			}

			if(isNull(pNewGlobalBlend)){
				return false;
			}

			this._pGlobalEffectResorceIdStack.push(id);
			this._pGlobalComponentBlendStack.push(pNewGlobalBlend);

			this._pGlobalComponentBlend = pNewGlobalBlend;

			return true;
		}

		deactivateEffectResource(pEffectResource: IEffect): bool {
			var id: uint = pEffectResource.resourceHandle;
			var iStackLength: uint = this._pGlobalEffectResorceIdStack.length;
			
			if(iStackLength === 0){
				return false;
			}

			var iLastId: uint = this._pGlobalEffectResorceIdStack[iStackLength - 1];

			if(iLastId !== id){
				return false;
			}

			this._pGlobalEffectResorceIdStack.splice(iStackLength - 1, 1);
			this._pGlobalComponentBlendStack.splice(iStackLength - 1, 1);

			if(iStackLength > 1){
				this._pGlobalComponentBlend = this._pGlobalComponentBlendStack[iStackLength - 2];
			}
			else {
				this._pGlobalComponentBlend = null;
			}

			return true;
		}


		//-----------------------------------------------------------------------------//
		//----------------------------API for RenderTechnique--------------------------//
		//-----------------------------------------------------------------------------//

		getTotalPassesForTechnique(pRenderTechnique: IRenderTechnique): uint {
			this.prepareTechniqueBlend(pRenderTechnique);
			
			var id: uint = pRenderTechnique.getGuid();

			if(isDefAndNotNull(this._pTechniqueToBlendMap[id])) {
				return this._pTechniqueToBlendMap[id].getTotalPasses();
			}
			else {
				return 0;
			}
		}
		
		addOwnComponentToTechnique(pRenderTechnique: IRenderTechnique, 
								   pComponent: IAFXComponent, iShift: int, iPass: uint): bool {
			var id: uint = pRenderTechnique.getGuid();
			var pCurrentBlend: IAFXComponentBlend = null;

			if(isDef(this._pTechniqueToOwnBlendMap[id])){
				pCurrentBlend = this._pTechniqueToOwnBlendMap[id];
			}
			
			var pNewBlend: IAFXComponentBlend = this._pBlender.addComponentToBlend(pCurrentBlend, pComponent, iShift, iPass);
			
			if(isNull(pNewBlend)){
				return false;
			}

			this._pTechniqueToOwnBlendMap[id] = pNewBlend;
			this._pTechniqueNeedUpdateMap[id] = true;

			return true;
		}

		removeOwnComponentToTechnique(pRenderTechnique: IRenderTechnique, 
									  pComponent: IAFXComponent, iShift: int, iPass: uint): bool {
			var id: uint = pRenderTechnique.getGuid();
			var pCurrentBlend: IAFXComponentBlend = null;

			if(isDef(this._pTechniqueToOwnBlendMap[id])){
				pCurrentBlend = this._pTechniqueToOwnBlendMap[id];
			}
			
			var pNewBlend: IAFXComponentBlend = this._pBlender.removeComponentFromBlend(pCurrentBlend, pComponent, iShift, iPass);
			if(isNull(pNewBlend)){
				return false;
			}

			this._pTechniqueToOwnBlendMap[id] = pNewBlend;
			this._pTechniqueNeedUpdateMap[id] = true;
			return true;
		}

		prepareTechniqueBlend(pRenderTechnique: IRenderTechnique): bool {
			var id: uint = pRenderTechnique.getGuid();

			var isTechniqueUpdate: bool = !!(this._pTechniqueNeedUpdateMap[id]);
			var isUpdateGlobalBlend: bool = (this._pGlobalComponentBlend !== this._pTechniqueLastGlobalBlendMap[id]);
			
			if(isTechniqueUpdate || isUpdateGlobalBlend){
				var iEffect: uint = pRenderTechnique.getMethod().effect.resourceHandle;
				var pEffectBlend: IAFXComponentBlend = this._pEffectResourceToComponentBlendMap[iEffect] || null;
				var pTechniqueBlend: IAFXComponentBlend = this._pTechniqueToOwnBlendMap[id] || null;

				var pNewBlend: IAFXComponentBlend = null;
				
				pNewBlend = this._pBlender.addBlendToBlend(this._pGlobalComponentBlend, pEffectBlend, 0);
				pNewBlend = this._pBlender.addBlendToBlend(pNewBlend, pTechniqueBlend, 0);

				this._pTechniqueToBlendMap[id] = pNewBlend;
				this._pTechniqueNeedUpdateMap[id] = false;
				this._pTechniqueLastGlobalBlendMap[id] = this._pGlobalComponentBlend;
			}

			if(isDefAndNotNull(this._pTechniqueToBlendMap[id])) {
				return this._pTechniqueToBlendMap[id].finalizeBlend();
			}
			else {
				return false;
			}
		}

		markTechniqueAsNeedUpdate(pRenderTechnique: IRenderTechnique): void {
			this._pTechniqueNeedUpdateMap[pRenderTechnique.getGuid()] = true;
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
	}
}

#endif