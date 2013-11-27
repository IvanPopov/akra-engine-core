/// <reference path="../idl/AIRay2d.ts" />

import Vec2 = require("math/Vec2");

class Ray2d implements AIRay2d {
    point: AIVec2;
    normal: AIVec2;

    constructor() {
        this.point = new Vec2();
        this.normal = new Vec2();
    }
}

export = Ray2d;