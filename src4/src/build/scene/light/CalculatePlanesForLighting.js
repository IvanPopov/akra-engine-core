/// <reference path="../../geometry/Plane3d.ts" />
/// <reference path="../../geometry/Frustum.ts" />
/// <reference path="../../math/Vec3.ts" />
var akra;
(function (akra) {
    (function (scene) {
        (function (light) {
            var Vec3 = akra.math.Vec3;

            function calculatePlanesForFrustumLighting(pLightFrustum, v3fLightPosition, pCameraFrustum, pResultArray) {
                var pFrustumPlanesKeys = akra.geometry.Frustum.frustumPlanesKeys;

                var v3fNormal = Vec3.temp();
                var fDistance;

                var pPlanePoints = [Vec3.temp(), Vec3.temp(), Vec3.temp(), Vec3.temp()];

                var v3fTmp = Vec3.temp();
                var fThreshold = 0.1;

                for (var i = 0; i < 6; i++) {
                    var sKey = pFrustumPlanesKeys[i];
                    var pPlane = pCameraFrustum[sKey];

                    v3fNormal.set(pPlane.normal);
                    fDistance = pPlane.distance;

                    if (pPlane.signedDistance(v3fLightPosition) > 0) {
                        //extract four plane points (frustum verticies)
                        pCameraFrustum.getPlanePoints(sKey, pPlanePoints);

                        //we need find two farest points from v3fLightPosition;
                        var fLength0 = pPlanePoints[0].subtract(v3fLightPosition, v3fTmp).lengthSquare();
                        var fLength1 = pPlanePoints[1].subtract(v3fLightPosition, v3fTmp).lengthSquare();
                        var fLength2 = pPlanePoints[2].subtract(v3fLightPosition, v3fTmp).lengthSquare();
                        var fLength3 = pPlanePoints[3].subtract(v3fLightPosition, v3fTmp).lengthSquare();

                        var pIndexes;

                        if (fLength0 > fLength1 && fLength0 > fLength2 && fLength0 > fLength3) {
                            if (fLength1 > fLength2 && fLength1 > fLength3)
                                pIndexes = [0, 1, 2, 3];
                            else if (fLength2 > fLength1 && fLength2 > fLength3)
                                pIndexes = [0, 2, 1, 3];
                            else
                                pIndexes = [0, 3, 1, 2];
                        } else if (fLength1 > fLength0 && fLength1 > fLength2 && fLength1 > fLength3) {
                            if (fLength0 > fLength2 && fLength0 > fLength3)
                                pIndexes = [1, 0, 2, 3];
                            else if (fLength2 > fLength0 && fLength2 > fLength3)
                                pIndexes = [1, 2, 0, 3];
                            else
                                pIndexes = [1, 3, 0, 2];
                        } else if (fLength2 > fLength0 && fLength2 > fLength1 && fLength2 > fLength3) {
                            if (fLength0 > fLength1 && fLength0 > fLength3)
                                pIndexes = [2, 0, 1, 3];
                            else if (fLength1 > fLength0 && fLength1 > fLength3)
                                pIndexes = [2, 1, 0, 3];
                            else
                                pIndexes = [2, 3, 0, 1];
                        } else {
                            if (fLength0 > fLength1 && fLength0 > fLength2)
                                pIndexes = [3, 0, 1, 2];
                            else if (fLength1 > fLength0 && fLength1 > fLength2)
                                pIndexes = [3, 1, 0, 2];
                            else
                                pIndexes = [3, 2, 0, 1];
                        }

                        var pTestPlane = pResultArray[i];
                        pTestPlane.set(v3fLightPosition, pPlanePoints[pIndexes[0]], pPlanePoints[pIndexes[1]]);

                        //test with two remaining points
                        fLength1 = pTestPlane.signedDistance(pPlanePoints[pIndexes[2]]);
                        fLength2 = pTestPlane.signedDistance(pPlanePoints[pIndexes[3]]);

                        if (akra.math.abs(fLength1) <= fThreshold || akra.math.abs(fLength2) <= fThreshold) {
                            pTestPlane.set(pPlane.normal, -pPlane.normal.dot(v3fLightPosition));
                        } else if (fLength1 > 0 && fLength2 > 0) {
                            pTestPlane.negate();
                        }
                    } else {
                        pResultArray[i].set(v3fNormal, fDistance);
                    }
                }
                return 6;
            }
            light.calculatePlanesForFrustumLighting = calculatePlanesForFrustumLighting;

            function calculatePlanesForOrthogonalLighting(pLightFrustum, v3fLightPosition, pCameraFrustum, pResultArray) {
                //orthogonal projection
                //defining light sight direction;
                var pFrustumPlanesKeys = akra.geometry.Frustum.frustumPlanesKeys;

                var v3fLightDirection = pLightFrustum.getViewDirection(Vec3.temp());
                var fThreshold = 0.1;

                var pPlanePoints = [Vec3.temp(), Vec3.temp(), Vec3.temp(), Vec3.temp()];

                var v3fTmp = Vec3.temp();

                var nAdditionalTestLength = 0;

                for (var i = 0; i < 6; i++) {
                    var sKey = pFrustumPlanesKeys[i];
                    var pPlane = pCameraFrustum[sKey];

                    if (v3fLightDirection.dot(pPlane.normal) >= 0.) {
                        //adding plane
                        pResultArray[nAdditionalTestLength].set(pPlane);
                        nAdditionalTestLength++;
                    } else {
                        pCameraFrustum.getPlanePoints(sKey, pPlanePoints);

                        //we need find two farest points from v3fLightPosition;
                        var fLength0 = pPlanePoints[0].subtract(v3fLightPosition, v3fTmp).lengthSquare();
                        var fLength1 = pPlanePoints[1].subtract(v3fLightPosition, v3fTmp).lengthSquare();
                        var fLength2 = pPlanePoints[2].subtract(v3fLightPosition, v3fTmp).lengthSquare();
                        var fLength3 = pPlanePoints[3].subtract(v3fLightPosition, v3fTmp).lengthSquare();

                        var pIndexes;

                        if (fLength0 > fLength1 && fLength0 > fLength2 && fLength0 > fLength3) {
                            if (fLength1 > fLength2 && fLength1 > fLength3)
                                pIndexes = [0, 1, 2, 3];
                            else if (fLength2 > fLength1 && fLength2 > fLength3)
                                pIndexes = [0, 2, 1, 3];
                            else
                                pIndexes = [0, 3, 1, 2];
                        } else if (fLength1 > fLength0 && fLength1 > fLength2 && fLength1 > fLength3) {
                            if (fLength0 > fLength2 && fLength0 > fLength3)
                                pIndexes = [1, 0, 2, 3];
                            else if (fLength2 > fLength0 && fLength2 > fLength3)
                                pIndexes = [1, 2, 0, 3];
                            else
                                pIndexes = [1, 3, 0, 2];
                        } else if (fLength2 > fLength0 && fLength2 > fLength1 && fLength2 > fLength3) {
                            if (fLength0 > fLength1 && fLength0 > fLength3)
                                pIndexes = [2, 0, 1, 3];
                            else if (fLength1 > fLength0 && fLength1 > fLength3)
                                pIndexes = [2, 1, 0, 3];
                            else
                                pIndexes = [2, 3, 0, 1];
                        } else {
                            if (fLength0 > fLength1 && fLength0 > fLength2)
                                pIndexes = [3, 0, 1, 2];
                            else if (fLength1 > fLength0 && fLength1 > fLength2)
                                pIndexes = [3, 1, 0, 2];
                            else
                                pIndexes = [3, 2, 0, 1];
                        }

                        var pPoint1 = pPlanePoints[pIndexes[0]];
                        var pPoint2 = pPlanePoints[pIndexes[1]];

                        var v3fDir = pPoint2.subtract(pPoint1, v3fTmp);

                        var v3fNormal = v3fDir.cross(v3fLightDirection).normalize();

                        var pTestPlane = pResultArray[nAdditionalTestLength];
                        pTestPlane.set(v3fNormal, -v3fNormal.dot(pPoint1));

                        var pVertices = pCameraFrustum.getFrustumVertices();

                        //test on right orientation new plane (two point already on plane)
                        var iTest = 0;
                        for (var k = 0; k < 8; k++) {
                            if (pTestPlane.signedDistance(pVertices[k]) > fThreshold) {
                                iTest++;
                            }
                        }

                        if (iTest == 6) {
                            pTestPlane.negate();
                        } else if (iTest != 0) {
                            continue;
                        }

                        nAdditionalTestLength++;
                    }
                }

                return nAdditionalTestLength;
            }
            light.calculatePlanesForOrthogonalLighting = calculatePlanesForOrthogonalLighting;
        })(scene.light || (scene.light = {}));
        var light = scene.light;
    })(akra.scene || (akra.scene = {}));
    var scene = akra.scene;
})(akra || (akra = {}));
//# sourceMappingURL=CalculatePlanesForLighting.js.map
