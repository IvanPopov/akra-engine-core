/// <reference path="../idl/IDSViewport.ts" />
/// <reference path="../idl/IScene3d.ts" />
/// <reference path="../idl/IRenderTechnique.ts" />
/// <reference path="../idl/IRenderPass.ts" />
/// <reference path="../idl/ILightPoint.ts" />
/// <reference path="../idl/IOmniLight.ts" />
/// <reference path="../idl/IProjectLight.ts" />
/// <reference path="../idl/IShadowCaster.ts" />
/// <reference path="../idl/IEffect.ts" />

/// <reference path="Viewport.ts" />
/// <reference path="ViewportWithTransparencyMode.ts" />
/// <reference path="ShadedViewport.ts" />
/// <reference path="LightingUniforms.ts" />
/// <reference path="RenderableObject.ts" />
/// <reference path="Screen.ts" />

/// <reference path="../info/info.ts" />
/// <reference path="../util/ObjectArray.ts" />
/// <reference path="../webgl/DepthRange.ts" />
/// <reference path="../color/Color.ts" />
/// <reference path="../scene/Scene3d.ts" />

module akra.render {

	import Vec2 = math.Vec2;
	import Vec3 = math.Vec3;
	import Vec4 = math.Vec4;
	import Mat4 = math.Mat4;

	import Color = color.Color;
	import Scene3d = scene.Scene3d;

	var pDepthPixel: IPixelBox = new pixelUtil.PixelBox(new geometry.Box(0, 0, 1, 1), EPixelFormats.FLOAT32_DEPTH, new Uint8Array(4 * 1));
	var pFloatColorPixel: IPixelBox = new pixelUtil.PixelBox(new geometry.Box(0, 0, 1, 1), EPixelFormats.FLOAT32_RGBA, new Uint8Array(4 * 4));
	var pColor: IColor = new Color(0);	

	export class DSViewport extends ShadedViewport implements IDSViewport {
		addedSkybox: ISignal<{ (pViewport: IViewport, pSkyTexture: ITexture): void; }>;
		addedBackground: ISignal<{ (pViewport: IViewport, pTexture: ITexture): void; }>;

		private _pDeferredEffect: IEffect = null;
		private _pDeferredColorTextures: ITexture[] = [];
		private _pDeferredView: IRenderableObject = null;
		private _pDeferredSkyTexture: ITexture = null;

		//index of lighting display list
		private _pLightDL: int;

		//highligting
		private _pHighlightedObject: IRIDPair = { object: null, renderable: null };

		constructor(pCamera: ICamera, fLeft: float = 0., fTop: float = 0., fWidth: float = 1., fHeight: float = 1., iZIndex: int = 0) {
			super(pCamera, null, fLeft, fTop, fWidth, fHeight, iZIndex);
		}

		protected setupSignals(): void {
			this.addedSkybox = this.addedSkybox || new Signal(this);
			this.addedBackground = this.addedBackground || new Signal(this);

			super.setupSignals();
		}

		getType(): EViewportTypes {
			return EViewportTypes.DSVIEWPORT;
		}

		getEffect(): IEffect {
			return this._pDeferredEffect;
		}

		getColorTextures(): ITexture[] {
			return this._pDeferredColorTextures;
		}

		getView(): IRenderableObject {
			return this._pDeferredView;
		}

		getTextureWithObjectID(): ITexture {
			return this._pDeferredColorTextures[0];
		}

		setShadingModel(eModel: EShadingModel) {
			super.setShadingModel(eModel);

			if (isDefAndNotNull(this._pTextureForTransparentObjects)) {
				(<IShadedViewport>this._pTextureForTransparentObjects.getBuffer().getRenderTarget().getViewport(0)).setShadingModel(eModel);
			}
		}

		setDefaultEnvironmentMap(pEnvMap: ITexture): void {
			super.setDefaultEnvironmentMap(pEnvMap);

			if (isDefAndNotNull(this._pTextureForTransparentObjects)) {
				(<IShadedViewport>this._pTextureForTransparentObjects.getBuffer().getRenderTarget().getViewport(0)).setDefaultEnvironmentMap(pEnvMap);
			}
		}

