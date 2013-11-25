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
define(["require", "exports", "math", "logger", "color", "model", "limit", "render", "util/ObjectArray", "fx/SamplerBlender", "fx/Blender", "fx/Effect", "fx/VariableInstruction"], function(require, exports, __math__, __logger__, __color__, __model__, __limit__, __render__, __ObjectArray__, __SamplerBlender__, __Blender__, __Effect__, __VariableDeclInstruction__) {
    var math = __math__;
    var logger = __logger__;
    var color = __color__;
    var model = "model";
    var limit = __limit__;
    
    var render = __render__;

    var ObjectArray = __ObjectArray__;
    var SamplerBlender = __SamplerBlender__;
    var Blender = __Blender__;
    var Effect = __Effect__;

    var VariableDeclInstruction = __VariableDeclInstruction__;

    var Vec2 = math.Vec2;

    /** @const */
    var RID_TOTAL = 1024;

    var AESystemUniformsIndices;
    (function (AESystemUniformsIndices) {
        AESystemUniformsIndices[AESystemUniformsIndices["k_ModelMatrix"] = 0] = "k_ModelMatrix";
        AESystemUniformsIndices[AESystemUniformsIndices["k_FramebufferSize"] = 1] = "k_FramebufferSize";
        AESystemUniformsIndices[AESystemUniformsIndices["k_ViewportSize"] = 2] = "k_ViewportSize";
        AESystemUniformsIndices[AESystemUniformsIndices["k_ViewMatrix"] = 3] = "k_ViewMatrix";
        AESystemUniformsIndices[AESystemUniformsIndices["k_ProjMatrix"] = 4] = "k_ProjMatrix";
        AESystemUniformsIndices[AESystemUniformsIndices["k_InvViewCameraMat"] = 5] = "k_InvViewCameraMat";
        AESystemUniformsIndices[AESystemUniformsIndices["k_CameraPosition"] = 6] = "k_CameraPosition";
        AESystemUniformsIndices[AESystemUniformsIndices["k_WorldPosition"] = 7] = "k_WorldPosition";
        AESystemUniformsIndices[AESystemUniformsIndices["k_WorldScale"] = 8] = "k_WorldScale";
        AESystemUniformsIndices[AESystemUniformsIndices["k_WorldOrientation"] = 9] = "k_WorldOrientation";
        AESystemUniformsIndices[AESystemUniformsIndices["k_LocalPosition"] = 10] = "k_LocalPosition";
        AESystemUniformsIndices[AESystemUniformsIndices["k_LocalScale"] = 11] = "k_LocalScale";
        AESystemUniformsIndices[AESystemUniformsIndices["k_LocalOrientation"] = 12] = "k_LocalOrientation";
        AESystemUniformsIndices[AESystemUniformsIndices["k_LocalMatrix"] = 13] = "k_LocalMatrix";
        AESystemUniformsIndices[AESystemUniformsIndices["k_OptimizedProjMatrix"] = 14] = "k_OptimizedProjMatrix";
        AESystemUniformsIndices[AESystemUniformsIndices["k_BindShapeMatrix"] = 15] = "k_BindShapeMatrix";
        AESystemUniformsIndices[AESystemUniformsIndices["k_RenderObjectId"] = 16] = "k_RenderObjectId";
        AESystemUniformsIndices[AESystemUniformsIndices["k_WireframeOverlay"] = 17] = "k_WireframeOverlay";

        // k_InputTexture,
        // k_InputSampler,
        AESystemUniformsIndices[AESystemUniformsIndices["k_InputTextureSize"] = 18] = "k_InputTextureSize";
        AESystemUniformsIndices[AESystemUniformsIndices["k_InputTextureRatio"] = 19] = "k_InputTextureRatio";

        AESystemUniformsIndices[AESystemUniformsIndices["k_useNormal"] = 20] = "k_useNormal";
        AESystemUniformsIndices[AESystemUniformsIndices["k_isDebug"] = 21] = "k_isDebug";
        AESystemUniformsIndices[AESystemUniformsIndices["k_isRealNormal"] = 22] = "k_isRealNormal";
        AESystemUniformsIndices[AESystemUniformsIndices["k_normalFix"] = 23] = "k_normalFix";
        AESystemUniformsIndices[AESystemUniformsIndices["k_isWithBalckSectors"] = 24] = "k_isWithBalckSectors";
        AESystemUniformsIndices[AESystemUniformsIndices["k_showTriangles"] = 25] = "k_showTriangles";
        AESystemUniformsIndices[AESystemUniformsIndices["k_u1"] = 26] = "k_u1";
        AESystemUniformsIndices[AESystemUniformsIndices["k_kFixNormal"] = 27] = "k_kFixNormal";
        AESystemUniformsIndices[AESystemUniformsIndices["k_fSunAmbient"] = 28] = "k_fSunAmbient";
        AESystemUniformsIndices[AESystemUniformsIndices["k_fSunSpecular"] = 29] = "k_fSunSpecular";
        AESystemUniformsIndices[AESystemUniformsIndices["k_cHeightFalloff"] = 30] = "k_cHeightFalloff";
        AESystemUniformsIndices[AESystemUniformsIndices["k_cGlobalDensity"] = 31] = "k_cGlobalDensity";
    })(AESystemUniformsIndices || (AESystemUniformsIndices = {}));

    var Composer = (function () {
        function Composer(pEngine) {
            this._pEngine = null;
            this._pTechniqueToBlendMap = null;
            this._pTechniqueToOwnBlendMap = null;
            this._pTechniqueLastGlobalBlendMap = null;
            this._pTechniqueNeedUpdateMap = null;
            this._pEffectResourceToComponentBlendMap = null;
            this._pBlender = null;
            this._pGlobalEffectResorceIdStack = null;
            // private _pGlobalEffectResorceShiftStack: int[] = null;
            this._pGlobalComponentBlendStack = null;
            this._pGlobalComponentBlend = null;
            //Data for render
            this._pCurrentSceneObject = null;
            this._pCurrentViewport = null;
            this._pCurrentRenderable = null;
            this._pCurrentBufferMap = null;
            this._pCurrentSurfaceMaterial = null;
            this._pComposerState = {
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
            this._pRenderTargetA = null;
            this._pRenderTargetB = null;
            this._pLastRenderTarget = null;
            this._pPostEffectViewport = null;
            this._pPostEffectTextureA = null;
            this._pPostEffectTextureB = null;
            this._pPostEffectDepthBuffer = null;
            //render id data
            this._pRidTable = {};
            this._pRidMap = {};
            this._nRidSO = 0;
            this._nRidRE = 0;
            //For fast set system uniforms
            this._pSystemUniformsNameIndexList = new Array();
            this._bIsFirstApplySystemUnifoms = true;
            this.bNormalFix = true;
            this.bUseNormalMap = true;
            this.bIsDebug = false;
            this.bIsRealNormal = false;
            this.bTerrainBlackSectors = false;
            this.bShowTriangles = false;
            //sun parameters
            this.kFixNormal = 0.43;
            this.fSunSpecular = 0.5;
            this.fSunAmbient = 0.22;
            //fog
            this.cHeightFalloff = 0.04;
            this.cGlobalDensity = 0.002;
            this._pEngine = pEngine;

            this._pBlender = new Blender(this);

            this._pTechniqueToBlendMap = {};
            this._pTechniqueToOwnBlendMap = {};
            this._pTechniqueLastGlobalBlendMap = {};
            this._pTechniqueNeedUpdateMap = {};

            this._pEffectResourceToComponentBlendMap = {};

            this._pGlobalEffectResorceIdStack = [];
            this._pGlobalComponentBlendStack = [];
            this._pGlobalComponentBlend = null;

            this.initPostEffectTextures();

            if (isNull(Composer.pDefaultSamplerBlender)) {
                Composer.pDefaultSamplerBlender = new SamplerBlender();
            }
        }
        Composer.prototype.getComponentByName = function (sComponentName) {
            return this._pEngine.getResourceManager().componentPool.findResource(sComponentName);
        };

        /** inline */ Composer.prototype.getEngine = function () {
            return this._pEngine;
        };

        //-----------------------------------------------------------------------------//
        //-----------------------------API for Effect-resource-------------------------//
        //-----------------------------------------------------------------------------//
        Composer.prototype.getComponentCountForEffect = function (pEffectResource) {
            var id = pEffectResource.resourceHandle;

            if (isDef(this._pEffectResourceToComponentBlendMap[id])) {
                return this._pEffectResourceToComponentBlendMap[id].getComponentCount();
            } else {
                return 0;
            }
        };

        Composer.prototype.getTotalPassesForEffect = function (pEffectResource) {
            var id = pEffectResource.resourceHandle;

            if (isDef(this._pEffectResourceToComponentBlendMap[id])) {
                return this._pEffectResourceToComponentBlendMap[id].getTotalPasses();
            } else {
                return 0;
            }
        };

        Composer.prototype.addComponentToEffect = function (pEffectResource, pComponent, iShift, iPass) {
            var id = pEffectResource.resourceHandle;
            var pCurrentBlend = null;

            if (isDef(this._pEffectResourceToComponentBlendMap[id])) {
                pCurrentBlend = this._pEffectResourceToComponentBlendMap[id];
            }

            var pNewBlend = this._pBlender.addComponentToBlend(pCurrentBlend, pComponent, iShift, iPass);
            if (isNull(pNewBlend)) {
                return false;
            }

            this._pEffectResourceToComponentBlendMap[id] = pNewBlend;
            return true;
        };

        Composer.prototype.removeComponentFromEffect = function (pEffectResource, pComponent, iShift, iPass) {
            var id = pEffectResource.resourceHandle;
            var pCurrentBlend = null;

            if (isDef(this._pEffectResourceToComponentBlendMap[id])) {
                pCurrentBlend = this._pEffectResourceToComponentBlendMap[id];
            }

            var pNewBlend = this._pBlender.removeComponentFromBlend(pCurrentBlend, pComponent, iShift, iPass);
            if (isNull(pNewBlend)) {
                return false;
            }

            this._pEffectResourceToComponentBlendMap[id] = pNewBlend;
            return true;
        };

        Composer.prototype.hasComponentForEffect = function (pEffectResource, pComponent, iShift, iPass) {
            var id = pEffectResource.resourceHandle;
            var pCurrentBlend = null;

            if (isDef(this._pEffectResourceToComponentBlendMap[id])) {
                pCurrentBlend = this._pEffectResourceToComponentBlendMap[id];
            }

            if (isNull(pCurrentBlend)) {
                return false;
            }

            return pCurrentBlend.containComponent(pComponent, iShift, iPass);
        };

        Composer.prototype.activateEffectResource = function (pEffectResource, iShift) {
            var id = pEffectResource.resourceHandle;
            var pComponentBlend = this._pEffectResourceToComponentBlendMap[id];

            if (!isDef(pComponentBlend)) {
                return false;
            }

            var pNewGlobalBlend = null;

            if (isNull(this._pGlobalComponentBlend)) {
                pNewGlobalBlend = pComponentBlend;
            } else {
                pNewGlobalBlend = this._pBlender.addBlendToBlend(this._pGlobalComponentBlend, pComponentBlend, iShift);
            }

            if (isNull(pNewGlobalBlend)) {
                return false;
            }

            this._pGlobalEffectResorceIdStack.push(id);
            this._pGlobalComponentBlendStack.push(pNewGlobalBlend);

            this._pGlobalComponentBlend = pNewGlobalBlend;

            return true;
        };

        Composer.prototype.deactivateEffectResource = function (pEffectResource) {
            var id = pEffectResource.resourceHandle;
            var iStackLength = this._pGlobalEffectResorceIdStack.length;

            if (iStackLength === 0) {
                return false;
            }

            var iLastId = this._pGlobalEffectResorceIdStack[iStackLength - 1];

            if (iLastId !== id) {
                return false;
            }

            this._pGlobalEffectResorceIdStack.splice(iStackLength - 1, 1);
            this._pGlobalComponentBlendStack.splice(iStackLength - 1, 1);

            if (iStackLength > 1) {
                this._pGlobalComponentBlend = this._pGlobalComponentBlendStack[iStackLength - 2];
            } else {
                this._pGlobalComponentBlend = null;
            }

            return true;
        };

        Composer.prototype.getPassInputBlendForEffect = function (pEffectResource, iPass) {
            var id = pEffectResource.resourceHandle;
            var pBlend = this._pEffectResourceToComponentBlendMap[id];

            if (!isDef(this._pEffectResourceToComponentBlendMap[id])) {
                return null;
            }

            if (!pBlend.isReadyToUse()) {
                pBlend.finalizeBlend();
            }

            return pBlend.getPassInputForPass(iPass);
        };

        //-----------------------------------------------------------------------------//
        //----------------------------API for RenderTechnique--------------------------//
        //-----------------------------------------------------------------------------//
        Composer.prototype.getMinShiftForOwnTechniqueBlend = function (pRenderTechnique) {
            var id = pRenderTechnique.getGuid();
            var pBlend = this._pTechniqueToOwnBlendMap[id];

            if (isDefAndNotNull(this._pTechniqueToOwnBlendMap[id])) {
                return pBlend._getMinShift();
            } else {
                return 0;
            }
        };

        Composer.prototype.getTotalPassesForTechnique = function (pRenderTechnique) {
            this.prepareTechniqueBlend(pRenderTechnique);

            var id = pRenderTechnique.getGuid();

            if (isDefAndNotNull(this._pTechniqueToBlendMap[id])) {
                return this._pTechniqueToBlendMap[id].getTotalPasses();
            } else {
                return 0;
            }
        };

        Composer.prototype.addOwnComponentToTechnique = function (pRenderTechnique, pComponent, iShift, iPass) {
            var id = pRenderTechnique.getGuid();
            var pCurrentBlend = null;

            if (isDef(this._pTechniqueToOwnBlendMap[id])) {
                pCurrentBlend = this._pTechniqueToOwnBlendMap[id];
            }

            var pNewBlend = this._pBlender.addComponentToBlend(pCurrentBlend, pComponent, iShift, iPass);

            if (isNull(pNewBlend)) {
                return false;
            }

            this._pTechniqueToOwnBlendMap[id] = pNewBlend;
            this._pTechniqueNeedUpdateMap[id] = true;

            return true;
        };

        Composer.prototype.removeOwnComponentToTechnique = function (pRenderTechnique, pComponent, iShift, iPass) {
            var id = pRenderTechnique.getGuid();
            var pCurrentBlend = null;

            if (isDef(this._pTechniqueToOwnBlendMap[id])) {
                pCurrentBlend = this._pTechniqueToOwnBlendMap[id];
            }

            var pNewBlend = this._pBlender.removeComponentFromBlend(pCurrentBlend, pComponent, iShift, iPass);
            if (isNull(pNewBlend)) {
                return false;
            }

            this._pTechniqueToOwnBlendMap[id] = pNewBlend;
            this._pTechniqueNeedUpdateMap[id] = true;
            return true;
        };

        Composer.prototype.hasOwnComponentInTechnique = function (pRenderTechnique, pComponent, iShift, iPass) {
            var id = pRenderTechnique.getGuid();
            var pCurrentBlend = null;

            if (isDef(this._pTechniqueToOwnBlendMap[id])) {
                pCurrentBlend = this._pTechniqueToOwnBlendMap[id];
            }

            if (isNull(pCurrentBlend)) {
                return false;
            }

            return pCurrentBlend.containComponent(pComponent, iShift, iPass);
        };

        Composer.prototype.prepareTechniqueBlend = function (pRenderTechnique) {
            if (pRenderTechnique.isFreeze()) {
                return true;
            }

            var id = pRenderTechnique.getGuid();

            var isTechniqueUpdate = !!(this._pTechniqueNeedUpdateMap[id]);
            var isUpdateGlobalBlend = (this._pGlobalComponentBlend !== this._pTechniqueLastGlobalBlendMap[id]);
            var isNeedToUpdatePasses = false;

            if (isTechniqueUpdate || isUpdateGlobalBlend) {
                var iEffect = pRenderTechnique.getMethod().effect.resourceHandle;
                var pEffectBlend = this._pEffectResourceToComponentBlendMap[iEffect] || null;
                var pTechniqueBlend = this._pTechniqueToOwnBlendMap[id] || null;

                var pNewBlend = null;

                pNewBlend = this._pBlender.addBlendToBlend(this._pGlobalComponentBlend, pEffectBlend, 0);
                pNewBlend = this._pBlender.addBlendToBlend(pNewBlend, pTechniqueBlend, 0);

                if (this._pTechniqueToBlendMap[id] !== pNewBlend) {
                    isNeedToUpdatePasses = true;
                }

                this._pTechniqueToBlendMap[id] = pNewBlend;
                this._pTechniqueNeedUpdateMap[id] = false;
                this._pTechniqueLastGlobalBlendMap[id] = this._pGlobalComponentBlend;
            }

            var pBlend = this._pTechniqueToBlendMap[id];

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
            } else {
                return false;
            }
        };

        Composer.prototype.markTechniqueAsNeedUpdate = function (pRenderTechnique) {
            this._pTechniqueNeedUpdateMap[pRenderTechnique.getGuid()] = true;
        };

        Composer.prototype.getPassInputBlendForTechnique = function (pRenderTechnique, iPass) {
            var id = pRenderTechnique.getGuid();

            if (!isDef(this._pTechniqueToBlendMap[id])) {
                return null;
            }

            return this._pTechniqueToBlendMap[id].getPassInputForPass(iPass);
        };

        //-----------------------------------------------------------------------------//
        //---------------------------------API for render------------------------------//
        //-----------------------------------------------------------------------------//
        Composer.prototype.applyBufferMap = function (pMap) {
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
        };

        Composer.prototype.applySurfaceMaterial = function (pSurfaceMaterial) {
            this._pCurrentSurfaceMaterial = pSurfaceMaterial;
            return true;
        };

        /** inline */ Composer.prototype._setCurrentSceneObject = function (pSceneObject) {
            this._pCurrentSceneObject = pSceneObject;
        };

        /** inline */ Composer.prototype._setCurrentViewport = function (pViewport) {
            this._pCurrentViewport = pViewport;
        };

        /** inline */ Composer.prototype._setCurrentRenderableObject = function (pRenderable) {
            this._pCurrentRenderable = pRenderable;
        };

        /** inline */ Composer.prototype._getCurrentSceneObject = function () {
            return this._pCurrentSceneObject;
        };

        /** inline */ Composer.prototype._getCurrentViewport = function () {
            return this._pCurrentViewport;
        };

        /** inline */ Composer.prototype._getCurrentRenderableObject = function () {
            return this._pCurrentRenderable;
        };

        Composer.prototype._setDefaultCurrentState = function () {
            this._setCurrentViewport(null);
            this._setCurrentRenderableObject(null);
            this._setCurrentSceneObject(null);
        };

        Composer.prototype.renderTechniquePass = function (pRenderTechnique, iPass) {
            // if(true){
            // 	return;
            // }
            var pPass = pRenderTechnique.getPass(iPass);
            var pPassInput = pPass.getPassInput();

            var pPassBlend = null;
            var pMaker = null;

            this.applySystemUnifoms(pPassInput);

            // if(!pPassInput._isNeedToCalcShader()){
            // 	//TODO: set pShader to shader program by id
            // }
            // else {
            // if(!pPassInput._isNeedToCalcBlend()){
            // 	pPassBlend = this._pBlender.getPassBlendById(pPassInput._getLastPassBlendId());
            // }
            // else {
            var id = pRenderTechnique.getGuid();
            var pComponentBlend = this._pTechniqueToBlendMap[id];
            var pPassInstructionList = pComponentBlend.getPassListAtPass(iPass);

            this.prepareComposerState();

            pPassBlend = this._pBlender.generatePassBlend(pPassInstructionList, this._pComposerState, pPassInput.foreigns, pPassInput.uniforms);

            if (isNull(pPassBlend)) {
                logger.error("Could not render. Error with generation pass-blend.");
                return;
            }

            pMaker = pPassBlend.generateFXMaker(pPassInput, this._pCurrentSurfaceMaterial, this._pCurrentBufferMap);
            if (isNull(pMaker)) {
                return;
            }

            // }
            //TODO: generate input from PassInputBlend to correct unifoms and attributes list
            //TODO: generate RenderEntry
            //this.clearPreRenderState();
            var pInput = pMaker._make(pPassInput, this._pCurrentBufferMap);
            var pRenderer = this._pEngine.getRenderer();
            var pEntry = pRenderer.createEntry();

            pEntry.maker = pMaker;
            pEntry.input = pInput;
            pEntry.viewport = this._pCurrentViewport;
            pEntry.bufferMap = this._pCurrentBufferMap;

            this.prepareRenderTarget(pEntry, pRenderTechnique, iPass);

            pRenderer.pushEntry(pEntry);
        };

        //-----------------------------------------------------------------------------//
        //-----------------------API for load components/AFXEffects--------------------//
        //-----------------------------------------------------------------------------//
        Composer.prototype._loadEffectFromSyntaxTree = function (pTree, sFileName) {
            if (has("AFX_ENABLE_TEXT_EFFECTS")) {
                var pEffect = new Effect(this);

                // LOG(sFileName, pTree);
                pEffect.setAnalyzedFileName(sFileName);

                // LOG("\n\n\n-------------------------Try to analyze '" + sFileName + "'-------------");
                var isOk = pEffect.analyze(pTree);

                if (isOk) {
                    // LOG("------ANALYZE IS GOOD '" + sFileName + "'.")
                    var pTechniqueList = pEffect.getTechniqueList();

                    for (var i = 0; i < pTechniqueList.length; i++) {
                        isOk = this.initComponent(pTechniqueList[i]);
                        if (!isOk) {
                            logger.warn("Cannot initialize fx-component from technique '" + pTechniqueList[i].getName() + "'.");
                            return false;
                        }
                    }
                } else {
                    logger.warn("Error are occured during analyze of effect file '" + sFileName + "'.");
                    return false;
                }

                return true;
            }

            return false;
        };

        Composer.prototype._loadEffectFromBinary = function (pData, sFileName) {
            return false;
        };

        Composer.prototype.initComponent = function (pTechnique) {
            var sTechniqueName = pTechnique.getName();
            var pComponentPool = this._pEngine.getResourceManager().componentPool;

            if (!isNull(pComponentPool.findResource(sTechniqueName))) {
                return false;
            }

            var pComponent = pComponentPool.createResource(sTechniqueName);
            pComponent.create();
            pComponent.setTechnique(pTechnique);

            pTechnique.finalize(this);

            return true;
        };

        Composer.prototype.clearPreRenderState = function () {
            // this._pPreRenderState.primType = 0;
            // this._pPreRenderState.offset = 0;
            // this._pPreRenderState.length = 0;
            // this._pPreRenderState.index = null;
            // this._pPreRenderState.flows.clear(false);
            // this._pPreRenderState.isClear = true;
        };

        Composer.prototype._calcRenderID = function (pSceneObject, pRenderable, bCreateIfNotExists) {
            if (typeof bCreateIfNotExists === "undefined") { bCreateIfNotExists = false; }
            //assume, that less than 1024 draw calls may be & less than 1024 scene object will be rendered.
            //beacause only 1024
            var iSceneObjectGuid = !isDefAndNotNull(pSceneObject) ? 0 : pSceneObject.getGuid();
            var iRenderableObjectGuid = !isDefAndNotNull(pRenderable) ? limit.MAX_UINT32 : pRenderable.getGuid();

            if (this._nRidSO === RID_TOTAL || this._nRidRE === RID_TOTAL) {
                this._pRidTable = {};
                this._nRidRE = 0;
                this._nRidSO = 0;
            }

            var pRidTable = this._pRidTable;
            var pRidMap = this._pRidMap;
            var pRidByRenderable = pRidTable[iSceneObjectGuid];
            var pRidPair;

            var iRid = 0;

            if (!isDefAndNotNull(pRidByRenderable)) {
                if (!bCreateIfNotExists) {
                    return 0;
                }

                pRidByRenderable = pRidTable[iSceneObjectGuid] = {};
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
        };

        /** inline */ Composer.prototype._getRenderableByRid = function (iRid) {
            var pRidPair = this._pRidMap[iRid];
            var pRenderable = isDefAndNotNull(pRidPair) ? pRidPair.renderable : null;
            return isNull(pRenderable) || pRenderable.isFrozen() ? null : pRenderable;
        };

        /** inline */ Composer.prototype._getObjectByRid = function (iRid) {
            var pRidPair = this._pRidMap[iRid];
            var pSceneObject = isDefAndNotNull(pRidPair) ? pRidPair.object : null;
            return isNull(pSceneObject) || pSceneObject.isFrozen() ? null : pSceneObject;
        };

        Composer.prototype.applySystemUnifoms = function (pPassInput) {
            if (this._bIsFirstApplySystemUnifoms) {
                this._pSystemUniformsNameIndexList[0 /* k_ModelMatrix */] = VariableDeclInstruction._getIndex("MODEL_MATRIX");
                this._pSystemUniformsNameIndexList[1 /* k_FramebufferSize */] = VariableDeclInstruction._getIndex("FRAMEBUFFER_SIZE");
                this._pSystemUniformsNameIndexList[2 /* k_ViewportSize */] = VariableDeclInstruction._getIndex("VIEWPORT_SIZE");
                this._pSystemUniformsNameIndexList[3 /* k_ViewMatrix */] = VariableDeclInstruction._getIndex("VIEW_MATRIX");
                this._pSystemUniformsNameIndexList[4 /* k_ProjMatrix */] = VariableDeclInstruction._getIndex("PROJ_MATRIX");
                this._pSystemUniformsNameIndexList[5 /* k_InvViewCameraMat */] = VariableDeclInstruction._getIndex("INV_VIEW_CAMERA_MAT");
                this._pSystemUniformsNameIndexList[6 /* k_CameraPosition */] = VariableDeclInstruction._getIndex("CAMERA_POSITION");
                this._pSystemUniformsNameIndexList[7 /* k_WorldPosition */] = VariableDeclInstruction._getIndex("WORLD_POSITION");
                this._pSystemUniformsNameIndexList[8 /* k_WorldScale */] = VariableDeclInstruction._getIndex("WORLD_SCALE");
                this._pSystemUniformsNameIndexList[9 /* k_WorldOrientation */] = VariableDeclInstruction._getIndex("WORLD_ORIENTATION");
                this._pSystemUniformsNameIndexList[11 /* k_LocalScale */] = VariableDeclInstruction._getIndex("LOCAL_SCALE");
                this._pSystemUniformsNameIndexList[10 /* k_LocalPosition */] = VariableDeclInstruction._getIndex("LOCAL_POSITION");
                this._pSystemUniformsNameIndexList[12 /* k_LocalOrientation */] = VariableDeclInstruction._getIndex("LOCAL_ORIENTATION");
                this._pSystemUniformsNameIndexList[13 /* k_LocalMatrix */] = VariableDeclInstruction._getIndex("LOCAL_MATRIX");
                this._pSystemUniformsNameIndexList[14 /* k_OptimizedProjMatrix */] = VariableDeclInstruction._getIndex("OPTIMIZED_PROJ_MATRIX");
                this._pSystemUniformsNameIndexList[15 /* k_BindShapeMatrix */] = VariableDeclInstruction._getIndex("BIND_SHAPE_MATRIX");
                this._pSystemUniformsNameIndexList[16 /* k_RenderObjectId */] = VariableDeclInstruction._getIndex("RENDER_OBJECT_ID");
                this._pSystemUniformsNameIndexList[17 /* k_WireframeOverlay */] = VariableDeclInstruction._getIndex("WIREFRAME_OVERLAY");
                this._pSystemUniformsNameIndexList[18 /* k_InputTextureSize */] = VariableDeclInstruction._getIndex("INPUT_TEXTURE_SIZE");
                this._pSystemUniformsNameIndexList[19 /* k_InputTextureRatio */] = VariableDeclInstruction._getIndex("INPUT_TEXTURE_RATIO");

                this._pSystemUniformsNameIndexList[20 /* k_useNormal */] = VariableDeclInstruction._getIndex("useNormal");
                this._pSystemUniformsNameIndexList[21 /* k_isDebug */] = VariableDeclInstruction._getIndex("isDebug");
                this._pSystemUniformsNameIndexList[22 /* k_isRealNormal */] = VariableDeclInstruction._getIndex("isRealNormal");
                this._pSystemUniformsNameIndexList[23 /* k_normalFix */] = VariableDeclInstruction._getIndex("normalFix");
                this._pSystemUniformsNameIndexList[24 /* k_isWithBalckSectors */] = VariableDeclInstruction._getIndex("isWithBalckSectors");
                this._pSystemUniformsNameIndexList[25 /* k_showTriangles */] = VariableDeclInstruction._getIndex("showTriangles");
                this._pSystemUniformsNameIndexList[26 /* k_u1 */] = VariableDeclInstruction._getIndex("u1");
                this._pSystemUniformsNameIndexList[27 /* k_kFixNormal */] = VariableDeclInstruction._getIndex("kFixNormal");
                this._pSystemUniformsNameIndexList[28 /* k_fSunAmbient */] = VariableDeclInstruction._getIndex("fSunAmbient");
                this._pSystemUniformsNameIndexList[29 /* k_fSunSpecular */] = VariableDeclInstruction._getIndex("fSunSpecular");
                this._pSystemUniformsNameIndexList[30 /* k_cHeightFalloff */] = VariableDeclInstruction._getIndex("cHeightFalloff");
                this._pSystemUniformsNameIndexList[31 /* k_cGlobalDensity */] = VariableDeclInstruction._getIndex("cGlobalDensity");

                this._bIsFirstApplySystemUnifoms = false;
            }

            var pSceneObject = this._getCurrentSceneObject();
            var pViewport = this._getCurrentViewport();
            var pRenderable = this._getCurrentRenderableObject();

            var iRenderableID = this._calcRenderID(pSceneObject, pRenderable, true);
            var iIndex = 0;

            if (!isNull(pSceneObject)) {
                pSceneObject.worldMatrix;
                pPassInput.uniforms[this._pSystemUniformsNameIndexList[0 /* k_ModelMatrix */]] = pSceneObject.worldMatrix;

                pPassInput.uniforms[this._pSystemUniformsNameIndexList[7 /* k_WorldPosition */]] = pSceneObject.worldPosition;
                pPassInput.uniforms[this._pSystemUniformsNameIndexList[8 /* k_WorldScale */]] = pSceneObject.worldScale;
                pPassInput.uniforms[this._pSystemUniformsNameIndexList[9 /* k_WorldOrientation */]] = pSceneObject.worldOrientation;

                pPassInput.uniforms[this._pSystemUniformsNameIndexList[11 /* k_LocalScale */]] = pSceneObject.localScale;
                pPassInput.uniforms[this._pSystemUniformsNameIndexList[10 /* k_LocalPosition */]] = pSceneObject.localPosition;
                pPassInput.uniforms[this._pSystemUniformsNameIndexList[12 /* k_LocalOrientation */]] = pSceneObject.localOrientation;
                pPassInput.uniforms[this._pSystemUniformsNameIndexList[13 /* k_LocalMatrix */]] = pSceneObject.localMatrix;
            }

            if (!isNull(pViewport)) {
                pPassInput.uniforms[this._pSystemUniformsNameIndexList[1 /* k_FramebufferSize */]] = Vec2.temp(pViewport.width, pViewport.height);
                pPassInput.uniforms[this._pSystemUniformsNameIndexList[2 /* k_ViewportSize */]] = Vec2.temp(pViewport.actualWidth, pViewport.actualHeight);

                var pCamera = pViewport.getCamera();
                if (!isNull(pCamera)) {
                    pPassInput.uniforms[this._pSystemUniformsNameIndexList[3 /* k_ViewMatrix */]] = pCamera.viewMatrix;
                    pPassInput.uniforms[this._pSystemUniformsNameIndexList[4 /* k_ProjMatrix */]] = pCamera.projectionMatrix;
                    pPassInput.uniforms[this._pSystemUniformsNameIndexList[5 /* k_InvViewCameraMat */]] = pCamera.worldMatrix;
                    pPassInput.uniforms[this._pSystemUniformsNameIndexList[6 /* k_CameraPosition */]] = pCamera.worldPosition;

                    if (pCamera.type === 5 /* SHADOW_CASTER */) {
                        pPassInput.uniforms[this._pSystemUniformsNameIndexList[14 /* k_OptimizedProjMatrix */]] = (pCamera).optimizedProjection;
                    }
                }
            }

            if (!isNull(pRenderable)) {
                if (render.isMeshSubset(pRenderable) && (pRenderable).isSkinned()) {
                    pPassInput.uniforms[this._pSystemUniformsNameIndexList[15 /* k_BindShapeMatrix */]] = (pRenderable).skin.getBindMatrix();
                }

                pPassInput.uniforms[this._pSystemUniformsNameIndexList[16 /* k_RenderObjectId */]] = iRenderableID;
                pPassInput.uniforms[this._pSystemUniformsNameIndexList[17 /* k_WireframeOverlay */]] = pRenderable["_bWireframeOverlay"];
            }

            if (!isNull(this._pLastRenderTarget)) {
                var pLastTexture = this._pLastRenderTarget === this._pRenderTargetA ? this._pPostEffectTextureA : this._pPostEffectTextureB;

                pPassInput.setTexture("INPUT_TEXTURE", pLastTexture);
                pPassInput.setSamplerTexture("INPUT_SAMPLER", pLastTexture);

                pPassInput.uniforms[this._pSystemUniformsNameIndexList[18 /* k_InputTextureSize */]] = Vec2.temp(pLastTexture.width, pLastTexture.height);
                pPassInput.uniforms[this._pSystemUniformsNameIndexList[19 /* k_InputTextureRatio */]] = Vec2.temp(this._pCurrentViewport.actualWidth / pLastTexture.width, this._pCurrentViewport.actualHeight / pLastTexture.height);
            }

            pPassInput.uniforms[this._pSystemUniformsNameIndexList[20 /* k_useNormal */]] = this.bUseNormalMap;
            pPassInput.uniforms[this._pSystemUniformsNameIndexList[21 /* k_isDebug */]] = this.bIsDebug;
            pPassInput.uniforms[this._pSystemUniformsNameIndexList[22 /* k_isRealNormal */]] = this.bIsRealNormal;
            pPassInput.uniforms[this._pSystemUniformsNameIndexList[23 /* k_normalFix */]] = this.bNormalFix;
            pPassInput.uniforms[this._pSystemUniformsNameIndexList[24 /* k_isWithBalckSectors */]] = this.bTerrainBlackSectors;
            pPassInput.uniforms[this._pSystemUniformsNameIndexList[25 /* k_showTriangles */]] = this.bShowTriangles;
            pPassInput.uniforms[this._pSystemUniformsNameIndexList[26 /* k_u1 */]] = 64;
            pPassInput.uniforms[this._pSystemUniformsNameIndexList[27 /* k_kFixNormal */]] = this.kFixNormal;
            pPassInput.uniforms[this._pSystemUniformsNameIndexList[28 /* k_fSunAmbient */]] = this.fSunAmbient;
            pPassInput.uniforms[this._pSystemUniformsNameIndexList[29 /* k_fSunSpecular */]] = this.fSunSpecular;
            pPassInput.uniforms[this._pSystemUniformsNameIndexList[30 /* k_cHeightFalloff */]] = this.cHeightFalloff;
            pPassInput.uniforms[this._pSystemUniformsNameIndexList[31 /* k_cGlobalDensity */]] = this.cGlobalDensity;

            pPassInput.setUniform("isBillboard", this._pCurrentSceneObject && this._pCurrentSceneObject.isBillboard());
        };

        Composer.prototype.prepareComposerState = function () {
            if (!isNull(this._pCurrentRenderable)) {
                this._pComposerState.renderable.isAdvancedIndex = this._pCurrentRenderable.data.useAdvancedIndex();
                this._pComposerState.object.isBillboard = this._pCurrentSceneObject && this._pCurrentSceneObject.isBillboard();

                if (model.isMeshSubset(this._pCurrentRenderable) && (this._pCurrentRenderable).isSkinned()) {
                    this._pComposerState.mesh.isSkinned = true;
                    this._pComposerState.mesh.isOptimizedSkinned = (this._pCurrentRenderable).isOptimizedSkinned();
                } else {
                    this._pComposerState.mesh.isSkinned = false;
                    this._pComposerState.mesh.isOptimizedSkinned = false;
                }
            }

            if (!isNull(this._pCurrentSceneObject)) {
                if (this._pCurrentSceneObject.type === 67 /* TERRAIN_ROAM */) {
                    this._pComposerState.terrain.isROAM = true;
                } else {
                    this._pComposerState.terrain.isROAM = false;
                }
            }
        };

        Composer.prototype.initPostEffectTextures = function () {
            var pRmgr = this._pEngine.getResourceManager();
            this._pPostEffectTextureA = pRmgr.createTexture(".global-post-effect-texture-A");
            this._pPostEffectTextureB = pRmgr.createTexture(".global-post-effect-texture-B");

            this._pPostEffectTextureA.create(512, 512, 1, null, 512 /* RENDERTARGET */, 0, 0, 3553 /* TEXTURE_2D */, 28 /* R8G8B8A8 */);

            this._pPostEffectTextureB.create(512, 512, 1, null, 512 /* RENDERTARGET */, 0, 0, 3553 /* TEXTURE_2D */, 28 /* R8G8B8A8 */);

            // this._pPostEffectTextureA.notifyLoaded();
            // this._pPostEffectTextureB.notifyLoaded();
            this._pRenderTargetA = this._pPostEffectTextureA.getBuffer().getRenderTarget();
            this._pRenderTargetB = this._pPostEffectTextureB.getBuffer().getRenderTarget();

            this._pPostEffectDepthBuffer = pRmgr.renderBufferPool.createResource(".global-post-effect-depth");
            (this._pPostEffectDepthBuffer).create(6402 /* DEPTH_COMPONENT */, 512, 512, false);

            this._pRenderTargetA.attachDepthPixelBuffer(this._pPostEffectDepthBuffer);

            this._pPostEffectViewport = this._pRenderTargetA.addViewport(new render.Viewport(null));
        };

        Composer.prototype.resizePostEffectTextures = function (iWidth, iHeight) {
            iWidth = math.ceilingPowerOfTwo(iWidth);
            iHeight = math.ceilingPowerOfTwo(iHeight);

            this._pPostEffectTextureA.reset(iWidth, iHeight);
            this._pPostEffectTextureB.reset(iWidth, iHeight);
        };

        Composer.prototype.prepareRenderTarget = function (pEntry, pRenderTechnique, iPass) {
            var pRenderer = this._pEngine.getRenderer();

            if (pRenderTechnique.hasPostEffect()) {
                if (pEntry.viewport.actualWidth > this._pRenderTargetA.width || pEntry.viewport.actualHeight > this._pRenderTargetA.height) {
                    this.resizePostEffectTextures(pEntry.viewport.actualWidth, pEntry.viewport.actualHeight);
                }

                if (pRenderTechnique.isFirstPass(iPass)) {
                    var pRenderViewport = pEntry.viewport;

                    pRenderer._setDepthBufferParams(false, false, 0);
                    pRenderer._setRenderTarget(this._pRenderTargetA);

                    var pViewportState = pRenderViewport._getViewportState();
                    this._pPostEffectViewport.setDimensions(0., 0., pRenderViewport.actualWidth / this._pRenderTargetA.width, pRenderViewport.actualHeight / this._pRenderTargetA.height);
                    this._pPostEffectViewport.setDepthParams(pViewportState.depthTest, pViewportState.depthWrite, pViewportState.depthFunction);
                    this._pPostEffectViewport.setCullingMode(pViewportState.cullingMode);

                    if (pRenderViewport.getClearEveryFrame()) {
                        this._pPostEffectViewport.clear(pViewportState.clearBuffers, pViewportState.clearColor, pViewportState.clearDepth, 0);
                    } else {
                        this._pPostEffectViewport.clear(1 /* COLOR */ | 2 /* DEPTH */, color.ZERO, 1., 0);
                    }
                    // pRenderer._unlockRenderTarget();
                }

                if (!pRenderTechnique.isPostEffectPass(iPass)) {
                    this._pLastRenderTarget = this._pRenderTargetA;
                    pEntry.renderTarget = this._pRenderTargetA;

                    pEntry.viewport = this._pPostEffectViewport;
                } else {
                    if (pRenderTechnique.isLastPass(iPass)) {
                        this._pLastRenderTarget = null;
                        // pEntry.renderTarget = null;
                    } else {
                        if (this._pLastRenderTarget === this._pRenderTargetA) {
                            pEntry.renderTarget = this._pRenderTargetB;
                            this._pLastRenderTarget = this._pRenderTargetB;
                        } else {
                            pEntry.renderTarget = this._pRenderTargetA;
                            this._pLastRenderTarget = this._pRenderTargetA;
                        }

                        pEntry.viewport = this._pPostEffectViewport;
                    }
                }
            }
        };
        Composer.pDefaultSamplerBlender = null;
        return Composer;
    })();

    
    return Composer;
});
//# sourceMappingURL=Composer.js.map
