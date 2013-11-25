/// <reference path="../idl/AERenderStates.ts" />
/// <reference path="../idl/AIAFXPassBlend.ts" />
/// <reference path="../idl/AIAFXComposer.ts" />
/// <reference path="../idl/AITexture.ts" />
/// <reference path="../idl/AIMap.ts" />
define(["require", "exports", "logger", "render", "util/ObjectArray", "util/HashTree", "fx/SamplerBlender", "fx/TexcoordSwapper", "stringUtils/StringMinifier", "fx/AttributeBlendContainer", "fx/ComplexTypeBlendContainer", "fx/ExtSystemDataContainer", "fx/VariableBlendContainer", "fx/Composer", "fx/Effect", "fx/Maker", "resources/SurfaceMaterial"], function(require, exports, __logger__, __render__, __ObjectArray__, __HashTree__, __SamplerBlender__, __TexcoordSwapper__, __StringMinifier__, __AttributeBlendContainer__, __ComplexTypeBlendContainer__, __ExtSystemDataContainer__, __VariableBlendContainer__, __Composer__, __Effect__, __Maker__, __SurfaceMaterial__) {
    var logger = __logger__;

    var render = __render__;

    var ObjectArray = __ObjectArray__;
    var HashTree = __HashTree__;
    var SamplerBlender = __SamplerBlender__;
    var TexcoordSwapper = __TexcoordSwapper__;
    var StringMinifier = __StringMinifier__;

    var AttributeBlendContainer = __AttributeBlendContainer__;
    var ComplexTypeBlendContainer = __ComplexTypeBlendContainer__;
    var ExtSystemDataContainer = __ExtSystemDataContainer__;
    var VariableBlendContainer = __VariableBlendContainer__;

    var Composer = __Composer__;
    var Effect = __Effect__;
    var Maker = __Maker__;

    var SurfaceMaterial = "resources/SurfaceMaterial";

    var PassBlend = (function () {
        function PassBlend(pComposer) {
            //UNIQUE();
            this._pComposer = null;
            this._pFXMakerHashTree = null;
            this._pExtSystemDataV = null;
            this._pComplexTypeContainerV = null;
            this._pForeignContainerV = null;
            this._pUniformContainerV = null;
            this._pSharedContainerV = null;
            this._pGlobalContainerV = null;
            this._pAttributeContainerV = null;
            this._pVaryingContainerV = null;
            this._pVertexOutType = null;
            this._pUsedFunctionListV = null;
            this._pPassFunctionListV = null;
            this._pTextureMapV = null;
            this._pExtSystemDataP = null;
            this._pComplexTypeContainerP = null;
            this._pForeignContainerP = null;
            this._pUniformContainerP = null;
            this._pSharedContainerP = null;
            this._pGlobalContainerP = null;
            this._pVaryingContainerP = null;
            this._pUsedFunctionListP = null;
            this._pPassFunctionListP = null;
            this._pTextureMapP = null;
            this._hasEmptyVertex = true;
            this._hasEmptyPixel = true;
            this._pPassStateMap = null;
            //Code fragments
            // private _isZeroSampler2dV: boolean = false;
            // private _isZeroSamplerCubeV: boolean = false;
            this._sUniformSamplerCodeV = "";
            this._sAttrBufferDeclCode = "";
            this._sAttrDeclCode = "";
            this._sAFXAttrDeclCode = "";
            this._sAttrBufferInitCode = "";
            this._sAFXAttrInitCode = "";
            this._sSystemExtBlockCodeV = "";
            this._sFunctionDefCodeV = "";
            this._sSharedVarCodeV = "";
            this._sVaryingDeclCodeV = "";
            this._sVertexOutDeclCode = "";
            this._sVertexOutToVaryingCode = "";
            this._sPassFunctionCallCodeV = "";
            // private _isZeroSampler2dP: boolean = false;
            // private _isZeroSamplerCubeP: boolean = false;
            this._sUniformSamplerCodeP = "";
            this._sSystemExtBlockCodeP = "";
            this._sFunctionDefCodeP = "";
            this._sSharedVarCodeP = "";
            this._sVaryingDeclCodeP = "";
            this._sPassFunctionCallCodeP = "";
            this._sVertexCode = "";
            this._sPixelCode = "";
            this._pDefaultSamplerBlender = null;
            this._pTexcoordSwapper = null;
            //For speed-up
            this._pSamplerByIdMap = null;
            this._pSamplerIdList = null;
            this._pSamplerArrayByIdMap = null;
            this._pSamplerArrayIdList = null;
            this._pPassInputForeignsHashMap = null;
            this._pPassInputSamplersHashMap = null;
            this._pBufferMapHashMap = null;
            this._pSurfaceMaterialHashMap = null;
            this._isSamplersPrepared = false;
            this._isBufferMapPrepared = false;
            this._isSurfaceMaterialPrepared = false;
            this._pComposer = pComposer;

            this._pFXMakerHashTree = new HashTree();

            this._pExtSystemDataV = new ExtSystemDataContainer();
            this._pComplexTypeContainerV = new ComplexTypeBlendContainer();
            this._pForeignContainerV = new VariableBlendContainer();
            this._pUniformContainerV = new VariableBlendContainer();
            this._pSharedContainerV = new VariableBlendContainer();
            this._pGlobalContainerV = new VariableBlendContainer();
            this._pAttributeContainerV = new AttributeBlendContainer();
            this._pVaryingContainerV = new VariableBlendContainer();
            this._pVertexOutType = Effect.getBaseVertexOutType();
            this._pUsedFunctionListV = [];
            this._pPassFunctionListV = [];
            this._pTextureMapV = {};

            this._pExtSystemDataP = new ExtSystemDataContainer();
            this._pComplexTypeContainerP = new ComplexTypeBlendContainer();
            this._pForeignContainerP = new VariableBlendContainer();
            this._pUniformContainerP = new VariableBlendContainer();
            this._pSharedContainerP = new VariableBlendContainer();
            this._pGlobalContainerP = new VariableBlendContainer();
            this._pVaryingContainerP = new VariableBlendContainer();
            this._pUsedFunctionListP = [];
            this._pPassFunctionListP = [];
            this._pTextureMapP = {};

            this._pDefaultSamplerBlender = Composer.pDefaultSamplerBlender;

            if (isNull(PassBlend.texcoordSwapper)) {
                PassBlend.texcoordSwapper = new TexcoordSwapper();
            }

            if (isNull(PassBlend.hashMinifier)) {
                PassBlend.hashMinifier = new StringMinifier();
            }

            this._pTexcoordSwapper = PassBlend.texcoordSwapper;

            this._pPassStateMap = render.createRenderStateMap();

            this._pPassInputForeignsHashMap = {};
            this._pPassInputSamplersHashMap = {};
            this._pBufferMapHashMap = {};
            this._pSurfaceMaterialHashMap = {};
        }
        PassBlend.prototype.initFromPassList = function (pPassList) {
            for (var i = 0; i < pPassList.length; i++) {
                if (!this.addPass(pPassList[i])) {
                    return false;
                }
            }

            if (!this.finalizeBlend()) {
                return false;
            }

            return true;
        };

        PassBlend.prototype.generateFXMaker = function (pPassInput, pSurfaceMaterial, pBuffer) {
            pPassInput.setSurfaceMaterial(pSurfaceMaterial);

            var iForeignPartHash = this.prepareForeigns(pPassInput);
            var iSamplerPartHash = this.prepareSamplers(pPassInput, false);
            var iMaterialPartHash = this.prepareSurfaceMaterial(pSurfaceMaterial, false);
            var iBufferPartHash = this.prepareBufferMap(pBuffer, false);

            this._pFXMakerHashTree.release();
            var pMaker = this._pFXMakerHashTree.next(iForeignPartHash).next(iSamplerPartHash).next(iMaterialPartHash).next(iBufferPartHash).getContent();

            if (isNull(pMaker)) {
                if (!this._isBufferMapPrepared) {
                    this.prepareBufferMap(pBuffer, true);
                }

                if (!this._isSamplersPrepared) {
                    this.prepareSamplers(pPassInput, true);
                }

                this.applyForeigns(pPassInput);
                this.swapTexcoords(pSurfaceMaterial);
                this.generateShaderCode();
                this.resetForeigns();

                pMaker = new Maker(this._pComposer, this);
                var isCreate = pMaker._create(this._sVertexCode, this._sPixelCode);

                if (!isCreate) {
                    logger.critical("Can not create Maker");
                    return null;
                }

                pMaker._initInput(pPassInput, this._pDefaultSamplerBlender, this._pAttributeContainerV);

                this._pFXMakerHashTree.addContent(pMaker);
                this._pDefaultSamplerBlender.clear();
            }

            return pMaker;
        };

        PassBlend.prototype._hasUniformWithName = function (sName) {
            return this.hasUniformWithName(sName);
        };

        PassBlend.prototype._hasUniformWithNameIndex = function (iNameIndex) {
            return this.hasUniformWithNameIndex(iNameIndex);
        };

        PassBlend.prototype._getRenderStates = function () {
            return this._pPassStateMap;
        };

        PassBlend.prototype.finalizeBlend = function () {
            if (!this.finalizeBlendForVertex()) {
                return false;
            }

            if (!this.finalizeBlendForPixel()) {
                return false;
            }

            this.prepareFastObjects();

            return true;
        };

        PassBlend.prototype.addPass = function (pPass) {
            var pVertex = pPass.getVertexShader();
            var pPixel = pPass.getPixelShader();

            var pForeignMap = null;
            var pGlobalMap = null;
            var pSharedMap = null;
            var pUniformMap = null;
            var pTextureMap = null;
            var pAttributeMap = null;
            var pVaryingMap = null;
            var pComplexTypeMap = null;

            var pForeignKeys = null;
            var pGlobalKeys = null;
            var pSharedKeys = null;
            var pUniformKeys = null;
            var pTextureKeys = null;
            var pAttributeKeys = null;
            var pVaryingKeys = null;
            var pComplexTypeKeys = null;

            var pForeign = null;
            var pGlobal = null;
            var pShared = null;
            var pUniform = null;
            var pTexture = null;
            var pAttribute = null;
            var pVarying = null;
            var pComplexType = null;

            var pUsedFunctionList = null;
            var pUsedFunction = null;

            if (!isNull(pVertex)) {
                this._hasEmptyVertex = false;

                //blend system data
                this._pExtSystemDataV.addFromFunction(pVertex);

                //blend foreigns
                pForeignMap = pVertex._getForeignVariableMap();
                pForeignKeys = pVertex._getForeignVariableKeys();

                if (!isNull(pForeignKeys)) {
                    for (var i = 0; i < pForeignKeys.length; i++) {
                        pForeign = pForeignMap[pForeignKeys[i]];

                        if (!this._pForeignContainerV.addVariable(pForeign, 3 /* k_Foreign */)) {
                            logger.error("Could not add foreign variable");
                            return false;
                        }
                    }
                }

                //blend globals
                pGlobalMap = pVertex._getGlobalVariableMap();
                pGlobalKeys = pVertex._getGlobalVariableKeys();

                if (!isNull(pGlobalKeys)) {
                    for (var i = 0; i < pGlobalKeys.length; i++) {
                        pGlobal = pGlobalMap[pGlobalKeys[i]];

                        if (!this._pGlobalContainerV.addVariable(pGlobal, 4 /* k_Global */)) {
                            logger.error("Could not add global variable");
                            return false;
                        }
                    }
                }

                //blend shareds
                pSharedMap = pVertex._getSharedVariableMap();
                pSharedKeys = pVertex._getSharedVariableKeys();

                if (!isNull(pSharedKeys)) {
                    for (var i = 0; i < pSharedKeys.length; i++) {
                        pShared = pSharedMap[pSharedKeys[i]];

                        if (!this._pSharedContainerV.addVariable(pShared, 0 /* k_Shared */)) {
                            logger.error("Could not add shared variable");
                            return false;
                        }
                    }
                }

                //TODO: blend uniforms
                pUniformMap = pVertex._getUniformVariableMap();
                pUniformKeys = pVertex._getUniformVariableKeys();

                if (!isNull(pUniformKeys)) {
                    for (var i = 0; i < pUniformKeys.length; i++) {
                        pUniform = pUniformMap[pUniformKeys[i]];

                        if (isNull(pUniform)) {
                            continue;
                        }

                        if (!this._pUniformContainerV.addVariable(pUniform, 1 /* k_Uniform */)) {
                            logger.error("Could not add uniform variable");
                            return false;
                        }
                    }
                }

                //TODO: blend textures
                pTextureMap = pVertex._getTextureVariableMap();
                pTextureKeys = pVertex._getTextureVariableKeys();

                if (!isNull(pTextureKeys)) {
                    for (var i = 0; i < pTextureKeys.length; i++) {
                        pTexture = pTextureMap[pTextureKeys[i]];

                        if (isNull(pTexture)) {
                            continue;
                        }

                        this._pTextureMapV[pTexture.getRealName()] = true;
                    }
                }

                //TODO: blend attributes
                pAttributeMap = pVertex._getAttributeVariableMap();
                pAttributeKeys = pVertex._getAttributeVariableKeys();

                if (!isNull(pAttributeKeys)) {
                    for (var i = 0; i < pAttributeKeys.length; i++) {
                        pAttribute = pAttributeMap[pAttributeKeys[i]];

                        if (!this._pAttributeContainerV.addAttribute(pAttribute)) {
                            logger.error("Could not add attribute variable");
                            return false;
                        }
                    }
                }

                //TODO: blend varyings
                pVaryingMap = pVertex._getVaryingVariableMap();
                pVaryingKeys = pVertex._getVaryingVariableKeys();

                if (!isNull(pVaryingKeys)) {
                    for (var i = 0; i < pVaryingKeys.length; i++) {
                        pVarying = pVaryingMap[pVaryingKeys[i]];

                        if (!this._pVaryingContainerV.addVariable(pVarying, 5 /* k_Varying */)) {
                            logger.error("Could not add varying variable");
                            return false;
                        }
                    }
                }

                //blend used type
                pComplexTypeMap = pVertex._getUsedComplexTypeMap();
                pComplexTypeKeys = pVertex._getUsedComplexTypeKeys();

                if (!isNull(pComplexTypeKeys)) {
                    for (var i = 0; i < pComplexTypeKeys.length; i++) {
                        pComplexType = pComplexTypeMap[pComplexTypeKeys[i]];

                        if (!this._pComplexTypeContainerV.addComplexType(pComplexType)) {
                            logger.error("Could not add type declaration");
                            return false;
                        }
                    }
                }

                //blend used functions
                pUsedFunctionList = pVertex._getUsedFunctionList();

                if (!isNull(pUsedFunctionList)) {
                    for (var i = 0; i < pUsedFunctionList.length; i++) {
                        pUsedFunction = pUsedFunctionList[i];

                        if (this._pUsedFunctionListV.indexOf(pUsedFunction) === -1) {
                            this._pUsedFunctionListV.push(pUsedFunction);
                        }
                    }
                }

                var pVertexOut = pVertex.getReturnType().getBaseType();

                if (pVertexOut.isComplex()) {
                    this._pVertexOutType = this._pVertexOutType.blend(pVertexOut, 7 /* k_VertexOut */);
                }
                this._pPassFunctionListV.push(pVertex);
            }

            if (!isNull(pPixel)) {
                this._hasEmptyPixel = false;

                //blend system data
                this._pExtSystemDataP.addFromFunction(pPixel);

                //blend foreigns
                pForeignMap = pPixel._getForeignVariableMap();
                pForeignKeys = pPixel._getForeignVariableKeys();

                if (!isNull(pForeignKeys)) {
                    for (var i = 0; i < pForeignKeys.length; i++) {
                        pForeign = pForeignMap[pForeignKeys[i]];

                        if (!this._pForeignContainerP.addVariable(pForeign, 3 /* k_Foreign */)) {
                            logger.error("Could not add foreign variable");
                            return false;
                        }
                    }
                }

                //blend globals
                pGlobalMap = pPixel._getGlobalVariableMap();
                pGlobalKeys = pPixel._getGlobalVariableKeys();

                if (!isNull(pGlobalKeys)) {
                    for (var i = 0; i < pGlobalKeys.length; i++) {
                        pGlobal = pGlobalMap[pGlobalKeys[i]];

                        if (!this._pGlobalContainerP.addVariable(pGlobal, 4 /* k_Global */)) {
                            logger.error("Could not add global variable");
                            return false;
                        }
                    }
                }

                //blend shareds
                pSharedMap = pPixel._getSharedVariableMap();
                pSharedKeys = pPixel._getSharedVariableKeys();

                if (!isNull(pSharedKeys)) {
                    for (var i = 0; i < pSharedKeys.length; i++) {
                        pShared = pSharedMap[pSharedKeys[i]];

                        if (!this._pSharedContainerP.addVariable(pShared, 0 /* k_Shared */)) {
                            logger.error("Could not add shared variable");
                            return false;
                        }
                    }
                }

                //TODO: blend uniforms
                pUniformMap = pPixel._getUniformVariableMap();
                pUniformKeys = pPixel._getUniformVariableKeys();

                if (!isNull(pUniformKeys)) {
                    for (var i = 0; i < pUniformKeys.length; i++) {
                        pUniform = pUniformMap[pUniformKeys[i]];

                        if (isNull(pUniform)) {
                            continue;
                        }

                        if (!this._pUniformContainerP.addVariable(pUniform, 1 /* k_Uniform */)) {
                            logger.error("Could not add uniform variable");
                            return false;
                        }
                    }
                }

                //TODO: blend textures
                pTextureMap = pPixel._getTextureVariableMap();
                pTextureKeys = pPixel._getTextureVariableKeys();

                if (!isNull(pTextureKeys)) {
                    for (var i = 0; i < pTextureKeys.length; i++) {
                        pTexture = pTextureMap[pTextureKeys[i]];

                        if (isNull(pTexture)) {
                            continue;
                        }

                        this._pTextureMapP[pTexture.getRealName()] = true;
                    }
                }

                //TODO: blend varyings
                pVaryingMap = pPixel._getVaryingVariableMap();
                pVaryingKeys = pPixel._getVaryingVariableKeys();

                if (!isNull(pVaryingKeys)) {
                    for (var i = 0; i < pVaryingKeys.length; i++) {
                        pVarying = pVaryingMap[pVaryingKeys[i]];

                        if (!this._pVaryingContainerP.addVariable(pVarying, 5 /* k_Varying */)) {
                            logger.error("Could not add varying variable");
                            return false;
                        }
                    }
                }

                //blend used type
                pComplexTypeMap = pPixel._getUsedComplexTypeMap();
                pComplexTypeKeys = pPixel._getUsedComplexTypeKeys();

                if (!isNull(pComplexTypeKeys)) {
                    for (var i = 0; i < pComplexTypeKeys.length; i++) {
                        pComplexType = pComplexTypeMap[pComplexTypeKeys[i]];

                        if (!this._pComplexTypeContainerP.addComplexType(pComplexType)) {
                            logger.error("Could not add type declaration");
                            return false;
                        }
                    }
                }

                //blend used functions
                pUsedFunctionList = pPixel._getUsedFunctionList();

                if (!isNull(pUsedFunctionList)) {
                    for (var i = 0; i < pUsedFunctionList.length; i++) {
                        pUsedFunction = pUsedFunctionList[i];

                        if (this._pUsedFunctionListP.indexOf(pUsedFunction) === -1) {
                            this._pUsedFunctionListP.push(pUsedFunction);
                        }
                    }
                }

                this._pPassFunctionListP.push(pPixel);
            }

            render.copyRenderStateMap(pPass._getRenderStates(), this._pPassStateMap);

            return true;
        };

        PassBlend.prototype.finalizeBlendForVertex = function () {
            if (this._hasEmptyVertex) {
                return true;
            }

            if (!this.finalizeComplexTypeForShader(0 /* k_Vertex */)) {
                return false;
            }

            this._pAttributeContainerV.finalize();
            this._pAttributeContainerV.generateOffsetMap();

            return true;
        };

        PassBlend.prototype.finalizeBlendForPixel = function () {
            if (this._hasEmptyPixel) {
                return true;
            }

            if (!this.finalizeComplexTypeForShader(1 /* k_Pixel */)) {
                return false;
            }

            return true;
        };

        PassBlend.prototype.enableVaringPrefixes = function (eType, bEnabled) {
            var pVars = null;

            if (eType === 0 /* k_Vertex */) {
                pVars = this._pVaryingContainerV;
            } else {
                pVars = this._pVaryingContainerP;
            }

            var pVarInfoList = pVars.varsInfo;

            for (var i = 0; i < pVarInfoList.length; i++) {
                var pVarList = pVarInfoList[i].varList;

                for (var j = 0; j < pVarList.length; j++) {
                    pVarList[j]._markAsVarying(bEnabled);
                }
            }
        };

        PassBlend.prototype.finalizeComplexTypeForShader = function (eType) {
            var pTypeContainer = null;

            var pUniformContainer = null;
            var pGlobalContainer = null;
            var pSharedContainer = null;
            var pUsedFunctions = null;

            var pAttributeContainer = null;

            if (eType === 0 /* k_Vertex */) {
                pTypeContainer = this._pComplexTypeContainerV;
                pUniformContainer = this._pUniformContainerV;
                pGlobalContainer = this._pGlobalContainerV;
                pSharedContainer = this._pSharedContainerV;
                pUsedFunctions = this._pUsedFunctionListV;
                pAttributeContainer = this._pAttributeContainerV;
            } else if (eType === 1 /* k_Pixel */) {
                pTypeContainer = this._pComplexTypeContainerP;
                pUniformContainer = this._pUniformContainerP;
                pGlobalContainer = this._pGlobalContainerP;
                pSharedContainer = this._pSharedContainerP;
                pUsedFunctions = this._pUsedFunctionListP;
            }

            if (!pTypeContainer.addFromVarConatiner(pUniformContainer) || !pTypeContainer.addFromVarConatiner(pGlobalContainer) || !pTypeContainer.addFromVarConatiner(pSharedContainer) || !pTypeContainer.addFromVarConatiner(pAttributeContainer)) {
                return false;
            }

            for (var i = 0; i < pUsedFunctions.length; i++) {
                var pReturnBaseType = pUsedFunctions[i].getReturnType().getBaseType();
                if (pReturnBaseType.isComplex()) {
                    if (!pTypeContainer.addComplexType(pReturnBaseType)) {
                        return false;
                    }
                }
            }

            return true;
        };

        PassBlend.prototype.hasUniformWithName = function (sName) {
            return this._pUniformContainerV.hasVariableWithName(sName) || this._pUniformContainerP.hasVariableWithName(sName);
        };

        PassBlend.prototype.hasUniformWithNameIndex = function (iNameIndex) {
            return this._pUniformContainerV.hasVariableWithNameIndex(iNameIndex) || this._pUniformContainerP.hasVariableWithNameIndex(iNameIndex);
        };

        // private hasUniform(pVar: AIAFXVariableDeclInstruction): boolean {
        // 	return this.hasUniformWithName(pVar.getRealName());
        // }
        // private getUniformByName(sName: string): AIAFXVariableDeclInstruction {
        // 	return this._pUniformContainerV.getVariableByName(sName) ||
        // 		   this._pUniformContainerP.getVariableByName(sName);
        // }
        PassBlend.prototype.prepareForeigns = function (pPassInput) {
            var iPassInputId = pPassInput.getGuid();
            var pForignsHashEntry = this._pPassInputForeignsHashMap[iPassInputId];

            if (isDef(pForignsHashEntry) && pForignsHashEntry.modifyMark === pPassInput.statesInfo.foreignKey) {
                return pForignsHashEntry.hash;
            } else {
                var pForeignValues = pPassInput.foreigns;
                var sHash = "";
                var pVarInfoList = this._pForeignContainerV.varsInfo;

                for (var i = 0; i < pVarInfoList.length; i++) {
                    sHash += pForeignValues[pVarInfoList[i].nameIndex].toString() + "%";
                }

                pVarInfoList = this._pForeignContainerP.varsInfo;

                for (var i = 0; i < pVarInfoList.length; i++) {
                    sHash += pForeignValues[pVarInfoList[i].nameIndex].toString() + "%";
                }

                if (!isDef(pForignsHashEntry)) {
                    pForignsHashEntry = {
                        hash: 0,
                        modifyMark: 0
                    };

                    this._pPassInputForeignsHashMap[iPassInputId] = pForignsHashEntry;
                }

                pForignsHashEntry.hash = PassBlend.hashMinifier.minify(sHash);
                pForignsHashEntry.modifyMark = pPassInput.statesInfo.foreignKey;

                return pForignsHashEntry.hash;
            }
        };

        PassBlend.prototype.prepareSamplers = function (pPassInput, isForce) {
            this._isSamplersPrepared = false;

            var iPassInputId = pPassInput.getGuid();
            var pSamplersHashEntry = this._pPassInputSamplersHashMap[iPassInputId];

            if (!isForce && isDef(pSamplersHashEntry) && pSamplersHashEntry.modifyMark === pPassInput.statesInfo.samplerKey) {
                return pSamplersHashEntry.hash;
            }

            var pBlender = this._pDefaultSamplerBlender;
            pBlender.clear();

            //Gum samplers
            var pSamplers = pPassInput.samplers;
            var pSamplersId = this._pSamplerIdList;

            for (var i = 0; i < pSamplersId.length; i++) {
                var pSampler = this._pSamplerByIdMap[pSamplersId[i]];
                var iNameIndex = pSampler._getNameIndex();

                var pSamplerState = pSamplers[iNameIndex];
                var pTexture = pPassInput._getTextureForSamplerState(pSamplerState);

                if (isNull(pTexture)) {
                    pBlender.addObjectToSlotById(pSampler, SamplerBlender.ZERO_SLOT);
                } else {
                    pBlender.addTextureSlot(pTexture.getGuid());
                    pBlender.addObjectToSlotById(pSampler, pTexture.getGuid());
                }
            }

            //Gum sampler arrays
            var pSamplerArrays = pPassInput.samplerArrays;
            var pSamplerArraysId = this._pSamplerArrayIdList;

            for (var i = 0; i < pSamplerArraysId.length; i++) {
                var pSamplerArray = this._pSamplerArrayByIdMap[pSamplerArraysId[i]];
                var iNameIndex = pSamplerArray._getNameIndex();

                var pSamplerStateList = pSamplerArrays[iNameIndex];
                var isNeedToCollapse = true;
                var pTexture = null;
                var iLength = pPassInput.samplerArrayLength[iNameIndex];

                for (var j = 0; j < iLength; j++) {
                    if (j === 0) {
                        pTexture = pPassInput._getTextureForSamplerState(pSamplerStateList[j]);
                    } else {
                        if (pTexture !== pPassInput._getTextureForSamplerState(pSamplerStateList[j])) {
                            isNeedToCollapse = false;
                        }
                    }
                }

                if (isNeedToCollapse) {
                    pSamplerArray._setCollapsed(true);

                    if (isNull(pTexture)) {
                        pBlender.addObjectToSlotById(pSamplerArray, SamplerBlender.ZERO_SLOT);
                    } else {
                        pBlender.addTextureSlot(pTexture.getGuid());
                        pBlender.addObjectToSlotById(pSamplerArray, pTexture.getGuid());
                    }
                } else {
                    pSamplerArray._setCollapsed(false);
                }
            }

            this._isSamplersPrepared = true;

            if (!isDef(pSamplersHashEntry)) {
                pSamplersHashEntry = {
                    hash: 0,
                    modifyMark: 0
                };

                this._pPassInputSamplersHashMap[iPassInputId] = pSamplersHashEntry;
            }

            pSamplersHashEntry.hash = PassBlend.hashMinifier.minify(pBlender.getHash());
            pSamplersHashEntry.modifyMark = pPassInput.statesInfo.samplerKey;

            return pSamplersHashEntry.hash;
        };

        PassBlend.prototype.prepareSurfaceMaterial = function (pMaterial, isForce) {
            this._isSurfaceMaterialPrepared = false;

            if (isNull(pMaterial)) {
                return 0;
            }

            var iMaterialId = pMaterial.getGuid();
            var pMaterialHashEntry = this._pSurfaceMaterialHashMap[iMaterialId];
            if (isDef(pMaterialHashEntry) && pMaterialHashEntry.modifyMark === pMaterial.totalUpdatesOfTexcoords) {
                return pMaterialHashEntry.hash;
            } else {
                var sMaterailHash = "";
                for (var i = 0; i < SurfaceMaterial.MAX_TEXTURES_PER_SURFACE; i++) {
                    var iTexcoord = pMaterial.texcoord(i);

                    if (i !== iTexcoord) {
                        sMaterailHash += i.toString() + "<" + iTexcoord.toString() + ".";
                    }
                }

                var iMaterialHash = PassBlend.hashMinifier.minify(sMaterailHash);

                if (!isDef(pMaterialHashEntry)) {
                    pMaterialHashEntry = {
                        hash: 0,
                        modifyMark: 0
                    };

                    this._pSurfaceMaterialHashMap[iMaterialId] = pMaterialHashEntry;
                }

                pMaterialHashEntry.hash = iMaterialHash;
                pMaterialHashEntry.modifyMark = pMaterial.totalUpdatesOfTexcoords;

                return iMaterialHash;
            }
        };

        PassBlend.prototype.prepareBufferMap = function (pMap, isForce) {
            this._isBufferMapPrepared = false;

            var iBufferMapHash = 0;

            var iBufferMapId = pMap.getGuid();
            var pBufferMapHashEntry = this._pBufferMapHashMap[iBufferMapId];

            if (!isForce && isDef(pBufferMapHashEntry) && pBufferMapHashEntry.modifyMark === pMap.totalUpdates) {
                iBufferMapHash = pBufferMapHashEntry.hash;
            } else {
                this._pAttributeContainerV.initFromBufferMap(pMap);
                iBufferMapHash = PassBlend.hashMinifier.minify(this._pAttributeContainerV.getHash());

                this._isBufferMapPrepared = true;

                if (!isDef(pBufferMapHashEntry)) {
                    pBufferMapHashEntry = {
                        hash: 0,
                        modifyMark: 0
                    };

                    this._pBufferMapHashMap[iBufferMapId] = pBufferMapHashEntry;
                }

                pBufferMapHashEntry.modifyMark = pMap.totalUpdates;
                pBufferMapHashEntry.hash = iBufferMapHash;
            }

            return iBufferMapHash;
        };

        PassBlend.prototype.swapTexcoords = function (pMaterial) {
            this._pTexcoordSwapper.generateSwapCode(pMaterial, this._pAttributeContainerV);
        };

        PassBlend.prototype.isSamplerUsedInShader = function (pSampler, eType) {
            return (eType === 0 /* k_Vertex */ && this._pUniformContainerV.hasVariable(pSampler)) || (eType === 1 /* k_Pixel */ && this._pUniformContainerP.hasVariable(pSampler));
        };

        PassBlend.prototype.applyForeigns = function (pPassInput) {
            var pForeignValues = pPassInput.foreigns;
            var pKeys = pPassInput.foreignKeys;

            var pForeignsV = this._pForeignContainerV;
            var pForeignsP = this._pForeignContainerP;

            for (var i = 0; i < pKeys.length; i++) {
                var iNameIndex = pKeys[i];
                var pVarList = null;
                var iVarBlendIndex = 0;

                iVarBlendIndex = pForeignsV.getKeyIndexByNameIndex(iNameIndex);
                if (iVarBlendIndex !== -1) {
                    pVarList = pForeignsV.getVarList(iVarBlendIndex);

                    for (var j = 0; j < pVarList.length; j++) {
                        pVarList[j].setValue(pForeignValues[iNameIndex] || 1);
                    }
                }

                iVarBlendIndex = pForeignsP.getKeyIndexByNameIndex(iNameIndex);
                if (iVarBlendIndex !== -1) {
                    pVarList = pForeignsP.getVarList(iVarBlendIndex);

                    for (var j = 0; j < pVarList.length; j++) {
                        pVarList[j].setValue(pForeignValues[iNameIndex] || 1);
                    }
                }
            }
        };

        PassBlend.prototype.resetForeigns = function () {
            var pForeignsV = this._pForeignContainerV;
            var pForeignsP = this._pForeignContainerP;

            var pVarInfoList = pForeignsV.varsInfo;

            for (var i = 0; i < pVarInfoList.length; i++) {
                var pVarInfo = pVarInfoList[i];
                var pVarList = pVarInfo.varList;

                for (var j = 0; j < pVarList.length; j++) {
                    pVarList[j].setRealName(pVarInfo.name);
                }
            }

            var pVarInfoList = pForeignsP.varsInfo;

            for (var i = 0; i < pVarInfoList.length; i++) {
                var pVarInfo = pVarInfoList[i];
                var pVarList = pVarInfo.varList;

                for (var j = 0; j < pVarList.length; j++) {
                    pVarList[j].setRealName(pVarInfo.name);
                }
            }
        };

        PassBlend.prototype.generateShaderCode = function () {
            this.clearCodeFragments();
            this.reduceSamplers();
            this.reduceAttributes();

            this._sVertexCode = this.generateCodeForVertex();
            this._sPixelCode = this.generateCodeForPixel();

            this.resetSamplerVarsToDefault();
        };

        PassBlend.prototype.generateCodeForVertex = function () {
            var sCode = "";
            var eType = 0 /* k_Vertex */;

            sCode = this.generateSystemExtBlock(eType) + "\n" + this.generateTypeDels(eType) + "\n" + this.generateFunctionDefenitions(eType) + "\n" + this.generateSharedVars(eType) + "\n" + this.generateVertexOut() + "\n";

            this.enableVaringPrefixes(eType, true);
            sCode += this.generateVaryings(eType) + "\n";
            this.enableVaringPrefixes(eType, false);

            sCode += this.generateUniformSamplers(eType) + "\n" + this.generateUniformVars(eType) + "\n" + this.generateAttrBuffers() + "\n" + this.generateGlobalVars(eType) + "\n" + this.generateFunctions(eType) + "\n" + this.generateRealAttrs() + "\n" + this.generateAFXAttrs() + "\n" + this.generatePassFunctions(eType) + "\n" + "void main() {\n" + this.generateAttrBufferInit() + "\n" + this.generateAFXAttrInit() + "\n" + this.generateTexcoordSwap() + "\n" + this.generatePassFunctionCall(eType) + "\n" + this.generateVertexOutToVaryings() + "\n" + "}";

            return sCode;
        };

        PassBlend.prototype.generateCodeForPixel = function () {
            if (this._hasEmptyPixel) {
                return "void main(){}";
            }

            var sCode = "";
            var eType = 1 /* k_Pixel */;

            this.enableVaringPrefixes(eType, true);

            sCode = this.generateSystemExtBlock(eType) + "\n" + "vec4 resultAFXColor;" + "\n" + this.generateTypeDels(eType) + "\n" + this.generateFunctionDefenitions(eType) + "\n" + this.generateSharedVars(eType) + "\n" + this.generateVaryings(eType) + "\n" + this.generateUniformSamplers(eType) + "\n" + this.generateUniformVars(eType) + "\n" + this.generateGlobalVars(eType) + "\n" + this.generateFunctions(eType) + "\n" + this.generatePassFunctions(eType) + "\n" + "void main() {\n" + this.generatePassFunctionCall(eType) + "\n" + "gl_FragColor = resultAFXColor;" + "\n" + "}";
            this.enableVaringPrefixes(eType, false);

            return sCode;
        };

        PassBlend.prototype.clearCodeFragments = function () {
            this._sUniformSamplerCodeV = "";

            this._sAttrBufferDeclCode = "";
            this._sAttrDeclCode = "";
            this._sAFXAttrDeclCode = "";
            this._sAttrBufferInitCode = "";
            this._sAFXAttrInitCode = "";

            this._sUniformSamplerCodeP = "";
        };

        PassBlend.prototype.reduceSamplers = function () {
            var pSamplerBlender = this._pDefaultSamplerBlender;
            var iTotalSlots = pSamplerBlender.totalActiveSlots;

            var sUniformSamplerCodeV = "";
            var sUniformSamplerCodeP = "";

            var isZeroSampler2DV = false;
            var isZeroSamplerCubeV = false;
            var isZeroSampler2DP = false;
            var isZeroSamplerCubeP = false;

            var isInVertex = false;
            var isInPixel = false;

            var sSamplerName = "";

            for (var i = 0; i < iTotalSlots; i++) {
                var pSamplers = pSamplerBlender.getSamplersBySlot(i);

                isInVertex = false;
                isInPixel = false;

                sSamplerName = "as" + i.toString();

                for (var j = 0; j < pSamplers.length; j++) {
                    var pSampler = pSamplers.value(j);
                    var iNameIndex = pSampler._getNameIndex();
                    var iIndexForSamplerV = this._pUniformContainerV.getKeyIndexByNameIndex(iNameIndex);
                    var iIndexForSamplerP = this._pUniformContainerP.getKeyIndexByNameIndex(iNameIndex);

                    if (i === SamplerBlender.ZERO_SLOT) {
                        if (iIndexForSamplerV !== -1) {
                            this._pUniformContainerV.forEach(iIndexForSamplerV, PassBlend.fnSamplerReducer);

                            if (pSampler.getType().isSampler2D()) {
                                isZeroSampler2DV = true;
                            } else {
                                isZeroSamplerCubeV = true;
                                sSamplerName = "asc0";
                            }
                        }

                        if (iIndexForSamplerP !== -1) {
                            this._pUniformContainerP.forEach(iIndexForSamplerP, PassBlend.fnSamplerReducer);

                            if (pSampler.getType().isSampler2D()) {
                                isZeroSampler2DP = true;
                            } else {
                                isZeroSamplerCubeP = true;
                                sSamplerName = "asc0";
                            }
                        }
                    } else {
                        if (iIndexForSamplerV !== -1) {
                            isInVertex = true;
                        }
                        if (iIndexForSamplerP !== -1) {
                            isInPixel = true;
                        }
                    }

                    this._pUniformContainerV.setNameForEach(iIndexForSamplerV, sSamplerName);
                    this._pUniformContainerP.setNameForEach(iIndexForSamplerP, sSamplerName);
                }

                if (i === SamplerBlender.ZERO_SLOT) {
                    if (isZeroSampler2DV) {
                        sUniformSamplerCodeV += "uniform sampler2D as0;";
                    }
                    if (isZeroSamplerCubeV) {
                        sUniformSamplerCodeV += "uniform samplerCube asc0;";
                    }
                    if (isZeroSampler2DP) {
                        sUniformSamplerCodeP += "uniform sampler2D as0;";
                    }
                    if (isZeroSamplerCubeP) {
                        sUniformSamplerCodeP += "uniform samplerCube asc0;";
                    }
                } else {
                    if (isInVertex) {
                        sUniformSamplerCodeV += "uniform " + pSamplers.value(0).getType().getBaseType().getRealName() + " " + sSamplerName + ";";
                    }

                    if (isInPixel) {
                        sUniformSamplerCodeP += "uniform " + pSamplers.value(0).getType().getBaseType().getRealName() + " " + sSamplerName + ";";
                    }
                }
            }

            this._sUniformSamplerCodeV = sUniformSamplerCodeV;
            this._sUniformSamplerCodeP = sUniformSamplerCodeP;
        };

        PassBlend.prototype.resetSamplerVarsToDefault = function () {
            var pSamplerBlender = this._pDefaultSamplerBlender;
            var iTotalSlots = pSamplerBlender.totalActiveSlots;

            pSamplerBlender.clearSamplerNames();
        };

        PassBlend.fnSamplerReducer = function (pSamplerVar) {
            pSamplerVar.defineByZero(true);
        };

        PassBlend.prototype.reduceAttributes = function () {
            var pAttributeContainer = this._pAttributeContainerV;
            var pAttrInfoList = pAttributeContainer.attrsInfo;

            var nPreparedBufferSlots = -1;
            var nPreparedAttributeSlots = -1;

            for (var i = 0; i < pAttrInfoList.length; i++) {
                var iSemanticIndex = i;
                var pAttrInfo = pAttrInfoList[iSemanticIndex];
                var pAttributes = pAttributeContainer.getAttributeListBySemanticIndex(iSemanticIndex);
                var iSlot = pAttributeContainer.getSlotBySemanticIndex(iSemanticIndex);
                var iBufferSlot = -1;
                var sAttrName = "";

                if (iSlot === -1) {
                    for (var j = 0; j < pAttributes.length; j++) {
                        if (pAttributes[j].getType().isStrictPointer()) {
                            pAttributes[j].getType().getVideoBuffer().defineByZero(true);
                        }
                    }
                } else {
                    iBufferSlot = pAttributeContainer.getBufferSlotBySemanticIndex(iSemanticIndex);

                    sAttrName = "aa" + iSlot.toString();

                    if (iBufferSlot >= 0) {
                        var sSamplerBufferName = "abs" + iBufferSlot.toString();
                        var sHeaderBufferName = "abh" + iBufferSlot.toString();

                        var pBufferVar = null;

                        for (var j = 0; j < pAttributes.length; j++) {
                            pBufferVar = pAttributes[j].getType().getVideoBuffer();
                            pBufferVar.setVideoBufferRealName(sSamplerBufferName, sHeaderBufferName);
                        }

                        if (iBufferSlot > nPreparedBufferSlots) {
                            var pBufferVar = pAttributes[0].getType().getVideoBuffer();
                            this._sAttrBufferDeclCode = pBufferVar.toFinalCode() + ";\n";
                            this._sAttrBufferInitCode = pBufferVar._getVideoBufferInitExpr().toFinalCode() + ";\n";
                            nPreparedBufferSlots++;
                        }
                    }

                    if (iSlot > nPreparedAttributeSlots) {
                        this._sAttrDeclCode += "attribute " + pAttributeContainer.getTypeForShaderAttributeBySemanticIndex(iSemanticIndex).toFinalCode() + " " + sAttrName + ";\n";
                        nPreparedAttributeSlots++;
                    }
                }

                // 3) add afx attributes
                var pAttribute = pAttributeContainer.getAttributeBySemanticIndex(iSemanticIndex);
                var pAttributeType = pAttribute.getType();

                this._sAFXAttrDeclCode += pAttribute.toFinalCode() + ";\n";

                if (pAttributeType.isStrictPointer() || (pAttributeType.isPointer() && iBufferSlot >= 0)) {
                    var pAttrSubDecls = pAttribute.getSubVarDecls();

                    for (var j = 0; j < pAttrSubDecls.length; j++) {
                        this._sAFXAttrDeclCode += pAttrSubDecls[j].toFinalCode() + ";\n";
                    }
                }

                if (iSlot >= 0) {
                    if (iBufferSlot >= 0) {
                        this._sAFXAttrInitCode += pAttributeType._getMainPointer().getRealName() + "=" + sAttrName + ";";
                        this._sAFXAttrInitCode += pAttribute._getAttrExtractionBlock().toFinalCode();
                    } else {
                        this._sAFXAttrInitCode += pAttribute.getRealName() + "=" + sAttrName + ";";
                    }
                }
            }
        };

        PassBlend.prototype.generateSystemExtBlock = function (eType) {
            var pExtBlock = null;

            if (eType === 0 /* k_Vertex */) {
                pExtBlock = this._pExtSystemDataV;
                if (this._sSystemExtBlockCodeV !== "") {
                    return this._sSystemExtBlockCodeV;
                }
            } else {
                pExtBlock = this._pExtSystemDataP;
                if (this._sSystemExtBlockCodeP !== "") {
                    return this._sSystemExtBlockCodeP;
                }
            }

            var sCode = "";

            var pMacroses = pExtBlock.macroses;
            var pTypes = pExtBlock.types;
            var pFunctions = pExtBlock.functions;

            for (var i = 0; i < pMacroses.length; i++) {
                sCode += pMacroses[i].toFinalCode() + "\n";
            }

            for (var i = 0; i < pTypes.length; i++) {
                sCode += pTypes[i].toFinalCode() + "\n";
            }

            for (var i = 0; i < pFunctions.length; i++) {
                sCode += pFunctions[i].toFinalCode() + "\n";
            }

            if (eType === 0 /* k_Vertex */) {
                this._sSystemExtBlockCodeV = sCode;
            } else {
                sCode = "#define AKRA_FRAGMENT 1\n" + "#ifdef GL_ES\nprecision highp float;\n#endif\n" + "#extension GL_OES_standard_derivatives : enable\n";
                sCode;
                this._sSystemExtBlockCodeP = sCode;
            }

            return sCode;
        };

        PassBlend.prototype.generateTypeDels = function (eType) {
            var pTypeBlock = null;

            if (eType === 0 /* k_Vertex */) {
                pTypeBlock = this._pComplexTypeContainerV;
            } else {
                pTypeBlock = this._pComplexTypeContainerP;
            }

            var sCode = "";

            var pKeys = pTypeBlock.keys;
            var pTypes = pTypeBlock.types;

            for (var i = 0; i < pKeys.length; i++) {
                sCode += pTypes[pKeys[i]]._toDeclString() + ";\n";
            }

            return sCode;
        };

        PassBlend.prototype.generateFunctionDefenitions = function (eType) {
            var pFunctions = null;

            if (eType === 0 /* k_Vertex */) {
                pFunctions = this._pUsedFunctionListV;
                if (this._sFunctionDefCodeV !== "") {
                    return this._sFunctionDefCodeV;
                }
            } else {
                pFunctions = this._pUsedFunctionListP;
                if (this._sFunctionDefCodeP !== "") {
                    return this._sFunctionDefCodeP;
                }
            }

            var sCode = "";

            for (var i = 0; i < pFunctions.length; i++) {
                sCode += pFunctions[i].toFinalDefCode() + ";\n";
            }

            if (eType === 0 /* k_Vertex */) {
                this._sFunctionDefCodeV = sCode;
            } else {
                this._sFunctionDefCodeP = sCode;
            }

            return sCode;
        };

        PassBlend.prototype.generateSharedVars = function (eType) {
            var pVars = null;

            if (eType === 0 /* k_Vertex */) {
                pVars = this._pSharedContainerV;
                if (this._sSharedVarCodeV !== "") {
                    return this._sSharedVarCodeV;
                }
            } else {
                pVars = this._pSharedContainerP;
                if (this._sSharedVarCodeP !== "") {
                    return this._sSharedVarCodeP;
                }
            }

            var sCode = "";
            var pVarInfoList = pVars.varsInfo;

            for (var i = 0; i < pVarInfoList.length; i++) {
                sCode += pVars.getDeclCodeForVar(i, true) + ";\n";
            }

            if (eType === 0 /* k_Vertex */) {
                this._sSharedVarCodeV = sCode;
            } else {
                this._sSharedVarCodeP = sCode;
            }

            return sCode;
        };

        PassBlend.prototype.generateVertexOut = function () {
            if (this._sVertexOutDeclCode === "") {
                this._sVertexOutDeclCode = this._pVertexOutType._toDeclString() + " Out;\n";
            }

            return this._sVertexOutDeclCode;
        };

        PassBlend.prototype.generateVaryings = function (eType) {
            var pVars = null;

            if (eType === 0 /* k_Vertex */) {
                pVars = this._pVaryingContainerV;

                if (this._sVaryingDeclCodeV !== "") {
                    return this._sVaryingDeclCodeV;
                }
            } else {
                pVars = this._pVaryingContainerP;
                if (this._sVaryingDeclCodeP !== "") {
                    return this._sVaryingDeclCodeP;
                }
            }

            var sCode = "";
            var pVarInfoList = pVars.varsInfo;

            for (var i = 0; i < pVarInfoList.length; i++) {
                sCode += "varying " + pVars.getDeclCodeForVar(i, false) + ";\n";
            }

            if (eType === 0 /* k_Vertex */) {
                this._sVaryingDeclCodeV = sCode;
            } else {
                this._sVaryingDeclCodeP = sCode;
            }

            return sCode;
        };

        PassBlend.prototype.generateUniformSamplers = function (eType) {
            if (eType === 0 /* k_Vertex */) {
                return this._sUniformSamplerCodeV;
            } else {
                return this._sUniformSamplerCodeP;
            }
        };

        PassBlend.prototype.generateUniformVars = function (eType) {
            var pVars = null;

            if (eType === 0 /* k_Vertex */) {
                pVars = this._pUniformContainerV;
            } else {
                pVars = this._pUniformContainerP;
            }

            var sCode = "";
            var pVarInfoList = pVars.varsInfo;

            for (var i = 0; i < pVarInfoList.length; i++) {
                var pVar = pVars.getVariable(i);
                var pType = pVars.getBlendType(i);

                if (pType.isSampler() && (!pType.isArray() || pVar.isDefinedByZero() || pVar._isCollapsed())) {
                    continue;
                }

                sCode += "uniform " + pVars.getDeclCodeForVar(i, false) + ";\n";
            }

            return sCode;
        };

        PassBlend.prototype.generateAttrBuffers = function () {
            return this._sAttrBufferDeclCode;
        };

        PassBlend.prototype.generateGlobalVars = function (eType) {
            var pVars = null;

            if (eType === 0 /* k_Vertex */) {
                pVars = this._pGlobalContainerV;
            } else {
                pVars = this._pGlobalContainerP;
            }

            var sCode = "";
            var pVarInfoList = pVars.varsInfo;

            for (var i = 0; i < pVarInfoList.length; i++) {
                sCode += pVars.getDeclCodeForVar(i, true) + ";\n";
            }

            return sCode;
        };

        PassBlend.prototype.generateFunctions = function (eType) {
            var pFunctions = null;

            if (eType === 0 /* k_Vertex */) {
                pFunctions = this._pUsedFunctionListV;
            } else {
                pFunctions = this._pUsedFunctionListP;
            }

            var sCode = "";

            for (var i = 0; i < pFunctions.length; i++) {
                sCode += pFunctions[i].toFinalCode() + "\n";
            }

            return sCode;
        };

        PassBlend.prototype.generatePassFunctions = function (eType) {
            var pFunctions = null;

            if (eType === 0 /* k_Vertex */) {
                pFunctions = this._pPassFunctionListV;
            } else {
                pFunctions = this._pPassFunctionListP;
            }

            var sCode = "";

            for (var i = 0; i < pFunctions.length; i++) {
                sCode += pFunctions[i].toFinalCode() + "\n";
            }

            return sCode;
        };

        PassBlend.prototype.generateRealAttrs = function () {
            return this._sAttrDeclCode;
        };

        PassBlend.prototype.generateAFXAttrs = function () {
            return this._sAFXAttrDeclCode;
        };

        PassBlend.prototype.generateAttrBufferInit = function () {
            return this._sAttrBufferInitCode;
        };

        PassBlend.prototype.generateAFXAttrInit = function () {
            return this._sAFXAttrInitCode;
        };

        PassBlend.prototype.generateTexcoordSwap = function () {
            return this._pTexcoordSwapper.getTmpDeclCode() + "\n" + this._pTexcoordSwapper.getTecoordSwapCode();
        };

        PassBlend.prototype.generatePassFunctionCall = function (eType) {
            var pFunctions = null;

            if (eType === 0 /* k_Vertex */) {
                pFunctions = this._pPassFunctionListV;
                if (this._sPassFunctionCallCodeV !== "") {
                    return this._sPassFunctionCallCodeV;
                }
            } else {
                pFunctions = this._pPassFunctionListP;
                if (this._sPassFunctionCallCodeP !== "") {
                    return this._sPassFunctionCallCodeP;
                }
            }

            var sCode = "";

            for (var i = 0; i < pFunctions.length; i++) {
                sCode += pFunctions[i].getRealName() + "();\n";
            }

            if (eType === 0 /* k_Vertex */) {
                this._sPassFunctionCallCodeV = sCode;
            } else {
                this._sPassFunctionCallCodeP = sCode;
            }

            return sCode;
        };

        PassBlend.prototype.generateVertexOutToVaryings = function () {
            if (this._sVertexOutToVaryingCode !== "") {
                return this._sVertexOutToVaryingCode;
            }

            var pVars = this._pVaryingContainerV;
            var pVarInfoList = pVars.varsInfo;
            var sCode = "";

            sCode += "gl_Position=Out.POSITION;\ngl_PointSize=Out.PSIZE;\n";
            for (var i = 0; i < pVarInfoList.length; i++) {
                var sName = pVarInfoList[i].name;
                if (sName !== "POSITION" && sName !== "PSIZE") {
                    sCode += "V_" + sName + "=" + "Out." + sName + ";\n";
                }
            }

            this._sVertexOutToVaryingCode = sCode;
            return this._sVertexOutToVaryingCode;
        };

        PassBlend.prototype.prepareFastObjects = function () {
            this.prepareFastSamplers(0 /* k_Vertex */);
            this.prepareFastSamplers(1 /* k_Pixel */);
        };

        PassBlend.prototype.prepareFastSamplers = function (eType) {
            if (isNull(this._pSamplerByIdMap)) {
                this._pSamplerByIdMap = {};
                this._pSamplerIdList = [];

                this._pSamplerArrayByIdMap = {};
                this._pSamplerArrayIdList = [];
            }

            var pContainer = eType === 0 /* k_Vertex */ ? this._pUniformContainerV : this._pUniformContainerP;
            var pVarInfoList = pContainer.varsInfo;

            for (var i = 0; i < pVarInfoList.length; i++) {
                var pVar = pContainer.getVariable(i);

                if (pVar.getType().isSampler()) {
                    var id = pVar._getInstructionID();

                    if (!pVar.getType().isArray() && !isDef(this._pSamplerByIdMap[id])) {
                        this._pSamplerByIdMap[id] = pVar;
                        this._pSamplerIdList.push(id);
                    } else if (pVar.getType().isArray() && !isDef(this._pSamplerArrayByIdMap[id])) {
                        this._pSamplerArrayByIdMap[id] = pVar;
                        this._pSamplerArrayIdList.push(id);
                    }
                }
            }
        };
        PassBlend.texcoordSwapper = null;
        PassBlend.hashMinifier = null;
        return PassBlend;
    })();

    
    return PassBlend;
});
//# sourceMappingURL=PassBlend.js.map
