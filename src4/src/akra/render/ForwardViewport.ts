/// <reference path="../idl/IForwardViewport.ts" />
/// <reference path="Viewport.ts" />
/// <reference path="Viewport3D.ts" />
/// <reference path="ShadedViewport.ts" />
/// <reference path="../scene/Scene3d.ts" />
/// <reference path="LightingUniforms.ts" />

module akra.render {
	import Vec2 = math.Vec2;
	import Vec3 = math.Vec3;
	import Vec4 = math.Vec4;
	import Mat4 = math.Mat4;

	import Color = color.Color;

	var pDepthPixel: IPixelBox = new pixelUtil.PixelBox(new geometry.Box(0, 0, 1, 1), EPixelFormats.FLOAT32_DEPTH, new Uint8Array(4 * 1));
	var pFloatColorPixel: IPixelBox = new pixelUtil.PixelBox(new geometry.Box(0, 0, 1, 1), EPixelFormats.FLOAT32_RGBA, new Uint8Array(4 * 4));
	var pColor: IColor = new Color(0);

	interface ITransparencyObjectInfo {
		distance: float;
		renderable: IRenderableObject;
		sceneObject: ISceneObject;
	};

	export class ForwardViewport extends ShadedViewport implements IForwardViewport {
		addedSkybox: ISignal<{ (pViewport: IViewport, pSkyTexture: ITexture): void; }>;

		/** Buffer with objectID */
		private _pTextureWithObjectID: ITexture = null;
		/** Texture with result of rendereingd(for global posteffects) */
		private _pResultTexture: ITexture = null;

		private _pViewScreen: IRenderableObject = null;
		private _v2fTextureRatio: IVec2 = null;
		private _v2fScreenSize: IVec2 = null;

		private _pSkyboxTexture: ITexture = null;


		private _pTextureToScreenViewport: IViewport = null;
		private _bRenderOnlyTransparentObjects: boolean = false;

		private _pSkybox: IRenderableObject = null;
		private _isFogEnabled: boolean = false;

		constructor(pCamera: ICamera, fLeft: float = 0., fTop: float = 0., fWidth: float = 1., fHeight: float = 1., iZIndex: int = 0) {
			super(pCamera, null, fLeft, fTop, fWidth, fHeight, iZIndex);
		}

		protected setupSignals(): void {
			this.addedSkybox = this.addedSkybox || new Signal(this);

			super.setupSignals();
		}
		
		getType(): EViewportTypes {
			return EViewportTypes.FORWARDVIEWPORT;
		} 

		getView(): IRenderableObject {
			return this._pViewScreen;
		}

		getEffect(): IEffect {
			return this.getView().getRenderMethodDefault().getEffect();
		}

		getSkybox(): ITexture {
			return this._pSkyboxTexture;
		}

		getTextureWithObjectID(): ITexture {
			return this._pTextureWithObjectID;
		}

		_renderOnlyTransparentObjects(bValue: boolean): void {
			this._bRenderOnlyTransparentObjects = bValue;

			if (bValue && !this.isTransparencySupported()) {
				this.setTransparencySupported(true);
			}
		}

		_getTransparencyViewport(): IShadedViewport {
			return this.isTransparencySupported() ? this : null;
		}

		_setTarget(pTarget: IRenderTarget): void {
			super._setTarget(pTarget);

			//common api access
			var pEngine: IEngine = pTarget.getRenderer().getEngine();
			var pResMgr: IResourcePoolManager = pEngine.getResourceManager();

			//renderable for displaying result from deferred textures
			this._pViewScreen = new Screen(pEngine.getRenderer());

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

			//this.createNormalBufferRenderTarget(iWidth, iHeight);
			//this.createLightBuffersRenderTargets(iWidth, iHeight);
			this.createResultRenderTarget(iWidth, iHeight);

			this._v2fTextureRatio = new math.Vec2(this.getActualWidth() / this._pResultTexture.getWidth(), this.getActualHeight() / this._pResultTexture.getHeight());
			this._v2fScreenSize = new Vec2(this.getActualWidth(), this.getActualHeight());

			this.prepareRenderMethods();

			this.setClearEveryFrame(true, EFrameBufferTypes.COLOR | EFrameBufferTypes.DEPTH);
			this.setBackgroundColor(color.ZERO);
			this.setDepthParams(true, true, ECompareFunction.LESS);

			this.setFXAA(true);

			this._pTextureToScreenViewport = pTarget.addViewport(new Viewport(this.getCamera(), null, this.getLeft(), this.getTop(), this.getWidth(), this.getHeight(), 66));
			this._pTextureToScreenViewport.setAutoUpdated(false);
			this._pTextureToScreenViewport.setClearEveryFrame(true, EFrameBufferTypes.COLOR);
			this._pTextureToScreenViewport.setDepthParams(false, false, 0);

			this._pTextureToScreenViewport.render.connect(this, this._onScreenRender);
		}

