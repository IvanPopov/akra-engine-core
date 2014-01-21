/// <reference path="../idl/IRect3d.ts" />
/// <reference path="../idl/IRect2d.ts" />
/// <reference path="../math/math.ts" />
/// <reference path="../gen/generate.ts" />
/// <reference path="../logger.ts" />
/// <reference path="geometry.ts" />

module akra.geometry {

    import __11 = math.__11;
    import __12 = math.__12;
    import __13 = math.__13;
    import __14 = math.__14;
    import __21 = math.__21;
    import __22 = math.__22;
    import __23 = math.__23;
    import __24 = math.__24;
    import __31 = math.__31;
    import __32 = math.__32;
    import __33 = math.__33;
    import __34 = math.__34;
    import __41 = math.__41;
    import __42 = math.__42;
    import __43 = math.__43;
    import __44 = math.__44;

    import Vec3 = math.Vec3;

    var pBuffer: IRect3d[];
    var iElement: uint;


    export class Rect3d implements IRect3d {
        x0: float;
        x1: float;
        y0: float;
        y1: float;
        z0: float;
        z1: float;

        constructor();
        constructor(pRect: IRect3d);
        constructor(v3fSize: IVec3);
        constructor(fSizeX: float, fSizeY: float, fSizeZ: float);
        constructor(v3fMinPoint: IVec3, v3fMaxPoint: IVec3);
        constructor(fX0: float, fX1: float, fY0: float,
            fY1: float, fZ0: float, fZ1: float);
        constructor(fX0?, fX1?, fY0?, fY1?, fZ0?, fZ1?) {
            var nArgumentsLength: uint = arguments.length;

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
                    this.set(arguments[0], arguments[1], arguments[2],
                        arguments[3], arguments[4], arguments[5]);
                    break;
                default:
                    this.x0 = this.x1 = this.y0 = this.y1 = this.z0 = this.z1 = 0.;
                    break;
            }
        }

        get rect2d(): IRect2d {
            return new Rect2d(this.x0, this.x1, this.y0, this.y1);
        }

        set rect2d(pRect: IRect2d) {
            this.x0 = pRect.x0;
            this.x1 = pRect.x1;
            this.y0 = pRect.y0;
            this.y1 = pRect.y1;
        }

