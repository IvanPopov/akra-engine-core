/// <reference path="../common.ts" />
/// <reference path="../logger.ts" />
/// <reference path="../idl/IVec4.ts" />
/// <reference path="math.ts" />
/// <reference path="../gen/generate.ts" />

module akra.math {

    var pBuffer: IVec4[];
    var iElement: uint;

    export class Vec4 implements IVec4 {
        x: float;
        y: float;
        z: float;
        w: float;

        get xx(): IVec2 {
            return Vec2.temp(this.x, this.x);
        }
        set xx(v2fVec: IVec2) {
            this.x = v2fVec.x; this.x = v2fVec.y;
        }

        get xy(): IVec2 {
            return Vec2.temp(this.x, this.y);
        }
        set xy(v2fVec: IVec2) {
            this.x = v2fVec.x; this.y = v2fVec.y;
        }

        get xz(): IVec2 {
            return Vec2.temp(this.x, this.z);
        }
        set xz(v2fVec: IVec2) {
            this.x = v2fVec.x; this.z = v2fVec.y;
        }

        get xw(): IVec2 {
            return Vec2.temp(this.x, this.w);
        }
        set xw(v2fVec: IVec2) {
            this.x = v2fVec.x; this.w = v2fVec.y;
        }

        get yx(): IVec2 {
            return Vec2.temp(this.y, this.x);
        }
        set yx(v2fVec: IVec2) {
            this.y = v2fVec.x; this.x = v2fVec.y;
        }

        get yy(): IVec2 {
            return Vec2.temp(this.y, this.y);
        }
        set yy(v2fVec: IVec2) {
            this.y = v2fVec.x; this.y = v2fVec.y;
        }

        get yz(): IVec2 {
            return Vec2.temp(this.y, this.z);
        }
        set yz(v2fVec: IVec2) {
            this.y = v2fVec.x; this.z = v2fVec.y;
        }

        get yw(): IVec2 {
            return Vec2.temp(this.y, this.w);
        }
        set yw(v2fVec: IVec2) {
            this.y = v2fVec.x; this.w = v2fVec.y;
        }

        get zx(): IVec2 {
            return Vec2.temp(this.z, this.x);
        }
        set zx(v2fVec: IVec2) {
            this.z = v2fVec.x; this.x = v2fVec.y;
        }

        get zy(): IVec2 {
            return Vec2.temp(this.z, this.y);
        }
        set zy(v2fVec: IVec2) {
            this.z = v2fVec.x; this.y = v2fVec.y;
        }

        get zz(): IVec2 {
            return Vec2.temp(this.z, this.z);
        }
        set zz(v2fVec: IVec2) {
            this.z = v2fVec.x; this.z = v2fVec.y;
        }

        get zw(): IVec2 {
            return Vec2.temp(this.z, this.w);
        }
        set zw(v2fVec: IVec2) {
            this.z = v2fVec.x; this.w = v2fVec.y;
        }

        get wx(): IVec2 {
            return Vec2.temp(this.w, this.x);
        }
        set wx(v2fVec: IVec2) {
            this.w = v2fVec.x; this.x = v2fVec.y;
        }

        get wy(): IVec2 {
            return Vec2.temp(this.w, this.y);
        }
        set wy(v2fVec: IVec2) {
            this.w = v2fVec.x; this.y = v2fVec.y;
        }

        get wz(): IVec2 {
            return Vec2.temp(this.w, this.z);
        }
        set wz(v2fVec: IVec2) {
            this.w = v2fVec.x; this.z = v2fVec.y;
        }

        get ww(): IVec2 {
            return Vec2.temp(this.w, this.w);
        }
        set ww(v2fVec: IVec2) {
            this.w = v2fVec.x; this.w = v2fVec.y;
        }


        get xxx(): IVec3 {
            return Vec3.temp(this.x, this.x, this.x);
        }
        set xxx(v3fVec: IVec3) {
            this.x = v3fVec.x; this.x = v3fVec.y; this.x = v3fVec.z;
        }

        get xxy(): IVec3 {
            return Vec3.temp(this.x, this.x, this.y);
        }
        set xxy(v3fVec: IVec3) {
            this.x = v3fVec.x; this.x = v3fVec.y; this.y = v3fVec.z;
        }

        get xxz(): IVec3 {
            return Vec3.temp(this.x, this.x, this.z);
        }
        set xxz(v3fVec: IVec3) {
            this.x = v3fVec.x; this.x = v3fVec.y; this.z = v3fVec.z;
        }

        get xxw(): IVec3 {
            return Vec3.temp(this.x, this.x, this.w);
        }
        set xxw(v3fVec: IVec3) {
            this.x = v3fVec.x; this.x = v3fVec.y; this.w = v3fVec.z;
        }

        get xyx(): IVec3 {
            return Vec3.temp(this.x, this.y, this.x);
        }
        set xyx(v3fVec: IVec3) {
            this.x = v3fVec.x; this.y = v3fVec.y; this.x = v3fVec.z;
        }

        get xyy(): IVec3 {
            return Vec3.temp(this.x, this.y, this.y);
        }
        set xyy(v3fVec: IVec3) {
            this.x = v3fVec.x; this.y = v3fVec.y; this.y = v3fVec.z;
        }

        get xyz(): IVec3 {
            return Vec3.temp(this.x, this.y, this.z);
        }
        set xyz(v3fVec: IVec3) {
            this.x = v3fVec.x; this.y = v3fVec.y; this.z = v3fVec.z;
        }

        get xyw(): IVec3 {
            return Vec3.temp(this.x, this.y, this.w);
        }
        set xyw(v3fVec: IVec3) {
            this.x = v3fVec.x; this.y = v3fVec.y; this.w = v3fVec.z;
        }

        get xzx(): IVec3 {
            return Vec3.temp(this.x, this.z, this.x);
        }
        set xzx(v3fVec: IVec3) {
            this.x = v3fVec.x; this.z = v3fVec.y; this.x = v3fVec.z;
        }

        get xzy(): IVec3 {
            return Vec3.temp(this.x, this.z, this.y);
        }
        set xzy(v3fVec: IVec3) {
            this.x = v3fVec.x; this.z = v3fVec.y; this.y = v3fVec.z;
        }

        get xzz(): IVec3 {
            return Vec3.temp(this.x, this.z, this.z);
        }
        set xzz(v3fVec: IVec3) {
            this.x = v3fVec.x; this.z = v3fVec.y; this.z = v3fVec.z;
        }

        get xzw(): IVec3 {
            return Vec3.temp(this.x, this.z, this.w);
        }
        set xzw(v3fVec: IVec3) {
            this.x = v3fVec.x; this.z = v3fVec.y; this.w = v3fVec.z;
        }

        get xwx(): IVec3 {
            return Vec3.temp(this.x, this.w, this.x);
        }
        set xwx(v3fVec: IVec3) {
            this.x = v3fVec.x; this.w = v3fVec.y; this.x = v3fVec.z;
        }

        get xwy(): IVec3 {
            return Vec3.temp(this.x, this.w, this.y);
        }
        set xwy(v3fVec: IVec3) {
            this.x = v3fVec.x; this.w = v3fVec.y; this.y = v3fVec.z;
        }

        get xwz(): IVec3 {
            return Vec3.temp(this.x, this.w, this.z);
        }
        set xwz(v3fVec: IVec3) {
            this.x = v3fVec.x; this.w = v3fVec.y; this.z = v3fVec.z;
        }

        get xww(): IVec3 {
            return Vec3.temp(this.x, this.w, this.w);
        }
        set xww(v3fVec: IVec3) {
            this.x = v3fVec.x; this.w = v3fVec.y; this.w = v3fVec.z;
        }

        get yxx(): IVec3 {
            return Vec3.temp(this.y, this.x, this.x);
        }
        set yxx(v3fVec: IVec3) {
            this.y = v3fVec.x; this.x = v3fVec.y; this.x = v3fVec.z;
        }

        get yxy(): IVec3 {
            return Vec3.temp(this.y, this.x, this.y);
        }
        set yxy(v3fVec: IVec3) {
            this.y = v3fVec.x; this.x = v3fVec.y; this.y = v3fVec.z;
        }

        get yxz(): IVec3 {
            return Vec3.temp(this.y, this.x, this.z);
        }
        set yxz(v3fVec: IVec3) {
            this.y = v3fVec.x; this.x = v3fVec.y; this.z = v3fVec.z;
        }

        get yxw(): IVec3 {
            return Vec3.temp(this.y, this.x, this.w);
        }
        set yxw(v3fVec: IVec3) {
            this.y = v3fVec.x; this.x = v3fVec.y; this.w = v3fVec.z;
        }

        get yyx(): IVec3 {
            return Vec3.temp(this.y, this.y, this.x);
        }
        set yyx(v3fVec: IVec3) {
            this.y = v3fVec.x; this.y = v3fVec.y; this.x = v3fVec.z;
        }

        get yyy(): IVec3 {
            return Vec3.temp(this.y, this.y, this.y);
        }
        set yyy(v3fVec: IVec3) {
            this.y = v3fVec.x; this.y = v3fVec.y; this.y = v3fVec.z;
        }

        get yyz(): IVec3 {
            return Vec3.temp(this.y, this.y, this.z);
        }
        set yyz(v3fVec: IVec3) {
            this.y = v3fVec.x; this.y = v3fVec.y; this.z = v3fVec.z;
        }

        get yyw(): IVec3 {
            return Vec3.temp(this.y, this.y, this.w);
        }
        set yyw(v3fVec: IVec3) {
            this.y = v3fVec.x; this.y = v3fVec.y; this.w = v3fVec.z;
        }

        get yzx(): IVec3 {
            return Vec3.temp(this.y, this.z, this.x);
        }
        set yzx(v3fVec: IVec3) {
            this.y = v3fVec.x; this.z = v3fVec.y; this.x = v3fVec.z;
        }

        get yzy(): IVec3 {
            return Vec3.temp(this.y, this.z, this.y);
        }
        set yzy(v3fVec: IVec3) {
            this.y = v3fVec.x; this.z = v3fVec.y; this.y = v3fVec.z;
        }

        get yzz(): IVec3 {
            return Vec3.temp(this.y, this.z, this.z);
        }
        set yzz(v3fVec: IVec3) {
            this.y = v3fVec.x; this.z = v3fVec.y; this.z = v3fVec.z;
        }

        get yzw(): IVec3 {
            return Vec3.temp(this.y, this.z, this.w);
        }
        set yzw(v3fVec: IVec3) {
            this.y = v3fVec.x; this.z = v3fVec.y; this.w = v3fVec.z;
        }

        get ywx(): IVec3 {
            return Vec3.temp(this.y, this.w, this.x);
        }
        set ywx(v3fVec: IVec3) {
            this.y = v3fVec.x; this.w = v3fVec.y; this.x = v3fVec.z;
        }

        get ywy(): IVec3 {
            return Vec3.temp(this.y, this.w, this.y);
        }
        set ywy(v3fVec: IVec3) {
            this.y = v3fVec.x; this.w = v3fVec.y; this.y = v3fVec.z;
        }

        get ywz(): IVec3 {
            return Vec3.temp(this.y, this.w, this.z);
        }
        set ywz(v3fVec: IVec3) {
            this.y = v3fVec.x; this.w = v3fVec.y; this.z = v3fVec.z;
        }

        get yww(): IVec3 {
            return Vec3.temp(this.y, this.w, this.w);
        }
        set yww(v3fVec: IVec3) {
            this.y = v3fVec.x; this.w = v3fVec.y; this.w = v3fVec.z;
        }

        get zxx(): IVec3 {
            return Vec3.temp(this.z, this.x, this.x);
        }
        set zxx(v3fVec: IVec3) {
            this.z = v3fVec.x; this.x = v3fVec.y; this.x = v3fVec.z;
        }

        get zxy(): IVec3 {
            return Vec3.temp(this.z, this.x, this.y);
        }
        set zxy(v3fVec: IVec3) {
            this.z = v3fVec.x; this.x = v3fVec.y; this.y = v3fVec.z;
        }

        get zxz(): IVec3 {
            return Vec3.temp(this.z, this.x, this.z);
        }
        set zxz(v3fVec: IVec3) {
            this.z = v3fVec.x; this.x = v3fVec.y; this.z = v3fVec.z;
        }

        get zxw(): IVec3 {
            return Vec3.temp(this.z, this.x, this.w);
        }
        set zxw(v3fVec: IVec3) {
            this.z = v3fVec.x; this.x = v3fVec.y; this.w = v3fVec.z;
        }

