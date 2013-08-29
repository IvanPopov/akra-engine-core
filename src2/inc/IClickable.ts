#ifndef ICLICKABLE_TS
#define ICLICKABLE_TS

#include "IEventProvider.ts"

module akra {
	export interface IClickable extends IEventProvider {
		writeonly onclick: (target: any, x: uint, y: uint) => void;
		writeonly onmousemove: (target: any, x: uint, y: uint) => void;
		writeonly onmousedown: (target: any, x: uint, y: uint) => void;
		writeonly onmouseup: (target: any, x: uint, y: uint) => void;

		signal click(x: uint, y: uint): void;
		signal mousemove(x: uint, y: uint): void;
		signal mousedown(x: uint, y: uint): void;
		signal mouseup(x: uint, y: uint): void;
	}
}

#endif

