/// <reference path="../common.ts" />
/// <reference path="../logger.ts" />
/// <reference path="../idl/IQuat4.ts" />
/// <reference path="math.ts" />
/// <reference path="../gen/generate.ts" />

module akra.math {

	var pBuffer: IQuat4[];
	var iElement: uint;

	export class Quat4 implements IQuat4 {
		x: float;
		y: float;
		z: float;
		w: float;


		constructor();
		constructor(q: IQuat4);
		constructor(q: float[]);
		constructor(xyz: float, w: float);
		constructor(xyz: IVec3, w: float);
		constructor(x: float, y: float, z: float, w: float);
		constructor(fX?, fY?, fZ?, fW?) {
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
					this.x = this.y = this.z = 0.;
					this.w = 1.;
					break;
			}
		}

		set(): IQuat4;
		set(q: IQuat4): IQuat4;
		set(q: float[]): IQuat4;
		set(xyz: float, w: float): IQuat4;
		set(xyz: IVec3, w: float): IQuat4;
		set(x: float, y: float, z: float, w: float): IQuat4;
		set(x?, y?, z?, w?): IQuat4 {
			var nArgumentsLength: uint = arguments.length;

			if (nArgumentsLength === 0) {
				this.x = this.y = this.z = 0.;
				this.w = 1.;
			}
			if (nArgumentsLength === 1) {
				if (arguments[0] instanceof Quat4) {
					var q4fQuat: IQuat4 = arguments[0];

					this.x = q4fQuat.x;
					this.y = q4fQuat.y;
					this.z = q4fQuat.z;
					this.w = q4fQuat.w;
				}
				else {
					//Array
					var pElements: float[] = arguments[0];

					this.x = pElements[0];
					this.y = pElements[1];
					this.z = pElements[2];
					this.w = pElements[3];
				}
			}
			else if (nArgumentsLength === 2) {
				//float float
				//vec3 float
				if (isFloat(arguments[0])) {
					//float float
					var fValue: float = arguments[0];

					this.x = fValue;
					this.y = fValue;
					this.z = fValue;
					this.w = arguments[1];
				}
				else {
					//vec3 float
					var v3fValue: IVec3 = arguments[0];

					this.x = v3fValue.x;
					this.y = v3fValue.y;
					this.z = v3fValue.z;
					this.w = arguments[1];
				}
			}
			else if (nArgumentsLength === 4) {
				this.x = arguments[0];
				this.y = arguments[1];
				this.z = arguments[2];
				this.w = arguments[3];
			}

			return this;
		}

		multiply(q4fQuat: IQuat4, q4fDestination?: IQuat4): IQuat4 {
			if (!isDef(q4fDestination)) {
				q4fDestination = this;
			}

			var x1: float = this.x, y1: float = this.y, z1: float = this.z, w1: float = this.w;
			var x2: float = q4fQuat.x, y2: float = q4fQuat.y, z2: float = q4fQuat.z, w2: float = q4fQuat.w;

			q4fDestination.x = x1 * w2 + x2 * w1 + y1 * z2 - z1 * y2;
			q4fDestination.y = y1 * w2 + y2 * w1 + z1 * x2 - x1 * z2;
			q4fDestination.z = z1 * w2 + z2 * w1 + x1 * y2 - y1 * x2;
			q4fDestination.w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;

			return q4fDestination;
		}

		multiplyVec3(v3fVec: IVec3, v3fDestination?: IVec3): IVec3 {
			if (!isDef(v3fDestination)) {
				v3fDestination = v3fVec;
			}

			var q4fVec: IQuat4 = Quat4.temp(v3fVec, 0.);
			var qInverse: IQuat4 = this.inverse(Quat4.temp());
			var qResult: IQuat4 = this.multiply(q4fVec.multiply(qInverse), Quat4.temp());

			v3fDestination.x = qResult.x;
			v3fDestination.y = qResult.y;
			v3fDestination.z = qResult.z;

			return v3fDestination;
		}

		conjugate(q4fDestination?: IQuat4): IQuat4 {
			if (!isDef(q4fDestination)) {
				this.x = -this.x;
				this.y = -this.y;
				this.z = -this.z;

				return this;
			}

			q4fDestination.x = -this.x;
			q4fDestination.y = -this.y;
			q4fDestination.z = -this.z;
			q4fDestination.w = this.w;

			return q4fDestination;
		}

