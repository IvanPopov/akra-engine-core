/// <reference path="../idl/AEVolumeClassifications.ts" />
/// <reference path="../idl/AEPlaneClassifications.ts" />

import Sphere = require("geometry/Sphere");
import Circle = require("geometry/Circle");
import Plane2d = require("geometry/Plane2d");

export function planeCircle(pPlane: AIPlane2d, pCircle: AICircle): AEPlaneClassifications {
    var fDistance: float = pPlane.signedDistance(pCircle.center);
    var fRadius: float = pCircle.radius;

    if (fDistance > fRadius) {
        return AEPlaneClassifications.PLANE_FRONT;
    }
    else if (fDistance < -fRadius) {
        return AEPlaneClassifications.PLANE_BACK;
    }
    else {
        return AEPlaneClassifications.PLANE_INTERSECT;
    }
}

export function planeSphere(pPlane: AIPlane3d, pSphere: AISphere): AEPlaneClassifications {
    var fDistance: float = pPlane.signedDistance(pSphere.center);
    var fRadius: float = pSphere.radius;

    if (fDistance > fRadius) {
        return AEPlaneClassifications.PLANE_FRONT;
    }
    else if (fDistance < -fRadius) {
        return AEPlaneClassifications.PLANE_BACK;
    }
    else {
        return AEPlaneClassifications.PLANE_INTERSECT;
    }
}

export function planeRect2d(pPlane: AIPlane2d, pRect: AIRect2d): AEPlaneClassifications {
    var v2fMinPoint: AIVec2 = vec2();
    var v2fMaxPoint: AIVec2 = vec2();

    var v2fNormal: AIVec2 = pPlane.normal;

    if (v2fNormal.x > 0.) {
        v2fMinPoint.x = pRect.x0;
        v2fMaxPoint.x = pRect.x1;
    }
    else {
        v2fMinPoint.x = pRect.x1;
        v2fMaxPoint.x = pRect.x0;
    }

    if (v2fNormal.y > 0.) {
        v2fMinPoint.y = pRect.y0;
        v2fMaxPoint.y = pRect.y1;
    }
    else {
        v2fMinPoint.y = pRect.y1;
        v2fMaxPoint.y = pRect.y0;
    }

    var fMinDistance: float = pPlane.signedDistance(v2fMinPoint);
    var fMaxDistance: float = pPlane.signedDistance(v2fMaxPoint);

    if (fMinDistance * fMaxDistance <= 0.) {
        return AEPlaneClassifications.PLANE_INTERSECT;
    }
    else if (fMaxDistance < 0.) {
        return AEPlaneClassifications.PLANE_BACK;
    }
    else {
        return AEPlaneClassifications.PLANE_FRONT;
    }
}

export function planeRect3d(pPlane: AIPlane3d, pRect: AIRect3d): AEPlaneClassifications {
    var v3fMinPoint: AIVec3 = vec3();
    var v3fMaxPoint: AIVec3 = vec3();

    var v3fNormal: AIVec3 = pPlane.normal;

    if (v3fNormal.x > 0.) {
        v3fMinPoint.x = pRect.x0;
        v3fMaxPoint.x = pRect.x1;
    }
    else {
        v3fMinPoint.x = pRect.x1;
        v3fMaxPoint.x = pRect.x0;
    }

    if (v3fNormal.y > 0.) {
        v3fMinPoint.y = pRect.y0;
        v3fMaxPoint.y = pRect.y1;
    }
    else {
        v3fMinPoint.y = pRect.y1;
        v3fMaxPoint.y = pRect.y0;
    }

    if (v3fNormal.z > 0.) {
        v3fMinPoint.z = pRect.z0;
        v3fMaxPoint.z = pRect.z1;
    }
    else {
        v3fMinPoint.z = pRect.z1;
        v3fMaxPoint.z = pRect.z0;
    }

    var fMinDistance: float = pPlane.signedDistance(v3fMinPoint);
    var fMaxDistance: float = pPlane.signedDistance(v3fMaxPoint);

    if (fMinDistance * fMaxDistance <= 0.) {
        return AEPlaneClassifications.PLANE_INTERSECT;
    }
    else if (fMaxDistance <= 0.) {
        return AEPlaneClassifications.PLANE_BACK;
    }
    else {
        return AEPlaneClassifications.PLANE_FRONT;
    }
}

export function plane(pPlane: AIPlane2d, pCircle: AICircle): AEPlaneClassifications;
export function plane(pPlane: AIPlane3d, pSphere: AISphere): AEPlaneClassifications;
export function plane(pPlane: AIPlane2d, pRect: AIRect2d): AEPlaneClassifications;
export function plane(pPlane: AIPlane3d, pRect: AIRect3d): AEPlaneClassifications;
export function plane(pPlane?, pRect?): AEPlaneClassifications {
    var pArg0: any = arguments[0];
    var pArg1: any = arguments[1];

    if (pArg0 instanceof Plane2d) {
        if (pArg1 instanceof Circle) {
            return planeCircle(pArg0, pArg1);
        }
        else {
            return planeRect2d(pArg0, pArg1);
        }
    }
    else {
        if (pArg1 instanceof Sphere) {
            return planeSphere(pArg0, pArg1);
        }
        else {
            return planeRect3d(pArg0, pArg1);
        }
    }
}

