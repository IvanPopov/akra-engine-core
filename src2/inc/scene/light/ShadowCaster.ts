#ifndef SHADOWCASTER_TS
#define SHADOWCASTER_TS

#include "IShadowCaster.ts"
#include "scene/objects/Camera.ts"
#include "util/ObjectArray.ts"

module akra.scene.light {
	export class ShadowCaster extends objects.Camera implements IShadowCaster {
		protected _pLightPoint: ILightPoint;
		protected _iFace: uint;
		protected _pAffectedObjects: IObjectArray;

		inline get lightPoint(): ILightPoint{
			return this._pLightPoint;
		};

		inline get face(): uint{
			return this._iFace;
		};

		inline get affectedObjects(): IObjectArray{
			return this._pAffectedObjects;
		}

		constructor (pLightPoint: ILightPoint, iFace: uint = POSITIVE_X) {
			super(pLightPoint.scene);

			this._pLightPoint = pLightPoint;
			this._iFace = iFace;
			this._pAffectedObjects = new util.ObjectArray();
		};
	}
}

#endif