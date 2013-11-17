/// <reference path="../idl/AISegment2d.ts" />

import Ray2d = require("geometry/Ray2d");

class Segment2d implements AISegment2d {
    ray: AIRay2d;
    distance: float;

    constructor() {
        this.ray = new Ray2d();
        this.distance = 0.;
    }

    get point(): AIVec2 {
        return this.ray.point;
    }

    set point(v2fPoint: AIVec2) {
        this.ray.point.set(v2fPoint);
    }

    get normal(): AIVec2 {
        return this.ray.normal;
    }
    set normal(v2fNormal: AIVec2) {
        this.ray.normal.set(v2fNormal);
    }
}
