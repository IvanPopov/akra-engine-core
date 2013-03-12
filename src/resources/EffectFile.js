/**
 * @file
 * @brief file contains EffectFile realization
 * @author reinor
 *
 */

/**
 * EffectFile class
 * @ctor
 * constructor of EffectFile class
 *
 */
function EffectFile (pEngine) {
    EffectFile.superclass.constructor.apply(this, arguments);
    /**
     * this enums contains data types and constants
     */


    Enum([
             worldMatrix = 0,
             viewMatrix,
             projMatrix,

             worldViewMatrix,
             viewProjMatrix,
             worldViewProjMatrix,

             worldMatrixArray,

             normalMatrix,

             max_matrix_handles
         ], eMatrixHandles, a.EffectFile);

    Enum([
             boneInfluenceCount = 0,

             ambientMaterialColor,
             diffuseMaterialColor,
             emissiveMaterialColor,
             specularMaterialColor,
             specularMaterialPower,

             pointLightPos0,
             pointlightVec0,
             pointlightColor0,

             sunVector,
             sunColor,
             cameraPos,
             cameraDistances,
             cameraFacing,
             ambientLight,

             patchCorners,
             atmosphericLighting,

             posScaleOffset,
             uvScaleOffset,

             lensFlareColor,

             max_param_handles
         ], eParameterHandles, a.EffectFile);


    Enum([max_texture_handles = a.SurfaceMaterial.maxTexturesPerSurface],
         eTextureHandles, a.EffectFile);

    // Private Data

    /**
     * all this strings is D3DXHANDLE
     */


    /**defined pointer to directX interface
     * @type string
     */
    this._pEffect = null;

    /**contains description of effect
     * a.EffectDesk - implementation of struct D3DXEFFECT_DESC
     * @type EffectDesc
     */
    this._pEffectDesc = null;

    /** @type String */
    this._sTechnique = null;

    /**contains description of rendering process
     * a.TechniqueDesc - implementation of struct D3DXTECHNIQUE_DESC
     * @type TechniqueDesc
     */
    this._pTechniqueDesc = null;

    /**
     * parameters handlers array
     * @type array(string)
     */
    this._pParamHandle = new Array(a.EffectFile.max_param_handles);

    /**
     * matrix handlers array
     * @type array(string)
     */
    this._pMatrixHandle = new Array(a.EffectFile.max_matrix_handles);

    /**
     * texture handlers array
     * @type array(string)
     */
    this._pTextureHandle = new Array(a.EffectFile.max_texture_handles);

    /**
     * texture matrix handlers array
     * @type array(string)
     */
    this._pTtextureMatrixHandle = new Array(a.EffectFile.max_texture_handles);


    /** @type string */
    this._pShadowTextureHandle = null;
}


a.extend(EffectFile, a.ResourcePoolItem);

/**
 * return pointer on interface
 * @treturn string
 */
EffectFile.prototype.effect = function () {
    INLINE();
    return this._pEffect;
};

/**
 * return number of passes for the effect
 * @treturn Int
 */
EffectFile.prototype.totalPasses = function () {
    INLINE();
    debug_assert(this._pEffect, "EffectFile is not valid");
    return this._pTechniqueDesc.nPasses;
};

/**
 * check using the parameter
 * @tparam  Int from enum eParameterHandles
 * @treturn Boolean
 */
EffectFile.prototype.isParameterUsed = function (iIndex) {
    INLINE();
    return (this._pParamHandle[iIndex] != null);
};

/**
 * check using the matrix
 * @tparam  Int from enum eMatrixHandles
 * @treturn Boolean
 */
EffectFile.prototype.isMatrixUsed = function (iIndex) {
    INLINE();
    return (this._pMatrixHandle[iIndex] != null);
};

/**
 * check using the texture
 * @tparam  Int from enum eTextureHandles
 * @treturn Boolean
 */
EffectFile.prototype.isTextureUsed = function (iIndex) {
    INLINE();
    return (this._pTextureHandle[iIndex] != null);
};

/**
 * check using the shadow texture
 * @treturn Boolean
 */
EffectFile.prototype.isShadowTextureUsed = function () {
    INLINE();
    return (this._pShadowTextureHandle != null);
};

/**
 * check using the texture matrix
 * @tparam  Int from enum eTextureHandles
 * @treturn Boolean
 */
EffectFile.prototype.isTextureMatrixUsed = function (iIndex) {
    INLINE();
    return (this._pTtextureMatrixHandle[iIndex] != null);
};

/**
 * set effect file parameters
 * @tparam Int iIndex from eParameterHandles
 * @tparam * pData pointer to object
 * @treturn Boolean True if succeed, otherwise False
 */
