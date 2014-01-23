/// <reference path="../common.ts" />
/// <reference path="../logger.ts" />
/// <reference path="../idl/IVec4.ts" />
/// <reference path="math.ts" />
/// <reference path="../gen/generate.ts" />

module akra.math {

	var pBuffer: IVec4[];
	var iElement: uint;

	export class Vec4 implements IVec4 {
		x: float;
		y: float;
		z: float;
		w: float;

		constructor();
		constructor(xyzw: float);
		constructor(xyzw: IVec4);
		constructor(xyzw: float[]);
		constructor(rgba: IColorValue);
		constructor(x: float, yzw: IVec3);
		constructor(xy: IVec2, zw: IVec2);
		constructor(xyz: IVec3, w: float);
		constructor(x: float, y: float, zw: IVec2);
		constructor(x: float, yz: IVec2, w: float);
		constructor(xy: IVec2, z: float, w: float);
		constructor(x: float, y: float, z: float, w: float);
		constructor(x?, y?, z?, w?) {
			var n: uint = arguments.length;
			var v: IVec4 = this;

			switch (n) {
				case 1:
					v.set(arguments[0]);
					break;
				case 2:
					v.set(arguments[0], arguments[1]);
					break;
				case 3:
					v.set(arguments[0], arguments[1], arguments[2]);
					break;
				case 4:
					v.set(arguments[0], arguments[1], arguments[2], arguments[3]);
					break;
				default:
					v.x = v.y = v.z = v.w = 0.;
					break;
			}
		}

		set(): IVec4;
		set(xyzw: float): IVec4;
		set(xyzw: IVec4): IVec4;
		set(xyzw: float[]): IVec4;
		set(rgba: IColorValue): IVec4;
		set(x: float, yzw: IVec3): IVec4;
		set(xy: IVec2, zw: IVec2): IVec4;
		set(xyz: IVec3, w: float): IVec4;
		set(x: float, y: float, zw: IVec2): IVec4;
		set(x: float, yz: IVec2, w: float): IVec4;
		set(xy: IVec2, z: float, w: float): IVec4;
		set(x: float, y: float, z: float, w: float): IVec4;
		set(): IVec4 {
			var nArgumentsLength: uint = arguments.length;

			switch (nArgumentsLength) {
				case 0:
					this.x = this.y = this.z = this.w = 0.;
					break;
				case 1:
					if (isFloat(arguments[0])) {
						this.x = this.y = this.z = this.w = arguments[0];
					}
					else if (arguments[0] instanceof Vec4) {
						var v4fVec: IVec4 = arguments[0];

						this.x = v4fVec.x;
						this.y = v4fVec.y;
						this.z = v4fVec.z;
						this.w = v4fVec.w;
					}
					//color
					else if (isDef(arguments[0].r)) {
						this.x = arguments[0].r;
						this.y = arguments[0].g;
						this.z = arguments[0].b;
						this.w = arguments[0].a;
					}
					else {
						//array
						var pArray: float[] = arguments[0];

						this.x = pArray[0];
						this.y = pArray[1];
						this.z = pArray[2];
						this.w = pArray[3];
					}
					break;
				case 2:
					if (isFloat(arguments[0])) {
						var fValue: float = arguments[0];
						var v3fVec: IVec3 = arguments[1];

						this.x = fValue;
						this.y = v3fVec.x;
						this.z = v3fVec.y;
						this.w = v3fVec.z;
					}
					else if (arguments[0] instanceof Vec2) {
						var v2fVec1: IVec2 = arguments[0];
						var v2fVec2: IVec2 = arguments[1];

						this.x = v2fVec1.x;
						this.y = v2fVec1.y;
						this.z = v2fVec2.x;
						this.w = v2fVec2.y;
					}
					else {
						var v3fVec: IVec3 = arguments[0];
						var fValue: float = arguments[1];

						this.x = v3fVec.x;
						this.y = v3fVec.y;
						this.z = v3fVec.z;
						this.w = fValue;
					}
					break;
				case 3:
					if (isFloat(arguments[0])) {
						var fValue1: float = arguments[0];

						if (isFloat(arguments[1])) {
							var fValue2: float = arguments[1];
							var v2fVec: IVec2 = arguments[2];

							this.x = fValue1;
							this.y = fValue2;
							this.z = v2fVec.x;
							this.w = v2fVec.y;
						}
						else {
							var v2fVec: IVec2 = arguments[1];
							var fValue2: float = arguments[2];

							this.x = fValue1;
							this.y = v2fVec.x;
							this.z = v2fVec.y;
							this.w = fValue2;
						}
					}
					else {
						var v2fVec: IVec2 = arguments[0];
						var fValue1: float = arguments[1];
						var fValue2: float = arguments[2];

						this.x = v2fVec.x;
						this.y = v2fVec.y;
						this.z = fValue1;
						this.w = fValue2;
					}
					break;
				case 4:
					this.x = arguments[0];
					this.y = arguments[1];
					this.z = arguments[2];
					this.w = arguments[3];
					break;
			}

			return this;
		}

		/**  */ clear(): IVec4 {
			this.x = this.y = this.z = this.w = 0.;
			return this;
		}

		add(v4fVec: IVec4, v4fDestination?: IVec4): IVec4 {
			if (!isDef(v4fDestination)) {
				v4fDestination = this;
			}

			v4fDestination.x = this.x + v4fVec.x;
			v4fDestination.y = this.y + v4fVec.y;
			v4fDestination.z = this.z + v4fVec.z;
			v4fDestination.w = this.w + v4fVec.w;

			return v4fDestination;
		}

		subtract(v4fVec: IVec4, v4fDestination?: IVec4): IVec4 {
			if (!isDef(v4fDestination)) {
				v4fDestination = this;
			}

			v4fDestination.x = this.x - v4fVec.x;
			v4fDestination.y = this.y - v4fVec.y;
			v4fDestination.z = this.z - v4fVec.z;
			v4fDestination.w = this.w - v4fVec.w;

			return v4fDestination;
		}

		/**  */ dot(v4fVec: IVec4): float {
			return this.x * v4fVec.x + this.y * v4fVec.y + this.z * v4fVec.z + this.w * v4fVec.w;
		}

		isEqual(v4fVec: IVec4, fEps: float = 0.): boolean {
			if (fEps === 0.) {
				if (this.x != v4fVec.x
					|| this.y != v4fVec.y
					|| this.z != v4fVec.z
					|| this.w != v4fVec.w) {

					return false;
				}
			}
			else {
				if (abs(this.x - v4fVec.x) > fEps
					|| abs(this.y - v4fVec.y) > fEps
					|| abs(this.z - v4fVec.z) > fEps
					|| abs(this.w - v4fVec.w) > fEps) {

					return false;
				}
			}
			return true;
		}

		isClear(fEps: float = 0.): boolean {

			if (fEps === 0.) {
				if (this.x != 0.
					|| this.y != 0.
					|| this.z != 0.
					|| this.w != 0.) {

					return false;
				}
			}
			else {
				if (abs(this.x) > fEps
					|| abs(this.y) > fEps
					|| abs(this.z) > fEps
					|| abs(this.w) > fEps) {

					return false;
				}
			}
			return true;
		}

		negate(v4fDestination?: IVec4): IVec4 {
			if (!isDef(v4fDestination)) {
				v4fDestination = this;
			}

			v4fDestination.x = -this.x;
			v4fDestination.y = -this.y;
			v4fDestination.z = -this.z;
			v4fDestination.w = -this.w;

			return v4fDestination;
		}

		scale(fScale: float, v4fDestination?: IVec4): IVec4 {
			if (!isDef(v4fDestination)) {
				v4fDestination = this;
			}

			v4fDestination.x = this.x * fScale;
			v4fDestination.y = this.y * fScale;
			v4fDestination.z = this.z * fScale;
			v4fDestination.w = this.w * fScale;

			return v4fDestination;
		}

		normalize(v4fDestination?: IVec4): IVec4 {
			if (!isDef(v4fDestination)) {
				v4fDestination = this;
			}

			var x: float = this.x, y: float = this.y, z: float = this.z, w: float = this.w;
			var fLength: float = sqrt(x * x + y * y + z * z + w * w);

			if (fLength !== 0.) {
				var fInvLength: float = 1. / fLength;

				x *= fInvLength;
				y *= fInvLength;
				z *= fInvLength;
				w *= fInvLength;
			}

			v4fDestination.x = x;
			v4fDestination.y = y;
			v4fDestination.z = z;
			v4fDestination.w = w;

			return v4fDestination;
		}

		/**  */ length(): float {
			var x: float = this.x, y: float = this.y, z: float = this.z, w: float = this.w;
			return sqrt(x * x + y * y + z * z + w * w);
		}

		/**  */ lengthSquare(): float {
			var x: float = this.x, y: float = this.y, z: float = this.z, w: float = this.w;
			return x * x + y * y + z * z + w * w;
		}

		direction(v4fVec: IVec4, v4fDestination?: IVec4): IVec4 {
			if (!isDef(v4fDestination)) {
				v4fDestination = this;
			}

			var x: float = v4fVec.x - this.x;
			var y: float = v4fVec.y - this.y;
			var z: float = v4fVec.z - this.z;
			var w: float = v4fVec.w - this.w;

			var fLength: float = sqrt(x * x + y * y + z * z + w * w);

			if (fLength !== 0.) {
				var fInvLength = 1. / fLength;

				x *= fInvLength;
				y *= fInvLength;
				z *= fInvLength;
				w *= fInvLength;
			}

			v4fDestination.x = x;
			v4fDestination.y = y;
			v4fDestination.z = z;
			v4fDestination.w = w;

			return v4fDestination;
		}

