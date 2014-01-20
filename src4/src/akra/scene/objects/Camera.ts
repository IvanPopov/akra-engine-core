/// <reference path="../../idl/IScene3d.ts" />
/// <reference path="../../idl/ICamera.ts" />
/// <reference path="../../idl/IDisplayList.ts" />
/// <reference path="../../idl/IViewport.ts" />
/// <reference path="../../idl/IObjectArray.ts" />

/// <reference path="../../geometry/Frustum.ts" />
/// <reference path="../../common.ts" />
/// <reference path="../../math/math.ts" />
/// <reference path="../../util/ObjectArray.ts" />

/// <reference path="../SceneObject.ts" />

module akra.scene.objects {
	import Mat4 = math.Mat4;
	import Mat3 = math.Mat3;
	import Vec3 = math.Vec3;
	import Vec4 = math.Vec4;

	import __13 = math.__13;
	import __23 = math.__23;
	import __33 = math.__33;

	enum ECameraFlags {
		k_NewProjectionMatrix = 0,
		k_NewProjectionParams
	}

	export class DLTechnique<T extends ISceneNode> {
		list: IDisplayList<T>;
		camera: ICamera;

		private _pPrevResult: IObjectArray<T> = null;

		constructor(pList: IDisplayList<T>, pCamera: ICamera) {
			this.list = pList;
			this.camera = pCamera;
		}

		findObjects(pResultArray: IObjectArray<T>, bQuickSearch: boolean = false): IObjectArray<T> {
			var pResult: IObjectArray<T> = this.list._findObjects(this.camera, pResultArray,
				bQuickSearch && isDefAndNotNull(this._pPrevResult));

			if (isNull(this._pPrevResult)) {
				this._pPrevResult = pResult;
			}

			return this._pPrevResult;
		}
	}

	export class Camera extends SceneNode implements ICamera {
		preRenderScene: ISignal<{ (pCamera: ICamera): void; }> = new Signal(this);
		postRenderScene: ISignal<{ (pCamera: ICamera): void; }> = new Signal(this);

		/** camera type */
		protected _eCameraType: ECameraTypes = ECameraTypes.PERSPECTIVE;
		/** camera options */
		protected _iCameraOptions: int = 0;
		/** update projection bit flag */
		protected _iUpdateProjectionFlags: int = 0;

		/** 
		 * View matrix 
		 */
		protected _m4fView: IMat4 = new Mat4;
		/** internal, un-biased projection matrix */
		protected _m4fProj: IMat4 = new Mat4;
		/** internal, un-biased projection+view matrix */
		protected _m4fProjView: IMat4 = new Mat4;

		/** 
		 * Biased for use during current render stage 
		 * @deprecated
		 */
		//protected _m4fRenderStageProj: IMat4 = new Mat4;

		/**
		 * @deprecated
		 */
		//protected _m4fRenderStageProjView: IMat4 = new Mat4;

		/** Search rect for scene culling */
		protected _pSearchRect: IRect3d = new geometry.Rect3d();
		/** Position */
		protected _v3fTargetPos: IVec3 = new Vec3;

		/** Attributes for projection matrix */
		protected _fFOV: float = math.PI / 5.;
		protected _fAspect: float = 4. / 3.;
		protected _fNearPlane: float = 0.1;
		protected _fFarPlane: float = 500.;
		protected _fWidth: float = 0.;
		protected _fHeight: float = 0.;
		protected _fMinX: float = 0.;
		protected _fMaxX: float = 0.;
		protected _fMinY: float = 0.;
		protected _fMaxY: float = 0.;

		protected _pFrustum: IFrustum = new geometry.Frustum;

		protected _pLastViewport: IViewport = null;

		protected _pDLTechniques: DLTechnique<ISceneObject>[] = [];
		protected _pDLResultStorage: IObjectArray<ISceneObject>[] = [];

		// protected _pPrevObjects: ISceneNode[] = null;
		// protected _p

		get viewMatrix(): IMat4 { return this._m4fView; }

		get projectionMatrix(): IMat4 { return this._m4fProj; }

		get projViewMatrix(): IMat4 { return this._m4fProjView; }

		get targetPos(): IVec3 { return this._v3fTargetPos; }

		get fov(): float { return this._fFOV; }
		set fov(fFOV: float) {
			this._fFOV = fFOV;
			bf.setBit(this._iUpdateProjectionFlags, ECameraFlags.k_NewProjectionParams);
		}