        get zyx(): IVec3 {
            return Vec3.temp(this.z, this.y, this.x);
        }
        set zyx(v3fVec: IVec3) {
            this.z = v3fVec.x; this.y = v3fVec.y; this.x = v3fVec.z;
        }

        get zyy(): IVec3 {
            return Vec3.temp(this.z, this.y, this.y);
        }
        set zyy(v3fVec: IVec3) {
            this.z = v3fVec.x; this.y = v3fVec.y; this.y = v3fVec.z;
        }

        get zyz(): IVec3 {
            return Vec3.temp(this.z, this.y, this.z);
        }
        set zyz(v3fVec: IVec3) {
            this.z = v3fVec.x; this.y = v3fVec.y; this.z = v3fVec.z;
        }

        get zyw(): IVec3 {
            return Vec3.temp(this.z, this.y, this.w);
        }
        set zyw(v3fVec: IVec3) {
            this.z = v3fVec.x; this.y = v3fVec.y; this.w = v3fVec.z;
        }

        get zzx(): IVec3 {
            return Vec3.temp(this.z, this.z, this.x);
        }
        set zzx(v3fVec: IVec3) {
            this.z = v3fVec.x; this.z = v3fVec.y; this.x = v3fVec.z;
        }

        get zzy(): IVec3 {
            return Vec3.temp(this.z, this.z, this.y);
        }
        set zzy(v3fVec: IVec3) {
            this.z = v3fVec.x; this.z = v3fVec.y; this.y = v3fVec.z;
        }

        get zzz(): IVec3 {
            return Vec3.temp(this.z, this.z, this.z);
        }
        set zzz(v3fVec: IVec3) {
            this.z = v3fVec.x; this.z = v3fVec.y; this.z = v3fVec.z;
        }

        get zzw(): IVec3 {
            return Vec3.temp(this.z, this.z, this.w);
        }
        set zzw(v3fVec: IVec3) {
            this.z = v3fVec.x; this.z = v3fVec.y; this.w = v3fVec.z;
        }

        get zwx(): IVec3 {
            return Vec3.temp(this.z, this.w, this.x);
        }
        set zwx(v3fVec: IVec3) {
            this.z = v3fVec.x; this.w = v3fVec.y; this.x = v3fVec.z;
        }

        get zwy(): IVec3 {
            return Vec3.temp(this.z, this.w, this.y);
        }
        set zwy(v3fVec: IVec3) {
            this.z = v3fVec.x; this.w = v3fVec.y; this.y = v3fVec.z;
        }

        get zwz(): IVec3 {
            return Vec3.temp(this.z, this.w, this.z);
        }
        set zwz(v3fVec: IVec3) {
            this.z = v3fVec.x; this.w = v3fVec.y; this.z = v3fVec.z;
        }

        get zww(): IVec3 {
            return Vec3.temp(this.z, this.w, this.w);
        }
        set zww(v3fVec: IVec3) {
            this.z = v3fVec.x; this.w = v3fVec.y; this.w = v3fVec.z;
        }

        get wxx(): IVec3 {
            return Vec3.temp(this.w, this.x, this.x);
        }
        set wxx(v3fVec: IVec3) {
            this.w = v3fVec.x; this.x = v3fVec.y; this.x = v3fVec.z;
        }

        get wxy(): IVec3 {
            return Vec3.temp(this.w, this.x, this.y);
        }
        set wxy(v3fVec: IVec3) {
            this.w = v3fVec.x; this.x = v3fVec.y; this.y = v3fVec.z;
        }

        get wxz(): IVec3 {
            return Vec3.temp(this.w, this.x, this.z);
        }
        set wxz(v3fVec: IVec3) {
            this.w = v3fVec.x; this.x = v3fVec.y; this.z = v3fVec.z;
        }

        get wxw(): IVec3 {
            return Vec3.temp(this.w, this.x, this.w);
        }
        set wxw(v3fVec: IVec3) {
            this.w = v3fVec.x; this.x = v3fVec.y; this.w = v3fVec.z;
        }

        get wyx(): IVec3 {
            return Vec3.temp(this.w, this.y, this.x);
        }
        set wyx(v3fVec: IVec3) {
            this.w = v3fVec.x; this.y = v3fVec.y; this.x = v3fVec.z;
        }

        get wyy(): IVec3 {
            return Vec3.temp(this.w, this.y, this.y);
        }
        set wyy(v3fVec: IVec3) {
            this.w = v3fVec.x; this.y = v3fVec.y; this.y = v3fVec.z;
        }

        get wyz(): IVec3 {
            return Vec3.temp(this.w, this.y, this.z);
        }
        set wyz(v3fVec: IVec3) {
            this.w = v3fVec.x; this.y = v3fVec.y; this.z = v3fVec.z;
        }

        get wyw(): IVec3 {
            return Vec3.temp(this.w, this.y, this.w);
        }
        set wyw(v3fVec: IVec3) {
            this.w = v3fVec.x; this.y = v3fVec.y; this.w = v3fVec.z;
        }

        get wzx(): IVec3 {
            return Vec3.temp(this.w, this.z, this.x);
        }
        set wzx(v3fVec: IVec3) {
            this.w = v3fVec.x; this.z = v3fVec.y; this.x = v3fVec.z;
        }

        get wzy(): IVec3 {
            return Vec3.temp(this.w, this.z, this.y);
        }
        set wzy(v3fVec: IVec3) {
            this.w = v3fVec.x; this.z = v3fVec.y; this.y = v3fVec.z;
        }

        get wzz(): IVec3 {
            return Vec3.temp(this.w, this.z, this.z);
        }
        set wzz(v3fVec: IVec3) {
            this.w = v3fVec.x; this.z = v3fVec.y; this.z = v3fVec.z;
        }

        get wzw(): IVec3 {
            return Vec3.temp(this.w, this.z, this.w);
        }
        set wzw(v3fVec: IVec3) {
            this.w = v3fVec.x; this.z = v3fVec.y; this.w = v3fVec.z;
        }

        get wwx(): IVec3 {
            return Vec3.temp(this.w, this.w, this.x);
        }
        set wwx(v3fVec: IVec3) {
            this.w = v3fVec.x; this.w = v3fVec.y; this.x = v3fVec.z;
        }

        get wwy(): IVec3 {
            return Vec3.temp(this.w, this.w, this.y);
        }
        set wwy(v3fVec: IVec3) {
            this.w = v3fVec.x; this.w = v3fVec.y; this.y = v3fVec.z;
        }

        get wwz(): IVec3 {
            return Vec3.temp(this.w, this.w, this.z);
        }
        set wwz(v3fVec: IVec3) {
            this.w = v3fVec.x; this.w = v3fVec.y; this.z = v3fVec.z;
        }

        get www(): IVec3 {
            return Vec3.temp(this.w, this.w, this.w);
        }
        set www(v3fVec: IVec3) {
            this.w = v3fVec.x; this.w = v3fVec.y; this.w = v3fVec.z;
        }


        get xxxx(): IVec4 {
            return Vec4.temp(this.x, this.x, this.x, this.x);
        }
        set xxxx(v4fVec: IVec4) {
            this.x = v4fVec.x; this.x = v4fVec.y;
            this.x = v4fVec.z; this.x = v4fVec.w;
        }

        get xxxy(): IVec4 {
            return Vec4.temp(this.x, this.x, this.x, this.y);
        }
        set xxxy(v4fVec: IVec4) {
            this.x = v4fVec.x; this.x = v4fVec.y;
            this.x = v4fVec.z; this.y = v4fVec.w;
        }

        get xxxz(): IVec4 {
            return Vec4.temp(this.x, this.x, this.x, this.z);
        }
        set xxxz(v4fVec: IVec4) {
            this.x = v4fVec.x; this.x = v4fVec.y;
            this.x = v4fVec.z; this.z = v4fVec.w;
        }

        get xxxw(): IVec4 {
            return Vec4.temp(this.x, this.x, this.x, this.w);
        }
        set xxxw(v4fVec: IVec4) {
            this.x = v4fVec.x; this.x = v4fVec.y;
            this.x = v4fVec.z; this.w = v4fVec.w;
        }

        get xxyx(): IVec4 {
            return Vec4.temp(this.x, this.x, this.y, this.x);
        }
        set xxyx(v4fVec: IVec4) {
            this.x = v4fVec.x; this.x = v4fVec.y;
            this.y = v4fVec.z; this.x = v4fVec.w;
        }

        get xxyy(): IVec4 {
            return Vec4.temp(this.x, this.x, this.y, this.y);
        }
        set xxyy(v4fVec: IVec4) {
            this.x = v4fVec.x; this.x = v4fVec.y;
            this.y = v4fVec.z; this.y = v4fVec.w;
        }

        get xxyz(): IVec4 {
            return Vec4.temp(this.x, this.x, this.y, this.z);
        }
        set xxyz(v4fVec: IVec4) {
            this.x = v4fVec.x; this.x = v4fVec.y;
            this.y = v4fVec.z; this.z = v4fVec.w;
        }

        get xxyw(): IVec4 {
            return Vec4.temp(this.x, this.x, this.y, this.w);
        }
        set xxyw(v4fVec: IVec4) {
            this.x = v4fVec.x; this.x = v4fVec.y;
            this.y = v4fVec.z; this.w = v4fVec.w;
        }

        get xxzx(): IVec4 {
            return Vec4.temp(this.x, this.x, this.z, this.x);
        }
        set xxzx(v4fVec: IVec4) {
            this.x = v4fVec.x; this.x = v4fVec.y;
            this.z = v4fVec.z; this.x = v4fVec.w;
        }

        get xxzy(): IVec4 {
            return Vec4.temp(this.x, this.x, this.z, this.y);
        }
        set xxzy(v4fVec: IVec4) {
            this.x = v4fVec.x; this.x = v4fVec.y;
            this.z = v4fVec.z; this.y = v4fVec.w;
        }

        get xxzz(): IVec4 {
            return Vec4.temp(this.x, this.x, this.z, this.z);
        }
        set xxzz(v4fVec: IVec4) {
            this.x = v4fVec.x; this.x = v4fVec.y;
            this.z = v4fVec.z; this.z = v4fVec.w;
        }

        get xxzw(): IVec4 {
            return Vec4.temp(this.x, this.x, this.z, this.w);
        }
        set xxzw(v4fVec: IVec4) {
            this.x = v4fVec.x; this.x = v4fVec.y;
            this.z = v4fVec.z; this.w = v4fVec.w;
        }

        get xxwx(): IVec4 {
            return Vec4.temp(this.x, this.x, this.w, this.x);
        }
        set xxwx(v4fVec: IVec4) {
            this.x = v4fVec.x; this.x = v4fVec.y;
            this.w = v4fVec.z; this.x = v4fVec.w;
        }

        get xxwy(): IVec4 {
            return Vec4.temp(this.x, this.x, this.w, this.y);
        }
        set xxwy(v4fVec: IVec4) {
            this.x = v4fVec.x; this.x = v4fVec.y;
            this.w = v4fVec.z; this.y = v4fVec.w;
        }

        get xxwz(): IVec4 {
            return Vec4.temp(this.x, this.x, this.w, this.z);
        }
        set xxwz(v4fVec: IVec4) {
            this.x = v4fVec.x; this.x = v4fVec.y;
            this.w = v4fVec.z; this.z = v4fVec.w;
        }

        get xxww(): IVec4 {
            return Vec4.temp(this.x, this.x, this.w, this.w);
        }
        set xxww(v4fVec: IVec4) {
            this.x = v4fVec.x; this.x = v4fVec.y;
            this.w = v4fVec.z; this.w = v4fVec.w;
        }

        get xyxx(): IVec4 {
            return Vec4.temp(this.x, this.y, this.x, this.x);
        }
        set xyxx(v4fVec: IVec4) {
            this.x = v4fVec.x; this.y = v4fVec.y;
            this.x = v4fVec.z; this.x = v4fVec.w;
        }

        get xyxy(): IVec4 {
            return Vec4.temp(this.x, this.y, this.x, this.y);
        }
        set xyxy(v4fVec: IVec4) {
            this.x = v4fVec.x; this.y = v4fVec.y;
            this.x = v4fVec.z; this.y = v4fVec.w;
        }

        get xyxz(): IVec4 {
            return Vec4.temp(this.x, this.y, this.x, this.z);
        }
        set xyxz(v4fVec: IVec4) {
            this.x = v4fVec.x; this.y = v4fVec.y;
            this.x = v4fVec.z; this.z = v4fVec.w;
        }

        get xyxw(): IVec4 {
            return Vec4.temp(this.x, this.y, this.x, this.w);
        }
        set xyxw(v4fVec: IVec4) {
            this.x = v4fVec.x; this.y = v4fVec.y;
            this.x = v4fVec.z; this.w = v4fVec.w;
        }

