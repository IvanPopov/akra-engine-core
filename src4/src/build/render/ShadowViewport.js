/// <reference path="Viewport.ts" />
/// <reference path="../scene/light/ShadowCaster.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    //#define DEFAULT_SHADOW_TECHNIQUE_NAME ".prepare-shadows"
    (function (render) {
        var DEFAULT_SHADOW_TECHNIQUE_NAME = ".prepare-shadows";

        var ShadowViewport = (function (_super) {
            __extends(ShadowViewport, _super);
            function ShadowViewport(pCamera, fLeft, fTop, fWidth, fHeight, iZIndex) {
                if (typeof fLeft === "undefined") { fLeft = 0.; }
                if (typeof fTop === "undefined") { fTop = 0.; }
                if (typeof fWidth === "undefined") { fWidth = 1.; }
                if (typeof fHeight === "undefined") { fHeight = 1.; }
                if (typeof iZIndex === "undefined") { iZIndex = 0; }
                _super.call(this, pCamera, DEFAULT_SHADOW_TECHNIQUE_NAME, fLeft, fTop, fWidth, fHeight, iZIndex);

                this.setClearEveryFrame(true, 2 /* DEPTH */);
                this.setDepthParams(true, true, 2 /* LESS */);
                this.setDepthClear(1.);
            }
            ShadowViewport.prototype.getType = function () {
                return 2 /* SHADOWVIEWPORT */;
            };

            ShadowViewport.prototype._updateImpl = function () {
                // LOG("SAHDOW VIEWPORT #" + this.getGuid());
                var pShadowCaster = this._pCamera;
                var pAffectedObjects = pShadowCaster.getAffectedObjects();

                var pRenderable;
                var pSceneObject;

                var nShadowsCasted = 0;

                for (var i = 0; i < pAffectedObjects.getLength(); i++) {
                    pSceneObject = pAffectedObjects.value(i);

                    if (pSceneObject.getShadow()) {
                        for (var j = 0; j < pSceneObject.getTotalRenderable(); j++) {
                            pRenderable = pSceneObject.getRenderable(j);

                            if (!akra.isNull(pRenderable) && pRenderable.getShadow()) {
                                this.prepareRenderableForShadows(pRenderable);
                                pRenderable.render(this, this._csDefaultRenderMethod, pSceneObject);
                                nShadowsCasted++;
                            }
                        }
                    }
                }

                pShadowCaster.setShadowCasted((nShadowsCasted > 0) ? true : false);
            };

            ShadowViewport.prototype.prepareRenderableForShadows = function (pRenderable) {
                var pRenderTechnique = pRenderable.getTechnique(this._csDefaultRenderMethod);

                if (!akra.isNull(pRenderTechnique)) {
                    return;
                }

                var pRmgr = this.getTarget().getRenderer().getEngine().getResourceManager();
                var pMethodPool = pRmgr.getRenderMethodPool();

                var pMethod = pMethodPool.findResource(".method-prepare-shadows");

                if (akra.isNull(pMethod)) {
                    pMethod = pRmgr.createRenderMethod(".method-prepare-shadows");
                    pMethod.setEffect(pRmgr.createEffect(".effect-prepare-shadows"));
                    pMethod.getEffect().addComponent("akra.system.prepareShadows");
                }

                pRenderable.addRenderMethod(pMethod, this._csDefaultRenderMethod);
            };

            ShadowViewport.prototype._getDepthRangeImpl = function () {
                var pDepthTexture;
                var pShadowCaster = this._pCamera;

                var pLightPoint = pShadowCaster.getLightPoint();

                switch (pLightPoint.getLightType()) {
                    case 1 /* PROJECT */:
                        pDepthTexture = pLightPoint.getDepthTexture();
                        break;
                    case 2 /* OMNI */:
                        pDepthTexture = pLightPoint.getDepthTextureCube()[pShadowCaster.getFace()];
                        break;
                    default:
                        pDepthTexture = null;
                        break;
                }

                if (akra.isDefAndNotNull(pDepthTexture)) {
                    var pRange = akra.config.WEBGL ? akra.webgl.getDepthRange(pDepthTexture) : { min: 0., max: 1. };
                    console.log("shadow viewport min & max depth range > ", pRange.min, pRange.max);

                    //[0,1] -> [-1, 1]
                    pRange.min = pRange.min * 2. - 1.;
                    pRange.max = pRange.max * 2. - 1.;

                    return pRange;
                }
                return null;
            };
            return ShadowViewport;
        })(akra.render.Viewport);
        render.ShadowViewport = ShadowViewport;
    })(akra.render || (akra.render = {}));
    var render = akra.render;
})(akra || (akra = {}));
//# sourceMappingURL=ShadowViewport.js.map
