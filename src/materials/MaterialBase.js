

/**
 * @enum
 * All registred properties of material.
 */
Enum([
    DIFFUSE = 'MATERIAL.DIFFUSE',
    AMBIENT = 'MATERIAL.AMBIENT',
    SPECULAR = 'MATERIAL.SPECULAR',
    EMISSIVE = 'MATERIAL.EMISSIVE',
    EMISSION = 'MATERIAL.EMISSIVE',
    SHININESS = 'MATERIAL.SHININESS',
    REFLECTIVE = 'MATERIAL.REFLECTIVE',
    REFLECTIVITY = 'MATERIAL.REFLECTIVITY',
    TRANSPARENT = 'MATERIAL.TRANSPARENT',
    TRANSPARENCY = 'MATERIAL.TRANSPARENCY',
    INDEXOFREFRACTION = 'MATERIAL.INDEXOFREFRACTION'
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
    
    var pPoperties = __ENUM__(MATERIAL_COMPONENTS);
    
    for (var i in pPoperties) {
      if (i === 'EMISSION') {
        continue;
      }

      this.setProperty(i, pMaterialBase.getProperty(i));
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

for (var m in __ENUM__(MATERIAL_COMPONENTS)) {
  (function (sComponent, eValue) {
      PROPERTY(MaterialBase, sComponent.toLowerCase(), 
      function () {return this.getProperty(eValue);},
      function (c4fColor) {this.setProperty(eValue, c4fColor);});
  })(m, __ENUM__(MATERIAL_COMPONENTS)[m]);
}

MaterialBase.prototype.toDefault = function() {
  'use strict';

  this.diffuse = new a.Color4f(.5, 1.);
  this.ambient = new a.Color4f(.8, 1.);
  this.specular = new a.Color4f(.5, 1.)
  this.shininess = 55.;
};

Ifdef (__DEBUG);

MaterialBase.prototype.toString = function () {
    'use strict';
    
    var s = '';
    function printColor (pColor) {
      var r = Math.floor(pColor.R * 255);
      var g = Math.floor(pColor.G * 255);
      var b = Math.floor(pColor.B * 255);
      var a = Math.floor(pColor.A * 255);
      return '0x' + r.toHex(2) + g.toHex(2) + b.toHex(2) + a.toHex(2) + 
        '  (R: ' + pColor.R.toFixed(2) + ', G: ' + pColor.G.toFixed(2) + 
        ', B: ' + pColor.B.toFixed(2) + ', A: ' + pColor.A.toFixed(2) + ')';
    }
    s += 'MATERIAL: ' + this.name + '\n';
    s += '----------------------------------------------\n';
    s += ' diffuse: ' + printColor(this.diffuse) + '\n';
    s += ' ambient: ' + printColor(this.ambient) + '\n';
    s += 'emissive: ' + printColor(this.emissive) + '\n';
    s += 'specular: ' + printColor(this.specular) + '\n';
    s += 'shininess: ' + this.shininess + '\n';
    return s;
};

Endif ();