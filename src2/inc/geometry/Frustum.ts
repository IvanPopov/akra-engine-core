#ifndef FRUSTUM_TS
#define FRUSUTM_TS

#include "Plane3d.ts"
#include "IFrustum.ts"

module akra.geometry{
	export class Frustum implements IFrustum {
		leftPlane: IPlane3d;
		rightPlane: IPlane3d;
		topPlane: IPlane3d;
		bottomPlane: IPlane3d;
		nearPlane: IPlane3d;
		farPlane: IPlane3d;

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

		isEqual(pFrustum: IFrustum): bool {
			return false;
		}

		testPoint(v3fPoint: IVec3): bool { return false; }
		testRect(pRect: IRect3): bool { return false; }
		testSphere(pSphere: ISphere): bool  { return false; }

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

		extractFromMatrix(m4fProjection: IMat4, m4fWorld?: IMat4, pSearchRect?: IRect3d): IFrustum {
			return null;
		};
	};
}

#endif