EffectFile.prototype.setParameter = function (iIndex, pData) {
    INLINE();
    if (this._pEffect != null && this.isParameterUsed(iIndex)) {
        var isSucceeded = this._pEffect.setValue(
            this._pParamHandle[iIndex], pData);

        debug_assert(isSucceeded, "effect file error");
        return isSucceeded;
    }
    return false;
};


/**
 * set effect file matrix
 * sets a non-transposed matrix
 * @tparam Int iIndex from eMatrixHandles
 * @tparam Float32Array pData pointer to 4x4 matrix
 * @treturn Boolean True if succeed, otherwise False
 */

EffectFile.prototype.setMatrix = function (iIndex, pData) {
    INLINE();
    if (this._pEffect != null && this.isMatrixUsed(iIndex)) {
        return this._pEffect.setMatrix(this._pMatrixHandle[iIndex], pData);
    }

    return false;
};

/**
 * non understandable
 */

/*EffectFile.prototype.setMatrixInArray = function(iIndex,element,data){
 INLINE();
 if (this._pEffect != null && this.isMatrixUsed(iIndex)){
 var subHandle = this._pEffect.
 getParameterElement(this._matrixHandle[iIndex],element);
 return this._pEffect.setMatrix(subHandle, data);
 }
 return false;
 };*/

/**
 * Sets array of floating point values in parameter iIndex
 * @tparam Int iIndex from eParameterHandles
 * @tparam Float32Array pData
 * @tparam Int iCount number of elements in pData array
 * @treturn Boolean True if succeed, otherwise False
 */

EffectFile.prototype.setFloatArray = function (iIndex, pData, iCount) {
    INLINE();
    if (this._pEffect != null && this.isParameterUsed(iIndex)) {
        return this._pEffect.
            setFloatArray(this._pParamHandle[iIndex], pData, iCount);
    }
    return false;
};

/**
 * Sets float fData in array _paramHandle[iIndex] on iElement position
 * @tparam Int iIndex from eParameterHandles
 * @tparam Int iElement
 * @tparam Float fData new value
 * @treturn Boolean True if succeed, otherwise False
 */
EffectFile.prototype.setFloatInArray = function (iIndex, iElement, fData) {
    INLINE();
    if (this._pEffect != null && this.isParameterUsed(iIndex)) {
        var subHandle = this._pEffect.
            getParameterElement(this._pParamHandle[iIndex], iElement);
        return this._pEffect.setFloat(subHandle, fData);
    }
    return false;
};

/**
 * Sets texture in array _textureHandle on iIndex position
 * @tparam Int iIndex
 * @tparam Texture fData texture class
 * @treturn Boolean True if succeed, otherwise False
 */
EffectFile.prototype.setTexture = function (iIndex, pData) {

    INLINE();
    if (this._pEffect != null && this.isTextureUsed(iIndex)) {
        return this._pEffect.
            setTexture(this._pTextureHandle[iIndex], pData.getTexture());
    }
    return false;
};

/**
 * Sets shadow texture if possible
 * @tparam Texture fData texture class
 * @treturn Boolean True if succeed, otherwise False
 */
EffectFile.prototype.setShadowTexture = function (pData) {
    INLINE();
    if (this._pEffect != null && this.isShadowTextureUsed()) {
        return this._pEffect.
            setTexture(this._pShadowTextureHandle, pData.getTexture());
    }
    return false;
};

/**
 * sets effect file matrix pData to _textureMatrixHanfle[iIndex]
 * @tparam Int iIndex
 * @tparam Float32Array pData pointer to 4x4 matrix
 * @treturn Boolean True if succeed, otherwise False
 */
EffectFile.prototype.setTextureMatrix = function (iIndex, pData) {
    INLINE();
    if (this._pEffect && this.isTextureMatrixUsed(iIndex)) {
        return this._pEffect.setMatrix(this._pTtextureMatrixHandle[iIndex], pData);
    }
    return false;
};

/**
 * innitialize the resource (called once)
 * @treturn Boolean always true
 */
EffectFile.prototype.createResource = function () {
    return true;
};

/**
 * destroy the resource
 * @treturn Boolean always true
 */
EffectFile.prototype.destroyResource = function () {
    safe_release(this._pEffect);
    return true;
};

/**
 * purge the resource from volatile memory
 * @treturn Boolean always true
 */
EffectFile.prototype.disableResource = function () {
    if (this._pEffect != null) {
        this._pEffect.onLostDevice();
    }
    return true;
};