        get xyyx(): IVec4 {
            return Vec4.temp(this.x, this.y, this.y, this.x);
        }
        set xyyx(v4fVec: IVec4) {
            this.x = v4fVec.x; this.y = v4fVec.y;
            this.y = v4fVec.z; this.x = v4fVec.w;
        }

        get xyyy(): IVec4 {
            return Vec4.temp(this.x, this.y, this.y, this.y);
        }
        set xyyy(v4fVec: IVec4) {
            this.x = v4fVec.x; this.y = v4fVec.y;
            this.y = v4fVec.z; this.y = v4fVec.w;
        }

        get xyyz(): IVec4 {
            return Vec4.temp(this.x, this.y, this.y, this.z);
        }
        set xyyz(v4fVec: IVec4) {
            this.x = v4fVec.x; this.y = v4fVec.y;
            this.y = v4fVec.z; this.z = v4fVec.w;
        }

        get xyyw(): IVec4 {
            return Vec4.temp(this.x, this.y, this.y, this.w);
        }
        set xyyw(v4fVec: IVec4) {
            this.x = v4fVec.x; this.y = v4fVec.y;
            this.y = v4fVec.z; this.w = v4fVec.w;
        }

        get xyzx(): IVec4 {
            return Vec4.temp(this.x, this.y, this.z, this.x);
        }
        set xyzx(v4fVec: IVec4) {
            this.x = v4fVec.x; this.y = v4fVec.y;
            this.z = v4fVec.z; this.x = v4fVec.w;
        }

        get xyzy(): IVec4 {
            return Vec4.temp(this.x, this.y, this.z, this.y);
        }
        set xyzy(v4fVec: IVec4) {
            this.x = v4fVec.x; this.y = v4fVec.y;
            this.z = v4fVec.z; this.y = v4fVec.w;
        }

        get xyzz(): IVec4 {
            return Vec4.temp(this.x, this.y, this.z, this.z);
        }
        set xyzz(v4fVec: IVec4) {
            this.x = v4fVec.x; this.y = v4fVec.y;
            this.z = v4fVec.z; this.z = v4fVec.w;
        }

        get xyzw(): IVec4 {
            return Vec4.temp(this.x, this.y, this.z, this.w);
        }
        set xyzw(v4fVec: IVec4) {
            this.x = v4fVec.x; this.y = v4fVec.y;
            this.z = v4fVec.z; this.w = v4fVec.w;
        }

        get xywx(): IVec4 {
            return Vec4.temp(this.x, this.y, this.w, this.x);
        }
        set xywx(v4fVec: IVec4) {
            this.x = v4fVec.x; this.y = v4fVec.y;
            this.w = v4fVec.z; this.x = v4fVec.w;
        }

        get xywy(): IVec4 {
            return Vec4.temp(this.x, this.y, this.w, this.y);
        }
        set xywy(v4fVec: IVec4) {
            this.x = v4fVec.x; this.y = v4fVec.y;
            this.w = v4fVec.z; this.y = v4fVec.w;
        }

        get xywz(): IVec4 {
            return Vec4.temp(this.x, this.y, this.w, this.z);
        }
        set xywz(v4fVec: IVec4) {
            this.x = v4fVec.x; this.y = v4fVec.y;
            this.w = v4fVec.z; this.z = v4fVec.w;
        }

        get xyww(): IVec4 {
            return Vec4.temp(this.x, this.y, this.w, this.w);
        }
        set xyww(v4fVec: IVec4) {
            this.x = v4fVec.x; this.y = v4fVec.y;
            this.w = v4fVec.z; this.w = v4fVec.w;
        }

        get xzxx(): IVec4 {
            return Vec4.temp(this.x, this.z, this.x, this.x);
        }
        set xzxx(v4fVec: IVec4) {
            this.x = v4fVec.x; this.z = v4fVec.y;
            this.x = v4fVec.z; this.x = v4fVec.w;
        }

        get xzxy(): IVec4 {
            return Vec4.temp(this.x, this.z, this.x, this.y);
        }
        set xzxy(v4fVec: IVec4) {
            this.x = v4fVec.x; this.z = v4fVec.y;
            this.x = v4fVec.z; this.y = v4fVec.w;
        }

        get xzxz(): IVec4 {
            return Vec4.temp(this.x, this.z, this.x, this.z);
        }
        set xzxz(v4fVec: IVec4) {
            this.x = v4fVec.x; this.z = v4fVec.y;
            this.x = v4fVec.z; this.z = v4fVec.w;
        }

        get xzxw(): IVec4 {
            return Vec4.temp(this.x, this.z, this.x, this.w);
        }
        set xzxw(v4fVec: IVec4) {
            this.x = v4fVec.x; this.z = v4fVec.y;
            this.x = v4fVec.z; this.w = v4fVec.w;
        }

        get xzyx(): IVec4 {
            return Vec4.temp(this.x, this.z, this.y, this.x);
        }
        set xzyx(v4fVec: IVec4) {
            this.x = v4fVec.x; this.z = v4fVec.y;
            this.y = v4fVec.z; this.x = v4fVec.w;
        }

        get xzyy(): IVec4 {
            return Vec4.temp(this.x, this.z, this.y, this.y);
        }
        set xzyy(v4fVec: IVec4) {
            this.x = v4fVec.x; this.z = v4fVec.y;
            this.y = v4fVec.z; this.y = v4fVec.w;
        }

        get xzyz(): IVec4 {
            return Vec4.temp(this.x, this.z, this.y, this.z);
        }
        set xzyz(v4fVec: IVec4) {
            this.x = v4fVec.x; this.z = v4fVec.y;
            this.y = v4fVec.z; this.z = v4fVec.w;
        }

        get xzyw(): IVec4 {
            return Vec4.temp(this.x, this.z, this.y, this.w);
        }
        set xzyw(v4fVec: IVec4) {
            this.x = v4fVec.x; this.z = v4fVec.y;
            this.y = v4fVec.z; this.w = v4fVec.w;
        }

        get xzzx(): IVec4 {
            return Vec4.temp(this.x, this.z, this.z, this.x);
        }
        set xzzx(v4fVec: IVec4) {
            this.x = v4fVec.x; this.z = v4fVec.y;
            this.z = v4fVec.z; this.x = v4fVec.w;
        }

        get xzzy(): IVec4 {
            return Vec4.temp(this.x, this.z, this.z, this.y);
        }
        set xzzy(v4fVec: IVec4) {
            this.x = v4fVec.x; this.z = v4fVec.y;
            this.z = v4fVec.z; this.y = v4fVec.w;
        }

        get xzzz(): IVec4 {
            return Vec4.temp(this.x, this.z, this.z, this.z);
        }
        set xzzz(v4fVec: IVec4) {
            this.x = v4fVec.x; this.z = v4fVec.y;
            this.z = v4fVec.z; this.z = v4fVec.w;
        }

        get xzzw(): IVec4 {
            return Vec4.temp(this.x, this.z, this.z, this.w);
        }
        set xzzw(v4fVec: IVec4) {
            this.x = v4fVec.x; this.z = v4fVec.y;
            this.z = v4fVec.z; this.w = v4fVec.w;
        }

        get xzwx(): IVec4 {
            return Vec4.temp(this.x, this.z, this.w, this.x);
        }
        set xzwx(v4fVec: IVec4) {
            this.x = v4fVec.x; this.z = v4fVec.y;
            this.w = v4fVec.z; this.x = v4fVec.w;
        }

        get xzwy(): IVec4 {
            return Vec4.temp(this.x, this.z, this.w, this.y);
        }
        set xzwy(v4fVec: IVec4) {
            this.x = v4fVec.x; this.z = v4fVec.y;
            this.w = v4fVec.z; this.y = v4fVec.w;
        }

        get xzwz(): IVec4 {
            return Vec4.temp(this.x, this.z, this.w, this.z);
        }
        set xzwz(v4fVec: IVec4) {
            this.x = v4fVec.x; this.z = v4fVec.y;
            this.w = v4fVec.z; this.z = v4fVec.w;
        }

        get xzww(): IVec4 {
            return Vec4.temp(this.x, this.z, this.w, this.w);
        }
        set xzww(v4fVec: IVec4) {
            this.x = v4fVec.x; this.z = v4fVec.y;
            this.w = v4fVec.z; this.w = v4fVec.w;
        }

        get xwxx(): IVec4 {
            return Vec4.temp(this.x, this.w, this.x, this.x);
        }
        set xwxx(v4fVec: IVec4) {
            this.x = v4fVec.x; this.w = v4fVec.y;
            this.x = v4fVec.z; this.x = v4fVec.w;
        }

        get xwxy(): IVec4 {
            return Vec4.temp(this.x, this.w, this.x, this.y);
        }
        set xwxy(v4fVec: IVec4) {
            this.x = v4fVec.x; this.w = v4fVec.y;
            this.x = v4fVec.z; this.y = v4fVec.w;
        }

        get xwxz(): IVec4 {
            return Vec4.temp(this.x, this.w, this.x, this.z);
        }
        set xwxz(v4fVec: IVec4) {
            this.x = v4fVec.x; this.w = v4fVec.y;
            this.x = v4fVec.z; this.z = v4fVec.w;
        }

        get xwxw(): IVec4 {
            return Vec4.temp(this.x, this.w, this.x, this.w);
        }
        set xwxw(v4fVec: IVec4) {
            this.x = v4fVec.x; this.w = v4fVec.y;
            this.x = v4fVec.z; this.w = v4fVec.w;
        }

        get xwyx(): IVec4 {
            return Vec4.temp(this.x, this.w, this.y, this.x);
        }
        set xwyx(v4fVec: IVec4) {
            this.x = v4fVec.x; this.w = v4fVec.y;
            this.y = v4fVec.z; this.x = v4fVec.w;
        }

        get xwyy(): IVec4 {
            return Vec4.temp(this.x, this.w, this.y, this.y);
        }
        set xwyy(v4fVec: IVec4) {
            this.x = v4fVec.x; this.w = v4fVec.y;
            this.y = v4fVec.z; this.y = v4fVec.w;
        }

        get xwyz(): IVec4 {
            return Vec4.temp(this.x, this.w, this.y, this.z);
        }
        set xwyz(v4fVec: IVec4) {
            this.x = v4fVec.x; this.w = v4fVec.y;
            this.y = v4fVec.z; this.z = v4fVec.w;
        }

        get xwyw(): IVec4 {
            return Vec4.temp(this.x, this.w, this.y, this.w);
        }
        set xwyw(v4fVec: IVec4) {
            this.x = v4fVec.x; this.w = v4fVec.y;
            this.y = v4fVec.z; this.w = v4fVec.w;
        }

        get xwzx(): IVec4 {
            return Vec4.temp(this.x, this.w, this.z, this.x);
        }
        set xwzx(v4fVec: IVec4) {
            this.x = v4fVec.x; this.w = v4fVec.y;
            this.z = v4fVec.z; this.x = v4fVec.w;
        }

        get xwzy(): IVec4 {
            return Vec4.temp(this.x, this.w, this.z, this.y);
        }
        set xwzy(v4fVec: IVec4) {
            this.x = v4fVec.x; this.w = v4fVec.y;
            this.z = v4fVec.z; this.y = v4fVec.w;
        }

        get xwzz(): IVec4 {
            return Vec4.temp(this.x, this.w, this.z, this.z);
        }
        set xwzz(v4fVec: IVec4) {
            this.x = v4fVec.x; this.w = v4fVec.y;
            this.z = v4fVec.z; this.z = v4fVec.w;
        }

        get xwzw(): IVec4 {
            return Vec4.temp(this.x, this.w, this.z, this.w);
        }
        set xwzw(v4fVec: IVec4) {
            this.x = v4fVec.x; this.w = v4fVec.y;
            this.z = v4fVec.z; this.w = v4fVec.w;
        }

        get xwwx(): IVec4 {
            return Vec4.temp(this.x, this.w, this.w, this.x);
        }
        set xwwx(v4fVec: IVec4) {
            this.x = v4fVec.x; this.w = v4fVec.y;
            this.w = v4fVec.z; this.x = v4fVec.w;
        }

        get xwwy(): IVec4 {
            return Vec4.temp(this.x, this.w, this.w, this.y);
        }
        set xwwy(v4fVec: IVec4) {
            this.x = v4fVec.x; this.w = v4fVec.y;
            this.w = v4fVec.z; this.y = v4fVec.w;
        }

        get xwwz(): IVec4 {
            return Vec4.temp(this.x, this.w, this.w, this.z);
        }
        set xwwz(v4fVec: IVec4) {
            this.x = v4fVec.x; this.w = v4fVec.y;
            this.w = v4fVec.z; this.z = v4fVec.w;
        }

