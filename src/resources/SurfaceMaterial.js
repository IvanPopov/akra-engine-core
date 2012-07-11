/**
 * @file
 *
 * @author Ivan Popov
 * @email <vantuziast@odserve.org>
 *
 * @author Konstantin Molodyakov
 * @email <xoma@odserve.org>
 *
 * Классы материалов.
 */



/**
 * SurfaceMaterial class.
 * @extends ResourceItem
 * @tparam Engine pEngine Текущий движок.
 * @ctor
 * Constructor.
 */
function SurfaceMaterial (pEngine) {
    A_CLASS;
    /**
     * @enum eConstants
     */
    Enum([
             maxTexturesPerSurface = 16,
             textureFileVersion = 1
         ], SURFACEMATERIAL_CONSTANTS, a.SurfaceMaterial);

    Enum([
        TEXTURE0 = 0,
        TEXTURE1,
        TEXTURE2,
        TEXTURE3,
        TEXTURE4,
        TEXTURE5,
        TEXTURE6,
        TEXTURE7,
        TEXTURE8,
        TEXTURE9,
        TEXTURE10,
        TEXTURE11,
        TEXTURE12,
        TEXTURE13,
        TEXTURE14,
        TEXTURE15,
        DIFFUSE = a.SurfaceMaterial.TEXTURE0,
        AMBIENT,
        SPECULAR,
        EMISSIVE,
        EMISSION = a.SurfaceMaterial.EMISSIVE
        ], SURFACEMATERIAL_TEXTURES, a.SurfaceMaterial);

   /**
    * @private
    * @type Material
    */
   this._pMaterial = new a.Material();
    /**
     * @private
     * @type Int
     */
    this._nTotalTextures = 0;
    /**
     * @private
     * @type Int
     */
    this._iTextureFlags = 0;
    /**
     * @private
     * @type Int
     */
    this._iTextureMatrixFlags = 0;
    /**
     * @private
     * @type Texture[]
     */
    this._pTexture = new Array(a.SurfaceMaterial.maxTexturesPerSurface);

    /**
     * @private
     * @type {Array.<Uint>}
     */
    this._pTexcoord = new Array(a.SurfaceMaterial.maxTexturesPerSurface);

    for (var i = 0; i < a.SurfaceMaterial.maxTexturesPerSurface; i++) {
         this._pTexcoord[i] = i;
    };

    /**
     * @private
     * @type Mat4[]
     */
    this._pTextureMatrix = new Array(a.SurfaceMaterial.maxTexturesPerSurface);

    this.setMaterial();
}


EXTENDS(SurfaceMaterial, a.ResourcePoolItem);



PROPERTY(SurfaceMaterial, 'material',
    /**
     * @treturn Material
     */
    function () {
        return this._pMaterial;
    },
    /**
     * Set material.
     * @tparam Material pMaterial New Material(pMaterial not required.)
     * @treturn Boolean
     */
    function (pMaterial) {
        if (pMaterial) {
           this._pMaterial.value = pMaterial;
        }
        else {
           // set default material
           this._pMaterial.pDiffuse = new a.ColorValue(.5, .5, .5, 1.);
           this._pMaterial.pSpecular = new a.ColorValue(.5, .5, .5, 1.);
        }
    });

PROPERTY(SurfaceMaterial, 'totalTextures',
    /**
      * Number of used textures
     * @return {Uint} 
     */
    function () {
        return this._nTotalTextures;
    });


PROPERTY(SurfaceMaterial, 'textureFlags',
    /**
     * Texture flags.
     * @treturn Int
     */
    function () {
        return this._iTextureFlags;
    });

PROPERTY(SurfaceMaterial, 'textureMatrixFlags',
    /**
     * Texture flags.
     * @treturn Int
     */
    function () {
        return this._iTextureMatrixFlags;
    });

SurfaceMaterial.prototype.setMaterial = function(pMaterial) {
    this.material = pMaterial || null;
};

SurfaceMaterial.prototype.isEqual = function (pSurfaceMaterial) {
    'use strict';

    if (this._nTotalTextures === pSurfaceMaterial._nTotalTextures && 
        this._iTextureFlags === pSurfaceMaterial._iTextureFlags && 
        this._iTextureMatrixFlags === pSurfaceMaterial._iTextureMatrixFlags) {
        
        if ((this._pMaterial && this._pMaterial.isEqual(pSurfaceMaterial._pMaterial))
            || (pSurfaceMaterial._pMaterial === null)) {
            
            for (var i = 0; i < this._pTexture.length; i++) {
                if (this._pTexture[i] !== pSurfaceMaterial._pTexture[i]) {
                    return false;
                }
            };

            for (var i = 0; i< this._pTextureMatrix; ++ i) {
                for (var j = 0; j < this._pTextureMatrix[i].length; j++) {
                    if (this._pTextureMatrix[i][j] !== pSurfaceMaterial._pTextureMatrix[i][j]) {
                        return false;
                    }
                };
            }

            return true;
        }
    }

    return false;
};