/**
 * prepare the resource for use (create any volatile memory objects needed)
 * @treturn Boolean always true
 */
EffectFile.prototype.restoreResource = function () {
    //if (this._pEffect != null)
    //    this._pEffect.onResetDevice();
    return true;
};

/**
 * load the resource from a file
 * @tparam String sFileName - path to file with resource
 * @treturn Boolean true if succeeded, otherwise false
 */
EffectFile.prototype.loadResource = function (sFileName) {
    safe_release(this._pEffect);

    var isOk = false;

    var sFilePath = sFileName;

    if (sFileName == null) {
        sFilePath = this.findResourceName();
    }

    var sBufferErrors = null;

    //TODO: D3DXCreateEffectFromFile
    var me = this;
    a.createEffectFromFile(this._pEngine, sFilePath, function (isOk, pEffect) {
        me._pEffect = pEffect;

        if (!isOk) {
            debug_error("cannot create effect from file: " + sFilePath);
            return false;
        }
        // get the description
        me._pEffectDesc = me._pEffect.getDesc();

        // find the best possible technique
        me._sTechnique = me._pEffect.findNextValidTechnique(null);
        if (!me._sTechnique) {
            debug_error("can't find next valid technique");
            safe_release(me._pEffect);
            return false;
        }

        // get some info about the technique
        me._pTechniqueDesc = me._pEffect.getTechniqueDesc(me._sTechnique);
        if (!me._pTechniqueDesc) {
            debug_error("cannot get technique description");
            safe_release(me._pEffect);
            return false;
        }

        // activate it
        isOk = me._pEffect.setTechnique(me._sTechnique);
        if (!isOk) {
            debug_error("cannot set techique");
            safe_release(me._pEffect);
            return false;
        }

        // parse the effect parameters to build a list of handles
        me._parseParameters();

        me.notifyLoaded();
    });

    return true;
};

/**
 * parse the effect parameters to build a list of handles
 */
