/// <reference path="../../idl/EVolumeClassifications.ts" />
/// <reference path="../../idl/EPlaneClassifications.ts" />
/// <reference path="../geometry.ts" />

module akra.geometry.classify {

    export function planeCircle(pPlane: IPlane2d, pCircle: ICircle): EPlaneClassifications {
        var fDistance: float = pPlane.signedDistance(pCircle.center);
        var fRadius: float = pCircle.radius;

        if (fDistance > fRadius) {
            return EPlaneClassifications.PLANE_FRONT;
        }
        else if (fDistance < -fRadius) {
            return EPlaneClassifications.PLANE_BACK;
        }
        else {
            return EPlaneClassifications.PLANE_INTERSECT;
        }
    }

    export function planeSphere(pPlane: IPlane3d, pSphere: ISphere): EPlaneClassifications {
        var fDistance: float = pPlane.signedDistance(pSphere.center);
        var fRadius: float = pSphere.radius;

        if (fDistance > fRadius) {
            return EPlaneClassifications.PLANE_FRONT;
        }
        else if (fDistance < -fRadius) {
            return EPlaneClassifications.PLANE_BACK;
        }
        else {
            return EPlaneClassifications.PLANE_INTERSECT;
        }
    }

    export function planeRect2d(pPlane: IPlane2d, pRect: IRect2d): EPlaneClassifications {
        var v2fMinPoint: IVec2 = vec2();
        var v2fMaxPoint: IVec2 = vec2();

        var v2fNormal: IVec2 = pPlane.normal;

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
            return EPlaneClassifications.PLANE_INTERSECT;
        }
        else if (fMaxDistance < 0.) {
            return EPlaneClassifications.PLANE_BACK;
        }
        else {
            return EPlaneClassifications.PLANE_FRONT;
        }
    }

    export function planeRect3d(pPlane: IPlane3d, pRect: IRect3d): EPlaneClassifications {
        var v3fMinPoint: IVec3 = vec3();
        var v3fMaxPoint: IVec3 = vec3();

        var v3fNormal: IVec3 = pPlane.normal;

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
            return EPlaneClassifications.PLANE_INTERSECT;
        }
        else if (fMaxDistance <= 0.) {
            return EPlaneClassifications.PLANE_BACK;
        }
        else {
            return EPlaneClassifications.PLANE_FRONT;
        }
    }

    export function plane(pPlane: IPlane2d, pCircle: ICircle): EPlaneClassifications;
    export function plane(pPlane: IPlane3d, pSphere: ISphere): EPlaneClassifications;
    export function plane(pPlane: IPlane2d, pRect: IRect2d): EPlaneClassifications;
    export function plane(pPlane: IPlane3d, pRect: IRect3d): EPlaneClassifications;
    export function plane(pPlane?, pRect?): EPlaneClassifications {
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

    export function classifyRect2d(pRectA: IRect2d, pRectB: IRect2d): EVolumeClassifications {
        var fRectAX0: float = pRectA.x0, fRectAX1: float = pRectA.x1;
        var fRectAY0: float = pRectA.y0, fRectAY1: float = pRectA.y1;

        var fRectBX0: float = pRectB.x0, fRectBX1: float = pRectB.x1;
        var fRectBY0: float = pRectB.y0, fRectBY1: float = pRectB.y1;

        if ((fRectAX1 < fRectBX0 || fRectBX1 < fRectAX0)
            || (fRectAY1 < fRectBY0 || fRectAY1 < fRectBY0)) {

            return EVolumeClassifications.NO_RELATION;
        }

        if ((fRectAX0 == fRectBX0 && fRectAX1 == fRectBX1)
            && (fRectAY0 == fRectBY0 && fRectAY1 == fRectBY1)) {

            return EVolumeClassifications.EQUAL;
        }

        if ((fRectAX0 <= fRectBX0 && fRectBX1 <= fRectAX1)
            && (fRectAY0 <= fRectBY0 && fRectBY1 <= fRectAY1)) {

            return EVolumeClassifications.A_CONTAINS_B;
        }

        if ((fRectBX0 <= fRectAX0 && fRectAX1 <= fRectBX1)
            && (fRectBY0 <= fRectAY0 && fRectAY1 <= fRectBY1)) {

            return EVolumeClassifications.B_CONTAINS_A;
        }

        return EVolumeClassifications.INTERSECTING;
    }

    export function classifyRect3d(pRectA: IRect3d, pRectB: IRect3d): EVolumeClassifications {
        var fRectAX0: float = pRectA.x0, fRectAX1: float = pRectA.x1;
        var fRectAY0: float = pRectA.y0, fRectAY1: float = pRectA.y1;
        var fRectAZ0: float = pRectA.z0, fRectAZ1: float = pRectA.z1;

        var fRectBX0: float = pRectB.x0, fRectBX1: float = pRectB.x1;
        var fRectBY0: float = pRectB.y0, fRectBY1: float = pRectB.y1;
        var fRectBZ0: float = pRectB.z0, fRectBZ1: float = pRectB.z1;

        if ((fRectAX1 < fRectBX0 || fRectBX1 < fRectAX0)
            || (fRectAY1 < fRectBY0 || fRectAY1 < fRectBY0)
            || (fRectAZ1 < fRectBZ0 || fRectAZ1 < fRectBZ0)) {

            return EVolumeClassifications.NO_RELATION;
        }

        if ((fRectAX0 == fRectBX0 && fRectAX1 == fRectBX1)
            && (fRectAY0 == fRectBY0 && fRectAY1 == fRectBY1)
            && (fRectAZ0 == fRectBZ0 && fRectAZ1 == fRectBZ1)) {

            return EVolumeClassifications.EQUAL;
        }

        if ((fRectAX0 <= fRectBX0 && fRectBX1 <= fRectAX1)
            && (fRectAY0 <= fRectBY0 && fRectBY1 <= fRectAY1)
            && (fRectAZ0 <= fRectBZ0 && fRectBZ1 <= fRectAZ1)) {

            return EVolumeClassifications.A_CONTAINS_B;
        }

        if ((fRectBX0 <= fRectAX0 && fRectAX1 <= fRectBX1)
            && (fRectBY0 <= fRectAY0 && fRectAY1 <= fRectBY1)
            && (fRectBZ0 <= fRectAZ0 && fRectAZ1 <= fRectBZ1)) {

            return EVolumeClassifications.B_CONTAINS_A;
        }

        return EVolumeClassifications.INTERSECTING;
    }

    export function frustumRect3d(pFrustum: IFrustum, pRect: IRect3d): EVolumeClassifications {
        var kClassification: EPlaneClassifications;
        var isIntersect: boolean = false;

        kClassification = planeRect3d(pFrustum.leftPlane, pRect);
        if (kClassification == EPlaneClassifications.PLANE_FRONT) {
            return EVolumeClassifications.NO_RELATION;
        }
        else if (kClassification == EPlaneClassifications.PLANE_INTERSECT) {
            isIntersect = true;
        }

        kClassification = planeRect3d(pFrustum.rightPlane, pRect);
        if (kClassification == EPlaneClassifications.PLANE_FRONT) {
            return EVolumeClassifications.NO_RELATION;
        }
        else if (kClassification == EPlaneClassifications.PLANE_INTERSECT) {
            isIntersect = true;
        }

        kClassification = planeRect3d(pFrustum.topPlane, pRect);
        if (kClassification == EPlaneClassifications.PLANE_FRONT) {
            return EVolumeClassifications.NO_RELATION;
        }
        else if (kClassification == EPlaneClassifications.PLANE_INTERSECT) {
            isIntersect = true;
        }

        kClassification = planeRect3d(pFrustum.bottomPlane, pRect);
        if (kClassification == EPlaneClassifications.PLANE_FRONT) {
            return EVolumeClassifications.NO_RELATION;
        }
        else if (kClassification == EPlaneClassifications.PLANE_INTERSECT) {
            isIntersect = true;
        }

        kClassification = planeRect3d(pFrustum.nearPlane, pRect);
        if (kClassification == EPlaneClassifications.PLANE_FRONT) {
            return EVolumeClassifications.NO_RELATION;
        }
        else if (kClassification == EPlaneClassifications.PLANE_INTERSECT) {
            isIntersect = true;
        }

        kClassification = planeRect3d(pFrustum.farPlane, pRect);
        if (kClassification == EPlaneClassifications.PLANE_FRONT) {
            return EVolumeClassifications.NO_RELATION;
        }
        else if (kClassification == EPlaneClassifications.PLANE_INTERSECT) {
            isIntersect = true;
        }

        if (isIntersect) {
            return EVolumeClassifications.INTERSECTING;
        }
        else {
            return EVolumeClassifications.A_CONTAINS_B;
        }
    }

}