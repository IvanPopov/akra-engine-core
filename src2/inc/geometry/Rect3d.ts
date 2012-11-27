#ifndef RECT3D_TS
#define RECT3D_TS

#include "../math/Vec3.ts"
#include "Rect2d.ts"
#include "IRect3d.ts"

module akra.geometry {
    export class Rect3d implements IRect3d{
    	x0: float;
    	x1: float;
		y0: float;
		y1: float;
		z0: float;
		z1: float;

		constructor();
		constructor(pRect: IRect3d);
		constructor(fSizeX: float, fSizeY: float, fSizeZ: float);
		constructor(fX0: float, fX1: float, fY0: float,
					fY1: float, fZ0: float, fZ1: float);
		constructor(fX0?, fX1?, fY0?, fY1?, fZ0?, fZ1?){
			var nArgumentsLength: uint = arguments.length;

			switch(nArgumentsLength){
				case 1:
					this.set(arguments[0]);
					break;
				case 3:
					this.set(arguments[0], arguments[1], arguments[2]);
					break;
				case 6:
					this.set(arguments[0], arguments[1], arguments[2],
							arguments[3], arguments[4], arguments[5]);
					break;
				default:
					this.x0 = this.x1 = this.y0 = this.y1 = this.z0 = this.z1 = 0.;
					break;
			}
		};

		get rect2d(): IRect2d{
			return new Rect2d(this.x0, this.x1, this.y0, this.y1);
		};

		set rect2d(pRect: IRect2d){
			this.x0 = pRect.x0;
			this.x1 = pRect.x1;
			this.y0 = pRect.y0;
			this.y1 = pRect.y1;
		};

		set(): IRect3d;
		set(pRect: IRect3d): IRect3d;
		set(v3fVec: IVec3): IRect3d;
		set(fSizeX: float, fSizeY: float, fSizeZ: float): IRect3d;
		set(fX0: float, fX1: float, fY0: float,
			fY1: float, fZ0: float, fZ1: float): IRect3d;
		set(fX0?, fX1?, fY0?, fY1?, fZ0?, fZ1?): IRect3d{
			var nArgumentsLength: uint = arguments.length;

			switch(nArgumentsLength){
				case 1:
					var pRect: IRect3d = arguments[0];

					this.x0 = pRect.x0;
					this.x1 = pRect.x1;
					this.y0 = pRect.y0;
					this.y1 = pRect.y1;
					this.z0 = pRect.z0;
					this.z1 = pRect.z1;
					break;
				case 3:
					var fSizeX: float = arguments[0];
					var fSizeY: float = arguments[1];
					var fSizeZ: float = arguments[2];

					this.x1 = fSizeX*0.5;
					this.x0 = -this.x1;

					this.y1 = fSizeY*0.5;
					this.y0 = -this.y1;

					this.z1 = fSizeZ*0.5;
					this.z0 = -this.z1;
					break;
				case 6:
					this.x0 = arguments[0];
					this.x1 = arguments[1];

					this.y0 = arguments[2];
					this.y1 = arguments[3];

					this.z0 = arguments[4];
					this.z1 = arguments[5];
					break;
				default:
					this.x0 = this.x1 = this.y0 = this.y1 = this.z0 = this.z1 = 0.;
					break;
			}
			return this;
		};

		setFloor(pRect: IRect3d): IRect3d{
			this.x0 = math.floor(pRect.x0);
			this.x1 = math.floor(pRect.x1);
			this.y0 = math.floor(pRect.y0);
			this.y1 = math.floor(pRect.y1);
			this.z0 = math.floor(pRect.z0);
			this.z1 = math.floor(pRect.z1);

			return this;
		};

		setCeil(pRect: IRect3d): IRect3d{
			this.x0 = math.ceil(pRect.x0);
			this.x1 = math.ceil(pRect.x1);
			this.y0 = math.ceil(pRect.y0);
			this.y1 = math.ceil(pRect.y1);
			this.z0 = math.ceil(pRect.z0);
			this.z1 = math.ceil(pRect.z1);

			return this;	
		};