EffectFile.prototype._parseParameters = function () {

    // Look at parameters for semantics and annotations that we know how to interpret
    //static char numerals[] = {'0','1','2','3','4','5','6','7','8','9'};

    //a.ParameterDesc - implementation of D3DXPARAMETER_DESC

    var pParamDesc = new a.ParameterDesc();
    var sParam = null;
    var sTmp;
    var iTexture;
    var pEffect = this._pEffect;

    for (var iParam = 0; iParam < this._pEffectDesc.nParameters; iParam++) {

        sParam = this._pEffect.getParameter(null, iParam);
        pParamDesc = pEffect.getParameterDesc(sParam);

        var sSemantics = pParamDesc.sSemantics;

        if (!sSemantics) {
            sSemantics = '';
        }
        sSemantics = sSemantics.toLowerCase();


        if (pParamDesc.eClass == a.ParameterDesc.Class.MATRIX_ROWS ||
            pParamDesc.eClass == a.ParameterDesc.Class.MATRIX_COLUMNS) {

            if (sSemantics == "world") {
                this._pMatrixHandle[a.EffectFile.worldMatrix] = sParam;
            }
            else if (sSemantics == "view") {
                this._pMatrixHandle[a.EffectFile.viewMatrix] = sParam;
            }
            else if (sSemantics == "projection") {
                this._pMatrixHandle[a.EffectFile.projMatrix] = sParam;
            }
            else if (sSemantics == "worldview") {
                this._pMatrixHandle[a.EffectFile.worldViewMatrix] = sParam;
            }
            else if (sSemantics == "viewprojection") {
                this._pMatrixHandle[a.EffectFile.viewProjMatrix] = sParam;
            }
            else if (sSemantics == "worldviewprojection") {
                this._pMatrixHandle[a.EffectFile.worldViewProjMatrix] = sParam;
            }
            else if (sSemantics == "worldmatrixarray") {
                this._pMatrixHandle[a.EffectFile.worldMatrixArray] = sParam;
            }
            else if (sSemantics == "normalmatrix") {
                this._pMatrixHandle[a.EffectFile.normalMatrix] = sParam;
            }

            if (sSemantics.search("texmat")) {
                sTmp = pParamDesc.sName.match(/\d+/);
                if (sTmp != null) {
                    iTexture = parseInt(sTmp[0]);
                    if (iTexture >= 0
                        && iTexture < a.EffectFile.max_texture_handles) {
                        this._pTtextureMatrixHandle[iTexture] = sParam;
                    }
                }
            }
        }

        if (pParamDesc.eClass == a.ParameterDesc.Class.VECTOR) {
            if (sSemantics == "materialambient") {
                this._pParamHandle[a.EffectFile.ambientMaterialColor] = sParam;
            }
            else if (sSemantics == "materialdiffuse") {
                this._pParamHandle[a.EffectFile.diffuseMaterialColor] = sParam;
            }
            else if (sSemantics == "materialspecular") {
                this._pParamHandle[a.EffectFile.specularMaterialColor] = sParam;
            }
            else if (sSemantics == "materialemissive") {
                this._pParamHandle[a.EffectFile.emissiveMaterialColor] = sParam;
            }
            else if (sSemantics == "sunvector") {
                this._pParamHandle[a.EffectFile.sunVector] = sParam;
            }
            else if (sSemantics == "suncolor") {
                this._pParamHandle[a.EffectFile.sunColor] = sParam;
            }
            else if (sSemantics == "worldcamerapos") {
                this._pParamHandle[a.EffectFile.cameraPos] = sParam;
            }
            else if (sSemantics == "viewdistances") {
                this._pParamHandle[a.EffectFile.cameraDistances] = sParam;
            }
            else if (sSemantics == "worldviewvector") {
                this._pParamHandle[a.EffectFile.cameraFacing] = sParam;
            }
            else if (sSemantics == "ambientlight") {
                this._pParamHandle[a.EffectFile.ambientLight] = sParam;
            }
            else if (sSemantics == "posscaleoffset") {
                this._pParamHandle[a.EffectFile.posScaleOffset] = sParam;
            }
            else if (sSemantics == "uvscaleoffset") {
                this._pParamHandle[a.EffectFile.uvScaleOffset] = sParam;
            }
            else if (sSemantics == "flarecolor") {
                this._pParamHandle[a.EffectFile.lensFlareColor] = sParam;
            }
        }

        if (pParamDesc.eClass == a.ParameterDesc.Class.SCALAR) {
            if (pParamDesc.sName.toLowerCase() == "curnumbones") {
                this._pParamHandle[a.EffectFile.boneInfluenceCount] = sParam;
            }
            else if (sSemantics == "materialpower") {
                this._pParamHandle[a.EffectFile.specularMaterialPower] = sParam;
            }
        }

        if (pParamDesc.eClass == a.ParameterDesc.Class.OBJECT) {

            if (pParamDesc.eType == a.ParameterDesc.TEXTURE
                && pParamDesc.sName.toLowerCase() == "shadow") {
                this._pShadowTextureHandle = sParam;
            }
            else if (pParamDesc.eType == a.ParameterDesc.Type.TEXTURE
                || pParamDesc.eType == a.ParameterDesc.Type.TEXTURE2D
                || pParamDesc.eType == a.ParameterDesc.Type.TEXTURE3D
                || pParamDesc.eType == a.ParameterDesc.Type.TEXTURECUBE) {

                sTmp = pParamDesc.sName.match(/\d+/);
                if (sTmp != null) {
                    iTexture = parseInt(sTmp[0], 10);
                    if (iTexture >= 0
                        && iTexture < a.EffectFile.max_texture_handles) {
                        this._pTextureHandle[iTexture] = sParam;
                    }
                }
            }
        }

        if (pParamDesc.eClass == a.ParameterDesc.Class.STRUCT) {
            if (sSemantics == "atmosphericlighting") {
                this._pParamHandle[a.EffectFile.atmosphericLighting] = sParam;
            }
            else if (sSemantics == "patchcorners") {
                this._pParamHandle[a.EffectFile.patchCorners] = sParam;
            }
        }
    }
};

/**
 * save resource in sFileName file (not implemented yet)
 * @tparam String sFileName
 * @treturn true if succeeded, otherwise false
 */

EffectFile.prototype.saveResource = function (sFileName) {
    return true;
};

/**
 * Start an active technique
 * @treturn return true if succeeded, otherwise false
 */
EffectFile.prototype.begin = function () {
    debug_assert(this._pEffect != null, "This EffectFile is not valid");
    //TODO: D3DXFX_DONOTSAVESTATE|D3DXFX_DONOTSAVESHADERSTATE - not implemented yet
    //var isOk = this._pEffect.begin(0, D3DXFX_DONOTSAVESTATE|D3DXFX_DONOTSAVESHADERSTATE);
    var isOk = this._pEffect.begin(0, 0);
    if (!isOk) {
        debug_error("EffectFile.begin this._pEffect.begin error");
        return false;
    }

    // set the lighting parameters
    // from the global light manager
    //this.applyGlobalLightingData();

    // set the camera matricies

    this.applyCameraMatrices(this._pEngine._pActiveCamera);

    return true;
};