		inverse(q4fDestination?: IQuat4): IQuat4 {
			if (!isDef(q4fDestination)) {
				q4fDestination = this;
			}

			var x: float = this.x, y: float = this.y, z: float = this.z, w: float = this.w;
			var fSqLength: float = x * x + y * y + z * z + w * w;

			if (fSqLength === 0.) {
				q4fDestination.x = 0.;
				q4fDestination.y = 0.;
				q4fDestination.z = 0.;
				q4fDestination.w = 0.;
			}
			else {
				var fInvSqLength: float = 1. / fSqLength;
				q4fDestination.x = -x * fInvSqLength;
				q4fDestination.y = -y * fInvSqLength;
				q4fDestination.z = -z * fInvSqLength;
				q4fDestination.w = w * fInvSqLength;
			}

			return q4fDestination;
		}

		/**  */ length(): float {
			var x: float = this.x, y: float = this.y, z: float = this.z, w: float = this.w;
			return sqrt(x * x + y * y + z * z + w * w);
		}

		normalize(q4fDestination?: IQuat4): IQuat4 {
			if (!isDef(q4fDestination)) {
				q4fDestination = this;
			}

			var x: float = this.x, y: float = this.y, z: float = this.z, w: float = this.w;

			var fLength: float = sqrt(x * x + y * y + z * z + w * w);

			if (fLength === 0.) {
				q4fDestination.x = 0.;
				q4fDestination.y = 0.;
				q4fDestination.z = 0.;
				q4fDestination.w = 0.;

			}
			else {
				var fInvLength: float = 1 / fLength;

				q4fDestination.x = x * fInvLength;
				q4fDestination.y = y * fInvLength;
				q4fDestination.z = z * fInvLength;
				q4fDestination.w = w * fInvLength;
			}

			return q4fDestination;
		}

		calculateW(q4fDestination?: IQuat4): IQuat4 {
			var x: float = this.x, y: float = this.y, z: float = this.z;

			if (!isDef(q4fDestination)) {
				this.w = sqrt(1. - x * x - y * y - z * z);
				return this;
			}

			q4fDestination.x = x;
			q4fDestination.y = y;
			q4fDestination.z = z;
			q4fDestination.w = sqrt(1. - x * x - y * y - z * z);

			return q4fDestination;
		}

		isEqual(q4fQuat: IQuat4, fEps: float = 0., asMatrix: boolean = false): boolean {

			var x1: float = this.x, y1: float = this.y, z1: float = this.z, w1: float = this.w;
			var x2: float = q4fQuat.x, y2: float = q4fQuat.y, z2: float = q4fQuat.z, w2: float = q4fQuat.w;

			var fLength1: float = sqrt(x1 * x1 + y1 * y1 + z1 * z1 + w1 * w1);
			var fLength2: float = sqrt(x2 * x2 + y2 * y2 + z2 * z2 + w2 * w2);

			if (abs(fLength2 - fLength2) > fEps) {
				return false;
			}

			var cosHalfTheta: float = (x1 * x2 + y1 * y2 + z1 * z2 + w1 * w2) / fLength1 / fLength2;

			if (asMatrix) {
				cosHalfTheta = abs(cosHalfTheta);
			}

			if (1. - cosHalfTheta > fEps) {
				return false;
			}
			return true;
		}

		getYaw(): float {
			var fYaw: float;

			var x: float = this.x, y: float = this.y, z: float = this.z, w: float = this.w;

			var fx2: float = x * 2.;
			var fy2: float = y * 2.;

			if (abs(x) == abs(w)) {
				//вырожденный случай обрабатывается отдельно
				//
				var wTemp: float = w * sqrt(2.);
				//cos(Yaw/2)*cos(Roll/2) + sin(Yaw/2)*sin(Roll/2) = cos((Yaw-Roll)/2); Roll = 0;
				//x==-w
				//cos(Yaw/2)*cos(Roll/2) - sin(Yaw/2)*sin(Roll/2) = cos((Yaw+Roll)/2); Roll = 0;
				var yTemp: float = y * sqrt(2.);
				//sin(Yaw/2)*cos(Roll/2) - cos(Yaw/2)*sin(Roll/2) = sin((Yaw-Roll)/2); Roll = 0;
				//x==-w
				//sin(Yaw/2)*cos(Roll/2) + cos(Yaw/2)*sin(Roll/2) = sin((Yaw+Roll)/2); Roll = 0;

				fYaw = atan2(yTemp, wTemp) * 2.;
				//fRoll = 0;

				//убираем дополнительный оборот
				var pi: float = PI;
				if (fYaw > pi) {
					fYaw -= pi;
					//fRoll = (x == w) ? -pi : pi;
				}
				else if (fYaw < -pi) {
					fYaw += pi;
					//fRoll = (x == w) ? pi : -pi;
				}
			}
			else {
				//Math.atan2(sin(Yaw)*cos(Pitch),cos(Yaw)*cos(Pitch));
				fYaw = atan2(fx2 * z + fy2 * w, 1. - (fx2 * x + fy2 * y));
			}

			return fYaw;
		}

