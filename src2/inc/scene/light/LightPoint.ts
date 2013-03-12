#ifndef LIGHTPOINT_TS
#define LIGHTPOINT_TS

#include "ILightPoint.ts"
#include "scene/SceneObject.ts"
#include "math/math.ts"

module akra.scene.light {
	export struct LightParameters implements ILightParameters {
		ambient: IColor = new Color;
	    diffuse: IColor = new Color;
	    specular: IColor = new Color;
	    attenuation: IVec3 = new Vec3;
	}

	export class LightPoint extends SceneNode implements ILightPoint {
		protected _bCastShadows: bool = false;
		protected _isEnabled: bool = true;
		protected _iMaxShadowResolution: uint = 256;
		protected _pLightParameters: ILightParameters = new LightParameters;

		constructor(pScene: IScene3d, eType: EEntityTypes, isShadowCaster: bool = true, iMaxShadowResolution: int = 256){
			super(pScene, eType);

			//есть тени от источника или нет
			this._bCastShadows = isShadowCaster;
			//мкасимальный размер shadow текстуры
			this._iMaxShadowResolution = iMaxShadowResolution;
		}

		inline get enabled(): bool{
			return this._isEnabled;
		};

		inline set enabled(bValue: bool){
			this._isEnabled = bValue;
		};


		inline get params(): ILightParameters {
			return this._pLightParameters;
		};

		inline get isShadowCaster(): bool {
			return this._bCastShadows;
		};

		inline set isShadowCaster(bValue: bool) {
			this._bCastShadows = bValue;
		};

		create(): bool {
			var isOk: bool = super.create();
			return isOk;
		};

		_prepareForLighting(pCamera: ICamera): bool{
			WARNING("pure virtual method");
			return false;
		};

		_calculateShadows(): void {
			CRITICAL("NOT IMPLEMENTED!");
		};
	}
	export function isLightPoint(pNode: ISceneNode){
		var eType: EEntityTypes = pNode.type;
		return EEntityTypes.LIGHT_PROJECT <= eType && eType <= EEntityTypes.LIGHT_OMNI_DIRECTIONAL;
	}
}

#endif
