/// <reference path="../idl/AIVec2.ts" />
/// <reference path="../idl/AIVec3.ts" />
/// <reference path="../idl/AIVec4.ts" />
/// <reference path="../idl/AIMat3.ts" />
/// <reference path="../idl/AIMat4.ts" />
/// <reference path="../idl/AIQuat4.ts" />

//#include "const.ts"

//#define vec2(...) Vec2.stackCeil.set(__VA_ARGS__)
//#define vec3(...) Vec3.stackCeil.set(__VA_ARGS__)
//#define vec4(...) Vec4.stackCeil.set(__VA_ARGS__)
//#define quat4(...) Quat4.stackCeil.set(__VA_ARGS__)
//#define mat3(...) Mat3.stackCeil.set(__VA_ARGS__)
//#define mat4(...) Mat4.stackCeil.set(__VA_ARGS__)

//#include "Vec2.ts"
//#include "Vec3.ts"
//#include "Vec4.ts"

//#include "Mat2.ts"
//#include "Mat3.ts"
//#include "Mat4.ts"

//#include "Quat4.ts"

//#include "global.ts"


export var abs = Math.abs;
export var acos = Math.acos;
export var asin = Math.asin;
export var atan = Math.atan;
export var atan2 = Math.atan2;
export var exp = Math.exp;
export var min = Math.min;
export var random = Math.random;
export var sqrt = Math.sqrt;
export var log = Math.log;
export var round = Math.round;
export var floor = Math.floor;
export var ceil = Math.ceil;
export var sin = Math.sin;
export var cos = Math.cos;
export var tan = Math.tan;
export var pow = Math.pow;
export var max = Math.max;


/*
export function floatToFloat3(value: float): AIVec3 {
    var data: float = value;
    var result: AIVec3 = vec3(0.);

    if (data == 0.) {
        var signedZeroTest: float = 1. / value;

        if (signedZeroTest < 0.) {
            result.x = 128.;
        }

        return result;
    }

    if (data < 0.) {
        result.x = 128.;
        data = -data;
    }

    var power: float = 0.;
    var counter: float = 0.;

    while (counter < 64.) {
        counter += 1.;

        if (data >= 2.) {
            data = data * 0.5;
            power += 1.;
            if (power == 63.) {
                counter = 65.;
            }
        }
        else {
            if (data < 1.) {
                data = data * 2.;
                power -= 1.;
                if (power == -62.) {
                    counter = 65.;
                }
            }
            else {
                counter = 65.;
            }
        }
    }

    if (power == -62. && data < 1.) {
        power = 0.;
    }
    else {
        power = power + 63.;
        data = data - 1.;
    }

    result.x += power;

    data *= 256.;

    result.y = floor(data);

    data -= floor(data);
    data *= 256.;

    result.z = floor(data);

    return result;
}


*/