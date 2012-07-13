/**
 * @file
 * @author Ivan Popov
 * @email <vantuziast@gmail.com>
 * All supported materials in akra.
 */


/**
 * @enum
 * All registred properties of material.
 */
Enum([
    DIFFUSE = 'DIFFUSE',
    AMBIENT = 'AMBIENT',
    SPECULAR = 'SPECULAR',
    EMISSIVE = 'EMISSIVE',
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
function MaterialBase () {
  this._sName = null;
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
  this.ambient = new a.Color4f(.55, 1.);
  this.shininess = 55.;
};

// /**
//  * Get diffuse property of material.
//  */
// PROPERTY(MaterialBase, a.Material.DIFFUSE, 
//   function () {return this.getProperty(a.Material.DIFFUSE);},
//   function (c4fColor) {this.setProperty(a.Material.DIFFUSE);});
// /**
//  * Get ambient property of material.
//  */
// PROPERTY(MaterialBase, a.Material.AMBIENT, 
//   function () {return this.getProperty(a.Material.AMBIENT);},
//   function (c4fColor) {this.setProperty(a.Material.AMBIENT);});
// /**
//  * Get specular property of material.
//  */
// PROPERTY(MaterialBase, a.Material.SPECULAR, 
//   function () {return this.getProperty(a.Material.SPECULAR);},
//   function (c4fColor) {this.setProperty(a.Material.SPECULAR);});
// /**
//  * Get EMISSIVE property of material.
//  */
// PROPERTY(MaterialBase, a.Material.EMISSIVE, 
//   function () {return this.getProperty(a.Material.EMISSIVE);},
//   function (c4fColor) {this.setProperty(a.Material.EMISSIVE);});

// /**
//  * Get shininess property of material.
//  */
// PROPERTY(MaterialBase, a.Material.SHININESS, 
//   function () {return this.getProperty(a.Material.SHININESS);},
//   function (c4fColor) {this.setProperty(a.Material.SHININESS);});

// /**
//  * Get reflective property of material.
//  */
// PROPERTY(MaterialBase, a.Material.REFLECTIVE, 
//   function () {return this.getProperty(a.Material.REFLECTIVE);},
//   function (c4fColor) {this.setProperty(a.Material.REFLECTIVE);});

// /**
//  * Get reflectivity property of material.
//  */
// PROPERTY(MaterialBase, a.Material.REFLECTIVITY, 
//   function () {return this.getProperty(a.Material.REFLECTIVITY);},
//   function (c4fColor) {this.setProperty(a.Material.REFLECTIVITY);});

// /**
//  * Get transparent property of material.
//  */
// PROPERTY(MaterialBase, a.Material.TRANSPARENT, 
//   function () {return this.getProperty(a.Material.TRANSPARENT);},
//   function (c4fColor) {this.setProperty(a.Material.TRANSPARENT);});

// /**
//  * Get transparentcy property of material.
//  */
// PROPERTY(MaterialBase, a.Material.TRANSPARENCY, 
//   function () {return this.getProperty(a.Material.TRANSPARENCY);},
//   function (c4fColor) {this.setProperty(a.Material.TRANSPARENCY);});

// /**
//  * Get "index of refraction" property of material.
//  */
// PROPERTY(MaterialBase, a.Material.INDEXOFREFRACTION, 
//   function () {return this.getProperty(a.Material.INDEXOFREFRACTION);},
//   function (c4fColor) {this.setProperty(a.Material.INDEXOFREFRACTION);});

/**
 * Independent Material class.
 * @ctor
 */
function Material () {
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

/**
 * MeshMaterial class. 
 * @ctor
 * @param {String} sName       Name of material.
 * @param {VertexData} pVertexData Material storage.
 */
function MeshMaterial (sName, pVertexData) {
    A_CLASS;

    this._pData = pVertexData;
    this.name = sName;
}

EXTENDS(MeshMaterial, a.MaterialBase);

/**
 * Declaration of material data.
 * @return {VertexDeclaration} 
 */
MeshMaterial.vertexDeclaration = function () {
    return new a.VertexDeclaration([
            {nCount: 17, eType: a.DTYPE.FLOAT, eUsage: 'MATERIAL'},
            {nCount: 4, eType: a.DTYPE.FLOAT, eUsage: 'DIFFUSE', iOffset: 0},
            {nCount: 4, eType: a.DTYPE.FLOAT, eUsage: 'AMBIENT'},
            {nCount: 4, eType: a.DTYPE.FLOAT, eUsage: 'SPECULAR'},
            {nCount: 4, eType: a.DTYPE.FLOAT, eUsage: 'EMISSIVE'},
            {nCount: 1, eType: a.DTYPE.FLOAT, eUsage: 'SHININESS'}
        ]);
};

MeshMaterial.prototype.getProperty = function(eProperty) {
  switch (eProperty) {
    case a.Material.DIFFUSE:    return this._pData.getTypedData(a.DECLUSAGE.DIFFUSE,   0, 1);
    case a.Material.AMBIENT:    return this._pData.getTypedData(a.DECLUSAGE.AMBIENT,   0, 1);
    case a.Material.SPECULAR:   return this._pData.getTypedData(a.DECLUSAGE.SPECULAR,  0, 1);
    case a.Material.EMISSIVE:   return this._pData.getTypedData(a.DECLUSAGE.EMISSIVE,  0, 1);
    case a.Material.SHININESS:  return this._pData.getTypedData(a.DECLUSAGE.SHININESS, 0, 1)[0];
  }

  return null;
};

MeshMaterial.prototype.setProperty = function(eProperty, pValue) {
  switch (eProperty) {
    case a.Material.DIFFUSE:    return this._pData.setData(pValue, a.DECLUSAGE.DIFFUSE);
    case a.Material.AMBIENT:    return this._pData.setData(pValue, a.DECLUSAGE.AMBIENT);
    case a.Material.SPECULAR:   return this._pData.setData(pValue, a.DECLUSAGE.SPECULAR);
    case a.Material.EMISSIVE:   return this._pData.setData(pValue, a.DECLUSAGE.EMISSIVE);
    case a.Material.SHININESS:  return this._pData.setData(new Float32(pValue), a.DECLUSAGE.SHININESS);
  }
  
  return null;
};

PROPERTY(MeshMaterial, 'data',
    function () {
        return this._pData.getTypedData(a.DECLUSAGE.MATERIAL, 0, 1);
    },
    function (pData) {
        this._pData.setData(pData, a.DECLUSAGE.MATERIAL);
    });

A_NAMESPACE(MeshMaterial);
