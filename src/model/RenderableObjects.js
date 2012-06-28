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
     * @type {ShaderManager}
     */
	this._pEngine = pEngine;

    /**
     * @private
     * @type {RenderSnapshots[]}
     */
	this._pSnapshots = [];

    /**
     * Active snapshot, i.e. snapshot with active render method.
     * @type {RenderSnapshot}
     */
	this._pActiveSnaphot = null;
}


PROPERTY(RenderableObject, 'renderMethod',
    /**
     * Get current render method.
     * @return {RenderMethod} 
     */
    function () {
        return this._pActiveSnaphot? 
            this._pActiveSnaphot._pRenderMethod : null;
    },
    function (pRenderMethod) {
        this.switchRenderMethod(this.addRenderMethod(pRenderMethod));
    });

PROPERTY(RenderableObject, 'effect',
    function () {
        return this._pActiveSnaphot? 
            this._pActiveSnaphot._pRenderMethod._pEffect : 
            null;
    });

PROPERTY(RenderableObject, 'surfaceMaterial',
    function () {
        return this._pActiveSnaphot? 
            this._pActiveSnaphot._pRenderMethod._pMaterial : 
            null;
    });

/**
 * @destructor
 */
RenderableObject.prototype.destructor = function() {
    this._pShaderManager = null;
    this._pActiveSnaphot = null;
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
RenderableObject.prototype.addRenderMethod = function(pRenderMethod, sName) {
	var pRenderSnapshot = new a.RenderSnapshot;

    debug_assert(pRenderMethod.getEngine() === this._pEngine,
        'Render method should belong to the same engine instance that the renderable object.');

    pRenderSnapshot.method = pRenderMethod;
    pRenderSnapshot.name = sName;

    for (var i = 0; i < this._pSnapshots.length; i++) {
        if (this._pSnapshots[i] === null) {
            this._pSnapshots[i] = pRenderSnapshot;
            return i;
        }
    };

    this._pSnapshots[i].push(pRenderSnapshot);
    return this._pSnapshots.length - 1;
};


/**
 * Get number of render method by method name.
 * @param {String}  Method name.
 * @property findRenderMethod(String sMethodName)
 * @return {Int} Method number or -1 if method not exists.
 */
RenderableObject.prototype.findRenderMethod = function() {
    var iMethod;

    if (typeof arguments[0] === 'string') {
        for (var i = 0; i < this._pSnapshots.length; i ++) {
            if (this._pSnapshots[i].name === sMethodName) {
                return i;
            }
        };

        return -1;
    }

    iMethod = arguments[0];    
    
    if (iMethod < 0) {
        iMethod = Math.abs(this._pSnapshots.length + iMethod);
    }

    if (iMethod < this._pSnapshots.length) {
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
RenderableObject.prototype.switchRenderMethod = function() {
    var iSnapshot = this.findRenderMethod(arguments[0]);
    
    if (iSnapshot < 0) {
        return false;
    }

    this._pActiveSnaphot = this._pSnapshots[iSnapshot];
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
RenderableObject.prototype.removeRenderMethod = function() {
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
RenderableObject.prototype.isReadyForRender = function() {
    return this._pActiveSnaphot.isReady();
};

/**
 * Check that all methods are loaded.
 * @return {Boolean}
 */
RenderableObject.prototype.isAllMethodsLoaded = function() {
    for (var i = 0; i < this._pSnapshots; ++ i) {
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
RenderableObject.prototype.getRenderMethod = function() {
    var iMethod = this.findRenderMethod(arguments[0]);
    return this._pSnapshots[iMethod]._pRenderMethod;
};

/**
 * By default, scene nodes do not render.
 * Derived classes must provide
 * any functionality needed.
 */
RenderableObject.prototype.render = function () {
};


/**
 * If we queued ourselved for rendering with the
 * display manager, we will get this function
 * called when it is our turn to render.
 * iActivationFlags contains a set of bit flags
 * held in the eActivationFlagBits enum
 * which tell us what resources we need to activate
 * in order to render ourselves.
 * @tparam RenderEntry pEntry
 * @tparam Int iActivationFlags
 */
RenderableObject.prototype.renderCallback = function (pEntry, iActivationFlags) {
};

a.RenderableObject = RenderableObject;