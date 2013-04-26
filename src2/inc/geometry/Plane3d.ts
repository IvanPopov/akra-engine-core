#ifndef PLANE3D_TS
#define PLANE3D_TS

#include "../math/Vec3.ts"
#include "IPlane3d.ts"

module akra.geometry{
	export class Plane3d implements IPlane3d{
		normal: IVec3;
		distance: float;

		constructor();
		constructor(pPlane: IPlane3d);
		constructor(v3fNormal: IVec3, fDistance: float);
		constructor(v3fPoint1: IVec3, v3fPoint2: IVec3, v3fPoint3: IVec3);
		constructor(v3fPoint1?, v3fPoint2?, v3fPoint3?){

			this.normal = new Vec3();
			this.distance = 0.;

			var nArgumentsLength: uint = arguments.length;

			switch(nArgumentsLength){
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
					break;
			}
		};

		set(): IPlane3d;
		set(pPlane: IPlane3d): IPlane3d;
		set(v3fNormal: IVec3, fDistance: float): IPlane3d;
		set(v3fPoint1: IVec3, v3fPoint2: IVec3, v3fPoint3: IVec3): IPlane3d;
		set(v3fPoint1?, v3fPoint2?, v3fPoint3?): IPlane3d{
			var nArgumentsLength: uint = arguments.length;

			switch(nArgumentsLength){
				case 1:
					var pPlane: IPlane3d = arguments[0];

					this.normal.set(pPlane.normal);
					this.distance = pPlane.distance;
					break;
				case 2:
					this.normal.set(arguments[0]);
					this.distance = arguments[1];
					break;
				case 3:
					var v3fPoint1: IVec3 = arguments[0];
					var v3fPoint2: IVec3 = arguments[1];
					var v3fPoint3: IVec3 = arguments[2];

					var x1: float = v3fPoint2.x - v3fPoint1.x;
					var y1: float = v3fPoint2.y - v3fPoint1.y;
					var z1: float = v3fPoint2.z - v3fPoint1.z;

					var x2: float = v3fPoint3.x - v3fPoint1.x;
					var y2: float = v3fPoint3.y - v3fPoint1.y;
					var z2: float = v3fPoint3.z - v3fPoint1.z;

					var x: float = y1*z2 - y2*z1;
					var y: float = z1*x2 - z2*x1;
					var z: float = x1*y2 - x2*y1;

					this.distance = -(x*v3fPoint1.x + y*v3fPoint1.y + z*v3fPoint1.z);
					this.normal.set(x,y,z);

					break;
				default:
					this.normal.clear();
					this.distance = 0.;
					break;
			}

			return this.normalize();
		};

		inline clear(): IPlane3d{
			this.normal.clear();
			this.distance = 0.;
			return this;
		};

		inline negate(): IPlane3d{
			this.normal.negate();
			this.distance = -this.distance;
			return this;
		};

		normalize(): IPlane3d{
			var v3fNormal: IVec3 = this.normal;
			var x: float = v3fNormal.x, y: float = v3fNormal.y, z: float = v3fNormal.z;

			var fLength: float = math.sqrt(x*x + y*y + z*z);

			if(fLength !== 0.){
				var fInvLength = 1./fLength;

				v3fNormal.x = x*fInvLength;
				v3fNormal.y = y*fInvLength;
				v3fNormal.z = z*fInvLength;

				this.distance *= fInvLength;
			}

			return this;
		};

		isEqual(pPlane: IPlane3d): bool{
			return this.normal.isEqual(pPlane.normal) && (this.distance == pPlane.distance);
		};

		/*предполагается работа только с нормализованной плоскостью*/
		projectPointToPlane(v3fPoint: IVec3, v3fDestination?: IVec3): IVec3{
			if(!isDef(v3fDestination)){
				v3fDestination = new Vec3();
			}

			var v3fNormal: IVec3 = this.normal;
			var fDistance: float = this.distance + v3fNormal.dot(v3fPoint);

			v3fDestination.x = v3fPoint.x - fDistance*v3fNormal.x;
			v3fDestination.y = v3fPoint.y - fDistance*v3fNormal.y;
			v3fDestination.z = v3fPoint.z - fDistance*v3fNormal.z;

			return v3fDestination;
		};

		solveForX(fY: float, fZ: float): float{
			/*Ax+By+Cz+D=0;
			x = -(D+By+Cz)/A;*/

			var v3fNormal: IVec3 = this.normal;

			if(v3fNormal.x !== 0.){
				return -(this.distance + v3fNormal.y*fY + v3fNormal.z*fZ)/v3fNormal.x;
			}
			return 0.;
		};

		solveForY(fX: float, fZ: float): float{
			/*Ax+By+Cz+D=0;
			y = -(D+Ax+Cz)/B;*/

			var v3fNormal: IVec3 = this.normal;

			if(v3fNormal.y !== 0.){
				return -(this.distance + v3fNormal.x*fX + v3fNormal.z*fZ)/v3fNormal.y;
			}
			return 0.;
		};

		solveForZ(fX: float, fY: float): float{
			/*Ax+By+Cz+D=0;
			z = -(D+Ax+By)/C;*/

			var v3fNormal: IVec3 = this.normal;

			if(v3fNormal.z !== 0.){
				return -(this.distance + v3fNormal.x*fX + v3fNormal.y*fY)/v3fNormal.z;
			}

			return 0.;
		};

		signedDistance(v3fPoint: IVec3): float{
			return this.distance + this.normal.dot(v3fPoint);
		};

		toString(): string{
			return "normal: " + this.normal.toString() + "; distance: " + this.distance;
		};
	};
};

#endif