		setTransparencySupported(bEnable: boolean): void {
			super.setTransparencySupported(bEnable);

			if (isDefAndNotNull(this._pDeferredColorTextures)) {
				for (var i: uint = 0; i < this._pDeferredColorTextures.length; i++) {
					(<ViewportWithTransparencyMode>this._pDeferredColorTextures[i].getBuffer().getRenderTarget().getViewport(0)).setTransparencyMode(!bEnable);
				}
			}

			if (bEnable && isNull(this._pTextureForTransparentObjects)) {
				this.initTextureForTransparentObjects();
			}

			(<IViewportFogged>this._pTextureForTransparentObjects.getBuffer().getRenderTarget().getViewport(0)).setFog(this.isFogged());

			if (bEnable) {
				this.getEffect().addComponent("akra.system.applyTransparency", 3, 0);
			}
			else {
				this.getEffect().addComponent("akra.system.applyTransparency", 3, 0);
			}

		}

		_getTransparencyViewport(): IShadedViewport {
			return this.isTransparencySupported() ? <IShadedViewport>this._pTextureForTransparentObjects.getBuffer().getRenderTarget().getViewport(0) : null;
		}

		_setTarget(pTarget: IRenderTarget): void {
			super._setTarget(pTarget);

			//common api access
			var pEngine: IEngine = pTarget.getRenderer().getEngine();
			var pResMgr: IResourcePoolManager = pEngine.getResourceManager();

			//textures for deferred shading
			var pDeferredData: IRenderTarget[] = <IRenderTarget[]>new Array(2);
			var pDeferredTextures: ITexture[] = <ITexture[]>new Array(2);
			var pDepthTexture: ITexture;

			//renderable for displaying result from deferred textures
			var pDefferedView: IRenderableObject = new Screen(pEngine.getRenderer());

			//unique idetifier for creation dependent resources
			var iGuid: int = this.guid;

			//Float point texture must be power of two.
			var iWidth: uint = math.ceilingPowerOfTwo(this.getActualWidth());
			var iHeight: uint = math.ceilingPowerOfTwo(this.getActualHeight());

			//detect max texture resolution correctly
			if (config.WEBGL) {
				iWidth = math.min(iWidth, webgl.maxTextureSize);
				iHeight = math.min(iHeight, webgl.maxTextureSize);
			}

			//creating depth
			pDepthTexture = pResMgr.createTexture("deferred-depth-texture-" + iGuid);
			pDepthTexture.create(iWidth, iHeight, 1, null, 0, 0, 0, ETextureTypes.TEXTURE_2D, EPixelFormats.DEPTH32);
			pDepthTexture.setFilter(ETextureParameters.MAG_FILTER, ETextureFilters.LINEAR);
			pDepthTexture.setFilter(ETextureParameters.MIN_FILTER, ETextureFilters.LINEAR);

			this.setDepthTexture(pDepthTexture);

			var pViewport: IViewport;

			//creating float textures
			for (var i = 0; i < 2; ++i) {
				pDeferredTextures[i] = this._pDeferredColorTextures[i] =
				pResMgr.createTexture("deferred-color-texture-" + i + "-" + iGuid);

				pDeferredTextures[i].create(iWidth, iHeight, 1, null, ETextureFlags.RENDERTARGET, 0, 0,
					ETextureTypes.TEXTURE_2D, EPixelFormats.FLOAT32_RGBA);

				pDeferredData[i] = pDeferredTextures[i].getBuffer().getRenderTarget();
				pDeferredData[i].setAutoUpdated(false);
				pViewport = pDeferredData[i].addViewport(new ViewportWithTransparencyMode(this.getCamera(), this._csDefaultRenderMethod + "deferred_shading_pass_" + i,
					0, 0, this.getActualWidth() / pDeferredTextures[i].getWidth(), this.getActualHeight() / pDeferredTextures[i].getHeight()));
				pDeferredData[i].attachDepthTexture(pDepthTexture);

				if (i === 1) {
					pViewport.setDepthParams(true, false, ECompareFunction.EQUAL);
					pViewport.setClearEveryFrame(true, EFrameBufferTypes.COLOR);
				}
			}

			//creatin deferred effects
			var pDSMethod: IRenderMethod = null;
			var pDSEffect: IEffect = null;

			pDSMethod = pResMgr.createRenderMethod(".deferred_shading" + iGuid);
			pDSEffect = pResMgr.createEffect(".deferred_shading" + iGuid);

			pDSEffect.addComponent("akra.system.deferredShading");
			pDSEffect.addComponent("akra.system.omniLighting");
			pDSEffect.addComponent("akra.system.omniLightingRestricted");
			pDSEffect.addComponent("akra.system.projectLighting");
			pDSEffect.addComponent("akra.system.omniShadowsLighting");
			pDSEffect.addComponent("akra.system.projectShadowsLighting");
			pDSEffect.addComponent("akra.system.sunLighting");
			pDSEffect.addComponent("akra.system.sunShadowsLighting");
			pDSEffect.addComponent("akra.system.pbsSkyboxLighting");
			pDSEffect.addComponent("akra.system.pbsReflection");

			pDSMethod.setEffect(pDSEffect);

			this._pDeferredEffect = pDSEffect;
			this._pDeferredView = pDefferedView;

			pDefferedView.getTechnique().setMethod(pDSMethod);

			this.setClearEveryFrame(false);
			this.setDepthParams(false, false, 0);

			//AA is default
			this.setFXAA(true);

			this.setTransparencySupported(this.isTransparencySupported());
		}

