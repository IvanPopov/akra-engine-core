/**
 * @file
 * @author IvanPopov
 * @email <vantuziast@odserve.org>
 * @author Xoma
 * @email <xoma@odserve.org>
 *
 * @brief Глобальные функции для работы с девайсом.
 * Базовые функции для работы с графическим контекстом.
 */

if (!window.requestAnimationFrame) {

    window.requestAnimationFrame = ( function () {

        return window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame
            || // comment out if FF4 is slow (it caps framerate at ~30fps: https://bugzilla.mozilla.org/show_bug.cgi?id=630127)
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {

                window.setTimeout(callback, 1000 / 60);

            };

    } )();

}

a.requestAnimFrame = window.requestAnimationFrame;


a.cancelRequestAnimFrame = (function () {
    return window.cancelCancelRequestAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.oCancelRequestAnimationFrame ||
        window.msCancelRequestAnimationFrame ||
        window.clearTimeout;
})();

/**
 * Проверить, возможно ли создать текстуру с
 * такими параметрами.
 *
 * @tparam pContext Графический контекст.
 * @tparam iWidth Ширина текстуры.
 * @tparam iHeight Высота текстуры.
 * @tparam iMipLevels Мипмап уровни.
 * @tparam eUsage Usage.
 * @tparam eFormat Формат.
 * @tparam ePool Pool.
 * @treturn Boolean Результат.
 */
a.checkTextureRequirements = function (pContext, iWidth, iHeigth, iMipLevels, eUsage, eFormat, ePool) {

    return true;
};

/**
 * Проверить, возможно ли создать кубическую
 * текстуру с такими параметрами.
 *
 * @tparam pContext Графический контекст.
 * @tparam iWidth Ширина текстуры.
 * @tparam iHeight Высота текстуры.
 * @tparam iMipLevels Мипмап уровни.
 * @tparam eUsage Usage.
 * @tparam eFormat Формат.
 * @tparam ePool Pool.
 * @treturn Boolean Результат.
 */


a.checkCubeTextureRequirements = function (pContext, iWidth, iHeigth, iMipLevels, eUsage, eFormat, ePool) {

    return true;
}

/**
 * Загрузить текстуру из файла.
 *
 * @tparam pContext Графический контекст.
 * @tparam sFilename Файл с текстурой.
 * @tparam iWidth Ширина текстуры.
 * @tparam iHeight Высота текстуры.
 // @tparam iMipLevels Мипмап уровни.
 // @tparam eUsage Usage.
 // @tparam eFormat Формат.
 // @tparam ePool Pool.
 // @tparam iFilter Фильтр каналов текстуры.
 // @tparam iMipFilter Фильтр текстуры.
 // @tparam pColorKey Фоновый цвет.
 // @tparam ppImageInfo Описание оригинального изображения.
 // @tparam ppPalette Палитра.
 * @tparam Function fnCallback Функция, вызываемая при завершении загрузки тектуры.
 * @treturn Texture Созданная текстура или null.
 */

//a.createTextureFromFile = function (pContext, sFilename, iWidth, iHeight, fnCallBack)
//    //iMipLevels,eUsage,eFormat,ePool,iFilter,iMipFilter, pColorKey, ppImageInfo, ppPalette)
//{
//
//    var c = pContext;
//    var tex = c.createTexture();
//    //tex.eType=c.TEXTURE_2D;
//    tex.image = new Image();
//    tex.image.onload = function () {
//        c.bindTexture(c.TEXTURE_2D, tex);
//        c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, true);
//        c.texImage2D(c.TEXTURE_2D, 0, c.RGBA, c.RGBA, c.UNSIGNED_BYTE, tex.image);
//        c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MAG_FILTER, c.NEAREST);
//        c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MIN_FILTER, c.NEAREST);
//        c.bindTexture(c.TEXTURE_2D, null);
//        if (fnCallBack) {
//            fnCallBack();
//        }
//
//    }
//
//    tex.image.src = sFilename;
//    return tex;
//}


/**
 * Создать объект тектсура
 *
 * @tparam pContext Графический контекст.
 * @tparam iWidth Ширина текстуры.
 * @tparam iHeight Высота текстуры.
 * @tparam fCallBack Функция которая вызовется после загрузки

 * @tparam iMipLevels Мипмап уровни.
 * @tparam eUsage Usage.
 * @tparam eFormat Формат.
 * @tparam ePool Pool.
 * @tparam iFilter Фильтр каналов текстуры.
 * @tparam iMipFilter Фильтр текстуры.
 * @tparam pColorKey Фоновый цвет.
 * @tparam ppImageInfo Описание оригинального изображения.
 * @tparam ppPalette Палитра.
 * @treturn Texture Созданная текстура или null.
 */