        get xwww(): IVec4 {
            return Vec4.temp(this.x, this.w, this.w, this.w);
        }
        set xwww(v4fVec: IVec4) {
            this.x = v4fVec.x; this.w = v4fVec.y;
            this.w = v4fVec.z; this.w = v4fVec.w;
        }

        get yxxx(): IVec4 {
            return Vec4.temp(this.y, this.x, this.x, this.x);
        }
        set yxxx(v4fVec: IVec4) {
            this.y = v4fVec.x; this.x = v4fVec.y;
            this.x = v4fVec.z; this.x = v4fVec.w;
        }

        get yxxy(): IVec4 {
            return Vec4.temp(this.y, this.x, this.x, this.y);
        }
        set yxxy(v4fVec: IVec4) {
            this.y = v4fVec.x; this.x = v4fVec.y;
            this.x = v4fVec.z; this.y = v4fVec.w;
        }

        get yxxz(): IVec4 {
            return Vec4.temp(this.y, this.x, this.x, this.z);
        }
        set yxxz(v4fVec: IVec4) {
            this.y = v4fVec.x; this.x = v4fVec.y;
            this.x = v4fVec.z; this.z = v4fVec.w;
        }

        get yxxw(): IVec4 {
            return Vec4.temp(this.y, this.x, this.x, this.w);
        }
        set yxxw(v4fVec: IVec4) {
            this.y = v4fVec.x; this.x = v4fVec.y;
            this.x = v4fVec.z; this.w = v4fVec.w;
        }

        get yxyx(): IVec4 {
            return Vec4.temp(this.y, this.x, this.y, this.x);
        }
        set yxyx(v4fVec: IVec4) {
            this.y = v4fVec.x; this.x = v4fVec.y;
            this.y = v4fVec.z; this.x = v4fVec.w;
        }

        get yxyy(): IVec4 {
            return Vec4.temp(this.y, this.x, this.y, this.y);
        }
        set yxyy(v4fVec: IVec4) {
            this.y = v4fVec.x; this.x = v4fVec.y;
            this.y = v4fVec.z; this.y = v4fVec.w;
        }

        get yxyz(): IVec4 {
            return Vec4.temp(this.y, this.x, this.y, this.z);
        }
        set yxyz(v4fVec: IVec4) {
            this.y = v4fVec.x; this.x = v4fVec.y;
            this.y = v4fVec.z; this.z = v4fVec.w;
        }

        get yxyw(): IVec4 {
            return Vec4.temp(this.y, this.x, this.y, this.w);
        }
        set yxyw(v4fVec: IVec4) {
            this.y = v4fVec.x; this.x = v4fVec.y;
            this.y = v4fVec.z; this.w = v4fVec.w;
        }

        get yxzx(): IVec4 {
            return Vec4.temp(this.y, this.x, this.z, this.x);
        }
        set yxzx(v4fVec: IVec4) {
            this.y = v4fVec.x; this.x = v4fVec.y;
            this.z = v4fVec.z; this.x = v4fVec.w;
        }

        get yxzy(): IVec4 {
            return Vec4.temp(this.y, this.x, this.z, this.y);
        }
        set yxzy(v4fVec: IVec4) {
            this.y = v4fVec.x; this.x = v4fVec.y;
            this.z = v4fVec.z; this.y = v4fVec.w;
        }

        get yxzz(): IVec4 {
            return Vec4.temp(this.y, this.x, this.z, this.z);
        }
        set yxzz(v4fVec: IVec4) {
            this.y = v4fVec.x; this.x = v4fVec.y;
            this.z = v4fVec.z; this.z = v4fVec.w;
        }

        get yxzw(): IVec4 {
            return Vec4.temp(this.y, this.x, this.z, this.w);
        }
        set yxzw(v4fVec: IVec4) {
            this.y = v4fVec.x; this.x = v4fVec.y;
            this.z = v4fVec.z; this.w = v4fVec.w;
        }

        get yxwx(): IVec4 {
            return Vec4.temp(this.y, this.x, this.w, this.x);
        }
        set yxwx(v4fVec: IVec4) {
            this.y = v4fVec.x; this.x = v4fVec.y;
            this.w = v4fVec.z; this.x = v4fVec.w;
        }

        get yxwy(): IVec4 {
            return Vec4.temp(this.y, this.x, this.w, this.y);
        }
        set yxwy(v4fVec: IVec4) {
            this.y = v4fVec.x; this.x = v4fVec.y;
            this.w = v4fVec.z; this.y = v4fVec.w;
        }

        get yxwz(): IVec4 {
            return Vec4.temp(this.y, this.x, this.w, this.z);
        }
        set yxwz(v4fVec: IVec4) {
            this.y = v4fVec.x; this.x = v4fVec.y;
            this.w = v4fVec.z; this.z = v4fVec.w;
        }

        get yxww(): IVec4 {
            return Vec4.temp(this.y, this.x, this.w, this.w);
        }
        set yxww(v4fVec: IVec4) {
            this.y = v4fVec.x; this.x = v4fVec.y;
            this.w = v4fVec.z; this.w = v4fVec.w;
        }

        get yyxx(): IVec4 {
            return Vec4.temp(this.y, this.y, this.x, this.x);
        }
        set yyxx(v4fVec: IVec4) {
            this.y = v4fVec.x; this.y = v4fVec.y;
            this.x = v4fVec.z; this.x = v4fVec.w;
        }

        get yyxy(): IVec4 {
            return Vec4.temp(this.y, this.y, this.x, this.y);
        }
        set yyxy(v4fVec: IVec4) {
            this.y = v4fVec.x; this.y = v4fVec.y;
            this.x = v4fVec.z; this.y = v4fVec.w;
        }

        get yyxz(): IVec4 {
            return Vec4.temp(this.y, this.y, this.x, this.z);
        }
        set yyxz(v4fVec: IVec4) {
            this.y = v4fVec.x; this.y = v4fVec.y;
            this.x = v4fVec.z; this.z = v4fVec.w;
        }

        get yyxw(): IVec4 {
            return Vec4.temp(this.y, this.y, this.x, this.w);
        }
        set yyxw(v4fVec: IVec4) {
            this.y = v4fVec.x; this.y = v4fVec.y;
            this.x = v4fVec.z; this.w = v4fVec.w;
        }

        get yyyx(): IVec4 {
            return Vec4.temp(this.y, this.y, this.y, this.x);
        }
        set yyyx(v4fVec: IVec4) {
            this.y = v4fVec.x; this.y = v4fVec.y;
            this.y = v4fVec.z; this.x = v4fVec.w;
        }

        get yyyy(): IVec4 {
            return Vec4.temp(this.y, this.y, this.y, this.y);
        }
        set yyyy(v4fVec: IVec4) {
            this.y = v4fVec.x; this.y = v4fVec.y;
            this.y = v4fVec.z; this.y = v4fVec.w;
        }

        get yyyz(): IVec4 {
            return Vec4.temp(this.y, this.y, this.y, this.z);
        }
        set yyyz(v4fVec: IVec4) {
            this.y = v4fVec.x; this.y = v4fVec.y;
            this.y = v4fVec.z; this.z = v4fVec.w;
        }

        get yyyw(): IVec4 {
            return Vec4.temp(this.y, this.y, this.y, this.w);
        }
        set yyyw(v4fVec: IVec4) {
            this.y = v4fVec.x; this.y = v4fVec.y;
            this.y = v4fVec.z; this.w = v4fVec.w;
        }

        get yyzx(): IVec4 {
            return Vec4.temp(this.y, this.y, this.z, this.x);
        }
        set yyzx(v4fVec: IVec4) {
            this.y = v4fVec.x; this.y = v4fVec.y;
            this.z = v4fVec.z; this.x = v4fVec.w;
        }

        get yyzy(): IVec4 {
            return Vec4.temp(this.y, this.y, this.z, this.y);
        }
        set yyzy(v4fVec: IVec4) {
            this.y = v4fVec.x; this.y = v4fVec.y;
            this.z = v4fVec.z; this.y = v4fVec.w;
        }

        get yyzz(): IVec4 {
            return Vec4.temp(this.y, this.y, this.z, this.z);
        }
        set yyzz(v4fVec: IVec4) {
            this.y = v4fVec.x; this.y = v4fVec.y;
            this.z = v4fVec.z; this.z = v4fVec.w;
        }

        get yyzw(): IVec4 {
            return Vec4.temp(this.y, this.y, this.z, this.w);
        }
        set yyzw(v4fVec: IVec4) {
            this.y = v4fVec.x; this.y = v4fVec.y;
            this.z = v4fVec.z; this.w = v4fVec.w;
        }

        get yywx(): IVec4 {
            return Vec4.temp(this.y, this.y, this.w, this.x);
        }
        set yywx(v4fVec: IVec4) {
            this.y = v4fVec.x; this.y = v4fVec.y;
            this.w = v4fVec.z; this.x = v4fVec.w;
        }

        get yywy(): IVec4 {
            return Vec4.temp(this.y, this.y, this.w, this.y);
        }
        set yywy(v4fVec: IVec4) {
            this.y = v4fVec.x; this.y = v4fVec.y;
            this.w = v4fVec.z; this.y = v4fVec.w;
        }

        get yywz(): IVec4 {
            return Vec4.temp(this.y, this.y, this.w, this.z);
        }
        set yywz(v4fVec: IVec4) {
            this.y = v4fVec.x; this.y = v4fVec.y;
            this.w = v4fVec.z; this.z = v4fVec.w;
        }

        get yyww(): IVec4 {
            return Vec4.temp(this.y, this.y, this.w, this.w);
        }
        set yyww(v4fVec: IVec4) {
            this.y = v4fVec.x; this.y = v4fVec.y;
            this.w = v4fVec.z; this.w = v4fVec.w;
        }

        get yzxx(): IVec4 {
            return Vec4.temp(this.y, this.z, this.x, this.x);
        }
        set yzxx(v4fVec: IVec4) {
            this.y = v4fVec.x; this.z = v4fVec.y;
            this.x = v4fVec.z; this.x = v4fVec.w;
        }

        get yzxy(): IVec4 {
            return Vec4.temp(this.y, this.z, this.x, this.y);
        }
        set yzxy(v4fVec: IVec4) {
            this.y = v4fVec.x; this.z = v4fVec.y;
            this.x = v4fVec.z; this.y = v4fVec.w;
        }

        get yzxz(): IVec4 {
            return Vec4.temp(this.y, this.z, this.x, this.z);
        }
        set yzxz(v4fVec: IVec4) {
            this.y = v4fVec.x; this.z = v4fVec.y;
            this.x = v4fVec.z; this.z = v4fVec.w;
        }

        get yzxw(): IVec4 {
            return Vec4.temp(this.y, this.z, this.x, this.w);
        }
        set yzxw(v4fVec: IVec4) {
            this.y = v4fVec.x; this.z = v4fVec.y;
            this.x = v4fVec.z; this.w = v4fVec.w;
        }

        get yzyx(): IVec4 {
            return Vec4.temp(this.y, this.z, this.y, this.x);
        }
        set yzyx(v4fVec: IVec4) {
            this.y = v4fVec.x; this.z = v4fVec.y;
            this.y = v4fVec.z; this.x = v4fVec.w;
        }

        get yzyy(): IVec4 {
            return Vec4.temp(this.y, this.z, this.y, this.y);
        }
        set yzyy(v4fVec: IVec4) {
            this.y = v4fVec.x; this.z = v4fVec.y;
            this.y = v4fVec.z; this.y = v4fVec.w;
        }

        get yzyz(): IVec4 {
            return Vec4.temp(this.y, this.z, this.y, this.z);
        }
        set yzyz(v4fVec: IVec4) {
            this.y = v4fVec.x; this.z = v4fVec.y;
            this.y = v4fVec.z; this.z = v4fVec.w;
        }

        get yzyw(): IVec4 {
            return Vec4.temp(this.y, this.z, this.y, this.w);
        }
        set yzyw(v4fVec: IVec4) {
            this.y = v4fVec.x; this.z = v4fVec.y;
            this.y = v4fVec.z; this.w = v4fVec.w;
        }

        get yzzx(): IVec4 {
            return Vec4.temp(this.y, this.z, this.z, this.x);
        }
        set yzzx(v4fVec: IVec4) {
            this.y = v4fVec.x; this.z = v4fVec.y;
            this.z = v4fVec.z; this.x = v4fVec.w;
        }

        get yzzy(): IVec4 {
            return Vec4.temp(this.y, this.z, this.z, this.y);
        }
        set yzzy(v4fVec: IVec4) {
            this.y = v4fVec.x; this.z = v4fVec.y;
            this.z = v4fVec.z; this.y = v4fVec.w;
        }