export function classifyRect2d(pRectA: AIRect2d, pRectB: AIRect2d): AEVolumeClassifications {
    var fRectAX0: float = pRectA.x0, fRectAX1: float = pRectA.x1;
    var fRectAY0: float = pRectA.y0, fRectAY1: float = pRectA.y1;

    var fRectBX0: float = pRectB.x0, fRectBX1: float = pRectB.x1;
    var fRectBY0: float = pRectB.y0, fRectBY1: float = pRectB.y1;

    if ((fRectAX1 < fRectBX0 || fRectBX1 < fRectAX0)
        || (fRectAY1 < fRectBY0 || fRectAY1 < fRectBY0)) {

        return AEVolumeClassifications.NO_RELATION;
    }

    if ((fRectAX0 == fRectBX0 && fRectAX1 == fRectBX1)
        && (fRectAY0 == fRectBY0 && fRectAY1 == fRectBY1)) {

        return AEVolumeClassifications.EQUAL;
    }

    if ((fRectAX0 <= fRectBX0 && fRectBX1 <= fRectAX1)
        && (fRectAY0 <= fRectBY0 && fRectBY1 <= fRectAY1)) {

        return AEVolumeClassifications.A_CONTAINS_B;
    }

    if ((fRectBX0 <= fRectAX0 && fRectAX1 <= fRectBX1)
        && (fRectBY0 <= fRectAY0 && fRectAY1 <= fRectBY1)) {

        return AEVolumeClassifications.B_CONTAINS_A;
    }

    return AEVolumeClassifications.INTERSECTING;
}

export function classifyRect3d(pRectA: AIRect3d, pRectB: AIRect3d): AEVolumeClassifications {
    var fRectAX0: float = pRectA.x0, fRectAX1: float = pRectA.x1;
    var fRectAY0: float = pRectA.y0, fRectAY1: float = pRectA.y1;
    var fRectAZ0: float = pRectA.z0, fRectAZ1: float = pRectA.z1;

    var fRectBX0: float = pRectB.x0, fRectBX1: float = pRectB.x1;
    var fRectBY0: float = pRectB.y0, fRectBY1: float = pRectB.y1;
    var fRectBZ0: float = pRectB.z0, fRectBZ1: float = pRectB.z1;

    if ((fRectAX1 < fRectBX0 || fRectBX1 < fRectAX0)
        || (fRectAY1 < fRectBY0 || fRectAY1 < fRectBY0)
        || (fRectAZ1 < fRectBZ0 || fRectAZ1 < fRectBZ0)) {

        return AEVolumeClassifications.NO_RELATION;
    }

    if ((fRectAX0 == fRectBX0 && fRectAX1 == fRectBX1)
        && (fRectAY0 == fRectBY0 && fRectAY1 == fRectBY1)
        && (fRectAZ0 == fRectBZ0 && fRectAZ1 == fRectBZ1)) {

        return AEVolumeClassifications.EQUAL;
    }

    if ((fRectAX0 <= fRectBX0 && fRectBX1 <= fRectAX1)
        && (fRectAY0 <= fRectBY0 && fRectBY1 <= fRectAY1)
        && (fRectAZ0 <= fRectBZ0 && fRectBZ1 <= fRectAZ1)) {

        return AEVolumeClassifications.A_CONTAINS_B;
    }

    if ((fRectBX0 <= fRectAX0 && fRectAX1 <= fRectBX1)
        && (fRectBY0 <= fRectAY0 && fRectAY1 <= fRectBY1)
        && (fRectBZ0 <= fRectAZ0 && fRectAZ1 <= fRectBZ1)) {

        return AEVolumeClassifications.B_CONTAINS_A;
    }

    return AEVolumeClassifications.INTERSECTING;
}

export function frustumRect3d(pFrustum: AIFrustum, pRect: AIRect3d): AEVolumeClassifications {
    var kClassification: AEPlaneClassifications;
    var isIntersect: boolean = false;

    kClassification = planeRect3d(pFrustum.leftPlane, pRect);
    if (kClassification == AEPlaneClassifications.PLANE_FRONT) {
        return AEVolumeClassifications.NO_RELATION;
    }
    else if (kClassification == AEPlaneClassifications.PLANE_INTERSECT) {
        isIntersect = true;
    }

    kClassification = planeRect3d(pFrustum.rightPlane, pRect);
    if (kClassification == AEPlaneClassifications.PLANE_FRONT) {
        return AEVolumeClassifications.NO_RELATION;
    }
    else if (kClassification == AEPlaneClassifications.PLANE_INTERSECT) {
        isIntersect = true;
    }

    kClassification = planeRect3d(pFrustum.topPlane, pRect);
    if (kClassification == AEPlaneClassifications.PLANE_FRONT) {
        return AEVolumeClassifications.NO_RELATION;
    }
    else if (kClassification == AEPlaneClassifications.PLANE_INTERSECT) {
        isIntersect = true;
    }

    kClassification = planeRect3d(pFrustum.bottomPlane, pRect);
    if (kClassification == AEPlaneClassifications.PLANE_FRONT) {
        return AEVolumeClassifications.NO_RELATION;
    }
    else if (kClassification == AEPlaneClassifications.PLANE_INTERSECT) {
        isIntersect = true;
    }

    kClassification = planeRect3d(pFrustum.nearPlane, pRect);
    if (kClassification == AEPlaneClassifications.PLANE_FRONT) {
        return AEVolumeClassifications.NO_RELATION;
    }
    else if (kClassification == AEPlaneClassifications.PLANE_INTERSECT) {
        isIntersect = true;
    }

    kClassification = planeRect3d(pFrustum.farPlane, pRect);
    if (kClassification == AEPlaneClassifications.PLANE_FRONT) {
        return AEVolumeClassifications.NO_RELATION;
    }
    else if (kClassification == AEPlaneClassifications.PLANE_INTERSECT) {
        isIntersect = true;
    }

    if (isIntersect) {
        return AEVolumeClassifications.INTERSECTING;
    }
    else {
        return AEVolumeClassifications.A_CONTAINS_B;
    }
}

