/// <reference path="../idl/IRay3d.ts" />
/// <reference path="../math/math.ts" />

module akra.geometry {
    import Vec3 = math.Vec3;

    export class Ray3d implements IRay3d {
        point: IVec3;
        normal: IVec3;

        constructor() {
            this.point = new Vec3();
            this.normal = new Vec3();
        }
    }

}