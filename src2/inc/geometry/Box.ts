#ifndef BOX_TS
#define BOX_TS

#include "IBox.ts"

module akra.geometry {
	export class Box implements IBox {
		left: uint = 0;
		top: uint = 0;
		front: uint = 0;
		right: uint = 0;
		bottom: uint = 0;
		back: uint = 0;

		inline get width(): uint {
			return this.right - this.left;
		}

		inline get height(): uint {
			return this.bottom - this.top;
		}

		inline get depth(): uint {
			return this.back - this.front;
		}

		constructor ();
		constructor (pExtents: IBox);
		constructor (iLeft: uint, iTop: uint, iRight: uint, iBottom: uint);
		constructor (iLeft: uint, iTop: uint, iFront: uint, iRight: uint, iBottom: uint, iBack: uint);
		constructor (l: uint = 0, t: uint = 0, ff: uint = 0, r: uint = 1, b: uint = 1, bb: uint = 1) {
			switch (arguments.length) {
				case 1:
					this.left 	= arguments[0].left;
					this.top 	= arguments[0].top;
					this.front 	= arguments[0].front;

					this.right 	= arguments[0].right;
					this.bottom = arguments[0].bottom;
					this.back 	= arguments[0].back;
					break;
				case 0:
				case 3:
				case 6:
					this.left 	= l;
					this.top 	= t;
					this.front 	= ff;

					this.right 	= r;
					this.bottom = b;
					this.back 	= bb;
					break;
				case 4:
					this.left 	= l;
					this.top 	= t;
					this.right 	= ff;
					this.bottom = r;

					this.back 	= 1;
					this.front 	= 0;
					break;
				case 5:
					ERROR("invalid number of arguments");
			}

			ASSERT(this.right >= this.left && this.bottom >= this.top && this.back >= this.front);
		}

		contains(pDest: IBox): bool {
			return (pDest.left >= this.left && pDest.top >= this.top && pDest.front >= this.front &&
	    		pDest.right <= this.right && pDest.bottom <= this.bottom && pDest.back <= this.back);
		}

		setPosition(iLeft: uint, iTop: uint, iWidth: uint, iHeight: uint, iFront?: uint = 0, iDepth?: uint = 1): void {
			this.left   = iLeft;
			this.top    = iTop;
			this.right  = iLeft + iWidth;
			this.bottom = iTop + iHeight;
			this.front 	= iFront;
			this.back 	= iFront + iDepth;
		}

		isEqual(pDest: IBox): bool {
			return (pDest.left == this.left && pDest.top == this.top && pDest.front == this.front &&
	    		pDest.right == this.right && pDest.bottom == this.bottom && pDest.back == this.back);
		}

		toString(): string {
			return "---------------------------\n" + 
				   "left: " + this.left + ", right: " + this.right + "\n" +
				   "top: " + this.top + ", bottom: " + this.bottom + "\n" +	
				   "front: " + this.front + ", back: " + this.back + "\n" +
				   "---------------------------";
		}
	}
}

#endif