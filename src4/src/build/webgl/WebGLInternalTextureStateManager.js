/// <reference path="WebGLRenderer.ts" />
/// <reference path="WebGLInternalTexture.ts" />
/// <reference path="../util/ObjectArray.ts" />
var akra;
(function (akra) {
    (function (webgl) {
        var WebGLInternalTextureStateManager = (function () {
            function WebGLInternalTextureStateManager(pRenderer) {
                this._pActiveTextureStateMap = null;
                this._pActiveTextureList = null;
                this._pWebGLRenderer = null;
                this._pWebGLRenderer = pRenderer;

                this._pActiveTextureStateMap = {};
                this._pActiveTextureList = new akra.util.ObjectArray();
            }
            WebGLInternalTextureStateManager.prototype.add = function (pTexture) {
                var iGuid = pTexture.guid;
                var pTextureState = this._pActiveTextureStateMap[iGuid];

                if (!akra.isDef(pTextureState)) {
                    pTextureState = {
                        isUsed: true,
                        texture: pTexture,
                        states: {}
                    };

                    pTextureState.states[10241 /* MIN_FILTER */] = pTexture.getFilter(10241 /* MIN_FILTER */);
                    pTextureState.states[10240 /* MAG_FILTER */] = pTexture.getFilter(10240 /* MAG_FILTER */);
                    pTextureState.states[10242 /* WRAP_S */] = pTexture.getWrapMode(10242 /* WRAP_S */);
                    pTextureState.states[10243 /* WRAP_T */] = pTexture.getWrapMode(10243 /* WRAP_T */);

                    this._pActiveTextureStateMap[iGuid] = pTextureState;
                    this._pActiveTextureList.push(iGuid);

                    return pTextureState.states;
                }

                if (!pTextureState.isUsed) {
                    pTextureState.states[10241 /* MIN_FILTER */] = pTexture.getFilter(10241 /* MIN_FILTER */);
                    pTextureState.states[10240 /* MAG_FILTER */] = pTexture.getFilter(10240 /* MAG_FILTER */);
                    pTextureState.states[10242 /* WRAP_S */] = pTexture.getWrapMode(10242 /* WRAP_S */);
                    pTextureState.states[10243 /* WRAP_T */] = pTexture.getWrapMode(10243 /* WRAP_T */);

                    this._pActiveTextureList.push(iGuid);
                }

                return pTextureState.states;
            };

            WebGLInternalTextureStateManager.prototype.reset = function () {
                var iLength = this._pActiveTextureList.getLength();

                for (var i = 0; i < iLength; i++) {
                    var pTextureState = this._pActiveTextureStateMap[this._pActiveTextureList.value(i)];

                    pTextureState.texture.setFilter(10241 /* MIN_FILTER */, pTextureState.states[10241 /* MIN_FILTER */]);
                    pTextureState.texture.setFilter(10240 /* MAG_FILTER */, pTextureState.states[10240 /* MAG_FILTER */]);
                    pTextureState.texture.setWrapMode(10242 /* WRAP_S */, pTextureState.states[10242 /* WRAP_S */]);
                    pTextureState.texture.setWrapMode(10243 /* WRAP_T */, pTextureState.states[10243 /* WRAP_T */]);

                    pTextureState.isUsed = false;
                }

                this._pActiveTextureList.clear();
                this._pWebGLRenderer.bindWebGLTexture(3553 /* TEXTURE_2D */, null);
            };

            WebGLInternalTextureStateManager.prototype.getTextureState = function (iGuid) {
                return this._pActiveTextureStateMap[iGuid].states;
            };
            return WebGLInternalTextureStateManager;
        })();
        webgl.WebGLInternalTextureStateManager = WebGLInternalTextureStateManager;
    })(akra.webgl || (akra.webgl = {}));
    var webgl = akra.webgl;
})(akra || (akra = {}));
//# sourceMappingURL=WebGLInternalTextureStateManager.js.map
