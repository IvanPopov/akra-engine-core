#ifndef CAMERA_TS
#define CAMERA_TS

#include "common.ts"
#include "IScene3d.ts"
#include "ICamera.ts"
#include "IViewport.ts"
#include "../SceneObject.ts"
#include "geometry/Frustum.ts"

module akra.scene.objects {
	export enum ECameraFlags {
		k_NewProjectionMatrix = 0
	}

	export interface ICameraCache {
		[displayList: string]: ISceneObject[];
	};

	export class DLTechnique {
		list: IDisplayList;
		camera: ICamera;

		private _pPrevResult: ISceneObject[] = null;

		constructor (pList: IDisplayList, pCamera: ICamera) {
			this.list = pList;
			this.camera = pCamera;
		}

		inline findObjects(bQuickSearch: bool = false): ISceneObject[] {
			var pResult: ISceneObject[] = this.list._findObjects(this.camera, 
					bQuickSearch && isDefAndNotNull(this._pPrevResult));

			if (isNull(this._pPrevResult)) {
				this._pPrevResult = pResult;
			}
			
			return this._pPrevResult;
		}
	}

	export class Camera extends SceneObject implements ICamera {
		/** camera type */
		protected _eCameraType: ECameraTypes = ECameraTypes.PERSPECTIVE;
		/** camera options */
		protected _iCameraOptions: int = 0;
		/** update projection bit flag */
		protected _iUpdateProjectionFlags: int = 0;
		
		/** View matrix */
		protected _m4fView: IMat4 = new Mat4;
		/** internal, un-biased projection matrix */
		protected _m4fProj: IMat4 = new Mat4;
		protected _m4fUnitProj: IMat4 = new Mat4;
		/** internal, un-biased projection+view matrix */
		protected _m4fProjView: IMat4 = new Mat4;

		/** Biased for use during current render stage */
		protected _m4fRenderStageProj: IMat4 = new Mat4;
		protected _m4fRenderStageProjView: IMat4 = new Mat4;

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

		protected _pDLTechniques: DLTechnique[] = [];


		// protected _pPrevObjects: ISceneNode[] = null;
		// protected _p

		inline get viewMatrix(): IMat4 { return this._m4fView; }
    	
    	inline get projectionMatrix(): IMat4 { return this._m4fRenderStageProj; }
    	
    	inline get projViewMatrix(): IMat4 { return this._m4fRenderStageProjView; }
    	
    	inline get internalProjectionMatrix(): IMat4 { return this._m4fProj; }
    	
    	inline get internalViewProjMatrix(): IMat4 { return this._m4fProjView; }
    	
    	inline get targetPos(): IVec3 { return this._v3fTargetPos; }
    	
    	inline get fov(): float { return this._fFOV; }
    	inline set fov(fFOV: float) { this._fFOV = fFOV; };

    	inline get aspect(): float { return this._fAspect; }
    	inline set aspect(fAspect: float) { this._fAspect = fAspect; }

    	inline get nearPlane(): float { return this._fNearPlane; }
    	inline set nearPlane(fNearPlane: float) { this._fNearPlane = fNearPlane; }
    	
    	inline get farPlane(): float { return this._fFarPlane; }
    	inline set farPlane(fFarPlane: float) { this._fFarPlane = fFarPlane; }
    	
    	inline get viewDistance(): float { return this._fFarPlane - this._fNearPlane; }
    	inline get searchRect(): IRect3d { return this._pSearchRect; }
    	inline get frustum(): IFrustum { return this._pFrustum; }

		constructor (pScene: IScene3d) {
			super(pScene);

			this.type = EEntityTypes.CAMERA;
		}

