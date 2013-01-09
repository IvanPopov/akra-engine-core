#ifndef VEC4_TS
#define VEC4_TS

#include "IVec2.ts"
#include "IVec3.ts"

module akra.math {

    export class Vec4 implements IVec4{
        x: float;
        y: float;
        z: float;
        w: float;

        #include "VectorsGettersSetters/Vec4GettersSetters.ts"

        constructor();
        constructor(fValue: float);
        constructor(v4fVec: IVec4);
        constructor(pArray: float[]);
        constructor(fValue: float, v3fVec: IVec3);
        constructor(v2fVec1: IVec2, v2fVec2: IVec2);
        constructor(v3fVec: IVec3, fValue: float);
        constructor(fValue1: float, fValue2: float, v2fVec: IVec2);
        constructor(fValue1: float, v2fVec: IVec2, fValue2: float);
        constructor(v2fVec: IVec2 ,fValue1: float, fValue2: float);
        constructor(fValue1: float, fValue2: float, fValue3: float, fValue4: float);
        constructor(fValue1?, fValue2?, fValue3?, fValue4?){
            var nArgumentsLength: uint = arguments.length;
            var v4fVec: IVec4 = this;

            // if (<any>this === window || <any>this === akra || <any>this === akra.math) {
            //     v4fVec = Vec4.stack[Vec4.stackPosition ++];

            //     if(Vec4.stackPosition == Vec4.stackSize){
            //         Vec4.stackPosition = 0;
            //     }
            // }

            switch(nArgumentsLength) {
                case 1:
                    v4fVec.set(arguments[0]); 
                    break;
                case 2:
                    v4fVec.set(arguments[0],arguments[1]); 
                    break;
                case 3:
                    v4fVec.set(arguments[0],arguments[1], arguments[2]); 
                    break;
                case 4:
                    v4fVec.set(arguments[0],arguments[1], arguments[2], arguments[3]); 
                    break;
                default: 
                    v4fVec.x = v4fVec.y = v4fVec.z = v4fVec.w = 0.;
                    break;
            }
        };

