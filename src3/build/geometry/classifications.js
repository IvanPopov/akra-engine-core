/// <reference path="../idl/AEVolumeClassifications.ts" />
/// <reference path="../idl/AEPlaneClassifications.ts" />
define(["require", "exports", "geometry/Sphere", "geometry/Circle", "geometry/Plane2d"], function(require, exports, __Sphere__, __Circle__, __Plane2d__) {
    var Sphere = __Sphere__;
    var Circle = __Circle__;
    var Plane2d = __Plane2d__;

    function planeCircle(pPlane, pCircle) {
        var fDistance = pPlane.signedDistance(pCircle.center);
        var fRadius = pCircle.radius;

        if (fDistance > fRadius) {
            return AEPlaneClassifications.PLANE_FRONT;
        } else if (fDistance < -fRadius) {
            return AEPlaneClassifications.PLANE_BACK;
        } else {
            return AEPlaneClassifications.PLANE_INTERSECT;
        }
    }
    exports.planeCircle = planeCircle;

    function planeSphere(pPlane, pSphere) {
        var fDistance = pPlane.signedDistance(pSphere.center);
        var fRadius = pSphere.radius;

        if (fDistance > fRadius) {
            return AEPlaneClassifications.PLANE_FRONT;
        } else if (fDistance < -fRadius) {
            return AEPlaneClassifications.PLANE_BACK;
        } else {
            return AEPlaneClassifications.PLANE_INTERSECT;
        }
    }
    exports.planeSphere = planeSphere;

    function planeRect2d(pPlane, pRect) {
        var v2fMinPoint = vec2();
        var v2fMaxPoint = vec2();

        var v2fNormal = pPlane.normal;

        if (v2fNormal.x > 0.) {
            v2fMinPoint.x = pRect.x0;
            v2fMaxPoint.x = pRect.x1;
        } else {
            v2fMinPoint.x = pRect.x1;
            v2fMaxPoint.x = pRect.x0;
        }

        if (v2fNormal.y > 0.) {
            v2fMinPoint.y = pRect.y0;
            v2fMaxPoint.y = pRect.y1;
        } else {
            v2fMinPoint.y = pRect.y1;
            v2fMaxPoint.y = pRect.y0;
        }

        var fMinDistance = pPlane.signedDistance(v2fMinPoint);
        var fMaxDistance = pPlane.signedDistance(v2fMaxPoint);

        if (fMinDistance * fMaxDistance <= 0.) {
            return AEPlaneClassifications.PLANE_INTERSECT;
        } else if (fMaxDistance < 0.) {
            return AEPlaneClassifications.PLANE_BACK;
        } else {
            return AEPlaneClassifications.PLANE_FRONT;
        }
    }
    exports.planeRect2d = planeRect2d;

    function planeRect3d(pPlane, pRect) {
        var v3fMinPoint = vec3();
        var v3fMaxPoint = vec3();

        var v3fNormal = pPlane.normal;

        if (v3fNormal.x > 0.) {
            v3fMinPoint.x = pRect.x0;
            v3fMaxPoint.x = pRect.x1;
        } else {
            v3fMinPoint.x = pRect.x1;
            v3fMaxPoint.x = pRect.x0;
        }

        if (v3fNormal.y > 0.) {
            v3fMinPoint.y = pRect.y0;
            v3fMaxPoint.y = pRect.y1;
        } else {
            v3fMinPoint.y = pRect.y1;
            v3fMaxPoint.y = pRect.y0;
        }

        if (v3fNormal.z > 0.) {
            v3fMinPoint.z = pRect.z0;
            v3fMaxPoint.z = pRect.z1;
        } else {
            v3fMinPoint.z = pRect.z1;
            v3fMaxPoint.z = pRect.z0;
        }

        var fMinDistance = pPlane.signedDistance(v3fMinPoint);
        var fMaxDistance = pPlane.signedDistance(v3fMaxPoint);

        if (fMinDistance * fMaxDistance <= 0.) {
            return AEPlaneClassifications.PLANE_INTERSECT;
        } else if (fMaxDistance <= 0.) {
            return AEPlaneClassifications.PLANE_BACK;
        } else {
            return AEPlaneClassifications.PLANE_FRONT;
        }
    }
    exports.planeRect3d = planeRect3d;

    function plane(pPlane, pRect) {
        var pArg0 = arguments[0];
        var pArg1 = arguments[1];

        if (pArg0 instanceof Plane2d) {
            if (pArg1 instanceof Circle) {
                return exports.planeCircle(pArg0, pArg1);
            } else {
                return exports.planeRect2d(pArg0, pArg1);
            }
        } else {
            if (pArg1 instanceof Sphere) {
                return exports.planeSphere(pArg0, pArg1);
            } else {
                return exports.planeRect3d(pArg0, pArg1);
            }
        }
    }
    exports.plane = plane;

    function classifyRect2d(pRectA, pRectB) {
        var fRectAX0 = pRectA.x0, fRectAX1 = pRectA.x1;
        var fRectAY0 = pRectA.y0, fRectAY1 = pRectA.y1;

        var fRectBX0 = pRectB.x0, fRectBX1 = pRectB.x1;
        var fRectBY0 = pRectB.y0, fRectBY1 = pRectB.y1;

        if ((fRectAX1 < fRectBX0 || fRectBX1 < fRectAX0) || (fRectAY1 < fRectBY0 || fRectAY1 < fRectBY0)) {
            return AEVolumeClassifications.NO_RELATION;
        }

        if ((fRectAX0 == fRectBX0 && fRectAX1 == fRectBX1) && (fRectAY0 == fRectBY0 && fRectAY1 == fRectBY1)) {
            return AEVolumeClassifications.EQUAL;
        }

        if ((fRectAX0 <= fRectBX0 && fRectBX1 <= fRectAX1) && (fRectAY0 <= fRectBY0 && fRectBY1 <= fRectAY1)) {
            return AEVolumeClassifications.A_CONTAINS_B;
        }

        if ((fRectBX0 <= fRectAX0 && fRectAX1 <= fRectBX1) && (fRectBY0 <= fRectAY0 && fRectAY1 <= fRectBY1)) {
            return AEVolumeClassifications.B_CONTAINS_A;
        }

        return AEVolumeClassifications.INTERSECTING;
    }
    exports.classifyRect2d = classifyRect2d;

    function classifyRect3d(pRectA, pRectB) {
        var fRectAX0 = pRectA.x0, fRectAX1 = pRectA.x1;
        var fRectAY0 = pRectA.y0, fRectAY1 = pRectA.y1;
        var fRectAZ0 = pRectA.z0, fRectAZ1 = pRectA.z1;

        var fRectBX0 = pRectB.x0, fRectBX1 = pRectB.x1;
        var fRectBY0 = pRectB.y0, fRectBY1 = pRectB.y1;
        var fRectBZ0 = pRectB.z0, fRectBZ1 = pRectB.z1;

        if ((fRectAX1 < fRectBX0 || fRectBX1 < fRectAX0) || (fRectAY1 < fRectBY0 || fRectAY1 < fRectBY0) || (fRectAZ1 < fRectBZ0 || fRectAZ1 < fRectBZ0)) {
            return AEVolumeClassifications.NO_RELATION;
        }

        if ((fRectAX0 == fRectBX0 && fRectAX1 == fRectBX1) && (fRectAY0 == fRectBY0 && fRectAY1 == fRectBY1) && (fRectAZ0 == fRectBZ0 && fRectAZ1 == fRectBZ1)) {
            return AEVolumeClassifications.EQUAL;
        }

        if ((fRectAX0 <= fRectBX0 && fRectBX1 <= fRectAX1) && (fRectAY0 <= fRectBY0 && fRectBY1 <= fRectAY1) && (fRectAZ0 <= fRectBZ0 && fRectBZ1 <= fRectAZ1)) {
            return AEVolumeClassifications.A_CONTAINS_B;
        }

        if ((fRectBX0 <= fRectAX0 && fRectAX1 <= fRectBX1) && (fRectBY0 <= fRectAY0 && fRectAY1 <= fRectBY1) && (fRectBZ0 <= fRectAZ0 && fRectAZ1 <= fRectBZ1)) {
            return AEVolumeClassifications.B_CONTAINS_A;
        }

        return AEVolumeClassifications.INTERSECTING;
    }
    exports.classifyRect3d = classifyRect3d;

    function frustumRect3d(pFrustum, pRect) {
        var kClassification;
        var isIntersect = false;

        kClassification = exports.planeRect3d(pFrustum.leftPlane, pRect);
        if (kClassification == AEPlaneClassifications.PLANE_FRONT) {
            return AEVolumeClassifications.NO_RELATION;
        } else if (kClassification == AEPlaneClassifications.PLANE_INTERSECT) {
            isIntersect = true;
        }

        kClassification = exports.planeRect3d(pFrustum.rightPlane, pRect);
        if (kClassification == AEPlaneClassifications.PLANE_FRONT) {
            return AEVolumeClassifications.NO_RELATION;
        } else if (kClassification == AEPlaneClassifications.PLANE_INTERSECT) {
            isIntersect = true;
        }

        kClassification = exports.planeRect3d(pFrustum.topPlane, pRect);
        if (kClassification == AEPlaneClassifications.PLANE_FRONT) {
            return AEVolumeClassifications.NO_RELATION;
        } else if (kClassification == AEPlaneClassifications.PLANE_INTERSECT) {
            isIntersect = true;
        }

        kClassification = exports.planeRect3d(pFrustum.bottomPlane, pRect);
        if (kClassification == AEPlaneClassifications.PLANE_FRONT) {
            return AEVolumeClassifications.NO_RELATION;
        } else if (kClassification == AEPlaneClassifications.PLANE_INTERSECT) {
            isIntersect = true;
        }

        kClassification = exports.planeRect3d(pFrustum.nearPlane, pRect);
        if (kClassification == AEPlaneClassifications.PLANE_FRONT) {
            return AEVolumeClassifications.NO_RELATION;
        } else if (kClassification == AEPlaneClassifications.PLANE_INTERSECT) {
            isIntersect = true;
        }

        kClassification = exports.planeRect3d(pFrustum.farPlane, pRect);
        if (kClassification == AEPlaneClassifications.PLANE_FRONT) {
            return AEVolumeClassifications.NO_RELATION;
        } else if (kClassification == AEPlaneClassifications.PLANE_INTERSECT) {
            isIntersect = true;
        }

        if (isIntersect) {
            return AEVolumeClassifications.INTERSECTING;
        } else {
            return AEVolumeClassifications.A_CONTAINS_B;
        }
    }
    exports.frustumRect3d = frustumRect3d;
});
//# sourceMappingURL=classifications.js.map
