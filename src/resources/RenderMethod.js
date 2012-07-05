/**
 * @file
 * @brief file contains RenderMethod class
 * @author reinor
 */

/**
 * RenderMethod class; extends from a.ResourcePoolItem
 * @ctor
 */
// function RenderMethod () {

//     Enum([
//              defaultMethod = 0,
//              ambientColorStage,
//              bumpMapStage,
//              lightingStage,
//              maxRenderStages
//          ], eRenderStages, a.RenderMethod);

//     this._pEffectList = new Array(a.RenderMethod.maxRenderStages);
//     this._pMaterialList = new Array(a.RenderMethod.maxRenderStages);

//     RenderMethod.superclass.constructor.apply(this, arguments);
// }
// ;
// a.extend(RenderMethod, a.ResourcePoolItem);

// /**
//  * return effect file used in iRenderStage
//  * @tparam Integer iRenderStage
//  * @treturn a.EffectResource
//  */
// RenderMethod.prototype.getEffect = function (iRenderStage) {
//     INLINE();
//     debug_assert(iRenderStage < a.RenderMethod.maxRenderStages,
//                  "ivalid render stage");

//     return this._pEffectList[iRenderStage];
// };

// /**
//  * return material used in iRenderStage
//  * @tparam Integer iRenderStage
//  * @treturn a.SurfaceMaterial
//  */
// RenderMethod.prototype.getMaterial = function (iRenderStage) {
//     INLINE();
//     debug_assert(iRenderStage < a.RenderMethod.maxRenderStages,
//                  "invalid render stage");

//     return this._pMaterialList[iRenderStage];
// };

// /**
//  * creates resource
//  * @return Boolean always return true
//  */
// RenderMethod.prototype.createResource = function () {
//     debug_assert(!this.isResourceCreated(),
//                  "The resource has already been created.");

//     // signal that the resource is now created,
//     // but has not been enabled
//     this.notifyCreated();
//     this.notifyDisabled();

//     return true;
// };

// /**
//  * destroying resource
//  * @treturn Boolean true if succeeded, false if resource don't been created
//  */
// RenderMethod.prototype.destroyResource = function () {
//     for (var i = 0; i < a.RenderMethod.maxRenderStages; i++) {
//         safe_release(this._pEffectList[i]);
//         safe_release(this._pMaterialList[i]);
//     }
//     // disable the resource
//     if (this.isResourceCreated()) {
//         this.disableResource();

//         this.notifyUploaded();
//         this.notifyDestroyed();

//         return true;
//     }

//     return false;
// };

// /**
//  * restoring resource
//  * @treturn Boolean always return true
//  */
// RenderMethod.prototype.restoreResource = function () {
//     debug_assert(this.isResourceCreated(),
//                  "The resource has not been created.");

//     this.notifyRestored();
//     return true;
// };

// /**
//  * disabling resource
//  * @treturn Boolean always return true
//  */
// RenderMethod.prototype.disableResource = function () {
//     debug_assert(this.isResourceCreated(),
//                  "The resource has not been created.");

//     this.notifyDisabled();
//     return true;
// };

// /**
//  * load resource from file by path sFileName or remote (sURI)
//  * @tparam String sFileName
//  * @treturn Boolean true if succeeded otherwise false
//  */
// RenderMethod.prototype.loadResource = function (sFileName) {
//     var sEffectFileName = null;
//     var sMaterialName = null;

//     var isResult = true;

//     if (!sFileName) {
//         var sResourceName = this.findResourceName();
//         if (sResourceName) {
//             sFileName = sResourceName;
//         }
//         else {
//             return false;
//         }
//     }
//     ;

//     // load all textures and matrices
//     var pFile = a.fopen(sFileName, 'rb');
//     var me = this;

//     pFile.onread = function (pData) {


//         me.destroyResource();
//         me.createResource();

//         var pReader = new a.BinReader(pData);

//         var iStageFlags = 0;
//         //var fileID = 0;

//         //            file.read(fileID);
//         //            if (sFileID != fileID){
//         //		debug_print("WARNING!!! unable to load %s", filename);
//         //		result = false;
//         //            }

//         var i = 0;

//         //load all effect files
//         iStageFlags = pReader.uint32();
//         for (i = 0; i < a.RenderMethod.maxRenderStages; i++) {
//             if (TEST_BIT(iStageFlags, i)) {
//                 sEffectFileName = pReader.string();
//                 me._pEffectList[i] = this._pEngine.pDisplayManager
//                     .effectPool().loadResource(sEffectFileName);

//                 me.connect(me._pEffectList[i], a.ResourcePoolItem.Loaded);

//                 if (!me._pEffectList[i]) {
//                     debug_print("unable load effect file " + sEffectFileName);
//                     isResult = false;
//                 }
//             }
//         }