		setCamera(pCamera: ICamera): boolean {
			var isOk = super.setCamera(pCamera);
			this._pDeferredColorTextures[0].getBuffer().getRenderTarget().getViewport(0).setCamera(pCamera);
			this._pDeferredColorTextures[1].getBuffer().getRenderTarget().getViewport(0).setCamera(pCamera);
			return isOk;
		}

		_updateDimensions(bEmitEvent: boolean = true): void {
			super._updateDimensions(false);

			var pDeferredTextures: ITexture[] = this._pDeferredColorTextures;

			if (isDefAndNotNull(this.getDepthTexture())) {
				this.getDepthTexture().reset(math.ceilingPowerOfTwo(this.getActualWidth()), math.ceilingPowerOfTwo(this.getActualHeight()));
				for (var i = 0; i < 2; ++i) {
					pDeferredTextures[i].reset(math.ceilingPowerOfTwo(this.getActualWidth()), math.ceilingPowerOfTwo(this.getActualHeight()));
					pDeferredTextures[i].getBuffer().getRenderTarget().getViewport(0)
						.setDimensions(0., 0., this.getActualWidth() / pDeferredTextures[i].getWidth(), this.getActualHeight() / pDeferredTextures[i].getHeight())
				}
			}

			if (isDefAndNotNull(this._pTextureForTransparentObjects)) {
				this._pTextureForTransparentObjects.reset(math.ceilingPowerOfTwo(this.getActualWidth()), math.ceilingPowerOfTwo(this.getActualHeight()));

				this._pTextureForTransparentObjects.getBuffer().getRenderTarget().getViewport(0)
					.setDimensions(0., 0., this.getActualWidth() / this._pTextureForTransparentObjects.getWidth(), this.getActualHeight() / this._pTextureForTransparentObjects.getHeight());				
			}

			if (bEmitEvent) {
				this.viewportDimensionsChanged.emit();
			}
		}

		_updateImpl(): void {
			this.prepareForDeferredShading();

			//prepare deferred textures
			this._pDeferredColorTextures[0].getBuffer().getRenderTarget().update();
			this._pDeferredColorTextures[1].getBuffer().getRenderTarget().update();

			//camera last viewport changed, because camera used in deferred textures updating
			this._pCamera._keepLastViewport(this);

			//calculate lighting
			//TODO: Display techniques return sceneNodes, LightPoints and SceneObjects
			var pLights: IObjectArray<ILightPoint> = <IObjectArray<any>>this.getCamera().display(Scene3d.DL_LIGHTING);

			if (this.isShadowEnabled() && !this._isManualUpdateForLightUniforms()) {
				for (var i: int = 0; i < pLights.getLength(); i++) {
					pLights.value(i)._calculateShadows();
				}
			}

			this._pLightPoints = pLights;

			if (this.isTransparencySupported()) {
				this._pTextureForTransparentObjects.getBuffer().getRenderTarget().update();
			}

			//render deferred
			this._pDeferredView.render(this);
		}

		endFrame(): void {
			this.getTarget().getRenderer().executeQueue(false);
		}

