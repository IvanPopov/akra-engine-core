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

module akra.geometry {

	import Vec3 = math.Vec3;

	import usage = data.Usages;


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
	export function computeBoundingBox(pVertexData: IVertexData, pBoundingBox: IRect3d): boolean {
		var fX0: float = 0, fY0: float = 0, fZ0: float = 0,
			fX1: float = 0, fY1: float = 0, fZ1: float = 0;
		var fTemp: float, pTempData: Float32Array;
		var i: int = 0;
		var pVertexDeclaration: IVertexDeclaration, pVertexElement: IVertexElement, pData: ArrayBuffer;
		var nStride: uint, nCount: uint;


		pVertexDeclaration = pVertexData.getVertexDeclaration();

		if (isNull(pVertexDeclaration))
			return false;

		pVertexElement = pVertexDeclaration.findElement(usage.POSITION, 3);

		if (isNull(pVertexElement))
			return false;

		nCount = pVertexData.getLength();
		nStride = pVertexElement.size;

		pData = pVertexData.getData(pVertexElement.offset, pVertexElement.size);

		if (isNull(pData))
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

	/** расчет данных для отрисовки бокса */
	export function computeDataForCascadeBoundingBox(pBoundingBox: IRect3d, ppVertexes: float[], ppIndexes: uint[], fMinSize: float = .25): boolean {

		var pInd: uint[];
		var pPoints: IVec3[][];
		var i: int, j: int, k: int;

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

		var fTempFunc = function (pPoints: IVec3[][], iPoint: int, iToPoint1: int, iToPoint2: int, iToPoint3: int): void {
			for (var i = 0; i < 3; i++) {
				pPoints[arguments[i + 2]][0].subtract(pPoints[iPoint][0], pPoints[iPoint][i + 1]);

				if (pPoints[iPoint][i + 1].length() > fMinSize) {
					pPoints[iPoint][i + 1].scale(0.1);
				}

				pPoints[iPoint][i + 1].add(pPoints[iPoint][0]);
			}
		}

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

		for (var i: int = 0; i < pInd.length; ++i) {
			ppIndexes[i] = pInd[i];
		}

		return true;
	}


	/** подсчет обобщающей сферы над двумя сферами */
	export function computeGeneralizingSphere(pSphereA: ISphere, pSphereB: ISphere, pSphereDest?: ISphere): boolean {
		if (!isDef(pSphereDest)) {
			pSphereDest = pSphereA;
		}

		var fR1: float = pSphereA.radius;
		var fR2: float = pSphereB.radius;
		var v3fC1: IVec3 = pSphereA.center;
		var v3fC2: IVec3 = pSphereB.center;

		var v3fD: IVec3 = new Vec3;

		v3fC1.subtract(v3fC2, v3fD);

		var fD: float = v3fD.length();

		if (fD < fR1 && fR1 > fR2) {
			pSphereDest.set(pSphereA);
			return false;
		}

		if (fD < fR2) {
			pSphereDest.set(pSphereB);
			return false;
		}

		var v3fN: IVec3 = new Vec3;
		v3fD.normalize(v3fN);

		pSphereDest.radius = v3fD.add(v3fN.scale(fR1 + fR2)).length() / 2.0;

		var v3fTemp: IVec3 = v3fD;
		pSphereDest.center = v3fC1.add(v3fC2, v3fTemp).add(v3fN.scale((fR1 - fR2) / (fR1 + fR2))).scale(.5);

		return true;
	}

	/** расчет данных для отрисовки сферы */
	export function computeDataForCascadeBoundingSphere(
		pBoundingSphere: ISphere,
		ppVertexes: float[],
		ppIndexes: uint[],
		fMinSize: float = 0.25): boolean {

		var fTheta: float, fDelta: float, fAlpha: float;
		var nCount: uint = 10;
		var i: int, j: int, k: int;

		fDelta = math.TWO_PI / nCount;

		for (i = 0; i <= nCount / 2; i++) {
			fTheta = - math.PI + (i * fDelta);

			for (j = 0; j <= nCount; j++) {
				fAlpha = j * fDelta;
				ppVertexes[(i * (nCount + 1) + j) * 3 + 0] = pBoundingSphere.center.x + pBoundingSphere.radius * math.sin(fTheta) * math.cos(fAlpha);
				ppVertexes[(i * (nCount + 1) + j) * 3 + 1] = pBoundingSphere.center.y + pBoundingSphere.radius * math.sin(fTheta) * math.sin(fAlpha);
				ppVertexes[(i * (nCount + 1) + j) * 3 + 2] = pBoundingSphere.center.z + pBoundingSphere.radius * math.cos(fTheta);
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

	/** 
	 * Computes a bounding sphere.
	 * При использование быстрого вычисления, опционально можно получить баундинг бокс. 
	 */
	export function computeBoundingSphere(pVertexData: IVertexData, pSphere: ISphere, bFastMethod: boolean = true, pBoundingBox: IRect3d = null) {
		if (bFastMethod) {
			return computeBoundingSphereFast(pVertexData, pSphere, pBoundingBox);
		}
		else {
			return computeBoundingSphereMinimal(pVertexData, pSphere);
		}

	}

	/**
	 * Computes a bounding sphere - not minimal. Also if it need compute dounding box
	 */
	export function computeBoundingSphereFast(pVertexData: IVertexData, pSphere: ISphere, pBoundingBox: IRect3d = null): boolean {
		var i: int;
		var pVertexDeclaration: IVertexDeclaration, pVertexElement: IVertexElement;
		var nCount: uint, nStride: uint;
		var pData: ArrayBuffer, pTempData: Float32Array;

		pVertexDeclaration = pVertexData.getVertexDeclaration();

		if (isNull(pVertexDeclaration)) {
			return false;
		}


		pVertexElement = pVertexDeclaration.findElement(usage.POSITION, 3);

		if (isNull(pVertexElement)) {
			return false;
		}

		nCount = pVertexData.getLength();
		nStride = pVertexElement.size;

		pData = pVertexData.getData(pVertexElement.offset, pVertexElement.size);

		if (isNull(pData)) {
			return false;
		}

		if (isNull(pBoundingBox)) {
			pBoundingBox = Rect3d.temp();
		}

		if (pBoundingBox.isClear()) {
			if (!computeBoundingBox(pVertexData, pBoundingBox)) {
				return false;
			}
		}

		var fCenterX: float = (pBoundingBox.x0 + pBoundingBox.x1) / 2;
		var fCenterY: float = (pBoundingBox.y0 + pBoundingBox.y1) / 2;
		var fCenterZ: float = (pBoundingBox.z0 + pBoundingBox.z1) / 2;
		var fRadius: float = 0;
		var fDistance: float = 0;

		for (i = 0; i < nStride * nCount; i += nStride) {
			pTempData = new Float32Array(pData, i, 3);
			fDistance = (pTempData[0] - fCenterX) * (pTempData[0] - fCenterX) +
			(pTempData[1] - fCenterY) * (pTempData[1] - fCenterY) +
			(pTempData[2] - fCenterZ) * (pTempData[2] - fCenterZ);
			fRadius = fDistance > fRadius ? fDistance : fRadius;
		}

		pSphere.set(fCenterX, fCenterY, fCenterZ, math.sqrt(fRadius));

		return true;
	}



	/**
	 * Computes a bounding sphere - minimal.
	 */
	export function computeBoundingSphereMinimal(pVertexData: IVertexData, pSphere: ISphere): boolean {
		var i: int = 0, j: int = 0, k: int = 0;
		var points: float[] = [];
		var length: float = 0;
		var isAdd: boolean = false;
		var isNew: boolean = true;
		var fDiametr: float = 0;
		var fDistance: float = 0;

		var pVertexDeclaration: IVertexDeclaration, pVertexElement: IVertexElement;
		var nCount: uint, nStride: uint;
		var pData: ArrayBuffer, pTempData1: Float32Array, pTempData2: Float32Array;

		pVertexDeclaration = pVertexData.getVertexDeclaration();

		if (isNull(pVertexData)) {
			return false;
		}

		if (isNull(pVertexDeclaration)) {
			return false;
		}

		pVertexElement = pVertexDeclaration.findElement(usage.POSITION, 3);

		if (isNull(pVertexElement))
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
				if (points[k] == pTempData1[0] &&
					points[k + 1] == pTempData1[1] &&
					points[k + 2] == pTempData1[2]) {
					isNew = false;
					break;
				}
			}

			if (isNew) {
				for (j = i + nStride; j < nStride * nCount; j += nStride) {
					pTempData2 = new Float32Array(pData, j, 3);
					fDistance = (pTempData1[0] - pTempData2[0]) * (pTempData1[0] - pTempData2[0]) +
					(pTempData1[1] - pTempData2[1]) * (pTempData1[1] - pTempData2[1]) +
					(pTempData1[2] - pTempData2[2]) * (pTempData1[2] - pTempData2[2]);
					if (fDistance > fDiametr) {
						fDiametr = fDistance;
						isAdd = true;
						points[0] = pTempData2[0];
						points[1] = pTempData2[1];
						points[2] = pTempData2[2];
						length = 3;
					}
					else if (fDistance.toFixed(7) == fDiametr.toFixed(7)) {
						isAdd = true;
						for (k = 0; k < points.length; k += 3) {
							if (points[k] == pTempData2[0] &&
								points[k + 1] == pTempData2[1] &&
								points[k + 2] == pTempData2[2]) {
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
					length += 3
				}
			}
		}

		var fX: float = 0, fY: float = 0, fZ: float = 0;

		for (i = 0; i < points.length; i += 3) {
			fX += points[i];
			fY += points[i + 1];
			fZ += points[i + 2];
		}

		var x: float = pSphere.center.x = fX / points.length * 3;
		var y: float = pSphere.center.y = fY / points.length * 3;
		var z: float = pSphere.center.z = fZ / points.length * 3;

		pSphere.radius = math.sqrt((points[0] - x) * (points[0] - x) +
			(points[1] - y) * (points[1] - y) +
			(points[2] - z) * (points[2] - z));
		return true;
	}

}