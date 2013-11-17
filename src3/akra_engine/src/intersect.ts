import math = require("math");

import Sphere = require("geometry/Sphere");
import Circle = require("geometry/Circle");
import Plane2d = require("geometry/Plane2d");
import Plane3d = require("geometry/Plane3d");
import Rect2d = require("geometry/Rect2d");
import Ray2d = require("geometry/Ray2d");
import Ray3d = require("geometry/Ray3d");

function plane2dRay2d(pPlane: AIPlane2d, pRay: AIRay2d): boolean {
    var fDistance: float = pPlane.signedDistance(pRay.point);
    var fNdotV: float = pPlane.normal.dot(pRay.normal);

    if (fDistance == 0.) {
        return true;
    }
    else {
        if (fNdotV == 0.) {
            return false;
        }
        else {
            if (fDistance / fNdotV < 0.) {
                return true;
            }
            else {
                return false;
            }
        }
    }
}

function plane3dRay3d(pPlane: AIPlane3d, pRay: AIRay3d): boolean {
    var fDistance: float = pPlane.signedDistance(pRay.point);
    var fNdotV: float = pPlane.normal.dot(pRay.normal);

    if (fDistance == 0.) {
        return true;
    }
    else {
        if (fNdotV == 0.) {
            return false;
        }
        else {
            if (fDistance / fNdotV < 0.) {
                return true;
            }
            else {
                return false;
            }
        }
    }
}

function circleRay2d(pCircle: AICircle, pRay: AIRay2d): boolean {
    var v2fCenterToPoint: AIVec2 = pRay.point.subtract(pCircle.center, vec2());

    var v2fNormal: AIVec2 = pRay.normal;

    //a*t^2+ 2b*t + c = 0;

    var fA: float = v2fNormal.lengthSquare();
    var fB: float = v2fCenterToPoint.dot(v2fNormal);
    var fC: float = v2fCenterToPoint.lengthSquare() - pCircle.radius * pCircle.radius;

    var fDiscriminant: float = fB * fB - fA * fC;/*b^2/4 - a*c*/

    if (fDiscriminant < 0.) {
        return false;
    }

    var fSqrtDiscriminant: float = math.sqrt(fDiscriminant);

    var fT1: float = (-fB + fSqrtDiscriminant) / fA;
    //var fT2: float = (-fB - fSqrtDiscriminant)/fA;
    //fT2 don't needed because fT2 < fT1 always
    //since fA > 0

    if (fT1 < 0.) {
        return false;
    }
    else {
        return true;
    }
}

function sphereRay3d(pSphere: AISphere, pRay: AIRay3d): boolean {
    var v3fCenterToPoint: AIVec3 = pRay.point.subtract(pSphere.center, vec3());

    var v3fNormal: AIVec3 = pRay.normal;

    //a*t^2+ 2b*t + c = 0;

    var fA: float = v3fNormal.lengthSquare();
    var fB: float = v3fCenterToPoint.dot(v3fNormal);
    var fC: float = v3fCenterToPoint.lengthSquare() - pSphere.radius * pSphere.radius;

    var fDiscriminant: float = fB * fB - fA * fC;/*b^2/4 - a*c*/

    if (fDiscriminant < 0.) {
        return false;
    }

    var fSqrtDiscriminant: float = math.sqrt(fDiscriminant);

    var fT1: float = (-fB + fSqrtDiscriminant) / fA;
    //var fT2: float = (-fB - fSqrtDiscriminant)/fA;
    //fT2 don't needed because fT2 < fT1 always
    //since fA > 0

    if (fT1 < 0.) {
        return false;
    }
    else {
        return true;
    }
}

