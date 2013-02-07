#ifndef SPHERE_TS
#define SPHERE_TS

#include "../math/Vec3.ts"
#include "ISphere.ts"
#include "Circle.ts"

module akra.geometry{
	export class Sphere implements ISphere{
		center: IVec3;
		radius: float;

		constructor();
		constructor(pSphere: ISphere);
		constructor(v3fCenter: IVec3, fRadius: float);
		constructor(fCenterX: float, fCenterY: float, fCenterZ: float, fRadius: float);
		constructor(fCenterX?, fCenterY?, fCenterZ?, fRadius?){
			var nArgumentsLength: uint = arguments.length;

			switch(nArgumentsLength){
				case 1:
					var pSphere = arguments[0];

					this.center = new Vec3(pSphere.v3fCenter);
					this.radius = pSphere.fRadius;
					break;
				case 2:
					var v3fCenter: IVec3 = arguments[0];
					var fRadius: float = arguments[1];

					this.center = new Vec3(v3fCenter);
					this.radius = fRadius;
					break;
				case 4:
					this.center = new Vec3(arguments[0], arguments[1], arguments[2]);
					this.radius = arguments[3];
					break;
				default:
					this.center = new Vec3();
					this.radius = 0.;
					break;
			}
		};

		get circle(): ICircle{
			var v3fCenter: IVec3 = this.center;
			return new Circle(v3fCenter.x, v3fCenter.y, this.radius);
		};
		set circle(pCircle: ICircle){
			var v3fCenter: IVec3 = this.center;
			var v2fCircleCenter: IVec2 = pCircle.center;
			v3fCenter.x = v2fCircleCenter.x;
			v3fCenter.y = v2fCircleCenter.y;
			this.radius = pCircle.radius;
		};

		get z(): float{
			return this.center.z;
		};
		set z(fZ: float){
			this.center.z = fZ;
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

					this.center.set(pSphere.center);
					this.radius = pSphere.radius;
					break;
				case 2:
					var v3fCenter: IVec3 = arguments[0];
					var fRadius: float = arguments[1];

					this.center.set(v3fCenter);
					this.radius = fRadius;
					break;
				case 4:
					this.center.set(arguments[0], arguments[1], arguments[2]);
					this.radius = arguments[3];
					break;
				default:
					this.center.set(0.);
					this.radius = 0.;
					break;
			}

			return this;
		};

		inline clear(): ISphere{
			this.center.clear();
			this.radius = 0.;

			return this;
		};

		inline isEqual(pSphere: ISphere): bool{
			return this.center.isEqual(pSphere.center) && (this.radius == pSphere.radius);
		};

		inline isClear(): bool{
			return this.center.isClear() && (this.radius === 0.);	
		};

		inline isValid(): bool{
			return (this.radius >= 0.);
		};

		inline offset(v3fOffset: IVec3): ISphere{
			this.center.add(v3fOffset);
			return this;
		};

		inline expand(fInc: float): ISphere{
			this.radius += fInc;
			return this;
		};

		inline normalize(): ISphere{
			this.radius = math.abs(this.radius);
			return this;
		};

		transform(m4fMatrix: IMat4): ISphere {
			CRITICAL("TODO: transform() for Sphere similar to Rect3d::transform();");

			return this;
		}
	};
}

#endif