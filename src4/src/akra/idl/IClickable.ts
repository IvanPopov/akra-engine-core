
/// <reference path="IEventProvider.ts" />
/// <reference path="IKeyMap.ts" />

module akra {
	export interface IClickable extends IEventProvider {
		setOnClick?(fnCallbak: (target: any, x: int, y: int) => void): void;
		setOnMouseMove?(fnCallbak: (target: any, x: int, y: int) => void): void;
		setOnMouseDown?(fnCallbak: (target: any, eBtn: EMouseButton, x: int, y: int) => void): void;
		setOnMouseUp?(fnCallbak: (target: any, eBtn: EMouseButton, x: int, y: int) => void): void;
		setOnMouseOver?(fnCallbak: (target: any, x: int, y: int) => void): void;
		setOnMouseOut?(fnCallbak: (target: any, x: int, y: int) => void): void;
		setOnMouseWheel?(fnCallbak: (target: any, x: int, y: int, delta: float) => void): void;

		setOnDragStart?(fnCallbak: (target: any, eBtn: EMouseButton, x: int, y: int) => void): void;
		setOnDragStop?(fnCallbak: (target: any, eBtn: EMouseButton, x: int, y: int) => void): void;
		setOnDragging?(fnCallbak: (target: any, eBtn: EMouseButton, x: int, y: int) => void): void;

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