		prepareForDeferredShading(): void {
			var pNodeList: IObjectArray<ISceneObject> = this.getCamera().display();

			for (var i: int = 0; i < pNodeList.getLength(); ++i) {
				var pSceneObject: ISceneObject = pNodeList.value(i);

				for (var k: int = 0; k < pSceneObject.getTotalRenderable(); k++) {
					var pRenderable: IRenderableObject = pSceneObject.getRenderable(k);
					var pTechCurr: IRenderTechnique = pRenderable.getTechnique(this._csDefaultRenderMethod);

					for (var j: int = 0; j < 2; j++) {
						var sMethod: string = this._csDefaultRenderMethod + "deferred_shading_pass_" + j;
						var pTechnique: IRenderTechnique = pRenderable.getTechnique(sMethod);

						if (isNull(pTechnique) || pTechCurr.getModified() > pTechnique.getModified()) {
							if (!pRenderable.addRenderMethod(pRenderable.getRenderMethodByName(this._csDefaultRenderMethod), sMethod)) {
								logger.critical("cannot clone active render method");
							}

							pTechnique = pRenderable.getTechnique(sMethod);
							//TODO: need something else
							pTechnique.render._syncSignal(pTechCurr.render);
							pTechnique.copyTechniqueOwnComponentBlend(pTechCurr);
							//pTechnique._syncTable(pTechCurr);

							var iTotalPasses = pTechnique.getTotalPasses();
							for (var k: uint = 0; k < iTotalPasses; k++) {
								var pPass: IRenderPass = pTechnique.getPass(k);
								pPass.blend("akra.system.prepareForDeferredShading", j);
							}

							pTechnique.updatePasses(false);
							
							for (var k: uint = 0; k < iTotalPasses; k++) {
								var pPass: IRenderPass = pTechnique.getPass(k);
								if (j === 0) {
									pPass.setForeign("OPTIMIZE_FOR_DEFERRED_PASS0", true);
								}
								else {
									pPass.setForeign("OPTIMIZE_FOR_DEFERRED_PASS1", true);
								}
							}
						}
					}
				}
			}
		}

		getSkybox(): ITexture { return this._pDeferredSkyTexture; }

		//protected _getDepthRangeImpl(): IDepthRange{
		//	var pRange: IDepthRange = config.WEBGL ? 
		//		webgl.getDepthRange(this._pDeferredDepthTexture):
		//		<IDepthRange>{min: 0., max: 1.};
		//	//[0,1] -> [-1, 1]
		//	pRange.min = pRange.min * 2. - 1.;
		//	pRange.max = pRange.max * 2. - 1.;

		//	return pRange;
		//}


		_getRenderId(x: int, y: int): int {
			return this._getDeferredTexValue(0, x, y).a;
		}

		_getDeferredTexValue(iTex: int, x: int, y: int): IColor {
			logger.assert(x < this.getActualWidth() && y < this.getActualHeight(),
				"invalid pixel: {" + x + "(" + this.getActualWidth() + ")" + ", " + y + "(" + this.getActualHeight() + ")" + "}");

			var pColorTexture: ITexture = this._pDeferredColorTextures[iTex];

			//depth texture has POT sized, but viewport not;
			//depth texture attached to left bottom angle of viewport
			y = pColorTexture.getHeight() - y - 1;
			pFloatColorPixel.left = x;
			pFloatColorPixel.top = y;
			pFloatColorPixel.right = x + 1;
			pFloatColorPixel.bottom = y + 1;

			pColorTexture.getBuffer(0, 0).readPixels(pFloatColorPixel);

			return pFloatColorPixel.getColorAt(pColor, 0, 0);
		}

		getDepth(x: int, y: int): float {
			logger.assert(x < this.getActualWidth() && y < this.getActualHeight(), "invalid pixel: {" + x + ", " + y + "}");

			var pDepthTexture: ITexture = this.getDepthTexture();

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
		}

		setSkybox(pSkyTexture: ITexture): boolean {
			if (pSkyTexture.getTextureType() !== ETextureTypes.TEXTURE_CUBE_MAP) {
				return null;
			}

			var pTechnique: IRenderTechnique = this._pDeferredView.getTechnique();
			var pEffect: IEffect = this._pDeferredEffect;

			if (pSkyTexture) {
				pEffect.addComponent("akra.system.skybox", 1, 0);
			}
			else {
				pEffect.delComponent("akra.system.skybox", 1, 0);
			}

			this._pDeferredSkyTexture = pSkyTexture;

			this.addedSkybox.emit(pSkyTexture);

			return true;
		}