		inline clear(): IRect3d{
			this.x0 = this.x1 = this.y0 = this.y1 = this.z0 = this.z1 = 0.;
			return this;
		};

		addSelf(fValue: float): IRect3d;
		addSelf(v3fVec: IVec3): IRect3d;
		addSelf(v3fVec?): IRect3d{
			if(isFloat(arguments[0])){
				var fValue: float = arguments[0];

				this.x0 += fValue;
				this.x1 += fValue;
				this.y0 += fValue;
				this.y1 += fValue;
				this.z0 += fValue;
				this.z1 += fValue;
			}
			else{
				var v3fVec: IVec3 = arguments[0];

				this.x0 += v3fVec.x;
				this.x1 += v3fVec.x;

				this.y0 += v3fVec.y;
				this.y1 += v3fVec.y;

				this.z0 += v3fVec.z;
				this.z1 += v3fVec.z;
			}

			return this;
		};
		

		subSelf(fValue: float): IRect3d;
		subSelf(v3fVec: IVec3): IRect3d;
		subSelf(v3fVec?): IRect3d{
			if(isFloat(fValue)){
				var fValue: float = arguments[0];

				this.x0 -= fValue;
				this.x1 -= fValue;
				this.y0 -= fValue;
				this.y1 -= fValue;
				this.z0 -= fValue;
				this.z1 -= fValue;
			}
			else{
				var v3fVec: IVec3 = arguments[0];

				this.x0 -= v3fVec.x;
				this.x1 -= v3fVec.x;

				this.y0 -= v3fVec.y;
				this.y1 -= v3fVec.y;

				this.z0 -= v3fVec.z;
				this.z1 -= v3fVec.z;
			}

			return this;
		};

		multSelf(fValue: float): IRect3d;
		multSelf(v3fVec: IVec3): IRect3d;
		multSelf(v3fVec?): IRect3d{
			if(isFloat(arguments[0])){
				var fValue: float = arguments[0];

				this.x0 *= fValue;
				this.x1 *= fValue;
				this.y0 *= fValue;
				this.y1 *= fValue;
				this.z0 *= fValue;
				this.z1 *= fValue;
			}
			else{
				var v3fVec: IVec3 = arguments[0];

				this.x0 *= v3fVec.x;
				this.x1 *= v3fVec.x;

				this.y0 *= v3fVec.y;
				this.y1 *= v3fVec.y;

				this.z0 *= v3fVec.z;
				this.z1 *= v3fVec.z;
			}

			return this;
		};

		divSelf(fValue: float): IRect3d;
		divSelf(v3fVec: IVec3): IRect3d;
		divSelf(v3fVec?): IRect3d{
			if(isFloat(arguments[0])){
				var fValue: float = arguments[0];

				debug_assert(fValue != 0.0, "divide by zero error");

				var fInvValue: float = 1./fValue;

				this.x0 *= fInvValue;
				this.x1 *= fInvValue;
				this.y0 *= fInvValue;
				this.y1 *= fInvValue;
				this.z0 *= fInvValue;
				this.z1 *= fInvValue;
			}
			else{
				var v3fVec: IVec3 = arguments[0];

				debug_assert(v3fVec.x != 0.0, "divide by zero error");
				debug_assert(v3fVec.y != 0.0, "divide by zero error");
				debug_assert(v3fVec.z != 0.0, "divide by zero error");

				var fInvX: float = 1./v3fVec.x;
				var fInvY: float = 1./v3fVec.y;
				var fInvZ: float = 1./v3fVec.z;

				this.x0 *= fInvX;
				this.x1 *= fInvX;

				this.y0 *= fInvY;
				this.y1 *= fInvY;

				this.z0 *= fInvZ;
				this.z1 *= fInvZ;
			}

			return this;
		};

