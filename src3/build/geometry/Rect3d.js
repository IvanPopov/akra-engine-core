/// <reference path="../idl/AIRect3d.ts" />
define(["require", "exports", "math", "generate", "logger", "geometry/Rect2d"], function(require, exports, __math__, __gen__, __logger__, __Rect2d__) {
    var math = __math__;
    var gen = __gen__;
    var logger = __logger__;
    var Rect2d = __Rect2d__;
    
    var Vec3 = math.Vec3;

    var pBuffer;
    var iElement;

    var Rect3d = (function () {
        function Rect3d(fX0, fX1, fY0, fY1, fZ0, fZ1) {
            var nArgumentsLength = arguments.length;

            switch (nArgumentsLength) {
                case 1:
                    this.set(arguments[0]);
                    break;
                case 2:
                    this.set(arguments[0], arguments[1]);
                    break;
                case 3:
                    this.set(arguments[0], arguments[1], arguments[2]);
                    break;
                case 6:
                    this.set(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                    break;
                default:
                    this.x0 = this.x1 = this.y0 = this.y1 = this.z0 = this.z1 = 0.;
                    break;
            }
        }
        Object.defineProperty(Rect3d.prototype, "rect2d", {
            get: function () {
                return new Rect2d(this.x0, this.x1, this.y0, this.y1);
            },
            set: function (pRect) {
                this.x0 = pRect.x0;
                this.x1 = pRect.x1;
                this.y0 = pRect.y0;
                this.y1 = pRect.y1;
            },
            enumerable: true,
            configurable: true
        });


        Rect3d.prototype.set = function (fX0, fX1, fY0, fY1, fZ0, fZ1) {
            var nArgumentsLength = arguments.length;

            switch (nArgumentsLength) {
                case 1:
                    if (arguments[0] instanceof Rect3d) {
                        var pRect = arguments[0];

                        this.x0 = pRect.x0;
                        this.x1 = pRect.x1;
                        this.y0 = pRect.y0;
                        this.y1 = pRect.y1;
                        this.z0 = pRect.z0;
                        this.z1 = pRect.z1;
                    } else {
                        var v3fSize = arguments[0];

                        this.x1 = v3fSize.x * 0.5;
                        this.x0 = -this.x1;

                        this.y1 = v3fSize.y * 0.5;
                        this.y0 = -this.y1;

                        this.z1 = v3fSize.z * 0.5;
                        this.z0 = -this.z1;
                    }
                    break;
                case 2:
                    var v3fMinPoint = arguments[0];
                    var v3fMaxPoint = arguments[1];

                    this.x0 = v3fMinPoint.x;
                    this.y0 = v3fMinPoint.y;
                    this.z0 = v3fMinPoint.z;

                    this.x1 = v3fMaxPoint.x;
                    this.y1 = v3fMaxPoint.y;
                    this.z1 = v3fMaxPoint.z;
                    break;
                case 3:
                    var fSizeX = arguments[0];
                    var fSizeY = arguments[1];
                    var fSizeZ = arguments[2];

                    this.x1 = fSizeX * 0.5;
                    this.x0 = -this.x1;

                    this.y1 = fSizeY * 0.5;
                    this.y0 = -this.y1;

                    this.z1 = fSizeZ * 0.5;
                    this.z0 = -this.z1;
                    break;
                case 6:
                    this.x0 = arguments[0];
                    this.x1 = arguments[1];

                    this.y0 = arguments[2];
                    this.y1 = arguments[3];

                    this.z0 = arguments[4];
                    this.z1 = arguments[5];
                    break;
                default:
                    this.x0 = this.x1 = this.y0 = this.y1 = this.z0 = this.z1 = 0.;
                    break;
            }
            return this;
        };

        Rect3d.prototype.setFloor = function (pRect) {
            this.x0 = math.floor(pRect.x0);
            this.x1 = math.floor(pRect.x1);
            this.y0 = math.floor(pRect.y0);
            this.y1 = math.floor(pRect.y1);
            this.z0 = math.floor(pRect.z0);
            this.z1 = math.floor(pRect.z1);

            return this;
        };

        Rect3d.prototype.setCeil = function (pRect) {
            this.x0 = math.ceil(pRect.x0);
            this.x1 = math.ceil(pRect.x1);
            this.y0 = math.ceil(pRect.y0);
            this.y1 = math.ceil(pRect.y1);
            this.z0 = math.ceil(pRect.z0);
            this.z1 = math.ceil(pRect.z1);

            return this;
        };

        /** inline */ Rect3d.prototype.clear = function () {
            this.x0 = this.x1 = this.y0 = this.y1 = this.z0 = this.z1 = 0.;
            return this;
        };

        Rect3d.prototype.addSelf = function (v3fVec) {
            if (isFloat(arguments[0])) {
                var fValue = arguments[0];

                this.x0 += fValue;
                this.x1 += fValue;
                this.y0 += fValue;
                this.y1 += fValue;
                this.z0 += fValue;
                this.z1 += fValue;
            } else {
                var v3fVec = arguments[0];

                this.x0 += v3fVec.x;
                this.x1 += v3fVec.x;

                this.y0 += v3fVec.y;
                this.y1 += v3fVec.y;

                this.z0 += v3fVec.z;
                this.z1 += v3fVec.z;
            }

            return this;
        };

        Rect3d.prototype.subSelf = function (v3fVec) {
            if (isFloat(arguments[0])) {
                var fValue = arguments[0];

                this.x0 -= fValue;
                this.x1 -= fValue;
                this.y0 -= fValue;
                this.y1 -= fValue;
                this.z0 -= fValue;
                this.z1 -= fValue;
            } else {
                var v3fVec = arguments[0];

                this.x0 -= v3fVec.x;
                this.x1 -= v3fVec.x;

                this.y0 -= v3fVec.y;
                this.y1 -= v3fVec.y;

                this.z0 -= v3fVec.z;
                this.z1 -= v3fVec.z;
            }

            return this;
        };

        Rect3d.prototype.multSelf = function (v3fVec) {
            if (isFloat(arguments[0])) {
                var fValue = arguments[0];

                this.x0 *= fValue;
                this.x1 *= fValue;
                this.y0 *= fValue;
                this.y1 *= fValue;
                this.z0 *= fValue;
                this.z1 *= fValue;
            } else {
                var v3fVec = arguments[0];

                this.x0 *= v3fVec.x;
                this.x1 *= v3fVec.x;

                this.y0 *= v3fVec.y;
                this.y1 *= v3fVec.y;

                this.z0 *= v3fVec.z;
                this.z1 *= v3fVec.z;
            }

            return this;
        };

        Rect3d.prototype.divSelf = function (v3fVec) {
            if (isFloat(arguments[0])) {
                var fValue = arguments[0];

                logger.assert(fValue != 0.0, "divide by zero error");

                var fInvValue = 1. / fValue;

                this.x0 *= fInvValue;
                this.x1 *= fInvValue;
                this.y0 *= fInvValue;
                this.y1 *= fInvValue;
                this.z0 *= fInvValue;
                this.z1 *= fInvValue;
            } else {
                var v3fVec = arguments[0];

                logger.assert(v3fVec.x != 0.0, "divide by zero error");
                logger.assert(v3fVec.y != 0.0, "divide by zero error");
                logger.assert(v3fVec.z != 0.0, "divide by zero error");

                var fInvX = 1. / v3fVec.x;
                var fInvY = 1. / v3fVec.y;
                var fInvZ = 1. / v3fVec.z;

                this.x0 *= fInvX;
                this.x1 *= fInvX;

                this.y0 *= fInvY;
                this.y1 *= fInvY;

                this.z0 *= fInvZ;
                this.z1 *= fInvZ;
            }

            return this;
        };

        Rect3d.prototype.offset = function (fOffsetX, fOffsetY, fOffsetZ) {
            if (arguments.length === 1) {
                var v3fOffset = arguments[0];

                this.x0 += v3fOffset.x;
                this.x1 += v3fOffset.x;

                this.y0 += v3fOffset.y;
                this.y1 += v3fOffset.y;

                this.z0 += v3fOffset.z;
                this.z1 += v3fOffset.z;
            } else {
                this.x0 += arguments[0];
                this.x1 += arguments[0];

                this.y0 += arguments[1];
                this.y1 += arguments[1];

                this.z0 += arguments[2];
                this.z1 += arguments[2];
            }

            return this;
        };

        Rect3d.prototype.expand = function (fValueX, fValueY, fValueZ) {
            if (arguments.length === 1) {
                if (isFloat(arguments[0])) {
                    var fValue = arguments[0];

                    this.x0 -= fValue;
                    this.x1 += fValue;

                    this.y0 -= fValue;
                    this.y1 += fValue;

                    this.z0 -= fValue;
                    this.z1 += fValue;
                } else {
                    var v3fVec = arguments[0];

                    this.x0 -= v3fVec.x;
                    this.x1 += v3fVec.x;

                    this.y0 -= v3fVec.y;
                    this.y1 += v3fVec.y;

                    this.z0 -= v3fVec.z;
                    this.z1 += v3fVec.z;
                }
            } else {
                //arguments.length === 3
                this.x0 -= arguments[0];
                this.x1 += arguments[0];

                this.y0 -= arguments[1];
                this.y1 += arguments[1];

                this.z0 -= arguments[2];
                this.z1 += arguments[2];
            }

            return this;
        };

        /** inline */ Rect3d.prototype.expandX = function (fValue) {
            this.x0 -= fValue;
            this.x1 += fValue;

            return this;
        };

        /** inline */ Rect3d.prototype.expandY = function (fValue) {
            this.y0 -= fValue;
            this.y1 += fValue;

            return this;
        };

        /** inline */ Rect3d.prototype.expandZ = function (fValue) {
            this.z0 -= fValue;
            this.z1 += fValue;

            return this;
        };

        Rect3d.prototype.resize = function (fSizeX, fSizeY, fSizeZ) {
            var fSizeX, fSizeY, fSizeZ;

            if (arguments.length === 1) {
                var v3fSize = arguments[0];

                fSizeX = v3fSize.x;
                fSizeY = v3fSize.y;
                fSizeZ = v3fSize.z;
            } else {
                fSizeX = arguments[0];
                fSizeY = arguments[1];
                fSizeZ = arguments[2];
            }

            this.x1 = (this.x0 + this.x1 + fSizeX) * 0.5;
            this.x0 = this.x1 - fSizeX;

            this.y1 = (this.y0 + this.y1 + fSizeY) * 0.5;
            this.y0 = this.y1 - fSizeY;

            this.z1 = (this.z0 + this.z1 + fSizeZ) * 0.5;
            this.z0 = this.z1 - fSizeZ;

            return this;
        };

        /** inline */ Rect3d.prototype.resizeX = function (fSize) {
            this.x1 = (this.x0 + this.x1 + fSize) * 0.5;
            this.x0 = this.x1 - fSize;

            return this;
        };

        /** inline */ Rect3d.prototype.resizeY = function (fSize) {
            this.y1 = (this.y0 + this.y1 + fSize) * 0.5;
            this.y0 = this.y1 - fSize;

            return this;
        };

        /** inline */ Rect3d.prototype.resizeZ = function (fSize) {
            this.z1 = (this.z0 + this.z1 + fSize) * 0.5;
            this.z0 = this.z1 - fSize;

            return this;
        };

        Rect3d.prototype.resizeMax = function (fSpanX, fSpanY, fSpanZ) {
            if (arguments.length === 1) {
                var v3fSpan = arguments[0];

                this.x1 = this.x0 + v3fSpan.x;
                this.y1 = this.y0 + v3fSpan.y;
                this.z1 = this.z0 + v3fSpan.z;
            } else {
                //arguments.length === 3
                this.x1 = this.x0 + arguments[0];
                this.y1 = this.y0 + arguments[1];
                this.z1 = this.z0 + arguments[2];
            }

            return this;
        };

        /** inline */ Rect3d.prototype.resizeMaxX = function (fSpan) {
            this.x1 = this.x0 + fSpan;
            return this;
        };

        /** inline */ Rect3d.prototype.resizeMaxY = function (fSpan) {
            this.y1 = this.y0 + fSpan;
            return this;
        };

        /** inline */ Rect3d.prototype.resizeMaxZ = function (fSpan) {
            this.z1 = this.z0 + fSpan;
            return this;
        };

        Rect3d.prototype.resizeMin = function (fSpanX, fSpanY, fSpanZ) {
            if (arguments.length === 1) {
                var v3fSpan = arguments[0];

                this.x0 = this.x1 - v3fSpan.x;
                this.y0 = this.y1 - v3fSpan.y;
                this.z0 = this.z1 - v3fSpan.z;
            } else {
                //arguments.length === 3
                this.x0 = this.x1 - arguments[0];
                this.y0 = this.y1 - arguments[1];
                this.z0 = this.z1 - arguments[2];
            }

            return this;
        };

        /** inline */ Rect3d.prototype.resizeMinX = function (fSpan) {
            this.x0 = this.x1 - fSpan;
            return this;
        };

        /** inline */ Rect3d.prototype.resizeMinY = function (fSpan) {
            this.y0 = this.y1 - fSpan;
            return this;
        };

        /** inline */ Rect3d.prototype.resizeMinZ = function (fSpan) {
            this.z0 = this.z1 - fSpan;
            return this;
        };

        Rect3d.prototype.unionPoint = function (fX, fY, fZ) {
            if (arguments.length === 1) {
                var v3fPoint = arguments[0];

                this.x0 = math.min(this.x0, v3fPoint.x);
                this.x1 = math.max(this.x1, v3fPoint.x);

                this.y0 = math.min(this.y0, v3fPoint.y);
                this.y1 = math.max(this.y1, v3fPoint.y);

                this.z0 = math.min(this.z0, v3fPoint.z);
                this.z1 = math.max(this.z1, v3fPoint.z);
            } else {
                //arguments.length === 3
                this.x0 = math.min(this.x0, arguments[0]);
                this.x1 = math.max(this.x1, arguments[0]);

                this.y0 = math.min(this.y0, arguments[1]);
                this.y1 = math.max(this.y1, arguments[1]);

                this.z0 = math.min(this.z0, arguments[2]);
                this.z1 = math.max(this.z1, arguments[2]);
            }

            return this;
        };

        Rect3d.prototype.unionRect = function (pRect) {
            this.normalize();
            pRect.normalize();

            this.x0 = math.min(this.x0, pRect.x0);
            this.x1 = math.max(this.x1, pRect.x1);

            this.y0 = math.min(this.y0, pRect.y0);
            this.y1 = math.max(this.y1, pRect.y1);

            this.z0 = math.min(this.z0, pRect.z0);
            this.z1 = math.max(this.z1, pRect.z1);

            return this;
        };

        Rect3d.prototype.negate = function (pDestination) {
            if (!isDef(pDestination)) {
                pDestination = this;
            }

            return pDestination.set(-this.x1, -this.x0, -this.y1, -this.y0, -this.z1, -this.z0);
        };

        Rect3d.prototype.normalize = function () {
            var fTmp;
            if (this.x0 > this.x1) {
                fTmp = this.x0;
                this.x0 = this.x1;
                this.x1 = fTmp;
            }
            if (this.y0 > this.y1) {
                fTmp = this.y0;
                this.y0 = this.y1;
                this.y1 = fTmp;
            }
            if (this.z0 > this.z1) {
                fTmp = this.z0;
                this.z0 = this.z1;
                this.z1 = fTmp;
            }

            return this;
        };

        Rect3d.prototype.transform = function (m4fMatrix) {
            var pData = m4fMatrix.data;

            var a11 = pData[__11], a12 = pData[__12], a13 = pData[__13], a14 = pData[__14];
            var a21 = pData[__21], a22 = pData[__22], a23 = pData[__23], a24 = pData[__24];
            var a31 = pData[__31], a32 = pData[__32], a33 = pData[__33], a34 = pData[__34];

            var fX0 = this.x0, fX1 = this.x1;
            var fY0 = this.y0, fY1 = this.y1;
            var fZ0 = this.z0, fZ1 = this.z1;

            //base point
            var fBaseX = a11 * fX0 + a12 * fY0 + a13 * fZ0 + a14;
            var fBaseY = a21 * fX0 + a22 * fY0 + a23 * fZ0 + a24;
            var fBaseZ = a31 * fX0 + a32 * fY0 + a33 * fZ0 + a34;

            //new x vector
            var fXNewX = a11 * (fX1 - fX0);
            var fXNewY = a21 * (fX1 - fX0);
            var fXNewZ = a31 * (fX1 - fX0);

            //new y vector
            var fYNewX = a12 * (fY1 - fY0);
            var fYNewY = a22 * (fY1 - fY0);
            var fYNewZ = a32 * (fY1 - fY0);

            //new z vector
            var fZNewX = a13 * (fZ1 - fZ0);
            var fZNewY = a23 * (fZ1 - fZ0);
            var fZNewZ = a33 * (fZ1 - fZ0);

            var fXMultX = (fXNewX > 0.) ? 1. : 0.;
            var fYMultX = (fYNewX > 0.) ? 1. : 0.;
            var fZMultX = (fZNewX > 0.) ? 1. : 0.;

            var fXMultY = (fXNewY > 0.) ? 1. : 0.;
            var fYMultY = (fYNewY > 0.) ? 1. : 0.;
            var fZMultY = (fZNewY > 0.) ? 1. : 0.;

            var fXMultZ = (fXNewZ > 0.) ? 1. : 0.;
            var fYMultZ = (fYNewZ > 0.) ? 1. : 0.;
            var fZMultZ = (fZNewZ > 0.) ? 1. : 0.;

            this.x1 = fBaseX + fXMultX * fXNewX + fYMultX * fYNewX + fZMultX * fZNewX;
            this.y1 = fBaseY + fXMultY * fXNewY + fYMultY * fYNewY + fZMultY * fZNewY;
            this.z1 = fBaseZ + fXMultZ * fXNewZ + fYMultZ * fYNewZ + fZMultZ * fZNewZ;

            this.x0 = fBaseX + (1. - fXMultX) * fXNewX + (1. - fYMultX) * fYNewX + (1. - fZMultX) * fZNewX;
            this.y0 = fBaseY + (1. - fXMultY) * fXNewY + (1. - fYMultY) * fYNewY + (1. - fZMultY) * fZNewY;
            this.z0 = fBaseZ + (1. - fXMultZ) * fXNewZ + (1. - fYMultZ) * fYNewZ + (1. - fZMultZ) * fZNewZ;

            return this;
        };

        /** inline */ Rect3d.prototype.isEqual = function (pRect) {
            return this.x0 == pRect.x0 && this.x1 == pRect.x1 && this.y0 == pRect.y0 && this.y1 == pRect.y1 && this.z0 == pRect.z0 && this.z1 == pRect.z1;
        };

        /** inline */ Rect3d.prototype.isClear = function () {
            return this.x0 == 0. && this.x1 == 0. && this.y0 == 0. && this.y1 == 0. && this.z0 == 0. && this.z1 == 0.;
        };

        /** inline */ Rect3d.prototype.isValid = function () {
            return this.x0 <= this.x1 && this.y0 <= this.y1 && this.z0 <= this.z1;
        };

        /** inline */ Rect3d.prototype.isPointInRect = function (v3fPoint) {
            var x = v3fPoint.x;
            var y = v3fPoint.y;
            var z = v3fPoint.z;

            return (this.x0 <= x && x <= this.x1) && (this.y0 <= y && y <= this.y1) && (this.z0 <= z && z <= this.z1);
        };

        Rect3d.prototype.midPoint = function (v3fDestination) {
            if (!isDef(v3fDestination)) {
                v3fDestination = new Vec3();
            }

            return v3fDestination.set((this.x0 + this.x1) * 0.5, (this.y0 + this.y1) * 0.5, (this.z0 + this.z1) * 0.5);
        };

        /** inline */ Rect3d.prototype.midX = function () {
            return (this.x0 + this.x1) * 0.5;
        };

        /** inline */ Rect3d.prototype.midY = function () {
            return (this.y0 + this.y1) * 0.5;
        };

        /** inline */ Rect3d.prototype.midZ = function () {
            return (this.z0 + this.z1) * 0.5;
        };

        Rect3d.prototype.size = function (v3fDestination) {
            if (!isDef(v3fDestination)) {
                v3fDestination = new Vec3();
            }

            return v3fDestination.set(this.x1 - this.x0, this.y1 - this.y0, this.z1 - this.z0);
        };

        /** inline */ Rect3d.prototype.sizeX = function () {
            return this.x1 - this.x0;
        };

        /** inline */ Rect3d.prototype.sizeY = function () {
            return this.y1 - this.y0;
        };

        /** inline */ Rect3d.prototype.sizeZ = function () {
            return this.z1 - this.z0;
        };

        Rect3d.prototype.minPoint = function (v3fDestination) {
            if (!isDef(v3fDestination)) {
                v3fDestination = new Vec3();
            }

            return v3fDestination.set(this.x0, this.y0, this.z0);
        };

        Rect3d.prototype.maxPoint = function (v3fDestination) {
            if (!isDef(v3fDestination)) {
                v3fDestination = new Vec3();
            }

            return v3fDestination.set(this.x1, this.y1, this.z1);
        };

        /** inline */ Rect3d.prototype.volume = function () {
            return (this.x1 - this.x0) * (this.y1 - this.y0) * (this.z1 - this.z0);
        };

        /**
        * counter-clockwise and from bottom
        * x0,y0,z0 -> x1,y0,z0 -> x1,y1,z0 -> x0,y1,z0 ->
        * x0,y0,z1 -> x1,y0,z1 -> x1,y1,z1 -> x0,y1,z1
        */
        Rect3d.prototype.corner = function (iIndex, v3fDestination) {
            if (!isDef(v3fDestination)) {
                v3fDestination = new Vec3();
            }

            logger.assert(0 <= iIndex && iIndex < 8, "invalid index");

            switch (iIndex) {
                case 0:
                    v3fDestination.set(this.x0, this.y0, this.z0);
                    break;
                case 1:
                    v3fDestination.set(this.x1, this.y0, this.z0);
                    break;
                case 2:
                    v3fDestination.set(this.x1, this.y1, this.z0);
                    break;
                case 3:
                    v3fDestination.set(this.x0, this.y1, this.z0);
                    break;
                case 4:
                    v3fDestination.set(this.x0, this.y0, this.z1);
                    break;
                case 5:
                    v3fDestination.set(this.x1, this.y0, this.z1);
                    break;
                case 6:
                    v3fDestination.set(this.x1, this.y1, this.z1);
                    break;
                case 7:
                    v3fDestination.set(this.x0, this.y1, this.z1);
                    break;
            }
            return v3fDestination;
        };

        Rect3d.prototype.createBoundingSphere = function (pSphere) {
            if (!isDef(pSphere)) {
                pSphere = new Sphere();
            }

            var fX0 = this.x0, fX1 = this.x1;
            var fY0 = this.y0, fY1 = this.y1;
            var fZ0 = this.z0, fZ1 = this.z1;

            var fHalfSizeX = (fX1 - fX0) * 0.5;
            var fHalfSizeY = (fY1 - fY0) * 0.5;
            var fHalfSizeZ = (fZ1 - fZ0) * 0.5;

            pSphere.set((fX0 + fX1) * 0.5, (fY0 + fY1) * 0.5, (fZ0 + fZ1) * 0.5, math.sqrt(fHalfSizeX * fHalfSizeX + fHalfSizeY * fHalfSizeY + fHalfSizeZ * fHalfSizeZ));

            return pSphere;
        };

        Rect3d.prototype.distanceToPoint = function (v3fPoint) {
            var fX = v3fPoint.x, fY = v3fPoint.y, fZ = v3fPoint.z;

            var fX0 = this.x0, fY0 = this.y0, fZ0 = this.z0;
            var fX1 = this.x1, fY1 = this.y1, fZ1 = this.z1;

            var fXN, fYN, fZN;

            fXN = (math.abs(fX0 - fX) < math.abs(fX1 - fX)) ? fX0 : fX1;
            fYN = (math.abs(fY0 - fY) < math.abs(fY1 - fY)) ? fY0 : fY1;
            fZN = (math.abs(fZ0 - fZ) < math.abs(fZ1 - fZ)) ? fZ0 : fZ1;

            return math.sqrt((fXN - fX) * (fXN - fX) + (fYN - fY) * (fYN - fY) + (fZN - fZ) * (fZN - fZ));
        };

        Rect3d.prototype.toString = function () {
            return "(" + this.x0 + ", " + this.y0 + ", " + this.z0 + ") --> (" + this.x1 + ", " + this.y1 + ", " + this.z1 + ")";
        };
        return Rect3d;
    })();

    pBuffer = gen.array(128, Rect3d);
    iElement = 0;

    
    return Rect3d;
});
//# sourceMappingURL=Rect3d.js.map
