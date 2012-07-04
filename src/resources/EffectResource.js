/**
 * @@file
 * @brief Ресурс эффекта.
 * @author reinor
 * @author IvanPopov
 */

/**
 * EffectResource class
 * @ctor
 * constructor of EffectResource class
 *
 */
function EffectResource (pEngine) {
    EffectResource.superclass.constructor.apply(this, arguments);

    Enum([
             REPLICATION_BIT = 0x01,
             MIXING_BIT = 0x02
         ], EFFECT_RESOURCE_FLAGS, a.EffectResource);

    /**
     * Менеджер данного эффекта.
     * @type ShaderManager
     * @private
     */
    this._pShaderManager = pEngine.pShaderManager;

    /**
     * Количество пассов для данного эффекта.
     * @type Uint
     * @private
     */
    this._nTotalPasses = 0;

    /**
     * Флаги данного эффекта.
     * @type Int
     * @private
     */
    this._iMode = 0;

    /**
     * States for all passes in effect.
     * @type Array
     * @private
     */
    this._pPassStates = [];

    this._pModificationCallbacks = [];
}


EXTENDS(EffectResource, a.ResourcePoolItem);

EffectResource.prototype.isEqual = function (pEffect) {
    'use strict';
    
    if (this._iMode === pEffect._iMode && this._nTotalPasses === pEffect._nTotalPasses) {
        return this.magicMethod() === pEffect.magicMethod();
    }
    
    return false;
};

EffectResource.prototype.getManager = function () {
    return this._pShaderManager;
};

/**
 * return number of passes for the effect
 * @treturn Int
 */
PROPERTY(EffectResource, 'totalPasses',
    function () {
        return this._nTotalPasses;
    });

EffectResource.prototype.setModificationRoutine = function (fn) {
    for (var i = 0; i < this._pModificationCallbacks.length; i++) {
        if (this._pModificationCallbacks[i] == fn) {
            return true;
        }
    };

    this._pModificationCallbacks.push(fn);
};

EffectResource.prototype.delModificationRoutine = function(fn) {
    for (var i = 0; i < this._pModificationCallbacks.length; i++) {
        if (this._pModificationCallbacks[i] == fn) {
            this._pModificationCallbacks.splice(i, 1);
            return true;
        }
    };
    return false;
};

/**
 * Определить, является ли эффект тиражируемым
 */
EffectResource.prototype.replicable = function (bValue) {
    bValue = bValue || true;
    SET_BIT(this._iMode, a.EffectResource.REPLICATION_BIT, bValue);
};

EffectResource.prototype.isReplicated = function () {
    return TEST_BIT(this._iMode, a.EffectResource.REPLICATION_BIT);
};

EffectResource.prototype.miscible = function (bValue) {
    bValue = bValue || true;
    SET_BIT(this._iMode, a.EffectResource.MIXING_BIT, bValue);
};

EffectResource.prototype.isMixid = function () {
    return TEST_BIT(this._iMode, a.EffectResource.MIXING_BIT);
};

/**
 * Есть ли параметр с таким именем/семантикой
 * @tparam  Enumeration(MATRIX_HANDLES,PARAMETER_HANDLES)/String Параметр.
 * @treturn Boolean
 */
EffectResource.prototype.isParameterUsed = function (pParameter, iPass) {
    return (this.findParameter(pParameter, iPass)? true: false);
};

EffectResource.prototype.totalComponents = function () {
    return this._pShaderManager.getComponentCount(this);
};

EffectResource.prototype.getComponent = function (i) {
    return this._pShaderManager.getComponent(this, i);
};

/**
 * Получить параметр эффекта.
 * @treturn EffectParameter
 */
EffectResource.prototype.findParameter = function (pParameter, iPass) {
    iPass = ifndef(iPass, SM_UNKNOWN_PASS);
    return this._pShaderManager.findParameter(this, pParameter, iPass, a.ShaderManager.PARAMETER_FLAG_ALL);
};



/**
 * innitialize the resource (called once)
 * @treturn Boolean always true
 */
EffectResource.prototype.createResource = function () {

    this._pShaderManager.registerEffect(this);
    this.miscible();

    this.notifyCreated();
    this.notifyDisabled();
    this.notifyLoaded();
    return true;
};

/**
 * destroy the resource
 * @treturn Boolean always true
 */
