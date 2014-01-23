/// <reference path="../common.ts" />
/// <reference path="../logger.ts" />
/// <reference path="../idl/IVec3.ts" />
/// <reference path="math.ts" />
/// <reference path="../gen/generate.ts" />


module akra.math {


	var pBuffer: IVec3[];
	var iElement: uint;

	export class Vec3 {
		x: float;
		y: float;
		z: float;

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

		get xz(): IVec2 {
			return Vec2.temp(this.x, this.z);
		}
		set xz(v2fVec: IVec2) {
			this.x = v2fVec.x; this.z = v2fVec.y;
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

		get yz(): IVec2 {
			return Vec2.temp(this.y, this.z);
		}
		set yz(v2fVec: IVec2) {
			this.y = v2fVec.x; this.z = v2fVec.y;
		}

		get zx(): IVec2 {
			return Vec2.temp(this.z, this.x);
		}
		set zx(v2fVec: IVec2) {
			this.z = v2fVec.x; this.x = v2fVec.y;
		}

		get zy(): IVec2 {
			return Vec2.temp(this.z, this.y);
		}
		set zy(v2fVec: IVec2) {
			this.z = v2fVec.x; this.y = v2fVec.y;
		}

		get zz(): IVec2 {
			return Vec2.temp(this.z, this.z);
		}
		set zz(v2fVec: IVec2) {
			this.z = v2fVec.x; this.z = v2fVec.y;
		}


		get xxx(): IVec3 {
			return Vec3.temp(this.x, this.x, this.x);
		}
		set xxx(v3fVec: IVec3) {
			this.x = v3fVec.x; this.x = v3fVec.y; this.x = v3fVec.z;
		}

		get xxy(): IVec3 {
			return Vec3.temp(this.x, this.x, this.y);
		}
		set xxy(v3fVec: IVec3) {
			this.x = v3fVec.x; this.x = v3fVec.y; this.y = v3fVec.z;
		}

		get xxz(): IVec3 {
			return Vec3.temp(this.x, this.x, this.z);
		}
		set xxz(v3fVec: IVec3) {
			this.x = v3fVec.x; this.x = v3fVec.y; this.z = v3fVec.z;
		}

		get xyx(): IVec3 {
			return Vec3.temp(this.x, this.y, this.x);
		}
		set xyx(v3fVec: IVec3) {
			this.x = v3fVec.x; this.y = v3fVec.y; this.x = v3fVec.z;
		}

		get xyy(): IVec3 {
			return Vec3.temp(this.x, this.y, this.y);
		}
		set xyy(v3fVec: IVec3) {
			this.x = v3fVec.x; this.y = v3fVec.y; this.y = v3fVec.z;
		}

		get xyz(): IVec3 {
			return Vec3.temp(this.x, this.y, this.z);
		}
		set xyz(v3fVec: IVec3) {
			this.x = v3fVec.x; this.y = v3fVec.y; this.z = v3fVec.z;
		}

		get xzx(): IVec3 {
			return Vec3.temp(this.x, this.z, this.x);
		}
		set xzx(v3fVec: IVec3) {
			this.x = v3fVec.x; this.z = v3fVec.y; this.x = v3fVec.z;
		}

		get xzy(): IVec3 {
			return Vec3.temp(this.x, this.z, this.y);
		}
		set xzy(v3fVec: IVec3) {
			this.x = v3fVec.x; this.z = v3fVec.y; this.y = v3fVec.z;
		}

		get xzz(): IVec3 {
			return Vec3.temp(this.x, this.z, this.z);
		}
		set xzz(v3fVec: IVec3) {
			this.x = v3fVec.x; this.z = v3fVec.y; this.z = v3fVec.z;
		}

		get yxx(): IVec3 {
			return Vec3.temp(this.y, this.x, this.x);
		}
		set yxx(v3fVec: IVec3) {
			this.y = v3fVec.x; this.x = v3fVec.y; this.x = v3fVec.z;
		}

		get yxy(): IVec3 {
			return Vec3.temp(this.y, this.x, this.y);
		}
		set yxy(v3fVec: IVec3) {
			this.y = v3fVec.x; this.x = v3fVec.y; this.y = v3fVec.z;
		}

		get yxz(): IVec3 {
			return Vec3.temp(this.y, this.x, this.z);
		}
		set yxz(v3fVec: IVec3) {
			this.y = v3fVec.x; this.x = v3fVec.y; this.z = v3fVec.z;
		}

		get yyx(): IVec3 {
			return Vec3.temp(this.y, this.y, this.x);
		}
		set yyx(v3fVec: IVec3) {
			this.y = v3fVec.x; this.y = v3fVec.y; this.x = v3fVec.z;
		}

		get yyy(): IVec3 {
			return Vec3.temp(this.y, this.y, this.y);
		}
		set yyy(v3fVec: IVec3) {
			this.y = v3fVec.x; this.y = v3fVec.y; this.y = v3fVec.z;
		}

		get yyz(): IVec3 {
			return Vec3.temp(this.y, this.y, this.z);
		}
		set yyz(v3fVec: IVec3) {
			this.y = v3fVec.x; this.y = v3fVec.y; this.z = v3fVec.z;
		}

		get yzx(): IVec3 {
			return Vec3.temp(this.y, this.z, this.x);
		}
		set yzx(v3fVec: IVec3) {
			this.y = v3fVec.x; this.z = v3fVec.y; this.x = v3fVec.z;
		}

		get yzy(): IVec3 {
			return Vec3.temp(this.y, this.z, this.y);
		}
		set yzy(v3fVec: IVec3) {
			this.y = v3fVec.x; this.z = v3fVec.y; this.y = v3fVec.z;
		}

		get yzz(): IVec3 {
			return Vec3.temp(this.y, this.z, this.z);
		}
		set yzz(v3fVec: IVec3) {
			this.y = v3fVec.x; this.z = v3fVec.y; this.z = v3fVec.z;
		}

		get zxx(): IVec3 {
			return Vec3.temp(this.z, this.x, this.x);
		}
		set zxx(v3fVec: IVec3) {
			this.z = v3fVec.x; this.x = v3fVec.y; this.x = v3fVec.z;
		}

		get zxy(): IVec3 {
			return Vec3.temp(this.z, this.x, this.y);
		}
		set zxy(v3fVec: IVec3) {
			this.z = v3fVec.x; this.x = v3fVec.y; this.y = v3fVec.z;
		}

		get zxz(): IVec3 {
			return Vec3.temp(this.z, this.x, this.z);
		}
		set zxz(v3fVec: IVec3) {
			this.z = v3fVec.x; this.x = v3fVec.y; this.z = v3fVec.z;
		}

		get zyx(): IVec3 {
			return Vec3.temp(this.z, this.y, this.x);
		}
		set zyx(v3fVec: IVec3) {
			this.z = v3fVec.x; this.y = v3fVec.y; this.x = v3fVec.z;
		}

		get zyy(): IVec3 {
			return Vec3.temp(this.z, this.y, this.y);
		}
		set zyy(v3fVec: IVec3) {
			this.z = v3fVec.x; this.y = v3fVec.y; this.y = v3fVec.z;
		}

		get zyz(): IVec3 {
			return Vec3.temp(this.z, this.y, this.z);
		}
		set zyz(v3fVec: IVec3) {
			this.z = v3fVec.x; this.y = v3fVec.y; this.z = v3fVec.z;
		}

		get zzx(): IVec3 {
			return Vec3.temp(this.z, this.z, this.x);
		}
		set zzx(v3fVec: IVec3) {
			this.z = v3fVec.x; this.z = v3fVec.y; this.x = v3fVec.z;
		}

		get zzy(): IVec3 {
			return Vec3.temp(this.z, this.z, this.y);
		}
		set zzy(v3fVec: IVec3) {
			this.z = v3fVec.x; this.z = v3fVec.y; this.y = v3fVec.z;
		}

		get zzz(): IVec3 {
			return Vec3.temp(this.z, this.z, this.z);
		}
		set zzz(v3fVec: IVec3) {
			this.z = v3fVec.x; this.z = v3fVec.y; this.z = v3fVec.z;
		}

		constructor();
		constructor(xyz: float);
		constructor(xyz: IVec3);
		constructor(xyz: float[]);
		constructor(x: float, yz: IVec2);
		constructor(xy: IVec2, z: float);
		constructor(x: float, y: float, z: float);
		constructor(x?, y?, z?) {
			var nArg: uint = arguments.length;

			switch (nArg) {
				case 1:
					this.set(arguments[0]);
					break;
				case 2:
					this.set(arguments[0], arguments[1]);
					break;
				case 3:
					this.set(arguments[0], arguments[1], arguments[2]);
					break;
				default:
					this.x = this.y = this.z = 0.;
					break;
			}
		}

		set(): IVec3;
		set(xyz: float): IVec3;
		set(xyz: IVec3): IVec3;
		set(xyz: float[]): IVec3;
		set(x: float, yz: IVec2): IVec3;
		set(xy: IVec2, z: float): IVec3;
		set(x: float, y: float, z: float): IVec3;
		set(x?, y?, z?): IVec3 {
			var nArgumentsLength = arguments.length;

			switch (nArgumentsLength) {
				case 0:
					this.x = this.y = this.z = 0.;
					break;
				case 1:
					if (isFloat(arguments[0])) {
						this.x = this.y = this.z = arguments[0];
					}
					else if (arguments[0] instanceof Vec3) {
						var v3fVec: IVec3 = <IVec3>arguments[0];

						this.x = v3fVec.x;
						this.y = v3fVec.y;
						this.z = v3fVec.z;
					}
					else {
						var pArray: float[] = arguments[0];

						this.x = pArray[0];
						this.y = pArray[1];
						this.z = pArray[2];
					}
					break;
				case 2:
					if (isFloat(arguments[0])) {
						var fValue: float = arguments[0];
						var v2fVec: IVec2 = <IVec2>arguments[1];

						this.x = fValue;
						this.y = v2fVec.x;
						this.z = v2fVec.y;
					}
					else {
						var v2fVec: IVec2 = arguments[0];
						var fValue: float = arguments[1];

						this.x = v2fVec.x;
						this.y = v2fVec.y;
						this.z = fValue;
					}
					break;
				case 3:
					this.x = arguments[0];
					this.y = arguments[1];
					this.z = arguments[2];
					break;
			}

			return this;
		}


		X(fLength: float = 1.): IVec3 {
			return this.set(fLength, 0., 0.);
		}

		Y(fLength: float = 1.): IVec3 {
			return this.set(0., fLength, 0.);
		}

		Z(fLength: float = 1.): IVec3 {
			return this.set(0., 0., fLength);
		}

		/**  */ clear(): IVec3 {
			this.x = this.y = this.z = 0.;
			return this;
		}


		add(v3fVec: IVec3, v3fDestination?: IVec3): IVec3 {
			if (!isDef(v3fDestination)) {
				v3fDestination = this;
			}

			v3fDestination.x = this.x + v3fVec.x;
			v3fDestination.y = this.y + v3fVec.y;
			v3fDestination.z = this.z + v3fVec.z;

			return v3fDestination;
		}


		subtract(v3fVec: IVec3, v3fDestination?: IVec3): IVec3 {
			if (!isDef(v3fDestination)) {
				v3fDestination = this;
			}

			v3fDestination.x = this.x - v3fVec.x;
			v3fDestination.y = this.y - v3fVec.y;
			v3fDestination.z = this.z - v3fVec.z;

			return v3fDestination;
		}

		/**  */ dot(v3fVec: IVec3): float {
			return this.x * v3fVec.x + this.y * v3fVec.y + this.z * v3fVec.z;
		}


		cross(v3fVec: IVec3, v3fDestination?: IVec3): IVec3 {
			if (!isDef(v3fDestination)) {
				v3fDestination = this;
			}

			var x1: float = this.x, y1: float = this.y, z1: float = this.z;
			var x2: float = v3fVec.x, y2: float = v3fVec.y, z2: float = v3fVec.z;

			v3fDestination.x = y1 * z2 - z1 * y2;
			v3fDestination.y = z1 * x2 - x1 * z2;
			v3fDestination.z = x1 * y2 - y1 * x2;

			return v3fDestination;
		}

		isEqual(v3fVec: IVec3, fEps: float = 0.): boolean {
			if (fEps === 0.) {
				if (this.x != v3fVec.x
					|| this.y != v3fVec.y
					|| this.z != v3fVec.z) {

					return false;
				}
			}
			else {
				if (abs(this.x - v3fVec.x) > fEps
					|| abs(this.y - v3fVec.y) > fEps
					|| abs(this.z - v3fVec.z) > fEps) {

					return false;
				}
			}
			return true;
		}


		isClear(fEps: float = 0.): boolean {
			if (fEps === 0.) {
				if (this.x != 0.
					|| this.y != 0.
					|| this.z != 0.) {

					return false;
				}
			}
			else {
				if (abs(this.x) > fEps
					|| abs(this.y) > fEps
					|| abs(this.z) > fEps) {

					return false;
				}
			}

			return true;
		}

		negate(v3fDestination?: IVec3): IVec3 {
			if (!isDef(v3fDestination)) {
				v3fDestination = this;
			}

			v3fDestination.x = -this.x;
			v3fDestination.y = -this.y;
			v3fDestination.z = -this.z;

			return v3fDestination;
		}

		scale(v3fScale: IVec3, v3fDestination?: IVec3): IVec3;
		scale(fScale: float, v3fDestination?: IVec3): IVec3;
		scale(): IVec3 {
			var v3fDestination: IVec3 = (arguments.length === 2 && isDef(arguments[1])) ? arguments[1] : this;

			if (isNumber(arguments[0])) {
				var fScale: float = arguments[0];
				v3fDestination.x = this.x * fScale;
				v3fDestination.y = this.y * fScale;
				v3fDestination.z = this.z * fScale;
			}
			else {
				var v3fScale: IVec3 = arguments[0];
				v3fDestination.x = this.x * v3fScale.x;
				v3fDestination.y = this.y * v3fScale.y;
				v3fDestination.z = this.z * v3fScale.z;
			}

			return v3fDestination;
		}

		normalize(v3fDestination?: IVec3): IVec3 {
			if (!v3fDestination) {
				v3fDestination = this;
			}

			var x: float = this.x, y: float = this.y, z: float = this.z;
			var fLength: float = math.sqrt(x * x + y * y + z * z);

			if (fLength !== 0.) {
				var fInvLength: float = 1. / fLength;

				x *= fInvLength;
				y *= fInvLength;
				z *= fInvLength;
			}

			v3fDestination.x = x;
			v3fDestination.y = y;
			v3fDestination.z = z;

			return v3fDestination;
		}

		/**  */ length(): float {
			return math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
		}

		/**  */ lengthSquare(): float {
			var x: float = this.x, y: float = this.y, z: float = this.z;
			return x * x + y * y + z * z;
		}

		direction(v3fVec: IVec3, v3fDestination?: IVec3): IVec3 {
			if (!isDef(v3fDestination)) {
				v3fDestination = this;
			}

			var x: float = v3fVec.x - this.x;
			var y: float = v3fVec.y - this.y;
			var z: float = v3fVec.z - this.z;

			var fLength: float = math.sqrt(x * x + y * y + z * z);

			if (fLength !== 0.) {
				var fInvLength = 1. / fLength;

				x *= fInvLength;
				y *= fInvLength;
				z *= fInvLength;
			}

			v3fDestination.x = x;
			v3fDestination.y = y;
			v3fDestination.z = z;

			return v3fDestination;
		}

		mix(v3fVec: IVec3, fA: float, v3fDestination?: IVec3): IVec3 {
			if (!isDef(v3fDestination)) {
				v3fDestination = this;
			}

			fA = clamp(fA, 0., 1.);

			var fA1: float = 1. - fA;
			var fA2: float = fA;

			v3fDestination.x = fA1 * this.x + fA2 * v3fVec.x;
			v3fDestination.y = fA1 * this.y + fA2 * v3fVec.y;
			v3fDestination.z = fA1 * this.z + fA2 * v3fVec.z;

			return v3fDestination;
		}

		/**  */ toString(): string {
			return "[x: " + this.x + " ,y: " + this.y + ", z: " + this.z + "]";
		}

		/**  */ toArray(pDest: float[]= []): float[] {
			pDest[0] = this.x;
			pDest[1] = this.y;
			pDest[2] = this.z;
			return pDest;
		}

		toTranslationMatrix(m4fDestination?: IMat4): IMat4 {
			if (!isDef(m4fDestination)) {
				m4fDestination = new Mat4(1.);
			}
			else {
				m4fDestination.set(1.);
			}

			var pData: Float32Array = m4fDestination.data;

			pData[__14] = this.x;
			pData[__24] = this.y;
			pData[__34] = this.z;

			return m4fDestination;
		}

		vec3TransformCoord(m4fTransformation: IMat4, v3fDestination?: IVec3): IVec3 {
			if (!v3fDestination) {
				v3fDestination = this;
			}

			var pData: Float32Array = m4fTransformation.data;

			var x: float = this.x;
			var y: float = this.y;
			var z: float = this.z;
			var w: float;

			x = pData[__11] * x + pData[__12] * y + pData[__13] * z + pData[__14];
			y = pData[__21] * x + pData[__22] * y + pData[__23] * z + pData[__24];
			z = pData[__31] * x + pData[__32] * y + pData[__33] * z + pData[__34];
			w = pData[__31] * x + pData[__42] * y + pData[__43] * z + pData[__44];

			var fInvW: float = 1. / w;

			v3fDestination.x = x * fInvW;
			v3fDestination.y = y * fInvW;
			v3fDestination.z = z * fInvW;

			return v3fDestination;
		}

		clone(sForm: string, v2fDest?: IVec2): IVec2;
		clone(sForm: string, v3fDest?: IVec3): IVec3;

		clone(sForm: "xx", v2fDest?: IVec2): IVec2;
		clone(sForm: "xy", v2fDest?: IVec2): IVec2;
		clone(sForm: "xz", v2fDest?: IVec2): IVec2;
		clone(sForm: "yx", v2fDest?: IVec2): IVec2;
		clone(sForm: "yy", v2fDest?: IVec2): IVec2;
		clone(sForm: "yz", v2fDest?: IVec2): IVec2;
		clone(sForm: "zx", v2fDest?: IVec2): IVec2;
		clone(sForm: "zy", v2fDest?: IVec2): IVec2;
		clone(sForm: "zz", v2fDest?: IVec2): IVec2;

		clone(sForm: "xxx", v3fDest?: IVec3): IVec3;
		clone(sForm: "xxy", v3fDest?: IVec3): IVec3;
		clone(sForm: "xxz", v3fDest?: IVec3): IVec3;
		clone(sForm: "xyx", v3fDest?: IVec3): IVec3;
		clone(sForm: "xyy", v3fDest?: IVec3): IVec3;
		clone(sForm: "xyz", v3fDest?: IVec3): IVec3;
		clone(sForm: "xzx", v3fDest?: IVec3): IVec3;
		clone(sForm: "xzy", v3fDest?: IVec3): IVec3;
		clone(sForm: "xzz", v3fDest?: IVec3): IVec3;
		clone(sForm: "yxx", v3fDest?: IVec3): IVec3;
		clone(sForm: "yxy", v3fDest?: IVec3): IVec3;
		clone(sForm: "yxz", v3fDest?: IVec3): IVec3;
		clone(sForm: "yyx", v3fDest?: IVec3): IVec3;
		clone(sForm: "yyy", v3fDest?: IVec3): IVec3;
		clone(sForm: "yyz", v3fDest?: IVec3): IVec3;
		clone(sForm: "yzx", v3fDest?: IVec3): IVec3;
		clone(sForm: "yzy", v3fDest?: IVec3): IVec3;
		clone(sForm: "yzz", v3fDest?: IVec3): IVec3;
		clone(sForm: "zxx", v3fDest?: IVec3): IVec3;
		clone(sForm: "zxy", v3fDest?: IVec3): IVec3;
		clone(sForm: "zxz", v3fDest?: IVec3): IVec3;
		clone(sForm: "zyx", v3fDest?: IVec3): IVec3;
		clone(sForm: "zyy", v3fDest?: IVec3): IVec3;
		clone(sForm: "zyz", v3fDest?: IVec3): IVec3;
		clone(sForm: "zzx", v3fDest?: IVec3): IVec3;
		clone(sForm: "zzy", v3fDest?: IVec3): IVec3;
		clone(sForm: "zzz", v3fDest?: IVec3): IVec3;

		clone(sForm: string, pVec2OrVec3?: any): any {
			if (sForm.length === 2) {
				var v2fDest: IVec2 = isDefAndNotNull(pVec2OrVec3) ? <IVec2>pVec2OrVec3 : Vec2.temp();

				switch(sForm){
					case "xx":
						return v2fDest.set(this.x, this.x);
					case "xy":
						return v2fDest.set(this.x, this.y);
					case "xz":
						return v2fDest.set(this.x, this.z);
					case "yx":
						return v2fDest.set(this.y, this.x);
					case "yy":
						return v2fDest.set(this.y, this.y);
					case "yz":
						return v2fDest.set(this.y, this.z);
					case "zx":
						return v2fDest.set(this.z, this.x);
					case "zy":
						return v2fDest.set(this.z, this.y);
					case "zz":
						return v2fDest.set(this.z, this.z);
				}
			}
			else if (sForm.length === 3) {
				var v3fDest: IVec3 = isDefAndNotNull(pVec2OrVec3) ? <IVec3>pVec2OrVec3 : Vec3.temp();

				switch(sForm){
					case "xxx":
						return v3fDest.set(this.x, this.x, this.x);
					case "xxy":
						return v3fDest.set(this.x, this.x, this.y);
					case "xxz":
						return v3fDest.set(this.x, this.x, this.z);
					case "xyx":
						return v3fDest.set(this.x, this.y, this.x);
					case "xyy":
						return v3fDest.set(this.x, this.y, this.y);
					case "xyz":
						return v3fDest.set(this.x, this.y, this.z);
					case "xzx":
						return v3fDest.set(this.x, this.z, this.x);
					case "xzy":
						return v3fDest.set(this.x, this.z, this.y);
					case "xzz":
						return v3fDest.set(this.x, this.z, this.z);
					case "yxx":
						return v3fDest.set(this.y, this.x, this.x);
					case "yxy":
						return v3fDest.set(this.y, this.x, this.y);
					case "yxz":
						return v3fDest.set(this.y, this.x, this.z);
					case "yyx":
						return v3fDest.set(this.y, this.y, this.x);
					case "yyy":
						return v3fDest.set(this.y, this.y, this.y);
					case "yyz":
						return v3fDest.set(this.y, this.y, this.z);
					case "yzx":
						return v3fDest.set(this.y, this.z, this.x);
					case "yzy":
						return v3fDest.set(this.y, this.z, this.y);
					case "yzz":
						return v3fDest.set(this.y, this.z, this.z);
					case "zxx":
						return v3fDest.set(this.z, this.x, this.x);
					case "zxy":
						return v3fDest.set(this.z, this.x, this.y);
					case "zxz":
						return v3fDest.set(this.z, this.x, this.z);
					case "zyx":
						return v3fDest.set(this.z, this.y, this.x);
					case "zyy":
						return v3fDest.set(this.z, this.y, this.y);
					case "zyz":
						return v3fDest.set(this.z, this.y, this.z);
					case "zzx":
						return v3fDest.set(this.z, this.z, this.x);
					case "zzy":
						return v3fDest.set(this.z, this.z, this.y);
					case "zzz":
						return v3fDest.set(this.z, this.z, this.z);
				}
			}

			logger.error("Bad vector form", sForm);
			return null;
		}

		copy(sForm: string, fValue: float): IVec3;
		copy(sForm: string, v2fFrom: IVec2): IVec3;
		copy(sForm: string, v3fFrom: IVec3): IVec3;

		copy(sForm: "xx", v2fFrom: IVec2): IVec3;
		copy(sForm: "xx", fValue: float): IVec3;
		copy(sForm: "xy", v2fFrom: IVec2): IVec3;
		copy(sForm: "xy", fValue: float): IVec3;
		copy(sForm: "xz", v2fFrom: IVec2): IVec3;
		copy(sForm: "xz", fValue: float): IVec3;
		copy(sForm: "yx", v2fFrom: IVec2): IVec3;
		copy(sForm: "yx", fValue: float): IVec3;
		copy(sForm: "yy", v2fFrom: IVec2): IVec3;
		copy(sForm: "yy", fValue: float): IVec3;
		copy(sForm: "yz", v2fFrom: IVec2): IVec3;
		copy(sForm: "yz", fValue: float): IVec3;
		copy(sForm: "zx", v2fFrom: IVec2): IVec3;
		copy(sForm: "zx", fValue: float): IVec3;
		copy(sForm: "zy", v2fFrom: IVec2): IVec3;
		copy(sForm: "zy", fValue: float): IVec3;
		copy(sForm: "zz", v2fFrom: IVec2): IVec3;
		copy(sForm: "zz", fValue: float): IVec3;
		
		copy(sForm: "xxx", v3fFrom: IVec3): IVec3;
		copy(sForm: "xxx", fValue: float): IVec3;
		copy(sForm: "xxy", v3fFrom: IVec3): IVec3;
		copy(sForm: "xxy", fValue: float): IVec3;
		copy(sForm: "xxz", v3fFrom: IVec3): IVec3;
		copy(sForm: "xxz", fValue: float): IVec3;
		copy(sForm: "xyx", v3fFrom: IVec3): IVec3;
		copy(sForm: "xyx", fValue: float): IVec3;
		copy(sForm: "xyy", v3fFrom: IVec3): IVec3;
		copy(sForm: "xyy", fValue: float): IVec3;
		copy(sForm: "xyz", v3fFrom: IVec3): IVec3;
		copy(sForm: "xyz", fValue: float): IVec3;
		copy(sForm: "xzx", v3fFrom: IVec3): IVec3;
		copy(sForm: "xzx", fValue: float): IVec3;
		copy(sForm: "xzy", v3fFrom: IVec3): IVec3;
		copy(sForm: "xzy", fValue: float): IVec3;
		copy(sForm: "xzz", v3fFrom: IVec3): IVec3;
		copy(sForm: "xzz", fValue: float): IVec3;
		copy(sForm: "yxx", v3fFrom: IVec3): IVec3;
		copy(sForm: "yxx", fValue: float): IVec3;
		copy(sForm: "yxy", v3fFrom: IVec3): IVec3;
		copy(sForm: "yxy", fValue: float): IVec3;
		copy(sForm: "yxz", v3fFrom: IVec3): IVec3;
		copy(sForm: "yxz", fValue: float): IVec3;
		copy(sForm: "yyx", v3fFrom: IVec3): IVec3;
		copy(sForm: "yyx", fValue: float): IVec3;
		copy(sForm: "yyy", v3fFrom: IVec3): IVec3;
		copy(sForm: "yyy", fValue: float): IVec3;
		copy(sForm: "yyz", v3fFrom: IVec3): IVec3;
		copy(sForm: "yyz", fValue: float): IVec3;
		copy(sForm: "yzx", v3fFrom: IVec3): IVec3;
		copy(sForm: "yzx", fValue: float): IVec3;
		copy(sForm: "yzy", v3fFrom: IVec3): IVec3;
		copy(sForm: "yzy", fValue: float): IVec3;
		copy(sForm: "yzz", v3fFrom: IVec3): IVec3;
		copy(sForm: "yzz", fValue: float): IVec3;
		copy(sForm: "zxx", v3fFrom: IVec3): IVec3;
		copy(sForm: "zxx", fValue: float): IVec3;
		copy(sForm: "zxy", v3fFrom: IVec3): IVec3;
		copy(sForm: "zxy", fValue: float): IVec3;
		copy(sForm: "zxz", v3fFrom: IVec3): IVec3;
		copy(sForm: "zxz", fValue: float): IVec3;
		copy(sForm: "zyx", v3fFrom: IVec3): IVec3;
		copy(sForm: "zyx", fValue: float): IVec3;
		copy(sForm: "zyy", v3fFrom: IVec3): IVec3;
		copy(sForm: "zyy", fValue: float): IVec3;
		copy(sForm: "zyz", v3fFrom: IVec3): IVec3;
		copy(sForm: "zyz", fValue: float): IVec3;
		copy(sForm: "zzx", v3fFrom: IVec3): IVec3;
		copy(sForm: "zzx", fValue: float): IVec3;
		copy(sForm: "zzy", v3fFrom: IVec3): IVec3;
		copy(sForm: "zzy", fValue: float): IVec3;
		copy(sForm: "zzz", v3fFrom: IVec3): IVec3;
		copy(sForm: "zzz", fValue: float): IVec3;

		copy(sForm: string, pVectorOrFloat: any): IVec3 {
			if (sForm.length === 2) {
				var v2fFrom: IVec2 = isFloat(pVectorOrFloat) ? Vec2.temp(<float>pVectorOrFloat) : <IVec2>pVectorOrFloat;

				switch(sForm){
					case "xx":
						this.x = v2fFrom.x;
						this.x = v2fFrom.y;
						return this;
					case "xy":
						this.x = v2fFrom.x;
						this.y = v2fFrom.y;
						return this;
					case "xz":
						this.x = v2fFrom.x;
						this.z = v2fFrom.y;
						return this;
					case "yx":
						this.y = v2fFrom.x;
						this.x = v2fFrom.y;
						return this;
					case "yy":
						this.y = v2fFrom.x;
						this.y = v2fFrom.y;
						return this;
					case "yz":
						this.y = v2fFrom.x;
						this.z = v2fFrom.y;
						return this;
					case "zx":
						this.z = v2fFrom.x;
						this.x = v2fFrom.y;
						return this;
					case "zy":
						this.z = v2fFrom.x;
						this.y = v2fFrom.y;
						return this;
					case "zz":
						this.z = v2fFrom.x;
						this.z = v2fFrom.y;
						return this;
				}
			}
			else if (sForm.length === 3) {
				var v3fFrom: IVec3 = isFloat(pVectorOrFloat) ? Vec3.temp(<float>pVectorOrFloat) : <IVec3>pVectorOrFloat;

				switch(sForm){
					case "xxx":
						return this.set(v3fFrom.x, v3fFrom.x, v3fFrom.x);
					case "xxy":
						return this.set(v3fFrom.x, v3fFrom.x, v3fFrom.y);
					case "xxz":
						return this.set(v3fFrom.x, v3fFrom.x, v3fFrom.z);
					case "xyx":
						return this.set(v3fFrom.x, v3fFrom.y, v3fFrom.x);
					case "xyy":
						return this.set(v3fFrom.x, v3fFrom.y, v3fFrom.y);
					case "xyz":
						return this.set(v3fFrom.x, v3fFrom.y, v3fFrom.z);
					case "xzx":
						return this.set(v3fFrom.x, v3fFrom.z, v3fFrom.x);
					case "xzy":
						return this.set(v3fFrom.x, v3fFrom.z, v3fFrom.y);
					case "xzz":
						return this.set(v3fFrom.x, v3fFrom.z, v3fFrom.z);
					case "yxx":
						return this.set(v3fFrom.y, v3fFrom.x, v3fFrom.x);
					case "yxy":
						return this.set(v3fFrom.y, v3fFrom.x, v3fFrom.y);
					case "yxz":
						return this.set(v3fFrom.y, v3fFrom.x, v3fFrom.z);
					case "yyx":
						return this.set(v3fFrom.y, v3fFrom.y, v3fFrom.x);
					case "yyy":
						return this.set(v3fFrom.y, v3fFrom.y, v3fFrom.y);
					case "yyz":
						return this.set(v3fFrom.y, v3fFrom.y, v3fFrom.z);
					case "yzx":
						return this.set(v3fFrom.y, v3fFrom.z, v3fFrom.x);
					case "yzy":
						return this.set(v3fFrom.y, v3fFrom.z, v3fFrom.y);
					case "yzz":
						return this.set(v3fFrom.y, v3fFrom.z, v3fFrom.z);
					case "zxx":
						return this.set(v3fFrom.z, v3fFrom.x, v3fFrom.x);
					case "zxy":
						return this.set(v3fFrom.z, v3fFrom.x, v3fFrom.y);
					case "zxz":
						return this.set(v3fFrom.z, v3fFrom.x, v3fFrom.z);
					case "zyx":
						return this.set(v3fFrom.z, v3fFrom.y, v3fFrom.x);
					case "zyy":
						return this.set(v3fFrom.z, v3fFrom.y, v3fFrom.y);
					case "zyz":
						return this.set(v3fFrom.z, v3fFrom.y, v3fFrom.z);
					case "zzx":
						return this.set(v3fFrom.z, v3fFrom.z, v3fFrom.x);
					case "zzy":
						return this.set(v3fFrom.z, v3fFrom.z, v3fFrom.y);
					case "zzz":
						return this.set(v3fFrom.z, v3fFrom.z, v3fFrom.z);
				}
			}

			logger.error("Bad vector form", sForm);
			return this;
		}

		static temp(): IVec3;
		static temp(xyz: float): IVec3;
		static temp(xyz: IVec3): IVec3;
		static temp(xyz: float[]): IVec3;
		static temp(x: float, yz: IVec2): IVec3;
		static temp(xy: IVec2, z: float): IVec3;
		static temp(x: float, y: float, z: float): IVec3;
		static temp(x?, y?, z?): IVec3 {
			iElement = (iElement === pBuffer.length - 1 ? 0 : pBuffer.length);
			var p = pBuffer[iElement++];
			return p.set.apply(p, arguments);
		}
	}

	pBuffer = gen.array<IVec3>(256, Vec3);
	iElement = 0;

}