        get yzzz(): IVec4 {
            return Vec4.temp(this.y, this.z, this.z, this.z);
        }
        set yzzz(v4fVec: IVec4) {
            this.y = v4fVec.x; this.z = v4fVec.y;
            this.z = v4fVec.z; this.z = v4fVec.w;
        }

        get yzzw(): IVec4 {
            return Vec4.temp(this.y, this.z, this.z, this.w);
        }
        set yzzw(v4fVec: IVec4) {
            this.y = v4fVec.x; this.z = v4fVec.y;
            this.z = v4fVec.z; this.w = v4fVec.w;
        }

        get yzwx(): IVec4 {
            return Vec4.temp(this.y, this.z, this.w, this.x);
        }
        set yzwx(v4fVec: IVec4) {
            this.y = v4fVec.x; this.z = v4fVec.y;
            this.w = v4fVec.z; this.x = v4fVec.w;
        }

        get yzwy(): IVec4 {
            return Vec4.temp(this.y, this.z, this.w, this.y);
        }
        set yzwy(v4fVec: IVec4) {
            this.y = v4fVec.x; this.z = v4fVec.y;
            this.w = v4fVec.z; this.y = v4fVec.w;
        }

        get yzwz(): IVec4 {
            return Vec4.temp(this.y, this.z, this.w, this.z);
        }
        set yzwz(v4fVec: IVec4) {
            this.y = v4fVec.x; this.z = v4fVec.y;
            this.w = v4fVec.z; this.z = v4fVec.w;
        }

        get yzww(): IVec4 {
            return Vec4.temp(this.y, this.z, this.w, this.w);
        }
        set yzww(v4fVec: IVec4) {
            this.y = v4fVec.x; this.z = v4fVec.y;
            this.w = v4fVec.z; this.w = v4fVec.w;
        }

        get ywxx(): IVec4 {
            return Vec4.temp(this.y, this.w, this.x, this.x);
        }
        set ywxx(v4fVec: IVec4) {
            this.y = v4fVec.x; this.w = v4fVec.y;
            this.x = v4fVec.z; this.x = v4fVec.w;
        }

        get ywxy(): IVec4 {
            return Vec4.temp(this.y, this.w, this.x, this.y);
        }
        set ywxy(v4fVec: IVec4) {
            this.y = v4fVec.x; this.w = v4fVec.y;
            this.x = v4fVec.z; this.y = v4fVec.w;
        }

        get ywxz(): IVec4 {
            return Vec4.temp(this.y, this.w, this.x, this.z);
        }
        set ywxz(v4fVec: IVec4) {
            this.y = v4fVec.x; this.w = v4fVec.y;
            this.x = v4fVec.z; this.z = v4fVec.w;
        }

        get ywxw(): IVec4 {
            return Vec4.temp(this.y, this.w, this.x, this.w);
        }
        set ywxw(v4fVec: IVec4) {
            this.y = v4fVec.x; this.w = v4fVec.y;
            this.x = v4fVec.z; this.w = v4fVec.w;
        }

        get ywyx(): IVec4 {
            return Vec4.temp(this.y, this.w, this.y, this.x);
        }
        set ywyx(v4fVec: IVec4) {
            this.y = v4fVec.x; this.w = v4fVec.y;
            this.y = v4fVec.z; this.x = v4fVec.w;
        }

        get ywyy(): IVec4 {
            return Vec4.temp(this.y, this.w, this.y, this.y);
        }
        set ywyy(v4fVec: IVec4) {
            this.y = v4fVec.x; this.w = v4fVec.y;
            this.y = v4fVec.z; this.y = v4fVec.w;
        }

        get ywyz(): IVec4 {
            return Vec4.temp(this.y, this.w, this.y, this.z);
        }
        set ywyz(v4fVec: IVec4) {
            this.y = v4fVec.x; this.w = v4fVec.y;
            this.y = v4fVec.z; this.z = v4fVec.w;
        }

        get ywyw(): IVec4 {
            return Vec4.temp(this.y, this.w, this.y, this.w);
        }
        set ywyw(v4fVec: IVec4) {
            this.y = v4fVec.x; this.w = v4fVec.y;
            this.y = v4fVec.z; this.w = v4fVec.w;
        }

        get ywzx(): IVec4 {
            return Vec4.temp(this.y, this.w, this.z, this.x);
        }
        set ywzx(v4fVec: IVec4) {
            this.y = v4fVec.x; this.w = v4fVec.y;
            this.z = v4fVec.z; this.x = v4fVec.w;
        }

        get ywzy(): IVec4 {
            return Vec4.temp(this.y, this.w, this.z, this.y);
        }
        set ywzy(v4fVec: IVec4) {
            this.y = v4fVec.x; this.w = v4fVec.y;
            this.z = v4fVec.z; this.y = v4fVec.w;
        }

        get ywzz(): IVec4 {
            return Vec4.temp(this.y, this.w, this.z, this.z);
        }
        set ywzz(v4fVec: IVec4) {
            this.y = v4fVec.x; this.w = v4fVec.y;
            this.z = v4fVec.z; this.z = v4fVec.w;
        }

        get ywzw(): IVec4 {
            return Vec4.temp(this.y, this.w, this.z, this.w);
        }
        set ywzw(v4fVec: IVec4) {
            this.y = v4fVec.x; this.w = v4fVec.y;
            this.z = v4fVec.z; this.w = v4fVec.w;
        }

        get ywwx(): IVec4 {
            return Vec4.temp(this.y, this.w, this.w, this.x);
        }
        set ywwx(v4fVec: IVec4) {
            this.y = v4fVec.x; this.w = v4fVec.y;
            this.w = v4fVec.z; this.x = v4fVec.w;
        }

        get ywwy(): IVec4 {
            return Vec4.temp(this.y, this.w, this.w, this.y);
        }
        set ywwy(v4fVec: IVec4) {
            this.y = v4fVec.x; this.w = v4fVec.y;
            this.w = v4fVec.z; this.y = v4fVec.w;
        }

        get ywwz(): IVec4 {
            return Vec4.temp(this.y, this.w, this.w, this.z);
        }
        set ywwz(v4fVec: IVec4) {
            this.y = v4fVec.x; this.w = v4fVec.y;
            this.w = v4fVec.z; this.z = v4fVec.w;
        }

        get ywww(): IVec4 {
            return Vec4.temp(this.y, this.w, this.w, this.w);
        }
        set ywww(v4fVec: IVec4) {
            this.y = v4fVec.x; this.w = v4fVec.y;
            this.w = v4fVec.z; this.w = v4fVec.w;
        }

        get zxxx(): IVec4 {
            return Vec4.temp(this.z, this.x, this.x, this.x);
        }
        set zxxx(v4fVec: IVec4) {
            this.z = v4fVec.x; this.x = v4fVec.y;
            this.x = v4fVec.z; this.x = v4fVec.w;
        }

        get zxxy(): IVec4 {
            return Vec4.temp(this.z, this.x, this.x, this.y);
        }
        set zxxy(v4fVec: IVec4) {
            this.z = v4fVec.x; this.x = v4fVec.y;
            this.x = v4fVec.z; this.y = v4fVec.w;
        }

        get zxxz(): IVec4 {
            return Vec4.temp(this.z, this.x, this.x, this.z);
        }
        set zxxz(v4fVec: IVec4) {
            this.z = v4fVec.x; this.x = v4fVec.y;
            this.x = v4fVec.z; this.z = v4fVec.w;
        }

        get zxxw(): IVec4 {
            return Vec4.temp(this.z, this.x, this.x, this.w);
        }
        set zxxw(v4fVec: IVec4) {
            this.z = v4fVec.x; this.x = v4fVec.y;
            this.x = v4fVec.z; this.w = v4fVec.w;
        }

        get zxyx(): IVec4 {
            return Vec4.temp(this.z, this.x, this.y, this.x);
        }
        set zxyx(v4fVec: IVec4) {
            this.z = v4fVec.x; this.x = v4fVec.y;
            this.y = v4fVec.z; this.x = v4fVec.w;
        }

        get zxyy(): IVec4 {
            return Vec4.temp(this.z, this.x, this.y, this.y);
        }
        set zxyy(v4fVec: IVec4) {
            this.z = v4fVec.x; this.x = v4fVec.y;
            this.y = v4fVec.z; this.y = v4fVec.w;
        }

        get zxyz(): IVec4 {
            return Vec4.temp(this.z, this.x, this.y, this.z);
        }
        set zxyz(v4fVec: IVec4) {
            this.z = v4fVec.x; this.x = v4fVec.y;
            this.y = v4fVec.z; this.z = v4fVec.w;
        }

        get zxyw(): IVec4 {
            return Vec4.temp(this.z, this.x, this.y, this.w);
        }
        set zxyw(v4fVec: IVec4) {
            this.z = v4fVec.x; this.x = v4fVec.y;
            this.y = v4fVec.z; this.w = v4fVec.w;
        }

        get zxzx(): IVec4 {
            return Vec4.temp(this.z, this.x, this.z, this.x);
        }
        set zxzx(v4fVec: IVec4) {
            this.z = v4fVec.x; this.x = v4fVec.y;
            this.z = v4fVec.z; this.x = v4fVec.w;
        }

        get zxzy(): IVec4 {
            return Vec4.temp(this.z, this.x, this.z, this.y);
        }
        set zxzy(v4fVec: IVec4) {
            this.z = v4fVec.x; this.x = v4fVec.y;
            this.z = v4fVec.z; this.y = v4fVec.w;
        }

        get zxzz(): IVec4 {
            return Vec4.temp(this.z, this.x, this.z, this.z);
        }
        set zxzz(v4fVec: IVec4) {
            this.z = v4fVec.x; this.x = v4fVec.y;
            this.z = v4fVec.z; this.z = v4fVec.w;
        }

        get zxzw(): IVec4 {
            return Vec4.temp(this.z, this.x, this.z, this.w);
        }
        set zxzw(v4fVec: IVec4) {
            this.z = v4fVec.x; this.x = v4fVec.y;
            this.z = v4fVec.z; this.w = v4fVec.w;
        }

        get zxwx(): IVec4 {
            return Vec4.temp(this.z, this.x, this.w, this.x);
        }
        set zxwx(v4fVec: IVec4) {
            this.z = v4fVec.x; this.x = v4fVec.y;
            this.w = v4fVec.z; this.x = v4fVec.w;
        }

        get zxwy(): IVec4 {
            return Vec4.temp(this.z, this.x, this.w, this.y);
        }
        set zxwy(v4fVec: IVec4) {
            this.z = v4fVec.x; this.x = v4fVec.y;
            this.w = v4fVec.z; this.y = v4fVec.w;
        }

        get zxwz(): IVec4 {
            return Vec4.temp(this.z, this.x, this.w, this.z);
        }
        set zxwz(v4fVec: IVec4) {
            this.z = v4fVec.x; this.x = v4fVec.y;
            this.w = v4fVec.z; this.z = v4fVec.w;
        }

        get zxww(): IVec4 {
            return Vec4.temp(this.z, this.x, this.w, this.w);
        }
        set zxww(v4fVec: IVec4) {
            this.z = v4fVec.x; this.x = v4fVec.y;
            this.w = v4fVec.z; this.w = v4fVec.w;
        }

        get zyxx(): IVec4 {
            return Vec4.temp(this.z, this.y, this.x, this.x);
        }
        set zyxx(v4fVec: IVec4) {
            this.z = v4fVec.x; this.y = v4fVec.y;
            this.x = v4fVec.z; this.x = v4fVec.w;
        }

        get zyxy(): IVec4 {
            return Vec4.temp(this.z, this.y, this.x, this.y);
        }
        set zyxy(v4fVec: IVec4) {
            this.z = v4fVec.x; this.y = v4fVec.y;
            this.x = v4fVec.z; this.y = v4fVec.w;
        }

        get zyxz(): IVec4 {
            return Vec4.temp(this.z, this.y, this.x, this.z);
        }
        set zyxz(v4fVec: IVec4) {
            this.z = v4fVec.x; this.y = v4fVec.y;
            this.x = v4fVec.z; this.z = v4fVec.w;
        }

        get zyxw(): IVec4 {
            return Vec4.temp(this.z, this.y, this.x, this.w);
        }
        set zyxw(v4fVec: IVec4) {
            this.z = v4fVec.x; this.y = v4fVec.y;
            this.x = v4fVec.z; this.w = v4fVec.w;
        }

