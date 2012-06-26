Define(SM_INVALID_EFFECT, -1);
Define(SM_INVALID_TECHNIQUE, -1);
Define(SM_UNKNOWN_PASS, -1);

function ComponentBlend() {
    this._pPasses = {};
    this._nTotalPasses = 0;
    this._hasPostComponent = false;
}
;
/**
 * Add component to blend
 * @tparam pComponent
 * @tparam nShift
 * @treturn Boolean
 */
ComponentBlend.prototype.addComponent = function (pComponent, nShift) {
    if (this._hasPostComponent && !pComponent.isPost) {
        warning("It`s impossible add non post component " + pComponent.sName +
                " if effect already have post Component.");
        return false;
    }
    if (pComponent.isPost) {
        this._hasPostComponent = true;
    }
    var i;
    var pPasses = this._pPasses;
    var nTotal = pComponent.totalPasses();
    for (i = nShift; i < nTotal + nShift; i++) {
        if (!pPasses[i]) {
            pPasses[i] = [];
        }
        pPasses[i].push(pComponent.getPass(i - nShift));
    }
    if (this._nTotalPasses < nTotal + nShift) {
        this._nTotalPasses = nTotal + nShift;
    }
    return true;
};
ComponentBlend.prototype.totalPasses = function () {
    return this._nTotalPasses;
};
ComponentBlend.prototype.blend = function () {
    var i;
    for (i = 0; i < this._nTotalPasses; i++) {
        //TODO:blend passes
    }
    return true;
};

function EffectBlend() {
    this._pPasses = {};
    this._nTotalPasses = 0;
    this._nLastShift = 0;
    this._nLastPasses = 0;
}
;
/**
 * Add component to blend
 * @tparam pComponent
 * @tparam nShift
 * @treturn Boolean
 */
EffectBlend.prototype.addEffect = function (pComponentBlend, nShift) {

};
EffectBlend.prototype.totalPasses = function () {
    return this._nTotalPasses;
};
EffectBlend.prototype.blend = function () {
    var i;
    for (i = 0; i < this._nTotalPasses; i++) {
        //TODO:blend effects
    }
    return true;
};
EffectBlend.prototype.createHash = function () {

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


    Enum([MAX_TEXTURE_HANDLES = a.SurfaceMaterial.maxTexturesPerSurface],
         eTextureHandles, a.ShaderManager);

    this.pEngine = pEngine;

    this._pComponentPool = {};
    this._pFXPool = new a.EffectFileManager(pEngine);
    this._pFXPool.initialize(16);
    this._pEffectResources = {};
    this._pEffectInfo = {};
    this._pShaderPrograms = {};
    this._ppLoadedEffects = {};
    this._ppWaitList = {};
    this._pCurrentEffectBlend = null;

}

/**
 * TODO:IMPORTANT_!!!!ВАЖНО!!!!
 *
 * необходимо проставлять значения по умолчанию для глобальных системных семантик
 * если этого небыло сделано извне.
 *
 * Пример: Если при рендиринге не была передана камера, а текущий смешанный шейдер имеет ее параметры,
 * надо подать текущую активную камеру движака!
 */

/**
 * Load *.fx file or *.abf
 * @tparam String sFileName
 * @tparam String sName name of Effect. So name of components from file will be: "sName" + ":" + "sTechniqueName"\n
 *                      Example: "baseEffect:GEOMETRY", "lightEffect:POINT"
 */
