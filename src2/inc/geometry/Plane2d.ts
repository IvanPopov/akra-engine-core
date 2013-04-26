#ifndef PLANE2D_TS
#define PLANE2D_TS

#include "../math/Vec2.ts"
#include "IPlane2d.ts"

module akra.geometry{
	export class Plane2d implements IPlane2d{
		normal: IVec2;
		distance: float;

		constructor();
		constructor(pPlane: IPlane2d);
		constructor(v2fNormal: IVec2, fDistance: float);
		constructor(v2fPoint1: IVec2, v2fPoint2: IVec2);
		constructor(v2fPoint1?, v2fPoint2?){

			this.normal = new Vec2();
			this.distance = 0.;

			var nArgumentsLength = arguments.length;

			switch(nArgumentsLength){
				case 1:
					this.set(arguments[0]);
					break;
				case 2:
					this.set(arguments[0], arguments[1]);
					break;
				default:
					break;
			}
		};

		set(): IPlane2d;
		set(pPlane: IPlane2d): IPlane2d;
		set(v2fNormal: IVec2, fDistance: float): IPlane2d;
		set(v2fPoint1: IVec2, v2fPoint2: IVec2): IPlane2d;
		set(v2fPoint1?, v2fPoint2?): IPlane2d{
			var nArgumentsLength: uint = arguments.length;

			switch(nArgumentsLength){
				case 1:
					var pPlane: IPlane2d = arguments[0];

					this.normal.set(pPlane.normal);
					this.distance = pPlane.distance;
					break;
				case 2:
					if(isFloat(arguments[1])){
						this.normal.set(arguments[0]);
						this.distance = arguments[1];
					}
					else{
						var v2fLine: IVec2 = vec2(<IVec2>arguments[1]).subtract(arguments[0]);
						var v2fNormal: IVec2 = this.normal;

						v2fNormal.set(-v2fLine.y, v2fLine.x);
						this.distance = -v2fNormal.dot(arguments[0]);
					}
					break;
				default:
					this.normal.clear();
					this.distance = 0.;
					break;
			}

			return this.normalize();
		};

		inline clear(): IPlane2d{
			this.normal.clear();
			this.distance = 0.;
			return this;
		};

		inline negate(): IPlane2d{
			this.normal.negate();
			this.distance = -this.distance;
			return this;
		};

		normalize(): IPlane2d{
			var v2fNormal: IVec2 = this.normal;

			var x: float = v2fNormal.x;
			var y: float = v2fNormal.y

			var fLength: float = math.sqrt(x*x + y*y);

			if(fLength !== 0.){
				var fInvLength: float = 1./fLength;

				v2fNormal.x = x*fInvLength;
				v2fNormal.y = y*fInvLength;

				this.distance = this.distance*fInvLength;
			}

			return this;
		};

		inline isEqual(pPlane: IPlane2d): bool{
			return this.normal.isEqual(pPlane.normal) && (this.distance == pPlane.distance);
		};

		/*предполагается работа только с нормализованной плоскостью*/
		projectPointToPlane(v2fPoint: IVec2, v2fDestination?: IVec2): IVec2{
			if(!isDef(v2fDestination)){
				v2fDestination = new Vec2();
			}

			var v2fNormal: IVec2 = this.normal;
			var fDistance: float = this.distance + v2fNormal.dot(v2fPoint);

			v2fDestination.x = v2fPoint.x - fDistance*v2fNormal.x;
			v2fDestination.y = v2fPoint.y - fDistance*v2fNormal.y;

			return v2fDestination;
		};

		solveForX(fY: float): float{
			/*Ax+By+d=0;
			x=-(d+By)/A;*/
			
			var v2fNormal: IVec2 = this.normal;

			if(v2fNormal.x !== 0.){
				return -(this.distance + v2fNormal.y*fY)/v2fNormal.x;
			}
			return 0.;
		};

		solveForY(fX: float): float{
			/*Ax+By+d=0;
			y=-(d+Ax)/B;*/
			
			var v2fNormal: IVec2 = this.normal;

			if(v2fNormal.y !== 0.){
				return -(this.distance + v2fNormal.x*fX)/v2fNormal.y;
			}
			return 0.;
		};

		/*предполагается работа только с нормализованной плоскостью*/
		inline signedDistance(v2fPoint: IVec2): float{
			return this.distance + this.normal.dot(v2fPoint);
		};

		toString(): string{
			return "normal: " + this.normal.toString() + "; distance: " + this.distance;
		};
	};
}

#endif