#ifndef VEC3_TS
#define VEC3_TS

#include "IVec2.ts"
#include "IVec3.ts"
#include "IMat4.ts"

module akra.math {
    export class Vec3 {
        x: float;
        y: float;
        z: float;

        constructor();
        constructor(fValue: float);
        constructor(v3fVec: IVec3);
        constructor(pArray: float[]);
        constructor(fValue: float, v2fVec: IVec2);
        constructor(v2fVec: IVec2, fValue: float);
        constructor(fValue1: float, fValue2: float, fValue3: float);
        constructor(fValue1?, fValue2?, fValue3?){
            var nArgumentsLength = arguments.length;

            switch(nArgumentsLength){
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
        };

        set(): IVec3;
        set(fValue: float): IVec3;
        set(v3fVec: IVec3): IVec3;
        set(pArray: float[]): IVec3;
        set(fValue: float, v2fVec: IVec2): IVec3;
        set(v2fVec: IVec2, fValue: float): IVec3;
        set(fValue1: float, fValue2: float, fValue3: float): IVec3;
        set(fValue1?, fValue2?, fValue3?): IVec3{
            var nArgumentsLength = arguments.length;

            switch(nArgumentsLength){
                case 0:
                    this.x = this.y = this.z = 0.;
                    break;
                case 1:
                    if(isFloat(arguments[0])){
                        this.x = this.y = this.z = arguments[0];
                    }
                    else if(arguments[0] instanceof Vec3){
                        var v3fVec: IVec3 = arguments[0];

                        this.x = v3fVec.x;
                        this.y = v3fVec.y;
                        this.z = v3fVec.z;
                    }
                    else{
                        var pArray: float[] = arguments[0];

                        this.x = pArray[0];
                        this.y = pArray[1];
                        this.z = pArray[2];
                    }
                    break;
                case 2:
                    if(isFloat(arguments[0])){
                        var fValue: float = arguments[0];
                        var v2fVec: IVec2 = arguments[1];

                        this.x = fValue;
                        this.y = v2fVec.x;
                        this.z = v2fVec.y;
                    }
                    else{
                        var v2fVec: IVec2 = arguments[0];
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
        };

        inline clear(): IVec3{
            this.x = this.y = this.z = 0.;
            return this;
        };

        add(v3fVec: IVec3, v3fDestination?: IVec3): IVec3{
            if(!isDef(v3fDestination)){
                v3fDestination = this;
            }

            v3fDestination.x = this.x + v3fVec.x;
            v3fDestination.y = this.y + v3fVec.y;
            v3fDestination.z = this.z + v3fVec.z;

            return v3fDestination;
        };

        subtract(v3fVec: IVec3, v3fDestination?: IVec3): IVec3{
            if(!isDef(v3fDestination)){
                v3fDestination = this;
            }

            v3fDestination.x = this.x - v3fVec.x;
            v3fDestination.y = this.y - v3fVec.y;
            v3fDestination.z = this.z - v3fVec.z;

            return v3fDestination;
        };

        inline dot(v3fVec: IVec3): float{
            return this.x*v3fVec.x + this.y*v3fVec.y + this.z*v3fVec.z;
        };

        cross(v3fVec: IVec3, v3fDestination?: IVec3): IVec3{
            if(!isDef(v3fDestination)){
                v3fDestination = this;
            }

            var x1: float = this.x, y1: float = this.y, z1: float = this.z;
            var x2: float = v3fVec.x, y2: float = v3fVec.y, z2: float = v3fVec.z;

            v3fDestination.x = y1*z2 - z1*y2;
            v3fDestination.y = z1*x2 - x1*z2;
            v3fDestination.z = x1*y2 - y1*x2;

            return v3fDestination;
        };

        isEqual(v3fVec: IVec3, fEps: float = 0.): bool{
            if(fEps === 0.){
                if(    this.x != v3fVec.x 
                    || this.y != v3fVec.y
                    || this.z != v3fVec.z){

                    return false;
                }
            }
            else{
                if(    abs(this.x - v3fVec.x) > fEps
                    || abs(this.y - v3fVec.y) > fEps
                    || abs(this.z - v3fVec.z) > fEps){

                    return false;
                }
            }
            return true;
        };

        isClear(fEps: float = 0.): bool{
            if(fEps === 0.){
                if(    this.x != 0.
                    || this.y != 0.
                    || this.z != 0.){

                    return false;
                }
            }
            else{
                if(    abs(this.x) > fEps
                    || abs(this.y) > fEps
                    || abs(this.z) > fEps){

                    return false;
                }
            }

            return true;
        };

        negate(v3fDestination?: IVec3): IVec3{
            if(!isDef(v3fDestination)){
                v3fDestination = this;
            }

            v3fDestination.x = -this.x;
            v3fDestination.y = -this.y;
            v3fDestination.z = -this.z;

            return v3fDestination;
        };

        scale(fScale: float, v3fDestination?: IVec3): IVec3{
            if(!isDef(v3fDestination)){
                v3fDestination = this;
            }

            v3fDestination.x = this.x*fScale;
            v3fDestination.y = this.y*fScale;
            v3fDestination.z = this.z*fScale;

            return v3fDestination;
        };

        normalize(v3fDestination?: IVec3): IVec3{
            if(!v3fDestination){
                v3fDestination = this;
            }

            var x: float = this.x, y: float = this.y, z: float = this.z;
            var fLength: float = sqrt(x*x + y*y + z*z);

            if(fLength !== 0.){
                var fInvLength: float = 1./fLength;

                x *= fInvLength;
                y *= fInvLength;
                z *= fInvLength;
            }

            v3fDestination.x = x;
            v3fDestination.y = y;
            v3fDestination.z = z;

            return v3fDestination;
        };

        inline length(): float{
            var x: float = this.x, y: float = this.y, z: float = this.z;
            return sqrt(x*x + y*y + z*z);
        };

        inline lengthSquare(): float{
            var x: float = this.x, y: float = this.y, z: float = this.z;
            return x*x + y*y + z*z;
        };

        direction(v3fVec: IVec3, v3fDestination?: IVec3): IVec3{
            if(!isDef(v3fDestination)){
                v3fDestination = this;
            }

            var x: float = v3fVec.x - this.x;
            var y: float = v3fVec.y - this.y;
            var z: float = v3fVec.z - this.z;

            var fLength: float = sqrt(x*x + y*y + z*z);

            if(fLength !== 0.){
                var fInvLength = 1./fLength;

                x *= fInvLength;
                y *= fInvLength;
                z *= fInvLength;
            }

            v3fDestination.x = x;
            v3fDestination.y = y;
            v3fDestination.z = z;

            return v3fDestination;
        };

        mix(v3fVec: IVec3, fA: float, v3fDestination?: IVec3): IVec3{
           if(!isDef(v3fDestination)){
                v3fDestination = this;
            }

            fA = clamp(fA,0.,1.);

            var fA1: float = 1. - fA;
            var fA2: float = fA;

            v3fDestination.x = fA1*this.x + fA2*v3fVec.x;
            v3fDestination.y = fA1*this.y + fA2*v3fVec.y;
            v3fDestination.z = fA1*this.z + fA2*v3fVec.z;

            return v3fDestination; 
        };

        inline toString(): string{
            return "[x: " + this.x + " ,y: " + this.y + ", z: " + this.z + "]";
        };

        toTranslationMatrix(m4fDestination?: IMat4): IMat4{
            if(!isDef(m4fDestination)){
                m4fDestination = new Mat4(1.);
            }
            else{
                m4fDestination.set(1.);
            }

            var pData: Float32Array = m4fDestination.data;

            pData[__14] = this.x;
            pData[__24] = this.y;
            pData[__34] = this.z;

            return m4fDestination;
        };

        vec3TransformCoord(m4fTransformation: IMat4, v3fDestination?: IVec3): IVec3{
            if(!v3fDestination){
                v3fDestination = this;
            }

            var pData: Float32Array = m4fTransformation.data;

            var x: float = this.x;
            var y: float = this.y;
            var z: float = this.z;
            var w: float;

            x = pData[__11]*x + pData[__12]*y + pData[__13]*z + pData[__14];
            y = pData[__21]*x + pData[__22]*y + pData[__23]*z + pData[__24];
            z = pData[__31]*x + pData[__32]*y + pData[__33]*z + pData[__34];
            w = pData[__31]*x + pData[__42]*y + pData[__43]*z + pData[__44];

            var fInvW: float = 1./w;

            v3fDestination.x = x*fInvW;
            v3fDestination.y = y*fInvW;
            v3fDestination.z = z*fInvW;

            return v3fDestination;
        };

        /*get xy(): Vec2  { return new Vec2(this.x, this.y); }
        get xz(): Vec2  { return new Vec2(this.x, this.z); }
        get yx(): Vec2  { return new Vec2(this.y, this.x); }
        get yz(): Vec2  { return new Vec2(this.y, this.z); }
        get zx(): Vec2  { return new Vec2(this.z, this.x); }
        get zy(): Vec2  { return new Vec2(this.z, this.y); }
        get xyz(): Vec3 { return new Vec3(this.x, this.y, this.z); }*/
    }
}

#endif