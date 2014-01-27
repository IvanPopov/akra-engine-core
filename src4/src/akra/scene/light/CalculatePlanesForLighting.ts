/// <reference path="../../geometry/Plane3d.ts" />
/// <reference path="../../geometry/Frustum.ts" />
/// <reference path="../../math/Vec3.ts" />

module akra.scene.light {
    import Vec3 = math.Vec3;

    export function calculatePlanesForFrustumLighting(pLightFrustum: IFrustum, v3fLightPosition: IVec3,
                     pCameraFrustum: IFrustum, pResultArray: IPlane3d[]) : uint{

        var pFrustumPlanesKeys: string[] = geometry.Frustum.frustumPlanesKeys;

        var v3fNormal: IVec3 = Vec3.temp();
        var fDistance: float;

        var pPlanePoints: IVec3[] = [Vec3.temp(), Vec3.temp(), Vec3.temp(), Vec3.temp()];

        var v3fTmp: IVec3 = Vec3.temp();
        var fThreshold: float = 0.1;

        for(var i: int = 0; i<6; i++){
            var sKey: string = pFrustumPlanesKeys[i];
            var pPlane: IPlane3d = pCameraFrustum[sKey];

            v3fNormal.set(pPlane.normal);
            fDistance = pPlane.distance;

            if(pPlane.signedDistance(v3fLightPosition) > 0){
                //extract four plane points (frustum verticies)
                pCameraFrustum.getPlanePoints(sKey, pPlanePoints);

                //we need find two farest points from v3fLightPosition;

                var fLength0: float = pPlanePoints[0].subtract(v3fLightPosition,v3fTmp).lengthSquare();
                var fLength1: float = pPlanePoints[1].subtract(v3fLightPosition,v3fTmp).lengthSquare();
                var fLength2: float = pPlanePoints[2].subtract(v3fLightPosition,v3fTmp).lengthSquare();
                var fLength3: float = pPlanePoints[3].subtract(v3fLightPosition,v3fTmp).lengthSquare();

                var pIndexes;

                if(fLength0 > fLength1 && fLength0 > fLength2 && fLength0 > fLength3){
                    if(fLength1 > fLength2 && fLength1 > fLength3)
                        pIndexes = [0, 1, 2, 3];
                    else if(fLength2 > fLength1 && fLength2 > fLength3)
                        pIndexes = [0, 2, 1, 3];
                    else
                        pIndexes = [0, 3, 1, 2];
                }
                else if(fLength1 > fLength0 && fLength1 > fLength2 && fLength1 > fLength3){
                    if(fLength0 > fLength2 && fLength0 > fLength3)
                        pIndexes = [1, 0, 2, 3];
                    else if(fLength2 > fLength0 && fLength2 > fLength3)
                        pIndexes = [1, 2, 0, 3];	
                    else
                        pIndexes = [1, 3, 0, 2];	
                }
                else if(fLength2 > fLength0 && fLength2 > fLength1 && fLength2 > fLength3){
                    if(fLength0 > fLength1 && fLength0 > fLength3)
                        pIndexes = [2, 0, 1, 3];
                    else if(fLength1 > fLength0 && fLength1 > fLength3)
                        pIndexes = [2, 1, 0, 3];	
                    else
                        pIndexes = [2, 3, 0, 1];	
                }
                else{
                    if(fLength0 > fLength1 && fLength0 > fLength2)
                        pIndexes = [3, 0, 1, 2];
                    else if(fLength1 > fLength0 && fLength1 > fLength2)
                        pIndexes = [3, 1, 0, 2];	
                    else
                        pIndexes = [3, 2, 0, 1];	
                }

                var pTestPlane: IPlane3d = pResultArray[i];
                pTestPlane.set(v3fLightPosition, pPlanePoints[pIndexes[0]], pPlanePoints[pIndexes[1]]);

                //test with two remaining points

                fLength1 = pTestPlane.signedDistance(pPlanePoints[pIndexes[2]]);
                fLength2 = pTestPlane.signedDistance(pPlanePoints[pIndexes[3]]);

                if(math.abs(fLength1) <= fThreshold || math.abs(fLength2) <= fThreshold){
                    pTestPlane.set(pPlane.normal, -pPlane.normal.dot(v3fLightPosition)); 
                }
                else if(fLength1 > 0 && fLength2 > 0) {
                    pTestPlane.negate();
                }
            }
            else{
                pResultArray[i].set(v3fNormal, fDistance);
            }
        }				
        return 6;
    }

