/**
 * @file
 * @author sss
 * @email <sss@odserve.org>
 */
function Component(pEngine) {
    A_CLASS;
    this._pEngine = pEngine;
    this._pManager = pEngine.pShaderManager || null;
    this.sName = null;
    this.pTechnique = null;
    this.pPasses = [];
    this.pPassesNames = {};
    this.isPostEffect = false;
    this.pAnnotation = null;
    this.sName = "";
    this.sComponents = null;
    this.pComponents = null;
    this.pComponentsShift = null;
    this.pComponentsHash = null;
    this.pExteranalsFragment = null;
    this.pExteranalsVertex = null;
}
a.extend(Component, a.ResourcePoolItem);
/**
 * innitialize the resource (called once)
 * @treturn Boolean always true
 */
Component.prototype.createResource = function () {
    this._pManager.registerComponent(this);
    this.notifyCreated();
    this.notifyDisabled();
    this.notifyLoaded();
    return true;
};

/**
 * destroy the resource
 * @treturn Boolean always true
 */
Component.prototype.destroyResource = function () {
    //safe_release(this._pEffect);
    if (this.isResourceCreated()) {
        // disable the resource
        this.disableResource();
        //remove all data
        this.notifyUnloaded();
        this.notifyDestroyed();
        return (true);
    }
    return (false);
};

/**
 * purge the resource from volatile memory
 * @treturn Boolean always true
 */
Component.prototype.disableResource = function () {
//    if (this._pEffect != null) {
//        this._pEffect.onLostDevice();
//    }
    debug_assert(this.isResourceCreated(),
                 "The resource has not been created.");

    this.notifyDisabled();
    return true;
};
/**
 *
 * @param sFileName
 * @return {Boolean}
 */
Component.prototype.saveResource = function (sFileName) {
    return true;
};

/**
 * prepare the resource for use (create any volatile memory objects needed)
 * @treturn Boolean always true
 */
Component.prototype.restoreResource = function () {
    //if (this._pEffect != null)
    //    this._pEffect.onResetDevice();
    debug_assert(this.isResourceCreated(),
                 "The resource has not been created.");

    this.notifyRestored();
    return true;
};

/**
 * load the resource from a file
 * @tparam String sFileName - path to file with resource
 * @tparam String sTechnique - technique name                 S
 * @treturn Boolean true if succeeded, otherwise false
 */
Component.prototype.loadResource = function (sFileName) {
    this.notifyUnloaded();
    TODO('Загрузка эффект ресурса');

    //TODO notifyLoaded
    return true;
};

Component.prototype.create = function (pTechnique) {
    if (!this._pManager.registerComponent(this)) {
        return false;
    }
    this.sName = pTechnique.sName;
//    this.pTechnique = pTechnique;
    this.pPasses = pTechnique.pPasses;
    this.pPassesNames = pTechnique.pPassesNames;
    this.isPostEffect = pTechnique.isPostEffect;
    this.pAnnotation = pTechnique.pAnnotation;
    this.sComponents = pTechnique.sComponents;
    this.pComponents = pTechnique.pComponents;
    this.pComponentsShift = pTechnique.pComponentsShift;
    this.pExteranalsFragment = pTechnique.pExteranalsFragment;
    this.pExteranalsVertex = pTechnique.pExteranalsVertex;
    return true;
};

Component.prototype.hash = function (pProp) {
    return this.sName + ">>>" + (pProp.nShift || 0);
};
Component.prototype.totalPasses = function () {
    return this.pPasses.length;
};
A_NAMESPACE(Component, fx);

Define(a.ComponentManager(pEngine), function () {
    a.ResourcePool(pEngine, a.fx.Component)
});

function ComponentBlend() {
    this.pPassBlends = null;
    this.pUniformsBlend = null;
    this.sHash = "";
    this.pComponentsHash = {};
    this.pComponentsCount = {};
    this.pComponentsShift = [];
    this.pComponents = [];
    this._pMaps = null;
    this._isReady = false;
    this._id = 0;
    this._nShiftMin = 0;
    this._nShiftMax = 0;
    this._nShiftCurrent = 0;
    this._nTotalValidPasses = -1;
    this._hasTextures = false;
    STATIC(fnAddUniform, function (pVar, pUniforms, pPass, sPrevName, sPrevRealName) {
        var sName, pVar1, sRealName;
        sName = (sPrevName ? (sPrevName + "." + pVar.sName) : pVar.sName);
        sRealName = (sPrevRealName ? (sPrevRealName + "." + pVar.sRealName) : pVar.sRealName);
        pVar1 = pUniforms.pUniformsByRealName[sRealName];
        if (pVar1 && !pVar1.pType.isEqual(pVar.pType)) {
            warning("You used uniforms with the same semantics. Now we work not very well with that.");
            return false;
        }
        if (pVar.pType.isBase()) {
            pUniforms.pUniformsByName[sName] = sRealName;
            pUniforms.pUniformsByRealName[sRealName] = pVar;
            pUniforms.pUniformsDefault[sRealName] = pPass.pGlobalsDefault[sRealName] || null;
        }
        else {
            var pOrders = pVar.pType.pEffectType.pDesc.pOrders;
            for (var i = 0; i < pOrders.length; i++) {
                ComponentBlend.fnAddUniform(pOrders[i], pUniforms, pPass, sName, sRealName);
            }
            pUniforms.pUniformsByName[sName] = sRealName;
            pUniforms.pUniformsByRealName[sRealName] = pVar;
            pUniforms.pUniformsDefault[sRealName] = pPass.pGlobalsDefault[sRealName] || null;
        }
        return true;
    });
}
ComponentBlend.prototype.hasTextures = function () {
    return this._hasTextures;
};
ComponentBlend.prototype.addComponent = function (pComponent, nShift) {
    //TODO: think about global uniform lists and about collisions of real names in them
    var i, j;
    var sName;
    sName = pComponent.hash(nShift);
    if (this.pComponentsHash[sName]) {
        this.pComponentsCount[sName]++;
        warning("You try to add already used component in blend");
        return;
    }
    if (nShift < this._nShiftMin) {
        this._nShiftMin = nShift;
    }
    else if (nShift > this._nShiftMax) {
        this._nShiftMax = nShift;
    }
    this.sHash += sName + ":";
    this.pComponentsHash[sName] = pComponent;
    this.pComponentsCount[sName] = 1;
    this.pComponents.push(pComponent);
    this.pComponentsShift.push(nShift);
    this._isReady = false;
};
ComponentBlend.prototype.addBlend = function (pBlend, nShift) {
    var i;
    var pNewBlend;
    pNewBlend = this.cloneMe();
    pNewBlend._nShiftCurrent = nShift > 0 ? nShift : 0;
    pNewBlend._nTotalValidPasses = pBlend.totalValidPasses();
    for (i = 0; i < pBlend.pComponents.length; i++) {
        pNewBlend.addComponent(pBlend.pComponents[i], pBlend.pComponentsShift[i] + nShift);
    }
    return pNewBlend;
};
ComponentBlend.prototype.finalize = function () {
    if (this._isReady) {
        return true;
    }
    var i, j, k;
    var pComponent;
    var nShift;
    var pPass;
    var pUniforms;
    var pVar1, pVar2;
    var sName;
    this.pPassBlends = [];
    this.pUniformsBlend = [];

    for (j = 0; j < this.pComponents.length; j++) {
        pComponent = this.pComponents[j];
        nShift = this.pComponentsShift[j] - this._nShiftMin;

        for (i = 0; i < pComponent.pPasses.length; i++) {
            if (!this.pPassBlends[i + nShift]) {
                this.pPassBlends[i + nShift] = [];
                this.pUniformsBlend[i + nShift] = {
                    "pUniformsByName"     : {},
                    "pUniformsByRealName" : {},
                    "pUniformsDefault"    : {},
                    "pTexturesByName"     : {},
                    "pTexturesByRealName" : {}
                };
            }
            pPass = pComponent.pPasses[i];
            this.pPassBlends[i + nShift].push(pPass);
            pUniforms = this.pUniformsBlend[i + nShift];
            for (k in pPass.pTexturesByName) {
                sName = pUniforms.pTexturesByName[k] = pPass.pTexturesByName[k];
                pUniforms.pTexturesByRealName[sName] = null;
                this._hasTextures = true;
            }

            for (k in pPass.pGlobalsByName) {
                ComponentBlend.fnAddUniform(pPass.pGlobalsByRealName[pPass.pGlobalsByName[k]], pUniforms, pPass);
            }
        }
    }
    for (i in this.pUniformsBlend) {
        pUniforms = this.pUniformsBlend[i];
        if (!pUniforms._hasKeys) {
            pUniforms._hasKeys = true;
            pUniforms._pUniformByNameKeys = Object.keys(pUniforms.pUniformsByName);
            pUniforms._pTextureByNameKeys = Object.keys(pUniforms.pTexturesByName);
            pUniforms._pTextureByRealNameKeys = Object.keys(pUniforms.pTexturesByRealName);
            pUniforms._pUniformByRealNameKeys = Object.keys(pUniforms.pUniformsByRealName);
        }
    }
    this._isReady = true;
//    this._pMaps = new Array(this.pPassBlends[i]);

    return true;
};
ComponentBlend.prototype.cloneMe = function () {
    var pClone = new a.fx.ComponentBlend();
    var i;
    for (i = 0; i < this.pComponents.length; i++) {
        pClone.pComponents[i] = this.pComponents[i];
        pClone.pComponentsShift[i] = this.pComponentsShift[i];
    }
    for (i in this.pComponentsHash) {
        pClone.pComponentsHash[i] = this.pComponentsHash[i];
        pClone.pComponentsCount[i] = this.pComponentsCount[i];
    }
    pClone.sHash = this.sHash;
    pClone._nShiftMin = this._nShiftMin;
    pClone._nShiftMax = this._nShiftMax;
    pClone._nShiftCurrent = this._nShiftCurrent;
    pClone._nTotalValidPasses = this._nTotalValidPasses;
    return pClone;
};
ComponentBlend.prototype.hasComponent = function (sComponent) {
    return !!(this.pComponentsHash[sComponent]);
};
ComponentBlend.prototype.isReady = function () {
    return this._isReady;
};
ComponentBlend.prototype.totalPasses = function () {
    return this.pPassBlends ? this.pPassBlends.length : 0;
};
ComponentBlend.prototype.totalValidPasses = function () {
    return this._nTotalValidPasses > 0 ? this._nTotalValidPasses : this.totalPasses();
};
A_NAMESPACE(ComponentBlend, fx);

