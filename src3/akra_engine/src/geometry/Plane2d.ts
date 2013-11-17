/// <reference path="../idl/AIPlane2d.ts" />

import math = require("math");
import Vec2 = math.Vec2;

class Plane2d implements AIPlane2d {
    normal: AIVec2;
    distance: float;

    constructor();
    constructor(pPlane: AIPlane2d);
    constructor(v2fNormal: AIVec2, fDistance: float);
    constructor(v2fPoint1: AIVec2, v2fPoint2: AIVec2);
    constructor(v2fPoint1?, v2fPoint2?) {

        this.normal = new Vec2();
        this.distance = 0.;

        var nArgumentsLength = arguments.length;

        switch (nArgumentsLength) {
            case 1:
                this.set(arguments[0]);
                break;
            case 2:
                this.set(arguments[0], arguments[1]);
                break;
            default:
                break;
        }
    }

    set(): AIPlane2d;
    set(pPlane: AIPlane2d): AIPlane2d;
    set(v2fNormal: AIVec2, fDistance: float): AIPlane2d;
    set(v2fPoint1: AIVec2, v2fPoint2: AIVec2): AIPlane2d;
    set(v2fPoint1?, v2fPoint2?): AIPlane2d {
        var nArgumentsLength: uint = arguments.length;

        switch (nArgumentsLength) {
            case 1:
                var pPlane: AIPlane2d = arguments[0];

                this.normal.set(pPlane.normal);
                this.distance = pPlane.distance;
                break;
            case 2:
                if (isFloat(arguments[1])) {
                    this.normal.set(arguments[0]);
                    this.distance = arguments[1];
                }
                else {
                    var v2fLine: AIVec2 = vec2(<AIVec2>arguments[1]).subtract(arguments[0]);
                    var v2fNormal: AIVec2 = this.normal;

                    v2fNormal.set(-v2fLine.y, v2fLine.x);
                    this.distance = -v2fNormal.dot(arguments[0]);
                }
                break;
            default:
                this.normal.clear();
                this.distance = 0.;
                break;
        }

        return this.normalize();
    }

    /** inline */ clear(): AIPlane2d {
        this.normal.clear();
        this.distance = 0.;
        return this;
    }

    /** inline */ negate(): AIPlane2d {
        this.normal.negate();
        this.distance = -this.distance;
        return this;
    }

    normalize(): AIPlane2d {
        var v2fNormal: AIVec2 = this.normal;

        var x: float = v2fNormal.x;
        var y: float = v2fNormal.y

			var fLength: float = math.sqrt(x * x + y * y);

        if (fLength !== 0.) {
            var fInvLength: float = 1. / fLength;

            v2fNormal.x = x * fInvLength;
            v2fNormal.y = y * fInvLength;

            this.distance = this.distance * fInvLength;
        }

        return this;
    }

    /** inline */ isEqual(pPlane: AIPlane2d): boolean {
        return this.normal.isEqual(pPlane.normal) && (this.distance == pPlane.distance);
    }

    /*предполагается работа только с нормализованной плоскостью*/
    projectPointToPlane(v2fPoint: AIVec2, v2fDestination?: AIVec2): AIVec2 {
        if (!isDef(v2fDestination)) {
            v2fDestination = new Vec2();
        }

        var v2fNormal: AIVec2 = this.normal;
        var fDistance: float = this.distance + v2fNormal.dot(v2fPoint);

        v2fDestination.x = v2fPoint.x - fDistance * v2fNormal.x;
        v2fDestination.y = v2fPoint.y - fDistance * v2fNormal.y;

        return v2fDestination;
    }

    solveForX(fY: float): float {
        /*Ax+By+d=0;
        x=-(d+By)/A;*/

        var v2fNormal: AIVec2 = this.normal;

        if (v2fNormal.x !== 0.) {
            return -(this.distance + v2fNormal.y * fY) / v2fNormal.x;
        }
        return 0.;
    }

    solveForY(fX: float): float {
        /*Ax+By+d=0;
        y=-(d+Ax)/B;*/

        var v2fNormal: AIVec2 = this.normal;

        if (v2fNormal.y !== 0.) {
            return -(this.distance + v2fNormal.x * fX) / v2fNormal.y;
        }
        return 0.;
    }

    /*предполагается работа только с нормализованной плоскостью*/
    /** inline */ signedDistance(v2fPoint: AIVec2): float {
        return this.distance + this.normal.dot(v2fPoint);
    }

    toString(): string {
        return "normal: " + this.normal.toString() + "; distance: " + this.distance;
    }
}


export = Plane2d;