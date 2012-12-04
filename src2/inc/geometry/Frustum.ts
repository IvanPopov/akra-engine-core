#ifndef FRUSTUM_TS
#define FRUSUTM_TS

#include "geometry.ts"
#include "IFrustum.ts"

module akra.geometry{
	class Frustum implements IFrustum{
		leftPlane: IPlane3d;
		rightPlane: IPlane3d;
		topPlane: IPlane3d;
		bottomPlane: IPlane3d;
		nearPlane: IPlane3d;
		farPlane: IPlane3d;

		constructor();
		constructor(pFrustum: IFrustum);
		constructor(pLeftPlane: IPlane3d, pRightPlane: IPlane3d,
					pTopPlane: IPlane3d, pBottomPlane: IPlane3d,
					pNearPlane: IPlane3d, pFarPlane: IPlane3d);
		constructor(pLeftPlane?,pRightPlane?,pTopPlane?,
					pBottomPlane?, pNearPlane?, pFarPlane?){


			this.leftPlane = new Plane3d();
			this.rightPlane = new Plane3d();
			this.topPlane = new Plane3d();
			this.bottomPlane = new Plane3d();
			this.nearPlane = new Plane3d();
			this.farPlane = new Plane3d();

			var nArgumentsLength: uint = arguments.length;

			switch(nArgumentsLength){
				case 1:
					this.set(arguments[0]);
					break;
				case 6:
					this.set(arguments[0], arguments[1], arguments[2],
							 arguments[3], arguments[4], arguments[5]);
					break;
				default:
					break;
			}
		};

		set(): IFrustum;
		set(pFrustum: IFrustum): IFrustum;
		set(pLeftPlane: IPlane3d, pRightPlane: IPlane3d,
			pTopPlane: IPlane3d, pBottomPlane: IPlane3d,
			pNearPlane: IPlane3d, pFarPlane: IPlane3d): IFrustum;
		set(pLeftPlane?, pRightPlane?, pTopPlane?,
			pBottomPlane?, pNearPlane?, pFarPlane?): IFrustum{

			var nArgumentsLength = arguments.length;

			switch(nArgumentsLength){
				case 1:
					var pFrustum: IFrustum = arguments[0];

					this.leftPlane.set(pFrustum.leftPlane);
					this.rightPlane.set(pFrustum.rightPlane);
					this.topPlane.set(pFrustum.topPlane);
					this.bottomPlane.set(pFrustum.bottomPlane);
					this.nearPlane.set(pFrustum.nearPlane);
					this.farPlane.set(pFrustum.farPlane);
					break;
				case 6:
					this.leftPlane.set(arguments[0]);
					this.rightPlane.set(arguments[1]);
					this.topPlane.set(arguments[2]);
					this.bottomPlane.set(arguments[3]);
					this.nearPlane.set(arguments[4]);
					this.farPlane.set(arguments[5]);
					break;
				default:
					this.leftPlane.clear();
					this.rightPlane.clear();
					this.topPlane.clear();
					this.bottomPlane.clear();
					this.nearPlane.clear();
					this.farPlane.clear();
					break;
			}
			return this;
		};