		getPitch(): float {
			var fPitch: float;

			var x: float = this.x, y: float = this.y, z: float = this.z, w: float = this.w;

			var fx2: float = x * 2.;
			var fy2: float = y * 2.;

			var fSinPitch: float = clamp(fx2 * w - fy2 * z, -1., 1.);/*в очень редких случаях из-за ошибок округления получается результат > 1*/
			fPitch = asin(fSinPitch)

			return fPitch;
		}

		getRoll(): float {
			var fRoll: float;

			var x: float = this.x, y: float = this.y, z: float = this.z, w: float = this.w;

			var fx2: float = x * 2.;
			var fz2: float = z * 2.;

			if (abs(x) == abs(w)) {
				//вырожденный случай обрабатывается отдельно
				//
				var wTemp: float = w * sqrt(2.);
				//cos(Yaw/2)*cos(Roll/2) + sin(Yaw/2)*sin(Roll/2) = cos((Yaw-Roll)/2); Roll = 0;
				//x==-w
				//cos(Yaw/2)*cos(Roll/2) - sin(Yaw/2)*sin(Roll/2) = cos((Yaw+Roll)/2); Roll = 0;
				var yTemp: float = y * sqrt(2.);
				//sin(Yaw/2)*cos(Roll/2) - cos(Yaw/2)*sin(Roll/2) = sin((Yaw-Roll)/2); Roll = 0;
				//x==-w
				//sin(Yaw/2)*cos(Roll/2) + cos(Yaw/2)*sin(Roll/2) = sin((Yaw+Roll)/2); Roll = 0;

				var fYaw: float = atan2(yTemp, wTemp) * 2.;
				fRoll = 0.;

				//убираем дополнительный оборот
				var pi: float = PI;
				if (fYaw > pi) {
					//fYaw -= pi;
					fRoll = (x == w) ? -pi : pi;
				}
				else if (fYaw < -pi) {
					//fYaw += pi;
					fRoll = (x == w) ? pi : -pi;
				}
			}
			else {
				//Math.atan2(cos(Pitch) * sin(Roll),cos(Pitch)*cos(Roll));
				fRoll = atan2(fx2 * y + fz2 * w, 1. - (fx2 * x + fz2 * z));
			}

			return fRoll;
		}