        set(): IVec4;
        set(fValue: float): IVec4;
        set(v4fVec: IVec4): IVec4;
        set(pArray: float[]): IVec4;
        set(fValue: float, v3fVec: IVec3): IVec4;
        set(v2fVec1: IVec2, v2fVec2: IVec2): IVec4;
        set(v3fVec: IVec3, fValue: float): IVec4;
        set(fValue1: float, fValue2: float, v2fVec: IVec2): IVec4;
        set(fValue1: float, v2fVec: IVec2, fValue2: float): IVec4;
        set(v2fVec: IVec2, fValue1: float, fValue2: float): IVec4;
        set(fValue1: float, fValue2: float, fValue3: float, fValue4: float): IVec4;
        set(fValue1?, fValue2?, fValue3?, fValue4?): IVec4{
            var nArgumentsLength: uint = arguments.length;

            switch(nArgumentsLength){
                case 0:
                    this.x = this.y = this.z = this.w = 0.;
                    break;
                case 1:
                    if(isFloat(arguments[0])){
                        this.x = this.y = this.z = this.w = arguments[0];
                    }
                    else if(arguments[0] instanceof Vec4){
                        var v4fVec: IVec4 = arguments[0];

                        this.x = v4fVec.x;
                        this.y = v4fVec.y;
                        this.z = v4fVec.z;
                        this.w = v4fVec.w;
                    }
                    else{
                        //array
                        var pArray: float[] = arguments[0];

                        this.x = pArray[0];
                        this.y = pArray[1];
                        this.z = pArray[2];
                        this.w = pArray[3];
                    }
                    break;
                case 2:
                    if(isFloat(arguments[0])){
                        var fValue: float = arguments[0];
                        var v3fVec: IVec3 = arguments[1];

                        this.x = fValue;
                        this.y = v3fVec.x;
                        this.z = v3fVec.y;
                        this.w = v3fVec.z;
                    }
                    else if(arguments[0] instanceof Vec2){
                        var v2fVec1: IVec2 = arguments[0];
                        var v2fVec2: IVec2 = arguments[1];

                        this.x = v2fVec1.x;
                        this.y = v2fVec1.y;
                        this.z = v2fVec2.x;
                        this.w = v2fVec2.y;
                    }
                    else{
                        var v3fVec: IVec3 = arguments[0];
                        var fValue: float = arguments[1];

                        this.x = v3fVec.x;
                        this.y = v3fVec.y;
                        this.z = v3fVec.z;
                        this.w = fValue;
                    }
                    break;
                case 3:
                    if(isFloat(arguments[0])){
                        var fValue1: float = arguments[0];

                        if(isFloat(arguments[1])){
                            var fValue2: float = arguments[1];
                            var v2fVec: IVec2 = arguments[2];

                            this.x = fValue1;
                            this.y = fValue2;
                            this.z = v2fVec.x;
                            this.w = v2fVec.y;
                        }
                        else{
                            var v2fVec: IVec2 = arguments[1];
                            var fValue2: float = arguments[2];

                            this.x = fValue1;
                            this.y = v2fVec.x;
                            this.z = v2fVec.y;
                            this.w = fValue2;
                        }
                    }
                    else{
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
        };

        inline clear(): IVec4{
            this.x = this.y = this.z = this.w = 0.;
            return this;
        };

        add(v4fVec: IVec4, v4fDestination?: IVec4): IVec4{
            if(!isDef(v4fDestination)){
                v4fDestination = this;
            }

            v4fDestination.x = this.x + v4fVec.x;
            v4fDestination.y = this.y + v4fVec.y;
            v4fDestination.z = this.z + v4fVec.z;
            v4fDestination.w = this.w + v4fVec.w;

            return v4fDestination;
        };

        subtract(v4fVec: IVec4, v4fDestination?: IVec4): IVec4{
            if(!isDef(v4fDestination)){
                v4fDestination = this;
            }

            v4fDestination.x = this.x - v4fVec.x;
            v4fDestination.y = this.y - v4fVec.y;
            v4fDestination.z = this.z - v4fVec.z;
            v4fDestination.w = this.w - v4fVec.w;

            return v4fDestination;
        };

        inline dot(v4fVec: IVec4): float{
            return this.x*v4fVec.x + this.y*v4fVec.y + this.z*v4fVec.z + this.w*v4fVec.w;
        };

        isEqual(v4fVec: IVec4, fEps: float = 0.): bool{
            if(fEps === 0.){
                if(    this.x != v4fVec.x 
                    || this.y != v4fVec.y
                    || this.z != v4fVec.z
                    || this.w != v4fVec.w){

                    return false;
                }
            }
            else{
                if(    abs(this.x - v4fVec.x) > fEps
                    || abs(this.y - v4fVec.y) > fEps
                    || abs(this.z - v4fVec.z) > fEps
                    || abs(this.w - v4fVec.w) > fEps){

                    return false;
                }
            }
            return true;
        };

        isClear(fEps: float = 0.): bool{

            if(fEps === 0.){
                if(    this.x != 0. 
                    || this.y != 0.
                    || this.z != 0.
                    || this.w != 0.){

                    return false;
                }
            }
            else{
                if(    abs(this.x) > fEps
                    || abs(this.y) > fEps
                    || abs(this.z) > fEps
                    || abs(this.w) > fEps){

                    return false;
                }
            }
            return true;
        };

        negate(v4fDestination?: IVec4): IVec4{
            if(!isDef(v4fDestination)){
                v4fDestination = this;
            }

            v4fDestination.x = -this.x;
            v4fDestination.y = -this.y;
            v4fDestination.z = -this.z;
            v4fDestination.w = -this.w;

            return v4fDestination;
        };

        scale(fScale: float, v4fDestination?: IVec4): IVec4{
            if(!isDef(v4fDestination)){
                v4fDestination = this;
            }

            v4fDestination.x = this.x*fScale;
            v4fDestination.y = this.y*fScale;
            v4fDestination.z = this.z*fScale;
            v4fDestination.w = this.w*fScale;

            return v4fDestination;
        };

        normalize(v4fDestination?: IVec4): IVec4{
            if(!isDef(v4fDestination)){
                v4fDestination = this;
            }

            var x: float = this.x, y: float = this.y, z: float = this.z, w: float = this.w;
            var fLength: float = sqrt(x*x + y*y +z*z + w*w);

            if(fLength !== 0.){
                var fInvLength: float = 1./fLength;

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
        };

        inline length(): float{
            var x: float = this.x, y: float = this.y, z: float = this.z, w: float = this.w;
            return sqrt(x*x + y*y + z*z + w*w);
        };

        inline lengthSquare(): float{
            var x: float = this.x, y: float = this.y, z: float = this.z, w: float = this.w;
            return x*x + y*y + z*z + w*w;    
        };

        direction(v4fVec: IVec4, v4fDestination?: IVec4): IVec4{
            if(!isDef(v4fDestination)){
                v4fDestination = this;
            }

            var x: float = v4fVec.x - this.x;
            var y: float = v4fVec.y - this.y;
            var z: float = v4fVec.z - this.z;
            var w: float = v4fVec.w - this.w;

            var fLength: float = sqrt(x*x + y*y + z*z + w*w);

            if(fLength !== 0.){
                var fInvLength = 1./fLength;

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
        };

        mix(v4fVec: IVec4, fA: float, v4fDestination?: IVec4): IVec4{
            if(!isDef(v4fDestination)){
                v4fDestination = this;
            }

            fA = clamp(fA,0.,1.);

            var fA1: float = 1. - fA;
            var fA2: float = fA;

            v4fDestination.x = fA1*this.x + fA2*v4fVec.x;
            v4fDestination.y = fA1*this.y + fA2*v4fVec.y;
            v4fDestination.z = fA1*this.z + fA2*v4fVec.z;
            v4fDestination.w = fA1*this.w + fA2*v4fVec.w;

            return v4fDestination;
        };

        inline toString(): string{
            return "[x: " + this.x + ", y: " + this.y 
                        + ", z: " + this.z + ", w: " + this.w + "]";
        };

        ALLOCATE_STORAGE(Vec4,100)

    }
}

#endif