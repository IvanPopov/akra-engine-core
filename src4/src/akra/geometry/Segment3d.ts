/// <reference path="../idl/ISegment3d.ts" />
/// <reference path="Ray3d.ts" />

module akra.geometry {

    export class Segment3d implements ISegment3d {
        ray: IRay3d;
        distance: float;

        constructor() {
            this.ray = new Ray3d();
            this.distance = 0.;
        }

        getPoint(): IVec3 {
            return this.ray.point;
        }

        setPoint(v3fPoint: IVec3): void {
            this.ray.point.set(v3fPoint);
        }

        getNormal(): IVec3 {
            return this.ray.normal;
        }

        setNormal(v3fNormal: IVec3): void {
            this.ray.normal.set(v3fNormal);
        }
    }
}