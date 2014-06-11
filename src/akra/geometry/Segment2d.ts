/// <reference path="../idl/ISegment2d.ts" />
/// <reference path="Ray2d.ts" />


module akra.geometry {

	export class Segment2d implements ISegment2d {
		ray: IRay2d;
		distance: float;

		constructor() {
			this.ray = new Ray2d();
			this.distance = 0.;
		}

		getPoint(): IVec2 {
			return this.ray.point;
		}

		setPoint(v2fPoint: IVec2) {
			this.ray.point.set(v2fPoint);
		}

		getNormal(): IVec2 {
			return this.ray.normal;
		}

		setNormal(v2fNormal: IVec2) {
			this.ray.normal.set(v2fNormal);
		}
	}

}