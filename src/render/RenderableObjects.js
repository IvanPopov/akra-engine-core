/**
 * @file
 * @author Ivan Popov
 */

/**
 * Base class for all objects to be rendered.
 * @ctor
 * @param {Engine} pEngine Engine instance.
 */

function RenderableObject(pEngine) {
    /**
     * @private
     * @type {Renderer}
     */
    this._pEngine = pEngine || null;

    /**
     * @private
     * @type {RenderSnapshots[]}
     */
    this._pSnapshots = [];

    /**
     * Active snapshot, i.e. snapshot with active render method.
     * @type {RenderSnapshot}
     */
    this._pActiveSnapshot = null;

    this._hasShadow = false;

    this._iSystemId = a.sid();

    // this._pPostEffectFrameBuffers = null;

    // this._v2iPostEffectFrameBufferSize = null;

    // this._pPostEffectTextures = null;
}

PROPERTY(RenderableObject, 'renderMethod',
         /**
          * Get current render method.
          * @return {RenderMethod}
          */
             function () {
             return this._pActiveSnapshot._pRenderMethod;
         },
         function (pRenderMethod) {
             this.switchRenderMethod(
                 this.addRenderMethod(pRenderMethod));
         });

PROPERTY(RenderableObject, 'effect',
         function () {
             return this._pActiveSnapshot._pRenderMethod._pEffect;
         });

PROPERTY(RenderableObject, 'surfaceMaterial',
         function () {
             return this._pActiveSnapshot._pRenderMethod._pMaterial;
         },
         function (pSurfaceMaterial) {
             'use strict';

             this._pActiveSnapshot._pRenderMethod._pMaterial = pSurfaceMaterial;
         });

PROPERTY(RenderableObject, 'material',
         function () {
             var pSurfaceMaterial = this.surfaceMaterial;
             return pSurfaceMaterial ? pSurfaceMaterial.material : null;
         });

PROPERTY(RenderableObject, 'renderObjectId',
         function () {
             return this._iSystemId;
         });

RenderableObject.prototype.getEngine = function () {
    return this._pEngine;
};

RenderableObject.prototype.setup = function (pEngine, sDefaulMethodName) {
    this._pEngine = pEngine;

    if (this.addRenderMethod(sDefaulMethodName) < 0 || this.switchRenderMethod(0) === false) {
        error('cannot add & switch render method to default');
    }
};

// RenderableObject.prototype._setPostEffectFrameBufferSize = function(v2iSize) {
//     var pRenderer = this._pEngine.shaderManager();
//     var pTexture;
//     var id;
//     if(!this._v2iPostEffectFrameBufferSize){
//         this._v2iPostEffectFrameBufferSize = new Vec2(v2iSize);
//         this._pPostEffectFrameBuffers = [];
//         this._pPostEffectTextures = [];
//         var pTexturePool = this._pEngine.displayManager().texturePool();
        
//         for(var i = 0; i < 2; i++){
//             id = pRenderer.activateFrameBuffer();
//             pTexture = pTexturePool.createResource(".post-effect-texture-" + a.sid());
//             pTexture.createTexture(v2fSize.x, v2fSize.y); 
//             pRenderer.frameBufferTexture2D(pTexture);
//             this._pPostEffectTextures.push(pTexture);
//             this._pPostEffectFrameBuffers.push(id);
//         }
//     }
//     else if(!v2iSize.isEqual(this._v2iPostEffectFrameBufferSize)){
//         this._pPostEffectTextures[0].resize(v2fSize.x, v2fSize.y);
//         this._pPostEffectTextures[1].resize(v2fSize.x, v2fSize.y);
//     }    
// };

// RenderableObject.prototype._getPostEffectFrameBuffers = function() {
//     return this._pPostEffectFrameBuffers;    
// };

/**
 * @destructor
 */
RenderableObject.prototype.destructor = function () {
    this._pShaderManager = null;
    this._pActiveSnapshot = null;
    safe_delete_array(this._pSnapshots);
};

