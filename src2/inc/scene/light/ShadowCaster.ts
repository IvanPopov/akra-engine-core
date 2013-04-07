#ifndef SHADOWCASTER_TS
#define SHADOWCASTER_TS

#include "IShadowCaster.ts"
#include "scene/objects/Camera.ts"
#include "util/ObjectArray.ts"
#include "math/Mat4.ts"
#include "geometry/Rect3d.ts"

module akra.scene.light {
	export class ShadowCaster extends objects.Camera implements IShadowCaster {
		protected _pLightPoint: ILightPoint = null;
		protected _iFace: uint = 0;
		protected _pAffectedObjects: IObjectArray = new util.ObjectArray();
		protected _m4fOptimizedProj: IMat4 = new Mat4();
		protected _isShadowCasted: bool = false;

		inline get lightPoint(): ILightPoint{
			return this._pLightPoint;
		};

		inline get face(): uint{
			return this._iFace;
		};

		inline get affectedObjects(): IObjectArray{
			return this._pAffectedObjects;
		};

		inline get optimizedProjection(): IMat4{
			return this._m4fOptimizedProj;
		}

		inline get isShadowCasted(): bool{
			return this._isShadowCasted;
		}
		inline set isShadowCasted(isShadowCasted: bool){
			this._isShadowCasted = isShadowCasted;
		}

		constructor (pLightPoint: ILightPoint, iFace: uint = ECubeFace.POSITIVE_X) {
			super(pLightPoint.scene, EEntityTypes.SHADOW_CASTER);

			this._pLightPoint = pLightPoint;
			this._iFace = iFace;
		};