function intersectRect2dRay2d(pRect: AIRect2d, pRay: AIRay2d): boolean {
    var v2fNormal: AIVec2 = pRay.normal;
    var v2fPoint: AIVec2 = pRay.point;

    var fT1: float, fT2: float;

    var fX1: float, fX2: float;
    var fY1: float, fY2: float;

    if (v2fNormal.x != 0.) {
        fT1 = (pRect.x0 - v2fPoint.x) / v2fNormal.x;
        fT2 = (pRect.x1 - v2fPoint.x) / v2fNormal.x;
    }
    else {
        fT1 = (pRect.y0 - v2fPoint.y) / v2fNormal.y;
        fT2 = (pRect.y1 - v2fPoint.y) / v2fNormal.y;
    }

    if (fT1 < 0 && fT2 < 0) {
        return false;
    }

    fT1 = math.max(fT1, 0.);
    fT2 = math.max(fT2, 0.);

    fX1 = v2fPoint.x + fT1 * v2fNormal.x;
    fX2 = v2fPoint.x + fT2 * v2fNormal.x;

    fY1 = v2fPoint.y + fT1 * v2fNormal.y;
    fY2 = v2fPoint.y + fT2 * v2fNormal.y;

    if ((fX1 < pRect.x0 && fX2 < pRect.x0)
        || (fX1 > pRect.x1 && fX2 > pRect.x1)

        || (fY1 < pRect.y0 && fY2 < pRect.y0)
        || (fY1 > pRect.y1 && fY2 > pRect.y1)) {

        return false;
    }

    return true;
}

function intersectRect3dRay3d(pRect: AIRect3d, pRay: AIRay3d): boolean {
    var v3fNormal: AIVec3 = pRay.normal;
    var v3fPoint: AIVec3 = pRay.point;

    var fT1: float, fT2: float;

    var fX1: float, fX2: float;
    var fY1: float, fY2: float;
    var fZ1: float, fZ2: float;

    if (v3fNormal.x != 0.) {
        fT1 = (pRect.x0 - v3fPoint.x) / v3fNormal.x;
        fT2 = (pRect.x1 - v3fPoint.x) / v3fNormal.x;
    }
    else if (v3fNormal.y != 0.) {
        fT1 = (pRect.y0 - v3fPoint.y) / v3fNormal.y;
        fT2 = (pRect.y1 - v3fPoint.y) / v3fNormal.y;
    }
    else {
        fT1 = (pRect.z0 - v3fPoint.z) / v3fNormal.z;
        fT2 = (pRect.z1 - v3fPoint.z) / v3fNormal.z;
    }

    if (fT1 < 0 && fT2 < 0) {
        return false;
    }

    fT1 = math.max(fT1, 0.);
    fT2 = math.max(fT2, 0.);

    fX1 = v3fPoint.x + fT1 * v3fNormal.x;
    fX2 = v3fPoint.x + fT2 * v3fNormal.x;

    fY1 = v3fPoint.y + fT1 * v3fNormal.y;
    fY2 = v3fPoint.y + fT2 * v3fNormal.y;

    fZ1 = v3fPoint.z + fT1 * v3fNormal.z;
    fZ2 = v3fPoint.z + fT2 * v3fNormal.z;

    if ((fX1 < pRect.x0 && fX2 < pRect.x0)
        || (fX1 > pRect.x1 && fX2 > pRect.x1)

        || (fY1 < pRect.y0 && fY2 < pRect.y0)
        || (fY1 > pRect.y1 && fY2 > pRect.y1)

        || (fZ1 < pRect.z0 && fZ2 < pRect.z0)
        || (fZ1 > pRect.z1 && fZ2 > pRect.z1)) {

        return false;
    }

    return true;
}

function circleCircle(pCircle1: AICircle, pCircle2: AICircle): boolean {
    var v2fCenter1: AIVec2 = pCircle1.center;
    var v2fCenter2: AIVec2 = pCircle2.center;

    var fX: float = v2fCenter2.x - v2fCenter1.x;
    var fY: float = v2fCenter2.y - v2fCenter1.y;

    var fContactRadius: float = pCircle1.radius + pCircle2.radius;

    if ((fX * fX + fY * fY) > fContactRadius * fContactRadius) {
        return false;
    }
    return true;
}

function sphereSphere(pSphere1: AISphere, pSphere2: AISphere): boolean {
    var v3fCenter1: AIVec3 = pSphere1.center;
    var v3fCenter2: AIVec3 = pSphere2.center;

    var fX: float = v3fCenter2.x - v3fCenter1.x;
    var fY: float = v3fCenter2.y - v3fCenter1.y;
    var fZ: float = v3fCenter2.z - v3fCenter1.z;

    var fContactRadius: float = pSphere1.radius + pSphere2.radius;

    if ((fX * fX + fY * fY + fZ * fZ) > fContactRadius * fContactRadius) {
        return false;
    }
    return true;
}

