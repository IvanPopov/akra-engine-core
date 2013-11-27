/// <reference path="../idl/IRect2d.ts" />
/// <reference path="../math/math.ts" />
/// <reference path="../logger.ts" />
/// <reference path="Circle.ts" />

module akra.geometry {
    import Vec2 = math.Vec2;


    export class Rect2d implements IRect2d {
        x0: float;
        x1: float;
        y0: float;
        y1: float;

        get left(): float { return this.x0; }
        get top(): float { return this.y0; }
        get width(): float { return this.x1 - this.x0; }
        get height(): float { return this.y1 - this.y0; }

        constructor();
        constructor(pRect: IRect2d);
        constructor(v2fVec: IVec2);
        constructor(fSizeX: float, fSizeY: float);
        constructor(fX0: float, fX1: float, fY0: float, fY1: float);
        constructor(fX0?, fX1?, fY0?, fY1?) {
            var nArgumentsLength: uint = arguments.length;

            switch (nArgumentsLength) {
                case 1:
                    this.set(arguments[0]);
                    break;
                case 2:
                    this.set(arguments[0], arguments[1]);
                    break;
                case 4:
                    this.set(arguments[0], arguments[1], arguments[2], arguments[3]);
                    break;
                default:
                    this.x0 = this.x1 = this.y0 = this.y1 = 0.;
                    break;
            }
        }

        set(): IRect2d;
        set(pRect: IRect2d): IRect2d;
        set(v2fVec: IVec2): IRect2d;
        set(fSizeX: float, fSizeY: float): IRect2d;
        set(v2fMinPoint: IVec2, v2fMaxPoint: IVec2): IRect2d;
        set(fX0: float, fX1: float, fY0: float, fY1: float): IRect2d;
        set(fX0?, fX1?, fY0?, fY1?): IRect2d {
            var nArgumentsLength: uint = arguments.length;

            switch (nArgumentsLength) {
                case 1:
                    if (arguments[0] instanceof Rect2d) {
                        var pRect: IRect2d = arguments[0];

                        this.x0 = pRect.x0;
                        this.x1 = pRect.x1;
                        this.y0 = pRect.y0;
                        this.y1 = pRect.y1;
                    }
                    else {
                        var v2fSizes: IVec2 = arguments[0];

                        this.x1 = v2fSizes.x * 0.5;
                        this.x0 = -this.x1;

                        this.y1 = v2fSizes.y * 0.5;
                        this.y0 = -this.y1;
                    }
                    break;
                case 2:
                    if (isNumber(arguments[0])) {
                        var fSizeX: float = arguments[0];
                        var fSizeY: float = arguments[1];

                        this.x1 = fSizeX * 0.5;
                        this.x0 = -this.x1;

                        this.y1 = fSizeY * 0.5;
                        this.y0 = -this.y1;
                    }
                    else {
                        this.x0 = arguments[0].x;
                        this.y0 = arguments[0].y;

                        this.x1 = arguments[1].x;
                        this.y1 = arguments[1].y;
                    }
                    break;
                case 4:
                    this.x0 = arguments[0];
                    this.x1 = arguments[1];
                    this.y0 = arguments[2];
                    this.y1 = arguments[3];
                    break;
                default:
                    this.x0 = this.x1 = this.y0 = this.y1 = 0.;
                    break;
            }

            return this;
        }

        setFloor(pRect: IRect2d): IRect2d {
            this.x0 = math.floor(pRect.x0);
            this.x1 = math.floor(pRect.x1);
            this.y0 = math.floor(pRect.y0);
            this.y1 = math.floor(pRect.y1);

            return this;
        }

        setCeil(pRect: IRect2d): IRect2d {
            this.x0 = math.ceil(pRect.x0);
            this.x1 = math.ceil(pRect.x1);
            this.y0 = math.ceil(pRect.y0);
            this.y1 = math.ceil(pRect.y1);

            return this;
        }

        clear(): IRect2d {
            this.x0 = this.x1 = this.y0 = this.y1 = 0.;
            return this;
        }

        addSelf(fValue: float): IRect2d;
        addSelf(v2fVec: IVec2): IRect2d;
        addSelf(v2fVec?): IRect2d {
            if (isFloat(arguments[0])) {
                var fValue: float = arguments[0];

                this.x0 += fValue;
                this.x1 += fValue;
                this.y0 += fValue;
                this.y1 += fValue;
            }
            else {
                var v2fVec: IVec2 = arguments[0];

                this.x0 += v2fVec.x;
                this.x1 += v2fVec.x;

                this.y0 += v2fVec.y;
                this.y1 += v2fVec.y;
            }

            return this;
        }

