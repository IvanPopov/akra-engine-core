/// <reference path="../../idl/ITexture.ts" />
/// <reference path="../../idl/IFrustum.ts" />
/// <reference path="../../idl/IResourcePoolManager.ts" />
/// <reference path="../../idl/IRenderTarget.ts" />
/// <reference path="../../util/ObjectArray.ts" />
/// <reference path="../../geometry/Plane3d.ts" />
/// <reference path="../../geometry/classify/classify.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (scene) {
        /// <reference path="CalculatePlanesForLighting.ts" />
        /// <reference path="ShadowCaster.ts" />
        (function (light) {
            var Color = akra.color.Color;
            var Vec3 = akra.math.Vec3;
            var Mat4 = akra.math.Mat4;

            var ProjectParameters = (function () {
                function ProjectParameters() {
                    this.ambient = new Color;
                    this.diffuse = new Color;
                    this.specular = new Color;
                    this.attenuation = new Vec3;
                }
                return ProjectParameters;
            })();
            light.ProjectParameters = ProjectParameters;

            var ProjectLight = (function (_super) {
                __extends(ProjectLight, _super);
                function ProjectLight(pScene) {
                    _super.call(this, pScene, 1 /* PROJECT */);
                    this._pDepthTexture = null;
                    this._pColorTexture = null;
                    this._pLightParameters = new ProjectParameters;
                    this._pShadowCaster = pScene._createShadowCaster(this);
                }
                ProjectLight.prototype.getParams = function () {
                    return this._pLightParameters;
                };

                ProjectLight.prototype.isShadowCaster = function () {
                    return this._isShadowCaster;
                };

                /**
                * overridden setter isShadow caster,
                * if depth texture don't created then create depth texture
                */
                ProjectLight.prototype.setShadowCaster = function (bValue) {
                    this._isShadowCaster = bValue;
                    if (bValue && akra.isNull(this._pDepthTexture)) {
                        this.initializeTextures();
                    }
                };

                ProjectLight.prototype.getLightingDistance = function () {
                    return this._pShadowCaster.getFarPlane();
                };

                ProjectLight.prototype.setLightingDistance = function (fDistance) {
                    this._pShadowCaster.setFarPlane(fDistance);
                };

                ProjectLight.prototype.getShadowCaster = function () {
                    return this._pShadowCaster;
                };

                ProjectLight.prototype.getDepthTexture = function () {
                    return this._pDepthTexture;
                };

                ProjectLight.prototype.getRenderTarget = function () {
                    // return this._pDepthTexture.getBuffer().getRenderTarget();
                    return this._pColorTexture.getBuffer().getRenderTarget();
                };

                ProjectLight.prototype.create = function (isShadowCaster, iMaxShadowResolution) {
                    if (typeof isShadowCaster === "undefined") { isShadowCaster = true; }
                    if (typeof iMaxShadowResolution === "undefined") { iMaxShadowResolution = 256; }
                    var isOk = _super.prototype.create.call(this, isShadowCaster, iMaxShadowResolution);

                    var pCaster = this._pShadowCaster;

                    pCaster.setParameter(1 /* CONST_ASPECT */, true);
                    pCaster.setInheritance(4 /* ALL */);
                    pCaster.attachToParent(this);

                    if (this.isShadowCaster()) {
                        this.initializeTextures();
                    }

                    return isOk;
                };

                ProjectLight.prototype.initializeTextures = function () {
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

                ProjectLight.prototype._calculateShadows = function () {
                    if (this.isEnabled() && this.isShadowCaster()) {
                        this.getRenderTarget().update();
                    }
                };

                ProjectLight.prototype._prepareForLighting = function (pCamera) {
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
                            return (pResult.getLength() === 0) ? false : true;
                        }
                    }
                };

                ProjectLight.prototype._defineLightingInfluence = function (pCamera) {
                    var pShadowCaster = this._pShadowCaster;
                    var pCameraFrustum = this.getPptimizedCameraFrustum();

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

                ProjectLight.prototype._defineShadowInfluence = function (pCamera) {
                    var pShadowCaster = this._pShadowCaster;
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

                    var pTestArray = ProjectLight._pFrustumPlanes;
                    var nAdditionalTestLength = 0;

                    if (pShadowCaster.getProjectionMatrix().isOrthogonalProjection()) {
                        nAdditionalTestLength = akra.scene.light.calculatePlanesForOrthogonalLighting(pShadowCaster.getFrustum(), pShadowCaster.getWorldPosition(), pCameraFrustum, pTestArray);
                    } else {
                        nAdditionalTestLength = akra.scene.light.calculatePlanesForFrustumLighting(pShadowCaster.getFrustum(), pShadowCaster.getWorldPosition(), pCameraFrustum, pTestArray);
                    }

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

                ProjectLight._pFrustumPlanes = new Array(6);
                return ProjectLight;
            })(akra.scene.light.LightPoint);
            light.ProjectLight = ProjectLight;

            for (var i = 0; i < 6; i++) {
                ProjectLight._pFrustumPlanes[i] = new akra.geometry.Plane3d();
            }
        })(scene.light || (scene.light = {}));
        var light = scene.light;
    })(akra.scene || (akra.scene = {}));
    var scene = akra.scene;
})(akra || (akra = {}));
//# sourceMappingURL=ProjectLight.js.map
