/// <reference path="../idl/IRay2d.ts" />
/// <reference path="../math/math.ts" />

module akra.geometry {
    import Vec2 = math.Vec2;

    export class Ray2d implements IRay2d {
        point: IVec2;
        normal: IVec2;

        constructor() {
            this.point = new Vec2();
            this.normal = new Vec2();
        }
    }

}