		toYawPitchRoll(v3fDestination?: IVec3): IVec3 {
			if (!isDef(v3fDestination)) {
				v3fDestination = new Vec3();
			}

			var fYaw: float, fPitch: float, fRoll: float;

			var x: float = this.x, y: float = this.y, z: float = this.z, w: float = this.w;

			var fx2: float = x * 2.;
			var fy2: float = y * 2.;
			var fz2: float = z * 2.;
			var fw2: float = w * 2.;

			var fSinPitch: float = clamp(fx2 * w - fy2 * z, -1., 1.);/*в очень редких случаях из-за ошибок округления получается результат > 1*/
			fPitch = asin(fSinPitch);
			//не известен знак косинуса, как следствие это потребует дополнительной проверки.
			//как показала практика - это не на что не влияет, просто один и тот же кватернион можно получить двумя разными вращениями

			if (abs(x) == abs(w)) {
				//вырожденный случай обрабатывается отдельно
				//
				var wTemp: float = w * sqrt(2.);
				//cos(Yaw/2)*cos(Roll/2) + sin(Yaw/2)*sin(Roll/2) = cos((Yaw-Roll)/2); Roll = 0;
				//x==-w
				//cos(Yaw/2)*cos(Roll/2) - sin(Yaw/2)*sin(Roll/2) = cos((Yaw+Roll)/2); Roll = 0;
				var yTemp: float = y * sqrt(2.);
				//sin(Yaw/2)*cos(Roll/2) - cos(Yaw/2)*sin(Roll/2) = sin((Yaw-Roll)/2); Roll = 0;
				//x==-w
				//sin(Yaw/2)*cos(Roll/2) + cos(Yaw/2)*sin(Roll/2) = sin((Yaw+Roll)/2); Roll = 0;

				fYaw = atan2(yTemp, wTemp) * 2.;
				fRoll = 0.;

				//убираем дополнительный оборот
				var pi: float = PI;
				if (fYaw > pi) {
					fYaw -= pi;
					fRoll = (x == w) ? -pi : pi;
				}
				else if (fYaw < -pi) {
					fYaw += pi;
					fRoll = (x == w) ? pi : -pi;
				}
			}
			else {
				//Math.atan2(sin(Yaw)*cos(Pitch),cos(Yaw)*cos(Pitch));
				fYaw = atan2(fx2 * z + fy2 * w, 1. - (fx2 * x + fy2 * y));
				//Math.atan2(cos(Pitch) * sin(Roll),cos(Pitch)*cos(Roll));
				fRoll = atan2(fx2 * y + fz2 * w, 1. - (fx2 * x + fz2 * z));
			}

			v3fDestination.x = fYaw;
			v3fDestination.y = fPitch;
			v3fDestination.z = fRoll;

			return v3fDestination;
		}

		toMat3(m3fDestination?: IMat3): IMat3 {
			if (!isDef(m3fDestination)) {
				m3fDestination = new Mat3();
			}
			var pDataDestination: Float32Array = m3fDestination.data;

			var x: float = this.x, y: float = this.y, z: float = this.z, w: float = this.w;

			//потом необходимо ускорить

			pDataDestination[__a11] = 1. - 2. * (y * y + z * z);
			pDataDestination[__a12] = 2. * (x * y - z * w);
			pDataDestination[__a13] = 2. * (x * z + y * w);

			pDataDestination[__a21] = 2. * (x * y + z * w);
			pDataDestination[__a22] = 1. - 2. * (x * x + z * z);
			pDataDestination[__a23] = 2. * (y * z - x * w);

			pDataDestination[__a31] = 2. * (x * z - y * w);
			pDataDestination[__a32] = 2. * (y * z + x * w);
			pDataDestination[__a33] = 1. - 2. * (x * x + y * y);

			return m3fDestination;
		}

		toMat4(m4fDestination?: IMat4): IMat4 {
			if (!isDef(m4fDestination)) {
				m4fDestination = new Mat4();
			}
			var pDataDestination: Float32Array = m4fDestination.data;

			var x: float = this.x, y: float = this.y, z: float = this.z, w: float = this.w;

			//потом необходимо ускорить

			pDataDestination[__11] = 1. - 2. * (y * y + z * z);
			pDataDestination[__12] = 2. * (x * y - z * w);
			pDataDestination[__13] = 2. * (x * z + y * w);
			pDataDestination[__14] = 0.;

			pDataDestination[__21] = 2. * (x * y + z * w);
			pDataDestination[__22] = 1. - 2. * (x * x + z * z);
			pDataDestination[__23] = 2. * (y * z - x * w);
			pDataDestination[__24] = 0.;

			pDataDestination[__31] = 2. * (x * z - y * w);
			pDataDestination[__32] = 2. * (y * z + x * w);
			pDataDestination[__33] = 1. - 2. * (x * x + y * y);
			pDataDestination[__34] = 0.;

			pDataDestination[__41] = 0.;
			pDataDestination[__42] = 0.;
			pDataDestination[__43] = 0.;
			pDataDestination[__44] = 1.;

			return m4fDestination;
		}

		/**  */ toString(): string {
			return "[x: " + this.x + ", y: " + this.y + ", z: " + this.z + ", w: " + this.w + "]";
		}