/**
 * Get texture.
 * @treturn Texture
 */
SurfaceMaterial.prototype.texture = function (iSlot) {
    debug_assert((iSlot >= 0 && iSlot < a.SurfaceMaterial.maxTexturesPerSurface),
                 "invalid texture slot");
    return this._pTexture[iSlot];
};

SurfaceMaterial.prototype.texcoord = function (iSlot) {
    'use strict';
    debug_assert((iSlot >= 0 && iSlot < a.SurfaceMaterial.maxTexturesPerSurface),
                 "invalid texture slot");
    return this._pTexcoord[iSlot];
};

/**
 * Получить матрицу текстуры.
 * @tparam Int iSlot
 */
SurfaceMaterial.prototype.textureMatrix = function (iSlot) {
    debug_assert(iSlot < a.SurfaceMaterial.maxTexturesPerSurface,
                 "invalid texture slot");
    return this._pTextureMatrix[iSlot];
};




/**
 * innitialize the resource (called once)
 * @treturn Boolean
 */
SurfaceMaterial.prototype.createResource = function () {
    debug_assert(!this.isResourceCreated(),
                 "The resource has already been created.");

    this.material = (0);

    this.notifyLoaded();
    this.notifyCreated();
    this.notifyDisabled();
    return(true);
};

/**
 *  destroy the resource
 *  @treturn Boolean
 */
SurfaceMaterial.prototype.destroyResource = function () {
    //
    // we permit redundant calls to destroy, so there are no asserts here
    //
    for (var i = 0; i < a.SurfaceMaterial.maxTexturesPerSurface; ++i) {
        delete (this._pTexture[i]);
        delete(this._pTextureMatrix[i]);
        a.BitFlags.clearBit(this._iTextureFlags, i);
        a.BitFlags.clearBit(this._iTextureMatrixFlags, i);
    }

    this._nTotalTextures = 0;
    if (this.isResourceCreated()) {
        // disable the resource
        this.disableResource();

        this.notifyUnloaded();
        this.notifyDestroyed();

        return(true);
    }
    return(false);
};

/**
 * prepare the resource for use (create any volatile memory objects needed)
 * @treturn Boolean
 */
SurfaceMaterial.prototype.restoreResource = function () {
    debug_assert(this.isResourceCreated(),
                 "The resource has not been created.");

    this.notifyRestored();
    return(true);
};

/**
 *  purge the resource from device-dependant memory
 *  @treturn Boolean
 */
SurfaceMaterial.prototype.disableResource = function () {
    debug_assert(this.isResourceCreated(),
                 "The resource has not been created.");

    this.notifyDisabled();
    return(true);
};

/**
 * load the resource from a file local (sFileName) or remote (sURI)
 * @tparam String sURI
 * @tparam String sFilename
 * @treturn Boolean
 */
SurfaceMaterial.prototype.loadResource = function (sFileName, sURI) {

    sFileName = sFileName || this.findResourceName();

    var isResult = false;

    // this._destroyResource();
    // this._createResource();

    //TODO: loadResource

    return isResult;
};

/**
 * save the resource to a file (or NULL to use the resource name)
 */
SurfaceMaterial.prototype.saveResource = function (sFileName) {

    sFileName = sFileName || this.findResourceName();

    var isResult = false;

    // var pFile = new a.LocalFile(sFileName, a.LocalFile.READ_WRITE,
    //                             a.LocalFile.TYPE_ARRAY_BUFFER);

    // var me = this;

    // pFile.open(
    //     function () {
    //         var sTextureName = null;

    //         var pWriter = new a.BinWriter();
    //         //me._pMaterial.dump(pWriter);

    //         pWriter.int32(me._nTotalTextures);
    //         pWriter.int32(me._iTextureFlags);
    //         pWriter.int32(me._iTextureMatrixFlags);

    //         for (var i = 0; i < a.SurfaceMaterial.maxTexturesPerSurface; i++) {
    //             if (TEST_BIT(me._iTextureFlags, i)) {
    //                 sTextureName = me._pTexture[i].findResourseName();
    //                 pWriter.string(sTextureName);
    //             }
    //             if (TEST_BIT(me._textureMatrixFlags, i)) {
    //                 pWriter.float32Array(me._pTextureMatrix[i]);
    //             }
    //         }

    //         pFile.write(
    //             pWriter.data(),
    //             function () {
    //                 return true;
    //             },
    //             function () {
    //                 error("can't write data to file");
    //                 isResult = false;
    //                 return false;
    //             }
    //         );
    //     },
    //     function () {
    //         error("can't open file");
    //         isResult = false;
    //         return false;
    //     }
    // );

    // pFile.close();

    //TODO: saveResource
    return isResult;
};


