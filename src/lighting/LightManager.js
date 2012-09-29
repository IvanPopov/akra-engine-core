/**
 * @file
 * @author Igor Karateev
 * @email iakarateev@gmail.com
 * @brief файл содержит класс LightManager
 */

/**
 * Класс LightManager отвечает за хранение информации о источниках света,
 * а также хранит в себе текстуры для deferred shading-а
 * и общию depth текстуры сцены
 *
 * nMaxDeferredTextureCount - количество текстур используемых для
 * deferred shading-а, по умолчанию создается две текстуры, для рендеринга базовых вещей,
 * а именно
 * normals, shininess
 * emissive
 * diffuse
 * specular
 * ambient
 */
function LightManager(pEngine, nMaxDeferredTextureCount) {
    'use strict';

    nMaxDeferredTextureCount = ifndef(nMaxDeferredTextureCount, 2);

    this._pEngine = pEngine;

    this._pLightPoints = [];

    //depth текстура сцены
    this._pDepthTexture = null;

    this._nMaxDeferredTextureCount = nMaxDeferredTextureCount;

    //float текстуры для deferred shading-а
    this._pDeferredTextures = new Array(nMaxDeferredTextureCount);

    //ширина и высота текстур, основывается на размере канваса
    this._iWidth = Math.ceilingPowerOfTwo(pEngine.pCanvas.width);
    this._iHeight = Math.ceilingPowerOfTwo(pEngine.pCanvas.height);

    //TODO: completly check all browsers tha can not support large(2048+) textures.
    if(a.browser.name === 'Firefox') {
        this._iWidth = Math.min(this._iWidth, 1024);
        this._iHeight = Math.min(this._iHeight, 1024);
        
    }

    this._pDeferredFrameBuffers = new Array(nMaxDeferredTextureCount);
//    this._initializeTextures();
    this._pLightingUnifoms = {
        omni           : [],
        project        : [],
        omniShadows    : [],
        projectShadows : [],
        textures       : []
    };
}
;


PROPERTY(LightManager, 'depthTexture',
         function () {
             return this._pDepthTexture;
         }
);

PROPERTY(LightManager, 'deferredTextures',
         function () {
             return this._pDeferredTextures;
         }
);

PROPERTY(LightManager, 'lightPoints',
         function () {
             return this._pLightPoints;
         }
);

PROPERTY(LightManager, 'deferredFrameBuffers',
         function () {
             return this._pDeferredFrameBuffers;
         }
);

LightManager.prototype.registerLightPoint = function (pLightPoint) {
    'use strict';

    var id = this._pLightPoints.length;
    this._pLightPoints.push(pLightPoint);
    return id;
};

LightManager.prototype._initializeTextures = function () {
    'use strict';

    var pEngine = this._pEngine;
    var pCanvas = pEngine.pCanvas;
    var iWidth = this._iWidth;
    var iHeight = this._iHeight;

    //depth texture

    var pDepthTexture = this._pDepthTexture = pEngine.displayManager().
        texturePool().createResource('depth_texture_' + a.sid());
    pDepthTexture.createTexture(iWidth, iHeight,
                                0, a.IFORMAT.DEPTH_COMPONENT, a.DTYPE.UNSIGNED_INT, null);

    pDepthTexture.applyParameter(a.TPARAM.WRAP_S, a.TWRAPMODE.CLAMP_TO_EDGE);
    pDepthTexture.applyParameter(a.TPARAM.WRAP_T, a.TWRAPMODE.CLAMP_TO_EDGE);
    pDepthTexture.applyParameter(a.TPARAM.MAG_FILTER, a.TFILTER.LINEAR);
    pDepthTexture.applyParameter(a.TPARAM.MIN_FILTER, a.TFILTER.LINEAR);

    //deferred textures

    var pDeferredTextures = this._pDeferredTextures;

    for (var i = 0; i < this._nMaxDeferredTextureCount; i++) {
        var pDeferredTexture = pDeferredTextures[i] = pEngine.displayManager().
            texturePool().createResource('deferred_texture_' + a.sid());

        pDeferredTexture.createTexture(iWidth, iHeight,
                                       0, a.IFORMAT.RGBA, a.DTYPE.FLOAT, null);

        pDeferredTexture.applyParameter(a.TPARAM.WRAP_S, a.TWRAPMODE.CLAMP_TO_EDGE);
        pDeferredTexture.applyParameter(a.TPARAM.WRAP_T, a.TWRAPMODE.CLAMP_TO_EDGE);
        pDeferredTexture.applyParameter(a.TPARAM.MAG_FILTER, a.TFILTER.NEAREST);
        pDeferredTexture.applyParameter(a.TPARAM.MIN_FILTER, a.TFILTER.NEAREST);
    }

    var pFrameBuffers = this._pDeferredFrameBuffers;
    var pRenderer = this._pEngine.shaderManager();
    for (var i = 0; i < this._nMaxDeferredTextureCount; i++) {
        pFrameBuffers[i] = pRenderer.activateFrameBuffer();
        pRenderer.applyFrameBufferTexture(pDepthTexture, a.ATYPE.DEPTH_ATTACHMENT, a.TTYPE.TEXTURE_2D,
                                          0);
        pRenderer.applyFrameBufferTexture(pDeferredTextures[i], a.ATYPE.COLOR_ATTACHMENT0,
                                          a.TTYPE.TEXTURE_2D, 0);
        pRenderer.activateFrameBuffer(null);
    }
};

