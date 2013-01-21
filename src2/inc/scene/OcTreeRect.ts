#ifndef OCTREERECT_TS
#define OCTREERECT_TS

#include "IOcTreeRect.ts"
#include "IRect3d.ts"
#include "IVec3.ts"
#include "geometry/Rect3d.ts"

#define ocTreeRect() OcTreeRect.stackCeil

module akra.scene {

	/** OcTreeRect class represent simple 3d byte rect */
	export class OcTreeRect implements IOcTreeRect { 
		protected x0: int = 0;
		protected x1: int = 0;
		protected y0: int = 0;
		protected y1: int = 0;
		protected z0: int = 0;
		protected z1: int = 0;
	

		constructor (pRect: OcTreeRect);
		constructor (x0: int, x1: int, y0: int, y1: int, z0: int, z1: int);
		constructor (x0, x1?, y0?, y1?, z0?, z1?) {
			switch (arguments.length) {
		        case 1:
		            this.x0 = (<OcTreeRect>arguments[0]).x0;
		            this.x1 = (<OcTreeRect>arguments[0]).x1;
		            this.y0 = (<OcTreeRect>arguments[0]).y0;
		            this.y1 = (<OcTreeRect>arguments[0]).y1;
		            this.z0 = (<OcTreeRect>arguments[0]).z0;
		            this.z1 = (<OcTreeRect>arguments[0]).z1;
		            break;
		        case 6:
		            this.x0 = arguments[0];
		            this.x1 = arguments[1];
		            this.y0 = arguments[2];
		            this.y1 = arguments[3];
		            this.z0 = arguments[4];
		            this.z1 = arguments[5];
		            break;
		    }
		}

		/**
		 * Convert Rect3d to byte rect
		 */
		convert(pWorldRect: IRect3d, v3fOffset: IVec3, v3fScale: IVec3): void {
		    var convertedRect: IRect3d = new geometry.Rect3d(pWorldRect);
		    // reposition and v3fScale world coordinates to OcTree coordinates
		    convertedRect.addSelf(v3fOffset);
		    convertedRect.multSelf(v3fScale);
		    //alert([convertedRect.iX0,convertedRect.iY0,convertedRect.iZ0,convertedRect.iX1,convertedRect.iY1,convertedRect.iZ1]);
		    // reduce by a tiny amount to handle tiled data
		    convertedRect.x1 = math.max(convertedRect.x1 - 0.01, convertedRect.x0);
		    convertedRect.y1 = math.max(convertedRect.y1 - 0.01, convertedRect.y0);
		    convertedRect.z1 = math.max(convertedRect.z1 - 0.01, convertedRect.z0);

		    // convert to integer values, taking the floor of each real
		    this.x0 = convertedRect.fX0 << 0;
		    this.x1 = convertedRect.fX1 << 0;
		    this.y0 = convertedRect.fY0 << 0;
		    this.y1 = convertedRect.fY1 << 0;
		    this.z0 = convertedRect.fZ0 << 0;
		    this.z1 = convertedRect.fZ1 << 0;
		    // we must be positive
		    this.x0 = math.clamp(this.x0, 0, 1022);
		    this.y0 = math.clamp(this.y0, 0, 1022);
		    this.z0 = math.clamp(this.z0, 0, 1022);

		    // we must be at least one unit large
		    this.x1 = math.clamp(this.x1, this.x0 + 1, 1023);
		    this.y1 = math.clamp(this.y1, this.y0 + 1, 1023);
		    this.z1 = math.clamp(this.z1, this.z0 + 1, 1023);
		}

		/**
		 * Set
		 */
		set(iX0: int, iX1: int, iY0: int, iY1: int, iZ0: int, iZ: int1): void {
		    this.iX0 = iX0;
		    this.iX1 = iX1;
		    this.iY0 = iY0;
		    this.iY1 = iY1;
		    this.iZ0 = iZ0;
		    this.iZ1 = iZ1;
		}

		ALLOCATE_STORAGE(OcTreeRect, 8);
	}
}

#endif