		create(): bool {
			var isOK: bool = super.create();

			if (isOK) {
				this._v3fTargetPos.set(
					this._m4fLocalMatrix.data[__13], 
					this._m4fLocalMatrix.data[__23], 
					this._m4fLocalMatrix.data[__33]);
				this._v3fTargetPos.negate();

				this.setProjParams(this._fFOV, this._fAspect, this._fNearPlane, this._fFarPlane);
				this.recalcMatrices();

				var pScene: IScene3d = this._pScene;

				this.connect(pScene, SIGNAL(displayListAdded), SLOT(_addDisplayList));
				this.connect(pScene, SIGNAL(displayListRemoved), SLOT(_removeDisplayList));

				for (var i: uint = 0; i < pScene.totalDL; ++ i) {
					var pList: IDisplayList = pScene.getDisplayList(i);
					
					if (!isNull(pList)) {
						this._addDisplayList(pScene, pList, i);
					}
				}
			}

			return isOK;
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




		display(iList: uint = /*DL_DEFAULT*/0): ISceneObject[] {
			var pObjects: ISceneObject[] = this._pDLTechniques[iList].findObjects(!this.isUpdated());

			return pObjects;
		}

		setParameter(eParam: ECameraParameters, pValue: any): void {
			if (eParam === ECameraParameters.CONST_ASPECT && <bool>pValue) {
				SET_ALL(this._iCameraOptions, <int>eParam);
			}
		}

		isConstantAspect(): bool {
			return TEST_ANY(this._iCameraOptions, ECameraParameters.CONST_ASPECT);
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
		    Mat4.perspective(fFOV, fAspect, 0.01, 2.0, this._m4fUnitProj);

		    TRUE_BIT(this._iUpdateProjectionFlags, ECameraFlags.k_NewProjectionMatrix);
    	}

    	setOrthoParams(fWidth: float, fHeight: float, fNearPlane: float, fFarPlane: float): void {
		    CRITICAL("TODO: setOrthoParams();");
		    /*
		    
		    this._fWidth = fWidth;
		    this._fHeight = fHeight;
		    this._fNearPlane = fNearPlane;
		    this._fFarPlane = fFarPlane;
		    this._eCameraType = ECameraTypes.ORTHO;

		    // create the regular projection matrix
		    Mat4.matrixOrthoRH(fWidth, fHeight, fNearPlane, fFarPlane, this._m4fProj);

		    // create a unit-space matrix 
		    // for sky box geometry.
		    // this ensures that the 
		    // near and far plane enclose 
		    // the unit space around the camera
		    Mat4.matrixOrthoRH(fWidth, fHeight, 0.01, 2.0, this._m4fUnitProj);

		    TRUE_BIT(this._iUpdateProjectionFlags, ECameraFlags.k_NewProjectionMatrix);

		    */
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
		    Mat4./*orthogonalProjection*/orthogonalProjectionAsymmetric(fMinX, fMaxX, fMinY, fMaxY,
		                                fNearPlane, fFarPlane, this._m4fProj);

		    // create a unit-space matrix 
		    // for sky box geometry.
		    // this ensures that the 
		    // near and far plane enclose 
		    // the unit space around the camera
		    Mat4./*orthogonalProjection*/orthogonalProjectionAsymmetric(fMinX, fMaxX, fMinY, fMaxY,
		                                0.01, 2.0, this._m4fUnitProj);

		    TRUE_BIT(this._iUpdateProjectionFlags, ECameraFlags.k_NewProjectionMatrix);
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

    	update(): bool {
    		var isUpdated: bool = super.update();

		    if (this.isWorldMatrixNew() || TEST_BIT(this._iUpdateProjectionFlags, ECameraFlags.k_NewProjectionMatrix)) {
		    	this._pFrustum.extractFromMatrix(this._m4fProj, this._m4fWorldMatrix, this._pSearchRect);

		        // our projView matrix is the projection 
		        //matrix multiplied by the inverse of our world matrix  
		        this._m4fProj.multiply(this._m4fView, this._m4fRenderStageProjView);

		        isUpdated = true;
		    }

		    return isUpdated;
    	}

		applyRenderStageBias(iStage: int): void {
	    	var fZ_bias = iStage > 1 ? 0.001 : 0.0;

		    this._m4fRenderStageProj.set(this._m4fProj);
		    this._m4fRenderStageProjView.set(this._m4fProjView);

		    this._m4fRenderStageProj[__34] -= fZ_bias;
		    this._m4fRenderStageProjView[__34] -= fZ_bias;
	    }

    	lookAt(v3fFrom: IVec3, v3fCenter: IVec3, v3fUp?: IVec3): void;
    	lookAt(v3fCenter: IVec3, v3fUp?: IVec3): void;
    	lookAt(v3f?): void {
    		var v3fFrom: IVec3, v3fCenter: IVec3, v3fUp: IVec3;

		    if (arguments.length < 3) {
		        v3fFrom = this.worldPosition;
		        v3fCenter = <IVec3>arguments[0];
		        v3fUp = <IVec3>arguments[1];
		    }
		    else {
		        v3fFrom = <IVec3>arguments[0];
		        v3fCenter = <IVec3>arguments[1];
		        v3fUp = <IVec3>arguments[2];
		    }

		    v3fUp = v3fUp || vec3(0., 1., 0.);

		    var v3fParentPos: IVec3 = (<Node>this.parent).worldPosition;
		    var m4fTemp: IMat4 = Mat4.lookAt(v3fFrom, v3fCenter, v3fUp, mat4()).inverse();
		    var pData: Float32Array = m4fTemp.data;

		    switch (this._eInheritance) {
		        case ENodeInheritance.ALL : 
		            (<Node>this._pParent).inverseWorldMatrix.multiply(m4fTemp, m4fTemp);
		            m4fTemp.toQuat4(this._qRotation);
		            this.setPosition(pData[__14], pData[__24], pData[__34]);    
		            break;
		        case ENodeInheritance.ROTSCALE : 
		            var m3fTemp = m4fTemp.toMat3();
		            m3fTemp = (<Node>this._pParent).inverseWorldMatrix.toMat3().multiply(m3fTemp, mat3());
		            m3fTemp.toQuat4(this._qRotation);
		            this.setPosition(pData[__14], pData[__24], pData[__34]);
		            break;
		        default :
		            m4fTemp.toQuat4(this._qRotation);
		            this.setPosition(
		            	pData[__14] - v3fParentPos.x, 
		            	pData[__24] - v3fParentPos.y,
		                pData[__34] - v3fParentPos.z);
		    }
    	}

    	_renderScene(pViewport: IViewport): void {
    		//update the pixel display ratio
			// if (this._eCameraType == ECameraTypes.PERSPECTIVE) {
			// 	mPixelDisplayRatio = (2. * math.tan(this._fFOV * 0.5)) / pViewport.actualHeight;
			// }
			// else {
			// 	mPixelDisplayRatio = (mTop - mBottom) / vp->getActualHeight();
			// }

			//notify prerender scene
			this.preRenderScene();


			pViewport.update();

			//notify postrender scene
			this.postRenderScene();
    	}


    	_keepLastViewport(pViewport: IViewport): void { this._pLastViewport = pViewport; }
    	_getLastViewport(): IViewport { return this._pLastViewport; }
    	_getNumRenderedFaces(): int { return 0; }
    	_notifyRenderedFaces(nFaces: uint): void {}

    	toString(isRecursive: bool = false, iDepth: int = 0): string {
		    if (!isRecursive) {
		        return "<camera" + (this._sName? " " + this._sName: "") + ">";
		    }

		    return super.toString(isRecursive, iDepth);
    	}

    	_addDisplayList(pScene: IScene3d, pList: IDisplayList, index: uint): void {
    		this._pDLTechniques[index] = new DLTechnique(pList, this);
    	}

    	_removeDisplayList(pScene: IScene3d, pList: IDisplayList, index: uint): void {
    		this._pDLTechniques[index] = null;
    	}



    	BEGIN_EVENT_TABLE(Camera);
    		BROADCAST(preRenderScene, VOID);
    		BROADCAST(postRenderScene, VOID);
    	END_EVENT_TABLE();
	}
}

#endif