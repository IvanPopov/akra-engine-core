/// <reference path="../../idl/ILightPoint.ts" />
/// <reference path="../SceneObject.ts" />
/// <reference path="../../math/math.ts" />

module akra.scene.light {
	enum ELightPointFlags {
		k_NewLocalBounds = 0,
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

		protected _pLocalBounds: IRect3d = null;
		protected _pWorldBounds: IRect3d = null;
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
			this._pLocalBounds.set(pBox);
			this._iLightPointFlags = bf.setBit(this._iLightPointFlags, ELightPointFlags.k_NewLocalBounds);
		}

		getRestrictedWorldBounds(): IRect3d {
			return this._pWorldBounds;
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
				if (isNull(this._pLocalBounds)) {
					this._pLocalBounds = new geometry.Rect3d(-1, 1, -1, 1, -1, 1);
					this._pWorldBounds = new geometry.Rect3d();
				}

				if (isDef(pBox)) {
					this._pLocalBounds.set(pBox);
				}

				this._iLightPointFlags = bf.setBit(this._iLightPointFlags, ELightPointFlags.k_NewLocalBounds);

				this.recalcRestrictBounds();
			}
		}

		prepareForUpdate(): void {
			super.prepareForUpdate();

			this._iLightPointFlags = bf.clearAll(this._iLightPointFlags,
				bf.flag(ELightPointFlags.k_NewLocalBounds) | bf.flag(ELightPointFlags.k_NewWorldBounds));
		}

		update(): boolean {
			//если, обновится мировая матрица узла, то и AABB обновится 
			super.update();
			// do we need to update our local matrix?
			// derived classes update the local matrix
			// then call this base function to complete
			// the update
			return this.recalcRestrictBounds();
		}

		protected recalcRestrictBounds(): boolean {
			// nodes only get their bounds updated
			// as nessesary
			if (this.isRestricted() &&
				(bf.testBit(this._iLightPointFlags, ELightPointFlags.k_NewLocalBounds) || this.isWorldMatrixNew())) {
				// transform our local rectangle 
				// by the current world matrix
				this._pWorldBounds.set(this._pLocalBounds);
				// make sure we have some degree of thickness
				if (true) {
					this._pWorldBounds.x1 = math.max(this._pWorldBounds.x1, this._pWorldBounds.x0 + 0.01);
					this._pWorldBounds.y1 = math.max(this._pWorldBounds.y1, this._pWorldBounds.y0 + 0.01);
					this._pWorldBounds.z1 = math.max(this._pWorldBounds.z1, this._pWorldBounds.z0 + 0.01);
				}

				this._pWorldBounds.transform(this.getWorldMatrix());

				return true;
			}

			return false;
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