        subSelf(fValue: float): IRect2d;
        subSelf(v2fVec: IVec2): IRect2d;
        subSelf(v2fVec?): IRect2d {
            if (isFloat(arguments[0])) {
                var fValue: float = arguments[0];

                this.x0 -= fValue;
                this.x1 -= fValue;
                this.y0 -= fValue;
                this.y1 -= fValue;
            }
            else {
                var v2fVec: IVec2 = arguments[0];

                this.x0 -= v2fVec.x;
                this.x1 -= v2fVec.x;

                this.y0 -= v2fVec.y;
                this.y1 -= v2fVec.y;
            }

            return this;
        }

        multSelf(fValue: float): IRect2d;
        multSelf(v2fVec: IVec2): IRect2d;
        multSelf(v2fVec?): IRect2d {
            if (isFloat(arguments[0])) {
                var fValue: float = arguments[0];

                this.x0 *= fValue;
                this.x1 *= fValue;
                this.y0 *= fValue;
                this.y1 *= fValue;
            }
            else {
                var v2fVec: IVec2 = arguments[0];

                this.x0 *= v2fVec.x;
                this.x1 *= v2fVec.x;

                this.y0 *= v2fVec.y;
                this.y1 *= v2fVec.y;
            }

            return this;
        }

        divSelf(fValue: float): IRect2d;
        divSelf(v2fVec: IVec2): IRect2d;
        divSelf(v2fVec?): IRect2d {
            if (isFloat(arguments[0])) {
                var fValue: float = arguments[0];
                logger.assert(fValue != 0., "divide by zero error");

                var fInvValue: float = 1. / fValue;

                this.x0 *= fInvValue;
                this.x1 *= fInvValue;
                this.y0 *= fInvValue;
                this.y1 *= fInvValue;
            }
            else {
                var v2fVec: IVec2 = arguments[0];

                logger.assert(v2fVec.x != 0., "divide by zero error");
                logger.assert(v2fVec.y != 0., "divide by zero error");

                var fInvX: float = 1. / v2fVec.x;
                var fInvY: float = 1. / v2fVec.y;

                this.x0 *= fInvX;
                this.x1 *= fInvX;

                this.y0 *= fInvY;
                this.y1 *= fInvY;
            }

            return this;
        }

        offset(v2fOffset: IVec2): IRect2d;
        offset(fOffsetX: float, fOffsetY: float): IRect2d;
        offset(fOffsetX?, fOffsetY?): IRect2d {
            if (arguments.length === 1) {
                var v2fOffset: IVec2 = arguments[0];

                this.x0 += v2fOffset.x;
                this.x1 += v2fOffset.x;

                this.y0 += v2fOffset.y;
                this.y1 += v2fOffset.y;
            }
            else {
                this.x0 += arguments[0];
                this.x1 += arguments[0];

                this.y0 += arguments[1];
                this.y1 += arguments[1];
            }

            return this;
        }

        expand(fValue: float): IRect2d;
        expand(v2fValue: IVec2): IRect2d;
        expand(fValueX: float, fValueY: float): IRect2d;
        expand(fValueX?, fValueY?): IRect2d {
            if (arguments.length == 1) {
                if (isFloat(arguments[0])) {
                    var fValue: float = arguments[0];

                    this.x0 -= fValue;
                    this.x1 += fValue;

                    this.y0 -= fValue;
                    this.y1 += fValue;
                }
                else {
                    var v2fValue: IVec2 = <IVec2>arguments[0];

                    this.x0 -= v2fValue.x;
                    this.x1 += v2fValue.x;

                    this.y0 -= v2fValue.y;
                    this.y1 += v2fValue.y;
                }
            }
            else {
                //arguments.length == 2

                this.x0 -= arguments[0];
                this.x1 += arguments[0];

                this.y0 -= arguments[1];
                this.y1 += arguments[1];
            }

            return this;
        }

        expandX(fValue: float): IRect2d {
            this.x0 -= fValue;
            this.x1 += fValue;

            return this;
        }

        expandY(fValue: float): IRect2d {
            this.y0 -= fValue;
            this.y1 += fValue;

            return this;
        }

