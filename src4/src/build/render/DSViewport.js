/// <reference path="../idl/IDSViewport.ts" />
/// <reference path="../idl/IScene3d.ts" />
/// <reference path="../idl/IRenderTechnique.ts" />
/// <reference path="../idl/IRenderPass.ts" />
/// <reference path="../idl/ILightPoint.ts" />
/// <reference path="../idl/IOmniLight.ts" />
/// <reference path="../idl/IProjectLight.ts" />
/// <reference path="../idl/IShadowCaster.ts" />
/// <reference path="../idl/IEffect.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="Viewport.ts" />
    /// <reference path="DSUniforms.ts" />
    /// <reference path="RenderableObject.ts" />
    /// <reference path="Screen.ts" />
    /// <reference path="../info/info.ts" />
    /// <reference path="../util/ObjectArray.ts" />
    /// <reference path="../webgl/DepthRange.ts" />
    /// <reference path="../color/Color.ts" />
    /// <reference path="../scene/Scene3d.ts" />
    (function (render) {
        var Vec2 = akra.math.Vec2;
        var Vec3 = akra.math.Vec3;
        var Vec4 = akra.math.Vec4;
        var Mat4 = akra.math.Mat4;

        var Color = akra.color.Color;
        var Scene3d = akra.scene.Scene3d;

        var pDepthPixel = new akra.pixelUtil.PixelBox(new akra.geometry.Box(0, 0, 1, 1), 29 /* FLOAT32_DEPTH */, new Uint8Array(4 * 1));
        var pFloatColorPixel = new akra.pixelUtil.PixelBox(new akra.geometry.Box(0, 0, 1, 1), 25 /* FLOAT32_RGBA */, new Uint8Array(4 * 4));
        var pColor = new Color(0);

        var DSViewport = (function (_super) {
            __extends(DSViewport, _super);
            function DSViewport(pCamera, fLeft, fTop, fWidth, fHeight, iZIndex) {
                if (typeof fLeft === "undefined") { fLeft = 0.; }
                if (typeof fTop === "undefined") { fTop = 0.; }
                if (typeof fWidth === "undefined") { fWidth = 1.; }
                if (typeof fHeight === "undefined") { fHeight = 1.; }
                if (typeof iZIndex === "undefined") { iZIndex = 0; }
                _super.call(this, pCamera, null, fLeft, fTop, fWidth, fHeight, iZIndex);
                this._pDeferredEffect = null;
                this._pDeferredColorTextures = [];
                this._pDeferredDepthTexture = null;
                this._pDeferredView = null;
                this._pDeferredSkyTexture = null;
                this._pLightPoints = null;
                this._pLightingUnifoms = {
                    omni: [],
                    project: [],
                    sun: [],
                    omniShadows: [],
                    projectShadows: [],
                    sunShadows: [],
                    textures: [],
                    samplersOmni: [],
                    samplersProject: [],
                    samplersSun: []
                };
                //highligting
                this._pHighlightedObject = { object: null, renderable: null };
            }
            DSViewport.prototype.setupSignals = function () {
                this.addedSkybox = this.addedSkybox || new akra.Signal(this);
                this.addedBackground = this.addedBackground || new akra.Signal(this);

                _super.prototype.setupSignals.call(this);
            };

            DSViewport.prototype.getType = function () {
                return 1 /* DSVIEWPORT */;
            };

            DSViewport.prototype.getEffect = function () {
                return this._pDeferredEffect;
            };

            DSViewport.prototype.getDepthTexture = function () {
                return this._pDeferredDepthTexture;
            };

            DSViewport.prototype.getView = function () {
                return this._pDeferredView;
            };

            DSViewport.prototype._setTarget = function (pTarget) {
                _super.prototype._setTarget.call(this, pTarget);

                //common api access
                var pEngine = pTarget.getRenderer().getEngine();
                var pResMgr = pEngine.getResourceManager();

                //textures for deferred shading
                var pDeferredData = new Array(2);
                var pDeferredTextures = new Array(2);
                var pDepthTexture;

                //renderable for displaying result from deferred textures
                var pDefferedView = new akra.render.Screen(pEngine.getRenderer());

                //unique idetifier for creation dependent resources
                var iGuid = this.guid;

                //Float point texture must be power of two.
                var iWidth = akra.math.ceilingPowerOfTwo(this.getActualWidth());
                var iHeight = akra.math.ceilingPowerOfTwo(this.getActualHeight());

                //detect max texture resolution correctly
                if (akra.config.WEBGL) {
                    iWidth = akra.math.min(iWidth, akra.webgl.maxTextureSize);
                    iHeight = akra.math.min(iHeight, akra.webgl.maxTextureSize);
                }

                //creating depth
                pDepthTexture = this._pDeferredDepthTexture = pResMgr.createTexture("deferred-depth-texture-" + iGuid);
                pDepthTexture.create(iWidth, iHeight, 1, null, 0, 0, 0, 3553 /* TEXTURE_2D */, 46 /* DEPTH32 */);
                pDepthTexture.setFilter(10240 /* MAG_FILTER */, 9729 /* LINEAR */);
                pDepthTexture.setFilter(10241 /* MIN_FILTER */, 9729 /* LINEAR */);

                var pViewport;

                for (var i = 0; i < 2; ++i) {
                    pDeferredTextures[i] = this._pDeferredColorTextures[i] = pResMgr.createTexture("deferred-color-texture-" + i + "-" + iGuid);

                    pDeferredTextures[i].create(iWidth, iHeight, 1, null, 512 /* RENDERTARGET */, 0, 0, 3553 /* TEXTURE_2D */, 25 /* FLOAT32_RGBA */);

                    pDeferredData[i] = pDeferredTextures[i].getBuffer().getRenderTarget();
                    pDeferredData[i].setAutoUpdated(false);
                    pViewport = pDeferredData[i].addViewport(new akra.render.Viewport(this.getCamera(), "deferred_shading_pass_" + i, 0, 0, this.getActualWidth() / pDeferredTextures[i].getWidth(), this.getActualHeight() / pDeferredTextures[i].getHeight()));
                    pDeferredData[i].attachDepthTexture(pDepthTexture);

                    if (i === 1) {
                        pViewport.setDepthParams(true, false, 4 /* EQUAL */);
                        pViewport.setClearEveryFrame(true, 1 /* COLOR */);
                    }
                }

                //creatin deferred effects
                var pDSMethod = null;
                var pDSEffect = null;

                pDSMethod = pResMgr.createRenderMethod(".deferred_shading" + iGuid);
                pDSEffect = pResMgr.createEffect(".deferred_shading" + iGuid);

                pDSEffect.addComponent("akra.system.deferredShading");
                pDSEffect.addComponent("akra.system.omniLighting");
                pDSEffect.addComponent("akra.system.projectLighting");
                pDSEffect.addComponent("akra.system.omniShadowsLighting");
                pDSEffect.addComponent("akra.system.projectShadowsLighting");
                pDSEffect.addComponent("akra.system.sunLighting");
                pDSEffect.addComponent("akra.system.sunShadowsLighting");

                pDSMethod.setEffect(pDSEffect);

                this._pDeferredEffect = pDSEffect;
                this._pDeferredView = pDefferedView;

                pDefferedView.getTechnique().setMethod(pDSMethod);

                this.setClearEveryFrame(false);
                this.setDepthParams(false, false, 0);

                //AA is default
                this.setFXAA(true);
            };

            DSViewport.prototype.setCamera = function (pCamera) {
                var isOk = _super.prototype.setCamera.call(this, pCamera);
                this._pDeferredColorTextures[0].getBuffer().getRenderTarget().getViewport(0).setCamera(pCamera);
                this._pDeferredColorTextures[1].getBuffer().getRenderTarget().getViewport(0).setCamera(pCamera);
                return isOk;
            };

            DSViewport.prototype._updateDimensions = function (bEmitEvent) {
                if (typeof bEmitEvent === "undefined") { bEmitEvent = true; }
                _super.prototype._updateDimensions.call(this, false);

                var pDeferredTextures = this._pDeferredColorTextures;

                if (akra.isDefAndNotNull(this._pDeferredDepthTexture)) {
                    this._pDeferredDepthTexture.reset(akra.math.ceilingPowerOfTwo(this.getActualWidth()), akra.math.ceilingPowerOfTwo(this.getActualHeight()));
                    for (var i = 0; i < 2; ++i) {
                        pDeferredTextures[i].reset(akra.math.ceilingPowerOfTwo(this.getActualWidth()), akra.math.ceilingPowerOfTwo(this.getActualHeight()));
                        pDeferredTextures[i].getBuffer().getRenderTarget().getViewport(0).setDimensions(0., 0., this.getActualWidth() / pDeferredTextures[i].getWidth(), this.getActualHeight() / pDeferredTextures[i].getHeight());
                    }
                }

                if (bEmitEvent) {
                    this.viewportDimensionsChanged.emit();
                }
            };

            DSViewport.prototype._updateImpl = function () {
                this.prepareForDeferredShading();

                //prepare deferred textures
                this._pDeferredColorTextures[0].getBuffer().getRenderTarget().update();
                this._pDeferredColorTextures[1].getBuffer().getRenderTarget().update();

                //camera last viewport changed, because camera used in deferred textures updating
                this._pCamera._keepLastViewport(this);

                //calculate lighting
                //TODO: Display techniques return sceneNodes, LightPoints and SceneObjects
                var pLights = this.getCamera().display(Scene3d.DL_LIGHTING);

                for (var i = 0; i < pLights.getLength(); i++) {
                    pLights.value(i)._calculateShadows();
                }

                this._pLightPoints = pLights;

                //render deferred
                this._pDeferredView.render(this);
            };

            DSViewport.prototype.endFrame = function () {
                this.getTarget().getRenderer().executeQueue(false);
            };

            DSViewport.prototype.prepareForDeferredShading = function () {
                var pNodeList = this.getCamera().display();

                for (var i = 0; i < pNodeList.getLength(); ++i) {
                    var pSceneObject = pNodeList.value(i);

                    for (var k = 0; k < pSceneObject.getTotalRenderable(); k++) {
                        var pRenderable = pSceneObject.getRenderable(k);
                        var pTechCurr = pRenderable.getTechniqueDefault();

                        for (var j = 0; j < 2; j++) {
                            var sMethod = "deferred_shading_pass_" + j;
                            var pTechnique = pRenderable.getTechnique(sMethod);

                            if (akra.isNull(pTechnique) || pTechCurr.getModified() > pTechnique.getModified()) {
                                if (!pRenderable.addRenderMethod(pRenderable.getRenderMethodByName(), sMethod)) {
                                    akra.logger.critical("cannot clone active render method");
                                }

                                pTechnique = pRenderable.getTechnique(sMethod);

                                //TODO: need something else
                                pTechnique.render._syncSignal(pTechCurr.render);

                                //pTechnique._syncTable(pTechCurr);
                                if (j === 0) {
                                    pTechnique._blockPass(1);
                                } else {
                                    pTechnique._blockPass(0);
                                }

                                if (pTechnique.getTotalPasses() > j) {
                                    var pPass = pTechnique.getPass(j);
                                    pPass.blend("akra.system.prepareForDeferredShading", j);
                                }
                            }
                        }
                    }
                }
                ;
            };

            DSViewport.prototype.getSkybox = function () {
                return this._pDeferredSkyTexture;
            };

            //protected _getDepthRangeImpl(): IDepthRange{
            //	var pRange: IDepthRange = config.WEBGL ?
            //		webgl.getDepthRange(this._pDeferredDepthTexture):
            //		<IDepthRange>{min: 0., max: 1.};
            //	//[0,1] -> [-1, 1]
            //	pRange.min = pRange.min * 2. - 1.;
            //	pRange.max = pRange.max * 2. - 1.;
            //	return pRange;
            //}
            DSViewport.prototype.getObject = function (x, y) {
                return this.getTarget().getRenderer().getEngine().getComposer()._getObjectByRid(this._getRenderId(x, y));
            };

            DSViewport.prototype.getRenderable = function (x, y) {
                return this.getTarget().getRenderer().getEngine().getComposer()._getRenderableByRid(this._getRenderId(x, y));
            };

            DSViewport.prototype.pick = function (x, y) {
                var pComposer = this.getTarget().getRenderer().getEngine().getComposer();
                var iRid = this._getRenderId(x, y);
                var pObject = pComposer._getObjectByRid(iRid);
                var pRenderable = null;

                if (akra.isNull(pObject) || !pObject.isFrozen()) {
                    pRenderable = pComposer._getRenderableByRid(iRid);
                } else {
                    pObject = null;
                }

                return { renderable: pRenderable, object: pObject };
            };

            DSViewport.prototype._getRenderId = function (x, y) {
                return this._getDeferredTexValue(0, x, y).a;
            };

            DSViewport.prototype._getDeferredTexValue = function (iTex, x, y) {
                akra.logger.assert(x < this.getActualWidth() && y < this.getActualHeight(), "invalid pixel: {" + x + "(" + this.getActualWidth() + ")" + ", " + y + "(" + this.getActualHeight() + ")" + "}");

                var pColorTexture = this._pDeferredColorTextures[iTex];

                //depth texture has POT sized, but viewport not;
                //depth texture attached to left bottom angle of viewport
                y = pColorTexture.getHeight() - y - 1;
                pFloatColorPixel.left = x;
                pFloatColorPixel.top = y;
                pFloatColorPixel.right = x + 1;
                pFloatColorPixel.bottom = y + 1;

                pColorTexture.getBuffer(0, 0).readPixels(pFloatColorPixel);

                return pFloatColorPixel.getColorAt(pColor, 0, 0);
            };

            DSViewport.prototype.getDepth = function (x, y) {
                akra.logger.assert(x < this.getActualWidth() && y < this.getActualHeight(), "invalid pixel: {" + x + ", " + y + "}");

                var pDepthTexture = this._pDeferredDepthTexture;

                //depth texture has POT sized, but viewport not;
                //depth texture attached to left bottom angle of viewport
                // y = y + (pDepthTexture.height - this.actualHeight);
                // pDepthPixel.left = x;
                // pDepthPixel.top = y;
                // pDepthPixel.right = x + 1;
                // pDepthPixel.bottom = y + 1;
                y = pDepthTexture.getHeight() - y - 1;
                pDepthPixel.left = x;
                pDepthPixel.top = y;
                pDepthPixel.right = x + 1;
                pDepthPixel.bottom = y + 1;

                pDepthTexture.getBuffer(0, 0).readPixels(pDepthPixel);

                return pDepthPixel.getColorAt(pColor, 0, 0).r;
            };

            DSViewport.prototype.setSkybox = function (pSkyTexture) {
                if (pSkyTexture.getTextureType() !== 34067 /* TEXTURE_CUBE_MAP */) {
                    return null;
                }

                var pTechnique = this._pDeferredView.getTechnique();
                var pEffect = this._pDeferredEffect;

                if (pSkyTexture) {
                    pEffect.addComponent("akra.system.skybox", 1, 0);
                } else {
                    pEffect.delComponent("akra.system.skybox", 1, 0);
                }

                this._pDeferredSkyTexture = pSkyTexture;

                this.addedSkybox.emit(pSkyTexture);

                return true;
            };

            DSViewport.prototype.setFXAA = function (bValue) {
                if (typeof bValue === "undefined") { bValue = true; }
                var pEffect = this._pDeferredEffect;

                if (bValue) {
                    pEffect.addComponent("akra.system.fxaa", 2, 0);
                } else {
                    pEffect.delComponent("akra.system.fxaa", 2, 0);
                }
            };

            DSViewport.prototype.highlight = function (a) {
                var pComposer = this.getTarget().getRenderer().getEngine().getComposer();
                var pEffect = this._pDeferredEffect;
                var iRid = 0;
                var p = this._pHighlightedObject;
                var pObjectPrev = p.object;

                if (akra.isNull(arguments[0])) {
                    p.object = null;
                    p.renderable = null;
                } else if (akra.isInt(arguments[0])) {
                    p.object = pComposer._getObjectByRid(iRid);
                    p.renderable = pComposer._getRenderableByRid(iRid);
                } else if (arguments[0] instanceof akra.scene.SceneObject) {
                    p.object = arguments[0];
                    p.renderable = arguments[1];
                } else {
                    p.object = arguments[0].object;
                    p.renderable = arguments[0].renderable;
                }

                if (p.object && akra.isNull(pObjectPrev)) {
                    pEffect.addComponent("akra.system.outline", 1, 0);
                } else if (akra.isNull(p.object) && pObjectPrev) {
                    pEffect.delComponent("akra.system.outline", 1, 0);
                }
            };

            DSViewport.prototype.isFXAA = function () {
                return this.getEffect().hasComponent("akra.system.fxaa");
            };

            DSViewport.prototype.destroy = function () {
                _super.prototype.destroy.call(this);

                this._pDeferredDepthTexture.destroyResource();

                this._pDeferredColorTextures[0].destroyResource();
                this._pDeferredColorTextures[1].destroyResource();

                this._pDeferredView.destroy();
                this._pDeferredView = null;

                this._pDeferredSkyTexture = null;
            };

            DSViewport.prototype._onRender = function (pTechnique, iPass, pRenderable, pSceneObject) {
                var pPass = pTechnique.getPass(iPass);
                var pDepthTexture = this._pDeferredDepthTexture;
                var pDeferredTextures = this._pDeferredColorTextures;

                switch (iPass) {
                    case 0:
                        var pLightUniforms = this._pLightingUnifoms;
                        var pLightPoints = this._pLightPoints;
                        var pCamera = this.getCamera();

                        this.createLightingUniforms(pCamera, pLightPoints, pLightUniforms);

                        pPass.setForeign("nOmni", pLightUniforms.omni.length);
                        pPass.setForeign("nProject", pLightUniforms.project.length);
                        pPass.setForeign("nOmniShadows", pLightUniforms.omniShadows.length);
                        pPass.setForeign("nProjectShadows", pLightUniforms.projectShadows.length);
                        pPass.setForeign("nSun", pLightUniforms.sun.length);
                        pPass.setForeign("nSunShadows", pLightUniforms.sunShadows.length);

                        pPass.setStruct("points_omni", pLightUniforms.omni);
                        pPass.setStruct("points_project", pLightUniforms.project);
                        pPass.setStruct("points_omni_shadows", pLightUniforms.omniShadows);
                        pPass.setStruct("points_project_shadows", pLightUniforms.projectShadows);
                        pPass.setStruct("points_sun", pLightUniforms.sun);
                        pPass.setStruct("points_sun_shadows", pLightUniforms.sunShadows);

                        for (var i = 0; i < pLightUniforms.textures.length; i++) {
                            pPass.setTexture("TEXTURE" + i, pLightUniforms.textures[i]);
                        }

                        pPass.setUniform("PROJECT_SHADOW_SAMPLER", pLightUniforms.samplersProject);
                        pPass.setUniform("OMNI_SHADOW_SAMPLER", pLightUniforms.samplersOmni);
                        pPass.setUniform("SUN_SHADOW_SAMPLER", pLightUniforms.samplersSun);

                        pPass.setUniform("MIN_SHADOW_VALUE", 0.5);
                        pPass.setUniform("SHADOW_CONSTANT", 5.e+2);

                        pPass.setUniform("SCREEN_TEXTURE_RATIO", Vec2.temp(this.getActualWidth() / pDepthTexture.getWidth(), this.getActualHeight() / pDepthTexture.getHeight()));

                        pPass.setTexture("DEFERRED_TEXTURE0", pDeferredTextures[0]);
                        pPass.setTexture("DEFERRED_TEXTURE1", pDeferredTextures[1]);
                        pPass.setTexture("SCENE_DEPTH_TEXTURE", pDepthTexture);

                        break;

                    case 1:
                        //skybox
                        pPass.setTexture("DEFERRED_TEXTURE0", pDeferredTextures[0]);
                        pPass.setTexture("SKYBOX_TEXTURE", this._pDeferredSkyTexture);

                        pPass.setUniform("SCREEN_TEXTURE_RATIO", Vec2.temp(this.getActualWidth() / pDepthTexture.getWidth(), this.getActualHeight() / pDepthTexture.getHeight()));

                        //outline
                        var p = this._pHighlightedObject;

                        if (!akra.isNull(p.object)) {
                            var iRid = this.getTarget().getRenderer().getEngine().getComposer()._calcRenderID(p.object, p.renderable);

                            pPass.setUniform("OUTLINE_TARGET", iRid);
                            pPass.setUniform("OUTLINE_SOID", (iRid - 1) >>> 10);
                            pPass.setUniform("OUTLINE_REID", (iRid - 1) & 1023);
                        }

                        pPass.setTexture("DEFERRED_TEXTURE0", pDeferredTextures[0]);
                        pPass.setUniform("SCREEN_TEXTURE_RATIO", Vec2.temp(this.getActualWidth() / pDepthTexture.getWidth(), this.getActualHeight() / pDepthTexture.getHeight()));
                        break;
                }

                _super.prototype._onRender.call(this, pTechnique, iPass, pRenderable, pSceneObject);
            };

            DSViewport.prototype.createLightingUniforms = function (pCamera, pLightPoints, pUniforms) {
                var pLight;
                var pOmniLight;
                var pProjectLight;
                var pSunLight;
                var i, j;
                var pUniformData;
                var pCameraView = pCamera.getViewMatrix();

                var v4fLightPosition = Vec4.temp();
                var v3fLightTransformPosition = Vec3.temp();
                var v4fTemp = Vec4.temp();

                var pShadowCaster;
                var m4fShadow, m4fToLightSpace;

                var iLastTextureIndex = 0;
                var sTexture = "TEXTURE";
                var pEngine = this.getTarget().getRenderer().getEngine();

                this.resetUniforms();

                for (i = 0; i < pLightPoints.getLength(); i++) {
                    pLight = pLightPoints.value(i);

                    //all cameras in list already enabled
                    // if (!pLight.enabled) {
                    //     continue;
                    // }
                    v4fLightPosition.set(pLight.getWorldPosition(), 1.);
                    pCameraView.multiplyVec4(v4fLightPosition, v4fTemp);
                    v3fLightTransformPosition.set(v4fTemp.x, v4fTemp.y, v4fTemp.z);

                    if (pLight.getLightType() === 2 /* OMNI */) {
                        pOmniLight = pLight;

                        if (pLight.isShadowCaster()) {
                            pUniformData = akra.render.UniformOmniShadow.temp();
                            pUniformData.setLightData(pLight.getParams(), v3fLightTransformPosition);

                            var pDepthCube = pOmniLight.getDepthTextureCube();
                            var pShadowCasterCube = pOmniLight.getShadowCaster();

                            for (j = 0; j < 6; ++j) {
                                pShadowCaster = pShadowCasterCube[j];
                                m4fToLightSpace = pShadowCaster.getViewMatrix().multiply(pCamera.getWorldMatrix(), Mat4.temp());
                                pUniforms.textures.push(pDepthCube[j]);
                                sTexture = "TEXTURE" + (pUniforms.textures.length - 1);

                                pUniformData.setSampler(sTexture, j);
                                pUniforms.samplersOmni.push(pUniformData.SHADOW_SAMPLER[j]);
                                pUniformData.setMatrix(m4fToLightSpace, pShadowCaster.getOptimizedProjection(), j);
                            }

                            pUniforms.omniShadows.push(pUniformData);
                        } else {
                            pUniformData = akra.render.UniformOmni.temp();
                            pUniformData.setLightData(pLight.getParams(), v3fLightTransformPosition);
                            pUniforms.omni.push(pUniformData);
                        }
                    } else if (pLight.getLightType() === 1 /* PROJECT */) {
                        pProjectLight = pLight;
                        pShadowCaster = pProjectLight.getShadowCaster();

                        if (pLight.isShadowCaster() && pShadowCaster.isShadowCasted()) {
                            pUniformData = akra.render.UniformProjectShadow.temp();
                            pUniformData.setLightData(pLight.getParams(), v3fLightTransformPosition);

                            m4fToLightSpace = pShadowCaster.getViewMatrix().multiply(pCamera.getWorldMatrix(), Mat4.temp());
                            pUniforms.textures.push(pProjectLight.getDepthTexture());
                            sTexture = "TEXTURE" + (pUniforms.textures.length - 1);

                            pUniformData.setSampler(sTexture);
                            pUniforms.samplersProject.push(pUniformData.SHADOW_SAMPLER);
                            pUniformData.setMatrix(m4fToLightSpace, pShadowCaster.getProjectionMatrix(), pShadowCaster.getOptimizedProjection());
                            pUniforms.projectShadows.push(pUniformData);
                        } else {
                            pUniformData = akra.render.UniformProject.temp();
                            pUniformData.setLightData(pLight.getParams(), v3fLightTransformPosition);
                            m4fShadow = pShadowCaster.getProjViewMatrix().multiply(pCamera.getWorldMatrix(), Mat4.temp());
                            pUniformData.setMatrix(m4fShadow);
                            pUniforms.project.push(pUniformData);
                        }
                    } else if (pLight.getLightType() === 3 /* SUN */) {
                        pSunLight = pLight;
                        pShadowCaster = pSunLight.getShadowCaster();

                        if (pLight.isShadowCaster()) {
                            pUniformData = akra.render.UniformSunShadow.temp();
                            var pSkyDome = pSunLight.getSkyDome();
                            var iSkyDomeId = pEngine.getComposer()._calcRenderID(pSkyDome, pSkyDome.getRenderable(0), false);
                            pUniformData.setLightData(pLight.getParams(), iSkyDomeId);
                            pUniforms.sunShadows.push(pUniformData);

                            pUniforms.textures.push(pSunLight.getDepthTexture());
                            sTexture = "TEXTURE" + (pUniforms.textures.length - 1);

                            pUniformData.setSampler(sTexture);
                            pUniforms.samplersSun.push(pUniformData.SHADOW_SAMPLER);

                            m4fToLightSpace = pShadowCaster.getViewMatrix().multiply(pCamera.getWorldMatrix(), Mat4.temp());
                            pUniformData.setMatrix(m4fToLightSpace, pShadowCaster.getOptimizedProjection());
                        } else {
                            pUniformData = akra.render.UniformSun.temp();
                            var pSkyDome = pSunLight.getSkyDome();
                            var iSkyDomeId = pEngine.getComposer()._calcRenderID(pSkyDome, pSkyDome.getRenderable(0), false);
                            pUniformData.setLightData(pLight.getParams(), iSkyDomeId);
                            pUniforms.sun.push(pUniformData);
                        }
                    } else {
                        akra.logger.critical("Invalid light point type detected.");
                    }
                }
            };

            DSViewport.prototype.resetUniforms = function () {
                var pUniforms = this._pLightingUnifoms;
                pUniforms.omni.clear();
                pUniforms.project.clear();
                pUniforms.sun.clear();
                pUniforms.omniShadows.clear();
                pUniforms.projectShadows.clear();
                pUniforms.sunShadows.clear();
                pUniforms.textures.clear();
                pUniforms.samplersProject.clear();
                pUniforms.samplersOmni.clear();
                pUniforms.samplersSun.clear();
            };
            return DSViewport;
        })(akra.render.Viewport);
        render.DSViewport = DSViewport;
    })(akra.render || (akra.render = {}));
    var render = akra.render;
})(akra || (akra = {}));
//# sourceMappingURL=DSViewport.js.map