        get zyyx(): IVec4 {
            return Vec4.temp(this.z, this.y, this.y, this.x);
        }
        set zyyx(v4fVec: IVec4) {
            this.z = v4fVec.x; this.y = v4fVec.y;
            this.y = v4fVec.z; this.x = v4fVec.w;
        }

        get zyyy(): IVec4 {
            return Vec4.temp(this.z, this.y, this.y, this.y);
        }
        set zyyy(v4fVec: IVec4) {
            this.z = v4fVec.x; this.y = v4fVec.y;
            this.y = v4fVec.z; this.y = v4fVec.w;
        }

        get zyyz(): IVec4 {
            return Vec4.temp(this.z, this.y, this.y, this.z);
        }
        set zyyz(v4fVec: IVec4) {
            this.z = v4fVec.x; this.y = v4fVec.y;
            this.y = v4fVec.z; this.z = v4fVec.w;
        }

        get zyyw(): IVec4 {
            return Vec4.temp(this.z, this.y, this.y, this.w);
        }
        set zyyw(v4fVec: IVec4) {
            this.z = v4fVec.x; this.y = v4fVec.y;
            this.y = v4fVec.z; this.w = v4fVec.w;
        }

        get zyzx(): IVec4 {
            return Vec4.temp(this.z, this.y, this.z, this.x);
        }
        set zyzx(v4fVec: IVec4) {
            this.z = v4fVec.x; this.y = v4fVec.y;
            this.z = v4fVec.z; this.x = v4fVec.w;
        }

        get zyzy(): IVec4 {
            return Vec4.temp(this.z, this.y, this.z, this.y);
        }
        set zyzy(v4fVec: IVec4) {
            this.z = v4fVec.x; this.y = v4fVec.y;
            this.z = v4fVec.z; this.y = v4fVec.w;
        }

        get zyzz(): IVec4 {
            return Vec4.temp(this.z, this.y, this.z, this.z);
        }
        set zyzz(v4fVec: IVec4) {
            this.z = v4fVec.x; this.y = v4fVec.y;
            this.z = v4fVec.z; this.z = v4fVec.w;
        }

        get zyzw(): IVec4 {
            return Vec4.temp(this.z, this.y, this.z, this.w);
        }
        set zyzw(v4fVec: IVec4) {
            this.z = v4fVec.x; this.y = v4fVec.y;
            this.z = v4fVec.z; this.w = v4fVec.w;
        }

        get zywx(): IVec4 {
            return Vec4.temp(this.z, this.y, this.w, this.x);
        }
        set zywx(v4fVec: IVec4) {
            this.z = v4fVec.x; this.y = v4fVec.y;
            this.w = v4fVec.z; this.x = v4fVec.w;
        }

        get zywy(): IVec4 {
            return Vec4.temp(this.z, this.y, this.w, this.y);
        }
        set zywy(v4fVec: IVec4) {
            this.z = v4fVec.x; this.y = v4fVec.y;
            this.w = v4fVec.z; this.y = v4fVec.w;
        }

        get zywz(): IVec4 {
            return Vec4.temp(this.z, this.y, this.w, this.z);
        }
        set zywz(v4fVec: IVec4) {
            this.z = v4fVec.x; this.y = v4fVec.y;
            this.w = v4fVec.z; this.z = v4fVec.w;
        }

        get zyww(): IVec4 {
            return Vec4.temp(this.z, this.y, this.w, this.w);
        }
        set zyww(v4fVec: IVec4) {
            this.z = v4fVec.x; this.y = v4fVec.y;
            this.w = v4fVec.z; this.w = v4fVec.w;
        }

        get zzxx(): IVec4 {
            return Vec4.temp(this.z, this.z, this.x, this.x);
        }
        set zzxx(v4fVec: IVec4) {
            this.z = v4fVec.x; this.z = v4fVec.y;
            this.x = v4fVec.z; this.x = v4fVec.w;
        }

        get zzxy(): IVec4 {
            return Vec4.temp(this.z, this.z, this.x, this.y);
        }
        set zzxy(v4fVec: IVec4) {
            this.z = v4fVec.x; this.z = v4fVec.y;
            this.x = v4fVec.z; this.y = v4fVec.w;
        }

        get zzxz(): IVec4 {
            return Vec4.temp(this.z, this.z, this.x, this.z);
        }
        set zzxz(v4fVec: IVec4) {
            this.z = v4fVec.x; this.z = v4fVec.y;
            this.x = v4fVec.z; this.z = v4fVec.w;
        }

        get zzxw(): IVec4 {
            return Vec4.temp(this.z, this.z, this.x, this.w);
        }
        set zzxw(v4fVec: IVec4) {
            this.z = v4fVec.x; this.z = v4fVec.y;
            this.x = v4fVec.z; this.w = v4fVec.w;
        }

        get zzyx(): IVec4 {
            return Vec4.temp(this.z, this.z, this.y, this.x);
        }
        set zzyx(v4fVec: IVec4) {
            this.z = v4fVec.x; this.z = v4fVec.y;
            this.y = v4fVec.z; this.x = v4fVec.w;
        }

        get zzyy(): IVec4 {
            return Vec4.temp(this.z, this.z, this.y, this.y);
        }
        set zzyy(v4fVec: IVec4) {
            this.z = v4fVec.x; this.z = v4fVec.y;
            this.y = v4fVec.z; this.y = v4fVec.w;
        }

        get zzyz(): IVec4 {
            return Vec4.temp(this.z, this.z, this.y, this.z);
        }
        set zzyz(v4fVec: IVec4) {
            this.z = v4fVec.x; this.z = v4fVec.y;
            this.y = v4fVec.z; this.z = v4fVec.w;
        }

        get zzyw(): IVec4 {
            return Vec4.temp(this.z, this.z, this.y, this.w);
        }
        set zzyw(v4fVec: IVec4) {
            this.z = v4fVec.x; this.z = v4fVec.y;
            this.y = v4fVec.z; this.w = v4fVec.w;
        }

        get zzzx(): IVec4 {
            return Vec4.temp(this.z, this.z, this.z, this.x);
        }
        set zzzx(v4fVec: IVec4) {
            this.z = v4fVec.x; this.z = v4fVec.y;
            this.z = v4fVec.z; this.x = v4fVec.w;
        }

        get zzzy(): IVec4 {
            return Vec4.temp(this.z, this.z, this.z, this.y);
        }
        set zzzy(v4fVec: IVec4) {
            this.z = v4fVec.x; this.z = v4fVec.y;
            this.z = v4fVec.z; this.y = v4fVec.w;
        }

        get zzzz(): IVec4 {
            return Vec4.temp(this.z, this.z, this.z, this.z);
        }
        set zzzz(v4fVec: IVec4) {
            this.z = v4fVec.x; this.z = v4fVec.y;
            this.z = v4fVec.z; this.z = v4fVec.w;
        }

        get zzzw(): IVec4 {
            return Vec4.temp(this.z, this.z, this.z, this.w);
        }
        set zzzw(v4fVec: IVec4) {
            this.z = v4fVec.x; this.z = v4fVec.y;
            this.z = v4fVec.z; this.w = v4fVec.w;
        }

        get zzwx(): IVec4 {
            return Vec4.temp(this.z, this.z, this.w, this.x);
        }
        set zzwx(v4fVec: IVec4) {
            this.z = v4fVec.x; this.z = v4fVec.y;
            this.w = v4fVec.z; this.x = v4fVec.w;
        }

        get zzwy(): IVec4 {
            return Vec4.temp(this.z, this.z, this.w, this.y);
        }
        set zzwy(v4fVec: IVec4) {
            this.z = v4fVec.x; this.z = v4fVec.y;
            this.w = v4fVec.z; this.y = v4fVec.w;
        }

        get zzwz(): IVec4 {
            return Vec4.temp(this.z, this.z, this.w, this.z);
        }
        set zzwz(v4fVec: IVec4) {
            this.z = v4fVec.x; this.z = v4fVec.y;
            this.w = v4fVec.z; this.z = v4fVec.w;
        }

        get zzww(): IVec4 {
            return Vec4.temp(this.z, this.z, this.w, this.w);
        }
        set zzww(v4fVec: IVec4) {
            this.z = v4fVec.x; this.z = v4fVec.y;
            this.w = v4fVec.z; this.w = v4fVec.w;
        }

        get zwxx(): IVec4 {
            return Vec4.temp(this.z, this.w, this.x, this.x);
        }
        set zwxx(v4fVec: IVec4) {
            this.z = v4fVec.x; this.w = v4fVec.y;
            this.x = v4fVec.z; this.x = v4fVec.w;
        }

        get zwxy(): IVec4 {
            return Vec4.temp(this.z, this.w, this.x, this.y);
        }
        set zwxy(v4fVec: IVec4) {
            this.z = v4fVec.x; this.w = v4fVec.y;
            this.x = v4fVec.z; this.y = v4fVec.w;
        }

        get zwxz(): IVec4 {
            return Vec4.temp(this.z, this.w, this.x, this.z);
        }
        set zwxz(v4fVec: IVec4) {
            this.z = v4fVec.x; this.w = v4fVec.y;
            this.x = v4fVec.z; this.z = v4fVec.w;
        }

        get zwxw(): IVec4 {
            return Vec4.temp(this.z, this.w, this.x, this.w);
        }
        set zwxw(v4fVec: IVec4) {
            this.z = v4fVec.x; this.w = v4fVec.y;
            this.x = v4fVec.z; this.w = v4fVec.w;
        }

        get zwyx(): IVec4 {
            return Vec4.temp(this.z, this.w, this.y, this.x);
        }
        set zwyx(v4fVec: IVec4) {
            this.z = v4fVec.x; this.w = v4fVec.y;
            this.y = v4fVec.z; this.x = v4fVec.w;
        }

        get zwyy(): IVec4 {
            return Vec4.temp(this.z, this.w, this.y, this.y);
        }
        set zwyy(v4fVec: IVec4) {
            this.z = v4fVec.x; this.w = v4fVec.y;
            this.y = v4fVec.z; this.y = v4fVec.w;
        }

        get zwyz(): IVec4 {
            return Vec4.temp(this.z, this.w, this.y, this.z);
        }
        set zwyz(v4fVec: IVec4) {
            this.z = v4fVec.x; this.w = v4fVec.y;
            this.y = v4fVec.z; this.z = v4fVec.w;
        }

        get zwyw(): IVec4 {
            return Vec4.temp(this.z, this.w, this.y, this.w);
        }
        set zwyw(v4fVec: IVec4) {
            this.z = v4fVec.x; this.w = v4fVec.y;
            this.y = v4fVec.z; this.w = v4fVec.w;
        }

        get zwzx(): IVec4 {
            return Vec4.temp(this.z, this.w, this.z, this.x);
        }
        set zwzx(v4fVec: IVec4) {
            this.z = v4fVec.x; this.w = v4fVec.y;
            this.z = v4fVec.z; this.x = v4fVec.w;
        }

        get zwzy(): IVec4 {
            return Vec4.temp(this.z, this.w, this.z, this.y);
        }
        set zwzy(v4fVec: IVec4) {
            this.z = v4fVec.x; this.w = v4fVec.y;
            this.z = v4fVec.z; this.y = v4fVec.w;
        }

        get zwzz(): IVec4 {
            return Vec4.temp(this.z, this.w, this.z, this.z);
        }
        set zwzz(v4fVec: IVec4) {
            this.z = v4fVec.x; this.w = v4fVec.y;
            this.z = v4fVec.z; this.z = v4fVec.w;
        }

        get zwzw(): IVec4 {
            return Vec4.temp(this.z, this.w, this.z, this.w);
        }
        set zwzw(v4fVec: IVec4) {
            this.z = v4fVec.x; this.w = v4fVec.y;
            this.z = v4fVec.z; this.w = v4fVec.w;
        }

        get zwwx(): IVec4 {
            return Vec4.temp(this.z, this.w, this.w, this.x);
        }
        set zwwx(v4fVec: IVec4) {
            this.z = v4fVec.x; this.w = v4fVec.y;
            this.w = v4fVec.z; this.x = v4fVec.w;
        }

        get zwwy(): IVec4 {
            return Vec4.temp(this.z, this.w, this.w, this.y);
        }
        set zwwy(v4fVec: IVec4) {
            this.z = v4fVec.x; this.w = v4fVec.y;
            this.w = v4fVec.z; this.y = v4fVec.w;
        }

        get zwwz(): IVec4 {
            return Vec4.temp(this.z, this.w, this.w, this.z);
        }
        set zwwz(v4fVec: IVec4) {
            this.z = v4fVec.x; this.w = v4fVec.y;
            this.w = v4fVec.z; this.z = v4fVec.w;
        }

