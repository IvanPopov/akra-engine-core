/**
 * @file
 * @author Igor Karateev
 * @email iakarateev@gmail.com
 * @brief файл содержит класс источника света
 */

function LightPoint(pEngine, isOmnidirectional, haveShadows, iMaxShadowResolution) {
    'use strict';
    A_CLASS;

    this.id = pEngine.lightManager().registerLightPoint(this);

    isOmnidirectional = ifndef(isOmnidirectional, true);
    haveShadows = ifndef(haveShadows, false);
    if (haveShadows) {
        iMaxShadowResolution = ifndef(iMaxShadowResolution, 256);
    }

    //мкасимальный размер shadow текстуры
    this._iMaxShadowResolution = Math.ceilingPowerOfTwo(iMaxShadowResolution);

    //всенаправленный источник или нет
    this._isOmnidirectional = isOmnidirectional;

    //есть тени от источника или нет
    this._haveShadows = haveShadows;

    //depth textures for shadow maps
    //текстуры глубин для рендеринга теневых карт

    //depth текстура для направленного источника
    this._pDepthTexture = null;

    //depth cube map implementation
    //для всенаправленных источников
    var pDepthTextureCube = this._pDepthTextureCube = new Array(6);
    for (var i = 0; i < 6; i++) {
        pDepthTextureCube[i] = null;
    }

    //текстура исключительно для colorAttachment-а
    //пока без него рендерить во фреймбуффер нельзя
    this._pColorTexture = null;

    //камера для направленного источника
    this._pCamera = null;

    //камеры для всенаправленного источника
    var pCameraCube = this._pCameraCube = new Array(6);
    for (var i = 0; i < 6; i++) {
        pCameraCube[i] = null;
    }
    ////////////////////////////////

    //проекционная матрица для направленного источника
    this._m4fDefaultProj = null;

    this._pLightParameters = new LightParameters();

    //активен ли источник
    this._isActive = true;

    if (haveShadows) {
        this._initializeTextures();
    }
}
;

EXTENDS(LightPoint, a.SceneNode);

PROPERTY(LightPoint, 'isOmnidirectional',
         function () {
             return this._isOmnidirectional;
         }
);

PROPERTY(LightPoint, 'haveShadows',
         function () {
             return this._haveShadows;
         }
);

PROPERTY(LightPoint, 'depthTexture',
         function () {
             return this._pDepthTexture;
         }
);

PROPERTY(LightPoint, 'camera',
         function () {
             return this._pCamera;
         }
);

PROPERTY(LightPoint, 'depthTextureCube',
         function () {
             return this._pDepthTextureCube;
         }
);

PROPERTY(LightPoint, 'cameraCube',
         function () {
             return this._pCameraCube;
         }
);

//геттер возвращающий текстуру для color attachment надеюсь временный
PROPERTY(LightPoint, 'colorTexture',
         function () {
             return this._pColorTexture;
         }
);

PROPERTY(LightPoint, 'isActive',
         function () {
             return this._isActive;
         },
         function (isActive) {
             this._isActive = isActive;
         }
);

PROPERTY(LightPoint, 'lightParameters',
         function () {
             return this._pLightParameters;
         },
         function (pLightParameters) {
             this._pLightParameters = pLightParameters;
         }
);