		get aspect(): float { return this._fAspect; }
		set aspect(fAspect: float) {
			this._fAspect = fAspect;
			bf.setBit(this._iUpdateProjectionFlags, ECameraFlags.k_NewProjectionParams);
		}

		get nearPlane(): float { return this._fNearPlane; }
		set nearPlane(fNearPlane: float) {
			this._fNearPlane = fNearPlane;
			bf.setBit(this._iUpdateProjectionFlags, ECameraFlags.k_NewProjectionParams);
		}

		get farPlane(): float { return this._fFarPlane; }
		set farPlane(fFarPlane: float) {
			this._fFarPlane = fFarPlane;
			bf.setBit(this._iUpdateProjectionFlags, ECameraFlags.k_NewProjectionParams);
		}

		get viewDistance(): float { return this._fFarPlane - this._fNearPlane; }
		get searchRect(): IRect3d { return this._pSearchRect; }
		get frustum(): IFrustum { return this._pFrustum; }

		constructor(pScene: IScene3d, eType: EEntityTypes = EEntityTypes.CAMERA) {
			super(pScene, eType);
		}

		create(): boolean {
			var isOK: boolean = super.create();

			if (isOK) {
				this._v3fTargetPos.set(
					this._m4fLocalMatrix.data[__13],
					this._m4fLocalMatrix.data[__23],
					this._m4fLocalMatrix.data[__33]);
				this._v3fTargetPos.negate();

				this.recalcProjMatrix();
				this.recalcMatrices();

				var pScene: IScene3d = this._pScene;

				pScene.displayListAdded.connect(this, this._addDisplayList);
				pScene.displayListRemoved.connect(this, this._removeDisplayList);

				for (var i: uint = 0; i < pScene.totalDL; ++i) {
					var pList: IDisplayList<ISceneObject> =
						<IDisplayList<ISceneObject>>pScene.getDisplayList(i);

					if (!isNull(pList)) {
						this._addDisplayList(pScene, pList, i);
					}
				}
			}

			return isOK;
		}

		isProjParamsNew(): boolean {
			return bf.testBit(this._iUpdateProjectionFlags, ECameraFlags.k_NewProjectionParams);
		}

		recalcProjMatrix(): void {
			switch (this._eCameraType) {
				case ECameraTypes.PERSPECTIVE:
					Mat4.perspective(this._fFOV, this._fAspect, this._fNearPlane, this._fFarPlane, this._m4fProj);
					break;
				case ECameraTypes.ORTHO:
					Mat4.orthogonalProjection(this._fWidth, this._fHeight,
						this._fNearPlane, this._fFarPlane, this._m4fProj);
					break;
				case ECameraTypes.OFFSET_ORTHO:
					Mat4.orthogonalProjectionAsymmetric(this._fMinX, this._fMaxX,
						this._fMinY, this._fMaxY, this._fNearPlane, this._fFarPlane, this._m4fProj);
					break;
			}
			bf.clearBit(this._iUpdateProjectionFlags, ECameraFlags.k_NewProjectionParams);
		}

		prepareForUpdate(): void {
			super.prepareForUpdate();

			//reset culling cache for all display lists
			// for (var i: int = 0; i < this._pDLTechniques.length; ++ i) {
			// 	if (this._pDLTechniques[i] != null) {
			// 		this._pDLTechniques.reset();
			// 	}
			// }
		}

		display(iList: uint = /*DL_DEFAULT*/0): IObjectArray<ISceneObject> {
			var pObjects: IObjectArray<ISceneObject> = this._pDLTechniques[iList].
				findObjects(this._pDLResultStorage[iList], !this.isUpdated());

			return pObjects;
		}

		_getLastResults(iList: uint = 0): IObjectArray<ISceneObject> {
			return this._pDLResultStorage[iList] || null;
		}

		setParameter(eParam: ECameraParameters, pValue: any): void {
			if (eParam === ECameraParameters.CONST_ASPECT && <boolean>pValue) {
				bf.setAll(this._iCameraOptions, <int>eParam);
			}
		}

		isConstantAspect(): boolean {
			return bf.testAny(this._iCameraOptions, ECameraParameters.CONST_ASPECT);
		}

