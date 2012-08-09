/**
 * @file
 * @author Ivan Popov
 * Container for render method for uniform states saving.
 */

/**
 * Container for method and state.
 * @ctor
 * @property RenderSnapshot(String sRenderMethod = null)
 * @memberOf RenderSnapshot
 * @param {String} sRenderMethod Path to render method.
 */
/**
 * Container for method and state.
 * @ctor
 * @property RenderSnapshot(pRenderMethod = null)
 * @param {RenderMethod} pRenderMethod Render method.
 * @memberOf RenderSnapshot
 */
function RenderSnapshot() {
    this._sName = null;
    this._pRenderMethod = null;
    this._pShaderManager = null;
    /**
     * Current render pass.
     * @type Int
     * @private
     */
    this._iCurrentPass = SM_UNKNOWN_PASS;

    /**
     * States for all passes in effect.
     * @type Array
     * @private
     */
    this._pPassStates = null;
    this._isUpdated = false;


    // this._fnModificationRoutine = null;
    // var me = this;
    // this._fnModificationRoutine = function(pEffectResource) {
    //     me._updatePassStates();
    // }

    if (arguments.length) {
        this.method = arguments[0];
    }
    var me = this;
    this._fnModificationRoutine = function () {
        if (this.isResourceAltered()) {
            me._isUpdated = true;
        }
    };
}

/**
 * @dcrot
 */
RenderSnapshot.prototype.destructor = function () {
    //this._pRenderMethod._pEffect.delModificationRoutine(this._fnModificationRoutine);
    if (this._pRenderMethod) {
        this._pRenderMethod.delChangesNotifyRoutine(this._fnModificationRoutine);
    }
    safe_release(this._pRenderMethod);
    safe_delete_array(this._pPassStates);
};

/**
 * Current render pass.
 */
PROPERTY(RenderSnapshot, 'pass',
         function () {
             return this._iCurrentPass;
         },
         function (iPass) {
             if (iPass > 0) {
                 this.activatePass(iPass);
             }
             else {
                 this.deactivatePass();
             }
         });

/**
 * Number of render passes.
 */
PROPERTY(RenderSnapshot, 'totalPasses',
         function () {
             return this._pRenderMethod._pEffect._nTotalPasses;
         });

/**
 * Name of snapshot/method.
 */
PROPERTY(RenderSnapshot, 'name',
         function () {
             return this._sName;
         },
         function (sName) {
             if (sName) {
                 this._sName = sName;
             }
         });

/**
 * Render method.
 */
PROPERTY(RenderSnapshot, 'method',
         function () {
             return this._pRenderMethod;
         },
         function (pValue) {
             var pMethod = null;

             this.destructor();

             if (typeof pValue === 'string') {
                 pMethod =
                 this._pEngine.pDisplayManager.renderMethodPool().loadResource(pValue);
             }
             else {
                 pMethod = pValue;
             }

             this._pRenderMethod = pMethod;
             this._sName = this._sName || pMethod.findResourceName();
             this._pShaderManager = pMethod.getEngine().shaderManager();

             this._pRenderMethod.setChangesNotifyRoutine(this._fnModificationRoutine);
             this._isUpdated = true;

             pMethod.addRef();
         });

PROPERTY(RenderSnapshot, 'surfaceMaterial',
         function () {
             return this._pRenderMethod._pMaterial;
         });

/**
 * Callback, for updating effect.
 */
RenderSnapshot.prototype._updatePassStates = function () {
    //TODO: update pass states.
};

/**
 * Set custom parameter.
 * @tparam String sName Parameter name.
 * @treturn Boolean True if succeed, otherwise False
 */
RenderSnapshot.prototype.setParameter = function (sName, pData) {
    var pPass = this._pPassStates[this._iCurrentPass];
    if (pPass[sName] !== undefined) {
        pPass[sName] = pData;
        return true;
    }
    return false;
};

/**
 * Set custom parameter in array.
 * @param {String} sName    Parameter name.
 * @param {Object} pData    Parameter value.
 * @param {Uint} iElement Number of element in array.
 */
RenderSnapshot.prototype.setParameterInArray = function (sName, pData, iElement) {
    var pPass = this._pPassStates[this._iCurrentPass];
    if (pPass[sName] !== undefined) {
        pPass[sName][iElement] = pData;
        return true;
    }
    return false;
};


