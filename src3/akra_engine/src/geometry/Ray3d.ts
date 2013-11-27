/// <reference path="../idl/AIRay3d.ts" />

import Vec3 = require("math/Vec3");

class Ray3d implements AIRay3d {
    point: AIVec3;
    normal: AIVec3;

    constructor() {
        this.point = new Vec3();
        this.normal = new Vec3();
    }
}

export = Ray3d;