SurfaceMaterial.prototype.setTexture = function (iIndex, pTexture, iTexcoord) {
    iTexcoord = ifndef(iTexcoord, iIndex);

    debug_assert(iIndex < a.SurfaceMaterial.maxTexturesPerSurface,
                 "invalid texture slot");

    var pDisplayManager = this._pEngine.pDisplayManager;
    
    this._pTexcoord[iIndex] = iTexcoord;
    
    if (typeof pTexture == 'string') {
        if (this._pTexture[iIndex]) {
            //realise first

            a.safeRelease(this._pTexture[iIndex]);
            CLEAR_BIT(this._iTextureFlags, iIndex);
            --this._nTotalTextures;
        }


        this._pTexture[iIndex] = pDisplayManager.texturePool().loadResource(pTexture);

        if (this._pTexture[iIndex]) {
            SET_BIT(this._iTextureFlags, iIndex);
            ++this._nTotalTextures;
            this.connect(this._pTexture[iIndex], a.ResourcePoolItem.Loaded);
        }

        return true;
    }
    else if (pTexture instanceof a.Texture) {
        if (!this._pTexture[iIndex] || pTexture != this._pTexture[iIndex]) {
            if (this._pTexture[iIndex]) {
                // realise first
//        DisplayManager.texturePool().releaseResource(this._pTexture[iIndex]);
                a.safeRelease(this._pTexture[iIndex]);
                CLEAR_BIT(this._iTextureFlags, iIndex);
                --this._nTotalTextures;
            }

            this._pTexture[iIndex] = pTexture;


            this._pTexture[iIndex].addRef();
            SET_BIT(this._iTextureFlags, iIndex);
            ++this._nTotalTextures;
            this.connect(this._pTexture[iIndex], a.ResourcePoolItem.Loaded);

            // var me = this;
            // trace('me get texture :)');
            // pTexture.setChangesNotifyRoutine(function() {
            //                 if (pTexture.isResourceLoaded()) {
            //                     trace(arguments);
            //                     trace('Texture <', pTexture.findResourceName(), '> loaded');
            //                     if (me.isResourceLoaded()) {
            //                         trace('Surface material loaded too.')
            //                     }
            //                 }
            //             });
        }
        return true;
    }
    //similar to [cPoolHandle texture]
    else if (typeof pTexture == 'number') {
        if (!this._pTexture[iIndex] || this._pTexture[iIndex].resourceHandle() != pTexture) {
            if (this._pTexture[iIndex]) {
                //TheGameHost.displayManager().texturePool().releaseResource(m_pTexture[index]);
                a.safeRelease(this._pTexture[iIndex]);
                CLEAR_BIT(this._iTextureFlags, iIndex);
                --this._nTotalTextures;
            }

            this._pTexture[iIndex] = pDisplayManager.texturePool().getResource(pTexture);

            if (this._pTexture[iIndex]) {
                SET_BIT(this._iTextureFlags, iIndex);
                ++this._nTotalTextures;
                this.connect(this._pTexture[iIndex], a.ResourcePoolItem.Loaded);
            }
        }
        return true;
    }

    this._pTexcoord[iIndex] = iIndex;

    return false;
};

SurfaceMaterial.prototype.setTextureMatrix = function (index, matrix) {
    debug_assert(index < a.SurfaceMaterial.maxTexturesPerSurface,
                 "invalid texture slot");

    if (!matrix) {
        this._pTextureMatrix[index] = new Matrix4();
    }
    else {
        this._pTextureMatrix[index] = Mat4.create(matrix);
    }

    this._textureMatrixFlags.setBit(index);
    return true;
};

a.SurfaceMaterial = SurfaceMaterial;

//Define(a.SurfaceMaterialManager(), function(){a.ResourcePool(a.SurfaceMaterial)});

Define(a.SurfaceMaterialManager(pEngine), function () {
    a.ResourcePool(pEngine, a.SurfaceMaterial);
});