LightPoint.prototype._initializeTextures = function () {
    'use strict';

    var pEngine = this._pEngine;
    var iShadowResolution = this._iMaxShadowResolution;

    if (this._isOmnidirectional) {
        var pDepthTextureCube = this._pDepthTextureCube;
        for (var i = 0; i < 6; i++) {
            var pDepthTexture = pDepthTextureCube[i] = pEngine.displayManager().
                texturePool().createResource('depth_texture_' + a.sid());
            pDepthTexture.createTexture(iShadowResolution, iShadowResolution,
                                        0, a.IFORMAT.DEPTH_COMPONENT, a.DTYPE.UNSIGNED_INT, null);

            pDepthTexture.applyParameter(a.TPARAM.WRAP_S, a.TWRAPMODE.CLAMP_TO_EDGE);
            pDepthTexture.applyParameter(a.TPARAM.WRAP_T, a.TWRAPMODE.CLAMP_TO_EDGE);
            pDepthTexture.applyParameter(a.TPARAM.MAG_FILTER, a.TFILTER.LINEAR);
            pDepthTexture.applyParameter(a.TPARAM.MIN_FILTER, a.TFILTER.LINEAR);
        }
    }
    else {
        var pDepthTexture = this._pDepthTexture = pEngine.displayManager().
            texturePool().createResource('depth_texture_' + a.sid());

        //create texture
        pDepthTexture.createTexture(iShadowResolution, iShadowResolution,
                                    0, a.IFORMAT.DEPTH_COMPONENT, a.DTYPE.UNSIGNED_INT, null);

        pDepthTexture.applyParameter(a.TPARAM.WRAP_S, a.TWRAPMODE.CLAMP_TO_EDGE);
        pDepthTexture.applyParameter(a.TPARAM.WRAP_T, a.TWRAPMODE.CLAMP_TO_EDGE);
        pDepthTexture.applyParameter(a.TPARAM.MAG_FILTER, a.TFILTER.LINEAR);
        pDepthTexture.applyParameter(a.TPARAM.MIN_FILTER, a.TFILTER.LINEAR);
    }

    this._pColorTexture = pEngine.displayManager().texturePool().createResource('light_color_texture_' + a.sid());
    var pColor = this._pColorTexture;

    pColor.createTexture(iShadowResolution, iShadowResolution,
                         0, a.IFORMAT.RGBA, a.DTYPE.UNSIGNED_BYTE, null);
};


LightPoint.prototype.create = function () {
    'use strict';

    SceneNode.prototype.create.call(this);

    var pEngine = this._pEngine;

    //камеры для всенаправленного источника света нужны только в случае, когда от него есть тени
    //камера же от направленного источника света нужна всегда
    if (this._isOmnidirectional && this._haveShadows) {
        //create cameras

        var pCameraCube = this._pCameraCube;

        for (var i = 0; i < 6; i++) {
            var pCamera = pCameraCube[i] = new a.Camera(pEngine);
            pCamera.create();
            pCamera.setParameter(a.Camera.CONST_ASPECT, true);
            pCamera.setInheritance(a.Scene.k_inheritAll);
            pCamera.attachToParent(this);
            pCamera.setProjParams(Math.PI / 2, 1, 0.01, 1000)
        }

        //POSITIVE_X
        pCameraCube[0].accessLocalMatrix().set(
            [ 0, 0, 1, 0, //first column, not row!
              0, 1, 0, 0,
              -1, 0, 0, 0,
              0, 0, 0, 1
            ]);

        //NEGATIVE_X
        pCameraCube[1].accessLocalMatrix().set(
            [ 0, 0, -1, 0, //first column, not row!
              0, 1, 0, 0,
              1, 0, 0, 0,
              0, 0, 0, 1
            ]);

        //POSITIVE_Y
        pCameraCube[2].accessLocalMatrix().set(
            [ 1, 0, 0, 0, //first column, not row!
              0, 0, 1, 0,
              0, -1, 0, 0,
              0, 0, 0, 1
            ]);

        //NEGATIVE_Y
        pCameraCube[3].accessLocalMatrix().set(
            [ 1, 0, 0, 0, //first column, not row!
              0, 0, -1, 0,
              0, 1, 0, 0,
              0, 0, 0, 1
            ]);

        //POSITIVE_Z
        pCameraCube[4].accessLocalMatrix().set(
            [ -1, 0, 0, 0, //first column, not row!
              0, 1, 0, 0,
              0, 0, -1, 0,
              0, 0, 0, 1
            ]);

        //NEGATIVE_Z
        pCameraCube[5].accessLocalMatrix().set(
            [ 1, 0, 0, 0, //first column, not row!
              0, 1, 0, 0,
              0, 0, 1, 0,
              0, 0, 0, 1
            ]);
    }
    else {

        var pCamera = this._pCamera = new a.Camera(pEngine);

        pCamera.create();
        pCamera.setParameter(a.Camera.CONST_ASPECT, true);
        pCamera.setInheritance(a.Scene.k_inheritAll);
        pCamera.attachToParent(this);
        pCamera.accessLocalMatrix().set(
            [ 1, 0, 0, 0, //first column, not row!
              0, 1, 0, 0,
              0, 0, 1, 0,
              0, 0, 0, 1
            ]);
    }
};

