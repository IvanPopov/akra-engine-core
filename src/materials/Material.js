/**
 * @file
 * @author Ivan Popov
 * @email <vantuziast@gmail.com>
 * All supported materials in akra.
 */


/**
 * Independent Material class.
 * @ctor
 */
function Material (sName) {
   A_CLASS;
   /**
    * @type ColorValue
    */
   this.pDiffuse = new a.ColorValue;
   /**
    * @type ColorValue
    */
   this.pAmbient = new a.ColorValue;
   /**
    * @type ColorValue
    */
   this.pSpecular = new a.ColorValue;
   /**
    * @type ColorValue
    */
   this.pEMISSIVE = new a.ColorValue;
   /**
    * @type Float
    */
   this.pShininess = 0;
}

EXTENDS(Material, a.MaterialBase);

/**
 * Get property of material.
 * @param  {[type]} eProperty [description]
 * @return {[type]}           [description]
 */
Material.prototype.getProperty = function(eProperty) {
  switch (eProperty) {
    case a.Material.DIFFUSE:    return this.pDiffuse;
    case a.Material.AMBIENT:    return this.pAmbient;
    case a.Material.SPECULAR:   return this.pSpecular;
    case a.Material.EMISSIVE:   return this.pEMISSIVE;
    case a.Material.SHININESS:  return this.pShininess;
  }

  return null;
};

/**
 * Set property for Material.
 * @param {MATERIAL_COMPONENTS} eProperty Name of property.
 * @param {Object} pValue    Component value.
 */
Material.prototype.setProperty = function(eProperty, pValue) {
  switch (eProperty) {
    case a.Material.DIFFUSE:    this.pDiffuse = pValue; return true;
    case a.Material.AMBIENT:    this.pAmbient = pValue; return true;
    case a.Material.SPECULAR:   this.pSpecular = pValue; return true;
    case a.Material.EMISSIVE:   this.pEMISSIVE = pValue; return true;
    case a.Material.SHININESS:  this.pShininess = pValue; return true;
  }
  
  return null;
};


A_NAMESPACE(Material);

