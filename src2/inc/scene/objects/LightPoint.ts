#ifndef LIGHTPOINT_TS
#define LIGHTPOINT_TS

module akra.scene.objects {
	export struct LightParameters implements ILightParameters {
		ambient: IColor = new Color;
	    diffuse: IColor = new Color;
	    specular: IColor = new Color;
	    attenuation: IColor = new Color;
	}

	export class LightPoint extends SceneNode implements ILightPoint {
		protected _bCastShadows: bool;
		protected _isEnabled: bool;
		protected _iMaxShadowResolution: uint;
		protected _pLightParameters: ILightParameters;

		create(isShadowCaster: bool = true, iMaxShadowResolution: uint = 512): bool {
			var isOk: bool = super.create();

			//активен ли источник
			this._isEnabled = true;
			//есть тени от источника или нет
			this._bCastShadows = isShadowCaster;
			//мкасимальный размер shadow текстуры
			this._iMaxShadowResolution = math.ceilingPowerOfTwo(iMaxShadowResolution);

			this._pLightParameters = new LightParameters;

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
