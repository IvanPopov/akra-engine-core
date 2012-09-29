Define(SM_INVALID_EFFECT, -1);
Define(SM_INVALID_TECHNIQUE, -1);
Define(SM_UNKNOWN_PASS, -1);

var SHADER_PREFIX = {
    SAMPLER    : "A_s_",
    HEADER     : "A_h_",
    ATTRIBUTE  : "A_a_",
    OFFSET     : "A_o_",
    TEXTURE    : "TEXTURE",
    TEXCOORD   : "TEXCOORD",
    TEXMATRIX  : "TEXMATRIX",
    TEMP       : "TEMP_",
    BLEND_TYPE : "AUTO_BLEND_TYPE_"
};
A_NAMESPACE(SHADER_PREFIX, fx);
a.fx.ZEROSAMPLER = 19;

Enum([
         SHADOWS = 2,
         LIGHTINGS,
         GLOBALPOSTEFFECTS,
         DEFAULT
     ], RENDERSTAGE, a.RenderStage);

function Renderer(pEngine) {
    Enum([
             PARAMETER_FLAG_ALL = 1,
             PARAMETER_FLAG_NONSYSTEM,
             PARAMETER_FLAG_SYSTEM
         ], PARAMETER_FLAGS, a.Renderer);
    Enum([
             WORLD_MATRIX = 0,
             MODEL_MATRIX,
             VIEW_MATRIX,
             PROJ_MATRIX,

             WORLD_VIEW_MATRIX, //VIEW x WORLD
             VIEW_PROJ_MATRIX, //PROJ x VIEW
             WORLD_VIEW_PROJ_MATRIX, //PROJ x VIEW x WORLD

             WORLD_MATRIX_ARRAY,

             NORMAL_MATRIX, //transpose(inverse(mat3(WORLD_MATRIX)))  see: SceneNode.normalMatrix()

             MAX_MATRIX_HANDLES
         ], MATRIX_HANDLES, a.Renderer);
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
         ], PARAMETER_HANDLES, a.Renderer);
    Enum([MAX_TEXTURE_HANDLES = a.SurfaceMaterial.maxTexturesPerSurface], eTextureHandles, a.Renderer);

    Enum([
             MODEL_MATRIX = "MODEL_MATRIX",
             VIEW_MATRIX = "VIEW_MATRIX",
             PROJ_MATRIX = "PROJ_MATRIX",
             NORMAL_MATRIX = "NORMAL_MATRIX",
             EYE_POS = "EYE_POSITION",
             BIND_MATRIX = "BIND_SHAPE_MATRIX",
             RENDER_OBJECT_ID = "RENDER_OBJECT_ID"
         ], SYSTEM_SEMANTICS, a.Renderer);
    Enum([
             MATERIAL = "MATERIAL"
         ], BASE_SEMANTICS, a.Renderer);
    Enum([
             WAIT = 0,
             LOAD = 1,
             ANALYZED = 2
         ], EFFECTFILELOADSTATES, a.Renderer.EffectFile);

    this.pEngine = pEngine;
    this.pDevice = pEngine.pDevice;
    this._pEngineStates = pEngine.pEngineStates;

    this._nEffectFile = 1;
    this._pEffectFileStack = [];

    this._pEffectFileDataPool = new a.EffectFileDataManager(pEngine);
    this._pEffectFileDataPool.initialize(16);

    this._pComponentBlendsHash = {"EMPTY" : null};
    this._pComponentBlendsId = {0 : null};
    this._nComponentBlends = 1;

    this._pPassBlends = {};
    this._pEffectResoureId = {};
    this._pEffectResoureBlend = {};

    this._pActiveSceneObject = null;
    this._pActiveRenderObject = null;
    this._pSceneObjectStack = [];

    this._pPreRenderStateStack = [];
    this._pPreRenderState = null;
    this._pPreRenderStatePool = new Array(20);
    for (var i = 0; i < this._pPreRenderStatePool.length; i++) {
        this._pPreRenderStatePool[i] = new a.fx.PreRenderState(this.pEngine);
    }

    this._pCurrentViewport = {
        x      : this.pEngine.getActiveViewport().x,
        y      : this.pEngine.getActiveViewport().y,
        width  : this.pEngine.getActiveViewport().width,
        height : this.pEngine.getActiveViewport().height
    };

    this._pPrograms = {};
    this._pRenderResources = {};
    this._pRenderResourceCounter = {};
    this._pRenderResourceCounterKeys = [];

    this._pPostEffectTarget = null;

    //Current render resource states
    this._pRenderState = new a.fx.RenderState(this.pEngine);
    this._pStreamState = new Array(a.info.graphics.maxVertexAttributes(this.pDevice));

    this._pFramebufferPool = new Array(10);
    this._pEmptyFrameBuffers = new Array(10);
    this._pFrameBufferCounters = new Array(10);
    for (var i = 0; i < this._pFramebufferPool.length; i++) {
        this._pFramebufferPool[i] = new a.fx.FrameBuffer(this.pEngine);
        this._pEmptyFrameBuffers[i] = null;
        this._pFrameBufferCounters[i] = 0;
    }
    this._pSystemUniforms = null;

    this._pDefaultRenderQueue = new a.RenderQueue(pEngine, a.RenderStage.DEFAULT);
    this._pShadowRenderQueue = new a.RenderQueue(pEngine, a.RenderStage.SHADOWS);
    this._pLightingRenderQueues = new Array(4);
    for (var i = 0; i < this._pLightingRenderQueues.length; i++) {
        this._pLightingRenderQueues[i] = new a.RenderQueue(pEngine, a.RenderStage.LIGHTINGS);
    }
    this._pGlobalPostEffectRenderQueue = new a.RenderQueue(pEngine, a.RenderStage.GLOBALPOSTEFFECTS);

    this._eCurrentRenderStage = null;
    this._pCurrentRenderQueue = null;

    this._pDefaultColor = new Vec4(0.0, 0.0, 0.5, 1.);

    this._initSystemUniforms();
}

Renderer.prototype._initSystemUniforms = function () {
    if (Renderer._pSystemUniforms) {
        this._pSystemUniforms = Renderer._pSystemUniforms;
    }
    var pEnum = __ENUM__(SYSTEM_SEMANTICS);
    var pUniforms = {};
    for (var i in pEnum) {
        pUniforms[pEnum[i]] = null;
    }
    this._pSystemUniforms = Renderer._pSystemUniforms = pUniforms;
    return true;
};
//----Load and init components and effects----//
/**
 * Load *.fx file or *.abf
 * @tparam String sFileName
 * @tparam String sName name of Effect. It`s need if in effect there are no provide.\n
 *         So name of components from file will be: "sName" + ":" + "sTechniqueName"\n
 *         Example: "baseEffect:GEOMETRY", "lightEffect:POINT"
 */
