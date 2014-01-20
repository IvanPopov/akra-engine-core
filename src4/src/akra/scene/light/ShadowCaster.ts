/// <reference path="../../idl/IShadowCaster.ts" />
/// <reference path="../objects/Camera.ts" />
/// <reference path="../../util/ObjectArray.ts" />
/// <reference path="../../math/Mat4.ts" />
/// <reference path="../../geometry/Rect3d.ts" />

module akra.scene.light {
	import Mat4 = math.Mat4;

	import Vec2 = math.Vec2;
	import Vec3 = math.Vec3;
	import Vec4 = math.Vec4;

	import __11 = math.__11;
	import __12 = math.__12;
	import __13 = math.__13;
	import __14 = math.__14;
	import __21 = math.__21;
	import __22 = math.__22;
	import __23 = math.__23;
	import __24 = math.__24;
	import __31 = math.__31;
	import __32 = math.__32;
	import __33 = math.__33;
	import __34 = math.__34;
	import __41 = math.__41;
	import __42 = math.__42;
	import __43 = math.__43;
	import __44 = math.__44;

	export class ShadowCaster extends objects.Camera implements IShadowCaster {
		protected _pLightPoint: ILightPoint = null;
		protected _iFace: uint = 0;
		protected _pAffectedObjects: IObjectArray<ISceneObject> = new util.ObjectArray<ISceneObject>();
		protected _m4fOptimizedProj: IMat4 = new Mat4();
		protected _isShadowCasted: boolean = false;

		get lightPoint(): ILightPoint {
			return this._pLightPoint;
		}

		get face(): uint {
			return this._iFace;
		}

		get affectedObjects(): IObjectArray<ISceneObject> {
			return this._pAffectedObjects;
		}

		get optimizedProjection(): IMat4 {
			return this._m4fOptimizedProj;
		}

		get isShadowCasted(): boolean {
			return this._isShadowCasted;
		}
		set isShadowCasted(isShadowCasted: boolean) {
			this._isShadowCasted = isShadowCasted;
		}

		constructor(pLightPoint: ILightPoint, iFace: uint = ECubeFace.POSITIVE_X) {
			super(pLightPoint.scene, EEntityTypes.SHADOW_CASTER);

			this._pLightPoint = pLightPoint;
			this._iFace = iFace;
		}