        resize(v2fSize: IVec2): IRect2d;
        resize(fSizeX: float, fSizeY: float): IRect2d;
        resize(fSizeX?, fSizeY?): IRect2d {
            var fSizeX: float, fSizeY: float;

            if (arguments.length == 1) {
                var v2fSize: IVec2 = arguments[0];

                fSizeX = v2fSize.x;
                fSizeY = v2fSize.y;
            }
            else {
                fSizeX = arguments[0];
                fSizeY = arguments[1];
            }

            this.x1 = (this.x0 + this.x1 + fSizeX) * 0.5;
            this.x0 = this.x1 - fSizeX;

            this.y1 = (this.y0 + this.y1 + fSizeY) * 0.5;
            this.y0 = this.y1 - fSizeY;

            return this;
        }

        resizeX(fSize: float): IRect2d {
            this.x1 = (this.x0 + this.x1 + fSize) * 0.5;
            this.x0 = this.x1 - fSize;

            return this;
        }

        resizeY(fSize: float): IRect2d {
            this.y1 = (this.y0 + this.y1 + fSize) * 0.5;
            this.y0 = this.y1 - fSize;

            return this;
        }

        resizeMax(v2fSpan: IVec2): IRect2d;
        resizeMax(fSpanX: float, fSpanY: float): IRect2d;
        resizeMax(fSpanX?, fSpanY?): IRect2d {
            if (arguments.length == 1) {
                var v2fSpan: IVec2 = arguments[0];

                this.x1 = this.x0 + v2fSpan.x;
                this.y1 = this.y0 + v2fSpan.y;
            }
            else {
                this.x1 = this.x0 + arguments[0];
                this.y1 = this.y0 + arguments[1];
            }

            return this;
        }

        resizeMaxX(fSpan: float): IRect2d {
            this.x1 = this.x0 + fSpan;
            return this;
        }

        resizeMaxY(fSpan: float): IRect2d {
            this.y1 = this.y0 + fSpan;
            return this;
        }

        resizeMin(v2fSpan: IVec2): IRect2d;
        resizeMin(fSpanX: float, fSpanY: float): IRect2d;
        resizeMin(fSpanX?, fSpanY?): IRect2d {
            if (arguments.length == 1) {
                var v2fSpan: IVec2 = arguments[0];

                this.x0 = this.x1 - v2fSpan.x;
                this.y0 = this.y1 - v2fSpan.y;
            }
            else {
                this.x0 = this.x1 - arguments[0];
                this.y0 = this.y1 - arguments[1];
            }

            return this;
        }

        resizeMinX(fSpan: float): IRect2d {
            this.x0 = this.x1 - fSpan;
            return this;
        }

        resizeMinY(fSpan: float): IRect2d {
            this.y0 = this.y1 - fSpan;
            return this;
        }

        unionPoint(v2fPoint: IVec2): IRect2d;
        unionPoint(fX: float, fY: float): IRect2d;
        unionPoint(): IRect2d {
            if (arguments.length === 1) {
                var v2fPoint: IVec2 = arguments[0];

                this.x0 = math.min(this.x0, v2fPoint.x);
                this.x1 = math.max(this.x1, v2fPoint.x);

                this.y0 = math.min(this.y0, v2fPoint.y);
                this.y1 = math.max(this.y1, v2fPoint.y);
            }
            else {
                var fX: float = arguments[0];
                var fY: float = arguments[1];

                this.x0 = math.min(this.x0, fX);
                this.x1 = math.max(this.x1, fX);

                this.y0 = math.min(this.y0, fY);
                this.y1 = math.max(this.y1, fY);
            }

            return this;
        }

        unionRect(pRect: IRect2d): IRect2d {
            this.normalize();
            pRect.normalize();

            this.x0 = math.min(this.x0, pRect.x0);
            this.x1 = math.max(this.x1, pRect.x1);

            this.y0 = math.min(this.y0, pRect.y0);
            this.y1 = math.max(this.y1, pRect.y1);

            return this;
        }

        negate(pDestination?: IRect2d): IRect2d {
            if (!isDef(pDestination)) {
                pDestination = this;
            }

            return pDestination.set(-this.x1, -this.x0, -this.y1, -this.y0);
        }

        normalize(): IRect2d {
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
            return this;
        }

        isEqual(pRect: IRect2d): boolean {
            return this.x0 == pRect.x0 && this.x1 == pRect.x1
                && this.y0 == pRect.y0 && this.y1 == pRect.y1;
        }