		setProjParams(fFOV: float, fAspect: float, fNearPlane: float, fFarPlane: float): void {
			// Set attributes for the projection matrix
			this._fFOV = fFOV;
			this._fAspect = fAspect;
			this._fNearPlane = fNearPlane;
			this._fFarPlane = fFarPlane;
			this._eCameraType = ECameraTypes.PERSPECTIVE;

			// create the regular projection matrix
			Mat4.perspective(fFOV, fAspect, fNearPlane, fFarPlane, this._m4fProj);

			// create a unit-space matrix 
			// for sky box geometry.
			// this ensures that the 
			// near and far plane enclose 
			// the unit space around the camera
			// Mat4.perspective(fFOV, fAspect, 0.01, 2.0, this._m4fUnitProj);

			bf.setBit(this._iUpdateProjectionFlags, ECameraFlags.k_NewProjectionMatrix);
		}

		setOrthoParams(fWidth: float, fHeight: float, fNearPlane: float, fFarPlane: float): void {
			this._fWidth = fWidth;
			this._fHeight = fHeight;
			this._fNearPlane = fNearPlane;
			this._fFarPlane = fFarPlane;
			this._eCameraType = ECameraTypes.ORTHO;

			// create the regular projection matrix
			Mat4.orthogonalProjection(fWidth, fHeight, fNearPlane, fFarPlane, this._m4fProj);

			// create a unit-space matrix 
			// for sky box geometry.
			// this ensures that the 
			// near and far plane enclose 
			// the unit space around the camera
			// Mat4.matrixOrthoRH(fWidth, fHeight, 0.01, 2.0, this._m4fUnitProj);

			bf.setBit(this._iUpdateProjectionFlags, ECameraFlags.k_NewProjectionMatrix);
		}

		setOffsetOrthoParams(fMinX: float, fMaxX: float, fMinY: float, fMaxY: float, fNearPlane: float, fFarPlane: float): void {
			this._fMinX = fMinX;
			this._fMaxX = fMaxX;
			this._fMinY = fMinY;
			this._fMaxY = fMaxY;
			this._fNearPlane = fNearPlane;
			this._fFarPlane = fFarPlane;
			this._eCameraType = ECameraTypes.OFFSET_ORTHO;

			// create the regular projection matrix
			Mat4.orthogonalProjectionAsymmetric(fMinX, fMaxX, fMinY, fMaxY,
				fNearPlane, fFarPlane, this._m4fProj);

			// create a unit-space matrix 
			// for sky box geometry.
			// this ensures that the 
			// near and far plane enclose 
			// the unit space around the camera
			// Mat4.orthogonalProjectionorthogonalProjectionAsymmetric(fMinX, fMaxX, fMinY, fMaxY,
			//                             0.01, 2.0, this._m4fUnitProj);

			bf.setBit(this._iUpdateProjectionFlags, ECameraFlags.k_NewProjectionMatrix);
		}

		private recalcMatrices(): void {
			this._v3fTargetPos.set(
				this._m4fLocalMatrix.data[__13],
				this._m4fLocalMatrix.data[__23],
				this._m4fLocalMatrix.data[__33]);

			this._v3fTargetPos.negate();

			// the camera view matrix is the
			// inverse of the world matrix
			this._m4fView.set(this.inverseWorldMatrix);
			// sky boxes use the inverse 
			// world matrix of the camera (the
			// camera view matrix) without 
			// any translation information.

			//this.m4fSkyBox.set(this.m4fView);
			// this.m4fSkyBox.data[__14] = 0.0;
			// this.m4fSkyBox.data[__24] = 0.0;
			// this.m4fSkyBox.data[__34] = 0.0;

			// this is combined with the unit
			// space projection matrix to form
			// the sky box viewing matrix
			//this.m4fSkyBox.multiply(this.m4fUnitProj, this.m4fSkyBox);


			// billboard objects use our world matrix
			// without translation
			// this.m4fBillboard.set(this.worldMatrix());
			// this.m4fBillboard.data[__14] = 0.0;
			// this.m4fBillboard.data[__24] = 0.0;
			// this.m4fBillboard.data[__34] = 0.0;
		}

