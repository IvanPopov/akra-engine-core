/// <reference path="../idl/AISegment3d.ts" />

import Ray3d = require("geometry/Ray3d");

class Segment3d implements AISegment3d {
    ray: AIRay3d;
    distance: float;

    constructor() {
        this.ray = new Ray3d();
        this.distance = 0.;
    }

    get point(): AIVec3 {
        return this.ray.point;
    }

    set point(v3fPoint: AIVec3) {
        this.ray.point.set(v3fPoint);
    }

    get normal(): AIVec3 {
        return this.ray.normal;
    }

    set normal(v3fNormal: AIVec3) {
        this.ray.normal.set(v3fNormal);
    }
}