/**
 * Add new render method.
 * @property addRenderMethod(String pRenderMethod, String sName = null)
 * @param {String} sRenderMethod Path to render method file.
 * @param {String} sName Method name, for easy handling.
 * @memberOf RenderableObject
 * @return {Uint} Number of number render method.
 */
/**
 * Add new render method.
 * @property addRenderMethod(RenderMethod pRenderMethod, String sName = null)
 * @param {RenderMethod} pRenderMethod Render method.
 * @param {String} sName Method name, for easy handling.
 * @return {Uint} Number of added render method.
 */
RenderableObject.prototype.addRenderMethod = function (pRenderMethod, sName) {
    var pRenderSnapshot = new a.RenderSnapshot;

    if (arguments.length < 2 && typeof(arguments[0]) === "string") {
        sName = arguments[0];
        pRenderMethod = this.getEngine().displayManager().renderMethodPool().createResource('render-method-' +
                                                                                            (sName || '') + a.sid());
        pRenderMethod.setMaterial();
        pRenderMethod.setEffect();
    }


    debug_assert(pRenderMethod.getEngine() === this._pEngine,
                 'Render method should belong to the same engine instance that the renderable object.');

    pRenderSnapshot.method = pRenderMethod;
    pRenderSnapshot.name = sName || ".default";//pRenderMethod.findResourceName();

    for (var i = 0; i < this._pSnapshots.length; i++) {
        if (this._pSnapshots[i] === null) {
            this._pSnapshots[i] = pRenderSnapshot;
            return i;
        }
    }
    ;

    this._pSnapshots.push(pRenderSnapshot);
    return this._pSnapshots.length - 1;
};


/**
 * Get number of render method by method name.
 * @param {String}  Method name.
 * @property findRenderMethod(String sMethodName)
 * @return {Int} Method number or -1 if method not exists.
 */
RenderableObject.prototype.findRenderMethod = function () {
    var iMethod;
    var sMethodName;

    if (typeof arguments[0] === 'string') {
        sMethodName = arguments[0];
        for (var i = 0; i < this._pSnapshots.length; i++) {
            if (this._pSnapshots[i].name === sMethodName) {
                return i;
            }
        }
        ;

        return -1;
    }

    iMethod = arguments[0];

    if (iMethod < 0) {
        iMethod = Math.abs(this._pSnapshots.length + iMethod);
    }

    if (iMethod >= this._pSnapshots.length) {
        return -1;
    }

    return iMethod;
};

/**
 * Set current render method as given.
 * @property switchRenderMethod(Uint iMethod)
 * @memberOf RenderableObject
 * @param {Uint} iMethod Method number.
 * @return {Boolean}
 */
/**
 * Set current render method as given.
 * @property switchRenderMethod(String sMethodName)
 * @memberOf RenderableObject
 * @param {String} sMethodName Method number.
 * @return {Boolean}
 */
RenderableObject.prototype.switchRenderMethod = function () {
    var iSnapshot = this.findRenderMethod(arguments[0]);

    if (iSnapshot < 0) {
        return false;
    }

    this._pActiveSnapshot = this._pSnapshots[iSnapshot];
    return true;
};


/**
 * Remove render method.
 * @property removeRenderMethod(Uint iMethod)
 * @memberOf RenderableObject
 * @param {Uint} iMethod Method number.
 * @return {Boolean}
 */
/**
 * Remove render method.
 * @property removeRenderMethod(String sMethodName)
 * @memberOf RenderableObject
 * @param {String} sMethodName Method number.
 * @return {Boolean}
 */
RenderableObject.prototype.removeRenderMethod = function () {
    var iSnapshot = this.findRenderMethod(arguments[0]);

    if (iSnapshot < 0) {
        return false;
    }

    safe_delete(this._pSnapshots[iSnapshot]);
    return true;
};


/**
 * Is object ready for render?
 * @return {Boolean}
 */
RenderableObject.prototype.isReadyForRender = function () {
    return this._pActiveSnapshot.isReady();
};

/**
 * Check that all methods are loaded.
 * @return {Boolean}
 */
