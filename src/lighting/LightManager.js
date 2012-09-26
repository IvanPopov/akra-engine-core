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

//    this._initializeTextures();
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
};

LightManager.prototype.createDeviceResources = function () {
    this._initializeTextures();
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
    var pRenderer = this._pEngine.shaderManager();
    var pTarget = pRenderer.getPostEffectTarget();

    var pSubMesh, pSnapshot;
    var k;
    var pDeferredTextures = this._pDeferredTextures;
    var pDepthTexture = this._pDepthTexture;
    var pCanvas = this._pEngine.pCanvas;

    pRenderer.setViewport(0, 0, pCanvas.width, pCanvas.height);
    pSubMesh = pTarget[0];
    pSubMesh.startRender();
    pSnapshot = pSubMesh._pActiveSnapshot;
    for (k = 0; k < pSubMesh.totalPasses(); k++) {
        pSubMesh.activatePass(k);
        pSubMesh.applyRenderData(pSubMesh.data);
        pSnapshot.setParameterBySemantic("SCREEN_TEXTURE_RATIO", [pCanvas.width/pDepthTexture.width,pCanvas.height/pDepthTexture.height]);
        pSnapshot.applyTextureBySemantic("DEFERRED_TEXTURE0", pDeferredTextures[0]);
        pSnapshot.applyTextureBySemantic("DEFERRED_TEXTURE1", pDeferredTextures[1]);
        pSnapshot.applyTextureBySemantic("SCENE_DEPTH_TEXTURE", pDepthTexture);
        var pEntry = pSubMesh.renderPass();
        trace("SceneModel.prototype.render", this, pEntry.pUniforms, pEntry.pTextures);
        pSubMesh.deactivatePass();
    }
    pSubMesh.finishRender();
};

A_NAMESPACE(LightManager);