EffectResource.prototype.destroyResource = function () {
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
EffectResource.prototype.disableResource = function () {
//    if (this._pEffect != null) {
//        this._pEffect.onLostDevice();
//    }
    debug_assert(this.isResourceCreated(),
                 "The resource has not been created.");

    this.notifyDisabled();
    return true;
};

/**
 * prepare the resource for use (create any volatile memory objects needed)
 * @treturn Boolean always true
 */
EffectResource.prototype.restoreResource = function () {
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
 * @tparam String sTechnique - technique name
 * @treturn Boolean true if succeeded, otherwise false
 */
EffectResource.prototype.loadResource = function (sFileName) {
    this.notifyUnloaded();
    TODO('Загрузка эффект ресурса');

    //TODO notifyLoaded
    return true;
};

/**
 *
 * @tparam ResourceHandle iComponentHandle
 * @return Boolean
 */
EffectResource.prototype.use = function (iComponentHandle, nShift, isSet) {
    nShift = ifndef(nShift, 0);
    isSet = ifndef(isSet, true);

    debug_assert(this._iCurrentPass === SM_UNKNOWN_PASS, 'нельзя добавить компонентов во время активированного пасса.')

    var pManager = this._pShaderManager;

    if (typeof iComponentHandle === 'object') {
        iComponentHandle = iComponentHandle.resourceHandle();
    }

    if (isSet) {
        if (!pManager.activateComponent(this, iComponentHandle, nShift)) {
            debug_error('Невозможно добавить ингридиент.');
            return false;
        }
    }
    else {
        if (!pManager.deactivateComponent(this, iComponentHandle, nShift)) {
            debug_error('Невозможно убрать ингридиент.');
            return false;
        }
    }

    if (this.totalComponents() == 1 && isSet) {
        this.notifyRestored();
    }
    else if (this.totalComponents() == 0 && !isSet) {
        this.notifyDisabled();
    }

    return this._updateParameterList(iComponentHandle, isSet);
};

EffectResource.prototype.unUse = function (iComponentHandle, nShift) {
    return this.use(iComponentHandle, nShift, false);
};

EffectResource.prototype._updateParameterList = function (iComponentHandle, isSet) {
    var pManager = this._pShaderManager;
    var pParameterList, pParameter, pReservedParameter;
    var nTotalPasses;
    var pPassState = this._pPassStates;
    var i;

    nTotalPasses = pManager.getTotalPasses(iComponentHandle);
    this._nTotalPasses = Math.max(this._nTotalPasses, nTotalPasses);

    for (i = 0; i < nTotalPasses; i++) {
        pParameterList = pManager.getParameterList(iComponentHandle, i, a.ShaderManager.PARAMETER_FLAG_NONSYTEM);
        if (!pParameterList) {
            continue;
        }

        if (!pPassState[i]) {
            pPassState[i] = pPassState = {};
        }

        for (var j = 0; j < pParameterList.length; ++j) {
            pParameter = pParameterList[j];
            pReservedParameter = pPassState[pParameter.name];

            if (pReservedParameter === undefined && isSet) {
                pReservedParameter = {
                    nUses: 0,
                    pValue: null  //значение по умолчанию
                }

                if (pParameter.isArray()) {
                    pReservedParameter.pValue = GEN_ARRAY(null, pParameter.numElements());
                }

                pPassState[pParameter.name] = pReservedParameter;
            }


            pReservedParameter.nUses += (isSet? 1: -1);

            if (pReservedParameter.nUses === 0) {
                delete pPassState[pParameter.name];
            }
        }
    }

    for (var i = 0; i < this._pModificationCallbacks.length; i++) {
        if (this._pModificationCallbacks[i] == fn) {
            this._pModificationCallbacks(this);
        }
    };

    return true;
};



/**
 * save resource in sFileName file (not implemented yet)
 * @tparam String sFileName
 * @treturn true if succeeded, otherwise false
 */
EffectResource.prototype.saveResource = function (sFileName) {
    return true;
};



a.EffectResource = EffectResource;

Define(a.EffectResourceManager(pEngine), function () {
    a.ResourcePool(pEngine, a.EffectResource)
});


//===============================================

function EffectAccessor (pEngine) {
    this._pShaderManager = pEngine.pShaderManager;
    this._pEffectResource = null;
}

EffectAccessor.prototype.addComponent = function(sComponentName, nShift) {
    
};