		mix(q4fQuat: IQuat4, fA: float, q4fDestination?: IQuat4, bShortestPath: boolean = true) {
			if (!isDef(q4fDestination)) {
				q4fDestination = this;
			}

			fA = clamp(fA, 0, 1);

			var x1: float = this.x, y1: float = this.y, z1: float = this.z, w1: float = this.w;
			var x2: float = q4fQuat.x, y2: float = q4fQuat.y, z2: float = q4fQuat.z, w2: float = q4fQuat.w;

			//скалярное произведение
			var fCos: float = x1 * x2 + y1 * y2 + z1 * z2 + w1 * w2;

			if (fCos < 0. && bShortestPath) {
				x2 = -x2;
				y2 = -y2;
				z2 = -z2;
				w2 = -w2;
			}

			var k1: float = 1. - fA;
			var k2: float = fA;

			q4fDestination.x = x1 * k1 + x2 * k2;
			q4fDestination.y = y1 * k1 + y2 * k2;
			q4fDestination.z = z1 * k1 + z2 * k2;
			q4fDestination.w = w1 * k1 + w2 * k2;

			return q4fDestination;
		}

		smix(q4fQuat: IQuat4, fA: float, q4fDestination?: IQuat4, bShortestPath: boolean = true) {
			if (!isDef(q4fDestination)) {
				q4fDestination = this;
			}

			fA = clamp(fA, 0, 1);

			var x1: float = this.x, y1: float = this.y, z1: float = this.z, w1: float = this.w;
			var x2: float = q4fQuat.x, y2: float = q4fQuat.y, z2: float = q4fQuat.z, w2: float = q4fQuat.w;

			//скалярное произведение
			var fCos: float = x1 * x2 + y1 * y2 + z1 * z2 + w1 * w2;

			if (fCos < 0 && bShortestPath) {
				fCos = -fCos;
				x2 = -x2;
				y2 = -y2;
				z2 = -z2;
				w2 = -w2;
			}

			var fEps: float = 1e-3;
			if (abs(fCos) < 1. - fEps) {
				var fSin: float = sqrt(1. - fCos * fCos);
				var fInvSin: float = 1. / fSin;

				var fAngle: float = atan2(fSin, fCos);

				var k1: float = sin((1. - fA) * fAngle) * fInvSin;
				var k2: float = sin(fA * fAngle) * fInvSin;

				q4fDestination.x = x1 * k1 + x2 * k2;
				q4fDestination.y = y1 * k1 + y2 * k2;
				q4fDestination.z = z1 * k1 + z2 * k2;
				q4fDestination.w = w1 * k1 + w2 * k2;
			}
			else {
				//два кватерниона или очень близки (тогда можно делать линейную интерполяцию) 
				//или два кватениона диаметрально противоположны, тогда можно интерполировать любым способом
				//позже надо будет реализовать какой-нибудь, а пока тоже линейная интерполяция

				var k1: float = 1 - fA;
				var k2: float = fA;

				var x: float = x1 * k1 + x2 * k2;
				var y: float = y1 * k1 + y2 * k2;
				var z: float = z1 * k1 + z2 * k2;
				var w: float = w1 * k1 + w2 * k2;

				// и нормализуем так-как мы сошли со сферы

				var fLength: float = sqrt(x * x + y * y + z * z + w * w);
				var fInvLen: float = fLength ? 1 / fLength : 0;

				q4fDestination.x = x * fInvLen;
				q4fDestination.y = y * fInvLen;
				q4fDestination.z = z * fInvLen;
				q4fDestination.w = w * fInvLen;
			}

			return q4fDestination;
		}

		static fromForwardUp(v3fForward: IVec3, v3fUp: IVec3, q4fDestination?: IQuat4): IQuat4 {
			if (!isDef(q4fDestination)) {
				q4fDestination = new Quat4();
			}

			var fForwardX: float = v3fForward.x, fForwardY: float = v3fForward.y, fForwardZ: float = v3fForward.z;
			var fUpX: float = v3fUp.x, fUpY: float = v3fUp.y, fUpZ: float = v3fUp.z;

			var m3fTemp: IMat3 = Mat3.temp();
			var pTempData: Float32Array = m3fTemp.data;

			pTempData[__a11] = fUpY * fForwardZ - fUpZ * fForwardY;
			pTempData[__a12] = fUpX;
			pTempData[__a13] = fForwardX;

			pTempData[__a21] = fUpZ * fForwardX - fUpX * fForwardZ;
			pTempData[__a22] = fUpY;
			pTempData[__a23] = fForwardY;

			pTempData[__a31] = fUpX * fForwardY - fUpY * fForwardX;
			pTempData[__a32] = fUpZ;
			pTempData[__a33] = fForwardZ;

			return m3fTemp.toQuat4(q4fDestination);
		}