RenderableObject.prototype.isAllMethodsLoaded = function () {
    for (var i = 0; i < this._pSnapshots; ++i) {
        if (!this._pSnapshots[i].isMethodLoaded()) {
            return false;
        }
    }

    return true;
};

/**
 * Get render method.
 * @property getRenderMethod(Uint iMethod)
 * @memberOf RenderableObject
 * @param {Uint} iMethod Method number.
 * @return {RenderMethod}
 */
/**
 * Get render method.
 * @property getRenderMethod(String sMethodName)
 * @memberOf RenderableObject
 * @param {String} sMethodName Method number.
 * @return {RenderMethod}
 */
RenderableObject.prototype.getRenderMethod = function () {
    var iMethod = this.findRenderMethod(arguments[0]);
    return this._pSnapshots[iMethod]._pRenderMethod;
};

//All renderable objects must have draw method...
RenderableObject.prototype.draw = function () {
    'use strict';
    return false;
};

/**
 * Start procees of adding data for rendering
 */
RenderableObject.prototype.startRender = function () {
    if (!this._pActiveSnapshot) {
        return false;
    }
    return this._pActiveSnapshot.begin(this);
};
/**
 * Exclude object render method from stack of effects
 */
RenderableObject.prototype.finishRender = function () {
    if (!this._pActiveSnapshot) {
        return false;
    }
    return this._pActiveSnapshot.end();
};

RenderableObject.prototype.totalPasses = function () {
    if (!this._pActiveSnapshot) {
        return 0;
    }
    return this._pActiveSnapshot.totalPasses();
};
RenderableObject.prototype.activatePass = function (iPass) {
    if (!this._pActiveSnapshot) {
        return false;
    }
    return this._pActiveSnapshot.activatePass(iPass);
};
RenderableObject.prototype.deactivatePass = function () {
    if (!this._pActiveSnapshot) {
        return false;
    }
    return this._pActiveSnapshot.deactivatePass();
};
RenderableObject.prototype.renderPass = function (iPass) {
    if (!this._pActiveSnapshot) {
        return false;
    }
    var pEntry = this._pActiveSnapshot.renderPass(iPass);
    if (!pEntry) {
        warning("Pass don`t add to render queue");
        return false;
    }
    //TODO: add program and object to renderQueue
    return pEntry;
};
RenderableObject.prototype.applyBufferMap = function (pData) {
    if (!this._pActiveSnapshot) {
        return false;
    }
    return this._pActiveSnapshot.applyBufferMap(pData);
};
RenderableObject.prototype.applyRenderData = function (pData) {
    if (!this._pActiveSnapshot) {
        return false;
    }
    return this._pActiveSnapshot.applyRenderData(pData);
};
RenderableObject.prototype.applyVertexData = function (pData, ePrimType) {
    if (!this._pActiveSnapshot) {
        return false;
    }
    return this._pActiveSnapshot.applyVertexData(pData, ePrimType);
};
RenderableObject.prototype.applySurfaceMaterial = function (pMaterial) {
    if (!this._pActiveSnapshot) {
        return false;
    }
    return this._pActiveSnapshot.applySurfaceMaterial(pMaterial);
};

RenderableObject.prototype.hasShadow = function (hasShadow) {
    if (hasShadow !== undefined) {
        this._hasShadow = hasShadow;
    }
    return this._hasShadow;
};
// /**
//  * By default, scene nodes do not render.
//  * Derived classes must provide
//  * any functionality needed.
//  */
// RenderableObject.prototype.render = function () {
// };


//     /**
//      * If we queued ourselved for rendering with the
//      * display manager, we will get this function
//      * called when it is our turn to render.
//      * iActivationFlags contains a set of bit flags
//      * held in the eActivationFlagBits enum
//      * which tell us what resources we need to activate
//      * in order to render ourselves.
//      * @tparam RenderEntry pEntry
//      * @tparam Int iActivationFlags
//      */
//     RenderableObject.prototype.renderCallback = function (pEntry, iActivationFlags) {
//     };


a.RenderableObject = RenderableObject;