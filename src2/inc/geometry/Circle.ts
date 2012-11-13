#ifndef CIRCLE_TS
#define CIRCLE_TS

#include "../math/Vec2.ts"
#include "ICircle.ts"

module akra.geometry{
	export class Circle implements ICircle{
		v2fCenter: IVec2;
		fRadius: float;

		constructor();
		constructor(pCircle: ICircle);
		constructor(v2fCenter: IVec2, fRadius: float);
		constructor(fCenterX: float, fCenterY: float, fRadius: float);
		constructor(fCenterX?, fCenterY?, fRadius?){
			var nArgumentsLength: uint = arguments.length;

			switch(nArgumentsLength){
				case 1:
					var pCircle: ICircle = arguments[0];
					this.v2fCenter = new Vec2(pCircle.v2fCenter);
					this.fRadius = pCircle.fRadius;
					break;
				case 2:
					var v2fCenter: IVec2 = arguments[0];
					var fRadius: float = arguments[1];

					this.v2fCenter = new Vec2(v2fCenter);
					this.fRadius = fRadius;
					break;
				case 3:
					this.v2fCenter = new Vec2(arguments[0], arguments[1]);
					this.fRadius = arguments[2];
					break;
				default:
					this.v2fCenter = new Vec2();
					this.fRadius = 0.;
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
					this.v2fCenter.set(pCircle.v2fCenter);
					this.fRadius = pCircle.fRadius;
					break;
				case 2:
					var v2fCenter: IVec2 = arguments[0];
					var fRadius: float = arguments[1];

					this.v2fCenter.set(v2fCenter);
					this.fRadius = fRadius;
					break;
				case 3:
					this.v2fCenter.set(arguments[0], arguments[1]);
					this.fRadius = arguments[2];
					break;
				default:
					this.v2fCenter.set(0.);
					this.fRadius = 0.;
			}

			return this;
		};

		inline clear(): ICircle{
			this.v2fCenter.clear();
			this.fRadius = 0.;

			return this;
		};

		inline isEqual(pCircle: ICircle): bool{
			return this.v2fCenter.isEqual(pCircle.v2fCenter) && (this.fRadius == pCircle.fRadius);
		};

		inline isClear(): bool{
			return this.v2fCenter.isClear() && (this.fRadius === 0.);
		};

		inline isValid(): bool{
			return (this.fRadius >= 0.);
		};

		inline offset(v2fOffset: IVec2): ICircle{
			this.v2fCenter.add(v2fOffset);
			return this;
		};

		inline expand(fInc: float): ICircle{
			this.fRadius += fInc;
			return this;
		};

		inline normalize(): ICircle{
			this.fRadius = math.abs(this.fRadius);
			return this;
		};
	};
};

#endif
