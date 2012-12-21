#ifndef SHADOWCASTER_TS
#ifndef SHADOWCASTER_TS

#include "Camera.ts"
#include "IShadowCaster.ts"

module akra.scene.objects {
	export class ShadowCaster extends Camera implements IShadowCaster {
		protected _pLightPoint: ILightPoint;
		protected _iFace: uint;

		constructor (pLightPoint: ILightPoint, iFace: uint = POSITIVE_X) {
			super(pLightPoint.scene);

			this._pLightPoint = pLightPoint;
			this._iFace = iFace;
		}

		renderImpl(): void {
			var pVisibleObjects: ISceneObject[] = this.findVisibleObjects();
			var pRenderable: IRenderableObject;

			for (var i: int = 0; i < pVisibleObjects.length; ++ i) {
				pRenderable = pVisibleObjects[i].getRenderable();

				if (pRenderable.switchRenderMethod("shadow_map")) {
					pRenderable.render();
				}
			}
		}
	}
}

#endif