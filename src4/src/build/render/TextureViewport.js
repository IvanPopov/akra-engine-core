/// <reference path="Viewport.ts" />
//#define DEFAULT_TEXTUREVIEW_NAME ".see_texture"
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (render) {
        var DEFAULT_TEXTUREVIEW_NAME = ".see_texture";

        var Vec4 = akra.math.Vec4;

        var TextureViewport = (function (_super) {
            __extends(TextureViewport, _super);
            function TextureViewport(pTexture, fLeft, fTop, fWidth, fHeight, iZIndex) {
                if (typeof fLeft === "undefined") { fLeft = 0.; }
                if (typeof fTop === "undefined") { fTop = 0.; }
                if (typeof fWidth === "undefined") { fWidth = 1.; }
                if (typeof fHeight === "undefined") { fHeight = 1.; }
                if (typeof iZIndex === "undefined") { iZIndex = 0; }
                _super.call(this, null, DEFAULT_TEXTUREVIEW_NAME, fLeft, fTop, fWidth, fHeight, iZIndex);
                this._v4fMapping = new Vec4(0., 0., 1., 1.);

                this._pTargetTexture = pTexture;
            }
            TextureViewport.prototype.getType = function () {
                return 4 /* TEXTUREVIEWPORT */;
            };

            TextureViewport.prototype.getEffect = function () {
                return this._pEffect;
            };

            TextureViewport.prototype._setTarget = function (pTarget) {
                _super.prototype._setTarget.call(this, pTarget);

                var pEngine = this.getTarget().getRenderer().getEngine();
                var pResMgr = pEngine.getResourceManager();
                var pDefferedView = new akra.render.Screen(pEngine.getRenderer());

                var pSeeTextureMethod = pResMgr.createRenderMethod(DEFAULT_TEXTUREVIEW_NAME + this.guid);
                var pSeeTextureEffect = pResMgr.createEffect(DEFAULT_TEXTUREVIEW_NAME + this.guid);

                pSeeTextureEffect.addComponent("akra.system.texture_to_screen");
                pSeeTextureMethod.setEffect(pSeeTextureEffect);

                pDefferedView.addRenderMethod(pSeeTextureMethod, DEFAULT_TEXTUREVIEW_NAME);

                this._pDeferredView = pDefferedView;
                this._pEffect = pSeeTextureEffect;
            };

            TextureViewport.prototype._updateImpl = function () {
                this._pDeferredView.render(this, DEFAULT_TEXTUREVIEW_NAME);
            };

            TextureViewport.prototype.setMapping = function (x, y, w, h) {
                this._v4fMapping.set(x, y, w, h);
                // console.log("set mapping > ", x, y, w, h, this._v4fMapping.toString());
            };

            TextureViewport.prototype._onRender = function (pTechnique, iPass, pRenderable, pSceneObject) {
                var pPass = pTechnique.getPass(iPass);

                pPass.setTexture("TEXTURE0", this._pTargetTexture);
                pPass.setUniform("VIEWPORT", this._v4fMapping);

                _super.prototype._onRender.call(this, pTechnique, iPass, pRenderable, pSceneObject);
            };
            return TextureViewport;
        })(akra.render.Viewport);
        render.TextureViewport = TextureViewport;
    })(akra.render || (akra.render = {}));
    var render = akra.render;
})(akra || (akra = {}));
//# sourceMappingURL=TextureViewport.js.map
