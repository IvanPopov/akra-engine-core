/// <reference path="../idl/IAFXComposer.ts" />
/// <reference path="../idl/IAFXEffect.ts" />
/// <reference path="../idl/IEngine.ts" />
/// <reference path="../idl/IResourcePool.ts" />
/// <reference path="../idl/IAFXComponent.ts" />
/// <reference path="../idl/IAFXMaker.ts" />
/// <reference path="../idl/IRenderer.ts" />
/// <reference path="../idl/IIndexData.ts" />
/// <reference path="../idl/IBufferMap.ts" />
/// <reference path="../idl/IAFXBlender.ts" />
/// <reference path="../idl/EPrimitiveTypes.ts" />
/// <reference path="../idl/IRID.ts" />

/// <reference path="../math/math.ts" />
/// <reference path="../logger.ts" />
/// <reference path="../color/colors.ts" />
/// <reference path="../limit.ts" />
/// <reference path="../webgl/webgl.ts" />
/// <reference path="../render/render.ts" />

/// <reference path="../util/ObjectArray.ts" />

/// <reference path="instructions/VariableInstruction.ts" />
/// <reference path="SamplerBlender.ts" />
/// <reference path="Blender.ts" />
/// <reference path="Effect.ts" />
/// <reference path="../model/MeshSubset.ts" />

module akra.fx {

	import MeshSubset = model.MeshSubset;
	import Vec2 = math.Vec2;

	/** @const */
	var RID_TOTAL = 1024;


	//#define FAST_SET_UNIFORM(pInput, eIndex, pValue) pInput.uniforms[this._pSystemUniformsNameIndexList[eIndex]] = pValue;
	//#define PREPARE_INDEX(eIndex, sName) this._pSystemUniformsNameIndexList[eIndex] = VariableDeclInstruction._getIndex(sName);


	interface AIPreRenderState {
		isClear: boolean;

		primType: EPrimitiveTypes;
		offset: uint;
		length: uint;
		index: IIndexData;
		//flows: IDataFlow[];
		flows: IObjectArray<IDataFlow>;
	}

	enum AESystemUniformsIndices {
		k_ModelMatrix,
		k_FramebufferSize,
		k_ViewportSize,
		k_ViewMatrix,
		k_ProjMatrix,
		k_InvViewCameraMat,
		k_CameraPosition,
		k_WorldPosition,
		k_WorldScale,
		k_WorldOrientation,
		k_LocalPosition,
		k_LocalScale,
		k_LocalOrientation,
		k_LocalMatrix,
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
		private _pTechniqueNeedUpdateMap: IMap<boolean> = null;

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