Renderer.prototype.loadEffectFile = function (sFileName, isSync) {
    var reExt = /^(.+)(\.afx|\.abf|\.fx)$/;
    var pRes = reExt.exec(sFileName);

    isSync = isSync || false;

    if (!pRes) {
        warning("File has wrong extension! It must be .fx!");
        return false;
    }
    if (isSync) {
        var pRequest = a.ajax({url : sFileName, async : false});
        if (pRequest.xhr.status === a.HTTP_STATUS_CODE.OK) {
            var sSource = pRequest.data;
            var pResource = this._pEffectFileDataPool.createResource(sFileName);
            pResource.create(sSource);
            a.util.parser.parse(sSource, true, this._analyzeEffect, this);
            return true;
        }
        else {
            error("Could not load file in ", sFileName);
            return false;
        }
    }
    else {
        return this._pEffectFileDataPool.loadResource(sFileName);
    }
};
/**
 * Initialization component from technique. Name of component will be 'sEffectName' + ':' + 'pTechnique.sName'
 * @tparam sEffectName
 * @tparam pTechnique
 * @treturn Boolean True if all Ok, False if we already have this component.
 */
Renderer.prototype._initComponent = function (pTechnique) {
    var sName = pTechnique.sName;
    var pComponentManager = this.pEngine.displayManager().componentPool();
    if (pComponentManager.findResource(sName)) {
        return false;
    }
    var pComponent = pComponentManager.createResource(sName);
    pComponent.create(pTechnique);
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
        pComponent.pComponentsShift = pNewComponentsProp;
        pComponent.pComponentsHash = pComponentsHash;
    }
    return true;
};
Renderer.prototype._loadEffectFile = function (sFileName, pEffectResource) {
    var me = this;
    this._pEffectFileStack.push(pEffectResource);
    a.fopen(sFileName, "r").read(
        function (pData) {
            var sSource = pData;
            var pFirst = me._pEffectFileStack[0];
            pEffectResource.eStatus = 1;
            pEffectResource._sSource = sSource;
            if (pEffectResource === pFirst) {
                a.util.parser.parse(sSource, false, me._loadedEffect, me);
            }
        },
        function () {
            warning("It is impossible to load effect file");
            var pFirst = me._pEffectFileStack[0];
            me._deleteElementFromLoadQueue(pEffectResource);
            if (pEffectResource === pFirst) {
                me._nextEffect();
            }
        }
    );
};
Renderer.prototype._analyzeEffect = function (eCode) {
    if (eCode === a.Parser.OK) {

        var pEffect = new a.fx.Effect(this, this._nEffectFile);
        this._nEffectFile++;

        if (pEffect.analyze(a.util.parser.pSyntaxTree)) {
            var i;
            var pTechniques = pEffect.pTechniques;

            for (i in pTechniques) {
                if (!this._initComponent(pTechniques[i])) {
                    warning("Can not initialize component from effect " +
                            " with name " + pTechniques[i].sName + "!");
                }
            }

        }
        else {
            warning("Some semantic error was found during analyze of effect file");
        }
    }
    else {
        warning("Some error was occur during syntax analyze of effect file. Code: " + eCode);
    }
    return true;
};
Renderer.prototype._loadedEffect = function (eCode) {
    this._analyzeEffect(eCode);
    this._pEffectFileStack.shift().notifyLoaded();
    this._nextEffect();
    return true;
};
Renderer.prototype._deleteElementFromLoadQueue = function (pElement) {
    var i, pStack = this._pEffectFileStack;
    for (i = pStack.length; i >= 0; i++) {
        if (pStack[i] === pElement) {
            pStack.splice(i, 1);
            return true;
        }
    }
    return false;
};
Renderer.prototype._nextEffect = function () {
    var pElement = this._pEffectFileStack[0];
    if (pElement && pElement.eStatus === 1) {
        a.util.parser.parse(pElement._sSource, false, this._analyzeEffect, this);
    }
    return true;
};

//----Methods for blending components and effect resources----//
Renderer.prototype.getComponentByName = function (sName) {
    return this.pEngine.displayManager().componentPool().findResource(sName);
};
/**
 * Blend Components
 * @param {Component ...} Variable number of components
 * @return {Number} Id of ComponentBlend
 */