//         // load in all surface materials
//         iStageFlags = pReader.uint32();

//         for (i = 0; i < a.RenderMethod.maxRenderStages; i++) {
//             if (TEST_BIT(iStageFlags, i)) {
//                 sMaterialName = pReader.string();
//                 me._pMaterialList[i] = this._pEngine.pDisplayManager
//                     .surfaceMaterialPool().loadResource(sMaterialName);

//                 me.connect(mme._pMaterialList[i], a.ResourcePoolItem.Loaded);

//                 if (!me._pMaterialList[i]) {
//                     debug_print("unable load surface material "
//                                     + sMaterialName);
//                     isResult = false;
//                 }
//             }
//         }

//         return true;

//     };
//     return isResult;
// };

// /**
//  * save resource to file sFileName
//  * @tparam String sFileName
//  * @treturn Boolean true if succeeded otherwise false
//  */
// RenderMethod.prototype.saveResource = function (sFileName) {
//     sFileName = sFileName || this.findResourceName();

//     var isResult = true;
//     var sEffectFileName = null;
//     var sMaterialName = null;

//     var pFile = new a.LocalFile(sFileName, a.LocalFile.READ_WRITE,
//                                 a.LocalFile.TYPE_ARRAY_BUFFER);

//     var me = this;

//     var iStageFlags = 0;

//     pFile.open(
//         function () {
//             var i = 0;
//             var pWriter = new a.BinWriter();

//             // build a set of flags describing 
//             // the effect file slots we use
//             for (i = 0; i < a.RenderMethod.maxRenderStages; i++) {
//                 if (me._pEffectList[i]) {
//                     SET_BIT(iStageFlags, i);
//                 }
//             }
//             pWriter.uint32(iStageFlags);

//             // write the names of the effect files
//             for (i = 0; i < a.RenderMethod.maxRenderStages; i++) {
//                 if (me._pEffectList[i]) {
//                     sEffectFileName = me._pEffectList[i].findResourceName();
//                     pWriter.string(sEffectFileName);
//                 }
//             }

//             iStageFlags = 0;

//             // build a set of flags describing 
//             // the material slots we use
//             for (i = 0; i < a.RenderMethod.maxRenderStages; i++) {
//                 if (me._pMaterialList[i]) {
//                     SET_BIT(iStageFlags, i);
//                 }
//             }
//             pWriter.uint32(iStageFlags);

//             // write the names of the material files
//             for (i = 0; i < a.RenderMethod.maxRenderStages; ++i) {
//                 if (me._pMaterialList[i]) {
//                     sMaterialName = me._pMaterialList[i].findResourceName();
//                     pWriter.string(sMaterialName);
//                 }
//             }

//             //write to file

//             pFile.write(
//                 pWriter.data(),
//                 function () {
//                     return true;
//                 },
//                 function () {
//                     error("can't write data to file");
//                     isResult = false;
//                     return false;
//                 }
//             );

//         },
//         function () {
//             error("can't open file");
//             isResult = false;
//             return false;
//         }
//     )

//     pFile.close();

//     return isResult;
// };

// /**
//  * set effect pEffect to iRenderStage
//  * @tparam Integer iRenderStage
//  * @tparam a.EffectResource pEffect
//  */
// RenderMethod.prototype.setEffect = function (iRenderStage, pEffect) {
//     debug_assert(iRenderStage < a.RenderMethod.maxRenderStages,
//                  "invalid render stage");

//     safe_release(this._pEffectList[iRenderStage]);

//     this._pEffectList[iRenderStage] = pEffect;
//     this.connect(pEffect, a.ResourcePoolItem.Loaded);

//     if (pEffect) {
//         pEffect.addRef();
//     }
// };

// /**
//  * set material pMaterial to iRenderStage
//  * @tparam Integer iRenderStage
//  * @tparam a.SurfaceMaterial pMaterial
//  */
// RenderMethod.prototype.setMaterial = function (iRenderStage, pMaterial) {
//     debug_assert(iRenderStage < a.RenderMethod.maxRenderStages,
//                  "invalid render stage");

//     safe_release(this._pMaterialList[iRenderStage]);

//     this._pMaterialList[iRenderStage] = pMaterial;
//     this.connect(pMaterial, a.ResourcePoolItem.Loaded);

//     if (pMaterial) {
//         pMaterial.addRef();
//     }
// };

// /**
//  * load effect file by path sEffectFile to iRenderStage
//  * @tparam Integer iRenderStage
//  * @tparam String sEffectFile
//  */
// RenderMethod.prototype.loadEffect = function (iRenderStage, sEffectFile) {
//     debug_assert(iRenderStage < a.RenderMethod.maxRenderStages,
//                  "invalid render stage");

