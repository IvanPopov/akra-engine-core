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
	}
}

#endif