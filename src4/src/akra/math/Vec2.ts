/// <reference path="../common.ts" />
/// <reference path="../logger.ts" />
/// <reference path="../idl/IVec2.ts" />
/// <reference path="math.ts" />
/// <reference path="../gen/generate.ts" />

module akra.math {

	var pBuffer: IVec2[];
	var iElement: uint;

	export class Vec2 implements IVec2 {
		x: float = 0.;
		y: float = 0.;

		get xx(): IVec2 {
			return Vec2.temp(this.x, this.x);
		}
		set xx(v2fVec: IVec2) {
			this.x = v2fVec.x; this.x = v2fVec.y;
		}

		get xy(): IVec2 {
			return Vec2.temp(this.x, this.y);
		}
		set xy(v2fVec: IVec2) {
			this.x = v2fVec.x; this.y = v2fVec.y;
		}

		get yx(): IVec2 {
			return Vec2.temp(this.y, this.x);
		}
		set yx(v2fVec: IVec2) {
			this.y = v2fVec.x; this.x = v2fVec.y;
		}

		get yy(): IVec2 {
			return Vec2.temp(this.y, this.y);
		}
		set yy(v2fVec: IVec2) {
			this.y = v2fVec.x; this.y = v2fVec.y;
		}

		constructor();
		constructor(xy: float);
		constructor(xy: IVec2);
		constructor(xy: float[]);
		constructor(x: float, y: float);
		constructor(x?, y?) {
			var n: uint = arguments.length;
			var v: IVec2 = this;

			switch (n) {
				case 1:
					v.set(arguments[0]);
					break;
				case 2:
					v.set(arguments[0], arguments[1]);
					break;
				default:
					v.x = v.y = 0.;
			}
		}

		set(): IVec2;
		set(xy: float): IVec2;
		set(xy: IVec2): IVec2;
		set(xy: float[]): IVec2;
		set(x: float, y: float): IVec2;
		set(x?, y?): IVec2 {
			var n: uint = arguments.length;

			switch (n) {
				case 0:
					this.x = this.y = 0.;
					break;
				case 1:
					if (isFloat(arguments[0])) {
						this.x = this.y = arguments[0];
					}
					else if (arguments[0] instanceof Vec2) {
						var v2fVec: IVec2 = arguments[0];

						this.x = v2fVec.x;
						this.y = v2fVec.y;
					}
					else {
						var pArray: float[] = arguments[0];

						this.x = pArray[0];
						this.y = pArray[1];
					}
					break;
				case 2:
					this.x = arguments[0];
					this.y = arguments[1];
					break;
			}

			return this;
		}

		/**  */ clear(): IVec2 {
			this.x = this.y = 0.;
			return this;
		}

		add(v2fVec: IVec2, v2fDestination?: IVec2): IVec2 {
			if (!isDef(v2fDestination)) {
				v2fDestination = this;
			}

			v2fDestination.x = this.x + v2fVec.x;
			v2fDestination.y = this.y + v2fVec.y;

			return v2fDestination;
		}

		subtract(v2fVec: IVec2, v2fDestination?: IVec2): IVec2 {
			if (!isDef(v2fDestination)) {
				v2fDestination = this;
			}

			v2fDestination.x = this.x - v2fVec.x;
			v2fDestination.y = this.y - v2fVec.y;

			return v2fDestination;
		}

		/**  */ dot(v2fVec: IVec2): float {
			return this.x * v2fVec.x + this.y * v2fVec.y;
		}

		isEqual(v2fVec: IVec2, fEps: float = 0.): boolean {
			if (fEps === 0.) {
				if (this.x != v2fVec.x
					|| this.y != v2fVec.y) {

					return false;
				}
			}
			else {
				if (abs(this.x - v2fVec.x) > fEps
					|| abs(this.y - v2fVec.y) > fEps) {

					return false;
				}
			}

			return true;
		}

		isClear(fEps: float = 0.): boolean {
			if (fEps === 0.) {
				if (this.x != 0.
					|| this.y != 0.) {

					return false;
				}
			}
			else {
				if (math.abs(this.x) > fEps
					|| math.abs(this.y) > fEps) {

					return false;
				}
			}

			return true;
		}

		negate(v2fDestination?: IVec2): IVec2 {
			if (!isDef(v2fDestination)) {
				v2fDestination = this;
			}

			v2fDestination.x = -this.x;
			v2fDestination.y = -this.y;

			return v2fDestination;
		}

		scale(fScale: float, v2fDestination?: IVec2): IVec2 {
			if (!isDef(v2fDestination)) {
				v2fDestination = this;
			}

			v2fDestination.x = this.x * fScale;
			v2fDestination.y = this.y * fScale;

			return v2fDestination;
		}