        isClear(): boolean {
            return this.x0 == 0. && this.x1 == 0. && this.y0 == 0. && this.y1 == 0.;
        }

        isValid(): boolean {
            return this.x0 <= this.x1 && this.y0 <= this.y1;
        }

        isPointInRect(v2fPoint: IVec2): boolean {
            var x: float = v2fPoint.x;
            var y: float = v2fPoint.y;

            return (this.x0 <= x && x <= this.x1) && (this.y0 <= y && y <= this.y1);
        }

        midPoint(v2fDestination?: IVec2): IVec2 {
            if (!isDef(v2fDestination)) {
                v2fDestination = new Vec2();
            }

            v2fDestination.x = (this.x0 + this.x1) * 0.5;
            v2fDestination.y = (this.y0 + this.y1) * 0.5;

            return v2fDestination;
        }

        midX(): float {
            return (this.x0 + this.x1) * 0.5;
        }

        midY(): float {
            return (this.y0 + this.y1) * 0.5;
        }

        size(v2fDestination?: IVec2): IVec2 {
            if (!isDef(v2fDestination)) {
                v2fDestination = new Vec2();
            }

            v2fDestination.x = this.x1 - this.x0;
            v2fDestination.y = this.y1 - this.y0;

            return v2fDestination;
        }

        sizeX(): float {
            return this.x1 - this.x0;
        }

        sizeY(): float {
            return this.y1 - this.y0;
        }

        minPoint(v2fDestination?: IVec2): IVec2 {
            if (!isDef(v2fDestination)) {
                v2fDestination = new Vec2();
            }

            v2fDestination.x = this.x0;
            v2fDestination.y = this.y0;

            return v2fDestination;
        }

        maxPoint(v2fDestination?: IVec2): IVec2 {
            if (!isDef(v2fDestination)) {
                v2fDestination = new Vec2();
            }

            v2fDestination.x = this.x1;
            v2fDestination.y = this.y1;

            return v2fDestination;
        }

        area(): float {
            return (this.x1 - this.x0) * (this.y1 - this.y0);
        }

        /**
         * counter-clockwise
         * x0,y0 -> x1,y0 -> x1,y1 -> x0,y1;
         */

        corner(iIndex: uint, v2fDestination?: IVec2): IVec2 {
            if (!isDef(v2fDestination)) {
                v2fDestination = new Vec2();
            }

            logger.assert(0 <= iIndex && iIndex < 4, "invalid index");

            switch (iIndex) {
                case 0:
                    v2fDestination.set(this.x0, this.y0);
                    break;
                case 1:
                    v2fDestination.set(this.x1, this.y0);
                    break;
                case 2:
                    v2fDestination.set(this.x1, this.y1);
                    break;
                case 3:
                    v2fDestination.set(this.x0, this.y1);
                    break;
            }
            return v2fDestination;
        }

        createBoundingCircle(pCircle?: ICircle): ICircle {
            if (!isDef(pCircle)) {
                pCircle = new Circle();
            }

            var fX0: float = this.x0, fX1: float = this.x1;
            var fY0: float = this.y0, fY1: float = this.y1;

            var fHalfSizeX: float = (fX1 - fX0) * 0.5;
            var fHalfSizeY: float = (fY1 - fY0) * 0.5;

            pCircle.set((fX0 + fX1) * 0.5, (fY0 + fY1) * 0.5,
                math.sqrt(fHalfSizeX * fHalfSizeX + fHalfSizeY * fHalfSizeY));

            return pCircle;
        }

        distanceToPoint(v2fPoint: IVec2): float {
            var fX: float = v2fPoint.x, fY: float = v2fPoint.y;

            var fX0: float = this.x0, fY0: float = this.y0;
            var fX1: float = this.x1, fY1: float = this.y1;

            var fXN: float, fYN: float;

            fXN = (math.abs(fX0 - fX) < math.abs(fX1 - fX)) ? fX0 : fX1;
            fYN = (math.abs(fY0 - fY) < math.abs(fY1 - fY)) ? fY0 : fY1;

            return math.sqrt((fXN - fX) * (fXN - fX) + (fYN - fY) * (fYN - fY));
        }

        toString(): string {
            return "(" + this.x0 + ", " + this.y0 + ") --> (" +
                this.x1 + ", " + this.y1 + ")";
        }
    }

}