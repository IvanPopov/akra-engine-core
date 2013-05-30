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
		protected _isShadowCaster: bool = false;
		protected _isEnabled: bool = true;
		protected _iMaxShadowResolution: uint = 256;
		protected _pLightParameters: ILightParameters = new LightParameters;
		protected _eLightType: ELightTypes;

		//optimized camera frustum for better shadow casting
		protected _pOptimizedCameraFrustum: IFrustum = new geometry.Frustum();

		inline get lightType(): ELightTypes {
			return this._eLightType;
		}

		constructor(pScene: IScene3d, eType: ELightTypes = ELightTypes.UNKNOWN){
			super(pScene, EEntityTypes.LIGHT);

			this._eLightType = eType;
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
			return this._isShadowCaster;
		};

		inline set isShadowCaster(bValue: bool) {
			this._isShadowCaster = bValue;
		};

		inline get optimizedCameraFrustum(): IFrustum{
			return this._pOptimizedCameraFrustum;
		};

		create(isShadowCaster: bool = true, iMaxShadowResolution: int = 256): bool {
			var isOk: bool = super.create();

			//есть тени от источника или нет
			this._isShadowCaster = isShadowCaster;
			//мкасимальный размер shadow текстуры
			this._iMaxShadowResolution = iMaxShadowResolution;

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
	export function isLightPoint(pNode: IEntity){
		return pNode.type === EEntityTypes.LIGHT;
	}
}

#endif
