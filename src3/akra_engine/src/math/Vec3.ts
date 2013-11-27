/// <reference path="../idl/common.d.ts" />
/// <reference path="../idl/AIVec2.ts" />

import gen = require("generate");
import math = require("math");
import Mat3 = math.Mat3;
import Mat4 = math.Mat4;
import abs = math.abs;
import clamp = math.clamp;


var pBuffer: AIVec3[];
var iElement: uint;

class Vec3 {
    x: float;
    y: float;
    z: float;

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

    get xz(): AIVec2 {
        return vec2(this.x, this.z);
    }
    set xz(v2fVec: AIVec2) {
        this.x = v2fVec.x; this.z = v2fVec.y;
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

    get yz(): AIVec2 {
        return vec2(this.y, this.z);
    }
    set yz(v2fVec: AIVec2) {
        this.y = v2fVec.x; this.z = v2fVec.y;
    }

    get zx(): AIVec2 {
        return vec2(this.z, this.x);
    }
    set zx(v2fVec: AIVec2) {
        this.z = v2fVec.x; this.x = v2fVec.y;
    }

    get zy(): AIVec2 {
        return vec2(this.z, this.y);
    }
    set zy(v2fVec: AIVec2) {
        this.z = v2fVec.x; this.y = v2fVec.y;
    }

    get zz(): AIVec2 {
        return vec2(this.z, this.z);
    }
    set zz(v2fVec: AIVec2) {
        this.z = v2fVec.x; this.z = v2fVec.y;
    }


    get xxx(): AIVec3 {
        return vec3(this.x, this.x, this.x);
    }
    set xxx(v3fVec: AIVec3) {
        this.x = v3fVec.x; this.x = v3fVec.y; this.x = v3fVec.z;
    }

    get xxy(): AIVec3 {
        return vec3(this.x, this.x, this.y);
    }
    set xxy(v3fVec: AIVec3) {
        this.x = v3fVec.x; this.x = v3fVec.y; this.y = v3fVec.z;
    }

    get xxz(): AIVec3 {
        return vec3(this.x, this.x, this.z);
    }
    set xxz(v3fVec: AIVec3) {
        this.x = v3fVec.x; this.x = v3fVec.y; this.z = v3fVec.z;
    }

    get xyx(): AIVec3 {
        return vec3(this.x, this.y, this.x);
    }
    set xyx(v3fVec: AIVec3) {
        this.x = v3fVec.x; this.y = v3fVec.y; this.x = v3fVec.z;
    }

    get xyy(): AIVec3 {
        return vec3(this.x, this.y, this.y);
    }
    set xyy(v3fVec: AIVec3) {
        this.x = v3fVec.x; this.y = v3fVec.y; this.y = v3fVec.z;
    }

    get xyz(): AIVec3 {
        return vec3(this.x, this.y, this.z);
    }
    set xyz(v3fVec: AIVec3) {
        this.x = v3fVec.x; this.y = v3fVec.y; this.z = v3fVec.z;
    }

    get xzx(): AIVec3 {
        return vec3(this.x, this.z, this.x);
    }
    set xzx(v3fVec: AIVec3) {
        this.x = v3fVec.x; this.z = v3fVec.y; this.x = v3fVec.z;
    }

    get xzy(): AIVec3 {
        return vec3(this.x, this.z, this.y);
    }
    set xzy(v3fVec: AIVec3) {
        this.x = v3fVec.x; this.z = v3fVec.y; this.y = v3fVec.z;
    }

    get xzz(): AIVec3 {
        return vec3(this.x, this.z, this.z);
    }
    set xzz(v3fVec: AIVec3) {
        this.x = v3fVec.x; this.z = v3fVec.y; this.z = v3fVec.z;
    }

    get yxx(): AIVec3 {
        return vec3(this.y, this.x, this.x);
    }
    set yxx(v3fVec: AIVec3) {
        this.y = v3fVec.x; this.x = v3fVec.y; this.x = v3fVec.z;
    }

    get yxy(): AIVec3 {
        return vec3(this.y, this.x, this.y);
    }
    set yxy(v3fVec: AIVec3) {
        this.y = v3fVec.x; this.x = v3fVec.y; this.y = v3fVec.z;
    }

    get yxz(): AIVec3 {
        return vec3(this.y, this.x, this.z);
    }
    set yxz(v3fVec: AIVec3) {
        this.y = v3fVec.x; this.x = v3fVec.y; this.z = v3fVec.z;
    }

    get yyx(): AIVec3 {
        return vec3(this.y, this.y, this.x);
    }
    set yyx(v3fVec: AIVec3) {
        this.y = v3fVec.x; this.y = v3fVec.y; this.x = v3fVec.z;
    }

    get yyy(): AIVec3 {
        return vec3(this.y, this.y, this.y);
    }
    set yyy(v3fVec: AIVec3) {
        this.y = v3fVec.x; this.y = v3fVec.y; this.y = v3fVec.z;
    }

    get yyz(): AIVec3 {
        return vec3(this.y, this.y, this.z);
    }
    set yyz(v3fVec: AIVec3) {
        this.y = v3fVec.x; this.y = v3fVec.y; this.z = v3fVec.z;
    }

    get yzx(): AIVec3 {
        return vec3(this.y, this.z, this.x);
    }
    set yzx(v3fVec: AIVec3) {
        this.y = v3fVec.x; this.z = v3fVec.y; this.x = v3fVec.z;
    }

    get yzy(): AIVec3 {
        return vec3(this.y, this.z, this.y);
    }
    set yzy(v3fVec: AIVec3) {
        this.y = v3fVec.x; this.z = v3fVec.y; this.y = v3fVec.z;
    }

    get yzz(): AIVec3 {
        return vec3(this.y, this.z, this.z);
    }
    set yzz(v3fVec: AIVec3) {
        this.y = v3fVec.x; this.z = v3fVec.y; this.z = v3fVec.z;
    }

    get zxx(): AIVec3 {
        return vec3(this.z, this.x, this.x);
    }
    set zxx(v3fVec: AIVec3) {
        this.z = v3fVec.x; this.x = v3fVec.y; this.x = v3fVec.z;
    }

    get zxy(): AIVec3 {
        return vec3(this.z, this.x, this.y);
    }
    set zxy(v3fVec: AIVec3) {
        this.z = v3fVec.x; this.x = v3fVec.y; this.y = v3fVec.z;
    }

    get zxz(): AIVec3 {
        return vec3(this.z, this.x, this.z);
    }
    set zxz(v3fVec: AIVec3) {
        this.z = v3fVec.x; this.x = v3fVec.y; this.z = v3fVec.z;
    }

    get zyx(): AIVec3 {
        return vec3(this.z, this.y, this.x);
    }
    set zyx(v3fVec: AIVec3) {
        this.z = v3fVec.x; this.y = v3fVec.y; this.x = v3fVec.z;
    }

    get zyy(): AIVec3 {
        return vec3(this.z, this.y, this.y);
    }
    set zyy(v3fVec: AIVec3) {
        this.z = v3fVec.x; this.y = v3fVec.y; this.y = v3fVec.z;
    }

    get zyz(): AIVec3 {
        return vec3(this.z, this.y, this.z);
    }
    set zyz(v3fVec: AIVec3) {
        this.z = v3fVec.x; this.y = v3fVec.y; this.z = v3fVec.z;
    }

    get zzx(): AIVec3 {
        return vec3(this.z, this.z, this.x);
    }
    set zzx(v3fVec: AIVec3) {
        this.z = v3fVec.x; this.z = v3fVec.y; this.x = v3fVec.z;
    }

    get zzy(): AIVec3 {
        return vec3(this.z, this.z, this.y);
    }
    set zzy(v3fVec: AIVec3) {
        this.z = v3fVec.x; this.z = v3fVec.y; this.y = v3fVec.z;
    }

    get zzz(): AIVec3 {
        return vec3(this.z, this.z, this.z);
    }
    set zzz(v3fVec: AIVec3) {
        this.z = v3fVec.x; this.z = v3fVec.y; this.z = v3fVec.z;
    }

    constructor();
    constructor(xyz: float);
    constructor(xyz: AIVec3);
    constructor(xyz: float[]);
    constructor(x: float, yz: AIVec2);
    constructor(xy: AIVec2, z: float);
    constructor(x: float, y: float, z: float);
    constructor(x?, y?, z?) {
        var nArg: uint = arguments.length;

        switch (nArg) {
            case 1:
                this.set(arguments[0]);
                break;
            case 2:
                this.set(arguments[0], arguments[1]);
                break;
            case 3:
                this.set(arguments[0], arguments[1], arguments[2]);
                break;
            default:
                this.x = this.y = this.z = 0.;
                break;
        }

        return 10;
    }

    set(): AIVec3;
    set(xyz: float): AIVec3;
    set(xyz: AIVec3): AIVec3;
    set(xyz: float[]): AIVec3;
    set(x: float, yz: AIVec2): AIVec3;
    set(xy: AIVec2, z: float): AIVec3;
    set(x: float, y: float, z: float): AIVec3;
    set(x?, y?, z?): AIVec3 {
        var nArgumentsLength = arguments.length;

        switch (nArgumentsLength) {
            case 0:
                this.x = this.y = this.z = 0.;
                break;
            case 1:
                if (isFloat(arguments[0])) {
                    this.x = this.y = this.z = arguments[0];
                }
                else if (arguments[0] instanceof Vec3) {
                    var v3fVec: AIVec3 = <AIVec3>arguments[0];

                    this.x = v3fVec.x;
                    this.y = v3fVec.y;
                    this.z = v3fVec.z;
                }
                else {
                    var pArray: float[] = arguments[0];

                    this.x = pArray[0];
                    this.y = pArray[1];
                    this.z = pArray[2];
                }
                break;
            case 2:
                if (isFloat(arguments[0])) {
                    var fValue: float = arguments[0];
                    var v2fVec: AIVec2 = <AIVec2>arguments[1];

                    this.x = fValue;
                    this.y = v2fVec.x;
                    this.z = v2fVec.y;
                }
                else {
                    var v2fVec: AIVec2 = arguments[0];
                    var fValue: float = arguments[1];

                    this.x = v2fVec.x;
                    this.y = v2fVec.y;
                    this.z = fValue;
                }
                break;
            case 3:
                this.x = arguments[0];
                this.y = arguments[1];
                this.z = arguments[2];
                break;
        }

        return this;
    }
    

    X(fLength: float = 1.): AIVec3 {
        return this.set(fLength, 0., 0.);
    }

    Y(fLength: float = 1.): AIVec3 {
        return this.set(0., fLength, 0.);
    }

    Z(fLength: float = 1.): AIVec3 {
        return this.set(0., 0., fLength);
    }

    /** inline */ clear(): AIVec3 {
        this.x = this.y = this.z = 0.;
        return this;
    }


    add(v3fVec: AIVec3, v3fDestination?: AIVec3): AIVec3 {
        if (!isDef(v3fDestination)) {
            v3fDestination = this;
        }

        v3fDestination.x = this.x + v3fVec.x;
        v3fDestination.y = this.y + v3fVec.y;
        v3fDestination.z = this.z + v3fVec.z;

        return v3fDestination;
    }


    subtract(v3fVec: AIVec3, v3fDestination?: AIVec3): AIVec3 {
        if (!isDef(v3fDestination)) {
            v3fDestination = this;
        }

        v3fDestination.x = this.x - v3fVec.x;
        v3fDestination.y = this.y - v3fVec.y;
        v3fDestination.z = this.z - v3fVec.z;

        return v3fDestination;
    }

    /** inline */ dot(v3fVec: AIVec3): float {
        return this.x * v3fVec.x + this.y * v3fVec.y + this.z * v3fVec.z;
    }


    cross(v3fVec: AIVec3, v3fDestination?: AIVec3): AIVec3 {
        if (!isDef(v3fDestination)) {
            v3fDestination = this;
        }

        var x1: float = this.x, y1: float = this.y, z1: float = this.z;
        var x2: float = v3fVec.x, y2: float = v3fVec.y, z2: float = v3fVec.z;

        v3fDestination.x = y1 * z2 - z1 * y2;
        v3fDestination.y = z1 * x2 - x1 * z2;
        v3fDestination.z = x1 * y2 - y1 * x2;

        return v3fDestination;
    }

    isEqual(v3fVec: AIVec3, fEps: float = 0.): boolean {
        if (fEps === 0.) {
            if (this.x != v3fVec.x
                || this.y != v3fVec.y
                || this.z != v3fVec.z) {

                return false;
            }
        }
        else {
            if (abs(this.x - v3fVec.x) > fEps
                || abs(this.y - v3fVec.y) > fEps
                || abs(this.z - v3fVec.z) > fEps) {

                return false;
            }
        }
        return true;
    }


    isClear(fEps: float = 0.): boolean {
        if (fEps === 0.) {
            if (this.x != 0.
                || this.y != 0.
                || this.z != 0.) {

                return false;
            }
        }
        else {
            if (abs(this.x) > fEps
                || abs(this.y) > fEps
                || abs(this.z) > fEps) {

                return false;
            }
        }

        return true;
    }

    negate(v3fDestination?: AIVec3): AIVec3 {
        if (!isDef(v3fDestination)) {
            v3fDestination = this;
        }

        v3fDestination.x = -this.x;
        v3fDestination.y = -this.y;
        v3fDestination.z = -this.z;

        return v3fDestination;
    }

    scale(v3fScale: AIVec3, v3fDestination?: AIVec3): AIVec3;
    scale(fScale: float, v3fDestination?: AIVec3): AIVec3;
    scale(): AIVec3 {
        var v3fDestination: AIVec3 = (arguments.length === 2 && isDef(arguments[1])) ? arguments[1] : this;

        if (isNumber(arguments[0])) {
            var fScale: float = arguments[0];
            v3fDestination.x = this.x * fScale;
            v3fDestination.y = this.y * fScale;
            v3fDestination.z = this.z * fScale;
        }
        else {
            var v3fScale: AIVec3 = arguments[0];
            v3fDestination.x = this.x * v3fScale.x;
            v3fDestination.y = this.y * v3fScale.y;
            v3fDestination.z = this.z * v3fScale.z;
        }

        return v3fDestination;
    }

    normalize(v3fDestination?: AIVec3): AIVec3 {
        if (!v3fDestination) {
            v3fDestination = this;
        }

        var x: float = this.x, y: float = this.y, z: float = this.z;
        var fLength: float = math.sqrt(x * x + y * y + z * z);

        if (fLength !== 0.) {
            var fInvLength: float = 1. / fLength;

            x *= fInvLength;
            y *= fInvLength;
            z *= fInvLength;
        }

        v3fDestination.x = x;
        v3fDestination.y = y;
        v3fDestination.z = z;

        return v3fDestination;
    }

    /** inline */ length(): float {
        return math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    /** inline */ lengthSquare(): float {
        var x: float = this.x, y: float = this.y, z: float = this.z;
        return x * x + y * y + z * z;
    }

    direction(v3fVec: AIVec3, v3fDestination?: AIVec3): AIVec3 {
        if (!isDef(v3fDestination)) {
            v3fDestination = this;
        }

        var x: float = v3fVec.x - this.x;
        var y: float = v3fVec.y - this.y;
        var z: float = v3fVec.z - this.z;

        var fLength: float = math.sqrt(x * x + y * y + z * z);

        if (fLength !== 0.) {
            var fInvLength = 1. / fLength;

            x *= fInvLength;
            y *= fInvLength;
            z *= fInvLength;
        }

        v3fDestination.x = x;
        v3fDestination.y = y;
        v3fDestination.z = z;

        return v3fDestination;
    }

    mix(v3fVec: AIVec3, fA: float, v3fDestination?: AIVec3): AIVec3 {
        if (!isDef(v3fDestination)) {
            v3fDestination = this;
        }

        fA = clamp(fA, 0., 1.);

        var fA1: float = 1. - fA;
        var fA2: float = fA;

        v3fDestination.x = fA1 * this.x + fA2 * v3fVec.x;
        v3fDestination.y = fA1 * this.y + fA2 * v3fVec.y;
        v3fDestination.z = fA1 * this.z + fA2 * v3fVec.z;

        return v3fDestination;
    }

    /** inline */ toString(): string {
        return "[x: " + this.x + " ,y: " + this.y + ", z: " + this.z + "]";
    }

    /** inline */ toArray(pDest: float[]= []): float[] {
        pDest[0] = this.x;
        pDest[1] = this.y;
        pDest[2] = this.z;
        return pDest;
    }

    toTranslationMatrix(m4fDestination?: AIMat4): AIMat4 {
        if (!isDef(m4fDestination)) {
            m4fDestination = new Mat4(1.);
        }
        else {
            m4fDestination.set(1.);
        }

        var pData: Float32Array = m4fDestination.data;

        pData[__14] = this.x;
        pData[__24] = this.y;
        pData[__34] = this.z;

        return m4fDestination;
    }

    vec3TransformCoord(m4fTransformation: AIMat4, v3fDestination?: AIVec3): AIVec3 {
        if (!v3fDestination) {
            v3fDestination = this;
        }

        var pData: Float32Array = m4fTransformation.data;

        var x: float = this.x;
        var y: float = this.y;
        var z: float = this.z;
        var w: float;

        x = pData[__11] * x + pData[__12] * y + pData[__13] * z + pData[__14];
        y = pData[__21] * x + pData[__22] * y + pData[__23] * z + pData[__24];
        z = pData[__31] * x + pData[__32] * y + pData[__33] * z + pData[__34];
        w = pData[__31] * x + pData[__42] * y + pData[__43] * z + pData[__44];

        var fInvW: float = 1. / w;

        v3fDestination.x = x * fInvW;
        v3fDestination.y = y * fInvW;
        v3fDestination.z = z * fInvW;

        return v3fDestination;
    }

    static temp(): AIVec3;
    static temp(xyz: float): AIVec3;
    static temp(xyz: AIVec3): AIVec3;
    static temp(xyz: float[]): AIVec3;
    static temp(x: float, yz: AIVec2): AIVec3;
    static temp(xy: AIVec2, z: float): AIVec3;
    static temp(x: float, y: float, z: float): AIVec3;
    static temp(x?, y?, z?): AIVec3 {
        iElement = (iElement === pBuffer.length - 1 ? 0 : pBuffer.length);
        var p = pBuffer[iElement++];
        return p.set.apply(p, arguments);
    }
}

pBuffer = gen.array<AIVec3>(256, Vec3);
iElement = 0;

export = Vec3;