		_optimizeProjectionMatrix():void {
		    var m4fView: IMat4 = this.viewMatrix;
		    var m4fProj: IMat4 = this.projectionMatrix;
		    var m4fProjData: Float32Array = m4fProj.data;

		    var pBox: IRect3d = geometry.rect3d();

		    var pAffectedObjects: IObjectArray = this._pAffectedObjects;

		    if (pAffectedObjects.length == 0) {
		        this._m4fOptimizedProj.set(m4fProj);
		        return;
		    }

		    var fX0: float, fX1: float, fY0: float, fY1: float, fZ0: float, fZ1: float;
		    var fX: float, fY: float, fZ: float, fW: float;

		    var fX_LBN: float, fY_LBN: float;/*left bottom near*/
		    var fX_RTN: float, fY_RTN: float;/*right top near*/
		    var fZ_Near: float, fZ_Far: float;

		    //первый бокс должен быть, либо построен по первому элементу, что приводит к усложнению функции
		    //либо записан таким образом (то есть минимально (максимально) возможные значения), тогда можно просто все делать в цикле
		    var fXRes_LBN: float = 1., fXRes_RTN: float = -1,
		        fYRes_LBN: float = 1, fYRes_RTN: float = -1,
		        fZRes_Near: float = 1, fZRes_Far: float = -1;


		    for(var i:int = 0; i < pAffectedObjects.length; i++){
		    	var pObject: ISceneObject = pAffectedObjects.value(i);

		    	if(!pObject.hasShadows){
		    		continue;
		    	}

		        pBox.set(pObject.worldBounds);
		        pBox.transform(m4fView);

		        fX0 = pBox.x0; fX1 = pBox.x1;
		        fY0 = pBox.y0; fY1 = pBox.y1;
		        fZ0 = pBox.z0; fZ1 = pBox.z1;

		        //z - отрицательное => ближняя к камере грань fZ1, а fZ0 - дальняя

		        //leftBottomNear

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

		        fX_LBN = fX / fW;
		        fY_LBN = fY / fW;

		        ////////////////////////////////
		        //z near
		        fZ_Near = fZ / fW;
		        ////////////////////////////////

		        //rightTopNear

		        fX = m4fProjData[__11] * fX1 + m4fProjData[__12] * fY1 + m4fProjData[__13] * fZ1 + m4fProjData[__14];
		        fY = m4fProjData[__21] * fX1 + m4fProjData[__22] * fY1 + m4fProjData[__23] * fZ1 + m4fProjData[__24];
		        fW = m4fProjData[__41] * fX1 + m4fProjData[__42] * fY1 + m4fProjData[__43] * fZ1 + m4fProjData[__44];

		        if (fW <= 0) {
		            //обходим особые случаи
		            fX = 1;
		            fY = 1;
		            fW = 1;
		        }

		        fX_RTN = fX / fW;
		        fY_RTN = fY / fW;

		        ////////////////////////////////
		        //z far

		        fZ = m4fProjData[__31] * fX0 + m4fProjData[__32] * fY0 + m4fProjData[__33] * fZ0 + m4fProjData[__34];
		        fW = m4fProjData[__41] * fX0 + m4fProjData[__42] * fY0 + m4fProjData[__43] * fZ0 + m4fProjData[__44];
		        //в этой части особенностей нет, так как w всегда больше нуля, иначе объект будет вне frustum-а

		        fZ_Far = fZ / fW;
		        ////////////////////////////////

		        fXRes_LBN = (fX_LBN < fXRes_LBN) ? fX_LBN : fXRes_LBN;
		        fXRes_RTN = (fX_RTN > fXRes_RTN) ? fX_RTN : fXRes_RTN;

		        fYRes_LBN = (fY_LBN < fYRes_LBN) ? fY_LBN : fYRes_LBN;
		        fYRes_RTN = (fY_RTN > fYRes_RTN) ? fY_RTN : fYRes_RTN;

		        fZRes_Near = (fZ_Near < fZRes_Near) ? fZ_Near : fZRes_Near;
		        fZRes_Far = (fZ_Far > fZRes_Far) ? fZ_Far : fZRes_Far;
		    }

		    fXRes_LBN = (fXRes_LBN < -1 || fXRes_LBN == 1) ? -1 : fXRes_LBN;
		    fXRes_RTN = (fXRes_RTN > 1 || fXRes_RTN == -1) ? 1 : fXRes_RTN;

		    fYRes_LBN = (fYRes_LBN < -1 || fYRes_LBN == 1) ? -1 : fYRes_LBN;
		    fYRes_RTN = (fYRes_RTN > 1 || fYRes_RTN == -1) ? 1 : fYRes_RTN;

		    fZRes_Near = (fZRes_Near < -1 || fZRes_Near == 1) ? -1 : fZRes_Near;
		    fZRes_Far = (fZRes_Far > 1 || fZRes_Far == -1) ? 1 : fZRes_Far;

		    //optimized parameters

		    var v4fTmp1: IVec4 = m4fProj.unproj(vec3(fXRes_LBN, fYRes_LBN, fZRes_Near), vec4());
		    var v4fTmp2: IVec4 = m4fProj.unproj(vec3(fXRes_RTN, fYRes_RTN, fZRes_Near), vec4());

		    var fXLeft: float = v4fTmp1.x;
		    var fXRight: float = v4fTmp2.x;
		    var fYBottom: float = v4fTmp1.y;
		    var fYTop: float = v4fTmp2.y;
		    var fZNear: float = v4fTmp1.z;
		    var fZFar: float = m4fProj.unprojZ(fZRes_Far);

		    if(m4fProj.isOrthogonalProjection()){
		    	//ortho-projection
		    	Mat4.orthogonalProjectionAsymmetric(fXLeft, fXRight, fYBottom, fYTop, -fZNear, -fZFar, this._m4fOptimizedProj);
		    }
		    else{
		    	//frustum
		    	Mat4.frustum(fXLeft, fXRight, fYBottom, fYTop, -fZNear, -fZFar, this._m4fOptimizedProj);
			}
		};
	}

	export function isShadowCaster(pEntity: IEntity): bool {
		return !isNull(pEntity) && pEntity.type === EEntityTypes.SHADOW_CASTER;
	}
}

#endif