		mix(v4fVec: IVec4, fA: float, v4fDestination?: IVec4): IVec4 {
			if (!isDef(v4fDestination)) {
				v4fDestination = this;
			}

			fA = clamp(fA, 0., 1.);

			var fA1: float = 1. - fA;
			var fA2: float = fA;

			v4fDestination.x = fA1 * this.x + fA2 * v4fVec.x;
			v4fDestination.y = fA1 * this.y + fA2 * v4fVec.y;
			v4fDestination.z = fA1 * this.z + fA2 * v4fVec.z;
			v4fDestination.w = fA1 * this.w + fA2 * v4fVec.w;

			return v4fDestination;
		}

		/**  */ toString(): string {
			return "[x: " + this.x + ", y: " + this.y
				+ ", z: " + this.z + ", w: " + this.w + "]";
		}

		clone(sForm: string, v2fDest?: IVec2): IVec2;
		clone(sForm: string, v3fDest?: IVec3): IVec3;
		clone(sForm: string, v4fDest?: IVec4): IVec4;
		clone(sForm: string, pVec2OrVec3OrVec4?: any): any {
			if (sForm.length === 2) {
				var v2fDest: IVec2 = isDefAndNotNull(pVec2OrVec3OrVec4) ? <IVec2>pVec2OrVec3OrVec4 : Vec2.temp();

				switch(sForm){
					case "xx":
						return v2fDest.set(this.x, this.x);
					case "xy":
						return v2fDest.set(this.x, this.y);
					case "xz":
						return v2fDest.set(this.x, this.z);
					case "xw":
						return v2fDest.set(this.x, this.w);
					case "yx":
						return v2fDest.set(this.y, this.x);
					case "yy":
						return v2fDest.set(this.y, this.y);
					case "yz":
						return v2fDest.set(this.y, this.z);
					case "yw":
						return v2fDest.set(this.y, this.w);
					case "zx":
						return v2fDest.set(this.z, this.x);
					case "zy":
						return v2fDest.set(this.z, this.y);
					case "zz":
						return v2fDest.set(this.z, this.z);
					case "zw":
						return v2fDest.set(this.z, this.w);
					case "wx":
						return v2fDest.set(this.w, this.x);
					case "wy":
						return v2fDest.set(this.w, this.y);
					case "wz":
						return v2fDest.set(this.w, this.z);
					case "ww":
						return v2fDest.set(this.w, this.w);
				}
			}
			else if(sForm.length === 3) {
				var v3fDest: IVec3 = isDefAndNotNull(pVec2OrVec3OrVec4) ? <IVec3>pVec2OrVec3OrVec4 : Vec3.temp();

				switch(sForm){
					case "xxx":
						return v3fDest.set(this.x, this.x, this.x);
					case "xxy":
						return v3fDest.set(this.x, this.x, this.y);
					case "xxz":
						return v3fDest.set(this.x, this.x, this.z);
					case "xxw":
						return v3fDest.set(this.x, this.x, this.w);
					case "xyx":
						return v3fDest.set(this.x, this.y, this.x);
					case "xyy":
						return v3fDest.set(this.x, this.y, this.y);
					case "xyz":
						return v3fDest.set(this.x, this.y, this.z);
					case "xyw":
						return v3fDest.set(this.x, this.y, this.w);
					case "xzx":
						return v3fDest.set(this.x, this.z, this.x);
					case "xzy":
						return v3fDest.set(this.x, this.z, this.y);
					case "xzz":
						return v3fDest.set(this.x, this.z, this.z);
					case "xzw":
						return v3fDest.set(this.x, this.z, this.w);
					case "xwx":
						return v3fDest.set(this.x, this.w, this.x);
					case "xwy":
						return v3fDest.set(this.x, this.w, this.y);
					case "xwz":
						return v3fDest.set(this.x, this.w, this.z);
					case "xww":
						return v3fDest.set(this.x, this.w, this.w);
					case "yxx":
						return v3fDest.set(this.y, this.x, this.x);
					case "yxy":
						return v3fDest.set(this.y, this.x, this.y);
					case "yxz":
						return v3fDest.set(this.y, this.x, this.z);
					case "yxw":
						return v3fDest.set(this.y, this.x, this.w);
					case "yyx":
						return v3fDest.set(this.y, this.y, this.x);
					case "yyy":
						return v3fDest.set(this.y, this.y, this.y);
					case "yyz":
						return v3fDest.set(this.y, this.y, this.z);
					case "yyw":
						return v3fDest.set(this.y, this.y, this.w);
					case "yzx":
						return v3fDest.set(this.y, this.z, this.x);
					case "yzy":
						return v3fDest.set(this.y, this.z, this.y);
					case "yzz":
						return v3fDest.set(this.y, this.z, this.z);
					case "yzw":
						return v3fDest.set(this.y, this.z, this.w);
					case "ywx":
						return v3fDest.set(this.y, this.w, this.x);
					case "ywy":
						return v3fDest.set(this.y, this.w, this.y);
					case "ywz":
						return v3fDest.set(this.y, this.w, this.z);
					case "yww":
						return v3fDest.set(this.y, this.w, this.w);
					case "zxx":
						return v3fDest.set(this.z, this.x, this.x);
					case "zxy":
						return v3fDest.set(this.z, this.x, this.y);
					case "zxz":
						return v3fDest.set(this.z, this.x, this.z);
					case "zxw":
						return v3fDest.set(this.z, this.x, this.w);
					case "zyx":
						return v3fDest.set(this.z, this.y, this.x);
					case "zyy":
						return v3fDest.set(this.z, this.y, this.y);
					case "zyz":
						return v3fDest.set(this.z, this.y, this.z);
					case "zyw":
						return v3fDest.set(this.z, this.y, this.w);
					case "zzx":
						return v3fDest.set(this.z, this.z, this.x);
					case "zzy":
						return v3fDest.set(this.z, this.z, this.y);
					case "zzz":
						return v3fDest.set(this.z, this.z, this.z);
					case "zzw":
						return v3fDest.set(this.z, this.z, this.w);
					case "zwx":
						return v3fDest.set(this.z, this.w, this.x);
					case "zwy":
						return v3fDest.set(this.z, this.w, this.y);
					case "zwz":
						return v3fDest.set(this.z, this.w, this.z);
					case "zww":
						return v3fDest.set(this.z, this.w, this.w);
					case "wxx":
						return v3fDest.set(this.w, this.x, this.x);
					case "wxy":
						return v3fDest.set(this.w, this.x, this.y);
					case "wxz":
						return v3fDest.set(this.w, this.x, this.z);
					case "wxw":
						return v3fDest.set(this.w, this.x, this.w);
					case "wyx":
						return v3fDest.set(this.w, this.y, this.x);
					case "wyy":
						return v3fDest.set(this.w, this.y, this.y);
					case "wyz":
						return v3fDest.set(this.w, this.y, this.z);
					case "wyw":
						return v3fDest.set(this.w, this.y, this.w);
					case "wzx":
						return v3fDest.set(this.w, this.z, this.x);
					case "wzy":
						return v3fDest.set(this.w, this.z, this.y);
					case "wzz":
						return v3fDest.set(this.w, this.z, this.z);
					case "wzw":
						return v3fDest.set(this.w, this.z, this.w);
					case "wwx":
						return v3fDest.set(this.w, this.w, this.x);
					case "wwy":
						return v3fDest.set(this.w, this.w, this.y);
					case "wwz":
						return v3fDest.set(this.w, this.w, this.z);
					case "www":
						return v3fDest.set(this.w, this.w, this.w);
				}
			}
			else if(sForm.length === 4) {
				var v4fDest: IVec4 = isDefAndNotNull(pVec2OrVec3OrVec4) ? <IVec4>pVec2OrVec3OrVec4 : Vec4.temp();

				switch(sForm){
					case "xxxx":
						return v4fDest.set(this.x, this.x, this.x, this.x);
					case "xxxy":
						return v4fDest.set(this.x, this.x, this.x, this.y);
					case "xxxz":
						return v4fDest.set(this.x, this.x, this.x, this.z);
					case "xxxw":
						return v4fDest.set(this.x, this.x, this.x, this.w);
					case "xxyx":
						return v4fDest.set(this.x, this.x, this.y, this.x);
					case "xxyy":
						return v4fDest.set(this.x, this.x, this.y, this.y);
					case "xxyz":
						return v4fDest.set(this.x, this.x, this.y, this.z);
					case "xxyw":
						return v4fDest.set(this.x, this.x, this.y, this.w);
					case "xxzx":
						return v4fDest.set(this.x, this.x, this.z, this.x);
					case "xxzy":
						return v4fDest.set(this.x, this.x, this.z, this.y);
					case "xxzz":
						return v4fDest.set(this.x, this.x, this.z, this.z);
					case "xxzw":
						return v4fDest.set(this.x, this.x, this.z, this.w);
					case "xxwx":
						return v4fDest.set(this.x, this.x, this.w, this.x);
					case "xxwy":
						return v4fDest.set(this.x, this.x, this.w, this.y);
					case "xxwz":
						return v4fDest.set(this.x, this.x, this.w, this.z);
					case "xxww":
						return v4fDest.set(this.x, this.x, this.w, this.w);
					case "xyxx":
						return v4fDest.set(this.x, this.y, this.x, this.x);
					case "xyxy":
						return v4fDest.set(this.x, this.y, this.x, this.y);
					case "xyxz":
						return v4fDest.set(this.x, this.y, this.x, this.z);
					case "xyxw":
						return v4fDest.set(this.x, this.y, this.x, this.w);
					case "xyyx":
						return v4fDest.set(this.x, this.y, this.y, this.x);
					case "xyyy":
						return v4fDest.set(this.x, this.y, this.y, this.y);
					case "xyyz":
						return v4fDest.set(this.x, this.y, this.y, this.z);
					case "xyyw":
						return v4fDest.set(this.x, this.y, this.y, this.w);
					case "xyzx":
						return v4fDest.set(this.x, this.y, this.z, this.x);
					case "xyzy":
						return v4fDest.set(this.x, this.y, this.z, this.y);
					case "xyzz":
						return v4fDest.set(this.x, this.y, this.z, this.z);
					case "xyzw":
						return v4fDest.set(this.x, this.y, this.z, this.w);
					case "xywx":
						return v4fDest.set(this.x, this.y, this.w, this.x);
					case "xywy":
						return v4fDest.set(this.x, this.y, this.w, this.y);
					case "xywz":
						return v4fDest.set(this.x, this.y, this.w, this.z);
					case "xyww":
						return v4fDest.set(this.x, this.y, this.w, this.w);
					case "xzxx":
						return v4fDest.set(this.x, this.z, this.x, this.x);
					case "xzxy":
						return v4fDest.set(this.x, this.z, this.x, this.y);
					case "xzxz":
						return v4fDest.set(this.x, this.z, this.x, this.z);
					case "xzxw":
						return v4fDest.set(this.x, this.z, this.x, this.w);
					case "xzyx":
						return v4fDest.set(this.x, this.z, this.y, this.x);
					case "xzyy":
						return v4fDest.set(this.x, this.z, this.y, this.y);
					case "xzyz":
						return v4fDest.set(this.x, this.z, this.y, this.z);
					case "xzyw":
						return v4fDest.set(this.x, this.z, this.y, this.w);
					case "xzzx":
						return v4fDest.set(this.x, this.z, this.z, this.x);
					case "xzzy":
						return v4fDest.set(this.x, this.z, this.z, this.y);
					case "xzzz":
						return v4fDest.set(this.x, this.z, this.z, this.z);
					case "xzzw":
						return v4fDest.set(this.x, this.z, this.z, this.w);
					case "xzwx":
						return v4fDest.set(this.x, this.z, this.w, this.x);
					case "xzwy":
						return v4fDest.set(this.x, this.z, this.w, this.y);
					case "xzwz":
						return v4fDest.set(this.x, this.z, this.w, this.z);
					case "xzww":
						return v4fDest.set(this.x, this.z, this.w, this.w);
					case "xwxx":
						return v4fDest.set(this.x, this.w, this.x, this.x);
					case "xwxy":
						return v4fDest.set(this.x, this.w, this.x, this.y);
					case "xwxz":
						return v4fDest.set(this.x, this.w, this.x, this.z);
					case "xwxw":
						return v4fDest.set(this.x, this.w, this.x, this.w);
					case "xwyx":
						return v4fDest.set(this.x, this.w, this.y, this.x);
					case "xwyy":
						return v4fDest.set(this.x, this.w, this.y, this.y);
					case "xwyz":
						return v4fDest.set(this.x, this.w, this.y, this.z);
					case "xwyw":
						return v4fDest.set(this.x, this.w, this.y, this.w);
					case "xwzx":
						return v4fDest.set(this.x, this.w, this.z, this.x);
					case "xwzy":
						return v4fDest.set(this.x, this.w, this.z, this.y);
					case "xwzz":
						return v4fDest.set(this.x, this.w, this.z, this.z);
					case "xwzw":
						return v4fDest.set(this.x, this.w, this.z, this.w);
					case "xwwx":
						return v4fDest.set(this.x, this.w, this.w, this.x);
					case "xwwy":
						return v4fDest.set(this.x, this.w, this.w, this.y);
					case "xwwz":
						return v4fDest.set(this.x, this.w, this.w, this.z);
					case "xwww":
						return v4fDest.set(this.x, this.w, this.w, this.w);
					case "yxxx":
						return v4fDest.set(this.y, this.x, this.x, this.x);
					case "yxxy":
						return v4fDest.set(this.y, this.x, this.x, this.y);
					case "yxxz":
						return v4fDest.set(this.y, this.x, this.x, this.z);
					case "yxxw":
						return v4fDest.set(this.y, this.x, this.x, this.w);
					case "yxyx":
						return v4fDest.set(this.y, this.x, this.y, this.x);
					case "yxyy":
						return v4fDest.set(this.y, this.x, this.y, this.y);
					case "yxyz":
						return v4fDest.set(this.y, this.x, this.y, this.z);
					case "yxyw":
						return v4fDest.set(this.y, this.x, this.y, this.w);
					case "yxzx":
						return v4fDest.set(this.y, this.x, this.z, this.x);
					case "yxzy":
						return v4fDest.set(this.y, this.x, this.z, this.y);
					case "yxzz":
						return v4fDest.set(this.y, this.x, this.z, this.z);
					case "yxzw":
						return v4fDest.set(this.y, this.x, this.z, this.w);
					case "yxwx":
						return v4fDest.set(this.y, this.x, this.w, this.x);
					case "yxwy":
						return v4fDest.set(this.y, this.x, this.w, this.y);
					case "yxwz":
						return v4fDest.set(this.y, this.x, this.w, this.z);
					case "yxww":
						return v4fDest.set(this.y, this.x, this.w, this.w);
					case "yyxx":
						return v4fDest.set(this.y, this.y, this.x, this.x);
					case "yyxy":
						return v4fDest.set(this.y, this.y, this.x, this.y);
					case "yyxz":
						return v4fDest.set(this.y, this.y, this.x, this.z);
					case "yyxw":
						return v4fDest.set(this.y, this.y, this.x, this.w);
					case "yyyx":
						return v4fDest.set(this.y, this.y, this.y, this.x);
					case "yyyy":
						return v4fDest.set(this.y, this.y, this.y, this.y);
					case "yyyz":
						return v4fDest.set(this.y, this.y, this.y, this.z);
					case "yyyw":
						return v4fDest.set(this.y, this.y, this.y, this.w);
					case "yyzx":
						return v4fDest.set(this.y, this.y, this.z, this.x);
					case "yyzy":
						return v4fDest.set(this.y, this.y, this.z, this.y);
					case "yyzz":
						return v4fDest.set(this.y, this.y, this.z, this.z);
					case "yyzw":
						return v4fDest.set(this.y, this.y, this.z, this.w);
					case "yywx":
						return v4fDest.set(this.y, this.y, this.w, this.x);
					case "yywy":
						return v4fDest.set(this.y, this.y, this.w, this.y);
					case "yywz":
						return v4fDest.set(this.y, this.y, this.w, this.z);
					case "yyww":
						return v4fDest.set(this.y, this.y, this.w, this.w);
					case "yzxx":
						return v4fDest.set(this.y, this.z, this.x, this.x);
					case "yzxy":
						return v4fDest.set(this.y, this.z, this.x, this.y);
					case "yzxz":
						return v4fDest.set(this.y, this.z, this.x, this.z);
					case "yzxw":
						return v4fDest.set(this.y, this.z, this.x, this.w);
					case "yzyx":
						return v4fDest.set(this.y, this.z, this.y, this.x);
					case "yzyy":
						return v4fDest.set(this.y, this.z, this.y, this.y);
					case "yzyz":
						return v4fDest.set(this.y, this.z, this.y, this.z);
					case "yzyw":
						return v4fDest.set(this.y, this.z, this.y, this.w);
					case "yzzx":
						return v4fDest.set(this.y, this.z, this.z, this.x);
					case "yzzy":
						return v4fDest.set(this.y, this.z, this.z, this.y);
					case "yzzz":
						return v4fDest.set(this.y, this.z, this.z, this.z);
					case "yzzw":
						return v4fDest.set(this.y, this.z, this.z, this.w);
					case "yzwx":
						return v4fDest.set(this.y, this.z, this.w, this.x);
					case "yzwy":
						return v4fDest.set(this.y, this.z, this.w, this.y);
					case "yzwz":
						return v4fDest.set(this.y, this.z, this.w, this.z);
					case "yzww":
						return v4fDest.set(this.y, this.z, this.w, this.w);
					case "ywxx":
						return v4fDest.set(this.y, this.w, this.x, this.x);
					case "ywxy":
						return v4fDest.set(this.y, this.w, this.x, this.y);
					case "ywxz":
						return v4fDest.set(this.y, this.w, this.x, this.z);
					case "ywxw":
						return v4fDest.set(this.y, this.w, this.x, this.w);
					case "ywyx":
						return v4fDest.set(this.y, this.w, this.y, this.x);
					case "ywyy":
						return v4fDest.set(this.y, this.w, this.y, this.y);
					case "ywyz":
						return v4fDest.set(this.y, this.w, this.y, this.z);
					case "ywyw":
						return v4fDest.set(this.y, this.w, this.y, this.w);
					case "ywzx":
						return v4fDest.set(this.y, this.w, this.z, this.x);
					case "ywzy":
						return v4fDest.set(this.y, this.w, this.z, this.y);
					case "ywzz":
						return v4fDest.set(this.y, this.w, this.z, this.z);
					case "ywzw":
						return v4fDest.set(this.y, this.w, this.z, this.w);
					case "ywwx":
						return v4fDest.set(this.y, this.w, this.w, this.x);
					case "ywwy":
						return v4fDest.set(this.y, this.w, this.w, this.y);
					case "ywwz":
						return v4fDest.set(this.y, this.w, this.w, this.z);
					case "ywww":
						return v4fDest.set(this.y, this.w, this.w, this.w);
					case "zxxx":
						return v4fDest.set(this.z, this.x, this.x, this.x);
					case "zxxy":
						return v4fDest.set(this.z, this.x, this.x, this.y);
					case "zxxz":
						return v4fDest.set(this.z, this.x, this.x, this.z);
					case "zxxw":
						return v4fDest.set(this.z, this.x, this.x, this.w);
					case "zxyx":
						return v4fDest.set(this.z, this.x, this.y, this.x);
					case "zxyy":
						return v4fDest.set(this.z, this.x, this.y, this.y);
					case "zxyz":
						return v4fDest.set(this.z, this.x, this.y, this.z);
					case "zxyw":
						return v4fDest.set(this.z, this.x, this.y, this.w);
					case "zxzx":
						return v4fDest.set(this.z, this.x, this.z, this.x);
					case "zxzy":
						return v4fDest.set(this.z, this.x, this.z, this.y);
					case "zxzz":
						return v4fDest.set(this.z, this.x, this.z, this.z);
					case "zxzw":
						return v4fDest.set(this.z, this.x, this.z, this.w);
					case "zxwx":
						return v4fDest.set(this.z, this.x, this.w, this.x);
					case "zxwy":
						return v4fDest.set(this.z, this.x, this.w, this.y);
					case "zxwz":
						return v4fDest.set(this.z, this.x, this.w, this.z);
					case "zxww":
						return v4fDest.set(this.z, this.x, this.w, this.w);
					case "zyxx":
						return v4fDest.set(this.z, this.y, this.x, this.x);
					case "zyxy":
						return v4fDest.set(this.z, this.y, this.x, this.y);
					case "zyxz":
						return v4fDest.set(this.z, this.y, this.x, this.z);
					case "zyxw":
						return v4fDest.set(this.z, this.y, this.x, this.w);
					case "zyyx":
						return v4fDest.set(this.z, this.y, this.y, this.x);
					case "zyyy":
						return v4fDest.set(this.z, this.y, this.y, this.y);
					case "zyyz":
						return v4fDest.set(this.z, this.y, this.y, this.z);
					case "zyyw":
						return v4fDest.set(this.z, this.y, this.y, this.w);
					case "zyzx":
						return v4fDest.set(this.z, this.y, this.z, this.x);
					case "zyzy":
						return v4fDest.set(this.z, this.y, this.z, this.y);
					case "zyzz":
						return v4fDest.set(this.z, this.y, this.z, this.z);
					case "zyzw":
						return v4fDest.set(this.z, this.y, this.z, this.w);
					case "zywx":
						return v4fDest.set(this.z, this.y, this.w, this.x);
					case "zywy":
						return v4fDest.set(this.z, this.y, this.w, this.y);
					case "zywz":
						return v4fDest.set(this.z, this.y, this.w, this.z);
					case "zyww":
						return v4fDest.set(this.z, this.y, this.w, this.w);
					case "zzxx":
						return v4fDest.set(this.z, this.z, this.x, this.x);
					case "zzxy":
						return v4fDest.set(this.z, this.z, this.x, this.y);
					case "zzxz":
						return v4fDest.set(this.z, this.z, this.x, this.z);
					case "zzxw":
						return v4fDest.set(this.z, this.z, this.x, this.w);
					case "zzyx":
						return v4fDest.set(this.z, this.z, this.y, this.x);
					case "zzyy":
						return v4fDest.set(this.z, this.z, this.y, this.y);
					case "zzyz":
						return v4fDest.set(this.z, this.z, this.y, this.z);
					case "zzyw":
						return v4fDest.set(this.z, this.z, this.y, this.w);
					case "zzzx":
						return v4fDest.set(this.z, this.z, this.z, this.x);
					case "zzzy":
						return v4fDest.set(this.z, this.z, this.z, this.y);
					case "zzzz":
						return v4fDest.set(this.z, this.z, this.z, this.z);
					case "zzzw":
						return v4fDest.set(this.z, this.z, this.z, this.w);
					case "zzwx":
						return v4fDest.set(this.z, this.z, this.w, this.x);
					case "zzwy":
						return v4fDest.set(this.z, this.z, this.w, this.y);
					case "zzwz":
						return v4fDest.set(this.z, this.z, this.w, this.z);
					case "zzww":
						return v4fDest.set(this.z, this.z, this.w, this.w);
					case "zwxx":
						return v4fDest.set(this.z, this.w, this.x, this.x);
					case "zwxy":
						return v4fDest.set(this.z, this.w, this.x, this.y);
					case "zwxz":
						return v4fDest.set(this.z, this.w, this.x, this.z);
					case "zwxw":
						return v4fDest.set(this.z, this.w, this.x, this.w);
					case "zwyx":
						return v4fDest.set(this.z, this.w, this.y, this.x);
					case "zwyy":
						return v4fDest.set(this.z, this.w, this.y, this.y);
					case "zwyz":
						return v4fDest.set(this.z, this.w, this.y, this.z);
					case "zwyw":
						return v4fDest.set(this.z, this.w, this.y, this.w);
					case "zwzx":
						return v4fDest.set(this.z, this.w, this.z, this.x);
					case "zwzy":
						return v4fDest.set(this.z, this.w, this.z, this.y);
					case "zwzz":
						return v4fDest.set(this.z, this.w, this.z, this.z);
					case "zwzw":
						return v4fDest.set(this.z, this.w, this.z, this.w);
					case "zwwx":
						return v4fDest.set(this.z, this.w, this.w, this.x);
					case "zwwy":
						return v4fDest.set(this.z, this.w, this.w, this.y);
					case "zwwz":
						return v4fDest.set(this.z, this.w, this.w, this.z);
					case "zwww":
						return v4fDest.set(this.z, this.w, this.w, this.w);
					case "wxxx":
						return v4fDest.set(this.w, this.x, this.x, this.x);
					case "wxxy":
						return v4fDest.set(this.w, this.x, this.x, this.y);
					case "wxxz":
						return v4fDest.set(this.w, this.x, this.x, this.z);
					case "wxxw":
						return v4fDest.set(this.w, this.x, this.x, this.w);
					case "wxyx":
						return v4fDest.set(this.w, this.x, this.y, this.x);
					case "wxyy":
						return v4fDest.set(this.w, this.x, this.y, this.y);
					case "wxyz":
						return v4fDest.set(this.w, this.x, this.y, this.z);
					case "wxyw":
						return v4fDest.set(this.w, this.x, this.y, this.w);
					case "wxzx":
						return v4fDest.set(this.w, this.x, this.z, this.x);
					case "wxzy":
						return v4fDest.set(this.w, this.x, this.z, this.y);
					case "wxzz":
						return v4fDest.set(this.w, this.x, this.z, this.z);
					case "wxzw":
						return v4fDest.set(this.w, this.x, this.z, this.w);
					case "wxwx":
						return v4fDest.set(this.w, this.x, this.w, this.x);
					case "wxwy":
						return v4fDest.set(this.w, this.x, this.w, this.y);
					case "wxwz":
						return v4fDest.set(this.w, this.x, this.w, this.z);
					case "wxww":
						return v4fDest.set(this.w, this.x, this.w, this.w);
					case "wyxx":
						return v4fDest.set(this.w, this.y, this.x, this.x);
					case "wyxy":
						return v4fDest.set(this.w, this.y, this.x, this.y);
					case "wyxz":
						return v4fDest.set(this.w, this.y, this.x, this.z);
					case "wyxw":
						return v4fDest.set(this.w, this.y, this.x, this.w);
					case "wyyx":
						return v4fDest.set(this.w, this.y, this.y, this.x);
					case "wyyy":
						return v4fDest.set(this.w, this.y, this.y, this.y);
					case "wyyz":
						return v4fDest.set(this.w, this.y, this.y, this.z);
					case "wyyw":
						return v4fDest.set(this.w, this.y, this.y, this.w);
					case "wyzx":
						return v4fDest.set(this.w, this.y, this.z, this.x);
					case "wyzy":
						return v4fDest.set(this.w, this.y, this.z, this.y);
					case "wyzz":
						return v4fDest.set(this.w, this.y, this.z, this.z);
					case "wyzw":
						return v4fDest.set(this.w, this.y, this.z, this.w);
					case "wywx":
						return v4fDest.set(this.w, this.y, this.w, this.x);
					case "wywy":
						return v4fDest.set(this.w, this.y, this.w, this.y);
					case "wywz":
						return v4fDest.set(this.w, this.y, this.w, this.z);
					case "wyww":
						return v4fDest.set(this.w, this.y, this.w, this.w);
					case "wzxx":
						return v4fDest.set(this.w, this.z, this.x, this.x);
					case "wzxy":
						return v4fDest.set(this.w, this.z, this.x, this.y);
					case "wzxz":
						return v4fDest.set(this.w, this.z, this.x, this.z);
					case "wzxw":
						return v4fDest.set(this.w, this.z, this.x, this.w);
					case "wzyx":
						return v4fDest.set(this.w, this.z, this.y, this.x);
					case "wzyy":
						return v4fDest.set(this.w, this.z, this.y, this.y);
					case "wzyz":
						return v4fDest.set(this.w, this.z, this.y, this.z);
					case "wzyw":
						return v4fDest.set(this.w, this.z, this.y, this.w);
					case "wzzx":
						return v4fDest.set(this.w, this.z, this.z, this.x);
					case "wzzy":
						return v4fDest.set(this.w, this.z, this.z, this.y);
					case "wzzz":
						return v4fDest.set(this.w, this.z, this.z, this.z);
					case "wzzw":
						return v4fDest.set(this.w, this.z, this.z, this.w);
					case "wzwx":
						return v4fDest.set(this.w, this.z, this.w, this.x);
					case "wzwy":
						return v4fDest.set(this.w, this.z, this.w, this.y);
					case "wzwz":
						return v4fDest.set(this.w, this.z, this.w, this.z);
					case "wzww":
						return v4fDest.set(this.w, this.z, this.w, this.w);
					case "wwxx":
						return v4fDest.set(this.w, this.w, this.x, this.x);
					case "wwxy":
						return v4fDest.set(this.w, this.w, this.x, this.y);
					case "wwxz":
						return v4fDest.set(this.w, this.w, this.x, this.z);
					case "wwxw":
						return v4fDest.set(this.w, this.w, this.x, this.w);
					case "wwyx":
						return v4fDest.set(this.w, this.w, this.y, this.x);
					case "wwyy":
						return v4fDest.set(this.w, this.w, this.y, this.y);
					case "wwyz":
						return v4fDest.set(this.w, this.w, this.y, this.z);
					case "wwyw":
						return v4fDest.set(this.w, this.w, this.y, this.w);
					case "wwzx":
						return v4fDest.set(this.w, this.w, this.z, this.x);
					case "wwzy":
						return v4fDest.set(this.w, this.w, this.z, this.y);
					case "wwzz":
						return v4fDest.set(this.w, this.w, this.z, this.z);
					case "wwzw":
						return v4fDest.set(this.w, this.w, this.z, this.w);
					case "wwwx":
						return v4fDest.set(this.w, this.w, this.w, this.x);
					case "wwwy":
						return v4fDest.set(this.w, this.w, this.w, this.y);
					case "wwwz":
						return v4fDest.set(this.w, this.w, this.w, this.z);
					case "wwww":
						return v4fDest.set(this.w, this.w, this.w, this.w);
				}
			}

			logger.error("Bad vector form", sForm);
			return null;
		}
		