		setFXAA(bValue: boolean = true): void {
			var pEffect: IEffect = this._pDeferredEffect;

			if (bValue) {
				pEffect.addComponent("akra.system.fxaa", 4, 0);
			}
			else {
				pEffect.delComponent("akra.system.fxaa", 4, 0);
			}
		}


		highlight(iRid: int): void;
		highlight(pObject: ISceneObject, pRenderable?: IRenderableObject): void;
		highlight(pPair: IRIDPair): void;
		highlight(a): void {
			var pComposer: IAFXComposer = this.getTarget().getRenderer().getEngine().getComposer();
			var pEffect: IEffect = this._pDeferredEffect;
			var iRid: int = 0;
			var p: IRIDPair = this._pHighlightedObject;
			var pObjectPrev: ISceneObject = p.object;

			if (isNull(arguments[0])) {
				p.object = null;
				p.renderable = null;
			}
			else if (isInt(arguments[0])) {
				iRid = a;
				p.object = pComposer._getObjectByRid(iRid);
				p.renderable = pComposer._getRenderableByRid(iRid);
			}
			else if (arguments[0] instanceof akra.scene.SceneObject) {
				p.object = arguments[0];
				p.renderable = arguments[1];
			}
			else {
				p.object = arguments[0].object;
				p.renderable = arguments[0].renderable;
			}

			if (p.object && isNull(pObjectPrev)) {
				pEffect.addComponent("akra.system.outline", 1, 0);
			}
			else if (isNull(p.object) && pObjectPrev) {
				pEffect.delComponent("akra.system.outline", 1, 0);

				//FIX ME: Need do understood how to know that skybox added like single effect, and not as imported component
				if (!isNull(this._pDeferredSkyTexture)) {
					pEffect.addComponent("akra.system.skybox", 1, 0);
				}
			}
		}

		isFXAA(): boolean {
			return this.getEffect().hasComponent("akra.system.fxaa");
		}

		isAntialiased(): boolean {
			return this.isFXAA();
		}

		setAntialiasing(bEnabled: boolean = true): void {
			this.setFXAA(bEnabled);
		}

		setFog(bEnabled: boolean = true): void {
			if (bEnabled) {
				this.getEffect().addComponent("akra.system.fog", 2, 0);
			}
			else {
				this.getEffect().delComponent("akra.system.fog", 2, 0);
			}

			if (this.isTransparencySupported()) {
				(<IViewportFogged>this._pTextureForTransparentObjects.getBuffer().getRenderTarget().getViewport(0)).setFog(bEnabled);
			}
		}

		isFogged(): boolean {
			return this.getEffect().hasComponent("akra.system.fog");
		}

		destroy(): void {
			super.destroy();

			this.getDepthTexture().destroyResource();

			this._pDeferredColorTextures[0].destroyResource();
			this._pDeferredColorTextures[1].destroyResource();

			this._pDeferredView.destroy();
			this._pDeferredView = null;

			this._pDeferredSkyTexture = null;
		}

