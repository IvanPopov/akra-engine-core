/// <reference path="../idl/AISphere.ts" />

import math = require("math");
import Vec3 = math.Vec3;
import Vec4 = math.Vec4;
import Quat4 = math.Quat4;
import Mat3 = math.Mat3;
import Circle = require("geometry/Circle");

class Sphere implements AISphere {
    center: AIVec3;
    radius: float;

    constructor();
    constructor(pSphere: AISphere);
    constructor(v3fCenter: AIVec3, fRadius: float);
    constructor(fCenterX: float, fCenterY: float, fCenterZ: float, fRadius: float);
    constructor(fCenterX?, fCenterY?, fCenterZ?, fRadius?){
        var nArgumentsLength: uint = arguments.length;

        switch (nArgumentsLength) {
            case 1:
                var pSphere = arguments[0];

                this.center = new Vec3(pSphere.v3fCenter);
                this.radius = pSphere.fRadius;
                break;
            case 2:
                var v3fCenter: AIVec3 = arguments[0];
                var fRadius: float = arguments[1];

                this.center = new Vec3(v3fCenter);
                this.radius = fRadius;
                break;
            case 4:
                this.center = new Vec3(arguments[0], arguments[1], arguments[2]);
                this.radius = arguments[3];
                break;
            default:
                this.center = new Vec3();
                this.radius = 0.;
                break;
        }
		}

    get circle(): AICircle{
        var v3fCenter: AIVec3 = this.center;
        return new Circle(v3fCenter.x, v3fCenter.y, this.radius);
		}
    set circle(pCircle: AICircle){
        var v3fCenter: AIVec3 = this.center;
        var v2fCircleCenter: AIVec2 = pCircle.center;
        v3fCenter.x = v2fCircleCenter.x;
        v3fCenter.y = v2fCircleCenter.y;
        this.radius = pCircle.radius;
		}

    get z(): float{
        return this.center.z;
		}
    set z(fZ: float){
        this.center.z = fZ;
		}

    set(): AISphere;
    set(pSphere: AISphere): AISphere;
    set(v3fCenter: AIVec3, fRadius: float): AISphere;
    set(fCenterX: float, fCenterY: float, fCenterZ: float, fRadius: float): AISphere;
    set(fCenterX?, fCenterY?, fCenterZ?, fRadius?): AISphere{
        var nArgumentsLength: uint = arguments.length;

        switch (nArgumentsLength) {
            case 1:
                var pSphere = arguments[0];

                this.center.set(pSphere.center);
                this.radius = pSphere.radius;
                break;
            case 2:
                var v3fCenter: AIVec3 = arguments[0];
                var fRadius: float = arguments[1];

                this.center.set(v3fCenter);
                this.radius = fRadius;
                break;
            case 4:
                this.center.set(arguments[0], arguments[1], arguments[2]);
                this.radius = arguments[3];
                break;
            default:
                this.center.set(0.);
                this.radius = 0.;
                break;
        }

        return this;
		}

    /** inline */ clear(): AISphere{
        this.center.clear();
        this.radius = 0.;

        return this;
		}

    /** inline */ isEqual(pSphere: AISphere): boolean{
        return this.center.isEqual(pSphere.center) && (this.radius == pSphere.radius);
		}

    /** inline */ isClear(): boolean{
        return this.center.isClear() && (this.radius === 0.);	
		}

    /** inline */ isValid(): boolean{
        return (this.radius >= 0.);
		}

    /** inline */ offset(v3fOffset: AIVec3): AISphere{
        this.center.add(v3fOffset);
        return this;
		}

    /** inline */ expand(fInc: float): AISphere{
        this.radius += fInc;
        return this;
		}

    /** inline */ normalize(): AISphere{
        this.radius = math.abs(this.radius);
        return this;
		}

    transform(m4fMatrix: AIMat4): AISphere {
        var v4fTmp: AIVec4 = Vec4.temp(this.center, 1.);
        v4fTmp = m4fMatrix.multiplyVec4(v4fTmp);
        
        this.center.set(v4fTmp.xyz);

        var m3fTmp: AIMat3 = m4fMatrix.toMat3(Mat3.temp());
        var v3fScale: AIVec3 = vec3();

        m3fTmp.decompose(Quat4.temp(), v3fScale);

        var fScaleX: float = math.abs(v3fScale.x);
        var fScaleY: float = math.abs(v3fScale.y);
        var fScaleZ: float = math.abs(v3fScale.z);

        var fMaxScale: float;

        if (fScaleX >= fScaleY && fScaleX >= fScaleZ) {
            fMaxScale = fScaleX;
        }
        else if (fScaleY >= fScaleX && fScaleY >= fScaleZ) {
            fMaxScale = fScaleY;
        }
        else {
            fMaxScale = fScaleZ;
        }

        this.radius *= fMaxScale;

        return this;
    }
}


export = Sphere;