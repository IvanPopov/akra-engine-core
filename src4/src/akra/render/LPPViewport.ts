/// <reference path="../idl/ILPPViewport.ts" />
/// <reference path="Viewport.ts" />
/// <reference path="../scene/Scene3d.ts" />

module akra.render {
	export class LPPViewport extends Viewport implements ILPPViewport {
		private _pNormalBufferTexture: ITexture = null;
		private _pLightMapTexture: ITexture = null;
		private _pViewScreen: IRenderableObject = null;
		private _pLightPoints: IObjectArray<ILightPoint> = null;
		
		constructor(pCamera: ICamera, fLeft: float = 0., fTop: float = 0., fWidth: float = 1., fHeight: float = 1., iZIndex: int = 0) {
			super(pCamera, null, fLeft, fTop, fWidth, fHeight, iZIndex);
		}
		
		getType(): EViewportTypes {
			return EViewportTypes.LPPVIEWPORT;
		} 

		getView(): IRenderableObject {
			return this._pViewScreen;
		}

		getDepthTexture(): ITexture {
			return null;
		}

		_setTarget(pTarget: IRenderTarget): void {
			super._setTarget(pTarget);

			//common api access
			var pEngine: IEngine = pTarget.getRenderer().getEngine();
			var pResMgr: IResourcePoolManager = pEngine.getResourceManager();

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

			//create NormalBufferTexture
			var pNormalBufferTexture: ITexture = pResMgr.createTexture("lpp-normal-texture-" + iGuid);
			var pRenderTarget: IRenderTarget = null;
			var pViewport: IViewport = null;

			pNormalBufferTexture.create(iWidth, iHeight, 1, null, ETextureFlags.RENDERTARGET, 0, 0,
				ETextureTypes.TEXTURE_2D, EPixelFormats.FLOAT32_RGBA);
			pRenderTarget = pNormalBufferTexture.getBuffer().getRenderTarget();
			pRenderTarget.setAutoUpdated(false);
			pViewport = pRenderTarget.addViewport(new Viewport(this.getCamera(), "lpp_normal_pass",
				0, 0, this.getActualWidth() / pNormalBufferTexture.getWidth(), this.getActualHeight() / pNormalBufferTexture.getHeight()));

			this._pNormalBufferTexture = pNormalBufferTexture;

			//create LightMapTexture
			var pLightMapTexture: ITexture = pResMgr.createTexture("lpp-lightMap-texture-" + iGuid);
			pLightMapTexture.create(iWidth, iHeight, 1, null, ETextureFlags.RENDERTARGET, 0, 0,
				ETextureTypes.TEXTURE_2D, EPixelFormats.FLOAT32_RGBA);
			pRenderTarget = pNormalBufferTexture.getBuffer().getRenderTarget();
			pRenderTarget.setAutoUpdated(false);
			pViewport = pRenderTarget.addViewport(new Viewport(null, null,
				0, 0, this.getActualWidth() / pNormalBufferTexture.getWidth(), this.getActualHeight() / pNormalBufferTexture.getHeight()));

			pViewport.render.connect(this, this._onLightMapRender);

			this._pLightMapTexture = pLightMapTexture;

			//creatin deferred effects
			var pLPPMethod: IRenderMethod = null;
			var pLPPEffect: IEffect = null;

			pLPPMethod = pResMgr.createRenderMethod(".lpp_generate_lightMap" + iGuid);
			pLPPEffect = pResMgr.createEffect(".lpp_generate_lightMap" + iGuid);

			pLPPEffect.addComponent("akra.system.prepare_lpp_lights");

			pLPPMethod.setEffect(pLPPEffect);

			this._pViewScreen.getTechnique().setMethod(pLPPMethod);

			this.setClearEveryFrame(false);
			this.setDepthParams(false, false, 0);
		}

		setCamera(pCamera: ICamera): boolean {
			var isOk = super.setCamera(pCamera);
			this._pNormalBufferTexture.getBuffer().getRenderTarget().getViewport(0).setCamera(pCamera);
			return isOk;
		}

		_updateDimensions(bEmitEvent: boolean = true): void {
			super._updateDimensions(false);

			if (isDefAndNotNull(this._pNormalBufferTexture)) {
				this._pNormalBufferTexture.reset(math.ceilingPowerOfTwo(this.getActualWidth()), math.ceilingPowerOfTwo(this.getActualHeight()));
				this._pNormalBufferTexture.getBuffer().getRenderTarget().getViewport(0)
					.setDimensions(0., 0., this.getActualWidth() / this._pNormalBufferTexture.getWidth(), this.getActualHeight() / this._pNormalBufferTexture.getHeight());

				this._pLightMapTexture.reset(math.ceilingPowerOfTwo(this.getActualWidth()), math.ceilingPowerOfTwo(this.getActualHeight()));
				this._pLightMapTexture.getBuffer().getRenderTarget().getViewport(0)
					.setDimensions(0., 0., this.getActualWidth() / this._pLightMapTexture.getWidth(), this.getActualHeight() / this._pLightMapTexture.getHeight());
			}

			if (bEmitEvent) {
				this.viewportDimensionsChanged.emit();
			}
		}

		_updateImpl(): void {
			this.prepareForLPPShading();
			//prepare normal buffer texture
			this._pNormalBufferTexture.getBuffer().getRenderTarget().update();

			//camera last viewport changed, because camera used in normal buffer textures updating
			this._pCamera._keepLastViewport(this);

			//render light map
			var pLights: IObjectArray<ILightPoint> = <IObjectArray<any>>this.getCamera().display(scene.Scene3d.DL_LIGHTING);

			//for (var i: int = 0; i < pLights.getLength(); i++) {
			//	pLights.value(i)._calculateShadows();
			//}

			this._pLightPoints = pLights;

			//render deferred
			this._pViewScreen.render(this._pLightMapTexture.getBuffer().getRenderTarget().getViewport(0));

			this.renderAsNormal("apply_lpp_shading", this.getCamera());
		}

		private prepareForLPPShading(): void {
			var pNodeList: IObjectArray<ISceneObject> = this.getCamera().display();

			for (var i: int = 0; i < pNodeList.getLength(); ++i) {
				var pSceneObject: ISceneObject = pNodeList.value(i);

				for (var k: int = 0; k < pSceneObject.getTotalRenderable(); k++) {
					var pRenderable: IRenderableObject = pSceneObject.getRenderable(k);
					var sMethod: string = "lpp_normal_pass";
					var pTechnique: IRenderTechnique = null;

					if (isNull(pRenderable.getTechnique(sMethod))) {
						if (!pRenderable.addRenderMethod(sMethod)) {
							logger.critical("cannot create render method for first pass of LPP");
						}

						pTechnique = pRenderable.getTechnique(sMethod);
						pTechnique.addComponent("akra.system.mesh_geometry");
						pTechnique.addComponent("akra.system.prepare_lpp_geometry");
					}

					sMethod = "apply_lpp_shading";

					if (isNull(pRenderable.getTechnique(sMethod))) {
						if (!pRenderable.addRenderMethod(sMethod)) {
							logger.critical("cannot create render method for first pass of LPP");
						}

						pTechnique = pRenderable.getTechnique(sMethod);
						pTechnique.addComponent("akra.system.mesh_geometry");
						pTechnique.addComponent("akra.system.mesh_texture_full");
						pTechnique.addComponent("akra.system.apply_lpp_shading");
					}
				}
			}
		}

		_onLightMapRender(pViewport: IViewport, pTechnique: IRenderTechnique, iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void {

		}

		endFrame(): void {
			this.getTarget().getRenderer().executeQueue(false);
		}
	}
}