/// <reference path="../idl/type.d.ts" />
/// <reference path="../idl/AIVec2.ts" />

import math = require("math");

class Vec2 implements AIVec2 {
    x: float = 0.;
    y: float = 0.;

    get xx(): AIVec2 {
        return vec2(this.x, this.x);
    }
    set xx(v2fVec: AIVec2) {
        this.x = v2fVec.x; this.x = v2fVec.y;
    }

    get xy(): AIVec2 {
        return vec2(this.x, this.y);
    }
    set xy(v2fVec: AIVec2) {
        this.x = v2fVec.x; this.y = v2fVec.y;
    }

    get yx(): AIVec2 {
        return vec2(this.y, this.x);
    }
    set yx(v2fVec: AIVec2) {
        this.y = v2fVec.x; this.x = v2fVec.y;
    }

    get yy(): AIVec2 {
        return vec2(this.y, this.y);
    }
    set yy(v2fVec: AIVec2) {
        this.y = v2fVec.x; this.y = v2fVec.y;
    }

    constructor();
    constructor(fValue: float);
    constructor(v2fVec: AIVec2);
    constructor(pArray: float[]);
    constructor(fValue1: float, fValue2: float);
    constructor(fValue1?, fValue2?) {
        var nArgumentsLength: uint = arguments.length;

        var v2fVec: AIVec2 = this;

        switch (nArgumentsLength) {
            case 1:
                v2fVec.set(arguments[0]);
                break;
            case 2:
                v2fVec.set(arguments[0], arguments[1]);
                break;
            default:
                v2fVec.x = v2fVec.y = 0.;
                break;
        }
    }

    set(): AIVec2;
    set(fValue: float): AIVec2;
    set(v2fVec: AIVec2): AIVec2;
    set(pArray: float[]): AIVec2;
    set(fValue1: float, fValue2: float): AIVec2;
    set(fValue1?, fValue2?): AIVec2 {
        var nArgumentsLength: uint = arguments.length;

        switch (nArgumentsLength) {
            case 0:
                this.x = this.y = 0.;
                break;
            case 1:
                if (isFloat(arguments[0])) {
                    this.x = this.y = arguments[0];
                }
                else if (arguments[0] instanceof Vec2) {
                    var v2fVec: AIVec2 = arguments[0];

                    this.x = v2fVec.x;
                    this.y = v2fVec.y;
                }
                else {
                    var pArray: float[] = arguments[0];

                    this.x = pArray[0];
                    this.y = pArray[1];
                }
                break;
            case 2:
                this.x = arguments[0];
                this.y = arguments[1];
                break;
        };

        return this;
    }

    /** inline */ clear(): AIVec2 {
        this.x = this.y = 0.;
        return this;
    }

    add(v2fVec: AIVec2, v2fDestination?: AIVec2): AIVec2 {
        if (!isDef(v2fDestination)) {
            v2fDestination = this;
        }

        v2fDestination.x = this.x + v2fVec.x;
        v2fDestination.y = this.y + v2fVec.y;

        return v2fDestination;
    }

    subtract(v2fVec: AIVec2, v2fDestination?: AIVec2): AIVec2 {
        if (!isDef(v2fDestination)) {
            v2fDestination = this;
        }

        v2fDestination.x = this.x - v2fVec.x;
        v2fDestination.y = this.y - v2fVec.y;

        return v2fDestination;
    }

    /** inline */ dot(v2fVec: AIVec2): float {
        return this.x * v2fVec.x + this.y * v2fVec.y;
    }

    isEqual(v2fVec: AIVec2, fEps: float = 0.): boolean {
        if (fEps === 0.) {
            if (this.x != v2fVec.x
                || this.y != v2fVec.y) {

                return false;
            }
        }
        else {
            if (abs(this.x - v2fVec.x) > fEps
                || abs(this.y - v2fVec.y) > fEps) {

                return false;
            }
        }

        return true;
    }

    isClear(fEps: float = 0.): boolean {
        if (fEps === 0.) {
            if (this.x != 0.
                || this.y != 0.) {

                return false;
            }
        }
        else {
            if (math.abs(this.x) > fEps
                || math.abs(this.y) > fEps) {

                return false;
            }
        }

        return true;
    }

    negate(v2fDestination?: AIVec2): AIVec2 {
        if (!isDef(v2fDestination)) {
            v2fDestination = this;
        }

        v2fDestination.x = -this.x;
        v2fDestination.y = -this.y;

        return v2fDestination;
    }

    scale(fScale: float, v2fDestination?: AIVec2): AIVec2 {
        if (!isDef(v2fDestination)) {
            v2fDestination = this;
        }

        v2fDestination.x = this.x * fScale;
        v2fDestination.y = this.y * fScale;

        return v2fDestination;
    }

    normalize(v2fDestination?: AIVec2): AIVec2 {
        if (!isDef(v2fDestination)) {
            v2fDestination = this;
        }

        var x: float = this.x, y: float = this.y;
        var fLength: float = math.sqrt(x * x + y * y);

        if (fLength !== 0.) {
            var fInvLength: float = 1. / fLength;

            x *= fInvLength;
            y *= fInvLength;
        }

        v2fDestination.x = x;
        v2fDestination.y = y;

        return v2fDestination;
    }

    /** inline */ length(): float {
        var x: float = this.x, y: float = this.y;
        return math.sqrt(x * x + y * y);
    }

    /** inline */ lengthSquare(): float {
        var x: float = this.x, y: float = this.y;
        return x * x + y * y;
    }

    direction(v2fVec: AIVec2, v2fDestination?: AIVec2): AIVec2 {
        if (!isDef(v2fDestination)) {
            v2fDestination = this;
        }

        var x: float = v2fVec.x - this.x;
        var y: float = v2fVec.y - this.y;

        var fLength: float = math.sqrt(x * x + y * y);

        if (fLength !== 0.) {
            var fInvLength: float = 1. / fLength;

            x *= fInvLength;
            y *= fInvLength;
        }

        v2fDestination.x = x;
        v2fDestination.y = y;

        return v2fDestination;
    }

    mix(v2fVec: AIVec2, fA: float, v2fDestination?: AIVec2): AIVec2 {
        if (!isDef(v2fDestination)) {
            v2fDestination = this;
        }

        fA = math.clamp(fA, 0., 1.);

        var fA1: float = 1. - fA;
        var fA2: float = fA;

        v2fDestination.x = fA1 * this.x + fA2 * v2fVec.x;
        v2fDestination.y = fA1 * this.y + fA2 * v2fVec.y;

        return v2fDestination;
    }

    /** inline */ toString(): string {
        return "[x: " + this.x + ", y: " + this.y + "]";
    }

    //ALLOCATE_STORAGE(Vec2, MATH_STACK_SIZE)
}


export = Vec2;