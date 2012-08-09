Define(SM_INVALID_EFFECT, -1);
Define(SM_INVALID_TECHNIQUE, -1);
Define(SM_UNKNOWN_PASS, -1);

function ComponentBlend() {
    this.pPassBlends = null;
    this.pUniformsBlend = null;
    this.sHash = "";
    this.pComponentsHash = {};
    this.pComponentsCount = {};
    this.pComponentsShift = [];
    this.pComponents = [];
    this._isReady = false;
    this._id = 0;
    this._nShiftMin = 0;
    this._nShiftMax = 0;
    this._nShiftCurrent = 0;
    this._nTotalValidPasses = -1;
}
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
    var i, j;
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
                    "pUniformsDefault"    : {}
                };
            }
            pPass = pComponent.pPasses[i];
            this.pPassBlends[i + nShift].push(pPass);
            pUniforms = this.pUniformsBlend[i + nShift];
            for (j in pPass.pUniformsByName) {
                sName = pPass.pUniformsByName[j];
                pUniforms.pUniformsByName[j] = sName;
                pVar1 = pUniforms.pUniformsByRealName[sName];
                pVar2 = pPass.pUniformsByRealName[sName];
                if (pVar1 && !pVar1.pType.isEqual(pVar2.pType)) {
                    warning("You used uniforms with the same semantics. Now we work not very well with that.");
                }
                pUniforms.pUniformsByRealName[sName] = pVar2;
                pUniforms.pUniformsDefault[sName] = pPass.pUniformsDefault[sName];
            }
        }
    }
    this._isReady = true;
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
a.fx.ComponentBlend = ComponentBlend;

