

/**
 * @enum
 * All registred properties of material.
 */
Enum([
    DIFFUSE = 'DIFFUSE',
    AMBIENT = 'AMBIENT',
    SPECULAR = 'SPECULAR',
    EMISSIVE = 'EMISSIVE',
    EMISSION = 'EMISSIVE',//a.Material.EMISSIVE
    SHININESS = 'SHININESS',
    REFLECTIVE = 'REFLECTIVE',
    REFLECTIVITY = 'REFLECTIVITY',
    TRANSPARENT = 'TRANSPARENT',
    TRANSPARENCY = 'TRANSPARENCY',
    INDEXOFREFRACTION = 'INDEXOFREFRACTION'

    ], MATERIAL_COMPONENTS, a.Material);


/**
 * MaterialBase (Phong model)
 * @ctor
 * Constructor.
 */
function MaterialBase (sName) {
  this._sName = sName || 'unknown';
  this._iID = 0;
}

PROPERTY(MaterialBase, 'value',
  function () {
    return this;
  },
  function (pMaterialBase) {
    if (!pMaterialBase) {
      return;
    }
    
    var pPoperties = __KEYS__(MATERIAL_COMPONENTS);
    
    for (var i in pPoperties) {
      this.setProperty(pPoperties[i], 
        pMaterialBase.getProperty(pPoperties[i]));
    }
  });

/**
 * Get material name.
 */
PROPERTY(MaterialBase, 'name', 
    function () {
        return this._sName;
    },
    function (sName) {
      this._sName = sName;
    });

PROPERTY(MaterialBase, 'id',
  function () {
    return this._iID;
  },
  function (iID) {
    this._iID = Number(iID);
  });

/**
 * Get material data, if it exists.
 */
PROPERTY(MaterialBase, 'data', 
    function () {
        return null;
    },
    function (sName) {
      
    });

/**
 * Extract material component.
 * @param  {MATERIAL_COMPONENTS} eProperty Material component.
 * @return {ColorValue}     
 * @protected      
 */
MaterialBase.prototype.getProperty = function(eProperty) {
    return null;
};

/**
 * Set material component.
 * @param {MATERIAL_COMPONENTS} eProperty Material component.
 * @param {Object} pValue   
 * @return {Boolean}
 * @protected
 */
MaterialBase.prototype.setProperty = function(eProperty, pValue) {
  return false;
};

a.MaterialBase = MaterialBase;

for (var m in __KEYS__(MATERIAL_COMPONENTS)) {
  (function (sComponent) {
      PROPERTY(MaterialBase, sComponent.toLowerCase(), 
      function () {return this.getProperty(sComponent);},
      function (c4fColor) {this.setProperty(sComponent, c4fColor);});
  })(__KEYS__(MATERIAL_COMPONENTS)[m]);
}

MaterialBase.prototype.toDefault = function() {
  'use strict';

  this.diffuse = new a.Color4f(.5, 1.);
  this.ambient = new a.Color4f(.8, 1.);
  this.specular = new a.Color4f(.5, 1.)
  this.shininess = 55.;
};