function intersectRect2dCircle(pRect: AIRect2d, pCircle: AICircle) {
    var v2fCenter: AIVec2 = pCircle.center;
    var fOffsetX: float = 0., fOffsetY: float = 0.;
    var nInside: uint = 0;

    if (v2fCenter.x < pRect.x0) {
        fOffsetX = pRect.x0 - v2fCenter.x;
    }
    else if (v2fCenter.x > pRect.x1) {
        fOffsetX = v2fCenter.x - pRect.x1;
    }
    else {
        nInside++;
    }

    if (v2fCenter.y < pRect.y0) {
        fOffsetY = pRect.y0 - v2fCenter.y;
    }
    else if (v2fCenter.y > pRect.y1) {
        fOffsetY = v2fCenter.y - pRect.y1;
    }
    else {
        nInside++;
    }

    //if nInside == 2 then circle inside rect
    if (nInside === 2) {
        return true;
    }

    var fOffsetLengthSquare: float = fOffsetX * fOffsetX + fOffsetY * fOffsetY;
    var fRadius: float = pCircle.radius;

    if (fOffsetLengthSquare > fRadius * fRadius) {
        return false;
    }
    return true;
}

function intersectRect3dSphere(pRect: AIRect3d, pSphere: AISphere) {
    var v3fCenter: AIVec3 = pSphere.center;
    var fOffsetX: float = 0., fOffsetY: float = 0., fOffsetZ: float = 0.;
    var nInside: uint = 0;

    if (v3fCenter.x < pRect.x0) {
        fOffsetX = pRect.x0 - v3fCenter.x;
    }
    else if (v3fCenter.x > pRect.x1) {
        fOffsetX = v3fCenter.x - pRect.x1;
    }
    else {
        nInside++;
    }

    if (v3fCenter.y < pRect.y0) {
        fOffsetY = pRect.y0 - v3fCenter.y;
    }
    else if (v3fCenter.y > pRect.y1) {
        fOffsetY = v3fCenter.y - pRect.y1;
    }
    else {
        nInside++;
    }

    if (v3fCenter.z < pRect.z0) {
        fOffsetZ = pRect.z0 - v3fCenter.z;
    }
    else if (v3fCenter.z > pRect.z1) {
        fOffsetZ = v3fCenter.z - pRect.z1;
    }
    else {
        nInside++;
    }

    //if nInside == 3 then sphere inside rect
    if (nInside === 3) {
        return true;
    }

    var fOffsetLengthSquare: float = fOffsetX * fOffsetX + fOffsetY * fOffsetY + fOffsetZ * fOffsetZ;
    var fRadius: float = pSphere.radius;

    if (fOffsetLengthSquare > fRadius * fRadius) {
        return false;
    }
    return true;
}

function intersectRect2dRect2d(pRect1: AIRect2d, pRect2: AIRect2d, pResult?: AIRect2d): boolean {
    if (!isDef(pResult)) {
        var fX0: float = math.max(pRect1.x0, pRect2.x0);
        var fX1: float = math.min(pRect1.x1, pRect2.x1);
        if (fX0 <= fX1) {
            var fY0: float = math.max(pRect1.y0, pRect2.y0);
            var fY1: float = math.min(pRect1.y1, pRect2.y1);
            if (fY0 <= fY1) {
                return true;
            }
        }
        return false;
    }
    else {
        pResult.x0 = math.max(pRect1.x0, pRect2.x0);
        pResult.x1 = math.min(pRect1.x1, pRect2.x1);

        pResult.y0 = math.max(pRect1.y0, pRect2.y0);
        pResult.y1 = math.min(pRect1.y1, pRect2.y1);

        return pResult.isValid();
    }
}