ShaderManager.prototype.loadEffectFile = function (sFileName, sName) {
    var reExt = /^(.+)(\.fx|\.abf)$/;
    var pRes = reExt.exec(sFileName);
    var pEffect;
    if (!pRes) {
        warning("File has wrong extension! It must be .fx or .abf!");
        return false;
    }
    sName = sName || pRes[0];
    pEffect = this._ppLoadedEffects[sFileName];
    var me = this;
    var fnInitEffect = function () {
        if (this.isResourceLoaded()) {
            this.delChangesNotifyRoutine(fnInitEffect);
            var pTechniques = pEffect.pTechniques;
            for (var i in pTechniques) {
                if (!me.initComponent(sName, pTechniques[i])) {
                    warning("Can not initialize component from effect " + sFileName +
                            " with name " + pTechniques[i].name + "!");
                }
            }
        }
    }
    if (!pEffect) {
        pEffect = this._ppLoadedEffects[sFileName] = this._pFXPool.loadResource(sFileName);
        pEffect.setChangesNotifyRoutine(fnInitEffect);
    }

    var pWaitList = this._ppWaitList;
    var i;
    for (i in pWaitList) {
        if (this._pComponentPool[i]) {
            pWaitList[i].componentReady(i);
            continue;
        }
        warning("Component " + i + " don`t loaded yet.");
    }
};
/**
 * Initialization component from technique. Name of component will be 'sEffectName' + ':' + 'pTechnique.sName'
 * @tparam sEffectName
 * @tparam pTechnique
 * @treturn Boolean True if all Ok, False if we already have this component.
 */
ShaderManager.prototype.initComponent = function (sEffectName, pTechnique) {
    var sName = sEffectName + ":" + pTechnique.sName;
    if (this._pComponentPool[sName]) {
        warning("We already load component with name: " + sName);
        return false;
    }
    else {
        var pComponent = new a.Component();
        pComponent.set(sName, pTechnique);
        this._pComponentPool[sName] = pComponent;
        return true;
    }
};

/**
 * Регистрация нового эффект ресурса.
 * @tparam EffectResource pEffectResource
 * @treturn Boolean
 */
ShaderManager.prototype.registerEffect = function (pEffectResource) {
    this._pEffectResources[pEffectResource.resourceHandle()] = new ComponentBlend;
    return false;
};

/**
 * Регистрация компонента эффекта.
 * @tparam pEffectComponent pEffectComponent
 * @treturn Boolean
 */
ShaderManager.prototype.registerComponent = function (pEffectComponent) {
    return false;
};

/**
 * Активация компонента для эффект ресурса.
 * @tparam EffectResource/ResourceHandle pEffectResource
 * @tparam iComponentHandle
 * @tparam Uint nShift Смещение пассов
 * @treturn Boolean
 */
ShaderManager.prototype.activateComponent = function (pEffectResource, sComponentName, nShift) {
    var pComponentBlend = this._pEffectResources[pEffectResource.resourceHandle()];
    var pComponent = this._pComponentPool[sComponentName];
    nShift = nShift || 0;
    if (!pComponent) {
        warning("We can not find component with name " + sComponentName);
    }
    return pComponentBlend.addComponent(pComponent, nShift);
};
ShaderManager.prototype.pushEffect = function (iEffectHandle) {
    //TODO:Generate blend of components
    if (iEffectHandle === "object") {
        iEffectHandle = iEffectHandle.resourceHandle();
    }
    var pComponentBlend = this._pEffectResources[iEffectHandle];
    pComponentBlend.blend();
    if(!this._pCurrentEffectBlend){
        this._pCurrentEffectBlend = new EffectBlend();
    }
    this._pCurrentEffectBlend.addEffect(pComponentBlend);
    return pComponentBlend.totalPasses();
};
ShaderManager.prototype.popEffect = function (iEffectHandle) {
    return false;
};
ShaderManager.prototype.activatePass = function (iEffectHandle, iPass) {
    if (iEffectHandle === "object") {
        iEffectHandle = iEffectHandle.resourceHandle();
    }
    var pComponentBlend = this._pEffectResources[pEffectResource.resourceHandle()];
    this._pCurrentEffectBlend.activatePass(iPass);
    return false;
};

ShaderManager.prototype.deactivatePass = function (iEffectHandle) {
    return false;
};

ShaderManager.prototype.begin = function (iEffectHandle) {
    return false;
};

ShaderManager.prototype.end = function (iEffectHandle) {
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

a.ShaderManager = ShaderManager;