		normalize(v2fDestination?: IVec2): IVec2 {
			if (!isDef(v2fDestination)) {
				v2fDestination = this;
			}

			var x: float = this.x, y: float = this.y;
			var fLength: float = math.sqrt(x * x + y * y);

			if (fLength !== 0.) {
				var fInvLength: float = 1. / fLength;

				x *= fInvLength;
				y *= fInvLength;
			}

			v2fDestination.x = x;
			v2fDestination.y = y;

			return v2fDestination;
		}

		/**  */ length(): float {
			var x: float = this.x, y: float = this.y;
			return math.sqrt(x * x + y * y);
		}

		/**  */ lengthSquare(): float {
			var x: float = this.x, y: float = this.y;
			return x * x + y * y;
		}

		direction(v2fVec: IVec2, v2fDestination?: IVec2): IVec2 {
			if (!isDef(v2fDestination)) {
				v2fDestination = this;
			}

			var x: float = v2fVec.x - this.x;
			var y: float = v2fVec.y - this.y;

			var fLength: float = math.sqrt(x * x + y * y);

			if (fLength !== 0.) {
				var fInvLength: float = 1. / fLength;

				x *= fInvLength;
				y *= fInvLength;
			}

			v2fDestination.x = x;
			v2fDestination.y = y;

			return v2fDestination;
		}

		mix(v2fVec: IVec2, fA: float, v2fDestination?: IVec2): IVec2 {
			if (!isDef(v2fDestination)) {
				v2fDestination = this;
			}

			fA = math.clamp(fA, 0., 1.);

			var fA1: float = 1. - fA;
			var fA2: float = fA;

			v2fDestination.x = fA1 * this.x + fA2 * v2fVec.x;
			v2fDestination.y = fA1 * this.y + fA2 * v2fVec.y;

			return v2fDestination;
		}

		/**  */ toString(): string {
			return "[x: " + this.x + ", y: " + this.y + "]";
		}

		clone(sForm: string, v2fDest?: IVec2): IVec2;
		clone(sForm: "xx", v2fDest?: IVec2): IVec2;
		clone(sForm: "xy", v2fDest?: IVec2): IVec2;
		clone(sForm: "yx", v2fDest?: IVec2): IVec2;
		clone(sForm: "yy", v2fDest?: IVec2): IVec2;
		clone(sForm: string, v2fDest?: IVec2): IVec2 {
			if (!isDefAndNotNull(v2fDest)) {
				v2fDest = Vec2.temp();
			}

			switch (sForm) {
				case "xx":
					return v2fDest.set(this.x);
				case "xy":
					return v2fDest.set(this.x, this.y);
				case "yx":
					return v2fDest.set(this.y, this.x);
				case "yy":
					return v2fDest.set(this.y);
			}
			
			logger.error("Bad vector form", sForm);
			return null;
		}

		copy(sForm: string, v2fFrom: IVec2): IVec2;
		copy(sForm: string, fValue: float): IVec2;
		copy(sForm: "xx", v2fFrom: IVec2): IVec2;
		copy(sForm: "xx", fValue: float): IVec2;
		copy(sForm: "xy", v2fFrom: IVec2): IVec2;
		copy(sForm: "xy", fValue: float): IVec2;
		copy(sForm: "yx", v2fFrom: IVec2): IVec2;
		copy(sForm: "yx", fValue: float): IVec2;
		copy(sForm: "yy", v2fFrom: IVec2): IVec2;
		copy(sForm: "yy", fValue: float): IVec2;
		copy(sForm: string, pVec2OrFloat: any): IVec2 {
			var v2fFrom: IVec2 = isFloat(pVec2OrFloat) ? Vec2.temp(<float>pVec2OrFloat) : <IVec2>pVec2OrFloat;

			switch (sForm) {
				case "xx":
					this.set(v2fFrom.x);
				case "xy":
					this.set(v2fFrom.x, v2fFrom.y);
				case "yx":
					this.set(v2fFrom.y, v2fFrom.x);
				case "yy":
					this.set(v2fFrom.y);
				default:
					logger.error("Bad vector form", sForm);
					break;
			}

			return this;
		}

		static temp(): IVec2;
		static temp(xy: float): IVec2;
		static temp(xy: IVec2): IVec2;
		static temp(xy: float[]): IVec2;
		static temp(x: float, y: float): IVec2;
		static temp(x?, y?): IVec2 {
			iElement = (iElement === pBuffer.length - 1 ? 0 : pBuffer.length);
			var p = pBuffer[iElement++];
			return p.set.apply(p, arguments);
		}
	}


	pBuffer = gen.array<IVec2>(256, Vec2);
	iElement = 0;

}