LightManager.prototype.createDeviceResources = function () {
    this._initializeTextures();
};
LightManager.prototype.getDeferredTextureCount = function () {
    return this._nMaxDeferredTextureCount;
};
//этот метод нужно вызывать в случае изменения размеров канваса
LightManager.prototype.updateTexture = function () {
    'use strict';

    var pCanvas = this._pEngine.pCanvas;

    var iWidth = Math.ceilingPowerOfTwo(pCanvas.width);
    var iHeight = Math.ceilingPowerOfTwo(pCanvas.height);

    if (iWidth != this._iWidth || iHeight != this._iHeight) {
        //canvas sizes changes
        this._iWidth = iWidth;
        this._iHeight = iHeight;

        //depth texture
        var pDepthTexture = this._pDepthTexture;

        pDepthTexture.createTexture(iWidth, iHeight,
                                    0, a.IFORMAT.DEPTH_COMPONENT, a.DTYPE.UNSIGNED_INT, null);

        pDepthTexture.applyParameter(a.TPARAM.WRAP_S, a.TWRAPMODE.CLAMP_TO_EDGE);
        pDepthTexture.applyParameter(a.TPARAM.WRAP_T, a.TWRAPMODE.CLAMP_TO_EDGE);
        pDepthTexture.applyParameter(a.TPARAM.MAG_FILTER, a.TFILTER.LINEAR);
        pDepthTexture.applyParameter(a.TPARAM.MIN_FILTER, a.TFILTER.LINEAR);

        //deferred textures

        var pDeferredTextures = this._pDeferredTextures;

        for (var i = 0; i < this._nMaxDeferredTextureCount; i++) {
            var pDeferredTexture = pDeferredTextures[i];

            pDeferredTexture.createTexture(iWidth, iHeight,
                                           0, a.IFORMAT.RGBA, a.DTYPE.FLOAT, null);

            pDeferredTexture.applyParameter(a.TPARAM.WRAP_S, a.TWRAPMODE.CLAMP_TO_EDGE);
            pDeferredTexture.applyParameter(a.TPARAM.WRAP_T, a.TWRAPMODE.CLAMP_TO_EDGE);
            pDeferredTexture.applyParameter(a.TPARAM.MAG_FILTER, a.TFILTER.NEAREST);
            pDeferredTexture.applyParameter(a.TPARAM.MIN_FILTER, a.TFILTER.NEAREST);
        }
    }

};

LightManager.prototype.applyLight = function () {
    var pEngine = this._pEngine;
    var pRenderer = pEngine.shaderManager();
    var pTarget = pRenderer.getPostEffectTarget();
    var pSubMesh, pSnapshot;
    var pDeferredTextures = this._pDeferredTextures;
    var pDepthTexture = this._pDepthTexture;
    var pCanvas = pEngine.pCanvas;
    var pLightUniforms = this._pLightingUnifoms;
    var i;

    this._createLightingUniforms();

    pRenderer.setViewport(0, 0, pCanvas.width, pCanvas.height);
    pSubMesh = pTarget[0];
    pSubMesh.startRender();
    pSnapshot = pSubMesh._pActiveSnapshot;
    pSubMesh.activatePass(0);

    pEngine.pEngineStates.lights.omni = pLightUniforms.omni.length;
    pEngine.pEngineStates.lights.project = pLightUniforms.project.length;
    pEngine.pEngineStates.lights.omniShadows = pLightUniforms.omniShadows.length;
    pEngine.pEngineStates.lights.projectShadows = pLightUniforms.projectShadows.length;

    pSnapshot.applyForeignVariable("nOmni", pLightUniforms.omni.length);
    pSnapshot.applyForeignVariable("nProject", pLightUniforms.project.length);
    pSnapshot.applyForeignVariable("nOmniShadows", pLightUniforms.omniShadows.length);
    pSnapshot.applyForeignVariable("nProjectShadows", pLightUniforms.projectShadows.length);

    pSnapshot.setComplexParameter("points_omni", pLightUniforms.omni);
    pSnapshot.setComplexParameter("points_project", pLightUniforms.project);
    pSnapshot.setComplexParameter("points_omni_shadows", pLightUniforms.omniShadows);
    pSnapshot.setComplexParameter("points_project_shadows", pLightUniforms.projectShadows);
    for (i = 0; i < pLightUniforms.textures.length; i++) {
        pSnapshot.applyTextureBySemantic("TEXTURE" + i, pLightUniforms.textures[i]);
    }

    pSubMesh.applyRenderData(pSubMesh.data);
    pSnapshot.setParameterBySemantic("SCREEN_TEXTURE_RATIO",
                                     [pCanvas.width / pDepthTexture.width, pCanvas.height / pDepthTexture.height]);
    pSnapshot.applyTextureBySemantic("DEFERRED_TEXTURE0", pDeferredTextures[0]);
    pSnapshot.applyTextureBySemantic("DEFERRED_TEXTURE1", pDeferredTextures[1]);
    pSnapshot.applyTextureBySemantic("SCENE_DEPTH_TEXTURE", pDepthTexture);
    var pEntry = pSubMesh.renderPass();
//    console.log("SceneModel.prototype.render", this, pEntry.pUniforms, pEntry.pTextures);
    // trace("SceneModel.prototype.render", this, pEntry.pUniforms, pEntry.pTextures);
    pSubMesh.deactivatePass();
    pSubMesh.finishRender();
};

