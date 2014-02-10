/// <reference path="../../idl/EVolumeClassifications.ts" />
/// <reference path="../../idl/EPlaneClassifications.ts" />
/// <reference path="../geometry.ts" />
var akra;
(function (akra) {
    (function (geometry) {
        (function (classify) {
            var Vec2 = akra.math.Vec2;
            var Vec3 = akra.math.Vec3;

            function planeCircle(pPlane, pCircle) {
                var fDistance = pPlane.signedDistance(pCircle.center);
                var fRadius = pCircle.radius;

                if (fDistance > fRadius) {
                    return 0 /* PLANE_FRONT */;
                } else if (fDistance < -fRadius) {
                    return 1 /* PLANE_BACK */;
                } else {
                    return 2 /* PLANE_INTERSECT */;
                }
            }
            classify.planeCircle = planeCircle;

            function planeSphere(pPlane, pSphere) {
                var fDistance = pPlane.signedDistance(pSphere.center);
                var fRadius = pSphere.radius;

                if (fDistance > fRadius) {
                    return 0 /* PLANE_FRONT */;
                } else if (fDistance < -fRadius) {
                    return 1 /* PLANE_BACK */;
                } else {
                    return 2 /* PLANE_INTERSECT */;
                }
            }
            classify.planeSphere = planeSphere;

            function planeRect2d(pPlane, pRect) {
                var v2fMinPoint = Vec2.temp();
                var v2fMaxPoint = Vec2.temp();

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
                    return 2 /* PLANE_INTERSECT */;
                } else if (fMaxDistance < 0.) {
                    return 1 /* PLANE_BACK */;
                } else {
                    return 0 /* PLANE_FRONT */;
                }
            }
            classify.planeRect2d = planeRect2d;

            function planeRect3d(pPlane, pRect) {
                var v3fMinPoint = Vec3.temp();
                var v3fMaxPoint = Vec3.temp();

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
                    return 2 /* PLANE_INTERSECT */;
                } else if (fMaxDistance <= 0.) {
                    return 1 /* PLANE_BACK */;
                } else {
                    return 0 /* PLANE_FRONT */;
                }
            }
            classify.planeRect3d = planeRect3d;

            function plane(pPlane, pRect) {
                var pArg0 = arguments[0];
                var pArg1 = arguments[1];

                if (pArg0 instanceof akra.geometry.Plane2d) {
                    if (pArg1 instanceof akra.geometry.Circle) {
                        return planeCircle(pArg0, pArg1);
                    } else {
                        return planeRect2d(pArg0, pArg1);
                    }
                } else {
                    if (pArg1 instanceof akra.geometry.Sphere) {
                        return planeSphere(pArg0, pArg1);
                    } else {
                        return planeRect3d(pArg0, pArg1);
                    }
                }
            }
            classify.plane = plane;

            function rect2d(pRectA, pRectB) {
                var fRectAX0 = pRectA.x0, fRectAX1 = pRectA.x1;
                var fRectAY0 = pRectA.y0, fRectAY1 = pRectA.y1;

                var fRectBX0 = pRectB.x0, fRectBX1 = pRectB.x1;
                var fRectBY0 = pRectB.y0, fRectBY1 = pRectB.y1;

                if ((fRectAX1 < fRectBX0 || fRectBX1 < fRectAX0) || (fRectAY1 < fRectBY0 || fRectAY1 < fRectBY0)) {
                    return 0 /* NO_RELATION */;
                }

                if ((fRectAX0 == fRectBX0 && fRectAX1 == fRectBX1) && (fRectAY0 == fRectBY0 && fRectAY1 == fRectBY1)) {
                    return 1 /* EQUAL */;
                }

                if ((fRectAX0 <= fRectBX0 && fRectBX1 <= fRectAX1) && (fRectAY0 <= fRectBY0 && fRectBY1 <= fRectAY1)) {
                    return 2 /* A_CONTAINS_B */;
                }

                if ((fRectBX0 <= fRectAX0 && fRectAX1 <= fRectBX1) && (fRectBY0 <= fRectAY0 && fRectAY1 <= fRectBY1)) {
                    return 3 /* B_CONTAINS_A */;
                }

                return 4 /* INTERSECTING */;
            }
            classify.rect2d = rect2d;

            function rect3d(pRectA, pRectB) {
                var fRectAX0 = pRectA.x0, fRectAX1 = pRectA.x1;
                var fRectAY0 = pRectA.y0, fRectAY1 = pRectA.y1;
                var fRectAZ0 = pRectA.z0, fRectAZ1 = pRectA.z1;

                var fRectBX0 = pRectB.x0, fRectBX1 = pRectB.x1;
                var fRectBY0 = pRectB.y0, fRectBY1 = pRectB.y1;
                var fRectBZ0 = pRectB.z0, fRectBZ1 = pRectB.z1;

                if ((fRectAX1 < fRectBX0 || fRectBX1 < fRectAX0) || (fRectAY1 < fRectBY0 || fRectAY1 < fRectBY0) || (fRectAZ1 < fRectBZ0 || fRectAZ1 < fRectBZ0)) {
                    return 0 /* NO_RELATION */;
                }

                if ((fRectAX0 == fRectBX0 && fRectAX1 == fRectBX1) && (fRectAY0 == fRectBY0 && fRectAY1 == fRectBY1) && (fRectAZ0 == fRectBZ0 && fRectAZ1 == fRectBZ1)) {
                    return 1 /* EQUAL */;
                }

                if ((fRectAX0 <= fRectBX0 && fRectBX1 <= fRectAX1) && (fRectAY0 <= fRectBY0 && fRectBY1 <= fRectAY1) && (fRectAZ0 <= fRectBZ0 && fRectBZ1 <= fRectAZ1)) {
                    return 2 /* A_CONTAINS_B */;
                }

                if ((fRectBX0 <= fRectAX0 && fRectAX1 <= fRectBX1) && (fRectBY0 <= fRectAY0 && fRectAY1 <= fRectBY1) && (fRectBZ0 <= fRectAZ0 && fRectAZ1 <= fRectBZ1)) {
                    return 3 /* B_CONTAINS_A */;
                }

                return 4 /* INTERSECTING */;
            }
            classify.rect3d = rect3d;

            function frustumRect3d(pFrustum, pRect) {
                var kClassification;
                var isIntersect = false;

                kClassification = planeRect3d(pFrustum.leftPlane, pRect);
                if (kClassification == 0 /* PLANE_FRONT */) {
                    return 0 /* NO_RELATION */;
                } else if (kClassification == 2 /* PLANE_INTERSECT */) {
                    isIntersect = true;
                }

                kClassification = planeRect3d(pFrustum.rightPlane, pRect);
                if (kClassification == 0 /* PLANE_FRONT */) {
                    return 0 /* NO_RELATION */;
                } else if (kClassification == 2 /* PLANE_INTERSECT */) {
                    isIntersect = true;
                }

                kClassification = planeRect3d(pFrustum.topPlane, pRect);
                if (kClassification == 0 /* PLANE_FRONT */) {
                    return 0 /* NO_RELATION */;
                } else if (kClassification == 2 /* PLANE_INTERSECT */) {
                    isIntersect = true;
                }

                kClassification = planeRect3d(pFrustum.bottomPlane, pRect);
                if (kClassification == 0 /* PLANE_FRONT */) {
                    return 0 /* NO_RELATION */;
                } else if (kClassification == 2 /* PLANE_INTERSECT */) {
                    isIntersect = true;
                }

                kClassification = planeRect3d(pFrustum.nearPlane, pRect);
                if (kClassification == 0 /* PLANE_FRONT */) {
                    return 0 /* NO_RELATION */;
                } else if (kClassification == 2 /* PLANE_INTERSECT */) {
                    isIntersect = true;
                }

                kClassification = planeRect3d(pFrustum.farPlane, pRect);
                if (kClassification == 0 /* PLANE_FRONT */) {
                    return 0 /* NO_RELATION */;
                } else if (kClassification == 2 /* PLANE_INTERSECT */) {
                    isIntersect = true;
                }

                if (isIntersect) {
                    return 4 /* INTERSECTING */;
                } else {
                    return 2 /* A_CONTAINS_B */;
                }
            }
            classify.frustumRect3d = frustumRect3d;
        })(geometry.classify || (geometry.classify = {}));
        var classify = geometry.classify;
    })(akra.geometry || (akra.geometry = {}));
    var geometry = akra.geometry;
})(akra || (akra = {}));
//# sourceMappingURL=classify.js.map
