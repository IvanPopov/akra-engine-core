// AIClickable interface
// [write description here...]

/// <reference path="AIEventProvider.ts" />
/// <reference path="AIKeyMap.ts" />

interface AIClickable extends AIEventProvider {
	/** writeonly */ onclick: (target: any, x: int, y: int) => void;
	/** writeonly */ onmousemove: (target: any, x: int, y: int) => void;
	/** writeonly */ onmousedown: (target: any, eBtn: AEMouseButton, x: int, y: int) => void;
	/** writeonly */ onmouseup: (target: any, eBtn: AEMouseButton, x: int, y: int) => void;
	/** writeonly */ onmouseover: (target: any, x: int, y: int) => void;
	/** writeonly */ onmouseout: (target: any, x: int, y: int) => void;
	/** writeonly */ onmousewheel: (target: any, x: int, y: int, delta: float) => void;

	/** writeonly */ ondragstart: (target: any, eBtn: AEMouseButton, x: int, y: int) => void;
	/** writeonly */ ondragstop: (target: any, eBtn: AEMouseButton, x: int, y: int) => void;
	/** writeonly */ ondragging: (target: any, eBtn: AEMouseButton, x: int, y: int) => void;

	signal click(x: int, y: int): void;
	signal mousemove(x: int, y: int): void;
	signal mousedown(eBtn: AEMouseButton, x: int, y: int): void;
	signal mouseup(eBtn: AEMouseButton, x: int, y: int): void;
	signal mouseover(x: int, y: int): void;
	signal mouseout(x: int, y: int): void;
	signal mousewheel(x: int, y: int, delta: float): void;

	signal dragstart(eBtn: AEMouseButton, x: int, y: int): void;
	signal dragstop(eBtn: AEMouseButton, x: int, y: int): void;
	signal dragging(eBtn: AEMouseButton, x: int, y: int): void;
}

