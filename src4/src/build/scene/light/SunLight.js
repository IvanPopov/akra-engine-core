/// <refeence path="../idl/ISunLight.ts" />
/// <refeence path="../idl/ITexture.ts" />
/// <refeence path="../idl/IResourcePoolManager.ts" />
/// <refeence path="../idl/IRenderTarget.ts" />
/// <refeence path="../util/ObjectArray.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (scene) {
        /// <refeence path="CalculatePlanesForLighting.ts" />
        (function (light) {
            var Vec3 = akra.math.Vec3;
            var Mat4 = akra.math.Mat4;

            var Scene3d = akra.scene.Scene3d;

            var SunParameters = (function () {
                function SunParameters() {
                    this.eyePosition = new Vec3;
                    this.sunDir = new Vec3;
                    this.groundC0 = new Vec3;
                    this.groundC1 = new Vec3;
                    this.hg = new Vec3;
                }
                return SunParameters;
            })();
            light.SunParameters = SunParameters;

            var SunLight = (function (_super) {
                __extends(SunLight, _super);
                function SunLight(pScene) {
                    _super.call(this, pScene, 3 /* SUN */);
                    this._pLightParameters = new SunParameters;
                    this._pSkyDome = null;
                    this._pColorTexture = null;
                    this._pDepthTexture = null;
                    this._pShadowCaster = pScene._createShadowCaster(this);
                }
                SunLight.prototype.getParams = function () {
                    return this._pLightParameters;
                };

                SunLight.prototype.getSkyDome = function () {
                    return this._pSkyDome;
                };

                SunLight.prototype.setSkyDome = function (pSkyDome) {
                    this._pSkyDome = pSkyDome;
                };

                SunLight.prototype.getLightingDistance = function () {
                    return this._pShadowCaster.getFarPlane();
                };

                SunLight.prototype.setLightingDistance = function (fDistance) {
                    this._pShadowCaster.setFarPlane(fDistance);
                };

                SunLight.prototype.isShadowCaster = function () {
                    return this._isShadowCaster;
                };

                SunLight.prototype.setShadowCaster = function (bValue) {
                    this._isShadowCaster = bValue;
                    if (bValue && akra.isNull(this._pDepthTexture)) {
                        this.initializeTextures();
                    }
                };

                SunLight.prototype.getDepthTexture = function () {
                    return this._pDepthTexture;
                };

                SunLight.prototype.getRenderTarget = function () {
                    // return this._pDepthTexture.getBuffer().getRenderTarget();
                    return this._pColorTexture.getBuffer().getRenderTarget();
                };

                SunLight.prototype.getShadowCaster = function () {
                    return this._pShadowCaster;
                };

                SunLight.prototype.create = function (isShadowCaster, iMaxShadowResolution) {
                    if (typeof isShadowCaster === "undefined") { isShadowCaster = true; }
                    if (typeof iMaxShadowResolution === "undefined") { iMaxShadowResolution = 256; }
                    var isOk = _super.prototype.create.call(this, isShadowCaster, iMaxShadowResolution);

                    var pCaster = this._pShadowCaster;

                    pCaster.setParameter(1 /* CONST_ASPECT */, true);
                    pCaster.setOrthoParams(1000., 1000., 0., 1000.);
                    pCaster.setInheritance(4 /* ALL */);
                    pCaster.attachToParent(this);

                    if (this.isShadowCaster()) {
                        this.initializeTextures();
                    }

                    return isOk;
                };

                SunLight.prototype._calculateShadows = function () {
                    if (this.isEnabled() && this.isShadowCaster()) {
                        // LOG(this._pShadowCaster.affectedObjects);
                        this.getRenderTarget().update();
                    }
                };

                // create(caster: boolean): boolean{
                // 	return super.create(false, 0);
                // };
                SunLight.prototype._prepareForLighting = function (pCamera) {
                    // if(!this.enabled){
                    // 	return false;
                    // }
                    // return true;
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
                        if (!this.isShadowCaster()) {
                            var pResult = this._defineLightingInfluence(pCamera);
                            return (pResult.getLength() === 0) ? false : true;
                        } else {
                            var pResult = this._defineShadowInfluence(pCamera);

                            // this._pShadowCaster.optimizedProjection.set(this._pShadowCaster.projectionMatrix);
                            return (pResult.getLength() === 0) ? false : true;
                        }
                    }
                };

                SunLight.prototype._defineLightingInfluence = function (pCamera) {
                    var pShadowCaster = this._pShadowCaster;
                    var pCameraFrustum = this.getPptimizedCameraFrustum();

                    var pResult = pShadowCaster.getAffectedObjects();
                    pResult.clear();

                    // fast test on frustum intersection
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

                SunLight.prototype._defineShadowInfluence = function (pCamera) {
                    var pShadowCaster = this._pShadowCaster;
                    var pCameraFrustum = this.getPptimizedCameraFrustum();

                    var pResult = pShadowCaster.getAffectedObjects();
                    pResult.clear();

                    // fast test on frustum intersection
                    if (!pCameraFrustum.testFrustum(pShadowCaster.getFrustum())) {
                        //frustums don't intersecting
                        pShadowCaster._optimizeProjectionMatrix(pCameraFrustum);

                        // pShadowCaster.optimizedProjection.set(pShadowCaster.projectionMatrix);
                        return pResult;
                    }

                    var pRawResult = pShadowCaster.display(akra.scene.Scene3d.DL_DEFAULT);

                    var pTestArray = SunLight._pFrustumPlanes;
                    var nAdditionalTestLength = 0;

                    nAdditionalTestLength = akra.scene.light.calculatePlanesForOrthogonalLighting(pShadowCaster.getFrustum(), pShadowCaster.getWorldPosition(), pCameraFrustum, pTestArray);

                    var v3fMidPoint = Vec3.temp();
                    var v3fShadowDir = Vec3.temp();
                    var v3fCameraDir = Vec3.temp();

                    for (var i = 0; i < pRawResult.getLength(); i++) {
                        var pObject = pRawResult.value(i);
                        var pWorldBounds = pObject.getWorldBounds();

                        //have object shadows?
                        if (pObject.getShadow()) {
                            var j = 0;
                            for (j = 0; j < nAdditionalTestLength; j++) {
                                var pPlane = pTestArray[j];

                                if (akra.geometry.classify.planeRect3d(pPlane, pWorldBounds) == 0 /* PLANE_FRONT */) {
                                    break;
                                }
                            }
                            if (j == nAdditionalTestLength) {
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

                SunLight.prototype.updateSunDirection = function (v3fSunDir) {
                    // var m4fMat: IMat4 = Mat4.temp(this.localMatrix);
                    // m4fMat.data[__13] = -v3fSunDir.x;
                    // m4fMat.data[__23] = -v3fSunDir.y;
                    // m4fMat.data[__33] = -v3fSunDir.z;
                    //this.localMatrix = Mat4.fromXYZ(Vec3.temp(v3fSunDir.x, v3fSunDir.y, v3fSunDir.z).scale(-1., Vec3.temp()), Mat4.temp()).setTranslation(Vec3.temp(0., 0., 1.));
                    // var pViewMat = Mat4.temp();
                    var pViewMat = Mat4.lookAt(Vec3.temp(0.), Vec3.temp(v3fSunDir).scale(-1.), Vec3.temp(0., 0., 1.), Mat4.temp());

                    this.setLocalMatrix(pViewMat.inverse());

                    this.getLocalMatrix().setTranslation(v3fSunDir.scale(500., Vec3.temp()));
                    //this.localMatrix.setTranslation();
                };

                SunLight.prototype.initializeTextures = function () {
                    var pEngine = this.getScene().getManager().getEngine();
                    var pResMgr = pEngine.getResourceManager();
                    var iSize = this._iMaxShadowResolution;

                    // if (!isNull(this._pDepthTexture)){
                    // 	this._pDepthTexture.destroyResource();
                    // }
                    var pDepthTexture = this._pDepthTexture = pResMgr.createTexture("depth_texture_" + this.guid);
                    pDepthTexture.create(iSize, iSize, 1, null, 0, 0, 0, 3553 /* TEXTURE_2D */, 46 /* DEPTH32 */);

                    pDepthTexture.setWrapMode(10242 /* WRAP_S */, 33071 /* CLAMP_TO_EDGE */);
                    pDepthTexture.setWrapMode(10243 /* WRAP_T */, 33071 /* CLAMP_TO_EDGE */);
                    pDepthTexture.setFilter(10240 /* MAG_FILTER */, 9729 /* LINEAR */);
                    pDepthTexture.setFilter(10241 /* MIN_FILTER */, 9729 /* LINEAR */);

                    // if (this._pColorTexture) {
                    // 	this._pColorTexture.destroy();
                    // }
                    var pColorTexture = pResMgr.createTexture("light_color_texture_" + this.guid);
                    pColorTexture.create(iSize, iSize, 1, null, 512 /* RENDERTARGET */, 0, 0, 3553 /* TEXTURE_2D */, 28 /* R8G8B8A8 */);

                    this._pColorTexture = pColorTexture;

                    // this._pColorTexture = pColorTexture;
                    //TODO: Multiple render target
                    this.getRenderTarget().attachDepthTexture(pDepthTexture);
                    this.getRenderTarget().setAutoUpdated(false);
                    this.getRenderTarget().addViewport(new akra.render.ShadowViewport(this._pShadowCaster));
                };

                SunLight._pFrustumPlanes = new Array(6);
                SunLight._pTmpPlanePoints = [new Vec3(), new Vec3(), new Vec3(), new Vec3()];
                SunLight._pTmpIndexList = [0, 0, 0, 0];
                SunLight._pTmpDirLengthList = [0.0, 0.0, 0.0, 0.0];
                return SunLight;
            })(akra.scene.light.LightPoint);
            light.SunLight = SunLight;

            for (var i = 0; i < 6; i++) {
                SunLight._pFrustumPlanes[i] = new akra.geometry.Plane3d();
            }
        })(scene.light || (scene.light = {}));
        var light = scene.light;
    })(akra.scene || (akra.scene = {}));
    var scene = akra.scene;
})(akra || (akra = {}));
//# sourceMappingURL=SunLight.js.map
