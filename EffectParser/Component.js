/**
 * Created with IntelliJ IDEA.
 * User: sss
 * Date: 17.04.12
 * Time: 11:50
 * To change this template use File | Settings | File Templates.
 */
function ComponentResource(pEngine){
    A_CLASS;
    this._pEngine = pEngine;
    this._pManager = pEngine.pShaderManager;
    this.sName = null;
};
a.extend(ComponentResource, a.ResourcePoolItem);
/**
 * innitialize the resource (called once)
 * @treturn Boolean always true
 */
ComponentResource.prototype.createResource = function () {
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
ComponentResource.prototype.destroyResource = function () {
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
ComponentResource.prototype.disableResource = function () {
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
EffectResource.prototype.saveResource = function (sFileName) {
    return true;
};

/**
 * prepare the resource for use (create any volatile memory objects needed)
 * @treturn Boolean always true
 */
ComponentResource.prototype.restoreResource = function () {
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
ComponentResource.prototype.loadResource = function (sFileName) {
    this.notifyUnloaded();
    TODO('Загрузка эффект ресурса');

    //TODO notifyLoaded
    return true;
};

a.ComponentResource = ComponentResource;

Define(a.ComponentResourceManager(pEngine), function () {
    a.ResourcePool(pEngine, a.ComponentResource)
});
