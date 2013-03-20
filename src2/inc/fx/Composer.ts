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
#include "fx/Blender.ts"

#include "IAFXMaker.ts"
#include "util/ObjectArray.ts"

#include "util/BufferMap.ts"
#include "fx/SamplerBlender.ts"

module akra.fx {

	export interface IPreRenderState {
		isClear: bool;

		primType: EPrimitiveTypes;
		offset: uint;
		length: uint;
		index: IIndexData;
		//flows: IDataFlow[];
		flows: util.ObjectArray;
	}

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

		//Data for render
		private _pCurrentSceneObject: ISceneObject = null;
		private _pCurrentBufferMap: IBufferMap = null;
		private _pCurrentSurfaceMaterial: ISurfaceMaterial = null;
		//private _pPreRenderState: IPreRenderState = null;

		// private _pSamplerBlender: SamplerBlender = null;

		//Temporary objects for fast work
		static pDefaultSamplerBlender: SamplerBlender = null;

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

			// this._pPreRenderState = {
			// 	isClear: true,

			// 	primType: 0,
			// 	offset: 0,
			// 	length: 0,
			// 	index: null,
			// 	flows: new util.ObjectArray()
			// };

			// this._pSamplerBlender = new SamplerBlender(this);
			// this._pTempPassInstructionList = new ObjectArray();
			if(isNull(Composer.pDefaultSamplerBlender)){
				Composer.pDefaultSamplerBlender = new SamplerBlender();
			}
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
			if(pRenderTechnique.isFreeze()){
				return true;
			}

			var id: uint = pRenderTechnique.getGuid();

			var isTechniqueUpdate: bool = !!(this._pTechniqueNeedUpdateMap[id]);
			var isUpdateGlobalBlend: bool = (this._pGlobalComponentBlend !== this._pTechniqueLastGlobalBlendMap[id]);
			var isNeedToUpdatePasses: bool = false;

			if(isTechniqueUpdate || isUpdateGlobalBlend){
				var iEffect: uint = pRenderTechnique.getMethod().effect.resourceHandle;
				var pEffectBlend: IAFXComponentBlend = this._pEffectResourceToComponentBlendMap[iEffect] || null;
				var pTechniqueBlend: IAFXComponentBlend = this._pTechniqueToOwnBlendMap[id] || null;

				var pNewBlend: IAFXComponentBlend = null;
				
				pNewBlend = this._pBlender.addBlendToBlend(this._pGlobalComponentBlend, pEffectBlend, 0);
				pNewBlend = this._pBlender.addBlendToBlend(pNewBlend, pTechniqueBlend, 0);

				if(this._pTechniqueToBlendMap[id] !== pNewBlend){
					isNeedToUpdatePasses = true;
				}

				this._pTechniqueToBlendMap[id] = pNewBlend;
				this._pTechniqueNeedUpdateMap[id] = false;
				this._pTechniqueLastGlobalBlendMap[id] = this._pGlobalComponentBlend;
			}

			var pBlend: IAFXComponentBlend = this._pTechniqueToBlendMap[id];

			if(isDefAndNotNull(pBlend)) {
				if(!pBlend.isReadyToUse()){
					isNeedToUpdatePasses = true;
				}

				if(!pBlend.finalizeBlend()){
					return false;
				}

				if(isNeedToUpdatePasses) {
					pRenderTechnique.updatePasses(isTechniqueUpdate);
				}
			}
			else {
				return false;
			}
		}

		markTechniqueAsNeedUpdate(pRenderTechnique: IRenderTechnique): void {
			this._pTechniqueNeedUpdateMap[pRenderTechnique.getGuid()] = true;
		}

		getPassInputBlend(pRenderTechnique: IRenderTechnique, iPass: uint): IAFXPassInputBlend {
			var id: uint = pRenderTechnique.getGuid();

			if(!isDef(this._pTechniqueToBlendMap[id])){
				return null;
			}

			return this._pTechniqueToBlendMap[id].getPassInputForPass(iPass);
		}


		//-----------------------------------------------------------------------------//
		//---------------------------------API for render------------------------------//
		//-----------------------------------------------------------------------------//

		applyBufferMap(pMap: IBufferMap): bool {
			this._pCurrentBufferMap = pMap;
			return true;
			// var pBufferMap: util.BufferMap = <util.BufferMap>pMap;

			// var pState: IPreRenderState = this._pPreRenderState;

			// if(pState.isClear){
			// 	pState.primType = pBufferMap.primType;
			// 	pState.offset = pBufferMap.offset;
			// 	pState.length = pBufferMap.length;
			// 	pState.index = pBufferMap.index;
			// }
			// else if(pState.primType !== pBufferMap.primType ||
			// 		pState.offset !== pBufferMap.offset ||
			// 		pState.length !== pBufferMap.length ||
			// 		pState.index !== pBufferMap.index) {

			// 	ERROR("Could not blend buffer maps");
			// 	return false;
			// }

			// var pFlows: IDataFlow[] = pBufferMap.flows;

			// for(var i: uint = 0; i < pFlows.length; i++){
			// 	pState.flows.push(pFlows[i]);
			// }

			// pState.isClear = false;
		}

		applySurfaceMaterial(pSurfaceMaterial: ISurfaceMaterial): bool {
			this._pCurrentSurfaceMaterial = pSurfaceMaterial;
			return true;
		}

		setCurrentSceneObject(pSceneObject: ISceneObject): void {
			this._pCurrentSceneObject = pSceneObject;
		}

		renderTechniquePass(pRenderTechnique: IRenderTechnique, iPass: uint): void {
			var pPass: IRenderPass = pRenderTechnique.getPass(iPass);
			var pPassInput: IAFXPassInputBlend = pPass.getPassInput();

			var pPassBlend: IAFXPassBlend = null;
			var pMaker: IAFXMaker = null;
			
			if(!pPassInput._isNeedToCalcShader()){
				//TODO: set pShader to shader program by id
			}
			else {
				if(!pPassInput._isNeedToCalcBlend()){
					pPassBlend = this._pBlender.getPassBlendById(pPassInput._getLastPassBlendId());
				}
				else {
					var id: uint = pRenderTechnique.getGuid();
					var pComponentBlend: IAFXComponentBlend = this._pTechniqueToBlendMap[id];
					var pPassInstructionList: IAFXPassInstruction[] = pComponentBlend.getPassListAtPass(iPass);
					
					pPassBlend = this._pBlender.generatePassBlend(pPassInstructionList, null, null, null);
				}

				if(isNull(pPassBlend)){
					ERROR("Could not render. Error with generation pass-blend.");
					return;
				}

				pMaker = pPassBlend.generateFXMaker(pPassInput, 
													this._pCurrentSurfaceMaterial, 
													this._pCurrentBufferMap);
				//TODO: generate additional shader params and get shader program
			}

			//TODO: generate input from PassInputBlend to correct unifoms and attributes list
			//TODO: generate RenderEntry
			
			this.clearPreRenderState();
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

		private clearPreRenderState(): void {
			// this._pPreRenderState.primType = 0;
			// this._pPreRenderState.offset = 0;
			// this._pPreRenderState.length = 0;
			// this._pPreRenderState.index = null;
			// this._pPreRenderState.flows.clear(false);

			// this._pPreRenderState.isClear = true;
		}
	}
}

#endif