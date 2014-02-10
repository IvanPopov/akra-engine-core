/// <reference path="../geometry.ts" />
/// <reference path="../../math/math.ts" />
var akra;
(function (akra) {
    (function (geometry) {
        (function (_intersect) {
            var Vec2 = akra.math.Vec2;
            var Vec3 = akra.math.Vec3;

            function plane2dRay2d(pPlane, pRay) {
                var fDistance = pPlane.signedDistance(pRay.point);
                var fNdotV = pPlane.normal.dot(pRay.normal);

                if (fDistance == 0.) {
                    return true;
                } else {
                    if (fNdotV == 0.) {
                        return false;
                    } else {
                        if (fDistance / fNdotV < 0.) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
            }
            _intersect.plane2dRay2d = plane2dRay2d;

            function plane3dRay3d(pPlane, pRay) {
                var fDistance = pPlane.signedDistance(pRay.point);
                var fNdotV = pPlane.normal.dot(pRay.normal);

                if (fDistance == 0.) {
                    return true;
                } else {
                    if (fNdotV == 0.) {
                        return false;
                    } else {
                        if (fDistance / fNdotV < 0.) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
            }
            _intersect.plane3dRay3d = plane3dRay3d;

            function circleRay2d(pCircle, pRay) {
                var v2fCenterToPoint = pRay.point.subtract(pCircle.center, Vec2.temp());

                var v2fNormal = pRay.normal;

                //a*t^2+ 2b*t + c = 0;
                var fA = v2fNormal.lengthSquare();
                var fB = v2fCenterToPoint.dot(v2fNormal);
                var fC = v2fCenterToPoint.lengthSquare() - pCircle.radius * pCircle.radius;

                var fDiscriminant = fB * fB - fA * fC;

                if (fDiscriminant < 0.) {
                    return false;
                }

                var fSqrtDiscriminant = akra.math.sqrt(fDiscriminant);

                var fT1 = (-fB + fSqrtDiscriminant) / fA;

                //var fT2: float = (-fB - fSqrtDiscriminant)/fA;
                //fT2 don't needed because fT2 < fT1 always
                //since fA > 0
                if (fT1 < 0.) {
                    return false;
                } else {
                    return true;
                }
            }
            _intersect.circleRay2d = circleRay2d;

            function sphereRay3d(pSphere, pRay) {
                var v3fCenterToPoint = pRay.point.subtract(pSphere.center, Vec3.temp());

                var v3fNormal = pRay.normal;

                //a*t^2+ 2b*t + c = 0;
                var fA = v3fNormal.lengthSquare();
                var fB = v3fCenterToPoint.dot(v3fNormal);
                var fC = v3fCenterToPoint.lengthSquare() - pSphere.radius * pSphere.radius;

                var fDiscriminant = fB * fB - fA * fC;

                if (fDiscriminant < 0.) {
                    return false;
                }

                var fSqrtDiscriminant = akra.math.sqrt(fDiscriminant);

                var fT1 = (-fB + fSqrtDiscriminant) / fA;

                //var fT2: float = (-fB - fSqrtDiscriminant)/fA;
                //fT2 don't needed because fT2 < fT1 always
                //since fA > 0
                if (fT1 < 0.) {
                    return false;
                } else {
                    return true;
                }
            }
            _intersect.sphereRay3d = sphereRay3d;

            function rect2dRay2d(pRect, pRay) {
                var v2fNormal = pRay.normal;
                var v2fPoint = pRay.point;

                var fT1, fT2;

                var fX1, fX2;
                var fY1, fY2;

                if (v2fNormal.x != 0.) {
                    fT1 = (pRect.x0 - v2fPoint.x) / v2fNormal.x;
                    fT2 = (pRect.x1 - v2fPoint.x) / v2fNormal.x;
                } else {
                    fT1 = (pRect.y0 - v2fPoint.y) / v2fNormal.y;
                    fT2 = (pRect.y1 - v2fPoint.y) / v2fNormal.y;
                }

                if (fT1 < 0 && fT2 < 0) {
                    return false;
                }

                fT1 = akra.math.max(fT1, 0.);
                fT2 = akra.math.max(fT2, 0.);

                fX1 = v2fPoint.x + fT1 * v2fNormal.x;
                fX2 = v2fPoint.x + fT2 * v2fNormal.x;

                fY1 = v2fPoint.y + fT1 * v2fNormal.y;
                fY2 = v2fPoint.y + fT2 * v2fNormal.y;

                if ((fX1 < pRect.x0 && fX2 < pRect.x0) || (fX1 > pRect.x1 && fX2 > pRect.x1) || (fY1 < pRect.y0 && fY2 < pRect.y0) || (fY1 > pRect.y1 && fY2 > pRect.y1)) {
                    return false;
                }

                return true;
            }
            _intersect.rect2dRay2d = rect2dRay2d;

            function rect3dRay3d(pRect, pRay) {
                var v3fNormal = pRay.normal;
                var v3fPoint = pRay.point;

                var fT1, fT2;

                var fX1, fX2;
                var fY1, fY2;
                var fZ1, fZ2;

                if (v3fNormal.x != 0.) {
                    fT1 = (pRect.x0 - v3fPoint.x) / v3fNormal.x;
                    fT2 = (pRect.x1 - v3fPoint.x) / v3fNormal.x;
                } else if (v3fNormal.y != 0.) {
                    fT1 = (pRect.y0 - v3fPoint.y) / v3fNormal.y;
                    fT2 = (pRect.y1 - v3fPoint.y) / v3fNormal.y;
                } else {
                    fT1 = (pRect.z0 - v3fPoint.z) / v3fNormal.z;
                    fT2 = (pRect.z1 - v3fPoint.z) / v3fNormal.z;
                }

                if (fT1 < 0 && fT2 < 0) {
                    return false;
                }

                fT1 = akra.math.max(fT1, 0.);
                fT2 = akra.math.max(fT2, 0.);

                fX1 = v3fPoint.x + fT1 * v3fNormal.x;
                fX2 = v3fPoint.x + fT2 * v3fNormal.x;

                fY1 = v3fPoint.y + fT1 * v3fNormal.y;
                fY2 = v3fPoint.y + fT2 * v3fNormal.y;

                fZ1 = v3fPoint.z + fT1 * v3fNormal.z;
                fZ2 = v3fPoint.z + fT2 * v3fNormal.z;

                if ((fX1 < pRect.x0 && fX2 < pRect.x0) || (fX1 > pRect.x1 && fX2 > pRect.x1) || (fY1 < pRect.y0 && fY2 < pRect.y0) || (fY1 > pRect.y1 && fY2 > pRect.y1) || (fZ1 < pRect.z0 && fZ2 < pRect.z0) || (fZ1 > pRect.z1 && fZ2 > pRect.z1)) {
                    return false;
                }

                return true;
            }
            _intersect.rect3dRay3d = rect3dRay3d;

            function circleCircle(pCircle1, pCircle2) {
                var v2fCenter1 = pCircle1.center;
                var v2fCenter2 = pCircle2.center;

                var fX = v2fCenter2.x - v2fCenter1.x;
                var fY = v2fCenter2.y - v2fCenter1.y;

                var fContactRadius = pCircle1.radius + pCircle2.radius;

                if ((fX * fX + fY * fY) > fContactRadius * fContactRadius) {
                    return false;
                }
                return true;
            }
            _intersect.circleCircle = circleCircle;

            function sphereSphere(pSphere1, pSphere2) {
                var v3fCenter1 = pSphere1.center;
                var v3fCenter2 = pSphere2.center;

                var fX = v3fCenter2.x - v3fCenter1.x;
                var fY = v3fCenter2.y - v3fCenter1.y;
                var fZ = v3fCenter2.z - v3fCenter1.z;

                var fContactRadius = pSphere1.radius + pSphere2.radius;

                if ((fX * fX + fY * fY + fZ * fZ) > fContactRadius * fContactRadius) {
                    return false;
                }
                return true;
            }
            _intersect.sphereSphere = sphereSphere;

            function rect2dCircle(pRect, pCircle) {
                var v2fCenter = pCircle.center;
                var fOffsetX = 0., fOffsetY = 0.;
                var nInside = 0;

                if (v2fCenter.x < pRect.x0) {
                    fOffsetX = pRect.x0 - v2fCenter.x;
                } else if (v2fCenter.x > pRect.x1) {
                    fOffsetX = v2fCenter.x - pRect.x1;
                } else {
                    nInside++;
                }

                if (v2fCenter.y < pRect.y0) {
                    fOffsetY = pRect.y0 - v2fCenter.y;
                } else if (v2fCenter.y > pRect.y1) {
                    fOffsetY = v2fCenter.y - pRect.y1;
                } else {
                    nInside++;
                }

                //if nInside == 2 then circle inside rect
                if (nInside === 2) {
                    return true;
                }

                var fOffsetLengthSquare = fOffsetX * fOffsetX + fOffsetY * fOffsetY;
                var fRadius = pCircle.radius;

                if (fOffsetLengthSquare > fRadius * fRadius) {
                    return false;
                }
                return true;
            }
            _intersect.rect2dCircle = rect2dCircle;

            function rect3dSphere(pRect, pSphere) {
                var v3fCenter = pSphere.center;
                var fOffsetX = 0., fOffsetY = 0., fOffsetZ = 0.;
                var nInside = 0;

                if (v3fCenter.x < pRect.x0) {
                    fOffsetX = pRect.x0 - v3fCenter.x;
                } else if (v3fCenter.x > pRect.x1) {
                    fOffsetX = v3fCenter.x - pRect.x1;
                } else {
                    nInside++;
                }

                if (v3fCenter.y < pRect.y0) {
                    fOffsetY = pRect.y0 - v3fCenter.y;
                } else if (v3fCenter.y > pRect.y1) {
                    fOffsetY = v3fCenter.y - pRect.y1;
                } else {
                    nInside++;
                }

                if (v3fCenter.z < pRect.z0) {
                    fOffsetZ = pRect.z0 - v3fCenter.z;
                } else if (v3fCenter.z > pRect.z1) {
                    fOffsetZ = v3fCenter.z - pRect.z1;
                } else {
                    nInside++;
                }

                //if nInside == 3 then sphere inside rect
                if (nInside === 3) {
                    return true;
                }

                var fOffsetLengthSquare = fOffsetX * fOffsetX + fOffsetY * fOffsetY + fOffsetZ * fOffsetZ;
                var fRadius = pSphere.radius;

                if (fOffsetLengthSquare > fRadius * fRadius) {
                    return false;
                }
                return true;
            }
            _intersect.rect3dSphere = rect3dSphere;

            function rect2dRect2d(pRect1, pRect2, pResult) {
                if (!akra.isDef(pResult)) {
                    var fX0 = akra.math.max(pRect1.x0, pRect2.x0);
                    var fX1 = akra.math.min(pRect1.x1, pRect2.x1);
                    if (fX0 <= fX1) {
                        var fY0 = akra.math.max(pRect1.y0, pRect2.y0);
                        var fY1 = akra.math.min(pRect1.y1, pRect2.y1);
                        if (fY0 <= fY1) {
                            return true;
                        }
                    }
                    return false;
                } else {
                    pResult.x0 = akra.math.max(pRect1.x0, pRect2.x0);
                    pResult.x1 = akra.math.min(pRect1.x1, pRect2.x1);

                    pResult.y0 = akra.math.max(pRect1.y0, pRect2.y0);
                    pResult.y1 = akra.math.min(pRect1.y1, pRect2.y1);

                    return pResult.isValid();
                }
            }
            _intersect.rect2dRect2d = rect2dRect2d;

            function rect3dRect3d(pRect1, pRect2, pResult) {
                if (!akra.isDef(pResult)) {
                    var fX0 = akra.math.max(pRect1.x0, pRect2.x0);
                    var fX1 = akra.math.min(pRect1.x1, pRect2.x1);
                    if (fX0 <= fX1) {
                        var fY0 = akra.math.max(pRect1.y0, pRect2.y0);
                        var fY1 = akra.math.min(pRect1.y1, pRect2.y1);
                        if (fY0 <= fY1) {
                            var fZ0 = akra.math.max(pRect1.z0, pRect2.z0);
                            var fZ1 = akra.math.min(pRect1.z1, pRect2.z1);
                            if (fZ0 <= fZ1) {
                                return true;
                            }
                        }
                    }
                    return false;
                } else {
                    pResult.x0 = akra.math.max(pRect1.x0, pRect2.x0);
                    pResult.x1 = akra.math.min(pRect1.x1, pRect2.x1);

                    pResult.y0 = akra.math.max(pRect1.y0, pRect2.y0);
                    pResult.y1 = akra.math.min(pRect1.y1, pRect2.y1);

                    pResult.z0 = akra.math.max(pRect1.z0, pRect2.z0);
                    pResult.z1 = akra.math.min(pRect1.z1, pRect2.z1);

                    return pResult.isValid();
                }
            }
            _intersect.rect3dRect3d = rect3dRect3d;

            function intersect(pRect1, pRect2, pResult) {
                var nArgumentsLength = arguments.length;

                if (nArgumentsLength === 3) {
                    if (arguments[2] instanceof akra.geometry.Rect2d) {
                        return rect2dRect2d(arguments[0], arguments[1], arguments[2]);
                    } else {
                        return rect3dRect3d(arguments[0], arguments[1], arguments[2]);
                    }
                } else {
                    var pArg0 = arguments[0];
                    var pArg1 = arguments[1];

                    if (pArg1 instanceof akra.geometry.Ray2d) {
                        if (pArg0 instanceof akra.geometry.Plane2d) {
                            return plane2dRay2d(pArg0, pArg1);
                        } else if (pArg0 instanceof akra.geometry.Circle) {
                            return circleRay2d(pArg0, pArg1);
                        } else {
                            return rect2dRay2d(pArg0, pArg1);
                        }
                    } else if (pArg1 instanceof akra.geometry.Ray3d) {
                        if (pArg0 instanceof akra.geometry.Plane3d) {
                            return plane3dRay3d(pArg0, pArg1);
                        } else if (pArg0 instanceof akra.geometry.Sphere) {
                            return sphereRay3d(pArg0, pArg1);
                        } else {
                            return rect3dRay3d(pArg0, pArg1);
                        }
                    } else if (pArg1 instanceof akra.geometry.Circle) {
                        if (pArg0 instanceof akra.geometry.Circle) {
                            return circleCircle(pArg0, pArg1);
                        } else {
                            return rect2dCircle(pArg0, pArg1);
                        }
                    } else if (pArg1 instanceof akra.geometry.Sphere) {
                        if (pArg0 instanceof akra.geometry.Sphere) {
                            return sphereSphere(pArg0, pArg1);
                        } else {
                            return rect3dSphere(pArg0, pArg1);
                        }
                    } else {
                        if (pArg0 instanceof akra.geometry.Rect2d) {
                            return rect2dRect2d(pArg0, pArg1);
                        } else {
                            return rect3dRect3d(pArg0, pArg1);
                        }
                    }
                }
            }
            _intersect.intersect = intersect;
        })(geometry.intersect || (geometry.intersect = {}));
        var intersect = geometry.intersect;
    })(akra.geometry || (akra.geometry = {}));
    var geometry = akra.geometry;
})(akra || (akra = {}));
//# sourceMappingURL=intersect.js.map
