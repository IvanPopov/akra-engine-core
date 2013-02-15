#ifndef SHADOWCASTER_TS
#define SHADOWCASTER_TS

#include "IShadowCaster.ts"
#include "scene/objects/Camera.ts"

module akra.scene.light {
	export class ShadowCaster extends objects.Camera implements IShadowCaster {
		protected _pLightPoint: ILightPoint;
		protected _iFace: uint;

		get lightPoint(): ILightPoint{
			return this._pLightPoint;
		};

		get face(): uint{
			return this._iFace;
		};

		constructor (pLightPoint: ILightPoint, iFace: uint = POSITIVE_X) {
			super(pLightPoint.scene);

			this._pLightPoint = pLightPoint;
			this._iFace = iFace;
		}
	}
}

#endif