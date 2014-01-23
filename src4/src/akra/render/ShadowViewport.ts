/// <reference path="Viewport.ts" />
/// <reference path="../scene/light/ShadowCaster.ts" />

//#define DEFAULT_SHADOW_TECHNIQUE_NAME ".prepare-shadows"

module akra.render {
	var DEFAULT_SHADOW_TECHNIQUE_NAME: string = ".prepare-shadows";

	export class ShadowViewport extends Viewport implements IViewport {

		get type(): EViewportTypes { return EViewportTypes.SHADOWVIEWPORT; }

		constructor(pCamera: ICamera, fLeft: float = 0., fTop: float = 0., fWidth: float = 1., fHeight: float = 1., iZIndex: int = 0) {
			super(pCamera, DEFAULT_SHADOW_TECHNIQUE_NAME, fLeft, fTop, fWidth, fHeight, iZIndex);

			this.setClearEveryFrame(true, EFrameBufferTypes.DEPTH);
			this.setDepthParams(true, true, ECompareFunction.LESS);
			this.depthClear = 1.;
		}

		_updateImpl(): void {
			// LOG("SAHDOW VIEWPORT #" + this.getGuid());
			var pShadowCaster: IShadowCaster = <IShadowCaster> this._pCamera;
			var pAffectedObjects: IObjectArray<ISceneObject> = pShadowCaster.getAffectedObjects();

			var pRenderable: IRenderableObject;
			var pSceneObject: ISceneObject;

			var nShadowsCasted: uint = 0;

			for (var i: int = 0; i < pAffectedObjects.length; i++) {
				pSceneObject = pAffectedObjects.value(i);

				if (pSceneObject.getShadow()) {
					for (var j: int = 0; j < pSceneObject.getTotalRenderable(); j++) {
						pRenderable = pSceneObject.getRenderable(j);

						if (!isNull(pRenderable) && pRenderable.shadow) {
							this.prepareRenderableForShadows(pRenderable);
							pRenderable.render(this, this._csDefaultRenderMethod, pSceneObject);
							nShadowsCasted++;
						}
					}

				}
			}

			pShadowCaster.setIsShadowCasted((nShadowsCasted > 0) ? true : false);
		}

		private prepareRenderableForShadows(pRenderable: IRenderableObject): void {
			var pRenderTechnique: IRenderTechnique = pRenderable.getTechnique(this._csDefaultRenderMethod);

			if (!isNull(pRenderTechnique)) {
				return;
			}

			var pRmgr: IResourcePoolManager = this.getTarget().getRenderer().getEngine().getResourceManager();
			var pMethodPool: IResourcePool = pRmgr.renderMethodPool;

			var pMethod: IRenderMethod = <IRenderMethod>pMethodPool.findResource(".method-prepare-shadows");

			if (isNull(pMethod)) {
				pMethod = pRmgr.createRenderMethod(".method-prepare-shadows");
				pMethod.effect = pRmgr.createEffect(".effect-prepare-shadows");
				pMethod.effect.addComponent("akra.system.prepareShadows");
			}

			pRenderable.addRenderMethod(pMethod, this._csDefaultRenderMethod);
		}

		protected _getDepthRangeImpl(): IDepthRange {
			var pDepthTexture: ITexture;
			var pShadowCaster: IShadowCaster = <IShadowCaster>this._pCamera;

			var pLightPoint: ILightPoint = pShadowCaster.getLightPoint();

			switch (pLightPoint.getLightType()) {
				case ELightTypes.PROJECT:
					pDepthTexture = (<IProjectLight>pLightPoint).getDepthTexture();
					break;
				case ELightTypes.OMNI:
					pDepthTexture = (<IOmniLight>pLightPoint).getDepthTextureCube()[pShadowCaster.getFace()];
					break;
				default:
					pDepthTexture = null;
					break;
			}

			if (isDefAndNotNull(pDepthTexture)) {
				var pRange: IDepthRange = config.WEBGL?
					webgl.getDepthRange(pDepthTexture): { min: 0., max: 1. };
				console.log("shadow viewport min & max depth range > ", pRange.min, pRange.max);
				//[0,1] -> [-1, 1]
				pRange.min = pRange.min * 2. - 1.
				pRange.max = pRange.max * 2. - 1.

				return pRange;
			}
			return null;
		}

	}
}

