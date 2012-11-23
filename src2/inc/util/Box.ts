#ifndef BOX_TS
#define BOX_TS

#include "IBox.ts"

module util.akra {
	export class Box implements IBox {
		left: uint;
		top: uint;
		front: uint;
		rigth: uint;
		bottom: uint;
		back: uint;

		constructor ();
		constructor (iLeft: uint, iTop: uint, iRight: uint, iBottom: uint);
		constructor (iLeft: uint, iTop: uint, iFront: uint, iRight: uint, iBottom: uint, iBack: uint)
		constructor (l: uint = 0, t: uint = 0, ff: uint = 0, r: uint = 1, b: uint = 1, bb: uint = 1) {
			this.left = l;
			this.top = t;
			this.front = ff;

			this.right = r;
			this.bottom = b;
			this.back = bb;

			assert(iRight >= iLeft && iBottom >= iTop && iBack >= iFront);
		}

		contains(pDest: IBox): bool {
			return (pDest.left >= this.left && pDest.top >= this.top && pDest.front >= this.front &&
	    		pDest.right <= this.right && pDest.bottom <= this.bottom && pDest.back <= this.back);
		}
}

#endif