//a.createTexture = function (pContext, iWidth, iHeight, fCallBack, pTexture)
//    //iMipLevels, eUsage, eFormat, ePool,  iFilter, iMipFilter,pColorKey, ppImageInfo, ppPalette)
//{
//
//    var c = pContext;
//    pTexture._pTexture = c.createTexture();
//    tex = pTexture._pTexture;
//    //tex.eType=c.TEXTURE_2D;
//
//    tex.image = new Image(iWidth, iHeight);
//    tex.image.onload = function () {
//        c.bindTexture(c.TEXTURE_2D, tex);
//        c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, true);
//        c.texImage2D(c.TEXTURE_2D, 0, c.RGBA, c.RGBA, c.UNSIGNED_BYTE, tex.image);
//        c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MAG_FILTER, c.NEAREST);
//        c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MIN_FILTER, c.NEAREST);
//        c.bindTexture(c.TEXTURE_2D, null);
//
//    }
//    if (fCallBack) {
//        fCallBack();
//    }
//    return tex;
//}


/**
 * @property createDevice(pCanvas)
 * Создает девайс
 * @memberof a
 * @param pCanvas Объект канваса
 *
 * @return 3D Context
 **/
a.createDevice = function (pCanvas, bAntialias) {
    var pContext;

    //pCanvas.width = screen.width;
    //pCanvas.height = screen.height;

    try {

        pContext = pCanvas.getContext("webgl", { antialias: bAntialias || true}) || 
            pCanvas.getContext("experimental-webgl", { antialias: bAntialias || true});
        if (WebGLDebugUtils) {
            pContext = WebGLDebugUtils.makeDebugContext(pContext, 
                function throwOnGLError(err, funcName, args) {
                    throw WebGLDebugUtils.glEnumToString(err) + " was caused by call to: " + funcName;
                },
                function logGLCall(functionName, args) {   
                   console.log("gl." + functionName + "(" + 
                      WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ")");   
                });
        }
    }
    catch (e) {
    }

    if (!pContext) {
        debug_error("Your browser does not support WebGL");
        return null;
    }
    else {
        debug_print(' WebGL successfully initialized.');
    }

    a.initDevice(pContext);

    return pContext;
};

/**
 * @property deleteDevice()
 * Уничтожить девайс
 * @memberof a
 **/
a.deleteDevice = function (pDevice) {
    //Надо сделать аккуратно
}


a.initDevice = function (pDevice) {
    pDevice._eSrcBlend = a.BLEND.ONE;
    pDevice._eDstBlend = a.BLEND.ZERO;

    pDevice.setRenderState = function (type, value) {
        switch (type) {
            case a.renderStateType.SRCBLEND:
                this._eSrcBlend = value;
                this.blendFunc(this._eSrcBlend, this._eDstBlend);
                break;
            case a.renderStateType.DESTBLEND:
                this._eDstBlend = value;
                this.blendFunc(this._eSrcBlend, this._eDstBlend);
                break;
            case a.renderStateType.CULLMODE:/*
             if(value == a.CULLMODE.NONE)
             this.disable(this.CULL_FACE);
             else{
             this.enable(this.CULL_FACE);
             this.cullFace(value);
             }*/
                break;
            case a.renderStateType.DITHERENABLE:
                if (value) {
                    this.enable(this.DITHER);
                }
                else {
                    this.disable(this.DITHER);
                }
                break;
            case a.renderStateType.ZENABLE:
                if (value) {
                    this.enable(this.DEPTH_TEST);
                }
                else {
                    this.disable(this.DEPTH_TEST);
                }
                break;
            case a.renderStateType.ZWRITEENABLE:
                this.depthMask(value);
                break;
            case a.renderStateType.ZFUNC:
                var sTmp;
                //LESSEQUAL - default
                switch (value) {
                    case a.CMPFUNC.NEVER:
                        sTmp = this.NEVER;
                        break;
                    case a.CMPFUNC.LESS:
                        sTmp = this.LESS;
                        break;
                    case a.CMPFUNC.EQUAL:
                        sTmp = this.EQUAL;
                        break;
                    case a.CMPFUNC.GREATER:
                        sTmp = this.GREATER;
                        break;
                    case a.CMPFUNC.NOTEQUAL:
                        sTmp = this.NOTEQUAL;
                        break;
                    case a.CMPFUNC.GREATEREQUAL:
                        sTmp = this.GEQUAL;
                        break;
                    case a.CMPFUNC.ALWAYS:
                        sTmp = this.ALWAYS;
                        break;
                    default:
                        sTmp = this.LEQUAL;
                        break;
                }
                this.depthFunc(sTmp);
                break;
            default:
                break;
        }
        return;

    };


    var pExtentions = __KEYS__(GRAPHICS_EXTENTIONS);

    var pExtentionsList = {};
    for (var i = 0, pExt; i < pExtentions.length; ++i) {

        if (pExt = a.info.graphics.getExtention(pDevice, pExtentions[i])) {

            pExtentionsList[pExtentions[i]] = pExt;

            for (var j in pExt) {

                if (typeof pExt[j] == 'function') {

                    pDevice[j] = function () {
                        pDevice[j] = new Function(
                            'var tmp = this.pExtentionsList[' + pExtentions[i] + '];' +
                                'tmp.' + j + '.apply(tmp, arguments);');
                    }

                }
                else {
                    pDevice[j] = pExtentionsList[pExtentions[i]][j];
                }

            }
        }
        else {
            warning('cannot load extension: ' + pExtentions[i]);
        }
    }

    pDevice.pExtentionsList = pExtentionsList;
};