function PassBlend() {
    this.sHash = "";
    this._id = null;
    this.pPasses = [];
    this.pVertexShaders = [];
    this.pFragmentShaders = [];
    this.pStates = {};

    this.pTypesBlockV = {};
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


    this.pTypesBlockF = {};
    this.pUniformsF = {};
    this.pUniformsBlockF = {};
    this.pMixedTypesF = {};
    this.pFuncDefBlockF = {};
    this.pGlobalVarBlockF = {};
    this.pFuncDeclBlockF = {};

    this._pBlendTypes = {};
    this._pBlendTypesDecl = {};
    this._nBlendTypes = 1;
}
PassBlend.prototype.addPass = function (pPass) {
    //TODO: some work with samplers and buffers
    this.pPasses.push(pPass);
    var pVertex = pPass.pVertexShader;
    var pFragment = pPass.pFragmentShader;
    var i, j;
    var pVar1, pVar2;
    var isEqual = false;
    if (pVertex) {
        this.pVertexShaders.push(pVertex);
        for (i in pVertex.pTypesBlock) {
            this.pTypesBlockV[i] = pVertex.pTypesBlock[i];
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
            pVar2 = this.pUniformsV[i];
            if (pVar2) {
                if (pVar2 instanceof Array) {
                    isEqual = false;
                    for (j = 0; j < pVar2.length; j++) {
                        if (pVar2[j].pType.isEqual(pVar1.pType)) {
                            isEqual = true;
                            break;
                        }
                        if (!pVar2[j].pType.canBlend(pVar1.pType)) {
                            error("Types for blending uniforms must be mixible");
                            return;
                        }
                    }
                    if (!isEqual) {
                        pVar2.push(pVar1);
                    }
                    continue;
                }
                if (!pVar2.pType.isEqual(pVar1.pType)) {
                    if (!pVar2.pType.canBlend(pVar1.pType)) {
                        error("Types for blending uniforms must be mixible");
                        return;
                    }
                    this.pUniformsV[i] = [pVar1, pVar2];
                    this.pUniformsBlockV[i] = null;
                }
                continue;
            }
            this.pUniformsV[i] = pVar1;
            this.pUniformsBlockV[i] = pVertex.pUniformsBlock[i];
        }
        for (i in pVertex._pAttrSemantics) {
            pVar1 = pVertex._pAttrSemantics[i];
            pVar2 = this.pAttributes[i];
            if (pVar2) {
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
        for (i in pVertex._pVaryingsSemantics) {
            pVar1 = pVertex._pVaryingsSemantics[1];
            pVar2 = this.pVaryings[i];
            if (!pVar2.pType.isStrictEqual(pVar1.pType)) {
                error("Not equal types for varyings");
                return;
            }
            if (!pVar2) {
                this.pVaryings[i] = pVar1;
                this.pVaryingsDef[i] = "varying " + pVar1.toCodeDecl();
            }
        }
    }
    if (pFragment) {
        this.pFragmentShaders.push(pFragment);
        for (i in pFragment.pTypesBlock) {
            this.pTypesBlockF[i] = pFragment.pTypesBlock[i];
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
            pVar2 = this.pUniformsF[i];
            if (pVar2) {
                if (pVar2 instanceof Array) {
                    isEqual = false;
                    for (j = 0; j < pVar2.length; j++) {
                        if (pVar2[j].pType.isEqual(pVar1.pType)) {
                            isEqual = true;
                            break;
                        }
                        if (!pVar2[j].pType.canBlend(pVar1.pType)) {
                            error("Types for blending uniforms must be mixible 1");
                            return;
                        }
                    }
                    if (!isEqual) {
                        pVar2.push(pVar1);
                    }
                    continue;
                }
                if (!pVar2.pType.isEqual(pVar1.pType)) {
                    if (!pVar2.pType.canBlend(pVar1.pType)) {
                        error("Types for blending uniforms must be mixible 2");
                        return;
                    }
                    this.pUniformsF[i] = [pVar1, pVar2];
                    this.pUniformsBlockF[i] = null;
                }
                continue;
            }
            this.pUniformsF[i] = pVar1;
            this.pUniformsBlockF[i] = pFragment.pUniformsBlock[i];
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
    for (i in this.pUniformsBlockV) {
        if (this.pUniformsBlockV[i] === null) {
            sType = fnBlendTypes(this.pUniformsV[i], this);
            this.pUniformsBlockV[i] = "uniform " + sType + " " + this.pUniformsV[i][0].sRealName + ";";
        }
    }
    for (i in this.pUniformsBlockF) {
        if (this.pUniformsBlockF[i] === null) {
            sType = fnBlendTypes(this.pUniformsF[i], this);
            this.pUniformsBlockF[i] = "uniform " + sType + " " + this.pUniformsF[i][0].sRealName + ";";
        }
    }
    for (i in this.pAttributes) {
        if (this.pAttributes[i] instanceof Array) {
            sType = fnBlendTypes(this.pAttributes[i], this);
            this.pAttributes[i] = "uniform " + sType + " " + this.pAttributes[i][0].sRealName + ";";
        }
    }
    this.sVaryingsOut = "struct {";
    for (i in this.pVaryings) {
        this.sVaryingsOut += this.pVaryings[i].toCodeDecl();
        this.pVaryingsBlock[i] = a.fx.GLOBAL_VARS.SHADEROUT + "." + i;
    }
    this.sVaryingsOut += "} " + a.fx.GLOBAL_VARS.SHADEROUT + ";"

};

function ShaderManager(pEngine) {
    Enum([
             PARAMETER_FLAG_ALL = 1,
             PARAMETER_FLAG_NONSYSTEM,
             PARAMETER_FLAG_SYSTEM
         ], PARAMETER_FLAGS, a.ShaderManager);
    Enum([
             WORLD_MATRIX = 0,
             VIEW_MATRIX,
             PROJ_MATRIX,

             WORLD_VIEW_MATRIX, //VIEW x WORLD
             VIEW_PROJ_MATRIX, //PROJ x VIEW
             WORLD_VIEW_PROJ_MATRIX, //PROJ x VIEW x WORLD

             WORLD_MATRIX_ARRAY,

             NORMAL_MATRIX, //transpose(inverse(mat3(WORLD_MATRIX)))  see: SceneNode.normalMatrix()

             MAX_MATRIX_HANDLES
         ], MATRIX_HANDLES, a.ShaderManager);
    Enum([  //сам переименуешь
             boneInfluenceCount = 0,

             ambientMaterialColor,
             diffuseMaterialColor,
             emissiveMaterialColor,
             specularMaterialColor,
             specularMaterialPower,

             pointLightPos0,
             pointlightVec0,
             pointlightColor0,

             sunVector,
             sunColor,
             cameraPos,
             cameraDistances,
             cameraFacing,
             ambientLight,

             patchCorners,
             atmosphericLighting,

             posScaleOffset,
             uvScaleOffset,

             lensFlareColor,

             max_param_handles
         ], PARAMETER_HANDLES, a.ShaderManager);
    Enum([MAX_TEXTURE_HANDLES = a.SurfaceMaterial.maxTexturesPerSurface], eTextureHandles, a.ShaderManager);

    this.pEngine = pEngine;

    this._nEffectFile = 1;
    this._pComponentBlendsHash = {"EMPTY" : null};
    this._pComponentBlendsId = {0 : null};
    this._nComponentBlends = 1;
    this._pEffectResoureId = {};
    this._pEffectResoureBlend = {};
    this._pCurrentBlend = null;
    this._nCurrentShift = 0;
    this._pSnapshotStack = [];
    this._pBlendStack = [];
    this._pShiftStack = [];

    this._pActiveProgram = null;
    this._nAttrsUsed = 0;


}
/**
 * Load *.fx file or *.abf
 * @tparam String sFileName
 * @tparam String sName name of Effect. It`s need if in effect there are no provide.\n
 *         So name of components from file will be: "sName" + ":" + "sTechniqueName"\n
 *         Example: "baseEffect:GEOMETRY", "lightEffect:POINT"
 */
ShaderManager.prototype.loadEffectFile = function (sFileName, sEffectName) {
    var reExt = /^(.+)(\.fx|\.abf)$/;
    var pRes = reExt.exec(sFileName);
    var pEffect;
    var sSource;
    if (!pRes) {
        warning("File has wrong extension! It must be .fx!");
        return false;
    }
    sEffectName = sEffectName || pRes[1];
    pEffect = new a.fx.Effect(this, this._nEffectFile);
    this._nEffectFile++;
    sSource = a.ajax({url : sFileName, async : false}).data;
    a.util.parser.parse(sSource);
    var isLoadOk = pEffect.analyze(a.util.parser.pSyntaxTree);
    trace(pEffect);
    if (!isLoadOk) {
        warning("Effect file:(\"" + sFileName + "\")can not be loaded");
        return false;
    }
    var i;
    var pTechniques = pEffect.pTechniques;
    for (i in pTechniques) {
        if (!this.initComponent(pTechniques[i])) {
            warning("Can not initialize component from effect " + sFileName +
                    " with name " + pTechniques[i].sName + "!");
        }
    }
};
/**
 * Initialization component from technique. Name of component will be 'sEffectName' + ':' + 'pTechnique.sName'
 * @tparam sEffectName
 * @tparam pTechnique
 * @treturn Boolean True if all Ok, False if we already have this component.
 */
ShaderManager.prototype.initComponent = function (pTechnique) {
    //TODO: init component
    var sName = pTechnique.sName;
    var pComponentManager = this.pEngine.displayManager().componentPool();
    if (pComponentManager.findResource(sName)) {
        return false;
    }
    var pComponent = pComponentManager.createResource(sName);
    pComponent.init(pTechnique);
    var pComponents = pComponent.pComponents;
    var pProps = pComponent.pComponentsShift;
    if (pComponents) {
        var pNewComponents = [];
        var pNewComponentsProp = [];
        var pComponentsHash = {};
        var pCompComp;
        var pCompProp;
        var i, j;
        for (i = 0; i < pComponents.length; i++) {
            sName = pComponents[i].hash(pProps[i]);
            if (!pComponentsHash[sName]) {
                if (pComponents[i].pComponents) {
                    pCompComp = pComponents[i].pComponents;
                    pCompProp = pComponents[i].pComponentsShift;
                    for (j = 0; j < pCompComp.length; j++) {
                        sName = pCompComp[j].hash(pCompProp[j]);
                        if (!pComponentsHash[sName]) {
                            pComponentsHash[sName] = pCompComp[j];
                            pNewComponents.push(pCompComp[j]);
                            pNewComponentsProp.push(pCompProp[j]);
                        }
                    }
                }
                sName = pComponents[i].hash(pProps[i]);
                pComponentsHash[sName] = pComponents[i];
                pNewComponents.push(pComponents[i]);
                pNewComponentsProp.push(pProps[i]);
            }
        }
        pComponent.pComponents = pNewComponents;
        pComponent.pComponentsShift = pNewComponents;
        pComponent.pComponentsHash = pComponentsHash;
    }
    return true;
};
ShaderManager.prototype.getComponentByName = function (sName) {
    return this.pEngine.displayManager().componentPool().findResource(sName);
};
/**
 * Blend Components
 * @param {Component ...} Variable number of components
 * @return {Number} Id of ComponentBlend
 */
ShaderManager.prototype._blendComponents = function () {
    var pComponents = arguments;
    if (pComponents.length === 0) {
        return 0;
    }
    else {
        var i, j;
        var pBlend = new a.fx.ComponentBlend();
        var pComponent;
        for (i = 0; i < pComponents.length; i++) {
            pComponent = pComponents[i];
            if (!pBlend.hasComponent(pComponent.hash(0))) {
                if (pComponent.pComponents) {
                    for (j = 0; j < pComponent.pComponents.length; j++) {
                        pBlend.addComponent(pComponent.pComponents[j], pComponent.pComponentsShift[j]);
                    }
                }
                pBlend.addComponent(pComponent, 0);
            }
        }
        if (this._pComponentBlendsHash[pBlend.sHash]) {
            return this._pComponentBlendsHash[pBlend.sHash];
        }
        else {
            if (!this._registerComponentBlend(pBlend)) {
                return false;
            }
            return pBlend;
        }
    }
};
/**
 * Set id for componentBlend
 * @param {ComponentBlend} pBlend
 * @return {Int} Id of blend
 */
ShaderManager.prototype._registerComponentBlend = function (pBlend) {
    if (this._pComponentBlendsHash[pBlend.sHash]) {
        warning("Component with hash: \'" + pBlend.sHash + "\' are already used!");
        return false;
    }
    this._pComponentBlendsHash[pBlend.sHash] = pBlend;
    this._pComponentBlendsId[this._nComponentBlends] = pBlend;
    pBlend._id = this._nComponentBlends;
    this._nComponentBlends++;
    return pBlend._id;
};
/**
 *
 * @param {ComponentBlend} pBlend Hash or id for components blend
 * @param {Component} pComponent Name of blending component
 * @param {Object} nShift Property of blending this component
 * @return {Boolean} True to add component
 */
ShaderManager.prototype._addComponentToBlend = function (pBlend, pComponent, nShift) {
    var pComponentManager = this.pEngine.displayManager().componentPool();
    var i;
    var pNewBlend;
    nShift = nShift || 0;
    if (!pBlend) {
        //Create blend from component
        pNewBlend = new a.fx.ComponentBlend();
    }
    else if (!pBlend.pComponentsHash[pComponent.hash(nShift)]) {
        pNewBlend = pBlend.cloneMe();
    }
    if (pNewBlend) {
        if (pComponent.pComponents) {
            for (i = 0; i < pComponent.pComponents.length; i++) {
                pNewBlend.addComponent(pComponent.pComponents[i], pComponent.pComponentsShift[i] + nShift);
            }
        }
        pNewBlend.addComponent(pComponent, nShift);
        if (this._pComponentBlendsHash[pNewBlend.sHash]) {
            return this._pComponentBlendsHash[pNewBlend.sHash];
        }
        else {
            if (!this._registerComponentBlend(pNewBlend)) {
                return false;
            }
            return pNewBlend;
        }
    }
    return pBlend;
};
ShaderManager.prototype._removeComponentFromBlend = function (pBlend, pComponent, nShift) {
    var pComponentManager = this.pEngine.displayManager().componentPool();
    var i;
    var pNewBlend;
    var pComp;
    nShift = nShift || 0;
    if (!pBlend) {
        //Create blend from component
        warning("You try remove component from empty blend!");
        return false;
    }
    if (!pBlend.pComponentsHash[pComponent.hash(nShift)]) {
        warning("You try remove component from blend where it doesn`t exist!");
        return false;
    }
    var sName = pComponent.hash(nShift);
    if (pBlend.pComponentsCount[sName] > 1) {
        pBlend.pComponentsCount[sName]--;
        for (i = 0; i < pComponent.pComponents.length; i++) {
            pBlend.pComponentsCount[pComponent.pComponents[i].hash(pComponent.pComponentsShift[i] + nShift)]--;
        }
        return pBlend;
    }
    pNewBlend = pBlend.cloneMe();

    for (i = 0; i < pBlend.pComponents.length; i++) {
        pComp = pBlend.pComponents[i];
        sName = pComp.hash(pBlend.pComponentsShift[i]);
        if (pComp !== pComponent &&
            !(pComponent.pComponentsHash[sName] === pComp && pBlend.pComponentsCount[sName] === 1)) {
            pNewBlend.addComponent(pComp, pBlend.pComponentsShift[i]);
        }
    }

    if (this._pComponentBlendsHash[pNewBlend.sHash]) {
        return this._pComponentBlendsHash[pNewBlend.sHash];
    }
    else {
        if (!this._registerComponentBlend(pNewBlend)) {
            return false;
        }
        return pNewBlend;
    }
};
ShaderManager.prototype._addBlendToBlend = function (pBlendA, pBlendB, nShift) {
    var sHash = pBlendA.sHash;
    var sName;
    var i;
    for (i = 0; i < pBlendB.pComponents.length; i++) {
        sName = pBlendB.pComponents[i].hash(pBlendB.pComponentsShift[i] + nShift);
        if (!pBlendA.pComponentsHash[sName]) {
            sHash += sName + ":";
        }
    }
    if (this._pComponentBlendsHash[sHash]) {
        return this._pComponentBlendsHash[sHash];
    }
    var pNewBlend;
    pNewBlend = pBlendA.addBlend(pBlendB, nShift);
    if (!this._registerComponentBlend(pNewBlend)) {
        return false;
    }
    return pNewBlend;
};
ShaderManager.prototype.activateProgram = function (pProgram) {
    var pDevice = this.pEngine.pDevice;

    pProgram.bind();


    for (var i = pProgram.getAttribCount(); i < this._nAttrsUsed; i++) {
        pDevice.disableVertexAttribArray(i);
    }
    ;

    for (var i = 0; i < pProgram.getAttribCount(); i++) {
        pDevice.enableVertexAttribArray(i);
    }
    ;

    this._pActiveProgram = pProgram;
    this._nAttrsUsed = pProgram.getAttribCount();
};

ShaderManager.prototype.deactivateProgram = function (pProgram) {
    //if (this._pActivatedPrograms[this._nLastActivatedProgram] === pProgram) {
    //    trace('unbind Program', pProgram.resourceHandle());
    //   this._nLastActivatedProgram --;
    //pProgram.unbind(this._pActivatedPrograms[this._nLastActivatedProgram]);
    //}
    this._pActiveProgram = null;
    pProgram.unbind();
};
ShaderManager.prototype.getActiveProgram = function () {
    return this._pActiveProgram;
};
ShaderManager.prototype.activeTextures = new Array(32);

/**
 * TODO:____IMPORTANT_!!!!ВАЖНО!!!!
 *
 * необходимо проставлять значения по умолчанию для глобальных системных семантик
 * если этого небыло сделано извне.
 *
 * Пример: Если при рендиринге не была передана камера, а текущий смешанный шейдер имеет ее параметры,
 * надо подать текущую активную камеру движака!
 */


/**
 * Регистрация нового эффект ресурса.
 * @tparam EffectResource pEffectResource
 * @treturn Boolean
 */
ShaderManager.prototype.registerEffect = function (pEffectResource) {
    var id = pEffectResource.resourceHandle();
    if (this._pEffectResoureId[id]) {
        warning("This effect resource are already loaded");
        return false;
    }
    this._pEffectResoureId[id] = pEffectResource;
    this._pEffectResoureBlend[id] = null;
    return true;
};

ShaderManager.prototype.findEffect = function () {
    return new EffectResource(this.pEngine);
}

/**
 * Регистрация компонента эффекта.
 * @tparam pEffectComponent pEffectComponent
 * @treturn Boolean
 */
ShaderManager.prototype.registerComponent = function (pComponent) {
    return false;
};

/**
 * Активация компонента для эффект ресурса.
 * @tparam EffectResource/ResourceHandle pEffectResource
 * @tparam iComponentHandle
 * @tparam Uint nShift Смещение пассов
 * @treturn Boolean
 */
ShaderManager.prototype.activateComponent = function (pEffectResource, iComponentHandle, nShift) {
    var pComponentManager = this.pEngine.displayManager().componentPool();
    var pEffectManager = this.pEngine.displayManager().effectPool();
    var rId = pEffectResource;
    var pBlend;
    nShift = nShift || 0;
    if (typeof(rId) === "object") {
        rId = rId.resourceHandle();
    }
    pBlend = this._pEffectResoureBlend[rId];
    var pComponent = pComponentManager.getResource(iComponentHandle);
    if (!pComponent) {
        warning("Can`t find component with id: " + iComponentHandle);
        return false;
    }
    pBlend = this._addComponentToBlend(pBlend, pComponent, nShift);
    if (!pBlend) {
        return false;
    }
    this._pEffectResoureBlend[rId] = pBlend;
    return true;
};
/**
 * Деактивация компонента для эффект ресурса.
 * @tparam EffectResource/ResourceHandle pEffectResource
 * @tparam iComponentHandle
 * @treturn Boolean
 */
ShaderManager.prototype.deactivateComponent = function (pEffectResource, iComponentHandle, nShift) {
    var pComponentManager = this.pEngine.displayManager().componentPool();
    var pEffectManager = this.pEngine.displayManager().effectPool();
    var rId = pEffectResource;
    var pBlend;
    nShift = nShift || 0;
    if (typeof(rId) === "object") {
        rId = rId.resourceHandle();
    }
    pBlend = this._pEffectResoureBlend[rId];
    var pComponent = pComponentManager.getResource(iComponentHandle);
    if (!pComponent) {
        warning("Can`t find component with id: " + iComponentHandle);
        return false;
    }
    pBlend = this._removeComponentFromBlend(pBlend, pComponent, nShift);
    if (!pBlend) {
        return false;
    }
    this._pEffectResoureBlend[rId] = pBlend;
    return true;
};

ShaderManager.prototype.push = function (pSnapshot) {
    var rId = pSnapshot.method.effect.resourceHandle();
    var pBlend = this._pEffectResoureBlend[rId];
    var isUpdate = pSnapshot.isUpdated();
    if (!pBlend) {
        error("There are no any blend for this effect");
        return false;
    }
    if (!pBlend.isReady()) {
        isUpdate = true;
    }
    if (!pBlend.finalize()) {
        return false;
    }
    var pUniforms;
    var i, j;
    if (isUpdate) {
        pUniforms = [];
        for (i = 0; i < pBlend.totalPasses(); i++) {
            for (j in pBlend.pUniformsBlend[i].pUniformsByName) {
                pUniforms[j] = null;
            }
        }
        pSnapshot.setPassStates(pUniforms);
    }
    this._pSnapshotStack.push(pSnapshot);
    this._pShiftStack.push(this._nCurrentShift);
    this._pBlendStack.push(pBlend);
    this._pCurrentBlend = pBlend;

    pSnapshot.isUpdated(false);
    return true;
};
ShaderManager.prototype.pop = function () {
    this._pSnapshotStack.pop();
    this._pShiftStack.pop();
    this._pBlendStack.pop();
    this._pCurrentBlend = this._pBlendStack[this._pBlendStack.length - 1];
    this._nCurrentShift = this._pShiftStack[this._pShiftStack.length - 1];
    return true;
};

ShaderManager.prototype.totalPasses = function (pEffect) {
    var id = pEffect.resourceHandle();
    if (this._pEffectResoureBlend[id]) {
        return this._pEffectResoureBlend[id].totalValidPasses();
    }
    return 0;
};

ShaderManager.prototype.activatePass = function (pSnapshot, iPass) {
    this._nCurrentShift += iPass;
    return true;
};
ShaderManager.prototype.deactivatePass = function (pSnapshot) {
    this._nCurrentShift -= pSnapshot._iCurrentPass;
    return true;
};

/**
 * Generate pass blend and shaderProgram
 * @param iPass
 */
ShaderManager.prototype.finishPass = function (iPass) {
    if (this._pCurrentBlend.totalValidPasses() <= iPass) {
        warning("You try finish bad pass");
        return false;
    }
    var pUniformValues,
        pNotDefaultUniforms;
    var i, j;
    var pSnapshot,
        pUniforms,
        pValues,
        pBlend;
    var nShift;
    var sRealName;
    var nPass = this._pShiftStack[this._pShiftStack.length - 1] + iPass;
    pUniformValues = {};
    var index;
    for (i = 0; i < this._pSnapshotStack.length; i++) {
        nShift = this._pShiftStack[i];
        pBlend = this._pBlendStack[i];
        pSnapshot = this._pSnapshotStack[i];
        index = nPass - nShift;
        if (pBlend.totalValidPasses() <= index) {
            continue;
        }
        pUniforms = pBlend.pUniformsBlend[index];
        pValues = pSnapshot._pPassStates[index];
        for (j in pUniforms.pUniformsByName) {
            sRealName = pUniforms.pUniformsByName[j];
            if (pValues[j]) {
                pUniformValues[sRealName] = pValues[j];
                pNotDefaultUniforms[sRealName] = true;
                continue;
            }
            if (!pNotDefaultUniforms[sRealName]) {
                pUniformValues[sRealName] = pUniforms.pUniformsDefault[sRealName];
            }
        }
    }

};


/**
 * Получить список PARAMETER переменных компонента.
 * @tparam Uint iComponentHandle Хендл компонена.
 * @param Int iPass Номер пасса. (Не обязательно)
 * @treturn EffectParameter[]
 */
ShaderManager.prototype.getParameters = function (iComponentHandle, iPass, eFlag) {
    iPass = ifndef(iPass, SM_UNKNOWN_PASS);
    eFlag = eFlag || a.ShaderManager.PARAMETER_FLAG_ALL;
    /**
     * Если eFlag
     * PARAMETER_FLAG_NONSYTEM - только юниформы без системных семантик
     * PARAMETER_FLAG_SYSTEM - только юниформы с системными симантиками
     * PARAMETERFLAG_ALL - только все.
     */

    if (iPass === SM_UNKNOWN_PASS) {
        //возвращаем все юниформы iComponentHandle для пасса iPass
    }
    else {
        //возвращаем все юниформы iComponentHandle для всех пассов сразу
    }

    return null;
};

/**
 *
 * @tparam iEffectHandle эффект для которого ищем
 * @tparam Enumeration(MATRIX_HANDLES,PARAMETER_HANDLES)/String pParameter Параметр.
 * @tparam iPass
 * @tparam eFlag
 * @treturn EffectParameter
 */
ShaderManager.prototype.findParameter = function (iEffectHandle, pParameter, iPass, eFlag) {
    return null;
};

/**'
 * Функция проверки идентификатора компонента, если
 * компонент не известен менеджеру, он не будет использован.
 * @tparam Int iComponent
 * @treturn Boolean
 */
ShaderManager.prototype.isValidComponent = function (iComponent) {
    return false;
};

ShaderManager.prototype.findTechnique = function (sTechnique) {
    return SM_INVALID_TECHNIQUE;
};

/**
 * Добавить новый эффект в коллекцию эффектов шейдер менеджера.
 * @tparam String/Binary pData Эффект файл.
 * @treturn Int Идентификатор эффекта или SM_INVALID_EFFECT
 */
ShaderManager.prototype.addEffect = function (pData) {
    return SM_INVALID_EFFECT;
};

ShaderManager.prototype.setShadowTexture = function (pTexture) {
    return false;
};

/**
 * Получить число компонентов для данного эффекта.
 * @tparam ResourceHandle/EffectResource iEffectHandle
 * @treturn Int
 */
ShaderManager.prototype.getComponentCount = function (iEffectHandle) {
    return 0;
};

/**
 * Получить компонент для данного эффекта.
 * @tparam iEffectHandle
 * @tparam Int iComponent Порядковый номер компонента в набор компонентов для данного эффетка.
 * @treturn EffectComponent
 */
ShaderManager.prototype.getComponent = function (iEffectHandle, iComponent) {
    return null;
};

/**
 * Функция инициализации, вызываемая в инициализации менеджеров.
 * @treturn Boolean
 */
ShaderManager.prototype.initialize = function () {
    return true;
};

/**
 * Аналог деструктора, вызываемого при уничтожении менеджера.
 * @treturn Boolean
 */
ShaderManager.prototype.destroy = function () {
    return true;
};


ShaderManager.prototype.restoreDeviceResources = function () {
    return true;
};

ShaderManager.prototype.destroyDeviceResources = function () {
    return true;
};

ShaderManager.prototype.createDeviceResources = function () {
    return true;
};

ShaderManager.prototype.disableDeviceResources = function () {
    return true;
};

ShaderManager.prototype.createBuffer = function () {
};

a.ShaderManager = ShaderManager;