		extractFromMatrix(m4fProjection: IMat4, m4fWorld?: IMat4, pSearchRect?: IRect3d): IFrustum{

			var v4fLeftBottomNear: IVec4 = vec4();
			var v4fRightBottomNear: IVec4 = vec4();
			var v4fLeftTopNear: IVec4 = vec4();
			var v4fRightTopNear: IVec4 = vec4();

			var v4fLeftBottomFar: IVec4 = vec4();
			var v4fRightBottomFar: IVec4 = vec4();
			var v4fLeftTopFar: IVec4 = vec4();
			var v4fRightTopFar: IVec4 = vec4();

			m4fProjection.unproj(vec3(-1,-1,-1), v4fLeftBottomNear);
		    m4fProjection.unproj(vec3(1,-1,-1), v4fRightBottomNear);
		    m4fProjection.unproj(vec3(-1,1,-1), v4fLeftTopNear);
		    m4fProjection.unproj(vec3(1,1,-1), v4fRightTopNear);

		    m4fProjection.unproj(vec3(-1,-1,1), v4fLeftBottomFar);
		    m4fProjection.unproj(vec3(1,-1,1), v4fRightBottomFar);
		    m4fProjection.unproj(vec3(-1,1,1), v4fLeftTopFar);
		    m4fProjection.unproj(vec3(1,1,1), v4fRightTopFar);

		    if(isDef(m4fWorld)){
		    	m4fWorld.multiplyVec4(v4fLeftBottomNear, v4fLeftBottomNear);
		    	m4fWorld.multiplyVec4(v4fRightBottomNear, v4fRightBottomNear);
		    	m4fWorld.multiplyVec4(v4fLeftTopNear, v4fLeftTopNear);
		    	m4fWorld.multiplyVec4(v4fRightTopNear, v4fRightTopNear);

		    	m4fWorld.multiplyVec4(v4fLeftBottomFar, v4fLeftBottomFar);
		    	m4fWorld.multiplyVec4(v4fRightBottomFar, v4fRightBottomFar);
		    	m4fWorld.multiplyVec4(v4fLeftTopFar, v4fLeftTopFar);
		    	m4fWorld.multiplyVec4(v4fRightTopFar, v4fRightTopFar);
		    }

		    var v3fLeftBottomNear: IVec3 = v4fLeftBottomNear.xyz;
		    var v3fRightBottomNear: IVec3 = v4fRightBottomNear.xyz;
		    var v3fLeftTopNear: IVec3 = v4fLeftTopNear.xyz;
		    var v3fRightTopNear: IVec3 = v4fRightTopNear.xyz;

		    var v3fLeftBottomFar: IVec3 = v4fLeftBottomFar.xyz;
		    var v3fRightBottomFar: IVec3 = v4fRightBottomFar.xyz;
		    var v3fLeftTopFar: IVec3 = v4fLeftTopFar.xyz;
		    var v3fRightTopFar: IVec3 = v4fRightTopFar.xyz;

		    //filling search rectangle

		    if(isDef(pSearchRect)){
		    	pSearchRect.set(v3fLeftBottomNear, v3fLeftBottomNear);

		    	pSearchRect.unionPoint(v3fRightBottomNear);
		    	pSearchRect.unionPoint(v3fLeftTopNear);
		    	pSearchRect.unionPoint(v3fRightTopNear);

		    	pSearchRect.unionPoint(v3fLeftBottomFar);
		    	pSearchRect.unionPoint(v3fRightBottomFar);
		    	pSearchRect.unionPoint(v3fLeftTopFar);
		    	pSearchRect.unionPoint(v3fRightTopFar);
		    }

		    //calculating planes
		    
		    this.leftPlane.set(v3fLeftTopNear, v3fLeftTopFar, v3fLeftBottomNear);
			this.rightPlane.set(v3fRightBottomFar, v3fRightTopFar, v3fRightBottomNear);
			this.topPlane.set(v3fLeftTopNear, v3fRightTopNear, v3fLeftTopFar);
			this.bottomPlane.set(v3fRightBottomFar, v3fRightBottomNear, v3fLeftBottomFar);
			this.nearPlane.set(v3fLeftTopNear, v3fLeftBottomNear, v3fRightTopNear);
			this.farPlane.set(v3fRightBottomFar, v3fLeftBottomFar, v3fRightTopFar);

			return this;
		};

		inline isEqual(pFrustum: IFrustum): bool{
			return (this.leftPlane.isEqual(pFrustum.leftPlane)
				&& this.rightPlane.isEqual(pFrustum.rightPlane)
				&& this.topPlane.isEqual(pFrustum.topPlane)
				&& this.bottomPlane.isEqual(pFrustum.bottomPlane)
				&& this.nearPlane.isEqual(pFrustum.nearPlane)
				&& this.farPlane.isEqual(pFrustum.farPlane));
		};

		testPoint(v3fPoint: IVec3): bool{
			if(	   this.leftPlane.signedDistance(v3fPoint) > 0.
				|| this.rightPlane.signedDistance(v3fPoint) > 0.
				|| this.topPlane.signedDistance(v3fPoint) > 0.
				|| this.bottomPlane.signedDistance(v3fPoint) > 0.
				|| this.nearPlane.signedDistance(v3fPoint) > 0.
				|| this.farPlane.signedDistance(v3fPoint) > 0.){

				return false;
			}
			return true;
		};

		testRect(pRect: IRect3d): bool{
			if(planeClassify_Rect3d_Plane(pRect, this.leftPlane) == EPlaneClassifications.PLANE_FRONT
				|| planeClassify_Rect3d_Plane(pRect, this.rightPlane) == EPlaneClassifications.PLANE_FRONT
				|| planeClassify_Rect3d_Plane(pRect, this.topPlane) == EPlaneClassifications.PLANE_FRONT
				|| planeClassify_Rect3d_Plane(pRect, this.bottomPlane) == EPlaneClassifications.PLANE_FRONT
				|| planeClassify_Rect3d_Plane(pRect, this.nearPlane) == EPlaneClassifications.PLANE_FRONT
				|| planeClassify_Rect3d_Plane(pRect, this.farPlane) == EPlaneClassifications.PLANE_FRONT){

				return false;
			}
			return true;
		};

		testSphere(pSphere: ISphere): bool{
			if(	   planeClassify_Sphere_Plane(pSphere, this.leftPlane) == EPlaneClassifications.PLANE_FRONT
				|| planeClassify_Sphere_Plane(pSphere, this.rightPlane) == EPlaneClassifications.PLANE_FRONT
				|| planeClassify_Sphere_Plane(pSphere, this.topPlane) == EPlaneClassifications.PLANE_FRONT
				|| planeClassify_Sphere_Plane(pSphere, this.bottomPlane) == EPlaneClassifications.PLANE_FRONT
				|| planeClassify_Sphere_Plane(pSphere, this.nearPlane) == EPlaneClassifications.PLANE_FRONT
				|| planeClassify_Sphere_Plane(pSphere, this.farPlane) == EPlaneClassifications.PLANE_FRONT){

				return false;
			}
			return true;
		};
	};
}

#endif