function intersectRect3dRect3d(pRect1: AIRect3d, pRect2: AIRect3d, pResult?: AIRect3d): boolean {
    if (!isDef(pResult)) {
        var fX0: float = math.max(pRect1.x0, pRect2.x0);
        var fX1: float = math.min(pRect1.x1, pRect2.x1);
        if (fX0 <= fX1) {
            var fY0: float = math.max(pRect1.y0, pRect2.y0);
            var fY1: float = math.min(pRect1.y1, pRect2.y1);
            if (fY0 <= fY1) {
                var fZ0: float = math.max(pRect1.z0, pRect2.z0);
                var fZ1: float = math.min(pRect1.z1, pRect2.z1);
                if (fZ0 <= fZ1) {
                    return true;
                }
            }
        }
        return false;
    }
    else {
        pResult.x0 = math.max(pRect1.x0, pRect2.x0);
        pResult.x1 = math.min(pRect1.x1, pRect2.x1);

        pResult.y0 = math.max(pRect1.y0, pRect2.y0);
        pResult.y1 = math.min(pRect1.y1, pRect2.y1);

        pResult.z0 = math.max(pRect1.z0, pRect2.z0);
        pResult.z1 = math.min(pRect1.z1, pRect2.z1);

        return pResult.isValid();
    }
}

function intersect(pPlane: AIPlane2d, pRay: AIRay2d): boolean;
function intersect(pPlane: AIPlane3d, pRay: AIRay3d): boolean;
function intersect(pCircle: AICircle, pRay: AIRay2d): boolean;
function intersect(pSphere: AISphere, pRay: AIRay3d): boolean;
function intersect(pRect: AIRect2d, pRay: AIRay2d): boolean;
function intersect(pRect: AIRect3d, pRay: AIRay3d): boolean;
function intersect(pCircle1: AICircle, pCircle2: AICircle): boolean;
function intersect(pSphere1: AISphere, pSphere2: AISphere): boolean;
function intersect(pRect: AIRect2d, pCircle: AICircle): boolean;
function intersect(pRect: AIRect3d, pSphere: AISphere): boolean;
function intersect(pRect1: AIRect2d, pRect2: AIRect2d, pResult?: AIRect2d): boolean;
function intersect(pRect1: AIRect3d, pRect2: AIRect3d, pResult?: AIRect3d): boolean;
function intersect(pRect1?, pRect2?, pResult?): boolean {
    var nArgumentsLength: uint = arguments.length;

    if (nArgumentsLength === 3) {
        if (arguments[2] instanceof Rect2d) {
            return intersectRect2dRect2d(arguments[0], arguments[1], arguments[2]);
        }
        else {
            return intersectRect3dRect3d(arguments[0], arguments[1], arguments[2]);
        }
    }
    else {
        var pArg0: any = arguments[0];
        var pArg1: any = arguments[1];

        if (pArg1 instanceof Ray2d) {
            if (pArg0 instanceof Plane2d) {
                return plane2dRay2d(pArg0, pArg1);
            }
            else if (pArg0 instanceof Circle) {
                return circleRay2d(pArg0, pArg1);
            }
            else {
                return intersectRect2dRay2d(pArg0, pArg1);
            }
        }
        else if (pArg1 instanceof Ray3d) {
            if (pArg0 instanceof Plane3d) {
                return plane3dRay3d(pArg0, pArg1);
            }
            else if (pArg0 instanceof Sphere) {
                return sphereRay3d(pArg0, pArg1);
            }
            else {
                return intersectRect3dRay3d(pArg0, pArg1);
            }
        }
        else if (pArg1 instanceof Circle) {
            if (pArg0 instanceof Circle) {
                return circleCircle(pArg0, pArg1);
            }
            else {
                return intersectRect2dCircle(pArg0, pArg1);
            }
        }
        else if (pArg1 instanceof Sphere) {
            if (pArg0 instanceof Sphere) {
                return sphereSphere(pArg0, pArg1);
            }
            else {
                return intersectRect3dSphere(pArg0, pArg1);
            }
        }
        else {
            if (pArg0 instanceof Rect2d) {
                return intersectRect2dRect2d(pArg0, pArg1);
            }
            else {
                return intersectRect3dRect3d(pArg0, pArg1);
            }
        }
    }
}
