/// <reference path="../../idl/ILightPoint.ts" />
/// <reference path="../SceneObject.ts" />
/// <reference path="../../math/math.ts" />

module akra.scene.light {
	enum ELightPointFlags {
		k_NewRestrictedLocalBounds = 0,
		k_NewWorldBounds
	};

	export class LightPoint extends SceneNode implements ILightPoint {
		protected _isShadowCaster: boolean = false;
		protected _isEnabled: boolean = true;
		protected _iMaxShadowResolution: uint = 256;
		// protected _pLightParameters: ILightParameters = new LightParameters;
		protected _eLightType: ELightTypes;

		//optimized camera frustum for better shadow casting
		protected _pOptimizedCameraFrustum: IFrustum = new geometry.Frustum();

		protected _pRestrictedLocalBounds: IRect3d = null;
		protected _isRestricted: boolean = false;

		protected _iLightPointFlags: uint = 0;

		getParams(): ILightParameters {
			// return this._pLightParameters;
			return null;
		}

		getLightType(): ELightTypes {
			return this._eLightType;
		}

		getOptimizedCameraFrustum(): IFrustum {
			return this._pOptimizedCameraFrustum;
		}

		isEnabled(): boolean {
			return this._isEnabled;
		}

		setEnabled(bValue: boolean): void {
			this._isEnabled = bValue;
		}

		isShadowCaster(): boolean {
			return this._isShadowCaster;
		}

		setShadowCaster(bValue: boolean): void {
			this._isShadowCaster = bValue;
		}

		getLightingDistance(): float {
			return -1.;
		}

		setLightingDistance(fDistance: float): void {
		}

		isRestricted(): boolean {
			return this._isRestricted;
		}

		setRestrictedLocalBounds(pBox: IRect3d): void {
			this.restrictLight(true, pBox);
		}

		getRestrictedLocalBounds(): IRect3d {
			return this._pRestrictedLocalBounds;
		}

		constructor(pScene: IScene3d, eType: ELightTypes = ELightTypes.UNKNOWN) {
			super(pScene, EEntityTypes.LIGHT);

			this._eLightType = eType;
		}

		create(isShadowCaster: boolean = true, iMaxShadowResolution: int = 256): boolean {
			var isOk: boolean = super.create();

			//есть тени от источника или нет
			this._isShadowCaster = isShadowCaster;
			//мкасимальный размер shadow текстуры
			this._iMaxShadowResolution = iMaxShadowResolution;

			return isOk;
		}

		restrictLight(bEnable: boolean, pBox?: IRect3d): void {
			this._isRestricted = bEnable;

			if (bEnable) {
				if (isNull(this._pRestrictedLocalBounds)) {
					this._pRestrictedLocalBounds = new geometry.Rect3d(-1, 1, -1, 1, -1, 1);
				}

				if (isDef(pBox)) {
					this._pRestrictedLocalBounds.set(pBox);
				}

				this._iLightPointFlags = bf.setBit(this._iLightPointFlags, ELightPointFlags.k_NewRestrictedLocalBounds);
			}
		}

		prepareForUpdate(): void {
			super.prepareForUpdate();

			this._iLightPointFlags = bf.clearAll(this._iLightPointFlags,
				bf.flag(ELightPointFlags.k_NewRestrictedLocalBounds));
		}

		_prepareForLighting(pCamera: ICamera): boolean {
			debug.warn("pure virtual method");
			return false;
		}

		_calculateShadows(): void {
			debug.critical("NOT IMPLEMENTED!");
		}

		static isLightPoint(pNode: IEntity) {
			return pNode.getType() === EEntityTypes.LIGHT;
		}
	}
}

