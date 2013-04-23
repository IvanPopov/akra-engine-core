#ifndef FRUSTUM_TS
#define FRUSTUM_TS

#include "../math/Mat4.ts"
#include "../math/Vec3.ts"
#include "Plane3d.ts"
#include "Rect3d.ts"
#include "Sphere.ts"
#include "classifications.ts"
#include "IFrustum.ts"

module akra.geometry{
	export class Frustum implements IFrustum {
		leftPlane: IPlane3d;
		rightPlane: IPlane3d;
		topPlane: IPlane3d;
		bottomPlane: IPlane3d;
		nearPlane: IPlane3d;
		farPlane: IPlane3d;

		_pFrustumVertices: IVec3[] = null;

		constructor ();
		constructor (pFrustum: IFrustum);
		constructor (pLeftPlane: IPlane3d, pRightPlane: IPlane3d,
					pTopPlane: IPlane3d, pBottomPlane: IPlane3d,
					pNearPlane: IPlane3d, pFarPlane: IPlane3d);
		constructor (pLeftPlane?,pRightPlane?,pTopPlane?,
					pBottomPlane?, pNearPlane?, pFarPlane?) {

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

		inline get frustumVertices(): IVec3[]{
			return this._pFrustumVertices;
		};

		set(): IFrustum;
		set(pFrustum: IFrustum): IFrustum;
		set(pLeftPlane: IPlane3d, pRightPlane: IPlane3d,
			pTopPlane: IPlane3d, pBottomPlane: IPlane3d,
			pNearPlane: IPlane3d, pFarPlane: IPlane3d): IFrustum;
		set(pLeftPlane?, pRightPlane?, pTopPlane?,
			pBottomPlane?, pNearPlane?, pFarPlane?): IFrustum {

			var nArgumentsLength = arguments.length;

			switch(nArgumentsLength) {
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

		calculateFrustumVertices(): IVec3[]{
			if(this._pFrustumVertices == null){
				this._pFrustumVertices = new Array(8);

				for(var i:int = 0; i < 8; i++){
					this._pFrustumVertices[i] = new Vec3();
				}
			}

			var v3fLeftNormal: IVec3 = this.leftPlane.normal;
			var v3fRightNormal: IVec3 = this.rightPlane.normal;
			var v3fTopNormal: IVec3 = this.topPlane.normal;
			var v3fBottomNormal: IVec3 = this.bottomPlane.normal;
			var v3fNearNormal: IVec3 = this.nearPlane.normal;
			var v3fFarNormal: IVec3 = this.farPlane.normal;

			var fLeft: float = -this.leftPlane.distance;
			var fRight: float = -this.rightPlane.distance;
			var fTop: float = -this.topPlane.distance;
			var fBottom: float = -this.bottomPlane.distance;
			var fNear: float = -this.nearPlane.distance;
			var fFar: float = -this.farPlane.distance;

			var m3fTemp: IMat3 = mat3();
			var pFrustumVertices: IVec3[] = this._pFrustumVertices;

			//first left-bottom-near
			pFrustumVertices[0].set(fLeft, fBottom, fNear);
			m3fTemp.set(v3fLeftNormal.x, v3fBottomNormal.x, v3fNearNormal.x, /*first colomn, not row*/
						v3fLeftNormal.y, v3fBottomNormal.y, v3fNearNormal.y,
						v3fLeftNormal.z, v3fBottomNormal.z, v3fNearNormal.z);
			m3fTemp.inverse().multiplyVec3(pFrustumVertices[0]);

			//second right-bottom-near
			pFrustumVertices[1].set(fRight, fBottom, fNear);
			m3fTemp.set(v3fRightNormal.x, v3fBottomNormal.x, v3fNearNormal.x, /*first colomn, not row*/
						v3fRightNormal.y, v3fBottomNormal.y, v3fNearNormal.y,
						v3fRightNormal.z, v3fBottomNormal.z, v3fNearNormal.z);
			m3fTemp.inverse().multiplyVec3(pFrustumVertices[1]);

			//third left-top-near
			pFrustumVertices[2].set(fLeft, fTop, fNear);
			m3fTemp.set(v3fLeftNormal.x, v3fTopNormal.x, v3fNearNormal.x, /*first colomn, not row*/
						v3fLeftNormal.y, v3fTopNormal.y, v3fNearNormal.y,
						v3fLeftNormal.z, v3fTopNormal.z, v3fNearNormal.z);
			m3fTemp.inverse().multiplyVec3(pFrustumVertices[2]);

			//forth right-top-near
			pFrustumVertices[3].set(fRight, fTop, fNear);
			m3fTemp.set(v3fRightNormal.x, v3fTopNormal.x, v3fNearNormal.x, /*first colomn, not row*/
						v3fRightNormal.y, v3fTopNormal.y, v3fNearNormal.y,
						v3fRightNormal.z, v3fTopNormal.z, v3fNearNormal.z);
			m3fTemp.inverse().multiplyVec3(pFrustumVertices[3]);

			//fifth left-bottom-far
			pFrustumVertices[4].set(fLeft, fBottom, fFar);
			m3fTemp.set(v3fLeftNormal.x, v3fBottomNormal.x, v3fFarNormal.x, /*first colomn, not row*/
						v3fLeftNormal.y, v3fBottomNormal.y, v3fFarNormal.y,
						v3fLeftNormal.z, v3fBottomNormal.z, v3fFarNormal.z);
			m3fTemp.inverse().multiplyVec3(pFrustumVertices[4]);

			//sixth right-bottom-far
			pFrustumVertices[5].set(fRight, fBottom, fFar);
			m3fTemp.set(v3fRightNormal.x, v3fBottomNormal.x, v3fFarNormal.x, /*first colomn, not row*/
						v3fRightNormal.y, v3fBottomNormal.y, v3fFarNormal.y,
						v3fRightNormal.z, v3fBottomNormal.z, v3fFarNormal.z);
			m3fTemp.inverse().multiplyVec3(pFrustumVertices[5]);

			//seventh left-top-far
			pFrustumVertices[6].set(fLeft, fTop, fFar);
			m3fTemp.set(v3fLeftNormal.x, v3fTopNormal.x, v3fFarNormal.x, /*first colomn, not row*/
						v3fLeftNormal.y, v3fTopNormal.y, v3fFarNormal.y,
						v3fLeftNormal.z, v3fTopNormal.z, v3fFarNormal.z);
			m3fTemp.inverse().multiplyVec3(pFrustumVertices[6]);

			//eighth right-top-far
			pFrustumVertices[7].set(fRight, fTop, fFar);
			m3fTemp.set(v3fRightNormal.x, v3fTopNormal.x, v3fFarNormal.x, /*first colomn, not row*/
						v3fRightNormal.y, v3fTopNormal.y, v3fFarNormal.y,
						v3fRightNormal.z, v3fTopNormal.z, v3fFarNormal.z);
			m3fTemp.inverse().multiplyVec3(pFrustumVertices[7]);

			return pFrustumVertices;
		};

		extractFromMatrix(m4fProjection: IMat4, m4fWorld?: IMat4, pSearchRect?: IRect3d): IFrustum{

			if(this._pFrustumVertices == null){
				this._pFrustumVertices = new Array(8);

				for(var i:int = 0; i < 8; i++){
					this._pFrustumVertices[i] = new Vec3();
				}
			}

			var pFrustumVertices: IVec3[] = this._pFrustumVertices;

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
		    	m4fWorld.multiplyVec4(v4fLeftBottomNear);
		    	m4fWorld.multiplyVec4(v4fRightBottomNear);
		    	m4fWorld.multiplyVec4(v4fLeftTopNear);
		    	m4fWorld.multiplyVec4(v4fRightTopNear);

		    	m4fWorld.multiplyVec4(v4fLeftBottomFar);
		    	m4fWorld.multiplyVec4(v4fRightBottomFar);
		    	m4fWorld.multiplyVec4(v4fLeftTopFar);
		    	m4fWorld.multiplyVec4(v4fRightTopFar);
		    }

		    var v3fLeftBottomNear: IVec3 = pFrustumVertices[0].set(v4fLeftBottomNear.xyz);
		    var v3fRightBottomNear: IVec3 = pFrustumVertices[1].set(v4fRightBottomNear.xyz);
		    var v3fLeftTopNear: IVec3 = pFrustumVertices[2].set(v4fLeftTopNear.xyz);
		    var v3fRightTopNear: IVec3 = pFrustumVertices[3].set(v4fRightTopNear.xyz);

		    var v3fLeftBottomFar: IVec3 = pFrustumVertices[4].set(v4fLeftBottomFar.xyz);
		    var v3fRightBottomFar: IVec3 = pFrustumVertices[5].set(v4fRightBottomFar.xyz);
		    var v3fLeftTopFar: IVec3 = pFrustumVertices[6].set(v4fLeftTopFar.xyz);
		    var v3fRightTopFar: IVec3 = pFrustumVertices[7].set(v4fRightTopFar.xyz);

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

		//output - array of vertices in counterclockwise order (around plane normal as axis)
		//if destination don't submitted returned array from temp vectors
		getPlanePoints(sPlaneKey: string, pDestination?: IVec3[]): IVec3[]{
			if(arguments.length == 1){
				pDestination = [vec3(), vec3(), vec3(), vec3()];
			}

			var pFrustumVertices: IVec3[] = this.frustumVertices;
			if(pFrustumVertices === null){
				pFrustumVertices = this.calculateFrustumVertices();
			}

			switch(sPlaneKey){
				case "leftPlane":
					pDestination[0].set(pFrustumVertices[6]);
					pDestination[1].set(pFrustumVertices[4]);
					pDestination[2].set(pFrustumVertices[0]);
					pDestination[3].set(pFrustumVertices[2]);
					break;
				case "rightPlane":
					pDestination[0].set(pFrustumVertices[7]);
					pDestination[1].set(pFrustumVertices[3]);
					pDestination[2].set(pFrustumVertices[1]);
					pDestination[3].set(pFrustumVertices[5]);
					break;
				case "topPlane":
					pDestination[0].set(pFrustumVertices[7]);
					pDestination[1].set(pFrustumVertices[6]);
					pDestination[2].set(pFrustumVertices[2]);
					pDestination[3].set(pFrustumVertices[3]);
					break;
				case "bottomPlane":
					pDestination[0].set(pFrustumVertices[5]);
					pDestination[1].set(pFrustumVertices[1]);
					pDestination[2].set(pFrustumVertices[0]);
					pDestination[3].set(pFrustumVertices[4]);
					break;
				case "nearPlane":
					pDestination[0].set(pFrustumVertices[3]);
					pDestination[1].set(pFrustumVertices[2]);
					pDestination[2].set(pFrustumVertices[0]);
					pDestination[3].set(pFrustumVertices[1]);
					break;
				case "farPlane":
					pDestination[0].set(pFrustumVertices[7]);
					pDestination[1].set(pFrustumVertices[5]);
					pDestination[2].set(pFrustumVertices[4]);
					pDestination[3].set(pFrustumVertices[6]);
					break;
				default:
					debug_assert(false, "invalid plane key");
					break;
			}
			return pDestination;
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

			if(planeClassifyRect3d(this.leftPlane, pRect) == EPlaneClassifications.PLANE_FRONT
				|| planeClassifyRect3d(this.rightPlane, pRect) == EPlaneClassifications.PLANE_FRONT
				|| planeClassifyRect3d(this.topPlane, pRect) == EPlaneClassifications.PLANE_FRONT
				|| planeClassifyRect3d(this.bottomPlane, pRect) == EPlaneClassifications.PLANE_FRONT
				|| planeClassifyRect3d(this.nearPlane, pRect) == EPlaneClassifications.PLANE_FRONT
				|| planeClassifyRect3d(this.farPlane, pRect) == EPlaneClassifications.PLANE_FRONT){

				return false;
			}
			return true;
		};

		testSphere(pSphere: ISphere): bool{
			if(	   planeClassifySphere(this.leftPlane, pSphere) == EPlaneClassifications.PLANE_FRONT
				|| planeClassifySphere(this.rightPlane, pSphere) == EPlaneClassifications.PLANE_FRONT
				|| planeClassifySphere(this.topPlane, pSphere) == EPlaneClassifications.PLANE_FRONT
				|| planeClassifySphere(this.bottomPlane, pSphere) == EPlaneClassifications.PLANE_FRONT
				|| planeClassifySphere(this.nearPlane, pSphere) == EPlaneClassifications.PLANE_FRONT
				|| planeClassifySphere(this.farPlane, pSphere) == EPlaneClassifications.PLANE_FRONT){

				return false;
			}
			return true;
		};

		testFrustum(pFrustum: IFrustum): bool{
			
			var pFrustumVertices1: IVec3[] = this.frustumVertices;
			var pFrustumVertices2: IVec3[] = pFrustum.frustumVertices;

			if(pFrustumVertices1 == null){
				pFrustumVertices1 = this.calculateFrustumVertices();
			}
			if(pFrustumVertices2 == null){
				pFrustumVertices2 = pFrustum.calculateFrustumVertices();
			}

			var pFrustumPlanes: string[] = Frustum.frustumPlanesKeys;

			var nTest: uint;

			for(var i: int = 0; i < 6; i++){
				var pPlane: IPlane3d = this[pFrustumPlanes[i]];

				nTest = 0;

				for(var j: int = 0; j < 8; j++){
					if(pPlane.signedDistance(pFrustumVertices2[j]) > 0){
						nTest++;
					}
				}

				if(nTest == 8){
					//frustums don't intersecting
					return false;
				}
			}

			//second batch of test for minimizing possible error
			for(var i: int = 0; i < 6; i++){
				var pPlane: IPlane3d = pFrustum[pFrustumPlanes[i]];

				nTest = 0;

				for(var j: int = 0; j < 8; j++){
					if(pPlane.signedDistance(pFrustumVertices1[j]) > 0){
						nTest++;
					}
				}

				if(nTest == 8){
					//frustums don't intersecting
					return false;
				}
			}

			return true;
		};

		toString(): string{
			var sStr = "";

			for(var i: uint = 0; i < 6; i++){
				var sKey: string = Frustum.frustumPlanesKeys[i];
				sStr += sKey + ":\n";
				sStr += this[sKey].toString() + "\n";
			}

			return sStr;
		};

		static frustumPlanesKeys: string[] = ["leftPlane", "rightPlane", "topPlane",
											  "bottomPlane", "nearPlane", "farPlane"];
	};
}

#endif