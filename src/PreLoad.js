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
 * @property createDevice(pCanvas)
 * Создает девайс
 * @memberof a
 * @param pCanvas Объект канваса
 *
 * @return 3D Context
 **/
a.createDevice = function (pCanvas, bAntialias) {
    var pContext;

    try {

        function throwOnGLError(err, funcName, args) {
            throw WebGLDebugUtils.glEnumToString(err) + " was caused by call to: " + funcName;
        };

        pContext = pCanvas.getContext("webgl", { antialias: bAntialias || true}) || 
            pCanvas.getContext("experimental-webgl", { antialias: bAntialias || true});

        pContext = WebGLDebugUtils.makeDebugContext(pContext, throwOnGLError);
        //NOTE: context debugger moved to Engine.js
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