Renderer.prototype._blendComponents = function () {
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
Renderer.prototype._registerComponentBlend = function (pBlend) {
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
Renderer.prototype._addComponentToBlend = function (pBlend, pComponent, nShift) {
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
Renderer.prototype._removeComponentFromBlend = function (pBlend, pComponent, nShift) {
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
Renderer.prototype._addBlendToBlend = function (pBlendA, pBlendB, nShift) {
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
/**
 * Регистрация нового эффект ресурса.
 * @tparam EffectResource pEffectResource
 * @treturn Boolean
 */
Renderer.prototype.registerEffect = function (pEffectResource) {
    var id = pEffectResource.resourceHandle();
    if (this._pEffectResoureId[id]) {
        warning("This effect resource are already loaded");
        return false;
    }
    this._pEffectResoureId[id] = pEffectResource;
    this._pEffectResoureBlend[id] = null;
    return true;
};
/**
 * Регистрация компонента эффекта.
 * @tparam pEffectComponent pEffectComponent
 * @treturn Boolean
 */
Renderer.prototype.registerComponent = function (pComponent) {
    return true;
};
/**
 * Активация компонента для эффект ресурса.
 * @tparam EffectResource/ResourceHandle pEffectResource
 * @tparam iComponentHandle
 * @tparam Uint nShift Смещение пассов
 * @treturn Boolean
 */
Renderer.prototype.activateComponent = function (pEffectResource, iComponentHandle, nShift) {
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
Renderer.prototype.deactivateComponent = function (pEffectResource, iComponentHandle, nShift) {
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
Renderer.prototype.getComponentCount = function (pEffectResource) {
    var id = pEffectResource.resourceHandle();
    return this._pEffectResoureBlend[id].pComponents.length;

};
Renderer.prototype.findEffect = function (sName) {
    return new EffectResource(this.pEngine);
};

//----PreReander Methods----//
Renderer.prototype.push = function (pSnapshot, pRenderObject) {
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
    var pUniforms, pTextures, pForeigns;
    var pUniformKeys, pTextureKeys, pForeignKeys;
    var i, j;
    if (isUpdate) {
        pUniforms = [];
        if (pBlend.hasTextures()) {
            pTextures = [];
            for (i = 0; i < pBlend.totalValidPasses(); i++) {
                pTextures[i] = {};
                pTextureKeys = pBlend.pUniformsBlend[i]._pTextureByRealNameKeys;
                for (j = 0; j < pTextureKeys.length; j++) {
                    pTextures[i][pTextureKeys[j]] = null;
                }
            }
        }
        if (pBlend.hasForeigns()) {
            pForeigns = [];
            for (i = 0; i < pBlend.totalValidPasses(); i++) {
                pForeigns[i] = {};
                pForeignKeys = pBlend.pUniformsBlend[i]._pForeignByNameKeys;
                for (j = 0; j < pForeignKeys.length; j++) {
                    pForeigns[i][pForeignKeys[j]] = null;
                }
            }
        }
        for (i = 0; i < pBlend.totalValidPasses(); i++) {
            pUniforms[i] = {};
            pUniformKeys = pBlend.pUniformsBlend[i]._pUniformByRealNameKeys;
            for (j = 0; j < pUniformKeys.length; j++) {
                pUniforms[i][pUniformKeys[j]] = null;
            }
        }
        pSnapshot.setPassStates(pUniforms, pTextures, pForeigns);
    }

    var pState = this._getPreRenderState();
    pState.pSnapshot = pSnapshot;
    pState.nShift = (this._pPreRenderState === null) ? 0 : this._pPreRenderState.nShift;
    pState.pBlend = pBlend;
    pState.pAttributeData.length = (pBlend.totalValidPasses());
    pState.pRenderObject = pRenderObject;
    this._pPreRenderStateStack.push(pState);
    this._pPreRenderState = pState;
    pSnapshot.isUpdated(false);
    return true;
};
Renderer.prototype.pop = function () {
    var pState = this._pPreRenderStateStack.pop();
    this._releasePreRenderState(pState);
    this._pPreRenderState = this._pPreRenderStateStack[this._pPreRenderStateStack.length - 1] || null;
    return true;
};
Renderer.prototype.activatePass = function (pSnapshot, iPass) {
    this._pPreRenderState.nShift += iPass;
    switch (this._eCurrentRenderStage) {
        case a.RenderStage.SHADOWS:
            this._pCurrentRenderQueue = this._pShadowRenderQueue;
            break;
        case a.RenderStage.LIGHTINGS:
            this._pCurrentRenderQueue = this._pLightingRenderQueues[iPass];
            break;
        case a.RenderStage.GLOBALPOSTEFFECTS:
            this._pCurrentRenderQueue = this._pGlobalPostEffectRenderQueue;
            break;
        default:
            this._pCurrentRenderQueue = this._pDefaultRenderQueue;
            break;
    }
    return true;
};
Renderer.prototype.deactivatePass = function (pSnapshot) {
    this._pPreRenderState.nShift -= pSnapshot._iCurrentPass;
    return true;
};
Renderer.prototype.activateSceneObject = function (pSceneObject) {
    this._pSceneObjectStack.push(this._pActiveSceneObject);
    this._pActiveSceneObject = pSceneObject;
};
Renderer.prototype.deactivateSceneObject = function () {
    this._pActiveSceneObject = this._pSceneObjectStack.pop() || null;
};
/**
 * Generate pass blend and shaderProgram
 * @param iPass
 */
Renderer.prototype.finishPass = function (iPass) {
    trace("Render Pass #" + iPass + " start!");
    if (this._pPreRenderState.pBlend.totalValidPasses() <= iPass) {
        warning("You try finish bad pass");
        return false;
    }
    var pUniformValues,
        pNotDefaultUniforms,
        pTextures,
        pForeigns,
        pNewPassBlend;
    var i, j, k;
    var pSnapshot,
        pUniforms,
        pPasses,
        pPass,
        pValues,
        pBlend;
    var nShift;
    var sName,
        sHash,
        sKey;
    var pCurrentState = this._pPreRenderState,
        pStateStack = this._pPreRenderStateStack,
        pState,
        iStackLength = pStateStack.length;
    var nPass = pCurrentState.nShift + iPass;
    var index;
    var sPassBlendHash = "";
    var pPassBlend;
    var pMaterialTexcoords = new Array(a.SurfaceMaterial.maxTexturesPerSurface);
    pUniformValues = {};
    pNotDefaultUniforms = {};
    pTextures = {};
    pForeigns = {};

    for (i = 0; i < iStackLength; i++) {

        nShift = pStateStack[i].nShift;
        pBlend = pStateStack[i].pBlend;
        pSnapshot = pStateStack[i].pSnapshot;
        index = nPass - nShift;

        if (pBlend.totalValidPasses() <= index) {
            continue;
        }
        pUniforms = pBlend.pUniformsBlend[index];

        if (pSnapshot._pTextures) {
            pValues = pSnapshot._pTextures[index];
            for (j = 0; j < pUniforms._pTextureByRealNameKeys.length; j++) {
                sKey = pUniforms._pTextureByRealNameKeys[j];
                if (pValues[sKey] !== undefined) {
                    pTextures[sKey] = pValues[sKey];
                }
                if (pTextures[sKey] === undefined) {
                    pTextures[sKey] = null;
                }
            }
        }
        if (pSnapshot._pForeigns) {
            pValues = pSnapshot._pForeigns[index];
//            trace("Foreigns ---------- ", pSnapshot._pForeigns, pForeigns);
            for (j = 0; j < pUniforms._pForeignByNameKeys.length; j++) {
                sKey = pUniforms._pForeignByNameKeys[j];
                if (pValues[sKey] !== undefined) {
                    pForeigns[sKey] = pValues[sKey];
                }
                if (pForeigns[sKey] === undefined) {
                    pForeigns[sKey] = null;
                }
            }
        }

        pValues = pSnapshot._pPassStates[index];

        for (j = 0; j < pUniforms._pUniformByRealNameKeys.length; j++) {
            sKey = pUniforms._pUniformByRealNameKeys[j];
            if (pValues[sKey] !== undefined && pValues[sKey] !== null) {
                pUniformValues[sKey] = pValues[sKey];
                pNotDefaultUniforms[sKey] = true;
                continue;
            }
            if (!pNotDefaultUniforms[sKey]) {
                if (this._pSystemUniforms[sKey] === null) {
                    pUniformValues[sKey] = this._getSystemUniformValue(sKey);
                }
                else {
                    pUniformValues[sKey] = pUniforms.pUniformsDefault[sKey];
                }
            }
        }
    }

    pNewPassBlend = [];

    for (i = 0; i < iStackLength; i++) {
        nShift = pStateStack[i].nShift;
        pBlend = pStateStack[i].pBlend;
        index = nPass - nShift;

        if (pBlend.totalValidPasses() <= index) {
            continue;
        }

        pPasses = pBlend.pPassBlends[index];
        for (j = 0; j < pPasses.length; j++) {
            pPass = pPasses[j];
            if (!pPass.isEval) {
                if (pPass.isComplex) {
                    pPass.prepare(this._pEngineStates, pUniformValues);
                }
                sPassBlendHash += "V::" + ((pPass.pVertexShader &&
                                            pPass.pVertexShader.sRealName) ? pPass.pVertexShader.sRealName : "EMPTY");
                sPassBlendHash += "F::" +
                                  ((pPass.pFragmentShader &&
                                    pPass.pFragmentShader.sRealName) ? pPass.pFragmentShader.sRealName : "EMPTY");
                pNewPassBlend.push(pPass);
                pPass.isEval = true;
            }
        }
    }

    for (j = 0; j < pPasses.length; j++) {
        pPasses[j].isEval = false;
    }
    if (this._pPassBlends[sPassBlendHash]) {
        pPassBlend = this._pPassBlends[sPassBlendHash];
    }
    else {
        pPassBlend = new a.fx.PassBlend(this.pEngine);
        pPassBlend.init(sPassBlendHash, pNewPassBlend);
        if (!this._registerPassBlend(pPassBlend)) {
            return false;
        }
        pPassBlend.finalizeBlend();
    }
    //TODO: There are must be place for texture info into hash
    var pAttrSemantics = {};
    var pDataStackByPass,
        pDataStack,
        pMaterial,
        pData,
        pVertexElement;
    var pAttrKeys = Object.keys(pPassBlend.pAttributes);
    for (i = 0; i < pAttrKeys.length; i++) {
        pAttrSemantics[pAttrKeys[i]] = null;
    }
    for (i = iStackLength - 1; i >= 0; i--) {

        nShift = pStateStack[i].nShift;
        pDataStackByPass = pStateStack[i].pAttributeData;

        pMaterial = pStateStack[i].pSurfaceMaterial;
        index = nPass - nShift;

        if (pDataStackByPass.length <= index) {
            continue;
        }
        pDataStack = pDataStackByPass[index];
        if (pMaterial) {
            pBlend = pStateStack[i].pBlend;
            pUniforms = pBlend.pUniformsBlend[index];
            for (j = 0; j < a.SurfaceMaterial.maxTexturesPerSurface; j++) {
                if ((pMaterialTexcoords[j] !== undefined && pMaterialTexcoords[j] !== null) ||
                    !pMaterial._pTexture[j]) {
                    continue;
                }
                pMaterialTexcoords[j] = pMaterial._pTexcoord[j];
                sKey = a.fx.SHADER_PREFIX.TEXTURE + j;
                if (pUniforms.pTexturesByRealName[sKey] === null) {
                    pTextures[sKey] = pMaterial._pTexture[j];
                    sKey = a.fx.SHADER_PREFIX.TEXMATRIX + j;
                    if (pUniforms.pUniformsByRealName[sKey] &&
                        pMaterial._pTextureMatrix[j]) {
                        pUniformValues[sKey] = pMaterial._pTextureMatrix[j];
                    }
                }
            }
            if (pUniforms.pUniformsByRealName[a.Material.DIFFUSE] &&
                !pUniformValues[a.Material.DIFFUSE]) {
                pUniformValues[a.Material.DIFFUSE] = pMaterial.material.pDiffuse;
            }
            if (pUniforms.pUniformsByRealName[a.Material.AMBIENT] &&
                !pUniformValues[a.Material.AMBIENT]) {
                pUniformValues[a.Material.AMBIENT] = pMaterial.material.pAmbient;
            }
            if (pUniforms.pUniformsByRealName[a.Material.SPECULAR] &&
                !pUniformValues[a.Material.SPECULAR]) {
                pUniformValues[a.Material.SPECULAR] = pMaterial.material.pSpecular;
            }
            if (pUniforms.pUniformsByRealName[a.Material.EMISSIVE] &&
                !pUniformValues[a.Material.EMISSIVE]) {
                pUniformValues[a.Material.EMISSIVE] = pMaterial.material.pEmissive;
            }
            if (pUniforms.pUniformsByRealName[a.Material.SHININESS] &&
                !pUniformValues[a.Material.SHININESS]) {
                pUniformValues[a.Material.SHININESS] = pMaterial.material.pShininess;
            }
            sName = a.Renderer.MATERIAL + "." + a.Material.DIFFUSE;
            if (pUniforms.pUniformsByRealName[sName] && !pUniformValues[sName]) {
                pUniformValues[sName] = pMaterial.material.pDiffuse;
            }
            sName = a.Renderer.MATERIAL + "." + a.Material.AMBIENT;
            if (pUniforms.pUniformsByRealName[sName] && !pUniformValues[sName]) {
                pUniformValues[sName] = pMaterial.material.pAmbient;
            }
            sName = a.Renderer.MATERIAL + "." + a.Material.SPECULAR;
            if (pUniforms.pUniformsByRealName[sName] && !pUniformValues[sName]) {
                pUniformValues[sName] = pMaterial.material.pSpecular;
            }
            sName = a.Renderer.MATERIAL + "." + a.Material.EMISSIVE;
            if (pUniforms.pUniformsByRealName[sName] && !pUniformValues[sName]) {
                pUniformValues[sName] = pMaterial.material.pEmissive;
            }
            sName = a.Renderer.MATERIAL + "." + a.Material.SHININESS;
            if (pUniforms.pUniformsByRealName[sName] && !pUniformValues[sName]) {
                pUniformValues[sName] = pMaterial.material.pShininess;
            }
        }

        for (j = 0; j < pAttrKeys.length; j++) {
            sKey2 = pAttrKeys[j];
            if (pAttrSemantics[sKey2] === null) {
                for (k = 0; k < pDataStack.length; k++) {
                    pData = pDataStack[k];
                    if (pData.eType === a.BufferMap.FT_MAPPABLE) {
                        pVertexElement = pData.pData.getVertexDeclaration().element(sKey2);
                    }
                    else {
                        pVertexElement = pData.getVertexDeclaration().element(sKey2);
                    }
                    if (pVertexElement) {
                        pAttrSemantics[sKey2] = pData;
                        break;
                    }
                }
            }
        }
    }
    sHash = sPassBlendHash + "|-|__|/|";
    var sKey1, sKey2;
    var sSame1, sSame2;
    for (i = 0; i < pAttrKeys.length; i++) {
        sKey1 = pAttrKeys[i];
        sHash += sKey1 + "|";
        if (pAttrSemantics[sKey1] === null) {
            sHash += "EMPTY";
        }
//        else if (pAttrSemantics[sKey1] === a.BufferMap.FT_UNMAPPABLE) {
//            sHash += "REAL";
//        }
        //TODO: VIDEO_BUFFER !== VERTEX_BUFFER
        else {
            sHash += "SAME:";
            sSame1 = "";
            sSame2 = "";
            for (j = 0; j < pAttrKeys.length; j++) {
                sKey2 = pAttrKeys[j];
                if (i !== j && pAttrSemantics[sKey2] === pAttrSemantics[sKey1]) {
                    sSame1 += sKey2 + ",";
                }
//                else if (i !== j &&
//                         pAttrSemantics[sKey2].pData._pVertexBuffer === pAttrSemantics[sKey1].pData._pVertexBuffer) {
//                    sSame2 += sKey2 + ",";
//                }
            }
            sHash += sSame1 + "!";
            sHash += "SAME_VIDEO_BUFFER:" + sSame2;
        }
        sHash += "..";
    }
    for (i in pForeigns) {
        sHash += "FOREIGN::" + i + "=" + (pForeigns[i]);
    }
    var pProgram;
    pProgram = this._pPrograms[sHash];
    if (!pProgram) {
        pProgram = pPassBlend.generateProgram(sHash, pAttrSemantics, pAttrKeys, pUniformValues,
                                              pTextures, pForeigns, pMaterialTexcoords);
        if (!pProgram) {
            warning("It`s impossible to generate shader program");
            return false;
        }
    }
    var pAttrs = pProgram.generateInputData(pAttrSemantics, pUniformValues);
    if (this._pRenderState.iFrameBuffer !== null) {
        this._pFrameBufferCounters[this._pRenderState.iFrameBuffer]--;
    }

    var pEntry = this._pCurrentRenderQueue.getEmptyEntry();
    pEntry.set(pProgram,
               pAttrs,
               pUniformValues,
               pTextures,
               pCurrentState.pIndex,
               pCurrentState.iOffset,
               pCurrentState.iLength,
               pCurrentState.eDrawPrimitive,
               pCurrentState.pViewport.x,
               pCurrentState.pViewport.y,
               pCurrentState.pViewport.width,
               pCurrentState.pViewport.height,
               this._pRenderState.iFrameBuffer);
    this.pushRenderEntry(pEntry);

    trace("Render Pass #" + iPass + " finish!");
    return pEntry;
};
Renderer.prototype._registerProgram = function (sHash, pProgram) {
    if (this._pPrograms[sHash]) {
        warning("You try to register already used hash");
        return false;
    }
    this._pPrograms[sHash] = pProgram;
    return true;
};
Renderer.prototype._registerPassBlend = function (pBlend) {
    if (this._pPassBlends[pBlend.sHash]) {
        warning("Cannot register pass blend with this hash");
        return false;
    }
    this._pPassBlends[pBlend.sHash] = pBlend;
    return true;
};
Renderer.prototype._getPreRenderState = function () {
    var pPool = this._pPreRenderStatePool;
    var pState;
    if (pPool.length === 0) {
        pState = new a.fx.PreRenderState(this.pEngine);
    }
    else {
        pState = pPool.pop();
    }
    pState.setViewport(this._pCurrentViewport);
    return pState;
};
Renderer.prototype._releasePreRenderState = function (pState) {
    pState.release();
    this._pPreRenderStatePool.push(pState);
    return true;
};
Renderer.prototype._getSystemUniformValue = function (sName) {
    var pSceneObject = this._pActiveSceneObject;
    var pRenderObject = this._pPreRenderState.pRenderObject;
    var pCamera = this.pEngine.getActiveCamera();
    switch (sName) {
        case a.Renderer.MODEL_MATRIX:
            if (pSceneObject && pSceneObject._m4fWorldMatrix) {
                return pSceneObject.worldMatrix() || null;
            }
            return null;
        case a.Renderer.NORMAL_MATRIX:
            if (pSceneObject && pSceneObject._m4fWorldMatrix) {
                return pSceneObject.normalMatrix() || null;
            }
            return null;
        case a.Renderer.VIEW_MATRIX:
            return pCamera.viewMatrix();
        case a.Renderer.PROJ_MATRIX:
            return pCamera.projectionMatrix();
        case a.Renderer.EYE_POS:
            return pCamera.eyePosition();
        case a.Renderer.BIND_MATRIX:
            return (pRenderObject && pRenderObject.skin) ? pRenderObject.skin.getBindMatrix() : null;
        case a.Renderer.RENDER_OBJECT_ID:
            return pRenderObject.renderObjectId;
        default:
            warning("Unsupported system semantic");
            return null;
    }
};

//----PreRender applying methods----//
Renderer.prototype.applyBufferMap = function (pMap) {
    if (!pMap) {
        warning("Don`t have bufferMap");
        return true;
    }
    var pState = this._pPreRenderState;
    if (pState.iOffset === null || pState.iLength === null) {
        pState.iLength = pMap.length;
        pState.iOffset = pMap.offset;
        pState.pIndex = pMap.index;
        pState.eDrawPrimitive = pMap.primType;
    }
    else if (pState.iLength !== pMap.length ||
             pState.iOffset !== pMap.offset ||
             (pState.eDrawPrimitive !== null &&
              pState.eDrawPrimitive !== pMap.primType)) {
        warning("Can not blend buffer maps 1");
        return false;
    }
    else if (pState.pIndex !== undefined && pState.pIndex !== pMap.index) {
        warning("Can not blend buffer maps 2");
        return false;
    }

    var iPass = pState.pSnapshot._iCurrentPass;
    if (!pState.pAttributeData[iPass]) {
        pState.pAttributeData[iPass] = [];
    }
    var pData = pState.pAttributeData[iPass];
    var i, pFlow;
    for (i = 0; i < pMap._nCompleteFlows; i++) {
        pFlow = pMap._pCompleteFlows[i];
        if (pFlow.eType === a.BufferMap.FT_MAPPABLE) {
            pData.push(pFlow);
        }
        else {
            pData.push(pFlow.pData);
        }
    }
};
Renderer.prototype.applyVertexData = function (pData, ePrimType) {
    ePrimType = (ePrimType !== undefined) ? ePrimType : null;
    if (!pData) {
        warning("Don`t have vertex data");
        return true;
    }
    var pState = this._pPreRenderState;
    if (pState.iOffset === null || pState.iLength === null) {
        pState.iLength = pData.length;
        pState.iOffset = pData.offset;
        pState.eDrawPrimitive = ePrimType;
    }
    else if (pState.iLength !== pData.length ||
             pState.iOffset !== pData.offset ||
             (pState.eDrawPrimitive !== null && ePrimType !== null &&
              pState.eDrawPrimitive !== ePrimType)) {
        warning("Can not blend buffer maps 1");
        return false;
    }
    var iPass = pState.pSnapshot._iCurrentPass;
    if (!pState.pAttributeData[iPass]) {
        pState.pAttributeData[iPass] = [pData];
    }
    pState.pAttributeData[iPass].push(pData);
};
Renderer.prototype.applyFrameBufferTexture = function (pTexture, eAttachment, eTexTarget, iLevel) {
    if (this._pRenderState.iFrameBuffer === null) {
        return false;
    }
    var pDevice = this.pEngine.pDevice;
    eAttachment = (eAttachment === undefined) ? pDevice.COLOR_ATTACHMENT0 : eAttachment;
    eTexTarget = (eTexTarget === undefined) ? pDevice.TEXTURE_2D : eTexTarget;
    iLevel = 0;
    trace("Attach texture to farme buffer #" + this._pRenderState.iFrameBuffer);
    this._pRenderState.pFrameBuffer.frameBufferTexture2D(eAttachment, eTexTarget, pTexture._pTexture);
};
Renderer.prototype.applySurfaceMaterial = function (pMaterial) {
    this._pPreRenderState.pSurfaceMaterial = pMaterial;
    var pSnapshot = this._pPreRenderState.pSnapshot;
//    for (var i = 0; i < a.SurfaceMaterial.maxTexturesPerSurface; i++) {
//        if (pMaterial._pTexture[i]) {
//            pSnapshot.applyTextureBySemantic(a.fx.SHADER_PREFIX.TEXTURE + i, pMaterial._pTexture[i]);
//        }
//    }
};
Renderer.prototype.setViewport = function (x, y, width, height) {
    if (this._pPreRenderState) {
        this._pPreRenderState.setViewport(x, y, width, height);
    }
    this._pCurrentViewport.x = x;
    this._pCurrentViewport.y = y;
    this._pCurrentViewport.width = width;
    this._pCurrentViewport.height = height;
};

//----Accseosrs----//
Renderer.prototype.getUniformRealName = function (sName) {
    var pSnapshot = this._pPreRenderState.pSnapshot;
    var pBlend = this._pPreRenderState.pBlend;
    if (!pBlend || !pSnapshot) {
        return false;
    }
    return pBlend.pUniformsBlend[pSnapshot._iCurrentPass].pUniformsByName[sName];
};
Renderer.prototype.isUniformTypeBase = function (sRealName) {
    var pSnapshot = this._pPreRenderState.pSnapshot;
    var pBlend = this._pPreRenderState.pBlend;
    if (!pBlend || !pSnapshot) {
        return false;
    }
    return pBlend.pUniformsBlend[pSnapshot._iCurrentPass].pUniformsByRealName[sRealName].pType.isBase();
};

Renderer.prototype.getTextureRealName = function (sName) {
    var pSnapshot = this._pPreRenderState.pSnapshot;
    var pBlend = this._pPreRenderState.pBlend;
    if (!pBlend || !pSnapshot) {
        return false;
    }
    return pBlend.pUniformsBlend[pSnapshot._iCurrentPass].pTexturesByName[sName];
};
Renderer.prototype.getActiveProgram = function () {
    return this._pRenderState.pActiveProgram;
};
Renderer.prototype.totalPasses = function (pEffect) {
    var id = pEffect.resourceHandle();
    if (this._pEffectResoureBlend[id]) {
        return this._pEffectResoureBlend[id].totalValidPasses();
    }
    return 0;
};
Renderer.prototype.getActiveTexture = function (iSlot) {
    return this._pRenderState.pTextureSlots[iSlot];
};
Renderer.prototype.getTextureSlot = function (pTexture) {
    debug_assert(pTexture, "Texture must be");
    var i;
    for (i = 0; i < this._pRenderState.pTextureSlots.length; i++) {
        if (pTexture === this._pRenderState.pTextureSlots[i]) {
            return i;
        }
    }
    return -1;
};
Renderer.prototype.getViewport = function () {
    return this._pCurrentViewport;
};

Renderer.prototype.getPostEffectTarget = function () {
    return this._pPostEffectTarget;
};

//----Allocators----//
Renderer.prototype._getEmptyTextureSlot = function () {
    var i;
    for (i = 0; i < this._pRenderState.pTextureSlots.length; i++) {
        if (!this._pRenderState.pTextureSlots[i]) {
            return i;
        }
    }
    i = this._pRenderState.pActiveProgram.getEmptyTextureSlot();
    debug_assert(i !== undefined, "bad slot i");
    return i;
    // return this._pRenderState.pActiveProgram.getEmptyTextureSlot();
};
Renderer.prototype._getEmptyFrameBuffer = function () {
    var pDevice = this.pEngine.pDevice;
    var pEmptyBuffers = this._pEmptyFrameBuffers;
    var pFrameBuffer = null;
    var i = 0;
    for (i = 0; i < pEmptyBuffers.length; i++) {
        if (pEmptyBuffers[i] === null) {
            pEmptyBuffers[i] = this._pFramebufferPool[i];
            this._pFrameBufferCounters[i] = 0;
            return i;
        }
    }
    pFrameBuffer = new a.fx.FrameBuffer(this.pEngine);
    this._pFramebufferPool.push(pFrameBuffer);
    this._pFrameBufferCounters.push(0);
    pEmptyBuffers.push(0);
    return pEmptyBuffers.length - 1;
};
Renderer.prototype._releaseFrameBuffer = function (id) {
    trace("Release frame buffer");
//    var pDevice = this.pEngine.pDevice;
    this._pFrameBufferCounters[id] = 0;
    this._pEmptyFrameBuffers[id] = null;
    this._pFramebufferPool[id].release();
    this._activateFrameBuffer();
};
Renderer.prototype._tryReleaseFrameBuffer = function (id) {
    var nCount = this._pFrameBufferCounters[id];
    if (nCount > 0) {
        nCount--;
        this._pFrameBufferCounters[id] = nCount;
    }
    if (nCount === 0) {
        this._releaseFrameBuffer(id);
    }
};
Renderer.prototype._getTextureSlot = function (pTexture) {
    var i;
    for (i = 0; i < this._pRenderState.pTextureSlots.length; i++) {
        if (pTexture === this._pRenderState.pTextureSlots[i]) {
            return i;
        }
    }
    return -1;
};

//Public methods to activate data for render
Renderer.prototype.activateVertexBuffer = function (pBuffer, isAttribute) {
    if (!this._isRegisterResource(pBuffer)) {
        this.registerRenderResource(pBuffer);
    }
    if (this._pRenderState.pVertexBuffer === pBuffer &&
        this._pRenderState.iVertexBufferState === this._pRenderResourceCounter[pBuffer.toNumber()]) {
        return true;
    }
    this._pRenderState.pVertexBuffer = pBuffer;
    this._pRenderState.iVertexBufferState = this._pRenderResourceCounter[pBuffer.toNumber()];
    trace("Real bind buffer #" + pBuffer.toNumber());
    pBuffer.bind();
    return true;
};
Renderer.prototype.activateIndexBuffer = function (pBuffer) {
    if (!this._isRegisterResource(pBuffer)) {
        this.registerRenderResource(pBuffer);
    }
    if (this._pRenderState.pIndexBuffer === pBuffer &&
        this._pRenderState.iIndexBufferState === this._pRenderResourceCounter[pBuffer.toNumber()]) {
        return true;
    }
    this._pRenderState.pIndexBuffer = pBuffer;
    this._pRenderState.iIndexBufferState = this._pRenderResourceCounter[pBuffer.toNumber()];
    trace("Real bind index buffer #" + pBuffer.resourceHandle());
    pBuffer.bind();
    return true;
};
Renderer.prototype.activateProgram = function (pProgram) {
    if (this._pRenderState.pActiveProgram === pProgram) {
        trace("Program already active");
        pProgram._nActiveTimes++;
        return true;
    }
    var pDevice = this.pEngine.pDevice;
    var i;
    pProgram.activate();

    for (i = pProgram.getStreamNumber(); i < this._pRenderState.nAttrsUsed; i++) {
        trace("Disable attrib #" + i);
        pDevice.disableVertexAttribArray(i);
    }

    for (i = this._pRenderState.nAttrsUsed; i < pProgram.getStreamNumber(); i++) {
        trace("Enable attrib #" + i);
        pDevice.enableVertexAttribArray(i);
    }

    this._pRenderState.pActiveProgram = pProgram;
    this._pRenderState.nAttrsUsed = pProgram.getStreamNumber();
};
Renderer.prototype.activateFrameBuffer = function (iId) {
    iId = (iId === undefined) ? this._getEmptyFrameBuffer() : iId;
    this._pRenderState.iFrameBuffer = iId;
    this._activateFrameBuffer(iId);
    return iId;
};
Renderer.prototype.deactivateFrameBuffer = function (iId) {
    if (iId !== undefined) {
        this._releaseFrameBuffer(iId);
//        this._pEmptyFrameBuffers[iId] = null;
//        this._pFrameBufferCounters[iId] = 0;
        return true;
    }
    iId = this._pRenderState.iFrameBuffer;
    if (iId !== null) {
        if (this._pFrameBufferCounters[iId] === 0) {
            this._releaseFrameBuffer(iId);
        }
        else {
            this._pFrameBufferCounters[iId] *= -1;
        }
    }
    this._pRenderState.iFrameBuffer = null;
    return true;
};
Renderer.prototype._activateFrameBuffer = function (iId) {
    var pFrameBuffer = (iId === undefined || iId === null) ? null : this._pFramebufferPool[iId];
    if (this._pRenderState.pFrameBuffer === pFrameBuffer) {
        return true;
    }
    this._pRenderState.pFrameBuffer = pFrameBuffer;
    if (pFrameBuffer) {
        trace("activateFrameBuffer #" + iId);
        pFrameBuffer.bind();
    }
    else {
        trace("activateFrameBuffer DefaultRender");
        this.pDevice.bindFramebuffer(this.pDevice.FRAMEBUFFER, null);
    }
};

Renderer.prototype.bindTexture = function (pTexture) {
    if (this._pRenderState.pTexture === pTexture && this._pRenderState.pTexture._isTextureChanged === false) {
        return true;
    }
    trace("Real bind texture #" + pTexture.toNumber());
    this._pRenderState.pTexture = pTexture;
    pTexture._isTextureChanged = false;
    if (this._pRenderState.iTextureSlot >= -1) {
        this._pRenderState.pTextureSlotStates[this._pRenderState.iTextureSlot] = true;
    }
    pTexture.bind();
    return true;
};
Renderer.prototype.activateTexture = function (pTexture) {
    var i;
    var pSlots = this._pRenderState.pTextureSlots;
    var iSlot;
    iSlot = this._getTextureSlot(pTexture);
    if (iSlot >= 0) {
        if (this._pRenderState.pActiveProgram) {
            this._pRenderState.pActiveProgram.setTextureSlot(iSlot, pTexture);
        }
        return iSlot;
    }

    iSlot = this._getEmptyTextureSlot();
    debug_assert(iSlot !== undefined, "bad slot");
    pSlots[iSlot] = pTexture;
    this._pRenderState.pTextureSlotStates[iSlot] = true;
    if (this._pRenderState.pActiveProgram) {
        this._pRenderState.pActiveProgram.setTextureSlot(iSlot, pTexture);
    }
    return iSlot;
};
Renderer.prototype._activateTextureSlot = function (iSlot, pParams) {
    var pTexture = this._pRenderState.pTextureSlots[iSlot];
    var isBind = false;
    var isParamsEqual = pTexture._hasParams(pParams);
    var pDevice = this.pDevice;
    if (this._pRenderState.pTextureSlotStates[iSlot]) {
        this._pRenderState.iTextureSlot = iSlot;
        this._pRenderState.pTextureSlotStates[iSlot] = false;
        this.pDevice.activeTexture(a.TEXTUREUNIT.TEXTURE + (iSlot || 0));
        this._forceBindTexture(pTexture);
        isBind = true;
    }
    if (!isParamsEqual) {
        trace("TEXTURE PARAMS NOT EQUAL", pTexture);
        if (!isBind) {
            trace("Real activate slot");
            this.pDevice.activeTexture(a.TEXTUREUNIT.TEXTURE + (iSlot || 0));
            this._forceBindTexture(pTexture);
        }
        var eTarget = pTexture.target;
        pDevice.texParameteri(eTarget, a.TPARAM.MAG_FILTER, pParams[a.TPARAM.MAG_FILTER]);
        pDevice.texParameteri(eTarget, a.TPARAM.MIN_FILTER, pParams[a.TPARAM.MIN_FILTER]);
        pDevice.texParameteri(eTarget, a.TPARAM.WRAP_S, pParams[a.TPARAM.WRAP_S]);
        pDevice.texParameteri(eTarget, a.TPARAM.WRAP_T, pParams[a.TPARAM.WRAP_T]);
    }
    return true;
};
Renderer.prototype._forceBindTexture = function (pTexture) {
    trace("Real bind texture(FORCE) #" + pTexture.toNumber());
    this._pRenderState.pTexture = pTexture;
    pTexture.bind();
    return true;
};

//----Real render methods----//
Renderer.prototype.render = function (pEntry) {
    var pProgram = pEntry.pProgram;
    var pAttrs = pEntry.pAttributes;
    var pUniforms = pEntry.pUniforms;
    var pTextures = pEntry.pTextures;
    var pDevice = this.pDevice;
    var i;
    trace("-------START REAL RENDER---------");
    this._activateFrameBuffer(pEntry.iFrameBuffer);

    this.activateProgram(pProgram);

    pProgram.setCurrentTextureSet(pTextures);

    for (i = 0; i < pAttrs.length; i++) {
        pProgram.applyData(pAttrs[i], i);
    }

    var pUniformKeys = Object.keys(pUniforms);
    for (i = 0; i < pUniformKeys.length; i++) {
        pProgram.applyUniform(pUniformKeys[i], pUniforms[pUniformKeys[i]]);
    }
    pProgram.activateTextures();
    pProgram.setCurrentTextureSet(null);
    pProgram.resetActivationStreams();

    this._setViewport(pEntry.iViewportX, pEntry.iViewportY, pEntry.iViewportWidth, pEntry.iViewportHeight);

    if (pEntry.eDrawPrim === null) {
        pEntry.eDrawPrim = a.PRIMTYPE.POINTLIST;
        warning("Primitive type are not passed. Set to POINTS");
    }
    if (pEntry.pIndexData) {
        this.activateIndexBuffer(pEntry.pIndexData);
        pDevice.drawElements(pEntry.eDrawPrim, pEntry.pIndexData.getCount(),
                             pEntry.pIndexData.getType(), pEntry.pIndexData.getOffset());
    }
    else {
        pDevice.drawArrays(pEntry.eDrawPrim, pEntry.iOffset, pEntry.iLength);
    }
    if (pEntry.iFrameBuffer !== null) {
        this._tryReleaseFrameBuffer(pEntry.iFrameBuffer);
    }
//    pProgram.clear();
    this._pCurrentRenderQueue._releaseEntry(pEntry);
    trace("-------STOP REAL RENDER---------");
};
Renderer.prototype._setViewport = function (x, y, width, height) {
    this.pDevice.viewport(x, y, width, height);
};
Renderer.prototype.clearScreen = function (eValue, v4fColor) {
    v4fColor = v4fColor || this._pDefaultColor;
    var pData = v4fColor.pData;
    this.pDevice.clearColor(pData.X, pData.Y, pData.Z, pData.W);
    this.pDevice.clear(eValue);
};

//----Render resources----//
Renderer.prototype.vertexBufferChanged = function (pBuffer) {
    pBuffer = pBuffer || this._pRenderState.pVertexBuffer;
    if (!pBuffer) {
        return false;
    }
    trace("Vertex buffer changed #" + pBuffer.resourceHandle());
    this._renderResourceChanged(pBuffer);
};
Renderer.prototype.indexBufferChanged = function (pBuffer) {
    pBuffer = pBuffer || this._pRenderState.pIndexBuffer;
    if (!pBuffer) {
        return false;
    }
    this._renderResourceChanged(pBuffer);
};
Renderer.prototype.getRenderResourceState = function (pResource) {
    if (!this._pRenderResources[pResource.toNumber()]) {
        return false;
    }
    return this._pRenderResourceCounter[pResource.toNumber()]
};
Renderer.prototype.registerRenderResource = function (pResource) {
    var id = pResource.toNumber();
    if (this._pRenderResources[id]) {
        this._pRenderResources[id] = pResource;
        this._pRenderResourceCounter[id]++;
    }
    else {
        this._pRenderResources[id] = pResource;
        this._pRenderResourceCounter[id] = 0;
        this._pRenderResourceCounterKeys.push(id);
    }
};
Renderer.prototype.releaseRenderResource = function (pResource) {
    var id = pResource.toNumber();
    var pCounters = this._pRenderResourceCounter;
    var pResources = this._pRenderResources;
    if (pResources[id]) {
        pCounters[id]++;
        pResources[id] = null;
    }
};
Renderer.prototype._renderResourceChanged = function (pResource) {
    var id = pResource.toNumber();
    var pCounters = this._pRenderResourceCounter;
    if (!pCounters[id]) {
        this.registerRenderResource(pResource);
    }
    pCounters[id]++;
};

Renderer.prototype._clearRenderResources = function () {
    var i;
    var pCounters = this._pRenderResourceCounter;
    var pResources = this._pRenderResources;
    var pKeys = this._pRenderResourceCounterKeys;
    var id;
    for (i = 0; i < pKeys.length; i++) {
        id = pKeys[i];
        if (pResources[id] !== null) {
            pCounters[id] = 0;
        }
        else {
            delete pCounters[id];
            delete pResources[id];
            pKeys.splice(i, 1);
            i--;
        }
    }
};
Renderer.prototype._isRegisterResource = function (pResource) {
    return !!(this._pRenderResources[pResource.toNumber()]);
};
Renderer.prototype._disableShaderProgram = function (pProgram) {
    this._pPrograms[pProgram._sHash] = null;
};
Renderer.prototype._getStreamState = function (iStream) {
    return this._pStreamState[iStream];
};
Renderer.prototype._occupyStream = function (iStream, pProgram) {
    this._pStreamState[iStream] = pProgram.toNumber();
};

//Render stage control
Renderer.prototype.switchRenderStage = function (eType) {
    this._eCurrentRenderStage = eType;
};
Renderer.prototype.pushRenderEntry = function (pEntry) {
    if (this._pCurrentRenderQueue) {
        this._pCurrentRenderQueue.addSortEntry(pEntry);
        return true;
    }
    else {
        warning("No render queue");
        return false;
    }
};
Renderer.prototype.processRenderStage = function () {
    var eType = this._eCurrentRenderStage;
    if (eType === a.RenderStage.SHADOWS) {
        this._pCurrentRenderQueue = this._pShadowRenderQueue;
        this._pCurrentRenderQueue.execute();
    }
    else if (eType === a.RenderStage.GLOBALPOSTEFFECTS) {
        this._pCurrentRenderQueue = this._pGlobalPostEffectRenderQueue;
        this._pCurrentRenderQueue.execute();
    }
    else if (eType === a.RenderStage.DEFAULT) {
        this._pCurrentRenderQueue = this._pDefaultRenderQueue;
        this._pCurrentRenderQueue.execute();
    }
    else if (eType === a.RenderStage.LIGHTINGS) {
        var pQueues = this._pLightingRenderQueues;
        var i;
        var pLightManager = this.pEngine.lightManager();
        var iLength = pLightManager.getDeferredTextureCount();
        for (i = 0; i < iLength; i++) {
            this.activateFrameBuffer(pLightManager.deferredFrameBuffers[i]);
            this.clearScreen(a.CLEAR.DEPTH_BUFFER_BIT | a.CLEAR.COLOR_BUFFER_BIT, Vec4(0));
            this._pCurrentRenderQueue = pQueues[i];
            pQueues[i].execute();
//            this.pDevice.flush();
            this.activateFrameBuffer(null);
        }
    }
    this._pCurrentRenderQueue = null;
    this._eCurrentRenderStage = null;
};


/**
 * Функция инициализации, вызываемая в инициализации менеджеров.
 * @treturn Boolean
 */
Renderer.prototype.initialize = function () {
    this.pDevice.clearStencil(0.);
    this.pDevice.clearDepth(1.0);

    this._pDefaultRenderQueue.init();
    this._pShadowRenderQueue.init();
    this._pGlobalPostEffectRenderQueue.init();
    for (var i = 0; i < this._pLightingRenderQueues.length; i++) {
        this._pLightingRenderQueues[i].init();
    }
    this._pEffectFileDataPool.registerResourcePool(
        new a.ResourceCode(a.ResourcePoolManager.VideoResource,
                           a.ResourcePoolManager.EffectFileData));
    return true;
};

/**
 * Аналог деструктора, вызываемого при уничтожении менеджера.
 * @treturn Boolean
 */
Renderer.prototype.destroy = function () {
    return true;
};


Renderer.prototype.restoreDeviceResources = function () {
    return true;
};

Renderer.prototype.destroyDeviceResources = function () {
    return true;
};

Renderer.prototype.createDeviceResources = function () {
    this._pPostEffectTarget = new a.Mesh(this.pEngine, 0, 'screen-sprite');//a.RenderDataBuffer.VB_READABLE
    var pSubMesh = this._pPostEffectTarget.createSubset('screen-sprite :: main', a.PRIMTYPE.TRIANGLESTRIP);
    pSubMesh.data.allocateAttribute([VE_VEC2('POSITION')], new Float32Array([-1, -1, -1, 1, 1, -1, 1, 1]));
    pSubMesh.effect.create();
    pSubMesh.effect.use("akra.system.deferredShading");
    pSubMesh.effect.use("akra.system.omniLighting");
    pSubMesh.effect.use("akra.system.projectLighting");
    pSubMesh.effect.use("akra.system.omniShadowsLighting");
    pSubMesh.effect.use("akra.system.projectShadowsLighting");

    return true;
};

Renderer.prototype.disableDeviceResources = function () {
    return true;
};

a.Renderer = Renderer;
