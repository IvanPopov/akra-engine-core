/// <reference path="../idl/common.d.ts" />
/// <reference path="../idl/AIVec2.ts" />

import gen = require("generate");
import math = require("math");
import abs = math.abs;
import clamp = math.clamp;

var pBuffer: AIVec2[];
var iElement: uint;

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
    constructor(xy: float);
    constructor(xy: AIVec2);
    constructor(xy: float[]);
    constructor(x: float, y: float);
    constructor(x?, y?) {
        var n: uint = arguments.length;
        var v: AIVec2 = this;

        switch (n) {
            case 1:
                v.set(arguments[0]);
                break;
            case 2:
                v.set(arguments[0], arguments[1]);
                break;
            default:
                v.x = v.y = 0.;
        }
    }

    set(): AIVec2;
    set(xy: float): AIVec2;
    set(xy: AIVec2): AIVec2;
    set(xy: float[]): AIVec2;
    set(x: float, y: float): AIVec2;
    set(x?, y?): AIVec2 {
        var n: uint = arguments.length;

        switch (n) {
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
        }

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

    static temp(): AIVec2;
    static temp(xy: float): AIVec2;
    static temp(xy: AIVec2): AIVec2;
    static temp(xy: float[]): AIVec2;
    static temp(x: float, y: float): AIVec2;
    static temp(x?, y?): AIVec2 {
        iElement = (iElement === pBuffer.length - 1 ? 0 : pBuffer.length);
        var p = pBuffer[iElement++];
        return p.set.apply(p, arguments);
    }
}


pBuffer = gen.array<AIVec3>(256, Vec2);
iElement = 0;

export = Vec2;