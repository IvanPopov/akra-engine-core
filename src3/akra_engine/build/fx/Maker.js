/// <reference path="../idl/AIAFXMaker.ts" />
/// <reference path="../idl/AIAFXComposer.ts" />
/// <reference path="../idl/AIResourcePoolManager.ts" />
/// <reference path="../idl/AIShaderInput.ts" />
/// <reference path="../idl/AIShaderProgram.ts" />
define(["require", "exports", "logger", "render", "debug", "fx/Instruction", "fx/VariableContainer", "util/ObjectArray", "fx/SamplerBlender"], function(require, exports, __logger__, __render__, __debug__, __Instruction__, __VariableContainer__, __ObjectArray__, __SamplerBlender__) {
    
    
    var logger = __logger__;
    var render = __render__;
    var debug = __debug__;
    

    var Instruction = __Instruction__;
    var VariableContainer = __VariableContainer__;

    var ObjectArray = __ObjectArray__;
    var SamplerBlender = __SamplerBlender__;

    var Vec2 = math.Vec2;
    var Vec3 = math.Vec3;
    var Vec4 = math.Vec4;
    var Mat3 = math.Mat3;
    var Mat4 = math.Mat4;

    function createShaderUniformInfo(sName, iLocation, pWebGLLocation) {
        if (typeof pWebGLLocation === "undefined") { pWebGLLocation = null; }
        return {
            name: sName,
            location: iLocation,
            webGLLocation: pWebGLLocation,
            type: 0 /* k_NotVar */,
            length: 0,
            applyFunction: null,
            defaultValue: null
        };
    }

    function createShaderAttrInfo(sName, iLocation) {
        return {
            name: sName,
            location: iLocation,
            semantic: "",
            isMappable: false,
            isComplex: false,
            vertexTextureInfo: null,
            offsets: null
        };
    }

    function createShaderAttrOffsetInfo(sSemantic, pShaderUniformInfo, fDefault) {
        return {
            semantic: sSemantic,
            shaderVarInfo: pShaderUniformInfo,
            defaultValue: fDefault
        };
    }

    function createInputUniformInfo(sName, iNameIndex, pShaderUniformInfo, isComplex) {
        return {
            name: sName,
            nameIndex: iNameIndex,
            isComplex: isComplex,
            isCollapsedArray: false,
            shaderVarInfo: pShaderUniformInfo,
            structVarInfo: null
        };
    }

    // function createUniformStructFieldInfo(sName: string, sShaderName: string,
    // 							  eType: AEAFXShaderVariableType, iLength: uint): AIUniformStructInfo {
    // 	return <AIUniformStructInfo>{
    // 		name: sName,
    // 		shaderName: sShaderName,
    // 		type: eType,
    // 		length: iLength
    // 	};
    // }
    function createUniformStructFieldInfo(sName, isComplex, isArray) {
        return {
            name: sName,
            isComplex: isComplex,
            isArray: isArray,
            index: -1,
            fields: null,
            shaderVarInfo: null
        };
    }

    var Maker = (function () {
        function Maker(pComposer, pPassBlend) {
            //UNIQUE();
            this._pComposer = null;
            this._pPassBlend = null;
            this._pShaderProgram = null;
            this._pRealUniformNameList = null;
            this._pRealAttrNameList = null;
            // is really exists uniform & attr?
            this._pUniformExistMap = {};
            this._pAttrExistMap = {};
            this._isUsedZero2D = false;
            this._isUsedZeroCube = false;
            // private _pAttrContainer: AttributeBlendContainer = null;
            //стек объектов храняих все юниформы и аттрибуты
            this._pDataPoolArray = new ObjectArray();
            this._pShaderUniformInfoMap = null;
            this._pShaderAttrInfoMap = null;
            this._pShaderUniformInfoList = null;
            this._pShaderAttrInfoList = null;
            this._pInputUniformInfoList = null;
            this._pInputSamplerInfoList = null;
            this._pInputSamplerArrayInfoList = null;
            this._pUnifromInfoForStructFieldMap = null;
            //if(has("PROFILE_MAKE")) {
            this._pMakeTime = [0., 0., 0., 0., 0.];
            this._iCount = 0;
            this._pComposer = pComposer;
            this._pPassBlend = pPassBlend;
        }
        Maker.prototype.isArray = function (sName) {
            return this.getLength(sName) > 0;
        };

        Maker.prototype.getType = function (sName) {
            return this._pShaderUniformInfoMap[sName].type;
        };

        Maker.prototype.getLength = function (sName) {
            return this._pShaderUniformInfoMap[sName].length;
        };

        Object.defineProperty(Maker.prototype, "shaderProgram", {
            get: function () {
                return this._pShaderProgram;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Maker.prototype, "attributeInfo", {
            get: function () {
                return this._pShaderAttrInfoList;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Maker.prototype, "uniformNames", {
            get: function () {
                return this._pRealUniformNameList;
            },
            enumerable: true,
            configurable: true
        });

        Maker.prototype._create = function (sVertex, sPixel) {
            var pRmgr = this._pComposer.getEngine().getResourceManager();

            // logger.log(this, sVertex, sPixel);
            var pProgram = pRmgr.createShaderProgram(".shader-prorgam-" + this.getGuid().toString());

            if (!pProgram.create(sVertex, sPixel)) {
                return false;
            }

            this._pRealUniformNameList = pProgram._getActiveUniformNames();
            this._pRealAttrNameList = pProgram._getActiveAttributeNames();

            this._pShaderUniformInfoList = new Array(this._pRealUniformNameList.length);
            this._pShaderAttrInfoList = new Array(this._pRealAttrNameList.length);

            this._pShaderUniformInfoMap = {};
            this._pShaderAttrInfoMap = {};

            this._pShaderProgram = pProgram;

            for (var i = 0; i < this._pRealUniformNameList.length; i++) {
                var sUniformName = this._pRealUniformNameList[i];
                var pUniformInfo;

                if (has("WEBGL")) {
                    pUniformInfo = createShaderUniformInfo(sUniformName, i, (pProgram).getWebGLUniformLocation(sUniformName));
                } else {
                    pUniformInfo = createShaderUniformInfo(sUniformName, i);
                }

                this._pUniformExistMap[sUniformName] = true;
                this._pShaderUniformInfoList[i] = pUniformInfo;
                this._pShaderUniformInfoMap[sUniformName] = pUniformInfo;
            }

            for (var i = 0; i < this._pRealAttrNameList.length; i++) {
                var sAttrName = this._pRealAttrNameList[i];
                var pAttrInfo = createShaderAttrInfo(sAttrName, i);

                this._pAttrExistMap[sAttrName] = true;
                this._pShaderAttrInfoList[i] = pAttrInfo;
                this._pShaderAttrInfoMap[sAttrName] = pAttrInfo;
            }

            this._pUnifromInfoForStructFieldMap = {};

            this["sVertex"] = sVertex;
            this["sPixel"] = sPixel;

            // logger.log(sVertex, sPixel);
            return true;
        };

        Maker.prototype._getShaderInput = function () {
            return this._pDataPoolArray.length > 0 ? this._pDataPoolArray.pop() : this._createDataPool();
        };

        Maker.prototype._releaseShaderInput = function (pPool) {
            this._pDataPoolArray.push(pPool);
        };

        Maker.prototype.isUniformExists = function (sName) {
            return this._pUniformExistMap[sName] ? true : this._pUniformExistMap[sName] = false;
        };

        Maker.prototype.isAttrExists = function (sName) {
            return this._pAttrExistMap[sName] ? true : this._pAttrExistMap[sName] = false;
        };

        Maker.prototype._createDataPool = function () {
            var pInput = {
                uniforms: {},
                attrs: {},
                renderStates: render.createRenderStateMap()
            };

            for (var i = 0; i < this._pShaderUniformInfoList.length; i++) {
                var pUniformInfo = this._pShaderUniformInfoList[i];

                pInput.uniforms[i] = null;

                if ((pUniformInfo.type === 18 /* k_Sampler2D */ || pUniformInfo.type === 19 /* k_SamplerCUBE */)) {
                    if (pUniformInfo.length > 0) {
                        pInput.uniforms[i] = new Array(pUniformInfo.length);

                        for (var j = 0; j < pUniformInfo.length; j++) {
                            pInput.uniforms[i][j] = render.createSamplerState();
                        }
                    } else {
                        pInput.uniforms[i] = render.createSamplerState();
                    }
                }
            }

            for (var i = 0; i < this._pShaderAttrInfoList.length; i++) {
                pInput.attrs[i] = null;
            }

            return pInput;
        };

        Maker.prototype.setUniform = function (iLocation, pValue) {
            if (this._pShaderUniformInfoList[iLocation].type !== 0 /* k_NotVar */) {
                if (has("WEBGL")) {
                    this._pShaderUniformInfoList[iLocation].applyFunction.call(this._pShaderProgram, this._pShaderUniformInfoList[iLocation].webGLLocation, pValue || this._pShaderUniformInfoList[iLocation].defaultValue);
                } else {
                    this._pShaderUniformInfoList[iLocation].applyFunction.call(this._pShaderProgram, this._pShaderUniformInfoList[iLocation].name, pValue || this._pShaderUniformInfoList[iLocation].defaultValue);
                }
            }
        };

        Maker.prototype._initInput = function (pPassInput, pBlend, pAttrs) {
            /* Initialize info about uniform variables(not samplers and video buffers) */
            var pUniformKeys = pPassInput.uniformKeys;
            this._pInputUniformInfoList = [];

            for (var i = 0; i < pUniformKeys.length; i++) {
                var iNameIndex = pUniformKeys[i];
                var sName = pPassInput._getUniformVarNameByIndex(iNameIndex);
                var eType = pPassInput._getUniformType(iNameIndex);
                var iLength = pPassInput._getUniformLength(iNameIndex);
                var isArray = (iLength > 0);

                var pInputUniformInfo = null;

                if (eType === 22 /* k_Complex */) {
                    var pStructInfo = this.expandStructUniforms(pPassInput._getUniformVar(iNameIndex));
                    if (!isNull(pStructInfo)) {
                        pInputUniformInfo = createInputUniformInfo(sName, iNameIndex, null, true);
                        pInputUniformInfo.structVarInfo = pStructInfo;
                        this._pInputUniformInfoList.push(pInputUniformInfo);
                    }
                } else {
                    var sShaderName = isArray ? (sName + "[0]") : sName;

                    if (!this.isUniformExists(sShaderName)) {
                        continue;
                    }

                    var pShaderUniformInfo = this._pShaderUniformInfoMap[sShaderName];

                    pShaderUniformInfo.type = eType;
                    pShaderUniformInfo.length = iLength;

                    pInputUniformInfo = createInputUniformInfo(sName, iNameIndex, pShaderUniformInfo, false);
                    this._pInputUniformInfoList.push(pInputUniformInfo);
                }
            }

            /* Initialize info about samplers*/
            var iTotalSamplerSlots = pBlend.totalActiveSlots;
            this._pInputSamplerInfoList = [];

            for (var i = 0; i < iTotalSamplerSlots; i++) {
                var pShaderUniformInfo = null;
                var pInputUniformInfo = null;

                if (i === SamplerBlender.ZERO_SLOT) {
                    this._isUsedZero2D = this.isUniformExists("as0");
                    this._isUsedZeroCube = this.isUniformExists("asc0");

                    if (this._isUsedZero2D) {
                        pShaderUniformInfo = this._pShaderUniformInfoMap["as0"];

                        pShaderUniformInfo.type = 4 /* k_Int */;
                        pShaderUniformInfo.length = 0;
                    }

                    if (this._isUsedZeroCube) {
                        pShaderUniformInfo = this._pShaderUniformInfoMap["asc0"];

                        pShaderUniformInfo.type = 4 /* k_Int */;
                        pShaderUniformInfo.length = 0;
                    }

                    continue;
                }

                var sRealSamplerName = "as" + i.toString();

                if (!this.isUniformExists(sRealSamplerName)) {
                    continue;
                }

                var pSampler = pBlend.getSamplersBySlot(i).value(0);
                var sSampler = pSampler.getSemantic() || pSampler.getName();
                var iNameIndex = pPassInput._getUniformVarNameIndex(sSampler);
                var eType = pSampler.getType().isSampler2D() ? 18 /* k_Sampler2D */ : 19 /* k_SamplerCUBE */;

                pShaderUniformInfo = this._pShaderUniformInfoMap[sRealSamplerName];

                pShaderUniformInfo.type = eType;
                pShaderUniformInfo.length = 0;

                pInputUniformInfo = createInputUniformInfo(sSampler, iNameIndex, pShaderUniformInfo, false);
                pInputUniformInfo.isCollapsedArray = (pSampler.getType().getLength() > 0);

                this._pInputSamplerInfoList.push(pInputUniformInfo);
            }

            /* Initialize info about array of samplers */
            var pSamplerArrayKeys = pPassInput.samplerArrayKeys;
            this._pInputSamplerArrayInfoList = [];

            for (var i = 0; i < pSamplerArrayKeys.length; i++) {
                var iNameIndex = pSamplerArrayKeys[i];
                var sName = pPassInput._getUniformVarNameByIndex(iNameIndex);
                var eType = pPassInput._getUniformType(iNameIndex);
                var iLength = pPassInput._getUniformLength(iNameIndex);
                var sShaderName = sName + "[0]";
                var pInputUniformInfo = null;

                if (!this.isUniformExists(sShaderName)) {
                    continue;
                }

                var pShaderUniformInfo = this._pShaderUniformInfoMap[sShaderName];

                pShaderUniformInfo.type = eType;
                pShaderUniformInfo.length = iLength;

                pInputUniformInfo = createInputUniformInfo(sName, iNameIndex, pShaderUniformInfo, false);

                this._pInputSamplerArrayInfoList.push(pInputUniformInfo);
            }

            var pAttrInfoList = pAttrs.attrsInfo;

            var nPreparedAttrs = -1;
            var nPreparedBuffers = -1;

            for (var i = 0; i < pAttrInfoList.length; i++) {
                var iSemanticIndex = i;
                var pAttrInfo = pAttrInfoList[iSemanticIndex];
                var sSemantic = pAttrInfo.name;
                var iSlot = pAttrs.getSlotBySemanticIndex(iSemanticIndex);

                if (iSlot === -1) {
                    continue;
                }

                var iBufferSlot = pAttrs.getBufferSlotBySemanticIndex(iSemanticIndex);

                if (iSlot > nPreparedAttrs) {
                    var sAttrName = "aa" + iSlot.toString();
                    var sBufferName = "abs" + iBufferSlot.toString();

                    if (!this.isAttrExists(sAttrName)) {
                        continue;
                    }

                    var pShaderAttrInfo = this._pShaderAttrInfoMap[sAttrName];
                    var isMappable = iBufferSlot >= 0;
                    var pVertexTextureInfo = isMappable ? this._pShaderUniformInfoMap[sBufferName] : null;
                    var isComplex = pAttrs.getTypeBySemanticIndex(iSemanticIndex).isComplex();

                    if (iBufferSlot > nPreparedBuffers) {
                        if (!this.isUniformExists(sBufferName)) {
                            debug.error("This erroer must not be happen");
                            continue;
                        }

                        pVertexTextureInfo.type = 20 /* k_SamplerVertexTexture */;
                        pVertexTextureInfo.length = 0;
                    }

                    pShaderAttrInfo.semantic = sSemantic;
                    pShaderAttrInfo.isMappable = isMappable;
                    pShaderAttrInfo.isComplex = isComplex;
                    pShaderAttrInfo.vertexTextureInfo = pVertexTextureInfo;

                    nPreparedAttrs++;
                }

                //add offset uniforms
                var pOffsetVars = pAttrs.getOffsetVarsBySemantic(sSemantic);

                if (!isNull(pOffsetVars)) {
                    var pShaderAttrInfo = this._pShaderAttrInfoList[iSlot];
                    var pOffsetInfoList = pShaderAttrInfo.offsets || new Array();

                    for (var j = 0; j < pOffsetVars.length; j++) {
                        var sOffsetSemantic = pOffsetVars[j].getSemantic();
                        var sOffsetName = pOffsetVars[j].getRealName();

                        if (this.isUniformExists(sOffsetName)) {
                            var pOffsetUniformInfo = this._pShaderUniformInfoMap[sOffsetName];
                            var fDefaultValue = pAttrs.getOffsetDefault(sOffsetName);

                            pOffsetUniformInfo.type = 3 /* k_Float */;
                            pOffsetUniformInfo.length = 0;

                            pOffsetInfoList.push(createShaderAttrOffsetInfo(sOffsetSemantic, pOffsetUniformInfo, fDefaultValue));
                        }
                    }

                    pShaderAttrInfo.offsets = pOffsetInfoList;
                }
            }

            for (var i = 0; i < this._pShaderUniformInfoList.length; i++) {
                this.prepareApplyFunctionForUniform(this._pShaderUniformInfoList[i]);
            }

            return true;
        };

        //}
        Maker.prototype._make = function (pPassInput, pBufferMap) {
            if (has("PROFILE_MAKE")) {
                var tStartTime = (window).performance.now();
                var tEndTime = 0.;
            }

            var pUniforms = pPassInput.uniforms;
            var pTextures = pPassInput.textures;
            var pSamplers = pPassInput.samplers;
            var pPassInputRenderStates = pPassInput.renderStates;
            var pSamplerArrays = pPassInput.samplerArrays;

            var pInput = this._getShaderInput();

            for (var i = 0; i < this._pInputUniformInfoList.length; i++) {
                var pInfo = this._pInputUniformInfoList[i];

                if (pInfo.isComplex) {
                    this.applyStructUniform(pInfo.structVarInfo, pUniforms[pInfo.nameIndex], pInput);
                } else {
                    pInput.uniforms[pInfo.shaderVarInfo.location] = pUniforms[pInfo.nameIndex];
                }
            }

            if (has("PROFILE_MAKE")) {
                tEndTime = (window).performance.now();
                this._pMakeTime[0] += tEndTime - tStartTime;
                tStartTime = tEndTime;
            }

            for (var i = 0; i < this._pInputSamplerInfoList.length; i++) {
                var pInfo = this._pInputSamplerInfoList[i];

                var pState = null;
                var pTexture = null;

                if (pInfo.isCollapsedArray) {
                    pState = pSamplerArrays[pInfo.nameIndex][0];
                } else {
                    pState = pPassInput._getSamplerState(pInfo.nameIndex);
                }

                pTexture = pPassInput._getTextureForSamplerState(pState);

                this.setSamplerState(pInput.uniforms[pInfo.shaderVarInfo.location], pTexture, pState);
            }

            if (has("PROFILE_MAKE")) {
                tEndTime = (window).performance.now();
                this._pMakeTime[1] += tEndTime - tStartTime;
                tStartTime = tEndTime;
            }

            for (var i = 0; i < this._pInputSamplerArrayInfoList.length; i++) {
                var pInfo = this._pInputSamplerArrayInfoList[i];

                var pSamplerStates = pSamplerArrays[pInfo.nameIndex];
                var pInputStates = pInput.uniforms[pInfo.shaderVarInfo.location];

                for (var j = 0; j < pInfo.shaderVarInfo.length; j++) {
                    var pTexture = pPassInput._getTextureForSamplerState(pSamplerStates[j]);
                    this.setSamplerState(pInputStates[j], pTexture, pSamplerStates[j]);
                }
            }

            if (has("PROFILE_MAKE")) {
                tEndTime = (window).performance.now();
                this._pMakeTime[2] += tEndTime - tStartTime;
                tStartTime = tEndTime;
            }

            for (var i = 0; i < this._pShaderAttrInfoList.length; i++) {
                var pAttrInfo = this._pShaderAttrInfoList[i];
                var pFlow = pAttrInfo.isComplex ? pBufferMap.findFlow(pAttrInfo.semantic) || pBufferMap.getFlowBySemantic(pAttrInfo.semantic) : pBufferMap.getFlowBySemantic(pAttrInfo.semantic);

                // pBufferMap.findFlow(pAttrInfo.semantic) || pBufferMap.getFlow(pAttrInfo.semantic, true):
                // pBufferMap.getFlow(pAttrInfo.semantic, true);
                pInput.attrs[pAttrInfo.location] = pFlow;

                if (pAttrInfo.isMappable) {
                    pInput.uniforms[pAttrInfo.vertexTextureInfo.location] = pFlow.data.buffer;

                    if (!isNull(pAttrInfo.offsets)) {
                        var pVertexDecl = pFlow.data.getVertexDeclaration();

                        for (var j = 0; j < pAttrInfo.offsets.length; j++) {
                            var pOffsetInfo = pAttrInfo.offsets[j];
                            var pElement = pVertexDecl.findElement(pOffsetInfo.semantic);

                            if (isNull(pElement)) {
                                pInput.uniforms[pOffsetInfo.shaderVarInfo.location] = pOffsetInfo.defaultValue;
                            } else {
                                pInput.uniforms[pOffsetInfo.shaderVarInfo.location] = pElement.offset / 4.;
                            }
                        }
                    }
                }
            }

            if (has("PROFILE_MAKE")) {
                tEndTime = (window).performance.now();
                this._pMakeTime[3] += tEndTime - tStartTime;
                tStartTime = tEndTime;
            }

            if (this._isUsedZero2D) {
                pInput.uniforms[this._pShaderUniformInfoMap["as0"].location] = 19;
            }

            if (this._isUsedZeroCube) {
                pInput.uniforms[this._pShaderUniformInfoMap["asc0"].location] = 19;
            }

            render.mergeRenderStateMap(pPassInputRenderStates, this._pPassBlend._getRenderStates(), pInput.renderStates);

            if (has("PROFILE_MAKE")) {
                tEndTime = (window).performance.now();
                this._pMakeTime[4] += tEndTime - tStartTime;
                tStartTime = tEndTime;

                if (this._iCount % (100 * 300) === 0) {
                    logger.log("----------------");
                    logger.log("uniforms: ", this._pMakeTime[0]);
                    logger.log("samplers: ", this._pMakeTime[1]);
                    logger.log("sampler arrays: ", this._pMakeTime[2]);
                    logger.log("attrs: ", this._pMakeTime[3]);
                    logger.log("states: ", this._pMakeTime[4]);
                    logger.log("----------------");
                    this._pMakeTime[0] = 0.;
                    this._pMakeTime[1] = 0.;
                    this._pMakeTime[2] = 0.;
                    this._pMakeTime[3] = 0.;
                    this._pMakeTime[4] = 0.;
                    this._iCount = 0;
                }

                this._iCount++;
            }
            return pInput;
        };

        Maker.prototype.prepareApplyFunctionForUniform = function (pUniform) {
            if (pUniform.type !== 0 /* k_NotVar */) {
                pUniform.applyFunction = this.getUniformApplyFunction(pUniform.type, (pUniform.length > 0));
                pUniform.defaultValue = this.getUnifromDefaultValue(pUniform.type, (pUniform.length > 0));
            }
        };

        Maker.prototype.getUniformApplyFunction = function (eType, isArray) {
            if (has("WEBGL")) {
                var pProgram = this._pShaderProgram;
                if (isArray) {
                    switch (eType) {
                        case 3 /* k_Float */:
                            return pProgram._setFloat32Array;
                        case 4 /* k_Int */:
                            return pProgram._setInt32Array;
                        case 5 /* k_Bool */:
                            return pProgram._setInt32Array;

                        case 6 /* k_Float2 */:
                            return pProgram._setVec2Array;
                        case 7 /* k_Int2 */:
                            return pProgram._setVec2iArray;

                        case 9 /* k_Float3 */:
                            return pProgram._setVec3Array;
                        case 10 /* k_Int3 */:
                            return pProgram._setVec3iArray;

                        case 12 /* k_Float4 */:
                            return pProgram._setVec4Array;
                        case 13 /* k_Int4 */:
                            return pProgram._setVec4iArray;

                        case 16 /* k_Float3x3 */:
                            return pProgram._setMat3Array;
                        case 17 /* k_Float4x4 */:
                            return pProgram._setMat4Array;

                        case 18 /* k_Sampler2D */:
                            return pProgram._setSamplerArray;
                        case 19 /* k_SamplerCUBE */:
                            return pProgram._setSamplerArray;
                        default:
                            logger.critical("Wrong uniform array type (" + eType + ")");
                    }
                } else {
                    switch (eType) {
                        case 3 /* k_Float */:
                            return pProgram._setFloat;
                        case 4 /* k_Int */:
                            return pProgram._setInt;
                        case 5 /* k_Bool */:
                            return pProgram._setInt;

                        case 6 /* k_Float2 */:
                            return pProgram._setVec2;
                        case 7 /* k_Int2 */:
                            return pProgram._setVec2i;

                        case 9 /* k_Float3 */:
                            return pProgram._setVec3;
                        case 10 /* k_Int3 */:
                            return pProgram._setVec3i;

                        case 12 /* k_Float4 */:
                            return pProgram._setVec4;
                        case 13 /* k_Int4 */:
                            return pProgram._setVec4i;

                        case 16 /* k_Float3x3 */:
                            return pProgram._setMat3;
                        case 17 /* k_Float4x4 */:
                            return pProgram._setMat4;

                        case 18 /* k_Sampler2D */:
                            return pProgram._setSampler;
                        case 19 /* k_SamplerCUBE */:
                            return pProgram._setSampler;
                        case 20 /* k_SamplerVertexTexture */:
                            return pProgram._setVertexBuffer;
                        default:
                            logger.critical("Wrong uniform type (" + eType + ")");
                    }
                }
            } else {
                if (isArray) {
                    switch (eType) {
                        case 3 /* k_Float */:
                            return this._pShaderProgram.setFloat32Array;
                        case 4 /* k_Int */:
                            return this._pShaderProgram.setInt32Array;

                        case 6 /* k_Float2 */:
                            return this._pShaderProgram.setVec2Array;
                        case 7 /* k_Int2 */:
                            return this._pShaderProgram.setVec2iArray;

                        case 9 /* k_Float3 */:
                            return this._pShaderProgram.setVec3Array;
                        case 10 /* k_Int3 */:
                            return this._pShaderProgram.setVec3iArray;

                        case 12 /* k_Float4 */:
                            return this._pShaderProgram.setVec4Array;
                        case 13 /* k_Int4 */:
                            return this._pShaderProgram.setVec4iArray;

                        case 16 /* k_Float3x3 */:
                            return this._pShaderProgram.setMat3Array;
                        case 17 /* k_Float4x4 */:
                            return this._pShaderProgram.setMat4Array;

                        case 18 /* k_Sampler2D */:
                            return this._pShaderProgram.setSamplerArray;
                        case 19 /* k_SamplerCUBE */:
                            return this._pShaderProgram.setSamplerArray;
                        default:
                            logger.critical("Wrong uniform array type (" + eType + ")");
                    }
                } else {
                    switch (eType) {
                        case 3 /* k_Float */:
                            return this._pShaderProgram.setFloat;
                        case 4 /* k_Int */:
                            return this._pShaderProgram.setInt;
                        case 5 /* k_Bool */:
                            return this._pShaderProgram.setInt;

                        case 6 /* k_Float2 */:
                            return this._pShaderProgram.setVec2;
                        case 7 /* k_Int2 */:
                            return this._pShaderProgram.setVec2i;

                        case 9 /* k_Float3 */:
                            return this._pShaderProgram.setVec3;
                        case 10 /* k_Int3 */:
                            return this._pShaderProgram.setVec3i;

                        case 12 /* k_Float4 */:
                            return this._pShaderProgram.setVec4;
                        case 13 /* k_Int4 */:
                            return this._pShaderProgram.setVec4i;

                        case 16 /* k_Float3x3 */:
                            return this._pShaderProgram.setMat3;
                        case 17 /* k_Float4x4 */:
                            return this._pShaderProgram.setMat4;

                        case 18 /* k_Sampler2D */:
                            return this._pShaderProgram.setSampler;
                        case 19 /* k_SamplerCUBE */:
                            return this._pShaderProgram.setSampler;
                        case 20 /* k_SamplerVertexTexture */:
                            return this._pShaderProgram.setVertexBuffer;
                        default:
                            logger.critical("Wrong uniform type (" + eType + ")");
                    }
                }
            }
        };

        Maker.prototype.getUnifromDefaultValue = function (eType, isArray) {
            if (isArray) {
                return null;
            } else {
                switch (eType) {
                    case 3 /* k_Float */:
                        return 0.;
                    case 4 /* k_Int */:
                        return 0;
                    case 5 /* k_Bool */:
                        return 0;

                    case 6 /* k_Float2 */:
                        return new Vec2(0);
                    case 7 /* k_Int2 */:
                        return new Vec2(0);
                    case 8 /* k_Bool2 */:
                        return new Vec2(0);

                    case 9 /* k_Float3 */:
                        return new Vec3(0);
                    case 10 /* k_Int3 */:
                        return new Vec3(0);
                    case 11 /* k_Bool3 */:
                        return new Vec3(0);

                    case 12 /* k_Float4 */:
                        return new Vec4(0);
                    case 13 /* k_Int4 */:
                        return new Vec4(0);
                    case 14 /* k_Bool4 */:
                        return new Vec4(0);

                    case 16 /* k_Float3x3 */:
                        return new Mat3(0);
                    case 17 /* k_Float4x4 */:
                        return new Mat4(0);

                    case 18 /* k_Sampler2D */:
                        return null;
                    case 19 /* k_SamplerCUBE */:
                        return null;
                    case 20 /* k_SamplerVertexTexture */:
                        return null;
                    default:
                        logger.critical("Wrong uniform type (" + eType + ")");
                }
            }
        };

        Maker.prototype.setSamplerState = function (pOut, pTexture, pFrom) {
            pOut.texture = pTexture;
            pOut.wrap_s = pFrom.wrap_s;
            pOut.wrap_t = pFrom.wrap_t;
            pOut.mag_filter = pFrom.mag_filter;
            pOut.min_filter = pFrom.min_filter;
        };

        Maker.prototype.expandStructUniforms = function (pVariable, sPrevName) {
            if (typeof sPrevName === "undefined") { sPrevName = ""; }
            var sRealName = pVariable.getRealName();

            if (sPrevName !== "") {
                sPrevName += "." + sRealName;
            } else {
                if (!this._pPassBlend._hasUniformWithName(sRealName)) {
                    return null;
                }

                sPrevName = sRealName;
            }

            var pVarType = pVariable.getType();
            var pFieldNameList = pVarType.getFieldNameList();
            var isArray = pVarType.isNotBaseArray();
            var iLength = isArray ? pVarType.getLength() : 1;

            if (isArray && (iLength === Instruction.UNDEFINE_LENGTH || iLength === 0)) {
                logger.warn("Length of struct '" + sRealName + "' can not be undefined");
                return null;
            }

            var pStructInfo = createUniformStructFieldInfo(sRealName, true, isArray);
            pStructInfo.fields = new Array();

            var sFieldPrevName = "";
            var pFieldInfoList = null;

            for (var i = 0; i < iLength; i++) {
                if (isArray) {
                    pFieldInfoList = new Array();
                    sFieldPrevName = sPrevName + "[" + i + "]";
                } else {
                    pFieldInfoList = pStructInfo.fields;
                    sFieldPrevName = sPrevName;
                }

                for (var j = 0; j < pFieldNameList.length; j++) {
                    var sFieldName = pFieldNameList[j];
                    var pField = pVarType.getField(sFieldName);
                    var pFieldInfo = null;

                    if (pField.getType().isComplex()) {
                        pFieldInfo = this.expandStructUniforms(pField, sFieldPrevName);
                    } else {
                        var sFieldRealName = sFieldPrevName + "." + pField.getRealName();
                        var eFieldType = VariableContainer.getVariableType(pField);
                        var iFieldLength = pField.getType().getLength();
                        var isFieldArray = pField.getType().isNotBaseArray();
                        var sFieldShaderName = sFieldRealName;

                        if (isFieldArray) {
                            sFieldShaderName += "[0]";
                        }

                        if (!this.isUniformExists(sFieldShaderName)) {
                            continue;
                        }

                        var pShaderUniformInfo = this._pShaderUniformInfoMap[sFieldShaderName];
                        pShaderUniformInfo.type = eFieldType;
                        pShaderUniformInfo.length = iFieldLength;

                        pFieldInfo = createUniformStructFieldInfo(pField.getRealName(), false, isFieldArray);
                        pFieldInfo.shaderVarInfo = pShaderUniformInfo;
                    }

                    if (!isNull(pFieldInfo)) {
                        pFieldInfoList.push(pFieldInfo);
                    }
                }

                if (isArray && pFieldInfoList.length > 0) {
                    var pArrayElementInfo = createUniformStructFieldInfo(sRealName, true, false);
                    pArrayElementInfo.index = i;
                    pArrayElementInfo.fields = pFieldInfoList;

                    pStructInfo.fields.push(pArrayElementInfo);
                }
            }

            if (pStructInfo.fields.length > 0) {
                return pStructInfo;
            } else {
                return null;
            }
        };

        Maker.prototype.applyStructUniform = function (pStructInfo, pValue, pInput) {
            if (!isDefAndNotNull(pValue)) {
                return;
            }

            if (pStructInfo.isArray) {
                for (var i = 0; i < pStructInfo.fields.length; i++) {
                    var pFieldInfo = pStructInfo.fields[i];
                    if (isDef(pValue[pFieldInfo.index])) {
                        this.applyStructUniform(pFieldInfo, pValue[pFieldInfo.index], pInput);
                    }
                }
            } else {
                for (var i = 0; i < pStructInfo.fields.length; i++) {
                    var pFieldInfo = pStructInfo.fields[i];
                    var pFieldValue = pValue[pFieldInfo.name];

                    if (isDef(pFieldValue)) {
                        if (pFieldInfo.isComplex) {
                            this.applyStructUniform(pFieldInfo, pFieldValue, pInput);
                        } else {
                            pInput.uniforms[pFieldInfo.shaderVarInfo.location] = pFieldValue;
                        }
                    }
                }
            }
        };

        Maker.prototype.applyUnifromArray = function (sName, eType, pValue) {
            switch (eType) {
                case 3 /* k_Float */:
                    this._pShaderProgram.setFloat32Array(sName, pValue);
                    break;
                case 4 /* k_Int */:
                    this._pShaderProgram.setInt32Array(sName, pValue);
                    break;

                case 6 /* k_Float2 */:
                    this._pShaderProgram.setVec2Array(sName, pValue);
                    break;
                case 7 /* k_Int2 */:
                    this._pShaderProgram.setVec2iArray(sName, pValue);
                    break;

                case 9 /* k_Float3 */:
                    this._pShaderProgram.setVec3Array(sName, pValue);
                    break;
                case 10 /* k_Int3 */:
                    this._pShaderProgram.setVec3iArray(sName, pValue);
                    break;

                case 12 /* k_Float4 */:
                    this._pShaderProgram.setVec4Array(sName, pValue);
                    break;
                case 13 /* k_Int4 */:
                    this._pShaderProgram.setVec4iArray(sName, pValue);
                    break;

                case 16 /* k_Float3x3 */:
                    this._pShaderProgram.setMat3Array(sName, pValue);
                    break;
                case 17 /* k_Float4x4 */:
                    this._pShaderProgram.setMat4Array(sName, pValue);
                    break;

                case 18 /* k_Sampler2D */:
                    this._pShaderProgram.setSamplerArray(sName, pValue);
                    break;
                case 19 /* k_SamplerCUBE */:
                    this._pShaderProgram.setSamplerArray(sName, pValue);
                    break;

                default:
                    logger.critical("Wrong uniform array type (" + eType + ") with name " + sName);
            }
        };

        Maker.prototype.applyUniform = function (sName, eType, pValue) {
            switch (eType) {
                case 3 /* k_Float */:
                    this._pShaderProgram.setFloat(sName, pValue || 0.);
                    break;
                case 4 /* k_Int */:
                    this._pShaderProgram.setInt(sName, pValue || 0);
                    break;
                case 5 /* k_Bool */:
                    this._pShaderProgram.setInt(sName, pValue ? 1 : 0);
                    break;

                case 6 /* k_Float2 */:
                    this._pShaderProgram.setVec2(sName, pValue || Vec2.temp(0));
                    break;
                case 7 /* k_Int2 */:
                    this._pShaderProgram.setVec2i(sName, pValue || Vec2.temp(0));
                    break;

                case 9 /* k_Float3 */:
                    this._pShaderProgram.setVec3(sName, pValue || Vec3.temp(0));
                    break;
                case 10 /* k_Int3 */:
                    this._pShaderProgram.setVec3i(sName, pValue || Vec3.temp(0));
                    break;

                case 12 /* k_Float4 */:
                    this._pShaderProgram.setVec4(sName, pValue || Vec4.temp(0));
                    break;
                case 13 /* k_Int4 */:
                    this._pShaderProgram.setVec4i(sName, pValue || Vec4.temp(0));
                    break;

                case 16 /* k_Float3x3 */:
                    this._pShaderProgram.setMat3(sName, pValue || Mat3.temp(0));
                    break;
                case 17 /* k_Float4x4 */:
                    this._pShaderProgram.setMat4(sName, pValue || Mat4.temp(0));
                    break;

                case 18 /* k_Sampler2D */:
                    this._pShaderProgram.setSampler(sName, pValue);
                    break;
                case 19 /* k_SamplerCUBE */:
                    this._pShaderProgram.setSampler(sName, pValue);
                    break;
                case 20 /* k_SamplerVertexTexture */:
                    this._pShaderProgram.setVertexBuffer(sName, pValue);
                    break;
                default:
                    logger.critical("Wrong uniform type (" + eType + ") with name " + sName);
            }
        };
        return Maker;
    })();

    
    return Maker;
});
//# sourceMappingURL=Maker.js.map