		_getRenderId(x: int, y: int): int {
			return 0;
		}

		_updateDimensions(bEmitEvent: boolean = true): void {
			super._updateDimensions(false);

			if (isDefAndNotNull(this._pResultTexture)) {
				this.updateRenderTextureDimensions(this._pResultTexture);

				this._v2fTextureRatio.set(this.getActualWidth() / this._pResultTexture.getWidth(), this.getActualHeight() / this._pResultTexture.getHeight());
				this._v2fScreenSize.set(this.getActualWidth(), this.getActualHeight());
			}

			if (bEmitEvent) {
				this.viewportDimensionsChanged.emit();
			}
		}

		_updateImpl(): void {
			var pRenderer: IRenderer = this.getTarget().getRenderer();

			this.prepareForForwardShading();
			this._pCamera._keepLastViewport(this);

			if (this._pSkybox) {
				this._pSkybox.render(this, ".skybox-render", null);
				this.getTarget().getRenderer().executeQueue(true);
			}

			//render light map
			var pLights: IObjectArray<ILightPoint> = <IObjectArray<any>>this.getCamera().display(scene.Scene3d.DL_LIGHTING);

			if (this.isShadowEnabled() && !this._isManualUpdateForLightUniforms()) {
				for (var i: int = 0; i < pLights.getLength(); i++) {
					pLights.value(i)._calculateShadows();
				}
			}

			this._pLightPoints = pLights;
			this.createLightingUniforms(this.getCamera(), this._pLightPoints, this._pLightingUnifoms);
			this._pCamera._keepLastViewport(this);

			if (!this._bRenderOnlyTransparentObjects) {
				this.renderAsNormal(this._csDefaultRenderMethod + "forwardShading", this.getCamera());
				this.getTarget().getRenderer().executeQueue(true);
			}

			if (this.isTransparencySupported()) {
				this.renderTransparentObjects(this._csDefaultRenderMethod + "forwardShading", this.getCamera());
				this.getTarget().getRenderer().executeQueue(false);
			}

			//var pRenderer: IRenderer = this._pTarget.getRenderer();
			//var pCurrentViewport: IViewport = pRenderer._getViewport();
			//pRenderer._setViewport(this);
			//(<webgl.WebGLTextureBuffer>this._pResultTexture.getBuffer())._copyFromFramebuffer(0);
			//pRenderer._setViewport(pCurrentViewport);

			//this._pViewScreen.render(this._pTextureToScreenViewport);
			//this.getTarget().getRenderer().executeQueue(false);

			//TODO: use copyTexSubImage2D, for render global postEffects
			//this.renderAsNormal("apply_lpp_shading", this.getCamera());
		}
			
		protected renderAsNormal(csMethod: string, pCamera: ICamera): void {
			var pVisibleObjects: IObjectArray<ISceneObject> = pCamera.display();
			var pRenderable: IRenderableObject;

			for (var i: int = 0; i < pVisibleObjects.getLength(); ++i) {
				pVisibleObjects.value(i).prepareForRender(this);
			}

			for (var i: int = 0; i < pVisibleObjects.getLength(); ++i) {
				var pSceneObject: ISceneObject = pVisibleObjects.value(i);

				for (var j: int = 0; j < pSceneObject.getTotalRenderable(); j++) {
					pRenderable = pSceneObject.getRenderable(j);

					if (!isNull(pRenderable) &&
						pRenderable.getRenderMethodByName(csMethod) &&
						!(this.isTransparencySupported() &&
						pRenderable.getRenderMethodByName(csMethod).getMaterial().isTransparent())) {
						pRenderable.render(this, csMethod, pSceneObject);
					}
				}
			}
		}

		
		private _fnSort = function (a, b) { return b.dist - a.dist; };

