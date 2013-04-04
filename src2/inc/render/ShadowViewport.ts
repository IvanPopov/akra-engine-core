#ifndef SHADOWVIEWPORT_TS
#define SHADOWVIEWPORT_TS

#include "Viewport.ts"
#include "scene/light/ShadowCaster.ts"

module akra.render {
	export class ShadowViewport extends Viewport implements IViewport{
		constructor(pCamera: ICamera, pTarget: IRenderTarget, csRenderMethod: string = null, fLeft: float = 0., fTop: float = 0., fWidth: float = 1., fHeight: float = 1., iZIndex: int = 0){
			super(pCamera, pTarget, null, fLeft, fTop, fWidth, fHeight, iZIndex);
		}

		update(): void {

			var pShadowCaster: IShadowCaster = <IShadowCaster> this._pCamera;
			var pAffectedObjects: IObjectArray = pShadowCaster.affectedObjects;

			var pRenderable: IRenderableObject;
			var pSceneObject: ISceneObject;

			var nShadowsCasted: uint = 0;


			for (var i: int = 0; i < pAffectedObjects.length; i++) {
				pSceneObject = pAffectedObjects.value(i);

				if(pSceneObject.hasShadows){
					pRenderable = pSceneObject.getRenderable();

					if (!isNull(pRenderable)) {
						pRenderable.render(this, "shadow-casting"/*fix me*/, pSceneObject);
						nShadowsCasted++;
					}
				}
			}

			pShadowCaster.isShadowCasted = (nShadowsCasted > 0) ? true : false;

			this.getTarget().getRenderer().executeQueue();
		}

	};
}

#endif