LightPoint.prototype.calculateShadows = function () {
    if(this._isActive && this._haveShadows){
        var pRenderer = this._pEngine.shaderManager();
        var pDevice = this._pEngine.pDevice;
        if (this._isOmnidirectional) {
            var i;
            for (i = 0; i < 6; i++) {
                pRenderer.activateFrameBuffer();
                pRenderer.applyFrameBufferTexture(this._pDepthTextureCube[i], a.ATYPE.DEPTH_ATTACHMENT, a.TTYPE.TEXTURE_2D,
                                                  0);
                pRenderer.applyFrameBufferTexture(this._pColorTexture, a.ATYPE.COLOR_ATTACHMENT0, a.TTYPE.TEXTURE_2D, 0);
                pRenderer.clearScreen(a.CLEAR.DEPTH_BUFFER_BIT | a.CLEAR.COLOR_BUFFER_BIT);
                this._renderShadowsFromCamera(this._pCameraCube[i], this._pDepthTextureCube[i]);
                pRenderer.deactivateFrameBuffer();
            }
        }
        else {
            pRenderer.activateFrameBuffer();
            pRenderer.applyFrameBufferTexture(this._pDepthTexture, a.ATYPE.DEPTH_ATTACHMENT, a.TTYPE.TEXTURE_2D, 0);
            pRenderer.applyFrameBufferTexture(this._pColorTexture, a.ATYPE.COLOR_ATTACHMENT0, a.TTYPE.TEXTURE_2D, 0);
            pRenderer.clearScreen(a.CLEAR.DEPTH_BUFFER_BIT | a.CLEAR.COLOR_BUFFER_BIT);
            this._renderShadowsFromCamera(this._pCamera, this._pDepthTexture);
            pRenderer.deactivateFrameBuffer();
        }
    }
};
LightPoint.prototype._renderShadowsFromCamera = function (pCamera, pTexture) {
    var pEngine = this._pEngine;
    var pFirstMember = pEngine._pSceneTree.buildSearchResults(pCamera.searchRect(), pCamera.frustum());
    var pRenderList = pFirstMember;

    var pLastActiveCamera = pEngine.getActiveCamera();

    //Подготовка всех объектов к рендерингу
    while (pFirstMember) {
        pFirstMember.prepareForRender();
        pFirstMember = pFirstMember.nextSearchLink();
    }

    pEngine.setActiveCamera(pCamera);

    //рендеринг всех объектов
    pFirstMember = pRenderList;
    var pRenderer = this._pEngine.shaderManager();
    pRenderer.setViewport(0, 0, pTexture.width, pTexture.height);
    while (pFirstMember) {
        pFirstMember.renderShadow();
        pFirstMember = pFirstMember.nextSearchLink();
    }

    pEngine.setActiveCamera(pLastActiveCamera);
    return true;
};

A_NAMESPACE(LightPoint);

//класс содержит параметры источника света
function LightParameters() {
    //default parameters
    this.ambient = new Vec4(0.1, 0.1, 0.1, 1.);
    this.diffuse = new Vec4(1., 1., 1., 1.);
    this.specular = new Vec4(1., 1., 1., 1.);
    //this.emissive =
    this.attenuation = new Vec3(1.0, 0.00, .000);
};

