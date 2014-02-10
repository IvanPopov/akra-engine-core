/// <reference path="../idl/IVertexData.ts" />
/// <reference path="../idl/IVertexElement.ts" />
/// <reference path="../math/math.ts" />
/// <reference path="Ray2d.ts" />
/// <reference path="Ray3d.ts" />
/// <reference path="Segment2d.ts" />
/// <reference path="Segment3d.ts" />
/// <reference path="Box.ts" />
/// <reference path="Circle.ts" />
/// <reference path="Sphere.ts" />
/// <reference path="Rect2d.ts" />
/// <reference path="Rect3d.ts" />
/// <reference path="Plane2d.ts" />
/// <reference path="Plane3d.ts" />
/// <reference path="Frustum.ts" />
/// <reference path="../data/Usage.ts" />
var akra;
(function (akra) {
    (function (geometry) {
        var Vec3 = akra.math.Vec3;

        var usage = akra.data.Usages;

        //function computeBoundingBox(pVertexData: IVertexData, pBoundingBox: IRect3d): boolean;
        //function computeDataForCascadeBoundingBox(pBoundingBox: IRect3d, ppVertexes: float[], ppIndexes: uint[], fMinSize?: float): boolean;
        //function computeBoundingSphere(pVertexData: IVertexData, pSphere: ISphere, bFastMethod?: boolean, pBoundingBox?: IRect3d): boolean;
        //function computeBoundingSphereFast(pVertexData: IVertexData, pSphere: ISphere, pBoundingBox?: IRect3d): boolean;
        //function computeBoundingSphereMinimal(pVertexData: IVertexData, pSphere: ISphere): boolean;
        //function computeGeneralizingSphere(pSphereA: ISphere, pSphereB: ISphere, pSphereDest?: ISphere): boolean;
        //function computeDataForCascadeBoundingSphere(pBoundingSphere: ISphere, ppVertexes: float[], ppIndexes: uint[], fMinSize?: float): boolean;
        /**
        * Computes a coordinate-axis oriented bounding box.
        */
        function computeBoundingBox(pVertexData, pBoundingBox) {
            var fX0 = 0, fY0 = 0, fZ0 = 0, fX1 = 0, fY1 = 0, fZ1 = 0;
            var fTemp, pTempData;
            var i = 0;
            var pVertexDeclaration, pVertexElement, pData;
            var nStride, nCount;

            pVertexDeclaration = pVertexData.getVertexDeclaration();

            if (akra.isNull(pVertexDeclaration))
                return false;

            pVertexElement = pVertexDeclaration.findElement(usage.POSITION, 3);

            if (akra.isNull(pVertexElement))
                return false;

            nCount = pVertexData.getLength();
            nStride = pVertexElement.size;

            pData = pVertexData.getData(pVertexElement.offset, pVertexElement.size);

            if (akra.isNull(pData))
                return false;

            pTempData = new Float32Array(pData, 0, 3);
            fX0 = fX1 = pTempData[0];
            fY0 = fY1 = pTempData[1];
            fZ0 = fZ1 = pTempData[2];

            for (i = nStride; i < nStride * nCount; i += nStride) {
                pTempData = new Float32Array(pData, i, 3);
                fTemp = pTempData[0];
                fX0 = fX0 > fTemp ? fTemp : fX0; /*Min*/
                fX1 = fX1 > fTemp ? fX1 : fTemp; /*Max*/

                fTemp = pTempData[1];
                fY0 = fY0 > fTemp ? fTemp : fY0; /*Min*/
                fY1 = fY1 > fTemp ? fY1 : fTemp; /*Max*/

                fTemp = pTempData[2];
                fZ0 = fZ0 > fTemp ? fTemp : fZ0; /*Min*/
                fZ1 = fZ1 > fTemp ? fZ1 : fTemp; /*Max*/
            }

            pBoundingBox.set(fX0, fX1, fY0, fY1, fZ0, fZ1);

            return true;
        }
        geometry.computeBoundingBox = computeBoundingBox;

        /** расчет данных для отрисовки бокса */
        function computeDataForCascadeBoundingBox(pBoundingBox, ppVertexes, ppIndexes, fMinSize) {
            if (typeof fMinSize === "undefined") { fMinSize = .25; }
            var pInd;
            var pPoints;
            var i, j, k;

            pPoints = new Array(8);

            for (i = 0; i < 8; i++) {
                pPoints[i] = new Array(4);
                for (j = 0; j < 4; j++)
                    pPoints[i][j] = new Vec3(0);
            }

            //Выставление точек Rect3d
            pPoints[0][0].set([pBoundingBox.x0, pBoundingBox.y0, pBoundingBox.z0]);
            pPoints[1][0].set([pBoundingBox.x0, pBoundingBox.y1, pBoundingBox.z0]);
            pPoints[2][0].set([pBoundingBox.x0, pBoundingBox.y0, pBoundingBox.z1]);
            pPoints[3][0].set([pBoundingBox.x0, pBoundingBox.y1, pBoundingBox.z1]);
            pPoints[4][0].set([pBoundingBox.x1, pBoundingBox.y0, pBoundingBox.z0]);
            pPoints[5][0].set([pBoundingBox.x1, pBoundingBox.y1, pBoundingBox.z0]);
            pPoints[6][0].set([pBoundingBox.x1, pBoundingBox.y0, pBoundingBox.z1]);
            pPoints[7][0].set([pBoundingBox.x1, pBoundingBox.y1, pBoundingBox.z1]);

            var fTempFunc = function (pPoints, iPoint, iToPoint1, iToPoint2, iToPoint3) {
                for (var i = 0; i < 3; i++) {
                    pPoints[arguments[i + 2]][0].subtract(pPoints[iPoint][0], pPoints[iPoint][i + 1]);

                    if (pPoints[iPoint][i + 1].length() > fMinSize) {
                        pPoints[iPoint][i + 1].scale(0.1);
                    }

                    pPoints[iPoint][i + 1].add(pPoints[iPoint][0]);
                }
            };

            fTempFunc(pPoints, 0, 1, 2, 4);
            fTempFunc(pPoints, 1, 0, 3, 5);
            fTempFunc(pPoints, 2, 0, 3, 6);
            fTempFunc(pPoints, 3, 1, 2, 7);
            fTempFunc(pPoints, 4, 0, 5, 6);
            fTempFunc(pPoints, 5, 1, 4, 7);
            fTempFunc(pPoints, 6, 2, 4, 7);
            fTempFunc(pPoints, 7, 3, 5, 6);

            for (i = 0; i < 8; i++) {
                for (j = 0; j < 4; j++) {
                    ppVertexes[i * 12 + j * 3 + 0] = pPoints[i][j].x;
                    ppVertexes[i * 12 + j * 3 + 1] = pPoints[i][j].y;
                    ppVertexes[i * 12 + j * 3 + 2] = pPoints[i][j].z;
                }
            }

            pInd = [
                0, 1, 0, 2, 0, 3,
                4, 5, 4, 6, 4, 7,
                8, 9, 8, 10, 8, 11,
                12, 13, 12, 14, 12, 15,
                16, 17, 16, 18, 16, 19,
                20, 21, 20, 22, 20, 23,
                24, 25, 24, 26, 24, 27,
                28, 29, 28, 30, 28, 31
            ];

            for (var i = 0; i < pInd.length; ++i) {
                ppIndexes[i] = pInd[i];
            }

            return true;
        }
        geometry.computeDataForCascadeBoundingBox = computeDataForCascadeBoundingBox;

        /** подсчет обобщающей сферы над двумя сферами */
        function computeGeneralizingSphere(pSphereA, pSphereB, pSphereDest) {
            if (!akra.isDef(pSphereDest)) {
                pSphereDest = pSphereA;
            }

            var fR1 = pSphereA.radius;
            var fR2 = pSphereB.radius;
            var v3fC1 = pSphereA.center;
            var v3fC2 = pSphereB.center;

            var v3fD = new Vec3;

            v3fC1.subtract(v3fC2, v3fD);

            var fD = v3fD.length();

            if (fD < fR1 && fR1 > fR2) {
                pSphereDest.set(pSphereA);
                return false;
            }

            if (fD < fR2) {
                pSphereDest.set(pSphereB);
                return false;
            }

            var v3fN = new Vec3;
            v3fD.normalize(v3fN);

            pSphereDest.radius = v3fD.add(v3fN.scale(fR1 + fR2)).length() / 2.0;

            var v3fTemp = v3fD;
            pSphereDest.center = v3fC1.add(v3fC2, v3fTemp).add(v3fN.scale((fR1 - fR2) / (fR1 + fR2))).scale(.5);

            return true;
        }
        geometry.computeGeneralizingSphere = computeGeneralizingSphere;

        /** расчет данных для отрисовки сферы */
        function computeDataForCascadeBoundingSphere(pBoundingSphere, ppVertexes, ppIndexes, fMinSize) {
            if (typeof fMinSize === "undefined") { fMinSize = 0.25; }
            var fTheta, fDelta, fAlpha;
            var nCount = 10;
            var i, j, k;

            fDelta = akra.math.TWO_PI / nCount;

            for (i = 0; i <= nCount / 2; i++) {
                fTheta = -akra.math.PI + (i * fDelta);

                for (j = 0; j <= nCount; j++) {
                    fAlpha = j * fDelta;
                    ppVertexes[(i * (nCount + 1) + j) * 3 + 0] = pBoundingSphere.center.x + pBoundingSphere.radius * akra.math.sin(fTheta) * akra.math.cos(fAlpha);
                    ppVertexes[(i * (nCount + 1) + j) * 3 + 1] = pBoundingSphere.center.y + pBoundingSphere.radius * akra.math.sin(fTheta) * akra.math.sin(fAlpha);
                    ppVertexes[(i * (nCount + 1) + j) * 3 + 2] = pBoundingSphere.center.z + pBoundingSphere.radius * akra.math.cos(fTheta);
                }
            }

            for (i = 0; i < nCount / 2; i++) {
                for (j = 0; j < nCount; j++) {
                    ppIndexes[(i * (nCount) + j) * 12 + 0] = i * (nCount + 1) + j;
                    ppIndexes[(i * (nCount) + j) * 12 + 1] = i * (nCount + 1) + j + 1;

                    ppIndexes[(i * (nCount) + j) * 12 + 2] = i * (nCount + 1) + j + 2 + nCount;
                    ppIndexes[(i * (nCount) + j) * 12 + 3] = i * (nCount + 1) + j;

                    ppIndexes[(i * (nCount) + j) * 12 + 4] = i * (nCount + 1) + j + 1;
                    ppIndexes[(i * (nCount) + j) * 12 + 5] = i * (nCount + 1) + j + 2 + nCount;

                    ppIndexes[(i * (nCount) + j) * 12 + 6] = i * (nCount + 1) + j;
                    ppIndexes[(i * (nCount) + j) * 12 + 7] = i * (nCount + 1) + j + 1 + nCount;

                    ppIndexes[(i * (nCount) + j) * 12 + 8] = i * (nCount + 1) + j + 2 + nCount;
                    ppIndexes[(i * (nCount) + j) * 12 + 9] = i * (nCount + 1) + j + 1 + nCount;

                    ppIndexes[(i * (nCount) + j) * 12 + 10] = i * (nCount + 1) + j + 2 + nCount;
                    ppIndexes[(i * (nCount) + j) * 12 + 11] = i * (nCount + 1) + j;
                }
            }

            return true;
        }
        geometry.computeDataForCascadeBoundingSphere = computeDataForCascadeBoundingSphere;

        /**
        * Computes a bounding sphere.
        * При использование быстрого вычисления, опционально можно получить баундинг бокс.
        */
        function computeBoundingSphere(pVertexData, pSphere, bFastMethod, pBoundingBox) {
            if (typeof bFastMethod === "undefined") { bFastMethod = true; }
            if (typeof pBoundingBox === "undefined") { pBoundingBox = null; }
            if (bFastMethod) {
                return computeBoundingSphereFast(pVertexData, pSphere, pBoundingBox);
            } else {
                return computeBoundingSphereMinimal(pVertexData, pSphere);
            }
        }
        geometry.computeBoundingSphere = computeBoundingSphere;

        /**
        * Computes a bounding sphere - not minimal. Also if it need compute dounding box
        */
        function computeBoundingSphereFast(pVertexData, pSphere, pBoundingBox) {
            if (typeof pBoundingBox === "undefined") { pBoundingBox = null; }
            var i;
            var pVertexDeclaration, pVertexElement;
            var nCount, nStride;
            var pData, pTempData;

            pVertexDeclaration = pVertexData.getVertexDeclaration();

            if (akra.isNull(pVertexDeclaration)) {
                return false;
            }

            pVertexElement = pVertexDeclaration.findElement(usage.POSITION, 3);

            if (akra.isNull(pVertexElement)) {
                return false;
            }

            nCount = pVertexData.getLength();
            nStride = pVertexElement.size;

            pData = pVertexData.getData(pVertexElement.offset, pVertexElement.size);

            if (akra.isNull(pData)) {
                return false;
            }

            if (akra.isNull(pBoundingBox)) {
                pBoundingBox = akra.geometry.Rect3d.temp();
            }

            if (pBoundingBox.isClear()) {
                if (!computeBoundingBox(pVertexData, pBoundingBox)) {
                    return false;
                }
            }

            var fCenterX = (pBoundingBox.x0 + pBoundingBox.x1) / 2;
            var fCenterY = (pBoundingBox.y0 + pBoundingBox.y1) / 2;
            var fCenterZ = (pBoundingBox.z0 + pBoundingBox.z1) / 2;
            var fRadius = 0;
            var fDistance = 0;

            for (i = 0; i < nStride * nCount; i += nStride) {
                pTempData = new Float32Array(pData, i, 3);
                fDistance = (pTempData[0] - fCenterX) * (pTempData[0] - fCenterX) + (pTempData[1] - fCenterY) * (pTempData[1] - fCenterY) + (pTempData[2] - fCenterZ) * (pTempData[2] - fCenterZ);
                fRadius = fDistance > fRadius ? fDistance : fRadius;
            }

            pSphere.set(fCenterX, fCenterY, fCenterZ, akra.math.sqrt(fRadius));

            return true;
        }
        geometry.computeBoundingSphereFast = computeBoundingSphereFast;

        /**
        * Computes a bounding sphere - minimal.
        */
        function computeBoundingSphereMinimal(pVertexData, pSphere) {
            var i = 0, j = 0, k = 0;
            var points = [];
            var length = 0;
            var isAdd = false;
            var isNew = true;
            var fDiametr = 0;
            var fDistance = 0;

            var pVertexDeclaration, pVertexElement;
            var nCount, nStride;
            var pData, pTempData1, pTempData2;

            pVertexDeclaration = pVertexData.getVertexDeclaration();

            if (akra.isNull(pVertexData)) {
                return false;
            }

            if (akra.isNull(pVertexDeclaration)) {
                return false;
            }

            pVertexElement = pVertexDeclaration.findElement(usage.POSITION, 3);

            if (akra.isNull(pVertexElement))
                return false;

            nCount = pVertexData.getLength();
            nStride = pVertexElement.size;

            pData = pVertexData.getData(pVertexElement.offset, pVertexElement.size);

            if (!pData)
                return false;

            for (i = 0; i < nStride * nCount; i += nStride) {
                isNew = true;
                isAdd = false;
                pTempData1 = new Float32Array(pData, i, 3);

                for (k = 0; k < points.length; k += 3) {
                    if (points[k] == pTempData1[0] && points[k + 1] == pTempData1[1] && points[k + 2] == pTempData1[2]) {
                        isNew = false;
                        break;
                    }
                }

                if (isNew) {
                    for (j = i + nStride; j < nStride * nCount; j += nStride) {
                        pTempData2 = new Float32Array(pData, j, 3);
                        fDistance = (pTempData1[0] - pTempData2[0]) * (pTempData1[0] - pTempData2[0]) + (pTempData1[1] - pTempData2[1]) * (pTempData1[1] - pTempData2[1]) + (pTempData1[2] - pTempData2[2]) * (pTempData1[2] - pTempData2[2]);
                        if (fDistance > fDiametr) {
                            fDiametr = fDistance;
                            isAdd = true;
                            points[0] = pTempData2[0];
                            points[1] = pTempData2[1];
                            points[2] = pTempData2[2];
                            length = 3;
                        } else if (fDistance.toFixed(7) == fDiametr.toFixed(7)) {
                            isAdd = true;
                            for (k = 0; k < points.length; k += 3) {
                                if (points[k] == pTempData2[0] && points[k + 1] == pTempData2[1] && points[k + 2] == pTempData2[2]) {
                                    isNew = false;
                                    break;
                                }
                            }
                            if (isNew) {
                                points[length] = pTempData2[0];
                                points[length + 1] = pTempData2[1];
                                points[length + 2] = pTempData2[2];
                                length += 3;
                            }
                        }
                    }
                    if (isAdd) {
                        points[length] = pTempData1[0];
                        points[length + 1] = pTempData1[1];
                        points[length + 2] = pTempData1[2];
                        length += 3;
                    }
                }
            }

            var fX = 0, fY = 0, fZ = 0;

            for (i = 0; i < points.length; i += 3) {
                fX += points[i];
                fY += points[i + 1];
                fZ += points[i + 2];
            }

            var x = pSphere.center.x = fX / points.length * 3;
            var y = pSphere.center.y = fY / points.length * 3;
            var z = pSphere.center.z = fZ / points.length * 3;

            pSphere.radius = akra.math.sqrt((points[0] - x) * (points[0] - x) + (points[1] - y) * (points[1] - y) + (points[2] - z) * (points[2] - z));
            return true;
        }
        geometry.computeBoundingSphereMinimal = computeBoundingSphereMinimal;
    })(akra.geometry || (akra.geometry = {}));
    var geometry = akra.geometry;
})(akra || (akra = {}));
//# sourceMappingURL=geometry.js.map