        get zwww(): IVec4 {
            return Vec4.temp(this.z, this.w, this.w, this.w);
        }
        set zwww(v4fVec: IVec4) {
            this.z = v4fVec.x; this.w = v4fVec.y;
            this.w = v4fVec.z; this.w = v4fVec.w;
        }

        get wxxx(): IVec4 {
            return Vec4.temp(this.w, this.x, this.x, this.x);
        }
        set wxxx(v4fVec: IVec4) {
            this.w = v4fVec.x; this.x = v4fVec.y;
            this.x = v4fVec.z; this.x = v4fVec.w;
        }

        get wxxy(): IVec4 {
            return Vec4.temp(this.w, this.x, this.x, this.y);
        }
        set wxxy(v4fVec: IVec4) {
            this.w = v4fVec.x; this.x = v4fVec.y;
            this.x = v4fVec.z; this.y = v4fVec.w;
        }

        get wxxz(): IVec4 {
            return Vec4.temp(this.w, this.x, this.x, this.z);
        }
        set wxxz(v4fVec: IVec4) {
            this.w = v4fVec.x; this.x = v4fVec.y;
            this.x = v4fVec.z; this.z = v4fVec.w;
        }

        get wxxw(): IVec4 {
            return Vec4.temp(this.w, this.x, this.x, this.w);
        }
        set wxxw(v4fVec: IVec4) {
            this.w = v4fVec.x; this.x = v4fVec.y;
            this.x = v4fVec.z; this.w = v4fVec.w;
        }

        get wxyx(): IVec4 {
            return Vec4.temp(this.w, this.x, this.y, this.x);
        }
        set wxyx(v4fVec: IVec4) {
            this.w = v4fVec.x; this.x = v4fVec.y;
            this.y = v4fVec.z; this.x = v4fVec.w;
        }

        get wxyy(): IVec4 {
            return Vec4.temp(this.w, this.x, this.y, this.y);
        }
        set wxyy(v4fVec: IVec4) {
            this.w = v4fVec.x; this.x = v4fVec.y;
            this.y = v4fVec.z; this.y = v4fVec.w;
        }

        get wxyz(): IVec4 {
            return Vec4.temp(this.w, this.x, this.y, this.z);
        }
        set wxyz(v4fVec: IVec4) {
            this.w = v4fVec.x; this.x = v4fVec.y;
            this.y = v4fVec.z; this.z = v4fVec.w;
        }

        get wxyw(): IVec4 {
            return Vec4.temp(this.w, this.x, this.y, this.w);
        }
        set wxyw(v4fVec: IVec4) {
            this.w = v4fVec.x; this.x = v4fVec.y;
            this.y = v4fVec.z; this.w = v4fVec.w;
        }

        get wxzx(): IVec4 {
            return Vec4.temp(this.w, this.x, this.z, this.x);
        }
        set wxzx(v4fVec: IVec4) {
            this.w = v4fVec.x; this.x = v4fVec.y;
            this.z = v4fVec.z; this.x = v4fVec.w;
        }

        get wxzy(): IVec4 {
            return Vec4.temp(this.w, this.x, this.z, this.y);
        }
        set wxzy(v4fVec: IVec4) {
            this.w = v4fVec.x; this.x = v4fVec.y;
            this.z = v4fVec.z; this.y = v4fVec.w;
        }

        get wxzz(): IVec4 {
            return Vec4.temp(this.w, this.x, this.z, this.z);
        }
        set wxzz(v4fVec: IVec4) {
            this.w = v4fVec.x; this.x = v4fVec.y;
            this.z = v4fVec.z; this.z = v4fVec.w;
        }

        get wxzw(): IVec4 {
            return Vec4.temp(this.w, this.x, this.z, this.w);
        }
        set wxzw(v4fVec: IVec4) {
            this.w = v4fVec.x; this.x = v4fVec.y;
            this.z = v4fVec.z; this.w = v4fVec.w;
        }

        get wxwx(): IVec4 {
            return Vec4.temp(this.w, this.x, this.w, this.x);
        }
        set wxwx(v4fVec: IVec4) {
            this.w = v4fVec.x; this.x = v4fVec.y;
            this.w = v4fVec.z; this.x = v4fVec.w;
        }

        get wxwy(): IVec4 {
            return Vec4.temp(this.w, this.x, this.w, this.y);
        }
        set wxwy(v4fVec: IVec4) {
            this.w = v4fVec.x; this.x = v4fVec.y;
            this.w = v4fVec.z; this.y = v4fVec.w;
        }

        get wxwz(): IVec4 {
            return Vec4.temp(this.w, this.x, this.w, this.z);
        }
        set wxwz(v4fVec: IVec4) {
            this.w = v4fVec.x; this.x = v4fVec.y;
            this.w = v4fVec.z; this.z = v4fVec.w;
        }

        get wxww(): IVec4 {
            return Vec4.temp(this.w, this.x, this.w, this.w);
        }
        set wxww(v4fVec: IVec4) {
            this.w = v4fVec.x; this.x = v4fVec.y;
            this.w = v4fVec.z; this.w = v4fVec.w;
        }

        get wyxx(): IVec4 {
            return Vec4.temp(this.w, this.y, this.x, this.x);
        }
        set wyxx(v4fVec: IVec4) {
            this.w = v4fVec.x; this.y = v4fVec.y;
            this.x = v4fVec.z; this.x = v4fVec.w;
        }

        get wyxy(): IVec4 {
            return Vec4.temp(this.w, this.y, this.x, this.y);
        }
        set wyxy(v4fVec: IVec4) {
            this.w = v4fVec.x; this.y = v4fVec.y;
            this.x = v4fVec.z; this.y = v4fVec.w;
        }

        get wyxz(): IVec4 {
            return Vec4.temp(this.w, this.y, this.x, this.z);
        }
        set wyxz(v4fVec: IVec4) {
            this.w = v4fVec.x; this.y = v4fVec.y;
            this.x = v4fVec.z; this.z = v4fVec.w;
        }

        get wyxw(): IVec4 {
            return Vec4.temp(this.w, this.y, this.x, this.w);
        }
        set wyxw(v4fVec: IVec4) {
            this.w = v4fVec.x; this.y = v4fVec.y;
            this.x = v4fVec.z; this.w = v4fVec.w;
        }

        get wyyx(): IVec4 {
            return Vec4.temp(this.w, this.y, this.y, this.x);
        }
        set wyyx(v4fVec: IVec4) {
            this.w = v4fVec.x; this.y = v4fVec.y;
            this.y = v4fVec.z; this.x = v4fVec.w;
        }

        get wyyy(): IVec4 {
            return Vec4.temp(this.w, this.y, this.y, this.y);
        }
        set wyyy(v4fVec: IVec4) {
            this.w = v4fVec.x; this.y = v4fVec.y;
            this.y = v4fVec.z; this.y = v4fVec.w;
        }

        get wyyz(): IVec4 {
            return Vec4.temp(this.w, this.y, this.y, this.z);
        }
        set wyyz(v4fVec: IVec4) {
            this.w = v4fVec.x; this.y = v4fVec.y;
            this.y = v4fVec.z; this.z = v4fVec.w;
        }

        get wyyw(): IVec4 {
            return Vec4.temp(this.w, this.y, this.y, this.w);
        }
        set wyyw(v4fVec: IVec4) {
            this.w = v4fVec.x; this.y = v4fVec.y;
            this.y = v4fVec.z; this.w = v4fVec.w;
        }

        get wyzx(): IVec4 {
            return Vec4.temp(this.w, this.y, this.z, this.x);
        }
        set wyzx(v4fVec: IVec4) {
            this.w = v4fVec.x; this.y = v4fVec.y;
            this.z = v4fVec.z; this.x = v4fVec.w;
        }

        get wyzy(): IVec4 {
            return Vec4.temp(this.w, this.y, this.z, this.y);
        }
        set wyzy(v4fVec: IVec4) {
            this.w = v4fVec.x; this.y = v4fVec.y;
            this.z = v4fVec.z; this.y = v4fVec.w;
        }

        get wyzz(): IVec4 {
            return Vec4.temp(this.w, this.y, this.z, this.z);
        }
        set wyzz(v4fVec: IVec4) {
            this.w = v4fVec.x; this.y = v4fVec.y;
            this.z = v4fVec.z; this.z = v4fVec.w;
        }

        get wyzw(): IVec4 {
            return Vec4.temp(this.w, this.y, this.z, this.w);
        }
        set wyzw(v4fVec: IVec4) {
            this.w = v4fVec.x; this.y = v4fVec.y;
            this.z = v4fVec.z; this.w = v4fVec.w;
        }

        get wywx(): IVec4 {
            return Vec4.temp(this.w, this.y, this.w, this.x);
        }
        set wywx(v4fVec: IVec4) {
            this.w = v4fVec.x; this.y = v4fVec.y;
            this.w = v4fVec.z; this.x = v4fVec.w;
        }

        get wywy(): IVec4 {
            return Vec4.temp(this.w, this.y, this.w, this.y);
        }
        set wywy(v4fVec: IVec4) {
            this.w = v4fVec.x; this.y = v4fVec.y;
            this.w = v4fVec.z; this.y = v4fVec.w;
        }

        get wywz(): IVec4 {
            return Vec4.temp(this.w, this.y, this.w, this.z);
        }
        set wywz(v4fVec: IVec4) {
            this.w = v4fVec.x; this.y = v4fVec.y;
            this.w = v4fVec.z; this.z = v4fVec.w;
        }

        get wyww(): IVec4 {
            return Vec4.temp(this.w, this.y, this.w, this.w);
        }
        set wyww(v4fVec: IVec4) {
            this.w = v4fVec.x; this.y = v4fVec.y;
            this.w = v4fVec.z; this.w = v4fVec.w;
        }

        get wzxx(): IVec4 {
            return Vec4.temp(this.w, this.z, this.x, this.x);
        }
        set wzxx(v4fVec: IVec4) {
            this.w = v4fVec.x; this.z = v4fVec.y;
            this.x = v4fVec.z; this.x = v4fVec.w;
        }

        get wzxy(): IVec4 {
            return Vec4.temp(this.w, this.z, this.x, this.y);
        }
        set wzxy(v4fVec: IVec4) {
            this.w = v4fVec.x; this.z = v4fVec.y;
            this.x = v4fVec.z; this.y = v4fVec.w;
        }

        get wzxz(): IVec4 {
            return Vec4.temp(this.w, this.z, this.x, this.z);
        }
        set wzxz(v4fVec: IVec4) {
            this.w = v4fVec.x; this.z = v4fVec.y;
            this.x = v4fVec.z; this.z = v4fVec.w;
        }

        get wzxw(): IVec4 {
            return Vec4.temp(this.w, this.z, this.x, this.w);
        }
        set wzxw(v4fVec: IVec4) {
            this.w = v4fVec.x; this.z = v4fVec.y;
            this.x = v4fVec.z; this.w = v4fVec.w;
        }

        get wzyx(): IVec4 {
            return Vec4.temp(this.w, this.z, this.y, this.x);
        }
        set wzyx(v4fVec: IVec4) {
            this.w = v4fVec.x; this.z = v4fVec.y;
            this.y = v4fVec.z; this.x = v4fVec.w;
        }

        get wzyy(): IVec4 {
            return Vec4.temp(this.w, this.z, this.y, this.y);
        }
        set wzyy(v4fVec: IVec4) {
            this.w = v4fVec.x; this.z = v4fVec.y;
            this.y = v4fVec.z; this.y = v4fVec.w;
        }

        get wzyz(): IVec4 {
            return Vec4.temp(this.w, this.z, this.y, this.z);
        }
        set wzyz(v4fVec: IVec4) {
            this.w = v4fVec.x; this.z = v4fVec.y;
            this.y = v4fVec.z; this.z = v4fVec.w;
        }

        get wzyw(): IVec4 {
            return Vec4.temp(this.w, this.z, this.y, this.w);
        }
        set wzyw(v4fVec: IVec4) {
            this.w = v4fVec.x; this.z = v4fVec.y;
            this.y = v4fVec.z; this.w = v4fVec.w;
        }

        get wzzx(): IVec4 {
            return Vec4.temp(this.w, this.z, this.z, this.x);
        }
        set wzzx(v4fVec: IVec4) {
            this.w = v4fVec.x; this.z = v4fVec.y;
            this.z = v4fVec.z; this.x = v4fVec.w;
        }

        get wzzy(): IVec4 {
            return Vec4.temp(this.w, this.z, this.z, this.y);
        }
        set wzzy(v4fVec: IVec4) {
            this.w = v4fVec.x; this.z = v4fVec.y;
            this.z = v4fVec.z; this.y = v4fVec.w;
        }