		offset(v3fOffset: IVec3): IRect3d;
		offset(fOffsetX: float, fOffsetY: float, fOffsetZ: float): IRect3d;
		offset(fOffsetX?, fOffsetY?, fOffsetZ?): IRect3d{
			if(arguments.length === 1){
				var v3fOffset: IVec3 = arguments[0];

				this.x0 += v3fOffset.x;
				this.x1 += v3fOffset.x;

				this.y0 += v3fOffset.y;
				this.y1 += v3fOffset.y;

				this.z0 += v3fOffset.z;
				this.z1 += v3fOffset.z;
			}
			else{
				this.x0 += arguments[0];
				this.x1 += arguments[0];

				this.y0 += arguments[1];
				this.y1 += arguments[1];

				this.z0 += arguments[2];
				this.z1 += arguments[2];
			}

			return this;
		};

		expand(fValue: float): IRect3d;
		expand(v3fVec: IVec3): IRect3d;
		expand(fValueX: float, fValueY: float, fValueZ: float): IRect3d;
		expand(fValueX?, fValueY?, fValueZ?): IRect3d{
			if(arguments.length === 1){
				if(isFloat(arguments[0])){
					var fValue: float = arguments[0];

					this.x0 -= fValue;
					this.x1 += fValue;

					this.y0 -= fValue;
					this.y1 += fValue;

					this.z0 -= fValue;
					this.z1 += fValue;
				}
				else{
					var v3fVec: IVec3 = arguments[0];

					this.x0 -= v3fVec.x;
					this.x1 += v3fVec.x;

					this.y0 -= v3fVec.y;
					this.y1 += v3fVec.y;

					this.z0 -= v3fVec.z;
					this.z1 += v3fVec.z;
				}
			}
			else{
				//arguments.length === 3
				
				this.x0 -= arguments[0];
				this.x1 += arguments[0];

				this.y0 -= arguments[1];
				this.y1 += arguments[1];

				this.z0 -= arguments[2];
				this.z1 += arguments[2];
			}

			return this;
		};

		inline expandX(fValue: float): IRect3d{
			this.x0 -= fValue;
			this.x1 += fValue;

			return this;
		};

		inline expandY(fValue: float): IRect3d{
			this.y0 -= fValue;
			this.y1 += fValue;

			return this;
		};

		inline expandZ(fValue: float): IRect3d{
			this.z0 -= fValue;
			this.z1 += fValue;

			return this;
		};

		resize(v3fSize: IVec3): IRect3d;
		resize(fSizeX: float, fSizeY: float, fSizeZ: float): IRect3d;
		resize(fSizeX?, fSizeY?, fSizeZ?): IRect3d{
			var fSizeX: float, fSizeY: float, fSizeZ: float;

			if(arguments.length === 1){
				var v3fSize: IVec3 = arguments[0];

				fSizeX = v3fSize.x;
				fSizeY = v3fSize.y;
				fSizeZ = v3fSize.z;
			}
			else{
				fSizeX = arguments[0];
				fSizeY = arguments[1];
				fSizeZ = arguments[2];
			}

			this.x1 = (this.x0 + this.x1 + fSizeX)*0.5;
			this.x0 = this.x1 - fSizeX;

			this.y1 = (this.y0 + this.y1 + fSizeY)*0.5;
			this.y0 = this.y1 - fSizeY;

			this.z1 = (this.z0 + this.z1 + fSizeZ)*0.5;
			this.z0 = this.z1 - fSizeZ;

			return this;
		};

		inline resizeX(fSize: float): IRect3d{
			this.x1 = (this.x0 + this.x1 + fSize)*0.5;
			this.x0 = this.x1 - fSize;

			return this;
		};

		inline resizeY(fSize: float): IRect3d{
			this.y1 = (this.y0 + this.y1 + fSize)*0.5;
			this.y0 = this.y1 - fSize;

			return this;
		};

		inline resizeZ(fSize: float): IRect3d{
			this.z1 = (this.z0 + this.z1 + fSize)*0.5;
			this.z0 = this.z1 - fSize;

			return this;
		};
    }
}

#endif