///<reference path="../akra.ts" />

module akra.geometry {
    export class Rect3d implements IRect3d{
    	x0: float;
		y0: float;
		z0: float;
		x1: float;
		y1: float;
		z1: float;

        constructor ();
        constructor (pRect3d: Rect3d);
        constructor (x0: float, y0:float, z0:float, x1:float, y1:float, z1:float);
		constructor (fXSize: float, fYSize: float, fZSize: float);
		constructor (pData: Float32Array);
		
		constructor (x0?, y0?, z0?, x1?, y1?, z1?) {

		}
    }
}