/**
 * activate pass iPass
 * @tparam Int iPass - number of pass
 * @treturn return true if succeeded, otherwise false
 */
EffectFile.prototype.activatePass = function (iPass) {
    var isOk = this._pEffect.beginPass(iPass);
    if (!isOk) {
        debug_error("EffectFile.activatePass this._pEffect.beginPass() error");
        return false;
    }
    return true;
};

EffectFile.prototype.deactivatePass = function () {
    this._pEffect.endPass();
    return true;
};

/**
 * End an active technique
 */
EffectFile.prototype.end = function () {
    debug_assert(this._pEffect != null, "This EffectFile is not valid");
    var isOk = this._pEffect.end();
    if (!isOk) {
        debug_error(result);
    }
};

/**
 * applied surface material pSurfaceMaterial
 * @tparam a.SurfaceMaterial
 */
EffectFile.prototype.applySurfaceMaterial = function (pSurfaceMaterial) {
    if (pSurfaceMaterial != null) {
        // set material properties
        var material = pSurfaceMaterial.material();

        if (this.isParameterUsed(a.EffectFile.ambientMaterialColor)) {
            this.setParameter(a.EffectFile.ambientMaterialColor,
                              material.pAmbient);
        }

        if (this.isParameterUsed(a.EffectFile.diffuseMaterialColor)) {
            this.setParameter(a.EffectFile.diffuseMaterialColor,
                              material.pDiffuse);
        }
        if (this.isParameterUsed(a.EffectFile.emissiveMaterialColor)) {
            this.setParameter(a.EffectFile.emissiveMaterialColor,
                              material.pEmissive);
        }

        if (this.isParameterUsed(a.EffectFile.specularMaterialColor)) {
            this.setParameter(a.EffectFile.specularMaterialColor,
                              material.pSpecular);
        }

        if (this.isParameterUsed(a.EffectFile.specularMaterialPower)) {
            this.setParameter(a.EffectFile.specularMaterialPower,
                              material.fPower);
        }

        // set textures
        for (var i = 0; i < a.SurfaceMaterial.maxTexturesPerSurface; i++) {
            if (TEST_BIT(pSurfaceMaterial.textureFlags(), i)) {
                this.setTexture(i, pSurfaceMaterial.texture(i));
            }

            if (TEST_BIT(pSurfaceMaterial.textureMatrixFlags(), i)) {
                this.setTextureMatrix(i, pSurfaceMaterial.textureMatrix(i));
            }
        }
    }
};

/**
 * apply global lighting and pass lighting structure to the shader
 */
EffectFile.prototype.applyGlobalLightingData = function () {

    // pass the lighting structure to the shader
    this.setParameter(a.EffectFile.atmosphericLighting,
                      a.LightManager.lightScatteringData().getShaderData());

    // pass the lighting structure to the shader
    this.setParameter(a.EffectColor.sunColor,
                      a.LightManager.sunColor());

    this.setParameter(a.EffectColor.sunVector,
                      a.LightManager.sunVector());

    this.setParameter(a.EffectColor.ambientLight,
                      a.LightManager.ambientHue());
};

EffectFile._v4fcameraDistances = new Vector4;
EffectFile.prototype.applyCameraMatrices = function (pCamera) {

    if (pCamera != null) {
        // set the view matrix
        this.setMatrix(a.EffectFile.viewMatrix, pCamera.viewMatrix());
        // set the projection matrix
        this.setMatrix(a.EffectFile.projMatrix, pCamera.projectionMatrix());
        // set the combined matrix
        this.setMatrix(a.EffectFile.viewProjMatrix, pCamera.viewProjMatrix());

        // set the world camera pos
        this.setParameter(a.EffectFile.cameraPos, pCamera.worldPosition());
        // set the world camera facing vector
        this.setParameter(a.EffectFile.cameraFacing, pCamera.worldForward());


        var v4fcameraDistances = EffectFile._v4fcameraDistances;
        v4fcameraDistances.X = pCamera.fNearPlane;
        v4fcameraDistances.Y = pCamera.fFarPlane;
        v4fcameraDistances.Z = pCamera.fFarPlane - pCamera.fNearPlane;
        v4fcameraDistances.W = 1. / pCamera.fFarPlane;

        this.setParameter(a.EffectFile.cameraDistances, v4fcameraDistances);
    }
};

EffectFile.prototype.applyVertexBuffer = function (pBuffer) {
    this._pEffect.applyVertexBuffer(pBuffer);
}

a.EffectFile = EffectFile;
Define(a.EffectFileManager(pEngine), function () {
    a.ResourcePool(pEngine, a.EffectFile)
});