		static fromAxisAngle(v3fAxis: IVec3, fAngle: float, q4fDestination?: IQuat4): IQuat4 {

			if (!isDef(q4fDestination)) {
				q4fDestination = new Quat4();
			}

			var x: float = v3fAxis.x, y: float = v3fAxis.y, z: float = v3fAxis.z;

			var fLength: float = sqrt(x * x + y * y + z * z);

			if (fLength === 0.) {
				q4fDestination.x = q4fDestination.y = q4fDestination.z = 0;
				q4fDestination.w = 1;
				return q4fDestination;
			}

			var fInvLength = 1 / fLength;

			x *= fInvLength;
			y *= fInvLength;
			z *= fInvLength;

			var fSin: float = sin(fAngle / 2);
			var fCos: float = cos(fAngle / 2);

			q4fDestination.x = x * fSin;
			q4fDestination.y = y * fSin;
			q4fDestination.z = z * fSin;
			q4fDestination.w = fCos;

			return q4fDestination;
		}

		static fromYawPitchRoll(fYaw: float, fPitch: float, fRoll: float, q4fDestination?: IQuat4): IQuat4;
		static fromYawPitchRoll(v3fAngles: IVec3, q4fDestination?: IQuat4): IQuat4;
		static fromYawPitchRoll(fYaw?, fPitch?, fRoll?, q4fDestination?): IQuat4 {
			if (arguments.length <= 2) {
				var v3fVec: IVec3 = arguments[0];

				fYaw = v3fVec.x;
				fPitch = v3fVec.y;
				fRoll = v3fVec.z;

				q4fDestination = arguments[1];
			}

			if (!isDef(q4fDestination)) {
				q4fDestination = new Quat4();
			}

			var fHalfYaw: float = fYaw * 0.5;
			var fHalfPitch: float = fPitch * 0.5;
			var fHalfRoll: float = fRoll * 0.5;

			var fCos1: float = cos(fHalfYaw), fSin1: float = sin(fHalfYaw);
			var fCos2: float = cos(fHalfPitch), fSin2: float = sin(fHalfPitch);
			var fCos3: float = cos(fHalfRoll), fSin3: float = sin(fHalfRoll);

			q4fDestination.x = fCos1 * fSin2 * fCos3 + fSin1 * fCos2 * fSin3;
			q4fDestination.y = fSin1 * fCos2 * fCos3 - fCos1 * fSin2 * fSin3;
			q4fDestination.z = fCos1 * fCos2 * fSin3 - fSin1 * fSin2 * fCos3;
			q4fDestination.w = fCos1 * fCos2 * fCos3 + fSin1 * fSin2 * fSin3;

			return q4fDestination;
		}

		static fromXYZ(fX: float, fY: float, fZ: float, q4fDestination?: IQuat4): IQuat4;
		static fromXYZ(v3fAngles: IVec3, q4fDestination?: IQuat4): IQuat4;
		static fromXYZ(fX?, fY?, fZ?, q4fDestination?): IQuat4 {
			if (arguments.length <= 2) {
				//Vec3 + m4fDestination
				var v3fVec: IVec3 = arguments[0];
				return Quat4.fromYawPitchRoll(v3fVec.y, v3fVec.x, v3fVec.z, arguments[1]);
			}
			else {
				//fX fY fZ m4fDestination
				//var fX: float = arguments[0];
				//var fY: float = arguments[1];
				//var fZ: float = arguments[2];

				return Quat4.fromYawPitchRoll(<float>fY, <float>fX, <float>fZ, <IQuat4>arguments[3]);
			}
		}

		static temp(): IQuat4;
		static temp(q: IQuat4): IQuat4;
		static temp(q: float[]): IQuat4;
		static temp(xyz: float, w: float): IQuat4;
		static temp(xyz: IVec3, w: float): IQuat4;
		static temp(x: float, y: float, z: float, w: float): IQuat4;
		static temp(x?, y?, z?, w?): IQuat4 {
			iElement = (iElement === pBuffer.length - 1 ? 0 : pBuffer.length);
			var p = pBuffer[iElement++];
			return p.set.apply(p, arguments);
		}
	}

	pBuffer = gen.array<IQuat4>(256, Quat4);
	iElement = 0;

}