		_optimizeProjectionMatrix(pEffectiveCameraFrustum: IFrustum): void {
			if (this._pAffectedObjects.length == 0) {
				this._m4fOptimizedProj.set(this.projectionMatrix);
				return;
			}

			var m4fView: IMat4 = this.viewMatrix;
			var m4fProj: IMat4 = this.projectionMatrix;
			var m4fProjData: Float32Array = m4fProj.data;

			var pBox: IRect3d = geometry.Rect3d.temp();

			var pAffectedObjects: IObjectArray<ISceneObject> = this._pAffectedObjects;

			var fX0: float, fX1: float, fY0: float, fY1: float, fZ0: float, fZ1: float;
			var fX: float, fY: float, fZ: float, fW: float;

			var fX_Left: float, fY_Bottom: float;
			var fX_Right: float, fY_Top: float;
			var fZ_Near: float, fZ_Far: float;

			//первый бокс должен быть, либо построен по первому элементу, что приводит к усложнению функции
			//либо записан таким образом (то есть минимально (максимально) возможные значения), тогда можно просто все делать в цикле
			var fXRes_Left: float = 1., fXRes_Right: float = -1,
				fYRes_Bottom: float = 1, fYRes_Top: float = -1,
				fZRes_Near: float = 1, fZRes_Far: float = -1;


			var fTmp: float;

			for (var i: int = 0; i < pAffectedObjects.length; i++) {
				var pObject: ISceneObject = pAffectedObjects.value(i);

				if (!pObject.shadow) {
					continue;
				}

				pBox.set(pObject.worldBounds);
				pBox.transform(m4fView);

				fX0 = pBox.x0; fX1 = pBox.x1;
				fY0 = pBox.y0; fY1 = pBox.y1;
				fZ0 = pBox.z0; fZ1 = pBox.z1;

				//z - отрицательное => ближняя к камере грань fZ1, а fZ0 - дальняя

				//left bottom near

				fX = m4fProjData[__11] * fX0 + m4fProjData[__12] * fY0 + m4fProjData[__13] * fZ1 + m4fProjData[__14];
				fY = m4fProjData[__21] * fX0 + m4fProjData[__22] * fY0 + m4fProjData[__23] * fZ1 + m4fProjData[__24];
				fZ = m4fProjData[__31] * fX0 + m4fProjData[__32] * fY0 + m4fProjData[__33] * fZ1 + m4fProjData[__34];
				fW = m4fProjData[__41] * fX0 + m4fProjData[__42] * fY0 + m4fProjData[__43] * fZ1 + m4fProjData[__44];

				if (fW <= 0) {
					//обходим особые случаи
					fX = -1;
					fY = -1;
					fZ = -1;
					fW = 1;
				}

				fX_Left = fX / fW;
				fY_Bottom = fY / fW;

				////////////////////////////////
				//z near
				fZ_Near = fZ / fW;
				////////////////////////////////

				//left bottom far

				fX = m4fProjData[__11] * fX0 + m4fProjData[__12] * fY0 + m4fProjData[__13] * fZ0 + m4fProjData[__14];
				fY = m4fProjData[__21] * fX0 + m4fProjData[__22] * fY0 + m4fProjData[__23] * fZ0 + m4fProjData[__24];
				fZ = m4fProjData[__31] * fX0 + m4fProjData[__32] * fY0 + m4fProjData[__33] * fZ0 + m4fProjData[__34];
				fW = m4fProjData[__41] * fX0 + m4fProjData[__42] * fY0 + m4fProjData[__43] * fZ0 + m4fProjData[__44];
				//в этой части особенностей нет, так как w всегда больше нуля, иначе объект будет вне frustum-а

				fTmp = fX / fW;
				fX_Left = (fTmp < fX_Left) ? fTmp : fX_Left;

				fTmp = fY / fW;
				fY_Bottom = (fTmp < fY_Bottom) ? fTmp : fY_Bottom;


				////////////////////////////////
				//z far
				fZ_Far = fZ / fW;
				////////////////////////////////

				//right top near

				fX = m4fProjData[__11] * fX1 + m4fProjData[__12] * fY1 + m4fProjData[__13] * fZ1 + m4fProjData[__14];
				fY = m4fProjData[__21] * fX1 + m4fProjData[__22] * fY1 + m4fProjData[__23] * fZ1 + m4fProjData[__24];
				fW = m4fProjData[__41] * fX1 + m4fProjData[__42] * fY1 + m4fProjData[__43] * fZ1 + m4fProjData[__44];

				if (fW <= 0) {
					//обходим особые случаи
					fX = 1;
					fY = 1;
					fW = 1;
				}

				fX_Right = fX / fW;
				fY_Top = fY / fW;

				//right top far

				fX = m4fProjData[__11] * fX1 + m4fProjData[__12] * fY1 + m4fProjData[__13] * fZ0 + m4fProjData[__14];
				fY = m4fProjData[__21] * fX1 + m4fProjData[__22] * fY1 + m4fProjData[__23] * fZ0 + m4fProjData[__24];
				fW = m4fProjData[__41] * fX1 + m4fProjData[__42] * fY1 + m4fProjData[__43] * fZ0 + m4fProjData[__44];
				//в этой части особенностей нет, так как w всегда больше нуля, иначе объект будет вне frustum-а

				fTmp = fX / fW;
				fX_Right = (fTmp > fX_Right) ? fTmp : fX_Right;

				fTmp = fY / fW;
				fY_Top = (fTmp > fY_Top) ? fTmp : fY_Top;

				////////////////////////////////

				fXRes_Left = (fX_Left < fXRes_Left) ? fX_Left : fXRes_Left;
				fXRes_Right = (fX_Right > fXRes_Right) ? fX_Right : fXRes_Right;

				fYRes_Bottom = (fY_Bottom < fYRes_Bottom) ? fY_Bottom : fYRes_Bottom;
				fYRes_Top = (fY_Top > fYRes_Top) ? fY_Top : fYRes_Top;

				fZRes_Near = (fZ_Near < fZRes_Near) ? fZ_Near : fZRes_Near;
				fZRes_Far = (fZ_Far > fZRes_Far) ? fZ_Far : fZRes_Far;
			}

			//test with camera frustum

			var pCameraBox: IRect2d = this._getBoxForCameraFrustum(pEffectiveCameraFrustum, new geometry.Rect2d());

			var fCameraMinX: float = math.max(pCameraBox.x0, -1);
			var fCameraMaxX: float = math.min(pCameraBox.x1, 1);

			var fCameraMinY: float = math.max(pCameraBox.y0, -1);
			var fCameraMaxY: float = math.min(pCameraBox.y1, 1);

			fXRes_Left = math.max((fXRes_Left < -1 || fXRes_Left == 1) ? -1 : fXRes_Left, fCameraMinX);
			fXRes_Right = math.min((fXRes_Right > 1 || fXRes_Right == -1) ? 1 : fXRes_Right, fCameraMaxX);

			fYRes_Bottom = math.max((fYRes_Bottom < -1 || fYRes_Bottom == 1) ? -1 : fYRes_Bottom, fCameraMinY);
			fYRes_Top = math.min((fYRes_Top > 1 || fYRes_Top == -1) ? 1 : fYRes_Top, fCameraMaxY);

			fZRes_Near = (fZRes_Near < -1 || fZRes_Near == 1) ? -1 : fZRes_Near;
			fZRes_Far = (fZRes_Far > 1 || fZRes_Far == -1) ? 1 : fZRes_Far;

			//optimized parameters

			var v4fTmp1: IVec4 = m4fProj.unproj(Vec3.temp(fXRes_Left, fYRes_Bottom, fZRes_Near), Vec4.temp());
			var v4fTmp2: IVec4 = m4fProj.unproj(Vec3.temp(fXRes_Right, fYRes_Top, fZRes_Near), Vec4.temp());

			//////////////////////////


			fX_Left = v4fTmp1.x;
			fX_Right = v4fTmp2.x;
			fY_Bottom = v4fTmp1.y;
			fY_Top = v4fTmp2.y;
			fZ_Near = v4fTmp1.z;
			fZ_Far = m4fProj.unprojZ(fZRes_Far);

			if (m4fProj.isOrthogonalProjection()) {
				//ortho-projection
				Mat4.orthogonalProjectionAsymmetric(fX_Left, fX_Right, fY_Bottom, fY_Top, -fZ_Near, -fZ_Far, this._m4fOptimizedProj);
			}
			else {
				//frustum
				Mat4.frustum(fX_Left, fX_Right, fY_Bottom, fY_Top, -fZ_Near, -fZ_Far, this._m4fOptimizedProj);
			}
		}

		protected _getBoxForCameraFrustum(pEffectiveCameraFrustum: IFrustum, pDestination?: IRect2d): IRect2d {
			if (!isDef(pDestination)) {
				pDestination = new geometry.Rect2d();
			}
			var m4fProjView: IMat4 = this.projViewMatrix;
			var pFrusutumVertices: IVec3[] = pEffectiveCameraFrustum.frustumVertices;

			var v4fTmp: IVec4 = Vec4.temp();
			var v2fTmp: IVec2 = Vec2.temp();

			for (var i: uint = 0; i < 8; i++) {
				v4fTmp.set(pFrusutumVertices[i], 1.);

				m4fProjView.multiplyVec4(v4fTmp);

				v2fTmp.set(v4fTmp.x, v4fTmp.y).scale(math.abs(1. / v4fTmp.w));

				if (i == 0) {
					pDestination.set(v2fTmp, v2fTmp);
				}
				else {
					pDestination.unionPoint(v2fTmp);
				}
			}

			return pDestination;
		}
	}

	export function isShadowCaster(pEntity: IEntity): boolean {
		return !isNull(pEntity) && pEntity.type === EEntityTypes.SHADOW_CASTER;
	}
}