//     safe_release(this._pEffectList[iRenderStage]);

//     this.setEffect(iRenderStage, this._pEngine.pDisplayManager
//         .effectPool().loadResource(sEffectFile));
// };

// /**
//  * return current effect file
//  * @treturn a.EffectResource
//  */
// RenderMethod.prototype.getActiveEffect = function () {
//     return this._pEffectList[this._pEngine.getCurrentRenderStage()];
// };

// /**
//  * return current surface material
//  * @treturn a.SurfaceMaterial
//  */
// RenderMethod.prototype.getActiveMaterial = function () {
//     return this._pMaterialList[this._pEngine.getCurrentRenderStage()];
// }

// a.RenderMethod = RenderMethod;
// Define(a.RenderMethodManager(pEngine), function () {
//     a.ResourcePool(pEngine, a.RenderMethod)
// });

/**
 * Render method class.
 * @ctor
 */
function RenderMethod () {
    A_CLASS;

    /**
     * EffectResource for this method.
     * @private
     * @type {EffectResource}
     */
    this._pEffect = null;

    /**
     * Material.
     * @private
     * @type {SurfaeMaterial}
     */
    this._pMaterial = null;
}

EXTENDS(RenderMethod, a.ResourcePoolItem);

RenderMethod.prototype.isEqual = function (pRenderMethod) {
    'use strict';
    
    return this._pEffect.isEqual(pRenderMethod._pEffect) && 
        this._pMaterial.isEqual(pRenderMethod._pMaterial);
};

/**
 * Return effect.
 * @treturn a.EffectResource
 */
PROPERTY(RenderMethod, 'effect', 
    function () {
        return this._pEffect;
    },
    function (pValue) {
        var pEffect = null;

        this.disconnect(this._pEffect, a.ResourcePoolItem.Loaded);
        safe_release(this._pEffect);

        if (typeof pValue === 'string') {
            pEffect = 
                this._pEngine.pDisplayManager.effectPool().loadResource(pValue);
        }
        else {
            pEffect = pValue;
        }

        this._pEffect = pEffect;
        this.connect(this._pEffect, a.ResourcePoolItem.Loaded);

        pEffect.addRef();
    });


/**
 * Return material.
 * @treturn a.SurfaceMaterial
 */
PROPERTY(RenderMethod, 'material', 
    function () {
       return this._pMaterial;
    },
    function (pValue) {
        var pMaterial = null;

        this.disconnect(this._pMaterial, a.ResourcePoolItem.Loaded);
        safe_release(this._pMaterial);

        if (typeof pValue === 'string') {
            pMaterial = 
                this._pEngine.pDisplayManager.materialPool().loadResource(pValue);
        }
        else {
            pMaterial = pValue;
        }

        this._pMateria = pMaterial;
        this.connect(pMaterial, a.ResourcePoolItem.Loaded);

        pMaterial.addRef();
    });

a.RenderMethod = RenderMethod;

Define(a.RenderMethodManager(pEngine), function () {
    a.ResourcePool(pEngine, a.RenderMethod)
});

/**
 * creates resource
 * @return Boolean always return true
 */
RenderMethod.prototype.createResource = function() {
    debug_assert(!this.isResourceCreated(),
        "The resource has already been created.");

    // signal that the resource is now created,
    // but has not been enabled
    this.notifyCreated();
    this.notifyDisabled();

    return true;
};

/**
 * destroying resource
 * @treturn Boolean true if succeeded, false if resource don't been created
 */
RenderMethod.prototype.destroyResource = function() {
    safe_release(this._pEffectList);
    safe_release(this._pMaterialList);
    
    // disable the resource
    if (this.isResourceCreated()) {
        this.disableResource();

        this.notifyUploaded();
        this.notifyDestroyed();

        return true;
    }

    return false;
};


/**
 * restoring resource
 * @treturn Boolean always return true
 */
RenderMethod.prototype.restoreResource = function () {
    debug_assert(this.isResourceCreated(),
                 "The resource has not been created.");

    this.notifyRestored();
    return true;
};


/**
 * disabling resource
 * @treturn Boolean always return true
 */
RenderMethod.prototype.disableResource = function () {
    debug_assert(this.isResourceCreated(),
                 "The resource has not been created.");

    this.notifyDisabled();
    return true;
};

/**
 * load resource from file by path sFileName or remote (sURI)
 * @tparam String sFileName
 * @treturn Boolean true if succeeded otherwise false
 */
RenderMethod.prototype.loadResource = function (sFileName) {
    return false;
};

/**
 * save resource to file sFileName
 * @tparam String sFileName
 * @treturn Boolean true if succeeded otherwise false
 */
RenderMethod.prototype.saveResource = function (sFileName) {
    return false;
}