		protected _onRender(pTechnique: IRenderTechnique, iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void {
			var pPass: IRenderPass = pTechnique.getPass(iPass);
			var pDepthTexture: ITexture = this.getDepthTexture();
			var pDeferredTextures: ITexture[] = this._pDeferredColorTextures;

			switch (iPass) {
				case 0:
					var pLightUniforms: UniformMap = this._pLightingUnifoms;
					var pLightPoints: IObjectArray<ILightPoint> = this._pLightPoints;
					var pCamera: ICamera = this.getCamera();

					this.createLightingUniforms(pCamera, pLightPoints, pLightUniforms);

					pPass.setForeign("NUM_OMNI", pLightUniforms.omni.length);
					pPass.setForeign("NUM_OMNI_SHADOWS", pLightUniforms.omniShadows.length);
					pPass.setForeign("NUM_PROJECT", pLightUniforms.project.length);
					pPass.setForeign("NUM_PROJECT_SHADOWS", pLightUniforms.projectShadows.length);
					pPass.setForeign("NUM_SUN", pLightUniforms.sun.length);
					pPass.setForeign("NUM_SUN_SHADOWS", pLightUniforms.sunShadows.length);

					pPass.setForeign("NUM_OMNI_RESTRICTED", pLightUniforms.omniRestricted.length);

					pPass.setStruct("points_omni", pLightUniforms.omni);
					pPass.setStruct("points_project", pLightUniforms.project);
					pPass.setStruct("points_omni_shadows", pLightUniforms.omniShadows);
					pPass.setStruct("points_project_shadows", pLightUniforms.projectShadows);
					pPass.setStruct("points_sun", pLightUniforms.sun);
					pPass.setStruct("points_sun_shadows", pLightUniforms.sunShadows);

					pPass.setStruct("points_omni_restricted", pLightUniforms.omniRestricted);


					//for (var i: int = 0; i < pLightUniforms.textures.length; i++) {
					//	pPass.setTexture("TEXTURE" + i, pLightUniforms.textures[i]);
					//}

					pPass.setUniform("PROJECT_SHADOW_SAMPLER", pLightUniforms.samplersProject);
					pPass.setUniform("OMNI_SHADOW_SAMPLER", pLightUniforms.samplersOmni);
					pPass.setUniform("SUN_SHADOW_SAMPLER", pLightUniforms.samplersSun);

					pPass.setUniform("MIN_SHADOW_VALUE", 0.5);
					pPass.setUniform("SHADOW_CONSTANT", 5.e+2);

					pPass.setUniform("SCREEN_TEXTURE_RATIO",
						Vec2.temp(this.getActualWidth() / pDepthTexture.getWidth(), this.getActualHeight() / pDepthTexture.getHeight()));

					pPass.setTexture("DEFERRED_TEXTURE0", pDeferredTextures[0]);
					pPass.setTexture("DEFERRED_TEXTURE1", pDeferredTextures[1]);
					pPass.setTexture("SCENE_DEPTH_TEXTURE", pDepthTexture);

					pPass.setForeign("IS_USED_PNONG", this.getShadingModel() === EShadingModel.PHONG);
					pPass.setForeign("IS_USED_BLINN_PNONG", this.getShadingModel() === EShadingModel.BLINNPHONG);
					pPass.setForeign("IS_USED_PBS_SIMPLE", this.getShadingModel() === EShadingModel.PBS_SIMPLE);

					if (isDefAndNotNull(this.getDefaultEnvironmentMap())) {
						pPass.setForeign("IS_USED_PBS_REFLECTIONS", true);
						pPass.setForeign("IS_USED_SKYBOX_LIGHTING", true);
						pPass.setTexture("ENVMAP", this.getDefaultEnvironmentMap());
					}
					else {
						pPass.setForeign("IS_USED_PBS_REFLECTIONS", false);
						pPass.setForeign("IS_USED_SKYBOX_LIGHTING", false);
					}

					break;

				case 1:
				case 2:
				case 3:
					//fog
					pPass.setTexture("DEPTH_TEXTURE", this.getDepthTexture());
					//transparency
					pPass.setTexture("TRANSPARENT_TEXTURE", this.isTransparencySupported() ? this._pTextureForTransparentObjects : null);
					//skybox
					pPass.setTexture("OBJECT_ID_TEXTURE", pDeferredTextures[0]);
					pPass.setTexture("SKYBOX_TEXTURE", this._pDeferredSkyTexture);

					pPass.setUniform("SCREEN_TEXTURE_RATIO",
						Vec2.temp(this.getActualWidth() / pDepthTexture.getWidth(), this.getActualHeight() / pDepthTexture.getHeight()));
					//outline
					var p: IRIDPair = this._pHighlightedObject;

					if (!isNull(p.object)) {
						var iRid: int = this.getTarget().getRenderer().getEngine().getComposer()._calcRenderID(p.object, p.renderable);

						pPass.setUniform("OUTLINE_TARGET", iRid);
						pPass.setUniform("OUTLINE_SOID", (iRid - 1) >>> 10);
						pPass.setUniform("OUTLINE_REID", (iRid - 1) & 1023);
					}

					pPass.setUniform("SCREEN_TEXTURE_RATIO",
						Vec2.temp(this.getActualWidth() / pDepthTexture.getWidth(), this.getActualHeight() / pDepthTexture.getHeight()));
					break;
				// case 2:
				// 	pPass.setTexture("DEFERRED_TEXTURE0", pDeferredTextures[0]);
				// 	pPass.setUniform("SCREEN_TEXTURE_RATIO",
				//                                  Vec2.temp(this.actualWidth / pDepthTexture.width, this.actualHeight / pDepthTexture.height));
				// break;
			}

			super._onRender(pTechnique, iPass, pRenderable, pSceneObject);
		}
	}
}


