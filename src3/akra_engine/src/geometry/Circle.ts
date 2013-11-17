/// <reference path="../idl/AICircle.ts" />

import Vec2 = require("math/Vec2");


class Circle implements AICircle {
    center: AIVec2;
    radius: float;

    constructor();
    constructor(pCircle: AICircle);
    constructor(v2fCenter: AIVec2, fRadius: float);
    constructor(fCenterX: float, fCenterY: float, fRadius: float);
    constructor(fCenterX?, fCenterY?, fRadius?) {
        var n: uint = arguments.length;

        switch (n) {
            case 1:
                var pCircle: AICircle = arguments[0];
                this.center = new Vec2(pCircle.center);
                this.radius = pCircle.radius;
                break;
            case 2:
                var v2fCenter: AIVec2 = arguments[0];
                var fRadius: float = arguments[1];

                this.center = new Vec2(v2fCenter);
                this.radius = fRadius;
                break;
            case 3:
                this.center = new Vec2(arguments[0], arguments[1]);
                this.radius = arguments[2];
                break;
            default:
                this.center = new Vec2();
                this.radius = 0.;
                break;
        }
    }

    set(): AICircle;
    set(pCircle: AICircle): AICircle;
    set(v2fCenter: AIVec2, fRadius: float): AICircle;
    set(fCenterX: float, fCenterY: float, fRadius: float): AICircle;
    set(fCenterX?, fCenterY?, fRadius?): AICircle {
        var nArgumentsLength: uint = arguments.length;

        switch (nArgumentsLength) {
            case 1:
                var pCircle: AICircle = arguments[0];
                this.center.set(pCircle.center);
                this.radius = pCircle.radius;
                break;
            case 2:
                var v2fCenter: AIVec2 = arguments[0];
                var fRadius: float = arguments[1];

                this.center.set(v2fCenter);
                this.radius = fRadius;
                break;
            case 3:
                this.center.set(arguments[0], arguments[1]);
                this.radius = arguments[2];
                break;
            default:
                this.center.set(0.);
                this.radius = 0.;
        }

        return this;
    }

    /** inline */ clear(): AICircle {
        this.center.clear();
        this.radius = 0.;

        return this;
    }

    /** inline */ isEqual(pCircle: AICircle): boolean {
        return this.center.isEqual(pCircle.center) && (this.radius == pCircle.radius);
    }

    /** inline */ isClear(): boolean {
        return this.center.isClear() && (this.radius === 0.);
    }

    /** inline */ isValid(): boolean {
        return (this.radius >= 0.);
    }

    /** inline */ offset(v2fOffset: AIVec2): AICircle {
        this.center.add(v2fOffset);
        return this;
    }

    /** inline */ expand(fInc: float): AICircle {
        this.radius += fInc;
        return this;
    }

    /** inline */ normalize(): AICircle {
        this.radius = math.abs(this.radius);
        return this;
    }
}


export = Circle;