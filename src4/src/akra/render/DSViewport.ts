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
/// <reference path="DSUniforms.ts" />
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

	export class DSViewport extends Viewport implements IDSViewport  {
		addedSkybox: ISignal<{ (pViewport: IViewport, pSkyTexture: ITexture): void; }>;
		addedBackground: ISignal<{ (pViewport: IViewport, pTexture: ITexture): void; }>;

		private _pDeferredEffect: IEffect = null;
		private _pDeferredColorTextures: ITexture[] = [];
		private _pDeferredDepthTexture: ITexture = null;
		private _pDeferredView: IRenderableObject = null;
		private _pDeferredSkyTexture: ITexture = null;

		//index of lighting display list
		private _pLightDL: int; 
		private _pLightPoints: IObjectArray<ILightPoint> = null;
		private _pLightingUnifoms: UniformMap = {
			omni           	: [],
			project        	: [],
			sun				: [],
			omniShadows    	: [],
			projectShadows 	: [],
			sunShadows 		: [],
			textures       	: [],
			samplersOmni  	: [],
			samplersProject : [],
			samplersSun		: []
		};

		//highligting
		private _pHighlightedObject: IRIDPair = {object: null, renderable: null};


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

		getLightSources() : IObjectArray<ILightPoint> {
			return this._pLightPoints;
		}

		getColorTextures() : ITexture[] {
			return this._pDeferredColorTextures;
		}

		getDepthTexture(): ITexture {
			return this._pDeferredDepthTexture;
		}

		getView(): IRenderableObject {
			return this._pDeferredView;
		}

		_setTarget(pTarget: IRenderTarget): void {
			super._setTarget(pTarget);

			//common api access
			var pEngine: IEngine 				= pTarget.getRenderer().getEngine();
			var pResMgr: IResourcePoolManager 	= pEngine.getResourceManager();

			//textures for deferred shading
			var pDeferredData: IRenderTarget[] 	= <IRenderTarget[]>new Array(2);
			var pDeferredTextures: ITexture[] 	= <ITexture[]>new Array(2);
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
			pDepthTexture = this._pDeferredDepthTexture = pResMgr.createTexture("deferred-depth-texture-" + iGuid);
			pDepthTexture.create(iWidth, iHeight, 1, null, 0, 0, 0, ETextureTypes.TEXTURE_2D, EPixelFormats.DEPTH32);
			pDepthTexture.setFilter(ETextureParameters.MAG_FILTER, ETextureFilters.LINEAR);
			pDepthTexture.setFilter(ETextureParameters.MIN_FILTER, ETextureFilters.LINEAR);

			var pViewport:  IViewport;

			//creating float textures
			for (var i = 0; i < 2; ++ i) {
				pDeferredTextures[i] = this._pDeferredColorTextures[i] = 
					pResMgr.createTexture("deferred-color-texture-" + i + "-" +  iGuid);

				pDeferredTextures[i].create(iWidth, iHeight, 1, null, ETextureFlags.RENDERTARGET, 0, 0, 
					ETextureTypes.TEXTURE_2D, EPixelFormats.FLOAT32_RGBA);

				pDeferredData[i] = pDeferredTextures[i].getBuffer().getRenderTarget();
				pDeferredData[i].setAutoUpdated(false);
				pViewport = pDeferredData[i].addViewport(new Viewport(this.getCamera(), "deferred_shading_pass_" + i, 
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

			if (isDefAndNotNull(this._pDeferredDepthTexture)) {
				this._pDeferredDepthTexture.reset(math.ceilingPowerOfTwo(this.getActualWidth()), math.ceilingPowerOfTwo(this.getActualHeight()));
				for (var i = 0; i < 2; ++ i) {
					pDeferredTextures[i].reset(math.ceilingPowerOfTwo(this.getActualWidth()), math.ceilingPowerOfTwo(this.getActualHeight()));
					pDeferredTextures[i].getBuffer().getRenderTarget().getViewport(0)
						.setDimensions(0., 0., this.getActualWidth() / pDeferredTextures[i].getWidth(), this.getActualHeight() / pDeferredTextures[i].getHeight())
				}
			}

			if (bEmitEvent) {
				this.viewportDimensionsChanged.emit();
			}
		}

		_updateImpl (): void {
			this.prepareForDeferredShading();

			//prepare deferred textures
			this._pDeferredColorTextures[0].getBuffer().getRenderTarget().update();
			this._pDeferredColorTextures[1].getBuffer().getRenderTarget().update();

			//camera last viewport changed, because camera used in deferred textures updating
			this._pCamera._keepLastViewport(this);

			//calculate lighting
			//TODO: Display techniques return sceneNodes, LightPoints and SceneObjects
			var pLights: IObjectArray<ILightPoint> = <IObjectArray<any>>this.getCamera().display(Scene3d.DL_LIGHTING);
			
			for (var i: int = 0; i < pLights.getLength(); i++) {
				pLights.value(i)._calculateShadows();
			}

			this._pLightPoints = pLights;

			//render deferred
			this._pDeferredView.render(this);
		}

		endFrame(): void {
			this.getTarget().getRenderer().executeQueue(false);
		}

		prepareForDeferredShading(): void {
			var pNodeList: IObjectArray<ISceneObject> = this.getCamera().display();

			for (var i: int = 0; i < pNodeList.getLength(); ++ i) {
				var pSceneObject: ISceneObject = pNodeList.value(i);

				for (var k: int = 0; k < pSceneObject.getTotalRenderable(); k++) {
					var pRenderable: IRenderableObject = pSceneObject.getRenderable(k);
					var pTechCurr: IRenderTechnique = pRenderable.getTechniqueDefault();

					for (var j: int = 0; j < 2; j++) {
						var sMethod: string = "deferred_shading_pass_" + j;
						var pTechnique: IRenderTechnique = pRenderable.getTechnique(sMethod);

						if (isNull(pTechnique) || pTechCurr.getModified() > pTechnique.getModified()) {
							if (!pRenderable.addRenderMethod(pRenderable.getRenderMethodByName(), sMethod)) {
								logger.critical("cannot clone active render method");
							}

							pTechnique = pRenderable.getTechnique(sMethod);
							//TODO: need something else
							pTechnique.render._syncSignal(pTechCurr.render);
							//pTechnique._syncTable(pTechCurr);


							if (j === 0) {
								pTechnique._blockPass(1);
							}
							else {
								pTechnique._blockPass(0);
							}

							if (pTechnique.getTotalPasses() > j) {
								var pPass: IRenderPass = pTechnique.getPass(j);
								pPass.blend("akra.system.prepareForDeferredShading", j);
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
		
		

		getObject(x: uint, y: uint): ISceneObject {
			return this.getTarget().getRenderer().getEngine().getComposer()._getObjectByRid(this._getRenderId(x, y));
		}

		getRenderable(x: uint, y: uint): IRenderableObject {
			return this.getTarget().getRenderer().getEngine().getComposer()._getRenderableByRid(this._getRenderId(x, y));
		}

		pick(x: uint, y: uint): IRIDPair {
			var pComposer: IAFXComposer = this.getTarget().getRenderer().getEngine().getComposer();
			var iRid: int = this._getRenderId(x, y);
			var pObject: ISceneObject = pComposer._getObjectByRid(iRid);
			var pRenderable: IRenderableObject = null;

			if (isNull(pObject) || !pObject.isFrozen()) {
				pRenderable = pComposer._getRenderableByRid(iRid);
			}
			else {
				pObject = null;
			}
			
			return {renderable: pRenderable, object: pObject};
		}

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
			
			var pDepthTexture: ITexture = this._pDeferredDepthTexture;

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
				pEffect.addComponent("akra.system.fxaa", 2, 0);
			}
			else {
				pEffect.delComponent("akra.system.fxaa", 2, 0);
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
			}
		}

		isFXAA(): boolean {
			return this.getEffect().hasComponent("akra.system.fxaa");
		}


		destroy(): void {
			super.destroy();
			
			this._pDeferredDepthTexture.destroyResource();

			this._pDeferredColorTextures[0].destroyResource();
			this._pDeferredColorTextures[1].destroyResource();

			this._pDeferredView.destroy();
			this._pDeferredView = null;

			this._pDeferredSkyTexture = null;
		}

		protected _onRender(pTechnique: IRenderTechnique, iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void {
			var pPass: IRenderPass = pTechnique.getPass(iPass);
			var pDepthTexture: ITexture = this._pDeferredDepthTexture;
			var pDeferredTextures: ITexture[] = this._pDeferredColorTextures;

			switch (iPass) {
				case 0:
					var pLightUniforms: UniformMap = this._pLightingUnifoms;
					var pLightPoints: IObjectArray<ILightPoint> = this._pLightPoints;
					var pCamera: ICamera = this.getCamera();

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

					for (var i: int = 0; i < pLightUniforms.textures.length; i++) {
						pPass.setTexture("TEXTURE" + i, pLightUniforms.textures[i]);
					}

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

					break;

				case 1:
					//skybox
					pPass.setTexture("DEFERRED_TEXTURE0", pDeferredTextures[0]);
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

					pPass.setTexture("DEFERRED_TEXTURE0", pDeferredTextures[0]);
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

		protected createLightingUniforms(pCamera: ICamera, pLightPoints: IObjectArray<ILightPoint>, pUniforms: UniformMap): void {
			var pLight: ILightPoint;
			var pOmniLight: IOmniLight;
			var pProjectLight: IProjectLight;
			var pSunLight: ISunLight;
			var i: int, j: int;
			var pUniformData: IUniform;
			var pCameraView: IMat4 = pCamera.getViewMatrix();

			var v4fLightPosition: IVec4 = Vec4.temp();
			var v3fLightTransformPosition: IVec3 = Vec3.temp();
			var v4fTemp: IVec4 = Vec4.temp();

			var pShadowCaster: IShadowCaster;
			var m4fShadow: IMat4, m4fToLightSpace: IMat4;

			var iLastTextureIndex: int = 0;
			var sTexture: string = "TEXTURE";
			var pEngine: IEngine = this.getTarget().getRenderer().getEngine();

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

				if (pLight.getLightType() === ELightTypes.OMNI) {
					
					pOmniLight = <IOmniLight>pLight;

					if (pLight.isShadowCaster()) {
						pUniformData = UniformOmniShadow.temp();
						(<UniformOmniShadow>pUniformData).setLightData(<IOmniParameters>pLight.getParams(), v3fLightTransformPosition);
						
						var pDepthCube: ITexture[]				= pOmniLight.getDepthTextureCube();
						var pShadowCasterCube: IShadowCaster[] 	= pOmniLight.getShadowCaster();
						
						for (j = 0; j < 6; ++ j) {
							pShadowCaster = pShadowCasterCube[j];
							m4fToLightSpace = pShadowCaster.getViewMatrix().multiply(pCamera.getWorldMatrix(), Mat4.temp());
							pUniforms.textures.push(pDepthCube[j]);
							sTexture = "TEXTURE" + (pUniforms.textures.length - 1);
							
							(<UniformOmniShadow>pUniformData).setSampler(sTexture, j);
							pUniforms.samplersOmni.push((<UniformOmniShadow>pUniformData).SHADOW_SAMPLER[j]);
							(<UniformOmniShadow>pUniformData).setMatrix(m4fToLightSpace, pShadowCaster.getOptimizedProjection(), j);
						}

						pUniforms.omniShadows.push(<UniformOmniShadow>pUniformData);
					}
					else {
						pUniformData = UniformOmni.temp();
						(<UniformOmni>pUniformData).setLightData(<IOmniParameters>pLight.getParams(), v3fLightTransformPosition);
						pUniforms.omni.push(<UniformOmni>pUniformData);
					}
				}
				else if (pLight.getLightType() === ELightTypes.PROJECT) {
					pProjectLight = <IProjectLight>pLight;
					pShadowCaster = pProjectLight.getShadowCaster();

					if (pLight.isShadowCaster() && pShadowCaster.isShadowCasted()) {
						pUniformData = UniformProjectShadow.temp();
						(<UniformProjectShadow>pUniformData).setLightData(<IProjectParameters>pLight.getParams(), v3fLightTransformPosition);
						
						m4fToLightSpace = pShadowCaster.getViewMatrix().multiply(pCamera.getWorldMatrix(), Mat4.temp());
						pUniforms.textures.push(pProjectLight.getDepthTexture());
						sTexture = "TEXTURE" + (pUniforms.textures.length - 1);

						(<UniformProjectShadow>pUniformData).setSampler(sTexture);
						pUniforms.samplersProject.push((<UniformProjectShadow>pUniformData).SHADOW_SAMPLER);
						(<UniformProjectShadow>pUniformData).setMatrix(m4fToLightSpace, pShadowCaster.getProjectionMatrix(), pShadowCaster.getOptimizedProjection());
						pUniforms.projectShadows.push(<UniformProjectShadow>pUniformData);
					}
					else {
						pUniformData = UniformProject.temp();
						(<UniformProject>pUniformData).setLightData(<IProjectParameters>pLight.getParams(), v3fLightTransformPosition);
						m4fShadow = pShadowCaster.getProjViewMatrix().multiply(pCamera.getWorldMatrix(), Mat4.temp());
						(<UniformProject>pUniformData).setMatrix(m4fShadow);
						pUniforms.project.push(<UniformProject>pUniformData);
					}

				}
				else if (pLight.getLightType() === ELightTypes.SUN) {
					pSunLight = <ISunLight>pLight;
					pShadowCaster = pSunLight.getShadowCaster();

					if (pLight.isShadowCaster()) {
						pUniformData = UniformSunShadow.temp();
						var pSkyDome: ISceneModel = pSunLight.getSkyDome();
						var iSkyDomeId: int = pEngine.getComposer()._calcRenderID(pSkyDome, pSkyDome.getRenderable(0), false);
						(<UniformSunShadow>pUniformData).setLightData(<ISunParameters>pLight.getParams(), iSkyDomeId);
						pUniforms.sunShadows.push(<UniformSunShadow>pUniformData);

						pUniforms.textures.push(pSunLight.getDepthTexture());
						sTexture = "TEXTURE" + (pUniforms.textures.length - 1);

						(<UniformSunShadow>pUniformData).setSampler(sTexture);
						pUniforms.samplersSun.push((<UniformSunShadow>pUniformData).SHADOW_SAMPLER);

						m4fToLightSpace = pShadowCaster.getViewMatrix().multiply(pCamera.getWorldMatrix(), Mat4.temp());
						(<UniformSunShadow>pUniformData).setMatrix(m4fToLightSpace, pShadowCaster.getOptimizedProjection());

					}
					else {
						pUniformData = UniformSun.temp();
						var pSkyDome: ISceneModel = pSunLight.getSkyDome();
						var iSkyDomeId: int = pEngine.getComposer()._calcRenderID(pSkyDome, pSkyDome.getRenderable(0), false);
						(<UniformSun>pUniformData).setLightData(<ISunParameters>pLight.getParams(), iSkyDomeId);
						pUniforms.sun.push(<UniformSun>pUniformData);
					}
				}
				else {
					logger.critical("Invalid light point type detected.");
				}
			}
		}

		private resetUniforms(): void {
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
		}
	}
}


