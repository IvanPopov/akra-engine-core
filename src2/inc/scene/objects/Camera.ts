#ifndef CAMERA_TS
#define CAMERA_TS

#include "common.h"
#include "IScene3d.ts"
#include "ICamera.ts"
#include "IViewport.ts"
#include "../SceneObject.ts"
#include "geometry/Frustum.ts"

module akra.scene.objects {
	export enum ECameraFlags {
		k_NewProjectionMatrix = 0
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
		/** internal, un-biased view+projection matrix */
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
		protected _pFrustumVertices: IVec4[] = new Array(8);
		protected pFrustumVertices: IVec4[] = new Array(8);

		protected _pLastViewport: IViewport = null;


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

				//register default display list
				//if default display list not founded
				if (isNull(this._pScene.getDisplayList())) {
					//this._pScene.addDisplayList();
				}
			}

			return isOK;
		}

		display(csList: string = null): ISceneObject[] {
			return this._pScene._findNodes(this, csList);
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

    	recalcMatrices(): void {
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

    	update(): void {
    		super.update();

		    if(TEST_BIT(this._iUpdateProjectionFlags, ECameraFlags.k_NewProjectionMatrix)){
		        this.extractFrustumVertices();

		        this._m4fRenderStageProj.set(this._m4fProj);

		        if (!this.isWorldMatrixNew()) {
		            this.rebuildSearchRectAndFrustum();

		            // our view proj matrix is the inverse of our world matrix
		            // multiplied by the projection matrix
		            this._m4fProj.multiply(this._m4fView, this._m4fRenderStageProjView);
		        }
		    }

		    if (this.isWorldMatrixNew()) {
		        this.recalcMatrices();
		        this.rebuildSearchRectAndFrustum();

		        // our view proj matrix is the inverse of our world matrix
		        // multiplied by the projection matrix
		        this._m4fProj.multiply(this._m4fView, this._m4fRenderStageProjView);
		    }
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

    	private extractFrustumVertices(): void {
		    var _pFrustumVertices: IVec4[] = this._pFrustumVertices;

		    var m4fProj: IMat4 = this._m4fProj;

		    // this._pFrustumVertices, this.pFrustumVertices
		    // [0] - this._v4fLeftBottomNear;
		    // [1] - this._v4fRightBottomNear;
		    // [2] - this._v4fLeftTopNear;
		    // [3] - this._v4fRightTopNear;

		    // [4] - this._v4fLeftBottomFar;
		    // [5] - this._v4fRightBottomFar;
		    // [6] - this._v4fLeftTopFar;
		    // [7] - this._v4fRightTopFar;

		    // m4fProj.unproj(vec4(-1,-1,-1,1),this._v4fLeftBottomNear);
		    // m4fProj.unproj(vec4(1,-1,-1,1),this._v4fRightBottomNear);
		    // m4fProj.unproj(vec4(-1,1,-1,1),this._v4fLeftTopNear);
		    // m4fProj.unproj(vec4(1,1,-1,1),this._v4fRightTopNear);

		    // m4fProj.unproj(vec4(-1,-1,1,1),this._v4fLeftBottomFar);
		    // m4fProj.unproj(vec4(1,-1,1,1),this._v4fRightBottomFar);
		    // m4fProj.unproj(vec4(-1,1,1,1),this._v4fLeftTopFar);
		    // m4fProj.unproj(vec4(1,1,1,1),this._v4fRightTopFar);

		    m4fProj.unproj(vec4(-1, -1, -1, 1), _pFrustumVertices[0]);
		    m4fProj.unproj(vec4(1, -1, -1, 1), _pFrustumVertices[1]);
		    m4fProj.unproj(vec4(-1, 1, -1, 1), _pFrustumVertices[2]);
		    m4fProj.unproj(vec4(1, 1, -1, 1), _pFrustumVertices[3]);

		    m4fProj.unproj(vec4(-1, -1, 1, 1), _pFrustumVertices[4]);
		    m4fProj.unproj(vec4(1,-1, 1, 1), _pFrustumVertices[5]);
		    m4fProj.unproj(vec4(-1, 1, 1, 1), _pFrustumVertices[6]);
		    m4fProj.unproj(vec4(1, 1, 1, 1), _pFrustumVertices[7]);

		    CLEAR_BIT(this._iUpdateProjectionFlags, ECameraFlags.k_NewProjectionMatrix);
		};

		private rebuildSearchRectAndFrustum () {
		    //нормали всех плоскостей frustum-а смотрят наружу

		    var m4fCameraWorld: IMat4 = this._m4fWorldMatrix;
		    var pFrustum: IFrustum = this._pFrustum;

		    // var v4fLeftBottomNear = m4fCameraWorld.multiply(this._v4fLeftBottomNear,Vec4());
		    // var v4fRightBottomNear = m4fCameraWorld.multiply(this._v4fRightBottomNear,Vec4());
		    // var v4fLeftTopNear = m4fCameraWorld.multiply(this._v4fLeftTopNear,Vec4());
		    // var v4fRightTopNear = m4fCameraWorld.multiply(this._v4fRightTopNear,Vec4());

		    // var v4fLeftBottomFar = m4fCameraWorld.multiply(this._v4fLeftBottomFar,Vec4());
		    // var v4fRightBottomFar = m4fCameraWorld.multiply(this._v4fRightBottomFar,Vec4());
		    // var v4fLeftTopFar = m4fCameraWorld.multiply(this._v4fLeftTopFar,Vec4());
		    // var v4fRightTopFar = m4fCameraWorld.multiply(this._v4fRightTopFar,Vec4());
		    
		    var _pFrustumVertices: IVec4[] = this._pFrustumVertices;
		    var pFrustumVertices: IVec4[] = this.pFrustumVertices;

		    ////////////////////////////////////////////////////////////////////////////////
		    
		    var v4fLeftBottomNear: IVec4 = m4fCameraWorld.multiplyVec4(_pFrustumVertices[0],pFrustumVertices[0]);
		    var v4fRightBottomNear: IVec4 = m4fCameraWorld.multiplyVec4(_pFrustumVertices[1],pFrustumVertices[1]);
		    var v4fLeftTopNear: IVec4 = m4fCameraWorld.multiplyVec4(_pFrustumVertices[2],pFrustumVertices[2]);
		    var v4fRightTopNear: IVec4 = m4fCameraWorld.multiplyVec4(_pFrustumVertices[3],pFrustumVertices[3]);

		    var v4fLeftBottomFar: IVec4 = m4fCameraWorld.multiplyVec4(_pFrustumVertices[4],pFrustumVertices[4]);
		    var v4fRightBottomFar: IVec4 = m4fCameraWorld.multiplyVec4(_pFrustumVertices[5],pFrustumVertices[5]);
		    var v4fLeftTopFar: IVec4 = m4fCameraWorld.multiplyVec4(_pFrustumVertices[6],pFrustumVertices[6]);
		    var v4fRightTopFar: IVec4 = m4fCameraWorld.multiplyVec4(_pFrustumVertices[7],pFrustumVertices[7]);

		    ////////////////////////////////////////////////////////////////////////////////

		    var v4fLeftBottomNearData: IVec4 = v4fLeftBottomNear;
		    var v4fRightBottomNearData: IVec4 = v4fRightBottomNear;
		    var v4fLeftTopNearData: IVec4 = v4fLeftTopNear;
		    var v4fRightTopNearData: IVec4 = v4fRightTopNear;

		    var v4fLeftBottomFarData: IVec4 = v4fLeftBottomFar;
		    var v4fRightBottomFarData: IVec4 = v4fRightBottomFar;
		    var v4fLeftTopFarData: IVec4 = v4fLeftTopFar;
		    var v4fRightTopFarData: IVec4 = v4fRightTopFar;


		    var x1: float, y1: float, z1: float; /*первый вектор*/
		    var x2: float, y2: float, z2: float; /*второй вектор*/
		    var x3: float, y3: float, z3: float; /*векторное произведение*/
		    var fLength: float, fInvLength: float; /*длина скалярного произведения*/

		    var pDirectionLTNLBN = vec3();/*LTNLBN - left top near - left bottom near; /*from - to*/
		    var pDirectionLTNRTN = vec3();/*LTNRTN - left top near - right top near;*/
		    var pDirectionLTNLTF = vec3();/*LTNLTF - left top near - left top far;*/
		    var pDirectionRBFRTF = vec3();/*RBFRTF - right bottom far - right top far;*/
		    var pDirectionRBFRBN = vec3();/*RBFRBN - right bottom far - right bottom near;*/
		    var pDirectionRBFLBF = vec3();/*RBFLBF - right bottom far - left bottom far;*/

		    pDirectionLTNLBN.x = v4fLeftBottomNearData.x - v4fLeftTopNearData.x;
		    pDirectionLTNLBN.y = v4fLeftBottomNearData.y - v4fLeftTopNearData.y;
		    pDirectionLTNLBN.z = v4fLeftBottomNearData.z - v4fLeftTopNearData.z;

		    pDirectionLTNRTN.x = v4fRightTopNearData.x - v4fLeftTopNearData.x;
		    pDirectionLTNRTN.y = v4fRightTopNearData.y - v4fLeftTopNearData.y;
		    pDirectionLTNRTN.z = v4fRightTopNearData.z - v4fLeftTopNearData.z;

		    pDirectionLTNLTF.x = v4fLeftTopFarData.x - v4fLeftTopNearData.x;
		    pDirectionLTNLTF.y = v4fLeftTopFarData.y - v4fLeftTopNearData.y;
		    pDirectionLTNLTF.z = v4fLeftTopFarData.z - v4fLeftTopNearData.z;

		    pDirectionRBFRTF.x = v4fRightTopFarData.x - v4fRightBottomFarData.x;
		    pDirectionRBFRTF.y = v4fRightTopFarData.y - v4fRightBottomFarData.y;
		    pDirectionRBFRTF.z = v4fRightTopFarData.z - v4fRightBottomFarData.z;

		    pDirectionRBFRBN.x = v4fRightBottomNearData.x - v4fRightBottomFarData.x;
		    pDirectionRBFRBN.y = v4fRightBottomNearData.y - v4fRightBottomFarData.y;
		    pDirectionRBFRBN.z = v4fRightBottomNearData.z - v4fRightBottomFarData.z;

		    pDirectionRBFLBF.x = v4fLeftBottomFarData.x - v4fRightBottomFarData.x;
		    pDirectionRBFLBF.y = v4fLeftBottomFarData.y - v4fRightBottomFarData.y;
		    pDirectionRBFLBF.z = v4fLeftBottomFarData.z - v4fRightBottomFarData.z;

		    /////////////////////////////////////////

		    var testPoint1: IVec4 = v4fLeftTopNearData;
		    var testPoint2: IVec4 = v4fRightBottomFarData;

		    /////////////////////////////////////////

		    //near plane
		    x1 = pDirectionLTNLBN.x;
		    y1 = pDirectionLTNLBN.y;
		    z1 = pDirectionLTNLBN.z;

		    x2 = pDirectionLTNRTN.x;
		    y2 = pDirectionLTNRTN.y;
		    z2 = pDirectionLTNRTN.z;

		    //normal
		    x3 = y1*z2 - z1*y2;
		    y3 = z1*x2 - x1*z2;
		    z3 = x1*y2 - y1*x2;

		    fLength = math.sqrt(x3*x3 + y3*y3 + z3*z3);
		    fInvLength = 1/fLength;

		    x3 *= fInvLength;
		    y3 *= fInvLength;
		    z3 *= fInvLength;

		    var v3fNormalNearData: IVec3 = pFrustum.nearPlane.normal;
		    v3fNormalNearData.x = x3;
		    v3fNormalNearData.y = y3;
		    v3fNormalNearData.z = z3;
		    //constant
		    pFrustum.nearPlane.distance = -(testPoint1.x*x3 + testPoint1.y*y3 + testPoint1.z*z3);

		    /////////////////////////////////////////

		    //left plane
		    x1 = pDirectionLTNLTF.x;
		    y1 = pDirectionLTNLTF.y;
		    z1 = pDirectionLTNLTF.z;

		    x2 = pDirectionLTNLBN.x;
		    y2 = pDirectionLTNLBN.y;
		    z2 = pDirectionLTNLBN.z;

		    //normal
		    x3 = y1*z2 - z1*y2;
		    y3 = z1*x2 - x1*z2;
		    z3 = x1*y2 - y1*x2;

		    fLength = math.sqrt(x3*x3 + y3*y3 + z3*z3);
		    fInvLength = 1/fLength;

		    x3 *= fInvLength;
		    y3 *= fInvLength;
		    z3 *= fInvLength;

		    var v3fNormalLeftData: IVec3 = pFrustum.leftPlane.normal;
		    v3fNormalLeftData.x = x3;
		    v3fNormalLeftData.y = y3;
		    v3fNormalLeftData.z = z3;
		    //constant
		    pFrustum.leftPlane.distance = -(testPoint1.x*x3 + testPoint1.y*y3 + testPoint1.z*z3);

		    /////////////////////////////////////////

		    //top plane
		    x1 = pDirectionLTNRTN.x;
		    y1 = pDirectionLTNRTN.y;
		    z1 = pDirectionLTNRTN.z;

		    x2 = pDirectionLTNLTF.x;
		    y2 = pDirectionLTNLTF.y;
		    z2 = pDirectionLTNLTF.z;

		    //normal
		    x3 = y1*z2 - z1*y2;
		    y3 = z1*x2 - x1*z2;
		    z3 = x1*y2 - y1*x2;

		    fLength = math.sqrt(x3*x3 + y3*y3 + z3*z3);
		    fInvLength = 1/fLength;

		    x3 *= fInvLength;
		    y3 *= fInvLength;
		    z3 *= fInvLength;

		    var v3fNormalTopData: IVec3 = pFrustum.topPlane.normal;
		    v3fNormalTopData.x = x3;
		    v3fNormalTopData.y = y3;
		    v3fNormalTopData.z = z3;
		    //constant
		    pFrustum.topPlane.distance = -(testPoint1.x*x3 + testPoint1.y*y3 + testPoint1.z*z3);

		    /////////////////////////////////////////
		    
		    //right plane
		    x1 = pDirectionRBFRTF.x;
		    y1 = pDirectionRBFRTF.y;
		    z1 = pDirectionRBFRTF.z;

		    x2 = pDirectionRBFRBN.x;
		    y2 = pDirectionRBFRBN.y;
		    z2 = pDirectionRBFRBN.z;

		    //normal
		    x3 = y1*z2 - z1*y2;
		    y3 = z1*x2 - x1*z2;
		    z3 = x1*y2 - y1*x2;

		    fLength = math.sqrt(x3*x3 + y3*y3 + z3*z3);
		    fInvLength = 1/fLength;

		    x3 *= fInvLength;
		    y3 *= fInvLength;
		    z3 *= fInvLength;

		    var v3fNormalRightData: IVec3 = pFrustum.rightPlane.normal;
		    v3fNormalRightData.x = x3;
		    v3fNormalRightData.y = y3;
		    v3fNormalRightData.z = z3;
		    //constant
		    pFrustum.rightPlane.distance = -(testPoint2.x*x3 + testPoint2.y*y3 + testPoint2.z*z3);

		    /////////////////////////////////////////
		    
		    //bottom plane
		    x1 = pDirectionRBFRBN.x;
		    y1 = pDirectionRBFRBN.y;
		    z1 = pDirectionRBFRBN.z;

		    x2 = pDirectionRBFLBF.x;
		    y2 = pDirectionRBFLBF.y;
		    z2 = pDirectionRBFLBF.z;

		    //normal
		    x3 = y1*z2 - z1*y2;
		    y3 = z1*x2 - x1*z2;
		    z3 = x1*y2 - y1*x2;

		    fLength = math.sqrt(x3*x3 + y3*y3 + z3*z3);
		    fInvLength = 1. / fLength;

		    x3 *= fInvLength;
		    y3 *= fInvLength;
		    z3 *= fInvLength;

		    var v3fNormalBottomData: IVec3 = pFrustum.bottomPlane.normal;

		    v3fNormalBottomData.x = x3;
		    v3fNormalBottomData.y = y3;
		    v3fNormalBottomData.z = z3;

		    //constant
		    pFrustum.bottomPlane.distance = -(testPoint2.x*x3 + testPoint2.y*y3 + testPoint2.z*z3);

		    /////////////////////////////////////////
		    
		    //far plane
		    x1 = pDirectionRBFLBF.x;
		    y1 = pDirectionRBFLBF.y;
		    z1 = pDirectionRBFLBF.z;

		    x2 = pDirectionRBFRTF.x;
		    y2 = pDirectionRBFRTF.y;
		    z2 = pDirectionRBFRTF.z;

		    //normal
		    x3 = y1*z2 - z1*y2;
		    y3 = z1*x2 - x1*z2;
		    z3 = x1*y2 - y1*x2;

		    fLength = math.sqrt(x3*x3 + y3*y3 + z3*z3);
		    fInvLength = 1/fLength;

		    x3 *= fInvLength;
		    y3 *= fInvLength;
		    z3 *= fInvLength;

		    var v3fNormalFarData: IVec3 = pFrustum.farPlane.normal;

		    v3fNormalFarData.x = x3;
		    v3fNormalFarData.y = y3;
		    v3fNormalFarData.z = z3;

		    //constant
		    pFrustum.farPlane.distance = -(testPoint2.x*x3 + testPoint2.y*y3 + testPoint2.z*z3);

		    /////////////////////////////////////////////////////////////////

		    // build a box around our frustum
		    var pWorldData: IVec3 = this.worldPosition;

		    var pSearchRect: IRect3d = this._pSearchRect;

		    pSearchRect.set(pWorldData.x, pWorldData.x,
		                    pWorldData.y, pWorldData.y,
		                    pWorldData.z, pWorldData.z);

		    pSearchRect.unionPoint(<IVec3><any>v4fLeftBottomNear);
		    pSearchRect.unionPoint(<IVec3><any>v4fRightBottomNear);
		    pSearchRect.unionPoint(<IVec3><any>v4fLeftTopNear);
		    pSearchRect.unionPoint(<IVec3><any>v4fRightTopNear);
		    pSearchRect.unionPoint(<IVec3><any>v4fLeftBottomFar);
		    pSearchRect.unionPoint(<IVec3><any>v4fRightBottomFar);
		    pSearchRect.unionPoint(<IVec3><any>v4fLeftTopFar);
		    pSearchRect.unionPoint(<IVec3><any>v4fRightTopFar);
		};

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

    	BEGIN_EVENT_TABLE(Camera);
    		BROADCAST(preRenderScene, VOID);
    		BROADCAST(postRenderScene, VOID);
    	END_EVENT_TABLE();
	}
}

#endif