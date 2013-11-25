/// <reference path="../idl/AIAFXComposer.ts" />
/// <reference path="../idl/AIAFXEffect.ts" />
/// <reference path="../idl/AIEngine.ts" />
/// <reference path="../idl/AIResourcePool.ts" />
/// <reference path="../idl/AIAFXComponent.ts" />
/// <reference path="../idl/AIAFXMaker.ts" />
/// <reference path="../idl/AIRenderer.ts" />
/// <reference path="../idl/AIIndexData.ts" />
/// <reference path="../idl/AIBufferMap.ts" />
/// <reference path="../idl/AIAFXBlender.ts" />


import math = require("math");
import logger = require("logger");
import color = require("color");
import model = require("model");
import limit = require("limit");
import webgl = require("webgl");
import render = require("render");

import ObjectArray = require("util/ObjectArray");
import SamplerBlender = require("fx/SamplerBlender");
import Blender = require("fx/Blender");
import Effect = require("fx/Effect");

import VariableDeclInstruction = require("fx/VariableInstruction");

import Vec2 = math.Vec2;

/** @const */
var RID_TOTAL = 1024;


//#define FAST_SET_UNIFORM(pInput, eIndex, pValue) pInput.uniforms[this._pSystemUniformsNameIndexList[eIndex]] = pValue;
//#define PREPARE_INDEX(eIndex, sName) this._pSystemUniformsNameIndexList[eIndex] = VariableDeclInstruction._getIndex(sName);


interface AIPreRenderState {
    isClear: boolean;

    primType: AEPrimitiveTypes;
    offset: uint;
    length: uint;
    index: AIIndexData;
    //flows: IDataFlow[];
    flows: AIObjectArray<AIDataFlow>;
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

class Composer implements AIAFXComposer {
    private _pEngine: AIEngine = null;

    private _pTechniqueToBlendMap: AIAFXComponentBlendMap = null;
    private _pTechniqueToOwnBlendMap: AIAFXComponentBlendMap = null;
    private _pTechniqueLastGlobalBlendMap: AIAFXComponentBlendMap = null;
    private _pTechniqueNeedUpdateMap: AIMap<boolean> = null;

    private _pEffectResourceToComponentBlendMap: AIAFXComponentBlendMap = null;
    private _pBlender: AIAFXBlender = null;

    private _pGlobalEffectResorceIdStack: uint[] = null;
    // private _pGlobalEffectResorceShiftStack: int[] = null;
    private _pGlobalComponentBlendStack: AIAFXComponentBlend[] = null;
    private _pGlobalComponentBlend: AIAFXComponentBlend = null;

    //Data for render
    private _pCurrentSceneObject: AISceneObject = null;
    private _pCurrentViewport: AIViewport = null;
    private _pCurrentRenderable: AIRenderableObject = null;

    private _pCurrentBufferMap: AIBufferMap = null;
    private _pCurrentSurfaceMaterial: AISurfaceMaterial = null;

    private _pComposerState: any = {
        mesh: {
            isSkinned: false,
            isOptimizedSkinned: false
        },
        object: {
            isBillboard: false
        },
        terrain: {
            isROAM: false
        },
        renderable: {
            isAdvancedIndex: false
        }
    };

    /** Render targets for global-post effects */
    private _pRenderTargetA: AIRenderTarget = null;
    private _pRenderTargetB: AIRenderTarget = null;
    private _pLastRenderTarget: AIRenderTarget = null;
    private _pPostEffectViewport: AIViewport = null;

    private _pPostEffectTextureA: AITexture = null;
    private _pPostEffectTextureB: AITexture = null;
    private _pPostEffectDepthBuffer: AIPixelBuffer = null;

    //Temporary objects for fast work
    static pDefaultSamplerBlender: SamplerBlender = null;

    //render id data
    private _pRidTable: AIRIDTable = <any>{};
    private _pRidMap: AIRIDMap = <any>{};
    private _nRidSO: int = 0;
    private _nRidRE: int = 0;

