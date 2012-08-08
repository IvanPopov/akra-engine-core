/**
 * Created with IntelliJ IDEA.
 * User: sss
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
Component.prototype.hash = function (pProp) {
    return this.sName + ">>>" + (pProp.nShift || 0);
};
Component.prototype.init = function (pTechnique) {
//    var pManager = this._pEngine.shaderManager();
//    if (!pManager) {
//        warning("For init component you must create shader manager");
//        return false;
//    }
    this.sName = pTechnique.sName;
    this.pTechnique = pTechnique;
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
Component.prototype.totalPasses = function () {
    return this.pPasses.length;
};
A_NAMESPACE(Component, fx);

Define(a.ComponentManager(pEngine), function () {
    a.ResourcePool(pEngine, a.fx.Component)
});