function PassBlend(pEngine) {
    this._pEngine = pEngine;
    this.sHash = "";
    this._id = null;
    this.pPasses = [];
    this.pVertexShaders = [];
    this.pFragmentShaders = [];
    this.pStates = {};

    this.pTypesBlockV = {};
    this.pTypesOrderV = [];
    this.pUniformsV = {};
    this.pUniformsBlockV = {};
    this.pMixedTypesV = {};
    this.pFuncDefBlockV = {};
    this.pGlobalVarBlockV = {};
    this.pFuncDeclBlockV = {};
    this.pAttributes = {};
    /**
     * Block of:
     * varying TYPE some_variable;
     * @type {Object}
     */
    this.pVaryingsDef = {};
    /**
     * Block of:
     * some_variable = OUT.some_variable;
     * @type {Object}
     */
    this.pVaryingsBlock = {};
    this.pVaryings = {};
    this.sVaryingsOut = "";

    this.pAttributePointers = {};

    this.pTypesBlockF = {};
    this.pTypesOrderF = [];
    this.pUniformsF = {};
    this.pUniformsBlockF = {};
    this.pMixedTypesF = {};
    this.pFuncDefBlockF = {};
    this.pGlobalVarBlockF = {};
    this.pFuncDeclBlockF = {};

    this.pGlobalBuffers = {};
    this.pGlobalBuffersV = {};
    this.pGlobalBuffersF = {};
    this.pAttrBuffers = {};
    this.pSamplers = {};
    this.pSamplersV = {};
    this.pSamplersF = {};

    this._pSamplersToReal = {};
    this._pBuffersToReal = {};

    this._pRealSamplersDecl = null;
    this._pRealBuffesDecl = null;
    this._pRealBuffesInit = null;
    this._pRealAttrDecl = null;

    this._pRealSamplersUsage = new Array(30);
    this._initSystemData();


    this.pExtrectedFunctionsV = {};
    this.pExtrectedFunctionsF = {};

    this.pUniforms = {};

    this._pBlendTypes = {};
    this._pBlendTypesDecl = {};
    this._nBlendTypes = 1;
    STATIC(pExtractedFunctions, {
        "header" : "void A_extractTextureHeader(const sampler2D src, out A_TextureHeader texture) {" +
                   "vec4 v = texture2D(src, vec2(0.)); " +
                   "texture = A_TextureHeader(v.r, v.g, v.b, v.a);}\n",
        "float"  : "float A_extractFloat(const sampler2D sampler, const A_TextureHeader header, const float offset) {" +
                   "float pixelNumber = floor(offset / A_VB_ELEMENT_SIZE); " +
                   "float y = floor(pixelNumber / header.width) + .5; " +
                   "float x = mod(pixelNumber, header.width) + .5; " +
                   "int shift = int(mod(offset, A_VB_ELEMENT_SIZE)); " +
                   "\n#ifdef A_VB_COMPONENT4\n" +
                   "if(shift == 0) return A_tex2D(sampler, header, x, y).r; " +
                   "else if(shift == 1) return A_tex2D(sampler, header, x, y).g; " +
                   "else if(shift == 2) return A_tex2D(sampler, header, x, y).b; " +
                   "else if(shift == 3) return A_tex2D(sampler, header, x, y).a; " +
                   "\n#endif\n" +
                   "return 0.;}\n",
        "vec2"   : "vec2 A_extractVec2(const sampler2D sampler, const A_TextureHeader header, const float offset){" +
                   "float pixelNumber = floor(offset / A_VB_ELEMENT_SIZE); " +
                   "float y = floor(pixelNumber / header.width) + .5; " +
                   "float x = mod(pixelNumber, header.width) + .5; " +
                   "int shift = int(mod(offset, A_VB_ELEMENT_SIZE)); " +
                   "\n#ifdef A_VB_COMPONENT4\n" +
                   "if(shift == 0) return A_tex2D(sampler, header, x, y).rg; " +
                   "else if(shift == 1) return A_tex2D(sampler, header, x, y).gb; " +
                   "else if(shift == 2) return A_tex2D(sampler, header, x, y).ba; " +
                   "else if(shift == 3) { " +
                   "if(int(x) == int(header.width - 1.)) " +
                   "return vec2(A_tex2D(sampler, header, x, y).a, A_tex2D(sampler, header, 0., (y + 1.)).r); " +
                   "else " +
                   "return vec2(A_tex2D(sampler, header, x, y).a, A_tex2D(sampler, header, (x + 1.), y).r); " +
                   "} " +
                   "\n#endif\n" +
                   "return vec2(0.); }\n",
        "vec3"   : "vec3 A_extractVec3(const sampler2D sampler, const A_TextureHeader header, const float offset){" +
                   "float pixelNumber = floor(offset / A_VB_ELEMENT_SIZE); " +
                   "float y = floor(pixelNumber / header.width) + .5; " +
                   "float x = mod(pixelNumber, header.width) + .5; " +
                   "int shift = int(mod(offset, A_VB_ELEMENT_SIZE)); " +
                   "\n#ifdef A_VB_COMPONENT4\n" +
                   "if(shift == 0) return A_tex2D(sampler, header, x, y).rgb; " +
                   "else if(shift == 1) return A_tex2D(sampler, header, x, y).gba; " +
                   "else if(shift == 2){ " +
                   "if(int(x) == int(header.width - 1.))  return vec3(A_tex2D(sampler, header, x, y).ba, A_tex2D(sampler, header, 0., (y + 1.)).r); " +
                   "else return vec3(A_tex2D(sampler, header, x, y).ba, A_tex2D(sampler, header, (x + 1.), y).r);} " +
                   "else if(shift == 3){ " +
                   "if(int(x) == int(header.width - 1.))  return vec3(A_tex2D(sampler, header, x, y).a, A_tex2D(sampler, header, 0., (y + 1.)).rg); " +
                   "else return vec3(A_tex2D(sampler, header, x, y).a, A_tex2D(sampler, header, (x + 1.), y).rg);} " +
                   "\n#endif\n" +
                   "\n#ifdef A_VB_COMPONENT3\n" +
                   "if(shift == 0) return A_tex2D(sampler, header,vec2(x,header.stepY*y)).rgb; " +
                   "else if(shift == 1){ " +
                   "if(x == header.width - 1.) return vec3(A_tex2D(sampler, header, x, y).gb, A_tex2D(sampler, header, 0., (y + 1.)).r); " +
                   "else return vec3(A_tex2D(sampler, header, x, y).gb, A_tex2D(sampler, header, (x + 1.), y).r);} " +
                   "else if(shift == 3){ " +
                   "if(x == header.width - 1.) return vec3(A_tex2D(sampler, header, x, y).b, A_tex2D(sampler, header, 0., (y + 1.)).rg); " +
                   "else return vec3(A_tex2D(sampler, header, x, y).b, A_tex2D(sampler, header, (x + 1)., y).rg);} " +
                   "\n#endif\n" +
                   "return vec3(0);}\n",
        "vec4"   : "vec4 A_extractVec4(const sampler2D sampler, const A_TextureHeader header, const float offset){ " +
                   "float pixelNumber = floor(offset / A_VB_ELEMENT_SIZE); " +
                   "float y = floor(pixelNumber / header.width) + .5; " +
                   "float x = mod(pixelNumber, header.width) + .5; " +
                   "int shift = int(mod(offset, A_VB_ELEMENT_SIZE)); " +
                   "\n#ifdef A_VB_COMPONENT4\n" +
                   "if(shift == 0) return A_tex2D(sampler, header, x, y); " +
                   "else if(shift == 1){ " +
                   "if(int(x) == int(header.width - 1.)) " +
                   "return vec4(A_tex2D(sampler, header, x, y).gba, A_tex2D(sampler, header, 0., (y + 1.)).r); " +
                   "else " +
                   "return vec4(A_tex2D(sampler, header, x, y).gba, A_tex2D(sampler, header, (x + 1.), y).r);} " +
                   "else if(shift == 2){ " +
                   "if(int(x) == int(header.width - 1.)) " +
                   "return vec4(A_tex2D(sampler, header, x, y).ba, A_tex2D(sampler, header, 0., (y + 1.)).rg); " +
                   "else " +
                   "return vec4(A_tex2D(sampler, header, x, y).ba, A_tex2D(sampler, header, (x + 1.), y).rg);} " +
                   "else if(shift == 3){ " +
                   "if(int(x) == int(header.width - 1.)) " +
                   "return vec4(A_tex2D(sampler, header, x, y).a, A_tex2D(sampler, header, 0., (y + 1.)).rgb); " +
                   "else return vec4(A_tex2D(sampler, header, x, y).a, A_tex2D(sampler, header, (x + 1.), y).rgb);} " +
                   "\n#endif\n" +
                   "\n#ifdef A_VB_COMPONENT3\n" +
                   "\n#endif\n" +
                   "return vec4(0);}\n",
        "mat4"   : "vec2 A_findPixel(const A_TextureHeader header, const float offset) {" +
                   "float pixelNumber = floor(offset / A_VB_ELEMENT_SIZE); " +
                   "return vec2(header.stepX * (mod(pixelNumber, header.width) + .5), header.stepY * (floor(pixelNumber / header.width) + .5));}\n" +
                   "mat4 A_extractMat4(const sampler2D sampler, const A_TextureHeader header, const float offset) {" +
                   "return mat4(A_tex2Dv(sampler, header, A_findPixel(header, offset))," +
                   "A_tex2Dv(sampler, header, A_findPixel(header, offset + 4.))," +
                   "A_tex2Dv(sampler, header, A_findPixel(header, offset + 8.))," +
                   "A_tex2Dv(sampler, header, A_findPixel(header, offset + 12.)));}\n",
        "init"   : "\n#ifdef GL_FRAGMENT_PRECISION_HIGH\n" +
                   "//#define texture2D(sampler, ) texture2D\n" +
                   "#else\n" +
                   "#define texture2D(A, B) texture2DLod(A, B, 0.)\n" +
                   "#endif\n" +
                   "#ifndef A_VB_COMPONENT3\n" +
                   "#define A_VB_COMPONENT4\n" +
                   "#endif\n" +
                   "#ifdef A_VB_COMPONENT4\n" +
                   "#define A_VB_ELEMENT_SIZE 4.\n" +
                   "#endif\n" +
                   "#ifdef A_VB_COMPONENT3\n" +
                   "#define A_VB_ELEMENT_SIZE 3.\n" +
                   "#endif\n" +
                   "#define A_tex2D(S, H, X, Y) texture2D(S, vec2(H.stepX * X , H.stepY * Y))\n" +
                   "#define A_tex2Dv(S, H, V) texture2D(S, V)\n" +
                   "struct A_TextureHeader {\n" +
                   "float width; " +
                   "float height; " +
                   "float stepX; " +
                   "float stepY; " +
                   "};\n"
    });
    STATIC(sZeroSamplerDecl, "uniform sampler2D A_zero_sampler;");
    STATIC(sZeroHeaderDecl, "A_TextureHeader A_zero_header;");
    STATIC(sZeroSampler, "A_zero_sampler");
    STATIC(sZeroHeader, "A_zero_header");
    STATIC(fnAddUniform, function (pVar, me, pShader, isVertex, sPrevRealName) {
        var pVar1;
        var sRealName = (sPrevRealName ? (sPrevRealName + "." + pVar.sRealName) : pVar.sRealName);
        var isEqual;
        var i;
        var pUniforms, pUniformsBlock;
        if (isVertex) {
            pUniforms = me.pUniformsV;
            pUniformsBlock = me.pUniformsBlockV;
        }
        else {
            pUniforms = me.pUniformsF;
            pUniformsBlock = me.pUniformsBlockF;
        }
        pVar1 = pUniforms[sRealName];
        if (pVar1) {
            if (pVar1 instanceof Array) {
                isEqual = false;
                for (i = 0; i < pVar1.length; i++) {
                    if (pVar1[i].pType.isEqual(pVar.pType)) {
                        isEqual = true;
                        break;
                    }
                    if (!pVar1[i].pType.canBlend(pVar.pType)) {
                        warning("Types for blending uniforms must be mixible");
                        return false;
                    }
                }
                if (!isEqual) {
                    pVar1.push(pVar);
                }
            }
            if (!pVar1.pType.isEqual(pVar.pType)) {
                if (!pVar1.pType.canBlend(pVar.pType)) {
                    warning("Types for blending uniforms must be mixible");
                    return false;
                }
                pUniforms[sRealName] = [pVar, pVar1];
                pUniformsBlock[sRealName] = null;
            }
        }
        if (!pVar.pType.isBase()) {
            var pOrders = pVar.pType.pEffectType.pDesc.pOrders;
            for (i = 0; i < pOrders.length; i++) {
                PassBlend.fnAddUniform(pOrders[i], me, pShader, isVertex, sRealName);
            }
        }
        if (!pVar1) {
            pUniforms[sRealName] = pVar;
            if (!sPrevRealName) {
                pUniformsBlock[sRealName] = pShader.pUniformsBlock[sRealName];
            }
        }
        return true;
    });

}

