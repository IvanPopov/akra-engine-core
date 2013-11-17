/// <reference path="../idl/common.d.ts" />
/// <reference path="../idl/AIVec4.ts" />
/// <reference path="../idl/AIColorValue.ts" />

import gen = require("generate");
import math = require("math");

import sqrt = math.sqrt;
import abs = math.abs;
import clamp = math.clamp;

import Vec2 = math.Vec2;

var pBuffer: AIVec4[];
var iElement: uint;

class Vec4 implements AIVec4 {
    x: float;
    y: float;
    z: float;
    w: float;

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

    get xw(): AIVec2 {
        return vec2(this.x, this.w);
    }
    set xw(v2fVec: AIVec2) {
        this.x = v2fVec.x; this.w = v2fVec.y;
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

    get yw(): AIVec2 {
        return vec2(this.y, this.w);
    }
    set yw(v2fVec: AIVec2) {
        this.y = v2fVec.x; this.w = v2fVec.y;
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

    get zw(): AIVec2 {
        return vec2(this.z, this.w);
    }
    set zw(v2fVec: AIVec2) {
        this.z = v2fVec.x; this.w = v2fVec.y;
    }

    get wx(): AIVec2 {
        return vec2(this.w, this.x);
    }
    set wx(v2fVec: AIVec2) {
        this.w = v2fVec.x; this.x = v2fVec.y;
    }

    get wy(): AIVec2 {
        return vec2(this.w, this.y);
    }
    set wy(v2fVec: AIVec2) {
        this.w = v2fVec.x; this.y = v2fVec.y;
    }

    get wz(): AIVec2 {
        return vec2(this.w, this.z);
    }
    set wz(v2fVec: AIVec2) {
        this.w = v2fVec.x; this.z = v2fVec.y;
    }

    get ww(): AIVec2 {
        return vec2(this.w, this.w);
    }
    set ww(v2fVec: AIVec2) {
        this.w = v2fVec.x; this.w = v2fVec.y;
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

    get xxw(): AIVec3 {
        return vec3(this.x, this.x, this.w);
    }
    set xxw(v3fVec: AIVec3) {
        this.x = v3fVec.x; this.x = v3fVec.y; this.w = v3fVec.z;
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

    get xyw(): AIVec3 {
        return vec3(this.x, this.y, this.w);
    }
    set xyw(v3fVec: AIVec3) {
        this.x = v3fVec.x; this.y = v3fVec.y; this.w = v3fVec.z;
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

    get xzw(): AIVec3 {
        return vec3(this.x, this.z, this.w);
    }
    set xzw(v3fVec: AIVec3) {
        this.x = v3fVec.x; this.z = v3fVec.y; this.w = v3fVec.z;
    }

    get xwx(): AIVec3 {
        return vec3(this.x, this.w, this.x);
    }
    set xwx(v3fVec: AIVec3) {
        this.x = v3fVec.x; this.w = v3fVec.y; this.x = v3fVec.z;
    }

    get xwy(): AIVec3 {
        return vec3(this.x, this.w, this.y);
    }
    set xwy(v3fVec: AIVec3) {
        this.x = v3fVec.x; this.w = v3fVec.y; this.y = v3fVec.z;
    }

    get xwz(): AIVec3 {
        return vec3(this.x, this.w, this.z);
    }
    set xwz(v3fVec: AIVec3) {
        this.x = v3fVec.x; this.w = v3fVec.y; this.z = v3fVec.z;
    }

    get xww(): AIVec3 {
        return vec3(this.x, this.w, this.w);
    }
    set xww(v3fVec: AIVec3) {
        this.x = v3fVec.x; this.w = v3fVec.y; this.w = v3fVec.z;
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

    get yxw(): AIVec3 {
        return vec3(this.y, this.x, this.w);
    }
    set yxw(v3fVec: AIVec3) {
        this.y = v3fVec.x; this.x = v3fVec.y; this.w = v3fVec.z;
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

    get yyw(): AIVec3 {
        return vec3(this.y, this.y, this.w);
    }
    set yyw(v3fVec: AIVec3) {
        this.y = v3fVec.x; this.y = v3fVec.y; this.w = v3fVec.z;
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

    get yzw(): AIVec3 {
        return vec3(this.y, this.z, this.w);
    }
    set yzw(v3fVec: AIVec3) {
        this.y = v3fVec.x; this.z = v3fVec.y; this.w = v3fVec.z;
    }

    get ywx(): AIVec3 {
        return vec3(this.y, this.w, this.x);
    }
    set ywx(v3fVec: AIVec3) {
        this.y = v3fVec.x; this.w = v3fVec.y; this.x = v3fVec.z;
    }

    get ywy(): AIVec3 {
        return vec3(this.y, this.w, this.y);
    }
    set ywy(v3fVec: AIVec3) {
        this.y = v3fVec.x; this.w = v3fVec.y; this.y = v3fVec.z;
    }

    get ywz(): AIVec3 {
        return vec3(this.y, this.w, this.z);
    }
    set ywz(v3fVec: AIVec3) {
        this.y = v3fVec.x; this.w = v3fVec.y; this.z = v3fVec.z;
    }

    get yww(): AIVec3 {
        return vec3(this.y, this.w, this.w);
    }
    set yww(v3fVec: AIVec3) {
        this.y = v3fVec.x; this.w = v3fVec.y; this.w = v3fVec.z;
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

    get zxw(): AIVec3 {
        return vec3(this.z, this.x, this.w);
    }
    set zxw(v3fVec: AIVec3) {
        this.z = v3fVec.x; this.x = v3fVec.y; this.w = v3fVec.z;
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

    get zyw(): AIVec3 {
        return vec3(this.z, this.y, this.w);
    }
    set zyw(v3fVec: AIVec3) {
        this.z = v3fVec.x; this.y = v3fVec.y; this.w = v3fVec.z;
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

    get zzw(): AIVec3 {
        return vec3(this.z, this.z, this.w);
    }
    set zzw(v3fVec: AIVec3) {
        this.z = v3fVec.x; this.z = v3fVec.y; this.w = v3fVec.z;
    }

    get zwx(): AIVec3 {
        return vec3(this.z, this.w, this.x);
    }
    set zwx(v3fVec: AIVec3) {
        this.z = v3fVec.x; this.w = v3fVec.y; this.x = v3fVec.z;
    }

    get zwy(): AIVec3 {
        return vec3(this.z, this.w, this.y);
    }
    set zwy(v3fVec: AIVec3) {
        this.z = v3fVec.x; this.w = v3fVec.y; this.y = v3fVec.z;
    }

    get zwz(): AIVec3 {
        return vec3(this.z, this.w, this.z);
    }
    set zwz(v3fVec: AIVec3) {
        this.z = v3fVec.x; this.w = v3fVec.y; this.z = v3fVec.z;
    }

    get zww(): AIVec3 {
        return vec3(this.z, this.w, this.w);
    }
    set zww(v3fVec: AIVec3) {
        this.z = v3fVec.x; this.w = v3fVec.y; this.w = v3fVec.z;
    }

    get wxx(): AIVec3 {
        return vec3(this.w, this.x, this.x);
    }
    set wxx(v3fVec: AIVec3) {
        this.w = v3fVec.x; this.x = v3fVec.y; this.x = v3fVec.z;
    }

    get wxy(): AIVec3 {
        return vec3(this.w, this.x, this.y);
    }
    set wxy(v3fVec: AIVec3) {
        this.w = v3fVec.x; this.x = v3fVec.y; this.y = v3fVec.z;
    }

    get wxz(): AIVec3 {
        return vec3(this.w, this.x, this.z);
    }
    set wxz(v3fVec: AIVec3) {
        this.w = v3fVec.x; this.x = v3fVec.y; this.z = v3fVec.z;
    }

    get wxw(): AIVec3 {
        return vec3(this.w, this.x, this.w);
    }
    set wxw(v3fVec: AIVec3) {
        this.w = v3fVec.x; this.x = v3fVec.y; this.w = v3fVec.z;
    }

    get wyx(): AIVec3 {
        return vec3(this.w, this.y, this.x);
    }
    set wyx(v3fVec: AIVec3) {
        this.w = v3fVec.x; this.y = v3fVec.y; this.x = v3fVec.z;
    }

    get wyy(): AIVec3 {
        return vec3(this.w, this.y, this.y);
    }
    set wyy(v3fVec: AIVec3) {
        this.w = v3fVec.x; this.y = v3fVec.y; this.y = v3fVec.z;
    }

    get wyz(): AIVec3 {
        return vec3(this.w, this.y, this.z);
    }
    set wyz(v3fVec: AIVec3) {
        this.w = v3fVec.x; this.y = v3fVec.y; this.z = v3fVec.z;
    }

    get wyw(): AIVec3 {
        return vec3(this.w, this.y, this.w);
    }
    set wyw(v3fVec: AIVec3) {
        this.w = v3fVec.x; this.y = v3fVec.y; this.w = v3fVec.z;
    }

    get wzx(): AIVec3 {
        return vec3(this.w, this.z, this.x);
    }
    set wzx(v3fVec: AIVec3) {
        this.w = v3fVec.x; this.z = v3fVec.y; this.x = v3fVec.z;
    }

    get wzy(): AIVec3 {
        return vec3(this.w, this.z, this.y);
    }
    set wzy(v3fVec: AIVec3) {
        this.w = v3fVec.x; this.z = v3fVec.y; this.y = v3fVec.z;
    }

    get wzz(): AIVec3 {
        return vec3(this.w, this.z, this.z);
    }
    set wzz(v3fVec: AIVec3) {
        this.w = v3fVec.x; this.z = v3fVec.y; this.z = v3fVec.z;
    }

    get wzw(): AIVec3 {
        return vec3(this.w, this.z, this.w);
    }
    set wzw(v3fVec: AIVec3) {
        this.w = v3fVec.x; this.z = v3fVec.y; this.w = v3fVec.z;
    }

    get wwx(): AIVec3 {
        return vec3(this.w, this.w, this.x);
    }
    set wwx(v3fVec: AIVec3) {
        this.w = v3fVec.x; this.w = v3fVec.y; this.x = v3fVec.z;
    }

    get wwy(): AIVec3 {
        return vec3(this.w, this.w, this.y);
    }
    set wwy(v3fVec: AIVec3) {
        this.w = v3fVec.x; this.w = v3fVec.y; this.y = v3fVec.z;
    }

    get wwz(): AIVec3 {
        return vec3(this.w, this.w, this.z);
    }
    set wwz(v3fVec: AIVec3) {
        this.w = v3fVec.x; this.w = v3fVec.y; this.z = v3fVec.z;
    }

    get www(): AIVec3 {
        return vec3(this.w, this.w, this.w);
    }
    set www(v3fVec: AIVec3) {
        this.w = v3fVec.x; this.w = v3fVec.y; this.w = v3fVec.z;
    }


    get xxxx(): AIVec4 {
        return Vec4.temp(this.x, this.x, this.x, this.x);
    }
    set xxxx(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.x = v4fVec.y;
        this.x = v4fVec.z; this.x = v4fVec.w;
    }

    get xxxy(): AIVec4 {
        return Vec4.temp(this.x, this.x, this.x, this.y);
    }
    set xxxy(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.x = v4fVec.y;
        this.x = v4fVec.z; this.y = v4fVec.w;
    }

    get xxxz(): AIVec4 {
        return Vec4.temp(this.x, this.x, this.x, this.z);
    }
    set xxxz(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.x = v4fVec.y;
        this.x = v4fVec.z; this.z = v4fVec.w;
    }

    get xxxw(): AIVec4 {
        return Vec4.temp(this.x, this.x, this.x, this.w);
    }
    set xxxw(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.x = v4fVec.y;
        this.x = v4fVec.z; this.w = v4fVec.w;
    }

    get xxyx(): AIVec4 {
        return Vec4.temp(this.x, this.x, this.y, this.x);
    }
    set xxyx(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.x = v4fVec.y;
        this.y = v4fVec.z; this.x = v4fVec.w;
    }

    get xxyy(): AIVec4 {
        return Vec4.temp(this.x, this.x, this.y, this.y);
    }
    set xxyy(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.x = v4fVec.y;
        this.y = v4fVec.z; this.y = v4fVec.w;
    }

    get xxyz(): AIVec4 {
        return Vec4.temp(this.x, this.x, this.y, this.z);
    }
    set xxyz(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.x = v4fVec.y;
        this.y = v4fVec.z; this.z = v4fVec.w;
    }

    get xxyw(): AIVec4 {
        return Vec4.temp(this.x, this.x, this.y, this.w);
    }
    set xxyw(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.x = v4fVec.y;
        this.y = v4fVec.z; this.w = v4fVec.w;
    }

    get xxzx(): AIVec4 {
        return Vec4.temp(this.x, this.x, this.z, this.x);
    }
    set xxzx(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.x = v4fVec.y;
        this.z = v4fVec.z; this.x = v4fVec.w;
    }

    get xxzy(): AIVec4 {
        return Vec4.temp(this.x, this.x, this.z, this.y);
    }
    set xxzy(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.x = v4fVec.y;
        this.z = v4fVec.z; this.y = v4fVec.w;
    }

    get xxzz(): AIVec4 {
        return Vec4.temp(this.x, this.x, this.z, this.z);
    }
    set xxzz(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.x = v4fVec.y;
        this.z = v4fVec.z; this.z = v4fVec.w;
    }

    get xxzw(): AIVec4 {
        return Vec4.temp(this.x, this.x, this.z, this.w);
    }
    set xxzw(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.x = v4fVec.y;
        this.z = v4fVec.z; this.w = v4fVec.w;
    }

    get xxwx(): AIVec4 {
        return Vec4.temp(this.x, this.x, this.w, this.x);
    }
    set xxwx(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.x = v4fVec.y;
        this.w = v4fVec.z; this.x = v4fVec.w;
    }

    get xxwy(): AIVec4 {
        return Vec4.temp(this.x, this.x, this.w, this.y);
    }
    set xxwy(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.x = v4fVec.y;
        this.w = v4fVec.z; this.y = v4fVec.w;
    }

    get xxwz(): AIVec4 {
        return Vec4.temp(this.x, this.x, this.w, this.z);
    }
    set xxwz(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.x = v4fVec.y;
        this.w = v4fVec.z; this.z = v4fVec.w;
    }

    get xxww(): AIVec4 {
        return Vec4.temp(this.x, this.x, this.w, this.w);
    }
    set xxww(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.x = v4fVec.y;
        this.w = v4fVec.z; this.w = v4fVec.w;
    }

    get xyxx(): AIVec4 {
        return Vec4.temp(this.x, this.y, this.x, this.x);
    }
    set xyxx(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.y = v4fVec.y;
        this.x = v4fVec.z; this.x = v4fVec.w;
    }

    get xyxy(): AIVec4 {
        return Vec4.temp(this.x, this.y, this.x, this.y);
    }
    set xyxy(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.y = v4fVec.y;
        this.x = v4fVec.z; this.y = v4fVec.w;
    }

    get xyxz(): AIVec4 {
        return Vec4.temp(this.x, this.y, this.x, this.z);
    }
    set xyxz(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.y = v4fVec.y;
        this.x = v4fVec.z; this.z = v4fVec.w;
    }

    get xyxw(): AIVec4 {
        return Vec4.temp(this.x, this.y, this.x, this.w);
    }
    set xyxw(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.y = v4fVec.y;
        this.x = v4fVec.z; this.w = v4fVec.w;
    }

    get xyyx(): AIVec4 {
        return Vec4.temp(this.x, this.y, this.y, this.x);
    }
    set xyyx(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.y = v4fVec.y;
        this.y = v4fVec.z; this.x = v4fVec.w;
    }

    get xyyy(): AIVec4 {
        return Vec4.temp(this.x, this.y, this.y, this.y);
    }
    set xyyy(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.y = v4fVec.y;
        this.y = v4fVec.z; this.y = v4fVec.w;
    }

    get xyyz(): AIVec4 {
        return Vec4.temp(this.x, this.y, this.y, this.z);
    }
    set xyyz(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.y = v4fVec.y;
        this.y = v4fVec.z; this.z = v4fVec.w;
    }

    get xyyw(): AIVec4 {
        return Vec4.temp(this.x, this.y, this.y, this.w);
    }
    set xyyw(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.y = v4fVec.y;
        this.y = v4fVec.z; this.w = v4fVec.w;
    }

    get xyzx(): AIVec4 {
        return Vec4.temp(this.x, this.y, this.z, this.x);
    }
    set xyzx(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.y = v4fVec.y;
        this.z = v4fVec.z; this.x = v4fVec.w;
    }

    get xyzy(): AIVec4 {
        return Vec4.temp(this.x, this.y, this.z, this.y);
    }
    set xyzy(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.y = v4fVec.y;
        this.z = v4fVec.z; this.y = v4fVec.w;
    }

    get xyzz(): AIVec4 {
        return Vec4.temp(this.x, this.y, this.z, this.z);
    }
    set xyzz(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.y = v4fVec.y;
        this.z = v4fVec.z; this.z = v4fVec.w;
    }

    get xyzw(): AIVec4 {
        return Vec4.temp(this.x, this.y, this.z, this.w);
    }
    set xyzw(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.y = v4fVec.y;
        this.z = v4fVec.z; this.w = v4fVec.w;
    }

    get xywx(): AIVec4 {
        return Vec4.temp(this.x, this.y, this.w, this.x);
    }
    set xywx(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.y = v4fVec.y;
        this.w = v4fVec.z; this.x = v4fVec.w;
    }

    get xywy(): AIVec4 {
        return Vec4.temp(this.x, this.y, this.w, this.y);
    }
    set xywy(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.y = v4fVec.y;
        this.w = v4fVec.z; this.y = v4fVec.w;
    }

    get xywz(): AIVec4 {
        return Vec4.temp(this.x, this.y, this.w, this.z);
    }
    set xywz(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.y = v4fVec.y;
        this.w = v4fVec.z; this.z = v4fVec.w;
    }

    get xyww(): AIVec4 {
        return Vec4.temp(this.x, this.y, this.w, this.w);
    }
    set xyww(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.y = v4fVec.y;
        this.w = v4fVec.z; this.w = v4fVec.w;
    }

    get xzxx(): AIVec4 {
        return Vec4.temp(this.x, this.z, this.x, this.x);
    }
    set xzxx(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.z = v4fVec.y;
        this.x = v4fVec.z; this.x = v4fVec.w;
    }

    get xzxy(): AIVec4 {
        return Vec4.temp(this.x, this.z, this.x, this.y);
    }
    set xzxy(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.z = v4fVec.y;
        this.x = v4fVec.z; this.y = v4fVec.w;
    }

    get xzxz(): AIVec4 {
        return Vec4.temp(this.x, this.z, this.x, this.z);
    }
    set xzxz(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.z = v4fVec.y;
        this.x = v4fVec.z; this.z = v4fVec.w;
    }

    get xzxw(): AIVec4 {
        return Vec4.temp(this.x, this.z, this.x, this.w);
    }
    set xzxw(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.z = v4fVec.y;
        this.x = v4fVec.z; this.w = v4fVec.w;
    }

    get xzyx(): AIVec4 {
        return Vec4.temp(this.x, this.z, this.y, this.x);
    }
    set xzyx(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.z = v4fVec.y;
        this.y = v4fVec.z; this.x = v4fVec.w;
    }

    get xzyy(): AIVec4 {
        return Vec4.temp(this.x, this.z, this.y, this.y);
    }
    set xzyy(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.z = v4fVec.y;
        this.y = v4fVec.z; this.y = v4fVec.w;
    }

    get xzyz(): AIVec4 {
        return Vec4.temp(this.x, this.z, this.y, this.z);
    }
    set xzyz(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.z = v4fVec.y;
        this.y = v4fVec.z; this.z = v4fVec.w;
    }

    get xzyw(): AIVec4 {
        return Vec4.temp(this.x, this.z, this.y, this.w);
    }
    set xzyw(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.z = v4fVec.y;
        this.y = v4fVec.z; this.w = v4fVec.w;
    }

    get xzzx(): AIVec4 {
        return Vec4.temp(this.x, this.z, this.z, this.x);
    }
    set xzzx(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.z = v4fVec.y;
        this.z = v4fVec.z; this.x = v4fVec.w;
    }

    get xzzy(): AIVec4 {
        return Vec4.temp(this.x, this.z, this.z, this.y);
    }
    set xzzy(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.z = v4fVec.y;
        this.z = v4fVec.z; this.y = v4fVec.w;
    }

    get xzzz(): AIVec4 {
        return Vec4.temp(this.x, this.z, this.z, this.z);
    }
    set xzzz(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.z = v4fVec.y;
        this.z = v4fVec.z; this.z = v4fVec.w;
    }

    get xzzw(): AIVec4 {
        return Vec4.temp(this.x, this.z, this.z, this.w);
    }
    set xzzw(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.z = v4fVec.y;
        this.z = v4fVec.z; this.w = v4fVec.w;
    }

    get xzwx(): AIVec4 {
        return Vec4.temp(this.x, this.z, this.w, this.x);
    }
    set xzwx(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.z = v4fVec.y;
        this.w = v4fVec.z; this.x = v4fVec.w;
    }

    get xzwy(): AIVec4 {
        return Vec4.temp(this.x, this.z, this.w, this.y);
    }
    set xzwy(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.z = v4fVec.y;
        this.w = v4fVec.z; this.y = v4fVec.w;
    }

    get xzwz(): AIVec4 {
        return Vec4.temp(this.x, this.z, this.w, this.z);
    }
    set xzwz(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.z = v4fVec.y;
        this.w = v4fVec.z; this.z = v4fVec.w;
    }

    get xzww(): AIVec4 {
        return Vec4.temp(this.x, this.z, this.w, this.w);
    }
    set xzww(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.z = v4fVec.y;
        this.w = v4fVec.z; this.w = v4fVec.w;
    }

    get xwxx(): AIVec4 {
        return Vec4.temp(this.x, this.w, this.x, this.x);
    }
    set xwxx(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.w = v4fVec.y;
        this.x = v4fVec.z; this.x = v4fVec.w;
    }

    get xwxy(): AIVec4 {
        return Vec4.temp(this.x, this.w, this.x, this.y);
    }
    set xwxy(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.w = v4fVec.y;
        this.x = v4fVec.z; this.y = v4fVec.w;
    }

    get xwxz(): AIVec4 {
        return Vec4.temp(this.x, this.w, this.x, this.z);
    }
    set xwxz(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.w = v4fVec.y;
        this.x = v4fVec.z; this.z = v4fVec.w;
    }

    get xwxw(): AIVec4 {
        return Vec4.temp(this.x, this.w, this.x, this.w);
    }
    set xwxw(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.w = v4fVec.y;
        this.x = v4fVec.z; this.w = v4fVec.w;
    }

    get xwyx(): AIVec4 {
        return Vec4.temp(this.x, this.w, this.y, this.x);
    }
    set xwyx(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.w = v4fVec.y;
        this.y = v4fVec.z; this.x = v4fVec.w;
    }

    get xwyy(): AIVec4 {
        return Vec4.temp(this.x, this.w, this.y, this.y);
    }
    set xwyy(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.w = v4fVec.y;
        this.y = v4fVec.z; this.y = v4fVec.w;
    }

    get xwyz(): AIVec4 {
        return Vec4.temp(this.x, this.w, this.y, this.z);
    }
    set xwyz(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.w = v4fVec.y;
        this.y = v4fVec.z; this.z = v4fVec.w;
    }

    get xwyw(): AIVec4 {
        return Vec4.temp(this.x, this.w, this.y, this.w);
    }
    set xwyw(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.w = v4fVec.y;
        this.y = v4fVec.z; this.w = v4fVec.w;
    }

    get xwzx(): AIVec4 {
        return Vec4.temp(this.x, this.w, this.z, this.x);
    }
    set xwzx(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.w = v4fVec.y;
        this.z = v4fVec.z; this.x = v4fVec.w;
    }

    get xwzy(): AIVec4 {
        return Vec4.temp(this.x, this.w, this.z, this.y);
    }
    set xwzy(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.w = v4fVec.y;
        this.z = v4fVec.z; this.y = v4fVec.w;
    }

    get xwzz(): AIVec4 {
        return Vec4.temp(this.x, this.w, this.z, this.z);
    }
    set xwzz(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.w = v4fVec.y;
        this.z = v4fVec.z; this.z = v4fVec.w;
    }

    get xwzw(): AIVec4 {
        return Vec4.temp(this.x, this.w, this.z, this.w);
    }
    set xwzw(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.w = v4fVec.y;
        this.z = v4fVec.z; this.w = v4fVec.w;
    }

    get xwwx(): AIVec4 {
        return Vec4.temp(this.x, this.w, this.w, this.x);
    }
    set xwwx(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.w = v4fVec.y;
        this.w = v4fVec.z; this.x = v4fVec.w;
    }

    get xwwy(): AIVec4 {
        return Vec4.temp(this.x, this.w, this.w, this.y);
    }
    set xwwy(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.w = v4fVec.y;
        this.w = v4fVec.z; this.y = v4fVec.w;
    }

    get xwwz(): AIVec4 {
        return Vec4.temp(this.x, this.w, this.w, this.z);
    }
    set xwwz(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.w = v4fVec.y;
        this.w = v4fVec.z; this.z = v4fVec.w;
    }

    get xwww(): AIVec4 {
        return Vec4.temp(this.x, this.w, this.w, this.w);
    }
    set xwww(v4fVec: AIVec4) {
        this.x = v4fVec.x; this.w = v4fVec.y;
        this.w = v4fVec.z; this.w = v4fVec.w;
    }

    get yxxx(): AIVec4 {
        return Vec4.temp(this.y, this.x, this.x, this.x);
    }
    set yxxx(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.x = v4fVec.y;
        this.x = v4fVec.z; this.x = v4fVec.w;
    }

    get yxxy(): AIVec4 {
        return Vec4.temp(this.y, this.x, this.x, this.y);
    }
    set yxxy(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.x = v4fVec.y;
        this.x = v4fVec.z; this.y = v4fVec.w;
    }

    get yxxz(): AIVec4 {
        return Vec4.temp(this.y, this.x, this.x, this.z);
    }
    set yxxz(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.x = v4fVec.y;
        this.x = v4fVec.z; this.z = v4fVec.w;
    }

    get yxxw(): AIVec4 {
        return Vec4.temp(this.y, this.x, this.x, this.w);
    }
    set yxxw(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.x = v4fVec.y;
        this.x = v4fVec.z; this.w = v4fVec.w;
    }

    get yxyx(): AIVec4 {
        return Vec4.temp(this.y, this.x, this.y, this.x);
    }
    set yxyx(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.x = v4fVec.y;
        this.y = v4fVec.z; this.x = v4fVec.w;
    }

    get yxyy(): AIVec4 {
        return Vec4.temp(this.y, this.x, this.y, this.y);
    }
    set yxyy(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.x = v4fVec.y;
        this.y = v4fVec.z; this.y = v4fVec.w;
    }

    get yxyz(): AIVec4 {
        return Vec4.temp(this.y, this.x, this.y, this.z);
    }
    set yxyz(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.x = v4fVec.y;
        this.y = v4fVec.z; this.z = v4fVec.w;
    }

    get yxyw(): AIVec4 {
        return Vec4.temp(this.y, this.x, this.y, this.w);
    }
    set yxyw(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.x = v4fVec.y;
        this.y = v4fVec.z; this.w = v4fVec.w;
    }

    get yxzx(): AIVec4 {
        return Vec4.temp(this.y, this.x, this.z, this.x);
    }
    set yxzx(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.x = v4fVec.y;
        this.z = v4fVec.z; this.x = v4fVec.w;
    }

    get yxzy(): AIVec4 {
        return Vec4.temp(this.y, this.x, this.z, this.y);
    }
    set yxzy(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.x = v4fVec.y;
        this.z = v4fVec.z; this.y = v4fVec.w;
    }

    get yxzz(): AIVec4 {
        return Vec4.temp(this.y, this.x, this.z, this.z);
    }
    set yxzz(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.x = v4fVec.y;
        this.z = v4fVec.z; this.z = v4fVec.w;
    }

    get yxzw(): AIVec4 {
        return Vec4.temp(this.y, this.x, this.z, this.w);
    }
    set yxzw(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.x = v4fVec.y;
        this.z = v4fVec.z; this.w = v4fVec.w;
    }

    get yxwx(): AIVec4 {
        return Vec4.temp(this.y, this.x, this.w, this.x);
    }
    set yxwx(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.x = v4fVec.y;
        this.w = v4fVec.z; this.x = v4fVec.w;
    }

    get yxwy(): AIVec4 {
        return Vec4.temp(this.y, this.x, this.w, this.y);
    }
    set yxwy(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.x = v4fVec.y;
        this.w = v4fVec.z; this.y = v4fVec.w;
    }

    get yxwz(): AIVec4 {
        return Vec4.temp(this.y, this.x, this.w, this.z);
    }
    set yxwz(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.x = v4fVec.y;
        this.w = v4fVec.z; this.z = v4fVec.w;
    }

    get yxww(): AIVec4 {
        return Vec4.temp(this.y, this.x, this.w, this.w);
    }
    set yxww(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.x = v4fVec.y;
        this.w = v4fVec.z; this.w = v4fVec.w;
    }

    get yyxx(): AIVec4 {
        return Vec4.temp(this.y, this.y, this.x, this.x);
    }
    set yyxx(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.y = v4fVec.y;
        this.x = v4fVec.z; this.x = v4fVec.w;
    }

    get yyxy(): AIVec4 {
        return Vec4.temp(this.y, this.y, this.x, this.y);
    }
    set yyxy(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.y = v4fVec.y;
        this.x = v4fVec.z; this.y = v4fVec.w;
    }

    get yyxz(): AIVec4 {
        return Vec4.temp(this.y, this.y, this.x, this.z);
    }
    set yyxz(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.y = v4fVec.y;
        this.x = v4fVec.z; this.z = v4fVec.w;
    }

    get yyxw(): AIVec4 {
        return Vec4.temp(this.y, this.y, this.x, this.w);
    }
    set yyxw(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.y = v4fVec.y;
        this.x = v4fVec.z; this.w = v4fVec.w;
    }

    get yyyx(): AIVec4 {
        return Vec4.temp(this.y, this.y, this.y, this.x);
    }
    set yyyx(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.y = v4fVec.y;
        this.y = v4fVec.z; this.x = v4fVec.w;
    }

    get yyyy(): AIVec4 {
        return Vec4.temp(this.y, this.y, this.y, this.y);
    }
    set yyyy(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.y = v4fVec.y;
        this.y = v4fVec.z; this.y = v4fVec.w;
    }

    get yyyz(): AIVec4 {
        return Vec4.temp(this.y, this.y, this.y, this.z);
    }
    set yyyz(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.y = v4fVec.y;
        this.y = v4fVec.z; this.z = v4fVec.w;
    }

    get yyyw(): AIVec4 {
        return Vec4.temp(this.y, this.y, this.y, this.w);
    }
    set yyyw(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.y = v4fVec.y;
        this.y = v4fVec.z; this.w = v4fVec.w;
    }

    get yyzx(): AIVec4 {
        return Vec4.temp(this.y, this.y, this.z, this.x);
    }
    set yyzx(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.y = v4fVec.y;
        this.z = v4fVec.z; this.x = v4fVec.w;
    }

    get yyzy(): AIVec4 {
        return Vec4.temp(this.y, this.y, this.z, this.y);
    }
    set yyzy(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.y = v4fVec.y;
        this.z = v4fVec.z; this.y = v4fVec.w;
    }

    get yyzz(): AIVec4 {
        return Vec4.temp(this.y, this.y, this.z, this.z);
    }
    set yyzz(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.y = v4fVec.y;
        this.z = v4fVec.z; this.z = v4fVec.w;
    }

    get yyzw(): AIVec4 {
        return Vec4.temp(this.y, this.y, this.z, this.w);
    }
    set yyzw(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.y = v4fVec.y;
        this.z = v4fVec.z; this.w = v4fVec.w;
    }

    get yywx(): AIVec4 {
        return Vec4.temp(this.y, this.y, this.w, this.x);
    }
    set yywx(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.y = v4fVec.y;
        this.w = v4fVec.z; this.x = v4fVec.w;
    }

    get yywy(): AIVec4 {
        return Vec4.temp(this.y, this.y, this.w, this.y);
    }
    set yywy(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.y = v4fVec.y;
        this.w = v4fVec.z; this.y = v4fVec.w;
    }

    get yywz(): AIVec4 {
        return Vec4.temp(this.y, this.y, this.w, this.z);
    }
    set yywz(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.y = v4fVec.y;
        this.w = v4fVec.z; this.z = v4fVec.w;
    }

    get yyww(): AIVec4 {
        return Vec4.temp(this.y, this.y, this.w, this.w);
    }
    set yyww(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.y = v4fVec.y;
        this.w = v4fVec.z; this.w = v4fVec.w;
    }

    get yzxx(): AIVec4 {
        return Vec4.temp(this.y, this.z, this.x, this.x);
    }
    set yzxx(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.z = v4fVec.y;
        this.x = v4fVec.z; this.x = v4fVec.w;
    }

    get yzxy(): AIVec4 {
        return Vec4.temp(this.y, this.z, this.x, this.y);
    }
    set yzxy(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.z = v4fVec.y;
        this.x = v4fVec.z; this.y = v4fVec.w;
    }

    get yzxz(): AIVec4 {
        return Vec4.temp(this.y, this.z, this.x, this.z);
    }
    set yzxz(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.z = v4fVec.y;
        this.x = v4fVec.z; this.z = v4fVec.w;
    }

    get yzxw(): AIVec4 {
        return Vec4.temp(this.y, this.z, this.x, this.w);
    }
    set yzxw(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.z = v4fVec.y;
        this.x = v4fVec.z; this.w = v4fVec.w;
    }

    get yzyx(): AIVec4 {
        return Vec4.temp(this.y, this.z, this.y, this.x);
    }
    set yzyx(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.z = v4fVec.y;
        this.y = v4fVec.z; this.x = v4fVec.w;
    }

    get yzyy(): AIVec4 {
        return Vec4.temp(this.y, this.z, this.y, this.y);
    }
    set yzyy(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.z = v4fVec.y;
        this.y = v4fVec.z; this.y = v4fVec.w;
    }

    get yzyz(): AIVec4 {
        return Vec4.temp(this.y, this.z, this.y, this.z);
    }
    set yzyz(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.z = v4fVec.y;
        this.y = v4fVec.z; this.z = v4fVec.w;
    }

    get yzyw(): AIVec4 {
        return Vec4.temp(this.y, this.z, this.y, this.w);
    }
    set yzyw(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.z = v4fVec.y;
        this.y = v4fVec.z; this.w = v4fVec.w;
    }

    get yzzx(): AIVec4 {
        return Vec4.temp(this.y, this.z, this.z, this.x);
    }
    set yzzx(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.z = v4fVec.y;
        this.z = v4fVec.z; this.x = v4fVec.w;
    }

    get yzzy(): AIVec4 {
        return Vec4.temp(this.y, this.z, this.z, this.y);
    }
    set yzzy(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.z = v4fVec.y;
        this.z = v4fVec.z; this.y = v4fVec.w;
    }

    get yzzz(): AIVec4 {
        return Vec4.temp(this.y, this.z, this.z, this.z);
    }
    set yzzz(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.z = v4fVec.y;
        this.z = v4fVec.z; this.z = v4fVec.w;
    }

    get yzzw(): AIVec4 {
        return Vec4.temp(this.y, this.z, this.z, this.w);
    }
    set yzzw(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.z = v4fVec.y;
        this.z = v4fVec.z; this.w = v4fVec.w;
    }

    get yzwx(): AIVec4 {
        return Vec4.temp(this.y, this.z, this.w, this.x);
    }
    set yzwx(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.z = v4fVec.y;
        this.w = v4fVec.z; this.x = v4fVec.w;
    }

    get yzwy(): AIVec4 {
        return Vec4.temp(this.y, this.z, this.w, this.y);
    }
    set yzwy(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.z = v4fVec.y;
        this.w = v4fVec.z; this.y = v4fVec.w;
    }

    get yzwz(): AIVec4 {
        return Vec4.temp(this.y, this.z, this.w, this.z);
    }
    set yzwz(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.z = v4fVec.y;
        this.w = v4fVec.z; this.z = v4fVec.w;
    }

    get yzww(): AIVec4 {
        return Vec4.temp(this.y, this.z, this.w, this.w);
    }
    set yzww(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.z = v4fVec.y;
        this.w = v4fVec.z; this.w = v4fVec.w;
    }

    get ywxx(): AIVec4 {
        return Vec4.temp(this.y, this.w, this.x, this.x);
    }
    set ywxx(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.w = v4fVec.y;
        this.x = v4fVec.z; this.x = v4fVec.w;
    }

    get ywxy(): AIVec4 {
        return Vec4.temp(this.y, this.w, this.x, this.y);
    }
    set ywxy(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.w = v4fVec.y;
        this.x = v4fVec.z; this.y = v4fVec.w;
    }

    get ywxz(): AIVec4 {
        return Vec4.temp(this.y, this.w, this.x, this.z);
    }
    set ywxz(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.w = v4fVec.y;
        this.x = v4fVec.z; this.z = v4fVec.w;
    }

    get ywxw(): AIVec4 {
        return Vec4.temp(this.y, this.w, this.x, this.w);
    }
    set ywxw(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.w = v4fVec.y;
        this.x = v4fVec.z; this.w = v4fVec.w;
    }

    get ywyx(): AIVec4 {
        return Vec4.temp(this.y, this.w, this.y, this.x);
    }
    set ywyx(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.w = v4fVec.y;
        this.y = v4fVec.z; this.x = v4fVec.w;
    }

    get ywyy(): AIVec4 {
        return Vec4.temp(this.y, this.w, this.y, this.y);
    }
    set ywyy(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.w = v4fVec.y;
        this.y = v4fVec.z; this.y = v4fVec.w;
    }

    get ywyz(): AIVec4 {
        return Vec4.temp(this.y, this.w, this.y, this.z);
    }
    set ywyz(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.w = v4fVec.y;
        this.y = v4fVec.z; this.z = v4fVec.w;
    }

    get ywyw(): AIVec4 {
        return Vec4.temp(this.y, this.w, this.y, this.w);
    }
    set ywyw(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.w = v4fVec.y;
        this.y = v4fVec.z; this.w = v4fVec.w;
    }

    get ywzx(): AIVec4 {
        return Vec4.temp(this.y, this.w, this.z, this.x);
    }
    set ywzx(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.w = v4fVec.y;
        this.z = v4fVec.z; this.x = v4fVec.w;
    }

    get ywzy(): AIVec4 {
        return Vec4.temp(this.y, this.w, this.z, this.y);
    }
    set ywzy(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.w = v4fVec.y;
        this.z = v4fVec.z; this.y = v4fVec.w;
    }

    get ywzz(): AIVec4 {
        return Vec4.temp(this.y, this.w, this.z, this.z);
    }
    set ywzz(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.w = v4fVec.y;
        this.z = v4fVec.z; this.z = v4fVec.w;
    }

    get ywzw(): AIVec4 {
        return Vec4.temp(this.y, this.w, this.z, this.w);
    }
    set ywzw(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.w = v4fVec.y;
        this.z = v4fVec.z; this.w = v4fVec.w;
    }

    get ywwx(): AIVec4 {
        return Vec4.temp(this.y, this.w, this.w, this.x);
    }
    set ywwx(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.w = v4fVec.y;
        this.w = v4fVec.z; this.x = v4fVec.w;
    }

    get ywwy(): AIVec4 {
        return Vec4.temp(this.y, this.w, this.w, this.y);
    }
    set ywwy(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.w = v4fVec.y;
        this.w = v4fVec.z; this.y = v4fVec.w;
    }

    get ywwz(): AIVec4 {
        return Vec4.temp(this.y, this.w, this.w, this.z);
    }
    set ywwz(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.w = v4fVec.y;
        this.w = v4fVec.z; this.z = v4fVec.w;
    }

    get ywww(): AIVec4 {
        return Vec4.temp(this.y, this.w, this.w, this.w);
    }
    set ywww(v4fVec: AIVec4) {
        this.y = v4fVec.x; this.w = v4fVec.y;
        this.w = v4fVec.z; this.w = v4fVec.w;
    }

    get zxxx(): AIVec4 {
        return Vec4.temp(this.z, this.x, this.x, this.x);
    }
    set zxxx(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.x = v4fVec.y;
        this.x = v4fVec.z; this.x = v4fVec.w;
    }

    get zxxy(): AIVec4 {
        return Vec4.temp(this.z, this.x, this.x, this.y);
    }
    set zxxy(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.x = v4fVec.y;
        this.x = v4fVec.z; this.y = v4fVec.w;
    }

    get zxxz(): AIVec4 {
        return Vec4.temp(this.z, this.x, this.x, this.z);
    }
    set zxxz(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.x = v4fVec.y;
        this.x = v4fVec.z; this.z = v4fVec.w;
    }

    get zxxw(): AIVec4 {
        return Vec4.temp(this.z, this.x, this.x, this.w);
    }
    set zxxw(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.x = v4fVec.y;
        this.x = v4fVec.z; this.w = v4fVec.w;
    }

    get zxyx(): AIVec4 {
        return Vec4.temp(this.z, this.x, this.y, this.x);
    }
    set zxyx(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.x = v4fVec.y;
        this.y = v4fVec.z; this.x = v4fVec.w;
    }

    get zxyy(): AIVec4 {
        return Vec4.temp(this.z, this.x, this.y, this.y);
    }
    set zxyy(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.x = v4fVec.y;
        this.y = v4fVec.z; this.y = v4fVec.w;
    }

    get zxyz(): AIVec4 {
        return Vec4.temp(this.z, this.x, this.y, this.z);
    }
    set zxyz(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.x = v4fVec.y;
        this.y = v4fVec.z; this.z = v4fVec.w;
    }

    get zxyw(): AIVec4 {
        return Vec4.temp(this.z, this.x, this.y, this.w);
    }
    set zxyw(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.x = v4fVec.y;
        this.y = v4fVec.z; this.w = v4fVec.w;
    }

    get zxzx(): AIVec4 {
        return Vec4.temp(this.z, this.x, this.z, this.x);
    }
    set zxzx(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.x = v4fVec.y;
        this.z = v4fVec.z; this.x = v4fVec.w;
    }

    get zxzy(): AIVec4 {
        return Vec4.temp(this.z, this.x, this.z, this.y);
    }
    set zxzy(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.x = v4fVec.y;
        this.z = v4fVec.z; this.y = v4fVec.w;
    }

    get zxzz(): AIVec4 {
        return Vec4.temp(this.z, this.x, this.z, this.z);
    }
    set zxzz(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.x = v4fVec.y;
        this.z = v4fVec.z; this.z = v4fVec.w;
    }

    get zxzw(): AIVec4 {
        return Vec4.temp(this.z, this.x, this.z, this.w);
    }
    set zxzw(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.x = v4fVec.y;
        this.z = v4fVec.z; this.w = v4fVec.w;
    }

    get zxwx(): AIVec4 {
        return Vec4.temp(this.z, this.x, this.w, this.x);
    }
    set zxwx(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.x = v4fVec.y;
        this.w = v4fVec.z; this.x = v4fVec.w;
    }

    get zxwy(): AIVec4 {
        return Vec4.temp(this.z, this.x, this.w, this.y);
    }
    set zxwy(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.x = v4fVec.y;
        this.w = v4fVec.z; this.y = v4fVec.w;
    }

    get zxwz(): AIVec4 {
        return Vec4.temp(this.z, this.x, this.w, this.z);
    }
    set zxwz(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.x = v4fVec.y;
        this.w = v4fVec.z; this.z = v4fVec.w;
    }

    get zxww(): AIVec4 {
        return Vec4.temp(this.z, this.x, this.w, this.w);
    }
    set zxww(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.x = v4fVec.y;
        this.w = v4fVec.z; this.w = v4fVec.w;
    }

    get zyxx(): AIVec4 {
        return Vec4.temp(this.z, this.y, this.x, this.x);
    }
    set zyxx(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.y = v4fVec.y;
        this.x = v4fVec.z; this.x = v4fVec.w;
    }

    get zyxy(): AIVec4 {
        return Vec4.temp(this.z, this.y, this.x, this.y);
    }
    set zyxy(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.y = v4fVec.y;
        this.x = v4fVec.z; this.y = v4fVec.w;
    }

    get zyxz(): AIVec4 {
        return Vec4.temp(this.z, this.y, this.x, this.z);
    }
    set zyxz(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.y = v4fVec.y;
        this.x = v4fVec.z; this.z = v4fVec.w;
    }

    get zyxw(): AIVec4 {
        return Vec4.temp(this.z, this.y, this.x, this.w);
    }
    set zyxw(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.y = v4fVec.y;
        this.x = v4fVec.z; this.w = v4fVec.w;
    }

    get zyyx(): AIVec4 {
        return Vec4.temp(this.z, this.y, this.y, this.x);
    }
    set zyyx(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.y = v4fVec.y;
        this.y = v4fVec.z; this.x = v4fVec.w;
    }

    get zyyy(): AIVec4 {
        return Vec4.temp(this.z, this.y, this.y, this.y);
    }
    set zyyy(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.y = v4fVec.y;
        this.y = v4fVec.z; this.y = v4fVec.w;
    }

    get zyyz(): AIVec4 {
        return Vec4.temp(this.z, this.y, this.y, this.z);
    }
    set zyyz(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.y = v4fVec.y;
        this.y = v4fVec.z; this.z = v4fVec.w;
    }

    get zyyw(): AIVec4 {
        return Vec4.temp(this.z, this.y, this.y, this.w);
    }
    set zyyw(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.y = v4fVec.y;
        this.y = v4fVec.z; this.w = v4fVec.w;
    }

    get zyzx(): AIVec4 {
        return Vec4.temp(this.z, this.y, this.z, this.x);
    }
    set zyzx(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.y = v4fVec.y;
        this.z = v4fVec.z; this.x = v4fVec.w;
    }

    get zyzy(): AIVec4 {
        return Vec4.temp(this.z, this.y, this.z, this.y);
    }
    set zyzy(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.y = v4fVec.y;
        this.z = v4fVec.z; this.y = v4fVec.w;
    }

    get zyzz(): AIVec4 {
        return Vec4.temp(this.z, this.y, this.z, this.z);
    }
    set zyzz(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.y = v4fVec.y;
        this.z = v4fVec.z; this.z = v4fVec.w;
    }

    get zyzw(): AIVec4 {
        return Vec4.temp(this.z, this.y, this.z, this.w);
    }
    set zyzw(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.y = v4fVec.y;
        this.z = v4fVec.z; this.w = v4fVec.w;
    }

    get zywx(): AIVec4 {
        return Vec4.temp(this.z, this.y, this.w, this.x);
    }
    set zywx(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.y = v4fVec.y;
        this.w = v4fVec.z; this.x = v4fVec.w;
    }

    get zywy(): AIVec4 {
        return Vec4.temp(this.z, this.y, this.w, this.y);
    }
    set zywy(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.y = v4fVec.y;
        this.w = v4fVec.z; this.y = v4fVec.w;
    }

    get zywz(): AIVec4 {
        return Vec4.temp(this.z, this.y, this.w, this.z);
    }
    set zywz(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.y = v4fVec.y;
        this.w = v4fVec.z; this.z = v4fVec.w;
    }

    get zyww(): AIVec4 {
        return Vec4.temp(this.z, this.y, this.w, this.w);
    }
    set zyww(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.y = v4fVec.y;
        this.w = v4fVec.z; this.w = v4fVec.w;
    }

    get zzxx(): AIVec4 {
        return Vec4.temp(this.z, this.z, this.x, this.x);
    }
    set zzxx(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.z = v4fVec.y;
        this.x = v4fVec.z; this.x = v4fVec.w;
    }

    get zzxy(): AIVec4 {
        return Vec4.temp(this.z, this.z, this.x, this.y);
    }
    set zzxy(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.z = v4fVec.y;
        this.x = v4fVec.z; this.y = v4fVec.w;
    }

    get zzxz(): AIVec4 {
        return Vec4.temp(this.z, this.z, this.x, this.z);
    }
    set zzxz(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.z = v4fVec.y;
        this.x = v4fVec.z; this.z = v4fVec.w;
    }

    get zzxw(): AIVec4 {
        return Vec4.temp(this.z, this.z, this.x, this.w);
    }
    set zzxw(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.z = v4fVec.y;
        this.x = v4fVec.z; this.w = v4fVec.w;
    }

    get zzyx(): AIVec4 {
        return Vec4.temp(this.z, this.z, this.y, this.x);
    }
    set zzyx(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.z = v4fVec.y;
        this.y = v4fVec.z; this.x = v4fVec.w;
    }

    get zzyy(): AIVec4 {
        return Vec4.temp(this.z, this.z, this.y, this.y);
    }
    set zzyy(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.z = v4fVec.y;
        this.y = v4fVec.z; this.y = v4fVec.w;
    }

    get zzyz(): AIVec4 {
        return Vec4.temp(this.z, this.z, this.y, this.z);
    }
    set zzyz(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.z = v4fVec.y;
        this.y = v4fVec.z; this.z = v4fVec.w;
    }

    get zzyw(): AIVec4 {
        return Vec4.temp(this.z, this.z, this.y, this.w);
    }
    set zzyw(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.z = v4fVec.y;
        this.y = v4fVec.z; this.w = v4fVec.w;
    }

    get zzzx(): AIVec4 {
        return Vec4.temp(this.z, this.z, this.z, this.x);
    }
    set zzzx(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.z = v4fVec.y;
        this.z = v4fVec.z; this.x = v4fVec.w;
    }

    get zzzy(): AIVec4 {
        return Vec4.temp(this.z, this.z, this.z, this.y);
    }
    set zzzy(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.z = v4fVec.y;
        this.z = v4fVec.z; this.y = v4fVec.w;
    }

    get zzzz(): AIVec4 {
        return Vec4.temp(this.z, this.z, this.z, this.z);
    }
    set zzzz(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.z = v4fVec.y;
        this.z = v4fVec.z; this.z = v4fVec.w;
    }

    get zzzw(): AIVec4 {
        return Vec4.temp(this.z, this.z, this.z, this.w);
    }
    set zzzw(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.z = v4fVec.y;
        this.z = v4fVec.z; this.w = v4fVec.w;
    }

    get zzwx(): AIVec4 {
        return Vec4.temp(this.z, this.z, this.w, this.x);
    }
    set zzwx(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.z = v4fVec.y;
        this.w = v4fVec.z; this.x = v4fVec.w;
    }

    get zzwy(): AIVec4 {
        return Vec4.temp(this.z, this.z, this.w, this.y);
    }
    set zzwy(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.z = v4fVec.y;
        this.w = v4fVec.z; this.y = v4fVec.w;
    }

    get zzwz(): AIVec4 {
        return Vec4.temp(this.z, this.z, this.w, this.z);
    }
    set zzwz(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.z = v4fVec.y;
        this.w = v4fVec.z; this.z = v4fVec.w;
    }

    get zzww(): AIVec4 {
        return Vec4.temp(this.z, this.z, this.w, this.w);
    }
    set zzww(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.z = v4fVec.y;
        this.w = v4fVec.z; this.w = v4fVec.w;
    }

    get zwxx(): AIVec4 {
        return Vec4.temp(this.z, this.w, this.x, this.x);
    }
    set zwxx(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.w = v4fVec.y;
        this.x = v4fVec.z; this.x = v4fVec.w;
    }

    get zwxy(): AIVec4 {
        return Vec4.temp(this.z, this.w, this.x, this.y);
    }
    set zwxy(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.w = v4fVec.y;
        this.x = v4fVec.z; this.y = v4fVec.w;
    }

    get zwxz(): AIVec4 {
        return Vec4.temp(this.z, this.w, this.x, this.z);
    }
    set zwxz(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.w = v4fVec.y;
        this.x = v4fVec.z; this.z = v4fVec.w;
    }

    get zwxw(): AIVec4 {
        return Vec4.temp(this.z, this.w, this.x, this.w);
    }
    set zwxw(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.w = v4fVec.y;
        this.x = v4fVec.z; this.w = v4fVec.w;
    }

    get zwyx(): AIVec4 {
        return Vec4.temp(this.z, this.w, this.y, this.x);
    }
    set zwyx(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.w = v4fVec.y;
        this.y = v4fVec.z; this.x = v4fVec.w;
    }

    get zwyy(): AIVec4 {
        return Vec4.temp(this.z, this.w, this.y, this.y);
    }
    set zwyy(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.w = v4fVec.y;
        this.y = v4fVec.z; this.y = v4fVec.w;
    }

    get zwyz(): AIVec4 {
        return Vec4.temp(this.z, this.w, this.y, this.z);
    }
    set zwyz(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.w = v4fVec.y;
        this.y = v4fVec.z; this.z = v4fVec.w;
    }

    get zwyw(): AIVec4 {
        return Vec4.temp(this.z, this.w, this.y, this.w);
    }
    set zwyw(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.w = v4fVec.y;
        this.y = v4fVec.z; this.w = v4fVec.w;
    }

    get zwzx(): AIVec4 {
        return Vec4.temp(this.z, this.w, this.z, this.x);
    }
    set zwzx(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.w = v4fVec.y;
        this.z = v4fVec.z; this.x = v4fVec.w;
    }

    get zwzy(): AIVec4 {
        return Vec4.temp(this.z, this.w, this.z, this.y);
    }
    set zwzy(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.w = v4fVec.y;
        this.z = v4fVec.z; this.y = v4fVec.w;
    }

    get zwzz(): AIVec4 {
        return Vec4.temp(this.z, this.w, this.z, this.z);
    }
    set zwzz(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.w = v4fVec.y;
        this.z = v4fVec.z; this.z = v4fVec.w;
    }

    get zwzw(): AIVec4 {
        return Vec4.temp(this.z, this.w, this.z, this.w);
    }
    set zwzw(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.w = v4fVec.y;
        this.z = v4fVec.z; this.w = v4fVec.w;
    }

    get zwwx(): AIVec4 {
        return Vec4.temp(this.z, this.w, this.w, this.x);
    }
    set zwwx(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.w = v4fVec.y;
        this.w = v4fVec.z; this.x = v4fVec.w;
    }

    get zwwy(): AIVec4 {
        return Vec4.temp(this.z, this.w, this.w, this.y);
    }
    set zwwy(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.w = v4fVec.y;
        this.w = v4fVec.z; this.y = v4fVec.w;
    }

    get zwwz(): AIVec4 {
        return Vec4.temp(this.z, this.w, this.w, this.z);
    }
    set zwwz(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.w = v4fVec.y;
        this.w = v4fVec.z; this.z = v4fVec.w;
    }

    get zwww(): AIVec4 {
        return Vec4.temp(this.z, this.w, this.w, this.w);
    }
    set zwww(v4fVec: AIVec4) {
        this.z = v4fVec.x; this.w = v4fVec.y;
        this.w = v4fVec.z; this.w = v4fVec.w;
    }

    get wxxx(): AIVec4 {
        return Vec4.temp(this.w, this.x, this.x, this.x);
    }
    set wxxx(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.x = v4fVec.y;
        this.x = v4fVec.z; this.x = v4fVec.w;
    }

    get wxxy(): AIVec4 {
        return Vec4.temp(this.w, this.x, this.x, this.y);
    }
    set wxxy(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.x = v4fVec.y;
        this.x = v4fVec.z; this.y = v4fVec.w;
    }

    get wxxz(): AIVec4 {
        return Vec4.temp(this.w, this.x, this.x, this.z);
    }
    set wxxz(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.x = v4fVec.y;
        this.x = v4fVec.z; this.z = v4fVec.w;
    }

    get wxxw(): AIVec4 {
        return Vec4.temp(this.w, this.x, this.x, this.w);
    }
    set wxxw(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.x = v4fVec.y;
        this.x = v4fVec.z; this.w = v4fVec.w;
    }

    get wxyx(): AIVec4 {
        return Vec4.temp(this.w, this.x, this.y, this.x);
    }
    set wxyx(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.x = v4fVec.y;
        this.y = v4fVec.z; this.x = v4fVec.w;
    }

    get wxyy(): AIVec4 {
        return Vec4.temp(this.w, this.x, this.y, this.y);
    }
    set wxyy(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.x = v4fVec.y;
        this.y = v4fVec.z; this.y = v4fVec.w;
    }

    get wxyz(): AIVec4 {
        return Vec4.temp(this.w, this.x, this.y, this.z);
    }
    set wxyz(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.x = v4fVec.y;
        this.y = v4fVec.z; this.z = v4fVec.w;
    }

    get wxyw(): AIVec4 {
        return Vec4.temp(this.w, this.x, this.y, this.w);
    }
    set wxyw(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.x = v4fVec.y;
        this.y = v4fVec.z; this.w = v4fVec.w;
    }

    get wxzx(): AIVec4 {
        return Vec4.temp(this.w, this.x, this.z, this.x);
    }
    set wxzx(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.x = v4fVec.y;
        this.z = v4fVec.z; this.x = v4fVec.w;
    }

    get wxzy(): AIVec4 {
        return Vec4.temp(this.w, this.x, this.z, this.y);
    }
    set wxzy(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.x = v4fVec.y;
        this.z = v4fVec.z; this.y = v4fVec.w;
    }

    get wxzz(): AIVec4 {
        return Vec4.temp(this.w, this.x, this.z, this.z);
    }
    set wxzz(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.x = v4fVec.y;
        this.z = v4fVec.z; this.z = v4fVec.w;
    }

    get wxzw(): AIVec4 {
        return Vec4.temp(this.w, this.x, this.z, this.w);
    }
    set wxzw(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.x = v4fVec.y;
        this.z = v4fVec.z; this.w = v4fVec.w;
    }

    get wxwx(): AIVec4 {
        return Vec4.temp(this.w, this.x, this.w, this.x);
    }
    set wxwx(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.x = v4fVec.y;
        this.w = v4fVec.z; this.x = v4fVec.w;
    }

    get wxwy(): AIVec4 {
        return Vec4.temp(this.w, this.x, this.w, this.y);
    }
    set wxwy(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.x = v4fVec.y;
        this.w = v4fVec.z; this.y = v4fVec.w;
    }

    get wxwz(): AIVec4 {
        return Vec4.temp(this.w, this.x, this.w, this.z);
    }
    set wxwz(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.x = v4fVec.y;
        this.w = v4fVec.z; this.z = v4fVec.w;
    }

    get wxww(): AIVec4 {
        return Vec4.temp(this.w, this.x, this.w, this.w);
    }
    set wxww(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.x = v4fVec.y;
        this.w = v4fVec.z; this.w = v4fVec.w;
    }

    get wyxx(): AIVec4 {
        return Vec4.temp(this.w, this.y, this.x, this.x);
    }
    set wyxx(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.y = v4fVec.y;
        this.x = v4fVec.z; this.x = v4fVec.w;
    }

    get wyxy(): AIVec4 {
        return Vec4.temp(this.w, this.y, this.x, this.y);
    }
    set wyxy(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.y = v4fVec.y;
        this.x = v4fVec.z; this.y = v4fVec.w;
    }

    get wyxz(): AIVec4 {
        return Vec4.temp(this.w, this.y, this.x, this.z);
    }
    set wyxz(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.y = v4fVec.y;
        this.x = v4fVec.z; this.z = v4fVec.w;
    }

    get wyxw(): AIVec4 {
        return Vec4.temp(this.w, this.y, this.x, this.w);
    }
    set wyxw(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.y = v4fVec.y;
        this.x = v4fVec.z; this.w = v4fVec.w;
    }

    get wyyx(): AIVec4 {
        return Vec4.temp(this.w, this.y, this.y, this.x);
    }
    set wyyx(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.y = v4fVec.y;
        this.y = v4fVec.z; this.x = v4fVec.w;
    }

    get wyyy(): AIVec4 {
        return Vec4.temp(this.w, this.y, this.y, this.y);
    }
    set wyyy(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.y = v4fVec.y;
        this.y = v4fVec.z; this.y = v4fVec.w;
    }

    get wyyz(): AIVec4 {
        return Vec4.temp(this.w, this.y, this.y, this.z);
    }
    set wyyz(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.y = v4fVec.y;
        this.y = v4fVec.z; this.z = v4fVec.w;
    }

    get wyyw(): AIVec4 {
        return Vec4.temp(this.w, this.y, this.y, this.w);
    }
    set wyyw(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.y = v4fVec.y;
        this.y = v4fVec.z; this.w = v4fVec.w;
    }

    get wyzx(): AIVec4 {
        return Vec4.temp(this.w, this.y, this.z, this.x);
    }
    set wyzx(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.y = v4fVec.y;
        this.z = v4fVec.z; this.x = v4fVec.w;
    }

    get wyzy(): AIVec4 {
        return Vec4.temp(this.w, this.y, this.z, this.y);
    }
    set wyzy(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.y = v4fVec.y;
        this.z = v4fVec.z; this.y = v4fVec.w;
    }

    get wyzz(): AIVec4 {
        return Vec4.temp(this.w, this.y, this.z, this.z);
    }
    set wyzz(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.y = v4fVec.y;
        this.z = v4fVec.z; this.z = v4fVec.w;
    }

    get wyzw(): AIVec4 {
        return Vec4.temp(this.w, this.y, this.z, this.w);
    }
    set wyzw(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.y = v4fVec.y;
        this.z = v4fVec.z; this.w = v4fVec.w;
    }

    get wywx(): AIVec4 {
        return Vec4.temp(this.w, this.y, this.w, this.x);
    }
    set wywx(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.y = v4fVec.y;
        this.w = v4fVec.z; this.x = v4fVec.w;
    }

    get wywy(): AIVec4 {
        return Vec4.temp(this.w, this.y, this.w, this.y);
    }
    set wywy(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.y = v4fVec.y;
        this.w = v4fVec.z; this.y = v4fVec.w;
    }

    get wywz(): AIVec4 {
        return Vec4.temp(this.w, this.y, this.w, this.z);
    }
    set wywz(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.y = v4fVec.y;
        this.w = v4fVec.z; this.z = v4fVec.w;
    }

    get wyww(): AIVec4 {
        return Vec4.temp(this.w, this.y, this.w, this.w);
    }
    set wyww(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.y = v4fVec.y;
        this.w = v4fVec.z; this.w = v4fVec.w;
    }

    get wzxx(): AIVec4 {
        return Vec4.temp(this.w, this.z, this.x, this.x);
    }
    set wzxx(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.z = v4fVec.y;
        this.x = v4fVec.z; this.x = v4fVec.w;
    }

    get wzxy(): AIVec4 {
        return Vec4.temp(this.w, this.z, this.x, this.y);
    }
    set wzxy(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.z = v4fVec.y;
        this.x = v4fVec.z; this.y = v4fVec.w;
    }

    get wzxz(): AIVec4 {
        return Vec4.temp(this.w, this.z, this.x, this.z);
    }
    set wzxz(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.z = v4fVec.y;
        this.x = v4fVec.z; this.z = v4fVec.w;
    }

    get wzxw(): AIVec4 {
        return Vec4.temp(this.w, this.z, this.x, this.w);
    }
    set wzxw(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.z = v4fVec.y;
        this.x = v4fVec.z; this.w = v4fVec.w;
    }

    get wzyx(): AIVec4 {
        return Vec4.temp(this.w, this.z, this.y, this.x);
    }
    set wzyx(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.z = v4fVec.y;
        this.y = v4fVec.z; this.x = v4fVec.w;
    }

    get wzyy(): AIVec4 {
        return Vec4.temp(this.w, this.z, this.y, this.y);
    }
    set wzyy(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.z = v4fVec.y;
        this.y = v4fVec.z; this.y = v4fVec.w;
    }

    get wzyz(): AIVec4 {
        return Vec4.temp(this.w, this.z, this.y, this.z);
    }
    set wzyz(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.z = v4fVec.y;
        this.y = v4fVec.z; this.z = v4fVec.w;
    }

    get wzyw(): AIVec4 {
        return Vec4.temp(this.w, this.z, this.y, this.w);
    }
    set wzyw(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.z = v4fVec.y;
        this.y = v4fVec.z; this.w = v4fVec.w;
    }

    get wzzx(): AIVec4 {
        return Vec4.temp(this.w, this.z, this.z, this.x);
    }
    set wzzx(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.z = v4fVec.y;
        this.z = v4fVec.z; this.x = v4fVec.w;
    }

    get wzzy(): AIVec4 {
        return Vec4.temp(this.w, this.z, this.z, this.y);
    }
    set wzzy(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.z = v4fVec.y;
        this.z = v4fVec.z; this.y = v4fVec.w;
    }

    get wzzz(): AIVec4 {
        return Vec4.temp(this.w, this.z, this.z, this.z);
    }
    set wzzz(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.z = v4fVec.y;
        this.z = v4fVec.z; this.z = v4fVec.w;
    }

    get wzzw(): AIVec4 {
        return Vec4.temp(this.w, this.z, this.z, this.w);
    }
    set wzzw(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.z = v4fVec.y;
        this.z = v4fVec.z; this.w = v4fVec.w;
    }

    get wzwx(): AIVec4 {
        return Vec4.temp(this.w, this.z, this.w, this.x);
    }
    set wzwx(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.z = v4fVec.y;
        this.w = v4fVec.z; this.x = v4fVec.w;
    }

    get wzwy(): AIVec4 {
        return Vec4.temp(this.w, this.z, this.w, this.y);
    }
    set wzwy(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.z = v4fVec.y;
        this.w = v4fVec.z; this.y = v4fVec.w;
    }

    get wzwz(): AIVec4 {
        return Vec4.temp(this.w, this.z, this.w, this.z);
    }
    set wzwz(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.z = v4fVec.y;
        this.w = v4fVec.z; this.z = v4fVec.w;
    }

    get wzww(): AIVec4 {
        return Vec4.temp(this.w, this.z, this.w, this.w);
    }
    set wzww(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.z = v4fVec.y;
        this.w = v4fVec.z; this.w = v4fVec.w;
    }

    get wwxx(): AIVec4 {
        return Vec4.temp(this.w, this.w, this.x, this.x);
    }
    set wwxx(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.w = v4fVec.y;
        this.x = v4fVec.z; this.x = v4fVec.w;
    }

    get wwxy(): AIVec4 {
        return Vec4.temp(this.w, this.w, this.x, this.y);
    }
    set wwxy(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.w = v4fVec.y;
        this.x = v4fVec.z; this.y = v4fVec.w;
    }

    get wwxz(): AIVec4 {
        return Vec4.temp(this.w, this.w, this.x, this.z);
    }
    set wwxz(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.w = v4fVec.y;
        this.x = v4fVec.z; this.z = v4fVec.w;
    }

    get wwxw(): AIVec4 {
        return Vec4.temp(this.w, this.w, this.x, this.w);
    }
    set wwxw(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.w = v4fVec.y;
        this.x = v4fVec.z; this.w = v4fVec.w;
    }

    get wwyx(): AIVec4 {
        return Vec4.temp(this.w, this.w, this.y, this.x);
    }
    set wwyx(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.w = v4fVec.y;
        this.y = v4fVec.z; this.x = v4fVec.w;
    }

    get wwyy(): AIVec4 {
        return Vec4.temp(this.w, this.w, this.y, this.y);
    }
    set wwyy(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.w = v4fVec.y;
        this.y = v4fVec.z; this.y = v4fVec.w;
    }

    get wwyz(): AIVec4 {
        return Vec4.temp(this.w, this.w, this.y, this.z);
    }
    set wwyz(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.w = v4fVec.y;
        this.y = v4fVec.z; this.z = v4fVec.w;
    }

    get wwyw(): AIVec4 {
        return Vec4.temp(this.w, this.w, this.y, this.w);
    }
    set wwyw(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.w = v4fVec.y;
        this.y = v4fVec.z; this.w = v4fVec.w;
    }

    get wwzx(): AIVec4 {
        return Vec4.temp(this.w, this.w, this.z, this.x);
    }
    set wwzx(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.w = v4fVec.y;
        this.z = v4fVec.z; this.x = v4fVec.w;
    }

    get wwzy(): AIVec4 {
        return Vec4.temp(this.w, this.w, this.z, this.y);
    }
    set wwzy(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.w = v4fVec.y;
        this.z = v4fVec.z; this.y = v4fVec.w;
    }

    get wwzz(): AIVec4 {
        return Vec4.temp(this.w, this.w, this.z, this.z);
    }
    set wwzz(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.w = v4fVec.y;
        this.z = v4fVec.z; this.z = v4fVec.w;
    }

    get wwzw(): AIVec4 {
        return Vec4.temp(this.w, this.w, this.z, this.w);
    }
    set wwzw(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.w = v4fVec.y;
        this.z = v4fVec.z; this.w = v4fVec.w;
    }

    get wwwx(): AIVec4 {
        return Vec4.temp(this.w, this.w, this.w, this.x);
    }
    set wwwx(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.w = v4fVec.y;
        this.w = v4fVec.z; this.x = v4fVec.w;
    }

    get wwwy(): AIVec4 {
        return Vec4.temp(this.w, this.w, this.w, this.y);
    }
    set wwwy(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.w = v4fVec.y;
        this.w = v4fVec.z; this.y = v4fVec.w;
    }

    get wwwz(): AIVec4 {
        return Vec4.temp(this.w, this.w, this.w, this.z);
    }
    set wwwz(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.w = v4fVec.y;
        this.w = v4fVec.z; this.z = v4fVec.w;
    }

    get wwww(): AIVec4 {
        return Vec4.temp(this.w, this.w, this.w, this.w);
    }
    set wwww(v4fVec: AIVec4) {
        this.w = v4fVec.x; this.w = v4fVec.y;
        this.w = v4fVec.z; this.w = v4fVec.w;
    }

    constructor();
    constructor(xyzw: float);
    constructor(xyzw: AIVec4);
    constructor(xyzw: float[]);
    constructor(rgba: AIColorValue);
    constructor(x: float, yzw: AIVec3);
    constructor(xy: AIVec2, zw: AIVec2);
    constructor(xyz: AIVec3, w: float);
    constructor(x: float, y: float, zw: AIVec2);
    constructor(x: float, yz: AIVec2, w: float);
    constructor(xy: AIVec2, z: float, w: float);
    constructor(x: float, y: float, z: float, w: float);
    constructor(x?, y?, z?, w?) {
        var n: uint = arguments.length;
        var v: AIVec4 = this;

        switch (n) {
            case 1:
                v.set(arguments[0]);
                break;
            case 2:
                v.set(arguments[0], arguments[1]);
                break;
            case 3:
                v.set(arguments[0], arguments[1], arguments[2]);
                break;
            case 4:
                v.set(arguments[0], arguments[1], arguments[2], arguments[3]);
                break;
            default:
                v.x = v.y = v.z = v.w = 0.;
                break;
        }
    }

    set(): AIVec4;
    set(xyzw: float): AIVec4;
    set(xyzw: AIVec4): AIVec4;
    set(xyzw: float[]): AIVec4;
    set(rgba: AIColorValue): AIVec4;
    set(x: float, yzw: AIVec3): AIVec4;
    set(xy: AIVec2, zw: AIVec2): AIVec4;
    set(xyz: AIVec3, w: float): AIVec4;
    set(x: float, y: float, zw: AIVec2): AIVec4;
    set(x: float, yz: AIVec2, w: float): AIVec4;
    set(xy: AIVec2, z: float, w: float): AIVec4;
    set(x: float, y: float, z: float, w: float): AIVec4;
    set(): AIVec4 {
        var nArgumentsLength: uint = arguments.length;

        switch (nArgumentsLength) {
            case 0:
                this.x = this.y = this.z = this.w = 0.;
                break;
            case 1:
                if (isFloat(arguments[0])) {
                    this.x = this.y = this.z = this.w = arguments[0];
                }
                else if (arguments[0] instanceof Vec4) {
                    var v4fVec: AIVec4 = arguments[0];

                    this.x = v4fVec.x;
                    this.y = v4fVec.y;
                    this.z = v4fVec.z;
                    this.w = v4fVec.w;
                }
                //color
                else if (isDef(arguments[0].r)) {
                    this.x = arguments[0].r;
                    this.y = arguments[0].g;
                    this.z = arguments[0].b;
                    this.w = arguments[0].a;
                }
                else {
                    //array
                    var pArray: float[] = arguments[0];

                    this.x = pArray[0];
                    this.y = pArray[1];
                    this.z = pArray[2];
                    this.w = pArray[3];
                }
                break;
            case 2:
                if (isFloat(arguments[0])) {
                    var fValue: float = arguments[0];
                    var v3fVec: AIVec3 = arguments[1];

                    this.x = fValue;
                    this.y = v3fVec.x;
                    this.z = v3fVec.y;
                    this.w = v3fVec.z;
                }
                else if (arguments[0] instanceof Vec2) {
                    var v2fVec1: AIVec2 = arguments[0];
                    var v2fVec2: AIVec2 = arguments[1];

                    this.x = v2fVec1.x;
                    this.y = v2fVec1.y;
                    this.z = v2fVec2.x;
                    this.w = v2fVec2.y;
                }
                else {
                    var v3fVec: AIVec3 = arguments[0];
                    var fValue: float = arguments[1];

                    this.x = v3fVec.x;
                    this.y = v3fVec.y;
                    this.z = v3fVec.z;
                    this.w = fValue;
                }
                break;
            case 3:
                if (isFloat(arguments[0])) {
                    var fValue1: float = arguments[0];

                    if (isFloat(arguments[1])) {
                        var fValue2: float = arguments[1];
                        var v2fVec: AIVec2 = arguments[2];

                        this.x = fValue1;
                        this.y = fValue2;
                        this.z = v2fVec.x;
                        this.w = v2fVec.y;
                    }
                    else {
                        var v2fVec: AIVec2 = arguments[1];
                        var fValue2: float = arguments[2];

                        this.x = fValue1;
                        this.y = v2fVec.x;
                        this.z = v2fVec.y;
                        this.w = fValue2;
                    }
                }
                else {
                    var v2fVec: AIVec2 = arguments[0];
                    var fValue1: float = arguments[1];
                    var fValue2: float = arguments[2];

                    this.x = v2fVec.x;
                    this.y = v2fVec.y;
                    this.z = fValue1;
                    this.w = fValue2;
                }
                break;
            case 4:
                this.x = arguments[0];
                this.y = arguments[1];
                this.z = arguments[2];
                this.w = arguments[3];
                break;
        }

        return this;
    }

    /** inline */ clear(): AIVec4 {
        this.x = this.y = this.z = this.w = 0.;
        return this;
    }

    add(v4fVec: AIVec4, v4fDestination?: AIVec4): AIVec4 {
        if (!isDef(v4fDestination)) {
            v4fDestination = this;
        }

        v4fDestination.x = this.x + v4fVec.x;
        v4fDestination.y = this.y + v4fVec.y;
        v4fDestination.z = this.z + v4fVec.z;
        v4fDestination.w = this.w + v4fVec.w;

        return v4fDestination;
    }

    subtract(v4fVec: AIVec4, v4fDestination?: AIVec4): AIVec4 {
        if (!isDef(v4fDestination)) {
            v4fDestination = this;
        }

        v4fDestination.x = this.x - v4fVec.x;
        v4fDestination.y = this.y - v4fVec.y;
        v4fDestination.z = this.z - v4fVec.z;
        v4fDestination.w = this.w - v4fVec.w;

        return v4fDestination;
    }

    /** inline */ dot(v4fVec: AIVec4): float {
        return this.x * v4fVec.x + this.y * v4fVec.y + this.z * v4fVec.z + this.w * v4fVec.w;
    }

    isEqual(v4fVec: AIVec4, fEps: float = 0.): boolean {
        if (fEps === 0.) {
            if (this.x != v4fVec.x
                || this.y != v4fVec.y
                || this.z != v4fVec.z
                || this.w != v4fVec.w) {

                return false;
            }
        }
        else {
            if (abs(this.x - v4fVec.x) > fEps
                || abs(this.y - v4fVec.y) > fEps
                || abs(this.z - v4fVec.z) > fEps
                || abs(this.w - v4fVec.w) > fEps) {

                return false;
            }
        }
        return true;
    }

    isClear(fEps: float = 0.): boolean {

        if (fEps === 0.) {
            if (this.x != 0.
                || this.y != 0.
                || this.z != 0.
                || this.w != 0.) {

                return false;
            }
        }
        else {
            if (abs(this.x) > fEps
                || abs(this.y) > fEps
                || abs(this.z) > fEps
                || abs(this.w) > fEps) {

                return false;
            }
        }
        return true;
    }

    negate(v4fDestination?: AIVec4): AIVec4 {
        if (!isDef(v4fDestination)) {
            v4fDestination = this;
        }

        v4fDestination.x = -this.x;
        v4fDestination.y = -this.y;
        v4fDestination.z = -this.z;
        v4fDestination.w = -this.w;

        return v4fDestination;
    }

    scale(fScale: float, v4fDestination?: AIVec4): AIVec4 {
        if (!isDef(v4fDestination)) {
            v4fDestination = this;
        }

        v4fDestination.x = this.x * fScale;
        v4fDestination.y = this.y * fScale;
        v4fDestination.z = this.z * fScale;
        v4fDestination.w = this.w * fScale;

        return v4fDestination;
    }

    normalize(v4fDestination?: AIVec4): AIVec4 {
        if (!isDef(v4fDestination)) {
            v4fDestination = this;
        }

        var x: float = this.x, y: float = this.y, z: float = this.z, w: float = this.w;
        var fLength: float = sqrt(x * x + y * y + z * z + w * w);

        if (fLength !== 0.) {
            var fInvLength: float = 1. / fLength;

            x *= fInvLength;
            y *= fInvLength;
            z *= fInvLength;
            w *= fInvLength;
        }

        v4fDestination.x = x;
        v4fDestination.y = y;
        v4fDestination.z = z;
        v4fDestination.w = w;

        return v4fDestination;
    }

    /** inline */ length(): float {
        var x: float = this.x, y: float = this.y, z: float = this.z, w: float = this.w;
        return sqrt(x * x + y * y + z * z + w * w);
    }

    /** inline */ lengthSquare(): float {
        var x: float = this.x, y: float = this.y, z: float = this.z, w: float = this.w;
        return x * x + y * y + z * z + w * w;
    }

    direction(v4fVec: AIVec4, v4fDestination?: AIVec4): AIVec4 {
        if (!isDef(v4fDestination)) {
            v4fDestination = this;
        }

        var x: float = v4fVec.x - this.x;
        var y: float = v4fVec.y - this.y;
        var z: float = v4fVec.z - this.z;
        var w: float = v4fVec.w - this.w;

        var fLength: float = sqrt(x * x + y * y + z * z + w * w);

        if (fLength !== 0.) {
            var fInvLength = 1. / fLength;

            x *= fInvLength;
            y *= fInvLength;
            z *= fInvLength;
            w *= fInvLength;
        }

        v4fDestination.x = x;
        v4fDestination.y = y;
        v4fDestination.z = z;
        v4fDestination.w = w;

        return v4fDestination;
    }

    mix(v4fVec: AIVec4, fA: float, v4fDestination?: AIVec4): AIVec4 {
        if (!isDef(v4fDestination)) {
            v4fDestination = this;
        }

        fA = clamp(fA, 0., 1.);

        var fA1: float = 1. - fA;
        var fA2: float = fA;

        v4fDestination.x = fA1 * this.x + fA2 * v4fVec.x;
        v4fDestination.y = fA1 * this.y + fA2 * v4fVec.y;
        v4fDestination.z = fA1 * this.z + fA2 * v4fVec.z;
        v4fDestination.w = fA1 * this.w + fA2 * v4fVec.w;

        return v4fDestination;
    }

    /** inline */ toString(): string {
        return "[x: " + this.x + ", y: " + this.y
            + ", z: " + this.z + ", w: " + this.w + "]";
    }

    static temp(): AIVec4;
    static temp(xyzw: float): AIVec4;
    static temp(xyzw: AIVec4): AIVec4;
    static temp(xyzw: float[]): AIVec4;
    static temp(rgba: AIColorValue): AIVec4;
    static temp(x: float, yzw: AIVec3): AIVec4;
    static temp(xy: AIVec2, zw: AIVec2): AIVec4;
    static temp(xyz: AIVec3, w: float): AIVec4;
    static temp(x: float, y: float, zw: AIVec2): AIVec4;
    static temp(x: float, yz: AIVec2, w: float): AIVec4;
    static temp(xy: AIVec2, z: float, w: float): AIVec4;
    static temp(x: float, y: float, z: float, w: float): AIVec4;
    static temp(x?, y?, z?, w?): AIVec4 {
        iElement = (iElement === pBuffer.length - 1 ? 0 : pBuffer.length);
        var p = pBuffer[iElement++];
        return p.set.apply(p, arguments);
    }

}


pBuffer = gen.array<AIVec4>(256, Vec4);
iElement = 0;

export = Vec4;
