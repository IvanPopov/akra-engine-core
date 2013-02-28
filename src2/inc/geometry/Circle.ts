#ifndef CIRCLE_TS
#define CIRCLE_TS

#include "../math/Vec2.ts"
#include "ICircle.ts"

module akra.geometry{
	export class Circle implements ICircle{
		center: IVec2;
		radius: float;

		constructor();
		constructor(pCircle: ICircle);
		constructor(v2fCenter: IVec2, fRadius: float);
		constructor(fCenterX: float, fCenterY: float, fRadius: float);
		constructor(fCenterX?, fCenterY?, fRadius?){
			var nArgumentsLength: uint = arguments.length;

			switch(nArgumentsLength){
				case 1:
					var pCircle: ICircle = arguments[0];
					this.center = new Vec2(pCircle.center);
					this.radius = pCircle.radius;
					break;
				case 2:
					var v2fCenter: IVec2 = arguments[0];
					var fRadius: float = arguments[1];

					this.center = new Vec2(v2fCenter);
					this.radius = fRadius;
					break;
				case 3:
					this.center = new Vec2(arguments[0], arguments[1]);
					this.radius = arguments[2];
					break;
				default:
					this.center = new Vec2();
					this.radius = 0.;
					break;
			}
		};

		set(): ICircle;
		set(pCircle: ICircle): ICircle;
		set(v2fCenter: IVec2, fRadius: float): ICircle;
		set(fCenterX: float, fCenterY: float, fRadius: float): ICircle;
		set(fCenterX?, fCenterY?, fRadius?): ICircle{
			var nArgumentsLength: uint = arguments.length;

			switch(nArgumentsLength){
				case 1:
					var pCircle: ICircle = arguments[0];
					this.center.set(pCircle.center);
					this.radius = pCircle.radius;
					break;
				case 2:
					var v2fCenter: IVec2 = arguments[0];
					var fRadius: float = arguments[1];

					this.center.set(v2fCenter);
					this.radius = fRadius;
					break;
				case 3:
					this.center.set(arguments[0], arguments[1]);
					this.radius = arguments[2];
					break;
				default:
					this.center.set(0.);
					this.radius = 0.;
			}

			return this;
		};

		inline clear(): ICircle{
			this.center.clear();
			this.radius = 0.;

			return this;
		};

		inline isEqual(pCircle: ICircle): bool{
			return this.center.isEqual(pCircle.center) && (this.radius == pCircle.radius);
		};

		inline isClear(): bool{
			return this.center.isClear() && (this.radius === 0.);
		};

		inline isValid(): bool{
			return (this.radius >= 0.);
		};

		inline offset(v2fOffset: IVec2): ICircle{
			this.center.add(v2fOffset);
			return this;
		};

		inline expand(fInc: float): ICircle{
			this.radius += fInc;
			return this;
		};

		inline normalize(): ICircle{
			this.radius = math.abs(this.radius);
			return this;
		};
	};
};

#endif