LightManager.prototype._createLightingUniforms = function () {
    var pLightPoints = this._pLightPoints,
        pLight;
    var nOmni, nProject, nOmniShadows, nProjectShadows;
    var i, j;
    var pUniforms = this._pLightingUnifoms;
    var pUniformData;

    var pCamera = this._pEngine.getActiveCamera();
    var pCameraView = pCamera.worldMatrix();

    var v4fLightPosition = Vec4();
    var v3fLightTransformPosition = Vec3();
    var v4fTemp = Vec4();

    var pLightCamera;
    var m4fShadow;

    var iLastTextureIndex = 0;
    var sTexture = "TEXTURE";

    pUniforms.omni.length = 0;
    pUniforms.project.length = 0;
    pUniforms.omniShadows.length = 0;
    pUniforms.projectShadows.length = 0;
    pUniforms.textures.length = 0;

    for (i = 0; i < pLightPoints.length; i++) {
        pLight = pLightPoints[i];
        if (!pLight.isActive) {
            continue;
        }
        v4fLightPosition.set(pLight.worldPosition(), 1.);
        v3fLightTransformPosition.set(pCameraView.multiply(v4fLightPosition, v4fTemp));
        if (pLight.isOmnidirectional) {
            if (pLight._haveShadows) {
                pUniformData = a.UniformOmniShadow();
                pUniformData.setLightData(pLight.lightParameters, v3fLightTransformPosition);
                var pDepthCube = pLight.depthTextureCube;
                var pCameraCube = pLight.cameraCube;
                for (j = 0; j < 6; j++) {
                    pLightCamera = pCameraCube[j];
                    m4fShadow = pLightCamera.projViewMatrix().multiply(pCamera.worldMatrix(), Mat4());
                    pUniforms.textures.push(pDepthCube[j]);
                    sTexture = "TEXTURE" + (pUniforms.textures.length - 1);
                    pUniformData.setSampler(sTexture, j);
                    pUniformData.setMatrix(m4fShadow, j);
                }
                pUniforms.omniShadows.push(pUniformData);
            }
            else {
                pUniformData = a.UniformOmni();
                pUniformData.setLightData(pLight.lightParameters, v3fLightTransformPosition);
                pUniforms.omni.push(pUniformData);
            }
        }
        else {
            if (pLight._haveShadows) {
                pUniformData = a.UniformProjectShadow();
                pUniformData.setLightData(pLight.lightParameters, v3fLightTransformPosition);
                pLightCamera = pLight.camera;
                m4fShadow = pLightCamera.projViewMatrix().multiply(pCamera.worldMatrix(), Mat4());
                pUniforms.textures.push(pLight.depthTexture);
                sTexture = "TEXTURE" + (pUniforms.textures.length - 1);
                pUniformData.setSampler(sTexture);
                pUniformData.setMatrix(m4fShadow);
                pUniforms.projectShadows.push(pUniformData);
            }
            else {
                pUniformData = a.UniformProject();
                pUniformData.setLightData(pLight.lightParameters, v3fLightTransformPosition);
                pLightCamera = pLight.camera;
                m4fShadow = pLightCamera.projViewMatrix().multiply(pCamera.worldMatrix(), Mat4());
                pUniformData.setMatrix(m4fShadow);
                pUniforms.project.push(pUniformData);
            }
        }
    }
};