		private _pComposerState = {
			"mesh": {
				"isSkinned": false,
				"isOptimizedSkinned": false
			},
			"object": {
				"isBillboard": false
			},
			"terrain": {
				"isROAM": false
			},
			"renderable": {
				"isAdvancedIndex": false
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
		private _bIsFirstApplySystemUnifoms: boolean = true;

		constructor(pEngine: IEngine) {
			this._pEngine = pEngine;

			this._pBlender = new Blender(this);

			this._pTechniqueToBlendMap = <IAFXComponentBlendMap>{};
			this._pTechniqueToOwnBlendMap = <IAFXComponentBlendMap>{};
			this._pTechniqueLastGlobalBlendMap = <IAFXComponentBlendMap>{};
			this._pTechniqueNeedUpdateMap = <IMap<boolean>>{};

			this._pEffectResourceToComponentBlendMap = <IAFXComponentBlendMap>{};

			this._pGlobalEffectResorceIdStack = [];
			this._pGlobalComponentBlendStack = [];
			this._pGlobalComponentBlend = null;

			this.initPostEffectTextures();


			if (isNull(Composer.pDefaultSamplerBlender)) {
				Composer.pDefaultSamplerBlender = new SamplerBlender();
			}
		}

		getComponentByName(sComponentName: string): IAFXComponent {
			return <IAFXComponent>this._pEngine.getResourceManager().getComponentPool().findResource(sComponentName);
		}

		final getEngine(): IEngine {
			return this._pEngine;
		}

		//-----------------------------------------------------------------------------//
		//-----------------------------API for Effect-resource-------------------------//
		//-----------------------------------------------------------------------------//

		getComponentCountForEffect(pEffectResource: IEffect): uint {
			var id: uint = pEffectResource.getResourceHandle();

			if (isDef(this._pEffectResourceToComponentBlendMap[id])) {
				return this._pEffectResourceToComponentBlendMap[id].getComponentCount();
			}
			else {
				return 0;
			}
		}

		getTotalPassesForEffect(pEffectResource: IEffect): uint {
			var id: uint = pEffectResource.getResourceHandle();

			if (isDef(this._pEffectResourceToComponentBlendMap[id])) {
				return this._pEffectResourceToComponentBlendMap[id].getTotalPasses();
			}
			else {
				return 0;
			}
		}

		addComponentToEffect(pEffectResource: IEffect, pComponent: IAFXComponent, iShift: int, iPass: uint): boolean {
			var id: uint = pEffectResource.getResourceHandle();
			var pCurrentBlend: IAFXComponentBlend = null;

			if (isDef(this._pEffectResourceToComponentBlendMap[id])) {
				pCurrentBlend = this._pEffectResourceToComponentBlendMap[id];
			}

			var pNewBlend: IAFXComponentBlend = this._pBlender.addComponentToBlend(pCurrentBlend, pComponent, iShift, iPass);
			if (isNull(pNewBlend)) {
				return false;
			}

			this._pEffectResourceToComponentBlendMap[id] = pNewBlend;
			return true;
		}

		removeComponentFromEffect(pEffectResource: IEffect, pComponent: IAFXComponent, iShift: int, iPass: uint): boolean {
			var id: uint = pEffectResource.getResourceHandle();
			var pCurrentBlend: IAFXComponentBlend = null;

			if (isDef(this._pEffectResourceToComponentBlendMap[id])) {
				pCurrentBlend = this._pEffectResourceToComponentBlendMap[id];
			}

			var pNewBlend: IAFXComponentBlend = this._pBlender.removeComponentFromBlend(pCurrentBlend, pComponent, iShift, iPass);
			if (isNull(pNewBlend)) {
				return false;
			}

			this._pEffectResourceToComponentBlendMap[id] = pNewBlend;
			return true;
		}

		hasComponentForEffect(pEffectResource: IEffect,
			pComponent: IAFXComponent, iShift: int, iPass: uint): boolean {
			var id: uint = pEffectResource.getResourceHandle();
			var pCurrentBlend: IAFXComponentBlend = null;

			if (isDef(this._pEffectResourceToComponentBlendMap[id])) {
				pCurrentBlend = this._pEffectResourceToComponentBlendMap[id];
			}

			if (isNull(pCurrentBlend)) {
				return false;
			}

			return pCurrentBlend.containComponent(pComponent, iShift, iPass);
		}

		activateEffectResource(pEffectResource: IEffect, iShift: int): boolean {
			var id: uint = pEffectResource.getResourceHandle();
			var pComponentBlend: IAFXComponentBlend = this._pEffectResourceToComponentBlendMap[id];

			if (!isDef(pComponentBlend)) {
				return false
			}

			var pNewGlobalBlend: IAFXComponentBlend = null;

			if (isNull(this._pGlobalComponentBlend)) {
				pNewGlobalBlend = pComponentBlend;
			}
			else {
				pNewGlobalBlend = this._pBlender.addBlendToBlend(this._pGlobalComponentBlend, pComponentBlend, iShift);
			}

			if (isNull(pNewGlobalBlend)) {
				return false;
			}

			this._pGlobalEffectResorceIdStack.push(id);
			this._pGlobalComponentBlendStack.push(pNewGlobalBlend);

			this._pGlobalComponentBlend = pNewGlobalBlend;

			return true;
		}

		deactivateEffectResource(pEffectResource: IEffect): boolean {
			var id: uint = pEffectResource.getResourceHandle();
			var iStackLength: uint = this._pGlobalEffectResorceIdStack.length;

			if (iStackLength === 0) {
				return false;
			}

			var iLastId: uint = this._pGlobalEffectResorceIdStack[iStackLength - 1];

			if (iLastId !== id) {
				return false;
			}

			this._pGlobalEffectResorceIdStack.splice(iStackLength - 1, 1);
			this._pGlobalComponentBlendStack.splice(iStackLength - 1, 1);

			if (iStackLength > 1) {
				this._pGlobalComponentBlend = this._pGlobalComponentBlendStack[iStackLength - 2];
			}
			else {
				this._pGlobalComponentBlend = null;
			}

			return true;
		}

		getPassInputBlendForEffect(pEffectResource: IEffect, iPass: uint): IAFXPassInputBlend {
			var id: uint = pEffectResource.getResourceHandle();
			var pBlend: IAFXComponentBlend = this._pEffectResourceToComponentBlendMap[id];

			if (!isDef(this._pEffectResourceToComponentBlendMap[id])) {
				return null;
			}

			if (!pBlend.isReadyToUse()) {
				pBlend.finalizeBlend();
			}

			return pBlend.getPassInputForPass(iPass);
		}

		//-----------------------------------------------------------------------------//
		//----------------------------API for RenderTechnique--------------------------//
		//-----------------------------------------------------------------------------//

		copyTechniqueOwnComponentBlend(pFrom: IRenderTechnique, pTo: IRenderTechnique) : void {
			var iFromId: uint = pFrom.guid;
			var iToId: uint = pTo.guid;

			var pCurrentBlendTo: IAFXComponentBlend = null;
			var pCurrentBlendFrom: IAFXComponentBlend = null;
			
			if (isDef(this._pTechniqueToOwnBlendMap[iFromId])) {
				pCurrentBlendFrom = this._pTechniqueToOwnBlendMap[iFromId];
			}
			
			if (isDef(this._pTechniqueToOwnBlendMap[iToId])) {
				pCurrentBlendTo = this._pTechniqueToOwnBlendMap[iToId];
			}

			var pNewBlend: IAFXComponentBlend = this._pBlender.addBlendToBlend(pCurrentBlendTo, pCurrentBlendFrom, 0);

			this._pTechniqueToOwnBlendMap[iToId] = pNewBlend;
			this._pTechniqueNeedUpdateMap[iToId] = true;
		}

		getMinShiftForOwnTechniqueBlend(pRenderTechnique: IRenderTechnique): int {
			var id: uint = pRenderTechnique.guid;
			var pBlend: IAFXComponentBlend = this._pTechniqueToOwnBlendMap[id];

			if (isDefAndNotNull(this._pTechniqueToOwnBlendMap[id])) {
				return pBlend._getMinShift();
			}
			else {
				return 0;
			}
		}

		getTotalPassesForTechnique(pRenderTechnique: IRenderTechnique): uint {
			this.prepareTechniqueBlend(pRenderTechnique);

			var id: uint = pRenderTechnique.guid;

			if (isDefAndNotNull(this._pTechniqueToBlendMap[id])) {
				return this._pTechniqueToBlendMap[id].getTotalPasses();
			}
			else {
				return 0;
			}
		}

		addOwnComponentToTechnique(pRenderTechnique: IRenderTechnique,
			pComponent: IAFXComponent, iShift: int, iPass: uint): boolean {
			var id: uint = pRenderTechnique.guid;
			var pCurrentBlend: IAFXComponentBlend = null;

			if (isDef(this._pTechniqueToOwnBlendMap[id])) {
				pCurrentBlend = this._pTechniqueToOwnBlendMap[id];
			}

			var pNewBlend: IAFXComponentBlend = this._pBlender.addComponentToBlend(pCurrentBlend, pComponent, iShift, iPass);

			if (isNull(pNewBlend)) {
				return false;
			}

			this._pTechniqueToOwnBlendMap[id] = pNewBlend;
			this._pTechniqueNeedUpdateMap[id] = true;

			return true;
		}

		removeOwnComponentToTechnique(pRenderTechnique: IRenderTechnique,
			pComponent: IAFXComponent, iShift: int, iPass: uint): boolean {
			var id: uint = pRenderTechnique.guid;
			var pCurrentBlend: IAFXComponentBlend = null;

			if (isDef(this._pTechniqueToOwnBlendMap[id])) {
				pCurrentBlend = this._pTechniqueToOwnBlendMap[id];
			}

			var pNewBlend: IAFXComponentBlend = this._pBlender.removeComponentFromBlend(pCurrentBlend, pComponent, iShift, iPass);
			if (isNull(pNewBlend)) {
				return false;
			}

			this._pTechniqueToOwnBlendMap[id] = pNewBlend;
			this._pTechniqueNeedUpdateMap[id] = true;
			return true;
		}

		hasOwnComponentInTechnique(pRenderTechnique: IRenderTechnique,
			pComponent: IAFXComponent, iShift: int, iPass: uint): boolean {
			var id: uint = pRenderTechnique.guid;
			var pCurrentBlend: IAFXComponentBlend = null;

			if (isDef(this._pTechniqueToOwnBlendMap[id])) {
				pCurrentBlend = this._pTechniqueToOwnBlendMap[id];
			}

			if (isNull(pCurrentBlend)) {
				return false;
			}

			return pCurrentBlend.containComponent(pComponent, iShift, iPass);
		}

		prepareTechniqueBlend(pRenderTechnique: IRenderTechnique): boolean {
			if (pRenderTechnique.isFreeze()) {
				return true;
			}

			var id: uint = pRenderTechnique.guid;

			var isTechniqueUpdate: boolean = !!(this._pTechniqueNeedUpdateMap[id]);
			var isUpdateGlobalBlend: boolean = (this._pGlobalComponentBlend !== this._pTechniqueLastGlobalBlendMap[id]);
			var isNeedToUpdatePasses: boolean = false;

			if (isTechniqueUpdate || isUpdateGlobalBlend) {
				var iEffect: uint = pRenderTechnique.getMethod().getEffect().getResourceHandle();
				var pEffectBlend: IAFXComponentBlend = this._pEffectResourceToComponentBlendMap[iEffect] || null;
				var pTechniqueBlend: IAFXComponentBlend = this._pTechniqueToOwnBlendMap[id] || null;

				var pNewBlend: IAFXComponentBlend = null;

				pNewBlend = this._pBlender.addBlendToBlend(this._pGlobalComponentBlend, pEffectBlend, 0);
				pNewBlend = this._pBlender.addBlendToBlend(pNewBlend, pTechniqueBlend, 0);

				if (this._pTechniqueToBlendMap[id] !== pNewBlend) {
					isNeedToUpdatePasses = true;
				}

				this._pTechniqueToBlendMap[id] = pNewBlend;
				this._pTechniqueNeedUpdateMap[id] = false;
				this._pTechniqueLastGlobalBlendMap[id] = this._pGlobalComponentBlend;
			}

			var pBlend: IAFXComponentBlend = this._pTechniqueToBlendMap[id];

			if (isDefAndNotNull(pBlend)) {
				if (!pBlend.isReadyToUse()) {
					isNeedToUpdatePasses = true;
				}

				if (!pBlend.finalizeBlend()) {
					return false;
				}

				if (isNeedToUpdatePasses) {
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
			this._pTechniqueNeedUpdateMap[pRenderTechnique.guid] = true;
		}

		getPassInputBlendForTechnique(pRenderTechnique: IRenderTechnique, iPass: uint): IAFXPassInputBlend {
			var id: uint = pRenderTechnique.guid;

			if (!isDef(this._pTechniqueToBlendMap[id])) {
				return null;
			}

			return this._pTechniqueToBlendMap[id].getPassInputForPass(iPass);
		}


		//-----------------------------------------------------------------------------//
		//---------------------------------API for render------------------------------//
		//-----------------------------------------------------------------------------//

		applyBufferMap(pMap: IBufferMap): boolean {
			this._pCurrentBufferMap = pMap;
			return true;
			// var pBufferMap: util.BufferMap = <util.BufferMap>pMap;

			// var pState: AIPreRenderState = this._pPreRenderState;

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

			// 	logger.error("Could not blend buffer maps");
			// 	return false;
			// }

			// var pFlows: IDataFlow[] = pBufferMap.flows;

			// for(var i: uint = 0; i < pFlows.length; i++){
			// 	pState.flows.push(pFlows[i]);
			// }

			// pState.isClear = false;
		}

		applySurfaceMaterial(pSurfaceMaterial: ISurfaceMaterial): boolean {
			this._pCurrentSurfaceMaterial = pSurfaceMaterial;
			return true;
		}

		_setCurrentSceneObject(pSceneObject: ISceneObject): void {
			this._pCurrentSceneObject = pSceneObject;
		}

		_setCurrentViewport(pViewport: IViewport): void {
			this._pCurrentViewport = pViewport;
		}

		_setCurrentRenderableObject(pRenderable: IRenderableObject): void {
			this._pCurrentRenderable = pRenderable;
		}

		_getCurrentSceneObject(): ISceneObject {
			return this._pCurrentSceneObject;
		}

		_getCurrentViewport(): IViewport {
			return this._pCurrentViewport;
		}

		_getCurrentRenderableObject(): IRenderableObject {
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
			var id: uint = pRenderTechnique.guid;
			var pComponentBlend: IAFXComponentBlend = this._pTechniqueToBlendMap[id];
			var pPassInstructionList: IAFXPassInstruction[] = pComponentBlend.getPassListAtPass(iPass);

			this.prepareComposerState();

			pPassBlend = this._pBlender.generatePassBlend(pPassInstructionList, this._pComposerState,
				pPassInput.foreigns, pPassInput.uniforms);
			// }

			if (isNull(pPassBlend)) {
				logger.error("Could not render. Error with generation pass-blend.");
				return;
			}

			pMaker = pPassBlend.generateFXMaker(pPassInput,
				this._pCurrentSurfaceMaterial,
				this._pCurrentBufferMap);
			if (isNull(pMaker)) {
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


		_loadEffectFromSyntaxTree(pTree: parser.IParseTree, sFileName: string): boolean {
			if (config.AFX_ENABLE_TEXT_EFFECTS) {
				var pEffect: IAFXEffect = new Effect(this);
				// LOG(sFileName, pTree);
				pEffect.setAnalyzedFileName(sFileName);
				// LOG("\n\n\n-------------------------Try to analyze '" + sFileName + "'-------------");
				var isOk: boolean = pEffect.analyze(pTree);

				if (isOk) {
					// LOG("------ANALYZE IS GOOD '" + sFileName + "'.")
					var pTechniqueList: IAFXTechniqueInstruction[] = pEffect.getTechniqueList();

					for (var i: uint = 0; i < pTechniqueList.length; i++) {
						isOk = this.initComponent(pTechniqueList[i]);
						if (!isOk) {
							logger.warn("Cannot initialize fx-component from technique '" + pTechniqueList[i]._getName() + "'.");
							return false;
						}
					}
				}
				else {
					logger.warn("Error are occured during analyze of effect file '" + sFileName + "'.");
					return false;
				}

				return true;
			}

			return false;
		}

		_loadEffectFromBinary(pData: Uint8Array, sFileName: string): boolean {
			return false;
		}

		private initComponent(pTechnique: IAFXTechniqueInstruction): boolean {
			var sTechniqueName: string = pTechnique._getName();
			var pComponentPool: IResourcePool<IAFXComponent> = this._pEngine.getResourceManager().getComponentPool();

			if (!isNull(pComponentPool.findResource(sTechniqueName))) {
				return false;
			}

			var pComponent: IAFXComponent = <IAFXComponent>pComponentPool.createResource(sTechniqueName);
			pComponent.setTechnique(pTechnique);

			pTechnique._finalize(this);

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

		protected bNormalFix: boolean = true;
		protected bUseNormalMap: boolean = true;
		protected bIsDebug: boolean = false;
		protected bIsRealNormal: boolean = false;
		protected bTerrainBlackSectors: boolean = false;
		public bShowTriangles: boolean = false;

		//sun parameters
		public kFixNormal: float = 0.43;
		public fSunSpecular: float = 0.5;
		public fSunAmbient: float = 0.22;

		//fog
		public cHeightFalloff: float = 0.;/*0.04;*/
		public cGlobalDensity: float = 0.;/*0.002;*/

		_calcRenderID(pSceneObject: ISceneObject, pRenderable: IRenderableObject, bCreateIfNotExists: boolean = false): int {
			//assume, that less than 1024 draw calls may be & less than 1024 scene object will be rendered.
			//beacause only 1024

			var iSceneObjectGuid: int = !isDefAndNotNull(pSceneObject) ? 0 : pSceneObject.guid;
			var iRenderableObjectGuid: int = !isDefAndNotNull(pRenderable) ? MAX_UINT32 : pRenderable.guid;

			if (this._nRidSO === RID_TOTAL || this._nRidRE === RID_TOTAL) {
				this._pRidTable = <any>{};
				this._nRidRE = 0;
				this._nRidSO = 0;
			}

			var pRidTable: IRIDTable = this._pRidTable;
			var pRidMap: IRIDMap = this._pRidMap;
			var pRidByRenderable: IMap<int> = pRidTable[iSceneObjectGuid];
			var pRidPair: IRIDPair;

			var iRid: int = 0;

			if (!isDefAndNotNull(pRidByRenderable)) {
				if (!bCreateIfNotExists) {
					return 0;
				}

				pRidByRenderable = pRidTable[iSceneObjectGuid] = <any>{};
				pRidByRenderable[0] = this._nRidSO++;
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
					pRidPair = pRidMap[iRid] = { renderable: null, object: null };
				}

				// LOG("render pair created with id: ", iRid, "roid(", iRenderableObjectGuid, "): ", this._nRidRE, "soid(", iSceneObjectGuid,"): ", pRidByRenderable[0]);

				pRidPair.renderable = pRenderable;
				pRidPair.object = pSceneObject;

				this._nRidRE++;
			}

			return iRid;
		}

		_getRenderableByRid(iRid: int): IRenderableObject {
			var pRidPair: IRIDPair = this._pRidMap[iRid];
			var pRenderable: IRenderableObject = isDefAndNotNull(pRidPair) ? pRidPair.renderable : null;
			return isNull(pRenderable) || pRenderable.isFrozen() ? null : pRenderable;
		}

		_getObjectByRid(iRid: int): ISceneObject {
			var pRidPair: IRIDPair = this._pRidMap[iRid];
			var pSceneObject: ISceneObject = isDefAndNotNull(pRidPair) ? pRidPair.object : null;
			return isNull(pSceneObject) || pSceneObject.isFrozen() ? null : pSceneObject;
		}

		private applySystemUnifoms(pPassInput: IAFXPassInputBlend): void {
			if (this._bIsFirstApplySystemUnifoms) {

				this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_ModelMatrix] = instructions.VariableDeclInstruction._getIndex("MODEL_MATRIX");
				this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_FramebufferSize] = instructions.VariableDeclInstruction._getIndex("FRAMEBUFFER_SIZE");
				this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_ViewportSize] = instructions.VariableDeclInstruction._getIndex("VIEWPORT_SIZE");
				this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_ViewMatrix] = instructions.VariableDeclInstruction._getIndex("VIEW_MATRIX");
				this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_ProjMatrix] = instructions.VariableDeclInstruction._getIndex("PROJ_MATRIX");
				this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_InvViewCameraMat] = instructions.VariableDeclInstruction._getIndex("INV_VIEW_CAMERA_MAT");
				this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_CameraPosition] = instructions.VariableDeclInstruction._getIndex("CAMERA_POSITION");
				this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_WorldPosition] = instructions.VariableDeclInstruction._getIndex("WORLD_POSITION");
				this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_WorldScale] = instructions.VariableDeclInstruction._getIndex("WORLD_SCALE");
				this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_WorldOrientation] = instructions.VariableDeclInstruction._getIndex("WORLD_ORIENTATION");
				this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_LocalScale] = instructions.VariableDeclInstruction._getIndex("LOCAL_SCALE");
				this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_LocalPosition] = instructions.VariableDeclInstruction._getIndex("LOCAL_POSITION");
				this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_LocalOrientation] = instructions.VariableDeclInstruction._getIndex("LOCAL_ORIENTATION");
				this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_LocalMatrix] = instructions.VariableDeclInstruction._getIndex("LOCAL_MATRIX");
				this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_OptimizedProjMatrix] = instructions.VariableDeclInstruction._getIndex("OPTIMIZED_PROJ_MATRIX");
				this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_BindShapeMatrix] = instructions.VariableDeclInstruction._getIndex("BIND_SHAPE_MATRIX");
				this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_RenderObjectId] = instructions.VariableDeclInstruction._getIndex("RENDER_OBJECT_ID");
				this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_WireframeOverlay] = instructions.VariableDeclInstruction._getIndex("WIREFRAME_OVERLAY");
				this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_InputTextureSize] = instructions.VariableDeclInstruction._getIndex("INPUT_TEXTURE_SIZE");
				this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_InputTextureRatio] = instructions.VariableDeclInstruction._getIndex("INPUT_TEXTURE_RATIO");

				this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_useNormal] = instructions.VariableDeclInstruction._getIndex("useNormal");
				this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_isDebug] = instructions.VariableDeclInstruction._getIndex("isDebug");
				this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_isRealNormal] = instructions.VariableDeclInstruction._getIndex("isRealNormal");
				this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_normalFix] = instructions.VariableDeclInstruction._getIndex("normalFix");
				this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_isWithBalckSectors] = instructions.VariableDeclInstruction._getIndex("isWithBalckSectors");
				this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_showTriangles] = instructions.VariableDeclInstruction._getIndex("showTriangles");
				this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_u1] = instructions.VariableDeclInstruction._getIndex("u1");
				this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_kFixNormal] = instructions.VariableDeclInstruction._getIndex("kFixNormal");
				this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_fSunAmbient] = instructions.VariableDeclInstruction._getIndex("fSunAmbient");
				this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_fSunSpecular] = instructions.VariableDeclInstruction._getIndex("fSunSpecular");
				this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_cHeightFalloff] = instructions.VariableDeclInstruction._getIndex("cHeightFalloff");
				this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_cGlobalDensity] = instructions.VariableDeclInstruction._getIndex("cGlobalDensity");

				this._bIsFirstApplySystemUnifoms = false;
			}

			var pSceneObject: ISceneObject = this._getCurrentSceneObject();
			var pViewport: IViewport = this._getCurrentViewport();
			var pRenderable: IRenderableObject = this._getCurrentRenderableObject();

			var iRenderableID: int = this._calcRenderID(pSceneObject, pRenderable, true);
			var iIndex: uint = 0;

			if (!isNull(pSceneObject)) {
				//pSceneObject.getWorldMatrix()
			pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_ModelMatrix]] = pSceneObject.getWorldMatrix();

				pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_WorldPosition]] = pSceneObject.getWorldPosition();
				pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_WorldScale]] = pSceneObject.getWorldScale();
				pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_WorldOrientation]] = pSceneObject.getWorldOrientation();

				pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_LocalScale]] = pSceneObject.getLocalScale();
				pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_LocalPosition]] = pSceneObject.getLocalPosition();
				pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_LocalOrientation]] = pSceneObject.getLocalOrientation();
				pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_LocalMatrix]] = pSceneObject.getLocalMatrix();
			}

			if (!isNull(pViewport)) {
				pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_FramebufferSize]] = Vec2.temp(pViewport.getWidth(), pViewport.getHeight());
				pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_ViewportSize]] = Vec2.temp(pViewport.getActualWidth(), pViewport.getActualHeight());

				var pCamera: ICamera = pViewport.getCamera();
				if (!isNull(pCamera)) {

					pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_ViewMatrix]] = pCamera.getViewMatrix();
					pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_ProjMatrix]] = pCamera.getProjectionMatrix();
					pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_InvViewCameraMat]] = pCamera.getWorldMatrix();
					pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_CameraPosition]] = pCamera.getWorldPosition();

					if (pCamera.getType() === EEntityTypes.SHADOW_CASTER) {
						pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_OptimizedProjMatrix]] = (<IShadowCaster>pCamera).getOptimizedProjection();
					}
				}
			}

			if (!isNull(pRenderable)) {

				if (MeshSubset.isMeshSubset(pRenderable) && (<IMeshSubset>pRenderable).isSkinned()) {
					pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_BindShapeMatrix]] = (<IMeshSubset>pRenderable).getSkin().getBindMatrix();
				}

				pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_RenderObjectId]] = iRenderableID;
				pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_WireframeOverlay]] = pRenderable["_bWireframeOverlay"];
			}

			if (!isNull(this._pLastRenderTarget)) {
				var pLastTexture: ITexture = this._pLastRenderTarget === this._pRenderTargetA ?
					this._pPostEffectTextureA : this._pPostEffectTextureB;

				pPassInput.setTexture("INPUT_TEXTURE", pLastTexture);
				pPassInput.setSamplerTexture("INPUT_SAMPLER", pLastTexture);

				pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_InputTextureSize]] =
				Vec2.temp(pLastTexture.getWidth(), pLastTexture.getHeight());
				pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_InputTextureRatio]] =
				Vec2.temp(this._pCurrentViewport.getActualWidth() / pLastTexture.getWidth(), this._pCurrentViewport.getActualHeight() / pLastTexture.getHeight());

			}

			pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_useNormal]] = this.bUseNormalMap;
			pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_isDebug]] = this.bIsDebug;
			pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_isRealNormal]] = this.bIsRealNormal;
			pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_normalFix]] = this.bNormalFix;
			pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_isWithBalckSectors]] = this.bTerrainBlackSectors;
			pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_showTriangles]] = this.bShowTriangles;
			pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_u1]] = 64;
			pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_kFixNormal]] = this.kFixNormal;
			pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_fSunAmbient]] = this.fSunAmbient;
			pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_fSunSpecular]] = this.fSunSpecular;
			pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_cHeightFalloff]] = this.cHeightFalloff;
			pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_cGlobalDensity]] = this.cGlobalDensity;

			pPassInput.setUniform("isBillboard", this._pCurrentSceneObject && this._pCurrentSceneObject.isBillboard());

			if (this._pCurrentViewport.getType() === EViewportTypes.DSVIEWPORT || this._pCurrentViewport.getType() === EViewportTypes.LPPVIEWPORT) {
				pPassInput.setForeign("isUsedPhong", (<I3DViewport>this._pCurrentViewport).getShadingModel() === EShadingModel.PHONG);
			}
		}

		private prepareComposerState(): void {
			if (!isNull(this._pCurrentRenderable)) {
				this._pComposerState.renderable.isAdvancedIndex = this._pCurrentRenderable.getData().useAdvancedIndex();
				this._pComposerState.object.isBillboard = this._pCurrentSceneObject && this._pCurrentSceneObject.isBillboard();


				if (MeshSubset.isMeshSubset(this._pCurrentRenderable) && (<IMeshSubset>this._pCurrentRenderable).isSkinned()) {
					this._pComposerState.mesh.isSkinned = true;
					this._pComposerState.mesh.isOptimizedSkinned = (<IMeshSubset>this._pCurrentRenderable).isOptimizedSkinned();
				}
				else {
					this._pComposerState.mesh.isSkinned = false;
					this._pComposerState.mesh.isOptimizedSkinned = false;
				}
			}

			if (!isNull(this._pCurrentSceneObject)) {
				if (this._pCurrentSceneObject.getType() === EEntityTypes.TERRAIN_ROAM) {
					this._pComposerState.terrain.isROAM = true;
				}
				else {
					this._pComposerState.terrain.isROAM = false;
				}
			}
		}

		private initPostEffectTextures(): void {
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

			this._pPostEffectDepthBuffer = <webgl.WebGLInternalRenderBuffer>pRmgr.getRenderBufferPool().createResource(".global-post-effect-depth");
			(<webgl.WebGLInternalRenderBuffer>this._pPostEffectDepthBuffer).create(gl.DEPTH_COMPONENT, 512, 512, false);

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

			if (pRenderTechnique.hasPostEffect()) {
				if (pEntry.viewport.getActualWidth() > this._pRenderTargetA.getWidth() ||
					pEntry.viewport.getActualHeight()  > this._pRenderTargetA.getHeight()) {

					this.resizePostEffectTextures(pEntry.viewport.getActualWidth(), pEntry.viewport.getActualHeight());
				}

				if (pRenderTechnique.isFirstPass(iPass)) {
					var pRenderViewport: IViewport = pEntry.viewport;

					pRenderer._setDepthBufferParams(false, false, 0);
					pRenderer._setRenderTarget(this._pRenderTargetA);

					var pViewportState: IViewportState = pRenderViewport._getViewportState();
					this._pPostEffectViewport.setDimensions(0., 0.,
						pRenderViewport.getActualWidth() / this._pRenderTargetA.getWidth(), pRenderViewport.getActualHeight() / this._pRenderTargetA.getHeight());
					this._pPostEffectViewport.setDepthParams(pViewportState.depthTest, pViewportState.depthWrite, pViewportState.depthFunction);
					this._pPostEffectViewport.setCullingMode(pViewportState.cullingMode);

					// pRenderer._lockRenderTarget();

					if (pRenderViewport.getClearEveryFrame()) {
						this._pPostEffectViewport.clear(pViewportState.clearBuffers,
							pViewportState.clearColor,
							pViewportState.clearDepth, 0);
					}
					else {
						this._pPostEffectViewport.clear(EFrameBufferTypes.COLOR | EFrameBufferTypes.DEPTH,
							color.ZERO,
							1., 0);
					}

					// pRenderer._unlockRenderTarget();					
				}


				if (!pRenderTechnique.isPostEffectPass(iPass)) {
					this._pLastRenderTarget = this._pRenderTargetA;
					pEntry.renderTarget = this._pRenderTargetA;

					pEntry.viewport = this._pPostEffectViewport;
				}
				else {
					if (pRenderTechnique.isLastPass(iPass)) {
						this._pLastRenderTarget = null;
						// pEntry.renderTarget = null;
					}
					else {
						if (this._pLastRenderTarget === this._pRenderTargetA) {
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