		update(): boolean {
			var isUpdated: boolean = super.update();

			if (this.isProjParamsNew()) {
				this.recalcProjMatrix();
			}

			if (this.isWorldMatrixNew() || bf.testBit(this._iUpdateProjectionFlags, ECameraFlags.k_NewProjectionMatrix)) {
				this._pFrustum.extractFromMatrix(this._m4fProj, this._m4fWorldMatrix, this._pSearchRect);
				// this._m4fRenderStageProj.set(this._m4fProj);

				if (this.isWorldMatrixNew()) {
					this.recalcMatrices();
				}

				// our projView matrix is the projection 
				//matrix multiplied by the inverse of our world matrix  
				this._m4fProj.multiply(this._m4fView, this._m4fProjView);
				isUpdated = true;

				bf.clearBit(this._iUpdateProjectionFlags, ECameraFlags.k_NewProjectionMatrix);
			}

			return isUpdated;
		}

		// applyRenderStageBias(iStage: int): void {
		//    	var fZ_bias = iStage > 1 ? 0.001 : 0.0;

		//     this._m4fRenderStageProj.set(this._m4fProj);
		//     this._m4fRenderStageProjView.set(this._m4fProjView);

		//     this._m4fRenderStageProj[__34] -= fZ_bias;
		//     this._m4fRenderStageProjView[__34] -= fZ_bias;
		//    }


		_renderScene(pViewport: IViewport): void {
			//update the pixel display ratio
			// if (this._eCameraType == ECameraTypes.PERSPECTIVE) {
			// 	mPixelDisplayRatio = (2. * math.tan(this._fFOV * 0.5)) / pViewport.actualHeight;
			// }
			// else {
			// 	mPixelDisplayRatio = (mTop - mBottom) / vp->getActualHeight();
			// }

			//notify prerender scene
			this.preRenderScene.emit();


			pViewport.update();

			//notify postrender scene
			this.postRenderScene.emit();
		}


		_keepLastViewport(pViewport: IViewport): void { this._pLastViewport = pViewport; }
		_getLastViewport(): IViewport { return this._pLastViewport; }
		_getNumRenderedFaces(): int { return 0; }
		_notifyRenderedFaces(nFaces: uint): void { }

		isActive(): boolean {
			return this._pLastViewport && this._pLastViewport.getCamera() === this;
		}

		toString(isRecursive: boolean = false, iDepth: int = 0): string {
			if (!isRecursive) {
				return "<camera" + (this._sName ? " " + this._sName : "") + ">" + " height: " + this.worldPosition.y;
			}

			return super.toString(isRecursive, iDepth);
		}

		projectPoint(v3fPoint: IVec3, v3fDestination?: IVec3): IVec3 {
			if (!isDef(v3fDestination)) {
				v3fDestination = v3fPoint;
			}

			var m4fView: IMat4 = this.viewMatrix;
			var m4fProj: IMat4 = this.projectionMatrix;

			var v4fTmp: IVec4 = Vec4.temp(v3fPoint, 1.);

			v4fTmp = m4fProj.multiplyVec4(m4fView.multiplyVec4(v4fTmp));

			if (v4fTmp.w <= 0.) {
				return null;
			}

			v3fDestination.set((v4fTmp.scale(1. / v4fTmp.w)).xyz);

			var fX: float = math.abs(v3fDestination.x);
			var fY: float = math.abs(v3fDestination.y);
			var fZ: float = math.abs(v3fDestination.z);

			if (fX > 1 || fY > 1 || fZ > 1) {
				return null;
			}

			return v3fDestination;
		}


		getDepthRange(): IDepthRange {
			var pDepthRange: IDepthRange = this._pLastViewport.getDepthRange();

			var zNear: float = this._m4fProj.unprojZ(pDepthRange.min);
			var zFar: float = this._m4fProj.unprojZ(pDepthRange.max);

			return <IDepthRange>{ min: zNear, max: zFar }
		}

		_addDisplayList(pScene: IScene3d, pList: IDisplayList<ISceneObject>, index: uint): void {
			this._pDLTechniques[index] = new DLTechnique(pList, this);
			this._pDLResultStorage[index] = new util.ObjectArray();
		}

		_removeDisplayList(pScene: IScene3d, pList: IDisplayList<ISceneObject>, index: uint): void {
			this._pDLTechniques[index] = null;
			this._pDLResultStorage[index] = null;
		}

		static isCamera(pNode: IEntity): boolean {
			return pNode.type >= EEntityTypes.CAMERA && pNode.type <= EEntityTypes.SHADOW_CASTER;
		}
	}
}

