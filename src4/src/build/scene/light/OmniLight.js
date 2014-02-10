/// <reference path="../../idl/ITexture.ts" />
/// <reference path="../../util/ObjectArray.ts" />
/// <reference path="../../geometry/Plane3d.ts" />
/// <reference path="../../geometry/classify/classify.ts" />
/// <reference path="ShadowCaster.ts" />
/// <reference path="CalculatePlanesForLighting.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (scene) {
        (function (light) {
            var Scene3d = akra.scene.Scene3d;

            var Color = akra.color.Color;

            var Vec3 = akra.math.Vec3;
            var Mat4 = akra.math.Mat4;

            var OmniParameters = (function () {
                function OmniParameters() {
                    this.ambient = new Color;
                    this.diffuse = new Color;
                    this.specular = new Color;
                    this.attenuation = new Vec3;
                }
                return OmniParameters;
            })();
            light.OmniParameters = OmniParameters;

            var OmniLight = (function (_super) {
                __extends(OmniLight, _super);
                function OmniLight(pScene) {
                    _super.call(this, pScene, 2 /* OMNI */);
                    this._pDepthTextureCube = null;
                    this._pColorTextureCube = null;
                    this._pLightParameters = new OmniParameters;
                    this._pShadowCasterCube = null;

                    this._pShadowCasterCube = new Array(6);

                    for (var i = 0; i < 6; i++) {
                        this._pShadowCasterCube[i] = pScene._createShadowCaster(this, i);
                    }
                }
                OmniLight.prototype.getParams = function () {
                    return this._pLightParameters;
                };

                OmniLight.prototype.isShadowCaster = function () {
                    return this._isShadowCaster;
                };

                /**
                * overridden setter isShadow caster,
                * if depth textures don't created then create depth textures
                */
                OmniLight.prototype.setShadowCaster = function (bValue) {
                    this._isShadowCaster = bValue;
                    if (bValue && akra.isNull(this._pDepthTextureCube)) {
                        this.initializeTextures();
                    }
                };

                OmniLight.prototype.getLightingDistance = function () {
                    return this._pShadowCasterCube[0].getFarPlane();
                };

                OmniLight.prototype.setLightingDistance = function (fDistance) {
                    var pCube = this._pShadowCasterCube;
                    for (var i = 0; i < 6; i++) {
                        pCube[i].setFarPlane(fDistance);
                    }
                };

                OmniLight.prototype.getDepthTextureCube = function () {
                    return this._pDepthTextureCube;
                };

                OmniLight.prototype.getRenderTarget = function (iFace) {
                    // return this._pDepthTextureCube[iFace].getBuffer().getRenderTarget();
                    return this._pColorTextureCube[iFace].getBuffer().getRenderTarget();
                };

                OmniLight.prototype.getShadowCaster = function () {
                    return this._pShadowCasterCube;
                };

                OmniLight.prototype.create = function (isShadowCaster, iMaxShadowResolution) {
                    if (typeof isShadowCaster === "undefined") { isShadowCaster = true; }
                    if (typeof iMaxShadowResolution === "undefined") { iMaxShadowResolution = 256; }
                    var isOk = _super.prototype.create.call(this, isShadowCaster, iMaxShadowResolution);

                    var pCasterCube = this._pShadowCasterCube;
                    var pCaster;

                    for (var i = 0; i < 6; i++) {
                        pCaster = pCasterCube[i];
                        pCaster.setInheritance(4 /* ALL */);
                        pCaster.attachToParent(this);
                        pCaster.setProjParams(akra.math.PI / 2, 1, 0.01, 1000);
                        pCaster.setParameter(1 /* CONST_ASPECT */, true);
                    }

                    //POSITIVE_X
                    pCasterCube[0].setLocalMatrix(Mat4.temp([
                        0, 0, 1, 0,
                        0, 1, 0, 0,
                        -1, 0, 0, 0,
                        0, 0, 0, 1
                    ]));

                    //NEGATIVE_X
                    pCasterCube[1].setLocalMatrix(Mat4.temp([
                        0, 0, -1, 0,
                        0, 1, 0, 0,
                        1, 0, 0, 0,
                        0, 0, 0, 1
                    ]));

                    //POSITIVE_Y
                    pCasterCube[2].setLocalMatrix(Mat4.temp([
                        1, 0, 0, 0,
                        0, 0, 1, 0,
                        0, -1, 0, 0,
                        0, 0, 0, 1
                    ]));

                    //NEGATIVE_Y
                    pCasterCube[3].setLocalMatrix(Mat4.temp([
                        1, 0, 0, 0,
                        0, 0, -1, 0,
                        0, 1, 0, 0,
                        0, 0, 0, 1
                    ]));

                    //POSITIVE_Z
                    pCasterCube[4].setLocalMatrix(Mat4.temp([
                        -1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, -1, 0,
                        0, 0, 0, 1
                    ]));

                    //NEGATIVE_Z
                    pCasterCube[5].setLocalMatrix(Mat4.temp([
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        0, 0, 0, 1
                    ]));

                    if (this.isShadowCaster()) {
                        this.initializeTextures();
                    }

                    return isOk;
                };

                OmniLight.prototype.initializeTextures = function () {
                    var pEngine = this.getScene().getManager().getEngine();
                    var pResMgr = pEngine.getResourceManager();
                    var iSize = this._iMaxShadowResolution;

                    this._pDepthTextureCube = new Array(6);
                    this._pColorTextureCube = new Array(6);

                    for (var i = 0; i < 6; ++i) {
                        // if (this._pDepthTextureCube[i]) {
                        // 	this._pDepthTextureCube[i].destroyResource();
                        // }
                        var pDepthTexture = this._pDepthTextureCube[i] = pResMgr.createTexture("depth_texture_" + i + "_" + this.guid);
                        pDepthTexture.create(iSize, iSize, 1, null, 0, 0, 0, 3553 /* TEXTURE_2D */, 46 /* DEPTH32 */);

                        pDepthTexture.setWrapMode(10242 /* WRAP_S */, 33071 /* CLAMP_TO_EDGE */);
                        pDepthTexture.setWrapMode(10243 /* WRAP_T */, 33071 /* CLAMP_TO_EDGE */);
                        pDepthTexture.setFilter(10240 /* MAG_FILTER */, 9729 /* LINEAR */);
                        pDepthTexture.setFilter(10241 /* MIN_FILTER */, 9729 /* LINEAR */);

                        var pColorTexture = this._pColorTextureCube[i] = pResMgr.createTexture("light_color_texture_" + i + "_" + this.guid);
                        pColorTexture.create(iSize, iSize, 1, null, 512 /* RENDERTARGET */, 0, 0, 3553 /* TEXTURE_2D */, 28 /* R8G8B8A8 */);

                        //TODO: Multiple render target
                        this.getRenderTarget(i).attachDepthTexture(pDepthTexture);
                        this.getRenderTarget(i).setAutoUpdated(false);
                        this.getRenderTarget(i).addViewport(new akra.render.ShadowViewport(this._pShadowCasterCube[i]));
                    }
                };

                OmniLight.prototype._calculateShadows = function () {
                    if (this.isEnabled() && this.isShadowCaster()) {
                        for (var i = 0; i < 6; i++) {
                            this.getRenderTarget(i).update();
                            // this.getRenderTarget(i).getRenderer()._setViewport(this.getRenderTarget(i).getViewport(0));
                            // console.log("GL_DEPTH_RANLE", (<webgl.WebGLRenderer>this.getRenderTarget(i).getRenderer()).getWebGLContext().getParameter(0x0B70));
                        }
                    }
                };

                OmniLight.prototype._prepareForLighting = function (pCamera) {
                    if (!this.isEnabled()) {
                        return false;
                    } else {
                        /*************************************************************/
                        //optimize camera frustum
                        var pDepthRange = pCamera.getDepthRange();

                        var fFov = pCamera.getFOV();
                        var fAspect = pCamera.getAspect();

                        var m4fTmp = Mat4.perspective(fFov, fAspect, -pDepthRange.min, -pDepthRange.max, Mat4.temp());

                        this.getPptimizedCameraFrustum().extractFromMatrix(m4fTmp, pCamera.getWorldMatrix());

                        /*************************************************************/
                        var haveInfluence = false;
                        if (!this.isShadowCaster()) {
                            for (var i = 0; i < 6; i++) {
                                var pResult = this._defineLightingInfluence(pCamera, i);
                                if (pResult.getLength() !== 0) {
                                    haveInfluence = true;
                                }
                            }
                            return haveInfluence;
                        } else {
                            for (var i = 0; i < 6; i++) {
                                var pResult = this._defineShadowInfluence(pCamera, i);
                                if (pResult.getLength() !== 0) {
                                    haveInfluence = true;
                                }
                            }
                            return haveInfluence;
                        }
                    }
                };

                OmniLight.prototype._defineLightingInfluence = function (pCamera, iFace) {
                    var pShadowCaster = this._pShadowCasterCube[iFace];
                    var pCameraFrustum = this.getPptimizedCameraFrustum();

                    // var pCameraFrustum: IFrustum = pCamera.frustum;
                    var pResult = pShadowCaster.getAffectedObjects();
                    pResult.clear();

                    //fast test on frustum intersection
                    if (!pCameraFrustum.testFrustum(pShadowCaster.getFrustum())) {
                        //frustums don't intersecting
                        return pResult;
                    }

                    var pRawResult = pShadowCaster.display(akra.scene.Scene3d.DL_DEFAULT);

                    for (var i = 0; i < pRawResult.getLength(); i++) {
                        var pObject = pRawResult.value(i);

                        if (pCameraFrustum.testRect(pObject.getWorldBounds())) {
                            pResult.push(pObject);
                        }
                    }

                    return pResult;
                };

                OmniLight.prototype._defineShadowInfluence = function (pCamera, iFace) {
                    var pShadowCaster = this._pShadowCasterCube[iFace];
                    var pCameraFrustum = this.getPptimizedCameraFrustum();

                    var pResult = pShadowCaster.getAffectedObjects();
                    pResult.clear();

                    //fast test on frustum intersection
                    if (!pCameraFrustum.testFrustum(pShadowCaster.getFrustum())) {
                        //frustums don't intersecting
                        pShadowCaster._optimizeProjectionMatrix(pCameraFrustum);
                        return pResult;
                    }

                    var pRawResult = pShadowCaster.display(akra.scene.Scene3d.DL_DEFAULT);

                    var pTestArray = OmniLight._pFrustumPlanes;
                    var pFrustumPlanesKeys = akra.geometry.Frustum.frustumPlanesKeys;

                    akra.scene.light.calculatePlanesForFrustumLighting(pShadowCaster.getFrustum(), pShadowCaster.getWorldPosition(), pCameraFrustum, pTestArray);

                    var v3fMidPoint = Vec3.temp();
                    var v3fShadowDir = Vec3.temp();
                    var v3fCameraDir = Vec3.temp();

                    for (var i = 0; i < pRawResult.getLength(); i++) {
                        var pObject = pRawResult.value(i);
                        var pWorldBounds = pObject.getWorldBounds();

                        //have object shadows?
                        if (pObject.getShadow()) {
                            var j = 0;
                            for (j = 0; j < 6; j++) {
                                var pPlane = pTestArray[j];

                                if (akra.geometry.classify.planeRect3d(pPlane, pWorldBounds) == 0 /* PLANE_FRONT */) {
                                    break;
                                }
                            }

                            if (j == 6) {
                                //discard shadow by distance?
                                pWorldBounds.midPoint(v3fMidPoint);

                                v3fMidPoint.subtract(pShadowCaster.getWorldPosition(), v3fShadowDir);
                                v3fMidPoint.subtract(pCamera.getWorldPosition(), v3fCameraDir);

                                if (v3fCameraDir.dot(v3fShadowDir) > 0 && pWorldBounds.distanceToPoint(pCamera.getWorldPosition()) >= akra.config.SHADOW_DISCARD_DISTANCE) {
                                } else {
                                    pResult.push(pObject);
                                }
                            }
                        } else {
                            if (pCameraFrustum.testRect(pWorldBounds)) {
                                pResult.push(pObject);
                            }
                        }
                    }

                    pShadowCaster._optimizeProjectionMatrix(pCameraFrustum);

                    return pResult;
                };

                OmniLight._pFrustumPlanes = new Array(6);
                return OmniLight;
            })(akra.scene.light.LightPoint);
            light.OmniLight = OmniLight;

            for (var i = 0; i < 6; i++) {
                OmniLight._pFrustumPlanes[i] = new akra.geometry.Plane3d();
            }
        })(scene.light || (scene.light = {}));
        var light = scene.light;
    })(akra.scene || (akra.scene = {}));
    var scene = akra.scene;
})(akra || (akra = {}));
//# sourceMappingURL=OmniLight.js.map