PassBlend.prototype._initSystemData = function () {
    if (PassBlend._pRealSamplersDecl) {
        this._pRealSamplersDecl = PassBlend._pRealSamplersDecl;
        this._pRealBuffesDecl = PassBlend._pRealBuffesDecl;
        this._pRealBuffesInit = PassBlend._pRealBuffesInit;
    }
    var pSamplersDecl = new Array(30);
    var pBufferDecl = new Array(30);
    var pBufferInit = new Array(30);
    var pAttrsDecl = new Array(30);
    var sSampler, sHeader, sAttr;
    for (var i = 0; i < pSamplersDecl.length; i++) {
        sSampler = a.fx.SHADER_PREFIX.SAMPLER + i;
        sHeader = a.fx.SHADER_PREFIX.HEADER + i;
        sAttr = a.fx.SHADER_PREFIX.ATTRIBUTE + i;
        pSamplersDecl[i] = "uniform sampler2D " + sSampler + ";";
        pBufferDecl[i] = "A_TextureHeader " + sHeader + ";";
        pBufferInit[i] = "A_extractTextureHeader(" + sSampler + "," + sHeader + ");";
    }
    this._pRealSamplersDecl = PassBlend._pRealSamplersDecl = pSamplersDecl;
    this._pRealBuffesDecl = PassBlend._pRealBuffesDecl = pBufferDecl;
    this._pRealBuffesInit = PassBlend._pRealBuffesInit = pBufferInit;
};
PassBlend.prototype.init = function (sHash, pBlend) {
    this.sHash = sHash;
    var i;
    for (i = 0; i < pBlend.length; i++) {
        this.addPass(pBlend[i]);
    }
};
PassBlend.prototype.addPass = function (pPass) {
    this.pPasses.push(pPass);
    var pVertex = pPass.pVertexShader;
    var pFragment = pPass.pFragmentShader;
    var i, j;
    var pVar1, pVar2, pType1, pType2;
    var isEqual = false;
    var sName;
    if (pVertex) {
        this.pVertexShaders.push(pVertex);
        for (i in pVertex.pTypesBlock) {
            this.pTypesBlockV[i] = pVertex.pTypesBlock[i];
            pType1 = pVertex.pTypesByName[i];
            if (this.pTypesOrderV.length === 0) {
                this.pTypesOrderV.push(pType1);
                continue;
            }
            isEqual = false;
            for (j = 0; j < this.pTypesOrderV.length; j++) {
                pType2 = this.pTypesOrderV[j];
                if (pType2 === pType1) {
                    isEqual = true;
                    break;
                }
                if (pType2.nOrder > pType1.nOrder) {
                    break;
                }
            }
            if (!isEqual) {
                this.pTypesOrderV.splice(j, 0, pType1);
            }
        }
        for (i in pVertex.pFuncBlock) {
            this.pFuncDefBlockV[i] = i + ";";
            this.pFuncDeclBlockV[i] = pVertex.pFuncBlock[i];
        }
        for (i in pVertex.pGlobalVarBlock) {
            if (this.pGlobalVarBlockV[i]) {
                error("It`s impossible, but some names of global vars are matched");
                return;
            }
            this.pGlobalVarBlockV[i] = pVertex.pGlobalVarBlock[i];
        }
        for (i in pVertex.pUniformsBlock) {
            pVar1 = pVertex.pUniformsByRealName[i];
            if (pVar1.isBuffer()) {
                sName = pVar1.sRealName;
                if (!this.pGlobalBuffers[sName]) {
                    this.pGlobalBuffers[sName] = [];
                }
                this.pGlobalBuffers[sName].push(pVar1.pBuffer);
                this._pBuffersToReal[sName] = null;
                this.pGlobalBuffersV[sName] = null;
                continue;
            }
            else if (pVar1.isSampler()) {
                sName = pVar1.sRealName;
                if (!this.pSamplers[sName]) {
                    this.pSamplers[sName] = [];
                }
                this.pSamplers[sName].push(pVar1);
                this._pSamplersToReal[sName] = null;
                this.pSamplersV[sName] = null;
                continue;
            }
            PassBlend.fnAddUniform(pVar1, this, pVertex, true);
        }
        for (i in pVertex.pAttrBuffers) {
            if (!this.pAttrBuffers[i]) {
                this.pAttrBuffers[i] = [];
            }
            this.pAttrBuffers[i].push(pVertex.pAttrBuffers[i]);
        }
        for (i in pVertex._pExtractFunctions) {
            this.pExtrectedFunctionsV[i] = null;
        }
        for (i in pVertex._pAttrSemantics) {
            pVar1 = pVertex._pAttrSemantics[i];
            pVar2 = this.pAttributes[i];
            if (pVar2) {
//                trace(pVar2, pVar1);
                if (pVar2 instanceof Array) {
                    isEqual = false;
                    for (j = 0; j < pVar2.length; j++) {
                        if (pVar2[j].pType.isStrictEqual(pVar1.pType)) {
                            isEqual = true;
                            break;
                        }
                        if (!pVar2[j].pType.canBlend(pVar1.pType)) {
                            error("Types for blending attributes must be mixible 1");
                            return;
                        }
                    }
                    if (!isEqual) {
                        pVar2.push(pVar1);
                    }
                    continue;
                }
                if (!pVar2.pType.isStrictEqual(pVar1.pType)) {
                    if (!pVar2.pType.canBlend(pVar1.pType)) {
                        error("Types for blending attributes must be mixible 2");
                        return;
                    }
                    this.pAttributes[i] = [pVar1, pVar2];
                }
                continue;
            }
            this.pAttributes[i] = pVar1;
        }
        for (i in pVertex.pAttributePointers) {
            this.pAttributePointers[i] = pVertex.pAttributePointers[i];
        }
        for (i in pVertex._pVaryingsSemantics) {
            pVar1 = pVertex._pVaryingsSemantics[i];
            pVar2 = this.pVaryings[i];
            if (!pVar2) {
                this.pVaryings[i] = pVar1;
                this.pVaryingsDef[i] = "varying " + pVar1.toCodeDecl();
                continue;
            }
            if (!pVar2.pType.isStrictEqual(pVar1.pType)) {
                error("Not equal types for varyings");
                return;
            }
        }
    }

    if (pFragment) {
        this.pFragmentShaders.push(pFragment);
        for (i in pFragment.pTypesBlock) {
            this.pTypesBlockF[i] = pFragment.pTypesBlock[i];
            pType1 = pFragment.pTypesByName[i];
            if (this.pTypesOrderF.length === 0) {
                this.pTypesOrderF.push(pType1);
                continue;
            }
            isEqual = false;
            for (j = 0; j < this.pTypesOrderF.length; j++) {
                pType2 = this.pTypesOrderF[j];
                if (pType2 === pType1) {
                    isEqual = true;
                    break;
                }
                if (pType2.nOrder > pType1.nOrder) {
                    break;
                }
            }
            if (!isEqual) {
                this.pTypesOrderF.splice(j, 0, pType1);
            }
        }
        for (i in pFragment.pFuncBlock) {
            this.pFuncDefBlockF[i] = i + ";";
            this.pFuncDeclBlockF[i] = pFragment.pFuncBlock[i];
        }
        for (i in pFragment.pGlobalVarBlock) {
            if (this.pGlobalVarBlockF[i]) {
                error("It`s impossible, but some names of global vars are matched");
                return;
            }
            this.pGlobalVarBlockF[i] = pFragment.pGlobalVarBlock[i];
        }
        for (i in pFragment.pUniformsBlock) {
            pVar1 = pFragment.pUniformsByRealName[i];
            if (pVar1.isBuffer()) {
                sName = pVar1.sRealName;
                if (!this.pGlobalBuffers[sName]) {
                    this.pGlobalBuffers[sName] = [];
                }
                this.pGlobalBuffers[sName].push(pVar1.pBuffer);
                this._pBuffersToReal[sName] = null;
                this.pGlobalBuffersF[sName] = null;
                continue;
            }
            else if (pVar1.isSampler()) {
                sName = pVar1.sRealName;
                if (!this.pSamplers[sName]) {
                    this.pSamplers[sName] = [];
                }
                this.pSamplers[sName].push(pVar1);
                this._pSamplersToReal[sName] = null;
                this.pSamplersF[sName] = null;
                continue;
            }
            PassBlend.fnAddUniform(pVar1, this, pFragment, false);
        }
        for (i in pFragment._pExtractFunctions) {
            this.pExtrectedFunctionsF[i] = null;
        }
    }

    pPass.clear();
};
PassBlend.prototype.finalizeBlend = function () {
    function fnBlendTypes(pVars, me) {
        var sNewType = "";
        var k, l, m;
        var pType, pVar;
        for (k = 0; k < pVars.length; k++) {
            pType = pVars[i].pType.pEffectType;
            sNewType = pType.sRealName + "|";
        }
        if (me._pBlendTypes[sNewType]) {
            return me._pBlendTypes[sNewType];
        }
        var pFields = {};
        var sFields = "";
        var pTypes = [];
        var pOrders;
        var sTypeName;
        for (k = 0; k < pVars.length; k++) {
            pType = pVars[k].pType.pEffectType.pDesc;
            pOrders = pType.pDesc.pOrders;
            for (l = 0; l < pOrders.length; l++) {
                if (pFields[pOrders[l].sRealName]) {
                    continue;
                }
                if (pOrders[i].isBase()) {
                    pFields[pOrders[l].sRealName] = pOrders[l].toCodeDecl();
                    continue;
                }
                pTypes.length = 0;
                pTypes.push(pOrders[l]);
                for (m = k + 1; m < pVars.length; m++) {
                    pVar = pVars[m].pType.pEffectType.pDesc._pSemantics(pOrders[l].sSemantic);
                    pTypes.push(pVar);
                }
                sTypeName = fnBlendTypes(pTypes, me);
                pFields[pOrders[l].sRealName] = sTypeName + " " + pOrders[l].sRealName + ";";
            }
        }
        sTypeName = "AUTO_BLEND_TYPE_" + me._nBlendTypes;
        me._nBlendTypes++;
        me._pBlendTypes[sNewType] = sTypeName;
        for (k in pFields) {
            sFields += pFields[k];
        }
        me._pBlendTypesDecl[sNewType] = "struct " + sTypeName + "{" + sFields + "};";
        return sTypeName;
    }

    var i;
    var sType;
    var pAttr;
    for (i in this.pUniformsV) {
        if (this.pUniformsBlockV[i] === null) {
            sType = fnBlendTypes(this.pUniformsV[i], this);
            this.pUniformsBlockV[i] = "uniform " + sType + " " + this.pUniformsV[i][0].sRealName + ";";
        }
        if (this.pUniformsV[i].pType.isBase()) {
            this.pUniforms[i] = this.pUniformsV[i];
        }
    }
    for (i in this.pSamplers) {
        this.pUniforms[i] = this.pSamplers[i][0];
    }
    for (i in this.pGlobalBuffers) {
        this.pUniforms[i] = this.pGlobalBuffers[i][0];
    }
    for (i in this.pUniformsF) {
        if (this.pUniformsBlockF[i] === null) {
            sType = fnBlendTypes(this.pUniformsF[i], this);
            this.pUniformsBlockF[i] = "uniform " + sType + " " + this.pUniformsF[i][0].sRealName + ";";
        }
        if (this.pUniformsF[i].pType.isBase()) {
            this.pUniforms[i] = this.pUniformsF[i];
        }
    }
    for (i in this.pAttributes) {
        pAttr = this.pAttributes[i];
        if (pAttr instanceof Array) {
            sType = fnBlendTypes(pAttr, this);
            this.pAttributes[i] = "attribute " + sType + " " + pAttr[0].sRealName + ";";
        }
    }
    this.sVaryingsOut = "struct { vec4 POSITION;";

    for (i in this.pVaryings) {
        this.sVaryingsOut += this.pVaryings[i].pType.pEffectType.toCode() + " " + this.pVaryings[i].sSemantic + ";";
        this.pVaryingsBlock[i] = this.pVaryings[i].sRealName + "=" + a.fx.GLOBAL_VARS.SHADEROUT + "." + i + ";";
    }
    this.pVaryingsBlock["POSITION"] = "gl_Position=" + a.fx.GLOBAL_VARS.SHADEROUT + ".POSITION;";
    this.sVaryingsOut += "} " + a.fx.GLOBAL_VARS.SHADEROUT + ";"

};
PassBlend.prototype.generateProgram = function (sHash, pAttrData, pKeys, pUniformData, pTextures, pTexcoords) {
    //console.log(this);
    var pProgram;
    var pAttrBuf = {};
    var i, j;
    var pAttrToReal = {}, //AttrName ---> Stream number
        pAttrToBuffer = {}; //AttrName ---> Sampler number
    var pRealSamplers = {}; //ResourceID ---> Sampler number
    var pSamplersUsage = this._pRealSamplersUsage;
    var pSamplersToReal = {}, //SamplerName ---> Sampler number
        pBuffersToReal = {};  //BufferName ---> Sampler number
    var iRealSampler,
        nRealSamplers = 0;
    var pAttrDecl = {};
    var pAttrInit = {};
    var pGlobalBufDecl;
    var pRealAttrs,
        pRealBuffers,
        pAttr, pAttr1,
        pPointer,
        pBuffers,
        pBuffer,
        pSampler,
        pTexture,
        sTexture;
    var sKey1, sKey2,
        sInit, sDecl, sAttr, sName1, sName2;
    var sUniformOffset = "";
    var nAttr = 0, nBuffer = 0, iAttr, iBuffer;
    var pData1, pData2, sData1, sData2;
    var isNewBuffer = false;
    var isZeroSamplerV = false;
    var isZeroHeaderV = false;
    var isZeroSamplerF = false;
    var isZeroHeaderF = false;
    var isExtractInitV = false;
    var isExtractInitF = false;
    var pUniformKeys = Object.keys(pUniformData);
    var nSamplers = 0;
    var pTempVarsDecl = {};

    //Samplers and Globals Buffers generated here

    for (i = 0; i < pUniformKeys.length; i++) {
        sKey1 = pUniformKeys[i];
        pData1 = pUniformData[sKey1];

        if (this.pGlobalBuffers[sKey1] !== undefined) {
            if (this.pGlobalBuffersV[sKey1] === null) {
                isExtractInitV = true;
            }
            if (this.pGlobalBuffersF[sKey1] === null) {
                isExtractInitF = true;
            }
            if (pData1 === null) {
                if (isExtractInitV) {
                    isZeroHeaderV = true;
                    isZeroSamplerV = true;
                }
                if (isExtractInitF) {
                    isZeroHeaderF = true;
                    isZeroSamplerF = true;
                }
                sData1 = PassBlend.sZeroSampler;
                sData2 = PassBlend.sZeroHeader;
                pBuffersToReal[sKey1] = null;
            }
            else {
                iRealSampler = pRealSamplers[pData1.toNumber()];
                if (iRealSampler === undefined) {
                    iRealSampler = nRealSamplers;
                    nRealSamplers++;
                    pSamplersUsage[iRealSampler] = 0;
                }
                if (isExtractInitV) {
                    SET_BIT(pSamplersUsage[iRealSampler], 0);
                    SET_BIT(pSamplersUsage[iRealSampler], 1);
                }
                if (isExtractInitF) {
                    SET_BIT(pSamplersUsage[iRealSampler], 2);
                    SET_BIT(pSamplersUsage[iRealSampler], 3);
                }
                sData1 = a.fx.SHADER_PREFIX.SAMPLER + iRealSampler;
                sData2 = a.fx.SHADER_PREFIX.HEADER + iRealSampler;
                pBuffersToReal[sKey1] = iRealSampler;
            }
            for (j = 0; j < this.pGlobalBuffers[sKey1].length; j++) {
                pBuffer = this.pGlobalBuffers[sKey1][j];
                pBuffer.pSampler.pData = sData1;
                pBuffer.pHeader.pData = sData2;
            }
            continue;
        }

        if (this.pSamplers[sKey1] !== undefined) {
            sTexture = pData1[a.fx.GLOBAL_VARS.TEXTURE];
//            if (typeof(sTexture) === "object") {
//                pTexture = sTexture;
//            }
//            else {
            pTexture = pTextures[sTexture];
//            }
            if (!pTexture) {
                if (this.pSamplersV[sKey1] === null) {
                    isZeroSamplerV = true;
                }
                if (this.pSamplersF[sKey1] === null) {
                    isZeroSamplerF = true;
                }
                sData1 = PassBlend.sZeroSampler;
                pSamplersToReal[sKey1] = null;
            }
            else {
                iRealSampler = pRealSamplers[pTexture.toNumber()];
                if (iRealSampler === undefined) {
                    iRealSampler = nRealSamplers;
                    nRealSamplers++;
                    pSamplersUsage[iRealSampler] = 0;
                }
                if (this.pSamplersV[sKey1] === null) {
                    SET_BIT(pSamplersUsage[iRealSampler], 0);
                }
                if (this.pSamplersF[sKey1] === null) {
                    SET_BIT(pSamplersUsage[iRealSampler], 2);
                }
                sData1 = a.fx.SHADER_PREFIX.SAMPLER + iRealSampler;
                pSamplersToReal[sKey1] = iRealSampler;
            }
            for (j = 0; j < this.pSamplers[sKey1].length; j++) {
                pSampler = this.pSamplers[sKey1][j];
                pSampler._pSamplerData = sData1;
            }
            continue;
        }
    }

    //Attributes analyzed here. Are the from real buffer or video buffer.
    //Generated lists of real attributes by slots and video buffers they used

    for (i = 0; i < pKeys.length; i++) {
        sKey1 = pKeys[i];
        pData1 = pAttrData[sKey1];
        pAttr = this.pAttributes[sKey1];
        if (pData1 === null) {
            continue;
        }
        if (pAttrToReal[sKey1] !== undefined) {
            continue;
        }
        pAttrToReal[sKey1] = nAttr;
        isNewBuffer = false;
        if (pData1.eType !== a.BufferMap.FT_MAPPABLE) {
            if (pAttr.isPointer || !pAttr.pType.isBase()) {
                warning("Bad data in buffers 001");
                return false;
            }
            pAttrInit[nAttr] = sKey1;
            nAttr++;
            continue;
        }
        else if (pAttrToBuffer[sKey1] === undefined) {
            iRealSampler = pRealSamplers[pData1.pData.buffer.toNumber()];
            if (iRealSampler === undefined) {
                iRealSampler = nRealSamplers;
                nRealSamplers++;
                pSamplersUsage[iRealSampler] = 0;
            }
            pAttrToBuffer[sKey1] = iRealSampler;
            SET_BIT(pSamplersUsage[iRealSampler], 0);
            SET_BIT(pSamplersUsage[iRealSampler], 1);
        }
        for (j = i; j < pKeys.length; j++) {
            sKey2 = pKeys[j];
            pData2 = pAttrData[sKey2];
            if (pData2 === null) {
                continue;
            }
            if (pData1 === pData2) {
                pAttrToReal[sKey2] = nAttr;
            }
            if (pData1.eType === a.BufferMap.FT_MAPPABLE && pData2.eType === a.BufferMap.FT_MAPPABLE &&
                pData1.pData._pVertexBuffer === pData2.pData._pVertexBuffer) {
                pAttrToBuffer[sKey2] = pAttrToBuffer[sKey1];
            }
        }
        nAttr++;
    }

    pRealAttrs = new Array(nAttr);

    //Set samplers and headers of video_buffer`s of attributes in code

    for (i = 0; i < pKeys.length; i++) {
        sKey1 = pKeys[i];
        if (pAttrToBuffer[sKey1] !== undefined) {
            pBuffers = this.pAttrBuffers[sKey1];
            sData1 = a.fx.SHADER_PREFIX.SAMPLER + pAttrToBuffer[sKey1];
            sData2 = a.fx.SHADER_PREFIX.HEADER + pAttrToBuffer[sKey1];
            if (!pBuffers) {
                warning("You set data as buffer but the are not so");
                return false;
            }
            for (j = 0; j < pBuffers.length; j++) {
                pBuffers[j].pSampler.pData = sData1;
                pBuffers[j].pHeader.pData = sData2;
            }
        }
    }

    //Generate code for real attributes

    for (i = 0; i < nAttr; i++) {
        sKey1 = pAttrInit[i];
        sAttr = a.fx.SHADER_PREFIX.ATTRIBUTE + i;
        if (sKey1 !== undefined) {
            pAttr = this.pAttributes[sKey1];
            pRealAttrs[i] = "attribute " + pAttr.pType.pEffectType.toCode() + " " + sAttr + ";";
            continue;
        }
        pRealAttrs[i] = "attribute float " + sAttr + ";";
    }

    //Generate declarations and initial expression for variables that used as input data for vertex shader in hlsl

    for (i = 0; i < pKeys.length; i++) {
        sKey1 = pKeys[i];
        pAttr = this.pAttributes[sKey1];
        pData1 = pAttrData[sKey1];
        iAttr = pAttrToReal[sKey1];
        iBuffer = pAttrToBuffer[sKey1];
        sInit = "";
        sDecl = "";
        if (!pData1) {
            sDecl += pAttr.pType.pEffectType.toCode() + " " + pAttr.toCode() + ";";
//            sInit += pAttr.toCode() + "=0.0;";
            if (pAttr.isPointer === true) {
                for (j = 0; pAttr.pPointers && j < pAttr.pPointers.length; j++) {
                    pPointer = pAttr.pPointers[j];
                    sDecl += "float " + pPointer.toCode() + ";";
//                sInit += pPointer.toCode() + "=0.0;";
                }
                isZeroSamplerV = true;
                isZeroHeaderV = true;
                isExtractInitV = true;
                for (j = 0; j < this.pAttrBuffers[sKey1].length; j++) {
                    pBuffer = this.pAttrBuffers[sKey1][j];
                    pBuffer.pSampler.pData = PassBlend.sZeroSampler;
                    pBuffer.pHeader.pData = PassBlend.sZeroHeader;
                }
            }
        }
        else {
            sAttr = a.fx.SHADER_PREFIX.ATTRIBUTE + iAttr;
            if (pData1.eType !== a.BufferMap.FT_MAPPABLE) {
                sDecl = pAttr.pType.pEffectType.toCode() + " " + pAttr.toCode() + ";";
                sInit = pAttr.toCode() + "=" + sAttr + ";";
            }
            else {
                isExtractInitV = true;
                this.pExtrectedFunctionsV["header"] = null;
                sUniformOffset += "uniform float " + pAttr.toOffsetStr() + ";";
                sData1 = a.fx.SHADER_PREFIX.SAMPLER + iBuffer;
                sData2 = a.fx.SHADER_PREFIX.HEADER + iBuffer;

                for (j = pAttr.pPointers.length - 1; j >= 0; j--) {
                    pPointer = pAttr.pPointers[j];
                    sDecl += "float " + pPointer.toCode() + ";";
                    if (j === pAttr.pPointers.length - 1) {
                        sInit += pPointer.toCode() + "=" + sAttr + "+" + pAttr.toOffsetStr() + ";";
                    }
                    else {
                        sInit += pPointer.toCode() + "=A_extractFloat(" + sData1 + "," +
                                 sData2 + "," + pAttr.pPointers[j + 1].toCode() + ");";
                        this.pExtrectedFunctionsV["float"] = null;
                    }
                }
                sDecl += pAttr.pType.pEffectType.toCode() + " " + pAttr.toCode() + ";";
                if (!pAttr.pType.isBase()) {
                    warning("Extracting complex type are no implemented yet");
                    return false;
                }
                sInit += pAttr.toCode() + "=";
                switch (pAttr.pType.pEffectType.toCode()) {
                    case "float":
                        sInit += "A_extractFloat(";
                        break;
                    case "vec2":
                        sInit += "A_extractVec2(";
                        this.pExtrectedFunctionsV["float"] = null;
                        break;
                    case "vec3":
                        sInit += "A_extractVec3(";
                        this.pExtrectedFunctionsV["float"] = null;
                        break;
                    case "vec4":
                        sInit += "A_extractVec4(";
                        this.pExtrectedFunctionsV["float"] = null;
                        break;
                    case "mat4":
                        sInit += "A_extractMat4(";
                        this.pExtrectedFunctionsV["float"] = null;
                        this.pExtrectedFunctionsV["vec4"] = null;
                        break;
                    default:
                        warning("another type are not implemented yet");
                        return false;
                }
                sInit += sData1 + "," + sData2 + "," + pAttr.pPointers[0].toCode() + ");";
                this.pExtrectedFunctionsV[pAttr.pType.pEffectType.toCode()] = null;
            }
        }
        pAttrDecl[sKey1] = sDecl;
        pAttrInit[sKey1] = sInit;
    }

    for (i = 0; i < pTexcoords.length; i++) {
        if (pTexcoords[i] !== undefined && pTexcoords[i] !== null) {
            sName2 = a.fx.SHADER_PREFIX.TEXCOORD + pTexcoords[i];
            if (!pAttrData[sName2]) {
                pTexcoords[i] = 0;
            }
            if (i !== pTexcoords[i]) {
                sName1 = a.fx.SHADER_PREFIX.TEXCOORD + i;
                pAttr = this.pAttributes[sName1];
                if (pAttr) {
                    pTempVarsDecl[sName1] = pAttr.pType.pEffectType.toCode() + " " +
                                            a.fx.SHADER_PREFIX.TEMP + i + "=" + sName1 + ";";
                }
            }
        }
    }

    //Generate final code

    //Translate all objects that was in code(Samplers and Headers) to code
    function fnToFinalCode(pCode) {
        if (typeof(pCode) === "string") {
            return pCode;
        }
        var sCode = "";
        for (var i = 0; i < pCode.length; i++) {
            if (typeof(pCode[i]) === "string") {
                sCode += pCode[i];
            }
            else {
                sCode += pCode[i].toDataCode();
            }
        }
        return sCode;
    }

    var sVertexCode = "";
    var sFragmentCode = "";
    var isExtract;

    //VERTEX SHADER

    nSamplers = a.info.graphics.maxVertexTextureImageUnits(this._pEngine.pDevice);

    //Initial for extract functions
    isExtract = false;
    if (isExtractInitV) {
        sVertexCode += PassBlend.pExtractedFunctions["init"];
        isExtract = true;
    }
    //Extract functions
    for (i in this.pExtrectedFunctionsV) {
        if (!isExtract) {
            sVertexCode += PassBlend.pExtractedFunctions["init"];
            isExtract = true;
        }
        sVertexCode += PassBlend.pExtractedFunctions[i];
    }
    //Types
    for (i = 0; i < this.pTypesOrderV.length; i++) {
        sVertexCode += this.pTypesBlockV[this.pTypesOrderV[i].sRealName] + ";";
    }
    //Function`s definitions
    for (i in this.pFuncDefBlockV) {
        sVertexCode += i + ";";
    }
    //Uniform samplers
    if (isZeroSamplerV) {
        nSamplers--;
        sVertexCode += PassBlend.sZeroSamplerDecl;
    }
    for (i = 0; i < nRealSamplers; i++) {
        if (TEST_BIT(pSamplersUsage[i], 0)) {
            nSamplers--;
            sVertexCode += this._pRealSamplersDecl[i];
        }
    }
    //Uniforms
    for (i in this.pUniformsBlockV) {
        sVertexCode += this.pUniformsBlockV[i];
    }
    //Global variables
    if (isZeroHeaderV) {
        sVertexCode += PassBlend.sZeroHeaderDecl;
    }
    for (i = 0; i < nRealSamplers; i++) {
        if (TEST_BIT(pSamplersUsage[i], 1)) {
            nSamplers--;
            sVertexCode += this._pRealBuffesDecl[i];
        }
    }
    for (i in this.pGlobalVarBlockV) {
        sVertexCode += this.pGlobalVarBlockV[i];
    }
    //Varyings declaration
    for (i in this.pVaryingsDef) {
        sVertexCode += this.pVaryingsDef[i];
    }
    //Real attributtes
    for (i = 0; i < nAttr; i++) {
        sVertexCode += pRealAttrs[i];
    }
    //Check number of samplers
    if (nSamplers < 0) {
        warning("More samplers used than vertex shader can provide");
        return false;
    }
    //Offsets
    sVertexCode += sUniformOffset;
    //Input data for shader
    for (i = 0; i < pKeys.length; i++) {
        sKey1 = pKeys[i];
        sVertexCode += pAttrDecl[sKey1];
    }
    //System 'Out' variable declaration
    sVertexCode += this.sVaryingsOut;
    //Function`s body
    for (i in this.pFuncDeclBlockV) {
        sVertexCode += fnToFinalCode(this.pFuncDeclBlockV[i]) + "\n";
    }
    //Shader`s functions body
    for (i = 0; i < this.pVertexShaders.length; i++) {
        sVertexCode += this.pVertexShaders[i].toFinal() + "\n";
    }
    //void main()
    sVertexCode += "void main(){";
    //Extract headers for attr`s buffers
    for (i = 0; i < nRealSamplers; i++) {
        if (TEST_BIT(pSamplersUsage[i], 1)) {
            nSamplers--;
            sVertexCode += this._pRealBuffesInit[i];
        }
    }
    //Initialize input data for shader`s functions from real attributess
    for (i = 0; i < pKeys.length; i++) {
        sKey1 = pKeys[i];
        sVertexCode += pAttrInit[sKey1];
    }
    //Texcoords closure
    for (i in pTempVarsDecl) {
        sVertexCode += pTempVarsDecl[i];
    }
    for (i = 0; i < pTexcoords.length; i++) {
        if (pTexcoords[i] !== undefined && pTexcoords[i] !== null && i !== pTexcoords[i]) {
            sName1 = a.fx.SHADER_PREFIX.TEXCOORD + i;
            sName2 = a.fx.SHADER_PREFIX.TEXCOORD + pTexcoords[i];
            pAttr = this.pAttributes[sName1];
            pAttr1 = this.pAttributes[sName2];
            if (pAttr && pAttr1) {
                sVertexCode += sName1 + "=" + pAttr.pType.pEffectType.toCode() + "(" +
                               (pTempVarsDecl[sName2] ? (a.fx.SHADER_PREFIX.TEMP + pTexcoords[i]) : sName2) + ");";
            }
        }
    }

    //Calls shader`s functions
    for (i = 0; i < this.pVertexShaders.length; i++) {
        sVertexCode += this.pVertexShaders[i].sRealName + "();"
    }
    //Set varyings
    for (i in this.pVaryingsBlock) {
        sVertexCode += this.pVaryingsBlock[i];
    }
    //finish
    sVertexCode += "}";

    //PIXEL SHADER

    nSamplers = a.info.graphics.maxCombinedTextureImageUnits(this._pEngine.pDevice);

    //Initial for extract functions
    isExtract = false;
    if (isExtractInitF) {
        sFragmentCode += PassBlend.pExtractedFunctions["init"];
        isExtract = true;
    }
    //Extract functions
    for (i in this.pExtrectedFunctionsF) {
        if (!isExtract) {
            sFragmentCode += PassBlend.pExtractedFunctions["init"];
            isExtract = true;
        }
        sFragmentCode += PassBlend.pExtractedFunctions[i];
    }
    //Types
    for (i = 0; i < this.pTypesOrderF.length; i++) {
        sFragmentCode += this.pTypesBlockF[this.pTypesOrderF[i].sRealName] + ";";
    }
    //Function`s definitions
    for (i in this.pFuncDefBlockF) {
        sFragmentCode += i + ";";
    }
    //Uniform samplers
    if (isZeroSamplerF) {
        nSamplers--;
        sFragmentCode += PassBlend.sZeroSamplerDecl;
    }
    for (i = 0; i < nRealSamplers; i++) {
        if (TEST_BIT(pSamplersUsage[i], 2)) {
            nSamplers--;
            sFragmentCode += this._pRealSamplersDecl[i];
        }
    }
    //Check number of samplers
    if (nSamplers < 0) {
        warning("More samplers used than fragment shader can provide");
        return false;
    }
    //Uniforms
    for (i in this.pUniformsBlockF) {
        sFragmentCode += this.pUniformsBlockF[i];
    }
    //Global variables
    if (isZeroHeaderF) {
        sFragmentCode += PassBlend.sZeroHeaderDecl;
    }
    for (i = 0; i < nRealSamplers; i++) {
        if (TEST_BIT(pSamplersUsage[i], 3)) {
            nSamplers--;
            sFragmentCode += this._pRealBuffesDecl[i];
        }
    }
    for (i in this.pGlobalVarBlockF) {
        sFragmentCode += this.pGlobalVarBlockF[i];
    }
    //Varyings declaration
    for (i in this.pVaryingsDef) {
        sFragmentCode += this.pVaryingsDef[i];
    }
    //Function`s body
    for (i in this.pFuncDeclBlockF) {
        sFragmentCode += fnToFinalCode(this.pFuncDeclBlockF[i]) + "\n";
    }
    //Shader`s functions body
    for (i = 0; i < this.pFragmentShaders.length; i++) {
        sFragmentCode += this.pFragmentShaders[i].toFinal() + "\n";
    }
    //void main()
    sFragmentCode += "void main(){";
    //Extract headers for global buffers
    for (i = 0; i < nRealSamplers; i++) {
        if (TEST_BIT(pSamplersUsage[i], 3)) {
            nSamplers--;
            sFragmentCode += this._pRealBuffesDecl[i];
        }
    }
    //Calls shader`s functions
    for (i = 0; i < this.pFragmentShaders.length; i++) {
        sFragmentCode += this.pFragmentShaders[i].sRealName + "();"
    }
    //finish
    sFragmentCode += "}";
    //add precision
    if (sFragmentCode !== "") {
        sFragmentCode = "#ifdef GL_ES\nprecision lowp float;\n#endif\n" + sFragmentCode;
    }

    //Generate program
    pProgram = this._pEngine.displayManager().shaderProgramPool().createResource(sHash);
    pProgram._pPassBlend = this;
    pProgram.setUniformVars(this.pUniforms, isZeroSamplerV || isZeroSamplerF);
    pProgram.setAttrParams(pAttrToReal, pAttrToBuffer, pSamplersToReal, pBuffersToReal, nAttr, nRealSamplers);
    if (!pProgram.create(sHash, sVertexCode, sFragmentCode)) {
        return false;
    }
    if (!pProgram.setup(pAttrData, pUniformData, pTextures)) {
        return false;
    }
    trace("Pass blend ---->", pProgram);
    return pProgram;
};
A_NAMESPACE(PassBlend, fx);