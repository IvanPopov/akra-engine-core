/**
 * Created with IntelliJ IDEA.
 * User: sss
 */
function Component(pEngine){
    A_CLASS;
    this._pEngine = pEngine;
    this._pManager = pEngine.pShaderManager;
    this.sName = null;
    this.pTechnique = null;
    this.pPasses = [];
    this.pPassesNames = {};
    this.isPostEffect = false;
    this.pAnnotation = null;
    this.sName = "";
    this.sComponents = null;
    this.pExteranalsFragment = null;
    this.pExteranalsVertex = null;
};
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
 * @tparam String sTechnique - technique name
 * @treturn Boolean true if succeeded, otherwise false
 */
Component.prototype.loadResource = function (sFileName) {
    this.notifyUnloaded();
    TODO('Загрузка эффект ресурса');

    //TODO notifyLoaded
    return true;
};

Component.prototype.init = function (sName, pTechnique) {
    this.sName = sName;
    this.pTechnique = pTechnique;
    this.pPasses = pTechnique.pPasses;
    this.pPassesNames = pTechnique.pPassesNames;
    this.isPostEffect = pTechnique.isPostEffect;
    this.pAnnotation = pTechnique.pAnnotation;
    this.sComponents = pTechnique.sComponents;
    this.pExteranalsFragment = pTechnique.pExteranalsFragment;
    this.pExteranalsVertex = pTechnique.pExteranalsVertex;

};
a.Component = Component;

Define(a.ComponentManager(pEngine), function () {
    a.ResourcePool(pEngine, a.Component)
});
