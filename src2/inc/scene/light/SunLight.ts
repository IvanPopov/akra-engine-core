#ifndef SUNLIGHT_TS
#define SUNLIGHT_TS

#include "ISunLight.ts"
#include "ITexture.ts"
#include "IResourcePoolManager.ts"
#include "IRenderTarget.ts"
#include "util/ObjectArray.ts"

module akra.scene.light {

	export struct SunParameters implements ISunParameters {
		eyePosition: IVec3 = new Vec3;
	    sunDir: IVec3 = new Vec3;
	    groundC0: IVec3 = new Vec3;
	    groundC1: IVec3 = new Vec3;
	    hg: IVec3 = new Vec3;
	}

	export class SunLight extends LightPoint implements ISunLight {
		protected _pLightParameters: ISunParameters = new SunParameters;

		inline get params(): ISunParameters {
			return this._pLightParameters;
		};


		constructor (pScene: IScene3d) {
			super(pScene, ELightTypes.SUN);
		};

		_calculateShadows(): void {

		}

		// create(caster: bool): bool{
		// 	return super.create(false, 0);
		// };

		_prepareForLighting(pCamera: ICamera): bool{
			return true;
		};
	}
}

#endif