        set(): IRect3d;
        set(pRect: IRect3d): IRect3d;
        set(v3fSize: IVec3): IRect3d;
        set(fSizeX: float, fSizeY: float, fSizeZ: float): IRect3d;
        set(v3fMinPoint: IVec3, v3fMaxPoint: IVec3): IRect3d;
        set(fX0: float, fX1: float, fY0: float,
            fY1: float, fZ0: float, fZ1: float): IRect3d;
        set(fX0?, fX1?, fY0?, fY1?, fZ0?, fZ1?): IRect3d {
            var nArgumentsLength: uint = arguments.length;

            switch (nArgumentsLength) {
                case 1:
                    if (arguments[0] instanceof Rect3d) {
                        var pRect: IRect3d = arguments[0];

                        this.x0 = pRect.x0;
                        this.x1 = pRect.x1;
                        this.y0 = pRect.y0;
                        this.y1 = pRect.y1;
                        this.z0 = pRect.z0;
                        this.z1 = pRect.z1;
                    }
                    else {
                        var v3fSize: IVec3 = arguments[0];

                        this.x1 = v3fSize.x * 0.5;
                        this.x0 = -this.x1;

                        this.y1 = v3fSize.y * 0.5;
                        this.y0 = -this.y1;

                        this.z1 = v3fSize.z * 0.5;
                        this.z0 = -this.z1;
                    }
                    break;
                case 2:
                    var v3fMinPoint: IVec3 = arguments[0];
                    var v3fMaxPoint: IVec3 = arguments[1];

                    this.x0 = v3fMinPoint.x;
                    this.y0 = v3fMinPoint.y;
                    this.z0 = v3fMinPoint.z;

                    this.x1 = v3fMaxPoint.x;
                    this.y1 = v3fMaxPoint.y;
                    this.z1 = v3fMaxPoint.z;
                    break;
                case 3:
                    var fSizeX: float = arguments[0];
                    var fSizeY: float = arguments[1];
                    var fSizeZ: float = arguments[2];

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
        }

        setFloor(pRect: IRect3d): IRect3d {
            this.x0 = math.floor(pRect.x0);
            this.x1 = math.floor(pRect.x1);
            this.y0 = math.floor(pRect.y0);
            this.y1 = math.floor(pRect.y1);
            this.z0 = math.floor(pRect.z0);
            this.z1 = math.floor(pRect.z1);

            return this;
        }

        setCeil(pRect: IRect3d): IRect3d {
            this.x0 = math.ceil(pRect.x0);
            this.x1 = math.ceil(pRect.x1);
            this.y0 = math.ceil(pRect.y0);
            this.y1 = math.ceil(pRect.y1);
            this.z0 = math.ceil(pRect.z0);
            this.z1 = math.ceil(pRect.z1);

            return this;
        }

        clear(): IRect3d {
            this.x0 = this.x1 = this.y0 = this.y1 = this.z0 = this.z1 = 0.;
            return this;
        }

        addSelf(fValue: float): IRect3d;
        addSelf(v3fVec: IVec3): IRect3d;
        addSelf(): IRect3d {
            if (isFloat(arguments[0])) {
                var fValue: float = arguments[0];

                this.x0 += fValue;
                this.x1 += fValue;
                this.y0 += fValue;
                this.y1 += fValue;
                this.z0 += fValue;
                this.z1 += fValue;
            }
            else {
                var v3fVec: IVec3 = arguments[0];

                this.x0 += v3fVec.x;
                this.x1 += v3fVec.x;

                this.y0 += v3fVec.y;
                this.y1 += v3fVec.y;

                this.z0 += v3fVec.z;
                this.z1 += v3fVec.z;
            }

            return this;
        }


        subSelf(fValue: float): IRect3d;
        subSelf(v3fVec: IVec3): IRect3d;
        subSelf(): IRect3d {
            if (isFloat(arguments[0])) {
                var fValue: float = arguments[0];

                this.x0 -= fValue;
                this.x1 -= fValue;
                this.y0 -= fValue;
                this.y1 -= fValue;
                this.z0 -= fValue;
                this.z1 -= fValue;
            }
            else {
                var v3fVec: IVec3 = arguments[0];

                this.x0 -= v3fVec.x;
                this.x1 -= v3fVec.x;

                this.y0 -= v3fVec.y;
                this.y1 -= v3fVec.y;

                this.z0 -= v3fVec.z;
                this.z1 -= v3fVec.z;
            }

            return this;
        }

        multSelf(fValue: float): IRect3d;
        multSelf(v3fVec: IVec3): IRect3d;
        multSelf(): IRect3d {
            if (isFloat(arguments[0])) {
                var fValue: float = arguments[0];

                this.x0 *= fValue;
                this.x1 *= fValue;
                this.y0 *= fValue;
                this.y1 *= fValue;
                this.z0 *= fValue;
                this.z1 *= fValue;
            }
            else {
                var v3fVec: IVec3 = arguments[0];

                this.x0 *= v3fVec.x;
                this.x1 *= v3fVec.x;

                this.y0 *= v3fVec.y;
                this.y1 *= v3fVec.y;

                this.z0 *= v3fVec.z;
                this.z1 *= v3fVec.z;
            }

            return this;
        }

        divSelf(fValue: float): IRect3d;
        divSelf(v3fVec: IVec3): IRect3d;
        divSelf(): IRect3d {
            if (isFloat(arguments[0])) {
                var fValue: float = arguments[0];

                logger.assert(fValue != 0.0, "divide by zero error");

                var fInvValue: float = 1. / fValue;

                this.x0 *= fInvValue;
                this.x1 *= fInvValue;
                this.y0 *= fInvValue;
                this.y1 *= fInvValue;
                this.z0 *= fInvValue;
                this.z1 *= fInvValue;
            }
            else {
                var v3fVec: IVec3 = arguments[0];

                logger.assert(v3fVec.x != 0.0, "divide by zero error");
                logger.assert(v3fVec.y != 0.0, "divide by zero error");
                logger.assert(v3fVec.z != 0.0, "divide by zero error");

                var fInvX: float = 1. / v3fVec.x;
                var fInvY: float = 1. / v3fVec.y;
                var fInvZ: float = 1. / v3fVec.z;

                this.x0 *= fInvX;
                this.x1 *= fInvX;

                this.y0 *= fInvY;
                this.y1 *= fInvY;

                this.z0 *= fInvZ;
                this.z1 *= fInvZ;
            }

            return this;
        }

        offset(v3fOffset: IVec3): IRect3d;
        offset(fOffsetX: float, fOffsetY: float, fOffsetZ: float): IRect3d;
        offset(fOffsetX?, fOffsetY?, fOffsetZ?): IRect3d {
            if (arguments.length === 1) {
                var v3fOffset: IVec3 = arguments[0];

                this.x0 += v3fOffset.x;
                this.x1 += v3fOffset.x;

                this.y0 += v3fOffset.y;
                this.y1 += v3fOffset.y;

                this.z0 += v3fOffset.z;
                this.z1 += v3fOffset.z;
            }
            else {
                this.x0 += arguments[0];
                this.x1 += arguments[0];

                this.y0 += arguments[1];
                this.y1 += arguments[1];

                this.z0 += arguments[2];
                this.z1 += arguments[2];
            }

            return this;
        }

        expand(fValue: float): IRect3d;
        expand(v3fVec: IVec3): IRect3d;
        expand(fValueX: float, fValueY: float, fValueZ: float): IRect3d;
        expand(fValueX?, fValueY?, fValueZ?): IRect3d {
            if (arguments.length === 1) {
                if (isFloat(arguments[0])) {
                    var fValue: float = arguments[0];

                    this.x0 -= fValue;
                    this.x1 += fValue;

                    this.y0 -= fValue;
                    this.y1 += fValue;

                    this.z0 -= fValue;
                    this.z1 += fValue;
                }
                else {
                    var v3fVec: IVec3 = arguments[0];

                    this.x0 -= v3fVec.x;
                    this.x1 += v3fVec.x;

                    this.y0 -= v3fVec.y;
                    this.y1 += v3fVec.y;

                    this.z0 -= v3fVec.z;
                    this.z1 += v3fVec.z;
                }
            }
            else {
                //arguments.length === 3

                this.x0 -= arguments[0];
                this.x1 += arguments[0];

                this.y0 -= arguments[1];
                this.y1 += arguments[1];

                this.z0 -= arguments[2];
                this.z1 += arguments[2];
            }

            return this;
        }

        expandX(fValue: float): IRect3d {
            this.x0 -= fValue;
            this.x1 += fValue;

            return this;
        }

        expandY(fValue: float): IRect3d {
            this.y0 -= fValue;
            this.y1 += fValue;

            return this;
        }

        expandZ(fValue: float): IRect3d {
            this.z0 -= fValue;
            this.z1 += fValue;

            return this;
        }

        resize(v3fSize: IVec3): IRect3d;
        resize(fSizeX: float, fSizeY: float, fSizeZ: float): IRect3d;
        resize(): IRect3d {
            var fSizeX: float, fSizeY: float, fSizeZ: float;

            if (arguments.length === 1) {
                var v3fSize: IVec3 = arguments[0];

                fSizeX = v3fSize.x;
                fSizeY = v3fSize.y;
                fSizeZ = v3fSize.z;
            }
            else {
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
        }

        resizeX(fSize: float): IRect3d {
            this.x1 = (this.x0 + this.x1 + fSize) * 0.5;
            this.x0 = this.x1 - fSize;

            return this;
        }

        resizeY(fSize: float): IRect3d {
            this.y1 = (this.y0 + this.y1 + fSize) * 0.5;
            this.y0 = this.y1 - fSize;

            return this;
        }

        resizeZ(fSize: float): IRect3d {
            this.z1 = (this.z0 + this.z1 + fSize) * 0.5;
            this.z0 = this.z1 - fSize;

            return this;
        }

        resizeMax(v3fSpan: IVec3): IRect3d;
        resizeMax(fSpanX: float, fSpanY: float, fSpanZ: float): IRect3d;
        resizeMax(fSpanX?, fSpanY?, fSpanZ?): IRect3d {
            if (arguments.length === 1) {
                var v3fSpan: IVec3 = arguments[0];

                this.x1 = this.x0 + v3fSpan.x;
                this.y1 = this.y0 + v3fSpan.y;
                this.z1 = this.z0 + v3fSpan.z;
            }
            else {
                //arguments.length === 3
                this.x1 = this.x0 + arguments[0];
                this.y1 = this.y0 + arguments[1];
                this.z1 = this.z0 + arguments[2];
            }

            return this;
        }

        resizeMaxX(fSpan: float): IRect3d {
            this.x1 = this.x0 + fSpan;
            return this;
        }

        resizeMaxY(fSpan: float): IRect3d {
            this.y1 = this.y0 + fSpan;
            return this;
        }

        resizeMaxZ(fSpan: float): IRect3d {
            this.z1 = this.z0 + fSpan;
            return this;
        }

        resizeMin(v3fSpan: IVec3): IRect3d;
        resizeMin(fSpanX: float, fSpanY: float, fSpanZ: float): IRect3d;
        resizeMin(fSpanX?, fSpanY?, fSpanZ?): IRect3d {
            if (arguments.length === 1) {
                var v3fSpan: IVec3 = arguments[0];

                this.x0 = this.x1 - v3fSpan.x;
                this.y0 = this.y1 - v3fSpan.y;
                this.z0 = this.z1 - v3fSpan.z;
            }
            else {
                //arguments.length === 3
                this.x0 = this.x1 - arguments[0];
                this.y0 = this.y1 - arguments[1];
                this.z0 = this.z1 - arguments[2];
            }

            return this;
        }

        resizeMinX(fSpan: float): IRect3d {
            this.x0 = this.x1 - fSpan;
            return this;
        }

        resizeMinY(fSpan: float): IRect3d {
            this.y0 = this.y1 - fSpan;
            return this;
        }

        resizeMinZ(fSpan: float): IRect3d {
            this.z0 = this.z1 - fSpan;
            return this;
        }

        unionPoint(v3fPoint: IVec3): IRect3d;
        unionPoint(fX: float, fY: float, fZ: float): IRect3d;
        unionPoint(fX?, fY?, fZ?): IRect3d {
            if (arguments.length === 1) {
                var v3fPoint: IVec3 = arguments[0];

                this.x0 = math.min(this.x0, v3fPoint.x);
                this.x1 = math.max(this.x1, v3fPoint.x);

                this.y0 = math.min(this.y0, v3fPoint.y);
                this.y1 = math.max(this.y1, v3fPoint.y);

                this.z0 = math.min(this.z0, v3fPoint.z);
                this.z1 = math.max(this.z1, v3fPoint.z);
            }
            else {
                //arguments.length === 3

                this.x0 = math.min(this.x0, arguments[0]);
                this.x1 = math.max(this.x1, arguments[0]);

                this.y0 = math.min(this.y0, arguments[1]);
                this.y1 = math.max(this.y1, arguments[1]);

                this.z0 = math.min(this.z0, arguments[2]);
                this.z1 = math.max(this.z1, arguments[2]);
            }

            return this;
        }

        unionRect(pRect: IRect3d): IRect3d {
            this.normalize();
            pRect.normalize();

            this.x0 = math.min(this.x0, pRect.x0);
            this.x1 = math.max(this.x1, pRect.x1);

            this.y0 = math.min(this.y0, pRect.y0);
            this.y1 = math.max(this.y1, pRect.y1);

            this.z0 = math.min(this.z0, pRect.z0);
            this.z1 = math.max(this.z1, pRect.z1);

            return this;
        }

        negate(pDestination?: IRect3d): IRect3d {
            if (!isDef(pDestination)) {
                pDestination = this;
            }

            return pDestination.set(-this.x1, -this.x0,
                -this.y1, -this.y0,
                -this.z1, -this.z0);
        }

        normalize(): IRect3d {
            var fTmp: float;
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
        }

        transform(m4fMatrix: IMat4): IRect3d {
            var pData: Float32Array = m4fMatrix.data;

            var a11: float = pData[__11], a12: float = pData[__12],
                a13: float = pData[__13], a14: float = pData[__14];
            var a21: float = pData[__21], a22: float = pData[__22],
                a23: float = pData[__23], a24: float = pData[__24];
            var a31: float = pData[__31], a32: float = pData[__32],
                a33: float = pData[__33], a34: float = pData[__34];

            var fX0: float = this.x0, fX1: float = this.x1;
            var fY0: float = this.y0, fY1: float = this.y1;
            var fZ0: float = this.z0, fZ1: float = this.z1;

            //base point

            var fBaseX: float = a11 * fX0 + a12 * fY0 + a13 * fZ0 + a14;
            var fBaseY: float = a21 * fX0 + a22 * fY0 + a23 * fZ0 + a24;
            var fBaseZ: float = a31 * fX0 + a32 * fY0 + a33 * fZ0 + a34;

            //new x vector

            var fXNewX: float = a11 * (fX1 - fX0);
            var fXNewY: float = a21 * (fX1 - fX0);
            var fXNewZ: float = a31 * (fX1 - fX0);

            //new y vector

            var fYNewX: float = a12 * (fY1 - fY0);
            var fYNewY: float = a22 * (fY1 - fY0);
            var fYNewZ: float = a32 * (fY1 - fY0);

            //new z vector

            var fZNewX: float = a13 * (fZ1 - fZ0);
            var fZNewY: float = a23 * (fZ1 - fZ0);
            var fZNewZ: float = a33 * (fZ1 - fZ0);

            var fXMultX: float = (fXNewX > 0.) ? 1. : 0.;
            var fYMultX: float = (fYNewX > 0.) ? 1. : 0.;
            var fZMultX: float = (fZNewX > 0.) ? 1. : 0.;

            var fXMultY: float = (fXNewY > 0.) ? 1. : 0.;
            var fYMultY: float = (fYNewY > 0.) ? 1. : 0.;
            var fZMultY: float = (fZNewY > 0.) ? 1. : 0.;

            var fXMultZ: float = (fXNewZ > 0.) ? 1. : 0.;
            var fYMultZ: float = (fYNewZ > 0.) ? 1. : 0.;
            var fZMultZ: float = (fZNewZ > 0.) ? 1. : 0.;

            this.x1 = fBaseX + fXMultX * fXNewX + fYMultX * fYNewX + fZMultX * fZNewX;
            this.y1 = fBaseY + fXMultY * fXNewY + fYMultY * fYNewY + fZMultY * fZNewY;
            this.z1 = fBaseZ + fXMultZ * fXNewZ + fYMultZ * fYNewZ + fZMultZ * fZNewZ;

            this.x0 = fBaseX + (1. - fXMultX) * fXNewX + (1. - fYMultX) * fYNewX + (1. - fZMultX) * fZNewX;
            this.y0 = fBaseY + (1. - fXMultY) * fXNewY + (1. - fYMultY) * fYNewY + (1. - fZMultY) * fZNewY;
            this.z0 = fBaseZ + (1. - fXMultZ) * fXNewZ + (1. - fYMultZ) * fYNewZ + (1. - fZMultZ) * fZNewZ;

            return this;
        }

        isEqual(pRect: IRect3d): boolean {
            return this.x0 == pRect.x0 && this.x1 == pRect.x1
                && this.y0 == pRect.y0 && this.y1 == pRect.y1
                && this.z0 == pRect.z0 && this.z1 == pRect.z1;
        }

        isClear(): boolean {
            return this.x0 == 0. && this.x1 == 0.
                && this.y0 == 0. && this.y1 == 0.
                && this.z0 == 0. && this.z1 == 0.;
        }

        isValid(): boolean {
            return this.x0 <= this.x1
                && this.y0 <= this.y1
                && this.z0 <= this.z1;
        }

        isPointInRect(v3fPoint: IVec3): boolean {
            var x: float = v3fPoint.x;
            var y: float = v3fPoint.y;
            var z: float = v3fPoint.z;

            return (this.x0 <= x && x <= this.x1)
                && (this.y0 <= y && y <= this.y1)
                && (this.z0 <= z && z <= this.z1);
        }

        midPoint(v3fDestination?: IVec3): IVec3 {
            if (!isDef(v3fDestination)) {
                v3fDestination = new Vec3();
            }

            return v3fDestination.set((this.x0 + this.x1) * 0.5,
                (this.y0 + this.y1) * 0.5,
                (this.z0 + this.z1) * 0.5);
        }

        midX(): float {
            return (this.x0 + this.x1) * 0.5;
        }

        midY(): float {
            return (this.y0 + this.y1) * 0.5;
        }

        midZ(): float {
            return (this.z0 + this.z1) * 0.5;
        }

        size(v3fDestination?: IVec3): IVec3 {
            if (!isDef(v3fDestination)) {
                v3fDestination = new Vec3();
            }

            return v3fDestination.set(this.x1 - this.x0, this.y1 - this.y0, this.z1 - this.z0);
        }

        sizeX(): float {
            return this.x1 - this.x0;
        }

        sizeY(): float {
            return this.y1 - this.y0;
        }

        sizeZ(): float {
            return this.z1 - this.z0;
        }

        minPoint(v3fDestination?: IVec3): IVec3 {
            if (!isDef(v3fDestination)) {
                v3fDestination = new Vec3();
            }

            return v3fDestination.set(this.x0, this.y0, this.z0);
        }

        maxPoint(v3fDestination?: IVec3): IVec3 {
            if (!isDef(v3fDestination)) {
                v3fDestination = new Vec3();
            }

            return v3fDestination.set(this.x1, this.y1, this.z1);
        }

        volume(): float {
            return (this.x1 - this.x0) * (this.y1 - this.y0) * (this.z1 - this.z0);
        }

        /**
         * counter-clockwise and from bottom
         * x0,y0,z0 -> x1,y0,z0 -> x1,y1,z0 -> x0,y1,z0 ->
         * x0,y0,z1 -> x1,y0,z1 -> x1,y1,z1 -> x0,y1,z1
         */
        corner(iIndex: uint, v3fDestination?: IVec3): IVec3 {
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
        }

        createBoundingSphere(pSphere?: ISphere): ISphere {
            if (!isDef(pSphere)) {
                pSphere = new Sphere();
            }

            var fX0: float = this.x0, fX1: float = this.x1;
            var fY0: float = this.y0, fY1: float = this.y1;
            var fZ0: float = this.z0, fZ1: float = this.z1;

            var fHalfSizeX: float = (fX1 - fX0) * 0.5;
            var fHalfSizeY: float = (fY1 - fY0) * 0.5;
            var fHalfSizeZ: float = (fZ1 - fZ0) * 0.5;

            pSphere.set((fX0 + fX1) * 0.5, (fY0 + fY1) * 0.5, (fZ0 + fZ1) * 0.5,
                math.sqrt(fHalfSizeX * fHalfSizeX + fHalfSizeY * fHalfSizeY + fHalfSizeZ * fHalfSizeZ));

            return pSphere;
        }

        distanceToPoint(v3fPoint: IVec3): float {
            var fX: float = v3fPoint.x, fY: float = v3fPoint.y, fZ: float = v3fPoint.z;

            var fX0: float = this.x0, fY0: float = this.y0, fZ0: float = this.z0;
            var fX1: float = this.x1, fY1: float = this.y1, fZ1: float = this.z1;

            var fXN: float, fYN: float, fZN: float;

            fXN = (math.abs(fX0 - fX) < math.abs(fX1 - fX)) ? fX0 : fX1;
            fYN = (math.abs(fY0 - fY) < math.abs(fY1 - fY)) ? fY0 : fY1;
            fZN = (math.abs(fZ0 - fZ) < math.abs(fZ1 - fZ)) ? fZ0 : fZ1;

            return math.sqrt((fXN - fX) * (fXN - fX) + (fYN - fY) * (fYN - fY) + (fZN - fZ) * (fZN - fZ));
        }

        toString(): string {
            return "(" + this.x0 + ", " + this.y0 + ", " + this.z0 + ") --> (" +
                this.x1 + ", " + this.y1 + ", " + this.z1 + ")";
        }

        static temp(): IRect3d;
        static temp(pRect: IRect3d): IRect3d;
        static temp(v3fSize: IVec3): IRect3d;
        static temp(fSizeX: float, fSizeY: float, fSizeZ: float): IRect3d;
        static temp(v3fMinPoint: IVec3, v3fMaxPoint: IVec3): IRect3d;
        static temp(fX0: float, fX1: float, fY0: float,
            fY1: float, fZ0: float, fZ1: float): IRect3d;
        static temp(): IRect3d {
            iElement = (iElement === pBuffer.length - 1 ? 0 : pBuffer.length);
            var p = pBuffer[iElement++];
            return p.set.apply(p, arguments);
        }

    }


    pBuffer = gen.array<IRect3d>(128, Rect3d);
    iElement = 0;
}