		protected renderTransparentObjects(csMethod: string, pCamera: ICamera): void {
			if (!this.isTransparencySupported() && this._iNumOfTransparencyObjects === 0) {
				return;
			}

			var pVisibleObjects: IObjectArray<ISceneObject> = pCamera.display();
			var pRenderable: IRenderableObject;

			this.resetTransparencyObjectsQueue();

			var v3fMidPoint: IVec3 = Vec3.temp();
			var v4fMidPoint: IVec4 = math.Vec4.temp(v3fMidPoint, 1.);

			for (var i: int = 0; i < pVisibleObjects.getLength(); ++i) {
				var pSceneObject: ISceneObject = pVisibleObjects.value(i);

				for (var j: int = 0; j < pSceneObject.getTotalRenderable(); j++) {
					pRenderable = pSceneObject.getRenderable(j);

					if (!isNull(pRenderable) &&
						pRenderable.getRenderMethodByName(csMethod) &&
						pRenderable.getRenderMethodByName(csMethod).getMaterial().isTransparent()) {

						//pRenderable.render(this, csMethod, pSceneObject);

						var pSubMesh: IMeshSubset = <IMeshSubset>pRenderable;
						pSubMesh.getBoundingBox().midPoint(v3fMidPoint);
						v4fMidPoint.set(v3fMidPoint, 1.);

						pSceneObject.getWorldMatrix().multiplyVec4(v4fMidPoint);
						pCamera.getProjViewMatrix().multiplyVec4(v4fMidPoint);

						this.pushTransparencyObjectInQueue(v4fMidPoint.z / v4fMidPoint.w, pRenderable, pSceneObject);
					}
				}
			}
			
			this.sortTransparencyObjectsQueue();
			this.renderTransparencyObjectsQueue(csMethod, pCamera);
		}


		endFrame(): void {
			this.getTarget().getRenderer().executeQueue(true);
		}

		setSkybox(pSkyTexture: ITexture): boolean {
			if (pSkyTexture.getTextureType() !== ETextureTypes.TEXTURE_CUBE_MAP) {
				return null;
			}

			this._pSkyboxTexture = pSkyTexture;

			this.addedSkybox.emit(pSkyTexture);

			return true;
		}

		setSkyboxModel(pRenderable: IRenderableObject): void {
			this._pSkybox = pRenderable;
			pRenderable.addRenderMethod(".skybox-render", ".skybox-render");
			pRenderable.getRenderMethodByName(".skybox-render").getEffect().addComponent("akra.system.skybox_model");
			pRenderable.getRenderMethodByName(".skybox-render").getEffect().addComponent("akra.system.fogForForward");
			var pMat: IMat4 = new Mat4();
			pMat.identity();

			pRenderable.getTechnique(".skybox-render").render.connect(
				(pTech: IRenderTechnique, iPass: int, pRenderable: IRenderableObject, pSceneObject: ISceneObject, pViewport: IViewport) => {
					pMat.set(pViewport.getCamera().getFarPlane(), pViewport.getCamera().getFarPlane(), pViewport.getCamera().getFarPlane(), 1.);

					pTech.getPass(iPass).setTexture("SKYBOX_TEXTURE", (<IViewportSkybox>pViewport).getSkybox());
					pTech.getPass(iPass).setUniform("MODEL_MATRIX", pMat);
			});
		}

		setFXAA(bValue: boolean = true): void {
			var pEffect: IEffect = this.getEffect();

			if (bValue) {
				pEffect.addComponent("akra.system.fxaa", 2, 0);
			}
			else {
				pEffect.delComponent("akra.system.fxaa", 2, 0);
			}
		}

		isFXAA(): boolean {
			return this.getEffect().hasComponent("akra.system.fxaa");
		}

		setAntialiasing(bEnabled: boolean = true): void {
			this.setFXAA(true);
		}

		isAntialiased(): boolean {
			return this.isFXAA();
		}

		highlight(a): void {
		}

		setFog(bEnabled: boolean = true): void {
			this._isFogEnabled = bEnabled;
		}

		isFogged(): boolean {
			return this._isFogEnabled;
		}

