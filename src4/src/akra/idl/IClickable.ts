
/// <reference path="IEventProvider.ts" />
/// <reference path="IKeyMap.ts" />

module akra {
	export interface IClickable extends IEventProvider {
		onclick: (target: any, x: int, y: int) => void;
		onmousemove: (target: any, x: int, y: int) => void;
		onmousedown: (target: any, eBtn: EMouseButton, x: int, y: int) => void;
		onmouseup: (target: any, eBtn: EMouseButton, x: int, y: int) => void;
		onmouseover: (target: any, x: int, y: int) => void;
		onmouseout: (target: any, x: int, y: int) => void;
		onmousewheel: (target: any, x: int, y: int, delta: float) => void;

		ondragstart: (target: any, eBtn: EMouseButton, x: int, y: int) => void;
		ondragstop: (target: any, eBtn: EMouseButton, x: int, y: int) => void;
		ondragging: (target: any, eBtn: EMouseButton, x: int, y: int) => void;

		dragstart: ISignal<{ (pTarget: any, eBtn: EMouseButton, x: uint, y: uint): void; }>;
		dragstop: ISignal<{ (pTarget: any, eBtn: EMouseButton, x: uint, y: uint): void; }>;
		dragging: ISignal<{ (pTarget: any, eBtn: EMouseButton, x: uint, y: uint): void; }>;

		click: ISignal<{ (pTarget: any, x: int, y: int): void; }>;
		mousemove: ISignal<{ (pTarget: any, x: int, y: int): void; }>;

		mousedown: ISignal<{ (pTarget: any, eBtn: EMouseButton, x: uint, y: uint): void; }>;
		mouseup: ISignal<{ (pTarget: any, eBtn: EMouseButton, x: uint, y: uint): void; }>;

		mouseover: ISignal<{ (pTarget: any, x: uint, y: uint): void; }>;
		mouseout: ISignal<{ (pTarget: any, x: uint, y: uint): void; }>;
		mousewheel: ISignal<{ (pTarget: any, x: uint, y: uint, fDelta: float): void; }>;
	}
}
