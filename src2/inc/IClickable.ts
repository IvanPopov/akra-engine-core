#ifndef ICLICKABLE_TS
#define ICLICKABLE_TS

#include "IEventProvider.ts"

module akra {
	export interface IClickable extends IEventProvider {
		writeonly onclick: (target: any, x: int, y: int) => void;
		writeonly onmousemove: (target: any, x: int, y: int) => void;
		writeonly onmousedown: (target: any, eBtn: EMouseButton, x: int, y: int) => void;
		writeonly onmouseup: (target: any, eBtn: EMouseButton, x: int, y: int) => void;
		writeonly onmouseover: (target: any, x: int, y: int) => void;
		writeonly onmouseout: (target: any, x: int, y: int) => void;
		writeonly onmousewheel: (target: any, x: int, y: int, delta: float) => void;

		writeonly ondragstart: (target: any, eBtn: EMouseButton, x: int, y: int) => void;
		writeonly ondragstop: (target: any, eBtn: EMouseButton, x: int, y: int) => void;
		writeonly ondragging: (target: any, eBtn: EMouseButton, x: int, y: int) => void;

		signal click(x: int, y: int): void;
		signal mousemove(x: int, y: int): void;
		signal mousedown(eBtn: EMouseButton, x: int, y: int): void;
		signal mouseup(eBtn: EMouseButton, x: int, y: int): void;
		signal mouseover(x: int, y: int): void;
		signal mouseout(x: int, y: int): void;
		signal mousewheel(x: int, y: int, delta: float): void;

		signal dragstart(eBtn: EMouseButton, x: int, y: int): void;
		signal dragstop(eBtn: EMouseButton, x: int, y: int): void;
		signal dragging(eBtn: EMouseButton, x: int, y: int): void;
	}
}

#endif

