Define(SM_INVALID_EFFECT, -1);
Define(SM_INVALID_TECHNIQUE, -1);
Define(SM_UNKNOWN_PASS, -1);

function ComponentBlend() {
    this.pPassBlends = [];
    this.pUniformsBlend = [];
    this.sHash = "";
    this.pComponentsHash = {};
    this.pComponentsProp = [];
    this.pComponents = [];
    this._id = 0;
}
ComponentBlend.prototype.addComponent = function (pComponent, pProp) {
    //TODO: think about global uniform lists and about collisions of real names in them
    var i, j;
    var pPass;
    var pUniforms;
    var sName;
    var pVar1, pVar2;
    sName = pComponent.hash(pProp);
    if (this.pComponentsHash[sName]) {
        trace("You try to add already used component in blend");
        return;
    }

    this.sHash += sName + ":";
    this.pComponentsHash[sName] = pComponent;
    this.pComponents.push(pComponent);
    this.pComponentsProp.push(pProp);
    var nShift = pProp.nShift;
//    if()
    for (i = 0; i < pComponent.pPasses.length; i++) {
        if (!this.pPassBlends[i + nShift]) {
            this.pPassBlends[i + nShift] = [];
            this.pUniformsBlend[i + nShift] = {
                "pUniformsByName"     : {},
                "pUniformsByRealName" : {},
                "PUniformsValues"     : {},
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
            pUniforms.PUniformsValues[sName] = null;
        }
    }
};

A_NAMESPACE(ComponentBlend, fx);

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


    Enum([MAX_TEXTURE_HANDLES = a.SurfaceMaterial.maxTexturesPerSurface],
         eTextureHandles, a.ShaderManager);

    this.pEngine = pEngine;
    this._nEffectFile = 1;
    this._pComponentManager = pEngine.displayManager().componentPool();
    this._pComponentBlendsHash = {"EMPTY" : null};
    this._pComponentBlendsId = {0 : null};
    this._nComponentBlends = 1;
//    this._pActivatedPrograms = new Array(32);
//    this._pActivatedPrograms[0] = 0;
//    this._nLastActivatedProgram = 0;
    STATIC(pDefaultProp, {"nShift" : 0});
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
    if (this._pComponentManager.findResource(sName)) {
        return false;
    }
    var pComponent = this._pComponentManager.createResource(sName);
    pComponent.init(pTechnique);
    var pComponents = pComponent.pComponents;
    var pProps = pComponent.pComponentsProp;
    if (pComponents) {
        var pNewComponents = [];
        var pNewComponentsProp = [];
        var pComponentsHash = {};
        var pCompComp;
        var pCompProp;
        var i, j;
        for (i = 0; i < pComponents.length; i++) {
            sName = pComponents[i].hash(pProps[i]);
            if(!pComponentsHash[sName]){
                if(pComponents[i].pComponents){
                    pCompComp = pComponents[i].pComponents;
                    pCompProp = pComponents[i].pComponentsProp;
                    for(j = 0; j < pCompComp.length; j++){
                        sName = pCompComp[j].hash(pCompProp[j]);
                        if(!pComponentsHash[sName]){
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
        pComponent.pComponentsProp = pNewComponents;
    }
    return true;
};
ShaderManager.prototype.getComponentByName = function (sName) {
    return this._pComponentManager.findResource(sName);
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
        var pComponentsHash = {};
        var pComponentsProp = [];
        var pComponentsObj = [];
        var sName, sHash = "";
        var pComponent;
        for (i = 0; i < pComponents.length; i++) {
            pComponent = pComponents[i];
            sName = pComponent.sName + ">>>" + 0;
            if (!pComponentsHash[sName]) {
                if (pComponent.pComponents) {
                    for (j = 0; j < pComponent.pComponents.length; j++) {
                        sName = pComponent.pComponents[j].hash(pComponent.pComponentsProp[j]);
                        if (!pComponentsHash[sName]) {
                            pComponentsHash[sName] = pComponent.pComponents[j];
                            pComponentsObj.push(pComponent.pComponents[j]);
                            pComponentsProp.push(pComponent.pComponentsProp[j]);
                            sHash += sName + ":";
                        }
                    }
                }
                sName = pComponent.hash(a.ShaderManager.pDefaultProp);
                pComponentsHash[sName] = pComponent;
                pComponentsObj.push(pComponent);
                pComponentsProp.push(a.ShaderManager.pDefaultProp);
                sHash += sName + ":";
            }
        }
        if (this._pComponentBlendsHash[sHash]) {
            return this._pComponentBlendsHash[sHash];
        }
        else {
            this._generateBlendComponents(pComponentsObj, pComponentsProp);
        }
    }
};
/**
 * Create new ComponentBlend and register it
 * @param {Component[]} pComponents
 * @param {Object[]} pComponentsProp Properties for each component
 * @return {Int}
 * @private
 */
ShaderManager.prototype._generateBlendComponents = function (pComponents, pComponentsProp) {
    var pBlend = new a.fx.ComponentBlend();
    var i;
    for (i = 0; i < pComponents.length; i++) {
        pBlend.addComponent(pComponents[i], pComponentsProp[i]);
    }
    return this._registerComponentBlend(pBlend);
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
 * @param {String || Int} handle Hash or id for components blend
 * @param {String} sComponent Name of blending component
 * @param {Object} pProp Property of blending this component
 * @return {Boolean} True to add component
 */
ShaderManager.prototype._addComponentToBlend = function (handle, sComponent, pProp) {
    var pBlend;
    if (typeof(handle) === "number") {
        pBlend = this._pComponentBlendsId[handle];
    }
    else {
        pBlend = this._pComponentBlendsHash[handle];
    }
    if (!pBlend) {
        warning("We can`t find component with so handle: " + handle);
        return false;
    }
    var pComponent = this._pComponentManager.findResource(sComponent);
    var sName = pComponent.hash(pProp);
    var sHash = pBlend.sHash;
    var i;
    if (!pBlend.pComponentsHash[sName]) {
        var pComponentsHash = {};
        var pComponentsProp = [];
        var pComponentsObj = [];
        if (pComponent.pComponents) {
            for (i = 0; i < pComponent.pComponents.length; i++) {
                sName = pComponent.pComponents[i].hash(pComponent.pComponentsProp[i]);
                if (!pBlend.pComponentsHash[sName]) {
                    pComponentsHash[sName] = pComponent.pComponents[i];
                    pComponentsObj.push(pComponent.pComponents[i]);
                    pComponentsProp.push(pComponent.pComponentsProp[i]);
                    sHash += sName + ":";
                }
            }
        }
        sName = pComponent.hash(pProp);
        pComponentsHash[sName] = pComponent;
        pComponentsObj.push(pComponent);
        pComponentsProp.push(pProp);
        sHash += sName + ":";
    }

    if (this._pComponentBlendsHash[sHash]) {
        return this._pComponentBlendsHash[sHash];
    }
    else {
        var pNewBlend = this._newBlendFromBlend(pBlend, pComponentsObj, pComponentsProp);
        if (!this._registerComponentBlend(pNewBlend)) {
            return false;
        }
        return pNewBlend;
    }
};
/**
 * Create new component blend from pBlend and new components
 * @param {ComponentBlend} pBlend
 * @param {Component[]} pComponentsObj Components to add
 * @param {Object []} pComponentsProp Property of blending for corresponding component
 * @private
 */
ShaderManager.prototype._newBlendFromBlend = function (pBaseBlend, pComponents, pComponentsProp) {
    var pBlend = new a.fx.ComponentBlend();
    var i;
    for (i = 0; i < pBaseBlend.pComponents.length; i++) {
        pBlend.addComponent(pBaseBlend.pComponents[i], pBaseBlend.pComponentsProp[i]);
    }
    for (i = 0; i < pComponents.length; i++) {
        pBlend.addComponent(pComponents[i], pComponentsProp[i]);
    }
    return pBlend;
};
//ShaderManager.prototype._generateBlendComponentHash = function (pBase, pAdd, nShift) {
//    var sName;
//    var i;
//    var sHash = pBase.sHash;
//    if (pAdd instanceof a.fx.Component) {
//        sName = pAdd.sName + ">>>" + nShift;
//        if (pBase.pComponents && pBase.pComponents[sName]) {
//            trace("Nothing to add in component");
//            return sHash;
//        }
//        else {
//            if (pAdd.pComponents) {
//                for (i = 0; i < pAdd.pComponents.length; i += 2) {
//                    sName = pAdd.pComponents[i].sName + ">>>" + (pAdd.pComponents[i + 1] + nShift);
//                    if (!pBase.pComponents[sName]) {
//                        sHash += sName + ":";
//                    }
//                }
//            }
//            sHash += pAdd.sName + ">>>" + nShift + ":";
//        }
//    }
//    else {
//        for (i = 0; i < pAdd.pComponents.length; i += 2) {
//            sName = pAdd.pComponents[i].sName + ">>>" + (pAdd.pComponents[i + 1] + nShift);
//            if (!pBase.pComponents[sName]) {
//                sHash += sName + ":";
//            }
//        }
//    }
//    return sHash;
//};

ShaderManager.prototype.activateProgram = function (pProgram) {
    // if (this._pActivatedPrograms[this._nLastActivatedProgram] !== pProgram) {
    //     trace('bind Program', pProgram.resourceHandle());
    //     this._pActivatedPrograms[++this._nLastActivatedProgram] = pProgram;
    this._pActiveProgram = pProgram;
    pProgram.bind();
    // }
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
    return false;
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
    return false;
};

ShaderManager.prototype.begin = function (iEffectHandle) {
    return false;
};

ShaderManager.prototype.end = function (iEffectHandle) {
    return false;
};

ShaderManager.prototype.activatePass = function (iEffectHandle, iPass) {
    return false;
};

ShaderManager.prototype.deactivatePass = function (iEffectHandle) {
    return false;
};

/**
 * ДеАктивация компонента для эффект ресурса.
 * @tparam EffectResource/ResourceHandle pEffectResource
 * @tparam iComponentHandle
 * @treturn Boolean
 */
ShaderManager.prototype.deactivateComponent = function (pEffectResource, iComponentHandle, nShift) {
    return false;
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