///**
// * Sets shadow texture if possible
// * @tparam Texture fData texture class
// * @treturn Boolean True if succeed, otherwise False
// */
//EffectResource.prototype.setShadowTexture = function (pData) {
//    return this._pShaderManager.setShadowTexture(pData);
//};
//
///**
// * sets effect file matrix pData to _textureMatrixHanfle[iIndex]
// * @tparam Int iIndex
// * @tparam Float32Array pData pointer to 4x4 matrix
// * @treturn Boolean True if succeed, otherwise False
// */
//EffectResource.prototype.setTextureMatrix = function (iIndex, pData) {
//    return this._pShaderManager.setTextureMatrix(iIndex, pData);
//};

RenderSnapshot.prototype.setPassStates = function (pPasses) {
    this._pPassStates = pPasses;
};
/**
 * activate pass iPass
 * @tparam Int iPass - number of pass
 * @treturn return true if succeeded, otherwise false
 */
RenderSnapshot.prototype.activatePass = function (iPass) {
    if (this._pShaderManager.activatePass(this, iPass)) {
        this._iCurrentPass = iPass;
        return true;
    }
    return false;
};

/**
 * Deactivate pass (not nessacery)
 * @treturn Boolean
 */
RenderSnapshot.prototype.deactivatePass = function () {
    if (this._pShaderManager.deactivatePass(this)) {
        this._iCurrentPass = SM_UNKNOWN_PASS;
        return true;
    }
    return false;
};
RenderSnapshot.prototype.renderPass = function (iPass) {
    iPass = (iPass !== undefined) ? iPass : this._iCurrentPass;
    if (iPass === SM_UNKNOWN_PASS) {
        return false;
    }
    this._pShaderManager.finishPass(iPass);
};
RenderSnapshot.prototype.isUpdated = function (isUpdate) {
    if (isUpdate !== undefined) {
        this._isUpdated = isUpdate;
    }
    return this._isUpdated;
};

/**
 * Add effect to composition.
 */
RenderSnapshot.prototype.begin = function () {
    return this._pShaderManager.push(this);
};

/**
 * Remove effect from composition.
 */
RenderSnapshot.prototype.end = function () {
    return this._pShaderManager.pop(this);
};

RenderSnapshot.prototype.totalPasses = function () {
    if (!this.method || !this.method.effect) {
        return 0;
    }
    return this.method.effect.totalPasses();
};

/**
 * You must call these methods to prepare the engine for rendering scene.
 */
RenderSnapshot.prototype.prepareForRender = function () {
//    var pPass = this._pPassStates[this._iCurrentPass];
    var pManager = this._pShaderManager;

//    for (var sParam in pPass) {
//        var pParam = pPass[sParam];
//        if (pParam !== null) {
//            pManager.setParameter(sParam, pParam);
//        }
//    }

    pManager.prepareForRender();
};

/**
 * Applied surface material pSurfaceMaterial.
 * @tparam SurfaceMaterial
 */
RenderSnapshot.prototype.applySurfaceMaterial = function (pSurfaceMaterial) {
    this._pShaderManager.applySurfaceMaterial(pSurfaceMaterial);
};


/**
 * Apply camera.
 * @param  {Camera} pCamera Camera.
 */
RenderSnapshot.prototype.applyCamera = function (pCamera) {
    this._pShaderManager.applyCamera(pCamera);
};

/**
 * [applyBuffer description]
 * @param  {VertexData} pVertexData
 */
RenderSnapshot.prototype.applyBuffer = function (pVertexData) {
    this._pShaderManager.applyVertexData(pData);
};

/**
 * [applyBufferMap description]
 * @param  {BufferMap} pBufferMap
 */
RenderSnapshot.prototype.applyBufferMap = function (pBufferMap) {
    this._pShaderManager.applyBufferMap(pBufferMap);
};

/**
 * Is render method loaded?
 * @return {Boolean}
 */
RenderSnapshot.prototype.isMethodLoaded = function () {
    return this._pRenderMethod && this._pRenderMethod.isResourceLoaded();
};


/**
 * [hasRenderMethod description]
 * @return {Boolean}
 */
RenderSnapshot.prototype.hasRenderMethod = function () {
    return this._pRenderMethod !== null;
};

/**
 * Return TRUE if render method loaded and enabled.
 * @return {Boolean}
 */
RenderSnapshot.prototype.isReady = function () {
    // if (!this._pRenderMethod.isResourceLoaded()) {
    //     trace(this._pRenderMethod.findResourceName(), 'not loaded');
    // }
    // else {
    //     trace(this._pRenderMethod.findResourceName(), 'loaded')
    //     trace('isResourceDisabled:',this._pRenderMethod.isResourceDisabled());
    // }
    return this._pRenderMethod.isResourceLoaded() &&
           !this._pRenderMethod.isResourceDisabled();
};

a.RenderSnapshot = RenderSnapshot;