		copy(sForm: string, fValue: float): IVec4;
		copy(sForm: string, v2fFrom: IVec2): IVec4;
		copy(sForm: string, v3fFrom: IVec3): IVec4;
		copy(sForm: string, v4fFrom: IVec4): IVec4;
		copy(sForm: string, pVectorOrFloat: any): IVec4 {
			if (sForm.length === 2) {
				var v2fFrom: IVec2 = isFloat(pVectorOrFloat) ? Vec2.temp(pVectorOrFloat) : <IVec2>pVectorOrFloat;

				switch(sForm){
					case "xx":
						this.x = v2fFrom.x; this.x = v2fFrom.y;
						return this;
					case "xy":
						this.x = v2fFrom.x; this.y = v2fFrom.y;
						return this;
					case "xz":
						this.x = v2fFrom.x; this.z = v2fFrom.y;
						return this;
					case "xw":
						this.x = v2fFrom.x; this.w = v2fFrom.y;
						return this;
					case "yx":
						this.y = v2fFrom.x; this.x = v2fFrom.y;
						return this;
					case "yy":
						this.y = v2fFrom.x; this.y = v2fFrom.y;
						return this;
					case "yz":
						this.y = v2fFrom.x; this.z = v2fFrom.y;
						return this;
					case "yw":
						this.y = v2fFrom.x; this.w = v2fFrom.y;
						return this;
					case "zx":
						this.z = v2fFrom.x; this.x = v2fFrom.y;
						return this;
					case "zy":
						this.z = v2fFrom.x; this.y = v2fFrom.y;
						return this;
					case "zz":
						this.z = v2fFrom.x; this.z = v2fFrom.y;
						return this;
					case "zw":
						this.z = v2fFrom.x; this.w = v2fFrom.y;
						return this;
					case "wx":
						this.w = v2fFrom.x; this.x = v2fFrom.y;
						return this;
					case "wy":
						this.w = v2fFrom.x; this.y = v2fFrom.y;
						return this;
					case "wz":
						this.w = v2fFrom.x; this.z = v2fFrom.y;
						return this;
					case "ww":
						this.w = v2fFrom.x; this.w = v2fFrom.y;
						return this;
				}
			}
			else if(sForm.length === 3) {
				var v3fFrom: IVec3 = isFloat(pVectorOrFloat) ? Vec3.temp(pVectorOrFloat) : <IVec3>pVectorOrFloat;

				switch(sForm){
					case "xxx":
						this.x = v3fFrom.x;	this.x = v3fFrom.y;	this.x = v3fFrom.z;
						return this;
					case "xxy":
						this.x = v3fFrom.x;	this.x = v3fFrom.y;	this.y = v3fFrom.z;
						return this;
					case "xxz":
						this.x = v3fFrom.x;	this.x = v3fFrom.y;	this.z = v3fFrom.z;
						return this;
					case "xxw":
						this.x = v3fFrom.x;	this.x = v3fFrom.y;	this.w = v3fFrom.z;
						return this;
					case "xyx":
						this.x = v3fFrom.x;	this.y = v3fFrom.y;	this.x = v3fFrom.z;
						return this;
					case "xyy":
						this.x = v3fFrom.x;	this.y = v3fFrom.y;	this.y = v3fFrom.z;
						return this;
					case "xyz":
						this.x = v3fFrom.x;	this.y = v3fFrom.y;	this.z = v3fFrom.z;
						return this;
					case "xyw":
						this.x = v3fFrom.x;	this.y = v3fFrom.y;	this.w = v3fFrom.z;
						return this;
					case "xzx":
						this.x = v3fFrom.x;	this.z = v3fFrom.y;	this.x = v3fFrom.z;
						return this;
					case "xzy":
						this.x = v3fFrom.x;	this.z = v3fFrom.y;	this.y = v3fFrom.z;
						return this;
					case "xzz":
						this.x = v3fFrom.x;	this.z = v3fFrom.y;	this.z = v3fFrom.z;
						return this;
					case "xzw":
						this.x = v3fFrom.x;	this.z = v3fFrom.y;	this.w = v3fFrom.z;
						return this;
					case "xwx":
						this.x = v3fFrom.x;	this.w = v3fFrom.y;	this.x = v3fFrom.z;
						return this;
					case "xwy":
						this.x = v3fFrom.x;	this.w = v3fFrom.y;	this.y = v3fFrom.z;
						return this;
					case "xwz":
						this.x = v3fFrom.x;	this.w = v3fFrom.y;	this.z = v3fFrom.z;
						return this;
					case "xww":
						this.x = v3fFrom.x;	this.w = v3fFrom.y;	this.w = v3fFrom.z;
						return this;
					case "yxx":
						this.y = v3fFrom.x;	this.x = v3fFrom.y;	this.x = v3fFrom.z;
						return this;
					case "yxy":
						this.y = v3fFrom.x;	this.x = v3fFrom.y;	this.y = v3fFrom.z;
						return this;
					case "yxz":
						this.y = v3fFrom.x;	this.x = v3fFrom.y;	this.z = v3fFrom.z;
						return this;
					case "yxw":
						this.y = v3fFrom.x;	this.x = v3fFrom.y;	this.w = v3fFrom.z;
						return this;
					case "yyx":
						this.y = v3fFrom.x;	this.y = v3fFrom.y;	this.x = v3fFrom.z;
						return this;
					case "yyy":
						this.y = v3fFrom.x;	this.y = v3fFrom.y;	this.y = v3fFrom.z;
						return this;
					case "yyz":
						this.y = v3fFrom.x;	this.y = v3fFrom.y;	this.z = v3fFrom.z;
						return this;
					case "yyw":
						this.y = v3fFrom.x;	this.y = v3fFrom.y;	this.w = v3fFrom.z;
						return this;
					case "yzx":
						this.y = v3fFrom.x;	this.z = v3fFrom.y;	this.x = v3fFrom.z;
						return this;
					case "yzy":
						this.y = v3fFrom.x;	this.z = v3fFrom.y;	this.y = v3fFrom.z;
						return this;
					case "yzz":
						this.y = v3fFrom.x;	this.z = v3fFrom.y;	this.z = v3fFrom.z;
						return this;
					case "yzw":
						this.y = v3fFrom.x;	this.z = v3fFrom.y;	this.w = v3fFrom.z;
						return this;
					case "ywx":
						this.y = v3fFrom.x;	this.w = v3fFrom.y;	this.x = v3fFrom.z;
						return this;
					case "ywy":
						this.y = v3fFrom.x;	this.w = v3fFrom.y;	this.y = v3fFrom.z;
						return this;
					case "ywz":
						this.y = v3fFrom.x;	this.w = v3fFrom.y;	this.z = v3fFrom.z;
						return this;
					case "yww":
						this.y = v3fFrom.x;	this.w = v3fFrom.y;	this.w = v3fFrom.z;
						return this;
					case "zxx":
						this.z = v3fFrom.x;	this.x = v3fFrom.y;	this.x = v3fFrom.z;
						return this;
					case "zxy":
						this.z = v3fFrom.x;	this.x = v3fFrom.y;	this.y = v3fFrom.z;
						return this;
					case "zxz":
						this.z = v3fFrom.x;	this.x = v3fFrom.y;	this.z = v3fFrom.z;
						return this;
					case "zxw":
						this.z = v3fFrom.x;	this.x = v3fFrom.y;	this.w = v3fFrom.z;
						return this;
					case "zyx":
						this.z = v3fFrom.x;	this.y = v3fFrom.y;	this.x = v3fFrom.z;
						return this;
					case "zyy":
						this.z = v3fFrom.x;	this.y = v3fFrom.y;	this.y = v3fFrom.z;
						return this;
					case "zyz":
						this.z = v3fFrom.x;	this.y = v3fFrom.y;	this.z = v3fFrom.z;
						return this;
					case "zyw":
						this.z = v3fFrom.x;	this.y = v3fFrom.y;	this.w = v3fFrom.z;
						return this;
					case "zzx":
						this.z = v3fFrom.x;	this.z = v3fFrom.y;	this.x = v3fFrom.z;
						return this;
					case "zzy":
						this.z = v3fFrom.x;	this.z = v3fFrom.y;	this.y = v3fFrom.z;
						return this;
					case "zzz":
						this.z = v3fFrom.x;	this.z = v3fFrom.y;	this.z = v3fFrom.z;
						return this;
					case "zzw":
						this.z = v3fFrom.x;	this.z = v3fFrom.y;	this.w = v3fFrom.z;
						return this;
					case "zwx":
						this.z = v3fFrom.x;	this.w = v3fFrom.y;	this.x = v3fFrom.z;
						return this;
					case "zwy":
						this.z = v3fFrom.x;	this.w = v3fFrom.y;	this.y = v3fFrom.z;
						return this;
					case "zwz":
						this.z = v3fFrom.x;	this.w = v3fFrom.y;	this.z = v3fFrom.z;
						return this;
					case "zww":
						this.z = v3fFrom.x;	this.w = v3fFrom.y;	this.w = v3fFrom.z;
						return this;
					case "wxx":
						this.w = v3fFrom.x;	this.x = v3fFrom.y;	this.x = v3fFrom.z;
						return this;
					case "wxy":
						this.w = v3fFrom.x;	this.x = v3fFrom.y;	this.y = v3fFrom.z;
						return this;
					case "wxz":
						this.w = v3fFrom.x;	this.x = v3fFrom.y;	this.z = v3fFrom.z;
						return this;
					case "wxw":
						this.w = v3fFrom.x;	this.x = v3fFrom.y;	this.w = v3fFrom.z;
						return this;
					case "wyx":
						this.w = v3fFrom.x;	this.y = v3fFrom.y;	this.x = v3fFrom.z;
						return this;
					case "wyy":
						this.w = v3fFrom.x;	this.y = v3fFrom.y;	this.y = v3fFrom.z;
						return this;
					case "wyz":
						this.w = v3fFrom.x;	this.y = v3fFrom.y;	this.z = v3fFrom.z;
						return this;
					case "wyw":
						this.w = v3fFrom.x;	this.y = v3fFrom.y;	this.w = v3fFrom.z;
						return this;
					case "wzx":
						this.w = v3fFrom.x;	this.z = v3fFrom.y;	this.x = v3fFrom.z;
						return this;
					case "wzy":
						this.w = v3fFrom.x;	this.z = v3fFrom.y;	this.y = v3fFrom.z;
						return this;
					case "wzz":
						this.w = v3fFrom.x;	this.z = v3fFrom.y;	this.z = v3fFrom.z;
						return this;
					case "wzw":
						this.w = v3fFrom.x;	this.z = v3fFrom.y;	this.w = v3fFrom.z;
						return this;
					case "wwx":
						this.w = v3fFrom.x;	this.w = v3fFrom.y;	this.x = v3fFrom.z;
						return this;
					case "wwy":
						this.w = v3fFrom.x;	this.w = v3fFrom.y;	this.y = v3fFrom.z;
						return this;
					case "wwz":
						this.w = v3fFrom.x;	this.w = v3fFrom.y;	this.z = v3fFrom.z;
						return this;
					case "www":
						this.w = v3fFrom.x;	this.w = v3fFrom.y;	this.w = v3fFrom.z;
						return this;
				}
			}
			else if(sForm.length === 4) {
				var v4fFrom: IVec4 = isFloat(pVectorOrFloat) ? Vec4.temp(pVectorOrFloat) : <IVec4>pVectorOrFloat;

				switch(sForm){
					case "xxxx":
						this.x = v4fFrom.x; this.x = v4fFrom.y;	this.x = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "xxxy":
						this.x = v4fFrom.x; this.x = v4fFrom.y;	this.x = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "xxxz":
						this.x = v4fFrom.x; this.x = v4fFrom.y;	this.x = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "xxxw":
						this.x = v4fFrom.x; this.x = v4fFrom.y;	this.x = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "xxyx":
						this.x = v4fFrom.x; this.x = v4fFrom.y;	this.y = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "xxyy":
						this.x = v4fFrom.x; this.x = v4fFrom.y;	this.y = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "xxyz":
						this.x = v4fFrom.x; this.x = v4fFrom.y;	this.y = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "xxyw":
						this.x = v4fFrom.x; this.x = v4fFrom.y;	this.y = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "xxzx":
						this.x = v4fFrom.x; this.x = v4fFrom.y;	this.z = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "xxzy":
						this.x = v4fFrom.x; this.x = v4fFrom.y;	this.z = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "xxzz":
						this.x = v4fFrom.x; this.x = v4fFrom.y;	this.z = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "xxzw":
						this.x = v4fFrom.x; this.x = v4fFrom.y;	this.z = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "xxwx":
						this.x = v4fFrom.x; this.x = v4fFrom.y;	this.w = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "xxwy":
						this.x = v4fFrom.x; this.x = v4fFrom.y;	this.w = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "xxwz":
						this.x = v4fFrom.x; this.x = v4fFrom.y;	this.w = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "xxww":
						this.x = v4fFrom.x; this.x = v4fFrom.y;	this.w = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "xyxx":
						this.x = v4fFrom.x; this.y = v4fFrom.y;	this.x = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "xyxy":
						this.x = v4fFrom.x; this.y = v4fFrom.y;	this.x = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "xyxz":
						this.x = v4fFrom.x; this.y = v4fFrom.y;	this.x = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "xyxw":
						this.x = v4fFrom.x; this.y = v4fFrom.y;	this.x = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "xyyx":
						this.x = v4fFrom.x; this.y = v4fFrom.y;	this.y = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "xyyy":
						this.x = v4fFrom.x; this.y = v4fFrom.y;	this.y = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "xyyz":
						this.x = v4fFrom.x; this.y = v4fFrom.y;	this.y = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "xyyw":
						this.x = v4fFrom.x; this.y = v4fFrom.y;	this.y = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "xyzx":
						this.x = v4fFrom.x; this.y = v4fFrom.y;	this.z = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "xyzy":
						this.x = v4fFrom.x; this.y = v4fFrom.y;	this.z = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "xyzz":
						this.x = v4fFrom.x; this.y = v4fFrom.y;	this.z = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "xyzw":
						this.x = v4fFrom.x; this.y = v4fFrom.y;	this.z = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "xywx":
						this.x = v4fFrom.x; this.y = v4fFrom.y;	this.w = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "xywy":
						this.x = v4fFrom.x; this.y = v4fFrom.y;	this.w = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "xywz":
						this.x = v4fFrom.x; this.y = v4fFrom.y;	this.w = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "xyww":
						this.x = v4fFrom.x; this.y = v4fFrom.y;	this.w = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "xzxx":
						this.x = v4fFrom.x; this.z = v4fFrom.y;	this.x = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "xzxy":
						this.x = v4fFrom.x; this.z = v4fFrom.y;	this.x = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "xzxz":
						this.x = v4fFrom.x; this.z = v4fFrom.y;	this.x = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "xzxw":
						this.x = v4fFrom.x; this.z = v4fFrom.y;	this.x = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "xzyx":
						this.x = v4fFrom.x; this.z = v4fFrom.y;	this.y = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "xzyy":
						this.x = v4fFrom.x; this.z = v4fFrom.y;	this.y = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "xzyz":
						this.x = v4fFrom.x; this.z = v4fFrom.y;	this.y = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "xzyw":
						this.x = v4fFrom.x; this.z = v4fFrom.y;	this.y = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "xzzx":
						this.x = v4fFrom.x; this.z = v4fFrom.y;	this.z = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "xzzy":
						this.x = v4fFrom.x; this.z = v4fFrom.y;	this.z = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "xzzz":
						this.x = v4fFrom.x; this.z = v4fFrom.y;	this.z = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "xzzw":
						this.x = v4fFrom.x; this.z = v4fFrom.y;	this.z = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "xzwx":
						this.x = v4fFrom.x; this.z = v4fFrom.y;	this.w = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "xzwy":
						this.x = v4fFrom.x; this.z = v4fFrom.y;	this.w = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "xzwz":
						this.x = v4fFrom.x; this.z = v4fFrom.y;	this.w = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "xzww":
						this.x = v4fFrom.x; this.z = v4fFrom.y;	this.w = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "xwxx":
						this.x = v4fFrom.x; this.w = v4fFrom.y;	this.x = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "xwxy":
						this.x = v4fFrom.x; this.w = v4fFrom.y;	this.x = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "xwxz":
						this.x = v4fFrom.x; this.w = v4fFrom.y;	this.x = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "xwxw":
						this.x = v4fFrom.x; this.w = v4fFrom.y;	this.x = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "xwyx":
						this.x = v4fFrom.x; this.w = v4fFrom.y;	this.y = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "xwyy":
						this.x = v4fFrom.x; this.w = v4fFrom.y;	this.y = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "xwyz":
						this.x = v4fFrom.x; this.w = v4fFrom.y;	this.y = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "xwyw":
						this.x = v4fFrom.x; this.w = v4fFrom.y;	this.y = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "xwzx":
						this.x = v4fFrom.x; this.w = v4fFrom.y;	this.z = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "xwzy":
						this.x = v4fFrom.x; this.w = v4fFrom.y;	this.z = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "xwzz":
						this.x = v4fFrom.x; this.w = v4fFrom.y;	this.z = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "xwzw":
						this.x = v4fFrom.x; this.w = v4fFrom.y;	this.z = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "xwwx":
						this.x = v4fFrom.x; this.w = v4fFrom.y;	this.w = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "xwwy":
						this.x = v4fFrom.x; this.w = v4fFrom.y;	this.w = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "xwwz":
						this.x = v4fFrom.x; this.w = v4fFrom.y;	this.w = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "xwww":
						this.x = v4fFrom.x; this.w = v4fFrom.y;	this.w = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "yxxx":
						this.y = v4fFrom.x; this.x = v4fFrom.y;	this.x = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "yxxy":
						this.y = v4fFrom.x; this.x = v4fFrom.y;	this.x = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "yxxz":
						this.y = v4fFrom.x; this.x = v4fFrom.y;	this.x = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "yxxw":
						this.y = v4fFrom.x; this.x = v4fFrom.y;	this.x = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "yxyx":
						this.y = v4fFrom.x; this.x = v4fFrom.y;	this.y = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "yxyy":
						this.y = v4fFrom.x; this.x = v4fFrom.y;	this.y = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "yxyz":
						this.y = v4fFrom.x; this.x = v4fFrom.y;	this.y = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "yxyw":
						this.y = v4fFrom.x; this.x = v4fFrom.y;	this.y = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "yxzx":
						this.y = v4fFrom.x; this.x = v4fFrom.y;	this.z = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "yxzy":
						this.y = v4fFrom.x; this.x = v4fFrom.y;	this.z = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "yxzz":
						this.y = v4fFrom.x; this.x = v4fFrom.y;	this.z = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "yxzw":
						this.y = v4fFrom.x; this.x = v4fFrom.y;	this.z = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "yxwx":
						this.y = v4fFrom.x; this.x = v4fFrom.y;	this.w = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "yxwy":
						this.y = v4fFrom.x; this.x = v4fFrom.y;	this.w = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "yxwz":
						this.y = v4fFrom.x; this.x = v4fFrom.y;	this.w = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "yxww":
						this.y = v4fFrom.x; this.x = v4fFrom.y;	this.w = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "yyxx":
						this.y = v4fFrom.x; this.y = v4fFrom.y;	this.x = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "yyxy":
						this.y = v4fFrom.x; this.y = v4fFrom.y;	this.x = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "yyxz":
						this.y = v4fFrom.x; this.y = v4fFrom.y;	this.x = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "yyxw":
						this.y = v4fFrom.x; this.y = v4fFrom.y;	this.x = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "yyyx":
						this.y = v4fFrom.x; this.y = v4fFrom.y;	this.y = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "yyyy":
						this.y = v4fFrom.x; this.y = v4fFrom.y;	this.y = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "yyyz":
						this.y = v4fFrom.x; this.y = v4fFrom.y;	this.y = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "yyyw":
						this.y = v4fFrom.x; this.y = v4fFrom.y;	this.y = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "yyzx":
						this.y = v4fFrom.x; this.y = v4fFrom.y;	this.z = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "yyzy":
						this.y = v4fFrom.x; this.y = v4fFrom.y;	this.z = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "yyzz":
						this.y = v4fFrom.x; this.y = v4fFrom.y;	this.z = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "yyzw":
						this.y = v4fFrom.x; this.y = v4fFrom.y;	this.z = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "yywx":
						this.y = v4fFrom.x; this.y = v4fFrom.y;	this.w = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "yywy":
						this.y = v4fFrom.x; this.y = v4fFrom.y;	this.w = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "yywz":
						this.y = v4fFrom.x; this.y = v4fFrom.y;	this.w = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "yyww":
						this.y = v4fFrom.x; this.y = v4fFrom.y;	this.w = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "yzxx":
						this.y = v4fFrom.x; this.z = v4fFrom.y;	this.x = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "yzxy":
						this.y = v4fFrom.x; this.z = v4fFrom.y;	this.x = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "yzxz":
						this.y = v4fFrom.x; this.z = v4fFrom.y;	this.x = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "yzxw":
						this.y = v4fFrom.x; this.z = v4fFrom.y;	this.x = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "yzyx":
						this.y = v4fFrom.x; this.z = v4fFrom.y;	this.y = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "yzyy":
						this.y = v4fFrom.x; this.z = v4fFrom.y;	this.y = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "yzyz":
						this.y = v4fFrom.x; this.z = v4fFrom.y;	this.y = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "yzyw":
						this.y = v4fFrom.x; this.z = v4fFrom.y;	this.y = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "yzzx":
						this.y = v4fFrom.x; this.z = v4fFrom.y;	this.z = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "yzzy":
						this.y = v4fFrom.x; this.z = v4fFrom.y;	this.z = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "yzzz":
						this.y = v4fFrom.x; this.z = v4fFrom.y;	this.z = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "yzzw":
						this.y = v4fFrom.x; this.z = v4fFrom.y;	this.z = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "yzwx":
						this.y = v4fFrom.x; this.z = v4fFrom.y;	this.w = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "yzwy":
						this.y = v4fFrom.x; this.z = v4fFrom.y;	this.w = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "yzwz":
						this.y = v4fFrom.x; this.z = v4fFrom.y;	this.w = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "yzww":
						this.y = v4fFrom.x; this.z = v4fFrom.y;	this.w = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "ywxx":
						this.y = v4fFrom.x; this.w = v4fFrom.y;	this.x = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "ywxy":
						this.y = v4fFrom.x; this.w = v4fFrom.y;	this.x = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "ywxz":
						this.y = v4fFrom.x; this.w = v4fFrom.y;	this.x = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "ywxw":
						this.y = v4fFrom.x; this.w = v4fFrom.y;	this.x = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "ywyx":
						this.y = v4fFrom.x; this.w = v4fFrom.y;	this.y = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "ywyy":
						this.y = v4fFrom.x; this.w = v4fFrom.y;	this.y = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "ywyz":
						this.y = v4fFrom.x; this.w = v4fFrom.y;	this.y = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "ywyw":
						this.y = v4fFrom.x; this.w = v4fFrom.y;	this.y = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "ywzx":
						this.y = v4fFrom.x; this.w = v4fFrom.y;	this.z = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "ywzy":
						this.y = v4fFrom.x; this.w = v4fFrom.y;	this.z = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "ywzz":
						this.y = v4fFrom.x; this.w = v4fFrom.y;	this.z = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "ywzw":
						this.y = v4fFrom.x; this.w = v4fFrom.y;	this.z = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "ywwx":
						this.y = v4fFrom.x; this.w = v4fFrom.y;	this.w = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "ywwy":
						this.y = v4fFrom.x; this.w = v4fFrom.y;	this.w = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "ywwz":
						this.y = v4fFrom.x; this.w = v4fFrom.y;	this.w = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "ywww":
						this.y = v4fFrom.x; this.w = v4fFrom.y;	this.w = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "zxxx":
						this.z = v4fFrom.x; this.x = v4fFrom.y;	this.x = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "zxxy":
						this.z = v4fFrom.x; this.x = v4fFrom.y;	this.x = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "zxxz":
						this.z = v4fFrom.x; this.x = v4fFrom.y;	this.x = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "zxxw":
						this.z = v4fFrom.x; this.x = v4fFrom.y;	this.x = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "zxyx":
						this.z = v4fFrom.x; this.x = v4fFrom.y;	this.y = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "zxyy":
						this.z = v4fFrom.x; this.x = v4fFrom.y;	this.y = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "zxyz":
						this.z = v4fFrom.x; this.x = v4fFrom.y;	this.y = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "zxyw":
						this.z = v4fFrom.x; this.x = v4fFrom.y;	this.y = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "zxzx":
						this.z = v4fFrom.x; this.x = v4fFrom.y;	this.z = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "zxzy":
						this.z = v4fFrom.x; this.x = v4fFrom.y;	this.z = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "zxzz":
						this.z = v4fFrom.x; this.x = v4fFrom.y;	this.z = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "zxzw":
						this.z = v4fFrom.x; this.x = v4fFrom.y;	this.z = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "zxwx":
						this.z = v4fFrom.x; this.x = v4fFrom.y;	this.w = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "zxwy":
						this.z = v4fFrom.x; this.x = v4fFrom.y;	this.w = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "zxwz":
						this.z = v4fFrom.x; this.x = v4fFrom.y;	this.w = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "zxww":
						this.z = v4fFrom.x; this.x = v4fFrom.y;	this.w = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "zyxx":
						this.z = v4fFrom.x; this.y = v4fFrom.y;	this.x = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "zyxy":
						this.z = v4fFrom.x; this.y = v4fFrom.y;	this.x = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "zyxz":
						this.z = v4fFrom.x; this.y = v4fFrom.y;	this.x = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "zyxw":
						this.z = v4fFrom.x; this.y = v4fFrom.y;	this.x = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "zyyx":
						this.z = v4fFrom.x; this.y = v4fFrom.y;	this.y = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "zyyy":
						this.z = v4fFrom.x; this.y = v4fFrom.y;	this.y = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "zyyz":
						this.z = v4fFrom.x; this.y = v4fFrom.y;	this.y = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "zyyw":
						this.z = v4fFrom.x; this.y = v4fFrom.y;	this.y = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "zyzx":
						this.z = v4fFrom.x; this.y = v4fFrom.y;	this.z = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "zyzy":
						this.z = v4fFrom.x; this.y = v4fFrom.y;	this.z = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "zyzz":
						this.z = v4fFrom.x; this.y = v4fFrom.y;	this.z = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "zyzw":
						this.z = v4fFrom.x; this.y = v4fFrom.y;	this.z = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "zywx":
						this.z = v4fFrom.x; this.y = v4fFrom.y;	this.w = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "zywy":
						this.z = v4fFrom.x; this.y = v4fFrom.y;	this.w = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "zywz":
						this.z = v4fFrom.x; this.y = v4fFrom.y;	this.w = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "zyww":
						this.z = v4fFrom.x; this.y = v4fFrom.y;	this.w = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "zzxx":
						this.z = v4fFrom.x; this.z = v4fFrom.y;	this.x = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "zzxy":
						this.z = v4fFrom.x; this.z = v4fFrom.y;	this.x = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "zzxz":
						this.z = v4fFrom.x; this.z = v4fFrom.y;	this.x = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "zzxw":
						this.z = v4fFrom.x; this.z = v4fFrom.y;	this.x = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "zzyx":
						this.z = v4fFrom.x; this.z = v4fFrom.y;	this.y = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "zzyy":
						this.z = v4fFrom.x; this.z = v4fFrom.y;	this.y = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "zzyz":
						this.z = v4fFrom.x; this.z = v4fFrom.y;	this.y = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "zzyw":
						this.z = v4fFrom.x; this.z = v4fFrom.y;	this.y = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "zzzx":
						this.z = v4fFrom.x; this.z = v4fFrom.y;	this.z = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "zzzy":
						this.z = v4fFrom.x; this.z = v4fFrom.y;	this.z = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "zzzz":
						this.z = v4fFrom.x; this.z = v4fFrom.y;	this.z = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "zzzw":
						this.z = v4fFrom.x; this.z = v4fFrom.y;	this.z = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "zzwx":
						this.z = v4fFrom.x; this.z = v4fFrom.y;	this.w = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "zzwy":
						this.z = v4fFrom.x; this.z = v4fFrom.y;	this.w = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "zzwz":
						this.z = v4fFrom.x; this.z = v4fFrom.y;	this.w = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "zzww":
						this.z = v4fFrom.x; this.z = v4fFrom.y;	this.w = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "zwxx":
						this.z = v4fFrom.x; this.w = v4fFrom.y;	this.x = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "zwxy":
						this.z = v4fFrom.x; this.w = v4fFrom.y;	this.x = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "zwxz":
						this.z = v4fFrom.x; this.w = v4fFrom.y;	this.x = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "zwxw":
						this.z = v4fFrom.x; this.w = v4fFrom.y;	this.x = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "zwyx":
						this.z = v4fFrom.x; this.w = v4fFrom.y;	this.y = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "zwyy":
						this.z = v4fFrom.x; this.w = v4fFrom.y;	this.y = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "zwyz":
						this.z = v4fFrom.x; this.w = v4fFrom.y;	this.y = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "zwyw":
						this.z = v4fFrom.x; this.w = v4fFrom.y;	this.y = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "zwzx":
						this.z = v4fFrom.x; this.w = v4fFrom.y;	this.z = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "zwzy":
						this.z = v4fFrom.x; this.w = v4fFrom.y;	this.z = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "zwzz":
						this.z = v4fFrom.x; this.w = v4fFrom.y;	this.z = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "zwzw":
						this.z = v4fFrom.x; this.w = v4fFrom.y;	this.z = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "zwwx":
						this.z = v4fFrom.x; this.w = v4fFrom.y;	this.w = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "zwwy":
						this.z = v4fFrom.x; this.w = v4fFrom.y;	this.w = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "zwwz":
						this.z = v4fFrom.x; this.w = v4fFrom.y;	this.w = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "zwww":
						this.z = v4fFrom.x; this.w = v4fFrom.y;	this.w = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "wxxx":
						this.w = v4fFrom.x; this.x = v4fFrom.y;	this.x = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "wxxy":
						this.w = v4fFrom.x; this.x = v4fFrom.y;	this.x = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "wxxz":
						this.w = v4fFrom.x; this.x = v4fFrom.y;	this.x = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "wxxw":
						this.w = v4fFrom.x; this.x = v4fFrom.y;	this.x = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "wxyx":
						this.w = v4fFrom.x; this.x = v4fFrom.y;	this.y = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "wxyy":
						this.w = v4fFrom.x; this.x = v4fFrom.y;	this.y = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "wxyz":
						this.w = v4fFrom.x; this.x = v4fFrom.y;	this.y = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "wxyw":
						this.w = v4fFrom.x; this.x = v4fFrom.y;	this.y = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "wxzx":
						this.w = v4fFrom.x; this.x = v4fFrom.y;	this.z = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "wxzy":
						this.w = v4fFrom.x; this.x = v4fFrom.y;	this.z = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "wxzz":
						this.w = v4fFrom.x; this.x = v4fFrom.y;	this.z = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "wxzw":
						this.w = v4fFrom.x; this.x = v4fFrom.y;	this.z = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "wxwx":
						this.w = v4fFrom.x; this.x = v4fFrom.y;	this.w = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "wxwy":
						this.w = v4fFrom.x; this.x = v4fFrom.y;	this.w = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "wxwz":
						this.w = v4fFrom.x; this.x = v4fFrom.y;	this.w = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "wxww":
						this.w = v4fFrom.x; this.x = v4fFrom.y;	this.w = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "wyxx":
						this.w = v4fFrom.x; this.y = v4fFrom.y;	this.x = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "wyxy":
						this.w = v4fFrom.x; this.y = v4fFrom.y;	this.x = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "wyxz":
						this.w = v4fFrom.x; this.y = v4fFrom.y;	this.x = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "wyxw":
						this.w = v4fFrom.x; this.y = v4fFrom.y;	this.x = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "wyyx":
						this.w = v4fFrom.x; this.y = v4fFrom.y;	this.y = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "wyyy":
						this.w = v4fFrom.x; this.y = v4fFrom.y;	this.y = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "wyyz":
						this.w = v4fFrom.x; this.y = v4fFrom.y;	this.y = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "wyyw":
						this.w = v4fFrom.x; this.y = v4fFrom.y;	this.y = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "wyzx":
						this.w = v4fFrom.x; this.y = v4fFrom.y;	this.z = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "wyzy":
						this.w = v4fFrom.x; this.y = v4fFrom.y;	this.z = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "wyzz":
						this.w = v4fFrom.x; this.y = v4fFrom.y;	this.z = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "wyzw":
						this.w = v4fFrom.x; this.y = v4fFrom.y;	this.z = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "wywx":
						this.w = v4fFrom.x; this.y = v4fFrom.y;	this.w = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "wywy":
						this.w = v4fFrom.x; this.y = v4fFrom.y;	this.w = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "wywz":
						this.w = v4fFrom.x; this.y = v4fFrom.y;	this.w = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "wyww":
						this.w = v4fFrom.x; this.y = v4fFrom.y;	this.w = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "wzxx":
						this.w = v4fFrom.x; this.z = v4fFrom.y;	this.x = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "wzxy":
						this.w = v4fFrom.x; this.z = v4fFrom.y;	this.x = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "wzxz":
						this.w = v4fFrom.x; this.z = v4fFrom.y;	this.x = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "wzxw":
						this.w = v4fFrom.x; this.z = v4fFrom.y;	this.x = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "wzyx":
						this.w = v4fFrom.x; this.z = v4fFrom.y;	this.y = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "wzyy":
						this.w = v4fFrom.x; this.z = v4fFrom.y;	this.y = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "wzyz":
						this.w = v4fFrom.x; this.z = v4fFrom.y;	this.y = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "wzyw":
						this.w = v4fFrom.x; this.z = v4fFrom.y;	this.y = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "wzzx":
						this.w = v4fFrom.x; this.z = v4fFrom.y;	this.z = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "wzzy":
						this.w = v4fFrom.x; this.z = v4fFrom.y;	this.z = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "wzzz":
						this.w = v4fFrom.x; this.z = v4fFrom.y;	this.z = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "wzzw":
						this.w = v4fFrom.x; this.z = v4fFrom.y;	this.z = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "wzwx":
						this.w = v4fFrom.x; this.z = v4fFrom.y;	this.w = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "wzwy":
						this.w = v4fFrom.x; this.z = v4fFrom.y;	this.w = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "wzwz":
						this.w = v4fFrom.x; this.z = v4fFrom.y;	this.w = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "wzww":
						this.w = v4fFrom.x; this.z = v4fFrom.y;	this.w = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "wwxx":
						this.w = v4fFrom.x; this.w = v4fFrom.y;	this.x = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "wwxy":
						this.w = v4fFrom.x; this.w = v4fFrom.y;	this.x = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "wwxz":
						this.w = v4fFrom.x; this.w = v4fFrom.y;	this.x = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "wwxw":
						this.w = v4fFrom.x; this.w = v4fFrom.y;	this.x = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "wwyx":
						this.w = v4fFrom.x; this.w = v4fFrom.y;	this.y = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "wwyy":
						this.w = v4fFrom.x; this.w = v4fFrom.y;	this.y = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "wwyz":
						this.w = v4fFrom.x; this.w = v4fFrom.y;	this.y = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "wwyw":
						this.w = v4fFrom.x; this.w = v4fFrom.y;	this.y = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "wwzx":
						this.w = v4fFrom.x; this.w = v4fFrom.y;	this.z = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "wwzy":
						this.w = v4fFrom.x; this.w = v4fFrom.y;	this.z = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "wwzz":
						this.w = v4fFrom.x; this.w = v4fFrom.y;	this.z = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "wwzw":
						this.w = v4fFrom.x; this.w = v4fFrom.y;	this.z = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
					case "wwwx":
						this.w = v4fFrom.x; this.w = v4fFrom.y;	this.w = v4fFrom.z;	this.x = v4fFrom.w;
						return this;
					case "wwwy":
						this.w = v4fFrom.x; this.w = v4fFrom.y;	this.w = v4fFrom.z;	this.y = v4fFrom.w;
						return this;
					case "wwwz":
						this.w = v4fFrom.x; this.w = v4fFrom.y;	this.w = v4fFrom.z;	this.z = v4fFrom.w;
						return this;
					case "wwww":
						this.w = v4fFrom.x; this.w = v4fFrom.y;	this.w = v4fFrom.z;	this.w = v4fFrom.w;
						return this;
				}
			}

			logger.error("Bad vector form", sForm);
			return this;
		}


		static temp(): IVec4;
		static temp(xyzw: float): IVec4;
		static temp(xyzw: IVec4): IVec4;
		static temp(xyzw: float[]): IVec4;
		static temp(rgba: IColorValue): IVec4;
		static temp(x: float, yzw: IVec3): IVec4;
		static temp(xy: IVec2, zw: IVec2): IVec4;
		static temp(xyz: IVec3, w: float): IVec4;
		static temp(x: float, y: float, zw: IVec2): IVec4;
		static temp(x: float, yz: IVec2, w: float): IVec4;
		static temp(xy: IVec2, z: float, w: float): IVec4;
		static temp(x: float, y: float, z: float, w: float): IVec4;
		static temp(x?, y?, z?, w?): IVec4 {
			iElement = (iElement === pBuffer.length - 1 ? 0 : pBuffer.length);
			var p = pBuffer[iElement++];
			return p.set.apply(p, arguments);
		}

	}


	pBuffer = gen.array<IVec4>(256, Vec4);
	iElement = 0;

}