A_NAMESPACE(LightManager);


//----LIGHT DATA

function LightData() {
    this.DIFFUSE = new Vec4();
    this.AMBIENT = new Vec4();
    this.SPECULAR = new Vec4();
    this.ATTENUATION = new Vec3();
    this.POSITION = new Vec3();
}

LightData.prototype.set = function (pLightParam, v3fPosition) {
    'use strict';

    this.DIFFUSE.set(pLightParam.diffuse);
    this.AMBIENT.set(pLightParam.ambient);
    this.SPECULAR.set(pLightParam.specular);
    this.ATTENUATION.set(pLightParam.attenuation);
    this.POSITION.set(v3fPosition);

    return this;
};

A_NAMESPACE(LightData);


//-----UNIFORM OMNI DATA

function UniformOmni() {
    A_CHECK_STORAGE();
    this.LIGHT_DATA = new a.LightData();
}
A_ALLOCATE_STORAGE(UniformOmni, 200);

UniformOmni.prototype.setLightData = function (pLightParam, v3fPosition) {
    'use strict';
    this.LIGHT_DATA.set(pLightParam, v3fPosition);
    return this;
};

A_NAMESPACE(UniformOmni);


//-----UNIFORM PROJECT DATA

function UniformProject() {
    A_CHECK_STORAGE();
    this.LIGHT_DATA = new a.LightData();
    this.SHADOW_MATRIX = new Mat4();
}
A_ALLOCATE_STORAGE(UniformProject, 200);

UniformProject.prototype.setLightData = function (pLightParam, v3fPosition) {
    'use strict';
    this.LIGHT_DATA.set(pLightParam, v3fPosition);
    return this;
};

UniformProject.prototype.setMatrix = function (m4fMatrix) {
    'use strict';
    this.SHADOW_MATRIX.set(m4fMatrix);
    return this;
};

A_NAMESPACE(UniformProject);


//-----UNIFORM PROJECT SHADOWS DATA

function UniformProjectShadow() {
    A_CHECK_STORAGE();
    this.LIGHT_DATA = new a.LightData();
    this.SHADOW_MATRIX = new Mat4();
    this.SHADOW_SAMPLER = {"TEXTURE" : null};
}
A_ALLOCATE_STORAGE(UniformProjectShadow, 20);

UniformProjectShadow.prototype.setLightData = function (pLightParam, v3fPosition) {
    'use strict';
    this.LIGHT_DATA.set(pLightParam, v3fPosition);
    return this;
};

UniformProjectShadow.prototype.setMatrix = function (m4fMatrix) {
    'use strict';
    this.SHADOW_MATRIX.set(m4fMatrix);
    return this;
};

UniformProjectShadow.prototype.setSampler = function (sTexture) {
    'use strict';
    this.SHADOW_SAMPLER.TEXTURE = sTexture;
    return this;
};

A_NAMESPACE(UniformProjectShadow);


//-----UNIFORM OMNI SHADOWS DATA

function UniformOmniShadow() {
    A_CHECK_STORAGE();
    this.LIGHT_DATA = new a.LightData();
    this.SHADOW_MATRIX = [new Mat4(), new Mat4(),
                          new Mat4(), new Mat4(),
                          new Mat4(), new Mat4()];
    this.SHADOW_SAMPLER = [
        {"TEXTURE" : null},
        {"TEXTURE" : null},
        {"TEXTURE" : null},
        {"TEXTURE" : null},
        {"TEXTURE" : null},
        {"TEXTURE" : null}
    ];
}
A_ALLOCATE_STORAGE(UniformOmniShadow, 20);

UniformOmniShadow.prototype.setLightData = function (pLightParam, v3fPosition) {
    'use strict';
    this.LIGHT_DATA.set(pLightParam, v3fPosition);
    return this;
};

UniformOmniShadow.prototype.setAllMatrix = function (pMatrices) {
    'use strict';
    for (var i = 0; i < 6; i++) {
        this.SHADOW_MATRIX[i].set(pMatrices[i]);
    }
    return this;
};

UniformOmniShadow.prototype.setMatrix = function (m4fMatrix, index) {
    'use strict';
    this.SHADOW_MATRIX[index].set(m4fMatrix);
    return this;
};

UniformOmniShadow.prototype.setAllSamplers = function (sTextures) {
    'use strict';
    for (var i = 0; i < 6; i++) {
        this.SHADOW_SAMPLER[i].TEXTURE = (sTextures[i]);
    }
    return this;
};

UniformOmniShadow.prototype.setSampler = function (sTexture, index) {
    'use strict';
    this.SHADOW_SAMPLER[index].TEXTURE = sTexture;
    return this;
};

A_NAMESPACE(UniformOmniShadow);