    export function calculatePlanesForOrthogonalLighting(pLightFrustum: IFrustum, v3fLightPosition: IVec3,
                     pCameraFrustum: IFrustum, pResultArray: IPlane3d[]) : uint{

        //orthogonal projection
        //defining light sight direction;

        var pFrustumPlanesKeys: string[] = geometry.Frustum.frustumPlanesKeys;

        var v3fLightDirection: IVec3 = pLightFrustum.getViewDirection(Vec3.temp());
        var fThreshold: float = 0.1;

        var pPlanePoints: IVec3[] = [Vec3.temp(), Vec3.temp(), Vec3.temp(), Vec3.temp()];

        var v3fTmp: IVec3 = Vec3.temp();

        var nAdditionalTestLength: uint = 0;

        for(var i: int = 0; i<6; i++){
            var sKey: string = pFrustumPlanesKeys[i];
            var pPlane: IPlane3d = pCameraFrustum[sKey];

            if(v3fLightDirection.dot(pPlane.normal) >= 0.){
                //adding plane
                
                pResultArray[nAdditionalTestLength].set(pPlane);
                nAdditionalTestLength++;
            }
            else{
                
                pCameraFrustum.getPlanePoints(sKey, pPlanePoints);

                //we need find two farest points from v3fLightPosition;

                var fLength0: float = pPlanePoints[0].subtract(v3fLightPosition,v3fTmp).lengthSquare();
                var fLength1: float = pPlanePoints[1].subtract(v3fLightPosition,v3fTmp).lengthSquare();
                var fLength2: float = pPlanePoints[2].subtract(v3fLightPosition,v3fTmp).lengthSquare();
                var fLength3: float = pPlanePoints[3].subtract(v3fLightPosition,v3fTmp).lengthSquare();

                var pIndexes;

                if(fLength0 > fLength1 && fLength0 > fLength2 && fLength0 > fLength3){
                    if(fLength1 > fLength2 && fLength1 > fLength3)
                        pIndexes = [0, 1, 2, 3];
                    else if(fLength2 > fLength1 && fLength2 > fLength3)
                        pIndexes = [0, 2, 1, 3];
                    else
                        pIndexes = [0, 3, 1, 2];
                }
                else if(fLength1 > fLength0 && fLength1 > fLength2 && fLength1 > fLength3){
                    if(fLength0 > fLength2 && fLength0 > fLength3)
                        pIndexes = [1, 0, 2, 3];
                    else if(fLength2 > fLength0 && fLength2 > fLength3)
                        pIndexes = [1, 2, 0, 3];	
                    else
                        pIndexes = [1, 3, 0, 2];	
                }
                else if(fLength2 > fLength0 && fLength2 > fLength1 && fLength2 > fLength3){
                    if(fLength0 > fLength1 && fLength0 > fLength3)
                        pIndexes = [2, 0, 1, 3];
                    else if(fLength1 > fLength0 && fLength1 > fLength3)
                        pIndexes = [2, 1, 0, 3];	
                    else
                        pIndexes = [2, 3, 0, 1];	
                }
                else{
                    if(fLength0 > fLength1 && fLength0 > fLength2)
                        pIndexes = [3, 0, 1, 2];
                    else if(fLength1 > fLength0 && fLength1 > fLength2)
                        pIndexes = [3, 1, 0, 2];	
                    else
                        pIndexes = [3, 2, 0, 1];	
                }

                var pPoint1: IVec3 = pPlanePoints[pIndexes[0]];
                var pPoint2: IVec3 = pPlanePoints[pIndexes[1]];

                var v3fDir: IVec3 = pPoint2.subtract(pPoint1, v3fTmp);

                var v3fNormal: IVec3 = v3fDir.cross(v3fLightDirection).normalize();

                var pTestPlane: IPlane3d = pResultArray[nAdditionalTestLength];
                pTestPlane.set(v3fNormal, -v3fNormal.dot(pPoint1));

                var pVertices: IVec3[] = pCameraFrustum.getFrustumVertices();

                //test on right orientation new plane (two point already on plane)
                var iTest: uint = 0;
                for(var k: int = 0; k < 8; k++){
                    if(pTestPlane.signedDistance(pVertices[k]) > fThreshold){
                        iTest++;
                    }
                }

                if(iTest == 6){
                    pTestPlane.negate();
                }
                else if(iTest != 0){
                    continue;
                }

                nAdditionalTestLength++;
            }
        }

        return nAdditionalTestLength;
    }
}