    //For fast set system uniforms
    private _pSystemUniformsNameIndexList: uint[] = new Array();
    private _bIsFirstApplySystemUnifoms: boolean = true;

    constructor(pEngine: AIEngine) {
        this._pEngine = pEngine;

        this._pBlender = new Blender(this);

        this._pTechniqueToBlendMap = <AIAFXComponentBlendMap>{};
        this._pTechniqueToOwnBlendMap = <AIAFXComponentBlendMap>{};
        this._pTechniqueLastGlobalBlendMap = <AIAFXComponentBlendMap>{};
        this._pTechniqueNeedUpdateMap = <AIMap<boolean>>{};

        this._pEffectResourceToComponentBlendMap = <AIAFXComponentBlendMap>{};

        this._pGlobalEffectResorceIdStack = [];
        this._pGlobalComponentBlendStack = [];
        this._pGlobalComponentBlend = null;

        this.initPostEffectTextures();


        if (isNull(Composer.pDefaultSamplerBlender)) {
            Composer.pDefaultSamplerBlender = new SamplerBlender();
        }
    }

    getComponentByName(sComponentName: string): AIAFXComponent {
        return <AIAFXComponent>this._pEngine.getResourceManager().componentPool.findResource(sComponentName);
    }

    /** inline */ getEngine(): AIEngine {
        return this._pEngine;
    }

    //-----------------------------------------------------------------------------//
    //-----------------------------API for Effect-resource-------------------------//
    //-----------------------------------------------------------------------------//

    getComponentCountForEffect(pEffectResource: AIEffect): uint {
        var id: uint = pEffectResource.resourceHandle;

        if (isDef(this._pEffectResourceToComponentBlendMap[id])) {
            return this._pEffectResourceToComponentBlendMap[id].getComponentCount();
        }
        else {
            return 0;
        }
    }

    getTotalPassesForEffect(pEffectResource: AIEffect): uint {
        var id: uint = pEffectResource.resourceHandle;

        if (isDef(this._pEffectResourceToComponentBlendMap[id])) {
            return this._pEffectResourceToComponentBlendMap[id].getTotalPasses();
        }
        else {
            return 0;
        }
    }

    addComponentToEffect(pEffectResource: AIEffect, pComponent: AIAFXComponent, iShift: int, iPass: uint): boolean {
        var id: uint = pEffectResource.resourceHandle;
        var pCurrentBlend: AIAFXComponentBlend = null;

        if (isDef(this._pEffectResourceToComponentBlendMap[id])) {
            pCurrentBlend = this._pEffectResourceToComponentBlendMap[id];
        }

        var pNewBlend: AIAFXComponentBlend = this._pBlender.addComponentToBlend(pCurrentBlend, pComponent, iShift, iPass);
        if (isNull(pNewBlend)) {
            return false;
        }

        this._pEffectResourceToComponentBlendMap[id] = pNewBlend;
        return true;
    }

    removeComponentFromEffect(pEffectResource: AIEffect, pComponent: AIAFXComponent, iShift: int, iPass: uint): boolean {
        var id: uint = pEffectResource.resourceHandle;
        var pCurrentBlend: AIAFXComponentBlend = null;

        if (isDef(this._pEffectResourceToComponentBlendMap[id])) {
            pCurrentBlend = this._pEffectResourceToComponentBlendMap[id];
        }

        var pNewBlend: AIAFXComponentBlend = this._pBlender.removeComponentFromBlend(pCurrentBlend, pComponent, iShift, iPass);
        if (isNull(pNewBlend)) {
            return false;
        }

        this._pEffectResourceToComponentBlendMap[id] = pNewBlend;
        return true;
    }

