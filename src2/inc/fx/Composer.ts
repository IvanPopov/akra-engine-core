#ifndef AFXCOMPOSER_TS
#define AFXCOMPOSER_TS

#include "IAFXComposer.ts"
#include "io/files.ts"
#include "IAFXEffect.ts"
#include "fx/Effect.ts"
#include "IEngine.ts"

#ifdef AFX_ENABLE_TEXT_EFFECTS

#include "util/EffectParser.ts"
#include "IResourcePool.ts"

#endif

#include "IAFXComponent.ts"
#include "fx/Blender.ts"

#include "IAFXMaker.ts"
#include "util/ObjectArray.ts"

#include "util/BufferMap.ts"
#include "fx/SamplerBlender.ts"
#include "IRenderer.ts"

#define RID_TOTAL 1024

#define FAST_SET_UNIFORM(pInput, eIndex, pValue) pInput.uniforms[this._pSystemUniformsNameIndexList[eIndex]] = pValue;
#define PREPARE_INDEX(eIndex, sName) this._pSystemUniformsNameIndexList[eIndex] = VariableDeclInstruction._getIndex(sName);

// #define FAST_SET_UNIFORM(pInput, sName, pValue) pInput.setUniform(sName, pValue);
// iIndex = pInput._getUniformVarNameIndex(sName); if(iIndex > 0) pInput.uniforms[iIndex] = pValue;
//if(pInput.hasUniform(sName)) pInput.uniforms[pInput._getUniformVarNameIndex(sName)] = pValue;

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

	export enum ESystemUniformsIndices{
		k_ModelMatrix,
		k_FramebufferSize,
		k_ViewportSize,
		k_ViewMatrix,
		k_ProjMatrix,
		k_InvViewCameraMat,
		k_CameraPosition,
		k_OptimizedProjMatrix,
		k_BindShapeMatrix,
		k_RenderObjectId,
		k_WireframeOverlay,
		// k_InputTexture,
		// k_InputSampler,
		k_InputTextureSize,
		k_InputTextureRatio,
		
		k_useNormal,
		k_isDebug,
		k_isRealNormal,
		k_normalFix,
		k_isWithBalckSectors,
		k_showTriangles,
		k_u1,
		k_kFixNormal,
		k_fSunAmbient,
		k_fSunSpecular,
		k_cHeightFalloff,
		k_cGlobalDensity
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
		private _pCurrentViewport: IViewport = null;
		private _pCurrentRenderable: IRenderableObject = null;

		private _pCurrentBufferMap: IBufferMap = null;
		private _pCurrentSurfaceMaterial: ISurfaceMaterial = null;

		private _pComposerState: any = { 
			mesh : { 
				isSkinned : false, 
				isOptimizedSkinned : false, 

				isSprite : false,
				isBillboard: false
			},
			terrain : { 
				isROAM : false 
			},
			renderable: { 
				isAdvancedIndex: false 
			} 
		};

		/** Render targets for global-post effects */
		private _pRenderTargetA: IRenderTarget = null;
		private _pRenderTargetB: IRenderTarget = null;
		private _pLastRenderTarget: IRenderTarget = null;
		private _pPostEffectViewport: IViewport = null;

		private _pPostEffectTextureA: ITexture = null;
		private _pPostEffectTextureB: ITexture = null;
		private _pPostEffectDepthBuffer: IPixelBuffer = null;

		//Temporary objects for fast work
		static pDefaultSamplerBlender: SamplerBlender = null;

		//render id data
		private _pRidTable: IRIDTable = <any>{};
		private _pRidMap: IRIDMap = <any>{};
		private _nRidSO: int = 0;
		private _nRidRE: int = 0;
		
		//For fast set system uniforms
		private _pSystemUniformsNameIndexList: uint[] = new Array();
		private _bIsFirstApplySystemUnifoms: bool = true; 
		
		constructor(pEngine: IEngine){
			this._pEngine = pEngine;

			this._pBlender = new Blender(this);

			this._pTechniqueToBlendMap = <IAFXComponentBlendMap>{};
			this._pTechniqueToOwnBlendMap = <IAFXComponentBlendMap>{};
			this._pTechniqueLastGlobalBlendMap = <IAFXComponentBlendMap>{};
			this._pTechniqueNeedUpdateMap = <BoolMap>{};

			this._pEffectResourceToComponentBlendMap = <IAFXComponentBlendMap>{};

			this._pGlobalEffectResorceIdStack = [];
			this._pGlobalComponentBlendStack = [];
			this._pGlobalComponentBlend = null;

			this.initPostEffectTextures();


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

		hasComponentForEffect(pEffectResource:IEffect, 
							  pComponent: IAFXComponent, iShift: int, iPass: uint): bool {
			var id: uint = pEffectResource.resourceHandle;
			var pCurrentBlend: IAFXComponentBlend = null;

			if(isDef(this._pEffectResourceToComponentBlendMap[id])){
				pCurrentBlend = this._pEffectResourceToComponentBlendMap[id];
			}

			if(isNull(pCurrentBlend)){
				return false;
			}

			return pCurrentBlend.containComponent(pComponent, iShift, iPass);
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

		getPassInputBlendForEffect(pEffectResource: IEffect, iPass: uint): IAFXPassInputBlend {
			var id: uint = pEffectResource.resourceHandle;
			var pBlend: IAFXComponentBlend = this._pEffectResourceToComponentBlendMap[id];

			if(!isDef(this._pEffectResourceToComponentBlendMap[id])){
				return null;
			}

			if(!pBlend.isReadyToUse()) {
				pBlend.finalizeBlend();
			}
			
			return pBlend.getPassInputForPass(iPass);
		}

		//-----------------------------------------------------------------------------//
		//----------------------------API for RenderTechnique--------------------------//
		//-----------------------------------------------------------------------------//

		getMinShiftForOwnTechniqueBlend(pRenderTechnique: IRenderTechnique): int {
			var id: uint = pRenderTechnique.getGuid();
			var pBlend: IAFXComponentBlend = this._pTechniqueToOwnBlendMap[id];

			if(isDefAndNotNull(this._pTechniqueToOwnBlendMap[id])){
				return pBlend._getMinShift();
			}
			else {
				return 0;
			}
		}

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

		hasOwnComponentInTechnique(pRenderTechnique: IRenderTechnique, 
								   pComponent: IAFXComponent, iShift: int, iPass: uint): bool {
			var id: uint = pRenderTechnique.getGuid();
			var pCurrentBlend: IAFXComponentBlend = null;

			if(isDef(this._pTechniqueToOwnBlendMap[id])){
				pCurrentBlend = this._pTechniqueToOwnBlendMap[id];
			}

			if(isNull(pCurrentBlend)){
				return false;
			}

			return pCurrentBlend.containComponent(pComponent, iShift, iPass);
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

				pRenderTechnique._setPostEffectsFrom(pBlend.getPostEffectStartPass());
				return true;
			}
			else {
				return false;
			}
		}

		markTechniqueAsNeedUpdate(pRenderTechnique: IRenderTechnique): void {
			this._pTechniqueNeedUpdateMap[pRenderTechnique.getGuid()] = true;
		}

		getPassInputBlendForTechnique(pRenderTechnique: IRenderTechnique, iPass: uint): IAFXPassInputBlend {
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

		inline _setCurrentSceneObject(pSceneObject: ISceneObject): void {
			this._pCurrentSceneObject = pSceneObject;
		}

		inline _setCurrentViewport(pViewport: IViewport): void {
			this._pCurrentViewport = pViewport;
		}

		inline _setCurrentRenderableObject(pRenderable: IRenderableObject): void {
			this._pCurrentRenderable = pRenderable;
		}

		inline _getCurrentSceneObject(): ISceneObject {
			return this._pCurrentSceneObject;
		}

		inline _getCurrentViewport(): IViewport {
			return this._pCurrentViewport;
		}

		inline _getCurrentRenderableObject(): IRenderableObject {
			return this._pCurrentRenderable;
		}

		_setDefaultCurrentState(): void {
			this._setCurrentViewport(null);
			this._setCurrentRenderableObject(null);
			this._setCurrentSceneObject(null);
		}


		renderTechniquePass(pRenderTechnique: IRenderTechnique, iPass: uint): void {
			// if(true){
			// 	return;
			// }
			var pPass: IRenderPass = pRenderTechnique.getPass(iPass);
			var pPassInput: IAFXPassInputBlend = pPass.getPassInput();

			var pPassBlend: IAFXPassBlend = null;
			var pMaker: IAFXMaker = null;

			this.applySystemUnifoms(pPassInput);
			
			// if(!pPassInput._isNeedToCalcShader()){
			// 	//TODO: set pShader to shader program by id
			// }
			// else {
				// if(!pPassInput._isNeedToCalcBlend()){
				// 	pPassBlend = this._pBlender.getPassBlendById(pPassInput._getLastPassBlendId());
				// }
				// else {
			var id: uint = pRenderTechnique.getGuid();
			var pComponentBlend: IAFXComponentBlend = this._pTechniqueToBlendMap[id];
			var pPassInstructionList: IAFXPassInstruction[] = pComponentBlend.getPassListAtPass(iPass);

			this.prepareComposerState();

			pPassBlend = this._pBlender.generatePassBlend(pPassInstructionList, this._pComposerState, 
														  pPassInput.foreigns, pPassInput.uniforms);
				// }

			if(isNull(pPassBlend)){
				ERROR("Could not render. Error with generation pass-blend.");
				return;
			}

			pMaker = pPassBlend.generateFXMaker(pPassInput, 
												this._pCurrentSurfaceMaterial, 
												this._pCurrentBufferMap);
			if(isNull(pMaker)){
				return;
			}
			// }

			//TODO: generate input from PassInputBlend to correct unifoms and attributes list
			//TODO: generate RenderEntry
				
			//this.clearPreRenderState();
			var pInput: IShaderInput = pMaker._make(pPassInput, this._pCurrentBufferMap);
			var pRenderer: IRenderer = this._pEngine.getRenderer();
			var pEntry: IRenderEntry = pRenderer.createEntry();

			pEntry.maker = pMaker;
			pEntry.input = pInput;
			pEntry.viewport = this._pCurrentViewport;
			pEntry.bufferMap = this._pCurrentBufferMap;

			this.prepareRenderTarget(pEntry, pRenderTechnique, iPass);			

			pRenderer.pushEntry(pEntry);
		}

		//-----------------------------------------------------------------------------//
		//-----------------------API for load components/AFXEffects--------------------//
		//-----------------------------------------------------------------------------//

#ifdef AFX_ENABLE_TEXT_EFFECTS
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

			pTechnique.finalize(this);

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

		protected bNormalFix: bool = true;
		protected bUseNormalMap: bool = true;
		protected bIsDebug: bool = false;
		protected bIsRealNormal: bool = false;
		protected bTerrainBlackSectors: bool = false;
		protected bShowTriangles: bool = false;

		//sun parameters
		protected kFixNormal: float = 0.43;
		protected fSunSpecular: float = 0.5;
		protected fSunAmbient: float = 0.22;

		//fog
		protected cHeightFalloff: float = 0.04;
		protected cGlobalDensity: float = 0.002;

		_calcRenderID(pSceneObject: ISceneObject, pRenderable: IRenderableObject, bCreateIfNotExists: bool = false): int {
			//assume, that less than 1024 draw calls may be & less than 1024 scene object will be rendered.
			//beacause only 1024
			
			var iSceneObjectGuid: int = isNull(pSceneObject)? 0: pSceneObject.getGuid();
			var iRenderableObjectGuid: int = isNull(pRenderable)? MAX_UINT32: pRenderable.getGuid();

			if (this._nRidSO === RID_TOTAL || this._nRidRE === RID_TOTAL) {
				this._pRidTable = <any>{};
				this._nRidRE = 0;
				this._nRidSO = 0;
			}

			var pRidTable: IRIDTable = this._pRidTable;
			var pRidMap: IRIDMap = this._pRidMap;
			var pRidByRenderable: IntMap = pRidTable[iSceneObjectGuid];
			var pRidPair: IRIDPair;

			var iRid: int = 0;

			if (!isDefAndNotNull(pRidByRenderable)) {
				if (!bCreateIfNotExists) {
					return 0;
				}

				pRidByRenderable = pRidTable[iSceneObjectGuid] = <any>{};
				pRidByRenderable[0] = this._nRidSO ++;
			}
			
			
			iRid = pRidByRenderable[iRenderableObjectGuid];

			if (!isDefAndNotNull(iRid)) {
				if (!bCreateIfNotExists) {
					// LOG("here...")
					return 1 + pRidByRenderable[0] * 1024;
				}

				pRidByRenderable[iRenderableObjectGuid] = iRid = 1 + pRidByRenderable[0] * 1024 + this._nRidRE;
				pRidPair = pRidMap[iRid];

				if (!isDefAndNotNull(pRidPair)) {
					pRidPair = pRidMap[iRid] = {renderable: null, object: null};
				}

				// LOG("render pair created with id: ", iRid, "roid(", iRenderableObjectGuid, "): ", this._nRidRE, "soid(", iSceneObjectGuid,"): ", pRidByRenderable[0]);

				pRidPair.renderable = pRenderable;
				pRidPair.object = pSceneObject;

				this._nRidRE ++;
			}

			return iRid;
		}

		inline _getRenderableByRid(iRid: int): IRenderableObject {
			var pRidPair: IRIDPair = this._pRidMap[iRid];
			return isDefAndNotNull(pRidPair)? pRidPair.renderable: null;
		}

		inline _getObjectByRid(iRid: int): ISceneObject {
			var pRidPair: IRIDPair = this._pRidMap[iRid];
			return isDefAndNotNull(pRidPair)? pRidPair.object: null;
		}

		private applySystemUnifoms(pPassInput: IAFXPassInputBlend): void {
			if(this._bIsFirstApplySystemUnifoms){
				PREPARE_INDEX(ESystemUniformsIndices.k_ModelMatrix, "MODEL_MATRIX");
				PREPARE_INDEX(ESystemUniformsIndices.k_FramebufferSize, "FRAMEBUFFER_SIZE");
				PREPARE_INDEX(ESystemUniformsIndices.k_ViewportSize, "VIEWPORT_SIZE");
				PREPARE_INDEX(ESystemUniformsIndices.k_ViewMatrix, "VIEW_MATRIX");
				PREPARE_INDEX(ESystemUniformsIndices.k_ProjMatrix, "PROJ_MATRIX");
				PREPARE_INDEX(ESystemUniformsIndices.k_InvViewCameraMat, "INV_VIEW_CAMERA_MAT");
				PREPARE_INDEX(ESystemUniformsIndices.k_CameraPosition, "CAMERA_POSITION");
				PREPARE_INDEX(ESystemUniformsIndices.k_OptimizedProjMatrix, "OPTIMIZED_PROJ_MATRIX");
				PREPARE_INDEX(ESystemUniformsIndices.k_BindShapeMatrix, "BIND_SHAPE_MATRIX");
				PREPARE_INDEX(ESystemUniformsIndices.k_RenderObjectId, "RENDER_OBJECT_ID");
				PREPARE_INDEX(ESystemUniformsIndices.k_WireframeOverlay, "WIREFRAME_OVERLAY");
				PREPARE_INDEX(ESystemUniformsIndices.k_InputTextureSize, "INPUT_TEXTURE_SIZE");
				PREPARE_INDEX(ESystemUniformsIndices.k_InputTextureRatio, "INPUT_TEXTURE_RATIO");

				PREPARE_INDEX(ESystemUniformsIndices.k_useNormal, "useNormal");
				PREPARE_INDEX(ESystemUniformsIndices.k_isDebug, "isDebug");
				PREPARE_INDEX(ESystemUniformsIndices.k_isRealNormal, "isRealNormal");
				PREPARE_INDEX(ESystemUniformsIndices.k_normalFix, "normalFix");
				PREPARE_INDEX(ESystemUniformsIndices.k_isWithBalckSectors, "isWithBalckSectors");
				PREPARE_INDEX(ESystemUniformsIndices.k_showTriangles, "showTriangles");
				PREPARE_INDEX(ESystemUniformsIndices.k_u1, "u1");
				PREPARE_INDEX(ESystemUniformsIndices.k_kFixNormal, "kFixNormal");
				PREPARE_INDEX(ESystemUniformsIndices.k_fSunAmbient, "fSunAmbient");
				PREPARE_INDEX(ESystemUniformsIndices.k_fSunSpecular, "fSunSpecular");
				PREPARE_INDEX(ESystemUniformsIndices.k_cHeightFalloff, "cHeightFalloff");
				PREPARE_INDEX(ESystemUniformsIndices.k_cGlobalDensity, "cGlobalDensity");
				
				this._bIsFirstApplySystemUnifoms = false;
			}
			
			var pSceneObject: ISceneObject = this._getCurrentSceneObject();
			var pViewport: IViewport = this._getCurrentViewport();
			var pRenderable: IRenderableObject = this._getCurrentRenderableObject();

			var iRenderableID: int = this._calcRenderID(pSceneObject, pRenderable, true);
			var iIndex: uint = 0;

			if(!isNull(pSceneObject)){
				FAST_SET_UNIFORM(pPassInput, ESystemUniformsIndices.k_ModelMatrix, pSceneObject.worldMatrix);
			}

			if(!isNull(pViewport)){
				FAST_SET_UNIFORM(pPassInput, ESystemUniformsIndices.k_FramebufferSize, vec2(pViewport.width, pViewport.height));
				FAST_SET_UNIFORM(pPassInput, ESystemUniformsIndices.k_ViewportSize, vec2(pViewport.actualWidth, pViewport.actualHeight));

				var pCamera: ICamera = pViewport.getCamera();
				if(!isNull(pCamera)) { 
					FAST_SET_UNIFORM(pPassInput, ESystemUniformsIndices.k_ViewMatrix, pCamera.viewMatrix);
					FAST_SET_UNIFORM(pPassInput, ESystemUniformsIndices.k_ProjMatrix, pCamera.projectionMatrix);
					FAST_SET_UNIFORM(pPassInput, ESystemUniformsIndices.k_InvViewCameraMat, pCamera.worldMatrix);
					FAST_SET_UNIFORM(pPassInput, ESystemUniformsIndices.k_CameraPosition, pCamera.worldPosition);

					if(pCamera.type === EEntityTypes.SHADOW_CASTER){
						FAST_SET_UNIFORM(pPassInput, ESystemUniformsIndices.k_OptimizedProjMatrix, (<IShadowCaster>pCamera).optimizedProjection);
					}
				}
			}

			if(!isNull(pRenderable)){

				if (render.isMeshSubset(pRenderable) && (<IMeshSubset>pRenderable).isSkinned()){
					FAST_SET_UNIFORM(pPassInput, ESystemUniformsIndices.k_BindShapeMatrix, (<IMeshSubset>pRenderable).skin.getBindMatrix());
				}

				FAST_SET_UNIFORM(pPassInput, ESystemUniformsIndices.k_RenderObjectId, iRenderableID);
				FAST_SET_UNIFORM(pPassInput, ESystemUniformsIndices.k_WireframeOverlay, pRenderable["_bWireframeOverlay"]);
			}

			if(!isNull(this._pLastRenderTarget)){
				var pLastTexture: ITexture = this._pLastRenderTarget === this._pRenderTargetA ? 
												this._pPostEffectTextureA : this._pPostEffectTextureB;

				pPassInput.setTexture("INPUT_TEXTURE", pLastTexture);
				pPassInput.setSamplerTexture("INPUT_SAMPLER", pLastTexture);
				FAST_SET_UNIFORM(pPassInput, ESystemUniformsIndices.k_InputTextureSize, vec2(pLastTexture.width, pLastTexture.height));
				FAST_SET_UNIFORM(pPassInput, ESystemUniformsIndices.k_InputTextureRatio, vec2(this._pCurrentViewport.actualWidth / pLastTexture.width,
											 				 	    this._pCurrentViewport.actualHeight / pLastTexture.height));
			}

			FAST_SET_UNIFORM(pPassInput, ESystemUniformsIndices.k_useNormal, this.bUseNormalMap);
			FAST_SET_UNIFORM(pPassInput, ESystemUniformsIndices.k_isDebug, this.bIsDebug);
			FAST_SET_UNIFORM(pPassInput, ESystemUniformsIndices.k_isRealNormal, this.bIsRealNormal);
			FAST_SET_UNIFORM(pPassInput, ESystemUniformsIndices.k_normalFix, this.bNormalFix);
			FAST_SET_UNIFORM(pPassInput, ESystemUniformsIndices.k_isWithBalckSectors, this.bTerrainBlackSectors);
			FAST_SET_UNIFORM(pPassInput, ESystemUniformsIndices.k_showTriangles, this.bShowTriangles);
			FAST_SET_UNIFORM(pPassInput, ESystemUniformsIndices.k_u1, 64);
			FAST_SET_UNIFORM(pPassInput, ESystemUniformsIndices.k_kFixNormal, this.kFixNormal);
			FAST_SET_UNIFORM(pPassInput, ESystemUniformsIndices.k_fSunAmbient, this.fSunAmbient);
			FAST_SET_UNIFORM(pPassInput, ESystemUniformsIndices.k_fSunSpecular, this.fSunSpecular);
			FAST_SET_UNIFORM(pPassInput, ESystemUniformsIndices.k_cHeightFalloff, this.cHeightFalloff);
			FAST_SET_UNIFORM(pPassInput, ESystemUniformsIndices.k_cGlobalDensity, this.cGlobalDensity);
		}

		private prepareComposerState(): void {
			if(!isNull(this._pCurrentRenderable)){
				this._pComposerState.renderable.isAdvancedIndex = this._pCurrentRenderable.data.useAdvancedIndex();
				this._pComposerState.mesh.isSprite = render.isSprite(this._pCurrentRenderable);
				this._pComposerState.mesh.isBillboard = this._pComposerState.mesh.isSprite && (<ISprite>this._pCurrentSceneObject).isBillboard();
				

				if(render.isMeshSubset(this._pCurrentRenderable) && (<IMeshSubset>this._pCurrentRenderable).isSkinned()){
					this._pComposerState.mesh.isSkinned = true;
					this._pComposerState.mesh.isOptimizedSkinned = (<IMeshSubset>this._pCurrentRenderable).isOptimizedSkinned();	
				}
				else {
					this._pComposerState.mesh.isSkinned = false;
					this._pComposerState.mesh.isOptimizedSkinned = false;
				}
			}

			if(!isNull(this._pCurrentSceneObject)){
				if(this._pCurrentSceneObject.type === EEntityTypes.TERRAIN_ROAM){
					this._pComposerState.terrain.isROAM = true;
				}
				else {
					this._pComposerState.terrain.isROAM = false;
				}
			}
		}

		private initPostEffectTextures(): void{
			var pRmgr: IResourcePoolManager = this._pEngine.getResourceManager();
			this._pPostEffectTextureA = pRmgr.createTexture(".global-post-effect-texture-A");
			this._pPostEffectTextureB = pRmgr.createTexture(".global-post-effect-texture-B");

			this._pPostEffectTextureA.create(512, 512, 1, null, ETextureFlags.RENDERTARGET, 0, 0,
								   ETextureTypes.TEXTURE_2D, EPixelFormats.R8G8B8A8);

			this._pPostEffectTextureB.create(512, 512, 1, null, ETextureFlags.RENDERTARGET, 0, 0,
								   ETextureTypes.TEXTURE_2D, EPixelFormats.R8G8B8A8);

			// this._pPostEffectTextureA.notifyLoaded();
			// this._pPostEffectTextureB.notifyLoaded();

			this._pRenderTargetA = this._pPostEffectTextureA.getBuffer().getRenderTarget();
			this._pRenderTargetB = this._pPostEffectTextureB.getBuffer().getRenderTarget();

			this._pPostEffectDepthBuffer = <webgl.WebGLInternalRenderBuffer>pRmgr.renderBufferPool.createResource(".global-post-effect-depth");
			(<webgl.WebGLInternalRenderBuffer>this._pPostEffectDepthBuffer).create(GL_DEPTH_COMPONENT, 512, 512, false);

			this._pRenderTargetA.attachDepthPixelBuffer(this._pPostEffectDepthBuffer);

			this._pPostEffectViewport = this._pRenderTargetA.addViewport(new render.Viewport(null));
		}

		private resizePostEffectTextures(iWidth: uint, iHeight: uint): void {
			iWidth = math.ceilingPowerOfTwo(iWidth);
			iHeight = math.ceilingPowerOfTwo(iHeight);
			
			this._pPostEffectTextureA.reset(iWidth, iHeight);
			this._pPostEffectTextureB.reset(iWidth, iHeight);
		}

		private prepareRenderTarget(pEntry: IRenderEntry, pRenderTechnique: IRenderTechnique, iPass: uint): void {
			var pRenderer: IRenderer = this._pEngine.getRenderer();
			
			if(pRenderTechnique.hasPostEffect()){
				if (pEntry.viewport.actualWidth > this._pRenderTargetA.width ||
					pEntry.viewport.actualHeight > this._pRenderTargetA.height) {

					this.resizePostEffectTextures(pEntry.viewport.actualWidth, pEntry.viewport.actualHeight);
				}

				if(pRenderTechnique.isFirstPass(iPass)){
					var pRenderViewport: IViewport = pEntry.viewport;

					pRenderer._setDepthBufferParams(false, false, 0);					
					pRenderer._setRenderTarget(this._pRenderTargetA);
					
					var pViewportState: IViewportState = pRenderViewport._getViewportState();
					this._pPostEffectViewport.setDimensions(0., 0., 
																 pRenderViewport.actualWidth / this._pRenderTargetA.width,
																 pRenderViewport.actualHeight / this._pRenderTargetA.height); 
					this._pPostEffectViewport.setDepthParams(pViewportState.depthTest, pViewportState.depthWrite, pViewportState.depthFunction);
					this._pPostEffectViewport.setCullingMode(pViewportState.cullingMode);

					// pRenderer._lockRenderTarget();

					if(pRenderViewport.getClearEveryFrame()){						
						this._pPostEffectViewport.clear(pViewportState.clearBuffers,
															 pViewportState.clearColor,
															 pViewportState.clearDepth, 0);
					}
					else {
						this._pPostEffectViewport.clear(EFrameBufferTypes.COLOR | EFrameBufferTypes.DEPTH,
															 Color.ZERO,
															 1., 0);
					}

					// pRenderer._unlockRenderTarget();					
				}
				

				if(!pRenderTechnique.isPostEffectPass(iPass)){
					this._pLastRenderTarget = this._pRenderTargetA;
					pEntry.renderTarget = this._pRenderTargetA;

					pEntry.viewport = this._pPostEffectViewport;
				}
				else {
					if(pRenderTechnique.isLastPass(iPass)){
						this._pLastRenderTarget = null;
						// pEntry.renderTarget = null;
					}
					else {
						if(this._pLastRenderTarget === this._pRenderTargetA){
							pEntry.renderTarget = this._pRenderTargetB;
							this._pLastRenderTarget = this._pRenderTargetB;
						}
						else {
							pEntry.renderTarget = this._pRenderTargetA;
							this._pLastRenderTarget = this._pRenderTargetA;
						}

						pEntry.viewport = this._pPostEffectViewport;
					}
				}
			}
		}
	}
}

#endif