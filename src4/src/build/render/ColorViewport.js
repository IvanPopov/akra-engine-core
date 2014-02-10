/// <reference path="Viewport.ts" />
/// <reference path="../idl/IObjectArray.ts" />
/// <reference path="../idl/IRenderTexture.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (render) {
        var DEFAULT_COLORPICKER_NAME = ".color-picker";

        var pPixel = new akra.pixelUtil.PixelBox(new akra.geometry.Box(0, 0, 1, 1), 28 /* BYTE_RGBA */, new Uint8Array(4));

        var ColorViewport = (function (_super) {
            __extends(ColorViewport, _super);
            function ColorViewport(pCamera, fLeft, fTop, fWidth, fHeight, iZIndex) {
                if (typeof fLeft === "undefined") { fLeft = 0.; }
                if (typeof fTop === "undefined") { fTop = 0.; }
                if (typeof fWidth === "undefined") { fWidth = 1.; }
                if (typeof fHeight === "undefined") { fHeight = 1.; }
                if (typeof iZIndex === "undefined") { iZIndex = 0; }
                _super.call(this, pCamera, DEFAULT_COLORPICKER_NAME, fLeft, fTop, fWidth, fHeight, iZIndex);
                this._pGuidToColorMap = {};
                this._pColorToSceneObjectMap = new Array(256);
                this._pColorToRenderableMap = new Array(256);
            }
            ColorViewport.prototype.getGuidToColorMap = function () {
                return this._pGuidToColorMap;
            };

            ColorViewport.prototype.getType = function () {
                return 3 /* COLORVIEWPORT */;
            };

            ColorViewport.prototype._updateImpl = function () {
                var pVisibleObjects = this.getCamera().display();
                var pRenderable;

                for (var i = 0; i < pVisibleObjects.getLength(); ++i) {
                    pVisibleObjects.value(i).prepareForRender(this);
                }

                for (var i = 0; i < 256; ++i) {
                    this._pColorToSceneObjectMap[i] = null;
                    this._pColorToRenderableMap[i] = null;
                }

                for (var g in this._pGuidToColorMap) {
                    this._pGuidToColorMap[g] = 0;
                }

                var r = 1;
                var s = 1;

                for (var i = 0; i < pVisibleObjects.getLength(); ++i) {
                    var pSceneObject = pVisibleObjects.value(i);

                    this._pGuidToColorMap[pSceneObject.guid] = s;
                    this._pColorToSceneObjectMap[s] = pSceneObject;
                    s++;

                    for (var j = 0; j < pSceneObject.getTotalRenderable(); j++) {
                        pRenderable = pSceneObject.getRenderable(j);

                        if (!akra.isNull(pRenderable) && !pRenderable.isFrozen()) {
                            this._pGuidToColorMap[pRenderable.guid] = r;
                            this._pColorToRenderableMap[r] = pRenderable;
                            r++;

                            this.prepareRenderableForPicking(pRenderable);
                            pRenderable.render(this, this._csDefaultRenderMethod, pSceneObject);
                        }
                    }
                }
                // this._pCamera = pOldCamera;
            };

            ColorViewport.prototype.pick = function (x, y) {
                if (typeof x === "undefined") { x = 0; }
                if (typeof y === "undefined") { y = 0; }
                var pTarget = this.getTarget();

                if (pTarget instanceof akra.render.RenderTexture) {
                    var pPixelBuffer = pTarget.getPixelBuffer();
                    x = akra.math.round(x);
                    y = akra.math.round(y);

                    pPixel.left = x;
                    pPixel.right = x + 1;
                    pPixel.top = y;
                    pPixel.bottom = y + 1;

                    if (pPixelBuffer.readPixels(pPixel)) {
                        console.log(pPixel.data[0], pPixel.data[1], pPixel.data[2], pPixel.data[3]);
                        return {
                            object: this._pColorToSceneObjectMap[pPixel.data[0]] || null,
                            renderable: this._pColorToRenderableMap[pPixel.data[1]] || null
                        };
                    }
                }

                return null;
            };

            ColorViewport.prototype._onRender = function (pTechnique, iPass, pRenderable, pSceneObject) {
                var pPass = pTechnique.getPass(iPass);

                pPass.setUniform("RENDERABLE_ID", this.getGuidToColorMap()[pRenderable.guid]);
                pPass.setUniform("OPTIMIZED_PROJ_MATRIX", this.getCamera().getProjectionMatrix());

                //pPass.setUniform("color", util.colorToVec4(util.randomColor(true)));
                if (!akra.isNull(pSceneObject)) {
                    pPass.setUniform("SCENE_OBJECT_ID", this.getGuidToColorMap()[pSceneObject.guid]);
                }

                _super.prototype._onRender.call(this, pTechnique, iPass, pRenderable, pSceneObject);
            };

            ColorViewport.prototype.prepareRenderableForPicking = function (pRenderable) {
                var pRenderTechnique = pRenderable.getTechnique(this._csDefaultRenderMethod);

                if (!akra.isNull(pRenderTechnique)) {
                    return;
                }

                var pRmgr = this.getTarget().getRenderer().getEngine().getResourceManager();
                var pMethodPool = pRmgr.getRenderMethodPool();
                var pMethod = pMethodPool.findResource(".method-color-picker");

                if (akra.isNull(pMethod)) {
                    pMethod = pRmgr.createRenderMethod(".method-color-picker");
                    pMethod.setEffect(pRmgr.createEffect(".effect-color-picker"));
                    pMethod.getEffect().addComponent("akra.system.colorPicker");
                }

                pRenderable.addRenderMethod(pMethod, this._csDefaultRenderMethod);
            };
            return ColorViewport;
        })(akra.render.Viewport);
        render.ColorViewport = ColorViewport;
    })(akra.render || (akra.render = {}));
    var render = akra.render;
})(akra || (akra = {}));
//# sourceMappingURL=ColorViewport.js.map