    hasComponentForEffect(pEffectResource: AIEffect,
        pComponent: AIAFXComponent, iShift: int, iPass: uint): boolean {
        var id: uint = pEffectResource.resourceHandle;
        var pCurrentBlend: AIAFXComponentBlend = null;

        if (isDef(this._pEffectResourceToComponentBlendMap[id])) {
            pCurrentBlend = this._pEffectResourceToComponentBlendMap[id];
        }

        if (isNull(pCurrentBlend)) {
            return false;
        }

        return pCurrentBlend.containComponent(pComponent, iShift, iPass);
    }

    activateEffectResource(pEffectResource: AIEffect, iShift: int): boolean {
        var id: uint = pEffectResource.resourceHandle;
        var pComponentBlend: AIAFXComponentBlend = this._pEffectResourceToComponentBlendMap[id];

        if (!isDef(pComponentBlend)) {
				return false
			}

        var pNewGlobalBlend: AIAFXComponentBlend = null;

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

    deactivateEffectResource(pEffectResource: AIEffect): boolean {
        var id: uint = pEffectResource.resourceHandle;
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

    getPassInputBlendForEffect(pEffectResource: AIEffect, iPass: uint): AIAFXPassInputBlend {
        var id: uint = pEffectResource.resourceHandle;
        var pBlend: AIAFXComponentBlend = this._pEffectResourceToComponentBlendMap[id];

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

    getMinShiftForOwnTechniqueBlend(pRenderTechnique: AIRenderTechnique): int {
        var id: uint = pRenderTechnique.getGuid();
        var pBlend: AIAFXComponentBlend = this._pTechniqueToOwnBlendMap[id];

        if (isDefAndNotNull(this._pTechniqueToOwnBlendMap[id])) {
            return pBlend._getMinShift();
        }
        else {
            return 0;
        }
    }

    getTotalPassesForTechnique(pRenderTechnique: AIRenderTechnique): uint {
        this.prepareTechniqueBlend(pRenderTechnique);

        var id: uint = pRenderTechnique.getGuid();

        if (isDefAndNotNull(this._pTechniqueToBlendMap[id])) {
            return this._pTechniqueToBlendMap[id].getTotalPasses();
        }
        else {
            return 0;
        }
    }

    addOwnComponentToTechnique(pRenderTechnique: AIRenderTechnique,
        pComponent: AIAFXComponent, iShift: int, iPass: uint): boolean {
        var id: uint = pRenderTechnique.getGuid();
        var pCurrentBlend: AIAFXComponentBlend = null;

        if (isDef(this._pTechniqueToOwnBlendMap[id])) {
            pCurrentBlend = this._pTechniqueToOwnBlendMap[id];
        }

        var pNewBlend: AIAFXComponentBlend = this._pBlender.addComponentToBlend(pCurrentBlend, pComponent, iShift, iPass);

        if (isNull(pNewBlend)) {
            return false;
        }

        this._pTechniqueToOwnBlendMap[id] = pNewBlend;
        this._pTechniqueNeedUpdateMap[id] = true;

        return true;
    }

    removeOwnComponentToTechnique(pRenderTechnique: AIRenderTechnique,
        pComponent: AIAFXComponent, iShift: int, iPass: uint): boolean {
        var id: uint = pRenderTechnique.getGuid();
        var pCurrentBlend: AIAFXComponentBlend = null;

        if (isDef(this._pTechniqueToOwnBlendMap[id])) {
            pCurrentBlend = this._pTechniqueToOwnBlendMap[id];
        }

        var pNewBlend: AIAFXComponentBlend = this._pBlender.removeComponentFromBlend(pCurrentBlend, pComponent, iShift, iPass);
        if (isNull(pNewBlend)) {
            return false;
        }

        this._pTechniqueToOwnBlendMap[id] = pNewBlend;
        this._pTechniqueNeedUpdateMap[id] = true;
        return true;
    }

    hasOwnComponentInTechnique(pRenderTechnique: AIRenderTechnique,
        pComponent: AIAFXComponent, iShift: int, iPass: uint): boolean {
        var id: uint = pRenderTechnique.getGuid();
        var pCurrentBlend: AIAFXComponentBlend = null;

        if (isDef(this._pTechniqueToOwnBlendMap[id])) {
            pCurrentBlend = this._pTechniqueToOwnBlendMap[id];
        }

        if (isNull(pCurrentBlend)) {
            return false;
        }

        return pCurrentBlend.containComponent(pComponent, iShift, iPass);
    }

    prepareTechniqueBlend(pRenderTechnique: AIRenderTechnique): boolean {
        if (pRenderTechnique.isFreeze()) {
            return true;
        }

        var id: uint = pRenderTechnique.getGuid();

        var isTechniqueUpdate: boolean = !!(this._pTechniqueNeedUpdateMap[id]);
        var isUpdateGlobalBlend: boolean = (this._pGlobalComponentBlend !== this._pTechniqueLastGlobalBlendMap[id]);
        var isNeedToUpdatePasses: boolean = false;

        if (isTechniqueUpdate || isUpdateGlobalBlend) {
            var iEffect: uint = pRenderTechnique.getMethod().effect.resourceHandle;
            var pEffectBlend: AIAFXComponentBlend = this._pEffectResourceToComponentBlendMap[iEffect] || null;
            var pTechniqueBlend: AIAFXComponentBlend = this._pTechniqueToOwnBlendMap[id] || null;

            var pNewBlend: AIAFXComponentBlend = null;

            pNewBlend = this._pBlender.addBlendToBlend(this._pGlobalComponentBlend, pEffectBlend, 0);
            pNewBlend = this._pBlender.addBlendToBlend(pNewBlend, pTechniqueBlend, 0);

            if (this._pTechniqueToBlendMap[id] !== pNewBlend) {
                isNeedToUpdatePasses = true;
            }

            this._pTechniqueToBlendMap[id] = pNewBlend;
            this._pTechniqueNeedUpdateMap[id] = false;
            this._pTechniqueLastGlobalBlendMap[id] = this._pGlobalComponentBlend;
        }

        var pBlend: AIAFXComponentBlend = this._pTechniqueToBlendMap[id];

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

    markTechniqueAsNeedUpdate(pRenderTechnique: AIRenderTechnique): void {
        this._pTechniqueNeedUpdateMap[pRenderTechnique.getGuid()] = true;
    }

    getPassInputBlendForTechnique(pRenderTechnique: AIRenderTechnique, iPass: uint): AIAFXPassInputBlend {
        var id: uint = pRenderTechnique.getGuid();

        if (!isDef(this._pTechniqueToBlendMap[id])) {
            return null;
        }

        return this._pTechniqueToBlendMap[id].getPassInputForPass(iPass);
    }


    //-----------------------------------------------------------------------------//
    //---------------------------------API for render------------------------------//
    //-----------------------------------------------------------------------------//

    applyBufferMap(pMap: AIBufferMap): boolean {
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

    applySurfaceMaterial(pSurfaceMaterial: AISurfaceMaterial): boolean {
        this._pCurrentSurfaceMaterial = pSurfaceMaterial;
        return true;
    }

    /** inline */ _setCurrentSceneObject(pSceneObject: AISceneObject): void {
        this._pCurrentSceneObject = pSceneObject;
    }

    /** inline */ _setCurrentViewport(pViewport: AIViewport): void {
        this._pCurrentViewport = pViewport;
    }

    /** inline */ _setCurrentRenderableObject(pRenderable: AIRenderableObject): void {
        this._pCurrentRenderable = pRenderable;
    }

    /** inline */ _getCurrentSceneObject(): AISceneObject {
        return this._pCurrentSceneObject;
    }

    /** inline */ _getCurrentViewport(): AIViewport {
        return this._pCurrentViewport;
    }

    /** inline */ _getCurrentRenderableObject(): AIRenderableObject {
        return this._pCurrentRenderable;
    }

    _setDefaultCurrentState(): void {
        this._setCurrentViewport(null);
        this._setCurrentRenderableObject(null);
        this._setCurrentSceneObject(null);
    }


    renderTechniquePass(pRenderTechnique: AIRenderTechnique, iPass: uint): void {
        // if(true){
        // 	return;
        // }
        var pPass: AIRenderPass = pRenderTechnique.getPass(iPass);
        var pPassInput: AIAFXPassInputBlend = pPass.getPassInput();

        var pPassBlend: AIAFXPassBlend = null;
        var pMaker: AIAFXMaker = null;

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
        var pComponentBlend: AIAFXComponentBlend = this._pTechniqueToBlendMap[id];
        var pPassInstructionList: AIAFXPassInstruction[] = pComponentBlend.getPassListAtPass(iPass);

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
        var pInput: AIShaderInput = pMaker._make(pPassInput, this._pCurrentBufferMap);
        var pRenderer: AIRenderer = this._pEngine.getRenderer();
        var pEntry: AIRenderEntry = pRenderer.createEntry();

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


    _loadEffectFromSyntaxTree(pTree: AIParseTree, sFileName: string): boolean {
        if (has("AFX_ENABLE_TEXT_EFFECTS")) {
            var pEffect: AIAFXEffect = new Effect(this);
            // LOG(sFileName, pTree);
            pEffect.setAnalyzedFileName(sFileName);
            // LOG("\n\n\n-------------------------Try to analyze '" + sFileName + "'-------------");
            var isOk: boolean = pEffect.analyze(pTree);

            if (isOk) {
                // LOG("------ANALYZE IS GOOD '" + sFileName + "'.")
                var pTechniqueList: AIAFXTechniqueInstruction[] = pEffect.getTechniqueList();

                for (var i: uint = 0; i < pTechniqueList.length; i++) {
                    isOk = this.initComponent(pTechniqueList[i]);
                    if (!isOk) {
                        logger.warn("Cannot initialize fx-component from technique '" + pTechniqueList[i].getName() + "'.");
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

    private initComponent(pTechnique: AIAFXTechniqueInstruction): boolean {
        var sTechniqueName: string = pTechnique.getName();
        var pComponentPool: AIResourcePool = this._pEngine.getResourceManager().componentPool;

        if (!isNull(pComponentPool.findResource(sTechniqueName))) {
            return false;
        }

        var pComponent: AIAFXComponent = <AIAFXComponent>pComponentPool.createResource(sTechniqueName);
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

    protected bNormalFix: boolean = true;
    protected bUseNormalMap: boolean = true;
    protected bIsDebug: boolean = false;
    protected bIsRealNormal: boolean = false;
    protected bTerrainBlackSectors: boolean = false;
    protected bShowTriangles: boolean = false;

    //sun parameters
    protected kFixNormal: float = 0.43;
    protected fSunSpecular: float = 0.5;
    protected fSunAmbient: float = 0.22;

    //fog
    protected cHeightFalloff: float = 0.04;
    protected cGlobalDensity: float = 0.002;

    _calcRenderID(pSceneObject: AISceneObject, pRenderable: AIRenderableObject, bCreateIfNotExists: boolean = false): int {
        //assume, that less than 1024 draw calls may be & less than 1024 scene object will be rendered.
        //beacause only 1024

        var iSceneObjectGuid: int = !isDefAndNotNull(pSceneObject) ? 0 : pSceneObject.getGuid();
        var iRenderableObjectGuid: int = !isDefAndNotNull(pRenderable) ? limit.MAX_UINT32 : pRenderable.getGuid();

        if (this._nRidSO === RID_TOTAL || this._nRidRE === RID_TOTAL) {
            this._pRidTable = <any>{};
            this._nRidRE = 0;
            this._nRidSO = 0;
        }

        var pRidTable: AIRIDTable = this._pRidTable;
        var pRidMap: AIRIDMap = this._pRidMap;
        var pRidByRenderable: AIMap<int> = pRidTable[iSceneObjectGuid];
        var pRidPair: AIRIDPair;

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

    /** inline */ _getRenderableByRid(iRid: int): AIRenderableObject {
        var pRidPair: AIRIDPair = this._pRidMap[iRid];
        var pRenderable: AIRenderableObject = isDefAndNotNull(pRidPair) ? pRidPair.renderable : null;
        return isNull(pRenderable) || pRenderable.isFrozen() ? null : pRenderable;
    }

    /** inline */ _getObjectByRid(iRid: int): AISceneObject {
        var pRidPair: AIRIDPair = this._pRidMap[iRid];
        var pSceneObject: AISceneObject = isDefAndNotNull(pRidPair) ? pRidPair.object : null;
        return isNull(pSceneObject) || pSceneObject.isFrozen() ? null : pSceneObject;
    }

    private applySystemUnifoms(pPassInput: AIAFXPassInputBlend): void {
        if (this._bIsFirstApplySystemUnifoms) {

            this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_ModelMatrix] = VariableDeclInstruction._getIndex("MODEL_MATRIX");
            this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_FramebufferSize] = VariableDeclInstruction._getIndex("FRAMEBUFFER_SIZE");
            this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_ViewportSize] = VariableDeclInstruction._getIndex("VIEWPORT_SIZE");
            this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_ViewMatrix] = VariableDeclInstruction._getIndex("VIEW_MATRIX");
            this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_ProjMatrix] = VariableDeclInstruction._getIndex("PROJ_MATRIX");
            this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_InvViewCameraMat] = VariableDeclInstruction._getIndex("INV_VIEW_CAMERA_MAT");
            this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_CameraPosition] = VariableDeclInstruction._getIndex("CAMERA_POSITION");
            this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_WorldPosition] = VariableDeclInstruction._getIndex("WORLD_POSITION");
            this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_WorldScale] = VariableDeclInstruction._getIndex("WORLD_SCALE");
            this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_WorldOrientation] = VariableDeclInstruction._getIndex("WORLD_ORIENTATION");
            this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_LocalScale] = VariableDeclInstruction._getIndex("LOCAL_SCALE");
            this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_LocalPosition] = VariableDeclInstruction._getIndex("LOCAL_POSITION");
            this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_LocalOrientation] = VariableDeclInstruction._getIndex("LOCAL_ORIENTATION");
            this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_LocalMatrix] = VariableDeclInstruction._getIndex("LOCAL_MATRIX");
            this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_OptimizedProjMatrix] = VariableDeclInstruction._getIndex("OPTIMIZED_PROJ_MATRIX");
            this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_BindShapeMatrix] = VariableDeclInstruction._getIndex("BIND_SHAPE_MATRIX");
            this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_RenderObjectId] = VariableDeclInstruction._getIndex("RENDER_OBJECT_ID");
            this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_WireframeOverlay] = VariableDeclInstruction._getIndex("WIREFRAME_OVERLAY");
            this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_InputTextureSize] = VariableDeclInstruction._getIndex("INPUT_TEXTURE_SIZE");
            this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_InputTextureRatio] = VariableDeclInstruction._getIndex("INPUT_TEXTURE_RATIO");

            this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_useNormal] = VariableDeclInstruction._getIndex("useNormal");
            this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_isDebug] = VariableDeclInstruction._getIndex("isDebug");
            this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_isRealNormal] = VariableDeclInstruction._getIndex("isRealNormal");
            this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_normalFix] = VariableDeclInstruction._getIndex("normalFix");
            this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_isWithBalckSectors] = VariableDeclInstruction._getIndex("isWithBalckSectors");
            this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_showTriangles] = VariableDeclInstruction._getIndex("showTriangles");
            this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_u1] = VariableDeclInstruction._getIndex("u1");
            this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_kFixNormal] = VariableDeclInstruction._getIndex("kFixNormal");
            this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_fSunAmbient] = VariableDeclInstruction._getIndex("fSunAmbient");
            this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_fSunSpecular] = VariableDeclInstruction._getIndex("fSunSpecular");
            this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_cHeightFalloff] = VariableDeclInstruction._getIndex("cHeightFalloff");
            this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_cGlobalDensity] = VariableDeclInstruction._getIndex("cGlobalDensity");

            this._bIsFirstApplySystemUnifoms = false;
        }

        var pSceneObject: AISceneObject = this._getCurrentSceneObject();
        var pViewport: AIViewport = this._getCurrentViewport();
        var pRenderable: AIRenderableObject = this._getCurrentRenderableObject();

        var iRenderableID: int = this._calcRenderID(pSceneObject, pRenderable, true);
        var iIndex: uint = 0;

        if (!isNull(pSceneObject)) {
            pSceneObject.worldMatrix
            pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_ModelMatrix]] = pSceneObject.worldMatrix;

            pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_WorldPosition]] = pSceneObject.worldPosition;
            pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_WorldScale]] = pSceneObject.worldScale;
            pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_WorldOrientation]] = pSceneObject.worldOrientation;

            pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_LocalScale]] = pSceneObject.localScale;
            pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_LocalPosition]] = pSceneObject.localPosition;
            pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_LocalOrientation]] = pSceneObject.localOrientation;
            pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_LocalMatrix]] = pSceneObject.localMatrix;
        }

        if (!isNull(pViewport)) {
            pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_FramebufferSize]] = Vec2.temp(pViewport.width, pViewport.height);
            pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_ViewportSize]] = Vec2.temp(pViewport.actualWidth, pViewport.actualHeight);

            var pCamera: AICamera = pViewport.getCamera();
            if (!isNull(pCamera)) {

                pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_ViewMatrix]] = pCamera.viewMatrix;
                pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_ProjMatrix]] = pCamera.projectionMatrix;
                pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_InvViewCameraMat]] = pCamera.worldMatrix;
                pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_CameraPosition]] = pCamera.worldPosition;

                if (pCamera.type === AEEntityTypes.SHADOW_CASTER) {
                    pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_OptimizedProjMatrix]] = (<AIShadowCaster>pCamera).optimizedProjection;
                }
            }
        }

        if (!isNull(pRenderable)) {

            if (render.isMeshSubset(pRenderable) && (<AIMeshSubset>pRenderable).isSkinned()) {
                pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_BindShapeMatrix]] = (<AIMeshSubset>pRenderable).skin.getBindMatrix();
            }

            pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_RenderObjectId]] = iRenderableID;
            pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_WireframeOverlay]] = pRenderable["_bWireframeOverlay"];
        }

        if (!isNull(this._pLastRenderTarget)) {
            var pLastTexture: AITexture = this._pLastRenderTarget === this._pRenderTargetA ?
                this._pPostEffectTextureA : this._pPostEffectTextureB;

            pPassInput.setTexture("INPUT_TEXTURE", pLastTexture);
            pPassInput.setSamplerTexture("INPUT_SAMPLER", pLastTexture);

            pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_InputTextureSize]] =
            Vec2.temp(pLastTexture.width, pLastTexture.height);
            pPassInput.uniforms[this._pSystemUniformsNameIndexList[AESystemUniformsIndices.k_InputTextureRatio]] =
            Vec2.temp(this._pCurrentViewport.actualWidth / pLastTexture.width, this._pCurrentViewport.actualHeight / pLastTexture.height);

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
    }

    private prepareComposerState(): void {
        if (!isNull(this._pCurrentRenderable)) {
            this._pComposerState.renderable.isAdvancedIndex = this._pCurrentRenderable.data.useAdvancedIndex();
            this._pComposerState.object.isBillboard = this._pCurrentSceneObject && this._pCurrentSceneObject.isBillboard();


            if (model.isMeshSubset(this._pCurrentRenderable) && (<AIMeshSubset>this._pCurrentRenderable).isSkinned()) {
                this._pComposerState.mesh.isSkinned = true;
                this._pComposerState.mesh.isOptimizedSkinned = (<AIMeshSubset>this._pCurrentRenderable).isOptimizedSkinned();
            }
            else {
                this._pComposerState.mesh.isSkinned = false;
                this._pComposerState.mesh.isOptimizedSkinned = false;
            }
        }

        if (!isNull(this._pCurrentSceneObject)) {
            if (this._pCurrentSceneObject.type === AEEntityTypes.TERRAIN_ROAM) {
                this._pComposerState.terrain.isROAM = true;
            }
            else {
                this._pComposerState.terrain.isROAM = false;
            }
        }
    }

    private initPostEffectTextures(): void {
        var pRmgr: AIResourcePoolManager = this._pEngine.getResourceManager();
        this._pPostEffectTextureA = pRmgr.createTexture(".global-post-effect-texture-A");
        this._pPostEffectTextureB = pRmgr.createTexture(".global-post-effect-texture-B");

        this._pPostEffectTextureA.create(512, 512, 1, null, AETextureFlags.RENDERTARGET, 0, 0,
            AETextureTypes.TEXTURE_2D, AEPixelFormats.R8G8B8A8);

        this._pPostEffectTextureB.create(512, 512, 1, null, AETextureFlags.RENDERTARGET, 0, 0,
            AETextureTypes.TEXTURE_2D, AEPixelFormats.R8G8B8A8);

        // this._pPostEffectTextureA.notifyLoaded();
        // this._pPostEffectTextureB.notifyLoaded();

        this._pRenderTargetA = this._pPostEffectTextureA.getBuffer().getRenderTarget();
        this._pRenderTargetB = this._pPostEffectTextureB.getBuffer().getRenderTarget();

        this._pPostEffectDepthBuffer = <webgl.WebGLInternalRenderBuffer>pRmgr.renderBufferPool.createResource(".global-post-effect-depth");
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

    private prepareRenderTarget(pEntry: AIRenderEntry, pRenderTechnique: AIRenderTechnique, iPass: uint): void {
        var pRenderer: AIRenderer = this._pEngine.getRenderer();

        if (pRenderTechnique.hasPostEffect()) {
            if (pEntry.viewport.actualWidth > this._pRenderTargetA.width ||
                pEntry.viewport.actualHeight > this._pRenderTargetA.height) {

                this.resizePostEffectTextures(pEntry.viewport.actualWidth, pEntry.viewport.actualHeight);
            }

            if (pRenderTechnique.isFirstPass(iPass)) {
                var pRenderViewport: AIViewport = pEntry.viewport;

                pRenderer._setDepthBufferParams(false, false, 0);
                pRenderer._setRenderTarget(this._pRenderTargetA);

                var pViewportState: AIViewportState = pRenderViewport._getViewportState();
                this._pPostEffectViewport.setDimensions(0., 0.,
                    pRenderViewport.actualWidth / this._pRenderTargetA.width,
                    pRenderViewport.actualHeight / this._pRenderTargetA.height);
                this._pPostEffectViewport.setDepthParams(pViewportState.depthTest, pViewportState.depthWrite, pViewportState.depthFunction);
                this._pPostEffectViewport.setCullingMode(pViewportState.cullingMode);

                // pRenderer._lockRenderTarget();

                if (pRenderViewport.getClearEveryFrame()) {
                    this._pPostEffectViewport.clear(pViewportState.clearBuffers,
                        pViewportState.clearColor,
                        pViewportState.clearDepth, 0);
                }
                else {
                    this._pPostEffectViewport.clear(AEFrameBufferTypes.COLOR | AEFrameBufferTypes.DEPTH,
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


export = Composer;