#ifndef BOX_TS
#define BOX_TS

#include "IBox.ts"
// #define box(...) Box.stackCeil.setPosition(__VA_ARGS__)

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
					this.left 	= 0;
					this.top 	= 0;
					this.front 	= 0;

					this.right 	= 1;
					this.bottom = 1;
					this.back 	= 1;
					break;

				case 3:
					this.left 	= arguments[0];
					this.top 	= arguments[1];
					this.front 	= arguments[2];

					this.right 	= arguments[0] + 1;
					this.bottom = arguments[1] + 1;
					this.back 	= arguments[2] + 1;

				case 6:
					this.left 	= arguments[0];
					this.top 	= arguments[1];
					this.front 	= arguments[2];

					this.right 	= arguments[3];
					this.bottom = arguments[4];
					this.back 	= arguments[5];
					break;
				case 4:
					this.left 	= arguments[0];
					this.top 	= arguments[1];
					this.right 	= arguments[2];
					this.bottom = arguments[3];

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

		ALLOCATE_STORAGE(Box, 20)
	}

	export function box(): IBox;
	export function box(pBox: IBox): IBox;
	export function box(iLeft: uint, iTop: uint, iFront: uint): IBox;
	export function box(iLeft: uint, iTop: uint, iRight: uint, iBottom: uint): IBox;
	export function box(iLeft: uint, iTop: uint, iFront: uint, iRight: uint, iBottom: uint, iBack: uint): IBox;
	export function box(): IBox {
		var pBox: IBox = Box.stack[Box.stackPosition ++];

        if(Box.stackPosition === Box.stackSize){
            Box.stackPosition = 0;
        }

		switch(arguments.length){
			case 1:
				pBox.setPosition(arguments[0].left,
								 arguments[0].top,
								 arguments[0].width,
								 arguments[0].height,
								 arguments[0].front,
								 arguments[0].depth);
				break;
			case 0:
				pBox.setPosition (0, 0, 1, 1, 0, 1);
				break;
			case 3:
				pBox.setPosition(arguments[0], arguments[1], 1, 1, arguments[2], 1);
				break;
			case 6:
				pBox.setPosition(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
				break;
			case 4:
				pBox.setPosition(arguments[0], arguments[1], arguments[2] - arguments[0], arguments[3] - arguments[1], 0, 1);
				break;
			default:
				ERROR("Inavlid number of arguments");
		}

		return pBox;
	}
}

#endif