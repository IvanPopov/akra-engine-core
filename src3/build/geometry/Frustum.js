/// <reference path="../idl/AIFrustum.ts" />
/// <reference path="../idl/AEPlaneClassifications.ts" />
define(["require", "exports", "logger", "classify", "geometry/Plane3d"], function(require, exports, __logger__, __classify__, __Plane3d__) {
    var logger = __logger__;
    
    var classify = __classify__;

    var Plane3d = __Plane3d__;

    
    var Vec3 = math.Vec3;
    var Vec4 = math.Vec4;

    //import Quat4 = math.Quat4;
    var Mat3 = math.Mat3;

    var Frustum = (function () {
        function Frustum(pLeftPlane, pRightPlane, pTopPlane, pBottomPlane, pNearPlane, pFarPlane) {
            this._pFrustumVertices = null;
            this.leftPlane = new Plane3d();
            this.rightPlane = new Plane3d();
            this.topPlane = new Plane3d();
            this.bottomPlane = new Plane3d();
            this.nearPlane = new Plane3d();
            this.farPlane = new Plane3d();

            var nArgumentsLength = arguments.length;

            switch (nArgumentsLength) {
                case 1:
                    this.set(arguments[0]);
                    break;
                case 6:
                    this.set(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                    break;
                default:
                    break;
            }
        }
        Object.defineProperty(Frustum.prototype, "frustumVertices", {
            get: /** inline */ function () {
                return this._pFrustumVertices;
            },
            enumerable: true,
            configurable: true
        });

        Frustum.prototype.set = function (pLeftPlane, pRightPlane, pTopPlane, pBottomPlane, pNearPlane, pFarPlane) {
            var nArgumentsLength = arguments.length;

            switch (nArgumentsLength) {
                case 1:
                    var pFrustum = arguments[0];

                    this.leftPlane.set(pFrustum.leftPlane);
                    this.rightPlane.set(pFrustum.rightPlane);
                    this.topPlane.set(pFrustum.topPlane);
                    this.bottomPlane.set(pFrustum.bottomPlane);
                    this.nearPlane.set(pFrustum.nearPlane);
                    this.farPlane.set(pFrustum.farPlane);
                    break;
                case 6:
                    this.leftPlane.set(arguments[0]);
                    this.rightPlane.set(arguments[1]);
                    this.topPlane.set(arguments[2]);
                    this.bottomPlane.set(arguments[3]);
                    this.nearPlane.set(arguments[4]);
                    this.farPlane.set(arguments[5]);
                    break;
                default:
                    this.leftPlane.clear();
                    this.rightPlane.clear();
                    this.topPlane.clear();
                    this.bottomPlane.clear();
                    this.nearPlane.clear();
                    this.farPlane.clear();
                    break;
            }

            return this;
        };

        Frustum.prototype.calculateFrustumVertices = function () {
            if (this._pFrustumVertices == null) {
                this._pFrustumVertices = new Array(8);

                for (var i = 0; i < 8; i++) {
                    this._pFrustumVertices[i] = new Vec3();
                }
            }

            var v3fLeftNormal = this.leftPlane.normal;
            var v3fRightNormal = this.rightPlane.normal;
            var v3fTopNormal = this.topPlane.normal;
            var v3fBottomNormal = this.bottomPlane.normal;
            var v3fNearNormal = this.nearPlane.normal;
            var v3fFarNormal = this.farPlane.normal;

            var fLeft = -this.leftPlane.distance;
            var fRight = -this.rightPlane.distance;
            var fTop = -this.topPlane.distance;
            var fBottom = -this.bottomPlane.distance;
            var fNear = -this.nearPlane.distance;
            var fFar = -this.farPlane.distance;

            var m3fTemp = Mat3.temp();
            var pFrustumVertices = this._pFrustumVertices;

            //first left-bottom-near
            pFrustumVertices[0].set(fLeft, fBottom, fNear);
            m3fTemp.set(v3fLeftNormal.x, v3fBottomNormal.x, v3fNearNormal.x, v3fLeftNormal.y, v3fBottomNormal.y, v3fNearNormal.y, v3fLeftNormal.z, v3fBottomNormal.z, v3fNearNormal.z);
            m3fTemp.inverse().multiplyVec3(pFrustumVertices[0]);

            //second right-bottom-near
            pFrustumVertices[1].set(fRight, fBottom, fNear);
            m3fTemp.set(v3fRightNormal.x, v3fBottomNormal.x, v3fNearNormal.x, v3fRightNormal.y, v3fBottomNormal.y, v3fNearNormal.y, v3fRightNormal.z, v3fBottomNormal.z, v3fNearNormal.z);
            m3fTemp.inverse().multiplyVec3(pFrustumVertices[1]);

            //third left-top-near
            pFrustumVertices[2].set(fLeft, fTop, fNear);
            m3fTemp.set(v3fLeftNormal.x, v3fTopNormal.x, v3fNearNormal.x, v3fLeftNormal.y, v3fTopNormal.y, v3fNearNormal.y, v3fLeftNormal.z, v3fTopNormal.z, v3fNearNormal.z);
            m3fTemp.inverse().multiplyVec3(pFrustumVertices[2]);

            //forth right-top-near
            pFrustumVertices[3].set(fRight, fTop, fNear);
            m3fTemp.set(v3fRightNormal.x, v3fTopNormal.x, v3fNearNormal.x, v3fRightNormal.y, v3fTopNormal.y, v3fNearNormal.y, v3fRightNormal.z, v3fTopNormal.z, v3fNearNormal.z);
            m3fTemp.inverse().multiplyVec3(pFrustumVertices[3]);

            //fifth left-bottom-far
            pFrustumVertices[4].set(fLeft, fBottom, fFar);
            m3fTemp.set(v3fLeftNormal.x, v3fBottomNormal.x, v3fFarNormal.x, v3fLeftNormal.y, v3fBottomNormal.y, v3fFarNormal.y, v3fLeftNormal.z, v3fBottomNormal.z, v3fFarNormal.z);
            m3fTemp.inverse().multiplyVec3(pFrustumVertices[4]);

            //sixth right-bottom-far
            pFrustumVertices[5].set(fRight, fBottom, fFar);
            m3fTemp.set(v3fRightNormal.x, v3fBottomNormal.x, v3fFarNormal.x, v3fRightNormal.y, v3fBottomNormal.y, v3fFarNormal.y, v3fRightNormal.z, v3fBottomNormal.z, v3fFarNormal.z);
            m3fTemp.inverse().multiplyVec3(pFrustumVertices[5]);

            //seventh left-top-far
            pFrustumVertices[6].set(fLeft, fTop, fFar);
            m3fTemp.set(v3fLeftNormal.x, v3fTopNormal.x, v3fFarNormal.x, v3fLeftNormal.y, v3fTopNormal.y, v3fFarNormal.y, v3fLeftNormal.z, v3fTopNormal.z, v3fFarNormal.z);
            m3fTemp.inverse().multiplyVec3(pFrustumVertices[6]);

            //eighth right-top-far
            pFrustumVertices[7].set(fRight, fTop, fFar);
            m3fTemp.set(v3fRightNormal.x, v3fTopNormal.x, v3fFarNormal.x, v3fRightNormal.y, v3fTopNormal.y, v3fFarNormal.y, v3fRightNormal.z, v3fTopNormal.z, v3fFarNormal.z);
            m3fTemp.inverse().multiplyVec3(pFrustumVertices[7]);

            return pFrustumVertices;
        };

        Frustum.prototype.extractFromMatrix = function (m4fProjection, m4fWorld, pSearchRect) {
            if (isNull(this._pFrustumVertices)) {
                this._pFrustumVertices = new Array(8);

                for (var i = 0; i < 8; i++) {
                    this._pFrustumVertices[i] = new Vec3();
                }
            }

            var pFrustumVertices = this._pFrustumVertices;

            var v4fLeftBottomNear = Vec4.temp();
            var v4fRightBottomNear = Vec4.temp();
            var v4fLeftTopNear = Vec4.temp();
            var v4fRightTopNear = Vec4.temp();

            var v4fLeftBottomFar = Vec4.temp();
            var v4fRightBottomFar = Vec4.temp();
            var v4fLeftTopFar = Vec4.temp();
            var v4fRightTopFar = Vec4.temp();

            m4fProjection.unproj(vec3(-1, -1, -1), v4fLeftBottomNear);
            m4fProjection.unproj(vec3(1, -1, -1), v4fRightBottomNear);
            m4fProjection.unproj(vec3(-1, 1, -1), v4fLeftTopNear);
            m4fProjection.unproj(vec3(1, 1, -1), v4fRightTopNear);

            m4fProjection.unproj(vec3(-1, -1, 1), v4fLeftBottomFar);
            m4fProjection.unproj(vec3(1, -1, 1), v4fRightBottomFar);
            m4fProjection.unproj(vec3(-1, 1, 1), v4fLeftTopFar);
            m4fProjection.unproj(vec3(1, 1, 1), v4fRightTopFar);

            if (isDef(m4fWorld)) {
                m4fWorld.multiplyVec4(v4fLeftBottomNear);
                m4fWorld.multiplyVec4(v4fRightBottomNear);
                m4fWorld.multiplyVec4(v4fLeftTopNear);
                m4fWorld.multiplyVec4(v4fRightTopNear);

                m4fWorld.multiplyVec4(v4fLeftBottomFar);
                m4fWorld.multiplyVec4(v4fRightBottomFar);
                m4fWorld.multiplyVec4(v4fLeftTopFar);
                m4fWorld.multiplyVec4(v4fRightTopFar);
            }

            var v3fLeftBottomNear = pFrustumVertices[0].set(v4fLeftBottomNear.xyz);
            var v3fRightBottomNear = pFrustumVertices[1].set(v4fRightBottomNear.xyz);
            var v3fLeftTopNear = pFrustumVertices[2].set(v4fLeftTopNear.xyz);
            var v3fRightTopNear = pFrustumVertices[3].set(v4fRightTopNear.xyz);

            var v3fLeftBottomFar = pFrustumVertices[4].set(v4fLeftBottomFar.xyz);
            var v3fRightBottomFar = pFrustumVertices[5].set(v4fRightBottomFar.xyz);
            var v3fLeftTopFar = pFrustumVertices[6].set(v4fLeftTopFar.xyz);
            var v3fRightTopFar = pFrustumVertices[7].set(v4fRightTopFar.xyz);

            if (isDef(pSearchRect)) {
                pSearchRect.set(v3fLeftBottomNear, v3fLeftBottomNear);

                pSearchRect.unionPoint(v3fRightBottomNear);
                pSearchRect.unionPoint(v3fLeftTopNear);
                pSearchRect.unionPoint(v3fRightTopNear);

                pSearchRect.unionPoint(v3fLeftBottomFar);
                pSearchRect.unionPoint(v3fRightBottomFar);
                pSearchRect.unionPoint(v3fLeftTopFar);
                pSearchRect.unionPoint(v3fRightTopFar);
            }

            //calculating planes
            this.leftPlane.set(v3fLeftTopNear, v3fLeftTopFar, v3fLeftBottomNear);
            this.rightPlane.set(v3fRightBottomFar, v3fRightTopFar, v3fRightBottomNear);
            this.topPlane.set(v3fLeftTopNear, v3fRightTopNear, v3fLeftTopFar);
            this.bottomPlane.set(v3fRightBottomFar, v3fRightBottomNear, v3fLeftBottomFar);
            this.nearPlane.set(v3fLeftTopNear, v3fLeftBottomNear, v3fRightTopNear);
            this.farPlane.set(v3fRightBottomFar, v3fLeftBottomFar, v3fRightTopFar);

            return this;
        };

        /** inline */ Frustum.prototype.isEqual = function (pFrustum) {
            return (this.leftPlane.isEqual(pFrustum.leftPlane) && this.rightPlane.isEqual(pFrustum.rightPlane) && this.topPlane.isEqual(pFrustum.topPlane) && this.bottomPlane.isEqual(pFrustum.bottomPlane) && this.nearPlane.isEqual(pFrustum.nearPlane) && this.farPlane.isEqual(pFrustum.farPlane));
        };

        //output - array of vertices in counterclockwise order (around plane normal as axis)
        //if destination don't submitted returned array from temp vectors
        Frustum.prototype.getPlanePoints = function (sPlaneKey, pDestination) {
            var pPoints = (arguments.length === 2) ? pDestination : [vec3(), vec3(), vec3(), vec3()];

            var pFrustumVertices = this.frustumVertices;
            if (pFrustumVertices === null) {
                pFrustumVertices = this.calculateFrustumVertices();
            }

            switch (sPlaneKey) {
                case "leftPlane":
                    pPoints[0].set(pFrustumVertices[6]);
                    pPoints[1].set(pFrustumVertices[4]);
                    pPoints[2].set(pFrustumVertices[0]);
                    pPoints[3].set(pFrustumVertices[2]);
                    break;
                case "rightPlane":
                    pPoints[0].set(pFrustumVertices[7]);
                    pPoints[1].set(pFrustumVertices[3]);
                    pPoints[2].set(pFrustumVertices[1]);
                    pPoints[3].set(pFrustumVertices[5]);
                    break;
                case "topPlane":
                    pPoints[0].set(pFrustumVertices[7]);
                    pPoints[1].set(pFrustumVertices[6]);
                    pPoints[2].set(pFrustumVertices[2]);
                    pPoints[3].set(pFrustumVertices[3]);
                    break;
                case "bottomPlane":
                    pPoints[0].set(pFrustumVertices[5]);
                    pPoints[1].set(pFrustumVertices[1]);
                    pPoints[2].set(pFrustumVertices[0]);
                    pPoints[3].set(pFrustumVertices[4]);
                    break;
                case "nearPlane":
                    pPoints[0].set(pFrustumVertices[3]);
                    pPoints[1].set(pFrustumVertices[2]);
                    pPoints[2].set(pFrustumVertices[0]);
                    pPoints[3].set(pFrustumVertices[1]);
                    break;
                case "farPlane":
                    pPoints[0].set(pFrustumVertices[7]);
                    pPoints[1].set(pFrustumVertices[5]);
                    pPoints[2].set(pFrustumVertices[4]);
                    pPoints[3].set(pFrustumVertices[6]);
                    break;
                default:
                    logger.assert(false, "invalid plane key");
                    break;
            }
            return pPoints;
        };

        Frustum.prototype.testPoint = function (v3fPoint) {
            if (this.leftPlane.signedDistance(v3fPoint) > 0. || this.rightPlane.signedDistance(v3fPoint) > 0. || this.topPlane.signedDistance(v3fPoint) > 0. || this.bottomPlane.signedDistance(v3fPoint) > 0. || this.nearPlane.signedDistance(v3fPoint) > 0. || this.farPlane.signedDistance(v3fPoint) > 0.) {
                return false;
            }
            return true;
        };

        Frustum.prototype.testRect = function (pRect) {
            if (classify.planeRect3d(this.leftPlane, pRect) == AEPlaneClassifications.PLANE_FRONT || classify.planeRect3d(this.rightPlane, pRect) == AEPlaneClassifications.PLANE_FRONT || classify.planeRect3d(this.topPlane, pRect) == AEPlaneClassifications.PLANE_FRONT || classify.planeRect3d(this.bottomPlane, pRect) == AEPlaneClassifications.PLANE_FRONT || classify.planeRect3d(this.nearPlane, pRect) == AEPlaneClassifications.PLANE_FRONT || classify.planeRect3d(this.farPlane, pRect) == AEPlaneClassifications.PLANE_FRONT) {
                return false;
            }
            return true;
        };

        Frustum.prototype.testSphere = function (pSphere) {
            if (classify.planeSphere(this.leftPlane, pSphere) == AEPlaneClassifications.PLANE_FRONT || classify.planeSphere(this.rightPlane, pSphere) == AEPlaneClassifications.PLANE_FRONT || classify.planeSphere(this.topPlane, pSphere) == AEPlaneClassifications.PLANE_FRONT || classify.planeSphere(this.bottomPlane, pSphere) == AEPlaneClassifications.PLANE_FRONT || classify.planeSphere(this.nearPlane, pSphere) == AEPlaneClassifications.PLANE_FRONT || classify.planeSphere(this.farPlane, pSphere) == AEPlaneClassifications.PLANE_FRONT) {
                return false;
            }
            return true;
        };

        Frustum.prototype.testFrustum = function (pFrustum) {
            var pFrustumVertices1 = this.frustumVertices;
            var pFrustumVertices2 = pFrustum.frustumVertices;

            if (pFrustumVertices1 == null) {
                pFrustumVertices1 = this.calculateFrustumVertices();
            }
            if (pFrustumVertices2 == null) {
                pFrustumVertices2 = pFrustum.calculateFrustumVertices();
            }

            var pFrustumPlanes = Frustum.frustumPlanesKeys;

            var nTest;

            for (var i = 0; i < 6; i++) {
                var pPlane = this[pFrustumPlanes[i]];

                nTest = 0;

                for (var j = 0; j < 8; j++) {
                    if (pPlane.signedDistance(pFrustumVertices2[j]) > 0) {
                        nTest++;
                    }
                }

                if (nTest == 8) {
                    //frustums don't intersecting
                    return false;
                }
            }

            for (var i = 0; i < 6; i++) {
                var pPlane = pFrustum[pFrustumPlanes[i]];

                nTest = 0;

                for (var j = 0; j < 8; j++) {
                    if (pPlane.signedDistance(pFrustumVertices1[j]) > 0) {
                        nTest++;
                    }
                }

                if (nTest == 8) {
                    //frustums don't intersecting
                    return false;
                }
            }

            return true;
        };

        Frustum.prototype.getViewDirection = function (v3fDirection) {
            if (!isDef(v3fDirection)) {
                v3fDirection = new Vec3();
            }

            v3fDirection.set(0);

            if (isNull(this._pFrustumVertices)) {
                this.calculateFrustumVertices();
            }

            for (var i = 4; i < 8; i++) {
                v3fDirection.add(this._pFrustumVertices[i]);
            }

            for (var i = 0; i < 4; i++) {
                v3fDirection.subtract(this._pFrustumVertices[i]);
            }

            return v3fDirection.normalize();
        };

        Frustum.prototype.toString = function () {
            var sStr = "";

            for (var i = 0; i < 6; i++) {
                var sKey = Frustum.frustumPlanesKeys[i];
                sStr += sKey + ":\n";
                sStr += this[sKey].toString() + "\n";
            }

            return sStr;
        };

        Frustum.frustumPlanesKeys = [
            "leftPlane",
            "rightPlane",
            "topPlane",
            "bottomPlane",
            "nearPlane",
            "farPlane"
        ];
        return Frustum;
    })();
});
//# sourceMappingURL=Frustum.js.map
