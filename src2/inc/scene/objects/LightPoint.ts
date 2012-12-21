#ifndef LIGHTPOINT_TS
#define LIGHTPOINT_TS

#include "ILightPoint.ts"
#include "SceneNode.ts"
#include "math/math.ts"

module akra.scene.objects {
	export struct LightParameters implements ILightParameters {
		ambient: IColor = new Color;
	    diffuse: IColor = new Color;
	    specular: IColor = new Color;
	    attenuation: IColor = new Color;
	}

	export class LightPoint extends SceneNode implements ILightPoint {
		protected _bCastShadows: bool = false;
		protected _isEnabled: bool = true;
		protected _iMaxShadowResolution: uint = 256;
		protected _pLightParameters: ILightParameters = new LightParameters;

		inline get params(): ILightParameters {
			return this._pLightParameters;
		}

		create(isShadowCaster: bool = true, iMaxShadowResolution: uint = 256): bool {
			var isOk: bool = super.create();

			//активен ли источник
			this._isEnabled = true;
			//есть тени от источника или нет
			this._bCastShadows = isShadowCaster;
			//мкасимальный размер shadow текстуры
			this._iMaxShadowResolution = math.ceilingPowerOfTwo(iMaxShadowResolution);

			return isOk;
		}

		inline setEnabled(bValue: bool = true): bool {
			this._isEnabled = true;
		}

		inline isShadowCaster(): bool {
			return this._bCastShadows;
		}

		inline setShadowCasting(bValue: bool = true): void {
			this._bCastShadows = bValue;
		}

		_calculateShadows(): void {
			CRITICAL("NOT IMPLEMENTED!");
		}
	}
}

#endif