		_onScreenRender(pViewport: IViewport, pTechnique: IRenderTechnique, iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void {
			var pPass: IRenderPass = pTechnique.getPass(iPass);

			switch (iPass) {
				case 0:
					pPass.setUniform("VIEWPORT", math.Vec4.temp(0., 0., this._v2fTextureRatio.x, this._v2fTextureRatio.y));
					pPass.setTexture("TEXTURE_FOR_SCREEN", this._pResultTexture);
					pPass.setForeign("SAVE_ALPHA", true);
					break;
			}
		}

		_onRender(pTechnique: IRenderTechnique, iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void {
			var pPass: IRenderPass = pTechnique.getPass(iPass);

			var pLightUniforms: UniformMap = this._pLightingUnifoms;
			var pLightPoints: IObjectArray<ILightPoint> = this._pLightPoints;
			var pCamera: ICamera = this.getCamera();

			//if (pRenderable["transparency"]) {
			//	pPass.setRenderState
			//}

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
			//	pPass.setTexture("SHADOW_TEXTURE" + i, pLightUniforms.textures[i]);
			//}

			pPass.setUniform("PROJECT_SHADOW_SAMPLER", pLightUniforms.samplersProject);
			pPass.setUniform("OMNI_SHADOW_SAMPLER", pLightUniforms.samplersOmni);
			pPass.setUniform("SUN_SHADOW_SAMPLER", pLightUniforms.samplersSun);

			pPass.setUniform("MIN_SHADOW_VALUE", 0.5);
			pPass.setUniform("SHADOW_CONSTANT", 5.e+2);

			//pPass.setUniform("SCREEN_TEXTURE_RATIO", this._v2fTextureRatio);

			pPass.setForeign("IS_USED_PNONG", this.getShadingModel() === EShadingModel.PHONG);
			pPass.setForeign("IS_USED_BLINN_PNONG", this.getShadingModel() === EShadingModel.BLINNPHONG);
			pPass.setForeign("IS_USED_PBS_SIMPLE", this.getShadingModel() === EShadingModel.PBS_SIMPLE);
			pPass.setForeign("SKIP_ALPHA", false);

			if (isDefAndNotNull(this.getDefaultEnvironmentMap())) {
				pPass.setForeign("IS_USED_PBS_REFLECTIONS", true);
				pPass.setTexture("ENVMAP", this.getDefaultEnvironmentMap());
			}
			else {
				pPass.setForeign("IS_USED_PBS_REFLECTIONS", false);
			}

			pPass.setForeign("IS_FOG_ENABLED", this._isFogEnabled)
		}

		private prepareForForwardShading(): void {
			var pNodeList: IObjectArray<ISceneObject> = this.getCamera().display();

			for (var i: int = 0; i < pNodeList.getLength(); ++i) {
				var pSceneObject: ISceneObject = pNodeList.value(i);

				for (var k: int = 0; k < pSceneObject.getTotalRenderable(); k++) {
					var pRenderable: IRenderableObject = pSceneObject.getRenderable(k);
					var pTechCurr: IRenderTechnique = pRenderable.getTechnique(this._csDefaultRenderMethod);

					var sMethod: string = this._csDefaultRenderMethod + "forwardShading";
					var pTechnique: IRenderTechnique = null;

					if (isNull(pRenderable.getTechnique(sMethod))) {
						if (!pRenderable.addRenderMethod(pRenderable.getRenderMethodByName(this._csDefaultRenderMethod), sMethod)) {
							logger.critical("cannot create render method for ForwardShading");
						}

						pTechnique = pRenderable.getTechnique(sMethod);
						pTechnique.render._syncSignal(pTechCurr.render);
						pTechnique.copyTechniqueOwnComponentBlend(pTechCurr);

						pTechnique.addComponent("akra.system.applyForwardShading");
						pTechnique.addComponent("akra.system.omniLighting");
						pTechnique.addComponent("akra.system.omniLightingRestricted");
						pTechnique.addComponent("akra.system.projectLighting");
						pTechnique.addComponent("akra.system.omniShadowsLighting");
						pTechnique.addComponent("akra.system.projectShadowsLighting");
						pTechnique.addComponent("akra.system.sunLighting");
						pTechnique.addComponent("akra.system.sunShadowsLighting");
						pTechnique.addComponent("akra.system.pbsReflection");
						//pTechnique.addComponent("akra.system.forceSetAlpha");
						pTechnique.addComponent("akra.system.applyAlpha");
						pTechnique.addComponent("akra.system.fogForForward");
					}
				}
			}
		}

		private updateRenderTextureDimensions(pTexture: ITexture) {
			pTexture.reset(math.ceilingPowerOfTwo(this.getActualWidth()), math.ceilingPowerOfTwo(this.getActualHeight()));
			pTexture.getBuffer().getRenderTarget().getViewport(0).setDimensions(0., 0., this.getActualWidth() / pTexture.getWidth(), this.getActualHeight() / pTexture.getHeight());
		}

		private prepareRenderMethods(): void {
			this._pViewScreen.switchRenderMethod(null);
			this._pViewScreen.getEffect().addComponent("akra.system.texture_to_screen");
		}

		private createResultRenderTarget(iWidth: uint, iHeight: uint): void {
			var pEngine: IEngine = this._pTarget.getRenderer().getEngine();
			var pResMgr: IResourcePoolManager = pEngine.getResourceManager();

			var pRenderTarget: IRenderTarget = null;
			var pViewport: IViewport = null;

			this._pResultTexture = pResMgr.createTexture("resultr-forward-texture-" + this.guid);
			this._pResultTexture.create(iWidth, iHeight, 1, null, ETextureFlags.RENDERTARGET, 0, 0,
				ETextureTypes.TEXTURE_2D, EPixelFormats.R8G8B8A8);
			pRenderTarget = this._pResultTexture.getBuffer().getRenderTarget();
			pRenderTarget.setAutoUpdated(false);

			pViewport = pRenderTarget.addViewport(new Viewport(this.getCamera(), null,
				0, 0, this.getActualWidth() / this._pResultTexture.getWidth(), this.getActualHeight() / this._pResultTexture.getHeight()));
			pViewport.setClearEveryFrame(true, EFrameBufferTypes.COLOR);
			pViewport.setDepthParams(false, false, ECompareFunction.EQUAL);
		}

		protected initTextureForTransparentObjects(): void {
		}

		private _pTransparencyObjectList: ITransparencyObjectInfo[] = [];
		private _iNumOfTransparencyObjects: uint = 0;

		private resetTransparencyObjectsQueue(): void {
			this._iNumOfTransparencyObjects = 0;
		}

		private pushTransparencyObjectInQueue(fDistance: float, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void {
			var pInfo: ITransparencyObjectInfo = null;

			if (this._iNumOfTransparencyObjects === this._pTransparencyObjectList.length) {
				pInfo = this._pTransparencyObjectList[this._iNumOfTransparencyObjects] = {
					distance: fDistance,
					renderable: pRenderable,
					sceneObject: pSceneObject
				};
			}
			else {
				pInfo = this._pTransparencyObjectList[this._iNumOfTransparencyObjects];
				pInfo.distance = fDistance;
				pInfo.renderable = pRenderable;
				pInfo.sceneObject = pSceneObject;
			}

			this._iNumOfTransparencyObjects++;
		}

		private sortTransparencyObjectsQueue(iStart: uint = 0, iEnd: uint = (this._iNumOfTransparencyObjects - 1)): void {
			if (iEnd === -1) {
				return;
			}
			var i: uint = iStart;
			var j: uint = iEnd;
			var fMiddle: float = this._pTransparencyObjectList[(iStart + iEnd) >> 1].distance;

			do {
				while (this._pTransparencyObjectList[i].distance > fMiddle)++i;
				while (this._pTransparencyObjectList[j].distance < fMiddle)--j;

				if (i <= j) {
					var pTemp: any = this._pTransparencyObjectList[i];
					this._pTransparencyObjectList[i] = this._pTransparencyObjectList[j];
					this._pTransparencyObjectList[j] = pTemp;
					i++; j--;
				}
			}
			while (i < j);

			if (iStart < j) this.sortTransparencyObjectsQueue(iStart, j);
			if (i < iEnd) this.sortTransparencyObjectsQueue(i, iEnd);
		}

		private renderTransparencyObjectsQueue(csMethod: string, pCamera: ICamera): void {
			for (var i: uint = 0; i < this._iNumOfTransparencyObjects; i++) {
				this._pTransparencyObjectList[i].renderable.render(this, csMethod, this._pTransparencyObjectList[i].sceneObject);
			}
		}
	}
}