        get wzzz(): IVec4 {
            return Vec4.temp(this.w, this.z, this.z, this.z);
        }
        set wzzz(v4fVec: IVec4) {
            this.w = v4fVec.x; this.z = v4fVec.y;
            this.z = v4fVec.z; this.z = v4fVec.w;
        }

        get wzzw(): IVec4 {
            return Vec4.temp(this.w, this.z, this.z, this.w);
        }
        set wzzw(v4fVec: IVec4) {
            this.w = v4fVec.x; this.z = v4fVec.y;
            this.z = v4fVec.z; this.w = v4fVec.w;
        }

        get wzwx(): IVec4 {
            return Vec4.temp(this.w, this.z, this.w, this.x);
        }
        set wzwx(v4fVec: IVec4) {
            this.w = v4fVec.x; this.z = v4fVec.y;
            this.w = v4fVec.z; this.x = v4fVec.w;
        }

        get wzwy(): IVec4 {
            return Vec4.temp(this.w, this.z, this.w, this.y);
        }
        set wzwy(v4fVec: IVec4) {
            this.w = v4fVec.x; this.z = v4fVec.y;
            this.w = v4fVec.z; this.y = v4fVec.w;
        }

        get wzwz(): IVec4 {
            return Vec4.temp(this.w, this.z, this.w, this.z);
        }
        set wzwz(v4fVec: IVec4) {
            this.w = v4fVec.x; this.z = v4fVec.y;
            this.w = v4fVec.z; this.z = v4fVec.w;
        }

        get wzww(): IVec4 {
            return Vec4.temp(this.w, this.z, this.w, this.w);
        }
        set wzww(v4fVec: IVec4) {
            this.w = v4fVec.x; this.z = v4fVec.y;
            this.w = v4fVec.z; this.w = v4fVec.w;
        }

        get wwxx(): IVec4 {
            return Vec4.temp(this.w, this.w, this.x, this.x);
        }
        set wwxx(v4fVec: IVec4) {
            this.w = v4fVec.x; this.w = v4fVec.y;
            this.x = v4fVec.z; this.x = v4fVec.w;
        }

        get wwxy(): IVec4 {
            return Vec4.temp(this.w, this.w, this.x, this.y);
        }
        set wwxy(v4fVec: IVec4) {
            this.w = v4fVec.x; this.w = v4fVec.y;
            this.x = v4fVec.z; this.y = v4fVec.w;
        }

        get wwxz(): IVec4 {
            return Vec4.temp(this.w, this.w, this.x, this.z);
        }
        set wwxz(v4fVec: IVec4) {
            this.w = v4fVec.x; this.w = v4fVec.y;
            this.x = v4fVec.z; this.z = v4fVec.w;
        }

        get wwxw(): IVec4 {
            return Vec4.temp(this.w, this.w, this.x, this.w);
        }
        set wwxw(v4fVec: IVec4) {
            this.w = v4fVec.x; this.w = v4fVec.y;
            this.x = v4fVec.z; this.w = v4fVec.w;
        }

        get wwyx(): IVec4 {
            return Vec4.temp(this.w, this.w, this.y, this.x);
        }
        set wwyx(v4fVec: IVec4) {
            this.w = v4fVec.x; this.w = v4fVec.y;
            this.y = v4fVec.z; this.x = v4fVec.w;
        }

        get wwyy(): IVec4 {
            return Vec4.temp(this.w, this.w, this.y, this.y);
        }
        set wwyy(v4fVec: IVec4) {
            this.w = v4fVec.x; this.w = v4fVec.y;
            this.y = v4fVec.z; this.y = v4fVec.w;
        }

        get wwyz(): IVec4 {
            return Vec4.temp(this.w, this.w, this.y, this.z);
        }
        set wwyz(v4fVec: IVec4) {
            this.w = v4fVec.x; this.w = v4fVec.y;
            this.y = v4fVec.z; this.z = v4fVec.w;
        }

        get wwyw(): IVec4 {
            return Vec4.temp(this.w, this.w, this.y, this.w);
        }
        set wwyw(v4fVec: IVec4) {
            this.w = v4fVec.x; this.w = v4fVec.y;
            this.y = v4fVec.z; this.w = v4fVec.w;
        }

        get wwzx(): IVec4 {
            return Vec4.temp(this.w, this.w, this.z, this.x);
        }
        set wwzx(v4fVec: IVec4) {
            this.w = v4fVec.x; this.w = v4fVec.y;
            this.z = v4fVec.z; this.x = v4fVec.w;
        }

        get wwzy(): IVec4 {
            return Vec4.temp(this.w, this.w, this.z, this.y);
        }
        set wwzy(v4fVec: IVec4) {
            this.w = v4fVec.x; this.w = v4fVec.y;
            this.z = v4fVec.z; this.y = v4fVec.w;
        }

        get wwzz(): IVec4 {
            return Vec4.temp(this.w, this.w, this.z, this.z);
        }
        set wwzz(v4fVec: IVec4) {
            this.w = v4fVec.x; this.w = v4fVec.y;
            this.z = v4fVec.z; this.z = v4fVec.w;
        }

        get wwzw(): IVec4 {
            return Vec4.temp(this.w, this.w, this.z, this.w);
        }
        set wwzw(v4fVec: IVec4) {
            this.w = v4fVec.x; this.w = v4fVec.y;
            this.z = v4fVec.z; this.w = v4fVec.w;
        }

        get wwwx(): IVec4 {
            return Vec4.temp(this.w, this.w, this.w, this.x);
        }
        set wwwx(v4fVec: IVec4) {
            this.w = v4fVec.x; this.w = v4fVec.y;
            this.w = v4fVec.z; this.x = v4fVec.w;
        }

        get wwwy(): IVec4 {
            return Vec4.temp(this.w, this.w, this.w, this.y);
        }
        set wwwy(v4fVec: IVec4) {
            this.w = v4fVec.x; this.w = v4fVec.y;
            this.w = v4fVec.z; this.y = v4fVec.w;
        }

        get wwwz(): IVec4 {
            return Vec4.temp(this.w, this.w, this.w, this.z);
        }
        set wwwz(v4fVec: IVec4) {
            this.w = v4fVec.x; this.w = v4fVec.y;
            this.w = v4fVec.z; this.z = v4fVec.w;
        }

        get wwww(): IVec4 {
            return Vec4.temp(this.w, this.w, this.w, this.w);
        }
        set wwww(v4fVec: IVec4) {
            this.w = v4fVec.x; this.w = v4fVec.y;
            this.w = v4fVec.z; this.w = v4fVec.w;
        }

        constructor();
        constructor(xyzw: float);
        constructor(xyzw: IVec4);
        constructor(xyzw: float[]);
        constructor(rgba: IColorValue);
        constructor(x: float, yzw: IVec3);
        constructor(xy: IVec2, zw: IVec2);
        constructor(xyz: IVec3, w: float);
        constructor(x: float, y: float, zw: IVec2);
        constructor(x: float, yz: IVec2, w: float);
        constructor(xy: IVec2, z: float, w: float);
        constructor(x: float, y: float, z: float, w: float);
        constructor(x?, y?, z?, w?) {
            var n: uint = arguments.length;
            var v: IVec4 = this;

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

        set(): IVec4;
        set(xyzw: float): IVec4;
        set(xyzw: IVec4): IVec4;
        set(xyzw: float[]): IVec4;
        set(rgba: IColorValue): IVec4;
        set(x: float, yzw: IVec3): IVec4;
        set(xy: IVec2, zw: IVec2): IVec4;
        set(xyz: IVec3, w: float): IVec4;
        set(x: float, y: float, zw: IVec2): IVec4;
        set(x: float, yz: IVec2, w: float): IVec4;
        set(xy: IVec2, z: float, w: float): IVec4;
        set(x: float, y: float, z: float, w: float): IVec4;
        set(): IVec4 {
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
                        var v4fVec: IVec4 = arguments[0];

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
                        var v3fVec: IVec3 = arguments[1];

                        this.x = fValue;
                        this.y = v3fVec.x;
                        this.z = v3fVec.y;
                        this.w = v3fVec.z;
                    }
                    else if (arguments[0] instanceof Vec2) {
                        var v2fVec1: IVec2 = arguments[0];
                        var v2fVec2: IVec2 = arguments[1];

                        this.x = v2fVec1.x;
                        this.y = v2fVec1.y;
                        this.z = v2fVec2.x;
                        this.w = v2fVec2.y;
                    }
                    else {
                        var v3fVec: IVec3 = arguments[0];
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
                            var v2fVec: IVec2 = arguments[2];

                            this.x = fValue1;
                            this.y = fValue2;
                            this.z = v2fVec.x;
                            this.w = v2fVec.y;
                        }
                        else {
                            var v2fVec: IVec2 = arguments[1];
                            var fValue2: float = arguments[2];

                            this.x = fValue1;
                            this.y = v2fVec.x;
                            this.z = v2fVec.y;
                            this.w = fValue2;
                        }
                    }
                    else {
                        var v2fVec: IVec2 = arguments[0];
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

        /**  */ clear(): IVec4 {
            this.x = this.y = this.z = this.w = 0.;
            return this;
        }

        add(v4fVec: IVec4, v4fDestination?: IVec4): IVec4 {
            if (!isDef(v4fDestination)) {
                v4fDestination = this;
            }

            v4fDestination.x = this.x + v4fVec.x;
            v4fDestination.y = this.y + v4fVec.y;
            v4fDestination.z = this.z + v4fVec.z;
            v4fDestination.w = this.w + v4fVec.w;

            return v4fDestination;
        }

        subtract(v4fVec: IVec4, v4fDestination?: IVec4): IVec4 {
            if (!isDef(v4fDestination)) {
                v4fDestination = this;
            }

            v4fDestination.x = this.x - v4fVec.x;
            v4fDestination.y = this.y - v4fVec.y;
            v4fDestination.z = this.z - v4fVec.z;
            v4fDestination.w = this.w - v4fVec.w;

            return v4fDestination;
        }

        /**  */ dot(v4fVec: IVec4): float {
            return this.x * v4fVec.x + this.y * v4fVec.y + this.z * v4fVec.z + this.w * v4fVec.w;
        }

        isEqual(v4fVec: IVec4, fEps: float = 0.): boolean {
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

        negate(v4fDestination?: IVec4): IVec4 {
            if (!isDef(v4fDestination)) {
                v4fDestination = this;
            }

            v4fDestination.x = -this.x;
            v4fDestination.y = -this.y;
            v4fDestination.z = -this.z;
            v4fDestination.w = -this.w;

            return v4fDestination;
        }

        scale(fScale: float, v4fDestination?: IVec4): IVec4 {
            if (!isDef(v4fDestination)) {
                v4fDestination = this;
            }

            v4fDestination.x = this.x * fScale;
            v4fDestination.y = this.y * fScale;
            v4fDestination.z = this.z * fScale;
            v4fDestination.w = this.w * fScale;

            return v4fDestination;
        }

        normalize(v4fDestination?: IVec4): IVec4 {
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

        /**  */ length(): float {
            var x: float = this.x, y: float = this.y, z: float = this.z, w: float = this.w;
            return sqrt(x * x + y * y + z * z + w * w);
        }

        /**  */ lengthSquare(): float {
            var x: float = this.x, y: float = this.y, z: float = this.z, w: float = this.w;
            return x * x + y * y + z * z + w * w;
        }

        direction(v4fVec: IVec4, v4fDestination?: IVec4): IVec4 {
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

        mix(v4fVec: IVec4, fA: float, v4fDestination?: IVec4): IVec4 {
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

        /**  */ toString(): string {
            return "[x: " + this.x + ", y: " + this.y
                + ", z: " + this.z + ", w: " + this.w + "]";
        }

        static temp(): IVec4;
        static temp(xyzw: float): IVec4;
        static temp(xyzw: IVec4): IVec4;
        static temp(xyzw: float[]): IVec4;
        static temp(rgba: IColorValue): IVec4;
        static temp(x: float, yzw: IVec3): IVec4;
        static temp(xy: IVec2, zw: IVec2): IVec4;
        static temp(xyz: IVec3, w: float): IVec4;
        static temp(x: float, y: float, zw: IVec2): IVec4;
        static temp(x: float, yz: IVec2, w: float): IVec4;
        static temp(xy: IVec2, z: float, w: float): IVec4;
        static temp(x: float, y: float, z: float, w: float): IVec4;
        static temp(x?, y?, z?, w?): IVec4 {
            iElement = (iElement === pBuffer.length - 1 ? 0 : pBuffer.length);
            var p = pBuffer[iElement++];
            return p.set.apply(p, arguments);
        }

    }


    pBuffer = gen.array<IVec4>(256, Vec4);
    iElement = 0;

}
