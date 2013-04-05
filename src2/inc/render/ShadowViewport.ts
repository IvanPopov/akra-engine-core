#ifndef SHADOWVIEWPORT_TS
#define SHADOWVIEWPORT_TS

#include "Viewport.ts"
#include "scene/light/ShadowCaster.ts"

#define DEFAULT_SHADOW_TECHNIQUE_NAME ".prepare-shadows"

module akra.render {
	export class ShadowViewport extends Viewport implements IViewport{
		constructor(pCamera: ICamera, pTarget: IRenderTarget, csRenderMethod: string = DEFAULT_SHADOW_TECHNIQUE_NAME, fLeft: float = 0., fTop: float = 0., fWidth: float = 1., fHeight: float = 1., iZIndex: int = 0){
			super(pCamera, pTarget, csRenderMethod, fLeft, fTop, fWidth, fHeight, iZIndex);

			this.setClearEveryFrame(true, EFrameBufferTypes.DEPTH);
			this.setDepthParams(true, true, ECompareFunction.LESS);
			this.depthClear = 1.;

			this._csDefaultRenderMethod = DEFAULT_SHADOW_TECHNIQUE_NAME;
		}

		update(): void {
			this.newFrame();

			var pShadowCaster: IShadowCaster = <IShadowCaster> this._pCamera;
			var pAffectedObjects: IObjectArray = pShadowCaster.affectedObjects;

			console.error("here", pAffectedObjects);

			var pRenderable: IRenderableObject;
			var pSceneObject: ISceneObject;

			var nShadowsCasted: uint = 0;

			for (var i: int = 0; i < pAffectedObjects.length; i++) {
				pSceneObject = pAffectedObjects.value(i);

					if(pSceneObject.hasShadow){
						for (var j: int = 0; j < pSceneObject.totalRenderable; j++) {
						pRenderable = pSceneObject.getRenderable(j);

						if (!isNull(pRenderable) && pRenderable.hasShadow) {
							this.prepareRenderableForShadows(pRenderable);
							pRenderable.render(this, this._csDefaultRenderMethod, pSceneObject);
							nShadowsCasted++;
						}
					}

				}
			}

			pShadowCaster.isShadowCasted = (nShadowsCasted > 0) ? true : false;
			this.getTarget().getRenderer().executeQueue();
		}

		private prepareRenderableForShadows(pRenderable: IRenderableObject): void {
			var pRenderTechnique: IRenderTechnique = pRenderable.getTechnique(this._csDefaultRenderMethod);

			if(!isNull(pRenderTechnique)){
				return;
			}

			var pRmgr: IResourcePoolManager = this.getTarget().getRenderer().getEngine().getResourceManager();
			var pMethodPool: IResourcePool = pRmgr.renderMethodPool;

			var pMethod: IRenderMethod = <IRenderMethod>pMethodPool.findResource(".method-prepare-shadows");
			
			if(isNull(pMethod)){
				pMethod = pRmgr.createRenderMethod(".method-prepare-shadows");
				pMethod.effect = pRmgr.createEffect(".effect-prepare-shadows");
				pMethod.effect.addComponent("akra.system.prepareShadows");
			}

			pRenderable.addRenderMethod(pMethod, this._csDefaultRenderMethod);
		}

	};
}

#endif