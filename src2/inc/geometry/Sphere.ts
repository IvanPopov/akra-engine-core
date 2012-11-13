#ifndef SPHERE_TS
#define SPHERE_TS

#include "../math/Vec3.ts"
#include "ISphere.ts"
#include "Circle.ts"

module akra.geometry{
	export class Sphere implements ISphere{
		v3fCenter: IVec3;
		fRadius: float;

		constructor();
		constructor(pSphere: ISphere);
		constructor(v3fCenter: IVec3, fRadius: float);
		constructor(fCenterX: float, fCenterY: float, fCenterZ: float, fRadius: float);
		constructor(fCenterX?, fCenterY?, fCenterZ?, fRadius?){
			var nArgumentsLength: uint = arguments.length;

			switch(nArgumentsLength){
				case 1:
					var pSphere = arguments[0];

					this.v3fCenter = new Vec3(pSphere.v3fCenter);
					this.fRadius = pSphere.fRadius;
					break;
				case 2:
					var v3fCenter: IVec3 = arguments[0];
					var fRadius: float = arguments[1];

					this.v3fCenter = new Vec3(v3fCenter);
					this.fRadius = fRadius;
					break;
				case 4:
					this.v3fCenter = new Vec3(arguments[0], arguments[1], arguments[2]);
					this.fRadius = arguments[3];
					break;
				default:
					this.v3fCenter = new Vec3();
					this.fRadius = 0.;
					break;
			}
		};

		get circle(): ICircle{
			var v3fCenter: IVec3 = this.v3fCenter;
			return new Circle(v3fCenter.x, v3fCenter.y, this.fRadius);
		};
		set circle(pCircle: ICircle){
			var v3fCenter: IVec3 = this.v3fCenter;
			var v2fCircleCenter: IVec2 = pCircle.v2fCenter;
			v3fCenter.x = v2fCircleCenter.x;
			v3fCenter.y = v2fCircleCenter.y;
			this.fRadius = pCircle.fRadius;
		};

		get z(): float{
			return this.v3fCenter.z;
		};
		set z(fZ: float){
			this.v3fCenter.z = fZ;
		};

		set(): ISphere;
		set(pSphere: ISphere): ISphere;
		set(v3fCenter: IVec3, fRadius: float): ISphere;
		set(fCenterX: float, fCenterY: float, fCenterZ: float, fRadius: float): ISphere;
		set(fCenterX?, fCenterY?, fCenterZ?, fRadius?): ISphere{
			var nArgumentsLength: uint = arguments.length;

			switch(nArgumentsLength){
				case 1:
					var pSphere = arguments[0];

					this.v3fCenter.set(pSphere.v3fCenter);
					this.fRadius = pSphere.fRadius;
					break;
				case 2:
					var v3fCenter: IVec3 = arguments[0];
					var fRadius: float = arguments[1];

					this.v3fCenter.set(v3fCenter);
					this.fRadius = fRadius;
					break;
				case 4:
					this.v3fCenter.set(arguments[0], arguments[1], arguments[2]);
					this.fRadius = arguments[3];
					break;
				default:
					this.v3fCenter.set(0.);
					this.fRadius = 0.;
					break;
			}

			return this;
		};

		inline clear(): ISphere{
			this.v3fCenter.clear();
			this.fRadius = 0.;

			return this;
		};

		inline isEqual(pSphere: ISphere): bool{
			return this.v3fCenter.isEqual(pSphere.v3fCenter) && (this.fRadius == pSphere.fRadius);
		};

		inline isClear(): bool{
			return this.v3fCenter.isClear() && (this.fRadius === 0.);	
		};

		inline isValid(): bool{
			return (this.fRadius >= 0.);
		};

		inline offset(v3fOffset: IVec3): ISphere{
			this.v3fCenter.add(v3fOffset);
			return this;
		};

		inline expand(fInc: float): ISphere{
			this.fRadius += fInc;
			return this;
		};

		inline normalize(): ISphere{
			this.fRadius = math.abs(this.fRadius);
			return this;
		};
	};
}

#endif